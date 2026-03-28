# QA Review — F2 Shadow AI
**Last updated:** March 2026  
**Status:** All P1 issues resolved. Browser testing required before publishing.

---

## What this document is

The formal review record for F2. It captures issues found, fixes applied, and the reasoning behind the QA framework structure. Future scenario reviews follow the same structure.

---

## QA framework overview

The audit runs in four layers. Each layer targets a different failure mode.

| Layer | What it catches | How it runs |
|---|---|---|
| 1 — Data integrity | Broken branch refs, missing outcomes, invalid fields | Automated — `qa-audit.js` |
| 2 — Path completeness | Every persona reaching a valid outcome | Automated — `qa-audit.js` |
| 3 — Content quality | Dangling refs, tone, length, fourth-wall breaks | Automated — `qa-audit.js` |
| 4 — Transition safety | State machine edge cases that crash the browser | Automated checks + mandatory browser tests |

**Critical limitation of automated testing:**  
Layers 1–4 are tested by `qa-audit.js` at the state machine level. However, React's render cycle introduces timing between state transitions that Node simulation cannot reproduce. The bug found in F2 (blank screen / error boundary triggered on feedback → outcome transition) was a React `useEffect` timing issue — it passed all automated checks but crashed in the browser. This class of bug can only be caught by manual browser testing. The browser checklist in `qa-audit.js` is mandatory before any push.

---

## How the F2 bug was found and fixed

**Symptom:** Blank screen, then "Something went wrong" error boundary, after clicking Continue on the feedback screen.

**Root cause:** After `CONTINUE_FROM_FEEDBACK`, the auto-advance `useEffect` fired immediately. At that point, `state.currentNodeId` still held a value that could be transitioning toward an outcome. The effect tried to call `getCurrentNode()` with an outcome-prefixed ID, returned `null`, and the component crashed trying to access properties on null.

**Fix applied:**
1. Added guards to the auto-advance `useEffect`: skip if `currentNodeId` is null or starts with `outcome_`
2. Added null safety to `currentNode` derivation in the render
3. Added cleanup (`clearTimeout`) to the feedback timer effect
4. Added error boundary component so future crashes show a restart prompt instead of a blank screen

**Why the automated tests missed it:**  
The simulation dispatched actions in a tight synchronous loop with no render cycle between steps. React effects fire between renders. The simulation is testing state machine logic; the browser tests component behaviour. These are different things.

**How the audit script now catches this class of bug:**  
Layer 4 verifies that every branch target reachable from a choice is a valid, fully-formed node or outcome with all required render fields. This catches the data-side of the problem. It cannot catch timing issues in the render cycle — those require browser testing.

---

## Issues log — F2

### Fixed before first push

| ID | Location | Issue | Fix applied |
|---|---|---|---|
| F2-C-001 | business_user / n3_honest / b | "It mostly does" — dangling referent | "The matter is quietly resolved — written note-to-file, no further action." |
| F2-C-002 | pm / n4_volunteer / b | Same "it mostly does" pattern | "The matter fades without much ceremony — note to file, no further action." |
| F2-C-003 | business_user / n3_lied / b | "You are now a case study" — unexplained fourth-wall break | "This is how people become cautionary tales." |
| F2-C-004 | pm / n2_lied / b | Same "case study" fourth-wall pattern | Rewritten to explain consequence directly |
| F2-C-005 | pm / n3_systemic / c | "You are now the scapegoat" — fourth-wall break | Rewritten to explain consequence directly |
| F2-C-006 | analyst / n3_escalated / b | "You are now part of the incident" | Rewritten: "A false prior claim in an active legal matter..." |
| F2-C-007 | executive / n3_good_board / b | "You are now the poster child" | Rewritten with narrative consequence |
| F2-C-008 | business_user / start / a | "You are now Priya" — references character from another persona track | Replaced with self-contained consequence |
| F2-RT-001 | All personas | Blank screen / crash on feedback → outcome transition | React useEffect guard + currentNode null safety |

### Open warnings (accepted for F2, fix in future scenarios)

| Count | Issue | Decision |
|---|---|---|
| 20 | Decision prompts written as statements not questions | Accepted for F2 — narrative style works in context. Future scenarios should use question format by default. |
| 3 | Some nodes have no 'good' choice (only poor/partial) | Accepted where dramatically appropriate (e.g. n3_lied — both choices are damage control). Document in scenario notes. |

