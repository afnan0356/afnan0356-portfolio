# Portfolio V2 — Stage 2.1 review

3 November 2026. **Local refinement for review; not approved for release.**

Branch: `arena/a0eb2c6d-afnan0356-portfolio`; HEAD and local main remain `ec692c7698f452b7fefbea89244a69b3ef0ed24d`. Stage 2 and Stage 2.1 are uncommitted worktree changes. No commit, push, PR, merge, deployment, GitHub setting or Vercel setting change was performed. Production was not modified. The sandbox production-build preview is on port **4321**.

## 1. Design audit → meaningful changes

See [the pre-edit audit](AUDIT.md) for the page inventory, problems and factual boundaries. Every page/template was inspected; empty collections were not populated with invented entries.

- **A person before a slogan.** The homepage now introduces “Md. Afnan. / Building for readers.” The introduction identifies Nyayota and the actual problem space, rather than leading with a broadly reusable promise.
- **Less decoration, more context.** Removed the geometric star and its animation, replaced repeated status copy with a concrete “On my desk” description, removed the decorative contact arrow, reduced the footer signature, and made metadata quieter and sentence-case.
- **Work as evidence.** Nyayota is presented with its real interface, actual stack and a clear path into the case study. The archive is an asymmetrical image/text composition, not a grid padded out with imaginary projects or a legend for unused statuses.
- **Learning as a ledger.** The former abstract perspective band now presents existing learning/planned work with dates and explicit states. About explains the connection between structured information, reading interfaces, performance and ongoing learning.
- **Interior pages belong to the same site.** Shared text links/labels, readable display headings, open rule-based layouts and restrained image treatment now extend through About, Projects, the case study, Contact, CV and empty publishing pages. Contact loses its gradient panel; evidence rows lose rounded boxes. Font families and the warm dark/vermilion palette are retained; light keeps warm paper and its darker accent.
- **An honest professional introduction.** The CV now has a real, supported profile instead of a hidden authoring placeholder. Education, employment and languages remain omitted where no confirmed data exists. Technology groups describe tools appearing in the projects, not proficiency ratings.
- **Static design first.** Long case-study paragraphs do not animate. A separate [no-JavaScript desktop capture](home-nojs-dark-1440.png) records the composition without entrance choreography.

## 2. Screenshots and review artifacts

### Homepage — requested four views

- [Dark desktop, 1440px](home-dark-1440.png)
- [Light desktop, 1440px](home-light-1440.png)
- [Dark mobile, 390px](home-dark-390.png)
- [Light mobile, 390px](home-light-390.png)

### Interior pages

- [About / dark desktop](about-dark-1440.png), [light mobile](about-light-390.png)
- [Project archive / dark desktop](projects-dark-1440.png)
- [Nyayota / dark desktop](projects-nyayota-dark-1440.png), [light mobile](projects-nyayota-light-390.png)
- [CV / light mobile](cv-light-390.png), [actual print-layout PDF](cv-print.pdf)
- [Contact / light mobile](contact-light-390.png)
- [Blog empty state / light mobile](blog-light-390.png)
- [Writing empty state / light mobile](writing-light-390.png)
- [Vault / dark desktop](vault-dark-1440.png)

The PDF is a browser-QA artifact, not a newly advertised official CV download. `site.cvPdf` remains unset. Previous Stage 2 screenshots/report are preserved under `reports/stage2/` for comparison.

## 3. Genuinely new visitor features

1. **Project reading shortcuts:** the archive links directly to role/process, technical decisions and status/limits, conditional on those sections existing.
2. **Mobile case-study contents:** section links no longer disappear below desktop width. They work as native anchors without JavaScript; desktop retains a sticky rail.
3. **Current reading location:** a small, project-only observer updates `aria-current="location"`. It observes sections rather than running a scroll handler. This is semantic navigation, not another animation controller.
4. **Original screenshot access:** the project caption links to the existing original image, not a fake gallery or a newly downloaded oversized asset.
5. **CV section navigation and clearer print flow:** native jumps, an explanation that Save as PDF opens the print dialog, light print tokens even from dark mode, and unusable print/theme controls hidden when JavaScript is off. The original print action is retained, not counted as an entirely new feature.
6. **Useful empty states:** unpublished blog/writing areas explain the real state and point to the existing case study, About or timeline. No fake article titles, publication promises or simulated research output.
7. **Source/learning discovery:** the homepage ledger uses existing timeline entries; the project and About pages connect visitors to the evidence and progress record. The existing timeline is not presented as a newly invented achievement feed.

The contact clipboard control, saved theme, eight contacts and mobile modal are preserved/refined existing functionality, not counted as new features. No backend, form, authentication or availability indicator was added.

