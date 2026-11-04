import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
const html = (route) =>
  fs.readFile(`dist/${route ? route + "/" : ""}index.html`, "utf8");
const home = await html("");
const about = await html("about");
const project = await html("projects/nyayota");
const cv = await html("cv");
const vault = await html("vault");
assert.ok(home.includes("I am a student"));
assert.ok(!home.includes("developer, builder, writer"));
assert.ok(!home.includes("The reading room"));
assert.ok(!home.includes("Public record"));
assert.ok(!home.includes("No articles published yet"));
assert.equal((home.match(/data-project(?:[\s=>])/g) || []).length, 1);
assert.ok(about.includes("Technology &amp; AI"));
assert.ok(about.includes("AI-assisted development"));
assert.ok(cv.includes("I am a student"));
for (const id of [
  "information-architecture",
  "technical-architecture",
  "workflow",
  "scope",
  "next",
])
  assert.ok(project.includes(`id="${id}"`), `Missing case study section ${id}`);
assert.ok(project.includes("data-open-image"));
assert.ok(!project.includes("I modelled statutes"));
assert.ok(!project.includes("It is a statically deployed"));
assert.ok(vault.includes("Public source"));
assert.ok(!vault.includes(">Verified<"));
assert.ok(!vault.includes("Released Nyayota"));
assert.ok(!vault.includes("Learned to model"));
assert.ok(!vault.includes("2027"));
const exports = {};
vm.runInNewContext(
  ts.transpileModule(await fs.readFile("src/data/timeline.ts", "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  { exports, Map },
);
assert.equal(exports.timeline.filter((e) => e.state === "completed").length, 1);
for (const entry of exports.timeline) {
  assert.ok(entry.date <= "2026-11-04");
  assert.notEqual(entry.state, "verified");
  if (entry.state === "completed")
    assert.ok(entry.href.includes("c82e2f3f64d43b1fc97e8a195bacf2befa4e60ff"));
}
const result = {
  passed: true,
  checks: [
    "student identity and metadata",
    "single primary project",
    "no home empty-publishing/evidence dashboard",
    "case-study architecture/workflow/limits",
    "image inspector hook",
    "narrowed source labels",
    "timeline dates and evidence-backed publication event",
  ],
};
await fs.writeFile(
  `${process.env.REVIEW_REPORT_PATH || "reports/stage2-2"}/authenticity-checks.json`,
  JSON.stringify(result, null, 2),
);
console.log(
  "Stage 2.2 authenticity checks passed: identity, homepage IA, case-study scope, source labels and timeline.",
);
