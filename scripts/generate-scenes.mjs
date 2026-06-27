// generate-scenes.mjs — batch scene-image generation via Gemini API
// Usage (Git Bash, repo root):
//   export GEMINI_API_KEY="your-key-here"        # aistudio.google.com -> Get API key
//   node scripts/generate-scenes.mjs              # all pending images
//   node scripts/generate-scenes.mjs desk-call    # one specific image
//   node scripts/generate-scenes.mjs --tier 2     # one tier only
//
// Requires: Node 18+. No npm installs.
// Reads:    scripts/scene-prompts.json + the two approved reference images,
//           which must already be in scenes-raw/ as desk-working.png and
//           boardroom-crisis.png (copy your approved downloads there first).
// Writes:   scenes-raw/{filename}.png  (full-size masters — NOT committed)
// Resumable: skips any file that already exists in scenes-raw/.
// Cost:     Nano Banana Pro is a paid API model (~US$0.10–0.25/image;
//           the full run is a few dollars). API key needs billing enabled.
// NOTE:     If the API rejects the request shape (400), open AI Studio,
//           select Nano Banana Pro, click "Get code", and align the payload —
//           Google occasionally renames fields on preview models.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const MODEL = 'gemini-3-pro-image'; // Nano Banana Pro (from AI Studio model card)
const API = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('Set GEMINI_API_KEY first: export GEMINI_API_KEY="..."'); process.exit(1); }

const manifest = JSON.parse(readFileSync('scripts/scene-prompts.json', 'utf8'));
mkdirSync('scenes-raw', { recursive: true });

// Filters: a filename arg, or --tier N
const args = process.argv.slice(2);
const tierFlag = args.indexOf('--tier');
const tierFilter = tierFlag >= 0 ? Number(args[tierFlag + 1]) : null;
const nameFilter = args.filter(a => !a.startsWith('--') && a !== String(tierFilter));

const refs = {};
for (const r of ['desk-working', 'boardroom-crisis']) {
  const p = `scenes-raw/${r}.png`;
  if (!existsSync(p)) { console.error(`Missing reference: ${p} — copy your approved ${r}.png into scenes-raw/ first.`); process.exit(1); }
  refs[r] = readFileSync(p).toString('base64');
}

const queue = manifest.images.filter(img =>
  (tierFilter === null || img.tier === tierFilter) &&
  (nameFilter.length === 0 || nameFilter.includes(img.filename)) &&
  !existsSync(`scenes-raw/${img.filename}.png`)
);
console.log(`${queue.length} image(s) to generate.\n`);

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const img of queue) {
  const preamble = img.preamble === 'people' ? manifest.style_preamble_people : manifest.style_preamble_desk;
  const prompt = `${preamble} The scene: ${img.scene} ${manifest.closing}`;
  const body = {
    contents: [{ parts: [
      { inline_data: { mime_type: 'image/png', data: refs[img.reference] } },
      { text: prompt }
    ]}],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: '16:9' }
    }
  };

  process.stdout.write(`[tier ${img.tier}] ${img.filename} ... `);
  let saved = false;
  for (let attempt = 1; attempt <= 2 && !saved; attempt++) {
    try {
      const res = await fetch(`${API}?key=${KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      const data = await res.json();
      const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData || p.inline_data);
      const b64 = part?.inlineData?.data || part?.inline_data?.data;
      if (!b64) throw new Error('No image in response: ' + JSON.stringify(data).slice(0, 300));
      writeFileSync(`scenes-raw/${img.filename}.png`, Buffer.from(b64, 'base64'));
      console.log('saved');
      saved = true;
    } catch (e) {
      console.log(`attempt ${attempt} failed — ${e.message}`);
      if (attempt === 2) console.log(`  SKIPPED ${img.filename} — re-run the script or generate manually in AI Studio.`);
      else await sleep(5000);
    }
  }
  await sleep(3000); // be polite to rate limits
}
console.log('\nDone. Now eyeball every image in scenes-raw/ against the QA check, re-roll failures (delete the file and re-run), then run: node scripts/optimize-scenes.mjs');
