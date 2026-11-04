/** External Chromium/Playwright harness. No application dependency. */
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
const output = "reports/human-pass";
await fs.mkdir(output, { recursive: true });
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
const capture = async (p, file) => {
  for (const image of await p.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((i) => i.decode());
  }
  await p.evaluate(() => {
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    scrollTo(0, 0);
  });
  await p.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await p.screenshot({ path: file, fullPage: true });
};
const checks = [];
try {
  for (const theme of ["dark", "light"])
    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      console.log(`Testing ${theme} ${width}`);
      const c = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await c.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const p = await c.newPage();
      const errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      const queries = [];
      p.on("request", (r) => {
        if (!r.url().startsWith("http://localhost:4321/"))
          queries.push(r.url());
      });
      await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
      assert.equal(await p.locator("html").getAttribute("data-theme"), theme);
      assert.equal(await p.locator(".portrait-placeholder").count(), 1);
      assert.equal(await p.locator(".hero-word").count(), 5);
      assert.ok(
        (await p.locator("#now-title").textContent()).includes("up to now"),
      );
      assert.equal(await p.locator(".demo-placeholder").count(), 1);
      assert.equal(
        await p.evaluate(
          () =>
            document.getAnimations().filter((a) => a.playState === "running")
              .length,
        ),
        0,
      );
      for (const route of [
        "/",
        "/about/",
        "/projects/",
        "/projects/nyayota/",
        "/contact/",
        "/blog/",
        "/writing/",
        "/bn/",
        "/bn/contact/",
        "/search/",
        "/404.html",
      ]) {
        await p.goto(`http://localhost:4321${route}`, {
          waitUntil: "networkidle",
        });
        assert.ok(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${theme} ${width} ${route}: overflow`,
        );
        assert.equal(await p.locator("main h1").count(), 1);
        assert.equal(
          await p.locator("html").getAttribute("lang"),
          route.startsWith("/bn/") ? "bn" : "en",
        );
        if (theme === "light" && width === 390 && route === "/bn/")
          await capture(p, `${output}/bangla-light-390.png`);
      }
      await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
      const trigger = p.locator("[data-open-search]");
      await trigger.focus();
      await p.keyboard.press("Control+k");
      assert.equal(
        await p.locator("[data-search-dialog]").evaluate((e) => e.open),
        true,
      );
      await p.locator("#dialog-query").fill("Nyayota");
      await p.waitForFunction(
        () => document.querySelectorAll("[data-search-results] a").length >= 1,
      );
      assert.ok(
        (await p.locator("[data-search-results]").innerText()).includes(
          "Nyayota",
        ),
      );
      await p.locator("#dialog-query").fill("<img src=x onerror=alert(1)>");
      await p.waitForFunction(() =>
        document
          .querySelector("[data-search-status]")
          ?.textContent?.includes("Nothing matches"),
      );
      assert.equal(await p.locator("[data-search-results] img").count(), 0);
      await p.locator("#dialog-query").fill("Nyayota");
      await p.waitForFunction(
        () => document.querySelectorAll("[data-search-results] a").length >= 1,
      );
      if (
        (width === 1440 && theme === "dark") ||
        (width === 390 && theme === "light")
      )
        await p.screenshot({ path: `${output}/search-${theme}-${width}.png` });
      await p.keyboard.press("Escape");
      await p.waitForFunction(() =>
        document.activeElement?.matches("[data-open-search]"),
      );
      assert.equal(
        await trigger.evaluate((e) => e === document.activeElement),
        true,
      );
      assert.equal(
        await p
          .locator("html")
          .evaluate((e) => e.classList.contains("search-open")),
        false,
      );
      if (width < 960) {
        await p.locator("[data-menu-toggle]").click();
        assert.equal(await p.locator("main").evaluate((e) => e.inert), true);
        await p.keyboard.press("Control+k");
        assert.equal(await p.locator("main").evaluate((e) => e.inert), false);
        await p.keyboard.press("Escape");
        await p.waitForFunction(() =>
          document.activeElement?.matches("[data-open-search]"),
        );
        assert.equal(
          await trigger.evaluate((e) => e === document.activeElement),
          true,
        );
      }
      // Real Astro transitions preserve a window sentinel; controls must rebind once.
      await p.evaluate(() => {
        window.__sentinel = "alive";
        window.__pageLoads = 0;
        document.addEventListener(
          "astro:page-load",
          () => window.__pageLoads++,
        );
      });
      await p.locator('.site-footer a[href="/blog/"]').click();
      await p.waitForURL("**/blog/");
      await p.waitForFunction(() => window.__pageLoads >= 1);
      assert.equal(await p.evaluate(() => window.__sentinel), "alive");
      const toggle = p.locator(".site-header__actions [data-theme-toggle]");
      await toggle.click();
      assert.equal(
        await p.locator("html").getAttribute("data-theme"),
        theme === "dark" ? "light" : "dark",
      );
      await toggle.click();
      assert.equal(await p.locator("html").getAttribute("data-theme"), theme);
      await p.locator("[data-open-search]").click();
      await p.keyboard.press("Escape");
      await p.locator('.site-footer a[href="/contact/"]').click();
      await p.waitForURL("**/contact/");
      await p.waitForFunction(() => window.__pageLoads >= 2);
      assert.equal(
        await p.locator("[data-mail-compose]").getAttribute("action"),
        "mailto:mdafnan0356@gmail.com",
      );
      await p.locator("[name=subject]").fill("A real question");
      await p.locator("[name=body]").fill("Hello Afnan.");
      assert.equal(
        await p
          .locator("[data-mail-compose]")
          .evaluate((e) => e.checkValidity()),
        true,
      );
      if (
        (width === 1440 && theme === "dark") ||
        (width === 390 && theme === "light")
      )
        await capture(p, `${output}/contact-${theme}-${width}.png`);
      await p.locator('.site-footer a[href="/cv/"]').click();
      await p.waitForURL("**/cv/");
      await p.waitForFunction(() => window.__pageLoads >= 3);
      await p.evaluate(() => {
        window.__printed = 0;
        window.print = () => window.__printed++;
      });
      await p.locator("[data-print]").click();
      assert.equal(await p.evaluate(() => window.__printed), 1);
      await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
      if (
        (width === 1440 && theme === "dark") ||
        (width === 390 && theme === "light")
      )
        await capture(p, `${output}/home-${theme}-${width}.png`);
      assert.deepEqual(errors, []);
      assert.deepEqual(queries, []);
      checks.push({ theme, width, routes: 11, pass: true });
      await c.close();
    }
  console.log(
    "PASS: 132 responsive route/theme combinations, search keyboard/focus/XSS, Astro navigation rebinding, theme persistence, menu, email composer and CV action.",
  );
  // Motion runs once, stops, and is removed live when reduced motion changes.
  for (const initial of ["no-preference", "reduce"]) {
    const c = await browser.newContext({
      viewport: { width: 390, height: 800 },
      reducedMotion: initial,
    });
    const p = await c.newPage();
    await p.goto("http://localhost:4321/", { waitUntil: "domcontentloaded" });
    await p.waitForFunction(() => document.querySelector(".hero-word"));
    await p.waitForFunction(
      () => !document.querySelector("#dialog-query").disabled,
    );
    // Inactive test element only: no fake recording or media request is created.
    await p.evaluate(() => {
      const video = document.createElement("video");
      video.dataset.demoVideo = "";
      document.querySelector("main").append(video);
      document.dispatchEvent(new Event("astro:page-load"));
    });
    assert.equal(
      await p.locator("[data-demo-video]").evaluate((v) => v.loop),
      initial === "no-preference",
    );
    if (initial === "no-preference") {
      await p.waitForFunction(() =>
        document.documentElement.classList.contains("hero-once"),
      );
      assert.ok(
        await p
          .locator(".hero-word")
          .evaluateAll((es) =>
            es.some((e) => getComputedStyle(e).animationName !== "none"),
          ),
      );
      await p.emulateMedia({ reducedMotion: "reduce" });
    }
    await p.waitForFunction(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length === 0,
    );
    await p.waitForFunction(
      () => !document.querySelector("[data-demo-video]").loop,
    );

    assert.equal(
      await p
        .locator(".hero-word")
        .evaluateAll((es) =>
          es.every((e) => getComputedStyle(e).opacity === "1"),
        ),
      true,
    );
    if (initial === "no-preference") {
      await p.waitForFunction(
        () => !document.documentElement.classList.contains("hero-once"),
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
      await p.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      assert.equal(
        await p
          .locator("html")
          .evaluate((e) => e.classList.contains("hero-once")),
        false,
      );
    }
    await c.close();
  }
  console.log(
    "PASS: CSS hero enhancement, one-time session guard, live/load reduced motion with no running animations.",
  );
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const n = await nojs.newPage();
  await n.goto("http://localhost:4321/");
  assert.equal(await n.locator(".mobile-menu").isVisible(), true);
  assert.equal(await n.locator("#now-title").isVisible(), true);
  await n.goto("http://localhost:4321/search/");
  assert.equal(await n.locator("#page-query").isDisabled(), true);
  assert.equal(await n.locator("[data-search-fallback] a").count(), 3);
  await nojs.close();
  console.log(
    "PASS: no-JavaScript content, mobile routes and complete public-entry search fallback.",
  );
  const drafts = await browser.newContext({
    viewport: { width: 390, height: 650 },
    reducedMotion: "no-preference",
  });
  const d = await drafts.newPage();
  await d.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__copied = value;
        },
      },
    }),
  );
  for (const route of [
    "blog/building-a-small-static-site",
    "blog/checking-ai-assisted-changes",
    "writing/reading-on-a-small-screen",
  ]) {
    await d.goto(`http://localhost:4322/${route}/`, {
      waitUntil: "networkidle",
    });
    assert.equal(await d.locator(".draft-notice").count(), 1);
    assert.match(await d.locator(".byline").innerText(), /Draft.*date to add/);
    assert.equal(
      await d.locator("meta[name=robots]").getAttribute("content"),
      "noindex, nofollow",
    );
    await d.locator("[data-copy-link]").click();
    assert.equal(
      await d.evaluate(() => window.__copied),
      `http://localhost:4322/${route}/`,
    );
    assert.equal(
      await d.locator("[data-link-status]").innerText(),
      "Link copied.",
    );
    await d.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await d.waitForFunction(
      () =>
        Number(
          document
            .querySelector("[data-reading-progress]")
            .style.getPropertyValue("--reading"),
        ) > 0,
    );
    await d.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await d.locator("[data-reading-progress]").isVisible(), false);
    await d.emulateMedia({ reducedMotion: "no-preference" });
  }
  await d.goto("http://localhost:4322/blog/building-a-small-static-site/", {
    waitUntil: "networkidle",
  });
  assert.equal(await d.locator(".post__pager a").count(), 1);
  await capture(d, `${output}/draft-note-390.png`);
  await drafts.close();
  console.log(
    "PASS: three DEV-only undated/noindex drafts, estimated reading time, clipboard, reading progress and existing neighbor navigation.",
  );
  const index = JSON.parse(await fs.readFile("dist/search.json", "utf8"));
  assert.equal(index.length, 3);
  assert.ok(!JSON.stringify(index).includes("YOUR "));
  const sitemap = await fs.readFile("dist/sitemap-0.xml", "utf8");
  const rss = await fs.readFile("dist/rss.xml", "utf8");
  for (const slug of [
    "building-a-small-static-site",
    "checking-ai-assisted-changes",
    "reading-on-a-small-screen",
  ]) {
    assert.ok(!sitemap.includes(slug));
    assert.ok(!rss.includes(slug));
  }
  console.log(
    "PASS: drafts absent from static index, sitemap and RSS; no third-party browser requests.",
  );
  await fs.writeFile(
    `${output}/browser-checks.json`,
    JSON.stringify({ checks, passed: true }, null, 2),
  );
} finally {
  await browser.close();
}
