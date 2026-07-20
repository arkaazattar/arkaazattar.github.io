import { useState, useEffect } from 'react'
import {
  formatSceneDate,
  formatSceneTime,
  type MoonPhase,
  type SceneMode,
  type SceneSeason,
  type SceneWeather,
} from '../../data/scene'
import './SceneControls.css'

type SceneControlsProps = {
  mode: SceneMode
  timeMinutes: number
  dayOffset: number
  weather: SceneWeather
  season: SceneSeason
  moonPhase: MoonPhase
  onModeChange: (mode: SceneMode) => void
  onTimeChange: (timeMinutes: number) => void
  onDayOffsetChange: (dayOffset: number) => void
  onWeatherChange: (weather: SceneWeather) => void
  onSeasonChange: (season: SceneSeason) => void
}

const weatherOptions: SceneWeather[] = ['clear', 'rain', 'snow', 'fog', 'thunder']
const seasonOptions: SceneSeason[] = ['spring', 'summer', 'fall', 'winter']

const getCurrentMinutes = (offset: number, date = new Date()) => {
  const now = new Date(date)
  now.setDate(now.getDate() + offset)
  return now.getHours() * 60 + now.getMinutes()
}

export default function SceneControls({
  mode,
  timeMinutes,
  dayOffset,
  weather,
  season,
  moonPhase,
  onModeChange,
  onTimeChange,
  onDayOffsetChange,
  onWeatherChange,
  onSeasonChange,
}: SceneControlsProps) {
  const [showMoonLabel, setShowMoonLabel] = useState(false)
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    if (mode !== 'live') {
      return
    }

    const id = setInterval(() => setCurrentDate(new Date()), 15_000)
    return () => clearInterval(id)
  }, [mode])

  const dateLabel = showMoonLabel ? moonPhase.label : formatSceneDate(dayOffset)
  const displayMinutes = mode === 'live' ? getCurrentMinutes(dayOffset, currentDate) : timeMinutes
  const timeLabel = formatSceneTime(displayMinutes)

  // Reset key scene state to live defaults by asking parent to switch to live.
  // The parent (App) will set the authoritative time/dayOffset when switching to live.
  const resetToLive = () => {
    onModeChange('live')
  }

  // Helper to perform a user-driven change. If we're currently live, first switch
  // to manual mode then apply the change on next tick so the parent sees the mode
  // transition before the value update.
  const applyUserChange = (fn: () => void) => {
    if (mode === 'live') {
      onModeChange('manual')
      window.setTimeout(fn, 0)
    } else {
      fn()
    }
  }

  const handleTimeSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = Number(event.target.value)
    applyUserChange(() => onTimeChange(minutes))
  }

  const cycleSeason = () => {
    const currentIndex = seasonOptions.indexOf(season)
    const nextSeason = seasonOptions[(currentIndex + 1) % seasonOptions.length]
    applyUserChange(() => onSeasonChange(nextSeason))
  }

  const cycleWeather = () => {
    const currentIndex = weatherOptions.indexOf(weather)
    const nextWeather = weatherOptions[(currentIndex + 1) % weatherOptions.length]
    applyUserChange(() => onWeatherChange(nextWeather))
  }

  return (
    <form className="scene-controls" aria-label="Scene controls">
      <label className="control-field">
        <span className="time-slider-text">
          <button
            type="button"
            className={`scene-control-text-button live-button ${mode === 'live' ? 'is-live' : ''}`}
            disabled={mode === 'live'}
            onClick={() => {
              if (mode !== 'live') resetToLive()
            }}
          >
            {mode === 'live' ? 'live' : 'manual'}
          </button>
          <span className="scene-control-separator" aria-hidden="true">
            •
          </span>
          <button
            type="button"
            className="scene-control-text-button"
            onClick={cycleSeason}
          >
            {season}
          </button>
          <span className="scene-control-separator" aria-hidden="true">
            •
          </span>
          <button
            type="button"
            className="scene-control-text-button"
            onClick={cycleWeather}
          >
            {weather}
          </button>
          <span className="scene-control-separator" aria-hidden="true">
            •
          </span>
          <button
            type="button"
            className="date-nav-button"
            aria-label="Previous day"
            onClick={() => applyUserChange(() => onDayOffsetChange(dayOffset - 1))}
          >
            ←
          </button>
          <button
            type="button"
            className="date-toggle-button"
            onClick={() => applyUserChange(() => setShowMoonLabel((current) => !current))}
          >
            {dateLabel}
          </button>
          <button
            type="button"
            className="date-nav-button"
            aria-label="Next day"
            onClick={() => applyUserChange(() => onDayOffsetChange(dayOffset + 1))}
          >
            →
          </button>
          <span className="scene-control-separator" aria-hidden="true">
            •
          </span>
          <span className="time-display">{timeLabel}</span>
        </span>
        
        <input
          className="time-slider"
          max={1439}
          min={0}
          onChange={handleTimeSliderChange}
          step={5}
          type="range"
          value={timeMinutes}
        />
      </label>
    </form>
  )
}
