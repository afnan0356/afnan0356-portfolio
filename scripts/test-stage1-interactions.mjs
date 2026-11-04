import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { page } from "./controller-fixture.mjs";

for (const clipboard of ["available", "denied", "absent"]) {
  test(`email copy: clipboard ${clipboard}`, async () => {
    const p = page({ clipboard });
    p.copy();
    await new Promise((resolve) => setImmediate(resolve));
    if (clipboard === "available") {
      assert.equal(p.written(), "mdafnan0356@gmail.com");
      assert.equal(p.status.textContent, "Email address copied.");
    } else {
      assert.equal(p.written(), undefined);
      assert.match(p.status.textContent, /Copy unavailable/);
    }
    p.reset();
    assert.equal(p.status.textContent, "");
  });
}
test("mobile menu opens, traps focus, closes on Escape/link/desktop resize", () => {
  const p = page();
  p.toggle.fire("click");
  assert.equal(p.menu.hidden, false);
  assert.equal(p.main.inert, true);
  assert.equal(p.document.activeElement, p.first);
  let prevented = false;
  p.menu.fire("keydown", {
    key: "Tab",
    shiftKey: true,
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, true);
  assert.equal(p.document.activeElement, p.last);
  p.document.fire("keydown", { key: "Escape" });
  assert.equal(p.menu.hidden, true);
  assert.equal(p.main.inert, false);
  assert.equal(p.document.activeElement, p.toggle);
  p.toggle.fire("click");
  p.menu.fire("click", { target: { closest: () => ({}) } });
  assert.equal(p.menu.hidden, true);
  p.toggle.fire("click");
  p.resize(true);
  assert.equal(p.menu.hidden, true);
  assert.equal(p.toggle.getAttribute("aria-expanded"), "false");
});

test("reviewed controls declare 44px targets and retain visible focus styling", () => {
  // Source assertions only: these do not measure rendered browser hitboxes.
  for (const [file, selector] of [
    ["../src/components/Header.astro", ".menu-toggle"],
    ["../src/components/ThemeToggle.astro", ".theme-toggle"],
  ]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    const block = source.slice(source.indexOf(`${selector} {`)).split("}")[0];
    assert.match(block, /inline-size: 2\.75rem/);
    assert.match(block, /block-size: 2\.75rem/);
  }
  const contact = readFileSync(
    new URL("../src/pages/contact.astro", import.meta.url),
    "utf8",
  );
  const footer = readFileSync(
    new URL("../src/components/Footer.astro", import.meta.url),
    "utf8",
  );
  assert.match(
    contact,
    /\.contact__actions \.btn \{\s*min-block-size: 2\.75rem/,
  );
  const routeTarget = contact.match(
    /\.route-list a \{\s*min-block-size: ([\d.]+)rem/,
  )?.[1];
  assert.ok(
    Number(routeTarget) >= 2.75,
    "contact routes retain at least 44px targets",
  );
  const footerBlock =
    footer.match(/\.site-footer__socials a \{([^}]+)}/)?.[1] ?? "";
  const footerTarget = footerBlock.match(
    /min-(?:height|block-size): ([\d.]+)(px|rem)/,
  );
  assert.ok(
    footerTarget &&
      Number(footerTarget[1]) * (footerTarget[2] === "rem" ? 16 : 1) >= 44,
  );
  assert.match(footer, /\.site-footer__socials \{[\s\S]*?flex-wrap: wrap/);
  const base = readFileSync(
    new URL("../src/styles/base.css", import.meta.url),
    "utf8",
  );
  assert.match(base, /:focus-visible \{\s*outline: 2px solid var\(--focus\)/);
});
