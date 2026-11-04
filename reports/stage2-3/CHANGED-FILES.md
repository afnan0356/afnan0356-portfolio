# Stage 2.3 — complete changed-file inventory

4 November 2026. No commit/push/deploy. This working tree already contained unapproved Stage 2.2 changes. **A diff against HEAD alone is not the Stage 2.3 change list.**

## 1. Incremental Stage 2.3 source/test/tool changes

Byte-compared `src/` and `scripts/` against the pre-edit preserved Stage 2.2 copy at `/tmp/stage23-baseline/`: **28 files**. “Added” here means absent from Stage 2.2, not merely untracked in Git. No source file was deleted.

| File | Stage 2.3 status | Purpose |
| --- | --- | --- |
| `src/components/Footer.astro` | Modified | Compact utility footer, homepage-only signature, readable live social links; component-owned styling. |
| `src/components/ImageViewer.astro` | Modified | Clear mobile scroll guidance; retains native dialog, failure fallback and genuine image. |
| `src/components/PageHeader.astro` | Modified | Content-appropriate heading scale and quiet utility variant. |
| `src/lib/reading.ts` | Modified | Native contents responsive state, lifecycle cleanup and stale-location reset above the article. |
| `src/pages/404.astro` | Modified | Restrained recovery hierarchy without decorative giant numeral. |
| `src/pages/about.astro` | Modified | Essay-first ordering, personal margin note and differentiated interests. |
| `src/pages/blog/index.astro` | Modified | Quiet truthful empty collection, duplicate label removed. |
| `src/pages/contact.astro` | Modified | Ruled 72px destination rows and readable URLs; same eight verified destinations. |
| `src/pages/cv.astro` | Modified | Paper document, corrected phone cascade, concise one-page print spacing. |
| `src/pages/index.astro` | Modified | Composed hero, selected project structure and closing contact, accurate responsive image sizes. |
| `src/pages/projects/[id].astro` | Modified | Native contents disclosure, long-form hierarchy and genuine screenshot framing. |
| `src/pages/projects/index.astro` | Modified | Reverse archive composition and accurate responsive image sizes. |
| `src/pages/vault/category/[category].astro` | Modified | Quiet source-index rows and utility heading. |
| `src/pages/vault/index.astro` | Modified | Restrained library/source labels and differentiated timeline. |
| `src/pages/writing/index.astro` | Modified | Smaller true empty state and restrained existing Blog cross-link. |
| `src/styles/base.css` | Modified | Remove redundant global heading weight; disable print animations/transitions. |
| `src/styles/editorial.css` | Modified | Reading compositions, case model/workflow/decisions, inspector native pan; remove conflicting overrides; force light print scheme over inline bootstrap. |
| `src/styles/home.css` | Modified | Hero/feature/contact rhythm and mobile ordering; delete obsolete faux-browser and duplicate rules. |
| `src/styles/refinement.css` | Modified | Remove obsolete global component overrides and grain styling. |
| `src/styles/tokens.css` | Modified | Quiet independently considered paper/surface palette; obsolete texture token removed. |
| `scripts/browser-stage21-pages.mjs` | Modified | Open native mobile contents before using its links in existing regressions. |
| `scripts/browser-stage22-features.mjs` | Modified | Configurable report destination and actual selected-project h3 assertion. |
| `scripts/browser-stage23-polish.mjs` | Added | 12-combination native controls, reading reset, inspector, contact/footer targets, phone CV and both-theme PDF fixture checks. |
| `scripts/browser-stage23-review.mjs` | Added | Actual 44-view capture matrix with image-paint preparation and configurable review phase/routes. |
| `scripts/browser-stage23.mjs` | Added | Run inherited browser suites at all requested widths without overwriting historical evidence. |
| `scripts/test-stage1-interactions.mjs` | Modified | Minimum-44px source assertions accept larger Contact targets and footer minimum-height spelling/order. |
| `scripts/verify-stage22.mjs` | Modified | Configurable stage-specific artifact output; existing authenticity checks retained. |
| `scripts/verify-stage23.mjs` | Added | SHA preservation of 89 protected baseline files and focused design structure assertions. |

