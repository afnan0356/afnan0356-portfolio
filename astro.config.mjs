import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { getDemoPaths } from './scripts/demo-paths.mjs';

/**
 * The production URL is intentionally *not* hardcoded.
 *
 * Set `SITE_URL` (for example in a `.env` file or in your host's build settings) and
 * Astro will automatically enable:
 *   - canonical URLs + absolute Open Graph URLs
 *   - the XML sitemap
 *   - the RSS feed at /rss.xml
 *
 * Without `SITE_URL` the site still builds and works perfectly for local preview,
 * it just avoids emitting placeholder/incorrect absolute URLs.
 */
const SITE = process.env.SITE_URL ?? undefined;

// Demo content is real, buildable content that is clearly labelled as a sample.
// It is marked `demo: true` in its frontmatter, and its URLs are discovered
// automatically so example pages never enter the sitemap.
const DEMO_PATHS = await getDemoPaths(
  fileURLToPath(new URL('./src/content', import.meta.url)),
);

/** RSS only exists once a real site URL is configured. */
const rssRoutes = SITE
  ? {
      name: 'conditional-rss',
      hooks: {
        'astro:config:setup': ({ injectRoute }) => {
          injectRoute({ pattern: '/rss.xml', entrypoint: './src/routes/rss.xml.ts' });
        },
      },
    }
  : null;

/**
 * Dev-server host allowlist.
 * Vite blocks requests whose Host header it doesn't recognise, which breaks
 * hosted previews and tunnels. `.e2b.app` covers the sandboxed preview used
 * while building; add your own with DEV_ALLOWED_HOSTS="a.example,b.example".
 */
const DEV_ALLOWED_HOSTS = [
  '.e2b.app',
  ...(process.env.DEV_ALLOWED_HOSTS?.split(',')
    .map((host) => host.trim())
    .filter(Boolean) ?? []),
];

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    mdx(),
    SITE
      ? sitemap({
          filter: (page) => !DEMO_PATHS.includes(new URL(page).pathname),
        })
      : null,
    rssRoutes,
  ].filter(Boolean),
  server: {
    host: true,
    port: 4321,
    allowedHosts: DEV_ALLOWED_HOSTS,
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: true,
    },
  },
});
