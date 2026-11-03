---
title: Nyayota
summary: An open-source legal research platform that makes Bangladeshi statutes searchable, comparable and readable.
lede: >-
  Nyayota (from Nyaya — justice, fairness, logical equity) turns scattered statutory text into a
  browsable, searchable library. It is a statically deployed Next.js application covering
  Bangladeshi legislation and selected international instruments.
year: '2026'
status: live
tags: ['open source', 'legal tech', 'education']
stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel']
featured: true
order: 1
links:
  live: https://nyayota.vercel.app
  repo: https://github.com/afnan0356/nyayota
cover: ../../assets/projects/nyayota-homepage.png
coverAlt: Nyayota homepage showing a search field, featured statutes and legal research pathways.
caseStudy:
  problem: >-
    Bangladeshi legislation is published across gazettes, amendment volumes and ministry portals,
    often as dense PDFs in archaic statutory prose. A citizen trying to understand a bail provision,
    a tenancy dispute or an arrest procedure has to assemble that answer from several disconnected
    sources, with no way to check whether the text is current or where it came from.
  goal: >-
    Build a single, fast, openly accessible place where primary legal text is structured rather than
    merely hosted: section by section, cross-referenced, with plain-language explanations and clear
    attribution to the source.
  role: >-
    I maintain Nyayota as a personal project and use AI-assisted development. My work centres on
    the product direction, information structure and reading experience. This case study describes
    the implementation visible in the public repository; it is not a claim that I independently
    wrote every line of code.
  approach: >-
    I modelled statutes as structured records (act, chapter, section, amendment history) instead of
    page-level documents, so the same data can power search, comparison, citation export and print
    views. The interface is built around reading: generous measure, a persistent section sidebar,
    and typography that can carry long legal passages on a phone. Content lives in typed data
    modules, which keeps the build static and fast.
  decisions:
    - title: Model provisions, not just pages
      detail: Acts, chapters and sections are structured records. Search, comparison and citation tools can use the same underlying legal content rather than maintaining disconnected copies.
    - title: Keep the reading tools client-side
      detail: Search, comparison and local bookmarks work in the browser. Static deployment keeps these reading tools separate from any conversational AI service.
    - title: Put provenance beside the text
      detail: Source-transparency panels expose official references and integrity hashes. Attribution is part of the reading workflow, not a claim that a summary replaces the official source.
  limitations:
    - The public repository documents the conversational AI assistant as suspended and under development. A live project link does not mean every feature is operational.
    - The platform is educational and informational, not legal advice. Readers should verify important legal text against official sources.
    - No adoption, user, accuracy or impact metrics are claimed in this case study.
  features:
    - Section-by-section statutory catalogue with legislative history and bilingual headings.
    - Client-side full-text search across statutes, categories, sections and keywords.
    - Side-by-side comparative view for two statutes or instruments.
    - Citation export in Bluebook, OSCOLA, APA, MLA and Chicago formats.
    - Source-transparency panel showing official provenance and integrity hashes.
    - Print-optimised document view for offline reading and citation.
    - Local, in-browser bookmarks with no accounts and no telemetry.
  results:
    - Statutory content is browsable by act, category and section, with deep links to every provision.
    - Search, comparison and citation tools run entirely in the browser, so the site stays static.
    - The platform has an MIT-licensed public repository and is open to contributions.
  lessons:
    - A data model that reflects the structure of the subject (acts contain sections contain amendments) makes every later feature cheaper to build.
    - Citation and provenance details are not decoration in legal content — readers check them, so they belong in the interface, not in a footer.
    - Typography does much of the usability work when the content is text-heavy and long.
---

Nyayota is a legal information platform for people who need to *find* a provision and then
understand it. It covers major Bangladeshi statutes across the pre-independence, Pakistani and
Bangladeshi eras, plus a set of international instruments such as the UDHR and ICCPR.

![The Nyayota homepage: a legal search field above featured statutes and legal research pathways.](../../assets/projects/nyayota-homepage.png)

*The Nyayota homepage — search-first, with featured statutes and guided pathways for common legal situations.*

## What is inside

The catalogue is organised by act, then chapter, then section. Each section carries its own
heading, marginal notes, cross-references and a short plain-language explanation, so the same
record can serve a law student checking a citation and a reader trying to understand what a
provision actually does.

Around that core sit a few tools that only make sense once the data is structured:

- **Search** runs client-side over the whole corpus and keeps recent queries locally.
- **Compare** puts two provisions side by side, aligned by section.
- **Cite** formats a reference in the style a reader's institution expects.
- **Verify** shows where the text came from and when it was last checked.

## Scope and honesty

Nyayota is deliberately an educational and informational platform. It does not give legal advice,
does not represent anyone, and does not claim to replace a lawyer or an official gazette. Where a
feature is incomplete — the public conversational assistant, currently documented as suspended in the repository, for instance — the interface says so rather
than pretending otherwise.

That discipline is also visible in the content: each provision is tied to a named source, and the
project publishes its roadmap publicly so readers can see what is finished and what is still
planned.

## Reading the implementation

The [public repository](https://github.com/afnan0356/nyayota) documents the feature matrix,
architecture and development roadmap. The status described here follows that documentation,
not an independent legal-content audit or a claim that every live route has been tested.

AI assistance is part of the development process. The useful evidence is the inspectable
implementation: typed content, reading interfaces, public source references and clearly stated limits.
