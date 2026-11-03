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
- Blog: `src/content/blog/`; title, description and publication date are required. Tags generate archive routes only when used.
- Writing: `src/content/writing/`; standalone work uses `kind: piece`. A book overview uses `kind: book` and a `book` slug. Chapters use that same slug and a numeric `chapter`; filename supplies the final URL segment.
- Vault: `src/content/vault/`; public documents go in `public/vault/`, with a `/vault/…` path in frontmatter. Verification labels must reflect actual evidence.

Use Markdown image syntax in `.md` files. Imports and Astro/MDX components must not be written as executable markup in ordinary Markdown. For interactive content use the supported `.mdx` pipeline and verify its rendered output.

Drafts (`draft: true`) are omitted in production. Files under `public/` are always public regardless of draft status; never add confidential material there.

## Development guidance versus public copy

Use `AuthorNote.astro` for optional inline editing guidance. It checks `import.meta.env.DEV` server-side and emits no slot content in a production build. Do not put instructions in visitor-facing empty states, rely on CSS hiding, or introduce another per-page hint flag. Longer guidance belongs here or in the README. Development mode is not access control; do not put secrets in author notes.

The legacy `demo` schema flag, reusable DemoBanner and sitemap discovery helper remain compatible with the content templates. No demo entries ship now. Do not reintroduce samples as real work.

## Local verification

```sh
npm run check
SITE_URL=https://afnan0356.vercel.app npm run build
npm run verify:content
node scripts/verify-stage1.mjs
node --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs
```

Also build without `SITE_URL` to verify domain-optional behavior. Empty blog/writing collections can produce Astro's informational empty-collection warnings; do not create fake publications to silence them.

These commands do not deploy. Vercel settings, environment variables and production deployment require separate approval.
