# AGENTS.md

Guidance for AI agents working in this repository.

## Keep This File Current

If project changes make this file inaccurate, stale, or misleading, update `AGENTS.md` as part of the same change. Examples include switching frameworks, changing package managers, adding or removing major tooling, moving source directories, or changing the build/deploy workflow.

## Project Context

This repository contains a personal website for `arkaazattar.github.io`.

The site uses modern React tooling, specifically Vite + React and Next.js. Before making stack-specific changes, inspect the current project files (`package.json`, `vite.config.*`, `next.config.*`, `src/`, `app/`, or `pages/`) and follow the framework already in use for the area being edited.

## Development Expectations

- Keep changes focused on the personal website experience.
- Prefer simple, maintainable React components over broad abstractions.
- Match the existing styling approach once one is present.
- Avoid adding new dependencies unless they clearly simplify the implementation.
- Do not introduce backend, database, or authentication infrastructure unless explicitly requested.

## Frontend Guidelines

- Preserve responsive behavior across mobile and desktop.
- Keep the first screen useful and representative of the personal site.
- Use accessible HTML semantics, descriptive alt text for meaningful images, and keyboard-friendly interactions.
- Avoid decorative complexity that makes the site harder to maintain.
- For Next.js code, prefer framework conventions for routing, metadata, image handling, and server/client component boundaries.
- For Vite + React code, keep client-side routing, asset imports, and build assumptions aligned with the existing Vite setup.

## Skyline Experience

- Treat the skyline image as the stable visual base, with separate overlay layers for interaction, weather, and atmosphere.
- Treat `--sky-color`, `--water-color`, and `--building-outline-color` as time-of-day driven theme variables for Toronto, not fixed brand colors. They may be hard-coded temporarily, but future work should keep them easy to compute/update dynamically.
- Prefer a smooth interpolation model for time-of-day color changes. For production behavior, anchor sunrise/sunset transitions to Toronto solar data from an API when practical rather than fixed clock hours.
- Weather should generally modify the scene through overlays and ambience rather than replacing the time-of-day theme. Examples include rain, snow, thunder, fog, and similar atmospheric layers.
- Thunder should use a full-screen lightning flash for now rather than a visible bolt graphic. Future thunder audio should be synced to the flash timing.
- Plan for scene controls that let users preview time of day, weather, and season manually. Keep a clear distinction between live mode, which uses Toronto time/weather data, and manual preview mode, which uses user-selected controls.
- If weather audio is added, do not autoplay it. Audio should start only after user interaction, include a clear mute/unmute control, and persist the user preference when practical.
- Keep clickable skyline regions aligned to the source image's pixel grid, preferably with SVG paths using the same `viewBox` dimensions as the PNG.

## Common Commands

Use the package manager already indicated by the lockfile or existing scripts.

Typical commands, once available:

```sh
npm install
npm run dev
npm run build
npm run lint
```

If the repo uses `pnpm`, `yarn`, or `bun`, use the equivalent commands from `package.json`.

## Verification

Before finishing code changes:

- Run the most relevant available check, usually `npm run build` or `npm run lint`.
- For visual changes, start the dev server when practical and inspect the affected page.
- Mention any checks that could not be run.

## Git Hygiene

- Do not revert user changes.
- Keep commits and edits scoped to the requested work.
- Leave unrelated files alone.
