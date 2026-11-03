/** Expanded page matrix + useful-feature checks; external tools as in Stage 2. */
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
const dir = fileURLToPath(new URL("../reports/stage2-1/", import.meta.url));
const browser = await pw.launch({
  executablePath: await chromium.executablePath(),
  args: chromium.args.filter((a) => a !== "--single-process"),
  env: { ...process.env, LD_LIBRARY_PATH: path.join(tools, "libraries/lib") },
});
const matrix = [];
const scenarios = [];
async function test(name, fn) {
  await fn();
  scenarios.push({ name, pass: true });
  console.log("PASS", name);
}
const routes = [
  "about",
  "projects",
  "projects/nyayota",
  "cv",
  "contact",
  "blog",
  "writing",
  "vault",
  "vault/category/evidence",
  "404.html",
];
for (const theme of ["dark", "light"])
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of routes) {
      await p.goto(
        `http://localhost:4321/${route}${route.endsWith(".html") ? "" : "/"}`,
        { waitUntil: "networkidle" },
      );
      const row = await p.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        theme: document.documentElement.dataset.theme,
        h1: document.querySelector("h1")?.textContent?.trim(),
        missingImages: [...document.images]
          .filter((e) => e.complete && e.naturalWidth === 0)
          .map((e) => e.src),
      }));
      assert.ok(row.h1, route);
      assert.ok(
        row.scrollWidth <= width,
        `${route} ${theme} ${width}: overflow ${row.scrollWidth}`,
      );
      assert.equal(row.theme, theme);
      assert.deepEqual(errors, []);
      assert.deepEqual(row.missingImages, []);
      matrix.push({ route, ...row, errors: [...errors] });
      if (
        (theme === "dark" &&
          width === 1440 &&
          ["about", "projects", "projects/nyayota", "vault"].includes(route)) ||
        (theme === "light" &&
          width === 390 &&
          [
            "about",
            "projects/nyayota",
            "cv",
            "contact",
            "blog",
            "writing",
          ].includes(route))
      ) {
        await p.locator("img").evaluateAll(async (imgs) => {
          await Promise.all(
            imgs.map(async (img) => {
              img.loading = "eager";
              await img.decode();
            }),
          );
        });
        await p.screenshot({
          path: `${dir}/${route.replaceAll("/", "-")}-${theme}-${width}.png`,
          fullPage: true,
        });
      }
    }
    await ctx.close();
  }
const c = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const p = await c.newPage();
await test("Mobile contents exposes real sections and jumps to role", async () => {
  await p.goto("http://localhost:4321/projects/nyayota/", {
    waitUntil: "networkidle",
  });
  const nav = p.locator("[data-reading-nav]");
  assert.ok(await nav.isVisible());
  await nav.locator('a[href="#role"]').click();
  assert.equal(new URL(p.url()).hash, "#role");
  assert.equal(
    await nav.locator('a[href="#role"]').getAttribute("aria-current"),
    "location",
  );
});
await test("Reading location tracks scroll, cleans up, and reinitializes", async () => {
  await p.locator("#decisions").evaluate((el) =>
    scrollTo({
      top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.2,
      behavior: "instant",
    }),
  );
  await p.waitForTimeout(250);
  assert.equal(
    await p
      .locator('[data-reading-nav] [aria-current="location"]')
      .getAttribute("href"),
    "#decisions",
  );
  await p.evaluate(() =>
    document.dispatchEvent(new Event("astro:before-swap")),
  );
  assert.equal(await p.locator("[data-reading-nav] [aria-current]").count(), 0);
  await p.evaluate(() => document.dispatchEvent(new Event("astro:page-load")));
  await p.locator("#scope").evaluate((el) =>
    scrollTo({
      top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.2,
      behavior: "instant",
    }),
  );
  await p.waitForTimeout(250);
  assert.equal(
    await p
      .locator('[data-reading-nav] [aria-current="location"]')
      .getAttribute("href"),
    "#scope",
  );
});
await test("Original screenshot link returns an actual local image", async () => {
  const href = await p
    .locator(".project__cover figcaption a")
    .getAttribute("href");
  const response = await p.request.get(`http://localhost:4321${href}`);
  assert.equal(response.status(), 200);
  assert.ok(response.headers()["content-type"].startsWith("image/"));
});
await test("CV jumps, print action and theme-safe print layout", async () => {
  await p.goto("http://localhost:4321/cv/", { waitUntil: "networkidle" });
  await p.locator('.cv-jumps a[href="#selected-work"]').click();
  assert.equal(new URL(p.url()).hash, "#selected-work");
  await p.evaluate(() => {
    window.__printed = 0;
    window.print = () => window.__printed++;
  });
  await p.locator("[data-print]").click();
  assert.equal(await p.evaluate(() => window.__printed), 1);
  await p.emulateMedia({ media: "print" });
  assert.equal(await p.locator(".site-header").isVisible(), false);
  assert.equal(await p.locator(".site-footer").isVisible(), false);
  assert.equal(
    await p.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim(),
    ),
    "#000",
  );
  await p.pdf({
    path: `${dir}/cv-print.pdf`,
    format: "A4",
    printBackground: true,
  });
  await p.emulateMedia({ media: "screen" });
});
await test("Contact copy gives accessible success feedback", async () => {
  await p.goto("http://localhost:4321/contact/", { waitUntil: "networkidle" });
  await p.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text) => {
          window.__copied = text;
        },
      },
      configurable: true,
    });
  });
  await p.locator("[data-copy]").click();
  assert.equal(
    await p.evaluate(() => window.__copied),
    "mdafnan0356@gmail.com",
  );
  assert.equal(
    await p.locator("[data-copy-status]").textContent(),
    "Email address copied.",
  );
});
await c.close();
const no = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 320, height: 844 },
});
const q = await no.newPage();
await test("No-JS project contents still navigates, CV hides inert print control", async () => {
  await q.goto("http://localhost:4321/projects/nyayota/");
  await q.locator('[data-reading-nav] a[href="#scope"]').click();
  assert.equal(new URL(q.url()).hash, "#scope");
  await q.goto("http://localhost:4321/cv/");
  assert.equal(await q.locator("[data-print]").isVisible(), false);
  assert.ok(await q.locator(".cv-jumps").isVisible());
});
await no.close();
await fs.writeFile(
  `${dir}/page-checks.json`,
  JSON.stringify({ matrix, scenarios }, null, 2),
);
console.log(`PASS ${matrix.length} interior-page/theme/viewport combinations`);
await browser.close();
