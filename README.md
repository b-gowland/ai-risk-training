# ai-risk-training

Interactive scenario-based AI risk training — a companion to [ai-risk-kb](https://github.com/b-gowland/ai-risk-kb).

**Live:** https://b-gowland.github.io/ai-risk-training/

---

## What it is

Choose-your-own-adventure scenarios that teach AI risk through consequence rather than compliance slides.

- **Four personas per scenario** — Business User, Executive, Project Manager, Security Analyst
- **4–5 branching decisions** per scenario — your first choice shapes what happens next
- **Real consequences** — including the ones that are darkly funny
- **Links to the knowledge base** — every outcome points to the full risk reference

All scenario characters and organisations are fictional. Incidents referenced in the knowledge base are real and cited.

## Scenarios

| ID | Title | Domain | Personas | Status |
|----|-------|--------|----------|--------|
| F2 | The Shortcut — Shadow AI | HCI & Deployment | All 4 | Live |
| C4 | The Fabricated Call — Deepfakes | Security & Adversarial | All 4 | Live |
| A1 | Confident and Wrong — Hallucination | Technical | All 4 | Live |
| E1 | The Score — Algorithmic Bias | Fairness & Social | All 4 | Live |
| +13 | Various | All domains | Exec / PM / Analyst | Planned |

## Stack

- React 19 + Vite, deployed to GitHub Pages
- Zero backend — all scenario logic runs client-side
- SVG illustration — no external image dependencies, no AI-generated images
- Feedback is scenario-authored (see `note` field in scenario data)

> **On the feedback feature:** Scenario feedback uses authored text from the scenario data file rather than a live API call. This keeps the API key server-side (where it belongs) and ensures feedback always works regardless of API availability. A self-hosted deployment guide for live Claude feedback via a serverless proxy is in the works.

## Setup

```bash
git clone https://github.com/b-gowland/ai-risk-training.git
cd ai-risk-training
npm install
npm run dev
```

No API key required to run the full scenario experience locally.

## Contributing

Contributions welcome — especially new scenario content. See the existing `f2-shadow-ai.js` for the scenario schema. Each scenario needs:

- Four persona tracks (Business User, Executive, PM, Analyst) or three (exec/PM/analyst)
- 4–5 decision nodes per track with branching branches
- Good / partial / poor quality choices with specific consequences
- An outcome for each quality level

Open an issue before starting work on a new scenario to avoid duplication.

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

- **Knowledge base:** https://github.com/b-gowland/ai-risk-kb
- **Live KB:** https://b-gowland.github.io/ai-risk-kb/
