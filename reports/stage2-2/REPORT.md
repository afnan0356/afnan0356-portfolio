# Portfolio V2 — Stage 2.2 review

**4 November 2026 · Local, uncommitted and unreleased**

Branch: `arena/1ace11cb-afnan0356-portfolio`
Starting and current HEAD: `c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff`
Local preview: port **4321**, available through Arena’s live preview.

No commit, push, pull request, merge, deployment, production modification, or GitHub/Vercel settings change was made for this stage. The initial audit found a clean working tree at the latest remote-main starting commit. Earlier Stage 2/2.1 release authorization was not reused.

## 1. Content audit and factual corrections

The audit preceded implementation: [initial audit](AUDIT.md). Personal facts come from the user’s brief, not inferred employment, education, location or social-profile descriptions.

| Before / concern | Stage 2.2 correction |
|---|---|
| “developer, builder, writer” identity | Student interested in technology, AI, research and web development. Aligned introduction, About, CV profile, metadata, manifest and default social preview. |
| Portfolio/project existence suggesting independent coding expertise | Explicit AI-assisted development; product direction, requirements, information presentation and testing are distinguished from implementation. No claim of independently writing every line. |
| “Built this portfolio”, “Released Nyayota”, typed-data milestones and future-dated ambitions implying completed achievements | Reworked timeline into published update, in-progress, learning and planned states. Only the 3 November portfolio publication has completed status and a supporting commit. Other dates are explicitly review dates, not invented release dates, skill-completion dates or deadlines. |
| Vault “Verified” labels resembling credential validation | Public repository records display **Public source**, with source existence explicitly distinguished from qualifications or correctness. The underlying content-schema enum is retained for compatibility. |
| Nyayota described as wholly static | Source-qualified Next.js architecture, browser-side tools and server API route. No claim that the whole application is static. |
| Ambiguous assistant status | README documents suspension. Inspected code has an environment-dependent availability gate and returns a maintenance response when disabled. Actual deployed environment and current HTTP response were **not independently verified**. |
| First-person data-modelling / completed-learning claims | Describes the project’s information structure and current learning questions rather than claiming independently completed expertise. |
| Empty publishing pages implying an existing body of work | No homepage publishing promotion. Blog/Writing retain accessible navigation, accurate empty-state metadata and quieter page-local states. No invented articles, books or publication schedule. |
| Footer “hand-written CSS” | Neutral “custom CSS”, avoiding an unnecessary authorship implication. |

Education, employment and spoken-language entries remain empty rather than inferred. Existing confirmed contact channels are preserved. No professional role, academic enrollment, qualification, award, impact/adoption metric, legal-accuracy certification, testimonial or availability-for-hire claim was added.

## 2. Homepage before → after

| At the starting commit | Now |
|---|---|
| Nyayota-specific heading could sit above up to three featured projects | One intentional primary project; heading names the selected primary. Genuine additional featured projects have a separate conditional secondary area. |
| Empty Blog/Writing content prominently featured | Removed from homepage; both destinations remain in navigation/footer. |
| Public-record dashboard | Removed. A quiet learning/source link provides discovery without an artificial evidence dashboard. |
| Broader builder/writer introduction | Confirmed student identity, interests, AI-assisted ongoing project and learning context. |
| Repeated archive-style sections | Introduction → main project → information/learning interests → contact. No extra section added merely to lengthen the page. |

The selector has three synthetic unit tests for primary choice, secondary exclusion and empty/fallback cases. No test projects were added to published content.

Historical before captures remain unchanged: [dark desktop](../stage2-1/home-dark-1440.png), [light mobile](../stage2-1/home-light-390.png). These are archived Stage 2.1 evidence, **not fresh recaptures** of the starting commit. The table above is based on the actual starting source diff.

## 3. About, archive and case study

