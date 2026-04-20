// F3 — The Expanding Tool
// AI Scope Creep & Use Case Drift
//
// Setting: A credit scoring AI approved for Australian customers is quietly
// extended to New Zealand by a business unit without reassessment. A compliance
// review surfaces the gap. The AI Register entry says Australia only.
//
// Differentiation from other live scenarios:
//   B2 (The Deadline Creep): Compliance failure at deployment — the tool was
//     never assessed. F3 is different: the tool WAS properly assessed and approved
//     for a specific scope. The failure is unauthorised expansion of that scope
//     after deployment, through individually reasonable-looking steps.
//   B3 (Still Running): Lifecycle failure — a system running past its review date.
//     F3 is active scope expansion, not passive neglect.
//   The core tension: the NZ deployment "worked" — no complaints, no incidents.
//   Scope creep is invisible until something forces a look.

export const scenario = {
  id:                `f3-scope-creep`,
  risk_ref:          `F3`,
  title:             `The Expanding Tool`,
  subtitle:          `AI Scope Creep & Unauthorised Use Case Expansion`,
  domain:            `F — Deployment & Operations`,
  difficulty:        `Foundational`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-f-deployment/f3-scope-creep`,
  estimated_minutes: 11,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Credit Operations Analyst`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `Your team has been running New Zealand credit applications through the Australian AI scoring model for four months. It works fine. Now compliance is asking questions.`,
      premise:   `You work in credit operations. Four months ago your manager asked you to start running NZ applications through the AU credit scoring model — the NZ pipeline was backlogged and the AU model was available. It produced results that seemed reasonable and the NZ team was happy. Nobody raised a concern until last week, when a compliance analyst noticed the NZ volume in the AU model's usage logs and asked whether a separate assessment had been done for NZ. You said you weren't sure. Now it's been escalated.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Risk Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `Your AI Register shows the credit scoring model is approved for Australia only. It has been running NZ applications for four months. No change request was ever raised.`,
      premise:   `The compliance team has flagged it: the AU credit scoring model has been processing NZ applications since Q3. The AI Register entry is unambiguous — the model was assessed and approved for Australian consumer credit obligations under the National Consumer Credit Protection Act. New Zealand has different obligations under the Credit Contracts and Consumer Finance Act. No jurisdictional reassessment was ever done. No change request was raised. Four months of NZ decisions have been made by a model that was never validated for that market.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Credit Systems Project Manager`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You manage the credit scoring system. The AI Register is your responsibility. You never received a change request for the NZ expansion — because nobody knew they needed to raise one.`,
      premise:   `The credit scoring model is one of eight AI systems in your portfolio. The AI Register entry is current — assessed, approved, AU scope only. You never received a change request for a NZ extension. When you trace the NZ volume, you find the expansion started when a credit operations manager routed NZ applications through the AU pipeline to clear a backlog. There was no malicious intent. Nobody knew a change request was required. But four months of NZ credit decisions have been made outside the model\'s validated scope. The CRO wants to know how this happened and what changes.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Risk & Compliance Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You found the NZ volume in the usage logs during a routine review. Now you need to assess the materiality of the exposure and what regulatory notification might be required.`,
      premise:   `You flagged it during a monthly usage log review — NZ application volume in the AU model going back four months. The AI Register says AU only. You\'ve escalated to the CRO. Now she\'s asking you: how material is this? What are the regulatory implications? Were any NZ customers potentially harmed by a model not validated for their jurisdiction? You have the NZ decision data. You need to assess the exposure before the CRO decides whether regulatory notification is required.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `Compliance is asking whether a separate assessment was done for the NZ deployment. The answer is: you don\'t know. Your manager told you to run NZ applications through the AU model. You did.`,
          sub_caption: `The model produced results that seemed reasonable. Nobody raised a concern — until now.`,
          decision: {
            prompt: `Compliance wants to understand how the NZ applications started going through the AU model. What do you tell them?`,
            choices: [
              { id: `a`, label: `Give a full account — your manager directed you to use the AU model for NZ applications, and you have the email trail`, quality: `good`,
                note: `Accurate and complete. The compliance team needs to understand the decision chain. Providing the email trail means the investigation goes to the right place.` },
              { id: `b`, label: `Say it was a temporary measure to clear the backlog and you assumed someone had approved it`, quality: `partial`,
                note: `Partially accurate. But "assumed someone had approved it" obscures that there was a specific direction from your manager. The investigation needs the full picture.` },
              { id: `c`, label: `Say you were following instructions and it\'s not your responsibility to know whether the model was approved for NZ`, quality: `poor`,
                note: `Technically you were following instructions. But declining to provide information that helps compliance understand the situation doesn\'t serve you or the organisation.` },
            ],
          },
          branches: { a: `n2_transparent`, b: `n2_partial`, c: `n2_deflects` },
        },

        n2_transparent: {
          scene:       `office-briefing`,
          caption:     `Compliance has the email trail. Your manager is now part of the investigation. The question moves up the chain — who approved the backlog decision and why no change request was raised.`,
          sub_caption: `You\'re no longer the focus. The system gap is.`,
          decision: {
            prompt: `Compliance asks whether you were aware of the AI Register or the requirement to raise a change request for scope expansions. What do you say?`,
            choices: [
              { id: `a`, label: `Honestly: you knew the model had an AI Register entry but didn\'t know scope expansions required a change request`, quality: `good`,
                note: `This is probably accurate and it\'s the important finding — if you didn\'t know, others probably don\'t either. That\'s a communication gap in the governance framework.` },
              { id: `b`, label: `Say you were aware but relied on your manager to handle the governance side`, quality: `partial`,
                note: `If true, say it. But if you weren\'t actually aware of the change request requirement, saying you were creates a false picture of the governance awareness level.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_partial: {
          scene:       `desk-colleague`,
          caption:     `Compliance asks who gave the instruction. You say you\'re not sure of the exact source. They find the email trail anyway — it takes them three more days.`,
          sub_caption: `The investigation reaches the same place. It just took longer.`,
          decision: {
            prompt: `Compliance has the full picture now. They note the delay in providing it. What do you say?`,
            choices: [
              { id: `a`, label: `Acknowledge you should have been more direct and provide any other information that might be relevant`, quality: `good`,
                note: `Acknowledging the gap and being forthcoming now is the right move. The investigation is still in progress.` },
              { id: `b`, label: `Explain that you were trying to protect your manager while the facts were unclear`, quality: `poor`,
                note: `Compliance investigations require accurate information, not protected narratives. Framing incomplete disclosure as protection doesn\'t land well.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_deflects: {
          scene:       `office-meeting`,
          caption:     `Compliance finds the email trail through log analysis. Your manager confirms you were following their direction. Your deflection has added no value to the investigation and has been noted.`,
          sub_caption: `The investigation still reaches the right conclusion. You\'re just not part of the solution.`,
          decision: {
            prompt: `The investigation is complete. The CRO is implementing governance changes. What do you take away from this?`,
            choices: [
              { id: `a`, label: `The change request requirement wasn\'t communicated clearly — that gap is as important as the specific NZ decision`, quality: `good`,
                note: `Correct. The system gap matters as much as the specific incident. Making that observation, even after the fact, is constructive.` },
              { id: `b`, label: `If your manager directs you to do something, it\'s their responsibility to ensure it\'s within governance`, quality: `poor`,
                note: `Partly true. But if you encounter something that seems like it might need approval, asking the question is always available to you regardless of who gave the direction.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Full account provided, governance gap identified`,
          tone:    `good`,
          result:  `Your transparent account helped the investigation reach the right conclusion quickly. The finding that change request requirements weren\'t widely understood led to a communication programme for all AI system users. The NZ exposure was quantified and managed. Your contribution to identifying the governance gap was noted in the remediation report.`,
          learning: `Scope creep often happens because the people making operational decisions don\'t know a governance process exists, not because they deliberately bypass it. Identifying that gap is as important as fixing the specific incident.`,
          score:   100,
        },
        outcome_good: {
          heading: `Account given, investigation supported`,
          tone:    `good`,
          result:  `The investigation reached the right conclusion. Your account was accurate, if not complete. The governance gap was identified and addressed. No adverse findings were directed at you personally.`,
          learning: `In compliance investigations, complete and timely information matters. The investigation reaches the right place eventually — but the speed and quality of the response shapes how the organisation learns from the incident.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Delayed disclosure, investigation extended`,
          tone:    `warn`,
          result:  `The investigation took longer than it needed to. The CRO noted the delay in her remediation report. The governance changes were implemented — but the three additional days spent finding information that was available from day one meant the NZ customer review ran later than it should have.`,
          learning: `In a compliance investigation, the person with the most direct information is in the best position to help it resolve quickly. Partial disclosure extends the timeline and rarely protects anyone.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Deflection noted, no contribution to remediation`,
          tone:    `bad`,
          result:  `The investigation reached the right conclusion without your help. The governance gap was fixed. But your role in the incident — and your response to the investigation — meant you had no part in shaping the remediation. The change request communication programme that followed could have reflected your direct experience of the gap. It didn\'t.`,
          learning: `The people closest to an incident have the most useful perspective on why governance gaps exist in practice. Deflection means that perspective is lost from the remediation.`,
          score:   10,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `Four months of NZ credit decisions made by a model validated only for Australian consumer credit obligations. No change request raised. No jurisdictional assessment done. The AI Register entry is clear.`,
          sub_caption: `The question isn\'t whether a governance failure occurred. It\'s how to respond to it.`,
          decision: {
            prompt: `What is your immediate priority?`,
            choices: [
              { id: `a`, label: `Halt the NZ deployment immediately and commission a materiality assessment of the four months of decisions`, quality: `good`,
                note: `Stop the bleeding first. The materiality assessment tells you whether regulatory notification is required and how many customers may have been affected.` },
              { id: `b`, label: `Commission a root cause investigation before halting — understand what happened before acting`, quality: `partial`,
                note: `Root cause matters, but the deployment is still running. Continuing to process NZ applications through an unvalidated model while the investigation runs extends the exposure.` },
              { id: `c`, label: `Commission a fast-track NZ jurisdictional assessment — if it passes, regularise the deployment retroactively`, quality: `poor`,
                note: `Retroactive validation doesn\'t cover the four months of decisions already made under an unvalidated model. And a fast-tracked assessment may not be robust enough to meet the standard that should have been applied before deployment.` },
            ],
          },
          branches: { a: `n2_halted`, b: `n2_investigate_first`, c: `n2_retroactive` },
        },

        n2_halted: {
          scene:       `desk-report`,
          caption:     `NZ deployment halted. Materiality assessment underway. The analyst has identified four months of decisions — 847 NZ credit applications. The question is whether any customers received decisions they wouldn\'t have received under a correctly validated model.`,
          sub_caption: `The answer determines whether regulatory notification is required.`,
          decision: {
            prompt: `The materiality assessment is going to take two weeks. The NZ business unit is pushing to restore service — they have backlogged applications. How do you respond?`,
            choices: [
              { id: `a`, label: `Hold the halt until the materiality assessment completes — two weeks of backlog is manageable, unknown regulatory exposure is not`, quality: `good`,
                note: `Correct sequencing. The materiality assessment determines your regulatory obligations. Restoring service before knowing your position creates additional risk.` },
              { id: `b`, label: `Allow NZ applications to resume under enhanced monitoring while the assessment runs`, quality: `partial`,
                note: `Enhanced monitoring reduces but doesn\'t eliminate the risk. And it complicates the materiality assessment — you\'re now assessing a moving target.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_investigate_first: {
          scene:       `office-meeting`,
          caption:     `The root cause investigation runs for five days. During that time, 200 additional NZ applications are processed through the unvalidated model.`,
          sub_caption: `The investigation finds what the compliance team already suspected. The deployment is halted on day six.`,
          decision: {
            prompt: `The deployment is now halted. The materiality assessment covers 1,047 applications — 200 more than if you\'d halted immediately. What do you tell the board?`,
            choices: [
              { id: `a`, label: `Full transparency: the halt was delayed while the root cause was investigated, which extended the exposure`, quality: `good`,
                note: `The board needs accurate information to provide oversight. The sequencing decision is worth explaining — and acknowledging if it was wrong.` },
              { id: `b`, label: `Present the total exposure as the scope of the incident without noting the five-day continuation`, quality: `poor`,
                note: `The board\'s oversight role depends on accurate sequencing information. Presenting the total without noting the continuation obscures a decision they need to evaluate.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_retroactive: {
          scene:       `desk-focused`,
          caption:     `Legal has reviewed the retroactive validation approach. Their advice: a fast-tracked assessment does not remediate the four months of decisions made without valid assessment. The regulatory exposure exists regardless.`,
          sub_caption: `You\'re back to the materiality question.`,
          decision: {
            prompt: `Legal has closed the retroactive path. What now?`,
            choices: [
              { id: `a`, label: `Halt the NZ deployment and commission a full materiality assessment — the correct sequence, now delayed`, quality: `good`,
                note: `The right answer, arrived at later. The delay has extended the exposure but the path is now clear.` },
              { id: `b`, label: `Continue the NZ deployment while commissioning a full jurisdictional assessment — at least the assessment is now underway`, quality: `poor`,
                note: `Continuing a deployment that Legal has confirmed creates regulatory exposure, while waiting for an assessment to complete, is not a defensible position.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Deployment halted, materiality assessed, clean outcome`,
          tone:    `good`,
          result:  `The materiality assessment found no evidence that NZ customers received materially different outcomes than they would have under a correctly validated model — but the documentation gap existed regardless. The NZ Commerce Commission was notified proactively. They noted the prompt halt and transparent notification positively. A proper NZ jurisdictional assessment was completed and the deployment was re-approved on that basis.`,
          learning: `The governance failure was the absence of a change request. The response — halt, assess, notify, re-validate — is the correct sequence. Proactive notification to regulators, before they ask, is almost always the better approach.`,
          score:   100,
        },
        outcome_good: {
          heading: `Good outcome, slightly extended exposure`,
          tone:    `good`,
          result:  `The materiality assessment was completed with the deployment running under monitoring. The findings were the same — no material harm identified. But the period under enhanced monitoring added complexity to the assessment and extended the timeline by a week. The regulatory notification went in on time. The re-validation was completed.`,
          learning: `Halting first simplifies the materiality assessment and removes ongoing regulatory risk. Enhanced monitoring is a reasonable risk mitigation, but it\'s a more complex path than a clean halt.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Extended exposure, transparent board briefing`,
          tone:    `warn`,
          result:  `The additional 200 applications extended the regulatory exposure. The board was briefed accurately — they noted the sequencing decision. The materiality assessment found no evidence of harm. The regulatory notification disclosed the full picture including the five-day continuation. The regulator\'s response noted the extended period.`,
          learning: `In AI governance incidents, the sequence of the response matters as much as the eventual outcome. Decisions made in the first 24 hours shape the regulatory and reputational trajectory of the incident.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Exposure extended, board misled`,
          tone:    `bad`,
          result:  `The deployment continued for three additional weeks before the full assessment completed and the halt was implemented. The regulatory notification disclosed the full timeline — including the continuation period after the risk was known. The regulator\'s review focused heavily on the decision to continue after Legal\'s advice. The board, having received incomplete information, was not positioned to intervene earlier.`,
          learning: `Continuing a deployment after Legal has confirmed regulatory exposure is a decision that requires board visibility. Boards cannot exercise oversight over information they don\'t have.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ─────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-intranet`,
          caption:     `The AI Register entry is clear: AU scope only. No change request was ever raised for NZ. The expansion happened because nobody in the credit operations team knew they needed to raise one.`,
          sub_caption: `The governance framework existed. The communication of it didn\'t.`,
          decision: {
            prompt: `The CRO wants to know how this happened and what changes. Where do you start?`,
            choices: [
              { id: `a`, label: `Audit how the change request requirement is communicated to AI system users — and who actually knows it exists`, quality: `good`,
                note: `The NZ expansion happened because a credit operations team didn\'t know the governance process existed. That\'s a communication failure, not just an individual one.` },
              { id: `b`, label: `Add a mandatory change request field to the AI Register that system owners must review quarterly`, quality: `partial`,
                note: `A useful process improvement. But it addresses system owners, not the operational teams making day-to-day usage decisions. The NZ expansion was made by operations, not the system owner.` },
              { id: `c`, label: `Implement usage monitoring that alerts when new geography appears in the model\'s application volume`, quality: `partial`,
                note: `Also useful — detective control. But it doesn\'t address the preventive gap: operations teams should know before they use the model in a new context, not after.` },
            ],
          },
          branches: { a: `n2_communication`, b: `n2_register`, c: `n2_monitoring` },
        },

        n2_communication: {
          scene:       `office-meeting-aftermath`,
          caption:     `You survey credit operations. Of 14 staff who regularly use AI-assisted tools, three know that scope expansions require a change request. Eleven don\'t.`,
          sub_caption: `The governance framework is real. The awareness of it is not.`,
          decision: {
            prompt: `You have a clear finding. What do you recommend to the CRO?`,
            choices: [
              { id: `a`, label: `Two changes: a communication programme for operational AI users, and automated usage monitoring to catch geographic drift before it becomes a four-month exposure`, quality: `good`,
                note: `Prevention and detection together. Communication prevents future scope creep. Monitoring catches it early if prevention fails.` },
              { id: `b`, label: `A mandatory training module for all AI system users covering the change request requirement`, quality: `partial`,
                note: `Training is right. But training alone relies on completion and retention. Pairing it with automated monitoring creates a detection layer that doesn\'t depend on people remembering what they learned.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_register: {
          scene:       `desk-review`,
          caption:     `The quarterly review field is added. System owners will be prompted to confirm scope hasn\'t expanded. But the NZ expansion was made by operations — the system owner wasn\'t involved at all.`,
          sub_caption: `Your control targets the wrong actor.`,
          decision: {
            prompt: `The CRO notes that the system owner wasn\'t part of the NZ decision chain. How do you address the gap your proposed change doesn\'t cover?`,
            choices: [
              { id: `a`, label: `Add a communication programme targeting operational users — the people actually making day-to-day deployment decisions`, quality: `good`,
                note: `This is the gap. Governance frameworks only work if the people who can trigger a scope expansion know they need to engage with them.` },
              { id: `b`, label: `Add a requirement for system owners to sign off any new user or department accessing the model`, quality: `partial`,
                note: `Adds oversight at the right level but creates operational friction for every new user. A targeted approach — sign-off for scope expansions specifically — is more proportionate.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_monitoring: {
          scene:       `analyst-desk`,
          caption:     `Usage monitoring is implemented. It would have caught the NZ expansion after the first week. But the gap it leaves is the week before detection — and the assumption that the preventive control (knowing a change request is required) is someone else\'s problem.`,
          sub_caption: `Detection is good. Prevention is better.`,
          decision: {
            prompt: `The CRO asks what would have prevented this in the first place, not just detected it faster. What\'s your answer?`,
            choices: [
              { id: `a`, label: `Operational users knowing the change request requirement exists — the monitoring fills the gap but doesn\'t replace the preventive control`, quality: `good`,
                note: `Correct framing. Monitoring is a valuable addition. But the primary gap was awareness, and that needs its own fix.` },
              { id: `b`, label: `The monitoring is the prevention — if you catch it in week one, the exposure is minimal`, quality: `partial`,
                note: `One week of exposure is better than four months. But processing applications through an unvalidated model for any period creates the same type of regulatory obligation — just over fewer decisions.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Root cause addressed, prevention and detection both fixed`,
          tone:    `good`,
          result:  `The communication programme reached all 14 credit operations staff within three weeks. Usage monitoring was implemented simultaneously. Three months later, a different team attempted to run a new product type through the same model — the system owner was notified automatically, a change request was raised, and the expansion was assessed before any applications were processed.`,
          learning: `Scope creep is an awareness problem as much as a governance problem. The framework existed — the people who needed to engage with it didn\'t know it was there. Communication and detection together are more robust than either alone.`,
          score:   100,
        },
        outcome_good: {
          heading: `One gap addressed well`,
          tone:    `good`,
          result:  `Either the communication programme or the monitoring was implemented well. The other followed on the six-month review. No further scope creep incidents occurred in the interim — partly due to the implemented control, partly luck. The full dual-control approach was eventually in place.`,
          learning: `Prevention and detection address different failure modes. Communication prevents scope creep by informed people. Monitoring catches it when awareness fails. The combination is the robust design.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Partial controls, correct direction`,
          tone:    `warn`,
          result:  `The controls implemented addressed some of the gap but not the core awareness problem. A second scope creep incident occurred six months later — different model, different team, same mechanism. The second incident accelerated the full implementation of both preventive and detective controls.`,
          learning: `Governance frameworks that system owners know but operational users don\'t are not functioning governance frameworks. Awareness at every level of the decision chain is the standard.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Controls targeted at wrong actor`,
          tone:    `bad`,
          result:  `The changes implemented didn\'t reach the operational teams making day-to-day deployment decisions. A second incident occurred within six months. The CRO\'s review found that the remediation had addressed system owner processes but left the operational gap that caused the original incident completely unchanged.`,
          learning: `Remediation that doesn\'t reach the actor who caused the incident doesn\'t prevent recurrence. The NZ expansion was made by operations. The fix needed to reach operations.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `847 NZ credit applications processed through a model validated only for AU consumer credit obligations. You need to assess materiality — were any customers potentially harmed by using the wrong model?`,
          sub_caption: `The CRO\'s regulatory notification decision depends on your assessment.`,
          decision: {
            prompt: `How do you structure the materiality assessment?`,
            choices: [
              { id: `a`, label: `Compare NZ decision outcomes against what a correctly validated NZ model would likely have produced — identify cases where the outcome may have differed`, quality: `good`,
                note: `This is the right question. The regulatory exposure depends on whether customers received different decisions than they would have under a correctly validated model.` },
              { id: `b`, label: `Review the AU model\'s documented accuracy rate and apply it to the NZ volume — if accuracy is high, harm is unlikely`, quality: `partial`,
                note: `The AU model\'s accuracy rate is for Australian credit obligations, assessed against Australian training data. It doesn\'t tell you how the model performs against NZ credit obligations.` },
              { id: `c`, label: `Check whether any NZ customers have complained or escalated — no complaints suggests no harm`, quality: `poor`,
                note: `Absence of complaints is not absence of harm. Credit decisions are complex and customers rarely know the basis on which a decision was made. Complaint rate is not a materiality measure.` },
            ],
          },
          branches: { a: `n2_right_approach`, b: `n2_accuracy_proxy`, c: `n2_complaints` },
        },

        n2_right_approach: {
          scene:       `desk-working`,
          caption:     `You engage the model risk team to run the 847 NZ applications through a reference NZ assessment framework. The comparison takes five days.`,
          sub_caption: `The results: 812 decisions are consistent. 35 cases show a material difference in scoring — 28 of those resulted in declined applications.`,
          decision: {
            prompt: `35 materially different cases, 28 declined. How do you present this to the CRO?`,
            choices: [
              { id: `a`, label: `Present the full findings: 35 cases with material differences, 28 declines that may not have occurred under correct assessment — and recommend proactive regulatory notification`, quality: `good`,
                note: `28 customers may have been incorrectly declined credit. That is material harm. The CRO needs this information to make the notification decision — and proactive disclosure is almost always the better regulatory approach.` },
              { id: `b`, label: `Present the 812 consistent cases as evidence the model performed adequately overall, and flag the 35 as requiring further review`, quality: `partial`,
                note: `96% consistency is relevant context. But 28 potentially incorrect declines is the finding — leading with the consistency figure risks minimising it.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_accuracy_proxy: {
          scene:       `desk-colleague`,
          caption:     `The model risk team points out that the AU model\'s 93.7% accuracy figure is benchmarked against Australian credit data and Australian regulatory obligations. It says nothing about performance against NZ credit obligations.`,
          sub_caption: `You need a different approach.`,
          decision: {
            prompt: `The accuracy proxy approach doesn\'t answer the question. What do you do?`,
            choices: [
              { id: `a`, label: `Run the NZ applications through a reference NZ assessment framework to identify cases where outcomes may have differed`, quality: `good`,
                note: `The right analysis. Better to arrive at it now than after presenting the CRO with a finding that doesn\'t answer her question.` },
              { id: `b`, label: `Present the accuracy finding to the CRO with the caveat that it\'s an imperfect proxy — the full comparison isn\'t possible in the timeframe`, quality: `poor`,
                note: `The full comparison is possible — it just takes longer. Presenting an acknowledged-imperfect proxy as the basis for a regulatory notification decision is not appropriate.` },
            ],
          },
          branches: { a: `n2_right_approach`, b: `outcome_bad` },
        },

        n2_complaints: {
          scene:       `office-briefing`,
          caption:     `Zero NZ customer complaints related to the credit decisions in the period. The CRO asks whether you\'re confident this means no harm occurred.`,
          sub_caption: `You\'re not confident. And she knows it.`,
          decision: {
            prompt: `The CRO is pushing back on the complaints-based assessment. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the limitation and propose the correct analysis: compare NZ decisions against what a validated NZ model would have produced`, quality: `good`,
                note: `The right answer, a step late. The CRO\'s pushback has surfaced the gap — engaging with it honestly is the professional response.` },
              { id: `b`, label: `Stand by the complaints finding — no complaints in four months is meaningful data even if it\'s not definitive`, quality: `poor`,
                note: `It\'s meaningful in some contexts. It\'s not meaningful for credit decisions, where customers have no visibility into the assessment methodology. The CRO\'s scepticism is correct.` },
            ],
          },
          branches: { a: `n2_right_approach`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Material harm identified, CRO fully informed`,
          tone:    `good`,
          result:  `Your analysis identified 28 potentially incorrect declines. The CRO notified the NZ Commerce Commission proactively with the full findings. The 28 customers were identified and offered a reassessment under the correct framework — four were subsequently approved. Your analysis directly improved outcomes for those four customers.`,
          learning: `Materiality assessment in AI governance isn\'t about whether the system performed accurately on average — it\'s about whether specific customers received decisions they shouldn\'t have. The right question leads to the right finding.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct analysis, framing slightly minimised`,
          tone:    `good`,
          result:  `The 35 cases with material differences were identified. The 28 declined applications were in the findings. The consistency-first framing meant the CRO had to ask a follow-up question to get to the headline finding. The regulatory notification included the full picture. The outcome was the same — just with slightly more friction getting to the key number.`,
          learning: `In regulatory findings, lead with the material finding. 96% consistency is context; 28 potentially incorrect declines is the headline. The framing determines how quickly the decision-maker gets to what matters.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Analysis corrected, finding delayed`,
          tone:    `warn`,
          result:  `The complaints-based or accuracy-proxy assessment was corrected after CRO pushback. The correct analysis took an additional five days. The regulatory notification was submitted a week later than it would have been. The findings were the same. The delay was noted in the regulator\'s acknowledgement.`,
          learning: `The right analytical approach for AI materiality assessment is always the comparison question: did this produce different outcomes than the correct approach would have? Starting with that question saves time and produces a more defensible finding.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Wrong analysis presented, CRO decision compromised`,
          tone:    `bad`,
          result:  `An acknowledged-imperfect or complaint-based finding was presented as the basis for the regulatory notification decision. The CRO made the notification decision on that basis. The regulator subsequently requested the full comparison analysis. When it was completed, the 28 potentially incorrect declines were identified. The regulator noted that the original notification had not included material information that was available at the time.`,
          learning: `A regulatory notification based on an analysis you know is imperfect is not a defensible position. The additional time to do the right analysis is almost always worth it.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Documented use case boundaries in AI Register`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `The AU model had a clear AI Register entry specifying AU scope only. The failure was not in the documentation — it was in the awareness of that documentation among operational users who made the NZ deployment decision.`,
    },
    {
      id:      `c2`,
      label:   `Change governance for scope expansion`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: false,
      context: `No change request process was triggered because the credit operations team didn\'t know one existed. The process design assumed system owners would mediate all scope changes — it didn\'t account for operational teams making direct deployment decisions.`,
    },
    {
      id:      `c3`,
      label:   `Usage monitoring for scope detection`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: false,
      context: `Geographic drift in application volume appeared in the usage logs — but nobody was looking for it. Automated monitoring with an alert threshold on new geography would have surfaced the NZ expansion in week one rather than month four.`,
    },
  ],
};
