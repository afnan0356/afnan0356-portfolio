/** Actual page-by-page captures. External browser tools; no application dependency. */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
const phase = process.env.REVIEW_PHASE || "after";
const dir = `reports/stage2-3/${phase}`;
await fs.mkdir(dir, { recursive: true });
const browser = await pw.launch({
  executablePath: await chromium.executablePath(),
  args: [
    ...chromium.args.filter(
      (a) => !["--single-process", "--in-process-gpu"].includes(a),
    ),
    "--disable-gpu",
  ],
  env: { ...process.env, LD_LIBRARY_PATH: path.join(tools, "libraries/lib") },
});
const routes = (
  process.env.REVIEW_ROUTES ??
  ",about,projects,projects/nyayota,cv,vault,vault/category/evidence,blog,writing,contact,404.html"
).split(",");
const rows = [];
for (const theme of ["dark", "light"])
  for (const width of [1440, 390]) {
    const c = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    await c.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await c.newPage();
    for (const route of routes) {
      const errors = [];
      const listener = (e) => errors.push(e.message);
      p.on("pageerror", listener);
      await p.goto(
        `http://localhost:4321/${route}${route && !route.endsWith(".html") ? "/" : ""}`,
        { waitUntil: "networkidle" },
      );
      await p.locator("img").evaluateAll((imgs) =>
        Promise.all(
          imgs.map(async (i) => {
            i.loading = "eager";
            try {
              await i.decode();
            } catch {}
          }),
        ),
      );
      await p.evaluate(() => document.fonts.ready);
      for (const image of await p.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await p.evaluate(
          () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(r)),
            ),
        );
      }
      await p.evaluate(() => scrollTo(0, 0));
      await p.evaluate(
        () =>
          new Promise((r) =>
            requestAnimationFrame(() => requestAnimationFrame(r)),
          ),
      );
      await p.screenshot({
        path: `${dir}/${route.replaceAll("/", "-") || "home"}-${theme}-${width}.png`,
        fullPage: true,
      });
      rows.push({
        route: route || "home",
        theme,
        width,
        ...(await p.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          h1: document.querySelector("h1")?.textContent,
          missingImages: [...document.images]
            .filter((i) => i.complete && !i.naturalWidth)
            .map((i) => i.src),
        }))),
        errors,
      });
      p.off("pageerror", listener);
    }
    await c.close();
  }
await fs.writeFile(
  `reports/stage2-3/${phase}-review.json`,
  JSON.stringify(rows, null, 2),
);
await browser.close();
console.log(`Captured ${rows.length} actual views (${phase}).`);
