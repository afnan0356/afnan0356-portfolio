/** External axe/Chromium QA, not a project dependency or a WCAG certificate. */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const tools = process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser";
const require = createRequire(path.join(tools, "package.json"));
const cm = require("@sparticuz/chromium");
const chromium = cm.default ?? cm;
const { chromium: pw } = require("playwright-core");
const auditRequire = createRequire(
  path.join(
    process.env.AUDIT_TOOLS_DIR || "/tmp/portfolio-lighthouse",
    "package.json",
  ),
);
const AxeBuilder = auditRequire("@axe-core/playwright").default;
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
const rows = [];
try {
  for (const theme of ["dark", "light"]) {
    const c = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await c.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await c.newPage();
    for (const route of [
      "/",
      "/search/",
      "/about/",
      "/projects/",
      "/projects/nyayota/",
      "/cv/",
      "/vault/",
      "/vault/category/evidence/",
      "/contact/",
      "/blog/",
      "/writing/",
      "/bn/",
      "/404.html",
    ]) {
      await p.goto(`http://localhost:4321${route}`, {
        waitUntil: "networkidle",
      });
      const result = await new AxeBuilder({ page: p }).analyze();
      rows.push({
        theme,
        route,
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
    }
    await p.goto("http://localhost:4321/", { waitUntil: "networkidle" });
    await p.locator("[data-open-search]").click();
    await p.locator("#dialog-query").fill("Nyayota");
    await p.waitForFunction(
      () => document.querySelectorAll("[data-search-results] a").length > 0,
    );
    const result = await new AxeBuilder({ page: p }).analyze();
    rows.push({
      theme,
      route: "Search dialog",
      violations: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
    await c.close();
  }
  await fs.writeFile(
    "reports/human-pass/accessibility.json",
    JSON.stringify(rows, null, 2),
  );
  assert.equal(
    rows.reduce((sum, r) => sum + r.violations.length, 0),
    0,
    JSON.stringify(
      rows.filter((r) => r.violations.length),
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${rows.length} route/dialog/theme axe scans without detected violations.`,
  );
} finally {
  await browser.close();
}
