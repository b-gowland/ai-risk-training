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

All 26 scenarios are live — one for every risk entry in the companion knowledge base.

| Domain | ID | Title |
|--------|----|-------|
| A — Technical | A1 | Confident and Wrong — Hallucination |
| | A2 | The Silent Drift — Model Drift |
| | A3 | Edge of the Map — Robustness & ODD |
| | A4 | The Black Box Decision — Explainability |
| B — Governance | B1 | Nobody's Problem — Accountability Gaps |
| | B2 | The Deadline Creep — Regulatory Non-Compliance |
| | B3 | Still Running — Lifecycle Governance |
| | B4 | Inside the Vendor — Supply Chain Risk |
| C — Security | C1 | Poisoned at the Source — Data Poisoning (3 personas) |
| | C2 | The Hidden Instruction — Prompt Injection (3 personas) |
| | C3 | The Extraction — Model Theft (3 personas) |
| | C4 | The Fabricated Call — Deepfakes |
| | C5 | The Convincing Email — AI-Enabled BEC Fraud |
| D — Data | D1 | The Blind Spot — Training Data Quality |
| | D2 | The Accidental Disclosure — Privacy |
| | D3 | Who Owns This? — IP & Copyright |
| E — Fairness | E1 | The Score — Algorithmic Bias |
| | E2 | The Guardrail Gap — Harmful Content |
| | E3 | The Fabricated Story — Synthetic Content |
| F — Deployment | F1 | Trust the Machine — Automation Bias |
| | F2 | The Shortcut — Shadow AI |
| | F3 | The Expanding Tool — Scope Creep |
| G — Systemic | G1 | Single Point — Concentration Risk |
| | G2 | The Hidden Cost — Environmental Impact |
| | G3 | The Redundancy Leak — Workforce Displacement |
| | G4 | No One Said Stop — Agentic AI Safety |

Four personas per scenario (Business User, Executive, Project Manager, Analyst) — except C1, C2, C3 which have three personas (Executive, PM, Analyst). Total: over 5 hours of interactive training content.

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
