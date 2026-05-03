# Architecture Reference — ai-risk-training

Read this before building a new scenario or modifying the app structure.  
Updated as new patterns and pitfalls are discovered.

---

## How the app works

```
main.jsx
  HashRouter
    / → Homepage (scenario grid)
    /scenario/:id → App (router) → ScenarioPlayer (game engine)
```

**HashRouter** is used instead of BrowserRouter because GitHub Pages doesn't support server-side URL rewriting. All URLs use the `#` prefix (`/#/scenario/f2-shadow-ai`). No server config needed.

**App** is a pure router component — no hooks. It reads the `:id` param, looks up the scenario, and either shows an error screen (stub or unknown) or renders `ScenarioPlayer` with the scenario as a prop.

**ScenarioPlayer** owns all React hooks and all game state. It receives a guaranteed-valid scenario object as a prop. This separation is deliberate — see Known Pitfalls below.

**narrativeEngine.js** is a pure state machine with no React dependencies. The `reducer` function handles all state transitions. `useReducer` in `ScenarioPlayer` connects it to React. The engine can be tested in Node without a browser.

---

## State machine

States in order:
```
PERSONA_SELECT → PREMISE → NODE → FEEDBACK → NODE → ... → OUTCOME
```

Key state fields:
- `state` — current STATES enum value
- `persona` — selected persona key ('business_user', 'executive', 'pm', 'analyst')
- `currentNodeId` — the node currently being shown
- `selectedChoice` — the choice object the player just made
- `history` — array of `{ nodeId, choiceId }` — used by feedback to find the right node
- `nextNodeId` — stored during FEEDBACK so CONTINUE_FROM_FEEDBACK knows where to go
- `outcomeId` — set when the next destination is an outcome

**Important:** `currentNodeId` is NOT updated when a choice is made (SELECT_CHOICE). It stays pointing at the decision node throughout the FEEDBACK state. Only CONTINUE_FROM_FEEDBACK updates it to `nextNodeId`. This is intentional — the feedback screen still shows the scene from the decision node.

---

## Scenario data structure

Each scenario file exports a `scenario` object. The complete field reference is below.
**Do not guess field names — use this reference exactly.**

### Top-level fields

```js
export const scenario = {
  id:                'f2-shadow-ai',          // kebab-case, matches filename
  risk_ref:          'F2',                    // e.g. 'A1', 'C4', 'E1'
  title:             'The Shortcut',          // short display title
  subtitle:          'Shadow AI & Data Exposure',
  domain:            'F — HCI & Deployment',  // full domain label
  difficulty:        'Foundational',          // 'Foundational' | 'Intermediate' | 'Advanced'
  kb_url:            'https://library.airiskpractice.org/docs/domain-f-deployment/f2-shadow-ai',
  estimated_minutes: 10,
  has_business_user: true,                    // false for scenarios without BU persona
  personas:          { ... },                 // see Personas below
  trees:             { ... },                 // see Trees below
};
```

### Personas object

```js
personas: {
  business_user: {
    label:    'Business User',         // display label
    role:     'Marketing Team',        // short role description
    character: 'Jamie',               // character first name
    icon:     '◇',                    // one of: ◇ ◈ ◎ ◉
    framing:  'One-sentence hook shown on persona select screen.',
    premise:  `Multi-sentence scene-setting shown before the first node.
               This is what the player reads before making any choices.`,
  },
  executive: { ... },   // same fields
  pm:        { ... },   // same fields
  analyst:   { ... },   // same fields
},
```

### Trees object — nodes

```js
trees: {
  business_user: {
    nodes: {
      start: {                          // first node must always be named 'start'
        scene:       'desk-casual',     // key in the scenes object in App.jsx SceneSVG
        caption:     'Caption bar text — advances the story.',
        sub_caption: 'Optional secondary caption.',   // omit if not needed
        decision: {
          prompt: 'The question posed to the player?',   // MUST end with ?
          choices: [
            {
              id:      'a',             // single letter — 'a', 'b', 'c', 'd'
              label:   'Button text the player sees.',
              quality: 'good',          // 'good' | 'partial' | 'poor'
              note:    'Authored feedback shown after selection. Min ~10 words.',
            },
            {
              id:      'b',
              label:   'Another choice.',
              quality: 'poor',
              note:    'Why this was the wrong call.',
            },
          ],
        },
        branches: { a: 'n2_next_node', b: 'outcome_bad' },
        //          ^                   ^
        //          choice id           node id or outcome id
        //          must exist in       node ids must NOT start with 'outcome_'
        //          choices array       outcome ids MUST start with 'outcome_'
      },

      n2_next_node: {
        scene:    'office-meeting',
        caption:  'Next story beat.',
        decision: { ... },
        branches: { a: 'outcome_good', b: 'n3_another' },
      },

      // Auto-advance node (no decision — player doesn't choose, just continues)
      n3_bridge: {
        scene:    'desk-casual',
        caption:  'Narrative bridge — moves to next node automatically.',
        decision: null,
        branches: { auto: 'outcome_warn' },   // 'auto' is the special key
      },
    },

    outcomes: {
      outcome_good: {
        heading:  'Short punchy outcome title.',      // ~4 words
        tone:     'good',                             // 'good' | 'warn' | 'bad'
        result:   'What actually happened as a result of the player\'s choices. '
                + 'Min ~25 words. Narrative, specific, consequence-driven.',
        learning: 'The key takeaway. Min ~15 words. '
                + 'What the player should remember.',
        score:    100,   // integer 0–100. good ~70-100, warn ~30-60, bad ~0-20
      },
      outcome_warn: {
        heading:  'Bruised but standing.',
        tone:     'warn',
        result:   '...',
        learning: '...',
        score:    45,
      },
      outcome_bad: {
        heading:  'The case study nobody wants to be.',
        tone:     'bad',
        result:   '...',
        learning: '...',
        score:    8,
      },
    },
  }, // end business_user tree

  executive: { nodes: { ... }, outcomes: { ... } },
  pm:        { nodes: { ... }, outcomes: { ... } },
  analyst:   { nodes: { ... }, outcomes: { ... } },
},
```

