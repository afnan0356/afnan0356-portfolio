# Demo playground & visual polish

Owner-requested follow-up on `arena/f6bcc442-afnan0356-portfolio`. Changes remain local; no commit, push, PR operation or deployment was performed in this pass.

## What to try

Open the live preview, then choose **Visit the playground · demos** in the homepage hero. Direct routes within the preview:

- `/playground/`: two original, fictional interface studies with expandable design notes.
- `/playground/#reading`: sample essay, native Regular/Large reading controls and an editorial reading layout.
- `/playground/#tool`: working, local word/character counter, Clear button and focus restoration.
- `/`: softer hero/current-focus treatment, monogram photo placeholder, rounded project frame, three check-in cards, two illustrated demo cards and a sample-writing link.
- `/blog/` and `/writing/`: clearly labelled sample-reading invitations alongside their existing real/draft/empty states.

Marginalia and Commonplace are **fictional concepts**, not completed portfolio projects. Their visuals are original HTML/CSS compositions, not product screenshots. The sample essay has no invented personal anecdote, publication date or attributed quote. All supplied personal facts, real projects, CV data and existing draft prompts remain unchanged. The real portrait, monthly information and real Nyayota recording remain owner inputs; no fake portrait or recording was added.

## Editable files

- `src/data/playground.ts`: sample concepts and essay copy.
- `src/pages/playground.astro`: gallery, reading controls and lifecycle-safe word-counter custom element.
- `src/components/ExperimentArt.astro`: illustrative interface mockups.
- `src/components/PlaygroundPreview.astro`: homepage demo cards.
- `src/components/DemoInvitation.astro`: Blog/Writing preview invitations.
- `src/styles/playground.css`: handmade visual treatment and responsive rules.
- Existing homepage, Now, footer and BaseLayout connect the new surfaces. Header now becomes non-sticky without JS on mobile, so its permanently available fallback navigation does not obscure the page. Fixed an existing malformed media query in home.css that caused a CSS build warning.
- `astro.config.mjs`: exclude the noindex playground from the sitemap. Search/RSS remain restricted to real collection entries; no fictional portfolio entries were added.
- `docs/authoring.md` and `docs/human-updates.md`: current authoring/review guidance.

No new application dependencies, analytics, cookies, remote images/fonts or animation libraries. The small custom element only computes local text counts and cleans up its handlers on Astro navigation. Word counts are whitespace-delimited; character counts are Unicode code points, not grapheme clusters. The site does not store or transmit scratchpad text.

## Verification on final code

- `npm run check`: 93 files, zero errors/warnings/hints — [log](check.log).
- `npm run build`: pass, 21 pages. Also passed with `SITE_URL=https://afnan0356.vercel.app`; that is a local metadata build, not a deployment — [log](build.log).
- `npm run verify:content`: pass; final domain-configured build checked 415 internal links and skipped three drafts — [log](content.log).
- Existing Node suites: 20/20 pass — [log](unit.log).
- `node scripts/browser-playground.mjs`: 32 route/theme/viewport scans across Home/Playground/Blog/Writing, dark/light, 320/390/768/1440. No horizontal overflow and no axe violations detected. Also tested live Unicode word counts, clear/focus, native details, CSS reading sizes, Astro navigation rebinding and no-JS controls — [results](browser-results.json), [log](browser.log).
- Confirmed the playground is absent from the generated sitemap and fictional concepts are absent from search.json. Robots metadata is noindex/nofollow.
- `git diff --check`: pass.

The browser tests use external tools under `/tmp/portfolio-browser` and `/tmp/portfolio-lighthouse`, not app dependencies. `TEST_URL` defaults to a production-style static preview at port 4323. This pass did not rerun Lighthouse, dependency audit, physical-device or assistive-technology certification. Older numerical scores/audit reports describe their respective historical snapshots, not a new guarantee.

## Visual evidence

Actual final-code browser captures, not generated screenshots:

- [Home, light desktop](home-light-1440.png) · [dark desktop](home-dark-1440.png)
- [Home, light mobile](home-light-390.png) · [dark mobile](home-dark-390.png)
- [Playground, light desktop](playground-light-1440.png) · [dark desktop](playground-dark-1440.png)
- [Playground, light mobile](playground-light-390.png) · [dark mobile](playground-dark-390.png)

## Manual review

1. Follow the hero demo link; use the section jumps and expand both concept disclosures.
2. Switch Regular/Large text, type into the scratchpad and use Clear. Navigate home and back; the tool should still work.
3. Review both themes on a phone-width viewport. Tab through links, native radio controls, summaries, textarea and Clear; visible focus should remain.
4. Enable reduced motion: no demo hover lifts, animated rotations, reveals or smooth scrolling. Content and controls remain available.
5. Disable JavaScript: reading sizes and disclosures still work; the counter explains it needs JS and its inactive Clear button is hidden. Mobile navigation stays in the document flow rather than covering the page.
