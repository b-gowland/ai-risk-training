// B5 — The Determination Nobody Can Explain
// Agentic Logging & Auditability
//
// Setting: A financial services firm deploys an AI agent for compliance document
// review. 12 months in, a regulatory examination asks the firm to demonstrate
// a specific compliance determination and the agent's reasoning. The logs show
// the entry was added — but not which document was processed, what was found,
// or why the determination was reached. The document has been deleted from the
// intake queue. The reasoning is unrecoverable.
//
// Differentiation from b1-accountability:
//   B1 is about governance accountability gaps — nobody owns the decision.
//   B5 is specifically about the technical absence of audit trails for agentic
//   actions — the accountability framework exists, but the logs don't support
//   it. The failure is architectural (what the logging system captures) not
//   governance (who is responsible). Controls are technical logging requirements,
//   not governance structure. Intermediate difficulty.

export const scenario = {
  id:                `b5-agentic-logging`,
  risk_ref:          `B5`,
  title:             `The Determination Nobody Can Explain`,
  subtitle:          `Agentic Logging, Auditability & Unrecoverable Reasoning`,
  domain:            `B — Governance & Accountability`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-b-governance/b5-agentic-logging`,
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Compliance Officer`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `You use the AI agent every day to review documents and log compliance entries. Now a regulator is asking you to explain a specific entry — and you can't.`,
      premise:   `You're a compliance officer. For the past 12 months you've used the AI agent to help process regulatory document intake — the agent reads uploaded documents, flags compliance issues, and adds entries to the tracking system. You've reviewed hundreds of entries. The system has worked well. Now, during a regulatory examination, the examiner asks about a compliance determination recorded 11 months ago for a specific counterparty. You open the tracking system. The entry is there. The agent logged it. But the entry contains only the determination — no document reference, no flags found, no reasoning. The original document has been deleted from the intake queue per the normal retention cycle. You have nothing to show the examiner.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Compliance Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The regulator is asking to see the basis for an AI-assisted compliance determination made 11 months ago. The logs don't contain it. The document is gone. You have no answer.`,
      premise:   `Your regulatory examination has hit a significant obstacle. The examiner has selected a specific compliance determination — one of hundreds logged by the AI agent over the past year — and asked for the documentation basis and the agent's reasoning. The compliance tracking system shows the determination was recorded. The agent's application logs show it ran. But neither log contains: which document was processed, what the agent found in the document, or how the determination was reached. The original document was deleted per the 90-day retention cycle. The examiner has flagged this as a potential regulatory finding. You need to understand how this happened and what you're going to tell them.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Compliance Technology PM`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You deployed the compliance AI agent. The logging specification you approved captures "action taken" — not "document processed," "issues found," or "reasoning applied."`,
      premise:   `You led the compliance AI agent deployment 14 months ago. The project brief was to reduce manual review workload. The technical specification you approved for the logging system captures: timestamp, action type, and outcome (determination added to tracking system). It does not capture: document identifier, document content hash, issues flagged during processing, or model reasoning. You made a pragmatic decision to minimise logging overhead. The regulatory examination has now surfaced what that decision costs: a specific determination the agent made cannot be explained or evidenced. The examiner is asking whether other determinations in the system share the same logging gap.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Technology Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You assessed the compliance AI agent deployment. Your assessment covered access controls and data classification. It did not ask: if a regulator asks this agent to explain a determination, can it?`,
      premise:   `Your technology risk assessment for the compliance AI agent is being reviewed in light of the regulatory examination finding. The assessment covered: data security, access controls, model vendor due diligence, and output accuracy testing. It did not cover: audit trail adequacy, regulatory explainability requirements for AI-assisted compliance determinations, or the logging specification's capacity to support a future examination. The firm's compliance obligations in your jurisdiction require that compliance determinations be auditable and traceable to their basis. Your assessment did not verify this requirement against the logging design. The examiner has now identified that it cannot be met.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `An examiner is waiting. An AI-assisted compliance determination is in the system. The log has a timestamp and an outcome — but no document reference, no reasoning trace, no indication of what the AI considered.`,
          sub_caption: `The determination was made. The log doesn't explain how.`,
          decision: {
            prompt: `What is the difference between logging that a decision was made and logging how it was made?`,
            choices: [
              { id: `a`, label: `Outcome logging records what the AI decided — process logging records the inputs, reasoning, and evidence the AI used to reach that decision. Regulators need process logging to assess whether the decision was appropriate`, quality: `good`,
                note: `The key distinction. A log that records 'determination: compliant, timestamp: 09:14' tells a regulator that a determination was made. It doesn't tell them what documents were reviewed or whether the AI's reasoning was sound.` },
              { id: `b`, label: `Outcome logging is sufficient if the determination is correct — regulators care about accuracy, not process`, quality: `poor`,
                note: `Regulators care about both. In regulated contexts, the ability to demonstrate how a decision was reached is often a standalone compliance requirement.` },
              { id: `c`, label: `The examiner can review the underlying documents themselves — the log doesn't need to replicate what's already in the file`, quality: `partial`,
                note: `Document availability doesn't substitute for a reasoning trace. Without the log showing which documents the AI considered and how it weighted them, the examiner can't assess whether the determination was sound.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-review`,
          caption:     `An examiner is waiting. An AI-assisted compliance determination is in the system. The log has a timestamp and an outcome — but no document reference, no reasoning trace, no indication of what the AI considered.`,
          decision: {
            prompt: `What is the difference between logging that a decision was made and logging how it was made?`,
            choices: [
              { id: `a`, label: `Outcome logging records what the AI decided — process logging records the inputs, reasoning, and evidence the AI used to reach that decision. Regulators need process logging to assess whether the decision was appropriate`, quality: `good`,
                note: `The key distinction. A log that records 'determination: compliant, timestamp: 09:14' tells a regulator that a determination was made. It doesn't tell them what documents were reviewed or whether the AI's reasoning was sound.` },
              { id: `b`, label: `Outcome logging is sufficient if the determination is correct — regulators care about accuracy, not process`, quality: `poor`,
                note: `Regulators care about both. In regulated contexts, the ability to demonstrate how a decision was reached is often a standalone compliance requirement.` },
              { id: `c`, label: `The examiner can review the underlying documents themselves — the log doesn't need to replicate what's already in the file`, quality: `partial`,
                note: `Document availability doesn't substitute for a reasoning trace. Without the log showing which documents the AI considered and how it weighted them, the examiner can't assess whether the determination was sound.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-reading`,
          caption:     `The examiner is waiting. The entry is in the system. The log has no document reference, no reasoning, no flags found. The original document is gone.`,
          decision: {
            prompt: `What do you tell the examiner?`,
            choices: [
              { id: `a`, label: `Tell the examiner the determination was made by the AI agent, that the current logging system doesn't retain the document reference or reasoning, and ask for time to escalate to your CCO`, quality: `good`,
                note: `Accurate and professional. You're telling the examiner the truth — the log entry exists, the basis is unrecoverable from the current system, and you're escalating to the right authority. This is better than fabrication or delay.` },
              { id: `b`, label: `Tell the examiner the document was deleted per normal retention policy and the determination stands on its own`, quality: `poor`,
                note: `Accurate about the deletion, but "the determination stands on its own" is not a satisfactory answer to a regulatory examiner asking for evidential basis. This response is likely to deepen the finding, not resolve it.` },
              { id: `c`, label: `Ask the examiner to move to another determination while you investigate — buy some time to find any additional records`, quality: `partial`,
                note: `Buying time to investigate is understandable, but it signals evasion to an experienced examiner. The honest answer — the log doesn't contain what they've asked for — is more credible than a deflection.` },
            ],
          },
          branches: { a: `n2_escalate`, b: `n2_standalone`, c: `n2_delay` },
        },

        n2_escalate: {
          scene:       `desk-call`,
          caption:     `You've escalated to your CCO. They're now in the room with the examiner. The examiner has a follow-on question: how many other determinations in the system have the same logging gap?`,
          sub_caption: `The scope question is the one that matters now.`,
          decision: {
            prompt: `What do you tell the examiner about the scope?`,
            choices: [
              { id: `a`, label: `All agent-made determinations in the system have the same logging gap — the logging specification never included document references or reasoning`, quality: `good`,
                note: `Accurate and complete. The examiner will determine scope in any case — a full honest disclosure of scope is better than a partial answer that the examiner then expands through their own investigation.` },
              { id: `b`, label: `Only the determinations from the first six months — you believe a logging update improved things`, quality: `partial`,
                note: `If this is accurate, it's a useful clarification. But "you believe" is not the same as "you can confirm." Uncertain claims about partial scope that turn out to be wrong will worsen the finding.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_standalone: {
          scene:       `office-meeting-hearing`,
          caption:     `The examiner flags the answer as inadequate. They ask for the compliance determination process documentation — specifically, what the audit trail for an AI-assisted determination is supposed to contain.`,
          sub_caption: `The examiner is now investigating the process, not just the specific determination.`,
          decision: {
            prompt: `What do you do now?`,
            choices: [
              { id: `a`, label: `Escalate immediately to your CCO — this has become an examination finding and needs senior management engagement`, quality: `good`,
                note: `Correct. The examiner has escalated from a specific query to a process investigation. This is now above the compliance officer's level to manage alone.` },
              { id: `b`, label: `Provide the process documentation yourself and attempt to manage the examiner's concerns at your level`, quality: `poor`,
                note: `An examination finding of this significance is not within the compliance officer's authority to manage unilaterally. Escalation to the CCO is the correct step.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_delay: {
          scene:       `desk-waiting`,
          caption:     `The examiner agrees to move on but notes the deferral. You spend 30 minutes searching every system for additional records. There are none.`,
          sub_caption: `The deferral bought time but found nothing.`,
          decision: {
            prompt: `You need to go back to the examiner. What do you tell them?`,
            choices: [
              { id: `a`, label: `Tell the examiner the logging system doesn't retain what they've asked for and escalate to your CCO`, quality: `good`,
                note: `The honest answer, delivered after the investigation confirmed there's nothing to find. Better late than not at all — and better to escalate to the CCO at this point rather than continue to manage it alone.` },
              { id: `b`, label: `Tell the examiner the records exist but are archived and you'll produce them within 48 hours`, quality: `poor`,
                note: `If the records don't exist, this answer will result in an escalated finding when the 48 hours pass. Fabricating the existence of records to an examiner is a serious regulatory conduct issue.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

      },
      outcomes: {
        outcome_good: {
          heading:  `Honest disclosure — scope confirmed, escalation appropriate`,
          tone:     `good`,
          score:    76,
          result:   `The examiner acknowledges the honest disclosure. A regulatory finding is recorded: AI-assisted compliance determinations lack adequate audit trails. The firm commits to a logging remediation plan within 60 days. The examination closes with a single finding rather than an investigation into examination conduct.`,
          learning: `You couldn't change the logging gap — that was a deployment decision made 14 months ago. What you could control was how you disclosed it. Accurate, complete, early disclosure — with immediate escalation — gives the regulator confidence in the firm's integrity even when the underlying gap is significant.`,
        },
        outcome_warn: {
          heading:  `Finding recorded, partial disclosure`,
          tone:     `warn`,
          score:    50,
          result:   `A regulatory finding is recorded. The partial disclosure of scope led the examiner to conduct their own scope investigation, which confirmed the broader gap and extended the examination by two days. The finding is the same — inadequate audit trails — but the examination process was more adversarial than it needed to be.`,
          learning: `Uncertain claims about scope that turn out to be inaccurate compound the finding. When scope is genuinely uncertain, say so — "we believe the gap may be limited to X, but we need to confirm" is better than "the gap is limited to X" when you're not sure.`,
        },
        outcome_bad: {
          heading:  `Examination conduct finding`,
          tone:     `bad`,
          score:    22,
          result:   `The examiner records both a substantive finding (inadequate audit trails) and a conduct finding (misleading response during examination). Regulatory engagement intensifies significantly. The CCO is formally notified by the regulator. A follow-up examination is scheduled for 90 days.`,
          learning: `The substantive finding — logging gap — was manageable with honest disclosure. The conduct issue — a misleading response or a false claim about records — is a separate and more serious matter. Regulators distinguish between firms that have control failures and firms that are not candid about them.`,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `office-briefing-urgent`,
          caption:     `A regulator is asking for the reasoning behind a specific AI-assisted compliance determination. The log has an outcome and a timestamp. Nothing else.`,
          sub_caption: `The determination was made eight months ago. Without a reasoning trace, you can't reconstruct it.`,
          decision: {
            prompt: `What does the inability to reconstruct an AI-assisted determination tell a regulator about the organisation's AI governance?`,
            choices: [
              { id: `a`, label: `That the organisation deployed AI for compliance-sensitive decisions without implementing the logging infrastructure needed to make those decisions auditable — a governance gap, not just a technical one`, quality: `good`,
                note: `The correct characterisation. Auditable decision-making is a governance requirement. Deploying AI for compliance determinations without adequate logging means the organisation accepted regulatory risk at deployment.` },
              { id: `b`, label: `That the logging system had a failure — outcomes were captured but process data was lost`, quality: `partial`,
                note: `Possible, but the more common explanation is that process logging was never specified. The distinction matters for the remediation.` },
              { id: `c`, label: `That the determination can be re-run with the same inputs to reconstruct the reasoning`, quality: `poor`,
                note: `Re-running an AI determination eight months later doesn't reconstruct what the AI decided eight months ago. A re-run produces a new determination — not evidence of the original one.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `office-briefing-urgent`,
          caption:     `A regulator is asking for the reasoning behind a specific AI-assisted compliance determination. The log has an outcome and a timestamp. Nothing else.`,
          decision: {
            prompt: `What does the inability to reconstruct an AI-assisted determination tell a regulator about the organisation's AI governance?`,
            choices: [
              { id: `a`, label: `That the organisation deployed AI for compliance-sensitive decisions without implementing the logging infrastructure needed to make those decisions auditable — a governance gap, not just a technical one`, quality: `good`,
                note: `The correct characterisation. Auditable decision-making is a governance requirement. Deploying AI for compliance determinations without adequate logging means the organisation accepted regulatory risk at deployment.` },
              { id: `b`, label: `That the logging system had a failure — outcomes were captured but process data was lost`, quality: `partial`,
                note: `Possible, but the more common explanation is that process logging was never specified. The distinction matters for the remediation.` },
              { id: `c`, label: `That the determination can be re-run with the same inputs to reconstruct the reasoning`, quality: `poor`,
                note: `Re-running an AI determination eight months later doesn't reconstruct what the AI decided eight months ago. A re-run produces a new determination — not evidence of the original one.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `office-meeting-tense`,
          caption:     `The examiner has flagged that a specific AI-assisted compliance determination cannot be evidenced. The log exists. The document is gone. The reasoning was never captured.`,
          decision: {
            prompt: `What is your immediate response to the examiner?`,
            choices: [
              { id: `a`, label: `Acknowledge the gap directly, provide an honest scope assessment, and commit to a logging remediation plan within 60 days`, quality: `good`,
                note: `This is the response that keeps the examination on a single finding track. The examiner needs to understand: the gap is real, the scope is X, the firm will fix it. Regulators distinguish between firms with control gaps and firms that aren't candid about them.` },
              { id: `b`, label: `Request time to conduct an internal investigation before making any commitments to the examiner`, quality: `partial`,
                note: `An internal investigation may be appropriate for complex factual questions, but the logging gap itself is not disputed — the log doesn't contain the document reference or reasoning. Requesting investigation time for a clear factual matter signals evasion.` },
              { id: `c`, label: `Escalate to the board before responding to the examiner`, quality: `poor`,
                note: `Board escalation is not faster than the examiner's timeline. The CCO has authority to respond to this finding — waiting for board direction will be read as inability to manage the examination.` },
            ],
          },
          branches: { a: `n2_scope`, b: `n2_investigate`, c: `n2_board` },
        },

        n2_scope: {
          scene:       `office-meeting`,
          caption:     `The examiner accepts the acknowledgement. They want to understand the scope: how many determinations share the logging gap?`,
          sub_caption: `Honest scope disclosure now determines the examination outcome.`,
          decision: {
            prompt: `What is your scope disclosure?`,
            choices: [
              { id: `a`, label: `All agent-assisted determinations over the 12-month deployment period share the gap — the logging specification never captured document references or reasoning`, quality: `good`,
                note: `Full honest scope disclosure. The examiner will determine this in any case — proactive disclosure is always better than a disclosure forced by investigation. The finding will be the same; the firm's cooperation record will be different.` },
              { id: `b`, label: `Only determinations from before a logging update — you believe the current system captures more detail`, quality: `partial`,
                note: `If accurate, this is an important clarification. Confirm it with the PM before stating it to the examiner — uncertain claims that turn out to be wrong compound the finding.` },
            ],
          },
          branches: { a: `n3_remediation`, b: `outcome_warn` },
        },

        n2_investigate: {
          scene:       `desk-working`,
          caption:     `The investigation takes three days. The examiner waits. The finding: all agent-assisted determinations share the logging gap. The investigation confirmed what the log already showed.`,
          sub_caption: `Three days spent confirming what was already known. The examiner has noted the delay.`,
          decision: {
            prompt: `You now have the investigation result. How do you present it to the examiner?`,
            choices: [
              { id: `a`, label: `Present the full scope finding with a concrete remediation plan — the investigation delay is already on the record, so the response quality matters more now`, quality: `good`,
                note: `Correct. The investigation delay can't be undone. A comprehensive, concrete remediation plan is the best recovery — it shows the firm will address the gap systematically, not just reactively.` },
              { id: `b`, label: `Present the finding and request additional time to develop the remediation plan`, quality: `partial`,
                note: `A remediation plan should be producible in parallel with the investigation. Arriving at the examiner with a finding but no plan after three days of investigation is a weak position.` },
            ],
          },
          branches: { a: `n3_remediation`, b: `outcome_warn` },
        },

        n2_board: {
          scene:       `boardroom`,
          caption:     `The board is convened. The examiner notes the delay in responding. By the time the board session concludes, the examiner has conducted their own scope investigation and confirmed the full 12-month gap.`,
          sub_caption: `The examination proceeded without you. The finding is the same as it would have been with immediate disclosure — plus a conduct note on the delay.`,
          decision: {
            prompt: `How do you proceed with the examiner now?`,
            choices: [
              { id: `a`, label: `Accept the examiner's scope finding and commit to the remediation plan you've developed during the delay`, quality: `good`,
                note: `The only productive path remaining. Accept the finding, present the remediation plan. The delay is on the record but the remediation quality still matters.` },
              { id: `b`, label: `Challenge the examiner's scope finding — you believe their investigation overstated the gap`, quality: `poor`,
                note: `Challenging an examiner's scope finding after a self-imposed delay is very likely to worsen the examination outcome. Unless the examiner's finding is factually wrong, acceptance and remediation is the correct path.` },
            ],
          },
          branches: { a: `n3_remediation`, b: `outcome_bad` },
        },

        n3_remediation: {
          scene:       `desk-report`,
          caption:     `The finding is agreed: AI-assisted compliance determinations lack adequate audit trails. You need to commit to a remediation plan. The examiner wants to know what the fixed system will capture.`,
          sub_caption: `The remediation plan determines whether this is a single finding or a recurring one.`,
          decision: {
            prompt: `What does the remediation plan include?`,
            choices: [
              { id: `a`, label: `Document identifier and hash, issues flagged, reasoning summary, determination, reviewer identity, and timestamp — all captured immutably for every agent-assisted determination`, quality: `good`,
                note: `This is the complete audit trail for a regulatory-grade compliance determination. Document identifier and hash allow reconstruction of what was processed; issues flagged and reasoning summary explain the determination; reviewer identity confirms human oversight; timestamp enables timeline reconstruction. This is what the logging specification should have included from day one.` },
              { id: `b`, label: `Document identifier and determination — the reasoning is proprietary to the model and may not be reliably capturable`, quality: `partial`,
                note: `Document identifier is essential, but reasoning summary is not optional for a regulated compliance determination. The model's internal reasoning may not be fully capturable, but a structured summary of findings — what issues were identified, what triggered the determination — is achievable and required.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Finding managed — comprehensive remediation plan accepted`,
          tone:     `good`,
          score:    86,
          result:   `The examination closes with one finding: inadequate logging for AI-assisted compliance determinations. The remediation plan is accepted. The examiner notes the CCO's candid disclosure and the comprehensiveness of the proposed fix. The remediated logging system is implemented within 60 days. The follow-up check confirms compliance. The regulatory relationship is intact.`,
          learning: `The finding was unavoidable — the logging gap was real and 12 months of determinations share it. What determined the examination outcome was the response: immediate acknowledgement, honest scope disclosure, and a comprehensive remediation plan. Regulators expect control gaps in AI deployments at this stage of the technology's maturity — they do not expect evasion or incomplete responses.`,
        },
        outcome_good: {
          heading:  `Finding recorded — partial remediation`,
          tone:     `good`,
          score:    68,
          result:   `The examination closes with a finding. The remediation plan captures document identifiers and determinations but not reasoning summaries. A follow-up check in 90 days tests whether the plan was implemented. The reasoning gap is flagged as an open item.`,
          learning: `Document identifier alone is insufficient for a regulatory compliance audit trail. The reasoning summary — what the agent found, what triggered the determination — is what allows a compliance team to explain a determination to a regulator years later. Without it, the same gap recurs in a different form.`,
        },
        outcome_warn: {
          heading:  `Finding expanded by uncertain scope disclosure`,
          tone:     `warn`,
          score:    44,
          result:   `The uncertain scope claim — that only early determinations share the gap — turned out to be inaccurate. The examiner's own investigation found the gap extends to all 12 months. The finding now includes a notation that scope disclosure was initially misleading. The examination is extended.`,
          learning: `When scope is uncertain, say so. "We believe the gap may be limited to earlier determinations, but we need to confirm with the technology team before stating that definitively" is the correct answer when you're not certain. A confident claim about scope that turns out to be wrong is more damaging than uncertainty.`,
        },
        outcome_bad: {
          heading:  `Examination finding and conduct note — regulatory escalation`,
          tone:     `bad`,
          score:    20,
          result:   `The examination records both a substantive finding (inadequate audit trails) and a process finding (delay in engagement, challenge of examiner's scope finding). Regulatory engagement intensifies. A formal remediation plan is required under the regulator's direction. Board notification from the regulator follows.`,
          learning: `Challenging an examiner's scope finding without strong factual grounds — particularly after a self-imposed engagement delay — signals that the firm is prioritising defensive positioning over cooperative resolution. Examiners have long memories and broad powers. Cooperation is always the better strategic choice.`,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ──────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The logging specification you approved captures timestamp, action type, and outcome. It doesn't capture document references, criteria applied, or reasoning. The CCO is asking why.`,
          sub_caption: `The specification was written for operational monitoring. It wasn't written for regulatory accountability.`,
          decision: {
            prompt: `What is the difference between operational logging and regulatory accountability logging for AI systems?`,
            choices: [
              { id: `a`, label: `Operational logging supports system monitoring. Accountability logging supports determination review — what did the AI consider, what criteria did it apply, what would a human reviewer need to assess the decision`, quality: `good`,
                note: `The correct distinction. These are different purposes requiring different data. Operational logs tell you whether the system is healthy. Accountability logs tell you whether specific decisions were appropriate.` },
              { id: `b`, label: `Regulatory accountability logging is the legal team's specification — the project shouldn't have approved a logging spec without legal sign-off`, quality: `partial`,
                note: `Legal involvement would have helped, but accountability logging is a business governance requirement that project management should understand.` },
              { id: `c`, label: `The logging spec was adequate for the use case as initially scoped — the accountability requirement emerged later`, quality: `poor`,
                note: `Compliance determination was the use case from the start. The accountability requirement didn't emerge — it was inherent in deploying AI for regulated decisions.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-working`,
          caption:     `The logging specification you approved captures timestamp, action type, and outcome. It doesn't capture document references, criteria applied, or reasoning. The CCO is asking why.`,
          decision: {
            prompt: `What is the difference between operational logging and regulatory accountability logging for AI systems?`,
            choices: [
              { id: `a`, label: `Operational logging supports system monitoring. Accountability logging supports determination review — what did the AI consider, what criteria did it apply, what would a human reviewer need to assess the decision`, quality: `good`,
                note: `The correct distinction. These are different purposes requiring different data. Operational logs tell you whether the system is healthy. Accountability logs tell you whether specific decisions were appropriate.` },
              { id: `b`, label: `Regulatory accountability logging is the legal team's specification — the project shouldn't have approved a logging spec without legal sign-off`, quality: `partial`,
                note: `Legal involvement would have helped, but accountability logging is a business governance requirement that project management should understand.` },
              { id: `c`, label: `The logging spec was adequate for the use case as initially scoped — the accountability requirement emerged later`, quality: `poor`,
                note: `Compliance determination was the use case from the start. The accountability requirement didn't emerge — it was inherent in deploying AI for regulated decisions.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-typing`,
          caption:     `The logging specification you approved captures: timestamp, action type, outcome. It does not capture: document identifier, issues flagged, or reasoning. That decision is now a regulatory finding.`,
          decision: {
            prompt: `The CCO asks you to explain the logging decision. What do you say?`,
            choices: [
              { id: `a`, label: `The logging specification was designed to minimise overhead — document references and reasoning were not included as a cost-reduction decision, and the regulatory auditability requirement was not applied to the specification`, quality: `good`,
                note: `Honest and accurate. The logging decision was pragmatic and the regulatory auditability requirement wasn't surfaced during design. This is the correct account of what happened and why.` },
              { id: `b`, label: `The model's internal reasoning isn't reliably capturable — this was a technical constraint, not a design choice`, quality: `poor`,
                note: `Model internal reasoning is one component, but the logging gap extends to document identifiers and flagged issues — neither of which is a technical constraint. The decision was a cost-reduction choice, not a technical limitation.` },
              { id: `c`, label: `The compliance team approved the system — if the logging was insufficient, they should have flagged it`, quality: `poor`,
                note: `The compliance team approved the system's compliance outputs, not the technical logging specification. The logging design was your responsibility. Deflecting to the compliance team is inaccurate and will not survive a post-incident review.` },
            ],
          },
          branches: { a: `n2_remediation`, b: `n2_technical`, c: `n2_deflect` },
        },

        n2_remediation: {
          scene:       `desk-focused`,
          caption:     `The CCO accepts the explanation and asks for the remediation specification within 48 hours. What the fixed system needs to capture for every agent-assisted determination.`,
          sub_caption: `48 hours. Six fields to specify.`,
          decision: {
            prompt: `What does the remediation logging specification include?`,
            choices: [
              { id: `a`, label: `Document identifier and hash, issues flagged by the agent, reasoning summary, determination reached, reviewer confirmation, and timestamp — all written immutably to the compliance log`, quality: `good`,
                note: `This is the complete specification for a regulatory-grade compliance audit trail. Document identifier + hash enables reconstruction of what was processed. Issues flagged + reasoning summary explain the determination. Reviewer confirmation shows human oversight. Timestamp enables timeline reconstruction. Immutable write prevents post-hoc modification.` },
              { id: `b`, label: `Document identifier, determination, and reviewer sign-off — keep the specification simple and implementable in 30 days`, quality: `partial`,
                note: `Implementable is important, but the reasoning summary is not optional for a regulated compliance determination. Without it, a future examiner asking "why did the agent reach this determination?" will get the same answer as today: nothing.` },
            ],
          },
          branches: { a: `n3_scope`, b: `outcome_good` },
        },

        n2_technical: {
          scene:       `office-meeting`,
          caption:     `The CCO asks technology to verify the technical constraint claim. Technology confirms that document identifiers, issues flagged, and reasoning summaries are all capturable — the logging specification simply didn't include them.`,
          sub_caption: `The technical constraint claim was inaccurate. The CCO now has a clearer picture of the decision.`,
          decision: {
            prompt: `How do you proceed?`,
            choices: [
              { id: `a`, label: `Acknowledge that the technical constraint framing was inaccurate and provide the correct account: the logging specification was a cost-reduction decision that didn't apply the regulatory auditability requirement`, quality: `good`,
                note: `Correct recovery. Acknowledging an inaccurate initial account and providing the correct one is better than compounding it. The CCO needs accurate information to brief the examiner.` },
              { id: `b`, label: `Maintain that some components — specifically the reasoning — are not reliably capturable and focus the discussion on what is`, quality: `poor`,
                note: `Technology has confirmed that reasoning summaries are capturable. Maintaining an inaccurate claim after it's been directly contradicted will further damage credibility with the CCO.` },
            ],
          },
          branches: { a: `n3_scope`, b: `outcome_warn` },
        },

        n2_deflect: {
          scene:       `office-meeting-hearing`,
          caption:     `The CCO asks the compliance team whether they approved the logging specification. They confirm they approved the system outputs, not the technical logging design. The post-incident review is now also examining the design approval process.`,
          sub_caption: `The deflection didn't land. The review has widened.`,
          decision: {
            prompt: `How do you respond to the review?`,
            choices: [
              { id: `a`, label: `Accept that the logging specification was your design decision and provide the remediation plan`, quality: `good`,
                note: `Correct recovery. Accept the finding, provide the remediation. The deflection is on the record but the response quality going forward still matters.` },
              { id: `b`, label: `Argue that the approval process should have included compliance sign-off on the technical specification — this is a process design failure, not a PM failure`, quality: `poor`,
                note: `This may be a valid process observation for the future, but it doesn't change the fact that the logging specification was your decision. Using it to deflect responsibility at this point will not be received well.` },
            ],
          },
          branches: { a: `n3_scope`, b: `outcome_bad` },
        },

        n3_scope: {
          scene:       `desk-review`,
          caption:     `The remediation specification is accepted. The examiner wants to know: will the remediation apply retrospectively? Can the missing data for the 12-month gap be reconstructed?`,
          sub_caption: `The honest answer is almost certainly no.`,
          decision: {
            prompt: `What do you tell the CCO to tell the examiner?`,
            choices: [
              { id: `a`, label: `Retrospective reconstruction is not possible — the documents are deleted and the model's reasoning at the time is unrecoverable. The remediation applies to all future determinations.`, quality: `good`,
                note: `Honest and accurate. The 12-month gap cannot be closed retroactively. The examiner needs to know this to form the correct view of the firm's exposure. A claim that retrospective reconstruction is possible, when it isn't, would be misleading.` },
              { id: `b`, label: `You'll investigate whether any partial reconstruction is possible — there may be metadata or other records`, quality: `partial`,
                note: `Investigation is reasonable if there genuinely might be partial records. But if the documents are deleted and the model reasoning is unrecoverable, this framing sets up a disclosure in a few days that says "we found nothing." Calibrate the claim to what you actually expect to find.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Root cause acknowledged, remediation complete`,
          tone:     `good`,
          score:    84,
          result:   `The remediation specification is implemented within 60 days. The examiner accepts the honest account of retrospective impossibility. The regulatory finding notes the comprehensive remediation and the CCO's candid engagement. Future examinations will find a compliant audit trail for every agent-assisted determination.`,
          learning: `The logging decision was pragmatic but didn't surface the regulatory auditability requirement. The fix is architectural — adding the right fields to the logging specification — not a governance or oversight change. The lesson for future agent deployments: apply the "can we explain this to a regulator in three years?" test to every logging design decision.`,
        },
        outcome_good: {
          heading:  `Remediation implemented, partial reasoning gap remains`,
          tone:     `good`,
          score:    66,
          result:   `The remediation captures document identifiers, determinations, and reviewer sign-offs. Reasoning summaries are not included in scope. A follow-up check flags the reasoning gap as an open item. A second remediation sprint is required to close it.`,
          learning: `The reasoning summary is the part of the audit trail that answers the examiner's hardest question: "why did the agent reach this determination?" Without it, the same gap recurs in a different form. Build it into the first remediation sprint.`,
        },
        outcome_warn: {
          heading:  `Credibility damaged — technical claim contradicted`,
          tone:     `warn`,
          score:    42,
          result:   `The technical constraint claim was contradicted by technology. The CCO's confidence in the PM's account is reduced. The remediation plan is accepted but scrutinised more heavily. A second review is required before the specification is approved.`,
          learning: `When a technical constraint claim is made in a post-incident context, it must be verified before it's stated. An inaccurate technical claim that's immediately contradicted by your own technology team is more damaging than acknowledging the design decision honestly from the start.`,
        },
        outcome_bad: {
          heading:  `Post-incident review widened — design authority questioned`,
          tone:     `bad`,
          score:    22,
          result:   `The post-incident review expanded to examine the full deployment approval process. The deflection to compliance approval created additional review work. The CCO notes that the PM's response pattern during the review was not cooperative. Remediation proceeds under closer oversight.`,
          learning: `Deflecting responsibility for a design decision to other teams in a post-incident review — particularly when the deflection is factually inaccurate — widens the review scope and damages the professional relationship with senior management. Own the decision, explain the reasoning, and provide the fix.`,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Your technology risk assessment approved this deployment. It covered data security, integration, and performance. Explainability and audit trail requirements weren't assessed.`,
          sub_caption: `The assessment evaluated the system's technical performance. It didn't evaluate its accountability architecture.`,
          decision: {
            prompt: `Why are explainability and audit trail requirements distinct from data security and performance in an AI risk assessment?`,
            choices: [
              { id: `a`, label: `Data security protects information from unauthorised access — explainability and audit trails ensure that authorised decisions can be reviewed and challenged. They address different accountability obligations`, quality: `good`,
                note: `The correct framing. Security protects data; accountability enables review. A system can be fully secure and still produce decisions that can't be audited — security and accountability are independent dimensions.` },
              { id: `b`, label: `They're all part of the same risk domain — data governance covers security, explainability, and audit trails`, quality: `partial`,
                note: `Treating them as the same assessment item means explainability gets evaluated against data security criteria, which are the wrong criteria. They need explicit assessment against regulatory accountability requirements.` },
              { id: `c`, label: `Explainability requirements depend on the model type — if the model is interpretable, the audit trail requirement is automatically met`, quality: `poor`,
                note: `Model interpretability and audit trail requirements are different things. Interpretability doesn't automatically produce a logged reasoning trace for specific decisions at the time they were made.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `analyst-desk`,
          caption:     `Your technology risk assessment approved this deployment. It covered data security, integration, and performance. Explainability and audit trail requirements weren't assessed.`,
          decision: {
            prompt: `Why are explainability and audit trail requirements distinct from data security and performance in an AI risk assessment?`,
            choices: [
              { id: `a`, label: `Data security protects information from unauthorised access — explainability and audit trails ensure that authorised decisions can be reviewed and challenged. They address different accountability obligations`, quality: `good`,
                note: `The correct framing. Security protects data; accountability enables review. A system can be fully secure and still produce decisions that can't be audited — security and accountability are independent dimensions.` },
              { id: `b`, label: `They're all part of the same risk domain — data governance covers security, explainability, and audit trails`, quality: `partial`,
                note: `Treating them as the same assessment item means explainability gets evaluated against data security criteria, which are the wrong criteria. They need explicit assessment against regulatory accountability requirements.` },
              { id: `c`, label: `Explainability requirements depend on the model type — if the model is interpretable, the audit trail requirement is automatically met`, quality: `poor`,
                note: `Model interpretability and audit trail requirements are different things. Interpretability doesn't automatically produce a logged reasoning trace for specific decisions at the time they were made.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `analyst-desk-privacy`,
          caption:     `Your technology risk assessment approved this deployment. It covered data security and model accuracy. It did not ask: if a regulator asks for the basis of a specific determination in three years, can the firm provide it?`,
          decision: {
            prompt: `The post-incident review asks what the assessment should have included. What's your answer?`,
            choices: [
              { id: `a`, label: `The assessment should have verified that the logging specification meets the firm's regulatory audit trail obligations for AI-assisted compliance determinations — this wasn't in the standard template`, quality: `good`,
                note: `Accurate and constructive. The gap is in the methodology — the template didn't include a step that checks whether the logging design supports the firm's regulatory obligations. This is fixable with a template update.` },
              { id: `b`, label: `The assessment covered what was in scope — logging specification review is a compliance function, not a technology risk function`, quality: `poor`,
                note: `Technology risk assessments for regulated systems need to include regulatory auditability checks. The logging specification is a technical design choice with direct regulatory consequence — it falls within the technology risk assessment scope.` },
              { id: `c`, label: `The compliance team should have specified what the logging needed to capture — the assessment can only review what's been designed`, quality: `partial`,
                note: `Partially valid — the compliance team's regulatory knowledge should inform the logging specification. But the technology risk assessment should have tested whether the logging design meets the regulatory obligation, regardless of who specified it.` },
            ],
          },
          branches: { a: `n2_template`, b: `n2_scope_dispute`, c: `n2_partial` },
        },

        n2_template: {
          scene:       `desk-review`,
          caption:     `The review accepts the explanation. You're asked to produce the updated assessment template for regulated AI systems — specifically for systems that assist in making compliance determinations.`,
          sub_caption: `This is the fix that matters for every future regulated AI deployment.`,
          decision: {
            prompt: `What does the new template include for regulated compliance systems?`,
            choices: [
              { id: `a`, label: `A regulatory auditability check: verify that the logging specification captures all fields required to evidence a compliance determination to a regulator, including document reference, findings, reasoning, and reviewer identity`, quality: `good`,
                note: `This is the correct addition. The check needs to be specific: not just "does the system log?" but "does the log contain what a regulator would need to evidence a specific determination?" Applied to this deployment, it would have caught the gap before go-live.` },
              { id: `b`, label: `A general data retention adequacy check — verify that logs are retained for the required period`, quality: `partial`,
                note: `Retention period is one component, but it doesn't address the content of the log. Logs retained for seven years that contain only a timestamp and a determination code still cannot evidence the basis for the determination.` },
            ],
          },
          branches: { a: `n3_retroactive`, b: `outcome_good` },
        },

        n2_scope_dispute: {
          scene:       `office-meeting-hearing`,
          caption:     `The review examines whether logging specification review is within the technology risk scope. The firm's risk assessment policy is reviewed. It includes a requirement to assess "regulatory compliance capability" of assessed systems.`,
          sub_caption: `The scope dispute was lost. The template gap is confirmed as being within your responsibility.`,
          decision: {
            prompt: `How do you respond to the review finding?`,
            choices: [
              { id: `a`, label: `Accept the finding, update the template to include the regulatory auditability check, and apply it retrospectively to other regulated AI deployments`, quality: `good`,
                note: `Correct recovery. Accept the finding, produce the fix, extend it to other deployed systems. This is the complete response.` },
              { id: `b`, label: `Accept the finding but note that the policy language was ambiguous and request a policy clarification`, quality: `partial`,
                note: `Policy clarification may be useful for future cases, but it doesn't change the current finding. The template needs to be updated regardless of whether the policy was clear.` },
            ],
          },
          branches: { a: `n3_retroactive`, b: `outcome_warn` },
        },

        n2_partial: {
          scene:       `office-meeting`,
          caption:     `The review examines the compliance team's involvement in the logging specification. They confirm they provided a compliance requirements document — but it didn't specifically address AI audit trail requirements.`,
          sub_caption: `The requirements document existed but didn't include the right requirement. The technology risk assessment should have flagged the gap.`,
          decision: {
            prompt: `Given this context, what is your response to the review?`,
            choices: [
              { id: `a`, label: `The compliance requirements document should have triggered the auditability check — its absence of AI-specific audit trail requirements should have been flagged as a gap in my assessment`, quality: `good`,
                note: `Correct self-assessment. The requirements document was the reference point for the assessment. Its absence of AI audit trail requirements was a gap that the technology risk assessment should have identified and escalated, not accepted.` },
              { id: `b`, label: `The requirements document was the basis for the assessment — if it was incomplete, the compliance team owns that gap`, quality: `poor`,
                note: `The technology risk assessment is not a mechanical check against a requirements document. It requires professional judgment to identify gaps in the requirements that could create risk. "The document didn't say to include it" is not an adequate defence.` },
            ],
          },
          branches: { a: `n3_retroactive`, b: `outcome_bad` },
        },

        n3_retroactive: {
          scene:       `analyst-desk-privacy`,
          caption:     `The template update is agreed. The review asks whether the updated check should be applied retrospectively to other regulated AI systems currently deployed.`,
          sub_caption: `Three other regulated AI systems are in production.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: `a`, label: `Apply the updated check to all three systems immediately — identify any logging gaps before the next regulatory examination, not during it`, quality: `good`,
                note: `Correct. Waiting for the next examination to discover logging gaps in other regulated systems is not an acceptable risk. Proactive retrospective application of the updated check is the only responsible approach given what the examination just found.` },
              { id: `b`, label: `Apply the check to the highest-risk system first and sequence the others over the next two assessment cycles`, quality: `partial`,
                note: `Prioritisation by risk is reasonable, but all three systems should be assessed before the next examination cycle — not spread across multiple cycles. The examination finding makes urgency clear.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Template updated, retroactive review complete`,
          tone:     `good`,
          score:    82,
          result:   `The updated template is applied to all three other regulated AI systems. One has a partial logging gap — it captures document identifiers but not reasoning summaries. The gap is remediated before the next examination cycle. The post-incident review finds the analyst's response constructive and the template update comprehensive. Future regulated AI deployments will include the regulatory auditability check as a standard assessment step.`,
          learning: `The gap wasn't in your execution of the assessment — it was in what the assessment template required you to check. Once the gap is visible, the fix is to update the template and apply it everywhere the old template was used. That's the difference between a single incident response and a systemic improvement.`,
        },
        outcome_good: {
          heading:  `Template updated, retroactive review prioritised`,
          tone:     `good`,
          score:    66,
          result:   `The highest-risk system is assessed and found compliant. The other two are queued for the next cycle. The examiner notes that the retroactive review was sequenced but not completed before the next engagement. A minor finding is recorded for the two unassessed systems.`,
          learning: `Given an active regulatory examination finding, "next assessment cycle" is too slow for a retroactive review of the same gap in other systems. The examination has already signalled the regulator's interest in this specific issue.`,
        },
        outcome_warn: {
          heading:  `Finding accepted — policy clarification sought`,
          tone:     `warn`,
          score:    46,
          result:   `The finding is accepted and the template is updated. The policy clarification request extended the post-incident review timeline by two weeks. The retroactive assessment of other systems is delayed as a result. One system's logging gap is still open at the next examination.`,
          learning: `Policy clarification is a legitimate need, but it shouldn't delay remediation. The template update and the retroactive assessment should proceed in parallel with any policy clarification process.`,
        },
        outcome_bad: {
          heading:  `Responsibility deflected — professional conduct note`,
          tone:     `bad`,
          score:    20,
          result:   `The attempt to attribute the requirements gap to the compliance team was not accepted by the review. A professional conduct note is added to the record: the technology risk assessment should exercise independent judgment, not mechanical checklist compliance. The template is updated under direction. The retroactive assessment is conducted by a different analyst.`,
          learning: `Technology risk assessment requires professional judgment about what risks could materialise, not just compliance with what a requirements document specifies. "The document didn't include it" is not an adequate defence when the risk was foreseeable and within the assessment scope.`,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Structured agentic action logging`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The logging specification captured timestamp, action type, and outcome — but not the document processed, issues found, or reasoning applied. For a compliance system, this is the equivalent of keeping a record that a decision was made but not what it was based on. The fix is specific: every agent action log must include document identifier, findings, reasoning summary, determination, and reviewer identity.`,
    },
    {
      id:      `c2`,
      label:   `Regulatory auditability check in AI risk assessments`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `The technology risk assessment didn't ask: "can a regulator evidence a specific determination from these logs in three years?" Adding this question to the assessment template for regulated AI systems catches logging gaps before deployment, not during an examination.`,
    },
    {
      id:      `c3`,
      label:   `Immutable log retention aligned to regulatory hold periods`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The original document was deleted per the 90-day retention cycle. But compliance determination logs need to be retained for the duration of regulatory exposure — typically three to seven years depending on jurisdiction. Log retention must be set independently of document retention and written immutably to prevent post-hoc modification.`,
    },
    {
      id:      `c4`,
      label:   `AI Register — audit trail completeness requirement`,
      effort:  `Low`,
      owner:   `Governance`,
      go_live: true,
      context: `The AI Register entry for this system should have specified what the audit trail must contain and confirmed it was implemented. Adding an "audit trail specification" field to the AI Register — capturing what each system logs and confirming it meets regulatory requirements — creates an ongoing governance check, not just a deployment-time one.`,
    },
  ],
};
