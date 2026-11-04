# Internal authoring notes

This document is repository guidance, not a public page. Stage 1 removed all template sample publications; it did not remove the publishing systems.

## Personal information

- Edit `src/config/site.ts` for identity, email and official social channels. Do not add an unconfirmed account.
- Edit `src/data/cv.ts` for education, employment, skills and languages. Empty sections are intentionally omitted.
- Replace the CV summary only with approved text, then set `summaryIsPlaceholder: false`. Placeholder summaries never render publicly.
- Edit `src/pages/about.astro` for an approved biography. Education details can be published through the CV without an empty About section.
- Put a public CV PDF in `public/vault/cv/` and set `site.cvPdf` to its `/vault/cv/…` URL. Until then, the web CV supports browser printing.
- Review `src/data/timeline.ts` with the owner before adding achievements, dates or learning plans.

## Publishing

Use the schemas in `src/content.config.ts` for required frontmatter. All four collections remain available:

- Projects: `src/content/projects/`, `featured: true` controls homepage selection. `caseStudy` enables long-form presentation.
- Blog: `src/content/blog/`; title and description are required; a real publication date is required before publishing (drafts may omit it). Tags generate archive routes only when used.
- Writing: `src/content/writing/`; standalone work uses `kind: piece`. A book overview uses `kind: book` and a `book` slug. Chapters use that same slug and a numeric `chapter`; filename supplies the final URL segment.
- Vault: `src/content/vault/`; public documents go in `public/vault/`, with a `/vault/…` path in frontmatter. Verification labels must reflect actual evidence.

Use Markdown image syntax in `.md` files. Imports and Astro/MDX components must not be written as executable markup in ordinary Markdown. For interactive content use the supported `.mdx` pipeline and verify its rendered output.

Drafts (`draft: true`) are omitted in production. Files under `public/` are always public regardless of draft status; never add confidential material there.

## Development guidance versus public copy

Use `AuthorNote.astro` for optional inline editing guidance. It checks `import.meta.env.DEV` server-side and emits no slot content in a production build. Do not put instructions in visitor-facing empty states, rely on CSS hiding, or introduce another per-page hint flag. Longer guidance belongs here or in the README. Development mode is not access control; do not put secrets in author notes.

The legacy `demo` schema flag, reusable DemoBanner and sitemap discovery helper remain compatible with the content templates. No collection demo entries ship now; the explicitly labelled playground samples live separately in `src/data/playground.ts`. Do not present samples as real work.

## Local verification

```sh
npm run check
SITE_URL=https://afnan0356.vercel.app npm run build
npm run verify:content
node scripts/verify-stage1.mjs
node --experimental-strip-types --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs scripts/test-human.mjs
```

Also build without `SITE_URL` to verify domain-optional behavior. Empty blog/writing collections can produce Astro's informational empty-collection warnings; do not create fake publications to silence them.

These commands do not deploy. Vercel settings, environment variables and production deployment require separate approval.

## Human-touch update: editable data and new features

- `src/data/now.ts` owns the monthly check-in. Supply a real `month` and `reading` entry; review `building`/`learning` each time. Nothing automatically advances the date or pretends the note is fresh.
- Import your own photo from `src/assets/` into `now.photo` and write an accurate `photoAlt`. The homepage generates small WebP variants; a missing alt description fails the build when a photo is set. Do not use an invented portrait.
- Optional real, compressed, preferably silent screen recording: put an MP4 in `public/demos/`, set `demoVideo` to its `/demos/…mp4` URL and optionally set `demoPoster` to a small local WebP/AVIF/JPEG/PNG. The default is an explicit placeholder, not a fabricated product demo. Video is not preloaded or autoplayed; reduced motion disables looping and pauses playback when that setting changes. If a recording contains meaningful audio, provide captions/transcript before publishing it.
- `src/data/contact.ts` leaves `endpoint: null` for the email-app draft composer. It never reports that a message was delivered. A public HTTPS form-service endpoint is optional: configure your own real endpoint (not a secret key), review the provider's privacy/cookie policy and test delivery yourself. No form-service SDK, iframe, request or cookie is added by default. Never put confidential information in this repository.
- `src/data/languages.ts` contains the clearly labeled **short Bengali introductions**, not full translations of the detailed English pages. Owner review of wording is encouraged. Add another dictionary to `overviewLanguages` to generate that language's overview routes and switch links through the shared `[language]` templates. Language codes must be valid BCP-47 tags; OG locale values use underscores. Keep the English-detail links and the scope notice honest. Self-hosted Noto Sans Bengali regular (44KB WOFF2, Bengali subset, Fontsource 5.3.0) is in `public/fonts/` with its OFL license; no external font service is contacted.
- `/search/` and `/search.json` use a tiny build-time index across projects, published blog/writing and vault. Drafts and demos are excluded even in development search. Rebuild after publishing. Queries are matched in the browser, not sent to a search provider; the search inputs are disabled without the enhancement, and the search page still lists all public entries without JS. Search is deliberately omitted from the sitemap and marked noindex.

