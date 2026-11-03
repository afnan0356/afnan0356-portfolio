/**
 * PROGRESS TIMELINE — learning and personal development.
 *
 * This is deliberately separate from the Vault. The Vault holds documents
 * and evidence; the timeline holds the honest state of the work:
 *
 *   • verified     — completed, with something public to point at
 *   • in-progress  — actively being worked on (never presented as done)
 *   • learning     — studying, no output yet
 *   • planned      — known, not started
 *
 * Everything below is either public and verifiable (Nyayota, this site) or
 * explicitly labelled as a target. Add your own entries as you go.
 */

export type TimelineState = 'verified' | 'in-progress' | 'learning' | 'planned';

export type TimelineEntry = {
  date: string;
  title: string;
  summary: string;
  state: TimelineState;
  href?: string;
  /** Optional grouping label, e.g. "Foundations". */
  track?: string;
};

export const timelineStateLabels: Record<TimelineState, string> = {
  verified: 'Completed',
  'in-progress': 'In progress',
  learning: 'Currently learning',
  planned: 'Planned',
};

export const timeline: TimelineEntry[] = [
  {
    date: '2026-11',
    title: 'Built this portfolio',
    summary:
      'Designed and built a static Astro site with a file-based content system, a persisted theme, and no client-side framework.',
    state: 'in-progress',
    href: '/projects/',
    track: 'Web development',
  },
  {
    date: '2026-08',
    title: 'Released Nyayota',
    summary:
      'Shipped an open-source legal research platform covering Bangladeshi statutes and selected international instruments.',
    state: 'verified',
    href: '/projects/nyayota/',
    track: 'Web development',
  },
  {
    date: '2026-08',
    title: 'Typed data modelling for legal content',
    summary:
      'Learned to model statutes as structured records rather than documents, so search, comparison and citation export could all read the same source.',
    state: 'verified',
    track: 'Engineering practice',
  },
  {
    date: '2026-11',
    title: 'Accessibility as a build step',
    summary:
      'Working through keyboard navigation, focus management and reduced-motion support as part of the design system rather than as an afterthought.',
    state: 'learning',
    track: 'Accessibility',
  },
  {
    date: '2027',
    title: 'Longer-form writing',
    summary:
      'Planning a collection of essays on building for the web in low-bandwidth contexts. No publication date yet.',
    state: 'planned',
    track: 'Writing',
  },
];

/** Grouped and ordered newest-first, ready for rendering. */
export function timelineByYear(): { year: string; entries: TimelineEntry[] }[] {
  const groups = new Map<string, TimelineEntry[]>();
  for (const entry of timeline) {
    const year = entry.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), entry]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, entries]) => ({
      year,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
    }));
}
