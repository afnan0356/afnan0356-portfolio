import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}
const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const html = await Promise.all(htmlFiles.map((file) => readFile(file, 'utf8')));
const contentFiles = (await walk(path.join(root, 'src/content'))).filter((file) => /\.(md|mdx)$/.test(file));
const publicEntries = [];
for (const file of contentFiles) {
  const source = await readFile(file, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  assert.doesNotMatch(frontmatter, /^demo:\s*true\s*$/m, `Demo content remains: ${file}`);
  if (!/^draft:\s*true\s*$/m.test(frontmatter)) publicEntries.push(file);
}
const count = (collection) => publicEntries.filter((file) => file.startsWith(path.join(root, 'src/content', collection) + path.sep)).length;

const deletedRoutes = [
  '/projects/field-notes/', '/projects/quiet-index/',
  '/blog/hello-from-a-static-site/', '/blog/designing-a-theme-toggle-that-does-not-flash/',
  '/blog/the-quiet-cost-of-a-framework/', '/writing/on-small-tools/',
  '/writing/learning-in-public/', '/writing/book/the-long-quiet/',
  '/vault/category/certificate/', '/blog/tag/',
];
for (let i = 0; i < html.length; i++) {
  const source = html[i];
  for (const marker of [
    'editor-hint', 'Note for you', 'src/content/', 'src/config/', 'src/data/',
    'Write two sentences here', 'demonstration content', 'NyayotaShot',
    'import Nyayota', '>Sample<', 'Replace this paragraph', 'd="undefined"',
  ]) assert.ok(!source.includes(marker), `${htmlFiles[i]} leaks ${marker}`);
  for (const route of deletedRoutes) assert.ok(!source.includes(`href="${route}`), `Obsolete link: ${route}`);
  for (const tag of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(tag[0], /rel="[^"]*noopener/);
    assert.match(tag[0], /rel="[^"]*noreferrer/);
  }
}
for (const file of files) {
  const route = '/' + path.relative(dist, file).replaceAll(path.sep, '/');
  assert.ok(!deletedRoutes.some((deleted) => route.startsWith(deleted)), `Removed route exists: ${route}`);
}
const channels = [
  'https://github.com/afnan0356', 'https://x.com/mdafnan0356',
  'https://linktr.ee/afnan0356', 'https://discord.gg/JQUCpvcq',
  'https://t.me/afnan0356', 'https://youtube.com/@afnan0356',
  'https://www.instagram.com/afnan_0356', 'mailto:mdafnan0356@gmail.com',
];
const contact = await readFile(path.join(dist, 'contact/index.html'), 'utf8');
const contactMain = contact.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
assert.ok(contactMain, 'Contact main content must exist');
const footer = contact.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0];
assert.ok(footer, 'Shared footer must exist');
for (const destination of channels) {
  assert.ok(contactMain.includes(`href="${destination}"`), `Contact main missing ${destination}`);
  assert.ok(footer.includes(`href="${destination}"`), `Footer missing ${destination}`);
}
assert.match(contactMain, /data-copy-status[^>]*role="status"/);
assert.match(contactMain, /data-copy="mdafnan0356@gmail.com"/);
const about = await readFile(path.join(dist, 'about/index.html'), 'utf8');
assert.ok(about.includes('href="/projects/nyayota/"'), "About links to the genuine project");
assert.ok(/student/i.test(about), "About preserves confirmed student identity");
const nyayota = await readFile(path.join(dist, 'projects/nyayota/index.html'), 'utf8');
assert.ok((nyayota.match(/<img\b/g) ?? []).length >= 2, 'Nyayota cover and body image must render');
const hasFeed = files.includes(path.join(dist, 'rss.xml'));
if (hasFeed) {
  const rss = await readFile(path.join(dist, 'rss.xml'), 'utf8');
  assert.equal((rss.match(/<item>/g) ?? []).length, count('blog'), 'RSS must match genuine published articles');
  const sitemap = await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8');
  for (const route of deletedRoutes) assert.ok(!sitemap.includes(route), `Sitemap includes ${route}`);
  assert.ok(files.includes(path.join(dist, 'sitemap-index.xml')));
  const origin = new URL(rss.match(/<link>(.*?)<\/link>/)[1]).origin;
  for (const source of html) {
    const canonical = source.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical, 'Configured build must emit canonical URLs');
    assert.equal(new URL(canonical).origin, origin);
  }
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    assert.equal(url.origin, origin);
    assert.ok(files.includes(path.join(dist, url.pathname, 'index.html')), `Sitemap route does not exist: ${url.pathname}`);
  }
  assert.ok((await readFile(path.join(dist, 'robots.txt'), 'utf8')).includes(`Sitemap: ${origin}/sitemap-index.xml`));
} else {
  for (const source of html) {
    assert.ok(!source.includes('rel="canonical"'));
    assert.ok(!source.includes('href="/rss.xml"'));
  }
}
console.log(`Stage 1 assertions passed: ${htmlFiles.length} pages; eight channels; clean public HTML; ${hasFeed ? 'domain-configured' : 'domain-optional'} metadata.`);