### Field name quick-reference — common mistakes

| Wrong (do not use) | Correct |
|---|---|
| `text:` on a choice | `label:` |
| `next:` on a choice | add to `branches` object on the node |
| `title:` on an outcome | `heading:` |
| `consequence:` on an outcome | part of `result:` |
| `situation:` on a persona | `premise:` |
| `name:` on a persona | `character:` |
| `controls_summary: [...]` | omit — not used by engine |

---

## Available scene keys

These are the scene keys currently defined in `App.jsx`. Use only these values for `scene:` in nodes.

```
desk-casual       desk-typing       desk-colleague    desk-intranet
desk-focused      office-meeting    office-busted     office-bright
boardroom         analyst-desk
```

If a scenario uses a key not in this list, Layer 0 of qa-audit.js will flag it as a P1 issue.
To add a new scene: add the key + SVG component to the `scenes` object inside `SceneSVG` in `App.jsx`.

---

## Adding a new scenario — exact steps

1. Create `src/scenarios/<id>.js` — copy `f2-shadow-ai.js` as template, replace all content
2. Run `node scripts/qa-audit.js <id>` — fix all P1 issues before doing anything else
3. Add import to `src/scenarios/index.js` and replace the stub entry
4. If new scene keys are needed, add SVG components to `App.jsx`
5. Complete browser checklist in `QA_REVIEW.md`

---

## Known pitfalls

### 1. Hooks must come before any conditional return (CRITICAL)

**What happens if you get this wrong:** `scenario is not defined` or similar scope errors in the browser console. The variable appears defined in the source but falls out of scope in Vite's minified bundle.

**The rule:** In any React component, ALL hooks (`useReducer`, `useEffect`, `useState`, etc.) must be called before any `return` statement, including early returns for loading states, error states, or missing data.

**The pattern to follow:**
```jsx
// WRONG — hook after conditional return
function MyComponent({ id }) {
  const data = getData(id);
  if (!data) return <ErrorScreen />;        // ← return before hook
  const [state, dispatch] = useReducer(...); // ← hook after return = BUG
}

// RIGHT — split into router + player
function MyComponent({ id }) {
  const data = getData(id);
  if (!data) return <ErrorScreen />;
  return <MyPlayer data={data} />;  // data is guaranteed valid
}

function MyPlayer({ data }) {       // no conditional returns before hooks
  const [state, dispatch] = useReducer(...);
  // ... all hooks first, then conditional rendering
}
```

This is why `App` and `ScenarioPlayer` are separate components.

### 2. useEffect fires between renders, not in simulation (IMPORTANT)

**What happens:** A bug only appears in the browser, not in Node simulation. The automated audit passes but the browser crashes.

**Why:** The `qa-audit.js` simulation dispatches actions in a tight synchronous loop. React's `useEffect` fires asynchronously between renders — after each state change causes a re-render. These are different execution models.

**Known instance:** The auto-advance `useEffect` was firing during the FEEDBACK→OUTCOME transition and trying to call `getCurrentNode` with an outcome ID. This returned null and crashed the component. Fixed by adding `startsWith('outcome_')` guard.

**The pattern to follow:** Any `useEffect` that reads state and dispatches must guard against every possible state value, including transitional ones. Don't assume the state will always be "clean" when the effect fires.

### 3. Scenario variable scope in useEffect closures

**What happens:** `scenario` appears defined in the component but is `undefined` inside a `useEffect` callback.

**Why:** When hooks ordering is violated (see pitfall 1), Vite's minifier can optimise away variable bindings in closure scopes. The symptom is `ReferenceError: scenario is not defined` even though the variable is clearly in scope in the source.

**The fix:** Ensure hooks ordering is correct (pitfall 1). With correct hooks ordering, closure scope works as expected.

### 4. Scene key missing from scenes object