## 4. Content additions / rewrites and evidence

| Content | What changed | Source / boundary |
|---|---|---|
| Homepage introduction and masthead | Name-first introduction; explicit Nyayota focus; reading-oriented positioning | Existing `src/config/site.ts`, genuine Nyayota entry and About interests. No new career/education claims |
| Homepage learning ledger | Three existing entries with their dates and states | `src/data/timeline.ts`; that file and its underlying history were not changed |
| About | Reorganised introduction, information/reading interests, performance, ongoing work and AI-assisted workflow | Existing About copy, config, timeline and user’s Stage 2.1 authorship instruction. No institution, educational stage, work history, location or research credential invented |
| Nyayota role | Replaced “Sole designer and developer” with a personal-project / AI-assisted development description | Explicit user instruction and existing ownership/content; no independent line-by-line authorship claim |
| Nyayota decisions | Structured legal records, browser-side reading tools, provenance alongside text | Existing case-study approach/features and public repository README |
| Nyayota limitations | Public assistant documented as suspended; educational/non-advice scope; no adoption/accuracy/impact metrics claimed | Repository feature matrix and existing legal disclaimer. Repository-documented status, not an independently tested live endpoint |
| CV profile | Replaced hidden placeholder with factual project-focused summary; AI-assisted workflow disclosed | Existing CV selected work, config, project content, user instruction. Qualifications remain empty |
| Archive and project discovery | Real project context, conditional reading shortcuts, link to this site's source | Existing project collection and CV/site repository evidence |
| Blog / writing states | Clearly unpublished, linked to available work instead of simulated posts | Empty real collections and existing planned-writing timeline entry |
| Contact / 404 | Removed unverified “I read everything” / faster-reply claims and “Nothing is broken” assurance | Editorial correction, not a new personal fact |

Pinned external reference inspected read-only: [Nyayota README at ce907d6d46ed9b219c4401eddcfb25fe2587e36c](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/README.md). In particular, its feature matrix marks the public AI assistant suspended/under development. It does not establish legal correctness, user adoption, research credentials or independent implementation authorship.

## 5. Design system and implementation decisions

- Existing Astro + TypeScript, collections, static output and native document navigation retained. No architectural migration or ClientRouter introduced.
- `refinement.css` owns shared controls/chrome and common text links/metadata. `editorial.css` owns interior layout/reading grammar. `home.css` owns homepage composition. Moving shared link styles out of homepage-only CSS fixes their use on secondary pages.
- Existing real screenshot reused, responsive Astro Image variants retained, original dimensions preserved. No generated imagery or additional project screenshots invented/downloaded.
- Added optional `caseStudy.limitations` array to the existing project schema; the template renders it as a real section. The source remains editable Markdown, not hardcoded Nyayota markup in the template.
- GSAP + bundled ScrollTrigger remain the single animation system. Existing constants: `power3.out`, 0.95s entrance, 0.85s reveal, 1.05s image entrance, 0.085s stagger, 22px desktop / 12px compact travel. Secondary PageHeader/project/CV openings now opt into that same system.
- Removed star rotation/scale; did not replace it with another effect. Reading paragraphs stay static. Image/section/footer enhancements are once-only; native scrolling is unchanged.
- Hero focus completes its entrance immediately. Reduced-motion and failed-module defaults remain visible. GSAP context/media cleanup and native pagehide/persisted-pageshow plus Astro lifecycle support remain. Empty hero target lists are guarded.
- New reading-location module has its own cleanup for its observer/listener. It does not manipulate opacity, transforms or scroll position.
- Existing CSS/native page View Transitions and theme transition remain progressive enhancements, disabled for reduced motion. No loader, fake progress, parallax loop or scroll replacement added.

### Dependencies

**Stage 2.1 adds/removes no project dependency.** Cumulatively over main, the only dependency change remains exact `gsap@3.14.2` from Stage 2. ScrollTrigger is bundled in GSAP. No unused animation package, React, Lenis, Three.js, Lottie or second motion framework was introduced.

External review tools remain outside the project dependency tree: Playwright Core 1.64.1, Sparticuz Chromium 153.0.0, plus temporary Prettier/Astro formatting tools. These are not production or repository package/lockfile additions.

## 6. Executed verification

Full exact commands, output and exit codes: [commands-and-results.txt](commands-and-results.txt). Final browser-run logs: [core](browser-core.log), [pages](browser-pages.log), [performance smoke](browser-performance.log).

