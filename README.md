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

All 26 scenarios are live across 7 risk domains. Play them at [b-gowland.github.io/ai-risk-training](https://b-gowland.github.io/ai-risk-training/).

| Domain | Scenarios |
|--------|-----------|
| A — Technical | A1 Hallucination · A2 Model Drift · A3 Robustness · A4 Explainability |
| B — Governance | B1 Accountability · B2 Compliance · B3 Lifecycle · B4 Supply Chain |
| C — Security | C1 Data Poisoning · C2 Prompt Injection · C3 Model Theft · C4 Deepfakes · C5 AI Cyber Attacks |
| D — Data | D1 Data Quality · D2 Privacy · D3 IP & Copyright |
| E — Fairness | E1 Algorithmic Bias · E2 Harmful Content · E3 Misinformation |
| F — Deployment | F1 Automation Bias · F2 Shadow AI · F3 Scope Creep |
| G — Systemic | G1 Concentration Risk · G2 Environmental Impact · G3 Workforce Displacement · G4 AI Safety |

## Stack

- React 19 + Vite, deployed to GitHub Pages
- Zero backend — all scenario logic runs client-side
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

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details. Open an issue before starting work on a new scenario to avoid duplication.

## Licence

Code: Apache 2.0
Content: CC BY 4.0

See [LICENSE](./LICENSE) for full terms and attribution requirements.

A commercial product layer may be developed above this open-source core in future — see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

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
