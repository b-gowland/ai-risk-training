// Node test for src/utils/scorm.js — mocks API_1484_11 and asserts call order.
// Run: node scripts/test-scorm.mjs
import { scormInit, scormComplete, scormTerminate, _setApiForTests } from '../src/utils/scorm.js';

const calls = [];
const store = {};
const mock = {
  Initialize: () => { calls.push('Initialize'); return 'true'; },
  Terminate:  () => { calls.push('Terminate'); return 'true'; },
  SetValue:   (el, v) => { calls.push(`Set ${el}=${v}`); store[el] = v; return 'true'; },
  GetValue:   (el) => store[el] ?? '',
  Commit:     () => { calls.push('Commit'); return 'true'; },
};

_setApiForTests(mock);

let failures = 0;
const assert = (cond, msg) => { if (!cond) { failures++; console.error('FAIL:', msg); } };

assert(scormInit() === true, 'init returns true with API present');
assert(store['cmi.completion_status'] === 'incomplete', 'attempt opens incomplete');

scormComplete({ scenarioId: 'f2-shadow-ai', outcomeId: 'outcome_good', tone: 'good', persona: 'bu', score: 86 });
assert(store['cmi.completion_status'] === 'completed', 'completed set');
assert(store['cmi.score.raw'] === '86', 'raw score set');
assert(store['cmi.score.scaled'] === '0.8600', 'scaled score set');
assert(store['cmi.success_status'] === 'passed', '86 >= 70 → passed');
const crumb = JSON.parse(store['cmi.suspend_data']);
assert(crumb.scenarioId === 'f2-shadow-ai' && crumb.outcomeId === 'outcome_good', 'breadcrumb recorded');

scormComplete({ scenarioId: 'x', outcomeId: 'outcome_bad', tone: 'bad', persona: 'bu', score: 45 });
assert(store['cmi.success_status'] === 'failed', '45 < 70 → failed');

scormTerminate();
scormTerminate(); // idempotent
assert(calls.filter(c => c === 'Terminate').length === 1, 'Terminate exactly once');
assert(calls[0] === 'Initialize', 'Initialize first');
assert(calls[calls.length - 1] === 'Terminate', 'Terminate last');

// No-API path must be silent.
_setApiForTests(null);
assert(scormInit() === false, 'init returns false without API');
scormComplete({ scenarioId: 'x', outcomeId: 'o', tone: 'good', persona: 'bu', score: 90 }); // must not throw
scormTerminate(); // must not throw

console.log(failures === 0 ? `PASS — ${calls.length} API calls, sequence correct` : `${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
