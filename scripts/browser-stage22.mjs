/** Stage 2.2: reuse existing browser regressions, preserve older review artifacts. */
process.env.BROWSER_REPORT_PATH = "../reports/stage2-2/";
process.env.BROWSER_WIDTHS = "320,360,390,768,1024,1440";
await import("./browser-stage2.mjs");
await import("./browser-stage21-pages.mjs");
await import("./browser-stage21-performance.mjs");
