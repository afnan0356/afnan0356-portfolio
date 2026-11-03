#!/usr/bin/env node
/**
 * Content & link verification for the built site.
 *
 *   npm run build && npm run verify:content
 *
 * It walks `dist/`, parses every HTML file, and checks:
 *   1. Internal links resolve to a real file (no 404s).
 *   2. Every page has a <title>, a meta description and a canonical-ish path.
 *   3. Each page has exactly one <h1>, and no duplicate IDs.
 *   4. Images have alt text.
 *   5. No `draft: true` content leaked into the production build.
 *   6. Every page has lang, a viewport tag, and a skip link.
 *
 * Exits non-zero when something fails, so it can gate a deploy.
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const content = path.join(root, 'src/content');

if (!existsSync(dist)) {
  console.error('✖ dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

/* ── Gather every built page ────────────────────────────────── */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const allFiles = await walk(dist);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));

/** "/projects/nyayota/" → dist/projects/nyayota/index.html */
const urlToFile = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (clean === '') return null;
  const candidate = path.join(dist, clean);
  if (clean.endsWith('/')) return path.join(candidate, 'index.html');
  if (path.extname(candidate)) return candidate;
  return path.join(candidate, 'index.html');
};

const failures = [];
const warnings = [];
let checkedLinks = 0;

/* ── Per-page checks ───────────────────────────────────────── */
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const page = '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');

  // 1. Title & description
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) failures.push(`${page}: missing <title>`);

  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  if (!description) failures.push(`${page}: missing meta description`);
  else if (description.length > 300) warnings.push(`${page}: description is ${description.length} chars`);

  // 2. Language, viewport, skip link
  if (!/<html[^>]+lang="[a-z]{2}/i.test(html)) failures.push(`${page}: missing html lang`);
  if (!/<meta name="viewport"/.test(html)) failures.push(`${page}: missing viewport meta`);
  if (!/class="skip-link"/.test(html)) failures.push(`${page}: missing skip link`);

  // 3. Exactly one h1
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) failures.push(`${page}: ${h1Count} <h1> elements (expected 1)`);

  // 4. Duplicate IDs
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${page}: duplicate id(s): ${[...new Set(duplicates)].join(', ')}`);

  // 5. Images need alt text
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(img[0])) {
      failures.push(`${page}: <img> without alt — ${img[0].slice(0, 80)}…`);
    }
  }

  // 6. Internal links resolve
  const hrefs = new Set(
    [...html.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((href) => href.startsWith('/') && !href.startsWith('//'))
      .filter((href) => !href.startsWith('/_astro/')),
  );

  for (const href of hrefs) {
    // Assets referenced from public/ (PDFs, images…) are checked too.
    const target = urlToFile(href);
    if (!target) continue;
    checkedLinks++;
    if (!existsSync(target)) failures.push(`${page}: broken internal link → ${href}`);
  }
}

/* ── Draft leakage ─────────────────────────────────────────── */
async function walkContent(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkContent(full)));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const contentFiles = await walkContent(content);
let draftCount = 0;

for (const file of contentFiles) {
  const source = await readFile(file, 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const isDraft = /^draft:\s*true\s*$/m.test(frontmatter);
  if (!isDraft) continue;

  draftCount++;
  const slug = path
    .relative(content, file)
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/, '')
    .replace(/\/_book$/, '');

  // A draft must not have produced a page anywhere in the output.
  const leaked = htmlFiles.some((htmlFile) => {
    const relative = path.relative(dist, htmlFile).replace(/\\/g, '/');
    return relative.includes(slug.split('/').pop());
  });

  if (leaked) failures.push(`draft leaked into build: ${path.relative(root, file)}`);
}

/* ── Report ────────────────────────────────────────────────── */
const pagesChecked = htmlFiles.length;
const totalFiles = (await walk(dist)).length;

console.log(`\nverifying ${pagesChecked} pages (${totalFiles} files in dist/)\n`);
console.log(`  pages .................. ${pagesChecked}`);
console.log(`  internal links checked .. ${checkedLinks}`);
console.log(`  content files ........... ${contentFiles.length}`);
console.log(`  drafts found (skipped) .. ${draftCount}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (failures.length) {
  console.log(`\n✖ ${failures.length} problem(s):`);
  for (const failure of failures) console.log(`  ✖ ${failure}`);
  process.exit(1);
}

console.log('\n✓ all checks passed\n');