- **About:** distinctive student opening, personal introduction, interests, ongoing Nyayota context, AI-assisted role and current learning. Replaced publication/resource counts with useful project/workflow context. No invented personal history.
- **Projects:** learning-oriented archive with explicit ongoing status and documented assistant limitation. The portfolio remains a smaller source-linked practice note, not a manufactured second case study.
- **Nyayota:** substantially expanded purpose/problem, product and reading direction, information architecture, technical architecture, AI-assisted workflow, technical choices, documented tools, implementation status, observations, limits, future direction and pinned sources.
- **Diagram:** semantic HTML Act → Chapter → Section model. Explicitly a simplified explanation, not a screenshot, complete schema or proof of legal accuracy.
- **Screenshot inspector:** native dialog enhancing the existing original-image link. Loads its image only on opening; includes an accessible title, keyboard-scrollable image region, Tab/Shift+Tab wrapping, Escape/Close, focus return, loading/error feedback and cleanup. Modified clicks, no JavaScript and unavailable dialog API retain ordinary image navigation.
- **Shared system:** existing dark-first editorial identity, manual persisted theme, native scrolling, justified GSAP architecture and reduced-motion behavior retained. Focused responsive styles and obsolete homepage CSS cleanup; no all-page redesign.
- **Discovery:** existing contents/reading-location navigation extended for genuine new sections, with role/process, technical decisions, limits, About and source links. Existing CV jumps/print and contact copy preserved rather than duplicated.

## 4. Actual rendered screenshots

These are browser captures of the local implementation—not mockups or generated project imagery. The Nyayota interface image itself is the existing genuine project asset and may differ from the current external site.

| View | Screenshot |
|---|---|
| Home · dark · 1440 | [Open](home-dark-1440.png) |
| Home · light · 1440 | [Open](home-light-1440.png) |
| Home · dark · 390 | [Open](home-dark-390.png) |
| Home · light · 390 | [Open](home-light-390.png) |
| About · dark desktop / light mobile | [Desktop](about-dark-1440.png) · [Mobile](about-light-390.png) |
| Projects · dark desktop | [Open](projects-dark-1440.png) |
| Nyayota · dark desktop / light mobile | [Desktop](projects-nyayota-dark-1440.png) · [Mobile](projects-nyayota-light-390.png) |
| Architecture · dark desktop | [Open](nyayota-architecture-dark-1440.png) |
| AI workflow · dark desktop | [Open](nyayota-workflow-dark-1440.png) |
| Case-study footer · real viewport capture | [Open](nyayota-footer-dark-1440.png) |
| Inspector · light mobile / dark desktop | [Mobile](image-inspector-light-390.png) · [Desktop](image-inspector-dark-1440.png) |
| Quiet publishing pages | [Blog](blog-light-390.png) · [Writing](writing-light-390.png) |
| No-JS home | [Desktop](home-nojs-dark-1440.png) |

Rendered home, About, archive, case-study architecture/footer and inspector screenshots were visually inspected. Browser assertions are reported separately below; they are not presented as visual judgment.

A headless compositor defect initially repeated page pixels beyond approximately 8192px in tall captures. Reproducing the issue and switching the browser harness to software rendering fixed the captures; it was not duplicate site markup. Full-page evidence was regenerated, with a separate scrolled footer viewport checked visually.

## 5. Validation and exact commands

Full transcripts, including iterative failures and final successful follow-ups: [commands and results](commands-and-results.txt). Browser tools are external to project dependencies under `/tmp/portfolio-browser`; formatter tooling is under `/tmp/portfolio-format`. `npm ci` completed during setup. `npm run og` regenerated the corrected default social preview.

| Command | Result |
|---|---|
| `npm run check` | **60 files; 0 errors, 0 warnings, 0 hints** |
| `node --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs` | **16/16 pass** |
| `env -u SITE_URL npm run build` | **Pass**, 11 HTML pages; optional absolute-domain features intentionally omitted |
| `SITE_URL=https://afnan0356.vercel.app npm run build` | **Pass**, 11 HTML pages; production-domain metadata/RSS/sitemap generated locally |
| `npm run verify:content` after each build | **Pass**: 148 internal links without domain; 159 with domain; 3 content files; 0 drafts leaked |
| `node scripts/verify-stage1.mjs` after each build | **Pass**, retained cleanup/contact/domain assertions; replaced obsolete About-count assumptions with student/project-link assertions |
| `REVIEW_REPORT_PATH=reports/stage2-2 node scripts/verify-stage21.mjs` | **Pass**: 11 pages; 62 internal fragment links |
| `node scripts/verify-stage22.mjs` | **Pass**, identity, homepage IA, case sections, source labels and dated timeline assertions |
| `node scripts/browser-stage22.mjs` | **Pass**, existing home/interior/performance regressions; **120 interior combinations** across 320, 360, 390, 768, 1024, 1440px and both themes |
| `node scripts/browser-stage22-features.mjs` | **7/7 pass**, homepage selection plus inspector behavior, light mobile/dark desktop, keyboard/focus, repeated cleanup, no-JS/API fallback and injected image failure |
| `git diff --check` | **Pass** |
| `git diff --exit-code HEAD -- package.json package-lock.json` | **Pass**, dependency manifests unchanged |
| `npm ls --depth=0` | **Pass** |
| `npm audit --json` | **Exit 1**, four inherited findings; see security limitation below |

