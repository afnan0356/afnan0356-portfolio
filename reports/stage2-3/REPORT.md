# Portfolio V2 — Stage 2.3 review

**4 November 2026 · local, unapproved work · ready for review, not released**

Continued the existing dirty Stage 2.2 implementation on `arena/1ace11cb-afnan0356-portfolio`, HEAD `c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff`. No reset, branch switch, commit, push, pull request, merge, deployment or production/settings change. The local preview serves the final production-origin build on port 4321; building with `SITE_URL` does not deploy anything.

## What changed, and why

The aim was a more composed personal project notebook—not more content, effects or features. The existing warm near-black, ivory and vermilion identity and three font families remain.

| Area | Weakness found in rendered Stage 2.2 | Stage 2.3 correction |
| --- | --- | --- |
| Home | Unbalanced offsets, loose vertical rhythm, repeated Nyayota emphasis and simulated browser chrome | More deliberate name/italic headline relationship, adjacent asymmetrical project image/text, genuine image without fake browser controls, quieter learning section and composed contact close |
| Light theme | Texture competed with the type and genuine interface | Untextured warm paper, deliberate surface separation, darker accent and readable metadata—not a simple inversion |
| About | Facts rail felt like technical documentation and preceded the introduction on phones | Essay first, compact right-hand margin note, open interest columns, no invented biography |
| Projects | Too similar to the homepage feature; oversized repeated header treatment | Reverse image/text composition, purposeful screenshot proportions, clear primary project and quieter portfolio-source note |
| Nyayota | Repeated orange headings, little compositional variation, long mobile contents list | Numbered ink headings, approximately 64ch reading measure, differentiated workflow/decisions/tools, sticky desktop contents and native mobile disclosure |
| Screenshot inspection | Enlarged mobile image still behaved like a small thumbnail | Genuine larger image with native keyboard/touch scrolling and explicit guidance; no zoom library; existing accessible dialog/fallback preserved |
| CV | Website styling rather than a considered document; mobile cascade conflict | Quiet paper frame, precise hierarchy and single-column phone skills; print-only spacing keeps the current concise CV on one A4 page |
| Contact | Small destination metadata and repeated boxed icons | Legible ruled destination rows with 72px minimum height and clear URLs; all eight verified destinations retained |
| Vault/category | Source records competed with dashboard-like furniture | Restrained source index, lighter dividers, differentiated learning timeline; no new evidence claims |
| Blog/Writing | Empty collections looked like feature launches | Smaller quiet headers, honest empty states and existing contextual links; no manufactured entries |
| Footer/404 | Repeated oversized signature and decorative emphasis | Home-only restrained signature, compact utility footer elsewhere; direct, quieter 404 recovery |

No content/data entries, assets, site configuration, dependency manifests or GSAP engine were changed relative to the preserved Stage 2.2 baseline. Existing AI-assisted development distinctions and legal/implementation limitations remain intact. No qualifications, jobs, publications, adoption, impact or legal accuracy claims were invented. The existing project screenshot is reused honestly; the information-architecture model remains explicitly conceptual, not a screenshot or complete legal schema.

### Rendered follow-ups—not source-only approval

Each focused group was built, captured and inspected before moving on; see [design audit](DESIGN-AUDIT.md). Inspection caught and corrected a missed home heading replacement, a duplicate Blog label and a real CV mobile cascade-order bug.

The final PDF review caught two additional issues that DOM-only checks had missed: an orphan update line on page two and dark print margins caused by the theme bootstrap's inline `color-scheme`. Print-only spacing now keeps the current content together; the print scheme explicitly overrides that inline value, and print transitions/animations are disabled. Actual PDFs from both themes were rasterized and reviewed. Both are one page, with white margins and the update line on page one. Screen text size was not reduced.

### CSS and motion ownership

Removed obsolete faux-browser/grain rules and duplicate footer/CV/global overrides rather than layering another stylesheet over them. Footer, PageHeader and CV own their component typography/layout. Shared case-reading rules stay in `editorial.css`; supported unpublished book/blog templates remain available. See the audit for specific consolidation decisions.

GSAP remains the primary animation system, unchanged. Reading-location state still uses IntersectionObserver, not a new scroll listener. Mobile contents use native `details`; inspection uses the existing native dialog and native scrolling. No client framework, scroll hijacking, backend, analytics, oversized image or project dependency was added. Reduced-motion and no-JavaScript content remain visible.

## Actual screenshot evidence

- [Before/after index: all 11 routes, both themes, desktop and phone](BEFORE-AFTER.md)
- Home: [dark desktop](after/home-dark-1440.png), [dark phone](after/home-dark-390.png), [light desktop](after/home-light-1440.png), [light phone](after/home-light-390.png)
- Nyayota: [dark desktop](after/projects-nyayota-dark-1440.png), [dark phone](after/projects-nyayota-dark-390.png), [light desktop](after/projects-nyayota-light-1440.png), [light phone](after/projects-nyayota-light-390.png)
- Case details: [desktop information model](after/case-information-architecture-dark-1440.png), [phone AI-assisted workflow](after/case-workflow-light-390.png), [phone decisions](after/case-decisions-light-390.png)
- CV: [phone](after/cv-dark-390.png), [dark-origin PDF](after/cv-print-dark.pdf), [light-origin PDF](after/cv-print-light.pdf), [dark-origin print rendering](after/cv-print-dark.png), [light-origin print rendering](after/cv-print-light.png)
- Inspector: [desktop dark](after/image-inspector-dark-1440.png), [phone light](after/image-inspector-light-390.png)

The final review captured **44 full-page views** (11 routes × two themes × 1440/390px), plus focused case, inspector, no-JS and print evidence. Six requested widths are covered by browser tests, not six-width screenshots of every route. The initial light Projects full-page image had a browser paint artifact; its genuine pre-edit scrolled viewport is separately linked in the comparison index. It is not represented as a website defect.

