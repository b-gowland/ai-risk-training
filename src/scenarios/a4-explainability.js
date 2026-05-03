// A4 — The Black Box Decision
// AI Explainability & Adverse Action Notice Failure
//
// Setting: A financial services firm's ML credit scoring model declines an
// application. The customer requests an explanation under Australian RG 271.
// SHAP has not been implemented. The only available explanation is "score was
// below threshold." The compliance team identifies a regulatory breach. A
// second review finds the model's top adverse feature is strongly correlated
// with postcode — a potential proxy for race.
//
// Differentiation from E1 (The Score — algorithmic bias):
//   E1: A hiring tool produces biased shortlists — demographic disparity
//     discovered through an external audit after deployment.
//   A4: A credit model can't explain an individual decision — regulatory breach
//     discovered through a single customer complaint. The proxy discrimination
//     is a secondary discovery, not the primary failure.
//   Different trigger, different regulatory regime, different primary control.
//   A4 is about the right to explanation and adverse action notice compliance.
//   E1 is about demographic fairness at population level.

export const scenario = {
  id:                `a4-explainability`,
  risk_ref:          `A4`,
  title:             `The Black Box Decision`,
  subtitle:          `AI Explainability & Adverse Action Notice Failure`,
  domain:            `A — Technical`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-a-technical/a4-explainability`,
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Credit Assessor`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `A customer is on the phone disputing their credit decline. They want to know why. All you can see in the system is "Score: 487 — Below threshold (min: 520)." That\'s the entire explanation.`,
      premise:   `You work in the credit assessment team. A customer, Kwame Mensah, has called to dispute his declined personal loan application. He has a clean credit history, stable employment, and says he's never missed a payment. He wants to know specifically why he was declined. You pull up his application in the system. The AI-generated credit score is 487. The minimum for approval is 520. The "reason" field in the system shows one line: "Score below threshold." There are no contributing factors listed. No feature breakdown. Nothing you can tell this customer about why the model produced this score.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Risk Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `A customer complaint about a credit decline has surfaced two problems simultaneously: the AI model cannot produce the adverse action notice required under ASIC RG 271, and a preliminary analysis suggests postcode is the model\'s strongest adverse factor — a potential proxy for race.`,
      premise:   `What began as a routine customer complaint has been escalated by compliance. The credit scoring model cannot generate the specific reason codes required by ASIC Regulatory Guide 271 for adverse action notices in credit decisions. The model was deployed 14 months ago. Every credit decline in that period has been issued with a non-compliant adverse action notice. A second, preliminary finding from the model risk team makes this significantly more serious: postcode is the model\'s top negative feature by SHAP value magnitude across the declined population — and postcode in this context correlates with demographic composition. This needs to go to the board.`,
    },
    pm: {
      lead:      `Project Manager`,
      label:     `Project Manager`,
      role:      `Credit Decisioning System Lead`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You deployed the credit scoring model 14 months ago. The model review checklist had an item for "explanation capability." It was marked complete. What it verified was that the model could produce a score — not that the score came with compliant reason codes.`,
      premise:   `You manage the credit decisioning system. The compliance team has asked you to show them the adverse action notice process — specifically, how the system generates the specific reason codes required under ASIC RG 271. You pull up the implementation design document. The explanation section reads: "Model outputs credit score. Threshold determines approval/decline. Decline notices include score and threshold." There are no reason codes. There is no SHAP implementation. The checklist item "Explanation capability — confirmed" was completed based on the score output being visible to assessors. Nobody asked whether the score explanation met the regulatory standard for adverse action notices.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Model Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You\'ve been asked to assess two things: the regulatory exposure from 14 months of non-compliant adverse action notices, and whether the postcode correlation represents proxy discrimination. Both findings are significant.`,
      premise:   `The CRO has tasked you with two assessments: (1) Regulatory exposure — how many adverse action notices are non-compliant and what are the remediation options under ASIC RG 271? (2) Proxy discrimination — is postcode functioning as a proxy for race in the credit model? You have access to the model weights, the declined population data, and postcode-level demographic data. The SHAP implementation hasn\'t been done — you\'ll need to calculate feature attributions from the model directly. What you find will determine whether this is a compliance remediation or an immediate model withdrawal question.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `Kwame Mensah is on the phone. His credit score is 487. Minimum is 520. The reason field says: "Score below threshold." That\'s all you have.`,
          sub_caption: `He wants to know why he was declined. You have no way to tell him.`,
          decision: {
            prompt: `Kwame asks for a specific explanation of why he was declined. What do you do?`,
            choices: [
              { id: `a`, label: `Escalate immediately — explain to Kwame you don\'t have the detail he needs in front of you, and log this as a complaint requiring a formal written response`, quality: `good`,
                note: `You can\'t give an explanation you don\'t have. Acknowledging that, escalating, and ensuring Kwame gets a formal response is the right process — and the right thing to do for him.` },
              { id: `b`, label: `Tell Kwame his score was 487 and the minimum is 520 — that\'s the explanation the system provides`, quality: `poor`,
                note: `"Your score was below threshold" is not an explanation — it\'s a restatement of the decision. Kwame is entitled to know what drove the score, not just the outcome.` },
              { id: `c`, label: `Tell Kwame you\'ll investigate and call him back, then check with compliance whether the system is supposed to have more detail`, quality: `good`,
                note: `Also right — noticing that the system might be missing something and checking with compliance is how this gap gets identified properly.` },
            ],
          },
          branches: { a: `n2_escalates`, b: `n2_dismisses`, c: `n2_escalates` },
        },

        n2_escalates: {
          scene:       `desk-call`,
          caption:     `Compliance is now involved. They\'re asking whether the system has ever been able to produce reason codes. You know the answer: no — it's always just been score and threshold.`,
          sub_caption: `This wasn\'t the first decline. It was just the first complaint.`,
          decision: {
            prompt: `Compliance asks you to think back — have any other customers asked about the explanation for their decline? How did those calls go?`,
            choices: [
              { id: `a`, label: `Be honest — you\'ve had similar calls where you gave customers the score and threshold and they seemed to accept it, but you never had any detail to give them`, quality: `good`,
                note: `This confirms the pattern for compliance. They need to understand the scale of the gap — not just this one call.` },
              { id: `b`, label: `This is the first time a customer has formally asked — previous calls were resolved with the score information`, quality: `partial`,
                note: `Possibly accurate. But "resolved" may mean the customer accepted an inadequate response, not that the response was adequate. Compliance needs to understand the pattern.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_dismisses: {
          scene:       `desk-colleague`,
          caption:     `Kwame escalates. He lodges a formal complaint and files a complaint with AFCA (Australian Financial Complaints Authority). His complaint references ASIC RG 271 — the right to specific reasons for credit decline.`,
          sub_caption: `The score and threshold explanation was not sufficient under RG 271. The complaint is now external.`,
          decision: {
            prompt: `The AFCA complaint has been received. Compliance asks how the customer was handled. What do you tell them?`,
            choices: [
              { id: `a`, label: `Accurately: you gave the score and threshold, didn\'t have any more detail, and didn\'t escalate because you assumed that was the process`, quality: `good`,
                note: `Accurate account. The escalation gap is yours, but the system gap is the organisation\'s. Compliance needs both to understand what happened.` },
              { id: `b`, label: `You followed the standard process for decline calls`, quality: `poor`,
                note: `If the standard process produces non-compliant adverse action notices, saying you followed it doesn\'t resolve the problem — it confirms the process is wrong.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Complaint escalated properly, pattern confirmed`,
          tone:    `good`,
          result:  `Your escalation and honest account confirmed the pattern for compliance — not just an isolated call but a systemic gap in explanation capability. The formal investigation began immediately. Kwame received a written response acknowledging the gap and a commitment to reassess his application with a compliant process. Your call was the one that surfaced the issue.`,
          learning: `When you can\'t answer a customer\'s legitimate question about a decision that affects them, that\'s a signal worth escalating — not just for the customer in front of you, but for everyone who had the same question and didn\'t ask.`,
          score:   100,
        },
        outcome_good: {
          heading: `Complaint handled, limited pattern data`,
          tone:    `good`,
          result:  `The escalation was appropriate. The pattern information was partial. Compliance investigated regardless and identified the full scope of the gap. Kwame\'s complaint was handled correctly. Your contribution to surfacing the issue was meaningful even if incomplete.`,
          learning: `An escalated complaint about an inability to explain a credit decision is a signal about the system, not just the call. What you know about the pattern is worth sharing completely — it determines how quickly the organisation understands the scope.`,
          score:   65,
        },
        outcome_warn: {
          heading: `AFCA complaint filed, gap surfaced externally`,
          tone:    `warn`,
          result:  `The gap was identified — but through an external complaint rather than internal escalation. The AFCA investigation focused both on Kwame\'s specific complaint and on the system\'s compliance capability. The regulatory engagement was harder to manage because the issue was already external before the organisation understood its scope.`,
          learning: `A customer asking for a specific explanation of their credit decline is a compliance signal. It\'s always better to surface that internally — through an honest escalation — than to have it surfaced externally through a regulator.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Standard process cited, compliance gap compounded`,
          tone:    `bad`,
          result:  `Describing the response as following standard process confirmed to compliance that the standard process was the problem. The AFCA investigation found that the organisation\'s standard decline call process had been producing non-compliant adverse action notices for 14 months and that front-line staff had been trained to use a response that didn\'t meet the regulatory standard.`,
          learning: `Following a process that\'s non-compliant doesn\'t make the response compliant. When a customer can\'t get an explanation for a credit decision that they\'re entitled to, the right response is escalation — not the standard script.`,
          score:   5,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `14 months of credit declines. Non-compliant adverse action notices on all of them. Postcode as the top adverse feature — correlated with demographic composition. Two regulatory obligations potentially breached simultaneously.`,
          sub_caption: `This needs to go to the board. It also needs to go to ASIC.`,
          decision: {
            prompt: `What is the sequence of your response?`,
            choices: [
              { id: `a`, label: `Suspend the model immediately, brief the board, notify ASIC proactively, and commission the full model audit — in that order`, quality: `good`,
                note: `Suspension stops the ongoing breach. Board briefing fulfils governance obligations. ASIC notification, proactively made, is always better than waiting to be asked. The audit produces the evidence for all subsequent decisions.` },
              { id: `b`, label: `Commission the full audit first — notify ASIC only when you have the complete picture`, quality: `partial`,
                note: `The complete picture is valuable. But ASIC doesn\'t expect perfection at notification — they expect prompt notification when a material compliance issue is identified. Waiting for the audit delays an obligation you already have.` },
              { id: `c`, label: `Fix the SHAP implementation first, then assess whether notification is required`, quality: `poor`,
                note: `Implementing SHAP resolves the future compliance gap — it doesn\'t remediate the 14 months of non-compliant notices already issued. The regulatory obligation is about what has already happened.` },
            ],
          },
          branches: { a: `n2_full_response`, b: `n2_audit_first`, c: `n2_fix_first` },
        },

        n2_full_response: {
          scene:       `office-bright`,
          caption:     `Model suspended. Board briefed. ASIC notification sent. The audit is underway. ASIC has acknowledged receipt and asked for the audit findings when complete.`,
          sub_caption: `The posture is right. Now the substance needs to follow.`,
          decision: {
            prompt: `The audit will take three weeks. The board asks: what is the organisation\'s position on the postcode feature while the audit runs?`,
            choices: [
              { id: `a`, label: `The postcode feature should be suspended from use in credit decisions during the audit — the proxy discrimination question cannot wait three weeks to be addressed`, quality: `good`,
                note: `The postcode correlation is known now. Using it during the audit period while potentially discriminatory is indefensible if the audit confirms the proxy. Remove it now.` },
              { id: `b`, label: `The audit will determine whether postcode is discriminatory — use should continue until the finding is confirmed`, quality: `poor`,
                note: `The correlation between postcode and demographic composition is already documented. Continuing to use a feature with a known proxy discrimination risk pending confirmation is not a defensible position.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_warn` },
        },

        n2_audit_first: {
          scene:       `desk-focused`,
          caption:     `The audit takes three weeks. During that time, 847 additional credit applications are processed using the model — all with the non-compliant adverse action notice process, all potentially using the postcode proxy.`,
          sub_caption: `The audit produces a complete picture. But the compliance breach has continued for three additional weeks.`,
          decision: {
            prompt: `The audit is complete. ASIC is now being notified. They ask why notification was delayed three weeks after the compliance team identified the issue. What do you tell them?`,
            choices: [
              { id: `a`, label: `Acknowledge the notification should have been made immediately when the compliance gap was identified — waiting for the audit was incorrect sequencing`, quality: `good`,
                note: `Honest account. ASIC will note the delay. An honest acknowledgement is better than a defence of the decision.` },
              { id: `b`, label: `Explain that you wanted to give ASIC a complete picture rather than a preliminary notification`, quality: `partial`,
                note: `The intent was reasonable. The execution delayed an obligation. ASIC understands the difference between a preliminary notification and a complete report — they expected the former promptly and the latter when available.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_fix_first: {
          scene:       `office-meeting`,
          caption:     `SHAP is implemented in two weeks. The model can now produce reason codes. But the 14 months of non-compliant notices are still on the record. Compliance asks: are we notifying ASIC?`,
          sub_caption: `Implementing SHAP resolved the prospective gap. The retrospective obligation exists independently.`,
          decision: {
            prompt: `Compliance confirms the notification obligation existed from the moment the compliance gap was identified — not from when the fix was implemented. What do you do?`,
            choices: [
              { id: `a`, label: `Notify ASIC immediately with the full picture: 14 months of non-compliant notices, the SHAP fix now implemented, and the postcode proxy concern under investigation`, quality: `good`,
                note: `Late notification is better than no notification. ASIC will note the delay — an honest complete notification is the right approach.` },
              { id: `b`, label: `Present the SHAP implementation as evidence of remediation and assess whether notification is still required`, quality: `poor`,
                note: `The fix doesn\'t eliminate the retrospective obligation. The 14 months of non-compliant notices exist regardless of whether the future process is now compliant.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Suspension, notification, postcode feature removed`,
          tone:    `good`,
          result:  `The model was suspended, ASIC was notified proactively, and the postcode feature was removed from use during the audit. The audit confirmed postcode as a proxy discrimination risk. ASIC\'s response to the proactive notification was collaborative — they acknowledged the organisation\'s transparent approach. A remediation plan covering all affected applicants was agreed within 60 days.`,
          learning: `When two regulatory obligations are in scope simultaneously — adverse action notice compliance and proxy discrimination — both need immediate response. Waiting for the audit to confirm the proxy before removing a known risk feature is not a defensible position.`,
          score:   100,
        },
        outcome_good: {
          heading: `Notification made, delay acknowledged`,
          tone:    `good`,
          result:  `ASIC was notified with the full audit findings. The delay was acknowledged honestly. ASIC\'s response noted the delay but accepted the honest account and the quality of the audit. The remediation plan was agreed. The postcode feature was removed. The engagement was more difficult than it would have been with immediate notification — but the outcome was managed.`,
          learning: `Prompt notification of a compliance gap — even before the audit is complete — is better than a complete notification after a delay. Regulators expect to be told early and updated as findings develop, not presented with a complete picture three weeks late.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Delayed notification, extended breach`,
          tone:    `warn`,
          result:  `The compliance breach continued during the audit period. ASIC\'s response to the delayed notification included a requirement for an enhanced remediation programme covering the full 17-month period. The postcode proxy question required separate remediation because it had continued to be used during the audit. The total remediation scope was significantly larger than it would have been with immediate suspension and notification.`,
          learning: `Every week of delay in suspension and notification is a week of additional regulatory exposure. The audit is the answer to "how big is the problem?" — not the prerequisite for "should we stop and notify?"`,
          score:   30,
        },
        outcome_bad: {
          heading: `Late notification, retroactive obligation misunderstood`,
          tone:    `bad`,
          result:  `ASIC was notified late and with a framing — the fix is implemented — that underestimated the retrospective obligation. ASIC\'s response made clear that the notification should have been made immediately when the compliance gap was identified. The remediation scope, the regulatory engagement, and the reputational impact were all significantly larger than they would have been with immediate notification.`,
          learning: `A compliance fix resolves future obligations. It doesn\'t remediate past breaches. The adverse action notice obligation for 14 months of declined applications exists independently of whether the system now works correctly.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ─────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-intranet`,
          caption:     `Implementation design doc, explanation section: "Model outputs credit score. Threshold determines approval/decline. Decline notices include score and threshold." No SHAP. No reason codes. The checklist item "Explanation capability — confirmed" was marked complete.`,
          sub_caption: `The score being visible is not the same as the score being explainable.`,
          decision: {
            prompt: `Compliance asks: what did "Explanation capability — confirmed" actually verify? What do you tell them?`,
            choices: [
              { id: `a`, label: `Honest answer: it verified the score was visible to assessors. It didn\'t verify the score could produce compliant reason codes for adverse action notices. I didn\'t know that was the standard.`, quality: `good`,
                note: `Accurate and specific. This is the gap — the checklist item was too ambiguous and was completed against a misunderstood standard.` },
              { id: `b`, label: `The checklist was completed based on the capability that was implemented — if the regulatory standard required more, that should have been specified in the requirements`, quality: `partial`,
                note: `Partly right — requirements clarity matters. But a credit decisioning system has a known regulatory standard for adverse action notices. It should have been in your requirements whether it was specified by someone else or not.` },
            ],
          },
          branches: { a: `n2_honest`, b: `n2_requirements` },
        },

        n2_honest: {
          scene:       `office-meeting`,
          caption:     `Compliance accepts the honest account. They ask what you need to implement SHAP and generate compliant reason codes — and how long it takes.`,
          sub_caption: `The technical fix is your deliverable. The timeline matters.`,
          decision: {
            prompt: `What do you commit to?`,
            choices: [
              { id: `a`, label: `SHAP implementation with compliant reason codes in two weeks — with a parallel process to manually reassess any declined applications where the customer has requested explanation`, quality: `good`,
                note: `Technical fix plus manual bridge for customers already affected. Both are needed — the bridge addresses the retrospective obligation, the SHAP implementation addresses the prospective gap.` },
              { id: `b`, label: `SHAP implementation in two weeks — the regulatory position for historical declines is a compliance and legal question, not a technology one`, quality: `partial`,
                note: `The SHAP implementation timeline is right. But separating the technical and compliance workstreams without confirming they\'re linked risks the technical fix being seen as sufficient when it isn\'t.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_requirements: {
          scene:       `office-meeting-hearing`,
          caption:     `Compliance notes that ASIC RG 271 adverse action notice requirements are a published regulatory standard available on the ASIC website. They\'ve been in place since 2014. The credit decisioning system should have been designed to meet them.`,
          sub_caption: `The requirements were available. They weren\'t applied.`,
          decision: {
            prompt: `The requirements defence has failed. Compliance asks for the SHAP implementation timeline. What do you commit to?`,
            choices: [
              { id: `a`, label: `Two weeks for SHAP implementation with compliant reason codes, and a proposal for the manual review bridge for historical declines`, quality: `good`,
                note: `Correct response regardless of how the conversation arrived here. Compliance needs the implementation timeline and the historical remediation plan.` },
              { id: `b`, label: `Two weeks for SHAP — the historical declines remediation needs compliance sign-off before you can scope it`, quality: `partial`,
                note: `Compliance sign-off on the remediation approach is appropriate. But you can propose the manual review bridge as your recommended approach while compliance reviews it.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Gap owned, technical fix and bridge both committed`,
          tone:    `good`,
          result:  `SHAP was implemented in 13 days. The compliant reason code process went live immediately. The manual review bridge was implemented for the 47 customers who had requested or escalated explanations of their declines. The CRO cited your two-track response — technical fix plus customer bridge — in the board remediation report. The checklist was updated to include explicit reference to ASIC RG 271 adverse action notice requirements.`,
          learning: `A system that can produce a score but not explain it is not an explainable AI system under a regulatory standard. "Explanation capability" on a deployment checklist needs to mean explainable in the regulatory sense — not just visible in the operational sense.`,
          score:   100,
        },
        outcome_good: {
          heading: `Technical fix committed, remediation separated`,
          tone:    `good`,
          result:  `SHAP was implemented on time. The historical remediation was eventually scoped in collaboration with compliance and legal. The separation between the two workstreams added a week to the overall remediation timeline but the outcome was the same. The checklist was updated.`,
          learning: `The technical fix and the historical remediation are linked problems — they need linked timelines. Separating them creates coordination gaps that add time without adding value.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Requirements defence failed, delayed delivery`,
          tone:    `warn`,
          result:  `The requirements conversation added a meeting before the implementation commitment was made. The SHAP implementation was delivered on time from the commitment date but was a week later than it would have been with an immediate commitment. The historical remediation bridge was eventually scoped. The compliance team noted that the project manager\'s initial response had not reflected appropriate ownership of a known regulatory standard.`,
          learning: `ASIC RG 271 adverse action notice requirements are a published standard that applies to credit decisioning systems. It doesn\'t need to be explicitly specified in requirements — it\'s part of the applicable regulatory framework. Knowing the regulatory context for your system is part of the role.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Implementation delay, historical gap not addressed`,
          tone:    `bad`,
          result:  `The SHAP implementation was delivered. The historical remediation bridge was not proposed or implemented. ASIC\'s remediation programme eventually required the organisation to proactively contact all 14 months of declined applicants — a programme significantly larger and more expensive than the targeted manual review bridge would have been. The post-incident review noted that the technology workstream had been disconnected from the customer remediation obligation.`,
          learning: `A technical fix that resolves prospective compliance without addressing retrospective customer impact is half a remediation. The customers who were declined without an adequate explanation have a right to one — the SHAP implementation provides the capability, the manual review provides the remedy.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Two questions. One: 14 months of adverse action notices — what\'s the regulatory exposure? Two: postcode as top adverse feature — proxy discrimination or coincidence?`,
          sub_caption: `Both questions are significant. The second one may be more serious.`,
          decision: {
            prompt: `The CRO needs both assessments. Which do you address first?`,
            choices: [
              { id: `a`, label: `Adverse action notice compliance first — the scope of the regulatory breach is needed to inform the ASIC notification timeline`, quality: `good`,
                note: `The compliance scope determines the notification urgency. Quantifying it first enables the CRO to make an informed decision about timing.` },
              { id: `b`, label: `Postcode proxy analysis first — if it confirms discrimination, the model needs immediate suspension regardless of the adverse action notice question`, quality: `good`,
                note: `Also right — if the proxy analysis confirms discrimination, the suspension decision is immediate and doesn\'t wait for the compliance scope analysis. Both paths lead to the right outcome.` },
            ],
          },
          branches: { a: `n2_compliance_scope`, b: `n2_proxy_first` },
        },

        n2_compliance_scope: {
          scene:       `desk-report`,
          caption:     `Adverse action notice compliance review: 14 months × average 340 declines/month = approximately 4,760 non-compliant notices. All lacked the specific reason codes required under ASIC RG 271. Every declined applicant is entitled to request a compliant explanation.`,
          sub_caption: `Now the proxy question.`,
          decision: {
            prompt: `You move to the postcode analysis. SHAP values (calculated directly from model weights): postcode is the top adverse feature by magnitude in 73% of declined applications. Postcode correlates with demographic composition at r = 0.67 in the declined population. How do you characterise this finding?`,
            choices: [
              { id: `a`, label: `This meets the threshold for proxy discrimination — postcode is functioning as a demographic signal with statistical significance. Recommend immediate model suspension.`, quality: `good`,
                note: `A correlation of 0.67 between the top adverse feature and demographic composition in declined applications is a strong proxy discrimination signal. Immediate suspension is the right recommendation.` },
              { id: `b`, label: `The correlation is concerning but not conclusive — recommend further analysis before characterising as proxy discrimination`, quality: `partial`,
                note: `Further analysis will strengthen the finding. But r = 0.67 on the top adverse feature in 73% of declines is already a material finding. "Concerning but not conclusive" understates what the data shows.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_proxy_first: {
          scene:       `desk-working`,
          caption:     `SHAP analysis (calculated directly from model weights): postcode is the top adverse feature in 73% of declined applications. Correlation with demographic composition: r = 0.67. This is a strong proxy discrimination signal.`,
          sub_caption: `The proxy finding is confirmed. Now quantify the compliance scope.`,
          decision: {
            prompt: `You have the proxy finding. You still need the adverse action notice compliance scope for the full picture. Do you present the proxy finding now or complete the compliance scope first?`,
            choices: [
              { id: `a`, label: `Present the proxy finding immediately — model suspension can\'t wait for the compliance scope analysis — then deliver the compliance scope within the hour`, quality: `good`,
                note: `The proxy finding triggers immediate action. The compliance scope is needed for the full notification but doesn\'t hold up the suspension decision. Present both; separate the urgency.` },
              { id: `b`, label: `Complete the compliance scope analysis first — the CRO needs the full picture before acting`, quality: `partial`,
                note: `The CRO can act on the proxy finding now and receive the compliance scope in an hour. Waiting for the complete picture delays an urgent action unnecessarily.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Both findings complete, proxy finding correctly characterised`,
          tone:    `good`,
          result:  `Your assessment gave the CRO the compliance scope (approximately 4,760 non-compliant notices) and a clear characterisation of the postcode proxy finding (meets proxy discrimination threshold, immediate suspension recommended). Both were in front of the CRO within four hours. The model was suspended the same day. Your proxy finding was confirmed by the external model audit. The remediation programme addressed both the compliance breach and the discriminatory feature.`,
          learning: `A SHAP correlation of 0.67 between the top adverse feature and demographic composition across 73% of decisions is a material proxy discrimination finding. Analytical understatement on findings of this significance doesn\'t serve anyone — it delays actions that are already warranted.`,
          score:   100,
        },
        outcome_good: {
          heading: `Both findings complete, proxy characterisation conservative`,
          tone:    `good`,
          result:  `Both assessments were completed and delivered. The conservative characterisation of the proxy finding ("concerning but not conclusive") led to a recommendation for further analysis before suspension. The CRO overrode the recommendation and suspended the model based on the data. The external audit confirmed proxy discrimination. Your conservative framing was noted in the post-incident review.`,
          learning: `Statistical findings in model risk analysis need to be characterised at their actual significance. Conservative framing of a strong finding transfers the interpretive burden to the decision-maker — who then has to override the analyst\'s framing to take the action the data warrants.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Compliance scope completed, proxy action delayed`,
          tone:    `warn`,
          result:  `The compliance scope was completed first and the proxy analysis followed. The model remained in use during the additional time the sequencing added. The proxy finding was eventually confirmed. Suspension was ordered. The post-incident review noted that the proxy finding, once identified, should have been presented immediately even if the compliance scope analysis was still running.`,
          learning: `When two findings have different action timelines — one requires suspension now, one quantifies a breach for notification — they shouldn\'t be held for joint presentation. The urgent finding goes first; the complete picture follows.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Analysis delayed, decisions made without full picture`,
          tone:    `bad`,
          result:  `The analysis sequencing meant the CRO had to make the suspension decision without the complete picture. She made it anyway — conservatively, on the compliance finding alone. The proxy analysis arrived after suspension had already been ordered. The post-incident review found the analysis hadn\'t been sequenced to support the decision-making process effectively.`,
          learning: `Model risk analysis needs to be sequenced to support the decisions that need to be made, not just to produce a complete picture. The decision-maker\'s needs should determine the analysis order, not the analyst\'s workflow preference.`,
          score:   15,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `SHAP explainability implementation`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `SHAP was never implemented. The model could produce a score but not the feature-level explanation required for compliant adverse action notices under ASIC RG 271. Every credit decline for 14 months was issued with a non-compliant notice.`,
    },
    {
      id:      `c2`,
      label:   `Adverse action notice process`,
      effort:  `Medium`,
      owner:   `Legal`,
      go_live: true,
      context: `The adverse action notice process was designed around score and threshold. It did not include the specific reason codes required under ASIC RG 271. The process was non-compliant from the first day of operation.`,
    },
    {
      id:      `c3`,
      label:   `Decision logging`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `Without SHAP values logged per decision, the retrospective analysis of proxy discrimination required reconstructing feature attributions from model weights — a slower and less precise process than analysis against logged SHAP values would have been.`,
    },
  ],
};
