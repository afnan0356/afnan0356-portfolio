# Stage 2.3 — pre-edit visual critique

4 November 2026. Branch `arena/1ace11cb-afnan0356-portfolio`, HEAD `c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff`. Stage 2.2's 35 source/script/asset changes and 35 review artifacts were present, uncommitted and preserved. Recorded source hashes before editing and saved a temporary source copy; no reset, branch switch or release action.

## Browser inspection before website edits

44 actual browser views captured: all 11 generated routes, dark/light, 1440/390px. Read the latest Stage 2.2 homepage screenshot as well as current home, About, Projects, case study, CV, Vault/category, Blog, Writing, Contact and 404 captures across both themes. `before-review.json` records DOM/image/error observations; `before/` contains captures. These observations are not inferred from source alone.

A light archive full-page capture initially omitted decoded offscreen image pixels. A scrolled viewport inspection showed the image visible, naturalWidth 792, opacity 1, no clip/visibility issue: capture rasterization rather than missing UI. Capture tooling will visit images and wait for paint before final full-page evidence.

## Keep

Warm near-black/ivory/vermilion; Newsreader/Instrument Sans/JetBrains Mono; genuine screenshots; honest student identity/AI role; open editorial layouts; native scrolling, static architecture and GSAP progressive enhancement. No new content sections or imagery needed.

## Prioritized corrections

1. **Homepage + chrome:** weak diagonal balance, excessive offsets/gaps, faux browser chrome around an already-real interface, image separated from its description, repeated Nyayota headings. Recompose existing material into a tighter type-led opening and asymmetrical image/text feature. Make the contact close a composed row rather than another oversized italic banner. Remove light dotted texture; use actual paper/surface separation. Shrink repeated footer signature to a restrained colophon.
2. **Reading pages:** About's left facts column resembles technical docs and precedes the personal introduction on phones. Put the essay first on mobile and use a compact margin note instead of sticky documentation chrome. Case study has too many identical orange headings, repeated horizontal borders, and a long open contents list on mobile. Introduce restrained section numbering, narrower reading measures, richer list composition, stronger genuine screenshot framing and an optional native contents disclosure, preserving no-JS navigation.
3. **Utility/archive pages:** CV too close to generic site styling; use a calm document surface with a precise typographic hierarchy and print clarity. Contact has tiny destination metadata and identical box icons; use legible ruled routes and generous targets without new destinations. Vault should read as a source index, not a dashboard. Reduce empty-collection headline/callout scale and redundant visual emphasis; do not invent entries. Keep 404 navigation but reduce decorative number emphasis and excess space.
4. **Final QA:** inspect each group rendered before moving on; all six requested widths/both themes, keyboard/reduced-motion/no-JS/module-failure/lifecycle/print regressions; genuine before/after screenshots and stage-specific file inventory.

## Design direction

A personal reading room / project notebook: large type only where it introduces a person or project, fine rules as structural alignment, warm untextured paper in light mode, quiet lifted surfaces in dark mode, confident asymmetry on desktop and deliberately reordered stacks on mobile. Accent marks orientation and interactions rather than every heading. Avoid new gradients, cards, ornamental badges, simulated product UI and expensive effects.

## Group 1 rendered review

Built the modified site; captured dark/light desktop/mobile home views under `group1/`. Ran existing homepage theme/menu/motion/reduced-motion/no-JS/failure suites at all six widths; both JSON result files and eleven scenario PASS records were produced (the tool wait timed out just before the finished transcript was returned, so final commands will be rerun with a longer wait).

Observed: diagonal headline balance is stronger; project screenshot now shows useful reading tools, not only its hero; desktop image/description are adjacent; mobile gets a compact full-width project crop, compact current-focus row and larger readable metadata. Light background is quiet rather than dotted. Footer typography no longer overwhelms the page. Rendered inspection caught an intended heading simplification not applied by the first text replacement; corrected to “Selected work.” and composed the desktop contact close as two aligned columns. No section added.

## Group 2 rendered review

`group2/` captures About, Projects and Nyayota in both themes/desktop/mobile after a passing Astro check/build. About now leads with the essay on phones; desktop uses a right-hand margin note and three open interest columns, not a documentation rail. Archive reverses the homepage image/text arrangement, with a less dominant header. Case study has a two-column desktop opening, restrained numbered headings, two-column decisions/tools, a quieter contents rail, and a native mobile disclosure (open without JS).

