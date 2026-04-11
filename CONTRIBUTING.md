# Contributing to ai-risk-training

Thanks for your interest. This training app is open source and free to use forever.

## How to contribute

**Bug reports:** Open an issue with steps to reproduce, browser, and OS.

**Scenario corrections:** If a scenario contains a factual error, open an issue with the correction and a primary source. Scenario characters and organisations are fictional — corrections to the risk content itself are welcome.

**New scenarios:** Open an issue first to discuss the risk area before building. Scenarios must follow the schema in `f2-shadow-ai.js` exactly and pass `node scripts/qa-audit.js <scenario-id>` at zero P1 issues before a PR will be reviewed.

**Engine or UI improvements:** Run `npm run build` and confirm it passes. Include a description of the change and why.

## Licence

Code in this repository is licensed under [Apache License 2.0](./LICENSE). Scenario content is licensed under [CC BY 4.0](./LICENSE). See the LICENSE file for full terms.

## Commercial use notice

A commercial product layer may be developed above this open-source core in future. Contributors should be aware of this before submitting. No contributor licence agreement (CLA) is required at this stage. If that changes, existing contributors will be notified directly before any CLA is introduced.

## Standards

- All scenario string values must use template literals (backticks) — apostrophes in single-quoted strings cause parse errors
- Every scenario requires a `controls_summary` field — its absence crashes the outcome screen
- QA audit must pass at zero P1 issues: `node scripts/qa-audit.js <scenario-id>`
- Production build must pass: `npm run build`
