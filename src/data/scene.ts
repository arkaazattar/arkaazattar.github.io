export type SceneMode = 'live' | 'today' | 'manual'
export type SceneWeather = 'clear' | 'rain' | 'snow' | 'fog' | 'thunder'
export type SceneSeason = 'spring' | 'summer' | 'fall' | 'winter'

export type SceneTheme = {
  skyColor: string
  waterColor: string
  outlineColor: string
  lightingColor: string
  lightingOpacity: number
}

export type SolarTimes = {
  sunriseMinutes: number
  sunsetMinutes: number
}

export type HourlyWeather = {
  minute: number
  weather: SceneWeather
}

export type MoonPhase = {
  index: number
  label: string
  imageSrc: string | null
}

type ThemeStop = SceneTheme & {
  minute: number
}

const TORONTO_TIME_ZONE = 'America/Toronto'
const TORONTO_LATITUDE = 43.6532
const TORONTO_LONGITUDE = -79.3832
const LUNAR_CYCLE_DAYS = 29.530588853
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)
const MOON_PHASE_LABELS = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
]

export const DEFAULT_SOLAR_TIMES: SolarTimes = {
  sunriseMinutes: 390,
  sunsetMinutes: 1170,
}

export const SEASON_SOLAR_TIMES: Record<SceneSeason, SolarTimes> = {
  spring: DEFAULT_SOLAR_TIMES,
  summer: {
    sunriseMinutes: 330,
    sunsetMinutes: 1260,
  },
  fall: {
    sunriseMinutes: 420,
    sunsetMinutes: 1080,
  },
  winter: {
    sunriseMinutes: 465,
    sunsetMinutes: 990,
  },
}

const seasonTints: Record<SceneSeason, Partial<SceneTheme>> = {
  spring: {
    skyColor: '#42ffd2',
    waterColor: '#18c7d9',
    outlineColor: '#ff4fc8',
  },
  summer: {
    skyColor: '#16c9ff',
    waterColor: '#009bd4',
    outlineColor: '#39f7ff',
  },
  fall: {
    skyColor: '#ff9b3d',
    waterColor: '#d9588d',
    outlineColor: '#ffd447',
  },
  winter: {
    skyColor: '#8ee8ff',
    waterColor: '#4ad9ff',
    outlineColor: '#7df7ff',
  },
}

export function getTorontoMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return ((hour % 24) * 60) + minute
}

export function getTorontoSeason(date = new Date()): SceneSeason {
  const month = Number(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TORONTO_TIME_ZONE,
      month: 'numeric',
    }).format(date),
  )

  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

export function formatSceneTime(minutes: number) {
  const hour24 = Math.floor(minutes / 60) % 24
  const minute = minutes % 60
  const hour12 = hour24 % 12 || 12
  const suffix = hour24 < 12 ? 'AM' : 'PM'

  return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`
}

export function getDateForDayOffset(dayOffset: number, baseDate = new Date()) {
  const date = new Date(baseDate)

  date.setDate(date.getDate() + dayOffset)

  return date
}

export function formatSceneDate(dayOffset: number) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TIME_ZONE,
    month: 'short',
    day: 'numeric',
  }).format(getDateForDayOffset(dayOffset))
}

export function getMoonPhase(dayOffset: number): MoonPhase {
  const date = getDateForDayOffset(dayOffset)
  const daysSinceNewMoon = (date.getTime() - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24)
  const lunarAge =
    ((daysSinceNewMoon % LUNAR_CYCLE_DAYS) + LUNAR_CYCLE_DAYS) % LUNAR_CYCLE_DAYS
  const phaseIndex = Math.floor((lunarAge / LUNAR_CYCLE_DAYS) * 8 + 0.5) % 8

  return {
    index: phaseIndex + 1,
    label: MOON_PHASE_LABELS[phaseIndex],
    imageSrc: phaseIndex === 0 ? null : `/phase${phaseIndex + 1}.png`,
  }
}

export async function fetchTorontoScene() {
  const params = new URLSearchParams({
    latitude: String(TORONTO_LATITUDE),
    longitude: String(TORONTO_LONGITUDE),
    current: 'weather_code,precipitation,rain,showers,snowfall,cloud_cover',
    hourly: 'weather_code,precipitation,rain,showers,snowfall,cloud_cover',
    daily: 'sunrise,sunset',
    forecast_days: '1',
    timezone: TORONTO_TIME_ZONE,
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with ${response.status}`)
  }

  const data = (await response.json()) as OpenMeteoResponse
  const sunrise = data.daily?.sunrise?.[0]
  const sunset = data.daily?.sunset?.[0]

  return {
    weather: getWeatherFromCode(data.current),
    hourlyWeather: getHourlyWeather(data.hourly),
    solarTimes:
      sunrise && sunset
        ? {
            sunriseMinutes: getMinutesFromLocalIso(sunrise),
            sunsetMinutes: getMinutesFromLocalIso(sunset),
          }
        : DEFAULT_SOLAR_TIMES,
  }
}

