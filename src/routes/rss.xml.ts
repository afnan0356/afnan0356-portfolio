/**
 * RSS feed for the blog.
 *
 * This route is only injected when SITE_URL is set (see astro.config.mjs),
 * because a feed without absolute URLs is not a valid feed.
 * Files in `src/routes/` are never treated as pages — they must be injected.
 */
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '../lib/content';
import { site } from '../config/site';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();

  return rss({
    title: `${site.name} — Blog`,
    description: site.description,
    site: context.site ?? 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${site.language}</language>`,
  });
};
