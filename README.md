# Iran monitor — zero-build live package

This package is designed to get the site live with the least friction possible.

## What changed
- converted the project into a plain static site in `site/`
- removed the need for Vite/React build during hosting
- kept daily auto-refresh via GitHub Actions
- preserved the same monitor content structure:
  - regime
  - TACO probabilities
  - key watch items
  - indicators
  - key events
  - top headlines
  - market snapshot

## Files
- `site/` — deploy this directly
- `scripts/refresh-data.mjs` — daily JSON refresh
- `.github/workflows/refresh-and-deploy.yml` — GitHub Pages auto-refresh + deploy
- `DEPLOY_NOW.md` — fastest path to launch

## Why this is easier
A plain static site can be hosted almost anywhere for free and does not require a running server process.
