/** Learning notes, not inferred credentials. Dates are review dates unless
 * the entry describes a specific supported publication event. */
export type TimelineState =
  | "completed"
  | "in-progress"
  | "learning"
  | "planned";
export type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  state: TimelineState;
  href?: string;
  track?: string;
};
export const timelineStateLabels: Record<TimelineState, string> = {
  completed: "Published update",
  "in-progress": "In progress",
  learning: "Learning",
  planned: "Planned",
};
export const timeline: TimelineEntry[] = [
  {
    id: "portfolio-publication",
    date: "2026-11-03",
    title: "Editorial portfolio update published",
    summary:
      "The editorial design and content update is published. Further work on the introduction and project documentation continues separately.",
    state: "completed",
    href: "https://github.com/afnan0356/afnan0356-portfolio/commit/c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff",
    track: "Website",
  },
  {
    id: "nyayota",
    date: "2026-11-04",
    title: "Developing Nyayota",
    summary:
      "My main ongoing project: a legal information platform for Bangladesh. The source is public, development is AI-assisted, and not every feature is finished.",
    state: "in-progress",
    href: "/projects/nyayota/",
    track: "Web development",
  },
  {
    id: "legal-data",
    date: "2026-11-04",
    title: "Exploring structured legal data",
    summary:
      "How can acts, chapters and sections stay connected across search, reading and citation? Nyayota gives me a concrete place to explore that question.",
    state: "learning",
    href: "/projects/nyayota/#information-architecture",
    track: "Information structure",
  },
  {
    id: "accessible-interfaces",
    date: "2026-11-04",
    title: "Learning to test reading interfaces",
    summary:
      "Keyboard navigation, focus, readable type and reduced motion are areas I am continuing to learn about while refining this site.",
    state: "learning",
    track: "Accessibility",
  },
  {
    id: "writing",
    date: "2026-11-04",
    title: "Documenting what I learn",
    summary:
      "Longer-form writing is a direction to explore, not a published body of work. There is no publication schedule.",
    state: "planned",
    track: "Writing",
  },
];
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
