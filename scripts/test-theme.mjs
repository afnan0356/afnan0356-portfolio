import assert from "node:assert/strict";
import { test } from "node:test";
import { page } from "./controller-fixture.mjs";

test("new visitor defaults dark without consulting OS color preference", () => {
  const p = page();
  assert.equal(p.root.dataset.theme, "dark");
  assert.equal(p.meta.content, "#0d0c0b");
  assert.equal(p.attributes.get("aria-label"), "Switch to light theme");
  assert.equal(p.store.size, 0);
  assert.ok(
    [...p.media.keys()].every((query) => !query.includes("color-scheme")),
  );
});

test("valid saved themes restore before controller initialization", () => {
  for (const theme of ["dark", "light"]) {
    const p = page({ store: new Map([["theme", theme]]) });
    assert.equal(p.root.dataset.theme, theme);
    assert.equal(p.root.style.colorScheme, theme);
  }
});

test("invalid stored value falls back to dark", () => {
  assert.equal(
    page({ store: new Map([["theme", "invalid"]]) }).root.dataset.theme,
    "dark",
  );
});

test("manual choices persist and restore on the next internal document", () => {
  const first = page();
  first.click();
  assert.equal(first.root.dataset.theme, "light");
  assert.equal(first.store.get("theme"), "light");
  assert.equal(first.attributes.get("aria-pressed"), "false");
  const next = page({ store: first.store });
  assert.equal(next.root.dataset.theme, "light");
  next.click();
  assert.equal(page({ store: next.store }).root.dataset.theme, "dark");
});

test("blocked local storage does not break initialization or manual toggling", () => {
  const p = page({ blocked: true });
  assert.equal(p.root.dataset.theme, "dark");
  p.click();
  assert.equal(p.root.dataset.theme, "light");
  p.click();
  assert.equal(p.root.dataset.theme, "dark");
});

test("reduced motion skips supported view-transition animation", () => {
  const p = page({ transitions: true, reduced: true });
  p.click();
  assert.equal(p.root.dataset.theme, "light");
  assert.equal(p.document.transitioned, undefined);
});

test("theme feedback is CSS-first even when the transition API exists", async () => {
  const p = page({ transitions: true });
  p.click();
  await Promise.resolve();
  assert.equal(p.document.transitioned, undefined);
  assert.equal(p.root.animated, false);
  assert.equal(p.store.get("theme"), "light");
});

test("saved preference restores even if writes later become unavailable", () => {
  const p = page({ store: new Map([["theme", "light"]]), writeBlocked: true });
  assert.equal(p.root.dataset.theme, "light");
  p.click();
  assert.equal(p.root.dataset.theme, "dark");
  assert.equal(p.store.get("theme"), "light");
});

test("synchronously failing transition API still applies and saves the theme", () => {
  const p = page({ transitions: true, transitionThrows: true });
  p.click();
  assert.equal(p.root.dataset.theme, "light");
  assert.equal(p.store.get("theme"), "light");
});
