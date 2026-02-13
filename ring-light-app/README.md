# Glow Up Studio (Ring Light Web App)

Turn your screen into a professional ring light for meetings, streaming, and recordings.

## Key Features

- Real-time studio light controls for brightness and color temperature.
- Built-in and custom presets for fast repeatable setups.
- Shareable studio state via URL parameters.
- iPhone-aware phone placement guide with model presets, orientation, and calibration.
- Keyboard shortcuts and fullscreen workflow for hands-free use.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## Project Structure

```text
ring-light-app/
  app/          # Routes and pages (App Router)
  components/   # UI components (landing, studio, shared, presets)
  context/      # App-wide light and preset state
  lib/          # Utilities (color, presets, URL sharing, phone guide sizing/models)
  styles/       # Global styles
  types/        # Shared TypeScript types
```

## Prerequisites

- Node.js 18+ (newer versions also work)
- pnpm (recommended) or npm

## Local Development

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

Optional custom port:

```bash
pnpm dev --port 3001
```

## Production Commands

```bash
pnpm build
pnpm start
pnpm lint
```

## Routes

- `/` Landing page
- `/studio` Light studio
- `/presets` Preset management
- `/settings` App settings
- `/api/share` Share helper endpoint

## Configuration and Environment Notes

- No required `.env` variables for baseline local run.
- App settings and presets are persisted in browser `localStorage`.
- Shared studio links encode light settings in URL query parameters.

## Troubleshooting

### 1) Port already in use / permission issues

- Try another port:

```bash
pnpm dev --port 3001
```

- If you still see permission errors, close conflicting local servers and retry.

### 2) Build succeeds but page looks blank in browser

- Hard refresh (`Cmd+Shift+R` / `Ctrl+F5`).
- Clear site storage for localhost (especially `localStorage`) and reload.
- Open browser DevTools console and check for runtime errors.

### 3) GitHub push fails with large file errors

Ensure generated/dependency directories are not tracked:

- `ring-light-app/node_modules`
- `ring-light-app/.next`
- `ring-light-app/output`

## Deployment Notes

- Compatible with Vercel and standard Node.js hosting.
- Standard deploy flow:
  1. `pnpm install`
  2. `pnpm build`
  3. `pnpm start`

## License

Current project license is `ISC` (from `package.json`).

If you want, this can be updated later to another license (for example MIT) based on distribution goals.
