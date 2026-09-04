# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site vitrine for "Le Pinceau Volant", Flore's painting studio (peinture libre, aquarelle créative, création collective) in Grenoble. Built with Hugo, deployed to GitHub Pages under a custom domain, content managed via Sveltia CMS.

- **Live site:** https://lepinceauvolant.fr/ (custom domain via [static/CNAME](static/CNAME); GitHub Pages default `florelibre.github.io/le-pinceau-volant/` also resolves)
- **CMS admin:** `/admin/` (requires a GitHub personal access token — no OAuth/Netlify involved)

## Commands

```bash
# Local development server (requires Hugo extended v0.131.0+)
hugo server

# Production build (matches CI)
hugo --minify --baseURL "https://lepinceauvolant.fr/"
```

Deployment is fully automated via GitHub Actions ([.github/workflows/hugo.yml](.github/workflows/hugo.yml)) on push to `main`.

This repo also uses OpenSpec for spec-driven change proposals (`npx openspec ...`); project context for that workflow lives in [openspec/config.yaml](openspec/config.yaml).

## Architecture

### Static Site (Hugo)

- No Hugo theme — custom layouts in [layouts/](layouts/); [layouts/_default/baseof.html](layouts/_default/baseof.html) is the base template (header with mobile nav overlay, footer, JS menu toggle)
- [layouts/index.html](layouts/index.html) renders the homepage hero plus a teaser of the 3 most recent `actualites` articles
- [layouts/_default/single.html](layouts/_default/single.html) renders ordinary content pages
- [layouts/actualites/list.html](layouts/actualites/list.html) is a section-specific override (takes priority over `_default/list.html`) that renders the Actualités index with full inline article content, newest first
- [layouts/_default/_markup/render-image.html](layouts/_default/_markup/render-image.html) is a markdown render hook adding `loading="lazy" decoding="async"` to inline images
- [layouts/partials/jsonld.html](layouts/partials/jsonld.html) injects `LocalBusiness` JSON-LD on every page, plus a hardcoded `FAQPage` JSON-LD block on `/faq/` — **the FAQ JSON-LD is maintained separately from [content/faq.md](content/faq.md)**, so the two need to be kept in sync manually
- No asset pipeline (Hugo Pipes unused) — plain CSS in [static/css/main.css](static/css/main.css)
- Design tokens (CSS variables): `--bg #fafaf7`, `--text #2c2423`, `--accent #b56d50` (terracotta), fonts Playfair Display (headings) / Raleway (body)
- Nav links are driven by `[[menus.main]]` entries in [hugo.toml](hugo.toml), not hardcoded in layouts

### Content

Content lives in [content/](content/) as Markdown with YAML frontmatter:
- `_index.md` — homepage hero
- `la-peinture-libre.md`, `laquarelle-creative.md`, `creation-collective.md` — activity pages
- `tarifs-et-horaires.md`, `qui-suis-je.md`, `faq.md`, `contact.md` — info pages
- `actualites/` — news section: `_index.md` is the section intro, dated entries (frontmatter: `title`, `date`, `description`) are individual articles

**Adding a new top-level page requires touching three places in lockstep:** the `content/*.md` file, a `[[menus.main]]` entry in [hugo.toml](hugo.toml), and a matching entry in the CMS `pages` collection below.

### CMS (Sveltia CMS)

Sveltia CMS runs at `/admin/` (files in [static/admin/](static/admin/)), managing content via the GitHub API directly. Config: [static/admin/config.yml](static/admin/config.yml).

- `pages` — a files collection with one entry per top-level content page (title/description/body fields)
- `actualites-articles` — a folder collection over `content/actualites/`, slug pattern `{{year}}-{{month}}-{{day}}-{{slug}}`, fields title/date/description/body
