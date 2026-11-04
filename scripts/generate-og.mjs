/**
 * Generates the Open Graph / social share image.
 *
 *   npm run og
 *
 * Draws a 1200×630 PNG with sharp (SVG → PNG, no fonts to install), writes
 * it to public/og/default.png, and derives the 180×180 apple-touch-icon.
 * Run it again after changing the name, headline or colours in the config.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Kept in sync with src/config/site.ts by hand — this script runs outside Astro.
const NAME = "Md. Afnan";
const BG = "#0d0c0b";
const ACCENT = "#f0864f";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <path d="M80 100h60" stroke="${ACCENT}" stroke-width="3"/>
  <text x="80" y="150" font-family="sans-serif" font-size="23" fill="#c9c2b6">A PERSONAL PROJECT NOTEBOOK</text>
  <text x="76" y="285" font-family="serif" font-size="92" fill="#f0ebe1">Hi, I’m Afnan.</text>
  <text x="80" y="375" font-family="serif" font-style="italic" font-size="64" fill="${ACCENT}">Learning by building.</text>
  <text x="80" y="445" font-family="sans-serif" font-size="26" fill="#c9c2b6">Student · Nyayota · AI-assisted web projects</text>
  <path d="M80 502h1040" stroke="#544b40"/>
  <text x="80" y="552" font-family="monospace" font-size="23" fill="#c9c2b6">github.com/afnan0356</text>
  <text x="1120" y="552" text-anchor="end" font-family="serif" font-size="26" fill="#f0ebe1">${NAME}</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${BG}"/>
  <path d="M8.5 23V9.5l7.5 8 7.5-8V23" fill="none" stroke="${ACCENT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

await mkdir(path.join(root, "public/og"), { recursive: true });

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public/og/default.png"));
await sharp(Buffer.from(iconSvg))
  .resize(180, 180)
  .png()
  .toFile(path.join(root, "public/apple-touch-icon.png"));

console.log("✓ public/og/default.png (1200×630)");
console.log("✓ public/apple-touch-icon.png (180×180)");
