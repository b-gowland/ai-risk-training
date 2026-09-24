# Contributing to ai-risk-training

Thanks for your interest. This training app is open source and free to use forever.

## How to contribute

**Bug reports:** Open an issue with steps to reproduce, browser, and OS.

**Scenario corrections:** If a scenario contains a factual error, open an issue with the correction and a primary source. Scenario characters and organisations are fictional — corrections to the risk content itself are welcome.

**New scenarios:** Not being accepted at present. The live set is the nine registered in `src/scenarios/index.js`, and there is no current plan to add to it or to migrate the unregistered files in `src/scenarios/`. Contributions that are wanted: factual corrections, bug fixes, accessibility, and tests or tooling.

**Engine or UI improvements:** Run `npm test` and `npm run build` and confirm both pass. Include a description of the change and why.

## Licence

Code in this repository is licensed under [Apache License 2.0](./LICENSE). Scenario content is licensed under [CC BY 4.0](./LICENSE). See the LICENSE file for full terms.

## Standards

- All scenario string values must use template literals (backticks) — apostrophes in single-quoted strings cause parse errors
- Every scenario requires a `controls_summary` field (minimum 2 entries) — see the schema in `src/scenarios/README.md`
- Scenario audit must pass at zero P1 issues: `node scripts/scenario-audit.mjs <scenario-id>` (or `npm run audit` for all registered scenarios)
- CI runs `npm run lint`, `npm test`, `npm run route-audit`, `npm run audit` and `npm run build` on every PR — run them locally first
