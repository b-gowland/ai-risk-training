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

Each scenario file exports a `scenario` object with:
- `personas` — object keyed by persona name, each with `label`, `role`, `character`, `icon`, `framing`, `premise`
- `trees` — object keyed by persona name, each with `nodes` and `outcomes`
- `controls_summary` — array of controls shown on the outcome screen
- `has_business_user` — boolean, whether business_user persona is available

Each **node** has:
- `scene` — key mapping to an SVG scene component in App.jsx (must exist)
- `caption` — main caption bar text
- `sub_caption` — optional secondary caption
- `decision` — object with `prompt` and `choices` array (null for auto-advance nodes)
- `branches` — object mapping choice IDs to next node IDs or outcome IDs

Each **choice** has:
- `id` — single letter ('a', 'b', 'c', 'd')
- `label` — the button text the player sees
- `quality` — 'good', 'partial', or 'poor'
- `note` — the authored feedback text shown after selection

Outcome IDs must start with `outcome_`. Node IDs must not.

---

## Adding a new scenario

1. Create `src/scenarios/<id>.js` — copy `f2-shadow-ai.js` as template
2. Add to `src/scenarios/index.js` — import and add to the `scenarios` array
3. Add any new scene keys to the `scenes` object in `ScenarioPlayer` in `App.jsx`
4. Run `node scripts/qa-audit.js <id>` — fix all P1 issues
5. Complete the browser checklist in `QA_REVIEW.md`
6. Create `QA_REVIEW_<id>.md` using the checklist template

---

## Adding a new scene illustration

Scenes are SVG React components defined in `App.jsx` inside `SceneSVG`.

The scenes object maps string keys to components:
```js
const scenes = {
  'desk-casual':    <DeskCasualScene />,
  'office-busted':  <OfficeBustedScene />,
  // add new ones here
};
```

If a scenario references a scene key that isn't in this object, the fallback is `desk-casual`. This won't crash but will show the wrong illustration. The Layer 4 audit checks for this.

SVG scenes use hardcoded hex colours (not CSS variables) because they're physical illustrations that should not invert in dark mode. The app's CSS variables are used for UI chrome only.

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

**Why:** The `scenes` object in `SceneSVG` must contain every key used in any scenario file. If a new scenario uses a scene key not yet defined, it silently falls back.

**The fix:** The Layer 4 audit now checks this. Always run `qa-audit.js` after adding new scene keys.

### 5. Duplicate QA_REVIEW content from failed fix attempts

**What happens:** QA_REVIEW.md accumulates duplicate issue entries from iterative fix attempts.

**The pattern:** When a fix attempt fails, update the existing issue entry rather than adding a new one. Mark attempts clearly: "Fix attempt 1 — failed, reason: X. Fix attempt 2 — succeeded."

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
