# Scenario schema — four beats

Canonical reference for the scenario format. CONTENT_STYLE_GUIDE.md points
here rather than restating it, so this file is the only place the field names
live.

Design rationale is in FREE_PRODUCT.md §4–5. This file says what a valid
scenario file contains; that document says why.

Validate with `npm run audit` (all registered) or
`node scripts/scenario-audit.mjs <id>`.

---

## Shape

```js
export const scenario = {
  id:          `f2-shadow-ai`,      // matches the filename
  door:        `work`,              // 'home' | 'work' — situational, not identity
  title:       `The Shortcut`,
  shelfLine:   `A colleague tells you to paste the client brief into a free AI tool.`,
  scene:       `desk-casual`,       // optional; must exist as public/scenes/<key>.webp
  determinacy: `open`,              // 'clean' | 'open' — see below

  risk_ref:        `F2`,            // optional, links the reference layer
  kb_url:          `https://library.airiskpractice.org/docs/...`,
  regulatory_tags: [`eu-ai-act-article-26`],   // vocabulary: CONTENT_STYLE_GUIDE
  mit_subdomain:   `mit-2.1`,

  // ── Setup (§4.2) ────────────────────────────────────────────────
  coldOpen:  [ `Three or four lines.`, `Second person.`, `Scene-led.` ],
  standing:  `Jamie, marketing team, eighteen months in the job`,
  authority: `What you can do — and, load-bearing, what you cannot.`,
  ending:    `What the player will find out. One line, every scenario.`,

  entry: `start`,                   // optional, defaults to 'start'

  // ── Decide (§4.3–4.4) ───────────────────────────────────────────
  nodes: {
    start: {
      prose: [ `Story beat. Array of paragraphs.` ],
      artefact: { type: `document`, /* type-specific fields */ },   // optional
      decision: {
        prompt: `Question ending in ?`,
        choices: [
          { id: `a`, label: `Button text.`, quality: `poor`,
            consequence: `What followed. Narrated, never graded.` },
        ],
      },
      branches: { a: `n2_next` },   // choice id → node id or outcome_ id
      // A node with no decision needs `next: 'node_id'` instead.
    },
  },

  // ── Debrief (§4.5) ──────────────────────────────────────────────
  outcomes: {
    outcome_route: {
      heading:     `Short title.`,
      tone:        `good`,          // 'good' | 'warn' | 'bad'
      score:       100,             // routes outcomes; NEVER rendered
      reaction:    `Names the pull of the choice before judging it.`,
      description: [ `What happened, concretely.` ],
      judgement:   `Honest judgement against stated principles.`,
    },
  },
  debrief: {
    frame: [ `What made this look legitimate. Scenario-level, not per outcome.` ],
  },

  // ── Close (§4.6–4.8) ────────────────────────────────────────────
  recall: {
    id: `f2-recall`,
    prompt: `The same technique in a new disguise.`,
    options: [
      { id: `a`, quality: `good`, label: `Option text.`, note: `Why.` },
    ],
  },
  act: [                            // 2–4. 'none of these fits' is appended
    { id: `a1`, label: `Something you could do this week.` },
  ],
  tell: `One transferable sentence. States a behaviour, never a guarantee.`,

  controls_summary: [               // minimum 2
    { id: `c1`, label: ``, effort: `Low`, owner: ``, go_live: true, context: `` },
  ],
};
```

---

## Rules the audit enforces

**Graph.** Every choice has a branch. Every branch lands on a real node or a
real outcome. Every node and every outcome is reachable from the entry. No
cycles. A node without a decision must declare `next`.

**Depth.** Longest path: At Work six decisions, At Home four (§4.1). Weight is
added as decisions and branching, never as expository prose.

**Choices.** Two to four per decision, three is standard. `quality` is `good`,
`partial` or `poor`.

**Consequences are narrated, not graded.** A consequence that opens with a
verdict — *Good call*, *Correct*, *Wrong* — fails the audit. §4.4 forbids
evaluative chrome, and the player draws the conclusion from what happened.
The old engine bolted a verdict opener onto every consequence at render time;
that is the specific defect this check exists to prevent returning.

**Artefacts** are a closed vocabulary of six (§5.2): `message_thread`,
`email`, `assistant_output`, `document`, `system_output`, `transcript`.
Adding a seventh is a design decision, not an authoring one, and the
dispatcher throws in dev rather than rendering nothing. The artefact must
carry everything the decision turns on — if the prose has to explain what is
in it, the scenario should not have one.

**Outcomes.** Four is the assumption (§4.9): modelled expert reasoning becomes
affordable there, and fewer makes the debrief generic. At least one each of
`good`, `warn`, `bad` reachable from natural play.

**The tell** states a behaviour. Words implying protection — *safe*,
*secure*, *guarantee*, *immune* — fail the audit (§4.8).

**Strings** use template literals (backticks), always. Single-quoted values
containing apostrophes cause parse errors, and this corpus is full of
apostrophes.

**Scenes** must exist on disk. One image per scenario at Setup, never per
node. A scenario with no scene passes with a warning.

---

## Determinacy

`clean` — one defensible answer, and the debrief can say so.

`open` — genuine trade-offs with no clean answer. Setup appends a line saying
as much, so a player is not left hunting for a right answer that was never
there. Mislabelling an open scenario as clean is the failure mode that makes
people distrust the debrief.

---

## What is not in this schema any more

`personas` and `trees` — one perspective per scenario (§4.9), so there is one
node graph and no persona key. `premise` and `framing` are replaced by
`coldOpen` and `standing`. `caption` / `sub_caption` are `prose`. Node-level
`scene` is gone; `scene` is scenario-level. `note` on a choice is
`consequence`. `unit` is gone — Recall and the debrief are first-class fields
now, and Brief was a commercial beat that never had open content.

`estimated_minutes` is gone because length is derived from the tree at render
time and a hand-authored number drifts.
