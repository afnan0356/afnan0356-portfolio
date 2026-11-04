/** Deliberately blocked fonts: fallback layout must remain usable. */
import { createRequire } from "node:module";
import fs from "node:fs/promises";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(tools + "/package.json");
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
import assert from "node:assert/strict";
const b = await pw.launch({
  executablePath: await chromium.executablePath(),
  args: [
    ...chromium.args.filter(
      (a) => !["--single-process", "--in-process-gpu"].includes(a),
    ),
    "--disable-gpu",
  ],
  env: { ...process.env, LD_LIBRARY_PATH: tools + "/libraries/lib" },
});
const rows = [];
try {
  for (const width of [320, 360, 390, 412, 768, 1024, 1440]) {
    const c = await b.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
    });
    await c.route("**/*.woff2", (r) => r.abort());
    const p = await c.newPage();
    await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
    const row = await p.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > innerWidth)
        .slice(0, 12)
        .map((e) => ({
          tag: e.tagName,
          cl: e.className,
          right: e.getBoundingClientRect().right,
          text: e.textContent?.slice(0, 45),
        })),
      heroHeight: document
        .querySelector(".hero-heading")
        .getBoundingClientRect().height,
    }));
    rows.push(row);
    console.log(row);
    assert.ok(row.scrollWidth <= width);
    await c.close();
  }
  await fs.writeFile(
    "reports/human-pass/cold-fonts.json",
    JSON.stringify(rows, null, 2),
  );
} finally {
  await b.close();
}
