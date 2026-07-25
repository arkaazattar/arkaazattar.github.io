import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ASSET_PATHS } from '../../data/assets'
import type { SceneSeason, SceneWeather, SolarTimes } from '../../data/scene'
import { Rain } from 'react-rainfall'
import Snowfall from 'react-snowfall'
import './WeatherOverlay.css'

type WeatherOverlayProps = {
  muted: boolean
  season: SceneSeason
  solarTimes: SolarTimes
  timeMinutes: number
  weather: SceneWeather
}

type AudioTrack = {
  src: string
  volume: number
}

const rainAngleDegrees = 12
const rainSpeedSeconds = 1
const thunderCycleMs = 7_500
const thunderFlashProgress = 0.71
const thunderFlashDelayMs = thunderCycleMs * thunderFlashProgress

function AudioLoop({ muted, src, volume }: AudioTrack & { muted: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    if (muted) {
      audio.pause()
      return
    }

    void audio.play().catch(() => {
      // Playback remains paused if the browser has not received a user gesture.
    })

    return () => audio.pause()
  }, [muted, volume])

  return <audio ref={audioRef} src={src} loop preload="auto" />
}

function ThunderSound({ muted }: { muted: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const cycleStartedAtRef = useRef<number | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const now = performance.now()
    if (cycleStartedAtRef.current === null) {
      cycleStartedAtRef.current = now
    }

    audio.volume = 0.38
    if (muted) {
      audio.pause()
      audio.currentTime = 0
      return
    }

    let intervalId: number | undefined
    const elapsedInCycle =
      (now - cycleStartedAtRef.current) % thunderCycleMs
    const delayUntilFlash =
      (thunderFlashDelayMs - elapsedInCycle + thunderCycleMs) % thunderCycleMs
    const playThunder = () => {
      audio.currentTime = 0
      void audio.play().catch(() => {
        // Playback remains paused if the browser has not received a user gesture.
      })
    }

    const timeoutId = window.setTimeout(() => {
      playThunder()
      intervalId = window.setInterval(playThunder, thunderCycleMs)
    }, delayUntilFlash)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
      audio.pause()
    }
  }, [muted])

  return <audio ref={audioRef} src={ASSET_PATHS.audio.thunder} preload="auto" />
}

function getAudioTracks(
  weather: SceneWeather,
  season: SceneSeason,
  isNight: boolean,
): AudioTrack[] {
  const cityAmbience = { src: ASSET_PATHS.audio.cityAmbience, volume: 0.12 }

  if (weather === 'thunder') {
    return [cityAmbience, { src: ASSET_PATHS.audio.rain, volume: 0.12 }]
  }

  if (weather === 'rain') {
    return [cityAmbience, { src: ASSET_PATHS.audio.rain, volume: 0.12 }]
  }

  if (weather === 'snow' || season === 'winter') {
    return [cityAmbience, { src: ASSET_PATHS.audio.winterWind, volume: 0.28 }]
  }

  if (season === 'fall') {
    return [cityAmbience, { src: ASSET_PATHS.audio.dryLeaves, volume: 0.26 }]
  }

  if (season === 'summer') {
    return [
      cityAmbience,
      {
        src: isNight ? ASSET_PATHS.audio.summerNight : ASSET_PATHS.audio.summerDay,
        volume: 0.24,
      },
    ]
  }

  if (season === 'spring' && !isNight) {
    return [cityAmbience, { src: ASSET_PATHS.audio.springDay, volume: 0.24 }]
  }

  return [cityAmbience]
}

function getWeatherVisual(weather: SceneWeather): ReactNode {
  if (weather === 'clear') return null

  if (weather === 'rain' || weather === 'thunder') {
    const rainStyle = {
      '--rain-angle': `${rainAngleDegrees}deg`,
      '--rain-speed': `${rainSpeedSeconds}s`,
      '--thunder-cycle': `${thunderCycleMs}ms`,
    } as CSSProperties

    return (
      <div
        className={`weather-overlay weather-overlay-${weather}`}
        aria-hidden="true"
        style={rainStyle}
      >
        <div className="weather-rainfall-plane">
          <Rain
            dropletColor="rgb(61,236,255)"
            dropletOpacity={weather === 'thunder' ? 0.58 : 0.48}
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
      <div className="weather-overlay weather-overlay-snow" aria-hidden="true">
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

export default function WeatherOverlay({
  muted,
  season,
  solarTimes,
  timeMinutes,
  weather,
}: WeatherOverlayProps) {
  const isNight =
    timeMinutes < solarTimes.sunriseMinutes || timeMinutes >= solarTimes.sunsetMinutes
  const audioTracks = getAudioTracks(weather, season, isNight)

  return (
    <>
      {audioTracks.map((track) => (
        <AudioLoop key={track.src} {...track} muted={muted} />
      ))}
      {weather === 'thunder' && <ThunderSound muted={muted} />}
      {getWeatherVisual(weather)}
    </>
  )
}
