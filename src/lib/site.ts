import { findEntries } from "./search";
import type { SearchEntry } from "./search-index";
let dispose: (() => void) | undefined;
let indexPromise: Promise<SearchEntry[]> | undefined;
function loadIndex(signal: AbortSignal) {
  // Shared immutable static data; page-owned fetch can be abandoned on navigation.
  if (!indexPromise)
    indexPromise = fetch("/search.json", { signal })
      .then((r) => {
        if (!r.ok) throw new Error("Search unavailable");
        return r.json() as Promise<SearchEntry[]>;
      })
      .catch((error) => {
        indexPromise = undefined;
        throw error;
      });
  return indexPromise;
}
function init() {
  dispose?.();
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const on = (el: EventTarget, type: string, fn: EventListener) =>
    el.addEventListener(type, fn, { signal });
  const themeButtons = document.querySelectorAll<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  const syncTheme = () =>
    themeButtons.forEach((button) => {
      const dark = root.dataset.theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute(
        "aria-label",
        dark ? "Switch to light theme" : "Switch to dark theme",
      );
    });
  themeButtons.forEach((button) =>
    on(button, "click", () => {
      const theme = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* storage is optional */
      }
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "dark" ? "#0d0c0b" : "#f7f3ec");
      syncTheme();
    }),
  );
  syncTheme();
  const toggle =
    document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const setMenu = (open: boolean) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    root.classList.toggle("menu-open", open);
    document.querySelectorAll<HTMLElement>("main,.site-footer").forEach((e) => {
      e.inert = open;
    });
    if (open) {
      menu.setAttribute("role", "dialog");
      menu.setAttribute("aria-modal", "true");
      menu.setAttribute("aria-label", "Navigation");
      menu.querySelector<HTMLElement>("a")?.focus();
    } else {
      menu.removeAttribute("role");
      menu.removeAttribute("aria-modal");
      menu.removeAttribute("aria-label");
    }
  };
  const trap = (event: KeyboardEvent, scope: HTMLElement) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      scope.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled]),input:not([disabled])",
      ),
    ).filter((e) => e.getClientRects().length);
    const first = controls[0],
      last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
  if (toggle && menu) {
    on(toggle, "click", () =>
      setMenu(toggle.getAttribute("aria-expanded") !== "true"),
    );
    on(menu, "click", (event) => {
      if ((event.target as Element).closest("a")) setMenu(false);
    });
    on(menu, "keydown", (event) => trap(event as KeyboardEvent, menu));
  }
  const wide = matchMedia("(min-width:60rem)");
  on(wide, "change", () => {
    if (wide.matches) setMenu(false);
  });
  const dialog = document.querySelector<HTMLDialogElement>(
    "[data-search-dialog]",
  );
  let opener: HTMLElement | null = null;
  const openSearch = (element: HTMLElement | null) => {
    if (!dialog || typeof dialog.showModal !== "function") {
      location.href = "/search/";
      return;
    }
    if (document.querySelector("dialog[open]") && !dialog.open) return;
    if (dialog.open) {
      dialog.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    setMenu(false);
    opener = element?.closest("[data-mobile-menu]")
      ? document.querySelector<HTMLElement>("[data-open-search]")
      : element && element !== document.body
        ? element
        : document.querySelector<HTMLElement>("[data-open-search]");
    if (!dialog.open) dialog.showModal();
    root.classList.add("search-open");
    dialog.querySelector<HTMLInputElement>("input")?.focus();
  };
  document.querySelectorAll<HTMLElement>("[data-open-search]").forEach((el) =>
    on(el, "click", (event) => {
      const mouse = event as MouseEvent;
      if (
        mouse.button !== 0 ||
        mouse.ctrlKey ||
        mouse.metaKey ||
        mouse.shiftKey ||
        mouse.altKey
      )
        return;
      event.preventDefault();
      openSearch(el);
    }),
  );
  if (dialog) {
    const finishClose = () => {
      if (dialog.open) return;
      root.classList.remove("search-open");
      opener?.focus();
    };
    const closeSearch = () => {
      dialog.close();
      finishClose();
    };
    on(dialog, "close", finishClose);
    on(dialog, "keydown", (event) => {
      const key = event as KeyboardEvent;
      if (key.key === "Escape") {
        key.preventDefault();
        closeSearch();
      } else trap(key, dialog);
    });
    dialog
      .querySelector("[data-close-search]")
      ?.addEventListener("click", closeSearch, { signal });
  }
  on(document, "keydown", (event) => {
    const key = event as KeyboardEvent;
    if (
      (key.ctrlKey || key.metaKey) &&
      !key.altKey &&
      key.key.toLowerCase() === "k"
    ) {
      key.preventDefault();
      if (!key.repeat) openSearch(document.activeElement as HTMLElement);
    }
    if (
      key.key === "Escape" &&
      toggle?.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      toggle.focus();
    }
  });
  document
    .querySelectorAll<HTMLElement>("[data-search-root]")
    .forEach((scope) => {
      const input = scope.querySelector<HTMLInputElement>(
        "[data-search-input]",
      )!;
      input.disabled = false;
      const status = scope.querySelector<HTMLElement>("[data-search-status]")!;
      const list = scope.querySelector<HTMLElement>("[data-search-results]")!;
      let request = 0;
      const update = async () => {
        const version = ++request;
        const query = input.value.trim();
        list.replaceChildren();
        if (!query) {
          status.textContent = "Try “Nyayota” or “sources”.";
          return;
        }
        status.textContent = "Looking through this site…";
        try {
          const entries = await loadIndex(signal);
          if (signal.aborted || version !== request) return;
          const matches = findEntries(entries, query);
          status.textContent = matches.length
            ? `${matches.length} ${matches.length === 1 ? "result" : "results"}.`
            : "Nothing matches that yet. Try a project name or browse the collections.";
          for (const item of matches) {
            const li = document.createElement("li"),
              a = document.createElement("a"),
              small = document.createElement("small");
            a.href = item.href;
            a.textContent = item.title;
            small.textContent = item.kind;
            li.append(a, small);
            list.append(li);
          }
        } catch {
          if (!signal.aborted && version === request)
            status.textContent =
              "Search couldn’t load. You can still browse Projects, Blog, Writing and Vault from the navigation.";
        }
      };
      on(input, "input", () => {
        void update();
      });
      on(scope.querySelector("form")!, "submit", (event) => {
        event.preventDefault();
        void update();
      });
      if (!scope.closest("dialog")) {
        const query = new URL(location.href).searchParams.get("q");
        if (query) {
          input.value = query.slice(0, 160);
          void update();
        }
      }
    });
  let timer: ReturnType<typeof setTimeout> | undefined;
  document
    .querySelectorAll<HTMLButtonElement>("[data-copy],[data-copy-link]")
    .forEach((button) =>
      on(button, "click", () => {
        const link = button.hasAttribute("data-copy-link");
        const value = link
          ? location.href.split("#")[0]
          : (button.dataset.copy ?? "");
        const status = button.parentElement?.querySelector<HTMLElement>(
          link ? "[data-link-status]" : "[data-copy-status]",
        );
        void navigator.clipboard
          ?.writeText(value)
          .then(() => {
            if (status)
              status.textContent = link
                ? "Link copied."
                : "Email address copied.";
          })
          .catch(() => {
            if (status)
              status.textContent = link
                ? `Copy this address: ${value}`
                : "Copy unavailable. Select the email address to copy it.";
          });
        if (!navigator.clipboard && status)
          status.textContent = link
            ? `Copy this address: ${value}`
            : "Copy unavailable. Select the email address to copy it.";
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          if (status) status.textContent = "";
        }, 6000);
      }),
    );
  document
    .querySelectorAll<HTMLFormElement>("[data-mail-compose]")
    .forEach((form) =>
      on(form, "submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        location.href = `mailto:${form.dataset.mailCompose}?subject=${encodeURIComponent(String(data.get("subject") ?? ""))}&body=${encodeURIComponent(String(data.get("body") ?? ""))}`;
      }),
    );
  document
    .querySelectorAll<HTMLButtonElement>("[data-print]")
    .forEach((button) => on(button, "click", () => window.print()));
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const videos =
    document.querySelectorAll<HTMLVideoElement>("[data-demo-video]");
  const syncVideo = () =>
    videos.forEach((video) => {
      video.loop = !media.matches;
      if (media.matches) video.pause();
    });
  on(media, "change", syncVideo);
  syncVideo();
  const progress = document.querySelector<HTMLElement>(
    "[data-reading-progress]",
  );
  const article = progress?.closest("article, [data-reading-article]");
  let frame = 0;
  const draw = () => {
    frame = 0;
    if (!article || !progress || media.matches) return;
    const box = article.getBoundingClientRect();
    const distance = box.height - innerHeight;
    progress.style.setProperty(
      "--reading",
      String(distance > 0 ? Math.max(0, Math.min(1, -box.top / distance)) : 1),
    );
  };
  const scroll = () => {
    if (!frame && !media.matches) frame = requestAnimationFrame(draw);
  };
  if (progress) {
    window.addEventListener("scroll", scroll, { passive: true, signal });
    on(window, "resize", scroll);
    on(media, "change", scroll);
    draw();
  }
  dispose = () => {
    controller.abort();
    if (frame) cancelAnimationFrame(frame);
    if (timer) clearTimeout(timer);
    setMenu(false);
    root.classList.remove("search-open");
  };
}
init();
document.addEventListener("astro:before-swap", () => dispose?.());
document.addEventListener("astro:page-load", init);
window.addEventListener("pagehide", () => dispose?.());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) init();
});
