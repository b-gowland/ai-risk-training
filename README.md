# ai-risk-training

Interactive scenario-based AI risk training.

**Live:** https://app.airiskpractice.org/

---

## What it is

One training app with two doors. **At home** covers personal AI risk: scams,
chatbot harm, deepfakes, data exposure. **At work** covers AI risk in a job.
The same person can use both.

You're dropped into a situation. You decide, then see what follows.
Nothing is scored and there's no login. Anonymous, aggregate usage is recorded
so the project can see what gets played. Nothing personal is stored.

- **One point of view per scenario**, picked as the one that teaches the most.
  You aren't asked who you are before you start.
- **Artefacts:** the message, the email, the AI output, the transcript. If a
  decision turns on seeing something, you see it.
- **A short debrief:** what happened, what made it look legitimate, and one
  sentence worth passing on.
- **Where to go next:** help if something has gone wrong, free courses, and
  ways to work on AI risk (the About page).

All characters and organisations are fictional. Where a scenario states a
dated or legal fact, its primary source is shown at the end (`sources`).

## Scenarios

Nine scenarios are live: three At Home and six At Work. Each one runs in four
beats (Setup → Decide → Debrief → Close). They are registered in
`src/scenarios/index.js`.

- Schema reference: `src/scenarios/README.md`
- How the app fits together: `ARCHITECTURE.md`

**Discussion cards** at [/#/cards](https://app.airiskpractice.org/#/cards) are
a printable version of each scenario for running a group session.

## Stack

- React 19 + Vite, deployed to Cloudflare Pages from GitHub Actions
- No backend: all scenario logic runs in the browser
- Privacy-friendly analytics via Plausible (no cookies, no personal data)

## Setup

```bash
git clone https://github.com/b-gowland/ai-risk-training.git
cd ai-risk-training
npm install
npm run dev
```

No API key required to run the full scenario experience locally.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New scenarios aren't being accepted at present; corrections, bug fixes and accessibility work are welcome.

## Licence

Code: Apache 2.0
Content: CC BY 4.0

See [LICENSE](./LICENSE) for full terms and attribution requirements.

## Attribution

Built on:
- [MIT AI Risk Repository](https://airisk.mit.edu) (CC BY 4.0)
- [NIST AI RMF 1.0 + AI 600-1](https://nist.gov/artificial-intelligence) (public domain)
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications) (CC BY-SA 4.0)
- [MITRE ATLAS](https://atlas.mitre.org) (CC BY 4.0)
- EU AI Act (public domain)

## Related

- **Reference library (retired 28 Nov 2026, archived):** https://github.com/b-gowland/ai-risk-kb
- **Governance Baseline (retired 28 Nov 2026):** https://github.com/b-gowland/ai-risk-baseline
- **AI Risk Practice:** https://airiskpractice.org/
