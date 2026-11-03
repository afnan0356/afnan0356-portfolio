import { getCollection, type CollectionEntry } from 'astro:content';
import { isProd } from '../content.config';

/**
 * CONTENT HELPERS
 * Every page reads content through these functions, so the rules for
 * drafts, ordering and "featured" live in exactly one place.
 */

/* ── Drafts ────────────────────────────────────────────────────
   In production, drafts are dropped before anything else happens.
   In `npm run dev` they are kept so you can preview while writing. */
const published = <T extends { data: { draft: boolean } }>(entries: T[]): T[] =>
  isProd ? entries.filter((entry) => !entry.data.draft) : entries;

export const isDemo = (entry: { data: { demo?: boolean } }): boolean => entry.data.demo === true;

const byNewest = (a: { data: { published: Date } }, b: { data: { published: Date } }) =>
  b.data.published.getTime() - a.data.published.getTime();

/* ── Blog ──────────────────────────────────────────────────────*/
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  return published(await getCollection('blog')).sort(byNewest);
}

export async function getPostTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/* ── Projects ──────────────────────────────────────────────────*/
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  return published(await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects(limit = 3): Promise<CollectionEntry<'projects'>[]> {
  return (await getProjects()).filter((project) => project.data.featured).slice(0, limit);
}

/* ── Writing ───────────────────────────────────────────────────
   Split into standalone pieces and book overviews. Chapters are never
   listed in the index — they are reached through their book. */
export async function getPieces(): Promise<CollectionEntry<'writing'>[]> {
  return published(await getCollection('writing'))
    .filter((entry) => entry.data.kind === 'piece' && entry.data.chapter === undefined)
    .sort(byNewest);
}

export async function getBooks(): Promise<CollectionEntry<'writing'>[]> {
  return published(await getCollection('writing'))
    .filter((entry) => entry.data.kind === 'book' && entry.data.chapter === undefined)
    .sort(byNewest);
}

export type Chapter = CollectionEntry<'writing'>;

/**
 * Chapter URLs use only the file name, not the folder:
 *   src/content/writing/my-book/01-the-ferry.md → "01-the-ferry"
 * The book slug is already in the path, so there is no ambiguity.
 */
export const chapterSlug = (entry: { id: string }): string => entry.id.split('/').pop() ?? entry.id;

export async function getChapters(bookSlug: string): Promise<Chapter[]> {
  return published(await getCollection('writing'))
    .filter((entry) => entry.data.book === bookSlug && entry.data.chapter !== undefined)
    .sort((a, b) => (a.data.chapter ?? 0) - (b.data.chapter ?? 0));
}

/** All published entries, for the writing index counts. */
export async function getAllWriting(): Promise<CollectionEntry<'writing'>[]> {
  return published(await getCollection('writing'));
}

/* ── Vault ─────────────────────────────────────────────────────*/
export async function getVaultItems(): Promise<CollectionEntry<'vault'>[]> {
  return published(await getCollection('vault')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const vaultCategories = [
  { id: 'all', label: 'Everything' },
  { id: 'cv', label: 'CVs' },
  { id: 'certificate', label: 'Certificates' },
  { id: 'publication', label: 'Publications' },
  { id: 'research', label: 'Research' },
  { id: 'evidence', label: 'Project evidence' },
  { id: 'other', label: 'Other' },
] as const;

export const statusLabels: Record<string, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  completed: 'Completed',
  archived: 'Archived',
};

export const formLabels: Record<string, string> = {
  story: 'Short story',
  essay: 'Essay',
  novel: 'Novel',
  novella: 'Novella',
  poetry: 'Poetry',
  note: 'Note',
  research: 'Research',
};

export const verificationLabels: Record<string, { label: string; tone: string }> = {
  verified: { label: 'Verified', tone: 'good' },
  'self-reported': { label: 'Self-reported', tone: 'neutral' },
  'in-progress': { label: 'In progress', tone: 'warn' },
};