### Less repetition, not more page length

Measured full-page heights in the same dark 1440px capture configuration; these are layout observations, not speed or conversion metrics:

| Page | Stage 2.2 baseline | Final Stage 2.3 |
| --- | ---: | ---: |
| Home | 4,199px | 3,354px |
| About | 3,113px | 2,617px |
| Projects | 2,498px | 1,782px |
| CV | 2,275px | 1,894px |
| Contact | 2,084px | 1,550px |
| Nyayota | 8,420px | 8,403px |

The case study intentionally retains its long-form factual material. Its improvement is reading structure/navigation, not indiscriminate shortening.

## Validation

Exact commands, output and exit codes: [commands-and-results.txt](commands-and-results.txt). Final pipeline reran after the print corrections.

| Check | Final result |
| --- | --- |
| `npm run check` | 64 files; 0 errors, 0 diagnostic warnings, 0 hints |
| `node --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs` | 16/16 pass |
| `env -u SITE_URL npm run build` | Pass; default/unconfigured-origin build |
| `SITE_URL=https://afnan0356.vercel.app npm run build` | Pass; production-origin **local** build |
| `npm run verify:content` and `node scripts/verify-stage1.mjs` | Pass after each build; 148 internal links without origin / 159 with origin |
| `REVIEW_REPORT_PATH=reports/stage2-3 node scripts/verify-stage21.mjs` | Pass after each build; 11 HTML pages, 62 internal fragment links |
| `REVIEW_REPORT_PATH=reports/stage2-3 node scripts/verify-stage22.mjs` | Pass after each build; existing authenticity/structure checks |
| `node scripts/verify-stage23.mjs` | Pass after each build; 89 protected baseline files unchanged |
| `node scripts/browser-stage23.mjs` | Pass; complete earlier core/interior/performance/feature suites, outputs redirected to this stage |
| `node scripts/browser-stage23-polish.mjs` | Pass; 12 width/theme combinations plus real one-page PDF checks in both themes |
| `node scripts/browser-stage23-review.mjs` | Pass; 44 final full-page captures |
| `git diff --check` | Pass |
| `git diff --exit-code HEAD -- package.json package-lock.json` | Pass; dependency manifests unchanged even against HEAD |
| `npm ls --depth=0` | Pass |
| `npm audit --json` | Exit 1: four inherited findings; no fixes applied |

The check/build log contains expected empty Blog/Writing collection notices; these do not mean articles were invented or that Astro diagnostics reported errors.

Browser coverage: **320, 360, 390, 768, 1024 and 1440px**, both themes; 120 interior-page combinations plus homepage matrix. Tested dark default despite light OS, persisted manual theme, mobile menu/focus/Escape/resize, repeated Astro setup/cleanup, dynamic/load-time reduced motion, no-JS content/navigation, failed motion-module visibility, section jumps/reading reset, Contact clipboard feedback, print action, native contents keyboard operation, screenshot inspector load/failure/unsupported-dialog fallback, keyboard containment/pan/focus return, and all eight Contact destinations. The focused suite also measures all eight footer social targets at ≥44px and verifies one-column phone CV skills.

An old source-regex unit test required the exact previous `2.75rem` Contact row and exact property spelling/order for footer height. It was updated to assert **at least 44px**, not to shrink the new 72px row or weaken the accessibility requirement. Source assertions are explicitly not a substitute for rendered hitbox checks.

Evidence files: [browser transcript](browser-regressions.log), [focused transcript](browser-polish.log), [page matrix](after/page-checks.json), [homepage matrix](after/viewport-checks.json), [focused results](polish-checks.json), [print results](print-checks.json), [protected baseline checks](preservation-checks.json).

## Performance, dependencies and limitations

- No project packages added/removed/upgraded; no package-lock change. Browser tooling and PDF rasterization tooling live externally under `/tmp`, not in the application or its bundle. The PDF renderer version is recorded in `print-checks.json`.
- The [4× CPU-throttled touch smoke](after/performance-smoke.json) observed 360px scroll width at a 360px viewport, zero hidden content, no captured errors, and long tasks of **140ms and 88ms** in the final run. These are observations, not a passed performance budget or Snapdragon 680 emulation. Cached `transferBytes: 0` values are **not** zero-byte network payload claims.
- Ten foreground-token/background contrast samples pass their configured checks; this is not a complete WCAG audit of every surface/state.
- No physical Realme 9i, Android browser, Safari, Firefox, assistive-technology or physical printer certification. Chromium touch/CPU throttling is only a synthetic guardrail. Print fixtures are Chromium A4 with current content/fonts; new CV entries or other printer settings require another review.
- [Dependency audit](dependency-audit.json): one low, one moderate, one high and one critical inherited finding (four total). This remains a separate security task. No forced fix/major Astro migration; no assertion that the findings are harmless or that production exploitation was assessed.
- Nyayota remains lengthy, its genuine screenshot is not a newly captured live-product guarantee, and its deployed assistant environment was not independently verified. Existing factual caveats remain.
- Blog/Writing remain honestly unpublished; the CV deliberately contains no invented education/experience. Further content maturity needs real work/verified facts, not placeholder sections.

## Files and review boundary

[Complete changed-file inventory](CHANGED-FILES.md) distinguishes **28 incremental source/test/tool changes** from the inherited Stage 2.2 working tree, lists every Stage 2.3 review artifact, and records the cumulative dirty Git inventory. Protected content, data, public assets, configuration, dependency manifests, previous reports and GSAP module were verified against their preserved pre-edit hashes.

**This is local review work only. Nothing was committed, pushed, merged or deployed.**
