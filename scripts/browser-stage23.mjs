/** Preserve all earlier review artifacts while exercising the current site. */
process.env.BROWSER_REPORT_PATH = "../reports/stage2-3/after/";
process.env.BROWSER_WIDTHS = "320,360,390,768,1024,1440";
await import("./browser-stage2.mjs");
await import("./browser-stage21-pages.mjs");
await import("./browser-stage21-performance.mjs");
await import("./browser-stage22-features.mjs");
