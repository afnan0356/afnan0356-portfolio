import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { findEntries } from "../src/lib/search.ts";
const entries = [
  {
    title: "Nyayota",
    text: "Reading Bangladeshi statutes and sources",
    kind: "Project",
    href: "/projects/nyayota/",
  },
  {
    title: "Source notes",
    text: "Nyayota project repository",
    kind: "Vault",
    href: "/vault/",
  },
];
test("search requires every word and prioritizes title matches", () => {
  assert.equal(findEntries(entries, " NYAYOTA ")[0].title, "Nyayota");
  assert.equal(findEntries(entries, "nyayota statutes").length, 1);
  assert.equal(findEntries(entries, "unrelated").length, 0);
  assert.equal(findEntries(entries, " ").length, 0);
});
test("search handles Bengali and literal HTML without interpreting either as markup", () => {
  assert.equal(
    findEntries(
      [{ title: "বাংলা", text: "প্রকল্প", kind: "Writing", href: "/bn/" }],
      "বাংলা প্রকল্প",
    ).length,
    1,
  );
  assert.equal(findEntries(entries, "<script>").length, 0);
});
test("no animation dependency and static production index excludes draft prompts", () => {
  assert.ok(!JSON.parse(fs.readFileSync("package.json")).dependencies.gsap);
  const index = JSON.parse(fs.readFileSync("dist/search.json"));
  assert.ok(index.length > 0);
  assert.ok(!JSON.stringify(index).includes("YOUR "));
  assert.ok(index.every((e) => e.href.startsWith("/")));
});
