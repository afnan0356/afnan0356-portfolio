/** Focused responsive/native-controls checks, not real-device certification. */
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
const b = await pw.launch({
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
await fs.mkdir("reports/stage2-3/after", { recursive: true });
for (const theme of ["dark", "light"])
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    const ctx = await b.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://localhost:4321/projects/nyayota/", {
      waitUntil: "networkidle",
    });
    const contents = p.locator("[data-reading-contents]");
    assert.equal(await contents.evaluate((e) => e.open), width >= 1024);
    if (width < 1024) {
      await p.locator("[data-reading-contents] summary").focus();
      await p.keyboard.press("Enter");
      assert.equal(await contents.evaluate((e) => e.open), true);
    }
    await p.locator('[data-reading-nav] a[href="#role"]').click();
    assert.equal(new URL(p.url()).hash, "#role");
    if (width < 1024)
      assert.equal(await contents.evaluate((e) => e.open), false);
    await p.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForFunction(
      () => !document.querySelector("[data-reading-nav] [aria-current]"),
    );
    if (
      (width === 1440 && theme === "dark") ||
      (width === 390 && theme === "light")
    ) {
      for (const id of ["information-architecture", "workflow", "decisions"]) {
        await p
          .locator(`#${id}`)
          .evaluate((e) =>
            scrollTo(0, e.getBoundingClientRect().top + scrollY - 100),
          );
        await p.screenshot({
          path: `reports/stage2-3/after/case-${id}-${theme}-${width}.png`,
        });
      }
    }
    await p.locator("[data-open-image]").click();
    await p.locator("[data-image-full]").evaluate((i) => i.decode());
    await p.keyboard.press("Tab");
    assert.ok(
      await p
        .locator("[data-image-canvas]")
        .evaluate((e) => e === document.activeElement),
    );
    if (width < 768) {
      await p.keyboard.press("ArrowRight");
      await p.waitForFunction(
        () => document.querySelector("[data-image-canvas]").scrollLeft > 0,
      );
    }
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.keyboard.press("Tab");
    assert.ok(
      await p
        .locator("[data-image-close]")
        .evaluate((e) => e === document.activeElement),
    );
    await p.keyboard.press("Escape");
    await p.waitForFunction(
      () => !document.documentElement.classList.contains("image-viewer-open"),
    );
    assert.ok(
      await p
        .locator("[data-open-image]")
        .evaluate((e) => e === document.activeElement),
    );
    await p.goto("http://localhost:4321/contact/", {
      waitUntil: "networkidle",
    });
    const links = await p
      .locator('.route-list a[rel~="me"]')
      .evaluateAll((as) =>
        as.map((a) => ({ href: a.href, h: a.getBoundingClientRect().height })),
      );
    assert.equal(links.length, 7);
    assert.ok(links.every((a) => a.h >= 44));
    assert.equal(
      await p.locator(".contact__email").getAttribute("href"),
      "mailto:mdafnan0356@gmail.com",
    );
    await p.goto("http://localhost:4321/cv/", { waitUntil: "networkidle" });
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    if (width < 768)
      assert.equal(
        await p
          .locator(".cv__skills > div")
          .first()
          .evaluate(
            (e) => getComputedStyle(e).gridTemplateColumns.split(" ").length,
          ),
        1,
      );
    if (width === 1440) {
      await p.emulateMedia({ media: "print" });
      assert.equal(
        await p.evaluate(() => getComputedStyle(document.body).backgroundColor),
        "rgb(255, 255, 255)",
      );
      assert.equal(
        await p.evaluate(
          () => getComputedStyle(document.body).transitionDuration,
        ),
        "0s",
      );
      assert.equal(
        await p.evaluate(
          () => getComputedStyle(document.documentElement).colorScheme,
        ),
        "light",
      );
      const pdf = await p.pdf({
        path: `reports/stage2-3/after/cv-print-${theme}.pdf`,
        format: "A4",
        printBackground: true,
      });
      // The current concise content fixture must not orphan its update line.
      assert.equal(
        (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) ?? []).length,
        1,
      );
      await p.emulateMedia({ media: "screen" });
    }
    const footerTargets = await p
      .locator(".site-footer__socials a")
      .evaluateAll((as) => as.map((a) => a.getBoundingClientRect().height));
    assert.equal(footerTargets.length, 8);
    assert.ok(footerTargets.every((height) => height >= 44));
    assert.deepEqual(errors, []);
    results.push({
      theme,
      width,
      passed: true,
      contactDestinations: 8,
      contents: width < 1024 ? "native disclosure" : "open rail",
      inspectorPan: width < 768 ? "keyboard pan checked" : "fit",
      errors,
    });
    await ctx.close();
  }
await fs.writeFile(
  "reports/stage2-3/polish-checks.json",
  JSON.stringify(results, null, 2),
);
await b.close();
console.log(
  "PASS 12 theme/width combinations: native contents, role jumps, reading reset, inspector keyboard/pan/focus, eight contact destinations, mobile CV.",
);
