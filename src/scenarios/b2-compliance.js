// B2 — Regulatory Non-Compliance
// "The Deadline Creep"
// An AI hiring tool deployed without compliance sign-off is flagged
// by an external auditor six months later. Each persona navigates
// the compliance failure from their vantage point.
//
// Depth expansion April 2026 — all four personas expanded from 2 to 4
// decisions each. New beats: complication (something pushes back after
// the initial response) and closing synthesis (30 days later, does
// the fix hold?). Converted to template literals throughout.

export const scenario = {
  id:                `b2-compliance`,
  risk_ref:          `B2`,
  title:             `The Deadline Creep`,
  subtitle:          `AI Regulatory Non-Compliance`,
  domain:            `B — Governance`,
  difficulty:        `Foundational`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b2-regulatory-compliance`,
  estimated_minutes: 16,
  has_business_user: true,

  learning_objectives: [
    `Recognise that a vendor compliance statement is not the same as your organisation's own pre-deployment sign-off.`,
    `Understand what honest engagement in a regulatory audit looks like at every level of the organisation.`,
    `Know the difference between a process improvement that addresses form and one that addresses substance.`,
  ],
  pass_score: 70,
  regulatory_tags: [`eu-ai-act-article-26`, `eu-ai-act-annex-iii`, `nist-ai-rmf-govern-2`, `jurisdiction-eu`, `jurisdiction-au`],

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `HR Coordinator`,
      character: `Priya`,
      icon:      `◇`,
      framing:   `You use the hiring tool every day. You noticed something odd in the shortlists weeks ago — and you said so.`,
      premise:   `You are Priya, an HR Coordinator at a financial services firm. Six months ago, the business rolled out an AI-powered candidate screening tool to help manage the volume of applications. You use it daily. But lately the shortlists have looked narrow — the same profile, over and over. You mentioned it to a colleague a month ago. Then an external auditor arrived asking questions about the tool's compliance documentation.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief People Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The auditor is asking for compliance sign-off documentation. It does not exist. You are about to find out why.`,
      premise:   `You are Morgan, Chief People Officer. The AI hiring screening tool went live six months ago on your watch — positioned as a standard software deployment, it sailed through IT change management. No one flagged it for legal review. Today an external auditor is in the building asking for the pre-deployment compliance sign-off. You are about to learn it was never done.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `HR Systems Lead`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You managed the deployment. The compliance gate was in your checklist — marked complete without evidence.`,
      premise:   `You are Sam, HR Systems Lead. You managed the rollout of the AI hiring tool six months ago. There was a line for compliance sign-off in your go-live checklist. You marked it complete after a brief conversation with a vendor sales rep who said the tool was "compliant by design." No written sign-off from Legal was ever obtained. The auditor wants to see that document.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `HR Data Analyst`,
      character: `Alex`,
      icon:      `◉`,
      framing:   `The shortlist data tells a story. The auditor has asked you to run the disaggregated analysis. What you find is going to require a difficult conversation.`,
      premise:   `You are Alex, HR Data Analyst. The external auditor has asked your team to pull six months of shortlisting data from the AI hiring tool — candidate profiles in, shortlist decisions out. You have the data. You are about to run the disaggregated analysis the tool's vendor never did. The finding will require careful handling.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       `analyst-desk-privacy`,
          caption:     `The shortlists have looked the same for weeks. The auditor is asking questions you cannot answer.`,
          sub_caption: `You flagged this a month ago. Nothing happened.`,
          decision: {
            prompt: `The auditor asks if you noticed anything unusual about the tool's outputs. What do you say?`,
            choices: [
              { id: 'a', label: `Yes — I raised a concern about the shortlist patterns a month ago.`, quality: 'good',
                note: `Honest and timely. Your prior concern is now on the record, which helps the investigation and demonstrates good faith.` },
              { id: 'b', label: `I'm not sure — the outputs seemed fine to me most of the time.`, quality: 'partial',
                note: `Understandable if genuinely uncertain, but you did notice something. Vague answers under audit questioning can look like concealment later.` },
              { id: 'c', label: `No, nothing unusual — the tool has been working well.`, quality: 'poor',
                note: `This contradicts what you told your colleague. If that conversation surfaces, your credibility is damaged.` },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_vague', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       `desk-colleague`,
          caption:     `The auditor thanks you and makes a note. Your manager is called in.`,
          sub_caption: `Your prior concern is now part of the audit record.`,
          decision: {
            prompt: `Your manager asks you privately to "keep things simple" when talking to the auditor. What do you do?`,
            choices: [
              { id: 'a', label: `Tell your manager you have already been honest and plan to stay that way.`, quality: 'good',
                note: `Correct. Auditor interviews are formal processes. Attempting to shape witness accounts creates legal risk for you and your manager.` },
              { id: 'b', label: `Agree to keep it simple but do not actively change what you have already said.`, quality: 'partial',
                note: `Agreeing to the framing — even without acting on it — puts you in a difficult position if it later becomes clear your manager was coaching you.` },
              { id: 'c', label: `Agree to soften your account — your manager knows what is at stake and you trust her judgment.`, quality: 'poor',
                note: `Changing an honest account under managerial pressure in a formal audit creates liability for you, not protection. The auditor has your initial statement on record.` },
            ],
          },
          branches: { a: 'n3_manager_escalation', b: 'n3_manager_escalation', c: 'outcome_bad' },
        },

        n2_vague: {
          scene:       `desk-focused`,
          caption:     `The auditor moves on. Later, your colleague confirms she remembers your concern from a month ago.`,
          sub_caption: `Your vague answer is now inconsistent with what your colleague said.`,
          decision: {
            prompt: `The auditor comes back to you. "Your colleague mentioned you raised a concern about the shortlists. Can you tell me more?" What do you say?`,
            choices: [
              { id: 'a', label: `Correct the earlier answer: yes, you did notice the patterns and you flagged it to a colleague about a month ago.`, quality: 'good',
                note: `Correcting a vague answer when given the chance is the right move. The inconsistency is noted but recoverable — it is not the same as sustained concealment.` },
              { id: 'b', label: `Stick with the vague answer — you were not sure at the time and you are still not sure.`, quality: 'partial',
                note: `The inconsistency is now on the record and unexplained. Two accounts that do not match each other will appear in the audit report.` },
            ],
          },
          branches: { a: 'n3_manager_escalation', b: 'outcome_warn' },
        },

        n3_manager_escalation: {
          scene:       `desk-colleague`,
          caption:     `Three days after the audit session. Your manager's request that you "keep things simple" has been raised with HR Legal.`,
          sub_caption: `HR Legal wants to understand what was said. You are asked to provide a written account of that conversation.`,
          decision: {
            prompt: `What do you include in your written account?`,
            choices: [
              { id: 'a', label: `An accurate account of the conversation — including the "keep things simple" request — with the date and context.`, quality: 'good',
                note: `HR Legal needs to understand what happened to assess the exposure. An accurate contemporaneous account is your best protection and the organisation's best evidence.` },
              { id: 'b', label: `A brief note that your manager asked you to be straightforward with the auditor. Leave out the "keep it simple" framing.`, quality: 'partial',
                note: `A softened account helps nobody — if the original request is characterised differently by your manager, the versions will conflict.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days after the audit. The tool has been suspended. A new acceptable-use policy for AI hiring tools is in draft.`,
          sub_caption: `HR is asking for input from coordinators who use the tools daily before the policy is finalised.`,
          decision: {
            prompt: `The draft policy says AI shortlists should be "reviewed before use." In practice, you know that under volume pressure most coordinators accept the shortlist as-is. What do you contribute?`,
            choices: [
              { id: 'a', label: `Raise it directly in the consultation: "reviewed before use" is not a workable standard at current application volumes. Ask what a realistic review process would look like with the actual team size.`, quality: 'good',
                note: `A policy that cannot be followed under real conditions is not a control — it is a paper artefact. Naming the friction in the consultation is what makes the policy functional.` },
              { id: 'b', label: `Submit a brief note saying the policy looks reasonable and leave it to others to raise implementation concerns.`, quality: 'partial',
                note: `You are the person with direct knowledge of the volume pressure. The consultation is specifically asking for that input. Leaving it to others risks the policy finalising with the same gap.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Honest account. Policy made workable.`,
          tone:     'good',
          result:   `Your honest account — through the audit, through the manager coaching attempt, and through the policy consultation — adds genuine value at each stage. Your audit evidence contributes to the timeline. Your account of the coaching conversation helps HR Legal assess the exposure. Your input on realistic review volumes shapes a policy that operations can actually follow. APRA's follow-up review notes that staff-level feedback strengthened the remediation.`,
          learning: `An HR coordinator's operational insight — how the tool is used under real volume pressure — is exactly what governance processes need to produce controls that hold. Honest accounts at every stage, including the uncomfortable ones, are what make a compliance response genuine rather than performative.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Inconsistency noted. Policy unchanged.`,
          tone:     'warn',
          result:   `Your vague or softened account leaves an inconsistency in the audit record that needs explaining. The policy finalises with a review standard that the operations team cannot sustain under current volumes. Six months later, coordinators are accepting shortlists without meaningful review and the audit finding has effectively been papered over.`,
          learning: `Audit processes surface contradictions between accounts. Policies that do not match operational reality are worse than no policy — they create the appearance of a control while leaving the underlying gap open.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `Contradiction on the record.`,
          tone:     'bad',
          result:   `You said nothing was unusual. Your colleague told the auditor about the conversation where you flagged your concern. The contradiction is in the audit report. What was a straightforward witness account is now a credibility issue. You later change your account under managerial pressure, which the auditor notes as a second concern. Two compounding problems from one avoidable decision.`,
          learning: `Audit processes surface information from multiple sources simultaneously. A contradicted account is more damaging than an uncomfortable truth, and changing an account under pressure after the fact compounds it. The initial honest answer is always the lowest-risk path.`,
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `The auditor is in the building. The compliance sign-off for the AI hiring tool does not exist.`,
          sub_caption: `Six months of shortlisting decisions were made without it.`,
          decision: {
            prompt: `Before the auditor reaches you, what do you do?`,
            choices: [
              { id: 'a', label: `Brief Legal immediately and prepare a factual account of the deployment process.`, quality: 'good',
                note: `Right move. Legal needs to know before the auditor does. A factual account — including the gap — is far better than a reconstructed one.` },
              { id: 'b', label: `Ask the vendor if they can provide any compliance documentation from their side.`, quality: 'partial',
                note: `Useful for understanding what exists, but vendor documentation does not substitute for your organisation's own pre-deployment sign-off. Do not lead with this.` },
              { id: 'c', label: `Ask IT to check whether a sign-off was filed somewhere that was not found yet.`, quality: 'poor',
                note: `If the goal is to find genuine documentation, this is reasonable. If the goal is to create cover, this is the wrong path — and auditors recognise it.` },
            ],
          },
          branches: { a: 'n2_legal', b: 'n2_vendor', c: 'outcome_bad' },
        },

        n2_legal: {
          scene:       `boardroom`,
          caption:     `Legal confirms: no sign-off exists. They advise full disclosure to the auditor.`,
          sub_caption: `The question is now how you remediate, not whether the gap exists.`,
          decision: {
            prompt: `The auditor asks what remediation steps you are prepared to commit to. What do you offer?`,
            choices: [
              { id: 'a', label: `Suspend the tool pending a full compliance assessment. Commit to a 30-day remediation plan.`, quality: 'good',
                note: `Suspension demonstrates you are taking the risk seriously. A time-bound remediation plan shows control. Regulators respond well to proactive action.` },
              { id: 'b', label: `Commit to a compliance assessment but keep the tool running under enhanced monitoring.`, quality: 'partial',
                note: `If the tool is producing discriminatory outputs, continuing to use it during assessment continues the harm. Enhanced monitoring does not change the compliance status.` },
            ],
          },
          branches: { a: 'n3_board_scrutiny', b: 'n3_board_scrutiny' },
        },

        n2_vendor: {
          scene:       `desk-review`,
          caption:     `The vendor provides a generic compliance statement. The auditor confirms it does not constitute a sign-off.`,
          sub_caption: `You are now in the same position, but having spent an hour on a dead end.`,
          decision: {
            prompt: `The auditor asks directly: why was the compliance sign-off not obtained before go-live? What do you tell her?`,
            choices: [
              { id: 'a', label: `The deployment was treated as a standard software change. The AI-specific compliance obligation was not identified at the time. That is a process gap I own.`, quality: 'good',
                note: `Accurate and takes ownership. The auditor has seen this gap pattern before — a candid account of how it happened is more credible than a hedged one.` },
              { id: 'b', label: `The vendor indicated the tool was compliant. We relied on their representation.`, quality: 'partial',
                note: `Vendor representation does not substitute for your own sign-off. The auditor will note this as a misunderstanding of where compliance responsibility sits.` },
            ],
          },
          branches: { a: 'n3_board_scrutiny', b: 'n3_board_scrutiny' },
        },

        n3_board_scrutiny: {
          scene:       `boardroom-crisis`,
          caption:     `Board meeting. The Chair has read the audit summary.`,
          sub_caption: `She asks privately: "Morgan — did you know an employment AI system would be classified high-risk under the EU AI Act before this went live?"`,
          decision: {
            prompt: `How do you answer?`,
            choices: [
              { id: 'a', label: `No — and that is part of the gap. Employment screening AI is explicitly listed in EU AI Act Annex III. That classification should have triggered our compliance process. It did not, because we did not have one.`, quality: 'good',
                note: `The Chair is asking whether you understand the regulatory context, not just the immediate incident. Naming the Annex III classification and the absence of a process shows you have learned the right lesson.` },
              { id: 'b', label: `I was aware AI tools were subject to emerging regulation. I relied on the vendor's compliance representations.`, quality: 'partial',
                note: `The Chair is likely to follow up: what does that mean in practice? "Emerging regulation" undersells how concrete the EU AI Act employment provisions are. The vendor framing repeats the same deflection the auditor noted.` },
              { id: 'c', label: `The compliance function should have flagged this. I am looking into why they did not.`, quality: 'poor',
                note: `Redirecting to Compliance in a board conversation about your deployment decision is the wrong move. The Chair is asking about your knowledge and judgment. Deflecting creates a second concern alongside the first.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days on. The tool is suspended, the compliance assessment is underway, and a new AI procurement gate has been drafted.`,
          sub_caption: `The gate requires Compliance sign-off before any AI system goes live. The Operations team is pushing back: "This will delay every deployment by four weeks."`,
          decision: {
            prompt: `How do you respond to the Operations concern?`,
            choices: [
              { id: 'a', label: `The four-week estimate is the benchmark we need to improve, not a reason to remove the gate. Work with Compliance to build a fast-track path for lower-risk tools that can complete in five days. High-risk AI — employment, credit, insurance — stays at four weeks minimum.`, quality: 'good',
                note: `Correct frame: the gate is not negotiable but its speed can be improved for genuinely lower-risk tools. Distinguishing high-risk AI by Annex III classification applies the right friction in the right places.` },
              { id: 'b', label: `Agree to a 30-day pilot where the gate is advisory rather than blocking. If no issues arise, make it mandatory.`, quality: 'partial',
                note: `An advisory gate for employment AI while the tool that caused the original incident is still under assessment is the wrong timing. "Advisory" creates the impression that the lesson has not landed.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Disclosure, suspension, and a gate with teeth.`,
          tone:     'good',
          result:   `Full disclosure to the auditor, tool suspended, 30-day remediation plan committed. Board briefed with a clear account of the Annex III classification and what the process gap meant. The new AI procurement gate is implemented with a risk-tiered fast-track for lower-risk tools and a firm four-week minimum for employment, credit, and insurance AI. The audit report notes the executive response as decisive and well-framed.`,
          learning: `When a compliance gap is discovered, the response is as important as the gap itself. A CPO who can name the regulatory classification, own the process failure, and design a gate that applies the right friction in the right places demonstrates governance competence — not just compliance.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Gap acknowledged. Gate incomplete.`,
          tone:     'warn',
          result:   `The immediate response is adequate. But the gate has either been advisory during a pilot or undifferentiated across all AI tools. Six months later, a lower-risk AI tool deploys in five days through the advisory gate. A high-risk credit tool follows the same path because the Annex III distinction was never built in. The audit finding is closed; the underlying classification gap is still open.`,
          learning: `An AI procurement gate that does not distinguish between general tools and high-risk AI systems applies the same friction everywhere and becomes a target for workarounds. Regulatory classification should drive the gate design — not volume pressure.`,
          score:    45,
        },
        outcome_bad: {
          heading:  `Documentation search backfires.`,
          tone:     'bad',
          result:   `IT confirms no sign-off exists. The auditor has observed the search activity and notes it in the report. What was a compliance gap is now a compliance gap with a documented attempt to locate or create supporting documentation under audit pressure. Legal exposure has increased and the board is asking questions the CPO cannot answer about EU AI Act Annex III.`,
          learning: `When documentation does not exist, searching for it under audit pressure creates its own risk. The correct path is immediate Legal briefing and disclosure — not a documentation search that can be characterised as something else.`,
          score:    0,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The auditor wants to see the go-live checklist. The compliance sign-off line is marked complete.`,
          sub_caption: `There is no document behind that checkmark.`,
          decision: {
            prompt: `What do you tell the auditor when they ask to see the compliance sign-off?`,
            choices: [
              { id: 'a', label: `Explain that the sign-off was not obtained in writing — a verbal conversation with the vendor was treated as sufficient.`, quality: 'good',
                note: `Accurate and honest. Explaining how it happened — a miscalibrated checklist item — helps the investigation understand the systemic failure, not just the outcome.` },
              { id: 'b', label: `Say the documentation may have been filed elsewhere and offer to search for it.`, quality: 'partial',
                note: `If you genuinely do not know whether a document exists, this is reasonable. If you know it does not exist, this delays an inevitable disclosure and wastes audit time.` },
              { id: 'c', label: `Produce the vendor's compliance statement and present it as the sign-off.`, quality: 'poor',
                note: `A vendor compliance statement is not a pre-deployment sign-off from your organisation's Legal function. Presenting it as one is misleading. Auditors will identify the difference.` },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_search', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       `office-bright`,
          caption:     `The auditor notes the checklist failure as a systemic gap, not just an individual error.`,
          sub_caption: `The finding drives a checklist redesign — not just for AI tools.`,
          decision: {
            prompt: `You are asked to lead the remediation of the go-live checklist. What is your first action?`,
            choices: [
              { id: 'a', label: `Work with Legal and Compliance to define what "compliance sign-off" actually requires — then hardwire it into the checklist as a blocking step with an evidence upload requirement.`, quality: 'good',
                note: `Correct scope. The problem was that "compliance sign-off" was a checkbox without a defined standard. Fixing the standard — not just the checkbox — prevents recurrence.` },
              { id: 'b', label: `Add a mandatory document upload to the checklist so sign-offs must be filed before go-live is permitted.`, quality: 'partial',
                note: `Good process improvement. But without defining what the document must contain, a blank page uploaded as a PDF would technically satisfy it.` },
            ],
          },
          branches: { a: 'n3_cab_pushback', b: 'n3_cab_pushback' },
        },

        n2_search: {
          scene:       `desk-focused`,
          caption:     `An hour later you confirm: no sign-off document exists anywhere.`,
          sub_caption: `The auditor has been waiting. The delay is noted.`,
          decision: {
            prompt: `You now need to explain to the auditor what happened. What do you say?`,
            choices: [
              { id: 'a', label: `The sign-off was not obtained. I marked it complete after a conversation with the vendor. That was my error — there should have been a written document.`, quality: 'good',
                note: `The hour-long delay is unfortunate but a direct, honest account now recovers the situation better than continued hedging.` },
              { id: 'b', label: `The process did not require a written sign-off at the time. The verbal confirmation was considered sufficient under our standard.`, quality: 'partial',
                note: `If the process genuinely did not require written sign-off, this is accurate. But it does not explain why the checklist marked it complete without any evidence. The auditor will probe the gap between the standard and the practice.` },
            ],
          },
          branches: { a: 'n3_cab_pushback', b: 'n3_cab_pushback' },
        },

        n3_cab_pushback: {
          scene:       `boardroom`,
          caption:     `You present the remediated checklist to the IT Change Advisory Board.`,
          sub_caption: `The CAB chair raises a concern: "This blocks go-live if Legal hasn't signed off. What happens in an emergency deployment?"`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: 'a', label: `Propose an emergency override: available for non-AI systems, requires CRO sign-off for any AI system in an emergency, auto-notifies Compliance, and creates a 5-day window for a full sign-off to follow.`, quality: 'good',
                note: `Addresses the legitimate operational concern without removing the control. An override with attribution and a deadline is better than an exemption without accountability.` },
              { id: 'b', label: `Offer to exempt emergency deployments from the blocking requirement, with a post-deployment review within two weeks.`, quality: 'partial',
                note: `Creates the loophole that caused the original incident. "Emergency" will expand as a category, especially when timelines are tight.` },
              { id: 'c', label: `Hold the line — if Legal hasn't signed off, the deployment does not proceed. The CAB will adapt.`, quality: 'poor',
                note: `Correct in principle but ignores a genuine operational reality. Controls that cannot accommodate any exception get worked around informally — which is worse than a documented override.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'outcome_warn', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days after the change. The blocking checklist is live. Four new AI system deployments have gone through it.`,
          sub_caption: `The CPO asks you to review whether the sign-off standard is actually working — not just whether the box is being ticked.`,
          decision: {
            prompt: `What does "actually working" mean to you in this context?`,
            choices: [
              { id: 'a', label: `Whether Legal's sign-off reviews are substantive — do they include bias testing results, an Annex III classification check, and a named Accountable Person? Pull the last four sign-offs and check.`, quality: 'good',
                note: `The right question. A blocking field is only as strong as what it requires. Four sign-offs is enough to test whether the standard is being applied consistently or just satisfied formally.` },
              { id: 'b', label: `Whether all four deployments have a sign-off on file. If yes, the control is working.`, quality: 'partial',
                note: `Necessary but not sufficient. A sign-off on file tells you the box was ticked — not whether the substantive review happened. That is the same gap the original incident exposed.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Honest account. Systemic fix with substance checks.`,
          tone:     'good',
          result:   `Your honest account of the checklist failure leads directly to a systemic fix. Legal and Compliance co-design a sign-off standard with defined content requirements — bias testing results, Annex III classification, named Accountable Person. The CAB override is principled and bounded. And your 30-day review checks whether sign-offs are substantive, not just present. When you review the four deployed systems, you find one sign-off that ticked the box without the bias testing results — and send it back. The control is working.`,
          learning: `A checklist item without a defined standard is not a control. The fix for a process failure is not a stricter checkbox — it is a defined standard with evidence requirements, a principled exception mechanism, and someone checking whether the standard is being met rather than just satisfied.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Process improved. Standard still soft.`,
          tone:     'warn',
          result:   `The blocking field is implemented or the exemption carve-out is in place. Either way, a gap remains: the sign-off requirement lacks defined content, or an emergency category grows quietly, or the 30-day review counts files rather than checking them. Within a year, a new AI tool deploys with a sign-off on file that does not include bias testing results. The original gap recurs in a different shape.`,
          learning: `Process improvements that address form without addressing substance — or that create exceptions without accountability — reproduce the original failure mode. The standard matters as much as the requirement to meet it.`,
          score:    45,
        },
        outcome_bad: {
          heading:  `Misleading documentation presented.`,
          tone:     'bad',
          result:   `The auditor identifies that the vendor compliance statement is not a pre-deployment sign-off from your organisation's Legal function. The audit report notes that documentation was presented that misrepresented the compliance process. This escalates the finding from a process gap to a conduct concern. The CPO is now dealing with two questions: the original compliance failure and why her HR Systems Lead presented misleading documentation.`,
          learning: `Presenting documentation as something it is not — even under pressure — escalates a compliance gap into a conduct issue. Auditors are experienced at identifying misrepresentation, and the cost of that escalation is always higher than the cost of the original honest disclosure.`,
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk-privacy`,
          caption:     `Six months of shortlisting data. The auditor wants a disaggregated analysis by demographic group.`,
          sub_caption: `You have never been asked to run this analysis before.`,
          decision: {
            prompt: `You run the numbers. The disparity is statistically significant. What do you do first?`,
            choices: [
              { id: 'a', label: `Document the methodology and findings clearly, then escalate to your manager before doing anything else.`, quality: 'good',
                note: `Right sequence. The finding needs to be in the right hands before any action is taken. Document first, escalate second — do not brief informally before the written record exists.` },
              { id: 'b', label: `Run the analysis a second time to make sure before escalating.`, quality: 'partial',
                note: `Double-checking methodology is good practice. But if the finding holds, a second run adds time without changing your obligation to escalate. Do not let verification become delay.` },
              { id: 'c', label: `Send the raw results directly to the auditor — they asked for the analysis.`, quality: 'poor',
                note: `The auditor asked for the analysis, but raw results without methodology documentation and internal review create confusion. Your manager and Legal need to see this before the auditor does.` },
            ],
          },
          branches: { a: 'n2_escalate', b: 'n2_recheck', c: 'outcome_warn' },
        },

        n2_escalate: {
          scene:       `office-meeting`,
          caption:     `Your manager reads the report. The room goes quiet.`,
          sub_caption: `Legal is called in within the hour.`,
          decision: {
            prompt: `Legal asks you to prepare a summary for the auditor. They ask you to "present the findings carefully." What does that mean to you?`,
            choices: [
              { id: 'a', label: `Present the findings accurately with full methodology — "carefully" means precisely, not selectively.`, quality: 'good',
                note: `Correct interpretation. Careful presentation means rigorous methodology documentation, not selective reporting. The auditor will see the underlying data anyway.` },
              { id: 'b', label: `Ask Legal to clarify what "carefully" means before preparing the summary.`, quality: 'partial',
                note: `Reasonable to seek clarity. But if the answer involves omitting findings, that is a different problem. Clarifying intent is good — complying with selective reporting is not.` },
            ],
          },
          branches: { a: 'n3_scope_question', b: 'n3_scope_question' },
        },

        n2_recheck: {
          scene:       `desk-working`,
          caption:     `The second run confirms the finding. Forty minutes have passed.`,
          sub_caption: `Your manager asks why you took so long to escalate.`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `You wanted to confirm the methodology before putting a finding like this in front of management. You have it now — here is the full analysis.`, quality: 'good',
                note: `Honest and recoverable. Forty minutes for a double-check on a significant demographic finding is defensible — but state the reason plainly.` },
              { id: 'b', label: `You were not sure it was your call to escalate something this significant without being certain.`, quality: 'partial',
                note: `Understandable instinct but misapplied here. The obligation to escalate a significant finding does not depend on certainty — it depends on the finding being significant enough to warrant management attention.` },
            ],
          },
          branches: { a: 'n3_scope_question', b: 'n3_scope_question' },
        },

        n3_scope_question: {
          scene:       `desk-focused`,
          caption:     `The auditor has received your analysis. She now asks a follow-up question you were not expecting.`,
          sub_caption: `"In your view, does the six-month sample reflect a systemic pattern or could it be a data artefact of the deployment period?"`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `Give a calibrated analytical answer: the disparity is consistent across the full six months and across multiple demographic dimensions — that pattern is not typical of a deployment artefact. Caveat that external validation would strengthen the conclusion.`, quality: 'good',
                note: `This is what analytical credibility looks like. You have the data to support a substantive answer, and caveating the limitation is more credible than false certainty.` },
              { id: 'b', label: `Decline to speculate beyond the data — your role was to run the analysis, not interpret causation.`, quality: 'partial',
                note: `Technically defensible but undersells your analytical value. The auditor is asking for your judgment on a question you are actually positioned to answer.` },
              { id: 'c', label: `Agree it could be a deployment artefact — more data would be needed to be certain.`, quality: 'poor',
                note: `This answer is inconsistent with what the six-month data shows. Offering a more benign interpretation than the data supports under auditor questioning is a credibility problem.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-thirty-days`,
          caption:     `Thirty days on. The tool is suspended. A new bias testing requirement is being drafted for all AI hiring tools.`,
          sub_caption: `The draft requires "statistical testing for demographic disparities prior to deployment." Your manager asks you to review it.`,
          decision: {
            prompt: `The draft testing requirement does not specify which demographic dimensions to test or what disparity threshold would block deployment. What do you recommend?`,
            choices: [
              { id: 'a', label: `Name the specific dimensions — at minimum gender, age, and ethnicity — and propose an 80% rule threshold consistent with EEOC guidance as the blocking standard, with a mandatory legal review if the threshold is approached but not breached.`, quality: 'good',
                note: `A testing requirement without defined dimensions and a threshold is advisory, not a control. The 80% rule is the established standard in employment discrimination law — it is not a novel threshold to invent.` },
              { id: 'b', label: `Recommend a qualified statistician review any AI hiring tool output for disparities before deployment, without defining the dimensions or threshold yourself.`, quality: 'partial',
                note: `Delegating the standard-setting to a future reviewer defers the decision without resolving it. The draft will be implemented without the specificity it needs.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Finding documented. Standard made specific.`,
          tone:     'good',
          result:   `Your analysis is documented, escalated, and presented to the auditor with full methodology and a calibrated interpretation. When the auditor asks the scope question, your substantive answer strengthens the investigation's conclusions. And when the bias testing requirement is drafted without a defined standard, you name the 80% rule threshold and the specific demographic dimensions — turning a vague requirement into a control that will actually block a biased tool. The audit report cites the analyst function as technically strong.`,
          learning: `Analytical credibility in a regulatory context means giving substantive answers where the data supports them and naming standards with specificity when they matter. A bias testing requirement without defined dimensions and a threshold is not a control — the analyst who ran the original analysis is the right person to say so.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Finding reported. Analysis hedged.`,
          tone:     'warn',
          result:   `The findings reach the auditor. But either the scope question was deflected or the bias testing standard was left vague. The auditor notes that the analytical function could have added more value to the investigation. The testing requirement finalises without a defined threshold. Eighteen months later, a new AI hiring tool is reviewed by a statistician who applies their own judgment — more lenient than the 80% rule — and the tool deploys. A second audit finds the same disparity pattern.`,
          learning: `Analytical hedging in a regulatory context — declining to interpret data you are positioned to interpret — does not protect you. It leaves the standard undefined and the gap open. The follow-on audit closes what the first one should have.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `Raw data without context.`,
          tone:     'bad',
          result:   `The auditor receives raw results without methodology documentation or internal review. Questions about data quality and analytical assumptions cannot be answered on the spot. The finding is real but harder to act on. Legal is unhappy that the results went directly to the auditor before internal review. The auditor asks whether your organisation understands how to handle sensitive analytical findings in a regulatory context.`,
          learning: `Analytical findings in a regulatory context need methodology documentation and internal review before they are shared externally — not because the findings should be changed, but because they need to be defensible and because your organisation has a right to see them first.`,
          score:    20,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: `AI regulatory risk classification`,
      effort: 'High', owner: `Compliance`, go_live: true,
      context: `The hiring tool was deployed without anyone mapping it to anti-discrimination law or EU AI Act Annex III. Employment screening AI is explicitly listed as high-risk. Classification before deployment defines which obligations apply — conformity assessment, human oversight, bias testing. Without it, the compliance gate does not know what to require.`,
    },
    {
      id: 'c2', label: `Pre-deployment compliance sign-off`,
      effort: 'Low', owner: `Legal`, go_live: true,
      context: `The specific control that was missing. A mandatory written sign-off from Legal — as a blocking step, not a checkbox — with defined content requirements (bias testing results, Annex III classification check, named Accountable Person) would have stopped the tool going live without assessment.`,
    },
    {
      id: 'c3', label: `Bias testing standard`,
      effort: 'Medium', owner: `HR / Compliance`, go_live: true,
      context: `The vendor never ran disaggregated analysis. A pre-deployment bias testing requirement specifying demographic dimensions and a threshold (consistent with EEOC 80% rule guidance) would have surfaced the disparity before the tool went live rather than six months later under external audit pressure.`,
    },
    {
      id: 'c4', label: `Regulatory monitoring assignment`,
      effort: 'Low', owner: `Compliance`, go_live: false,
      context: `Employment AI regulation — EU AI Act Annex III, the Workday lawsuit, EEOC guidance — was public before this tool was deployed. A named regulatory monitor assigned to track employment AI developments would have surfaced the classification obligation before go-live.`,
    },
  ],
};