| Check | Executed result |
|---|---|
| `npm run check` | 52 files; 0 diagnostic errors, warnings or hints |
| `node --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs` | 13/13 passed, 0 failures |
| `env -u SITE_URL npm run build` | Passed; 11 pages |
| `npm run verify:content` after no-domain build | Passed; 145 internal links |
| `node scripts/verify-stage1.mjs` after no-domain build | Passed; eight contacts, public HTML, demo removal, domain-optional metadata |
| `SITE_URL=https://afnan0356.vercel.app npm run build` | Passed; 11 pages; sitemap generated |
| `npm run verify:content` after configured build | Passed; 156 internal links (up from 149 in Stage 2) |
| `node scripts/verify-stage1.mjs` after configured build | Passed; eight contacts, public HTML, demo removal, configured metadata |
| `node scripts/verify-stage21.mjs` after both builds | Passed; 11 HTML pages, 55 internal fragment links, AI-assisted scope and CV profile |
| `node scripts/browser-stage21.mjs` | 12 homepage theme/width combinations plus 11 existing real-browser scenarios passed |
| `node scripts/browser-stage21-pages.mjs` | 120 interior page/theme/width combinations plus 6 new-feature scenarios passed |
| `node scripts/browser-stage21-performance.mjs` | 4x CPU-throttled touch smoke, no-JS desktop capture and 10 base text-token contrast checks passed |
| `git diff --check` | Passed |
| `npm ls --depth=0` | Passed; no extraneous package warnings |
| `npm audit --json` | Four inherited findings remain; see [audit-summary.json](audit-summary.json). No fixes/upgrades applied |

Widths **320, 360, 390, 768, 1024, 1440px**, dark and light. Interior routes: About, Projects, Nyayota, CV, Contact, Blog, Writing, Vault, evidence category, 404. Matrix assertions check headings, theme, document overflow, loaded broken images, page exceptions and console errors. Interior layout matrix uses reduced motion to inspect the settled design. Representative saved screenshots were visually inspected, including homepage desktop/mobile, About, project archive/detail, CV, Contact and empty publishing state. This is not a claim of individually hand-reviewing every pixel of every matrix cell.

Core scenarios exercise dark-first with light OS; actual hero start/completion; persisted theme across real navigation; mobile keyboard wrap/Escape/focus return/inert background; resize close; repeated synthetic Astro cleanup/init; dynamic and first-load reduced motion; no-JS content/navigation; blocked animation bundle fallback. New scenarios exercise mobile contents/native anchor, scroll reading-location/cleanup/reinit, actual original-image response, CV jumps/print callback/print colors, accessible copy success, and no-JS project/CV paths. Existing Node tests also exercise clipboard denial.

The 4x CPU sample used a 360px touch viewport, native scrolling, no hidden final motion content, no page exceptions, and no overflow. Two startup long tasks of **136ms and 96ms** were observed in the final sample. This is **not** a Snapdragon 680 simulation, network-speed test, sustained frame-rate test or proof of smooth performance on a Realme 9i. Timing/resource entries in this test environment are not a reliable cold-network bandwidth measurement. Main GSAP/layout bundle remains about **45.6KB gzip**; no claim of removing that cost on interior/reduced-motion pages.

Base text-token contrast against each theme background ranges from **4.83:1 to 16.50:1** across ink/soft/muted/faint/accent tokens. This checks those tokens, not every rendered color pair, image, focus ring or UI state.

### Reproduce

Use the external browser setup documented in `reports/stage2/README.md`, then run the commands above against a local configured build and a preview server:

```sh
npm run preview -- --host 0.0.0.0 --port 4321
# Another terminal:
BROWSER_TOOLS_DIR=/tmp/portfolio-browser node scripts/browser-stage21.mjs
BROWSER_TOOLS_DIR=/tmp/portfolio-browser node scripts/browser-stage21-pages.mjs
BROWSER_TOOLS_DIR=/tmp/portfolio-browser node scripts/browser-stage21-performance.mjs
```

Stage 2's core browser suite is reused via configurable report path/widths, rather than maintaining a duplicate test implementation. Stage 2.1 outputs go to this folder; Stage 2 screenshot/JSON artifacts remain unchanged.

Machine-readable results: [homepage viewports](viewport-checks.json), [core interactions](interaction-checks.json), [interior matrix/features](page-checks.json), [fragments](fragment-checks.json), [CPU/contrast smoke](performance-smoke.json).

## 7. Complete changed-file list

[CHANGED-FILES.txt](CHANGED-FILES.txt) enumerates **every modified/untracked file cumulatively over main**, including inherited Stage 2 work and all report artifacts. It is generated from Git's tracked diff plus untracked-file listing. No genuine content was deleted.

### Stage 2.1 application changes relative to the existing Stage 2 iteration