## 2. Preserved Stage 2.2 boundaries

89 protected files are hash-identical to the pre-edit baseline: all baseline report artifacts, factual content/data, public assets, site configuration/content configuration, dependency manifests and GSAP `motion.ts`. [Manifest](baseline-hashes.json) · [verification](preservation-checks.json). Existing Stage 2.2 modifications to those files relative to HEAD are intentional inherited work, not Stage 2.3 changes. No new project dependency. External Chromium/Playwright and PyMuPDF QA tooling remain outside the repository.

## 3. Every Stage 2.3 review artifact

All paths below are newly added under `reports/stage2-3/`. This includes the baseline and intermediate captures as review evidence, not public website assets. `before/` is the genuine pre-edit baseline; `group1/`, `group2/`, `group3/` retain intermediate reviews; `after/` is final evidence. PNG files are actual captures or explicitly named PDF rasterizations.

```text
reports/stage2-3/BEFORE-AFTER.md
reports/stage2-3/CHANGED-FILES.md
reports/stage2-3/DESIGN-AUDIT.md
reports/stage2-3/REPORT.md
reports/stage2-3/after-review.json
reports/stage2-3/after/404.html-dark-1440.png
reports/stage2-3/after/404.html-dark-390.png
reports/stage2-3/after/404.html-light-1440.png
reports/stage2-3/after/404.html-light-390.png
reports/stage2-3/after/about-dark-1440.png
reports/stage2-3/after/about-dark-390.png
reports/stage2-3/after/about-light-1440.png
reports/stage2-3/after/about-light-390.png
reports/stage2-3/after/blog-dark-1440.png
reports/stage2-3/after/blog-dark-390.png
reports/stage2-3/after/blog-light-1440.png
reports/stage2-3/after/blog-light-390.png
reports/stage2-3/after/case-decisions-dark-1440.png
reports/stage2-3/after/case-decisions-light-390.png
reports/stage2-3/after/case-information-architecture-dark-1440.png
reports/stage2-3/after/case-information-architecture-light-390.png
reports/stage2-3/after/case-workflow-dark-1440.png
reports/stage2-3/after/case-workflow-light-390.png
reports/stage2-3/after/contact-dark-1440.png
reports/stage2-3/after/contact-dark-390.png
reports/stage2-3/after/contact-light-1440.png
reports/stage2-3/after/contact-light-390.png
reports/stage2-3/after/cv-dark-1440.png
reports/stage2-3/after/cv-dark-390.png
reports/stage2-3/after/cv-light-1440.png
reports/stage2-3/after/cv-light-390.png
reports/stage2-3/after/cv-print-dark.pdf
reports/stage2-3/after/cv-print-dark.png
reports/stage2-3/after/cv-print-light.pdf
reports/stage2-3/after/cv-print-light.png
reports/stage2-3/after/cv-print.pdf
reports/stage2-3/after/feature-checks.json
reports/stage2-3/after/home-dark-1440.png
reports/stage2-3/after/home-dark-390.png
reports/stage2-3/after/home-light-1440.png
reports/stage2-3/after/home-light-390.png
reports/stage2-3/after/home-nojs-dark-1440.png
reports/stage2-3/after/image-inspector-dark-1440.png
reports/stage2-3/after/image-inspector-light-390.png
reports/stage2-3/after/interaction-checks.json
reports/stage2-3/after/nyayota-architecture-dark-1440.png
reports/stage2-3/after/nyayota-footer-dark-1440.png
reports/stage2-3/after/nyayota-workflow-dark-1440.png
reports/stage2-3/after/page-checks.json
reports/stage2-3/after/performance-smoke.json
reports/stage2-3/after/projects-dark-1440.png
reports/stage2-3/after/projects-dark-390.png
reports/stage2-3/after/projects-light-1440.png
reports/stage2-3/after/projects-light-390.png
reports/stage2-3/after/projects-nyayota-dark-1440.png
reports/stage2-3/after/projects-nyayota-dark-390.png
reports/stage2-3/after/projects-nyayota-light-1440.png
reports/stage2-3/after/projects-nyayota-light-390.png
reports/stage2-3/after/vault-category-evidence-dark-1440.png
reports/stage2-3/after/vault-category-evidence-dark-390.png
reports/stage2-3/after/vault-category-evidence-light-1440.png
reports/stage2-3/after/vault-category-evidence-light-390.png
reports/stage2-3/after/vault-dark-1440.png
reports/stage2-3/after/vault-dark-390.png
reports/stage2-3/after/vault-light-1440.png
reports/stage2-3/after/vault-light-390.png
reports/stage2-3/after/viewport-checks.json
reports/stage2-3/after/writing-dark-1440.png
reports/stage2-3/after/writing-dark-390.png
reports/stage2-3/after/writing-light-1440.png
reports/stage2-3/after/writing-light-390.png
reports/stage2-3/authenticity-checks.json
reports/stage2-3/baseline-hashes.json
reports/stage2-3/before-review.json
reports/stage2-3/before/404.html-dark-1440.png
reports/stage2-3/before/404.html-dark-390.png
reports/stage2-3/before/404.html-light-1440.png
reports/stage2-3/before/404.html-light-390.png
reports/stage2-3/before/about-dark-1440.png
reports/stage2-3/before/about-dark-390.png
reports/stage2-3/before/about-light-1440.png
reports/stage2-3/before/about-light-390.png
reports/stage2-3/before/blog-dark-1440.png
reports/stage2-3/before/blog-dark-390.png
reports/stage2-3/before/blog-light-1440.png
reports/stage2-3/before/blog-light-390.png
reports/stage2-3/before/contact-dark-1440.png
reports/stage2-3/before/contact-dark-390.png
reports/stage2-3/before/contact-light-1440.png
reports/stage2-3/before/contact-light-390.png
reports/stage2-3/before/cv-dark-1440.png
reports/stage2-3/before/cv-dark-390.png
reports/stage2-3/before/cv-light-1440.png
reports/stage2-3/before/cv-light-390.png
reports/stage2-3/before/home-dark-1440.png
reports/stage2-3/before/home-dark-390.png
reports/stage2-3/before/home-light-1440.png
reports/stage2-3/before/home-light-390.png
reports/stage2-3/before/projects-dark-1440.png
reports/stage2-3/before/projects-dark-390.png
reports/stage2-3/before/projects-light-1440-viewport.png
reports/stage2-3/before/projects-light-1440.png
reports/stage2-3/before/projects-light-390.png
reports/stage2-3/before/projects-nyayota-dark-1440.png
reports/stage2-3/before/projects-nyayota-dark-390.png
reports/stage2-3/before/projects-nyayota-light-1440.png
reports/stage2-3/before/projects-nyayota-light-390.png
reports/stage2-3/before/vault-category-evidence-dark-1440.png
reports/stage2-3/before/vault-category-evidence-dark-390.png
reports/stage2-3/before/vault-category-evidence-light-1440.png
reports/stage2-3/before/vault-category-evidence-light-390.png
reports/stage2-3/before/vault-dark-1440.png
reports/stage2-3/before/vault-dark-390.png
reports/stage2-3/before/vault-light-1440.png
reports/stage2-3/before/vault-light-390.png
reports/stage2-3/before/writing-dark-1440.png
reports/stage2-3/before/writing-dark-390.png
reports/stage2-3/before/writing-light-1440.png
reports/stage2-3/before/writing-light-390.png
reports/stage2-3/browser-captures.log
reports/stage2-3/browser-polish.log
reports/stage2-3/browser-regressions.log
reports/stage2-3/commands-and-results.txt
reports/stage2-3/dependency-audit.json
reports/stage2-3/fragment-checks.json
reports/stage2-3/group1-home-tests.log
reports/stage2-3/group1-review.json
reports/stage2-3/group1/home-dark-1440.png
reports/stage2-3/group1/home-dark-390.png
reports/stage2-3/group1/home-light-1440.png
reports/stage2-3/group1/home-light-390.png
reports/stage2-3/group1/interaction-checks.json
reports/stage2-3/group1/viewport-checks.json
reports/stage2-3/group2-review.json
reports/stage2-3/group2/about-dark-1440.png
reports/stage2-3/group2/about-dark-390.png
reports/stage2-3/group2/about-light-1440.png
reports/stage2-3/group2/about-light-390.png
reports/stage2-3/group2/projects-dark-1440.png
reports/stage2-3/group2/projects-dark-390.png
reports/stage2-3/group2/projects-light-1440.png
reports/stage2-3/group2/projects-light-390.png
reports/stage2-3/group2/projects-nyayota-dark-1440.png
reports/stage2-3/group2/projects-nyayota-dark-390.png
reports/stage2-3/group2/projects-nyayota-light-1440.png
reports/stage2-3/group2/projects-nyayota-light-390.png
reports/stage2-3/group3-review.json
reports/stage2-3/group3/404.html-dark-1440.png
reports/stage2-3/group3/404.html-dark-390.png
reports/stage2-3/group3/404.html-light-1440.png
reports/stage2-3/group3/404.html-light-390.png
reports/stage2-3/group3/blog-dark-1440.png
reports/stage2-3/group3/blog-dark-390.png
reports/stage2-3/group3/blog-light-1440.png
reports/stage2-3/group3/blog-light-390.png
reports/stage2-3/group3/contact-dark-1440.png
reports/stage2-3/group3/contact-dark-390.png
reports/stage2-3/group3/contact-light-1440.png
reports/stage2-3/group3/contact-light-390.png
reports/stage2-3/group3/cv-dark-1440.png
reports/stage2-3/group3/cv-dark-390.png
reports/stage2-3/group3/cv-light-1440.png
reports/stage2-3/group3/cv-light-390.png
reports/stage2-3/group3/vault-dark-1440.png
reports/stage2-3/group3/vault-dark-390.png
reports/stage2-3/group3/vault-light-1440.png
reports/stage2-3/group3/vault-light-390.png
reports/stage2-3/group3/writing-dark-1440.png
reports/stage2-3/group3/writing-dark-390.png
reports/stage2-3/group3/writing-light-1440.png
reports/stage2-3/group3/writing-light-390.png
reports/stage2-3/polish-checks.json
reports/stage2-3/preservation-checks.json
reports/stage2-3/print-checks.json
```

