// everyday-p2-hallucination.js
// Personal bundle — Scenario 2
// Expanded May 2026: 3–4 decision nodes per path for 3–5 min play.
// Adapted from A1. Single 'player' persona.

export const scenario = {
  id: `everyday-p2-hallucination`,
  risk_ref: `A1`,
  title: `The Answer That Wasn't`,
  subtitle: `AI hallucination in everyday research`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 5,
  has_business_user: false,
  kb_url: `https://library.airiskpractice.org/docs/domain-a-technical/a1-hallucination`,

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
          sub_caption: `The AI didn't hesitate for a moment.`,
          decision: {
            prompt: `What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Book the ferry. The AI answered clearly — that's good enough.`,
                quality: `poor`,
                note: `AI assistants generate confident, plausible-sounding legal and insurance claims that can be entirely fabricated. "Sounds like a real law" is not the same as "is a real law."`,
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
            prompt: `The claims consultant says your policy doesn't cover New Zealand driving. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Argue — the AI said it does and cited a specific law.`,
                quality: `poor`,
                note: `Insurers are bound by your PDS, not by what an AI told you. The claim will not succeed. The AI generated a plausible citation that does not correspond to any real law or policy term.`,
              },
              {
                id: `b`,
                label: `Accept the situation and ask what your options are now.`,
                quality: `good`,
                note: `Accepting the situation quickly is the right response. The real fix is paying out of pocket this time and verifying AI answers on insurance and legal questions before acting on them in future.`,
              },
            ],
          },
          branches: { a: `n3_argued`, b: `n3_accepted` },
        },

        n3_argued: {
          scene: `desk-review`,
          caption: `The insurer ends the call. The claim is rejected. The AI citation doesn't exist — you checked.`,
          sub_caption: `Two hours on hold. The same answer at the end.`,
          decision: {
            prompt: `How do you handle the repair costs?`,
            choices: [
              {
                id: `a`,
                label: `Pay it and move on — and set a rule to verify AI insurance answers from now on.`,
                quality: `good`,
                note: `Expensive, but the right response. The real fix is a simple habit: for insurance, legal, or medical questions, always check the actual document. AI is the starting point, not the finish line.`,
              },
              {
                id: `b`,
                label: `Decide AI tools are useless and never use them for research again.`,
                quality: `poor`,
                note: `AI hallucinated a legal citation on a specific, consequential question. That's a known failure mode for specific facts — not a general verdict on the technology. Calibrate trust to the task.`,
              },
            ],
          },
          branches: { a: `outcome_booked_argued_lesson`, b: `outcome_booked_argued_overcorrected` },
        },

        n3_accepted: {
          scene: `payment-screen`,
          caption: `You pay the repair costs out of pocket. It hurts, but the path is clear.`,
          sub_caption: `The lesson is already forming.`,
          decision: {
            prompt: `Back home, a friend asks if they can rely on AI for their health insurance question. What do you tell them?`,
            choices: [
              {
                id: `a`,
                label: `Tell them exactly what happened to you — and suggest they call their insurer directly.`,
                quality: `good`,
                note: `Sharing a real example is the most effective way to help. The pattern is the same: AI gives a confident, plausible answer on a specific fact. The answer may be fabricated. Primary source is the only check.`,
              },
              {
                id: `b`,
                label: `Tell them AI is fine for research — yours was probably a one-off.`,
                quality: `poor`,
                note: `Hallucination on specific facts — citations, policy terms, legal provisions — is a known, documented AI failure mode, not a one-off. Your friend deserves the accurate picture.`,
              },
            ],
          },
          branches: { a: `outcome_booked_accepted_shared`, b: `outcome_booked_accepted_silent` },
        },

        n2_checked: {
          scene: `pds-open`,
          caption: `Your PDS: international coverage does not include New Zealand. Add-on required — $45.`,
          sub_caption: `The AI's legal citation does not correspond to any real law.`,
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
                note: `The failure is specific: AI hallucinated a legal citation on a consequential question. That's a known failure mode, not a general verdict on the technology. Calibrate trust to the task.`,
              },
            ],
          },
          branches: { a: `n3_checked_fixed`, b: `n3_checked_overcorrected` },
        },

        n3_checked_fixed: {
          scene: `desk-colleague`,
          caption: `Trip goes ahead. $45 lighter but fully covered. Your friend texts — they've got a question about medication and AI.`,
          sub_caption: `"ChatGPT said it's fine to take them together. Should I trust that?"`,
          decision: {
            prompt: `What do you tell your friend?`,
            choices: [
              {
                id: `a`,
                label: `Tell them what just happened to you — and say to call their pharmacist.`,
                quality: `good`,
                note: `Medication interactions are exactly the domain where AI hallucination is most dangerous — specific drug combinations, dosage thresholds, contraindications. A pharmacist takes two minutes and is authoritative.`,
              },
              {
                id: `b`,
                label: `Say AI is probably fine for health questions — it's usually right.`,
                quality: `poor`,
                note: `AI is often right — but the failure mode on specific facts (drug interactions, legal provisions, insurance terms) is confident fabrication. Health questions have higher stakes than travel insurance. Your friend needs the real picture.`,
              },
            ],
          },
          branches: { a: `outcome_checked_fixed_shared`, b: `outcome_checked_fixed_silent` },
        },

        n3_checked_overcorrected: {
          scene: `desk-casual`,
          caption: `You've stopped using AI for any research. Three weeks later, a colleague asks why.`,
          sub_caption: `"I use it every day — it's saved me hours."`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              {
                id: `a`,
                label: `Explain what happened and the specific types of questions where AI fails.`,
                quality: `good`,
                note: `The nuanced picture is more useful than a blanket verdict. AI hallucination on specific facts — citations, legal provisions, prices, policy terms — is the pattern. For drafting, summarising, and exploring ideas, AI is reliable and fast.`,
              },
              {
                id: `b`,
                label: `Stick to your position — AI can't be trusted, period.`,
                quality: `poor`,
                note: `Useful tools abandoned out of frustration rather than calibrated use is its own kind of loss. The lesson is "verify AI answers on specific consequential facts," not "never use AI."`,
              },
            ],
          },
          branches: { a: `outcome_checked_overcorrected_recovered`, b: `outcome_checked_overcorrected_stuck` },
        },
      },

      outcomes: {
        outcome_booked_argued_lesson: {
          heading: `EXPENSIVE — but you learned it cleanly`,
          tone: `warn`,
          result: `The insurer rejected the claim. The AI's law doesn't exist. You paid the repair costs and came home with a clear rule: for insurance, legal, and medical questions, check the actual document. The lesson cost money, but you absorbed it without compounding it.`,
          learning: `AI can fabricate legal citations convincingly. The fix is simple: verify specific facts against primary sources before acting.`,
          score: 40,
          outcome_label: `COSTLY`,
        },
        outcome_booked_argued_overcorrected: {
          heading: `EXPENSIVE — and the lesson missed`,
          tone: `bad`,
          result: `The insurer rejected the claim. You paid the repair costs and swore off AI entirely. But the failure was specific — AI hallucinated a legal citation on a consequential question. That's a known failure mode, not a verdict on the technology. Writing off the tool means missing the lesson.`,
          learning: `Calibrate trust to the task. AI hallucinates most on specific facts: citations, dates, laws, prices. For those: verify. For everything else: use it.`,
          score: 20,
          outcome_label: `MISSED THE LESSON`,
        },
        outcome_booked_accepted_shared: {
          heading: `COSTLY — but you paid it forward`,
          tone: `warn`,
          result: `You paid the repair costs out of pocket. You gave your friend an honest account of what happened and they called their insurer instead of trusting the AI answer. Your experience prevented a second incident. Sharing the pattern is the highest-value thing you could have done.`,
          learning: `Real examples are the most effective warning. Share AI failure stories — the pattern is more useful than the outcome.`,
          score: 50,
          outcome_label: `COSTLY`,
        },
        outcome_booked_accepted_silent: {
          heading: `COSTLY — and the lesson stayed private`,
          tone: `warn`,
          result: `You paid the repair costs. You absorbed the lesson privately. Your friend acted on the AI's health insurance answer without a check. They got lucky — but the pattern that tripped you will trip others. Sharing takes two minutes.`,
          learning: `AI hallucination on specific facts is a pattern, not a one-off. The people around you will hit it too.`,
          score: 35,
          outcome_label: `PARTIAL`,
        },
        outcome_checked_fixed_shared: {
          heading: `SAFE — and you made someone else safer`,
          tone: `good`,
          result: `$45 extension purchased. Trip happened. No coverage gap. And your friend called their pharmacist instead of trusting a confident AI answer about medication interactions — which turned out to matter. One good habit, two safe outcomes.`,
          learning: `Use AI to start the conversation. Use primary sources to finish it — especially for insurance, legal, and medical questions.`,
          score: 100,
          outcome_label: `SAFE`,
        },
        outcome_checked_fixed_silent: {
          heading: `SAFE — but only just`,
          tone: `good`,
          result: `$45 extension purchased. Trip happened. No coverage gap. Your friend took the AI's answer about their medication at face value — they got lucky. You had the experience to warn them and didn't. One conversation, two minutes.`,
          learning: `Catching an AI error is only half the lesson. Sharing the pattern is the other half.`,
          score: 75,
          outcome_label: `SAFE`,
        },
        outcome_checked_overcorrected_recovered: {
          heading: `SAFE — and recalibrated`,
          tone: `good`,
          result: `You caught the AI error, over-corrected briefly, then found the accurate framing: AI is unreliable on specific facts, reliable on drafting and summarising. You can articulate the failure mode precisely now. That's the most useful thing you can walk away with.`,
          learning: `AI hallucinates most on specific facts: citations, dates, laws, prices. For everything else, it's fast and reliable. Calibrate — don't abandon.`,
          score: 80,
          outcome_label: `RECALIBRATED`,
        },
        outcome_checked_overcorrected_stuck: {
          heading: `SAFE — but overcorrected`,
          tone: `warn`,
          result: `You caught the AI error and avoided the immediate harm. But writing off AI entirely means missing a useful tool and missing the real lesson. The failure was specific and predictable. A calibrated rule would have served you better than a blanket ban.`,
          learning: `AI hallucinates most on specific facts. That's a calibration point, not a verdict. Don't abandon the tool — learn where it fails.`,
          score: 60,
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
      go_live: true,
      context: `For insurance, legal, medical, and financial questions: always check the actual document, not the AI summary of it.`,
    },
    {
      id: `ev-c2`,
      label: `Calibrated AI use`,
      owner: `Anyone`,
      effort: `low`,
      go_live: true,
      context: `AI is reliable for drafting, summarising, and exploring ideas. It hallucates most on specific facts: citations, dates, laws, prices, policy terms. Know the difference.`,
    },
  ],
};