Follow-up from rendered inspection: increased the desktop cover to a purposeful 5:4 interface moment while keeping the complete natural image on phones; centered archive captions. Improved the inspector’s mobile image to a genuinely larger, natively scrollable image instead of another small fit-to-screen thumbnail. Caption explains scrolling; no zoom library or new controls. A scroll-back-to-top inspection exposed stale reading-location highlighting above the first section: cleared that state using the existing IntersectionObserver, not a new scroll listener.

## Group 3 rendered review

`group3/` captures CV, Contact, Vault, Blog, Writing and 404 in both themes/desktop/mobile, after check/build passed. CV is a quiet paper document, Contact balances email/context against legible ruled destinations, and empty collections no longer receive the same headline scale as a main project. Removed redundant empty-state labels and toned Writing’s existing cross-link into a utility row (also narrowed its wording so it does not imply published blog posts).

The rendered CV phone capture exposed a real cascade-order problem: early mobile declarations were overridden by later base document rules, leaving narrow skill columns and a desktop frame. Moved those mobile rules after the base declarations and scoped them to screen; the targeted browser test now verifies a single-column skills layout at all three phone widths in both themes. No changes to CV data. Blog’s duplicate label was also caught and removed after an initial replacement did not match its indentation.

The targeted native-controls test needed to let the selected anchor paint before immediately simulating a return to top; two animation frames allow IntersectionObserver to observe the intermediate state. With that realistic sequence, all 12 theme/width combinations pass reading reset, contents keyboard navigation, inspector keyboard pan/focus, eight personal contact destinations and mobile CV assertions.

## CSS ownership review

Removed unused faux browser-bar/dot/stack-separator rules from homepage CSS; removed obsolete grain token/layer; consolidated duplicate homepage current-focus/mobile/caption rules rather than adding another stylesheet. Footer typography, spacing and signature now live in Footer (not scoped defaults plus high-specificity global overrides). PageHeader owns its type scale and quiet variant. CV owns its document/print/mobile rules rather than conflicting editorial overrides. Removed the duplicate case-title font-family declaration and redundant global heading weight. Existing optional book/blog template styles were retained: empty content today does not prove those supported layouts are dead code. Shared reading/source rules remain in editorial.css. No architecture or motion-engine rewrite.

## Final review and print follow-up

Final pipeline passed after all source changes: 64-file Astro diagnostics clean, 16 unit tests, default and production-origin builds with content/Stage 1/2.1/2.2/2.3 verifiers, complete browser wrapper, 12-combination focused checks and 44 final captures. Existing source-only hit-target assertions were corrected to accept at least 44px and either logical/physical minimum-height declarations, rather than require an obsolete exact value/property order; actual footer/contact targets are also measured in Chromium.

Read final home dark desktop/light phone, corrected CV dark phone, Vault light desktop, Writing light phone, information-architecture dark desktop, About light desktop, Projects light desktop, category dark phone, Blog dark desktop, 404 light phone and focused workflow/decisions light phone captures. These complement the earlier both-theme group reviews. The CV phone now has the intended single-column document stack, genuine archive imagery paints correctly, quiet collections are proportionate, and case details have readable mobile rhythm.

Generated PDFs exposed an orphan final update line on a second page. Tightened only print spacing (not body type size). Rasterized dark/light PDF exports then revealed dark margins in dark mode despite white DOM body: the bootstrap inline color-scheme beat the non-important print rule. The print scheme now explicitly overrides it and print animations/transitions are disabled. Both current-content A4 PDFs are one page, white margin RGB (255,255,255), update line on page one; actual rasterizations inspected. Added focused assertions for printed body background, root light scheme, disabled transition and current-fixture PDF page count. No physical printer certification.

Final screenshots/commands/results, complete inventory and remaining limitations are linked from REPORT.md. No release actions.

Additional final visual reads confirmed the opposite-theme Vault phone/category desktop, dark 404 desktop, dark Projects phone, light Home desktop and corrected dark-origin PDF rasterization. No further website changes were necessary.
