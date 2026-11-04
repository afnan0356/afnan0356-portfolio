/** CSS owns every animation. JS only signals entry; content starts visible. */
let dispose: (() => void) | undefined;
let heroPlayed = false;
let activeMain: Element | null = null;
export function initMotion() {
  const main = document.querySelector("main");
  if (dispose && activeMain === main) return;
  dispose?.();
  activeMain = main;
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let observer: IntersectionObserver | undefined;
  const controller = new AbortController();
  const reset = () => {
    observer?.disconnect();
    document
      .querySelectorAll(".reveal-in")
      .forEach((e) => e.classList.remove("reveal-in"));
    document.documentElement.classList.remove("hero-once");
  };
  const setup = () => {
    reset();
    if (media.matches) return;
    if (document.querySelector("[data-hero]") && !heroPlayed) {
      heroPlayed = true;
      let seen = false;
      try {
        seen = sessionStorage.getItem("hero-played") === "true";
        sessionStorage.setItem("hero-played", "true");
      } catch {
        /* session memory is enough */
      }
      if (!seen) document.documentElement.classList.add("hero-once");
    }
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer?.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        "[data-reveal], [data-motion], .post-row, .project-card",
      )
      .forEach((e) => observer?.observe(e));
  };
  media.addEventListener("change", setup, { signal: controller.signal });
  setup();
  dispose = () => {
    reset();
    controller.abort();
    activeMain = null;
    dispose = undefined;
  };
}
initMotion();
document.addEventListener("astro:before-swap", () => dispose?.());
document.addEventListener("astro:page-load", initMotion);
window.addEventListener("pagehide", () => dispose?.());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initMotion();
});