**What happens:** Wrong illustration shown — the fallback `desk-casual` scene renders instead of the intended one.

**The fix:** The Layer 0 audit now checks this. Always run `qa-audit.js` after authoring a new scenario.

### 5. Duplicate QA_REVIEW content from failed fix attempts

**The pattern:** When a fix attempt fails, update the existing issue entry rather than adding a new one. Mark attempts clearly: "Fix attempt 1 — failed, reason: X. Fix attempt 2 — succeeded."

### 6. All state fields must be explicitly initialised (RT-003)

**What happens:** `Cannot read properties of undefined (reading 'startsWith')` or similar crashes when the engine tries to operate on a field that was never set.

**The rule:** Every field in `createInitialState` must have an explicit value — never leave a field absent or undefined. Use `null` as the explicit "not yet set" value. Before calling any method on a state field (`.startsWith()`, `.at()`, `.find()`) guard with `if (!field) return`.

**Engine contract:** Every reducer case that reads `nextNodeId` must guard: `if (!nextNodeId) return state` before `.startsWith()`.

### 7. useEffect dependency arrays must not cause double-firing (RT-004)

**What happens:** Feedback text is generated twice, or a timer fires twice, causing race conditions or duplicate dispatches.

**The rule:** Each useEffect dependency array should contain the minimum set that causes exactly one fire per intended trigger. For the feedback effect, `[state.feedbackLoading]` is sufficient — it becomes `true` once per choice.

**Check:** Before finalising any useEffect, ask — "could two items in this dependency array change in the same action?" If yes, reduce to just the one that is the actual trigger.

### 8. kb_url must use the exact Docusaurus path pattern (RT-005)

**What happens:** 404 Page Not Found when clicking Knowledge Base link from the outcome screen.

**The correct pattern:**
```
https://library.airiskpractice.org/docs/<domain-slug>/<entry-id>
```

**Domain slug reference:**
| Risk ref | Domain slug |
|---|---|
| A1–A4 | `domain-a-technical` |
| B1–B4 | `domain-b-governance` |
| C1–C5 | `domain-c-security` |
| D1–D3 | `domain-d-data` |
| E1–E3 | `domain-e-fairness` |
| F1–F3 | `domain-f-deployment` |
| G1–G4 | `domain-g-systemic` |

**Verified entry slugs — use exactly as shown, do not construct from titles:**

| Risk ref | Entry slug | Risk ref | Entry slug |
|---|---|---|---|
| A1 | `a1-hallucination` | B1 | `b1-accountability` |
| A2 | `a2-model-drift` | B2 | `b2-compliance` |
| A3 | `a3-robustness` | B3 | `b3-lifecycle` |
| A4 | `a4-explainability` | B4 | `b4-supply-chain` |
| C1 | `c1-data-poisoning` | D1 | `d1-training-data-quality` |
| C2 | `c2-prompt-injection` | D2 | `d2-privacy` |
| C3 | `c3-model-theft` | D3 | `d3-intellectual-property` |
| C4 | `c4-deepfakes` | E1 | `e1-algorithmic-bias` |
| C5 | `c5-ai-cyber-attacks` | E2 | `e2-harmful-content` |
| F1 | `f1-automation-bias` | E3 | `e3-misinformation` |
| F2 | `f2-shadow-ai` | G1 | `g1-concentration-risk` |
| F3 | `f3-scope-creep` | G2 | `g2-environmental-impact` |
| G3 | `g3-workforce-displacement` | G4 | `g4-ai-safety` |

These slugs were verified against the live KB in March 2026. If a new entry is added to the KB, confirm its slug by fetching the live page before using it in a scenario.

---

## File reference

| File | Purpose |
|---|---|
| `src/App.jsx` | All React components + SVG scenes + main app shell |
| `src/App.module.css` | All component styles |
| `src/main.jsx` | Router setup + ErrorBoundary wrapping |
| `src/index.css` | Design tokens (CSS variables), global reset |
| `src/engine/narrativeEngine.js` | Pure state machine — no React |
| `src/scenarios/index.js` | Scenario registry — all 17 entries |
| `src/scenarios/f2-shadow-ai.js` | F2 scenario data — reference implementation |
| `src/components/Homepage/` | Homepage grid + scenario cards |
| `src/components/ErrorBoundary/` | Catches runtime crashes, shows restart screen |
| `scripts/qa-audit.js` | 4-layer automated QA — run before every push |
| `QA_REVIEW.md` | Issue log + browser test record + authoring checklist |
| `ARCHITECTURE.md` | This file |

---

## Pre-push checklist (quick reference)

```
1. node scripts/qa-audit.js <scenario-id>   → must exit with 0 P1 issues
2. npm run build                             → must complete without errors
3. git push                                  → triggers GitHub Actions deploy
4. Wait ~2 minutes for deploy
5. Browser test: good path + poor path for each persona
6. DevTools console: zero uncaught errors
7. Update QA_REVIEW.md browser testing record
```
