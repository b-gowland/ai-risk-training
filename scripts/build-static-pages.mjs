#!/usr/bin/env node
/**
 * build-static-pages.mjs — SEO/AIO item 10.
 *
 * The app is a client-rendered HashRouter SPA: a crawler that doesn't run
 * JavaScript sees an empty <div id="root">. Rather than migrate the router
 * (rejected 20 Sep — it breaks 32 KB deep links, cached share URLs, and the
 * retired-route redirects), this script writes plain, real-path HTML pages
 * into dist/ after `vite build`, generated from the live scenario registry
 * so they cannot drift from the app:
 *
 *   dist/scenarios/index.html        — both doors, all nine, with links
 *   dist/scenarios/<id>/index.html   — one per scenario (× 9)
 *   dist/cards/index.html            — what the discussion cards are
 *   dist/sitemap.xml                 — replaces vite-plugin-sitemap's
 *                                       one-URL sitemap
 *
 * It also fills the empty #root in dist/index.html with the same nine links,
 * so the SPA's actual entry point isn't blank either. createRoot() replaces
 * this markup on mount; it is a crawler fallback, not a hydration target.
 *
 * DECIDED 20 Sep (Ben): static scenario pages show the tell only. They never
 * show consequences, the debrief frame, or recall notes — those are the
 * app's own content and stay behind play. cards.test.jsx-style assertions
 * for this live in src/__tests__/static-pages.test.js and check the built
 * output directly, since this script runs after the app's own test suite.
 */

import { createServer } from 'vite';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const SITE = 'https://app.airiskpractice.org';

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `vite build` before this script.');
  process.exit(1);
}

// Load the live registry through Vite so `import.meta.glob` in
// scenarios/index.js resolves as it does in the real app. A plain `node
// --import` of that file throws — this is not optional plumbing.
const server = await createServer({
  configFile: false,
  root: ROOT,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { scenarios } = await server.ssrLoadModule('/src/scenarios/index.js');
await server.close();

const DOOR = { home: 'At home', work: 'At work' };
const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ── Shared chrome ────────────────────────────────────────────────────
// Minimal, inline, on-brand (§6: case-file register — hairlines, one
// amber accent, Archivo for chrome, Newsreader for narrative prose). No
// build-hash CSS dependency, so this can't break on an unrelated asset
// rename.
const STYLE = `
:root{--ground:#fbf8f2;--ink:#1c1a16;--ink-soft:#4f4a41;--ink-faint:#837c70;
--rule:#ded8ca;--rule-firm:#bdb6a8;--door-home:#d4855f;--door-work:#93a8a0;
--amber:#b0512b;--amber-deep:#8a3d1f;
--display:'Archivo',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
--heavy:'Archivo Black','Archivo',sans-serif;
--serif:'Newsreader','Iowan Old Style',Georgia,serif;}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--display);
-webkit-font-smoothing:antialiased}
a{color:var(--amber-deep)}
header.bar{display:flex;justify-content:space-between;align-items:center;gap:1rem;
padding:.9rem 1rem;background:var(--ink);color:#fff}
header.bar a{color:#fff;text-decoration:none;font-family:var(--heavy);font-size:.875rem;
letter-spacing:.01em;text-transform:uppercase}
header.bar span{font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;opacity:.75}
main{max-width:44rem;margin:0 auto;padding:2rem 1rem 3rem}
main.wide{max-width:60rem}
h1{font-family:var(--heavy);font-weight:400;font-size:clamp(2rem,7vw,3rem);line-height:.95;
letter-spacing:-.03em;text-transform:uppercase;margin:0 0 1rem}
h2{font-family:var(--heavy);font-weight:400;font-size:1.4rem;letter-spacing:-.02em;
text-transform:uppercase;border-bottom:3px solid var(--ink);padding-bottom:.5rem;
margin:2rem 0 1rem}
p{font-family:var(--serif);font-size:1.0625rem;line-height:1.55;margin:0 0 1rem;max-width:38rem}
.tell{font-family:var(--serif);font-size:1.2rem;line-height:1.4;font-weight:500;
padding-left:.9rem;border-left:4px solid var(--amber);margin:1.5rem 0}
.meta{font-size:.8rem;color:var(--ink-faint);text-transform:uppercase;letter-spacing:.08em;
margin:0 0 .5rem}
.actions{display:flex;flex-wrap:wrap;gap:.75rem;margin:1.5rem 0}
.btn{display:inline-block;font-family:var(--display);font-weight:600;font-size:.9rem;
padding:.65rem 1.1rem;text-decoration:none;border:2px solid var(--ink);color:var(--ink)}
.btn.primary{background:var(--amber);border-color:var(--amber);color:#fff}
.rows{list-style:none;margin:0;padding:0}
.rows li{border-bottom:1px solid var(--rule);padding:.9rem 0}
.rows a{display:flex;justify-content:space-between;gap:1rem;text-decoration:none;color:var(--ink);
font-family:var(--display);font-weight:500;font-size:1.0625rem}
.rows .door{flex-shrink:0;font-size:.75rem;color:var(--ink-faint);text-transform:uppercase}
.doorlabel{display:inline-block;font-family:var(--heavy);font-size:.75rem;letter-spacing:.1em;
text-transform:uppercase;padding:.2rem .6rem;margin-bottom:.75rem;color:#fff}
.doorlabel.home{background:var(--door-home)}
.doorlabel.work{background:var(--door-work)}
footer{margin-top:3rem;padding:1.5rem 1rem;background:var(--ink);color:#fff;font-size:.8rem}
footer a{color:#fff}
`.trim();

const HEAD = ({ title, description, canonical, jsonLd }) => `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:image" content="${SITE}/og.png" />
<meta property="og:site_name" content="AI Risk Practice" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${SITE}/og.png" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>${STYLE}</style>`;

const CHROME_HEAD = `<header class="bar"><a href="/">AI Risk Practice</a><span>Free · No login</span></header>`;
const CHROME_FOOT = `<footer><p style="max-width:none;font-family:var(--display);margin:0">
AI Risk Practice · Not legal or security advice ·
<a href="https://github.com/b-gowland/ai-risk-training">Source</a></p></footer>`;

const page = ({ head, body }) => `<!doctype html>
<html lang="en">
<head>
${head}
</head>
<body>
${CHROME_HEAD}
${body}
${CHROME_FOOT}
</body>
</html>
`;

// ── /scenarios/ ──────────────────────────────────────────────────────

function scenarioRows(door) {
  return scenarios
    .filter((s) => s.door === door)
    .map(
      (s) => `<li><a href="/scenarios/${s.id}/"><span>${esc(s.shelfLine)}</span>
<span class="door">${DOOR[s.door]}</span></a></li>`
    )
    .join('\n');
}

const scenariosIndexHtml = page({
  head: HEAD({
    title: 'All nine situations — AI Risk Practice',
    description:
      'Nine short, specific situations about AI going wrong — at home and at work. Free, no login, nothing to install.',
    canonical: `${SITE}/scenarios/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: scenarios.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/scenarios/${s.id}/`,
        name: s.title,
      })),
    },
  }),
  body: `<main class="wide">
<h1>All nine situations</h1>
<p>Short, specific situations about AI going wrong — at home and at work. You make the calls
with incomplete information, then see what followed. Nothing is scored. Pick whichever one
sounds most like your week.</p>
<h2>At home</h2>
<ul class="rows">${scenarioRows('home')}</ul>
<h2>At work</h2>
<ul class="rows">${scenarioRows('work')}</ul>
<div class="actions"><a class="btn" href="/cards/">Discussion cards for a group</a></div>
</main>`,
});