export function getWeatherForMinute(
  hourlyWeather: HourlyWeather[],
  minute: number,
  fallback: SceneWeather,
) {
  if (hourlyWeather.length === 0) return fallback

  return hourlyWeather.reduce((closest, sample) => {
    const closestDistance = Math.abs(closest.minute - minute)
    const sampleDistance = Math.abs(sample.minute - minute)

    return sampleDistance < closestDistance ? sample : closest
  }).weather
}

export function getSceneTheme(
  minutes: number,
  season: SceneSeason,
  solarTimes: SolarTimes = DEFAULT_SOLAR_TIMES,
): SceneTheme {
  const minute = Math.min(Math.max(minutes, 0), 1439)
  const themeStops = getThemeStops(solarTimes)
  const nextStop =
    themeStops.find((stop) => stop.minute >= minute) ?? themeStops[themeStops.length - 1]
  const previousStop =
    themeStops[themeStops.indexOf(nextStop) - 1] ?? themeStops[0]
  const span = Math.max(nextStop.minute - previousStop.minute, 1)
  const progress = (minute - previousStop.minute) / span
  const baseTheme = {
    skyColor: mixHex(previousStop.skyColor, nextStop.skyColor, progress),
    waterColor: mixHex(previousStop.waterColor, nextStop.waterColor, progress),
    outlineColor: mixHex(previousStop.outlineColor, nextStop.outlineColor, progress),
    lightingColor: mixHex(previousStop.lightingColor, nextStop.lightingColor, progress),
    lightingOpacity: lerp(
      previousStop.lightingOpacity,
      nextStop.lightingOpacity,
      progress,
    ),
  }
  const tint = seasonTints[season]

  return {
    skyColor: tint.skyColor ? mixHex(baseTheme.skyColor, tint.skyColor, 0.16) : baseTheme.skyColor,
    waterColor: tint.waterColor
      ? mixHex(baseTheme.waterColor, tint.waterColor, 0.18)
      : baseTheme.waterColor,
    outlineColor: tint.outlineColor
      ? mixHex(baseTheme.outlineColor, tint.outlineColor, 0.22)
      : baseTheme.outlineColor,
    lightingColor: baseTheme.lightingColor,
    lightingOpacity: baseTheme.lightingOpacity,
  }
}

type OpenMeteoResponse = {
  current?: {
    weather_code?: number
    precipitation?: number
    rain?: number
    showers?: number
    snowfall?: number
    cloud_cover?: number
  }
  daily?: {
    sunrise?: string[]
    sunset?: string[]
  }
  hourly?: {
    time?: string[]
    weather_code?: number[]
    precipitation?: number[]
    rain?: number[]
    showers?: number[]
    snowfall?: number[]
    cloud_cover?: number[]
  }
}