- `src/components/PageHeader.astro` — shared entrance hooks and formatting.
- `src/config/site.ts` — factual homepage introduction.
- `src/content.config.ts` — optional case-study limitations.
- `src/content/projects/nyayota.md` — AI-assisted role, decisions, status/limits, repository-reading context; existing case study/assets preserved.
- `src/data/cv.ts` — real profile and workflow disclosure; missing qualifications still absent.
- `src/layouts/BaseLayout.astro` — shared interior stylesheet import.
- `src/pages/404.astro` — more accurate recovery copy.
- `src/pages/about.astro` — editorial introduction/interests/learning layout.
- `src/pages/blog/index.astro` — honest useful empty state.
- `src/pages/contact.astro` — open layout, remove unsupported response assurances.
- `src/pages/cv.astro` — section anchors, print explanation and presentation.
- `src/pages/index.astro` — name-first composition, actual work context, timeline-backed learning ledger, clearer contact closing.
- `src/pages/projects/index.astro` — image-led archive and conditional reading shortcuts; restores a real `#case-studies` target for the footer link.
- `src/pages/projects/[id].astro` — scope section, mobile contents, image-original access and follow-up discovery.
- `src/pages/writing/index.astro` — honest unpublished state.
- `src/lib/motion.ts` — remove decorative star tween; focus completion and empty-target guards.
- **New:** `src/lib/reading.ts` — semantic current-section feedback and cleanup.
- **New:** `src/styles/editorial.css` — interior layouts, shared reading conventions, mobile contents and print safeguards.
- `src/styles/home.css` — homepage hierarchy, image crop, compact metadata and ledger composition.
- `src/styles/refinement.css` — shared link/label ownership, more restrained controls and smaller footer signature.
- `src/styles/utilities.css` — correct obsolete reveal-controller documentation.

### Verification changes

- `scripts/browser-stage2.mjs` — reusable report path/viewport configuration; console-error assertions.
- **New:** `scripts/browser-stage21.mjs` — six-width wrapper for existing regression suite.
- **New:** `scripts/browser-stage21-pages.mjs` — interior viewport/theme matrix and useful-feature scenarios.
- **New:** `scripts/browser-stage21-performance.mjs` — throttled touch smoke, no-JS screenshot, token contrast.
- **New:** `scripts/verify-stage21.mjs` — internal fragment and content-authenticity assertions.
- **New:** all files in `reports/stage2-1/`, enumerated individually in the manifest.

Inherited Stage 2-only changes such as GSAP's package/lockfile addition, Header modal behavior, Footer markup, ThemeScript comment, token refinements and Stage 1 test mocks remain in the cumulative diff; they were not new Stage 2.1 features. Existing Stage 2 review artifacts are retained.

## 8. Known limitations and remaining design weaknesses

- **Thin personal evidence remains the main constraint.** Only one genuine project is in the project collection. No confirmed educational stage/institution, employment history, portrait, personal narrative, published essays or research output was available. The site is clearer and more personal through the work, but cannot honestly become a detailed biography or scholarship-ready academic record until those facts are supplied.
- **Nyayota documentation is long and text-heavy on mobile.** Navigation and hierarchy are improved, but more real product screenshots showing search/comparison/citation workflows would strengthen it. The same existing screenshot still appears in preview and notes; no fake replacement gallery was created.
- **Realme 9i not physically tested.** Chromium width/touch/CPU checks are available; real Android GPU/thermal/network behavior and Safari/Firefox remain unverified. Native back/forward works through native document navigation, but bfcache restoration is not cross-browser certified; lifecycle checks include synthetic events.
- **Initial scripting cost remains.** GSAP is still loaded by the shared layout; the CPU sample contains startup long tasks. A later measurement-led optimization could conditionally load motion or reduce font/animation cost. This iteration does not claim a performance score.
- **Accessibility checks are partial.** Keyboard paths, reduced motion, modal containment, print, token contrast and status feedback were checked, but not a complete screen-reader or WCAG audit. Unpublished book/chapter/article templates remain preserved but have no genuine published entries to exercise end-to-end.
- **Source claims are bounded.** The Nyayota status is repository-documented; no legal correctness or AI accuracy audit was performed. Prior external-contact verification limits remain (Instagram access restrictions, Discord invite shell, YouTube shell); no email-delivery test is claimed.
- **Four inherited security findings remain:** Astro critical, nested Sharp high, MDX moderate, esbuild low. No forced upgrades or unrelated dependency migration. Empty blog/writing loader notices are expected and remain visible in logs.
- A sandbox Chromium launch initially crashed before testing; subsequent retry and the final full browser runs completed. No failed run is counted as a pass.

This is a substantive refinement for design/content review, **not a claim that the portfolio is complete merely because the build passes**. No release action has been taken.