mkdirSync(join(DIST, 'scenarios'), { recursive: true });
writeFileSync(join(DIST, 'scenarios', 'index.html'), scenariosIndexHtml);

// ── /scenarios/<id>/ ─────────────────────────────────────────────────
// Tell only (Ben, 20 Sep) — never consequences, debrief frame, or recall.

for (const s of scenarios) {
  const time = s.door === 'home' ? 'About five minutes.' : 'About eight to ten minutes.';
  const canWhat = `<p><span class="meta">What you can do</span><br>${esc(s.authority)}</p>`;
  const standing = s.standing ? `<p><span class="meta">You are</span><br>${esc(s.standing)}</p>` : '';

  const body = `<main>
<span class="doorlabel ${s.door}">${DOOR[s.door]}</span>
<h1>${esc(s.title)}</h1>
${s.coldOpen.map((t) => `<p>${esc(t)}</p>`).join('\n')}
${standing}
${canWhat}
<p class="tell">${esc(s.tell)}</p>
<p class="meta">${time} No login. Nothing scored.</p>
<div class="actions">
<a class="btn primary" href="/#/scenario/${s.id}">Play the full scenario</a>
<a class="btn" href="/cards/?s=${s.id}">Print discussion cards</a>
${s.kb_url ? `<a class="btn" href="${s.kb_url}">Read the reference entry</a>` : ''}
</div>
</main>`;

  const html = page({
    head: HEAD({
      title: `${s.title} — AI Risk Practice`,
      description: s.shelfLine,
      canonical: `${SITE}/scenarios/${s.id}/`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: s.title,
        description: s.shelfLine,
        url: `${SITE}/scenarios/${s.id}/`,
        isAccessibleForFree: true,
        inLanguage: 'en',
        learningResourceType: 'Interactive scenario',
        educationalLevel: 'Beginner',
        timeRequired: s.door === 'home' ? 'PT5M' : 'PT10M',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        publisher: { '@type': 'Organization', name: 'AI Risk Practice', url: SITE },
      },
    }),
    body,
  });

  const dir = join(DIST, 'scenarios', s.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// ── /cards/ ──────────────────────────────────────────────────────────

const cardsHtml = page({
  head: HEAD({
    title: 'Discussion cards — AI Risk Practice',
    description:
      'Every situation also comes as eight printable cards for a table of three to six people — at work, in a class, or at a community session.',
    canonical: `${SITE}/cards/`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'AI Risk Practice discussion cards',
      description: 'Printable discussion cards for facilitated group sessions.',
      isAccessibleForFree: true,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      publisher: { '@type': 'Organization', name: 'AI Risk Practice', url: SITE },
    },
  }),
  body: `<main>
<h1>Discussion cards</h1>
<p>Every situation also comes as eight printable cards, for a table of three to six people
at work, in a class or at a community session. The group reads the situation, looks at the
evidence, and everyone makes the call privately before anyone argues. Then the face-down
cards come over.</p>
<h2>Running a table</h2>
<p>About twenty-five minutes per scenario. The facilitator does not need to know the
answer — the cards carry the reasoning. Deal the deck in order; cards 4, 5 and 7 stay face
down until the group has answered the card before them. Everyone chooses privately on
card 3 before anyone discusses it.</p>
<p>Print single-sided on A4, at actual size, and cut along the dashed lines. Two sheets per
scenario, plus one facilitator sheet at the end of every print job.</p>
<div class="actions"><a class="btn primary" href="/#/cards">Open the printable cards</a></div>
</main>`,
});