Total Stage 2.3 review files: **174**.

## 4. Cumulative current dirty Git inventory (Stage 2.2 + Stage 2.3)

This is included for completeness, not attribution. `M` = tracked file modified against HEAD; `??` = untracked file. No staged/committed release is implied. Section 1, not this cumulative list, identifies incremental Stage 2.3 source edits.

```text
 M public/manifest.webmanifest
 M public/og/default.png
 M scripts/browser-stage2.mjs
 M scripts/browser-stage21-pages.mjs
 M scripts/browser-stage21-performance.mjs
 M scripts/generate-og.mjs
 M scripts/test-stage1-interactions.mjs
 M scripts/verify-stage1.mjs
 M scripts/verify-stage21.mjs
 M src/components/Footer.astro
 M src/components/PageHeader.astro
 M src/components/Seo.astro
 M src/config/site.ts
 M src/content.config.ts
 M src/content/projects/nyayota.md
 M src/content/vault/nyayota-source.md
 M src/content/vault/this-website.md
 M src/data/cv.ts
 M src/data/timeline.ts
 M src/lib/content.ts
 M src/lib/reading.ts
 M src/pages/404.astro
 M src/pages/about.astro
 M src/pages/blog/index.astro
 M src/pages/contact.astro
 M src/pages/cv.astro
 M src/pages/index.astro
 M src/pages/projects/[id].astro
 M src/pages/projects/index.astro
 M src/pages/vault/category/[category].astro
 M src/pages/vault/index.astro
 M src/pages/writing/index.astro
 M src/styles/base.css
 M src/styles/editorial.css
 M src/styles/home.css
 M src/styles/refinement.css
 M src/styles/tokens.css
?? reports/stage2-2/AUDIT.md
?? reports/stage2-2/CHANGED-FILES.md
?? reports/stage2-2/REPORT.md
?? reports/stage2-2/about-dark-1440.png
?? reports/stage2-2/about-light-390.png
?? reports/stage2-2/authenticity-checks.json
?? reports/stage2-2/blog-light-390.png
?? reports/stage2-2/browser-features.log
?? reports/stage2-2/browser-regressions.log
?? reports/stage2-2/commands-and-results.txt
?? reports/stage2-2/contact-light-390.png
?? reports/stage2-2/cv-light-390.png
?? reports/stage2-2/cv-print.pdf
?? reports/stage2-2/dependency-audit.json
?? reports/stage2-2/feature-checks.json
?? reports/stage2-2/fragment-checks.json
?? reports/stage2-2/home-dark-1440.png
?? reports/stage2-2/home-dark-390.png
?? reports/stage2-2/home-light-1440.png
?? reports/stage2-2/home-light-390.png
?? reports/stage2-2/home-nojs-dark-1440.png
?? reports/stage2-2/image-inspector-dark-1440.png
?? reports/stage2-2/image-inspector-light-390.png
?? reports/stage2-2/interaction-checks.json
?? reports/stage2-2/nyayota-architecture-dark-1440.png
?? reports/stage2-2/nyayota-footer-dark-1440.png
?? reports/stage2-2/nyayota-workflow-dark-1440.png
?? reports/stage2-2/page-checks.json
?? reports/stage2-2/performance-smoke.json
?? reports/stage2-2/projects-dark-1440.png
?? reports/stage2-2/projects-nyayota-dark-1440.png
?? reports/stage2-2/projects-nyayota-light-390.png
?? reports/stage2-2/vault-dark-1440.png
?? reports/stage2-2/viewport-checks.json
?? reports/stage2-2/writing-light-390.png
?? reports/stage2-3/BEFORE-AFTER.md
?? reports/stage2-3/CHANGED-FILES.md
?? reports/stage2-3/DESIGN-AUDIT.md
?? reports/stage2-3/REPORT.md
?? reports/stage2-3/after-review.json
?? reports/stage2-3/after/404.html-dark-1440.png
?? reports/stage2-3/after/404.html-dark-390.png
?? reports/stage2-3/after/404.html-light-1440.png
?? reports/stage2-3/after/404.html-light-390.png
?? reports/stage2-3/after/about-dark-1440.png
?? reports/stage2-3/after/about-dark-390.png
?? reports/stage2-3/after/about-light-1440.png
?? reports/stage2-3/after/about-light-390.png
?? reports/stage2-3/after/blog-dark-1440.png
?? reports/stage2-3/after/blog-dark-390.png
?? reports/stage2-3/after/blog-light-1440.png
?? reports/stage2-3/after/blog-light-390.png
?? reports/stage2-3/after/case-decisions-dark-1440.png
?? reports/stage2-3/after/case-decisions-light-390.png
?? reports/stage2-3/after/case-information-architecture-dark-1440.png
?? reports/stage2-3/after/case-information-architecture-light-390.png
?? reports/stage2-3/after/case-workflow-dark-1440.png
?? reports/stage2-3/after/case-workflow-light-390.png
?? reports/stage2-3/after/contact-dark-1440.png
?? reports/stage2-3/after/contact-dark-390.png
?? reports/stage2-3/after/contact-light-1440.png
?? reports/stage2-3/after/contact-light-390.png
?? reports/stage2-3/after/cv-dark-1440.png
?? reports/stage2-3/after/cv-dark-390.png
?? reports/stage2-3/after/cv-light-1440.png
?? reports/stage2-3/after/cv-light-390.png
?? reports/stage2-3/after/cv-print-dark.pdf
?? reports/stage2-3/after/cv-print-dark.png
?? reports/stage2-3/after/cv-print-light.pdf
?? reports/stage2-3/after/cv-print-light.png
?? reports/stage2-3/after/cv-print.pdf
?? reports/stage2-3/after/feature-checks.json
?? reports/stage2-3/after/home-dark-1440.png
?? reports/stage2-3/after/home-dark-390.png
?? reports/stage2-3/after/home-light-1440.png
?? reports/stage2-3/after/home-light-390.png
?? reports/stage2-3/after/home-nojs-dark-1440.png
?? reports/stage2-3/after/image-inspector-dark-1440.png
?? reports/stage2-3/after/image-inspector-light-390.png
?? reports/stage2-3/after/interaction-checks.json
?? reports/stage2-3/after/nyayota-architecture-dark-1440.png
?? reports/stage2-3/after/nyayota-footer-dark-1440.png
?? reports/stage2-3/after/nyayota-workflow-dark-1440.png
?? reports/stage2-3/after/page-checks.json
?? reports/stage2-3/after/performance-smoke.json
?? reports/stage2-3/after/projects-dark-1440.png
?? reports/stage2-3/after/projects-dark-390.png
?? reports/stage2-3/after/projects-light-1440.png
?? reports/stage2-3/after/projects-light-390.png
?? reports/stage2-3/after/projects-nyayota-dark-1440.png
?? reports/stage2-3/after/projects-nyayota-dark-390.png
?? reports/stage2-3/after/projects-nyayota-light-1440.png
?? reports/stage2-3/after/projects-nyayota-light-390.png
?? reports/stage2-3/after/vault-category-evidence-dark-1440.png
?? reports/stage2-3/after/vault-category-evidence-dark-390.png
?? reports/stage2-3/after/vault-category-evidence-light-1440.png
?? reports/stage2-3/after/vault-category-evidence-light-390.png
?? reports/stage2-3/after/vault-dark-1440.png
?? reports/stage2-3/after/vault-dark-390.png
?? reports/stage2-3/after/vault-light-1440.png
?? reports/stage2-3/after/vault-light-390.png
?? reports/stage2-3/after/viewport-checks.json
?? reports/stage2-3/after/writing-dark-1440.png
?? reports/stage2-3/after/writing-dark-390.png
?? reports/stage2-3/after/writing-light-1440.png
?? reports/stage2-3/after/writing-light-390.png
?? reports/stage2-3/authenticity-checks.json
?? reports/stage2-3/baseline-hashes.json
?? reports/stage2-3/before-review.json
?? reports/stage2-3/before/404.html-dark-1440.png
?? reports/stage2-3/before/404.html-dark-390.png
?? reports/stage2-3/before/404.html-light-1440.png
?? reports/stage2-3/before/404.html-light-390.png
?? reports/stage2-3/before/about-dark-1440.png
?? reports/stage2-3/before/about-dark-390.png
?? reports/stage2-3/before/about-light-1440.png
?? reports/stage2-3/before/about-light-390.png
?? reports/stage2-3/before/blog-dark-1440.png
?? reports/stage2-3/before/blog-dark-390.png
?? reports/stage2-3/before/blog-light-1440.png
?? reports/stage2-3/before/blog-light-390.png
?? reports/stage2-3/before/contact-dark-1440.png
?? reports/stage2-3/before/contact-dark-390.png
?? reports/stage2-3/before/contact-light-1440.png
?? reports/stage2-3/before/contact-light-390.png
?? reports/stage2-3/before/cv-dark-1440.png
?? reports/stage2-3/before/cv-dark-390.png
?? reports/stage2-3/before/cv-light-1440.png
?? reports/stage2-3/before/cv-light-390.png
?? reports/stage2-3/before/home-dark-1440.png
?? reports/stage2-3/before/home-dark-390.png
?? reports/stage2-3/before/home-light-1440.png
?? reports/stage2-3/before/home-light-390.png
?? reports/stage2-3/before/projects-dark-1440.png
?? reports/stage2-3/before/projects-dark-390.png
?? reports/stage2-3/before/projects-light-1440-viewport.png
?? reports/stage2-3/before/projects-light-1440.png
?? reports/stage2-3/before/projects-light-390.png
?? reports/stage2-3/before/projects-nyayota-dark-1440.png
?? reports/stage2-3/before/projects-nyayota-dark-390.png
?? reports/stage2-3/before/projects-nyayota-light-1440.png
?? reports/stage2-3/before/projects-nyayota-light-390.png
?? reports/stage2-3/before/vault-category-evidence-dark-1440.png
?? reports/stage2-3/before/vault-category-evidence-dark-390.png
?? reports/stage2-3/before/vault-category-evidence-light-1440.png
?? reports/stage2-3/before/vault-category-evidence-light-390.png
?? reports/stage2-3/before/vault-dark-1440.png
?? reports/stage2-3/before/vault-dark-390.png
?? reports/stage2-3/before/vault-light-1440.png
?? reports/stage2-3/before/vault-light-390.png
?? reports/stage2-3/before/writing-dark-1440.png
?? reports/stage2-3/before/writing-dark-390.png
?? reports/stage2-3/before/writing-light-1440.png
?? reports/stage2-3/before/writing-light-390.png
?? reports/stage2-3/browser-captures.log
?? reports/stage2-3/browser-polish.log
?? reports/stage2-3/browser-regressions.log
?? reports/stage2-3/commands-and-results.txt
?? reports/stage2-3/dependency-audit.json
?? reports/stage2-3/fragment-checks.json
?? reports/stage2-3/group1-home-tests.log
?? reports/stage2-3/group1-review.json
?? reports/stage2-3/group1/home-dark-1440.png
?? reports/stage2-3/group1/home-dark-390.png
?? reports/stage2-3/group1/home-light-1440.png
?? reports/stage2-3/group1/home-light-390.png
?? reports/stage2-3/group1/interaction-checks.json
?? reports/stage2-3/group1/viewport-checks.json
?? reports/stage2-3/group2-review.json
?? reports/stage2-3/group2/about-dark-1440.png
?? reports/stage2-3/group2/about-dark-390.png
?? reports/stage2-3/group2/about-light-1440.png
?? reports/stage2-3/group2/about-light-390.png
?? reports/stage2-3/group2/projects-dark-1440.png
?? reports/stage2-3/group2/projects-dark-390.png
?? reports/stage2-3/group2/projects-light-1440.png
?? reports/stage2-3/group2/projects-light-390.png
?? reports/stage2-3/group2/projects-nyayota-dark-1440.png
?? reports/stage2-3/group2/projects-nyayota-dark-390.png
?? reports/stage2-3/group2/projects-nyayota-light-1440.png
?? reports/stage2-3/group2/projects-nyayota-light-390.png
?? reports/stage2-3/group3-review.json
?? reports/stage2-3/group3/404.html-dark-1440.png
?? reports/stage2-3/group3/404.html-dark-390.png
?? reports/stage2-3/group3/404.html-light-1440.png
?? reports/stage2-3/group3/404.html-light-390.png
?? reports/stage2-3/group3/blog-dark-1440.png
?? reports/stage2-3/group3/blog-dark-390.png
?? reports/stage2-3/group3/blog-light-1440.png
?? reports/stage2-3/group3/blog-light-390.png
?? reports/stage2-3/group3/contact-dark-1440.png
?? reports/stage2-3/group3/contact-dark-390.png
?? reports/stage2-3/group3/contact-light-1440.png
?? reports/stage2-3/group3/contact-light-390.png
?? reports/stage2-3/group3/cv-dark-1440.png
?? reports/stage2-3/group3/cv-dark-390.png
?? reports/stage2-3/group3/cv-light-1440.png
?? reports/stage2-3/group3/cv-light-390.png
?? reports/stage2-3/group3/vault-dark-1440.png
?? reports/stage2-3/group3/vault-dark-390.png
?? reports/stage2-3/group3/vault-light-1440.png
?? reports/stage2-3/group3/vault-light-390.png
?? reports/stage2-3/group3/writing-dark-1440.png
?? reports/stage2-3/group3/writing-dark-390.png
?? reports/stage2-3/group3/writing-light-1440.png
?? reports/stage2-3/group3/writing-light-390.png
?? reports/stage2-3/polish-checks.json
?? reports/stage2-3/preservation-checks.json
?? reports/stage2-3/print-checks.json
?? scripts/browser-stage22-features.mjs
?? scripts/browser-stage22.mjs
?? scripts/browser-stage23-polish.mjs
?? scripts/browser-stage23-review.mjs
?? scripts/browser-stage23.mjs
?? scripts/test-home-work.mjs
?? scripts/verify-stage22.mjs
?? scripts/verify-stage23.mjs
?? src/components/CaseDiagram.astro
?? src/components/ImageViewer.astro
?? src/lib/home-work.ts
?? src/lib/image-viewer.ts
```

[Return to report](REPORT.md)
