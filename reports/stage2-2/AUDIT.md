# Stage 2.2 — pre-edit content and identity audit

Date: 4 November 2026 (Asia/Dhaka).

## Starting state
- Clean worktree: `git status --short` returned no entries.
- Active Arena branch: `arena/1ace11cb-afnan0356-portfolio`.
- HEAD: c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff.
- Read-only GitHub API check: latest remote main is the same SHA.
- No existing local changes required rescue. Arena's fresh session branch is retained; no branch switch/create, reset, commit, push or deployment.

## Claims and source review
- Confirmed directly by user: student; interested in technology, AI, research and web development; learning; exploring structured/presented information; Nyayota main ongoing project; AI-assisted development. No institution/level, qualifications, employment, awards or published research confirmed.
- Config/metadata: 'developer, builder, writer' overstates current identity/publishing. Intro omits student identity. Footer and social preview repeat a generic software-building claim.
- Timeline: 'Built this portfolio' conflicts with in-progress; 'Released Nyayota' is dated by repository creation, not a proven release; 'Learned to model' and completed/verified state infer skill acquisition from a codebase. 2027 essay plan is not a confirmed schedule. Dates should distinguish a documented publication event from last-reviewed ongoing notes.
- Nyayota: existing 'I modelled' is stronger than authorship evidence supports. Lessons can describe observations without pretending measured personal mastery. Static reading data/tools are not proof the whole Next.js application is static: repository has an API handler and AI service configuration. README has internally inconsistent architecture prose, so follow actual source for suspension/architecture, not the broad marketing claims.
- About/CV: add confirmed student and interests; keep qualification arrays empty. Actual responsibilities are described at the level supported by user/existing content; do not invent a detailed per-commit coding or testing history.
- Vault: public source links are inspectable artifacts, not independent verification of personal ability, legal correctness or authorship. Preserve links but narrow labels/explanation.
- Blog/writing: no published entries. Keep quiet page-local empty states, no home empty rows. Do not manufacture articles.
- Homepage: Nyayota-only heading currently wraps up to three featured projects. Choose Nyayota as primary and render any other featured entries as subordinate work; unit-test without adding fake production entries. Remove public-record/reading-room display instead of substituting another dashboard.
- Project archive: one genuine collection project. This portfolio is already documented in CV and has public source; do not inflate the collection just for filtering. Existing contents rail, original-image links and CV jumps already exist; enhance image inspection, do not duplicate them.

## External evidence (read-only)
Nyayota main inspected at ce907d6d46ed9b219c4401eddcfb25fe2587e36c:
- README feature matrix: catalog/search/compare/citations/bookmarks documented; public conversational assistant marked suspended.
- package.json: Next.js, React, TypeScript, Tailwind actual dependencies.
- app/api/ai-assistant/route.ts: server API handler with early 503 branch gated by AI_CONFIG.isPublicAssistantAvailable.
- Repository created_at: 2026-08-20T10:02:11Z. This proves creation time, not release date or when an individual mastered a skill.
- Image tree: genuine homepage PNG/JPG and social/AI Studio assets. Only one relevant product screenshot is available locally. Reuse the real screenshot and identify crops; use a labelled conceptual architecture diagram, not invented UI or stock images.

## Scope and intended composition
Correct identity/claims first; simplify home; write a personal student About; improve archive entry/status; deepen Nyayota architecture/workflow/status with inspectable evidence; then shared reading/image/navigation refinements. Keep other page layouts mostly unchanged. Native dialog may progressively enhance existing original-image link; no new dependency or framework. Preserve static Astro, native scroll, dark-first/persisted theme, reduced motion, eight contacts and Stage 1 content cleanup.
