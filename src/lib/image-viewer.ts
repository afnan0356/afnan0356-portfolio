/** Progressive enhancement of the original-image link. No image request until
 * the visitor opens it; the ordinary link still works without JS/dialog. */
let dispose: (() => void) | undefined;
function initImageViewer() {
  dispose?.();
  dispose = undefined;
  const dialog = document.querySelector<HTMLDialogElement>(
    "[data-image-viewer]",
  );
  const canvas = dialog?.querySelector<HTMLElement>("[data-image-canvas]");
  const status = dialog?.querySelector<HTMLElement>("[data-image-status]");
  let image: HTMLImageElement | undefined;
  if (!dialog || !canvas || typeof dialog.showModal !== "function") return;
  canvas.replaceChildren();
  if (status) status.textContent = "";
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let opener: HTMLAnchorElement | undefined;
  document
    .querySelectorAll<HTMLAnchorElement>("[data-open-image]")
    .forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          // Keep navigation as the fallback if the modal API is unavailable at runtime.
          try {
            dialog.showModal();
          } catch {
            return;
          }
          event.preventDefault();
          opener = link;
          if (!image) {
            image = document.createElement("img");
            image.dataset.imageFull = "";
            image.addEventListener(
              "load",
              () => {
                if (status) status.textContent = "";
              },
              options,
            );
            image.addEventListener(
              "error",
              () => {
                if (status)
                  status.textContent =
                    "Screenshot could not be loaded. Close this view to use the original link.";
              },
              options,
            );
          }
          if (status)
            status.textContent =
              image.complete && image.src === link.href
                ? ""
                : "Loading screenshot…";
          image.alt = link.dataset.imageAlt ?? "Project screenshot";
          image.src = link.href;
          canvas.append(image);
          document.documentElement.classList.add("image-viewer-open");
          dialog
            .querySelector<HTMLButtonElement>("[data-image-close]")
            ?.focus();
        },
        options,
      );
    });
  dialog
    .querySelector("[data-image-close]")
    ?.addEventListener("click", () => dialog.close(), options);
  dialog.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>("button, a[href], [tabindex]"),
      ].filter(
        (el) =>
          el.tabIndex >= 0 &&
          !el.hasAttribute("disabled") &&
          el.getClientRects().length > 0,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    options,
  );
  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target === dialog) dialog.close();
    },
    options,
  );
  dialog.addEventListener(
    "close",
    () => {
      // A queued close event must not unlock a dialog already reopened.
      if (dialog.open) return;
      document.documentElement.classList.remove("image-viewer-open");
      opener?.focus({ preventScroll: true });
    },
    options,
  );
  dispose = () => {
    controller.abort();
    if (dialog.open) dialog.close();
    canvas.replaceChildren();
    document.documentElement.classList.remove("image-viewer-open");
  };
}
function destroyImageViewer() {
  dispose?.();
  dispose = undefined;
}
initImageViewer();
document.addEventListener("astro:before-swap", destroyImageViewer);
document.addEventListener("astro:page-load", initImageViewer);
window.addEventListener("pagehide", destroyImageViewer);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initImageViewer();
});

export {};
