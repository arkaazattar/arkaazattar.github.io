# arkaazattar.github.io

Personal website built with Vite, React, and TypeScript.

The current experience is an interactive Toronto skyline scene. It uses the
city's local time, sunrise/sunset data, weather, seasonal art, moon phases,
building hotspots, ambience, and manual scene controls to make the site feel
alive while keeping the page lightweight and static-hostable.

## Features

- Toronto skyline scene with responsive image layers and clickable building regions.
- Live mode driven by Toronto time, season, Open-Meteo weather, and solar data.
- Manual preview controls for time of day, date, weather, and season.
- Weather and atmosphere overlays for rain, snow, fog, thunder, stars, moon, clouds, and leaves.
- Optional ambient audio with an explicit mute/unmute control.
- Quick links for GitHub, LinkedIn, email, and resume.

## Tech Stack

- Vite
- React
- TypeScript
- CSS modules by component convention
- Three.js and canvas-based effects where useful for scene rendering

## Getting Started

Install dependencies:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Checks

Run linting:

```sh
npm run lint
```

Run a production build:

```sh
npm run build
```

## Project Structure

```text
public/
  assets/       Static scene, building, cloud, icon, font, and celestial assets
  audio/        Ambient and weather audio
  resume.pdf    Public resume link target
src/
  components/   Scene, overlay, panel, control, and button components
  data/         Scene timing, weather mapping, asset paths, and building regions
  App.tsx       Main experience composition
```

## Notes

- The site is intended to deploy as a static Vite build.
- Live weather and solar data come from Open-Meteo. If the request fails, the
  app falls back to a clear-weather scene with default solar times.
- Audio does not autoplay; it only changes state after user interaction.
