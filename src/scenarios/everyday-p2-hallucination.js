// everyday-p2-hallucination.js
// Personal bundle — Scenario 2
// Adapted from A1. Single 'player' persona. Exactly 2 choices per node.

export const scenario = {
  id: `everyday-p2-hallucination`,
  risk_ref: `A1`,
  title: `The Answer That Wasn't`,
  subtitle: `AI hallucination in everyday research`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 4,
  has_business_user: false,
  kb_url: `https://b-gowland.github.io/ai-risk-kb/docs/domain-a-performance/a1-hallucination`,

  personas: {
    player: {
      label: `You`,
      role: `Anyone`,
      character: `You`,
      framing: `You asked an AI assistant a question. It answered confidently. You're about to use the answer.`,
      premise: `You're planning a road trip and asked an AI assistant whether your car insurance covers you to drive in New Zealand. It replied immediately: "Yes — under Australian insurance law, comprehensive policies automatically extend to New Zealand for trips under 90 days. Check your Product Disclosure Statement for any exclusions." Sounds authoritative. Cites something that sounds like a real law. You're about to book the ferry.`,
    },
  },

  trees: {
    player: {
      nodes: {
        start: {
          scene: `phone-search`,
          caption: `Confident answer. Sounds like a real legal citation. You're ready to book.`,
          sub_caption: `The AI didn't hesitate.`,
          decision: {
            prompt: `What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Book the ferry. The AI answered clearly — that's good enough.`,
                quality: `poor`,
                note: `AI assistants generate confident, plausible-sounding legal and insurance claims that can be entirely fabricated. The citation sounded real. It doesn't correspond to any real law.`,
              },
              {
                id: `b`,
                label: `Check your actual PDS or call your insurer before booking.`,
                quality: `good`,
                note: `AI is useful for drafting, summarising, and exploring. For decisions with real financial or legal stakes, primary sources are irreplaceable.`,
              },
            ],
          },
          branches: { a: `n2_booked`, b: `n2_checked` },
        },

        n2_booked: {
          scene: `border-crossing`,
          caption: `Day three in New Zealand. Minor collision in a car park.`,
          sub_caption: `You call your insurer to make a claim.`,
          decision: {
            prompt: `The claims consultant says your policy does not extend to New Zealand. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Argue — the AI said it does.`,
                quality: `poor`,
                note: `Insurers are bound by your PDS, not by what an AI told you. The claim will not succeed. The AI generated a plausible citation that does not correspond to any real law or policy term.`,
              },
              {
                id: `b`,
                label: `Pay out of pocket, accept the lesson, and note what happened.`,
                quality: `good`,
                note: `Expensive, but the right response. The real fix is verifying AI answers on insurance, legal, and medical questions against primary sources before acting on them.`,
              },
            ],
          },
          branches: { a: `outcome_booked_argued`, b: `outcome_booked_accepted` },
        },

        n2_checked: {
          scene: `pds-open`,
          caption: `Your PDS: international coverage does not include New Zealand. Add-on required.`,
          sub_caption: `The AI's legal citation does not exist.`,
          decision: {
            prompt: `The AI was wrong. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Buy the $45 add-on and continue the trip as planned.`,
                quality: `good`,
                note: `You checked, you caught it, you fixed it. This is exactly how AI tools should be used — as a starting point, not a final answer for consequential decisions.`,
              },
              {
                id: `b`,
                label: `Decide AI tools aren't trustworthy for anything and stop using them.`,
                quality: `poor`,
                note: `The failure is specific: AI hallucinated a legal citation on a consequential question. That's a known failure mode, not a general verdict on the technology. Calibrate your trust to the task.`,
              },
            ],
          },
          branches: { a: `outcome_checked_fixed`, b: `outcome_checked_overcorrected` },
        },
      },

      outcomes: {
        outcome_booked_argued: {
          heading: `EXPENSIVE MISTAKE`,
          tone: `bad`,
          result: `The insurer rejected the claim. The AI cited a law that doesn't exist. You're covering the repair costs — and the argument with the claims consultant took two hours.`,
          learning: `AI can fabricate legal citations convincingly. "It sounded real" is not a defence with an insurer.`,
          outcome_label: `SCAMMED`,
        },
        outcome_booked_accepted: {
          heading: `COSTLY — but honest`,
          tone: `warn`,
          result: `You paid out of pocket. You didn't double down on a bad premise. You'll check the PDS before the next trip. The lesson cost money, but you learned it cleanly.`,
          learning: `Accepting a mistake quickly is better than compounding it. Check primary sources before consequential decisions.`,
          outcome_label: `COSTLY`,
        },
        outcome_checked_fixed: {
          heading: `SAFE — good catch`,
          tone: `good`,
          result: `$45 extension purchased. Trip happened. No coverage gap. The AI was wrong but you didn't rely on it for the final answer — which is exactly the right way to use these tools.`,
          learning: `Use AI to start the conversation. Use primary sources to finish it.`,
          outcome_label: `SAFE`,
        },
        outcome_checked_overcorrected: {
          heading: `SAFE — but overcorrected`,
          tone: `warn`,
          result: `You caught the error. But writing off AI entirely misses the lesson. AI hallucinated a legal citation on a specific, consequential question. That's a known failure mode — not a general verdict.`,
          learning: `AI hallucinates most on specific facts: citations, dates, laws, prices. Calibrate trust to the task.`,
          outcome_label: `OVERCORRECTED`,
        },
      },
    },
  },

  controls_summary: [
    {
      id: `ev-c1`,
      label: `Primary source verification`,
      owner: `Anyone`,
      effort: `low`,
      context: `For insurance, legal, medical, and financial questions: always check the actual document, not the AI summary of it.`,
    },
  ],
};
