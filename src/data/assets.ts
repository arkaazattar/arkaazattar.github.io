const PUBLIC_ASSET_ROOT = '/assets'

export const ASSET_PATHS = {
  audio: {
    cityAmbience: '/audio/city_ambience.mp3',
    dryLeaves: '/audio/dry_leaves.mp3',
    rain: '/audio/rain.mp3',
    springDay: '/audio/spring_day.mp3',
    summerDay: '/audio/summer_day.mp3',
    summerNight: '/audio/summer_night.mp3',
    thunder: '/audio/thunder.mp3',
    winterWind: '/audio/winter_wind.mp3',
  },
  buildings: {
    cnTower: `${PUBLIC_ASSET_ROOT}/buildings/cn-tower.png`,
    eastTowerOne: `${PUBLIC_ASSET_ROOT}/buildings/east-tower-one.png`,
    eastTowerTwo: `${PUBLIC_ASSET_ROOT}/buildings/east-tower-two.png`,
    rogersCentre: `${PUBLIC_ASSET_ROOT}/buildings/rogers-centre.png`,
    westTower: `${PUBLIC_ASSET_ROOT}/buildings/west-tower.png`,
  },
  celestial: {
    moonPhases: [
      null,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-2.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-3.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-4.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-5.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-6.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-7.png`,
      `${PUBLIC_ASSET_ROOT}/celestial/moon-phase-8.png`,
    ],
    sun: `${PUBLIC_ASSET_ROOT}/celestial/sun.png`,
  },
  clouds: {
    large1: `${PUBLIC_ASSET_ROOT}/clouds/large-1.png`,
    large2: `${PUBLIC_ASSET_ROOT}/clouds/large-2.png`,
    large3: `${PUBLIC_ASSET_ROOT}/clouds/large-3.png`,
    medium1: `${PUBLIC_ASSET_ROOT}/clouds/medium-1.png`,
    small1: `${PUBLIC_ASSET_ROOT}/clouds/small-1.png`,
    small2: `${PUBLIC_ASSET_ROOT}/clouds/small-2.png`,
    small3: `${PUBLIC_ASSET_ROOT}/clouds/small-3.png`,
    small4: `${PUBLIC_ASSET_ROOT}/clouds/small-4.png`,
  },
  icons: {
    email: `${PUBLIC_ASSET_ROOT}/icons/email.svg`,
    github: `${PUBLIC_ASSET_ROOT}/icons/github.svg`,
    linkedin: `${PUBLIC_ASSET_ROOT}/icons/linkedin.svg`,
    resume: `${PUBLIC_ASSET_ROOT}/icons/resume.svg`,
  },
  misc: {
    sitCat: `${PUBLIC_ASSET_ROOT}/misc/Sit_Cat.png`,
    sleepCat: `${PUBLIC_ASSET_ROOT}/misc/Sleep_Cat.png`,
  },
  scene: {
    skyline: `${PUBLIC_ASSET_ROOT}/scene/toronto-skyline.png`,
    skylineWinter: `${PUBLIC_ASSET_ROOT}/scene/toronto-skyline-winter.png`,
    waterMask: `${PUBLIC_ASSET_ROOT}/scene/water-mask.svg`,
  },
} as const
