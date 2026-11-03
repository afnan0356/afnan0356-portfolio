# Portfolio V2 — Stage 2 review

**Status:** ready for homepage/design-system review, not approved for release. 3 November 2026.

Branch: `arena/a0eb2c6d-afnan0356-portfolio`. Base: merged main `ec692c7698f452b7fefbea89244a69b3ef0ed24d` (confirmed current before implementation).

## Visual direction

Warm editorial rather than a uniform card grid: oversized Newsreader headline with an indented vermilion second line, asymmetrical introduction/current-work composition, an image-led Nyayota feature, a quieter perspective band, source-led reading rows, large contact typography, and a signature footer. Dark remains the first-visit default regardless of OS preference; light uses warm paper, darker accent ink, and its own image-stage palette. Shared type, buttons, navigation, spacing and footer refinements inherit across the site. Secondary page bodies have **not** been individually redesigned.

Real Nyayota content/assets, the verified source entries, honest unpublished reading states, all eight official contacts, DEV-only author notes, and manual theme persistence remain intact. No achievements, publications, statistics or accounts were invented.

Browser review found and fixed an actual mobile contact-arrow overflow at 320–390px, plus scoped component CSS overriding the initial shared header/footer refinements. Final screenshots reflect those fixes.

## Screenshots

Full-page Chromium captures, after visiting all scroll sections and allowing reveals to finish:

- [Dark desktop, 1440px](home-dark-1440.png)
- [Light desktop, 1440px](home-light-1440.png)
- [Dark mobile, 390px](home-dark-390.png)
- [Light mobile, 390px](home-light-390.png)

The local production-build preview is served on port **4321**. It is a sandbox preview, not a Vercel deployment.

## Animation implementation

**Only added project dependency: `gsap@3.14.2`**, pinned exactly. ScrollTrigger is included in GSAP, not an additional package. It provides coordinated hero timelines, scroll reveals, staggered content, project-image entrance and footer choreography. No React, smooth-scroll replacement or second motion framework was added. The lockfile diff adds only GSAP.

- `src/lib/motion.ts` owns initialization, durations, easing, responsive conditions and cleanup.
- Entrance 0.95s; regular reveal 0.85s; image reveal 1.05s; stagger 0.085s; `power3.out`; 22px desktop / 12px narrow-screen travel.
- Hero text enters as coordinated lines; intro/status follow with a small overlap; the editorial star has a single introductory rotation/scale, not a loop.
- ScrollTrigger reveals run once, without scrub, pinning, parallax loops or scroll hijacking.
- CSS owns link/button feedback and a pointer-capable project-image hover. Existing native theme View Transition is retained, with reduced-motion fallback.
- Native document navigation remains. Astro lifecycle hooks are supported without adding ClientRouter. Reinitialization reverts prior GSAP context/media state; pagehide destroys, persisted pageshow reinitializes. Focus within scroll-revealed blocks completes their animation immediately.
- Content is visible before enhancement and if the motion module fails. Reduced motion bypasses GSAP choreography and restores animation-owned opacity/transforms, including when the preference changes while the page is open.
- Mobile menu adds inert background content and a keyboard focus loop; no-JavaScript mobile navigation remains available.

## Validation

| Check | Result |
|---|---|
| `npm run check` | 47 files, zero diagnostic errors/warnings/hints |
| Production build with `SITE_URL=https://afnan0356.vercel.app` | Passed; 11 pages |
| Configured content/Stage 1 verifiers | Passed; 149 internal links, eight contacts, clean public HTML |
| Build without `SITE_URL` | Passed; 11 pages; 138 internal links and domain-optional metadata checks passed |
| Existing Node interaction/theme suite | 13/13 passed |
| Real Chromium viewport matrix | 320, 360, 390, 768, 1440px, each dark/light; correct theme; no horizontal overflow, unrevealed final content, or page exceptions |
| Real Chromium interaction scenarios | 11/11 passed; details below |
| `git diff --check` | Passed |
| `npm audit` | Four existing findings remain: 1 critical, 1 high, 1 moderate, 1 low; no force fixes or security upgrades |

Browser scenarios: dark-first with light OS; hero motion starts/completes; theme toggle persists across real navigation; mobile focus wrap/Escape/focus return/inert background; modal closes on desktop resize; three repeated synthetic Astro initialization/cleanup cycles restore inline styles; dynamic reduced-motion preference change; reduced-motion first load without hidden content/running browser animations; eight secondary routes retain content without desktop overflow; no-JavaScript mobile navigation/content; blocked motion bundle leaves content visible and menu working.

