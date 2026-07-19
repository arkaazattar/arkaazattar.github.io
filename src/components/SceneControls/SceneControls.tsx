import { useState } from 'react'
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
  const dateLabel = showMoonLabel ? moonPhase.label : formatSceneDate(dayOffset)
  const timeLabel = formatSceneTime(timeMinutes)

  const cycleSeason = () => {
    const currentIndex = seasonOptions.indexOf(season)
    const nextSeason = seasonOptions[(currentIndex + 1) % seasonOptions.length]

    onSeasonChange(nextSeason)
  }

  const cycleWeather = () => {
    const currentIndex = weatherOptions.indexOf(weather)
    const nextWeather = weatherOptions[(currentIndex + 1) % weatherOptions.length]

    onWeatherChange(nextWeather)
  }

  return (
    <form className="scene-controls" aria-label="Scene controls">
      <label className="control-field">
        <span className="time-slider-text">
          <button
            type="button"
            className="scene-control-text-button"
            disabled={mode === 'live'}
            onClick={() => onModeChange('live')}
          >
            live
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
            onClick={() => onDayOffsetChange(dayOffset - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="date-toggle-button"
            onClick={() => setShowMoonLabel((current) => !current)}
          >
            {dateLabel}
          </button>
          <button
            type="button"
            className="date-nav-button"
            aria-label="Next day"
            onClick={() => onDayOffsetChange(dayOffset + 1)}
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
          onChange={(event) => onTimeChange(Number(event.target.value))}
          step={5}
          type="range"
          value={timeMinutes}
        />
      </label>
    </form>
  )
}
