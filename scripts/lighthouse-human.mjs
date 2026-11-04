/** Synthetic mobile Lighthouse; external QA dependencies, not real-device certification. */
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
const auditRequire = createRequire(
  (process.env.AUDIT_TOOLS_DIR || "/tmp/portfolio-lighthouse") +
    "/package.json",
);
const { default: lighthouse } = await import(
  pathToFileURL(auditRequire.resolve("lighthouse")).href
);
const { launch } = await import(
  pathToFileURL(auditRequire.resolve("chrome-launcher")).href
);
const browserRequire = createRequire(
  (process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser") + "/package.json",
);
const cm = browserRequire("@sparticuz/chromium");
const chromium = cm.default ?? cm;
process.env.LD_LIBRARY_PATH =
  (process.env.BROWSER_TOOLS_DIR || "/tmp/portfolio-browser") +
  "/libraries/lib";
const chrome = await launch({
  chromePath: await chromium.executablePath(),
  chromeFlags: [
    ...chromium.args.filter(
      (a) => !["--single-process", "--in-process-gpu"].includes(a),
    ),
    "--headless",
    "--disable-gpu",
  ],
  logLevel: "error",
});
try {
  const result = await lighthouse("http://localhost:4321/", {
    port: chrome.port,
    output: "html",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  const lhr = result.lhr;
  const summary = {
    lighthouseVersion: lhr.lighthouseVersion,
    fetchTime: lhr.fetchTime,
    environment: lhr.environment,
    configSettings: lhr.configSettings,
    categories: Object.fromEntries(
      Object.entries(lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "speed-index",
        "total-blocking-time",
        "cumulative-layout-shift",
        "interactive",
      ]
        .filter((id) => lhr.audits[id])
        .map((id) => [id, lhr.audits[id].displayValue]),
    ),
    nonPassingAudits: Object.fromEntries(
      Object.entries(lhr.audits)
        .filter(([, a]) => a.score !== null && a.score < 1)
        .map(([id, a]) => [
          id,
          {
            title: a.title,
            displayValue: a.displayValue,
            score: a.score,
            description: a.description,
          },
        ]),
    ),
  };
  await fs.writeFile("reports/human-pass/lighthouse.html", result.report);
  await fs.writeFile(
    "reports/human-pass/lighthouse.json",
    JSON.stringify(summary, null, 2),
  );
  console.log(
    JSON.stringify(
      { categories: summary.categories, metrics: summary.metrics },
      null,
      2,
    ),
  );
} finally {
  await chrome.kill();
}
