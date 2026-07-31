# ai-risk-training

Interactive scenario-based AI risk training — a companion to [ai-risk-kb](https://github.com/b-gowland/ai-risk-kb).

**Live:** https://app.airiskpractice.org/

---

## What it is

One training app with two doors. **At home** covers personal AI risk — scams,
chatbot harm, deepfakes, data exposure. **At work** covers AI risk in a job,
from general staff through practitioners. The split is situational, not
identity-based: the same person uses both.

You are dropped into a situation, you make the calls, and you see what
follows. Nothing is scored, nothing is saved, and there is no login.

- **One perspective per scenario**, chosen as the most instructive vantage
  point on that risk. No identity gate before you are shown anything.
- **Artefacts** — the message, the email, the model output, the transcript.
  If a decision turns on seeing something, you see it.
- **A debrief that does the work** — what pulled you, what happened, what made
  it look legitimate, and one sentence worth passing on.
- **Links to the reference layer** at
  [library.airiskpractice.org](https://library.airiskpractice.org/)

All characters and organisations are fictional. Incidents referenced in the
knowledge base are real and cited.

## Scenarios

The app is mid-rebuild to a four-beat scenario schema (Setup → Decide →
Debrief → Close). Scenarios are registered in `src/scenarios/index.js` as each
is migrated; files present but unregistered are not reachable in the app and
are reported by `npm run route-audit`.

Schema reference: `src/scenarios/README.md`.

## Stack

- React 19 + Vite, deployed to GitHub Pages with custom domain
- Zero backend — all scenario logic runs client-side
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

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details. Open an issue before starting work on a new scenario to avoid duplication.

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

- **Knowledge base (GitHub):** https://github.com/b-gowland/ai-risk-kb
- **Knowledge base (live):** https://library.airiskpractice.org/
- **AI Risk Practice:** https://airiskpractice.org/
