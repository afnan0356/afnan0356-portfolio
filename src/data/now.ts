import type { ImageMetadata } from "astro";

/** Owner-editable monthly note. Null means genuinely not supplied, not a guess. */
export const now = {
  month: null as string | null, // e.g. your actual review month; no automatic freshness claim
  building:
    "I’m developing Nyayota with AI assistance, while learning how to make information easier to use.",
  reading: null as string | null, // Add the title/author you are actually reading.
  learning:
    "I’m continuing to learn web development, including readable layouts and keyboard-friendly interfaces.",
  photo: null as ImageMetadata | null, // Import a real, compressed photo from src/assets/.
  photoAlt: "", // Describe your real photo when supplied.
  demoVideo: null as string | null, // Real compressed recording in public/demos/, never a fabricated demo.
  demoPoster: null as string | null,
};
