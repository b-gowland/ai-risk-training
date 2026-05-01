// everyday-p3-employment-screening.js
// Personal bundle — Scenario 3
// Adapted from E1. Player is a job applicant. Exactly 2 choices per node.

export const scenario = {
  id: `everyday-p3-employment-screening`,
  risk_ref: `E1`,
  title: `The Algorithm Said No`,
  subtitle: `AI in employment screening`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 4,
  has_business_user: false,
  kb_url: `https://b-gowland.github.io/ai-risk-kb/docs/domain-e-societal/e1-bias`,

  personas: {
    player: {
      label: `You`,
      role: `Job applicant`,
      character: `You`,
      framing: `You applied for a role you're qualified for. An automated system rejected you before a human saw your application.`,
      premise: `You applied for a project coordinator role at a large company. You meet every listed requirement. Three days later, an automated email: "After careful consideration, we are unable to progress your application." No reason given. A colleague with similar experience who applied the same day has been invited to interview. You find out the company uses an AI screening tool. In most Australian states, you have the right to ask why you were rejected.`,
    },
  },

  trees: {
    player: {
      nodes: {
        start: {
          scene: `rejection-email`,
          caption: `Automated rejection. No reason. Your colleague got an interview.`,
          sub_caption: `The AI screened you out before a human ever saw your application.`,
          decision: {
            prompt: `What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Accept it and move on — it's just how hiring works now.`,
                quality: `poor`,
                note: `In Australia, you have the right to request reasons for rejection under equal opportunity legislation in most states. Under the EU AI Act, applicants have explicit rights to human review of automated decisions. Accepting without asking leaves a potentially flawed decision unchallenged.`,
              },
              {
                id: `b`,
                label: `Email HR and ask what criteria the screening tool used and why you didn't meet them.`,
                quality: `good`,
                note: `This is a legitimate, professional request. Organisations using AI in hiring are increasingly required to explain and justify automated decisions. A polite, direct question is your right.`,
              },
            ],
          },
          branches: { a: `outcome_accepted`, b: `n2_asked` },
        },

        n2_asked: {
          scene: `email-sent`,
          caption: `HR responds: the tool filtered on "5+ years in financial services."`,
          sub_caption: `You have 4 years. The threshold wasn't in the job ad.`,
          decision: {
            prompt: `An undisclosed criterion screened you out. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Point out the discrepancy and ask for a human review of your application.`,
                quality: `good`,
                note: `A reasonable, professional request. The criterion was not disclosed in the job ad — which may breach fair hiring obligations. A human review may reveal your application meets the actual requirements.`,
              },
              {
                id: `b`,
                label: `Thank them for the explanation and drop it.`,
                quality: `poor`,
                note: `You've identified a real problem: an undisclosed AI screening criterion operating on criteria not visible to applicants. Dropping it forfeits your right to challenge — and leaves the same problem in place for the next applicant.`,
              },
            ],
          },
          branches: { a: `outcome_escalated`, b: `outcome_dropped` },
        },
      },

      outcomes: {
        outcome_accepted: {
          heading: `MOVED ON — but didn't have to`,
          tone: `warn`,
          result: `You accepted a rejection from a system that may have screened you incorrectly, on criteria you were never shown. You had the right to ask — and didn't use it.`,
          learning: `Automated hiring rejections aren't final. You have the right to ask why — and in many places, the right to a human review.`,
          outcome_label: `MISSED`,
        },
        outcome_escalated: {
          heading: `CHALLENGED — and it worked`,
          tone: `good`,
          result: `HR acknowledged the discrepancy. Your application went to a human reviewer. You got an interview. The company is now reviewing whether the 5-year threshold should have been disclosed in the job ad.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational. It is increasingly a legal right.`,
          outcome_label: `CHALLENGED`,
        },
        outcome_dropped: {
          heading: `INFORMED — but didn't act`,
          tone: `warn`,
          result: `You found out the criterion. You didn't challenge it. The same tool will screen the next applicant the same way, with the same undisclosed threshold. The ask takes one email.`,
          learning: `Knowing your rights and using them are different things.`,
          outcome_label: `CLOSE CALL`,
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
      context: `Ask hiring organisations to explain AI screening decisions. Australia: equal opportunity legislation. EU: AI Act Article 86. UK: ICO guidance on automated decision-making.`,
    },
  ],
};
