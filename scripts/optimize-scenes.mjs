// optimize-scenes.mjs — convert scene masters to web-ready WebP
// Usage (Git Bash, repo root):
//   npm install sharp          # one-time
//   node scripts/optimize-scenes.mjs
//
// For every scene key in scripts/scene-prompts.json PLUS the two references:
//   1. Prefer the new master in scenes-raw/{key}.png
//   2. Fall back to the legacy public/scenes/{key}.png (so the app keeps
//      working even if some keys haven't been regenerated yet)
//   3. Resize to 1400px wide, encode WebP quality 80
//   4. Write public/scenes/{key}.webp
// Then prints a size report. The app reads .webp after the App.jsx switch
// in this same package — push both together.
//
// After running, the legacy PNGs in public/scenes/ are no longer used:
//   git rm public/scenes/*.png    (removes ~142MB from the deployed site)

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import sharp from 'sharp';

const manifest = JSON.parse(readFileSync('scripts/scene-prompts.json', 'utf8'));
const keys = ['desk-working', 'boardroom-crisis', ...manifest.images.map(i => i.filename)];

let totalIn = 0, totalOut = 0, missing = [], fromLegacy = [];

for (const key of keys) {
  const fresh = `scenes-raw/${key}.png`;
  const legacy = `public/scenes/${key}.png`;
  const src = existsSync(fresh) ? fresh : (existsSync(legacy) ? legacy : null);
  if (!src) { missing.push(key); continue; }
  if (src === legacy) fromLegacy.push(key);

  const inBytes = readFileSync(src).length;
  const out = `public/scenes/${key}.webp`;
  const info = await sharp(src).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  totalIn += inBytes; totalOut += info.size;
  console.log(`${key.padEnd(26)} ${(inBytes / 1048576).toFixed(2).padStart(6)} MB -> ${(info.size / 1024).toFixed(0).padStart(4)} KB ${src === legacy ? '(legacy v2 source)' : ''}`);
}

console.log(`\nTotal: ${(totalIn / 1048576).toFixed(1)} MB -> ${(totalOut / 1048576).toFixed(1)} MB`);
if (fromLegacy.length) console.log(`Converted from legacy v2 art (regenerate when you can): ${fromLegacy.join(', ')}`);
if (missing.length) console.log(`NO SOURCE FOUND (will 404 in the app if used): ${missing.join(', ')}`);
console.log('\nNext: git add src/App.jsx public/scenes/*.webp scripts/ && git rm public/scenes/*.png');
