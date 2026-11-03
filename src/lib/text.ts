/**
 * Small, dependency-free text utilities.
 * Kept separate so they can be used by pages, layouts and scripts alike.
 */

/** 1_400 → "1,400" (no locale surprises between build machines). */
export function formatNumber(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** A consistent, unambiguous date: "3 November 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Compact form for card metadata: "Nov 2026". */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** ISO date for <time datetime="…">. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Reading time from raw markdown.
 * ~200 words per minute, code blocks counted at a third of a word each,
 * rounded up, minimum one minute. Deliberately simple and predictable.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const withoutCode = body.replace(/```[\s\S]*?```/g, (block) => block.repeat(0) + ' ');
  const words = withoutCode.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** "1 minute" / "4 minutes". */
export function pluralMinutes(minutes: number): string {
  return `${minutes} min read`;
}

/** Turn "Ch. 2 · The water" into a stable anchor id. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Group an array by a key. */
export function groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]> {
  return items.reduce(
    (groups, item) => {
      const group = key(item);
      (groups[group] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}

/** Title-case a tag for display: "open-source" → "Open source". */
export function tagLabel(tag: string): string {
  const spaced = tag.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