---

## Browser testing record — F2

Complete this table before publishing each scenario. Minimum: one good path and one poor path per persona, with DevTools console open.

| Persona | Good path | Poor path | Console clean | Feedback → continue | Notes |
|---|---|---|---|---|---|
| Business User | □ | □ | □ | □ | |
| Executive | □ | □ | □ | □ | |
| PM | □ | □ | □ | □ | |
| Analyst | □ | □ | □ | □ | |

---

## Checklist for new scenarios

Copy this checklist into a new `QA_REVIEW_<id>.md` for each scenario.

### Pre-authoring
- [ ] Scenario seed reviewed from KB entry
- [ ] All four personas have distinct situations (not same story with different labels)
- [ ] Comedy consequences planned: specific, plausible, consequence-driven

### Authoring — per node
- [ ] Scene key matches a defined component in App.jsx
- [ ] Caption advances the story (not just describes the scene)
- [ ] Decision prompt is a direct question ending in `?`
- [ ] At least 3 choices per node (minimum 2)
- [ ] At least one good and one poor/partial choice per node
- [ ] Every branch target is a valid node ID or outcome ID (check spelling)
- [ ] No choice note under 8 words
- [ ] No character name referenced that only makes sense in another persona's track
- [ ] No dangling referents ("it mostly does", "as above", "same as")
- [ ] No unexplained fourth-wall breaks ("you are now X", "you are now a case study")

### Automated audit
- [ ] `node scripts/qa-audit.js <scenario-id>` exits with 0 P1 issues
- [ ] All warnings reviewed and accepted or fixed

### Browser testing (mandatory — cannot be skipped)
- [ ] Business User: good path → outcome screen loads ✓
- [ ] Business User: poor path → outcome screen loads ✓
- [ ] Executive: good path → outcome screen loads ✓
- [ ] Executive: poor path → outcome screen loads ✓
- [ ] PM: good path → outcome screen loads ✓
- [ ] PM: poor path → outcome screen loads ✓
- [ ] Analyst: good path → outcome screen loads ✓
- [ ] Analyst: poor path → outcome screen loads ✓
- [ ] DevTools console: zero uncaught errors on all paths ✓
- [ ] Continue button works immediately on feedback screen ✓
- [ ] Continue button works after 5+ second wait on feedback screen ✓
- [ ] Browser back button mid-scenario: shows error boundary (not blank screen) ✓
- [ ] Page reload mid-scenario: shows error boundary (not blank screen) ✓
- [ ] **KB link on outcome screen opens correct KB entry (not 404)** ✓
- [ ] **KB link in scenario card on homepage opens correct KB entry (not 404)** ✓

### Content sign-off
- [ ] All outcomes have result ≥25 words and learning ≥15 words
- [ ] Outcome tone matches quality (good/warn/bad)
- [ ] KB link in outcome points to correct entry
- [ ] Scenario appears correctly on homepage grid with right difficulty and persona pips

---

## Framework version history

| Version | Date | Change |
|---|---|---|
| 1.0 | March 2026 | Initial framework — Layers 1–3 only |
| 1.1 | March 2026 | Added Layer 4 (transition safety) after F2 blank screen bug. Added browser checklist. Documented React render-cycle limitation. |

---

## Additional runtime bugs found during F2 browser testing

### F2-RT-002: `scenario is not defined` on Continue click

**Symptom:** `ReferenceError: scenario is not defined` in browser console after clicking Continue on the feedback screen. Error boundary triggers. Occurred consistently after 3 choices on the Business User poor path.

**Root cause:** Two compounding issues:
1. The `App` component had a conditional `return` before `useReducer` (violated React rules of hooks). React requires hooks to be called in the same order on every render — a `return` before a hook breaks this.
2. When Vite minifies the bundle, this violation causes the `scenario` variable to fall out of scope in the `useEffect` closures that fire after renders.

**Why the first fix attempt failed:** The Python replacement script that moved `useReducer` after the early return left a duplicate stub check — the original early return was still in place before the hooks. The violation persisted.

**Fix applied:** Split `App` into two components:
- `App` — pure router, no hooks. Reads URL param, checks if scenario exists, renders error screen or `ScenarioPlayer`
- `ScenarioPlayer` — receives scenario as prop, owns all hooks with nothing before them

