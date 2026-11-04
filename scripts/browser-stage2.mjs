/** Production browser QA. See reports/stage2/README.md for external test-tool setup. */
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const chromiumModule = require("@sparticuz/chromium");
const chromium = chromiumModule.default ?? chromiumModule;
const { chromium: pw } = require("playwright-core");
const dir = fileURLToPath(
  new URL(
    process.env.BROWSER_REPORT_PATH || "../reports/stage2/",
    import.meta.url,
  ),
);
await fs.mkdir(dir, { recursive: true });
const browser = await pw.launch({
  executablePath: await chromium.executablePath(),
  // Multi-context QA requires Chromium's normal process isolation.
  args: [
    ...chromium.args.filter(
      (a) => !["--single-process", "--in-process-gpu"].includes(a),
    ),
    "--disable-gpu",
  ],
  env: { ...process.env, LD_LIBRARY_PATH: path.join(tools, "libraries/lib") },
});
const viewportResults = [];
for (const theme of ["dark", "light"])
  for (const width of (process.env.BROWSER_WIDTHS || "320,360,390,768,1440")
    .split(",")
    .map(Number)) {
    const ctx = await browser.newContext({
      viewport: { width, height: width > 1000 ? 1000 : 844 },
      deviceScaleFactor: 1,
      colorScheme: "light",
    });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
    await p.waitForTimeout(1500);
    for (
      let y = 0;
      y < (await p.evaluate(() => document.body.scrollHeight));
      y += 600
    ) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(140);
    }
    await p.waitForTimeout(1200);
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(350);
    const metrics = await p.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      appliedTheme: document.documentElement.dataset.theme,
      hidden: [
        ...document.querySelectorAll(
          "[data-motion],[data-title-line],[data-enter]",
        ),
      ]
        .filter((e) => getComputedStyle(e).opacity === "0")
        .map((e) => e.className),
      overflows: [...document.querySelectorAll("body *")]
        .filter(
          (e) =>
            e.getBoundingClientRect().right > innerWidth + 1 &&
            getComputedStyle(e).position !== "fixed",
        )
        .map((e) => ({
          tag: e.tagName,
          class: e.className,
          right: e.getBoundingClientRect().right,
        }))
        .slice(0, 12),
    }));
    if ([390, 1440].includes(width))
      await p.screenshot({
        path: `${dir}/home-${theme}-${width}.png`,
        fullPage: true,
      });
    viewportResults.push({ theme, width, ...metrics, errors });
    await ctx.close();
  }
await fs.writeFile(
  `${dir}/viewport-checks.json`,
  JSON.stringify(viewportResults, null, 2),
);
for (const row of viewportResults) {
  assert.equal(row.appliedTheme, row.theme);
  assert.ok(row.scrollWidth <= row.width);
  assert.deepEqual(row.errors, []);
  assert.deepEqual(row.hidden, []);
}
const results = [];
async function test(name, run) {
  await run();
  results.push({ name, pass: true });
  console.log("PASS", name);
}
const c = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: "light",
});
const p = await c.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await test("Dark default despite light OS", async () =>
  assert.equal(await p.getAttribute("html", "data-theme"), "dark"));
