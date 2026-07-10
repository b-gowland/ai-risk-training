#!/usr/bin/env node
// Build a single-scenario SCORM 2004 (3rd Ed.) package from the app.
//
// Usage:   node scripts/build-scorm.mjs <scenario-id> ["Package Title"]
// Example: node scripts/build-scorm.mjs f2-shadow-ai "Fork — Shadow AI (F2)"
//
// Output:  dist-scorm/fork-<scenario-id>-scorm2004.zip
//
// How it works:
//  1. `vite build --base=./` so every asset resolves relative to the zip root
//     (packages must be location-independent inside an LMS).
//  2. A launch page (index_lms.html) does location.replace() into the app's
//     hash route for the scenario. replace() keeps the same window, so the
//     app's SCORM API discovery still sees the LMS frame chain.
//  3. imsmanifest.xml declares one SCO whose href is the launch page.
//
// Requires: zip (falls back to python zipfile if missing).

import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const scenarioId = process.argv[2];
if (!scenarioId) {
  console.error('Usage: node scripts/build-scorm.mjs <scenario-id> ["Package Title"]');
  process.exit(1);
}
const title = process.argv[3] || `Fork scenario — ${scenarioId}`;
const root = process.cwd();
const stage = join(root, 'dist-scorm', 'stage');
const outDir = join(root, 'dist-scorm');
const zipName = `fork-${scenarioId}-scorm2004.zip`;

console.log(`[1/4] vite build (relative base, analytics disabled) …`);
execSync('npx vite build --base=./', {
  stdio: 'inherit', cwd: root,
  env: { ...process.env, VITE_LMS_BUILD: '1' },
});

console.log('[2/4] staging package …');
rmSync(join(root, 'dist-scorm'), { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
cpSync(join(root, 'dist'), stage, { recursive: true });

// LMS packages must not phone home: strip the Plausible analytics script.
// (Web-deploy builds are untouched — this edit is stage-only.)
{
  const idx = join(stage, 'index.html');
  const { readFileSync } = await import('node:fs');
  const html = readFileSync(idx, 'utf8')
    .replace(/\s*<script[^>]*plausible\.io[^>]*><\/script>/g, '');
  writeFileSync(idx, html);
}

// Launch page: same-window redirect into the scenario route.
writeFileSync(join(stage, 'index_lms.html'), `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeXml(title)}</title></head>
<body><script>location.replace('./index.html#/scenario/${scenarioId}');</script>
<noscript>This module requires JavaScript. Open index.html#/scenario/${scenarioId}</noscript>
</body></html>
`);

// File list for the manifest resource (LMSs vary in strictness; list everything).
function listFiles(dir, base) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listFiles(p, base));
    else out.push(relative(base, p).split('\\').join('/'));
  }
  return out;
}
const files = listFiles(stage, stage);

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

console.log('[3/4] writing imsmanifest.xml …');
const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="org.airiskpractice.fork.${scenarioId}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
    http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
    http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
    http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
    http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 3rd Edition</schemaversion>
  </metadata>
  <organizations default="ORG-fork">
    <organization identifier="ORG-fork">
      <title>${escapeXml(title)}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>${escapeXml(title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormType="sco" href="index_lms.html">
${files.map(f => `      <file href="${escapeXml(f)}"/>`).join('\n')}
    </resource>
  </resources>
</manifest>
`;
writeFileSync(join(stage, 'imsmanifest.xml'), manifest);

console.log('[4/4] zipping …');
try {
  execSync(`cd "${stage}" && zip -qr "../${zipName}" .`, { stdio: 'inherit', shell: '/bin/bash' });
} catch {
  execSync(`python3 -c "import shutil; shutil.make_archive(r'${join(outDir, zipName.replace(/\.zip$/, ''))}', 'zip', r'${stage}')"`,
    { stdio: 'inherit' });
}
rmSync(stage, { recursive: true, force: true });
console.log(`\nDone → dist-scorm/${zipName}`);
console.log('Verify on SCORM Cloud (free tier) before any LMS demo.');
