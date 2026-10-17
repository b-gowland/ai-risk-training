# Contributing to ai-risk-training

Thanks for your interest. This training app is open source and free to use forever.

## How to contribute

**Bug reports:** Open an issue with steps to reproduce, browser, and OS.

**Scenario corrections:** If a scenario contains a factual error, open an issue with the correction and a primary source. Scenario characters and organisations are fictional; corrections to the risk content itself are welcome.

**New scenarios:** Not being accepted at present. The live set is the nine registered in `src/scenarios/index.js`, and there is no current plan to add to it. Contributions that are wanted: factual corrections, bug fixes, accessibility, and tests or tooling.

**Engine or UI improvements:** Run `npm test` and `npm run build` and confirm both pass. Include a description of the change and why.

## Licence

Code in this repository is licensed under [Apache License 2.0](./LICENSE). Scenario content is licensed under [CC BY 4.0](./LICENSE). See the LICENSE file for full terms.

## Standards

- All scenario string values must use template literals (backticks), because apostrophes in single-quoted strings cause parse errors
- Every scenario requires a `controls_summary` field (minimum 2 entries). See the schema in `src/scenarios/README.md`
- Scenario audit must pass at zero P1 issues: `node scripts/scenario-audit.mjs <scenario-id>` (or `npm run audit` for all registered scenarios)
- Scenario text should come back clean from `npm run readability`: no flagged patterns or jargon, no sentence over 25 words, reading grade at or under 7 (At Home) or 9 (At Work). Read it aloud too; the script catches patterns, not tone
- A screen or ending that more than one choice leads to must read correctly from every one of them. Check with `npm run joins`; use `{ when }` / `{ unless }` paragraphs (see ARCHITECTURE.md) rather than text written for one route
- The best option must not be findable by position or length: `npm test` fails if it sits in one position too often or is usually the longest. Give wrong options the reason someone would pick them
- A dated or legal claim in a debrief needs a `sources` entry: who, title, date, URL and their exact words
- Invented organisations and products must not belong to real ones; check ABN Lookup, trade mark registers and a web search. Web addresses and email domains are `.example`
- Don't type times into pages: they come from `src/engine/timing.js`
- CI runs `npm run lint`, `npm test`, `npm run route-audit`, `npm run audit`, `npm run test:scorm` and `npm run build` on every PR. Run them locally first
