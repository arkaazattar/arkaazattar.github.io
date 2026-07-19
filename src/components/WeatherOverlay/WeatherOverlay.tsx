import type { CSSProperties } from 'react'
import type { SceneWeather } from '../../data/scene'
import { Rain } from 'react-rainfall'
import Snowfall from 'react-snowfall'
import './WeatherOverlay.css'

type WeatherOverlayProps = {
  weather: SceneWeather
}

const rainAngleDegrees = 12
const rainSpeedSeconds = 1

export default function WeatherOverlay({ weather }: WeatherOverlayProps) {
  if (weather === 'clear') return null

  if (weather === 'rain' || weather === 'thunder') {
    const rainStyle = {
      '--rain-angle': `${rainAngleDegrees}deg`,
      '--rain-speed': `${rainSpeedSeconds}s`,
    } as CSSProperties

    return (
      <div
        className={`weather-overlay weather-overlay-${weather}`}
        aria-hidden="true"
        style={rainStyle}
      >
        <div className="weather-rainfall-plane">
          <Rain
            dropletColor="rgb(96,126,158)"
            dropletOpacity={weather === 'thunder' ? 0.5 : 0.42}
            numDrops={weather === 'thunder' ? 760 : 620}
            showImpact={false}
          />
        </div>
        {weather === 'thunder' && <div className="weather-lightning" />}
      </div>
    )
  }

  if (weather === 'snow') {
    return (
      <div
        className="weather-overlay weather-overlay-snow"
        aria-hidden="true"
      >
        <div className="weather-rainfall-plane">
          <Snowfall
            snowflakeCount={500}
            speed={[0.8, 4.0]}
            radius={[0.2, 3]}
            opacity={[0.42, 0.42]}
          />
        </div>
      </div>
    )
  }

  return <div className={`weather-overlay weather-overlay-${weather}`} aria-hidden="true" />
}
