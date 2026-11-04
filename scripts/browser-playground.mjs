/** Optional external browser QA. No additional application dependencies. */
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: playwright } = require("playwright-core");
const auditRequire = createRequire(
  path.join(
    process.env.AUDIT_TOOLS_DIR || "/tmp/portfolio-lighthouse",
    "package.json",
  ),
);
const AxeBuilder = auditRequire("@axe-core/playwright").default;
const base = process.env.TEST_URL || "http://localhost:4323";
const browser = await playwright.launch({
  executablePath: await chromium.executablePath(),
  args: [
    ...chromium.args.filter(
      (a) => !["--single-process", "--in-process-gpu"].includes(a),
    ),
    "--disable-gpu",
  ],
  env: { ...process.env, LD_LIBRARY_PATH: path.join(tools, "libraries/lib") },
});
const results = [];
await fs.mkdir("reports/playground", { recursive: true });
try {
  for (const theme of ["dark", "light"]) {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/", "/playground/", "/blog/", "/writing/"]) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `overflow ${theme} ${width} ${route}`,
        );
        const axe = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          [],
          `axe ${theme} ${width} ${route}`,
        );
        if ([390, 1440].includes(width) && ["/", "/playground/"].includes(route)) {
          await page.evaluate(async () => {
            for (const img of document.images) {
              img.loading = "eager";
              await img.decode().catch(() => {});
            }
          });
          await page.screenshot({
            path: `reports/playground/${route === "/" ? "home" : "playground"}-${theme}-${width}.png`,
            fullPage: true,
          });
        }
        results.push({
          theme,
          width,
          route,
          overflow: false,
          axeViolations: 0,
        });
      }
    }
    await page.goto(base + "/playground/", { waitUntil: "networkidle" });
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      "noindex, nofollow",
    );
    await page.locator("textarea").fill("Hello বাংলা world");
    await assert.doesNotReject(() =>
      page.getByText("3 words · 17 characters", { exact: true }).waitFor(),
    );
    await page.getByRole("button", { name: "Clear text" }).click();
    assert.equal(await page.locator("textarea").inputValue(), "");
    assert.equal(
      await page
        .locator("textarea")
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.locator("summary").first().click();
    assert.equal(
      await page.locator("details").first().getAttribute("open"),
      "",
    );
    const before = await page
      .locator(".sample-essay-body")
      .evaluate((el) => getComputedStyle(el).fontSize);
    await page.getByLabel("Large", { exact: true }).check();
    const after = await page
      .locator(".sample-essay-body")
      .evaluate((el) => getComputedStyle(el).fontSize);
    assert.ok(parseFloat(after) > parseFloat(before));
    await page.getByRole("link", { name: "← Back to the portfolio" }).click();
    await page.waitForURL(base + "/");
    await page.getByRole("link", { name: /Visit the playground/ }).click();
    await page.waitForURL(base + "/playground/");
    await page.locator("textarea").fill("Rebound once");
    await page.getByText("2 words · 12 characters", { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    await context.close();
  }
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await nojs.newPage();
  await page.goto(base + "/playground/");
  await page.getByLabel("Large", { exact: true }).check();
  assert.equal(
    await page
      .locator(".sample-essay-body")
      .evaluate((el) => getComputedStyle(el).fontSize),
    "24px",
  );
  await page.locator("summary").first().click();
  assert.equal(await page.locator("details").first().getAttribute("open"), "");
  assert.equal(
    await page.getByRole("button", { name: "Clear text" }).count(),
    0,
  );
  await nojs.close();
  await fs.writeFile(
    "reports/playground/browser-results.json",
    JSON.stringify(
      {
        passed: true,
        checks: results,
        interactions: [
          "local word count",
          "clear and focus",
          "native disclosure",
          "CSS reading sizes",
          "Astro navigation rebinding",
          "no-JS disclosures and reading controls",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${results.length} responsive/theme route scans with axe + functional/no-JS checks.`,
  );
} finally {
  await browser.close();
}
