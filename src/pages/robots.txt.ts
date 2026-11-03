/**
 * robots.txt, generated at build time.
 *
 * It lists the demo pages as disallowed so sample content cannot compete
 * with real work in search results, and points at the sitemap — but only
 * once SITE_URL is configured, so we never advertise a wrong domain.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Sample content shipped with the template — never indexed.',
    'Disallow: /blog/hello-from-a-static-site/',
    'Disallow: /blog/designing-a-theme-toggle-that-does-not-flash/',
    'Disallow: /blog/the-quiet-cost-of-a-framework/',
    'Disallow: /writing/on-small-tools/',
    'Disallow: /writing/learning-in-public/',
    'Disallow: /writing/the-long-quiet/',
    'Disallow: /projects/field-notes/',
    'Disallow: /projects/quiet-index/',
    '',
  ];

  if (site) lines.push(`Sitemap: ${new URL('/sitemap-index.xml', site).href}`, '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
