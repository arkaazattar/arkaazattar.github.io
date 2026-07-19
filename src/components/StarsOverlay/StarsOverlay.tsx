import type { CSSProperties } from 'react'
import type { SceneWeather, SolarTimes } from '../../data/scene'
import './StarsOverlay.css'

type StarsOverlayProps = {
  solarTimes: SolarTimes
  timeMinutes: number
  weather: SceneWeather
}

const twilightFadeMinutes = 90

export default function StarsOverlay({
  solarTimes,
  timeMinutes,
  weather,
}: StarsOverlayProps) {
  const opacity = weather === 'clear' ? getNightSkyOpacity(timeMinutes, solarTimes) : 0

  if (opacity <= 0) return null

  const style = {
    '--stars-opacity': opacity,
  } as CSSProperties

  return (
    <>
      <div className="stars-overlay" aria-hidden="true" style={style} />
      <div className="stars-reflection" aria-hidden="true" style={style} />
    </>
  )
}

function getNightSkyOpacity(
  timeMinutes: number,
  { sunriseMinutes, sunsetMinutes }: SolarTimes,
) {
  if (timeMinutes >= sunsetMinutes) {
    return clamp((timeMinutes - sunsetMinutes) / twilightFadeMinutes)
  }

  if (timeMinutes <= sunriseMinutes) {
    return clamp((sunriseMinutes - timeMinutes) / twilightFadeMinutes)
  }

  return 0
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}
