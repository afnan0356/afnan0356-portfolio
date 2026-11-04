import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      files.map((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : path.join(dir, entry.name),
      ),
    )
  ).flat();
}
const pages = (await walk(dist)).filter((file) => file.endsWith(".html"));
const cache = new Map(
  await Promise.all(
    pages.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);
let checked = 0;
for (const [file, html] of cache) {
  const relative = path.relative(dist, file).replaceAll(path.sep, "/");
  const origin = new URL(
    `https://review.invalid/${relative.replace(/index\.html$/, "")}`,
  );
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    const url = new URL(href, origin);
    if (url.origin !== origin.origin || !url.hash || url.hash === "#") continue;
    const pathname = decodeURIComponent(url.pathname);
    const target = path.join(
      dist,
      pathname.endsWith("/") ? `${pathname}index.html` : pathname,
    );
    assert.ok(
      cache.has(target),
      `${relative}: fragment target page missing: ${href}`,
    );
    const id = decodeURIComponent(url.hash.slice(1));
    const ids = Array.from(
      cache.get(target).matchAll(/\bid="([^"]+)"/g),
      (item) => item[1],
    );
    assert.ok(ids.includes(id), `${relative}: missing #${id} in ${pathname}`);
    checked++;
  }
}
const nyayota = cache.get(path.join(dist, "projects/nyayota/index.html"));
assert.ok(nyayota.includes("AI-assisted development"));
assert.ok(!nyayota.includes("Sole designer and developer"));
assert.ok(
  nyayota.includes("Status &amp; limits") ||
    nyayota.includes("Status & limits"),
);
const cv = cache.get(path.join(dist, "cv/index.html"));
assert.ok(cv.includes("My workflow includes AI-assisted development"));
const result = {
  pages: pages.length,
  fragmentLinksChecked: checked,
  passed: true,
};
await writeFile(
  `${process.env.REVIEW_REPORT_PATH || "reports/stage2-1"}/fragment-checks.json`,
  JSON.stringify(result, null, 2),
);
console.log(
  `Stage 2.1 assertions passed: ${pages.length} HTML pages; ${checked} internal fragment links; AI-assisted scope and CV profile present.`,
);
