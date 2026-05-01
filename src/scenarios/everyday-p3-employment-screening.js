// everyday-p3-employment-screening.js
// Personal bundle — Scenario 3
// AU-framed. Legal references consolidated to AU only in player-facing text.
// EU/UK references removed from feedback notes — kept only in controls_summary for practitioners.

export const scenario = {
  id: `everyday-p3-employment-screening`,
  risk_ref: `E1`,
  title: `The Algorithm Said No`,
  subtitle: `AI in employment screening`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 3,
  has_business_user: false,
  kb_url: `https://b-gowland.github.io/ai-risk-kb/docs/domain-e-societal/e1-bias`,

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
                note: `Under equal opportunity legislation in most Australian states, you can request reasons for a hiring decision. Accepting without asking leaves a potentially flawed automated decision unchallenged — and leaves it in place for the next applicant.`,
              },
              {
                id: `b`,
                label: `Email HR and ask what criteria the screening tool used and why you didn't meet them.`,
                quality: `good`,
                note: `A direct, professional request. Organisations using AI in hiring have obligations around fairness and transparency — asking for an explanation is well within your rights.`,
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
            prompt: `A criterion that wasn't disclosed screened you out. What do you do?`,
            choices: [
              {
                id: `a`,
                label: `Point out the discrepancy and ask for your application to go to a human reviewer.`,
                quality: `good`,
                note: `Entirely reasonable. The criterion wasn't in the job ad — which raises a real question about fair hiring practice. A human review may find your application meets the actual requirements for the role.`,
              },
              {
                id: `b`,
                label: `Thank them for explaining and leave it there.`,
                quality: `poor`,
                note: `You've identified a real problem — an undisclosed screening criterion. Dropping it means the same tool will screen the next candidate the same way, on criteria they were never shown. The ask takes one more email.`,
              },
            ],
          },
          branches: { a: `outcome_escalated`, b: `outcome_dropped` },
        },
      },

      outcomes: {
        outcome_accepted: {
          heading: `MOVED ON — didn't have to`,
          tone: `warn`,
          result: `You accepted a rejection from a system that may have screened you out incorrectly, using criteria you were never shown. You had the right to ask — and didn't use it. The tool will do the same thing to the next person.`,
          learning: `Automated rejections aren't final. You have the right to ask why.`,
          outcome_label: `MISSED`,
        },
        outcome_escalated: {
          heading: `CHALLENGED — and it worked`,
          tone: `good`,
          result: `HR acknowledged the undisclosed threshold. Your application went to a human reviewer. You got an interview. The company is now reviewing whether the 5-year requirement should have appeared in the job ad — which means the next applicant gets a fairer shot too.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational.`,
          outcome_label: `CHALLENGED`,
        },
        outcome_dropped: {
          heading: `INFORMED — but didn't act`,
          tone: `warn`,
          result: `You found out the criterion. You chose not to push further. The same tool will screen the next applicant the same way, on a threshold they were never told about. One more email would have been enough.`,
          learning: `Knowing your rights and using them are two different things.`,
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
      context: `Australia: equal opportunity legislation in most states. EU: AI Act Article 86. UK: ICO guidance on automated decision-making. Ask hiring organisations to explain AI screening decisions.`,
    },
  ],
};
