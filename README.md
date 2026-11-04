# Afnan's portfolio

A static Astro portfolio and reusable content template: projects, blog, standalone writing, books with chapters, a document vault, about, contact and a printable CV. Hand-written CSS; bundled fonts; light/dark themes; no analytics or backend required.

## Run locally

Use Node **22.12+** (Node 22 recommended; see `.nvmrc`) and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Astro (normally port 4321). The development server accepts hosted `.e2b.app` previews. Extra preview hosts can be supplied with `DEV_ALLOWED_HOSTS` (comma-separated).

```sh
npm run check             # Astro + TypeScript diagnostics
npm run build             # static output in dist/
npm run verify:content    # check generated pages and local links AFTER building
npm run preview           # serve the production output
npm run og                # regenerate share image + touch icon
```

The verifier is structural testing, not browser, accessibility certification or Lighthouse testing.

Stage 1 checks (after building): `node scripts/verify-stage1.mjs`. Theme/contact/menu/search controller tests: `node --experimental-strip-types --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs scripts/test-human.mjs`. The current CSS-first enhancements, draft authoring and optional Bengali introductions are documented in [docs/authoring.md](docs/authoring.md).

Theme policy: dark for a new visitor, then restore the last manually selected light/dark choice from local storage. If storage is blocked, the toggle still works for the current page, but cannot persist across page loads.

## Make it yours

1. Edit **`src/config/site.ts`**: name, headline, introduction, email, social links and CV PDF path. `null` links stay hidden.
2. Edit **`src/data/cv.ts`** for real experience, education, skills and languages. Empty sections are omitted. Review **`src/pages/about.astro`** for your longer biography and interests.
3. Add genuine Markdown/MDX in **`src/content/`**. Blog and writing are intentionally empty after Stage 1 cleanup. The authoritative schema is **`src/content.config.ts`**; author guidance lives in **`docs/authoring.md`**.
4. Review **`src/data/timeline.ts`** for the vault progress timeline. Do not turn aspirations into verified claims.
5. Put public documents in **`public/vault/`**. Set `site.cvPdf` to a real file such as `/vault/cv/afnan.pdf` to enable the CV download. The CV page also has a browser print action.
6. Update the constants in **`scripts/generate-og.mjs`**, then run `npm run og`. Review `public/favicon.svg` and `public/manifest.webmanifest` when changing identity.
7. Set the deployment environment variable **`SITE_URL=https://your-domain.example`** to your actual public origin. This enables canonical URLs, RSS and the sitemap. Without it, these domain-dependent features are intentionally omitted. The `site.url` field is not a substitute for this build variable.

### Content map

| Directory | What to add | Public route |
| --- | --- | --- |
| `src/content/projects/` | Markdown project, optional cover and case study | `/projects/<id>/` |
| `src/content/blog/` | Markdown article with title, description and publication date | `/blog/<id>/` |
| `src/content/writing/` | Standalone essay, story, poem or research | `/writing/<id>/` |
| `src/content/writing/` | Book overview (`kind: book`, `book` slug), and chapter files sharing that slug with numeric `chapter` | `/writing/book/<book>/` and `/writing/book/<book>/chapter/<chapter>/` |
| `src/content/vault/` | Document metadata, optional `/vault/…` file or external evidence link | `/vault/` and category archives |

Book overviews use `kind: book` and a `book` slug. Chapter files reference that slug and set a numeric `chapter`. Chapter slugs are derived from filenames. Tag/category archives are generated only for populated tags/categories.

### Example: add an article

Create `src/content/blog/my-first-post.md`:

```markdown
---
title: My first post
description: A short summary for readers and search engines.
published: 2026-11-03
tags: [notes]
draft: false
demo: false
---

Your article goes here.
```

### Demo, draft and privacy

- `demo: true`: explicitly labelled sample, noindex and excluded from sitemap. Stage 1 removed all shipped examples. The flag and reusable rendering support remain for backwards compatibility; the flag is not a privacy control.
- `draft: true`: previewable in development but omitted from production pages.
- Anything in `public/` is copied to the production site, **even if only a draft links to it**. Anything in a public Git repository is public. Never put private documents, credentials or confidential drafts here.
- Add only claims and dates you can substantiate. Empty personal sections are deliberate, not missing data to invent.

## Deploy

Any static host that supports Node builds can serve this site:

- Install: `npm ci`
- Build: `npm run build`
- Output directory: `dist`
- Node: 22.12 or newer, compatible with the locked Astro version
- Build environment: `SITE_URL` set to the real HTTPS origin

For a production-style local test:

```sh
SITE_URL=https://your-domain.example npm run build
npm run verify:content
npm run preview
```

Configure the host to serve `404.html` for unknown paths. No adapter, database, form service or server secrets are needed. Contact is an email/social-link page, not a form with an unimplemented backend.

## Design and maintenance

- `src/styles/`: tokens, global styles, components and utilities.
- `src/layouts/BaseLayout.astro`: shared layout and progressive enhancement.
- `src/components/`: navigation, cards, metadata, theme controls and prose.
- `scripts/demo-paths.mjs`: derives demo routes for sitemap filtering.
- `scripts/verify-content.mjs`: checks rendered metadata, headings, IDs, image alt attributes, local links and draft leakage.

Before release, manually check desktop/mobile layouts, keyboard navigation, both themes, reduced motion and CV printing in a real browser. Browser screenshot QA was not completed in the sandbox; system libraries needed by Chromium were unavailable.
