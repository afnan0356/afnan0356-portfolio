# Incremental human-touch update inventory

This is relative to the preserved local Stage 2.3 working tree, **not** a misleading cumulative diff against HEAD. Existing unapproved Stage 2.2/2.3 changes remain. No commit/push/deploy.

## Source, documentation, configuration and assets

| File | This update |
| --- | --- |
| `README.md` | Modified |
| `astro.config.mjs` | Modified |
| `docs/authoring.md` | Modified |
| `docs/human-updates.md` | Added |
| `package-lock.json` | Modified |
| `package.json` | Modified |
| `public/fonts/OFL-NotoSansBengali.txt` | Added |
| `public/fonts/noto-sans-bengali-regular.woff2` | Added |
| `public/og/default.png` | Modified |
| `scripts/browser-human-accessibility.mjs` | Added |
| `scripts/browser-human-cold-fonts.mjs` | Added |
| `scripts/browser-human.mjs` | Added |
| `scripts/controller-fixture.mjs` | Added |
| `scripts/generate-og.mjs` | Modified |
| `scripts/lighthouse-human.mjs` | Added |
| `scripts/test-human.mjs` | Added |
| `scripts/test-stage1-interactions.mjs` | Modified |
| `scripts/test-theme.mjs` | Modified |
| `src/components/Byline.astro` | Modified |
| `src/components/ContactForm.astro` | Added |
| `src/components/Footer.astro` | Modified |
| `src/components/Header.astro` | Modified |
| `src/components/LanguageLink.astro` | Added |
| `src/components/LocalizedOverview.astro` | Added |
| `src/components/Now.astro` | Added |
| `src/components/NyayotaDemo.astro` | Added |
| `src/components/PostTools.astro` | Added |
| `src/components/SearchDialog.astro` | Added |
| `src/components/Seo.astro` | Modified |
| `src/components/ThemeScript.astro` | Modified |
| `src/config/site.ts` | Modified |
| `src/content.config.ts` | Modified |
| `src/content/blog/building-a-small-static-site.md` | Added |
| `src/content/blog/checking-ai-assisted-changes.md` | Added |
| `src/content/writing/reading-on-a-small-screen.md` | Added |
| `src/data/contact.ts` | Added |
| `src/data/languages.ts` | Added |
| `src/data/now.ts` | Added |
| `src/layouts/BaseLayout.astro` | Modified |
| `src/lib/content.ts` | Modified |
| `src/lib/motion.ts` | Modified |
| `src/lib/reading.ts` | Modified |
| `src/lib/search-index.ts` | Added |
| `src/lib/search.ts` | Added |
| `src/lib/site.ts` | Added |
| `src/lib/text.ts` | Modified |
| `src/pages/404.astro` | Modified |
| `src/pages/[language]/[page].astro` | Added |
| `src/pages/[language]/index.astro` | Added |
| `src/pages/blog/[id].astro` | Modified |
| `src/pages/blog/index.astro` | Modified |
| `src/pages/blog/tag/[tag].astro` | Modified |
| `src/pages/contact.astro` | Modified |
| `src/pages/cv.astro` | Modified |
| `src/pages/index.astro` | Modified |
| `src/pages/projects/index.astro` | Modified |
| `src/pages/search.astro` | Added |
| `src/pages/search.json.ts` | Added |
| `src/pages/writing/[id].astro` | Modified |
| `src/pages/writing/book/[book].astro` | Modified |
| `src/pages/writing/book/[book]/chapter/[chapter].astro` | Modified |
| `src/pages/writing/index.astro` | Modified |
| `src/styles/base.css` | Modified |
| `src/styles/home.css` | Modified |
| `src/styles/human.css` | Added |
| `src/styles/tokens.css` | Modified |
| `src/styles/utilities.css` | Modified |

**67 incremental files** outside this review folder. README/config/OG/font entries are explicit changes in this task; src/scripts/docs/manifests were byte-compared with the pre-edit snapshot.

## Review artifacts (not website payloads)

```text
reports/human-pass/CHANGED-FILES.md
reports/human-pass/REPORT.md
reports/human-pass/accessibility.json
reports/human-pass/accessibility.log
reports/human-pass/bangla-light-390.png
reports/human-pass/browser-checks.json
reports/human-pass/browser.log
reports/human-pass/cold-fonts.json
reports/human-pass/cold-fonts.log
reports/human-pass/commands-and-results.txt
reports/human-pass/contact-dark-1440.png
reports/human-pass/contact-light-390.png
reports/human-pass/dependency-audit.json
reports/human-pass/draft-note-390.png
reports/human-pass/home-dark-1440.png
reports/human-pass/home-light-390.png
reports/human-pass/lighthouse.html
reports/human-pass/lighthouse.json
reports/human-pass/lighthouse.log
reports/human-pass/preservation.json
reports/human-pass/search-dark-1440.png
reports/human-pass/search-light-390.png
```

No previous report folder was overwritten. Existing factual project/Vault content, CV data, timeline and genuine project screenshot assets remain unchanged relative to the pre-edit snapshot. New drafts are intentionally separate files. GSAP removal and the schema change for undated drafts are deliberate requirements of the newer user request.
