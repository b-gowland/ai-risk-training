#!/usr/bin/env node
// indexnow.mjs — tell Bing (and Yandex, Seznam, Naver) that the site changed.
//
// IndexNow lets a site announce changed URLs instead of waiting to be
// re-crawled. Bing's index also feeds ChatGPT search and Copilot, so this is
// the quickest way for a content change to reach AI answers. Google does not
// use IndexNow; it reads sitemap.xml (submit that once in Search Console).
//
// Runs after each deploy to main (.github/workflows/deploy.yml). It reads the
// live sitemap, so it announces exactly what is published. The key is not a
// secret: IndexNow proves ownership by fetching it from the site itself
// (public/<key>.txt).
//
//   node scripts/indexnow.mjs            announce every URL in the sitemap
//   node scripts/indexnow.mjs --dry-run  print what would be sent

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://app.airiskpractice.org';
const keyFile = readdirSync(join(process.cwd(), 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file (public/<32 hex>.txt). Nothing sent.');
  process.exit(1);
}
const key = readFileSync(join(process.cwd(), 'public', keyFile), 'utf8').trim();
if (`${key}.txt` !== keyFile) {
  console.error(`public/${keyFile} must contain exactly its own name without .txt. Nothing sent.`);
  process.exit(1);
}

const res = await fetch(`${SITE}/sitemap.xml`);
if (!res.ok) {
  console.error(`Could not fetch the live sitemap (${res.status}). Nothing sent.`);
  process.exit(1);
}
const urlList = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const body = { host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList };

if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

const sent = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});
// 200 and 202 both mean accepted. Anything else is reported, not fatal: a
// failed announcement only means waiting for the next crawl.
console.log(`IndexNow: ${sent.status} for ${urlList.length} URLs`);
if (![200, 202].includes(sent.status)) console.log(await sent.text());
