import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import CelestialOverlay from './components/CelestialOverlay'
import LeavesOverlay from './components/LeavesOverlay'
import SceneControls from './components/SceneControls'
import SkylineScene from './components/SkylineScene'
import StarsOverlay from './components/StarsOverlay'
import WeatherOverlay from './components/WeatherOverlay'
import BuildingPanel from './components/BuildingPanel'
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
import { ASSET_PATHS } from './data/assets'
import type { BuildingRegion } from './data/buildings'

const quickLinks = [
  {
    label: 'GitHub',
    iconPath: ASSET_PATHS.icons.github,
    href: 'https://github.com/arkaazattar',
    target: '_blank',
  },
  {
    label: 'LinkedIn',
    iconPath: ASSET_PATHS.icons.linkedin,
    href: 'https://linkedin.com/in/arkaazattar',
    target: '_blank',
  },
  {
    label: 'Email',
    iconPath: ASSET_PATHS.icons.email,
    href: 'mailto:arkaazattar@gmail.com',
    target: '_blank'
  },
  {
    label: 'Resume',
    iconPath: ASSET_PATHS.icons.resume,
    href: '/resume.pdf',
    target: '_blank',
  },
]

function QuickLinksBar() {
  return (
    <nav className="quicklinks-bar" aria-label="Quick links">
      {quickLinks.map((link) => (
        <a
          className="quicklink-button"
          href={link.href}
          target={link.target}
          rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
          aria-label={link.label}
          key={link.label}
          style={{ '--quicklink-icon': `url(${link.iconPath})` } as CSSProperties}
        >
          <img src={link.iconPath} alt="" aria-hidden="true" className="quicklink-icon" />
        </a>
      ))}
    </nav>
  )
}

function App() {
  const [mode, setMode] = useState<SceneMode>('live')
  const [timeMinutes, setTimeMinutes] = useState(() => getTorontoMinutes())
  const [liveWeather, setLiveWeather] = useState<SceneWeather>('clear')
  const [manualWeather, setManualWeather] = useState<SceneWeather>('clear')
  const [season, setSeason] = useState<SceneSeason>(() => getTorontoSeason())
  const [dayOffset, setDayOffset] = useState(0)
  const [liveSolarTimes, setLiveSolarTimes] = useState<SolarTimes>(DEFAULT_SOLAR_TIMES)
  const [todayHourlyWeather, setTodayHourlyWeather] = useState<HourlyWeather[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingRegion | null>(null)
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

  const handleBuildingSelect = (building: BuildingRegion) => {
    setSelectedBuilding(building)
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
      {selectedBuilding && (
        <BuildingPanel 
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)} />
      )}
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
        timeMinutes={timeMinutes}
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
      {season === 'fall' && <LeavesOverlay />}
      <QuickLinksBar />
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
