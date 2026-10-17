#!/usr/bin/env node
// render-og.mjs — regenerate public/og.png, the homepage's share image.
//
// It is a screenshot of the real homepage from the real build, at the
// 1200×630 size link previews use, in the site's own fonts and colours. Run
// it after a change to the homepage or the featured pair, so a LinkedIn or
// Slack preview shows what the site actually says. The image used to be a
// one-off capture that nobody could reproduce.
//
//   npm run build && npm run og
//
// Needs Playwright with Chromium (not a project dependency: install it
// with `npx playwright install chromium`, or point PLAYWRIGHT_MODULE at an
// existing install). Behind a proxy, set HTTPS_PROXY; if the proxy
// re-signs TLS, also set OG_IGNORE_TLS=1. The script refuses to write the
// image if the web fonts did not load, rather than saving a fallback-font
// screenshot over the real one.

import { preview } from 'vite';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public', 'og.png');
const WIDTH = 1200, HEIGHT = 630;
// Captured as a 1920-wide desktop window (same 1.9:1 shape), then scaled
// down: at 1200 wide the door tiles are cut off mid-sentence.
const SCALE = 1.6;

if (!existsSync(join(ROOT, 'dist', 'index.html'))) {
  console.error('No dist/. Run `npm run build` first.');
  process.exit(1);
}

const mod = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(mod ? pathToFileURL(mod).href : 'playwright');

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'error' });
const url = server.resolvedUrls.local[0];
// Behind a proxy, send only https (the fonts) through it: the preview server
// is plain http on loopback, which Playwright's own proxy option would route
// through the proxy too.
const browser = await chromium.launch(process.env.HTTPS_PROXY
  ? { args: [`--proxy-server=https=${new URL(process.env.HTTPS_PROXY).host}`] }
  : {});
try {
  const page = await browser.newPage({
    viewport: { width: Math.round(WIDTH * SCALE), height: Math.round(HEIGHT * SCALE) },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: process.env.OG_IGNORE_TLS === '1',
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // A font that was never declared also "checks" true, so look for faces
  // that actually loaded, and for the homepage itself.
  const loaded = await page.evaluate(() => [...document.fonts]
    .filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
  const missing = ['Archivo Black', 'Archivo', 'Newsreader'].filter((f) => !loaded.includes(f));
  const isHome = await page.locator('a[href="#/scenario/home-voice-clone"], a[href*="/scenario/"]').count();
  if (!isHome) {
    console.error(`${url} did not serve the homepage. Not overwriting ${OUT}.`);
    process.exitCode = 1;
  } else if (missing.length) {
    console.error(`Web fonts did not load (${missing.join(', ')}). Not overwriting ${OUT}.`);
    process.exitCode = 1;
  } else {
    const png = await page.screenshot();
    await sharp(png).resize(WIDTH, HEIGHT).png({ compressionLevel: 9 }).toFile(OUT);
    console.log(`Wrote ${OUT} (${WIDTH}×${HEIGHT}) from ${url}`);
  }
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
