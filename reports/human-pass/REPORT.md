# Human-touch update — review and verification

4 November 2026. Local, uncommitted work on `arena/1ace11cb-afnan0356-portfolio`; HEAD remains `c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff`. Continued the dirty Stage 2.2/2.3 implementation. No reset, branch switch, commit, push, PR, merge, deployment or production/settings change.

## Owner-facing guide

**[Summary, every new placeholder and manual testing instructions](../../docs/human-updates.md)** · [authoring guide](../../docs/authoring.md) · [incremental changed files](CHANGED-FILES.md)

## Implementation

- Conversational factual hero, real-photo placeholder, editable Now data and honest recording slot. The Now section replaces the redundant homepage learning teaser instead of adding another repeated learning dashboard; the actual timeline remains in Vault.
- Warmer empty states and three undated, noindex draft scaffolds: two Blog notes and one Writing note. No invented personal anecdote, test result, reading title or publication date. The schema permits missing publication dates **only for drafts**; published entries still require a real date.
- Dependency-free custom static search, approximately 8KB JSON, across public projects/blog/writing/Vault. Titles, descriptions and text are indexed at build time. Drafts/demos are excluded even from DEV search. Results use textContent, not injected HTML. Queries stay client-side; the no-JS search input is disabled and its public-entry list remains usable. No external search provider. Search itself is noindex and excluded from the sitemap.
- Shared copy-link/progress controls on Blog, standalone Writing and chapter templates. Existing estimated reading time and previous/next navigation are retained; existing project neighbor navigation is not duplicated, and a one-project collection does not acquire a fake neighbor.
- Honest email-draft composer plus ordinary email links. An optional HTTPS form-service endpoint is deliberately null until the owner supplies one. No pretend submission success, embedded SDK or automatic provider request. Real external-service delivery and an actual OS email client are not certified by the headless tests.
- Eight clearly labeled Bangla introduction pages, not full detailed translations. Main navigation and footer offer language links; full English details remain explicitly linked. One dictionary registry drives shared static locale routes, so another language dictionary can reuse the templates. Self-hosted Bengali-script font fixes missing glyphs without contacting a font service: Noto Sans Bengali regular, Fontsource 5.3.0, 44,352-byte WOFF2 plus OFL license.
- CSS-first one-time word reveal, IO-triggered fade-up, gentle hover/focus/underline feedback, CSS sun/moon icon and Astro's built-in ClientRouter transitions. **GSAP was removed** to satisfy the newer hard rule; no replacement animation package or other application dependency was added. JS only manages state/signals, focus/lifecycle and reading progress. Reduced motion removes animations/transitions/smooth scrolling/progress, disconnects reveal observation and disables/pauses video looping. Video has no autoplay/preload or default SSR loop; without JS it can only play manually once.
- More stable fallback-font headline and narrow header, accessible-name fixes, a light-theme source-chip contrast fix, improved compressed OG image and friendlier 404. No factual CV/timeline/project/Vault entry or genuine project screenshot was replaced.

## Actual visual review

- Home: [dark desktop](home-dark-1440.png), [light phone](home-light-390.png)
- Search: [dark desktop](search-dark-1440.png), [light phone](search-light-390.png)
- Contact: [dark desktop](contact-dark-1440.png), [light phone](contact-light-390.png)
- [Bangla introduction on phone](bangla-light-390.png)
- [Clearly marked draft note on phone](draft-note-390.png)
- [New Open Graph image](../../public/og/default.png)
- Previous local homepage for comparison: [dark desktop](../stage2-3/after/home-dark-1440.png), [light phone](../stage2-3/after/home-light-390.png)

Read actual captures and corrected real issues, not just source assertions. A cold-font run exposed wrapping/layout shift and a narrow-header overflow; adjusted word rendering/line sizing and the smallest header layout. Lighthouse CLS fell from the initial 0.103 observation to approximately 0.009 in the final run. Captures visit/decode lazy images and reset scroll before full-page screenshots, avoiding misleading blank offscreen images and mid-page sticky-header artifacts. All images are actual application captures or the explicitly generated share graphic, not fabricated product screenshots.

## Final validation

[Exact commands/output/exit codes](commands-and-results.txt). Final source pipeline passed after the last copy refinement.

