# Product review: towards the best free AI risk training

Written 10 November 2026 from a full play-through at desktop (1366px) and
phone (390px) widths and a read of the player code. Updated 25 November with
what has shipped. Distribution is in [`STRATEGY.md`](STRATEGY.md); the order
of work is in [`PLAN.md`](PLAN.md).

The short version: the bones are better than almost anything else in this
space. The craft is in the mechanics (consequence in place, recall, the
tell, the act step, the cards) and the restraint (nothing scored, no
congratulation, no dark patterns). What's missing is mostly around the
edges: a cold visitor couldn't tell what the site was in the first three
seconds, teams have no page of their own, nothing brings a player back, and
the home door is thin compared with the demand for it.

## 1. Design review

### What's strong, keep it

- **The editorial register.** Heavy display face, serif prose, quiet sans
  interface, cream ground, two door colours. It looks like nothing else in
  compliance training. The cards page is the best single page on the site.
- **Artefacts.** The document, the thread, the AI output rendered as the
  thing itself. Most training describes evidence instead of showing it.
- **Consequence in place.** No screen change, no verdict, no "Correct!".
- **Phone layout.** Nothing breaks at 390px; tap targets are large.
- **Close screen.** Frame, recall, tell, act, next up, replay: one screen,
  in the right order, nothing celebrating the player.

### What to fix

| # | Problem | Status |
|---|---|---|
| 1 | The homepage didn't say what the site is | **Done (25 Nov):** a plain line under the headline |
| 2 | "Choose your own adventure" is a registered trade mark (Chooseco) | **Done:** removed |
| 3 | No way to teams or About from the header | **Done:** "Run a session" (the cards) and "About" in the header, app and static pages. A real teams page is still to come (§3) |
| 4 | Options didn't look tappable on phones (no hover) | **Done:** a quiet arrow on each option row |
| 5 | Nothing named the scenario during play | **Done:** the scenario title sits above the decision counter |
| 6 | The sticky start bar cut text mid-sentence | **Done:** a fade above the bar |
| 7 | Faint text failed contrast (3.9:1) | **Done:** `--ink-faint` now 5.2:1; footer disclaimer 6.9:1 |
| 8 | The full footer under every decision was noise and an exit | **Done:** one-line footer during play |
| 9 | The static pages' button colour differs from the app's; the brand doesn't look like a link | Open, minor |

## 2. Training design review

Measured against what the evidence supports: practice with consequences,
retrieval, spacing, transfer, implementation intentions and discussion.

### Already ahead

- Decisions with consequences, no scoring, branches that converge honestly.
- One retrieval item per scenario, in a new disguise, after the frame.
- The act step as an implementation intention, with "none of these fits".
- One transferable sentence as the take-away.
- Cards for groups, with the private-vote-then-argue rule.
- Plain language, tests enforcing option balance.

### What would move it from good to best

1. **A confidence tap before the reveal** ("how sure are you?", three
   values). Being confidently wrong is the strongest memory signal
   (hypercorrection). Nothing stored beyond the existing anonymous event.
2. **Spacing with nothing collected:** a calendar file made in the browser
   ("in two weeks, remember: the tell"); the quarterly scenario; the cards.
3. **Evidence flagging**, trialled in "The Shortcut": mark what worries you
   in the document before you decide.
4. **A map of the paths not taken**, opt-in after the Close screen.
5. **Presenter mode:** large type, no footer, a pause at each decision for a
   show of hands. The feature most likely to get the work door used by
   teams.
6. **Audio for the voice-clone scenario**, recorded by a human actor.
7. **More home scenarios**, where the demand is: an AI companion and a
   teenager; a deepfake intimate image (sextortion); a chatbot's wrong
   medication dose. Then at work: the meeting note-taker that recorded the
   wrong meeting; the assistant that obeyed instructions hidden in a
   document.
8. **A "nobody would blame you" ending:** the reasonable choice that still
   went wrong because the system was set up badly.
9. **Local help, global story:** "where to report" and "your rights" by
   country, picked in the browser (see `STRATEGY.md` §3.4).

## 3. The missing page: for teams

Everything a team lead needs exists (cards, SCORM package, the catalogue,
the method) but no page is addressed to them:

1. What it is in two lines; free, nothing collected.
2. Three ways to run it: send the link; print the cards; load the SCORM
   package into a learning system.
3. Which scenario for which team.
4. The nine take-away lines.
5. What it maps to, in one line (the KB tags already carry this).
6. "Tell us how it went" (a mailto).

Route `/teams`, linked from the header in place of "Run a session", with a
static page to match.
