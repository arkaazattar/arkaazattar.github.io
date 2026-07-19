import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import CelestialOverlay from './components/CelestialOverlay'
import SceneControls from './components/SceneControls'
import SkylineScene from './components/SkylineScene'
import StarsOverlay from './components/StarsOverlay'
import WeatherOverlay from './components/WeatherOverlay'
import {
  DEFAULT_SOLAR_TIMES,
  SEASON_SOLAR_TIMES,
  fetchTorontoScene,
  getSceneTheme,
  getMoonPhase,
  getTorontoMinutes,
  getTorontoSeason,
  getWeatherForMinute,
  type HourlyWeather,
  type SceneMode,
  type SceneSeason,
  type SceneWeather,
  type SolarTimes,
} from './data/scene'
import './App.css'

function App() {
  const [mode, setMode] = useState<SceneMode>('live')
  const [timeMinutes, setTimeMinutes] = useState(() => getTorontoMinutes())
  const [liveWeather, setLiveWeather] = useState<SceneWeather>('clear')
  const [manualWeather, setManualWeather] = useState<SceneWeather>('clear')
  const [season, setSeason] = useState<SceneSeason>(() => getTorontoSeason())
  const [dayOffset, setDayOffset] = useState(0)
  const [liveSolarTimes, setLiveSolarTimes] = useState<SolarTimes>(DEFAULT_SOLAR_TIMES)
  const [todayHourlyWeather, setTodayHourlyWeather] = useState<HourlyWeather[]>([])
  const solarTimes = mode === 'manual' ? SEASON_SOLAR_TIMES[season] : liveSolarTimes
  const weather =
    mode === 'manual'
      ? manualWeather
      : mode === 'today'
        ? getWeatherForMinute(todayHourlyWeather, timeMinutes, liveWeather)
        : liveWeather
  const theme = useMemo(
    () => getSceneTheme(timeMinutes, season, solarTimes),
    [season, solarTimes, timeMinutes],
  )
  const moonPhase = useMemo(() => getMoonPhase(dayOffset), [dayOffset])
  const siteStyle = {
    '--sky-color': theme.skyColor,
    '--water-color': theme.waterColor,
    '--building-outline-color': theme.outlineColor,
    '--scene-lighting-color': theme.lightingColor,
    '--scene-lighting-opacity': theme.lightingOpacity,
  } as CSSProperties

  useEffect(() => {
    if (mode !== 'live') return

    const syncLiveScene = () => {
      setTimeMinutes(getTorontoMinutes())
      setSeason(getTorontoSeason())
    }

    syncLiveScene()
    const intervalId = window.setInterval(syncLiveScene, 60_000)

    return () => window.clearInterval(intervalId)
  }, [mode])

  useEffect(() => {
    if (mode === 'manual') return

    let isActive = true

    const syncTorontoSceneData = async () => {
      try {
        const nextScene = await fetchTorontoScene()

        if (!isActive) return
        setLiveWeather(nextScene.weather)
        setLiveSolarTimes(nextScene.solarTimes)
        setTodayHourlyWeather(nextScene.hourlyWeather)
      } catch {
        if (!isActive) return
        setLiveWeather('clear')
        setLiveSolarTimes(DEFAULT_SOLAR_TIMES)
        setTodayHourlyWeather([])
      }
    }

    syncTorontoSceneData()
    const intervalId = window.setInterval(syncTorontoSceneData, 30 * 60_000)

    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [mode])

  const handleBuildingSelect = () => {
    // Future detail panel will open from here.
  }

  const handleModeChange = (nextMode: SceneMode) => {
    setMode(nextMode)
    if (nextMode === 'live') {
      setTimeMinutes(getTorontoMinutes())
      setSeason(getTorontoSeason())
      setDayOffset(0)
    }

    if (nextMode === 'today') {
      setSeason(getTorontoSeason())
      setDayOffset(0)
    }
  }

  return (
    <main className="site-shell" style={siteStyle}>
      <SkylineScene
        celestialOverlay={
          <CelestialOverlay
            moonPhase={moonPhase}
            solarTimes={solarTimes}
            timeMinutes={timeMinutes}
          />
        }
        onBuildingSelect={handleBuildingSelect}
        season={season}
        skyOverlay={
          <StarsOverlay
            solarTimes={solarTimes}
            timeMinutes={timeMinutes}
            weather={weather}
          />
        }
        weather={weather}
      />
      <WeatherOverlay weather={weather} />
      <SceneControls
        mode={mode}
        timeMinutes={timeMinutes}
        dayOffset={dayOffset}
        weather={weather}
        season={season}
        moonPhase={moonPhase}
        onModeChange={handleModeChange}
        onTimeChange={(value) => {
          setTimeMinutes(value)
          if (mode === 'live') {
            setMode('today')
          }
        }}
        onDayOffsetChange={(value) => {
          setDayOffset(value)
          if (mode === 'live') {
            setMode('today')
          }
        }}
        onWeatherChange={(value) => {
          setMode('manual')
          setManualWeather(value)
        }}
        onSeasonChange={(value) => {
          setMode('manual')
          setSeason(value)
        }}
      />
    </main>
  )
}

export default App
