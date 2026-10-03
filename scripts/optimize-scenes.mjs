// optimize-scenes.mjs — convert scene images to the WebP the app ships.
//
// Drop full-size PNG or JPG sources into scenes-raw/ (gitignored), named by
// scene key, then run from the repo root:
//
//   node scripts/optimize-scenes.mjs
//
// Each scenes-raw/<key>.png|jpg becomes public/scenes/<key>.webp, 1400px
// wide at quality 80. Reference the key from a scenario's `scene` or
// `doorScene` field; `npm run audit` fails if the file is missing.

import { readdirSync, existsSync, statSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'scenes-raw';
if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ folder. Put source images in ${SRC}/<scene-key>.png and re-run.`);
  process.exit(1);
}

const sources = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (!sources.length) {
  console.error(`${SRC}/ has no .png or .jpg files.`);
  process.exit(1);
}

let totalIn = 0, totalOut = 0;
for (const file of sources) {
  const key = file.replace(/\.(png|jpe?g)$/i, '');
  const inBytes = statSync(`${SRC}/${file}`).size;
  const info = await sharp(`${SRC}/${file}`)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`public/scenes/${key}.webp`);
  totalIn += inBytes; totalOut += info.size;
  console.log(`${key.padEnd(26)} ${(inBytes / 1048576).toFixed(2).padStart(6)} MB -> ${(info.size / 1024).toFixed(0).padStart(4)} KB`);
}
console.log(`\nTotal: ${(totalIn / 1048576).toFixed(1)} MB -> ${(totalOut / 1048576).toFixed(1)} MB`);
