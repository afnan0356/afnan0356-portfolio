> **Demo/UI follow-up:** The owner-requested playground is now available at `/playground/`, with labelled fictional concepts, sample writing and a live local word counter. See [the latest visual-pass report](../reports/playground/REPORT.md). Earlier Lighthouse results below describe the preceding snapshot, not a newly measured score.

# Human-touch update — owner checklist

This update is local and uncommitted. Nothing was pushed or deployed. Existing Stage 2.2/2.3 work was continued, not reset.

## What changed

- A short first-person hello, a real-photo placeholder and an editable monthly **Now** section. Now replaces the repeated homepage learning teaser; the full learning timeline stays in Vault.
- Warm Blog/Writing empty states with your verified X/email links, and three **unpublished** building-note scaffolds.
- Small static search across projects, blog, writing and Vault. Use the header Search control or **Ctrl/Cmd+K**. Search is local to the browser; drafts/demos never enter its index.
- Copy-link controls and a thin optional reading-progress rule on post/chapter templates. Existing estimated reading times and previous/next links are retained; there are no invented neighbors when a collection has one item.
- A clearly marked Nyayota video slot, and a contact composer that opens an email draft rather than claiming to send it. A form-service endpoint is optional and disabled by default.
- Eight short Bangla introduction pages, a language link in navigation/footer, and shared dictionary-driven locale routes. Detailed English pages remain explicitly linked; these are **not full translations**.
- CSS-only animation definitions, a one-time word reveal, subtle scroll/hover/focus feedback, Astro page transitions and the existing CSS sun/moon toggle. **GSAP was removed**, not supplemented with another library. Reduced motion disables animations/transitions, smooth scrolling, reading progress and video looping.
- Better fallback-font layout, accessible names/contrast, a warmer share image and a friendlier 404.

### Where to edit

| Files | Purpose |
| --- | --- |
| `src/data/now.ts`, `src/components/Now.astro`, `src/pages/index.astro` | Monthly details, portrait and homepage |
| `src/components/NyayotaDemo.astro` | Honest recording slot |
| `src/content/blog/*.md`, `src/content/writing/reading-on-a-small-screen.md` | Three draft notes |
| `src/lib/search*.ts`, `src/pages/search*`, `src/components/SearchDialog.astro` | Build-time index and local search |
| `src/components/PostTools.astro`, Blog/Writing templates | Copy link/progress; retained byline and neighbor navigation |
| `src/data/contact.ts`, `src/components/ContactForm.astro` | Email composer/optional real service |
| `src/data/languages.ts`, `src/pages/[language]/`, `LocalizedOverview.astro`, `LanguageLink.astro` | Optional language introductions |
| `src/lib/site.ts`, `src/lib/motion.ts`, `src/styles/human.css`, `BaseLayout.astro` | Lifecycle-safe controls and CSS-first motion |
| `src/styles/home.css`, `Header.astro`, `utilities.css` | Mobile/fallback-font/contrast fixes |
| `scripts/generate-og.mjs`, `public/og/default.png`, `Seo.astro` | Share image and metadata |

Full incremental file inventory and QA evidence: [reports/human-pass/REPORT.md](../reports/human-pass/REPORT.md).

## Every new placeholder to fill

### Homepage — `src/data/now.ts`

1. **`photo`**: import your own real photo from `src/assets/`; the component creates small WebP variants. **`photoAlt`** must accurately describe that photo. Until then, the visible circle says it is a placeholder.
2. **`month`**: the real month/year you review the note. It is deliberately not auto-dated. Review the seeded, factual `building` and `learning` text for that month too.
3. **`reading`**: what you are actually reading; include a real title/author or another truthful reading description. No book has been guessed for you.
4. **`demoVideo`**: a real compressed Nyayota recording at `/demos/…mp4`. **`demoPoster`** is optional: a small local WebP/AVIF/JPEG/PNG. Both may stay null until you have a recording; nothing fake is displayed or downloaded. Video does not autoplay or preload. Prefer a silent recording; add captions/transcript for meaningful audio.

### Three drafts — leave `draft: true` until complete

| File | Prompts requiring your real experience |
| --- | --- |
| `src/content/blog/building-a-small-static-site.md` | `[YOUR EXPERIENCE]` (actual change and AI role), `[YOUR TEST]` (checks actually run/device), `[YOUR QUESTION]` |
| `src/content/blog/checking-ai-assisted-changes.md` | `[YOUR CHANGE]` (source/diff and role), `[YOUR OBSERVATION]` (actual check and uncertainty), `[YOUR NEXT STEP]` |
| `src/content/writing/reading-on-a-small-screen.md` | `[YOUR EXPERIENCE]` (actual reading task/device/browser), `[YOUR OBSERVATION]`, `[YOUR FOLLOW-UP]` |

Each also needs its **actual `published` date before publication**. Dates are omitted now rather than invented. Replace all prompts, review the entire text, add the date and only then change `draft: false`. Drafts are excluded from production HTML, search, RSS and sitemap, but a public repository/DEV preview is not private.

### Optional, not required

- `src/data/contact.ts` → `endpoint`: leave null to keep the working email-draft option. Only add your own tested public HTTPS service endpoint if wanted. Do not put a secret API key here. Review the provider’s privacy/cookie policy; no provider is contacted by default. Actual external-service delivery cannot be tested until you configure it.
- Bangla wording can be reviewed in `src/data/languages.ts`. It uses only the established biography/project facts. More language dictionaries can use the same static templates; detailed translations would be a separate content task.

## Test it yourself

1. `npm run dev` and open the address shown. DEV includes the clearly marked draft notes. `npm run build` produces the public version without them; run `npm run verify:content` afterward.
2. For a fresh hero reveal, use your browser console: `sessionStorage.removeItem('hero-played'); location.reload();`. Words should appear once and stop—not type forever. Scroll to the project and Now section, hover/focus controls, change theme and follow an internal link.
3. Press **Ctrl/Cmd+K**, type “Nyayota”, Tab through results, then Escape. Focus should return to Search. Try the mobile menu using only keyboard too.
4. Open a draft note in DEV. Check its “Draft · date to add” label, estimated reading time, Copy link and progress while scrolling. No publication date is claimed.
5. On Contact, fill a subject/message and choose **Open email draft**. Your configured email app should open a draft; you still choose whether to send it. The ordinary email link remains available. No delivery-success message is simulated.
6. Enable your OS’s Reduce Motion setting, or Chrome DevTools → More tools → Rendering → **Emulate CSS media feature prefers-reduced-motion: reduce**. Reload and repeat scrolling, hovering, theme changes and navigation. There should be no reveal/lift/transition animations or smooth scrolling; the reading bar is hidden, and a configured demo does not loop. All content, links, search and focus rings still work. Change the setting while the page is open too.
7. Test both themes at narrow widths. Disabling JavaScript should leave content/mobile routes visible and `/search/` should offer its public-entry list. Its search input stays disabled so an unenhanced form cannot send a query to the server.

## Validation result

The required Astro check, both local build configurations and content verification pass. Additional unit, keyboard/responsive, no-JS, draft-exclusion, axe, font-failure and mobile Lighthouse checks are recorded in the linked QA report. Lighthouse is a synthetic local measurement, not a promise of identical production scores or real Realme performance. Four inherited dependency findings remain a separate security issue; no forced major upgrade was made.
