/**
 * CV DATA — the single source of truth for the web CV and its print view.
 *
 * ⚠️  CONTENT POLICY
 * Only verifiable information is filled in. Personal details I could not
 * confirm (education, employment, languages, location) are deliberately
 * empty: the page omits those sections instead of inventing them, and
 * keeps author guidance in development previews only.
 *
 * When you add a PDF, put it in `public/` and set `site.cvPdf` in
 * `src/config/site.ts` — the download button then appears automatically.
 */

export type CvEntry = {
  /** Job title, degree name, or project title. */
  title: string;
  /** Organisation, institution, or context. */
  organisation?: string;
  /** Human-readable date range, e.g. "2024 — present". */
  period?: string;
  /** One or two sentences. */
  description?: string;
  /** Bullet points: responsibilities, results, coursework. */
  highlights?: string[];
  /** Optional link. */
  href?: string;
};

export const cv = {
  /**
   * A short profile paragraph. Replace the placeholder text with two
   * sentences about what you do and what you want to be known for.
   */
  summary:
    'I work on web projects that make information easier to find, read and use. My selected work includes Nyayota, an open-source legal research platform for Bangladesh, and this static Astro portfolio. My workflow includes AI-assisted development, with a focus on information structure, readable interfaces and static delivery.',
  /** Marks the summary above as placeholder copy (hides it when hints are off). */
  summaryIsPlaceholder: false,

  /* ── Education ───────────────────────────────────────────────
     Add entries and the section appears automatically, e.g.
     { title: 'BSc in Computer Science', organisation: 'University', period: '2024 — present' } */
  education: [] as CvEntry[],

  /* ── Experience ──────────────────────────────────────────────
     Internships, freelance work, part-time roles. */
  experience: [] as CvEntry[],

  /* ── Selected work ───────────────────────────────────────────
     Facts below come from the public repositories and README files. */
  selectedWork: [
    {
      title: 'Nyayota — open legal research platform',
      organisation: 'Personal project · AI-assisted development · MIT licensed',
      period: 'Repository created Aug 2026',
      description:
        'An open-source, statically deployed legal research platform covering Bangladeshi statutes and selected international instruments.',
      highlights: [
        'Built with Next.js, React, TypeScript and Tailwind CSS.',
        'Statutory catalogue with section-level navigation, bilingual terminology and cross-references.',
        'Client-side full-text search, comparative views, citation export and source-transparency panels.',
      ],
      href: 'https://nyayota.vercel.app',
    },
    {
      title: 'afnan0356-portfolio',
      organisation: 'This website · Astro',
      period: '2026',
      description:
        'A static personal site with a file-based content system for projects, writing, books, blog posts and documents.',
      highlights: [
        'Astro with TypeScript, MDX content collections and no client-side framework.',
        'Dark and light themes with a persisted preference and a reduced-motion fallback.',
      ],
      href: 'https://github.com/afnan0356/afnan0356-portfolio',
    },
  ] as CvEntry[],

  /** Grouped skills — technologies that appear in the projects above. */
  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
    { group: 'Frameworks & tools', items: ['React', 'Next.js', 'Astro', 'Tailwind CSS', 'Vite'] },
    { group: 'Workflow', items: ['Git & GitHub', 'Vercel', 'Responsive design', 'Accessibility testing'] },
  ],

  /** Spoken/written languages. Empty until you add real ones. */
  languages: [] as { name: string; level: string }[],

  /** Optional closing line. Set to null to hide. */
  footnote: null as string | null,
};