mkdirSync(join(DIST, 'cards'), { recursive: true });
writeFileSync(join(DIST, 'cards', 'index.html'), cardsHtml);

// ── sitemap.xml — replaces vite-plugin-sitemap's single-URL output ────

const urls = [
  '/',
  '/scenarios/',
  ...scenarios.map((s) => `/scenarios/${s.id}/`),
  '/cards/',
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

// ── Fill the empty #root fallback in dist/index.html ───────────────────
// createRoot() replaces this on mount; it exists only for a crawler or a
// browser with JS disabled. Same nine links as the React homepage — not a
// different, second copy of the product's content.

const indexPath = join(DIST, 'index.html');
let indexHtml = readFileSync(indexPath, 'utf8');

if (!indexHtml.includes('<div id="root"></div>')) {
  console.error('dist/index.html: expected an empty <div id="root"></div> — found something else. Aborting the #root fallback to avoid clobbering unknown content.');
  process.exit(1);
}

const fallback = `<div id="root"><main class="wide">
<h1>What would you do?</h1>
<p>Short, specific situations about AI going wrong — at home and at work. You make the
calls with incomplete information, then see what followed. Free, no login, nothing to
install.</p>
<h2>At home</h2>
<ul class="rows">${scenarioRows('home')}</ul>
<h2>At work</h2>
<ul class="rows">${scenarioRows('work')}</ul>
<div class="actions"><a class="btn" href="/cards/">Discussion cards for a group</a></div>
</main></div>
<style>${STYLE}</style>`;

indexHtml = indexHtml.replace('<div id="root"></div>', fallback);

// Target the call alone, not the surrounding <script> block. The block
// spans a newline, and a checkout with CRLF line endings (the default on
// Windows, where this repo is worked on in Git Bash) silently fails to
// match a literal '\n' — replace() finds nothing and returns the string
// unchanged, with no error. A single-line match has no line ending to get
// wrong. Confirmed 20 Sep against a CRLF-converted copy of this exact file.
if (indexHtml.includes('hashBasedRouting')) {
  // Already applied — running the script twice without an intervening
  // `vite build` shouldn't double up or throw.
} else if (indexHtml.includes('plausible.init()')) {
  indexHtml = indexHtml.replace('plausible.init()', 'plausible.init({ hashBasedRouting: true })');
} else {
  console.error("dist/index.html: expected a bare 'plausible.init()' call — the Plausible snippet has changed shape. Aborting the hashBasedRouting fix rather than silently skipping it.");
  process.exit(1);
}

if (!indexHtml.includes('rel="canonical"')) {
  indexHtml = indexHtml.replace(
    '<meta property="og:type"',
    `<link rel="canonical" href="${SITE}/" />\n    <meta property="og:type"`
  );
}
if (!indexHtml.includes('application/ld+json')) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'AI Risk Practice',
        url: `${SITE}/`,
        publisher: { '@id': `${SITE}/#org` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE}/#org`,
        name: 'AI Risk Practice',
        url: 'https://airiskpractice.org',
        logo: `${SITE}/og.png`,
      },
    ],
  };
  indexHtml = indexHtml.replace(
    '</head>',
    `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
  );
}

writeFileSync(indexPath, indexHtml);

console.log(`Static pages written: /scenarios/ (×${scenarios.length + 1}), /cards/, sitemap.xml (${urls.length} URLs), #root fallback filled.`);
