/** Logic-only DOM fixture. Browser tests separately check real focus/layout/lifecycle. */
import vm from "node:vm";
import ts from "typescript";
import { readFileSync } from "node:fs";
const bootstrap = readFileSync(
  new URL("../src/components/ThemeScript.astro", import.meta.url),
  "utf8",
).match(/<script is:inline[^>]*>([\s\S]*?)<\/script>/)[1];
const controller = ts.transpileModule(
  readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
export function page({
  store = new Map(),
  blocked = false,
  writeBlocked = false,
  reduced = false,
  transitions = false,
  transitionThrows = false,
  clipboard = "available",
} = {}) {
  const events = () => {
    const listeners = new Map();
    return {
      addEventListener(type, fn, options = {}) {
        const set = listeners.get(type) ?? new Set();
        set.add(fn);
        listeners.set(type, set);
        options.signal?.addEventListener("abort", () => set.delete(fn), {
          once: true,
        });
      },
      fire(type, event = {}) {
        for (const fn of listeners.get(type) ?? []) fn(event);
      },
    };
  };
  const classes = new Set();
  const root = {
    dataset: {},
    style: {},
    animated: false,
    classList: {
      add: (...xs) => xs.forEach((x) => classes.add(x)),
      remove: (...xs) => xs.forEach((x) => classes.delete(x)),
      toggle: (x, on) => (on ? classes.add(x) : classes.delete(x)),
    },
    animate() {
      root.animated = true;
    },
  };
  const meta = {
    content: "",
    setAttribute(_, value) {
      meta.content = value;
    },
  };
  const document = {
    ...events(),
    documentElement: root,
    body: {},
    activeElement: null,
  };
  const control = () => {
    const attrs = new Map();
    const el = {
      ...events(),
      attrs,
      setAttribute: (k, v) => attrs.set(k, v),
      getAttribute: (k) => attrs.get(k),
      focus() {
        document.activeElement = el;
      },
      getClientRects: () => [{}],
    };
    return el;
  };
  const button = control(),
    toggle = control(),
    first = control(),
    last = control();
  toggle.attrs.set("aria-expanded", "false");
  const menu = {
    ...control(),
    hidden: true,
    removeAttribute(k) {
      this.attrs.delete(k);
    },
    querySelector: () => first,
    querySelectorAll: () => [first, last],
  };
  const main = { inert: false },
    footer = { inert: false },
    status = { textContent: "" };
  let written, reset;
  const copy = {
    ...control(),
    dataset: { copy: "mdafnan0356@gmail.com" },
    hasAttribute: () => false,
    parentElement: { querySelector: () => status },
  };
  document.querySelector = (selector) =>
    selector.startsWith("meta[")
      ? meta
      : selector === "[data-menu-toggle]"
        ? toggle
        : selector === "[data-mobile-menu]"
          ? menu
          : null;
  document.querySelectorAll = (selector) =>
    selector === "[data-theme-toggle]"
      ? [button]
      : selector === "[data-copy],[data-copy-link]"
        ? [copy]
        : selector === "main,.site-footer"
          ? [main, footer]
          : [];
  const media = new Map();
  const matchMedia = (query) => {
    if (!media.has(query))
      media.set(query, {
        ...events(),
        matches: query.includes("reduced-motion") ? reduced : false,
      });
    return media.get(query);
  };
  if (transitions)
    document.startViewTransition = (callback) => {
      if (transitionThrows) throw Error("unavailable");
      document.transitioned = true;
      callback();
      return { ready: Promise.resolve() };
    };
  const context = vm.createContext({
    document,
    window: { ...events(), print() {} },
    exports: {},
    require: () => ({ findEntries: () => [] }),
    AbortController,
    matchMedia,
    localStorage: {
      getItem(k) {
        if (blocked) throw Error("blocked");
        return store.get(k) ?? null;
      },
      setItem(k, v) {
        if (blocked || writeBlocked) throw Error("blocked");
        store.set(k, v);
      },
    },
    navigator:
      clipboard === "absent"
        ? {}
        : {
            clipboard: {
              async writeText(value) {
                if (clipboard === "denied") throw Error("denied");
                written = value;
              },
            },
          },
    setTimeout: (fn) => {
      reset = fn;
      return 1;
    },
    clearTimeout() {},
    cancelAnimationFrame() {},
  });
  vm.runInContext(bootstrap, context);
  vm.runInContext(controller, context);
  return {
    root,
    meta,
    store,
    attributes: button.attrs,
    document,
    main,
    menu,
    toggle,
    first,
    last,
    classes,
    status,
    media,
    click: () => button.fire("click"),
    copy: () => copy.fire("click"),
    written: () => written,
    reset: () => reset?.(),
    resize: (matches) => {
      const m = matchMedia("(min-width:60rem)");
      m.matches = matches;
      m.fire("change", { matches });
    },
  };
}
