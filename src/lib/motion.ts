import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** One language, one owner. CSS handles feedback; GSAP handles choreography. */
export const motion = {
  ease: "power3.out",
  entrance: 0.95,
  reveal: 0.85,
  stagger: 0.085,
  distance: 22,
} as const;

gsap.registerPlugin(ScrollTrigger);
let dispose: (() => void) | undefined;

export function initMotion() {
  // Also makes repeated astro:page-load events idempotent.
  dispose?.();
  const media = gsap.matchMedia();
  let context: gsap.Context | undefined;
  dispose = () => {
    media.revert();
    context?.revert();
  };

  try {
    context = gsap.context(() => {
      media.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          compact: "(max-width: 767px)",
        },
        (conditions) => {
          if (!conditions.conditions?.animate) return;
          const focusControllers = new AbortController();
          const compact = Boolean(conditions.conditions.compact);
          const distance = compact ? 12 : motion.distance;
          const hero = document.querySelector("[data-hero]");
          if (hero) {
            const timeline = gsap.timeline({ defaults: { ease: motion.ease } });
            hero.addEventListener("focusin", () => timeline.progress(1), {
              signal: focusControllers.signal,
            });
            const titleLines = hero.querySelectorAll("[data-title-line]");
            const entranceBlocks = hero.querySelectorAll("[data-enter]");
            if (titleLines.length)
              timeline.from(
                titleLines,
                {
                  yPercent: 30,
                  opacity: 0,
                  duration: motion.entrance,
                  stagger: motion.stagger,
                  clearProps: "transform,opacity",
                },
                0.08,
              );
            if (entranceBlocks.length)
              timeline.from(
                entranceBlocks,
                {
                  y: distance,
                  opacity: 0,
                  duration: motion.reveal,
                  stagger: motion.stagger,
                  clearProps: "transform,opacity",
                },
                0.15,
              );
          }

          document
            .querySelectorAll<HTMLElement>("[data-motion]")
            .forEach((element) => {
              const kind = element.dataset.motion;
              const targets =
                kind === "stagger" ? Array.from(element.children) : [element];
              if (!targets.length) return;
              const animation = gsap.from(targets, {
                y: distance,
                opacity: 0,
                duration: kind === "image" ? 1.05 : motion.reveal,
                ease: motion.ease,
                stagger: kind === "stagger" ? motion.stagger : 0,
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: element,
                  start: "top 94%",
                  once: true,
                  // No pinning, scrub, parallax loop or scroll replacement.
                },
              });
              // A keyboard user must never have to wait for a reveal to see focus.
              element.addEventListener("focusin", () => animation.progress(1), {
                signal: focusControllers.signal,
              });
            });
          return () => focusControllers.abort();
        },
      );
    });
  } catch (error) {
    dispose?.();
    // Defaults are visible. If setup fails, remove every animation-owned style.
    console.warn(
      "Motion enhancement unavailable; static content retained.",
      error,
    );
  }
}

export function destroyMotion() {
  dispose?.();
  dispose = undefined;
}

// Native cross-document navigation is retained. These also support a future
// Astro ClientRouter without adding a router or duplicate init in this stage.
initMotion();
document.addEventListener("astro:before-swap", destroyMotion);
document.addEventListener("astro:page-load", initMotion);
window.addEventListener("pagehide", destroyMotion);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initMotion();
});