The secondary route smoke check covers `/about/`, `/contact/`, `/cv/`, `/projects/`, `/projects/nyayota/`, `/vault/`, `/blog/`, `/writing/`. It is not an individual visual redesign or comprehensive per-page QA. Synthetic lifecycle testing is not a claim of cross-browser bfcache certification.

Machine-readable results: [viewport matrix](viewport-checks.json), [interaction scenarios](interaction-checks.json). Reproducible browser assertions: `scripts/browser-stage2.mjs`.

### Reproducing browser QA in this Linux sandbox

Browser tooling is **external to the project dependency tree**: Playwright Core 1.64.1 + Sparticuz Chromium 153.0.0. Node used here: 22.22.3. These commands install test tools under `/tmp`, not in the portfolio lockfile:

```sh
mkdir -p /tmp/portfolio-browser
npm install --prefix /tmp/portfolio-browser playwright-core@1.64.1 @sparticuz/chromium@153.0.0
node --input-type=module -e "import fs from 'node:fs'; import zlib from 'node:zlib'; fs.writeFileSync('/tmp/portfolio-browser/al2023.tar',zlib.brotliDecompressSync(fs.readFileSync('/tmp/portfolio-browser/node_modules/@sparticuz/chromium/bin/al2023.tar.br')))"
mkdir -p /tmp/portfolio-browser/libraries
tar -xf /tmp/portfolio-browser/al2023.tar -C /tmp/portfolio-browser/libraries
```

From the repository:

```sh
npm ci
npm run check
SITE_URL=https://afnan0356.vercel.app npm run build
npm run verify:content
node scripts/verify-stage1.mjs
node --test scripts/test-theme.mjs scripts/test-stage1-interactions.mjs
npm run preview -- --host 0.0.0.0 --port 4321
# In a second terminal, with the preview running:
BROWSER_TOOLS_DIR=/tmp/portfolio-browser node scripts/browser-stage2.mjs
```

The browser script overwrites these screenshots/JSON results and fails assertions on theme, width, errors, hidden content and interaction regressions. The Linux bundled-library setup is sandbox-specific, not a production requirement.

## Exact changed files

### Existing files modified

- `package.json` — exact GSAP dependency.
- `package-lock.json` — GSAP package/integrity only; no unrelated upgrades.
- `scripts/test-stage1-interactions.mjs` — DOM mock support for inert/modal enhancements.
- `src/components/Footer.astro` — reveal group and typographic signature.
- `src/components/Header.astro` — solid header, mobile modal/inert/focus behavior and no-JS fallback.
- `src/components/ThemeScript.astro` — comment clarifies that JS never gates content visibility.
- `src/layouts/BaseLayout.astro` — shared refinement CSS and centralized motion import; old observer removed.
- `src/pages/index.astro` — rebuilt editorial homepage using existing collections and responsive Astro Image.
- `src/styles/tokens.css` — container, easing/timing, more legible faint ink and theme-specific image-stage colors.
- `src/styles/utilities.css` — removes old JS-gated hidden reveals; secondary content defaults visible.

### New implementation/verification files

- `src/lib/motion.ts` — shared GSAP lifecycle/choreography.
- `src/styles/home.css` — responsive homepage composition.
- `src/styles/refinement.css` — shared design-system refinements and motion safeguards.
- `scripts/browser-stage2.mjs` — real-browser viewport, fallback and interaction assertions.

### New review artifacts

- `reports/stage2/README.md` — this report.
- `reports/stage2/viewport-checks.json`
- `reports/stage2/interaction-checks.json`
- `reports/stage2/home-dark-1440.png`
- `reports/stage2/home-light-1440.png`
- `reports/stage2/home-dark-390.png`
- `reports/stage2/home-light-390.png`

## Limitations and release boundary

- Actual browser inspection and assertions used headless Chromium, not physical low-end Android, iOS/Safari or Firefox. No frame-rate, Lighthouse or real-device performance score is claimed. Animation is transform/opacity-first and native scrolling is untouched; the GSAP-containing layout JS bundle is approximately 45.6KB gzip, including existing layout behavior.
- Keyboard paths and visual contrast were inspected, but this is not a full accessibility/screen-reader audit. External contact destinations retain Stage 1 verification limitations.
- The known Astro/MDX/nested Sharp/esbuild security findings remain. An authorized, separately tested security migration is still needed; adding GSAP did not fix them. Expected empty blog/writing collection notices remain because there is no published content to populate them.
- Secondary pages inherit shared styles but await separate design review. Screenshot review is not proof of all browser/platform behavior.
- **No Stage 2 commit, push, PR, merge, production deployment, Vercel configuration change or GitHub settings change was performed. Production remains unchanged by this work.** Changes stay in the active feature worktree for review. Approval is required before any merge/deployment.
