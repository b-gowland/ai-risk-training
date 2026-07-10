# SCORM export (v0 — spike)

Package any single practitioner scenario as a **SCORM 2004 (3rd Edition)**
zip that uploads to an LMS, launches the scenario, and reports completion,
score, and pass/fail back to the LMS. Open-source contribution — works for
any user of this repo, no commercial wrapper required.

## Usage

```bash
npm run test:scorm                       # adapter unit test (mock LMS API)
npm run build:scorm -- f2-shadow-ai "Fork — Shadow AI (F2)"
# → dist-scorm/fork-f2-shadow-ai-scorm2004.zip
```

Any scenario id from `src/scenarios/index.js` works.

## What the package reports

| SCORM element | Value |
|---|---|
| `cmi.completion_status` | `incomplete` on launch → `completed` at outcome |
| `cmi.score.raw` / `.scaled` | the outcome's authored `score` (0–100 / 0–1) |
| `cmi.success_status` | `passed` if score ≥ 70, else `failed` |
| `cmi.suspend_data` | JSON breadcrumb: scenario, outcome, tone, persona, score (v1 schema) |

The 70 threshold matches the programme documentation. Ratings are
deterministic — identical choices always produce identical records.

## How it works

- `src/utils/scorm.js` — adapter. Discovers `API_1484_11` in the window
  chain (depth-limited, cross-origin-safe). **No-ops entirely when no LMS
  API is present**, so the same code ships in the web deploy unchanged.
- `src/App.jsx` — two additive hooks: init/terminate lifecycle on mount,
  and a `scormComplete()` call inside the existing completion effect.
- `scripts/build-scorm.mjs` — builds with `--base=./` (location-independent
  assets), **sets `VITE_LMS_BUILD=1` which compiles all Plausible analytics
  to no-ops** (verified: the tracker is tree-shaken out of the LMS bundle;
  LMS packages transmit nothing), strips the analytics script tag, writes
  the launch redirect + `imsmanifest.xml`, zips.

## Verification protocol (before showing any buyer)

1. `npm run test:scorm` — green.
2. Upload the zip to **SCORM Cloud** (free tier): launch, play one good
   path and one poor path, confirm completion + score + success arrive;
   check the browser network tab shows **no third-party calls** except
   Google Fonts.
3. Repeat on a Moodle sandbox. Track per-platform results; "SCORM-
   compliant" LMSs differ in practice.

## Known limits (deliberate v0 scope)

- **SCORM 2004 only.** SCORM 1.2 caps `suspend_data` at 4,096 chars —
  unsafe to assume for branching state. A reduced-state 1.2 profile is a
  later increment, not an accident waiting to happen.
- **No mid-scenario resume yet.** `suspend_data` is written at outcome
  only. Resume-from-node is the next adapter increment.
- **Full app bundle in every package** (~6 MB incl. all scene images).
  Per-scenario asset slimming is a later packaging increment.
- Google Fonts loads from CDN (graceful fallback offline). The packaged
  Privacy page still describes the web deploy's analytics; swap-in copy
  for LMS builds is a later increment.
- cmi5/xAPI variant (decision-level statements) is the strategic next
  layer — see the product BRS.
