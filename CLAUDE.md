# CLAUDE.md

## Project Overview

EV Charging Calculator — a React SPA that models electric vehicle charging sessions. Deployed to GitHub Pages at `https://s100ian.github.io/ev-charging-calculator/`.

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode)
- **Vite 7** — build tool & dev server
- **Vitest 4** — unit testing
- **ESLint 9** — flat config, no Prettier
- **gh-pages** — deployment

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript check + Vite build |
| `npm run lint` | ESLint on all files |
| `npm test` | Run Vitest test suite (non-interactive) |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests (Chromium) |
| `npm run preview` | Preview production build |
| `npm run deploy` | Bump patch version, push tags, deploy to GitHub Pages |

## Project Structure

```
src/
├── components/       # React functional components (CarInfo, ChargingDetails, ResultsDisplay, ThemeToggle)
├── context/          # ThemeContext (light/dark with localStorage + OS preference)
├── utils/            # Business logic (calculations.ts + calculations.test.ts)
├── App.tsx           # Root component — all app state lives here
├── App.css           # All application styles (CSS variables for theming)
├── index.css         # Global resets
└── main.tsx          # Entry point
```

## Code Conventions

- **Components:** `React.FC<Props>` with PascalCase interface names suffixed with `Props`, default exports
- **Quotes:** Double quotes
- **Semicolons:** Yes
- **Imports:** Named imports from React (`import { useState } from "react"`), relative paths (no aliases)
- **State:** `useState` + `useMemo` in App.tsx, props drilled to children, localStorage for persistence
- **Styling:** Plain CSS with CSS custom properties for theming — no CSS-in-JS, no Tailwind, no SCSS
- **Functions:** Arrow functions preferred for callbacks

## Key Architecture Decisions

- All input state lives in `App.tsx` with derived values computed via `useMemo`
- Values persist to localStorage on change and restore on mount
- Theme uses React Context with `data-theme` attribute on `<html>` for CSS variable switching
- Charging calculation models two phases: normal charging and trickle charging (>99% SoC at 5A)
