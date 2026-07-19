import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import {
  buildingRegions,
  SKYLINE_IMAGE,
  WINTER_SKYLINE_IMAGE,
  type BuildingRegion,
} from '../../data/buildings'
import type { SceneSeason, SceneWeather } from '../../data/scene'
import './SkylineScene.css'

type WaterRipple = {
  startedAt: number
  x: number
  y: number
}

type SkylineSceneProps = {
  celestialOverlay?: ReactNode
  onBuildingSelect?: (building: BuildingRegion) => void
  season: SceneSeason
  skyOverlay?: ReactNode
  weather: SceneWeather
}

const waterlineProgress = 0.76
const waterMaskAlphaThreshold = 8
const waterMaskSrc = '/water.svg'
const rippleLifetimeMs = 1150
const rippleSpawnIntervalMs = 80
const rippleSpawnDistance = 0.035
const ripplePixelStep = 4
const rainRippleIntervalMs = 25

export default function SkylineScene({
  celestialOverlay,
  onBuildingSelect,
  season,
  skyOverlay,
  weather,
}: SkylineSceneProps) {
  const skylineImage = season === 'winter' ? WINTER_SKYLINE_IMAGE : SKYLINE_IMAGE
  const shouldRenderRipples = season !== 'winter'
  const frameRef = useRef<HTMLDivElement>(null)
  const rippleCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const parallaxRef = useRef({ x: 0, y: 0, originX: 50, originY: 50 })
  const rippleAnimationRef = useRef(0)
  const ripplesRef = useRef<WaterRipple[]>([])
  const lastRippleRef = useRef({ time: 0, x: 0, y: 0 })
  const rainRippleAnimationRef = useRef(0)
  const rainRippleRef = useRef({ seed: 739391, time: 0 })
  const waterMaskDataRef = useRef<ImageData | null>(null)

  const setParallax = useCallback((x: number, y: number, originX = 50, originY = 50) => {
    parallaxRef.current = { x, y, originX, originY }

    if (animationRef.current) return

    animationRef.current = window.requestAnimationFrame(() => {
      const frame = frameRef.current

      if (frame) {
        frame.style.setProperty('--parallax-x', `${parallaxRef.current.x}px`)
        frame.style.setProperty('--parallax-y', `${parallaxRef.current.y}px`)
        frame.style.setProperty('--parallax-origin-x', `${parallaxRef.current.originX}%`)
        frame.style.setProperty('--parallax-origin-y', `${parallaxRef.current.originY}%`)
      }

      animationRef.current = 0
    })
  }, [])

  function drawRipples(now: number) {
    const canvas = rippleCanvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      rippleAnimationRef.current = 0
      return
    }

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const pixelRatio = window.devicePixelRatio || 1
    const scaledWidth = Math.floor(width * pixelRatio)
    const scaledHeight = Math.floor(height * pixelRatio)

    if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
      canvas.width = scaledWidth
      canvas.height = scaledHeight
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    context.clearRect(0, 0, width, height)

    ripplesRef.current = ripplesRef.current.filter((ripple) => {
      const progress = (now - ripple.startedAt) / rippleLifetimeMs

      if (progress >= 1) return false

      const x = ripple.x * width
      const y = ripple.y * height
      const fade = (1 - progress) * (1 - progress)
      const radius = 5 + progress * 58

      for (let ring = 0; ring < 3; ring += 1) {
        const ringProgress = progress + ring * 0.08
        const ringFade = Math.max(1 - ringProgress, 0) * fade
        const radiusX = radius * (1.35 + ring * 0.18)
        const radiusY = radius * (0.13 + ring * 0.03)
        const yOffset = ring * 3
        const alpha = 0.18 * ringFade

        drawPixelRipple(
          context,
          x,
          y + yOffset,
          radiusX,
          radiusY,
          alpha,
          ring,
        )
      }

      return true
    })

    if (ripplesRef.current.length > 0) {
      rippleAnimationRef.current = window.requestAnimationFrame(drawRipples)
    } else {
      rippleAnimationRef.current = 0
    }
  }

  function drawPixelRipple(
    context: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    alpha: number,
    ring: number,
  ) {
    if (alpha <= 0) return

    const step = ripplePixelStep
    const start = Math.floor((centerX - radiusX) / step) * step
    const end = Math.ceil((centerX + radiusX) / step) * step

    context.fillStyle = `rgba(218, 242, 255, ${alpha})`

    for (let x = start; x <= end; x += step) {
      const normalizedX = (x - centerX) / radiusX
      const curve = 1 - normalizedX * normalizedX

      if (curve <= 0) continue

      const y = Math.round((centerY + Math.sqrt(curve) * radiusY) / step) * step
      const mirrorY = Math.round((centerY - Math.sqrt(curve) * radiusY) / step) * step
      const edgeBias = Math.abs(normalizedX)
      const skipInterval = ring + 3
      const pixelIndex = Math.round((x - start) / step)

      if (pixelIndex % skipInterval === 1 && edgeBias < 0.82) continue

      const width = edgeBias > 0.7 ? step * 2 : step * 3
      const height = step

      context.fillRect(Math.round(x), y, width, height)

      if (ring === 0 || pixelIndex % 2 === 0) {
        context.fillRect(Math.round(x), mirrorY, width, height)
      }
    }
  }

  function addWaterRipple(x: number, y: number, now: number, shouldThrottle = true) {
    if (!shouldRenderRipples) return
    if (!isWaterPoint(x, y)) return

    const previous = lastRippleRef.current
    const distance = Math.hypot(x - previous.x, y - previous.y)

    if (
      shouldThrottle &&
      now - previous.time < rippleSpawnIntervalMs &&
      distance < rippleSpawnDistance
    ) {
      return
    }

    if (shouldThrottle) {
      lastRippleRef.current = { time: now, x, y }
    }

    ripplesRef.current = [...ripplesRef.current.slice(-28), { startedAt: now, x, y }]

    if (!rippleAnimationRef.current) {
      rippleAnimationRef.current = window.requestAnimationFrame(drawRipples)
    }
  }

  function nextRainRandom() {
    const nextSeed = (rainRippleRef.current.seed * 1664525 + 1013904223) % 4294967296

    rainRippleRef.current.seed = nextSeed

    return nextSeed / 4294967296
  }

  function isWaterPoint(x: number, y: number) {
    if (x < 0 || x > 1 || y < 0 || y > 1) return false

    const waterMaskData = waterMaskDataRef.current

    if (!waterMaskData) return y >= waterlineProgress && y <= 0.98

    const pixelX = Math.min(Math.floor(x * waterMaskData.width), waterMaskData.width - 1)
    const pixelY = Math.min(Math.floor(y * waterMaskData.height), waterMaskData.height - 1)
    const alphaIndex = (pixelY * waterMaskData.width + pixelX) * 4 + 3

    return waterMaskData.data[alphaIndex] > waterMaskAlphaThreshold
  }

  useEffect(() => {
    let isActive = true
    const image = new Image()

    image.onload = () => {
      if (!isActive) return

      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) return

      canvas.width = SKYLINE_IMAGE.width
      canvas.height = SKYLINE_IMAGE.height
      context.drawImage(image, 0, 0, SKYLINE_IMAGE.width, SKYLINE_IMAGE.height)
      waterMaskDataRef.current = context.getImageData(
        0,
        0,
        SKYLINE_IMAGE.width,
        SKYLINE_IMAGE.height,
      )
    }

    image.src = waterMaskSrc

    return () => {
      isActive = false
      waterMaskDataRef.current = null
    }
  }, [])

  useEffect(() => {
    const shouldRainRipple =
      shouldRenderRipples && (weather === 'rain' || weather === 'thunder')

    if (!shouldRainRipple) {
      if (rainRippleAnimationRef.current) {
        window.cancelAnimationFrame(rainRippleAnimationRef.current)
        rainRippleAnimationRef.current = 0
      }

      return
    }

    const addRainRipple = (now: number) => {
      for (let attempt = 0; attempt < 24; attempt += 1) {
        const x = nextRainRandom()
        const y = waterlineProgress + nextRainRandom() * (0.985 - waterlineProgress)

        if (isWaterPoint(x, y)) {
          addWaterRipple(x, y, now, false)
          return
        }
      }
    }

    const tickRainRipples = (now: number) => {
      if (now - rainRippleRef.current.time >= rainRippleIntervalMs) {
        rainRippleRef.current.time = now
        addRainRipple(now)
      }

      rainRippleAnimationRef.current = window.requestAnimationFrame(tickRainRipples)
    }

    rainRippleAnimationRef.current = window.requestAnimationFrame(tickRainRipples)

    return () => {
      if (rainRippleAnimationRef.current) {
        window.cancelAnimationFrame(rainRippleAnimationRef.current)
        rainRippleAnimationRef.current = 0
      }
    }
    // Water ripple helpers are ref-backed; the rain loop only needs to restart on weather/season changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, shouldRenderRipples])

  useEffect(() => {
    if (shouldRenderRipples) return

    ripplesRef.current = []

    if (rippleAnimationRef.current) {
      window.cancelAnimationFrame(rippleAnimationRef.current)
      rippleAnimationRef.current = 0
    }
  }, [shouldRenderRipples])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current)
      }

      if (rippleAnimationRef.current) {
        window.cancelAnimationFrame(rippleAnimationRef.current)
      }

      if (rainRippleAnimationRef.current) {
        window.cancelAnimationFrame(rainRippleAnimationRef.current)
      }
    }
  }, [])

  return (
    <section
      className="skyline-map"
      aria-label="Toronto skyline"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const pointerX = (event.clientX - bounds.left) / bounds.width
        const pointerY = (event.clientY - bounds.top) / bounds.height
        const x = (pointerX - 0.5) * 8
        const y = (pointerY - 0.5) * 5

        setParallax(x, y, pointerX * 100, pointerY * 100)

        const frameBounds = frameRef.current?.getBoundingClientRect()

        if (frameBounds) {
          addWaterRipple(
            (event.clientX - frameBounds.left) / frameBounds.width,
            (event.clientY - frameBounds.top) / frameBounds.height,
            event.timeStamp,
          )
        }
      }}
    >
      <div className="skyline-frame" ref={frameRef}>
        <img
          className="skyline-image"
          src={skylineImage.src}
          alt={skylineImage.alt}
          draggable="false"
          width={skylineImage.width}
          height={skylineImage.height}
        />
        {skyOverlay}
        {celestialOverlay}
        <div className="skyline-lighting" aria-hidden="true" />
        {shouldRenderRipples && (
          <canvas className="water-ripple-canvas" ref={rippleCanvasRef} aria-hidden="true" />
        )}
        <svg
          className="building-map"
          viewBox={`0 0 ${skylineImage.width} ${skylineImage.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {buildingRegions.map((building) => (
            <a
              className="building-hit-link"
              href={`#${building.id}`}
              aria-label={building.label}
              key={building.id}
              onClick={(event) => {
                event.preventDefault()
                onBuildingSelect?.(building)
              }}
            >
              <path className="building-hit-area" d={building.mapPath} />
              <path className="building-outline building-outline-backdrop" d={building.mapPath} />
              <path className="building-outline building-outline-accent" d={building.mapPath} />
            </a>
          ))}
        </svg>
      </div>
    </section>
  )
}