| Check | Result |
| --- | --- |
| `npm run check` | 87 files; 0 errors, warnings or hints |
| `env -u SITE_URL npm run build` | Pass, 20 pages |
| `SITE_URL=https://afnan0356.vercel.app npm run build` | Pass, 20 pages; local build, not a deployment |
| `npm run verify:content` | Pass after both builds; 3 drafts skipped; no leaked pages/links |
| `node scripts/verify-stage1.mjs` | Pass after both builds; 8 verified contact destinations and clean public HTML |
| `node --experimental-strip-types --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs scripts/test-home-work.mjs scripts/test-human.mjs` | 20/20 pass |
| `node scripts/browser-human.mjs` | Pass: 132 route/theme/width combinations plus search, lifecycle, theme/menu/print, no-JS, DEV drafts, copy, progress and motion checks |
| `node scripts/browser-human-accessibility.mjs` | 28 route/dialog/theme axe scans with no detected violations |
| `node scripts/browser-human-cold-fonts.mjs` | Pass at 320/360/390/412/768/1024/1440 with all WOFF2 requests deliberately blocked; no horizontal overflow |
| `node scripts/lighthouse-human.mjs` | Final mobile sample: performance 100, accessibility 100, best practices 100, SEO 100 |
| `git diff --check`, `npm ls --depth=0` | Pass |
| `npm audit --json` | Exit 1: four inherited findings; no forced fixes |

The responsive suite covers both themes at 320/360/390/768/1024/1440, including real Astro client navigation (a window sentinel survives navigation, so this is not just repeated page loads), single-handler rebinding, focus restoration after search, mobile menu inert state, clipboard feedback and CV print action. A deliberately inactive video element tests loop state under live/load reduced motion without inventing or downloading a demo recording. No-JS search inputs remain disabled and the entire public-entry list is usable. All three undated drafts are exercised in DEV and confirmed absent from the production search index, RSS and sitemap. Search markup-like queries are treated as literal text. No third-party requests were observed in the production browser suite.

The existing theme/contact/menu unit tests now exercise the shared controller rather than extracting removed inline scripts. The previous scripted circular theme reveal assertion was replaced by a CSS-first/no-scripted-animation assertion; blocked/invalid storage, persistence, clipboard failure/absence, menu focus/resize and minimum hit-target coverage remain. Older stage-specific GSAP browser/preservation scripts describe historical acceptance criteria, not the newer CSS-first implementation.

### Evidence

[Browser checks](browser-checks.json) · [browser log](browser.log) · [axe results](accessibility.json) · [font-failure results](cold-fonts.json) · [Lighthouse JSON](lighthouse.json) · [Lighthouse HTML](lighthouse.html) · [preserved factual/assets files](preservation.json) · [dependency audit](dependency-audit.json)

## QA tooling and limits

No test/audit library was added to the application manifests. The optional QA scripts resolve external tools using:

- `BROWSER_TOOLS_DIR` (default `/tmp/portfolio-browser`): Playwright Core, Sparticuz Chromium and this sandbox's Linux runtime libraries under `libraries/lib`.
- `AUDIT_TOOLS_DIR` (default `/tmp/portfolio-lighthouse`): Lighthouse 13.6.0 and `@axe-core/playwright`; external installation used `npm install --prefix /tmp/portfolio-lighthouse --no-audit --no-fund lighthouse @axe-core/playwright`.
- Browser scripts expect a built static site on port 4321. The draft checks additionally expect DEV on 4322 (`npm run dev -- --host 0.0.0.0 --port 4322`). These are test-runner URLs; browser-facing application code uses relative same-origin URLs, never localhost services.

These scripts are environment-specific optional QA, not runtime requirements. The regular npm check/build/content commands need no external browser harness. Lighthouse is one synthetic local mobile run with simulated throttling, not a production score guarantee or Snapdragon 680/Realme certification. Axe is not a full manual WCAG/screen-reader audit. No physical Android/iOS/Safari/Firefox/email-client/printer certification. Uploaded photos/videos, additional published entries or a configured service require new review.

The dependency audit still reports one low, one moderate, one high and one critical finding. Removing GSAP does not fix the inherited framework/image-toolchain advisories. They remain a separate security task; no unapproved major migration or assertion that the findings are harmless.

All mandatory owner inputs and optional settings are listed in the owner checklist. In particular: no real portrait, current reading title, review month, screen recording, personal draft observations or publication dates have been guessed.
