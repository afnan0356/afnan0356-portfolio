---
title: Nyayota
summary: An open-source legal research platform that makes Bangladeshi statutes searchable, comparable and readable.
lede: >-
  Nyayota (from Nyaya — justice, fairness, logical equity) turns scattered statutory text into a
  browsable, searchable library. It is an ongoing Next.js web application covering
  Bangladeshi legislation and selected international instruments.
year: '2026'
status: in-progress
statusNote: A public site is linked. Development continues; the public AI assistant is documented as suspended.
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
    The implementation models statutes as structured records (act, chapter, section, amendment history) instead of
    page-level documents, so the data can support search, comparison, citation export and print
    views. The interface is built around reading: generous measure, a persistent section sidebar,
    and typography that can carry long legal passages on a phone. Core legal content lives in typed data
    modules. That does not mean every part of the application is static.
  informationArchitecture: >-
    The reading model moves from an act to its chapters and sections. A section can carry a heading,
    explanatory text and references to related provisions. This makes the section a useful unit for
    navigation and citation. The important distinction is between the original legal text, an
    explanation and the source that a reader should consult.
  technicalArchitecture: >-
    The repository uses Next.js, React, TypeScript and Tailwind CSS. Legal data is held in versioned
    modules; components provide reading, search, comparison and citation interfaces. Some reading
    tools and saved preferences run in the browser. The application also has a server API route for
    the assistant, so it should not be described as a wholly static site. The inspected assistant route
    is gated by server configuration and returns a maintenance response when disabled. The README
    documents the public assistant as suspended; the live environment has not been independently checked.
  workflow:
    - title: Product direction & requirements
      detail: My involvement centres on what the project should help a reader do, which information should be visible, and how the different reading tools fit together.
    - title: Design choices & AI-assisted implementation
      detail: I use AI-assisted development while shaping the information structure and interface direction. The code is inspectable in the repository; I do not present all implementation as code independently written by me.
    - title: Review & testing boundaries
      detail: Generated changes need checking against the requirements, interface behaviour and sources. The repository contains tests and development notes, but their existence does not prove legal correctness or establish that I independently designed or executed every test.
  future:
    - Continue learning how the data model and interface fit together, rather than treating generated code as a finished understanding.
    - Keep incomplete or suspended functionality clearly distinguished from the reading tools documented in the repository.
    - Make project notes more specific as there are concrete changes to describe; no launch date or feature-completion promise is implied.
  decisions:
    - title: Model provisions, not just pages
      detail: Acts, chapters and sections are structured records. Search, comparison and citation tools can use the same underlying legal content rather than maintaining disconnected copies.
    - title: Keep the reading tools client-side
      detail: Search, comparison and local bookmarks work in the browser. Those browser-side tools are distinct from the server-side assistant route and should not be confused with its availability.
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
    - The repository documents browser-side search, comparison and citation tools; this is not an independent end-to-end verification of the live application.
    - The platform has an MIT-licensed public repository and is open to contributions.
  lessons:
    - A data model that reflects the structure of the subject (acts contain sections contain amendments) can let different reading tools use the same underlying records.
    - Citation and provenance belong close to the text. A source label or integrity hash alone does not establish that a legal interpretation is correct.
    - Typography does much of the usability work when the content is text-heavy and long.
---

## Reading the interface

Nyayota brings Bangladeshi statutes and selected international instruments into one reading
interface. Its purpose is to make legal information easier to navigate, not to provide legal advice.

![Repository screenshot of Nyayota showing search, featured statutes and guided legal pathways.](../../assets/projects/nyayota-homepage.png)

*The existing repository screenshot, not a generated mockup or a capture of the current live service.*

The search field gives readers a starting point. Featured statutes offer another route into the
catalogue, while guided pathways introduce common legal situations. These are different entry
points into the same subject; the screenshot is evidence of the interface, not proof of legal
accuracy or of every linked feature working today.

## Sources and implementation notes

The [public repository](https://github.com/afnan0356/nyayota) contains the feature matrix, technical
files and roadmap. The [inspected README](https://github.com/afnan0356/nyayota/blob/ce907d6d46ed9b219c4401eddcfb25fe2587e36c/README.md)
documents search, comparison, citations, local bookmarks and source-transparency panels. Its
public-assistant status says suspended. The source uses `ENABLE_PUBLIC_AI_ASSISTANT` to control
availability and returns HTTP 503 when it is disabled. Some older architecture prose describes an
active assistant, so this case study distinguishes documented status from server configuration;
it does not claim to know the live environment value.

Legal texts and explanations should be checked against official sources. This case study is a
project account, not a legal-content audit, a measure of adoption, or a claim of published research.
