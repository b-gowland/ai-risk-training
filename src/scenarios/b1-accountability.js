// B1 — Accountability Gaps
// "Nobody's Problem"
// An APRA supervisory review of a credit AI system reveals no named
// Accountable Person in the AI Register. Each persona navigates the
// accountability failure from their vantage point.
//
// Depth expansion April 2026 — all four personas expanded from 2 to 4
// decisions each. New beats: complication (something pushes back after
// the initial response) and closing synthesis (30 days later, does
// the fix hold?). Converted to template literals throughout.

export const scenario = {
  id:                `b1-accountability`,
  risk_ref:          `B1`,
  title:             `Nobody's Problem`,
  subtitle:          `AI Accountability Gaps`,
  domain:            `B — Governance`,
  difficulty:        `Intermediate`,
  kb_url:             `https://library.airiskpractice.org/docs/domain-b-governance/b1-accountability`,
  estimated_minutes: 16,
  has_business_user: true,

  learning_objectives: [
    `Recognise when shared or implicit accountability has produced a governance gap in practice.`,
    `Understand the difference between naming an Accountable Person and discharging the role.`,
    `Know what durable accountability looks like beyond the immediate regulatory response.`,
  ],
  pass_score: 70,
  regulatory_tags: [`eu-ai-act-article-26`, `nist-ai-rmf-govern-2`, `iso-42001-5`, `jurisdiction-au`],

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Credit Operations Officer`,
      character: `Quinn`,
      icon:      `◇`,
      framing:   `The credit AI makes decisions about your customers every day. The APRA reviewer just asked you who is responsible for it.`,
      premise:   `You are Quinn, a Credit Operations Officer at an APRA-supervised bank. The AI system that supports credit decisions has been running for 18 months. You use it daily. This morning, an APRA supervisory reviewer sat down with your team and asked a simple question: who is accountable for this system's decisions? You looked around the room. Nobody answered.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Risk Officer`,
      character: `Blake`,
      icon:      `◈`,
      framing:   `APRA is asking who owns the credit AI. The AI Register lists a vendor and a team — no named individual.`,
      premise:   `You are Blake, Chief Risk Officer. An APRA supervisory review of your credit AI system is underway. The reviewer has asked for the AI Register entry showing the Accountable Person for the system. Your team has just confirmed: the entry names the model vendor and the technology team, but no specific individual is listed. Under the Financial Accountability Regime, you are accountable for what happens next.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `AI Programme Manager`,
      character: `Avery`,
      icon:      `◎`,
      framing:   `You built the AI Register. The accountability field was left blank because everyone assumed someone else owned it.`,
      premise:   `You are Avery, AI Programme Manager. You designed and maintain the AI Register. When the credit AI was deployed 18 months ago, the Accountable Person field was left blank — the vendor said accountability was shared, the technology team said it belonged to Risk, and Risk said it would be clarified later. It never was. APRA is now asking to see the entry.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Model Risk Analyst`,
      character: `Drew`,
      icon:      `◉`,
      framing:   `You flagged the missing accountability entry six months ago. The issue was closed without resolution.`,
      premise:   `You are Drew, a Model Risk Analyst. During a routine model review six months ago, you flagged that the credit AI's AI Register entry had no named Accountable Person and raised it as a finding. The finding was acknowledged and closed — marked "in progress." Nothing changed. APRA arrived this morning. Your finding report is now part of the supervisory review file.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `The reviewer's question hangs in the air. Nobody in the room answered.`,
          sub_caption: `She makes a note and moves on. You know this isn't over.`,
          decision: {
            prompt: `After the session, your manager asks if you have any context on who the system's owner is. What do you say?`,
            choices: [
              { id: 'a', label: `I've never seen a named owner — it's always been unclear between the vendor and the technology team.`, quality: 'good',
                note: `Accurate and useful. Your honest operational account gives your manager the context to escalate correctly.` },
              { id: 'b', label: `I thought Risk owned it — that's always been my assumption.`, quality: 'partial',
                note: `An assumption is better than nothing but assumptions are what created the gap. Flag it as an assumption, not a fact.` },
              { id: 'c', label: `I'm not sure it's my place to say — that's a governance question above my level.`, quality: 'poor',
                note: `You use this system daily. Your operational perspective is exactly what your manager needs right now. Deferring doesn't help anyone.` },
            ],
          },
          branches: { a: 'n2_clear', b: 'n2_assumption', c: 'outcome_bad' },
        },

        n2_clear: {
          scene:       `office-briefing`,
          caption:     `Your manager thanks you. She confirms the gap has been escalated to the CRO.`,
          sub_caption: `The reviewer has requested a formal response within five business days.`,
          decision: {
            prompt: `The CRO asks your team to document how the system has been operating without a named owner. What do you contribute?`,
            choices: [
              { id: 'a', label: `A clear account of how decisions are made day-to-day and who in practice gets called when something goes wrong.`, quality: 'good',
                note: `This is exactly what the review needs — the operational reality behind the governance gap. Your account helps close it.` },
              { id: 'b', label: `You prefer not to document anything until Legal has reviewed what can be shared with APRA.`, quality: 'partial',
                note: `Legal involvement is appropriate but this framing suggests concealment. The operational facts are not sensitive — the gap is the gap.` },
            ],
          },
          branches: { a: 'n3_contradiction', b: 'n3_legal_hedge' },
        },

        n2_assumption: {
          scene:       `desk-focused`,
          caption:     `Your manager checks with Risk. Risk says they assumed Technology owned it.`,
          sub_caption: `Two layers of assumption. Still no owner.`,
          decision: {
            prompt: `The manager comes back and asks you directly: based on what actually happens day-to-day, who does own this system?`,
            choices: [
              { id: 'a', label: `Nobody does. When something goes wrong, we call the vendor's helpdesk and escalate to Tech. But no single person makes decisions about how we use it.`, quality: 'good',
                note: `This is the truth behind the gap. Your willingness to state it plainly — after the first answer was an assumption — gives your manager the concrete picture she needs.` },
              { id: 'b', label: `In practice, the team leads make the call when it matters. That's where ownership has landed.`, quality: 'partial',
                note: `True but incomplete. Team leads making ad-hoc calls is not accountability — it is the absence of it looking like activity. Say that out loud.` },
            ],
          },
          branches: { a: 'n3_contradiction', b: 'n3_legal_hedge' },
        },

        n3_contradiction: {
          scene:       `desk-colleague`,
          caption:     `A colleague on the same team has given a very different account to the governance team.`,
          sub_caption: `She told them Risk has always owned the system in practice. That contradicts what you said.`,
          decision: {
            prompt: `The governance lead asks which account is correct. What do you do?`,
            choices: [
              { id: 'a', label: `Tell the governance lead both accounts are honest — you've both worked with the system differently. Offer to walk through specific recent decisions so they can see what ownership actually looked like.`, quality: 'good',
                note: `The contradiction is real and useful. Two operational accounts diverging is itself evidence that ownership has not been consistent. Concrete examples move the conversation forward.` },
              { id: 'b', label: `Stick to your account and let your colleague defend hers. The governance team will sort it out.`, quality: 'partial',
                note: `Positionally defensible but unhelpful. The review needs reconciled facts, not competing statements. Collaboration surfaces the truth faster.` },
              { id: 'c', label: `Walk back your account — your colleague has more seniority and may have seen things you haven't.`, quality: 'poor',
                note: `Adjusting what you observed to match someone else's account is not humility — it is removing data the review needs. Both accounts can be honest without either being wrong.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n3_legal_hedge: {
          scene:       `desk-intranet`,
          caption:     `Legal has reviewed your position. They say you can share the operational facts — there is nothing privileged about how the system is used day-to-day.`,
          sub_caption: `The delay has cost two days. The governance team is now working against a tight deadline.`,
          decision: null,
          branches: { auto: 'n4_thirty_days' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days after the APRA review. A named Accountable Person has been appointed. The AI Register has been updated.`,
          sub_caption: `Your team has a new weekly standing item: "Credit AI — incidents, decisions, questions."`,
          decision: {
            prompt: `In the first standing meeting, the new Accountable Person asks for honest input: does the change make any practical difference to how you use the system?`,
            choices: [
              { id: 'a', label: `Yes and no. The register entry is fixed. But we still call the helpdesk first when something is wrong, because nobody has told us to call you. That needs to change if the ownership is going to mean anything.`, quality: 'good',
                note: `This is what durable accountability requires. A register update without operational routing is a paper fix. Naming it to the person who can change it is exactly right.` },
              { id: 'b', label: `It's a clearer structure, which helps. It'll take time to see whether day-to-day operations actually change.`, quality: 'partial',
                note: `Polite but non-actionable. "Time will tell" lets the gap re-form. Naming the specific friction — helpdesk routing — is what makes the ownership live.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Ownership made operational.`,
          tone:     'good',
          result:   `Your honest accounts — through the initial response, the colleague-contradiction reconciliation, and the thirty-day review — move accountability from a register entry to a working relationship. The new Accountable Person updates the incident escalation process so your team calls her first, not the vendor helpdesk. Six months later, APRA's follow-up review notes the operational change specifically as evidence that the accountability fix was genuine.`,
          learning: `Accountability that stops at a register entry is performative. The person closest to an AI system's operation has the most leverage to make ownership real — by naming what still isn't working after the formal fix.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Register fixed. Operation unchanged.`,
          tone:     'warn',
          result:   `The register entry is updated and a named Accountable Person exists. But nobody routes issues to her — the vendor helpdesk is still the default, your team lead still makes most of the judgement calls, and the new owner hears about problems third-hand. The accountability gap has shifted from "no owner" to "owner without operational reach."`,
          learning: `Appointing an Accountable Person is a prerequisite, not a fix. Without operational routing — who gets called, who signs off, who hears about incidents — the named owner is a compliance artefact rather than an active role.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `No account provided.`,
          tone:     'bad',
          result:   `Without your operational perspective, the governance team is working blind on what the system actually does day-to-day. The response to APRA is thin. The reviewer notes that even operational staff could not speak to accountability — which extends the supervisory concern beyond the register entry to the organisation's overall AI governance culture.`,
          learning: `Deferring accountability questions upward without contributing what you know creates a vacuum that regulators notice. Every level has a role in accountability — including the people who use the system.`,
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `The AI Register entry is on the table. The Accountable Person field is blank.`,
          sub_caption: `APRA has five days to receive a formal response.`,
          decision: {
            prompt: `What is your first action?`,
            choices: [
              { id: 'a', label: `Name an Accountable Person immediately, brief them fully, and confirm with APRA that the gap has been remediated.`, quality: 'good',
                note: `The right move. Naming an owner immediately and briefing them properly converts a compliance gap into a governance response. APRA responds better to decisive action than extended review.` },
              { id: 'b', label: `Commission a review to determine who should be named before making any appointment.`, quality: 'partial',
                note: `Methodologically correct but slow. In a five-day window, an extended review risks missing the deadline. Name an interim owner while the review proceeds.` },
              { id: 'c', label: `Respond to APRA that accountability is shared across the risk and technology functions.`, quality: 'poor',
                note: `Shared accountability is no accountability under FAR. APRA will read this as a failure to understand the accountability regime — which compounds the original gap.` },
            ],
          },
          branches: { a: 'n2_name', b: 'n2_review', c: 'outcome_bad' },
        },

        n2_name: {
          scene:       `office-bright`,
          caption:     `You name yourself as interim Accountable Person. The AI Register is updated within the hour.`,
          sub_caption: `Now you need to understand what you are accountable for.`,
          decision: {
            prompt: `The system has been running for 18 months without a named owner. What do you commission immediately?`,
            choices: [
              { id: 'a', label: `A rapid model review: performance, fairness testing results, incident history, and monitoring status — all within the five-day window.`, quality: 'good',
                note: `As Accountable Person you need to know the system's actual state. Commissioning a rapid review before responding to APRA demonstrates you are discharging the role, not just holding the title.` },
              { id: 'b', label: `A board paper on AI governance to be presented at the next meeting — this needs board visibility.`, quality: 'partial',
                note: `Board visibility is appropriate but the timing is wrong. APRA's five-day window needs a response first. Board paper can follow.` },
            ],
          },
          branches: { a: 'n3_chair_scrutiny', b: 'n3_chair_scrutiny' },
        },

        n2_review: {
          scene:       `desk-focused`,
          caption:     `Three days into the review. Two candidates identified. No decision yet.`,
          sub_caption: `Two days until APRA's deadline.`,
          decision: {
            prompt: `The review hasn't converged. APRA's deadline is in 48 hours. What do you do?`,
            choices: [
              { id: 'a', label: `Name yourself as interim Accountable Person now, respond to APRA on time, and continue the review to appoint a permanent owner within 30 days.`, quality: 'good',
                note: `Recoverable. Interim ownership meets the deadline while keeping the substantive review going. The key is that the interim owner is named, not just a role-level label with no individual behind it.` },
              { id: 'b', label: `Request a short extension from APRA on the basis that a proper appointment is in progress.`, quality: 'partial',
                note: `APRA may grant an extension but requesting one signals that the organisation could not name an owner even under regulatory pressure. The interim solution is lower-cost.` },
            ],
          },
          branches: { a: 'n3_chair_scrutiny', b: 'n3_chair_scrutiny' },
        },

        n3_chair_scrutiny: {
          scene:       `boardroom-crisis`,
          caption:     `Board meeting. The Chair has read your response to APRA and raises a question privately afterward.`,
          sub_caption: `"Blake, did you name yourself because it was the right appointment — or because it was the fastest response?"`,
          decision: {
            prompt: `How do you answer the Chair?`,
            choices: [
              { id: 'a', label: `Both, honestly. The speed was necessary for APRA. Whether I am the right permanent owner is a separate question and we are reviewing that alongside the broader appointment framework.`, quality: 'good',
                note: `The honest answer is the strong one. Acknowledging the pressure that drove the speed while keeping the permanent question open demonstrates the governance maturity the Chair is testing for.` },
              { id: 'b', label: `It was the right appointment. The CRO role is the natural Accountable Person for a credit risk AI system.`, quality: 'partial',
                note: `Defensible but closes off the conversation the Chair is trying to have. "The natural owner" is an assertion, not a governance answer. The Chair wants to know if you distinguished speed from fit.` },
              { id: 'c', label: `The speed was the point. We had five days. There wasn't time for a perfect appointment and I made the call.`, quality: 'poor',
                note: `Positions it as decisiveness but reads as dismissive. Chair-level scrutiny of executive appointments under regulatory pressure is exactly the check the role demands. Defending the speed alone tells her you did not think about fit.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days on. The appointment framework review is complete. The recommendation: the Chief Credit Officer should be the permanent Accountable Person for the credit AI, not you.`,
          sub_caption: `The review is credible. You disagree with it.`,
          decision: {
            prompt: `What do you do?`,
            choices: [
              { id: 'a', label: `Accept the recommendation. Brief the CCO fully on the 30 days of your holding the role. Keep FAR-level oversight at your level but transfer operational accountability to her.`, quality: 'good',
                note: `The test of an interim appointment is whether you can hand it back. A CRO who accepts a properly reasoned recommendation against their own preference demonstrates the accountability culture more than any register entry.` },
              { id: 'b', label: `Accept the recommendation but keep the register entry in your name for another 60 days while the CCO gets up to speed.`, quality: 'partial',
                note: `Workable but undermines the recommendation. If the CCO is the right permanent owner, the register should reflect that. Briefing her thoroughly is the right handover mechanism — not delaying the appointment.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Named, briefed, handed over.`,
          tone:     'good',
          result:   `Your response to APRA was on time and credible. Your willingness to be named — and then to accept a review that recommended someone else for the permanent role — sets a governance tone across the organisation. The Chief Credit Officer takes the permanent appointment. You retain FAR-level oversight but operational accountability is where it should be. APRA's follow-up review cites the appointment process as a strength.`,
          learning: `Accountability under regulatory pressure is tested twice: once by the speed of the initial response, and again by whether the response is revisited when pressure eases. A named owner who can be replaced through a proper process is stronger than a named owner who cannot.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Response made. Appointment stuck.`,
          tone:     'warn',
          result:   `APRA's immediate concern is addressed. But the permanent appointment process has either not happened, has been delayed, or has been overridden by the interim appointee's preference to stay. The governance response to the original gap is visible in the register; the cultural response — can the organisation make a correct appointment rather than a convenient one — is less clear.`,
          learning: `An interim appointment that becomes permanent by default is the same governance failure as the original gap: accountability settled by inertia rather than by decision. The test is whether the organisation can replace the interim appointee when that is the right answer.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `Shared accountability rejected.`,
          tone:     'bad',
          result:   `APRA's response to "shared accountability" is unambiguous: the Financial Accountability Regime requires a named individual, not a function or collective. The response is rejected and a formal supervisory letter issued requiring remediation within 30 days. The gap has become a finding.`,
          learning: `Under FAR and equivalent accountability regimes, shared accountability is not accountability. Regulators are explicit on this: a named individual must be identifiable and reachable when something goes wrong.`,
          score:    0,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       `desk-intranet`,
          caption:     `The AI Register is open in front of you. The Accountable Person field has been blank for 18 months.`,
          sub_caption: `APRA found it in 20 minutes.`,
          decision: {
            prompt: `The CRO asks how this happened. What do you tell her?`,
            choices: [
              { id: 'a', label: `The field was left blank because accountability was genuinely contested at deployment — vendor, technology, and risk all declined ownership. I should have escalated rather than left it open.`, quality: 'good',
                note: `Honest and takes appropriate responsibility. The CRO needs the root cause, not a managed account. This answer gives her both the systemic explanation and the individual decision point.` },
              { id: 'b', label: `The register template didn't make the field mandatory — it was a process design gap, not an individual failure.`, quality: 'partial',
                note: `Technically accurate but incomplete. A non-mandatory field doesn't explain 18 months without resolution. The process gap is real but so is the failure to escalate.` },
              { id: 'c', label: `The technology team confirmed they would fill it in after go-live. I assumed they had.`, quality: 'poor',
                note: `Shifting responsibility to another team under regulatory scrutiny creates a credibility problem. Even if true, the register is your responsibility to maintain — assumptions are not a defence.` },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_process', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       `office-bright`,
          caption:     `The CRO accepts your account. She asks what the register needs to prevent this recurring.`,
          sub_caption: `You have an opportunity to fix the system, not just the entry.`,
          decision: {
            prompt: `What is your primary recommendation?`,
            choices: [
              { id: 'a', label: `Make the Accountable Person field mandatory with a named individual — not a team — and block AI Register submission without it. Add a quarterly review to confirm owners are still current.`, quality: 'good',
                note: `Addresses the root cause: a non-mandatory field and no review cycle. Making it blocking and adding a review cycle closes both gaps.` },
              { id: 'b', label: `Add guidance text to the field explaining what an Accountable Person is and why it must be named.`, quality: 'partial',
                note: `Guidance is useful but won't prevent blank fields. A mandatory blocking control is more durable than explanatory text.` },
            ],
          },
          branches: { a: 'n3_it_pushback', b: 'n3_it_pushback' },
        },

        n2_process: {
          scene:       `desk-working`,
          caption:     `The CRO notes that the template is your responsibility. The process gap doesn't explain why it wasn't fixed.`,
          sub_caption: `She asks you to come back with a root cause and a fix.`,
          decision: {
            prompt: `You have one day to come back. What is the root cause you name?`,
            choices: [
              { id: 'a', label: `Register governance has no ownership. I build it, but nobody reviews what I ship or catches blanks in production. That's why a blank field survived 18 months. The fix is making the field blocking and adding a governance check on the register itself.`, quality: 'good',
                note: `Correct root cause. The register has been orphaned — by the same kind of gap it was supposed to prevent. Naming it completes the analogy and points at the fix.` },
              { id: 'b', label: `Insufficient template validation. The fix is a technical one — add field validation to block submission with blank mandatory fields.`, quality: 'partial',
                note: `Half the answer. Validation fixes the symptom; ownership of the register fixes the cause. A register with a blank field today had no owner watching yesterday.` },
            ],
          },
          branches: { a: 'n3_it_pushback', b: 'n3_it_pushback' },
        },

        n3_it_pushback: {
          scene:       `boardroom`,
          caption:     `You propose the blocking field change to the technology change advisory board.`,
          sub_caption: `IT pushes back: "This will block urgent deployments. We can't have that in incident scenarios."`,
          decision: {
            prompt: `How do you respond to the pushback?`,
            choices: [
              { id: 'a', label: `Incident deployments need accountability more than routine ones. Propose an emergency override that requires the CRO to sign as interim Accountable Person, auto-notifies governance, and creates a 7-day deadline for permanent appointment.`, quality: 'good',
                note: `The objection is real and the response is better than the original proposal. Overrides with attribution and deadlines preserve the control while allowing urgent action.` },
              { id: 'b', label: `Offer to exempt incident deployments from the blocking requirement. Routine deployments will still require a named owner.`, quality: 'partial',
                note: `Creates exactly the loophole that caused the original gap. "Urgent" becomes the category where accountability does not apply — and that category grows.` },
              { id: 'c', label: `Hold the line. The blocking field stays. IT will adapt their process.`, quality: 'poor',
                note: `Correct on principle, wrong on delivery. Ignoring a legitimate operational concern loses the CAB and makes the control a target for workarounds after launch.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'outcome_warn', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days after the change. The blocking field is live. Six new AI systems have registered — all with named owners.`,
          sub_caption: `The emergency override has been used once. It worked as designed.`,
          decision: {
            prompt: `The CRO asks you for a 90-day review metric. What do you propose?`,
            choices: [
              { id: 'a', label: `Track three things: registration rate of new systems, override usage and resolution, and quarterly review completion for named owners still active in their roles.`, quality: 'good',
                note: `Three complementary signals: adoption, exception discipline, and ongoing validity. Together they test whether the control is working and whether the named ownership is live.` },
              { id: 'b', label: `Track registration rate of new systems. If it stays above 95%, the control is working.`, quality: 'partial',
                note: `Necessary but not sufficient. A high registration rate tells you the field is being filled — not that the owners are active, or that overrides are being resolved, or that the accountability is real.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Register fixed at the system level.`,
          tone:     'good',
          result:   `Your honest account of the root cause, your blocking field change with a principled override, and your three-signal review metric together close the gap both mechanically and culturally. The register moves from a document that could be blank to an active control with feedback loops. Within six months, two new systems that would previously have been deployed without named owners are caught at registration. The APRA follow-up review references the change as an example of systemic remediation.`,
          learning: `Governance controls fail when they are optional and when they have no owner. Making the control blocking fixes the first; naming an owner for the control itself fixes the second. The override mechanism matters because unrealistic controls are the ones that get bypassed.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Gap acknowledged. Fix partial.`,
          tone:     'warn',
          result:   `A change is made — guidance text, an exemption carve-out, or a blocking field with no override, depending on which path you took. Each fixes part of the problem. Each leaves a visible gap: blank fields continue, urgent deployments skip the control entirely, or CAB relationships sour and the control is quietly diluted. Within a year, one of those gaps produces another register entry without a named owner.`,
          learning: `Controls that address form without addressing substance — or substance without accommodating legitimate operational pressure — reproduce the original failure mode in a new shape.`,
          score:    45,
        },
        outcome_bad: {
          heading:  `Accountability deflected.`,
          tone:     'bad',
          result:   `The technology team is consulted. They confirm they were told accountability would be handled by Risk post-deployment. Risk confirms they said the same thing about Technology. The root cause is exactly what you described to yourself — contested ownership left unresolved — but you deflected rather than owning your part in it. The CRO asks why you didn't escalate when the field stayed blank.`,
          learning: `Register administrators are accountable for register completeness. Pointing to another team when a field stays blank for 18 months does not answer the question of why it wasn't escalated.`,
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       `desk-reading`,
          caption:     `Your finding from six months ago is in the APRA review file. It was closed without resolution.`,
          sub_caption: `The reviewer has asked to speak with you directly.`,
          decision: {
            prompt: `The APRA reviewer asks what happened when you raised the finding. What do you say?`,
            choices: [
              { id: 'a', label: `I raised it as a finding in the model review. It was acknowledged and closed as in-progress. I didn't follow up when nothing changed.`, quality: 'good',
                note: `Accurate and complete — including the part where you didn't follow up. The reviewer has the file. A complete account protects you and gives APRA the full picture.` },
              { id: 'b', label: `I raised it and it was closed. I assumed it had been addressed.`, quality: 'partial',
                note: `An assumption after a finding is closed without evidence of remediation is weaker than it sounds. The reviewer will probe what "assumed" means.` },
              { id: 'c', label: `I raised it and was told it was being handled. That was the end of my responsibility for it.`, quality: 'poor',
                note: `A finding closed without evidence of resolution is not handled. Framing it as the end of your responsibility may be technically defensible but reads poorly in a regulatory context.` },
            ],
          },
          branches: { a: 'n2_full', b: 'n2_assumption', c: 'outcome_bad' },
        },

        n2_full: {
          scene:       `office-meeting`,
          caption:     `The reviewer thanks you. She asks what the finding process should require to prevent this happening again.`,
          sub_caption: `Your view — as the person who raised it — is directly relevant.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `Findings related to accountability and regulatory obligations should require evidence of remediation before closure — not just a status change. And a re-raise protocol if no evidence arrives within 30 days.`, quality: 'good',
                note: `Addresses both failure modes: closure without evidence and no follow-up mechanism. This is a systemic fix, not just a rule change.` },
              { id: 'b', label: `Findings should require sign-off from a more senior reviewer before closure.`, quality: 'partial',
                note: `Senior sign-off helps but doesn't prevent a senior reviewer closing a finding without evidence either. Evidence of remediation is the key requirement.` },
            ],
          },
          branches: { a: 'n3_loyalty_test', b: 'n3_loyalty_test' },
        },

        n2_assumption: {
          scene:       `desk-focused`,
          caption:     `The reviewer asks what "assumed" means in this context. You don't have a good answer.`,
          sub_caption: `She returns to the finding log. The closure note says "in progress." Nothing more.`,
          decision: {
            prompt: `She gives you the chance to reframe. "Let me ask again — what did you do after the finding was closed?"`,
            choices: [
              { id: 'a', label: `Nothing. I didn't re-raise it and I didn't check for evidence of remediation. The closure note satisfied me at the time, and that was the wrong call.`, quality: 'good',
                note: `The second chance is genuine. A direct, self-critical answer recovers significant credibility — it shows the analyst can see the failure mode without the regulator having to point it out.` },
              { id: 'b', label: `I moved on to the next model review. The finding was formally closed and my remit was the next model on the schedule.`, quality: 'partial',
                note: `Accurate but defensive. The reviewer is offering room to reflect — "I was following the process" uses that room to justify rather than examine. Partial recovery at best.` },
            ],
          },
          branches: { a: 'n3_loyalty_test', b: 'n3_loyalty_test' },
        },

        n3_loyalty_test: {
          scene:       `desk-colleague`,
          caption:     `After the APRA session, your manager asks to speak with you privately.`,
          sub_caption: `"Drew — was it necessary to tell APRA that the finding was closed without resolution? That's going to make the whole team look bad."`,
          decision: {
            prompt: `How do you respond to your manager?`,
            choices: [
              { id: 'a', label: `Yes. The reviewer already had the finding file — concealing or softening the account would have damaged us more, and it's also just what happened. The better question is how we make sure the next finding doesn't close the same way.`, quality: 'good',
                note: `Correct on two levels: factually defending the candour, and redirecting the conversation from team reputation to systemic fix. A regulator finding a gap that staff downplay is much worse than a gap that staff name.` },
              { id: 'b', label: `I gave the answer that was asked. I understand it's uncomfortable but I don't think I had a real choice in the moment.`, quality: 'partial',
                note: `Defensible but avoids the underlying issue: the manager is suggesting candour damaged the team. That framing needs to be pushed back on, not just deflected. Teams are not damaged by truthful accounts of findings they did not close.` },
              { id: 'c', label: `Apologise for the way it came across. Offer to help frame a team-level response that provides more context.`, quality: 'poor',
                note: `Shifts from an accurate account to a reputational repair exercise. APRA has the file — the only thing "more context" can do now is contradict what you already said truthfully, which multiplies the original problem.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days on. Evidence-based closure is now required for findings. A re-raise protocol is live.`,
          sub_caption: `You have a new finding on a different model — no Accountable Person, same pattern as six months ago.`,
          decision: {
            prompt: `The team lead says the finding will be closed once the register is updated. How do you proceed?`,
            choices: [
              { id: 'a', label: `Apply the new protocol. Require evidence that the register is updated with a named individual — not just a commitment to update — and set the 30-day re-raise clock. Document both in the finding log.`, quality: 'good',
                note: `The protocol only works if it is applied unevenly to nobody — including colleagues. Using it on a peer-level finding is the test of whether the process change is real.` },
              { id: 'b', label: `Flag it to the team lead that the new protocol applies and ask her to handle the closure process.`, quality: 'partial',
                note: `Technically correct but delegates the discipline. The analyst who raised the original finding is the best person to apply the new rule to a similar one. Handing it off risks the protocol becoming optional in practice.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Finding followed through — and the next one too.`,
          tone:     'good',
          result:   `Your complete account to APRA — including the follow-up failure — gives the reviewer the full picture. Your recommendation for evidence-based closure and a re-raise protocol is adopted. Your direct response to your manager's loyalty framing preserves the organisation's ability to treat findings honestly. And when the same pattern appears in a new finding thirty days later, you apply the new protocol without hesitation. The APRA follow-up review cites the analyst function as a strength.`,
          learning: `Raising a finding is the first step. Following through when it is closed without evidence is the second. Defending the candour that made the finding usable to a regulator is the third. Applying the new process to the next similar case is the fourth — and it is the one that tests whether anything has really changed.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Finding raised. Culture unchanged.`,
          tone:     'warn',
          result:   `The protocol is implemented in form. But either the account to APRA was hedged, or the loyalty framing was accommodated, or the new rule was not applied to the next peer-level finding. The mechanical fix is in place; the cultural conditions that let the original finding close without resolution are still present. The next finding will test the protocol, and the protocol may not hold.`,
          learning: `Process improvements that address form without addressing the culture around them reproduce the same gap in a more credentialed wrapper. The protocol is only as strong as the willingness of analysts to apply it when doing so is awkward.`,
          score:    55,
        },
        outcome_bad: {
          heading:  `Incomplete account.`,
          tone:     'bad',
          result:   `The reviewer probes the word "handled." The finding log shows the finding was closed with a status change and no evidence of remediation. Your account of having assumed it was resolved is inconsistent with what the log shows. She asks whether you reviewed the closure. The answer is no.`,
          learning: `A finding closed without evidence of remediation is not closed. Assuming otherwise — without checking — converts a completed process step into an open risk that compounds over time.`,
          score:    15,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: `AI Register with named owners`,
      effort: 'Medium', owner: `Risk`, go_live: true,
      context: `The credit AI had an AI Register entry — but the Accountable Person field was blank. A register that allows blank mandatory fields is not a control. The fix is making named ownership a blocking requirement before an entry can be submitted, with an emergency override that still attributes accountability.`,
    },
    {
      id: 'c2', label: `FAR/accountability mapping`,
      effort: 'Low', owner: `Compliance`, go_live: true,
      context: `Under the Financial Accountability Regime, accountability cannot be shared or assigned to a vendor. The review exposed that no mapping to a named FAR Accountable Person had ever been done for this system — despite it making credit decisions for 18 months.`,
    },
    {
      id: 'c3', label: `Evidence-based finding closure`,
      effort: 'Low', owner: `Risk`, go_live: true,
      context: `The analyst's original finding was closed without evidence of remediation — just a status change. The systemic fix is requiring evidence of remediation for closure of any finding related to accountability or regulatory obligations, plus a 30-day re-raise protocol if evidence does not arrive.`,
    },
    {
      id: 'c4', label: `Third-party accountability clauses`,
      effort: 'Medium', owner: `Legal`, go_live: true,
      context: `The vendor declined ownership at deployment and the organisation accepted that position. A contract clause explicitly allocating accountability to the deploying organisation — not the vendor — would have prevented the contested ownership from becoming a permanent gap.`,
    },
    {
      id: 'c5', label: `RACI for AI lifecycle`,
      effort: 'Low', owner: `Risk`, go_live: false,
      context: `When something went wrong with the system, nobody knew who had authority to pause it. The RACI defines not just who owns accountability but who can act in an incident — a question APRA asked and the organisation could not answer.`,
    },
  ],
};
