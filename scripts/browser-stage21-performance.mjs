/** A throttled Chromium smoke test, not a physical-device benchmark. */
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
const context = await browser.newContext({
  viewport: { width: 360, height: 800 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 1,
});
const p = await context.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const session = await context.newCDPSession(p);
await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await p.addInitScript(() => {
  window.__tasks = [];
  try {
    new PerformanceObserver((list) =>
      window.__tasks.push(
        ...list
          .getEntries()
          .map((e) => ({ start: e.startTime, duration: e.duration })),
      ),
    ).observe({ type: "longtask", buffered: true });
  } catch {}
});
await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await p.waitForTimeout(1800);
for (
  let y = 0;
  y < (await p.evaluate(() => document.body.scrollHeight));
  y += 500
) {
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
  await p.waitForTimeout(180);
}
await p.waitForTimeout(1500);
const sample = await p.evaluate(() => ({
  viewport: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  touchPoints: navigator.maxTouchPoints,
  longTasks: window.__tasks,
  resources: performance
    .getEntriesByType("resource")
    .map((e) => ({
      url: new URL(e.name).pathname,
      transferBytes: e.transferSize,
    })),
  hidden: [
    ...document.querySelectorAll(
      "[data-motion],[data-title-line],[data-enter]",
    ),
  ].filter((e) => getComputedStyle(e).opacity === "0").length,
}));
assert.ok(sample.scrollWidth <= 360);
assert.equal(sample.hidden, 0);
assert.deepEqual(errors, []);
await context.close();
const no = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 1000 },
});
const q = await no.newPage();
await q.goto("http://localhost:4321/");
await q.locator("img").evaluateAll(async (imgs) => {
  await Promise.all(
    imgs.map(async (img) => {
      img.loading = "eager";
      await img.decode();
    }),
  );
});
await q.screenshot({ path: `${dir}/home-nojs-dark-1440.png`, fullPage: true });
await no.close();
const contrast = [];
const c = await browser.newContext();
const r = await c.newPage();
await r.goto("http://localhost:4321/");
function luminance(hex) {
  const rgb = hex
    .replace("#", "")
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
for (const theme of ["dark", "light"]) {
  await r.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
  const colors = await r.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      [
        "--bg",
        "--ink",
        "--ink-soft",
        "--ink-muted",
        "--ink-faint",
        "--accent",
      ].map((k) => [k, s.getPropertyValue(k).trim()]),
    );
  });
  for (const token of [
    "--ink",
    "--ink-soft",
    "--ink-muted",
    "--ink-faint",
    "--accent",
  ]) {
    const a = luminance(colors[token]),
      b = luminance(colors["--bg"]);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    assert.ok(ratio >= 4.5, `${theme} ${token}: ${ratio}`);
    contrast.push({
      theme,
      token,
      foreground: colors[token],
      background: colors["--bg"],
      ratio: Number(ratio.toFixed(2)),
    });
  }
}
await c.close();
await fs.writeFile(
  `${dir}/performance-smoke.json`,
  JSON.stringify(
    {
      description:
        "4x CPU-throttled headless Chromium, touch viewport. Not Snapdragon 680 emulation, not an FPS/Lighthouse benchmark. Long tasks are observational, not a pass/fail performance budget.",
      sample,
      errors,
      contrast,
    },
    null,
    2,
  ),
);
console.log(
  "PASS 4x CPU touch smoke, no-JS desktop screenshot, and 10 text-token contrast checks",
);
await browser.close();
