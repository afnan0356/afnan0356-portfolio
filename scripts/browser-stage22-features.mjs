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
const dir = fileURLToPath(
  new URL(
    process.env.BROWSER_REPORT_PATH || "../reports/stage2-2/",
    import.meta.url,
  ),
);
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
const results = [];
async function test(name, fn) {
  await fn();
  results.push({ name, pass: true });
  console.log("PASS", name);
}
const c = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
await c.addInitScript(() => localStorage.setItem("theme", "light"));
const p = await c.newPage();
const errors = [];
const failedRequests = [];
p.on("requestfailed", (r) =>
  failedRequests.push(`${r.url()}: ${r.failure()?.errorText}`),
);
p.on("response", (r) => {
  if (r.status() >= 400) failedRequests.push(`${r.status()}: ${r.url()}`);
});
p.on("pageerror", (e) => errors.push(e.message));
await test("One main project; no empty publishing or evidence dashboard on homepage", async () => {
  await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
  assert.equal(await p.locator("[data-project]").count(), 1);
  assert.ok(
    (await p.locator(".work-name h3").textContent()).includes("Nyayota"),
  );
  assert.equal(await p.locator(".home-record,.record-reading").count(), 0);
  assert.ok((await p.locator(".hero-intro").textContent()).includes("student"));
});
await test("Inspector loads on demand, opens accessibly and returns keyboard focus", async () => {
  await p.goto("http://localhost:4321/projects/nyayota/", {
    waitUntil: "networkidle",
  });
  assert.equal(await p.locator("[data-image-full]").count(), 0);
  const opener = p.locator("[data-open-image]");
  await opener.click();
  assert.ok(await p.locator("dialog[open]").isVisible());
  assert.equal(
    await p.getByRole("dialog", { name: "Project screenshot" }).count(),
    1,
  );
  await p.locator("[data-image-full]").evaluate((img) => img.decode());
  assert.ok(
    await p
      .locator("[data-image-close]")
      .evaluate((e) => e === document.activeElement),
  );
  await p
    .locator(".project__links a")
    .first()
    .evaluate((el) => el.focus());
  assert.ok(
    await p
      .locator("[data-image-viewer]")
      .evaluate((el) => el.contains(document.activeElement)),
  );
  await p.screenshot({ path: `${dir}/image-inspector-light-390.png` });
  await p.keyboard.press("Escape");
  await p.waitForFunction(
    () => !document.documentElement.classList.contains("image-viewer-open"),
  );
  assert.equal(await p.locator("dialog[open]").count(), 0);
  assert.ok(await opener.evaluate((el) => el === document.activeElement));
  assert.equal(
    await p.evaluate(() =>
      document.documentElement.classList.contains("image-viewer-open"),
    ),
    false,
  );
});
await test("Close button and repeated navigation cleanup do not accumulate images", async () => {
  for (let i = 0; i < 3; i++) {
    await p.locator("[data-open-image]").click();
    assert.equal(await p.locator("[data-image-full]").count(), 1);
    await p.evaluate(() =>
      document.dispatchEvent(new Event("astro:before-swap")),
    );
    assert.equal(await p.locator("dialog[open]").count(), 0);
    assert.equal(await p.locator("[data-image-full]").count(), 0);
    await p.evaluate(() =>
      document.dispatchEvent(new Event("astro:page-load")),
    );
  }
  await p.locator("[data-open-image]").click();
  await p.locator("[data-image-close]").click();
  assert.equal(await p.locator("dialog[open]").count(), 0);
});
await test("Dark desktop inspector, keyboard containment and case-study landmarks", async () => {
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.locator("[data-theme-toggle]").first().click();
  for (const [id, name] of [
    ["information-architecture", "architecture"],
    ["workflow", "workflow"],
  ]) {
    await p.evaluate(
      (id) =>
        scrollTo(
          0,
          document.getElementById(id).getBoundingClientRect().top +
            scrollY -
            100,
        ),
      id,
    );
    await p.screenshot({ path: `${dir}/nyayota-${name}-dark-1440.png` });
  }
  await p.evaluate(() => scrollTo(0, document.scrollingElement.scrollHeight));
  await p.screenshot({ path: `${dir}/nyayota-footer-dark-1440.png` });
  await p.locator("[data-open-image]").click();
  await p.locator("[data-image-full]").evaluate((img) => img.decode());
  await p.keyboard.press("Tab");
  assert.ok(
    await p
      .locator("[data-image-canvas]")
      .evaluate((el) => el === document.activeElement),
  );
  await p.keyboard.press("Tab");
  assert.ok(
    await p
      .locator("[data-image-viewer]")
      .evaluate((el) => el.contains(document.activeElement)),
  );
  await p.keyboard.press("Shift+Tab");
  await p.keyboard.press("Shift+Tab");
  assert.ok(
    await p
      .locator("[data-image-viewer]")
      .evaluate((el) => el.contains(document.activeElement)),
  );
  await p.screenshot({ path: `${dir}/image-inspector-dark-1440.png` });
  await p.keyboard.press("Escape");
  await p.waitForFunction(
    () => !document.documentElement.classList.contains("image-viewer-open"),
  );
  assert.equal(await p.locator("dialog[open]").count(), 0);
});
await c.close();
for (const noJS of [true, false]) {
  const ctx = await browser.newContext({
    javaScriptEnabled: !noJS,
    viewport: { width: 320, height: 844 },
  });
  if (!noJS)
    await ctx.addInitScript(
      () => (HTMLDialogElement.prototype.showModal = undefined),
    );
  const q = await ctx.newPage();
  await test(
    noJS
      ? "No-JS original image link remains usable"
      : "Unsupported dialog API falls back to original image navigation",
    async () => {
      await q.goto("http://localhost:4321/projects/nyayota/");
      const [popup] = await Promise.all([
        q.waitForEvent("popup"),
        q.locator("[data-open-image]").click(),
      ]);
      await popup.waitForLoadState("domcontentloaded");
      assert.ok(popup.url().endsWith(".png"));
      await popup.close();
    },
  );
  await ctx.close();
}
const failure = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const f = await failure.newPage();
await test("Image failure produces readable status and an operable close button", async () => {
  await f.goto("http://localhost:4321/projects/nyayota/", {
    waitUntil: "networkidle",
  });
  await f.route("**/nyayota-homepage*.png", (route) => route.abort());
  await f.locator("[data-open-image]").click();
  await f.waitForFunction(() =>
    document
      .querySelector("[data-image-status]")
      .textContent.includes("could not be loaded"),
  );
  await f.locator("[data-image-close]").click();
  assert.equal(await f.locator("dialog[open]").count(), 0);
});
await failure.close();
assert.deepEqual(errors, []);
assert.deepEqual(failedRequests, []);
await fs.writeFile(
  `${dir}/feature-checks.json`,
  JSON.stringify({ results, errors, failedRequests }, null, 2),
);
await browser.close();
