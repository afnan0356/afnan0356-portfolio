import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { site } from './config/site';

/**
 * CONTENT COLLECTIONS
 *
 * Two flags control what the public build contains, on every collection:
 *
 *   draft: true   → the file is ignored in production builds.
 *                   (`npm run dev` shows it so you can preview while writing,
 *                   with a visible "draft" banner.)
 *   demo: true    → the file is example content shipped with the template.
 *                   Demo pages render normally but carry a "sample content"
 *                   banner, and are excluded from the sitemap.
 *
 * ⚠️  Anything committed to a public repository is public, whatever folder
 *     it is in. Use `draft: true` for work in progress you don't want
 *     deployed, and keep genuinely private material out of the repo.
 */
export const isProd = import.meta.env.PROD;

/** Shared flags for every collection. */
const flags = {
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
};

const isoDate = z.coerce.date();

/** Optional external link (live site, repository, PDF…). Zod 4: z.url(). */
const link = z.url().optional();

/* ── PROJECTS ──────────────────────────────────────────────────
   A project is "featured" by setting featured: true. Adding a full
   `caseStudy` object turns it into a long-form case-study page; without
   it the page renders in a compact, single-column layout instead. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      ...flags,
      title: z.string(),
      /** One sentence, used on cards and in metadata. */
      summary: z.string(),
      /** A longer lead paragraph for the project page. */
      lede: z.string().optional(),
      year: z.string(),
      status: z.enum(['live', 'in-progress', 'completed', 'archived']),
      /** Free-form labels shown as chips (e.g. "open source", "client work"). */
      tags: z.array(z.string()).default([]),
      stack: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      /** Lower numbers sort first. */
      order: z.number().default(50),
      links: z
        .object({
          live: link,
          repo: link,
          docs: link,
        })
        .default({}),
      cover: z.optional(image()),
      coverAlt: z.string().optional(),
      /** Only include what is true — every field renders as a headed section. */
      caseStudy: z
        .object({
          problem: z.string().optional(),
          goal: z.string().optional(),
          role: z.string().optional(),
          approach: z.string().optional(),
          decisions: z.array(z.object({ title: z.string(), detail: z.string() })).optional(),
          features: z.array(z.string()).optional(),
          limitations: z.array(z.string()).optional(),
          challenges: z.array(z.object({ challenge: z.string(), response: z.string() })).optional(),
          results: z.array(z.string()).optional(),
          lessons: z.array(z.string()).optional(),
          /** Verified metrics only. Leave empty if you cannot measure them. */
          metrics: z
            .array(z.object({ value: z.string(), label: z.string() }))
            .default([]),
        })
        .optional(),
      updated: isoDate.optional(),
    }),
});

/* ── BLOG ──────────────────────────────────────────────────────
   Short-to-medium articles. Reading time is calculated from the body. */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      ...flags,
      title: z.string(),
      description: z.string(),
      published: isoDate,
      updated: isoDate.optional(),
      tags: z.array(z.string()).default([]),
      cover: z.optional(image()),
      coverAlt: z.string().optional(),
      /** Pin to the top of the blog index. */
      featured: z.boolean().default(false),
    }),
});

/* ── WRITING ───────────────────────────────────────────────────
   One collection, two kinds of entry:
     kind: 'piece'  → a standalone story, essay, poem or note
     kind: 'book'   → a book; chapters are separate files with the same
                      `book` slug and an incrementing `order`
   Chapters are filtered out of the Writing index and only appear on the
   book's own page, in the right order. */
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: ({ image }) =>
    z
      .object({
        ...flags,
        kind: z.enum(['piece', 'book']).default('piece'),
        title: z.string(),
        description: z.string(),
        /** Shown on the card and in metadata. */
        form: z.enum(['story', 'essay', 'novel', 'novella', 'poetry', 'note', 'research']),
        published: isoDate,
        updated: isoDate.optional(),
        tags: z.array(z.string()).default([]),
        cover: z.optional(image()),
        coverAlt: z.string().optional(),
        readingTime: z.number().optional(),
        /** Books only: the public path for the book, e.g. "the-long-quiet". */
        book: z.string().optional(),
        /** Books only, on the overview file: the order chapters appear. */
        chapters: z.array(z.string()).optional(),
        /** Chapters only: a chapter title and its position. */
        chapter: z.number().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.kind === 'book' && !data.book) {
          ctx.addIssue({ code: 'custom', message: 'Book entries need a `book` slug.' });
        }
        if (data.chapter !== undefined && !data.book) {
          ctx.addIssue({ code: 'custom', message: 'Chapter files need a `book` slug.' });
        }
      }),
});

/* ── VAULT ─────────────────────────────────────────────────────
   The document library. Files live in /public/vault and are linked by
   path. Never add a document here that should not be public. */
const vault = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/vault' }),
  schema: z.object({
    ...flags,
    title: z.string(),
    description: z.string(),
    category: z.enum(['cv', 'certificate', 'publication', 'research', 'evidence', 'other']),
    date: isoDate,
    /** Where the file is. Must live under /vault/ (i.e. in public/vault/). */
    file: z
      .string()
      .regex(/^\/vault\//, { error: 'Files must live in public/vault/ — use a /vault/… path.' })
      .optional(),
    /** External evidence link, e.g. a repository or live site. */
    link: link,
    verification: z.enum(['verified', 'self-reported', 'in-progress']).default('self-reported'),
    issuer: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, blog, writing, vault };

/** Used by pages that need a canonical base for absolute URLs. */
export const configuredSiteUrl = site.url;
