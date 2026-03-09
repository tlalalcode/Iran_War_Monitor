# Deploy now

This package is already a plain static website. No build step is required.

## Fastest free launch

### Option A — GitHub Pages
1. Create a new GitHub repo.
2. Upload everything in this zip to the repo root.
3. In **Settings -> Pages**, set **Source = GitHub Actions**.
4. In **Settings -> Secrets and variables -> Actions**, add:
   - `GROQ_API_KEY`
   - `HF_API_KEY`
   - `GEMINI_API_KEY` (optional)
5. Open **Actions** and run **Refresh and deploy site** once.

The workflow will:
- refresh the JSON daily
- redeploy the site automatically
- give you a live `*.github.io` URL

## Option B — Cloudflare Pages direct upload
Cloudflare Pages supports drag-and-drop zip uploads for direct-upload projects, and those projects get a `*.pages.dev` URL. If you choose direct upload, Cloudflare says you cannot later switch that same project to Git integration; you would create a new project for Git integration instead. citeturn0search2

For Cloudflare direct upload:
1. Create a Pages project in the dashboard.
2. Choose **Direct Upload**.
3. Upload the contents of the `site/` folder as a zip or folder.
4. Your site will go live at a `*.pages.dev` URL.

## Best choice
Use **GitHub Pages** if you want the site to refresh daily automatically with zero backend hosting. GitHub's official docs confirm Pages supports custom GitHub Actions workflows, including uploading a Pages artifact and deploying it. GitHub also documents that the Pages source can be set to **GitHub Actions**. citeturn0search1turn0search7

## Notes
- This is now a zero-build site: `site/index.html` is the app.
- The daily refresh is handled by `scripts/refresh-data.mjs`.
- The initial content is already included in `site/data/`.