### Draft building notes and real dates

The three new scaffolds are `draft: true`; they are visible only in development and show a draft/noindex notice. They contain only established project/site facts plus explicit `[YOUR …]` prompts, not invented personal anecdotes. They are **not** three published posts.

The schema now lets drafts omit `published`. A non-draft Blog or Writing entry still requires a real publication date. There is no guessed/sentinel publication date. Fill every prompt, review the whole text, add the actual `published` date, then set `draft: false` when you are genuinely ready. Production pages, RSS, search and sitemap omit drafts. Files in a public repository or DEV preview are not private.

Reading time is an estimate computed from body text. Blog/standalone Writing already had it and neighbor navigation; both are retained. Copy-link and optional reading progress are now shared with chapter pages. Projects retain their existing previous/next navigation, shown only when a real neighbor exists.

### CSS-first motion and verification

The newer CSS-first requirement supersedes the previous GSAP implementation: GSAP has been removed from dependencies. `src/lib/motion.ts` only signals CSS classes with IntersectionObserver; `src/styles/human.css` owns the animations. Content is never hidden in anticipation of JS. Hero words run once per tab/session; clearing `sessionStorage['hero-played']` lets you replay for testing. Astro's core ClientRouter supplies page transitions; theme icons use CSS, not a scripted circular reveal. Controllers rebind and clean up on Astro navigation and bfcache restoration.

Current checks (run from the repo root):

```sh
npm run check
npm run build
npm run verify:content
node --experimental-strip-types --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs scripts/test-human.mjs
```

Also build with `SITE_URL=https://afnan0356.vercel.app` and re-run content verification. The controller unit tests were updated to test their new shared module and CSS-first behavior; earlier stage-specific GSAP browser/preservation scripts describe historical acceptance criteria and are not the current animation test suite.

External QA harnesses (not application dependencies) are documented in `reports/human-pass/REPORT.md`: `browser-human.mjs`, `browser-human-accessibility.mjs`, `browser-human-cold-fonts.mjs`, and `lighthouse-human.mjs`. The main browser suite needs a static production build on 4321 and a DEV preview on 4322 for draft-only checks.

## Playground samples (owner-requested demo pass)

The public `/playground/` route is deliberately a **demo gallery**, not a collection of shipped projects. It is noindex and excluded from the sitemap, search index and RSS. `src/data/playground.ts` holds two fictional interface studies and a sample essay, with no publication dates, testimonials or invented personal experience. The homepage preview and Blog/Writing invitations label them as demos. Real project/CV data is unchanged.

- Edit the concepts and sample text in `src/data/playground.ts`.
- `ExperimentArt.astro` builds the illustrated mockups entirely in HTML/CSS; they are not screenshots of real apps.
- `/playground/#reading` has native radio/CSS reading-size controls; project explanations use native disclosures. Both work without JavaScript.
- `/playground/#tool` is a real local word counter. The custom element cleans up listeners on disconnection and reconnects after Astro navigation. Counts use whitespace-delimited words and Unicode code points (not linguistic segmentation or grapheme clusters). No content is stored, logged or transmitted by the tool. The no-JS state is explicit.
- All new motion is inside `prefers-reduced-motion: no-preference`; the shared reduced-motion shutdown remains active.
- Optional browser QA: `node scripts/browser-playground.mjs`, with a production build served at port 4323 (or `TEST_URL`) and external tools configured as described in the previous human-pass report. This is not an application dependency.

No new personal-information placeholders were introduced. The real portrait, monthly reading/date, recording and personal draft prompts from the owner checklist still need owner input.
