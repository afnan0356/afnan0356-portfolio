import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const script = (file) => ts.transpileModule(
  readFileSync(new URL(file, import.meta.url), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1],
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
).outputText;

// Controller tests with simulated DOM objects, not browser or visual tests.
for (const allowed of [true, false]) {
  test(`email copy: clipboard ${allowed ? 'available' : 'denied'}`, async () => {
    const status = { textContent: '' };
    const attributes = new Map();
    let click;
    let written;
    let reset;
    const button = {
      dataset: { copy: 'mdafnan0356@gmail.com', label: 'Copy address' },
      textContent: 'Copy address',
      parentElement: { querySelector: () => status },
      setAttribute: (key, value) => attributes.set(key, value),
      addEventListener: (_, callback) => { click = callback; },
    };
    const context = vm.createContext({
      document: {
        documentElement: { dataset: { theme: 'dark' } },
        querySelectorAll: (selector) => selector === '[data-copy]' ? [button] : [],
      },
      window: { matchMedia: () => ({ matches: true }) },
      navigator: { clipboard: { async writeText(value) {
        if (!allowed) throw Error('Permission denied');
        written = value;
      } } },
      setTimeout: (callback) => { reset = callback; },
    });
    vm.runInContext(script('../src/layouts/BaseLayout.astro'), context);
    await click();
    if (allowed) {
      assert.equal(written, 'mdafnan0356@gmail.com');
      assert.equal(button.textContent, 'Copied');
      assert.equal(status.textContent, 'Email address copied.');
    } else {
      assert.equal(written, undefined);
      assert.equal(button.textContent, 'Copy address');
      assert.match(status.textContent, /Copy unavailable/);
    }
    reset();
    assert.equal(button.textContent, 'Copy address');
  });
}

test('mobile menu opens, focuses first link, closes on Escape/link/desktop resize', () => {
  const toggleEvents = new Map();
  const menuEvents = new Map();
  const documentEvents = new Map();
  const attributes = new Map([['aria-expanded', 'false']]);
  const classes = new Set();
  let focused = false;
  let returned = false;
  let resized;
  const toggle = {
    setAttribute: (key, value) => attributes.set(key, value),
    getAttribute: (key) => attributes.get(key),
    addEventListener: (event, callback) => toggleEvents.set(event, callback),
    focus: () => { returned = true; },
  };
  const menu = {
    hidden: true,
    querySelector: () => ({ focus: () => { focused = true; } }),
    addEventListener: (event, callback) => menuEvents.set(event, callback),
  };
  const context = vm.createContext({
    document: {
      documentElement: { classList: { toggle(name, active) {
        if (active) classes.add(name); else classes.delete(name);
      } } },
      querySelector: (selector) => selector === '[data-menu-toggle]' ? toggle : menu,
      addEventListener: (event, callback) => documentEvents.set(event, callback),
    },
    window: { matchMedia: () => ({ addEventListener: (_, callback) => { resized = callback; } }) },
  });
  vm.runInContext(script('../src/components/Header.astro'), context);
  toggleEvents.get('click')();
  assert.equal(menu.hidden, false);
  assert.equal(attributes.get('aria-expanded'), 'true');
  assert.equal(focused, true);
  assert.equal(classes.has('menu-open'), true);
  documentEvents.get('keydown')({ key: 'Escape' });
  assert.equal(menu.hidden, true);
  assert.equal(returned, true);
  assert.equal(classes.has('menu-open'), false);
  toggleEvents.get('click')();
  menuEvents.get('click')({ target: { closest: () => ({}) } });
  assert.equal(menu.hidden, true);
  toggleEvents.get('click')();
  resized({ matches: true });
  assert.equal(menu.hidden, true);
  assert.equal(attributes.get('aria-expanded'), 'false');
});

test('reviewed controls declare 44px targets and retain visible focus styling', () => {
  // Source assertions only: these do not measure rendered browser hitboxes.
  for (const [file, selector] of [
    ['../src/components/Header.astro', '.menu-toggle'],
    ['../src/components/ThemeToggle.astro', '.theme-toggle'],
  ]) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    const block = source.slice(source.indexOf(`${selector} {`)).split('}')[0];
    assert.match(block, /inline-size: 2\.75rem/);
    assert.match(block, /block-size: 2\.75rem/);
  }
  const contact = readFileSync(new URL('../src/pages/contact.astro', import.meta.url), 'utf8');
  const footer = readFileSync(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');
  assert.match(contact, /\.contact__actions \.btn \{\s*min-block-size: 2\.75rem/);
  assert.match(contact, /\.route-list a \{\s*min-block-size: 2\.75rem/);
  assert.match(footer, /\.site-footer__socials a \{\s*min-block-size: 2\.75rem/);
  assert.match(footer, /\.site-footer__socials \{[\s\S]*?flex-wrap: wrap/);
  const base = readFileSync(new URL('../src/styles/base.css', import.meta.url), 'utf8');
  assert.match(base, /:focus-visible \{\s*outline: 2px solid var\(--focus\)/);
});
