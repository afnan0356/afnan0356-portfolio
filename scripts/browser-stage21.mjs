/** Reuse the Stage 2 regression suite without overwriting its review evidence. */
process.env.BROWSER_REPORT_PATH = "../reports/stage2-1/";
process.env.BROWSER_WIDTHS = "320,360,390,768,1024,1440";
await import("./browser-stage2.mjs");
