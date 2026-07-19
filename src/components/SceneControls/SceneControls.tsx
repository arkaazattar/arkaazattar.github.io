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
  const isManual = mode === 'manual'
  const canScrubTime = mode !== 'live'

  return (
    <form className="scene-controls" aria-label="Scene controls">
      <fieldset className="control-group">
        <legend>Scene</legend>
        <label>
          <input
            checked={mode === 'live'}
            name="scene-mode"
            onChange={() => onModeChange('live')}
            type="radio"
          />
          Live
        </label>
        <label>
          <input
            checked={mode === 'today'}
            name="scene-mode"
            onChange={() => onModeChange('today')}
            type="radio"
          />
          Today
        </label>
        <label>
          <input
            checked={isManual}
            name="scene-mode"
            onChange={() => onModeChange('manual')}
            type="radio"
          />
          Manual
        </label>
      </fieldset>

      <label className="control-field">
        <span>Time {formatSceneTime(timeMinutes)}</span>
        <input
          disabled={!canScrubTime}
          max={1439}
          min={0}
          onChange={(event) => onTimeChange(Number(event.target.value))}
          step={5}
          type="range"
          value={timeMinutes}
        />
      </label>

      <label className="control-field">
        <span>
          Date {formatSceneDate(dayOffset)} ({moonPhase.label})
        </span>
        <input
          max={15}
          min={-15}
          onChange={(event) => onDayOffsetChange(Number(event.target.value))}
          step={1}
          type="range"
          value={dayOffset}
        />
      </label>

      <label className="control-field">
        <span>Weather {mode === 'today' ? '(today)' : ''}</span>
        <select
          disabled={!isManual}
          onChange={(event) => onWeatherChange(event.target.value as SceneWeather)}
          value={weather}
        >
          {weatherOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="control-field">
        <span>Season {mode === 'today' ? '(today)' : ''}</span>
        <select
          disabled={!isManual}
          onChange={(event) => onSeasonChange(event.target.value as SceneSeason)}
          value={season}
        >
          {seasonOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </form>
  )
}