await test("Motion starts then completes hero", async () => {
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(100);
  const n = await p
    .locator("[data-title-line]")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  assert.ok(Number(n) < 1);
  await p.waitForTimeout(1600);
  assert.equal(
    await p
      .locator("[data-title-line]")
      .first()
      .evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
});
await test("Theme toggles and persists across real navigation", async () => {
  await p.locator("[data-theme-toggle]").first().click();
  await p.waitForTimeout(600);
  assert.equal(await p.getAttribute("html", "data-theme"), "light");
  await p.goto("http://localhost:4321/about/", { waitUntil: "networkidle" });
  assert.equal(await p.getAttribute("html", "data-theme"), "light");
  await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
});
await test("Mobile modal: inert background, keyboard wrap, Escape focus return", async () => {
  await p.locator("[data-menu-toggle]").click();
  assert.equal(await p.locator("main").evaluate((e) => e.inert), true);
  const first = p.locator("[data-mobile-menu] a").first();
  assert.ok(await first.evaluate((e) => document.activeElement === e));
  await p.keyboard.press("Shift+Tab");
  assert.ok(
    await p
      .locator("[data-mobile-menu] button")
      .last()
      .evaluate((e) => document.activeElement === e),
  );
  await p.keyboard.press("Tab");
  assert.ok(await first.evaluate((e) => document.activeElement === e));
  await p.keyboard.press("Escape");
  assert.equal(await p.locator("main").evaluate((e) => e.inert), false);
  assert.ok(
    await p
      .locator("[data-menu-toggle]")
      .evaluate((e) => document.activeElement === e),
  );
});
await test("Resize closes mobile modal", async () => {
  await p.locator("[data-menu-toggle]").click();
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.waitForTimeout(200);
  assert.equal(
    await p.locator("[data-menu-toggle]").getAttribute("aria-expanded"),
    "false",
  );
  assert.equal(await p.locator("main").evaluate((e) => e.inert), false);
});
await test("Repeated Astro init/cleanup restores animation-owned inline styles", async () => {
  for (let i = 0; i < 3; i++) {
    await p.evaluate(() =>
      document.dispatchEvent(new Event("astro:page-load")),
    );
    await p.waitForTimeout(50);
    await p.evaluate(() =>
      document.dispatchEvent(new Event("astro:before-swap")),
    );
    assert.equal(
      await p
        .locator("[data-motion],[data-enter],[data-title-line]")
        .evaluateAll(
          (es) => es.filter((e) => e.style.opacity || e.style.transform).length,
        ),
      0,
    );
  }
  await p.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
});
await test("Dynamic reduced motion reveals everything immediately", async () => {
  await p.emulateMedia({ reducedMotion: "reduce" });
  await p.waitForTimeout(150);
  assert.equal(
    await p
      .locator("[data-motion],[data-enter],[data-title-line]")
      .evaluateAll(
        (es) =>
          es.filter(
            (e) => getComputedStyle(e).opacity === "0" || e.style.transform,
          ).length,
      ),
    0,
  );
});
await test("Reduced motion on load leaves no hidden content or running animation", async () => {
  await p.reload({ waitUntil: "networkidle" });
  assert.equal(
    await p
      .locator("[data-motion],[data-enter],[data-title-line]")
      .evaluateAll(
        (es) =>
          es.filter(
            (e) => getComputedStyle(e).opacity === "0" || e.style.transform,
          ).length,
      ),
    0,
  );
  assert.equal(
    await p.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
    0,
  );
});
await test("Secondary routes retain content with no overflow", async () => {
  for (const route of [
    "about",
    "contact",
    "cv",
    "projects",
    "projects/nyayota",
    "vault",
    "blog",
    "writing",
  ]) {
    await p.goto(`http://localhost:4321/${route}/`, {
      waitUntil: "networkidle",
    });
    assert.ok(await p.locator("h1").textContent());
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
  }
});
await c.close();
const no = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 320, height: 844 },
});
const q = await no.newPage();
await test("No JavaScript: mobile navigation and all homepage sections remain visible", async () => {
  await q.goto("http://localhost:4321/");
  assert.ok(await q.locator("[data-mobile-menu]").isVisible());
  assert.equal(
    await q
      .locator("[data-motion],[data-enter],[data-title-line]")
      .evaluateAll(
        (es) => es.filter((e) => getComputedStyle(e).opacity === "0").length,
      ),
    0,
  );
  assert.ok(
    await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
});
await no.close();
const fail = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const r = await fail.newPage();
await test("Failed motion module: visible content and working menu", async () => {
  await r.route("**/_astro/*BaseLayout*.js", (route) => route.abort());
  await r.goto("http://localhost:4321/", { waitUntil: "networkidle" });
  assert.equal(
    await r
      .locator("[data-motion],[data-enter],[data-title-line]")
      .evaluateAll(
        (es) => es.filter((e) => getComputedStyle(e).opacity === "0").length,
      ),
    0,
  );
  await r.locator("[data-menu-toggle]").click();
  assert.equal(
    await r.locator("[data-menu-toggle]").getAttribute("aria-expanded"),
    "true",
  );
});
await fail.close();
assert.deepEqual(errors, []);
await fs.writeFile(
  `${dir}/interaction-checks.json`,
  JSON.stringify({ results, errors }, null, 2),
);
await browser.close();
