// everyday-p3-employment-screening.js
// Personal bundle — Scenario 3
// Expanded May 2026: 3–4 decision nodes per path for 3–5 min play.
// AU-framed.

export const scenario = {
  id: `everyday-p3-employment-screening`,
  risk_ref: `E1`,
  title: `The Algorithm Said No`,
  subtitle: `AI in employment screening`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 5,
  has_business_user: false,
  kb_url: `https://library.airiskpractice.org/docs/domain-e-fairness/e1-algorithmic-bias`,

  personas: {
    player: {
      label: `You`,
      role: `Job applicant`,
      character: `You`,
      framing: `You applied for a role you're qualified for. An automated system rejected you before a human ever saw your application.`,
      premise: `You applied for a project coordinator role. You meet every listed requirement. Three days later: "After careful consideration, we are unable to progress your application." No reason. No human name on the email. A colleague with similar experience who applied the same day has been invited to interview. You ask around and find out the company uses an AI screening tool. In most Australian states, you have the right to ask why you were rejected.`,
    },
  },

  trees: {
    player: {
      nodes: {
        start: {
          scene: `rejection-email`,
          caption: `Automated rejection. No reason. Your colleague got an interview.`,
          sub_caption: `An algorithm screened you out before a human saw your name.`,
          decision: {
            prompt: `What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Accept it and move on — this is just how hiring works now.`,
                quality: `poor`,
                note: `Under equal opportunity legislation in most Australian states, you can request reasons for a hiring decision. Accepting without asking leaves a potentially flawed automated decision unchallenged.`,
              },
              {
                id: `b`,
                label: `Email HR and ask what criteria the screening tool used and why you didn't meet them.`,
                quality: `good`,
                note: `A direct, professional request. Organisations using AI in hiring have obligations around fairness and transparency — asking for an explanation is well within your rights.`,
              },
            ],
          },
          branches: { a: `n2_accepted`, b: `n2_asked` },
        },

        n2_accepted: {
          scene: `desk-casual`,
          caption: `Two weeks later. A friend who also uses AI screening tools in HR asks your view.`,
          sub_caption: `"We use it to save time — do you think that's fair?"`,
          decision: {
            prompt: `What do you tell them?`,
            choices: [
              {
                id: `a`,
                label: `Share your experience — and mention that candidates have the right to ask why they were rejected.`,
                quality: `good`,
                note: `This is exactly the kind of feedback that shapes HR practice. AI screening tools make systematic errors that go uncorrected when no one challenges them. Your friend can build a fairer process with this information.`,
              },
              {
                id: `b`,
                label: `Say AI screening is fine — hiring teams are busy and it saves time.`,
                quality: `poor`,
                note: `AI screening is faster. It's also frequently biased in ways that disproportionately affect women, people from non-English-speaking backgrounds, and career changers. "Saves time" and "fair" are different questions.`,
              },
            ],
          },
          branches: { a: `outcome_accepted_spoke_up`, b: `outcome_accepted_silent` },
        },

        n2_asked: {
          scene: `email-sent`,
          caption: `HR responds: the tool filtered on "5+ years in financial services."`,
          sub_caption: `You have 4 years. The threshold wasn't in the job ad.`,
          decision: {
            prompt: `A criterion that wasn't disclosed screened you out. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Point out the discrepancy and ask for your application to go to a human reviewer.`,
                quality: `good`,
                note: `Entirely reasonable. The criterion wasn't in the job ad — which raises a real question about fair hiring practice. A human review may find your application meets the actual requirements.`,
              },
              {
                id: `b`,
                label: `Thank them for explaining and leave it there.`,
                quality: `poor`,
                note: `You've identified a real problem — an undisclosed screening criterion. Dropping it means the same tool will screen the next candidate on criteria they were never shown.`,
              },
            ],
          },
          branches: { a: `n3_escalated`, b: `n3_dropped` },
        },

        n3_escalated: {
          scene: `office-briefing`,
          caption: `HR says they'll escalate to the hiring manager. You get a callback two days later.`,
          sub_caption: `The hiring manager didn't know the tool was filtering on undisclosed criteria.`,
          decision: {
            prompt: `The hiring manager apologises and offers you an interview. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Accept the interview and also suggest they review the screening criteria for future applicants.`,
                quality: `good`,
                note: `Accepting is obvious. The suggestion takes ten seconds and could fix the process for every candidate who comes after you — including people who wouldn't have known to push back.`,
              },
              {
                id: `b`,
                label: `Accept the interview and leave it at that — you got what you wanted.`,
                quality: `partial`,
                note: `You got the interview — that's a win. But the same undisclosed threshold will screen out the next qualified candidate who doesn't push back. A brief mention of the issue takes nothing away from your application.`,
              },
            ],
          },
          branches: { a: `outcome_escalated_systemic`, b: `outcome_escalated_personal` },
        },

        n3_dropped: {
          scene: `desk-review`,
          caption: `You move on to other applications. A month later, the role is re-advertised — same ad, no 5-year threshold listed.`,
          sub_caption: `The same AI tool is still running. The next applicant won't know to ask.`,
          decision: {
            prompt: `Do you apply again?`,
            choices: [
              {
                id: `a`,
                label: `Apply again and ask upfront whether the screening criteria match the job ad.`,
                quality: `good`,
                note: `Entirely reasonable. Asking the question upfront this time is both practical for you and sends a signal to HR that candidates are aware of their right to transparency.`,
              },
              {
                id: `b`,
                label: `Don't bother — if they use that tool, any application is pointless.`,
                quality: `poor`,
                note: `The tool may have been updated, or the hiring manager may not have known what the tool was doing. Refusing to apply is a choice — but it lets the flawed process run unchallenged.`,
              },
            ],
          },
          branches: { a: `outcome_dropped_reapplied`, b: `outcome_dropped_walked` },
        },
      },

      outcomes: {
        outcome_accepted_spoke_up: {
          heading: `MOVED ON — and made it count`,
          tone: `warn`,
          result: `You didn't push back on your own rejection, but you used the experience productively. Your friend reviewed the screening criteria in their tool and found two thresholds that weren't in the job ads — they've since disclosed them explicitly. Your missed opportunity became someone else's fairer shot.`,
          learning: `Automated rejections don't have to be final. You had the right to ask — and using your experience to inform others is the next best thing.`,
          score: 55,
          outcome_label: `PARTIALLY USED`,
        },
        outcome_accepted_silent: {
          heading: `MOVED ON — and left it running`,
          tone: `bad`,
          result: `You accepted the rejection and moved on. The AI tool continued screening candidates on undisclosed criteria. Three other qualified candidates were rejected on the same threshold before the role was finally filled by someone who happened to meet an arbitrary number you never saw.`,
          learning: `Automated rejections aren't final. You had the right to ask — and didn't use it. The tool will do the same thing to the next person.`,
          score: 15,
          outcome_label: `MISSED`,
        },
        outcome_escalated_systemic: {
          heading: `CHALLENGED — and you fixed the process`,
          tone: `good`,
          result: `HR acknowledged the undisclosed threshold. Your application went to a human reviewer. You got an interview. And because you mentioned the systemic issue, the company is now reviewing whether all AI screening criteria appear in their job ads — which means the next applicant gets a fairer shot too.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational — and it improves the system for everyone who comes after you.`,
          score: 100,
          outcome_label: `CHALLENGED`,
        },
        outcome_escalated_personal: {
          heading: `CHALLENGED — and you got the interview`,
          tone: `good`,
          result: `HR acknowledged the undisclosed threshold. Your application went to a human reviewer. You got an interview. The hiring process for future candidates is unchanged — but you used your rights effectively and advocated for yourself clearly.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational. You have the right to ask — and asking works.`,
          score: 80,
          outcome_label: `CHALLENGED`,
        },
        outcome_dropped_reapplied: {
          heading: `INFORMED — and you tried again`,
          tone: `warn`,
          result: `You applied again and asked upfront about the screening criteria. HR clarified the threshold had been removed after a candidate complaint — someone else had pushed back. Your application got through. You didn't cause the fix, but you benefited from someone who did.`,
          learning: `Knowing your rights and using them are two different things. But the process does improve when people push back.`,
          score: 60,
          outcome_label: `PARTIAL`,
        },
        outcome_dropped_walked: {
          heading: `INFORMED — but you walked away`,
          tone: `warn`,
          result: `You moved on. The role was re-advertised two months later — the screening criteria had been updated after a different candidate's complaint. You never knew. The decision to walk away was understandable, but the process that rejected you was fixable and is now fixed for others.`,
          learning: `Knowing your rights and using them are two different things. Walking away is a valid choice — but it leaves the process running for the next person.`,
          score: 35,
          outcome_label: `WALKED AWAY`,
        },
      },
    },
  },

  controls_summary: [
    {
      id: `ev-c1`,
      label: `Right to explanation`,
      owner: `Anyone`,
      effort: `low`,
      go_live: true,
      context: `Australia: equal opportunity legislation in most states. EU: AI Act Article 86. UK: ICO guidance on automated decision-making. Ask hiring organisations to explain AI screening decisions.`,
    },
    {
      id: `ev-c2`,
      label: `Disclosed screening criteria`,
      owner: `Anyone`,
      effort: `low`,
      go_live: true,
      context: `Screening criteria used by AI tools should match what appears in the job advertisement. Discrepancies are worth raising — with HR and, if unresolved, with relevant equal opportunity bodies.`,
    },
  ],
};
