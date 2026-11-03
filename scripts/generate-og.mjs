/**
 * Generates the Open Graph / social share image.
 *
 *   npm run og
 *
 * Draws a 1200×630 PNG with sharp (SVG → PNG, no fonts to install), writes
 * it to public/og/default.png, and derives the 180×180 apple-touch-icon.
 * Run it again after changing the name, headline or colours in the config.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Kept in sync with src/config/site.ts by hand — this script runs outside Astro.
const NAME = 'Md. Afnan';
const HEADLINE = ['I build software that', 'makes useful knowledge', 'easier to reach.'];
const FOOTER = 'github.com/afnan0356  ·  nyayota.vercel.app';

const BG = '#0d0c0b';
const INK = '#f0ebe1';
const MUTED = '#9a938a';
const ACCENT = '#f0864f';
const LINE = 'rgba(240,235,225,0.16)';

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="82%" cy="8%" r="70%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="${LINE}" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.5"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- mark -->
  <g transform="translate(88, 84)">
    <rect x="0.5" y="0.5" width="55" height="55" rx="12" fill="none" stroke="${LINE}" stroke-width="1.5"/>
    <path d="M15 42V17l13 14 13-14v25" fill="none" stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <text x="160" y="112" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="${MUTED}" letter-spacing="1">${escape(NAME)}</text>
  <text x="160" y="134" font-family="monospace" font-size="13" fill="${MUTED}" letter-spacing="4" opacity="0.7">PORTFOLIO</text>

  ${HEADLINE.map(
    (line, i) =>
      `<text x="88" y="${268 + i * 76}" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="${i === 2 ? ACCENT : INK}" letter-spacing="-1.5">${escape(line)}</text>`,
  ).join('\n  ')}

  <line x1="88" y1="496" x2="1112" y2="496" stroke="${LINE}" stroke-width="1"/>
  <text x="88" y="542" font-family="monospace" font-size="19" fill="${MUTED}" letter-spacing="1">${escape(FOOTER)}</text>
  <text x="1112" y="542" text-anchor="end" font-family="monospace" font-size="19" fill="${MUTED}" letter-spacing="1">2026</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="${BG}"/>
  <path d="M8.5 23V9.5l7.5 8 7.5-8V23" fill="none" stroke="${ACCENT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

await mkdir(path.join(root, 'public/og'), { recursive: true });

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(root, 'public/og/default.png'));
await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));

console.log('✓ public/og/default.png (1200×630)');
console.log('✓ public/apple-touch-icon.png (180×180)');
