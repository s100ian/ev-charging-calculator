# CLAUDE.md

## Project Overview

EV Charging Calculator — a React SPA that models electric vehicle charging sessions. Installable as a PWA. Deployed to GitHub Pages at `https://s100ian.github.io/ev-charging-calculator/`.

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Vite 7** — build tool & dev server
- **Vitest 4** + **@testing-library/react** — unit/component testing (jsdom)
- **Playwright** — E2E testing (Chromium only)
- **ESLint 9** — flat config, no Prettier
- **husky** + **lint-staged** — pre-commit `eslint --fix` and `tsc -b --noEmit`
- Custom PWA plugin (`pwa.config.ts`) — no `vite-plugin-pwa` dependency

## Commands

| Command | Description |
|---------|-------------|
| `npm run verify` | **Primary gate:** lint + unit tests + build. Run this before considering work done. |
| `npm run verify:all` | `verify` plus Playwright E2E — the full gate |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript project build + Vite build |
| `npm run lint` | ESLint on all files |
| `npm test` | Run Vitest suite once (non-interactive) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with coverage report (thresholds enforced) |
| `npm run test:e2e` | Run Playwright E2E tests (starts its own dev server) |
| `npm run preview` | Preview production build |
| `npm run release` | Bump patch version and push with tags |

**Deployment is automatic** — `.github/workflows/ci.yml` builds and publishes to GitHub Pages via
`upload-pages-artifact`/`deploy-pages` on every push to `main`. There is no `deploy` script and no
`gh-pages` dependency; do not add a manual deploy step.

## Project Structure

```
src/
├── components/       # 13 presentational components (see below)
├── context/          # ThemeContext — light/dark via localStorage + OS preference
├── hooks/            # useChargePlan, useChargingResults — derived-value hooks
├── utils/            # calculations.ts (domain math), storage.ts, currency.ts
├── test/setup.ts     # Vitest setup (jest-dom matchers)
├── App.tsx           # Root — owns all raw input state
├── App.css           # All application styles (CSS custom properties for theming)
├── index.css         # Global resets
├── pwa.ts            # Service-worker registration + update flow
└── main.tsx          # Entry point
e2e/app.spec.ts       # Playwright specs
pwa.config.ts         # Vite plugin generating manifest + service worker
docs/ideas/           # Feature backlog — one spec per idea, with success criteria
```

Components: `CarInfo`, `ChargingDetails`, `ChargePlanning`, `ChargingCost`, `ResultsDisplay`,
`PlanningResults`, `CostResults`, `SliderField`, `Tile`, `TileGrid`, `ThemeToggle`, `PwaBanner`.

`SliderField`, `Tile`, `TileGrid`, `ThemeToggle`, and `PwaBanner` currently have no unit tests —
adding coverage there is welcome.

## Code Conventions

- **Components:** `React.FC<Props>` with PascalCase interface names suffixed with `Props`, default exports
- **Quotes:** Double quotes
- **Semicolons:** Yes
- **Imports:** Named imports from React (`import { useState } from "react"`), relative paths (no aliases)
- **Styling:** Plain CSS with CSS custom properties for theming — no CSS-in-JS, no Tailwind, no SCSS
- **Functions:** Arrow functions preferred for callbacks
- **Indentation:** Components/hooks use 2 spaces; `src/utils/calculations.ts` and
  `src/context/ThemeContext.tsx` use 4. Match the file you are editing.
- **Tests:** Co-located as `<Name>.test.ts(x)` next to the unit under test

## Key Architecture Decisions

- **State ownership:** `App.tsx` owns every raw input via `useState` and drills props down.
  Derived values are *not* computed inline — they live in `useChargePlan` (target SoC, ready-at
  time, cost to target) and `useChargingResults` (energy added, session cost, cost per 100 km),
  both thin `useMemo` wrappers over `src/utils/calculations.ts`. New derived values belong in a
  hook, not in `App.tsx`.
- **Domain math is pure:** `src/utils/calculations.ts` exports side-effect-free functions and is
  the only place charging physics lives. It is at 100% statement coverage — keep it that way, and
  test new math here rather than through the UI.
- **Persistence:** `src/utils/storage.ts` centralizes localStorage reads/writes. Every accessor
  is wrapped in try/catch and falls back to a default, because localStorage throws in incognito
  and when quota is exceeded. It also migrates legacy `volts`/`amps` keys into `chargingPowerKw`
  — preserve that path when touching stored keys.
- **Charging model — two phases:** normal charging up to the 99% SoC threshold
  (`TRICKLE_SOC_THRESHOLD`), then trickle charging above it at `min(normalPower, 1.15 kW)`
  (`TRICKLE_POWER_KW`). Some comments still say "5A" — that is a leftover from when the UI took
  volts and amps; the input is now power in kW and the trickle rate is a fixed kW cap.
- **Theme:** React Context sets a `data-theme` attribute on `<html>`; CSS variables switch off it.
- **PWA:** `pwa.config.ts` generates the manifest and service worker at build time, stamped with
  a build version so `pwa.ts` can prompt users to reload on update.

## Working Agreements

- Run `npm run verify` before reporting work complete. Use `npm run verify:all` when touching UI
  that E2E asserts on.
- Coverage thresholds in `vite.config.ts` are a floor, not a target. Never lower them to make a
  change pass.
- `npm install` runs husky via `prepare`; the pre-commit hook lints and typechecks staged files.
- Remote/web sessions bootstrap themselves via `.claude/hooks/session-start.sh` (installs deps,
  reuses the pre-installed Playwright Chromium). No manual setup needed.