function getThemeStops({ sunriseMinutes, sunsetMinutes }: SolarTimes): ThemeStop[] {
  return [
    {
      minute: 0,
      skyColor: '#041023',
      waterColor: '#02162a',
      outlineColor: '#22f6ff',
      lightingColor: '#020b1f',
      lightingOpacity: 0.34,
    },
    {
      minute: clampMinute(sunriseMinutes - 135),
      skyColor: '#041023',
      waterColor: '#02162a',
      outlineColor: '#22f6ff',
      lightingColor: '#020b1f',
      lightingOpacity: 0.34,
    },
    {
      minute: clampMinute(sunriseMinutes - 75),
      skyColor: '#061a35',
      waterColor: '#082542',
      outlineColor: '#35f4ff',
      lightingColor: '#09254d',
      lightingOpacity: 0.28,
    },
    {
      minute: clampMinute(sunriseMinutes - 45),
      skyColor: '#12305d',
      waterColor: '#0c3c65',
      outlineColor: '#4ffcff',
      lightingColor: '#164174',
      lightingOpacity: 0.24,
    },
    {
      minute: clampMinute(sunriseMinutes - 44),
      skyColor: '#12305d',
      waterColor: '#0c3c65',
      outlineColor: '#ffd84d',
      lightingColor: '#164174',
      lightingOpacity: 0.24,
    },
    {
      minute: clampMinute(sunriseMinutes - 15),
      skyColor: '#ff8e45',
      waterColor: '#c4518f',
      outlineColor: '#ffd84d',
      lightingColor: '#ff7b44',
      lightingOpacity: 0.16,
    },
    {
      minute: clampMinute(sunriseMinutes + 45),
      skyColor: '#ffc061',
      waterColor: '#48a7bf',
      outlineColor: '#ffd84d',
      lightingColor: '#ffc55f',
      lightingOpacity: 0.06,
    },
    {
      minute: clampMinute(sunriseMinutes + 105),
      skyColor: '#46bfff',
      waterColor: '#0aa0c4',
      outlineColor: '#ffd84d',
      lightingColor: '#ffffff',
      lightingOpacity: 0,
    },
    {
      minute: clampMinute(sunsetMinutes - 180),
      skyColor: '#36b6f6',
      waterColor: '#078cb4',
      outlineColor: '#ffd84d',
      lightingColor: '#ffffff',
      lightingOpacity: 0,
    },
    {
      minute: clampMinute(sunsetMinutes - 75),
      skyColor: '#ff9d5f',
      waterColor: '#7659a9',
      outlineColor: '#ffd84d',
      lightingColor: '#ff8a4f',
      lightingOpacity: 0.06,
    },
    {
      minute: clampMinute(sunsetMinutes - 25),
      skyColor: '#ff5f69',
      waterColor: '#623286',
      outlineColor: '#ff4fc8',
      lightingColor: '#ff416f',
      lightingOpacity: 0.18,
    },
    {
      minute: clampMinute(sunsetMinutes + 35),
      skyColor: '#171642',
      waterColor: '#0b2142',
      outlineColor: '#ff4fc8',
      lightingColor: '#1e113e',
      lightingOpacity: 0.26,
    },
    {
      minute: clampMinute(sunsetMinutes + 36),
      skyColor: '#171642',
      waterColor: '#0b2142',
      outlineColor: '#22f6ff',
      lightingColor: '#1e113e',
      lightingOpacity: 0.26,
    },
    {
      minute: clampMinute(sunsetMinutes + 105),
      skyColor: '#07142e',
      waterColor: '#031a32',
      outlineColor: '#22f6ff',
      lightingColor: '#030b20',
      lightingOpacity: 0.32,
    },
    {
      minute: 1440,
      skyColor: '#041023',
      waterColor: '#02162a',
      outlineColor: '#22f6ff',
      lightingColor: '#020b1f',
      lightingOpacity: 0.34,
    },
  ].sort((first, second) => first.minute - second.minute)
}

function getWeatherFromCode(current: OpenMeteoResponse['current']): SceneWeather {
  const weatherCode = current?.weather_code ?? 0
  const precipitation =
    (current?.precipitation ?? 0) + (current?.rain ?? 0) + (current?.showers ?? 0)

  if ([95, 96, 99].includes(weatherCode)) return 'thunder'
  if ((current?.snowfall ?? 0) > 0 || [71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return 'snow'
  }
  if ([45, 48].includes(weatherCode)) return 'fog'
  if (
    precipitation > 0 ||
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return 'rain'
  }

  return 'clear'
}

function getHourlyWeather(hourly: OpenMeteoResponse['hourly']): HourlyWeather[] {
  return (
    hourly?.time?.map((time, index) => ({
      minute: getMinutesFromLocalIso(time),
      weather: getWeatherFromCode({
        weather_code: hourly.weather_code?.[index],
        precipitation: hourly.precipitation?.[index],
        rain: hourly.rain?.[index],
        showers: hourly.showers?.[index],
        snowfall: hourly.snowfall?.[index],
        cloud_cover: hourly.cloud_cover?.[index],
      }),
    })) ?? []
  )
}

function getMinutesFromLocalIso(value: string) {
  const match = value.match(/T(\d{2}):(\d{2})/)

  if (!match) return 0

  return Number(match[1]) * 60 + Number(match[2])
}

function clampMinute(minute: number) {
  return Math.min(Math.max(minute, 0), 1440)
}

function mixHex(first: string, second: string, amount: number) {
  const a = hexToRgb(first)
  const b = hexToRgb(second)

  return rgbToHex({
    r: lerp(a.r, b.r, amount),
    g: lerp(a.g, b.g, amount),
    b: lerp(a.b, b.b, amount),
  })
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}
