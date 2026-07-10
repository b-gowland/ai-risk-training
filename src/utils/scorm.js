// SCORM 2004 (4th Ed. API, "API_1484_11") adapter for the Fork training app.
//
// Design contract:
//  - Zero behaviour change outside an LMS: every function silently no-ops when
//    no SCORM API is found in the window chain (standalone/static hosting).
//  - One-way reporting for v0: Initialize on load, completion/score/success at
//    outcome, a suspend_data breadcrumb at outcome, Terminate on pagehide.
//    (Full mid-scenario resume is a documented later increment — see
//    tools/scorm/README.md.)
//  - SCORM 2004 only. A SCORM 1.2 profile is deliberately not provided yet:
//    1.2 caps suspend_data at 4,096 chars, which cannot be assumed safe for
//    branching state. See tools/scorm/README.md.

const FIND_DEPTH = 10;

let api = null;
let initialized = false;
let terminated = false;

function searchChain(win) {
  let w = win;
  for (let i = 0; i < FIND_DEPTH && w; i++) {
    try {
      if (w.API_1484_11) return w.API_1484_11;
    } catch {
      // cross-origin frame — stop climbing this chain
      return null;
    }
    if (w.parent && w.parent !== w) { w = w.parent; continue; }
    break;
  }
  return null;
}

function findAPI() {
  if (typeof window === 'undefined') return null;
  return searchChain(window) ||
    (window.opener ? searchChain(window.opener) : null);
}

/** True when running inside a SCORM 2004 LMS launch. */
export function scormAvailable() {
  if (api) return true;
  api = findAPI();
  return !!api;
}

function set(el, value) {
  try { api.SetValue(el, String(value)); } catch { /* keep going */ }
}

/** Call once on app mount. Safe to call when not in an LMS. */
export function scormInit() {
  if (initialized || !scormAvailable()) return false;
  try {
    if (api.Initialize('') === 'false') return false;
  } catch {
    return false;
  }
  initialized = true;
  // Mark the attempt open; the LMS records "incomplete" until an outcome.
  set('cmi.completion_status', 'incomplete');
  set('cmi.exit', 'suspend');
  try { api.Commit(''); } catch { /* non-fatal */ }
  return true;
}

/**
 * Report a finished scenario run. Called from the existing completion effect.
 * score: 0–100 (outcome.score). Pass threshold 70 (matches programme docs).
 */
export function scormComplete({ scenarioId, outcomeId, tone, persona, score }) {
  if (!initialized || terminated) return;
  const raw = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : null;
  set('cmi.completion_status', 'completed');
  if (raw !== null) {
    set('cmi.score.min', 0);
    set('cmi.score.max', 100);
    set('cmi.score.raw', raw);
    set('cmi.score.scaled', (raw / 100).toFixed(4));
    set('cmi.success_status', raw >= 70 ? 'passed' : 'failed');
  }
  // Evidence breadcrumb — versioned, replayable against scenario content.
  const crumb = JSON.stringify({ v: 1, scenarioId, outcomeId, tone, persona, score: raw });
  if (crumb.length <= 60000) set('cmi.suspend_data', crumb); // 2004 limit 64k
  set('cmi.exit', 'normal');
  try { api.Commit(''); } catch { /* non-fatal */ }
}

/** Terminate cleanly. Wired to pagehide; idempotent. */
export function scormTerminate() {
  if (!initialized || terminated) return;
  terminated = true;
  try { api.Commit(''); } catch { /* non-fatal */ }
  try { api.Terminate(''); } catch { /* non-fatal */ }
}

/** Test hook: inject a mock API (node/jsdom tests only). */
export function _setApiForTests(mock) {
  api = mock;
  initialized = false;
  terminated = false;
}
