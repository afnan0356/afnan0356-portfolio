/** Semantic reading location only; animation remains owned by motion.ts. */
let dispose: (() => void) | undefined;
function initReading() {
  dispose?.();
  const nav = document.querySelector<HTMLElement>("[data-reading-nav]");
  if (!nav || !("IntersectionObserver" in window)) return;
  const links = Array.from(
    nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
  );
  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter((el): el is HTMLElement => Boolean(el));
  const setCurrent = (id: string) =>
    links.forEach((link) => {
      if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  // A narrow viewport band provides one reading location without scroll listeners.
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (active) setCurrent(active.target.id);
    },
    { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
  const controller = new AbortController();
  nav.addEventListener(
    "click",
    (event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (link) setCurrent(link.hash.slice(1));
    },
    { signal: controller.signal },
  );
  dispose = () => {
    observer.disconnect();
    controller.abort();
    links.forEach((link) => link.removeAttribute("aria-current"));
  };
}
function destroyReading() {
  dispose?.();
  dispose = undefined;
}
initReading();
document.addEventListener("astro:before-swap", destroyReading);
document.addEventListener("astro:page-load", initReading);
window.addEventListener("pagehide", destroyReading);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initReading();
});