This is the correct React pattern for this situation. Any component that needs both conditional rendering logic AND hooks should be split this way.

**Rule to follow for all future components:**
> Never put a `return` statement before a `useReducer`, `useEffect`, `useState`, or any other hook in a React component. If you need conditional rendering based on a prop or derived value, either move the condition after all hooks, or split into a wrapper component (no hooks) and an inner component (owns hooks, receives guaranteed-valid props).

**Added to Layer 4 audit checks:** Static check that scans App.jsx for hooks-before-return pattern.

---

## Framework version history (updated)

| Version | Date | Change |
|---|---|---|
| 1.0 | March 2026 | Initial framework — Layers 1–3 only |
| 1.1 | March 2026 | Added Layer 4 (transition safety) after F2 blank screen bug |
| 1.2 | March 2026 | Added hooks-before-return static check after F2-RT-002. Added ARCHITECTURE.md. Split App into router + ScenarioPlayer pattern documented. |

---

## F2-RT-003: CONTINUE_FROM_FEEDBACK crash on null nextNodeId

**Found by:** Deep code review (first principles pass)  
**Symptom:** `Cannot read properties of undefined (reading 'startsWith')` in engine reducer  
**Root cause:** `nextNodeId` was not initialised in `createInitialState`. In certain edge cases it remained `undefined`, causing `.startsWith()` to crash when `CONTINUE_FROM_FEEDBACK` fired.  
**Fix:** `nextNodeId: null` added to initial state. Every reducer case that uses `nextNodeId` now guards with `if (!nextNodeId) return state` before calling `.startsWith()`.  
**Rule added to engine:** All state fields must be explicitly initialised in `createInitialState`. No field may be undefined.

---

## F2-RT-004: Feedback useEffect double-firing

**Found by:** Deep code review  
**Symptom:** Feedback text generated twice, potential race condition on rapid Continue clicks  
**Root cause:** The feedback `useEffect` depended on both `state.state` and `state.feedbackLoading`. Both can change in the same render cycle, causing the effect to fire twice.  
**Fix:** Dependency array reduced to `[state.feedbackLoading]` only. The effect fires exactly once when `feedbackLoading` becomes true.  
**Rule added to checklist:** useEffect dependency arrays must contain the minimum set that causes exactly one fire per intended trigger. Having two state fields that change together in the same action is a double-fire risk.

---

---

## F2-RT-005: kb_url pointed to wrong path — 404 on Knowledge Base link

**Found by:** Manual browser testing (outcome screen)  
**Symptom:** Clicking "Knowledge base ↗" on the outcome screen returned a 404 Page Not Found.  
**Root cause:** The `kb_url` field in `f2-shadow-ai.js` used an incorrect path pattern (`/domain-f-hci-deployment/shadow-ai`) that did not match the actual Docusaurus URL structure (`/docs/domain-f-deployment/f2-shadow-ai`). Two errors: missing `/docs/` prefix, wrong domain slug, wrong entry slug.  
**Fix:** Corrected to `https://b-gowland.github.io/ai-risk-kb/docs/domain-f-deployment/f2-shadow-ai`.  
**Rule added:** Every scenario's `kb_url` must match the pattern `/docs/<domain-slug>/<entry-id>` where domain slug is one of: `domain-a-technical`, `domain-b-governance`, `domain-c-security`, `domain-d-data`, `domain-e-fairness`, `domain-f-deployment`, `domain-g-systemic`.  
**Added to audit script:** Layer 1 now validates `kb_url` format and checks the domain slug matches the scenario's risk_ref letter.  
**Added to checklist:** "Verify kb_url loads in browser before push" is now a mandatory browser test step.

---

## Framework version history (updated)

| Version | Date | Change |
|---|---|---|
| 1.0 | March 2026 | Initial — Layers 1–3 |
| 1.1 | March 2026 | Layer 4 added after blank screen bug |
| 1.2 | March 2026 | Hooks-before-return static check. ARCHITECTURE.md. ScenarioPlayer pattern. |
| 1.3 | March 2026 | Free-variable prop check in Layer 0. OutcomeScreen scenario prop fix. |
| 1.4 | March 2026 | Engine null guards (RT-003). Feedback double-fire fix (RT-004). Deep review protocol established. |
| 1.5 | March 2026 | kb_url format validation in Layer 1 (RT-005). Free-variable check generalised to all common props. Browser checklist updated with URL verification step. |