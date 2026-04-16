# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Artist portfolio site for Flore (painter). Built with Hugo, deployed to GitHub Pages, managed via Sveltia CMS.

- **Live site:** https://florelibre.github.io/le-pinceau-volant/
- **CMS admin:** `/admin/` (requires GitHub OAuth)

## Commands

```bash
# Local development server (requires Hugo extended v0.131.0+)
hugo server

# Production build (matches CI)
hugo --minify --baseURL "https://florelibre.github.io/le-pinceau-volant/"
```

Deployment is fully automated via GitHub Actions on push to `main`.

## Architecture

### Static Site (Hugo)

- No Hugo theme — custom layouts in [layouts/](layouts/)
- `layouts/_default/baseof.html` is the base template; all pages extend it
- `layouts/index.html` renders the homepage; `layouts/_default/single.html` for content pages
- No asset pipeline (Hugo Pipes unused) — plain CSS in [static/css/main.css](static/css/main.css)
- Design tokens: CSS variables for colors (`#B56D50` terracotta accent, `#FAFAF7` cream bg), fonts (Playfair Display / Raleway)

### Content

All content is in [content/](content/) as Markdown with YAML frontmatter. The site has four pages:
- `_index.md` — homepage hero
- `a-propos.md` — artist bio
- `services/_index.md` — commissions & pricing
- `contact.md` — contact info

### CMS (Sveltia CMS)

Sveltia CMS runs at `/admin/` (files in [static/admin/](static/admin/)). It manages the four content pages above via the GitHub API directly. Auth uses GitHub OAuth routed through Netlify's OAuth proxy — **not** Netlify hosting. The site itself is hosted on GitHub Pages; Netlify is only used as an OAuth intermediary.

CMS configuration: [static/admin/config.yml](static/admin/config.yml)
