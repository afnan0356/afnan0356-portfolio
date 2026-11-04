import fs from "node:fs/promises";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const baseline = JSON.parse(
  await fs.readFile("reports/stage2-3/baseline-hashes.json", "utf8"),
);
const protectedFiles = Object.keys(baseline).filter(
  (p) =>
    p.startsWith("reports/") ||
    p.startsWith("src/content/") ||
    p.startsWith("src/data/") ||
    p.startsWith("public/") ||
    [
      "package.json",
      "package-lock.json",
      "src/config/site.ts",
      "src/content.config.ts",
      "src/lib/motion.ts",
    ].includes(p),
);
for (const p of protectedFiles) {
  assert.equal(
    crypto
      .createHash("sha256")
      .update(await fs.readFile(p))
      .digest("hex"),
    baseline[p],
    `Protected Stage 2.2 content/artifact changed: ${p}`,
  );
}
const html = (route) =>
  fs.readFile(`dist/${route ? route + "/" : ""}index.html`, "utf8");
const home = await html("");
const about = await html("about");
const project = await html("projects/nyayota");
assert.ok(!home.includes("work-browser-bar"));
assert.ok(home.includes("Selected work."));
assert.ok(
  about.indexOf('class="personal-reading"') <
    about.indexOf('class="personal-margin"'),
);
assert.ok(project.includes("data-reading-contents"));
assert.ok(project.includes("Scroll to inspect details."));
const result = {
  passed: true,
  protectedFilesChecked: protectedFiles.length,
  protected: [
    "Stage 2.2 factual content/data",
    "all previous report artifacts",
    "existing public assets",
    "dependency manifests",
    "site configuration",
    "GSAP motion module",
  ],
  designChecks: [
    "no faux browser chrome",
    "generic selected-work heading",
    "About essay precedes margin note",
    "native contents disclosure",
    "inspector pan guidance",
  ],
};
await fs.writeFile(
  "reports/stage2-3/preservation-checks.json",
  JSON.stringify(result, null, 2),
);
console.log(
  `PASS Stage 2.3 preservation and design structure: ${protectedFiles.length} protected files unchanged.`,
);
