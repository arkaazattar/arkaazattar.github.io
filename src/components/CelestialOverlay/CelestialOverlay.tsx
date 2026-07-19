import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { MoonPhase, SolarTimes } from '../../data/scene'
import './CelestialOverlay.css'

type CelestialOverlayProps = {
  moonPhase: MoonPhase
  solarTimes: SolarTimes
  timeMinutes: number
}

type CelestialBody = {
  alt: string
  imageSrc: string
  position: CelestialPosition
  progress: number
  scale: number
  variant: 'sun' | 'moon'
}

type CelestialPosition = {
  arcHeight: number
  left: number
  top: number
}

const celestialPathPoints: CelestialPosition[] = [
  { arcHeight: 0, left: 8, top: 61 },
  { arcHeight: 0.62, left: 29, top: 34 },
  { arcHeight: 1, left: 50, top: 18 },
  { arcHeight: 0.62, left: 71, top: 34 },
  { arcHeight: 0, left: 92, top: 61 },
]

const celestialMaxProgressStep = 0.28
const waterlineTop = 76
const celestialReflectionCompression = 0.34

export default function CelestialOverlay({
  moonPhase,
  solarTimes,
  timeMinutes,
}: CelestialOverlayProps) {
  const targetBody = useMemo(
    () => getCelestialBody(moonPhase, solarTimes, timeMinutes),
    [moonPhase, solarTimes, timeMinutes],
  )
  const [displayBody, setDisplayBody] = useState<CelestialBody | null>(targetBody)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDisplayBody((currentBody) => {
        if (!targetBody) return null
        if (!currentBody) return targetBody
        if (
          currentBody.variant !== targetBody.variant ||
          currentBody.imageSrc !== targetBody.imageSrc
        ) {
          return targetBody
        }
        const progressDelta = targetBody.progress - currentBody.progress
        if (Math.abs(progressDelta) < 0.001) return targetBody

        const nextProgress =
          Math.abs(progressDelta) <= celestialMaxProgressStep
            ? targetBody.progress
            : currentBody.progress + Math.sign(progressDelta) * celestialMaxProgressStep

        return {
          ...targetBody,
          position: getCelestialPosition(nextProgress),
          progress: nextProgress,
        }
      })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [displayBody, targetBody])

  const shouldRenderTargetBody =
    targetBody &&
    (!displayBody ||
      displayBody.variant !== targetBody.variant ||
      displayBody.imageSrc !== targetBody.imageSrc)
  const celestialBody = targetBody ? (shouldRenderTargetBody ? targetBody : displayBody) : null

  if (!celestialBody) return null

  const style = {
    '--celestial-left': `${celestialBody.position.left}%`,
    '--celestial-top': `${celestialBody.position.top}%`,
    '--celestial-opacity':
      celestialBody.variant === 'sun' ? 0.94 : 0.8 + celestialBody.position.arcHeight * 0.16,
    '--celestial-scale': celestialBody.scale,
  } as CSSProperties
  const reflectionStyle = {
    '--celestial-left': `${celestialBody.position.left}%`,
    '--celestial-top': `${getCelestialReflectionTop(celestialBody.position.top)}%`,
    '--celestial-opacity':
      celestialBody.variant === 'sun' ? 0.16 : 0.24 + celestialBody.position.arcHeight * 0.06,
    '--celestial-scale': celestialBody.scale,
  } as CSSProperties
  const celestialKey = `${celestialBody.variant}-${celestialBody.imageSrc}-${getCelestialPathSegment(
    celestialBody.progress,
  )}`

  return (
    <div className="celestial-overlay" aria-hidden="true">
      <img
        key={celestialKey}
        className={`celestial-image celestial-image-${celestialBody.variant}`}
        src={celestialBody.imageSrc}
        alt={celestialBody.alt}
        draggable="false"
        style={style}
      />
      <div className="celestial-reflection-layer">
        <img
          key={`${celestialKey}-reflection`}
          className={`celestial-reflection celestial-reflection-${celestialBody.variant}`}
          src={celestialBody.imageSrc}
          alt=""
          draggable="false"
          style={reflectionStyle}
        />
      </div>
    </div>
  )
}

function getCelestialBody(
  moonPhase: MoonPhase,
  { sunriseMinutes, sunsetMinutes }: SolarTimes,
  timeMinutes: number,
): CelestialBody | null {
  if (timeMinutes >= sunriseMinutes && timeMinutes <= sunsetMinutes) {
    const progress = getProgress(timeMinutes, sunriseMinutes, sunsetMinutes)

    return {
      alt: '',
      imageSrc: '/sun_image.png',
      position: getCelestialPosition(progress),
      progress,
      scale: 1.04,
      variant: 'sun',
    }
  }

  if (!moonPhase.imageSrc) return null

  const progress = getNightProgress(timeMinutes, sunriseMinutes, sunsetMinutes)

  return {
    alt: '',
    imageSrc: moonPhase.imageSrc,
    position: getCelestialPosition(progress),
    progress,
    scale: getMoonScale(moonPhase.index),
    variant: 'moon',
  }
}

function getProgress(value: number, start: number, end: number) {
  return Math.min(Math.max((value - start) / Math.max(end - start, 1), 0), 1)
}

function getNightProgress(timeMinutes: number, sunriseMinutes: number, sunsetMinutes: number) {
  const nightLength = 1440 - sunsetMinutes + sunriseMinutes
  const elapsed =
    timeMinutes >= sunsetMinutes ? timeMinutes - sunsetMinutes : timeMinutes + 1440 - sunsetMinutes

  return getProgress(elapsed, 0, nightLength)
}

function getCelestialPosition(progress: number): CelestialPosition {
  const segmentProgress = progress * (celestialPathPoints.length - 1)
  const startIndex = Math.min(Math.floor(segmentProgress), celestialPathPoints.length - 2)
  const endIndex = startIndex + 1
  const segmentAmount = smoothStep(segmentProgress - startIndex)
  const startPoint = celestialPathPoints[startIndex]
  const endPoint = celestialPathPoints[endIndex]

  return {
    arcHeight: interpolate(startPoint.arcHeight, endPoint.arcHeight, segmentAmount),
    left: interpolate(startPoint.left, endPoint.left, segmentAmount),
    top: interpolate(startPoint.top, endPoint.top, segmentAmount),
  }
}

function getCelestialPathSegment(progress: number) {
  const segmentProgress = progress * (celestialPathPoints.length - 1)

  return Math.min(Math.floor(segmentProgress), celestialPathPoints.length - 2)
}

function interpolate(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function getCelestialReflectionTop(top: number) {
  return waterlineTop + (waterlineTop - top) * celestialReflectionCompression
}

function smoothStep(amount: number) {
  return amount * amount * (3 - 2 * amount)
}

function getMoonScale(phaseIndex: number) {
  if (phaseIndex === 5) return 1.04
  if (phaseIndex === 4 || phaseIndex === 6) return 0.98
  if (phaseIndex === 3 || phaseIndex === 7) return 0.92
  return 0.86
}
