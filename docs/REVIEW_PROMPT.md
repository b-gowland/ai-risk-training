# Independent review: prompt and criteria

Send this file to an outside reviewer (a person, or an AI model with no prior
context), together with the pack from `npm run review-pack`. The pack holds the
full scenario text, every branch join, the automated reports and screenshots.
The code is public at https://github.com/b-gowland/ai-risk-training; the pack
names the commit it was built from.

Check every finding before acting on it. Some will be wrong.

---

## Your task

You are reviewing AI Risk Practice, a free, open-source set of short branching
scenarios about AI going wrong, at home and at work, at app.airiskpractice.org.
Players make decisions with incomplete information and see what follows. It
is meant for an average adult reader, not a specialist.

Review it against the criteria below, in order. For each one:

1. Say whether it **passes**, **fails** or **can't be judged from the pack**.
2. For every failure, give **evidence**: the scenario id, node or outcome id,
   and the exact text, or the file and line. A finding without evidence will
   not be acted on.
3. Rate it **blocking** (wrong, misleading, inaccessible or unsafe) or
   **minor** (worth fixing, does no harm as it is).

Then check our own QA (the `reports/` folder): say whether each report measures
what it claims to, and anything it misses.

Do not rewrite the scenarios. Point at problems; we will fix them.

## Criteria

**Accuracy**
- A1. Every statement about law, regulation, incidents or statistics is
  correct as of the pack date. Dated claims have a primary source with the
  exact words (`sources` in the scenario).
- A2. Nothing is presented as legal or security advice beyond what a general
  reader can safely act on.
- A3. Invented organisations, products and laws do not belong to real ones,
  especially in the same field. Domains are `.example`.

**Fairness of the decisions**
- B1. The best option cannot be found by its position or its length
  (`reports/content-quality.txt`).
- B2. Caution is not always rewarded: some over-cautious options cost time or
  trust, and some situations reward going ahead.
- B3. Wrong options are ones a sensible person might pick, with the reason
  they are tempting.

**Continuity**
- C1. Every screen reads correctly from every way into it (`reports/joins.txt`):
  no time running backwards, no "you opened X" when the player didn't, no
  person who was never introduced.
- C2. Every ending only credits the player with what they did on every route
  into it. The report lists, for each ending, the choices made on every route;
  anything else the ending claims must be conditional (`[when …]`).

**Reading**
- D1. Plain language for an average adult (`reports/readability.txt`). No
  unexplained jargon.
- D2. No machine-writing patterns: contrast framing ("isn't X. It's Y"),
  aphorism closers, filler intensifiers, signposting, stock words.
- D3. Times shown to players match the content (`reports/timing.txt`).

**Accessibility and robustness**
- E1. Works with a keyboard and a screen reader: adjacent labels are
  separated, nothing important is visual only.
- E2. Works at phone size and in a small window (960×600): the next button
  and any feedback are visible or in reach (`screenshots/`).
- E3. The Content Security Policy blocks inline and third-party scripts other
  than the analytics named on the Privacy page.

**Claims**
- F1. What the site says about itself matches what the code does: the Privacy
  page, "no login", "nothing scored", the times and counts it states.

## Output

A table of criteria with pass / fail / can't judge, then one entry per finding:

```
[A1 · blocking] home-algorithm-said-no / debrief.frame[1]
Text: "…"
Problem: …
Evidence: …
Suggested direction (optional): …
```
