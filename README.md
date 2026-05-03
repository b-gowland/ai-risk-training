# ai-risk-training

Interactive scenario-based AI risk training — a companion to [ai-risk-kb](https://github.com/b-gowland/ai-risk-kb).

**Live:** https://app.airiskpractice.org/
**Everyday track (Fork):** https://app.airiskpractice.org/#/everyday

---

## What it is

Choose-your-own-adventure scenarios that teach AI risk through consequence rather than compliance slides.

- **Four personas per scenario** — Business User, Executive, Project Manager, Security Analyst
- **4–5 branching decisions** per scenario — your first choice shapes what happens next
- **Real consequences** — including the ones that are darkly funny
- **Links to the knowledge base** — every outcome points to the full risk reference at [library.airiskpractice.org](https://library.airiskpractice.org/)

All scenario characters and organisations are fictional. Incidents referenced in the knowledge base are real and cited.

## Scenarios

All 26 practitioner scenarios are live across 7 risk domains, plus 3 everyday public-facing scenarios.

| Domain | Scenarios |
|--------|-----------|
| A — Technical | A1 Hallucination · A2 Model Drift · A3 Robustness · A4 Explainability |
| B — Governance | B1 Accountability · B2 Compliance · B3 Lifecycle · B4 Supply Chain |
| C — Security | C1 Data Poisoning · C2 Prompt Injection · C3 Model Theft · C4 Deepfakes · C5 AI Cyber Attacks |
| D — Data | D1 Data Quality · D2 Privacy · D3 IP & Copyright |
| E — Fairness | E1 Algorithmic Bias · E2 Harmful Content · E3 Misinformation |
| F — Deployment | F1 Automation Bias · F2 Shadow AI · F3 Scope Creep |
| G — Systemic | G1 Concentration Risk · G2 Environmental Impact · G3 Workforce Displacement · G4 AI Safety |

**Fork — everyday track:** Three public-facing scenarios on deepfake voice scams, AI hallucination, and algorithmic hiring. Designed for anyone, not just practitioners. Takes 4–5 minutes each.

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
