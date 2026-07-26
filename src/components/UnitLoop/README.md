# Unit Loop — Recall · Brief · Decide · Debrief

Optional engine support for wrapping a branching scenario in a four-beat
learning unit. The pattern applies evidence-based mechanics end to end:
spaced retrieval opens the unit, a lean teach layer prepares exactly the
decisions ahead, the branching scenario *is* the assessment, and a debrief
models expert reasoning over the consequence the learner actually reached.

Every beat is opt-in per scenario. A scenario without a `unit` field behaves
exactly as before — all existing scenarios are unaffected.

## Flow

```
PERSONA_SELECT → [RECALL] → [BRIEF] → PREMISE → NODE ⇄ FEEDBACK → OUTCOME → [DEBRIEF]
```

Bracketed states appear only when the corresponding `unit` beat is authored.
The Decide beat is the existing scenario tree — no changes to node schema,
branching, or outcomes.

## Schema

```js
export const scenario = {
  // ... all existing fields unchanged ...

  // NEW — optional. Absent on all existing scenarios.
  unit: {
    // Beat 1 — spaced retrieval. Typically references the previous unit's
    // decisions ("last time you chose X — what breaks first if Z?").
    // Keep to 2–4 items (~2–3 minutes); qa-audit warns above 5.
    recall: {
      intro: `Optional framing line, e.g. a reminder of the previous unit.`,
      items: [
        {
          id: 'r1',
          prompt: `Retrieval question ending in ?`,
          choices: [
            { id: 'a', label: `Option text.`, quality: 'good',    note: `Why this holds — min 8 words.` },
            { id: 'b', label: `Option text.`, quality: 'partial', note: `What it misses — min 8 words.` },
            { id: 'c', label: `Option text.`, quality: 'poor',    note: `Why this fails — min 8 words.` },
          ],
        },
      ],
    },

    // Beat 2 — the teach layer. Lean sections, each earning its place by
    // being needed in a decision the learner is about to face. qa-audit
    // warns above 5 sections.
    brief: {
      heading: `Unit heading.`,
      intro: `Optional framing paragraph.`,
      sections: [
        {
          heading: `Section heading`,
          body: `One tight paragraph.`,
          // Optional applied micro-check — makes the section worked, not
          // read. Formative only: answering reveals the note, nothing is
          // scored, Continue is never gated. Use where a section carries a
          // rule the learner must apply minutes later; qa-audit warns above
          // 2 checks per brief (anti-padding).
          check: {
            id: 'bc1',
            prompt: `Applied question — spot the flaw, not repeat the paragraph?`,
            choices: [
              { id: 'a', label: `Option.`, quality: 'good',    note: `Why — min 8 words.` },
              { id: 'b', label: `Option.`, quality: 'partial', note: `What it misses — min 8 words.` },
            ],
          },
        },
      ],
      kb_url: 'https://library.airiskpractice.org/docs/...', // optional source link
    },

    // Beat 4 — consequence review. Expert reasoning is keyed by persona,
    // then by outcome id, because outcomes are per-persona-tree. All three
    // fields optional; the screen renders whatever is authored.
    debrief: {
      reflection_prompt: `Open question the learner sits with. Not captured or stored.`,
      transfer_prompt: `One concrete thing to take back to the team.`,
      // Up to 3 one-sentence takeaways — the scannable close Ben's Jul 24
      // playthrough asked for. Render order: expert reasoning, takeaways,
      // commit, reflection, transfer.
      takeaways: [
        `One sentence the learner should still have next month.`,
      ],
      // "Take one with you" — a learner-selected action. 2-4 concrete,
      // this-week-sized options. A skip option ("None of these fits my
      // role") is ALWAYS rendered by the component — never author one.
      // The selection dispatches SELECT_COMMITMENT (id joins the decision
      // record next to recallAnswers) and fires an anonymous analytics
      // event. Ids only; no free text is ever captured.
      commit: {
        prompt: `Which of these would actually move the needle where you work?`,
        options: [
          { id: 'c1', label: `Concrete action.`, detail: `Optional one-line specifics.` },
        ],
      },
      expert_reasoning: {
        business_user: {
          outcome_great: `How an experienced practitioner reads this ending.`,
        },
      },
    },
  },
};
```

Recall and Brief are shared across personas by design: role differentiation
happens at the unit level (author separate units per role track), not by
polymorphism inside one scenario file. Debrief `expert_reasoning` is
persona-keyed because outcome ids are only unique within a persona tree.

## Engine surface

- New `STATES`: `RECALL`, `BRIEF`, `DEBRIEF`.
- New reducer actions: `ANSWER_RECALL` (idempotent per item),
  `CONTINUE_FROM_RECALL`, `CONTINUE_FROM_BRIEF`, `SHOW_DEBRIEF`,
  `SELECT_COMMITMENT` (Debrief only; last-write-wins; `'skip'` is a valid
  recorded value — an explicit "none fits" is a signal, not an absence).
- `createInitialState` derives `unitFlags` (`hasRecall`/`hasBrief`/
  `hasDebrief`) and initialises `recallAnswers: []`. Flags are stashed at
  init because `SELECT_PERSONA` cannot see the scenario object (same
  constraint that shaped `stateSchema` stashing in the state engine).
- Recall answers (`{ itemId, choiceId, quality }`) and the Debrief
  `commitment` id live in reducer state and are part of the same decision
  record as scenario choices. The compact shapes are deliberate — they must
  serialize well inside a SCORM 2004 `suspend_data` budget alongside
  campaign state. Brief check answers are deliberately NOT in the record:
  checks are formative; Recall is the retrieval layer that counts.

## Validation and tests

- `node scripts/qa-audit.js <scenario-id>` — Layer 2e validates `unit`
  structure when present and proves backward-compat routing
  (`SELECT_PERSONA → PREMISE`) when absent. Runs in CI on every PR.
- `npm run test:unit-loop` — reducer-level flow tests against inline
  fixtures plus a real no-unit scenario.
