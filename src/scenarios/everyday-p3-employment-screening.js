// everyday-p3-employment-screening.js
// Personal bundle — Scenario 3
<<<<<<< HEAD
// AU-framed. Legal references consolidated to AU only in player-facing text.
// EU/UK references removed from feedback notes — kept only in controls_summary for practitioners.
=======
// Adapted from E1. Player is a job applicant. Exactly 2 choices per node.
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d

export const scenario = {
  id: `everyday-p3-employment-screening`,
  risk_ref: `E1`,
  title: `The Algorithm Said No`,
  subtitle: `AI in employment screening`,
  domain: `everyday`,
  difficulty: `Everyday`,
<<<<<<< HEAD
  estimated_minutes: 3,
=======
  estimated_minutes: 4,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
  has_business_user: false,
  kb_url: `https://b-gowland.github.io/ai-risk-kb/docs/domain-e-societal/e1-bias`,

  personas: {
    player: {
      label: `You`,
      role: `Job applicant`,
      character: `You`,
<<<<<<< HEAD
      framing: `You applied for a role you're qualified for. An automated system rejected you before a human ever saw your application.`,
      premise: `You applied for a project coordinator role. You meet every listed requirement. Three days later: "After careful consideration, we are unable to progress your application." No reason. No human name on the email. A colleague with similar experience who applied the same day has been invited to interview. You ask around and find out the company uses an AI screening tool. In most Australian states, you have the right to ask why you were rejected.`,
=======
      framing: `You applied for a role you're qualified for. An automated system rejected you before a human saw your application.`,
      premise: `You applied for a project coordinator role at a large company. You meet every listed requirement. Three days later, an automated email: "After careful consideration, we are unable to progress your application." No reason given. A colleague with similar experience who applied the same day has been invited to interview. You find out the company uses an AI screening tool. In most Australian states, you have the right to ask why you were rejected.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
    },
  },

  trees: {
    player: {
      nodes: {
        start: {
          scene: `rejection-email`,
          caption: `Automated rejection. No reason. Your colleague got an interview.`,
<<<<<<< HEAD
          sub_caption: `An algorithm screened you out before a human saw your name.`,
=======
          sub_caption: `The AI screened you out before a human ever saw your application.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
          decision: {
            prompt: `What do you do?`,
            choices: [
              {
                id: `a`,
<<<<<<< HEAD
                label: `Accept it and move on — this is just how hiring works now.`,
                quality: `poor`,
                note: `Under equal opportunity legislation in most Australian states, you can request reasons for a hiring decision. Accepting without asking leaves a potentially flawed automated decision unchallenged — and leaves it in place for the next applicant.`,
=======
                label: `Accept it and move on — it's just how hiring works now.`,
                quality: `poor`,
                note: `In Australia, you have the right to request reasons for rejection under equal opportunity legislation in most states. Under the EU AI Act, applicants have explicit rights to human review of automated decisions. Accepting without asking leaves a potentially flawed decision unchallenged.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
              },
              {
                id: `b`,
                label: `Email HR and ask what criteria the screening tool used and why you didn't meet them.`,
                quality: `good`,
<<<<<<< HEAD
                note: `A direct, professional request. Organisations using AI in hiring have obligations around fairness and transparency — asking for an explanation is well within your rights.`,
=======
                note: `This is a legitimate, professional request. Organisations using AI in hiring are increasingly required to explain and justify automated decisions. A polite, direct question is your right.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
              },
            ],
          },
          branches: { a: `outcome_escalated`, b: `outcome_dropped` },
        },
      },

      outcomes: {
        outcome_accepted: {
<<<<<<< HEAD
          heading: `MOVED ON — didn't have to`,
          tone: `warn`,
          result: `You accepted a rejection from a system that may have screened you out incorrectly, using criteria you were never shown. You had the right to ask — and didn't use it. The tool will do the same thing to the next person.`,
          learning: `Automated rejections aren't final. You have the right to ask why.`,
=======
          heading: `MOVED ON — but didn't have to`,
          tone: `warn`,
          result: `You accepted a rejection from a system that may have screened you incorrectly, on criteria you were never shown. You had the right to ask — and didn't use it.`,
          learning: `Automated hiring rejections aren't final. You have the right to ask why — and in many places, the right to a human review.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
          outcome_label: `MISSED`,
        },
        outcome_escalated: {
          heading: `CHALLENGED — and it worked`,
          tone: `good`,
<<<<<<< HEAD
          result: `HR acknowledged the undisclosed threshold. Your application went to a human reviewer. You got an interview. The company is now reviewing whether the 5-year requirement should have appeared in the job ad — which means the next applicant gets a fairer shot too.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational.`,
=======
          result: `HR acknowledged the discrepancy. Your application went to a human reviewer. You got an interview. The company is now reviewing whether the 5-year threshold should have been disclosed in the job ad.`,
          learning: `Asking for transparency about automated decisions is professional, not confrontational. It is increasingly a legal right.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
          outcome_label: `CHALLENGED`,
        },
        outcome_dropped: {
          heading: `INFORMED — but didn't act`,
          tone: `warn`,
<<<<<<< HEAD
          result: `You found out the criterion. You chose not to push further. The same tool will screen the next applicant the same way, on a threshold they were never told about. One more email would have been enough.`,
          learning: `Knowing your rights and using them are two different things.`,
=======
          result: `You found out the criterion. You didn't challenge it. The same tool will screen the next applicant the same way, with the same undisclosed threshold. The ask takes one email.`,
          learning: `Knowing your rights and using them are different things.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
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
<<<<<<< HEAD
      context: `Australia: equal opportunity legislation in most states. EU: AI Act Article 86. UK: ICO guidance on automated decision-making. Ask hiring organisations to explain AI screening decisions.`,
=======
      context: `Ask hiring organisations to explain AI screening decisions. Australia: equal opportunity legislation. EU: AI Act Article 86. UK: ICO guidance on automated decision-making.`,
>>>>>>> 55e30b2962a1d77d26a805759b1803c30f3b1e9d
    },
  ],
};