Build output includes expected messages about empty Blog/Writing collections. They are not fabricated away with sample publications. The zero-warning result above refers specifically to Astro’s check diagnostics.

Browser checks include dark default despite light OS, persisted theme across navigation, mobile navigation/inertness/Escape/focus return, resize cleanup, reduced motion on load and dynamically, repeated initialization, failed motion-module fallback, no-JS content/navigation, reading location/contents, original image response, CV jumps/print and accessible contact-copy feedback.

The normal enhanced inspector flow recorded **zero page errors and zero failed/HTTP-error requests**. The image-error scenario deliberately aborts its PNG request and checks readable feedback/Close. Focus checks led to an explicitly focusable scroll region and reliable Tab wrapping; lifecycle checks caught and fixed accumulated images. Native close-event assertions wait for the queued event, and an immediate-reopen guard prevents stale close events unlocking a reopened dialog.

The 4× CPU-throttled Chromium touch smoke passed with no hidden content or horizontal overflow. It recorded a 206ms long task; that is observational, not a passing speed budget. Ten theme text-token contrast checks passed (minimum sampled ratio 4.83:1). These are not physical-device performance measurements or a complete WCAG audit. See [performance data](performance-smoke.json), [page matrix](page-checks.json), [home viewport checks](viewport-checks.json), [targeted checks](feature-checks.json) and [browser transcript](browser-regressions.log).

## 6. Sources and provenance

1. **User brief:** confirmed student status, interests, ongoing Nyayota, AI-assisted development and continuing learning; confirmed contact links; confirmation that the earlier portfolio update was deployed.
2. **Portfolio source/history:** starting commit [c82e2f3](https://github.com/afnan0356/afnan0356-portfolio/commit/c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff), local content/assets and existing functionality. Public source existence is not personal-expertise certification.
3. **Nyayota source snapshot:** `ce907d6d46ed9b219c4401eddcfb25fe2587e36c`, inspected read-only through GitHub:
   - [README](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/README.md): feature matrix, project direction and documented assistant suspension; older active-assistant prose is not treated as runtime proof.
   - [Package manifest](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/package.json): actual framework/tooling.
   - [Assistant route](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/app/api/ai-assistant/route.ts) and [configuration](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/lib/ai-config.ts): early maintenance gate and `ENABLE_PUBLIC_AI_ASSISTANT` dependency, not the deployed environment’s value.
   - Repository metadata: creation on 20 August 2026 supports a **repository-created** CV date, not a launch date or learning milestone.
4. **Imagery:** existing checked-in Nyayota screenshot. No stock/generated UI, invented analytics, new portrait or fake product capture. New conceptual diagram uses ordinary markup.

## 7. Dependencies, security and remaining limits

- **No project dependency or lockfile changes.** Exact GSAP 3.14.2 retained; no backend, authentication, database, analytics, counters, image-viewer library or framework migration added.
- Default social PNG is 93,245 bytes, down from 95,960. No new site font or product-image asset added. Review screenshots are development evidence, not imported into the production bundle.
- **Security:** current npm audit reports **1 critical (Astro), 1 high (sharp), 1 moderate (@astrojs/mdx), 1 low (esbuild)**. These findings belong to the inherited dependency tree; npm suggests major upgrades. No `audit fix`, forced migration or production changes were made. A separately reviewed security update remains necessary; this report does not certify the dependency baseline as secure. [Full audit](dependency-audit.json).
- No current external Nyayota uptime, assistant deployment configuration, legal correctness, adoption or impact verified. Described features are source/documentation-qualified, not fresh end-to-end certification of that application.
- Chromium synthetic testing only. No physical Realme/Android, Safari/Firefox, assistive-technology or real-user performance certification. No broad accessibility-conformance claim.
- No new publications or additional genuine project case studies exist; quiet empty pages remain intentional.
- Proposed future direction is not a delivery promise. This refinement itself remains unpublished until separately authorized.

## 8. Complete changed-file inventory

[Full changed/new file manifest](CHANGED-FILES.md), including every source, asset, script and review artifact. Historical Stage 2/2.1 report artifacts were preserved. The worktree and Arena diff are the implementation deliverable; no release action is required to preserve this local work.
