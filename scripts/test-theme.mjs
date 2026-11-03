import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const bootstrap = readFileSync(new URL('../src/components/ThemeScript.astro', import.meta.url), 'utf8')
  .match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const controller = ts.transpileModule(
  readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1],
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } },
).outputText;

// Logic-only simulated DOM. This is not a browser rendering or performance test.
function page({ store = new Map(), blocked = false, writeBlocked = false, reduced = false, transitions = false, transitionThrows = false } = {}) {
  const handlers = new Map();
  const attributes = new Map();
  const meta = { content: '', setAttribute: (_, value) => { meta.content = value; } };
  const root = { animated: false, dataset: {}, style: {}, classList: { add() {} }, animate() { root.animated = true; } };
  const button = {
    addEventListener: (name, callback) => handlers.set(name, callback),
    setAttribute: (name, value) => attributes.set(name, value),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 44, height: 44 }),
  };
  const document = {
    documentElement: root,
    querySelector: () => meta,
    querySelectorAll: (selector) => selector === '[data-theme-toggle]' ? [button] : [],
    dispatchEvent() {},
  };
  if (transitions) document.startViewTransition = (callback) => {
    if (transitionThrows) throw Error('Transition unavailable');
    document.transitioned = true;
    callback();
    return { ready: Promise.resolve() };
  };
  const context = vm.createContext({
    document,
    localStorage: {
      getItem(key) { if (blocked) throw Error('Storage blocked'); return store.get(key) ?? null; },
      setItem(key, value) { if (blocked || writeBlocked) throw Error('Storage blocked'); store.set(key, value); },
    },
    window: { matchMedia: (query) => {
      assert.equal(query, '(prefers-reduced-motion: reduce)', 'OS color preference must not be queried');
      return { matches: reduced };
    } },
    CustomEvent: class {},
    innerWidth: 390, innerHeight: 844,
  });
  vm.runInContext(bootstrap, context);
  vm.runInContext(controller, context);
  return { root, meta, store, attributes, document, click: () => handlers.get('click')() };
}

test('new visitor defaults dark without consulting OS color preference', () => {
  const p = page();
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.meta.content, '#0d0c0b');
  assert.equal(p.attributes.get('aria-label'), 'Switch to light theme');
  assert.equal(p.store.size, 0);
});

test('valid saved themes restore before controller initialization', () => {
  for (const theme of ['dark', 'light']) {
    const p = page({ store: new Map([['theme', theme]]) });
    assert.equal(p.root.dataset.theme, theme);
    assert.equal(p.root.style.colorScheme, theme);
  }
});

test('invalid stored value falls back to dark', () => {
  assert.equal(page({ store: new Map([['theme', 'invalid']]) }).root.dataset.theme, 'dark');
});

test('manual choices persist and restore on the next internal document', () => {
  const first = page();
  first.click();
  assert.equal(first.root.dataset.theme, 'light');
  assert.equal(first.store.get('theme'), 'light');
  assert.equal(first.attributes.get('aria-pressed'), 'false');
  const next = page({ store: first.store });
  assert.equal(next.root.dataset.theme, 'light');
  next.click();
  assert.equal(page({ store: next.store }).root.dataset.theme, 'dark');
});

test('blocked local storage does not break initialization or manual toggling', () => {
  const p = page({ blocked: true });
  assert.equal(p.root.dataset.theme, 'dark');
  p.click();
  assert.equal(p.root.dataset.theme, 'light');
  p.click();
  assert.equal(p.root.dataset.theme, 'dark');
});

test('reduced motion skips supported view-transition animation', () => {
  const p = page({ transitions: true, reduced: true });
  p.click();
  assert.equal(p.root.dataset.theme, 'light');
  assert.equal(p.document.transitioned, undefined);
});

test('supported view transition retains the circular-reveal path', async () => {
  const p = page({ transitions: true });
  p.click();
  await Promise.resolve();
  assert.equal(p.document.transitioned, true);
  assert.equal(p.root.animated, true);
  assert.equal(p.store.get('theme'), 'light');
});

test('saved preference restores even if writes later become unavailable', () => {
  const p = page({ store: new Map([['theme', 'light']]), writeBlocked: true });
  assert.equal(p.root.dataset.theme, 'light');
  p.click();
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.store.get('theme'), 'light');
});

test('synchronously failing transition API still applies and saves the theme', () => {
  const p = page({ transitions: true, transitionThrows: true });
  p.click();
  assert.equal(p.root.dataset.theme, 'light');
  assert.equal(p.store.get('theme'), 'light');
});
