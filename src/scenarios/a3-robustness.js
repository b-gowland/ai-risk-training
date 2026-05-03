// A3 — Edge of the Map
// AI Robustness & Operational Design Domain Failure
//
// Setting: A hospital's clinical AI diagnostic system performs well on their
// imaging equipment. A rural facility partnership is announced. The rural site
// uses different scan protocols. ODD was never defined — no technical control
// prevents use on out-of-distribution imaging data. Clinicians notice unusually
// low confidence scores but proceed anyway.
//
// Differentiation from F1 (Trust the Machine — automation bias):
//   F1: AI returns a confident WRONG answer. The radiologist defers despite
//     their own reading suggesting otherwise. The risk is human overreliance.
//   A3: AI returns LOW CONFIDENCE signals — it's actually telling the user
//     something is wrong — but clinicians proceed anyway because nobody told
//     them what low confidence means in this context. The risk is absent ODD
//     documentation and missing graceful degradation design.
//   Different failure mode, different controls, different learning.

export const scenario = {
  id:                `a3-robustness`,
  risk_ref:          `A3`,
  title:             `Edge of the Map`,
  subtitle:          `AI Robustness & Operational Design Domain Failure`,
  domain:            `A — Technical`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-a-technical/a3-robustness`,
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Rural Clinic Radiographer`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `You've been using the AI diagnostic system for three weeks. The confidence scores are consistently lower than your colleagues described. You asked your supervisor — they said the system was the same one as the main hospital and to use it as normal.`,
      premise:   `You're a radiographer at Millbrook Rural Health, which recently partnered with St Catherine's Hospital to use their AI diagnostic system. Your colleagues at St Catherine's rave about it — 94% accuracy, saves hours. In your three weeks using it, the confidence scores look different: instead of the 85–95% range your colleagues described, you're seeing 48–67% consistently across all scan types. You mentioned it to your clinical supervisor last week. They said "it's the same system, use it the same way." This morning you have a scan where the AI returned 52% confidence with a "Normal" finding. Your own reading is unclear. You don't know what 52% means in practice.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Medical Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The rural partnership went live six weeks ago. Three adverse outcomes have been flagged at Millbrook, all involving the AI diagnostic system. The pattern: low AI confidence scores, clinicians proceeding anyway. The ODD for the system doesn\'t exist.`,
      premise:   `Three adverse outcome reviews from Millbrook Rural Health in six weeks. In each case: the AI system returned a confidence score below 65%, the clinician proceeded with the AI\'s finding, and the subsequent clinical outcome suggested the finding was incorrect. You\'ve asked the technology team for the system\'s Operational Design Domain documentation — the defined boundaries within which the AI is validated to operate. The answer came back: it doesn't exist. The system was deployed to Millbrook without validating that its performance on Millbrook's imaging equipment matched its performance at St Catherine's.`,
    },
    pm: {
      lead:      `Project Manager`,
      label:     `Project Manager`,
      role:      `Clinical Technology Programme Lead`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You managed the Millbrook deployment. The go-live checklist included "equipment compatibility check" — completed by a vendor call confirming the software was compatible. Nobody asked whether the AI's performance had been validated on Millbrook\'s specific scan protocols.`,
      premise:   `You led the Millbrook Rural Health system deployment. The project completed on time. Go-live checklist item 7: "Equipment compatibility — confirmed." That confirmation was a vendor call establishing that the software would run on Millbrook's hardware. What wasn't asked: had the AI model's diagnostic performance been validated against Millbrook's specific imaging protocols? St Catherine's uses GE Revolution scanners with their standard protocol set. Millbrook uses Siemens SOMATOM scanners with a different protocol set, optimised for their patient demographics. The AI was trained on St Catherine's data. The performance difference is the gap between 94% accuracy and the 48–67% confidence scores Millbrook's radiographers have been reporting.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Clinical AI Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You need to define what the AI's Operational Design Domain should have been and wasn't — and determine whether the three adverse outcomes are attributable to ODD failure or other causes.`,
      premise:   `The CMO has tasked you with two questions: (1) What is the AI system's actual Operational Design Domain — the conditions under which its validated performance applies — and was Millbrook within it? (2) Are the three adverse outcomes causally linked to ODD failure? You have access to the training data specification, the validation study, and Millbrook's scan metadata. The validation study used only St Catherine's scanner protocols. Millbrook's scans show systematic differences in HU calibration and slice thickness. You are about to confirm what the confidence scores have been signalling for six weeks.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `AI result: Normal — 52% confidence. Your own reading is unclear. Your supervisor said to use the system the same way as at St Catherine's. Three weeks of scores like this.`,
          sub_caption: `You don\'t know what 52% confidence means in terms of clinical action.`,
          decision: {
            prompt: `The AI says Normal at 52% confidence. Your own reading is unclear. What do you do?`,
            choices: [
              { id: `a`, label: `Flag this scan for senior clinical review before signing off — 52% confidence on an unclear reading is not a basis for a normal finding`, quality: `good`,
                note: `When both the AI and your own reading are uncertain, the right action is to escalate, not proceed. A 52% confidence score is the AI telling you it\'s uncertain — that signal should be acted on.` },
              { id: `b`, label: `Accept the AI\'s normal finding — you were told to use it the same way as the main hospital`, quality: `poor`,
                note: `"Use it the same way" was guidance given without knowledge of the confidence score pattern. A 52% confidence score is not the same as the 85–95% scores your colleagues see at St Catherine\'s.` },
              { id: `c`, label: `Document the low confidence score and your uncertainty, and request a second opinion from a radiologist at St Catherine\'s`, quality: `good`,
                note: `Also right — documenting the uncertainty and requesting a specialist second opinion is appropriate when both the AI and your reading are unclear.` },
            ],
          },
          branches: { a: `n2_escalates`, b: `n2_accepts`, c: `n2_escalates` },
        },

        n2_escalates: {
          scene:       `office-meeting`,
          caption:     `You flag the scan. A senior radiologist reviews it — she immediately notices the confidence score pattern across the last three weeks of Millbrook scans. She's seeing something systematic.`,
          sub_caption: `Your flag has surfaced a pattern, not just a single scan.`,
          decision: {
            prompt: `The senior radiologist asks you to pull all scans from the last three weeks with AI confidence below 70%. There are 47. What do you tell the CMO about what you\'ve been seeing?`,
            choices: [
              { id: `a`, label: `Everything — the consistent low confidence scores since go-live, your supervisor\'s instruction to proceed normally, and the 47 scans you\'ve just pulled`, quality: `good`,
                note: `Complete and honest. The CMO needs the full picture — the pattern, the instruction that shaped how you responded to it, and the scope of potentially affected scans.` },
              { id: `b`, label: `Report the current scan and the 47 flagged scans — don\'t mention your supervisor\'s instruction, that\'s an internal matter`, quality: `partial`,
                note: `The scan data is right. But the supervisor\'s instruction is relevant to why the pattern wasn\'t escalated sooner — the CMO needs to understand the full causal chain.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_accepts: {
          scene:       `desk-working`,
          caption:     `You sign off the scan as normal. Two weeks later, the CMO initiates a review of all Millbrook AI-assisted scans after three adverse outcome reports. Your scan is in the review.`,
          sub_caption: `The review finds a systematic pattern of low confidence scores and normal findings across six weeks of Millbrook scans.`,
          decision: {
            prompt: `The review team asks whether you noticed the low confidence score pattern. What do you tell them?`,
            choices: [
              { id: `a`, label: `Yes — you noticed it from week one and raised it with your supervisor, who told you to proceed normally`, quality: `good`,
                note: `Accurate and complete. The review needs to understand that the pattern was visible and the instruction was to proceed — that\'s the governance failure, not individual clinical error.` },
              { id: `b`, label: `You noticed some variation in scores but assumed it was normal system behaviour`, quality: `poor`,
                note: `This isn\'t accurate — you specifically noticed and asked about the pattern. An inaccurate account to the review team compounds the problem.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Pattern surfaced early, full account given`,
          tone:    `good`,
          result:  `Your escalation and complete account gave the review team a full picture of the confidence score pattern and the instruction that shaped the response to it. The 47 flagged scans were reviewed by senior radiologists within the week. Four required follow-up. Your early escalation was the reason the review happened before further adverse outcomes. The CMO noted your conduct positively in the incident review.`,
          learning: `A confidence score below the system\'s normal operating range is the AI telling you something is outside its validated territory. Acting on that signal — rather than accepting the finding — is the right clinical response and the right governance response.`,
          score:   100,
        },
        outcome_good: {
          heading: `Pattern identified, account partially complete`,
          tone:    `good`,
          result:  `The 47 flagged scans were reviewed. The supervisor\'s instruction was identified in the review through other means. The complete picture emerged but took longer than it would have with your full account. Four scans required follow-up. The review\'s recommendations addressed the ODD gap and the clinical instruction that had been given.`,
          learning: `In a clinical adverse outcome review, the governance chain matters as much as the clinical decisions. Providing the complete chain — including instructions received — gives the review team what they need to fix the system, not just identify the individual decisions.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Pattern visible, accurate account given late`,
          tone:    `warn`,
          result:  `The review found the pattern and your accurate account confirmed the governance failure. The six-week delay between your first observation and the formal review meant 47 scans had been processed under ODD-failure conditions. Four required follow-up, two with clinical implications. The review found that a single escalation — from you or your supervisor — would have surfaced this at week one.`,
          learning: `Low confidence scores that are systematically different from the system\'s documented operating range are an escalation signal, not a normal operating condition to accept. When a supervisor says "proceed normally," that instruction should be escalated to clinical governance, not accepted without documentation.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Pattern minimised, review impeded`,
          tone:    `bad`,
          result:  `Your account to the review team was inaccurate. The review established the truth through scan metadata and contemporaneous notes from a colleague who had heard your conversation with your supervisor. The discrepancy between your account and the evidence became a secondary focus of the review. The root cause — ODD failure — was still identified and remediated, but your account complicated the review unnecessarily.`,
          learning: `In a clinical incident review, an accurate account of what you observed and what you were told is always the right approach. The review\'s goal is to fix the system — an accurate account of a governance failure helps that; an inaccurate account of individual behaviour doesn\'t.`,
          score:   5,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `Three adverse outcomes. Six weeks. All linked to the AI system returning low confidence scores that clinicians proceeded with. ODD documentation: doesn\'t exist.`,
          sub_caption: `The system was deployed to Millbrook without validating its performance on Millbrook\'s imaging equipment.`,
          decision: {
            prompt: `What is your immediate action?`,
            choices: [
              { id: `a`, label: `Suspend AI-assisted diagnosis at Millbrook immediately pending ODD validation — and commission review of all Millbrook scans from the past six weeks`, quality: `good`,
                note: `The AI is operating outside its validated domain. Continuing to use it while the validation gap exists creates ongoing clinical risk. Suspend first, review second, redeploy after validation.` },
              { id: `b`, label: `Brief the Millbrook clinical team on the confidence score threshold — tell them to only accept findings above 80% confidence`, quality: `partial`,
                note: `An 80% threshold might reduce immediate risk but doesn\'t address the root cause: the AI hasn\'t been validated on Millbrook\'s scan protocols. A system operating outside its ODD shouldn\'t be in clinical use regardless of threshold.` },
              { id: `c`, label: `Commission the ODD documentation retroactively — establish the domain parameters and assess whether Millbrook is within them`, quality: `partial`,
                note: `The ODD documentation is needed. But it\'s a six-week project. Meanwhile the AI is still in clinical use at Millbrook. Suspension should come first.` },
            ],
          },
          branches: { a: `n2_suspended`, b: `n2_threshold`, c: `n2_retroactive` },
        },

        n2_suspended: {
          scene:       `office-bright`,
          caption:     `AI use at Millbrook is suspended. The six-week scan review is underway. You now need to decide the path to safe redeployment.`,
          sub_caption: `The ODD gap is the root cause. Fixing it is the condition for redeployment.`,
          decision: {
            prompt: `What does the redeployment path look like?`,
            choices: [
              { id: `a`, label: `Prospective validation study on Millbrook\'s scanner protocols before any redeployment — with defined performance thresholds that must be met`, quality: `good`,
                note: `This is the correct path. Redeployment requires evidence that the system performs within acceptable bounds on Millbrook\'s actual equipment. Performance thresholds defined in advance, not post-hoc.` },
              { id: `b`, label: `Retrain the model on Millbrook scan data to close the ODD gap`, quality: `partial`,
                note: `Retraining is one option. It takes longer than validation and requires labelled data from Millbrook. Validation on current performance is a faster first step — if performance is acceptable, retraining may not be needed.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_threshold: {
          scene:       `office-meeting`,
          caption:     `The threshold guidance goes to Millbrook. Within two weeks, two more adverse outcomes are reported — both involving scans where the AI returned 78% confidence (just below the threshold) and clinicians proceeded. The threshold didn\'t address the underlying problem.`,
          sub_caption: `Thresholds on an out-of-domain system are not a control. They\'re a risk reduction on top of an unresolved risk.`,
          decision: {
            prompt: `The threshold approach hasn\'t worked. The AI is still operating outside its validated domain. What now?`,
            choices: [
              { id: `a`, label: `Suspend AI use at Millbrook immediately and proceed with the suspension and validation path`, quality: `good`,
                note: `Two more adverse outcomes confirm the threshold was insufficient. The right response is now the same as it should have been six weeks ago.` },
              { id: `b`, label: `Lower the threshold to 90% to reduce the risk further while the ODD work is completed`, quality: `poor`,
                note: `A higher threshold on an out-of-domain system is still not validation. The system shouldn\'t be in clinical use for AI-assisted diagnosis until the ODD gap is resolved.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_retroactive: {
          scene:       `desk-focused`,
          caption:     `The retroactive ODD documentation confirms what the confidence scores have been signalling: Millbrook\'s scanner protocols are outside the system\'s validated domain. The documentation took four weeks. During those four weeks, the AI remained in clinical use.`,
          sub_caption: `The ODD is now documented. It confirms the system should not have been in use at Millbrook. It has been in use for ten weeks.`,
          decision: {
            prompt: `The ODD documentation confirms the deployment was outside the validated domain from day one. What do you do?`,
            choices: [
              { id: `a`, label: `Suspend immediately, commission a full review of all ten weeks of AI-assisted scans, and notify the relevant clinical regulator`, quality: `good`,
                note: `Ten weeks of out-of-domain use requires a full review and regulatory notification. Suspension should have happened earlier — act on it now without further delay.` },
              { id: `b`, label: `Suspend and review the six-week adverse outcome period only — the earlier period predates the confirmed ODD finding`, quality: `poor`,
                note: `The ODD gap existed from deployment. The documentation confirming it doesn\'t change when the risk began. Review the full deployment period.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Immediate suspension, validated redeployment`,
          tone:    `good`,
          result:  `AI use was suspended within 24 hours. The six-week scan review identified four cases requiring clinical follow-up. The validation study on Millbrook\'s protocols took eight weeks. Performance on Millbrook\'s scanner protocols met the defined threshold. The system was redeployed with an ODD document that explicitly includes Millbrook\'s equipment specifications. The incident became the basis for a mandatory ODD documentation requirement for all future deployments.`,
          learning: `An AI system operating outside its Operational Design Domain is operating without validated performance evidence. Suspension is the right immediate response — not threshold adjustments, not documentation projects run in parallel with continued clinical use.`,
          score:   100,
        },
        outcome_good: {
          heading: `Suspension followed, redeployment path found`,
          tone:    `good`,
          result:  `The suspension happened, though the redeployment path was less efficient than the validation approach. The scan review found four cases requiring follow-up. Redeployment was eventually completed on a longer timeline than necessary. The ODD gap was resolved.`,
          learning: `Validation of current performance is faster than retraining when the question is whether performance is acceptable. Both paths resolve the ODD gap; the right choice depends on whether the performance gap is due to data distribution or model capacity.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Two additional adverse outcomes before suspension`,
          tone:    `warn`,
          result:  `The threshold approach led to two more adverse outcomes before suspension. The total adverse outcome count was five. The regulatory notification included the delay between initial adverse outcomes and suspension. The regulator\'s review noted that the threshold approach had been used as a substitute for suspension rather than as a bridge to it.`,
          learning: `Threshold adjustments on an out-of-domain system are not a control — they are risk reduction on top of an unresolved risk. When a system is operating outside its validated domain, the clinical risk doesn\'t reduce to acceptable levels by raising the threshold.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Extended out-of-domain use, regulatory exposure`,
          tone:    `bad`,
          result:  `The AI remained in use at Millbrook for an extended period under conditions that were outside its validated domain. The eventual regulatory notification covered the full deployment period. The regulator\'s review found that the CMO had received confirmed evidence of ODD failure and had not suspended clinical use. The clinical governance review was significant.`,
          learning: `Once ODD failure is confirmed, continued clinical use is not a risk management decision — it\'s an unmanaged risk. Suspension is the only appropriate response when a clinical AI system is confirmed to be operating outside its validated domain.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ─────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `Go-live checklist item 7: Equipment compatibility — confirmed. That confirmation covered software compatibility, not AI performance validation on Millbrook\'s scanner protocols. These are different things.`,
          sub_caption: `The checklist asked the wrong question.`,
          decision: {
            prompt: `The CMO asks: what did the go-live checklist actually verify, and what did it miss?`,
            choices: [
              { id: `a`, label: `Honest and specific: the checklist verified software compatibility, not AI model performance on Millbrook\'s specific scanner protocols. These are different checks and the second wasn\'t done.`, quality: `good`,
                note: `Accurate and specific. The CMO needs to understand exactly what the checklist covered and what the gap was — not a general statement about deployment complexity.` },
              { id: `b`, label: `The deployment followed the standard process — the gap is in the standard process, not the Millbrook deployment specifically`, quality: `partial`,
                note: `True that the process gap is systemic. But the specific failure at Millbrook is also yours to own — the checklist was your document and you completed it.` },
              { id: `c`, label: `Equipment compatibility was confirmed by the vendor — if the vendor's confirmation was insufficient, that\'s a vendor issue`, quality: `poor`,
                note: `The vendor confirmed software compatibility — that\'s exactly what they were asked. The clinical performance validation question was never put to them. The gap is in what was asked, not what was answered.` },
            ],
          },
          branches: { a: `n2_owns`, b: `n2_systemic`, c: `n2_vendor` },
        },

        n2_owns: {
          scene:       `office-bright`,
          caption:     `The CMO asks what needs to change in the deployment process to prevent this recurring across any future partnership deployments.`,
          sub_caption: `Three other rural partnerships are in the pipeline.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: `a`, label: `ODD documentation as a mandatory pre-deployment requirement: document the validated scanner types, protocols, and patient demographics before any deployment, and validate performance at any new site before go-live`, quality: `good`,
                note: `Specific and correct. The three pipeline deployments give this recommendation immediate practical value — it can be applied before the next one goes live.` },
              { id: `b`, label: `Add a clinical governance sign-off gate to the deployment checklist`, quality: `partial`,
                note: `A governance gate is useful but doesn\'t define what the gate should check. Without the specific requirement — ODD documentation and performance validation — the gate could be passed by another vendor call.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_systemic: {
          scene:       `office-meeting-hearing`,
          caption:     `The CMO asks: "Was the specific Millbrook checklist your document?" It was. "Did you complete item 7?" You did. "Did you know that software compatibility and AI performance validation were different checks?" You weren\'t sure.`,
          sub_caption: `The systemic framing has partially deflected but the specific accountability is still yours.`,
          decision: {
            prompt: `The CMO has established the specific accountability. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge you completed the checklist without understanding the difference between software compatibility and AI performance validation — and propose the specific fix`, quality: `good`,
                note: `Honest and constructive. The CMO doesn\'t need defensiveness — she needs to know the gap was in understanding, not in process compliance, so the fix addresses the right thing.` },
              { id: `b`, label: `Note that the checklist didn\'t define what "performance validation" meant — the ambiguity is the gap`, quality: `partial`,
                note: `The ambiguity is real. But "I completed a check I didn\'t fully understand" is a more complete account than "the form was ambiguous."` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_vendor: {
          scene:       `boardroom`,
          caption:     `The CMO asks: "Who wrote the checklist question that the vendor was asked to confirm?" You did. "Who determined that a vendor call was sufficient evidence of compatibility?" You did. She's looking at you.`,
          sub_caption: `The vendor framing has not held.`,
          decision: {
            prompt: `The accountability has been established. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the checklist design and the vendor call decision were both yours, and propose the ODD documentation requirement as the specific fix`, quality: `good`,
                note: `Full accountability and a constructive path forward. This is the response the CMO needs.` },
              { id: `b`, label: `Accept the accountability finding but defer to clinical governance on what the appropriate validation standard should have been`, quality: `partial`,
                note: `Deferring the solution to clinical governance is reasonable — the performance threshold question does require clinical input. But the process design accountability is yours.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Deployment gap owned, ODD requirement proposed`,
          tone:    `good`,
          result:  `Your honest account and specific recommendation — ODD documentation as a mandatory pre-deployment requirement — were both accepted immediately. The three pipeline deployments were paused pending ODD documentation and performance validation. The first of the three completed the validation study in six weeks; performance was within acceptable bounds and it went live on schedule. Your recommendation became the organisational standard for clinical AI deployments.`,
          learning: `Deployment checklists for AI systems need to distinguish software compatibility from model performance validation. These are different questions requiring different evidence. A vendor call answers one; a validation study answers the other.`,
          score:   100,
        },
        outcome_good: {
          heading: `Accountability taken, process improved`,
          tone:    `good`,
          result:  `The deployment gap was acknowledged and the process was improved with a governance gate. The gate definition was strengthened over the subsequent weeks as the ODD documentation requirement was developed. The three pipeline deployments went through the improved process. The Millbrook gap was not repeated.`,
          learning: `A governance gate is only as strong as what it requires evidence of. A gate that accepts a vendor call as performance validation has the same gap as no gate. Define the specific evidence required, not just the checkpoint.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Accountability deflected, late ownership`,
          tone:    `warn`,
          result:  `The systemic framing delayed full accountability by one meeting. The CMO\'s patience was evident. The ODD documentation requirement was eventually proposed and accepted. The three pipeline deployments were paused. The process improvement happened on a week-longer timeline than it would have with an immediate honest account.`,
          learning: `Systemic framing is appropriate when a genuine systemic gap exists. It\'s not appropriate as a substitute for acknowledging specific accountability when the specific decisions were yours.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Accountability avoided, process improvement delayed`,
          tone:    `bad`,
          result:  `The vendor framing added two meetings before the specific accountability was established. The process improvement was delayed proportionally. One of the three pipeline deployments completed its go-live during the period before the process change — using the original checklist. It is now in clinical use at a site where ODD validation has not been completed.`,
          learning: `When deployment decisions were yours, the fastest path to fixing the process is owning the decisions and proposing the fix. Deflection extends the timeline for the improvement and creates the risk of the gap being repeated on the next deployment.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Training data: St Catherine\'s GE Revolution scanners, standard protocol. Millbrook data: Siemens SOMATOM, different HU calibration, different slice thickness. The validation study used only St Catherine\'s data.`,
          sub_caption: `The confidence scores have been correct. The system has been signalling it\'s out of its training distribution for six weeks.`,
          decision: {
            prompt: `The CMO needs two findings: (1) Is Millbrook within the AI\'s validated ODD? (2) Are the three adverse outcomes causally linked to the ODD failure? What do you establish first?`,
            choices: [
              { id: `a`, label: `ODD boundary first — confirm whether Millbrook\'s scanner specifications fall within the system\'s validated domain before assessing causality`, quality: `good`,
                note: `Logical sequence: establish the ODD gap first, then assess whether the adverse outcomes are plausibly attributable to operating outside it. Causality claim requires ODD gap established first.` },
              { id: `b`, label: `Causality first — if the adverse outcomes aren\'t linked to the confidence scores, the ODD question is secondary`, quality: `partial`,
                note: `Causality matters, but it can\'t be properly assessed without establishing the ODD boundary. Causality analysis that precedes ODD confirmation may reach the wrong conclusion.` },
            ],
          },
          branches: { a: `n2_odd_first`, b: `n2_causality_first` },
        },

        n2_odd_first: {
          scene:       `desk-focused`,
          caption:     `ODD analysis complete. The validation study was conducted exclusively on GE Revolution scanner output. Millbrook's Siemens SOMATOM produces systematic differences in three image features the model uses: HU calibration offset of ~18 units, 20% thicker slice reconstruction, different noise profile. Millbrook is outside the validated ODD.`,
          sub_caption: `The confidence scores were the model\'s correct response to out-of-distribution input. It was working as designed — signalling uncertainty. The humans weren\'t equipped to act on that signal.`,
          decision: {
            prompt: `ODD gap confirmed. Now assess causality for the three adverse outcomes.`,
            choices: [
              { id: `a`, label: `Present the causal chain clearly: ODD failure → systematically lower confidence scores → clinicians lacking guidance on what low confidence means → clinical decisions made without adequate signal interpretation`, quality: `good`,
                note: `This is the complete causal chain. The AI failure is the ODD deployment. The clinical failure is the absence of guidance on how to respond to the confidence scores.` },
              { id: `b`, label: `State that the adverse outcomes occurred during ODD-failure conditions — causal attribution requires clinical expert input beyond your scope`, quality: `partial`,
                note: `Clinical causality does require clinical input. But you can establish the technical causal chain — ODD failure produced unreliable outputs — while noting that clinical impact assessment requires a clinician.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_causality_first: {
          scene:       `desk-working`,
          caption:     `Causality analysis: all three adverse outcomes involved AI confidence scores below 65%. In each case the AI finding was accepted without escalation. But you need to confirm whether 65% confidence is below the system\'s normal operating range before attributing causality to ODD failure.`,
          sub_caption: `Your causality analysis is incomplete without the ODD finding.`,
          decision: {
            prompt: `The causality analysis needs the ODD confirmation to be complete. Do you present what you have or complete the ODD analysis first?`,
            choices: [
              { id: `a`, label: `Complete the ODD analysis first — present both findings together for a complete picture`, quality: `good`,
                note: `Correct. The CMO needs both findings together to understand the full picture. A partial causality finding without the ODD confirmation is ambiguous.` },
              { id: `b`, label: `Present the partial causality finding now and follow up with the ODD analysis — the CMO needs information today`, quality: `partial`,
                note: `If the CMO genuinely needs information today and the ODD analysis takes days, a partial finding with clear caveats is reasonable. But the ODD analysis is typically completed within hours — better to complete it first.` },
            ],
          },
          branches: { a: `n2_odd_first`, b: `outcome_good` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Complete technical finding: ODD gap and causal chain`,
          tone:    `good`,
          result:  `Your analysis confirmed the ODD gap and the causal chain clearly. The CMO had everything needed for the suspension decision, the scan review scope, and the regulatory notification within four hours. Your finding that the confidence scores were the AI correctly signalling out-of-distribution input — and that the clinical failure was the absence of guidance on interpreting them — shaped the redeployment design: staff training on confidence score thresholds was added as a mandatory requirement.`,
          learning: `A low confidence score from a well-designed AI system is a signal, not a failure. The failure at Millbrook was twofold: deploying the system outside its validated domain, and not giving clinicians the information they needed to act on the confidence signals it was correctly sending.`,
          score:   100,
        },
        outcome_good: {
          heading: `ODD confirmed, causality appropriately scoped`,
          tone:    `good`,
          result:  `The ODD gap was confirmed clearly. Causality was appropriately deferred to clinical expert input for the outcome-specific question. The CMO had what she needed for the suspension decision. The clinical causality review was completed by the medical team within the week and confirmed the link.`,
          learning: `Technical causality (ODD failure → unreliable outputs) and clinical causality (unreliable outputs → adverse clinical outcomes) are different questions. The analyst owns the technical chain; clinical experts own the clinical impact assessment.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Partial finding presented, ODD gap confirmed later`,
          tone:    `warn`,
          result:  `The partial causality finding was presented before the ODD confirmation. The CMO asked whether the confidence scores were within or outside the system\'s normal range — a question your analysis couldn\'t yet answer. The ODD analysis was completed the following day. The complete picture arrived 24 hours later than it would have with the correct sequencing.`,
          learning: `Causality attribution for an ODD failure requires the ODD boundary to be established first. The finding is only complete when both questions are answered — presenting the causality analysis before the ODD confirmation creates an incomplete and potentially misleading picture.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Incomplete analysis, decision delayed`,
          tone:    `bad`,
          result:  `The CMO made the suspension decision on the partial finding. When the ODD analysis arrived the following day, it confirmed the gap but also identified that the causality chain was more complex than the initial analysis had suggested — the confidence scores were systematically lower, not just occasionally lower. The initial finding had understated the scope of the issue.`,
          learning: `Partial findings presented as sufficient create the risk of decisions made on incomplete information. The sequence — ODD first, causality second — is logical because causality attribution requires the ODD boundary to be established.`,
          score:   15,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `ODD documentation`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `No Operational Design Domain was defined for the AI system before deployment. The validated scanner types, protocols, and patient demographics were never documented. Millbrook\'s Siemens SOMATOM scanners with different protocols were outside the system\'s training distribution — and nobody knew it because the boundary had never been drawn.`,
    },
    {
      id:      `c2`,
      label:   `OOD detection`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `The system produced low confidence scores — it was correctly signalling out-of-distribution input. But there was no automated OOD detection mechanism that would have flagged the systematic nature of the pattern or prevented the scans from being processed through the standard pathway.`,
    },
    {
      id:      `c3`,
      label:   `Graceful degradation`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `When confidence scores fell below a defined threshold, the system should have routed scans to mandatory human review rather than displaying a finding. The absence of a graceful degradation pathway meant low-confidence outputs were presented identically to high-confidence outputs, without any workflow change.`,
    },
  ],
};
