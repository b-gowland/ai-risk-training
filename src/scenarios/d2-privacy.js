// D2 — Privacy & Data Protection
// Scenario: Legal team pastes client contracts into a public AI tool.
// Client later sees their confidential language appear elsewhere.
// Personas navigate the privacy breach and response.

export const scenario = {
  id:                'd2-privacy',
  risk_ref:          'D2',
  title:             'The Accidental Disclosure',
  subtitle:          'Privacy & AI Data Exposure',
  domain:            'D — Data',
  difficulty:        'Foundational',
  kb_url:            'https://library.airiskpractice.org/docs/domain-d-data/d2-privacy',
  estimated_minutes: 10,
  has_business_user: true,

  regulatory_tags: [`eu-ai-act-article-10`, `eu-ai-act-article-26`, `jurisdiction-au`, `jurisdiction-eu`],

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Legal Paralegal',
      character: 'Jordan',
      icon:      '◇',
      framing:   'You pasted a client contract into an AI tool to speed up the summary. Now the client is on the phone.',
      premise:   `You are Jordan, a paralegal in a financial services legal team. Last week you were under time pressure and used a public AI tool to help draft a summary of a client's confidential commercial contract — something the team has been doing informally for months. This morning the client called the partner. They believe they have seen their confidential pricing terms reproduced in a document from a competitor. The partner wants to know where the leak came from.`,
    },
    executive: {
      label:     'Executive',
      role:      'General Counsel',
      character: 'Casey',
      icon:      '◈',
      framing:   'A client believes their confidential contract terms appeared in a competitor document. Your team used a public AI tool.',
      premise:   `You are Casey, General Counsel. A client has called with a serious concern — they believe their confidential commercial pricing terms have appeared in a competitor document. Your legal team has been informally using a public AI tool for document drafting assistance. You do not yet know whether the AI tool is the source of the leak, but you know there was no acceptable use policy, no enterprise tier, and no privacy assessment. You are about to have a very difficult client call.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'Legal Operations Manager',
      character: 'Taylor',
      icon:      '◎',
      framing:   'You manage the legal team\'s tools. There was no approved AI tool. There was no policy. You knew the team was using something.',
      premise:   `You are Taylor, Legal Operations Manager. You are responsible for the tools the legal team uses. Six months ago you noticed the team was using a public AI tool for drafting assistance. You meant to look into it — whether it was approved, whether there was an enterprise tier. You didn't. Now a client is alleging their confidential contract data has been exposed. The General Counsel wants to know what tool governance was in place.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Information Security Analyst',
      character: 'Riley',
      icon:      '◉',
      framing:   'Security has logs. You know exactly which endpoints were used and when. Legal is asking you to brief the General Counsel.',
      premise:   `You are Riley, an Information Security Analyst. You have been asked to pull logs of external service connections from the legal team's devices over the last three months. The logs show consistent connections to a consumer-tier AI endpoint from two paralegal devices. The data submitted cannot be recovered from the logs — but the endpoint and timing can be confirmed. You are preparing a briefing for the General Counsel ahead of the client call.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-intranet',
          caption:     'The partner has called you in. She knows the team has been using an AI tool. She asks if you used it with this client\'s contract.',
          sub_caption: 'The client is waiting for a callback.',
          decision: {
            prompt: 'What do you tell the partner?',
            choices: [
              { id: 'a', label: 'Yes — I used a public AI tool to help draft the contract summary last week.', quality: 'good',
                note: 'Honest and immediate. This is the only answer that lets the firm respond correctly. The logs will confirm it anyway.' },
              { id: 'b', label: 'I may have — I\'d need to check my recent work to be sure.', quality: 'partial',
                note: 'Understandable if genuinely uncertain about which tool was used. But if you know, delay does not help the client or the firm.' },
              { id: 'c', label: 'No — I only used the firm\'s approved drafting tools.', quality: 'poor',
                note: 'The security logs will contradict this. A false account under these circumstances creates personal professional risk on top of the underlying data exposure.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_uncertain', c: 'n_unravel' },
        },

        n_unravel: {
          scene:       `desk-focused`,
          caption:     `You told the partner you only used approved tools. An hour later IT mentions the security team is pulling tool-usage logs for the client call. The logs will show the consumer-AI connection from your device, and when.`,
          sub_caption: `The denial is about to meet the log.`,
          decision: {
            prompt: `What do you do before the logs come back?`,
            choices: [
              { id: 'a', label: `Correct the record with the partner now — exactly what you pasted, and when.`, quality: 'good',
                note: `Getting ahead of the log is the only way to stay credible and help contain the exposure.` },
              { id: 'b', label: `Tell only IT and ask them to keep it between you for now.`, quality: 'partial',
                note: `Partial honesty to the wrong audience; the partner still has to face the client without the facts.` },
              { id: 'c', label: `Say nothing and hope the logs are inconclusive.`, quality: 'poor',
                note: `The logs are not inconclusive; silence turns a mistake into a cover-up.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow', c: 'n_dig' },
        },

        n_dig: {
          scene:       `office-meeting`,
          caption:     `The security log is on the table: the consumer-AI endpoint, your device, three sessions. The partner asks you directly whether you used the tool on this contract.`,
          sub_caption: `There is no version of this where the log says otherwise.`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `Admit it fully now — what you submitted and when — and accept it should have been said at the start.`, quality: 'partial',
                note: `A late, complete correction is recoverable; the initial denial is now part of the record.` },
              { id: 'b', label: `Hold the line that you only used approved tools.`, quality: 'poor',
                note: `A denial against your own logged activity converts a data incident into a cover-up the firm cannot defend.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'outcome_bad' },
        },

        n3_follow: {
          scene:       `office-meeting-aftermath`,
          caption:     `The account is given and the client call is scheduled. The partner asks what should change so this can't recur.`,
          sub_caption: `Your answer becomes the team's new rule.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `An approved enterprise tool, plus a hard rule: client-confidential text never goes into consumer AI.`, quality: 'good',
                note: `Names the control and the boundary — actionable and ownable.` },
              { id: 'b', label: `Remind the team to be more careful with AI tools.`, quality: 'partial',
                note: `Awareness without an approved alternative or a hard boundary changes nothing.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_honest: {
          scene:       'office-meeting',
          caption:     'The partner thanks you for being direct. She asks what data you submitted to the tool.',
          sub_caption: 'This conversation will inform the client call and any breach notification decision.',
          decision: {
            prompt: 'You remember pasting the full contract text including pricing schedules. What do you say?',
            choices: [
              { id: 'a', label: 'The full contract text including the pricing schedules — I pasted it to get a complete summary.', quality: 'good',
                note: 'Complete and accurate. The partner needs the full picture to assess the exposure and advise the client correctly.' },
              { id: 'b', label: 'Parts of the contract — I don\'t remember exactly what I included.', quality: 'partial',
                note: 'If genuinely uncertain, say so. But an incomplete account of what was submitted makes the exposure assessment harder and may need to be corrected later.' },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },

        n2_uncertain: {
          scene:       `desk-focused`,
          caption:     `You check your browser history. The AI tool connection is there. You go back to the partner.`,
          sub_caption: `Twenty minutes have passed. The client is still waiting.`,
          decision: {
            prompt: `You've confirmed you used the tool on this contract. What do you tell the partner now?`,
            choices: [
              { id: 'a', label: `The full picture — you used it on this contract and pasted the pricing schedules.`, quality: 'good',
                note: `Confirming the specifics is what lets the firm scope the exposure and respond to the client honestly.` },
              { id: 'b', label: `That you used it, but stay vague on exactly what you submitted.`, quality: 'partial',
                note: `Half an answer leaves the firm guessing about the exposure it has to disclose.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Full account. Firm can respond.',
          tone:     'good',
          result:   'Your honest and complete account — including what data was submitted — gives the partner everything needed to assess the exposure and advise the client. The privacy breach assessment can proceed. Your cooperation is noted. The firm\'s response to the client is informed and credible.',
          learning: 'When a data exposure incident is being investigated, a complete first account — however uncomfortable — is more valuable than a partial one that needs correcting. The firm can only respond as accurately as the information you provide.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Partial account. Gaps remain.',
          tone:     'warn',
          result:   'The partner has a partial picture. The breach assessment proceeds but with uncertainty about the scope of what was submitted. The client call is harder because the firm cannot give a definitive account of the exposure. A follow-up is needed once you reconstruct exactly what was included.',
          learning: 'Partial accounts in incident response create gaps that require follow-up — which extends the client\'s uncertainty and the firm\'s exposure window. A complete first account, even if it takes a moment to reconstruct, is almost always better.',
          score:    55,
        },
        outcome_bad: {
          heading:  'Logs contradict your account.',
          tone:     'bad',
          result:   'The security logs confirm connections to the consumer AI endpoint from your device on the date in question. Your account is contradicted by the evidence. The partner now has two problems: the data exposure, and a credibility issue with a member of the team. Your professional situation has become significantly more difficult.',
          learning: 'Security logs record endpoint connections. A denial that is contradicted by technical evidence creates a conduct issue that compounds the underlying data exposure. Honest disclosure — however difficult — is always the correct path.',
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'The client believes their confidential pricing terms have appeared in a competitor document. Your team used an unapproved AI tool.',
          sub_caption: 'You have thirty minutes before the client call.',
          decision: {
            prompt: 'Before you call the client, what do you establish first?',
            choices: [
              { id: 'a', label: 'What data was submitted to the AI tool, by whom, and what the provider\'s retention terms are.', quality: 'good',
                note: 'Right first step. You cannot advise the client about exposure without knowing what data left the firm and where it may have gone.' },
              { id: 'b', label: 'Whether the competitor document is genuinely from the AI tool or could have another source.', quality: 'partial',
                note: 'Important question for the overall investigation, but you cannot answer it in 30 minutes. You need to be able to tell the client what you know — and what you are doing to find out the rest.' },
              { id: 'c', label: 'Whether the firm has any legal obligation to notify the client or regulators.', quality: 'partial',
                note: 'Critical question, but it depends on the facts you have not yet established. Notification obligations flow from knowing what data was involved.' },
            ],
          },
          branches: { a: 'n2_facts', b: 'n2_competitor', c: 'n2_legal' },
        },

        n3_follow: {
          scene:       `boardroom`,
          caption:     `The client call is done. The board asks what governance change follows.`,
          sub_caption: `The incident becomes the mandate.`,
          decision: {
            prompt: `What do you put in place?`,
            choices: [
              { id: 'a', label: `An approved-AI register with data-classification rules and a blocking procurement gate for AI tools.`, quality: 'good',
                note: `A real control with teeth — it changes what can be deployed, not just what people are told.` },
              { id: 'b', label: `Issue a memo reminding staff to use only approved tools.`, quality: 'partial',
                note: `A memo restates the expectation that was already being ignored; it is not a control.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_facts: {
          scene:       'office-meeting',
          caption:     'Your paralegal confirms full contract text including pricing was submitted to a consumer-tier AI tool. No enterprise DPA exists.',
          sub_caption: 'The data may have entered training pipelines. You cannot confirm or deny.',
          decision: {
            prompt: 'You call the client. What is your opening position?',
            choices: [
              { id: 'a', label: 'Acknowledge what happened, what you know about the exposure, and what you are doing to investigate further.', quality: 'good',
                note: 'Correct. The client needs honesty about what happened, not a managed account. Proactive disclosure — before they find out another way — is far better for the relationship.' },
              { id: 'b', label: 'Acknowledge there may have been a data handling issue and that you are investigating — without confirming the AI tool specifically.', quality: 'partial',
                note: 'Technically defensible but the client will likely discover the specific facts during the investigation anyway. Partial disclosure often damages trust more than full disclosure when the full picture emerges.' },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },

        n2_competitor: {
          scene:       `desk-review`,
          caption:     `You cannot determine in 30 minutes whether the competitor document is AI-related. The client is calling.`,
          sub_caption: `You go into the call without knowing what your team submitted.`,
          decision: {
            prompt: `You can't confirm the AI link before the call. How do you open with the client?`,
            choices: [
              { id: 'a', label: `Be transparent: an unapproved tool was used, you're investigating, and you'll report exactly what you find.`, quality: 'good',
                note: `Transparency you can stand behind beats a confident answer you can't. It buys credibility for the follow-up.` },
              { id: 'b', label: `Acknowledge a possible data-handling issue and promise to follow up.`, quality: 'partial',
                note: `Soft acknowledgement avoids the lie but leaves the client unsure whether you grasp the exposure.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },

        n2_legal: {
          scene:       `desk-focused`,
          caption:     `Legal confirms notification may be required — but that depends on what data was involved, which you have not established.`,
          sub_caption: `You go into the client call without the facts.`,
          decision: {
            prompt: `You don't yet know what was submitted. What do you commit to on the call?`,
            choices: [
              { id: 'a', label: `Commit to establishing exactly what was submitted within 24 hours and to notifying if the threshold is met.`, quality: 'good',
                note: `A concrete, time-bound commitment is the credible move when you can't yet answer the substance.` },
              { id: 'b', label: `Say the matter is under review and you'll be in touch.`, quality: 'partial',
                note: `"Under review" without a timeline reads as managing the client rather than addressing the exposure.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Proactive disclosure. Client trust preserved.',
          tone:     'good',
          result:   'You call the client with a full account of what happened, what you know about the exposure, and a clear commitment to investigate and notify if required. The client is unhappy — reasonably — but respects the directness. A remediation plan follows: enterprise AI procurement, PIA requirement, acceptable use policy, and a privacy audit of the legal team\'s practices.',
          learning: 'In a client data exposure, proactive disclosure — before they find out another way — is almost always better for the long-term relationship. Clients can accept mistakes. What they find harder to accept is feeling managed.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Incomplete disclosure. Follow-up required.',
          tone:     'warn',
          result:   'The client call is difficult. You cannot give them the full picture because you do not have it. They ask direct questions you cannot answer. A follow-up call is needed once the investigation is complete. The client\'s confidence in the firm is shaken — not only by the incident but by the incomplete initial response.',
          learning: 'Going into a client call about a data exposure without establishing the facts first creates a worse client experience than taking an extra thirty minutes to get the facts. Establish what you know, then call.',
          score:    45,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-intranet',
          caption:     'The General Counsel asks: what tool governance was in place for the legal team\'s AI usage?',
          sub_caption: 'You knew the team was using something. You did nothing.',
          decision: {
            prompt: 'What do you tell the General Counsel?',
            choices: [
              { id: 'a', label: 'No formal governance was in place — I was aware the team was using an external tool and did not follow up.',
                quality: 'good',
                note: 'Accurate and takes appropriate responsibility. The General Counsel needs the truth to understand the gap and fix it.' },
              { id: 'b', label: 'We have an IT acceptable use policy that covers this — staff are expected to follow it.',
                quality: 'partial',
                note: 'True but insufficient. A general IT AUP is not specific AI tool governance. The distinction matters and the GC will probe it.' },
              { id: 'c', label: 'The team should have checked with you before using any external tool.',
                quality: 'poor',
                note: 'Deflecting to individual staff when you knew about the practice and did nothing compounds the problem. Governance failures are owned by the person responsible for governance.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_policy', c: 'n_unravel' },
        },

        n_unravel: {
          scene:       `desk-review`,
          caption:     `You told the General Counsel the team should have checked with you. She points out that you manage the legal team's tools, you noticed the AI usage six months ago, and you did nothing. Deflecting to staff doesn't survive that.`,
          sub_caption: `The governance was yours to run.`,
          decision: {
            prompt: `How do you respond now?`,
            choices: [
              { id: 'a', label: `Own it: tool governance was my responsibility, I saw the usage and didn't act, and here's how I'd close it.`, quality: 'good',
                note: `Owning the decision point is what lets you lead the framework rather than be its subject.` },
              { id: 'b', label: `Accept the oversight but note staff also bypassed the spirit of the policy.`, quality: 'partial',
                note: `Half-ownership; spreading the blame to staff dilutes the fix you're meant to lead.` },
              { id: 'c', label: `Maintain that staff should have sought approval before using any tool.`, quality: 'poor',
                note: `Blaming the team you were supposed to govern, against your own six months of inaction, is the worst available account.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow', c: 'n_dig' },
        },

        n_dig: {
          scene:       `desk-focused`,
          caption:     `The General Counsel has the timeline: the usage you spotted, the months that passed, no action logged.`,
          sub_caption: `"Whose job was the tool governance here?"`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `Concede it was mine, stop attributing it to staff, and commit to leading the remediation.`, quality: 'partial',
                note: `A late but clean concession that opens the fix; the deflection is now on the record.` },
              { id: 'b', label: `Repeat that staff bypassed an expectation that was clearly understood.`, quality: 'poor',
                note: `A second deflection against a documented timeline confirms an ownership problem on top of the gap.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'outcome_bad' },
        },

        n3_follow: {
          scene:       `office-meeting`,
          caption:     `The gap is acknowledged. The General Counsel asks you to design the framework that should have existed.`,
          sub_caption: `The incident becomes the brief for the remediation.`,
          decision: {
            prompt: `What are the two controls you implement immediately?`,
            choices: [
              { id: 'a', label: `An approved AI-tools register with data-classification rules, and a mandatory check before any external tool touches client data.`, quality: 'good',
                note: `Two controls that bind the actual failure mode — tool approval and a data-classification gate.` },
              { id: 'b', label: `A staff training programme and an updated acceptable-use policy.`, quality: 'partial',
                note: `Useful, but training and policy without a binding gate leave the same hole open.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_honest: {
          scene:       'office-bright',
          caption:     'The General Counsel asks you to design the governance framework that should have existed.',
          sub_caption: 'The incident becomes the brief for the remediation.',
          decision: {
            prompt: 'What are the two most important controls you recommend implementing immediately?',
            choices: [
              { id: 'a', label: 'An approved AI tools register with data classification rules, and a mandatory enterprise DPA requirement for any tool handling client data.', quality: 'good',
                note: 'Correct priorities. The register addresses what is allowed. The DPA requirement addresses the specific privacy risk that caused the incident — data submitted to a provider without contractual protection.' },
              { id: 'b', label: 'A staff training programme on AI tool risks and an acceptable use policy acknowledgement.',
                quality: 'partial',
                note: 'Both valuable, but training and policy without technical controls and procurement requirements leaves the underlying gap open. Policy needs to be paired with register and DPA controls.' },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },

        n2_policy: {
          scene:       `desk-review`,
          caption:     `The General Counsel asks whether the IT AUP specifically addresses AI tools and data classification. It does not.`,
          sub_caption: `The gap is now confirmed. And you deflected before acknowledging it.`,
          decision: {
            prompt: `The gap is explicit now. How do you respond to the General Counsel?`,
            choices: [
              { id: 'a', label: `Acknowledge the AUP never covered AI tools or data classification, and own that closing that gap was mine.`, quality: 'good',
                note: `Naming the gap as yours is what turns the incident into a mandate to fix it rather than a search for blame.` },
              { id: 'b', label: `Note that an AUP exists and frame this as an edge case it didn't anticipate.`, quality: 'partial',
                note: `Leaning on the existing policy softens an ownership question the GC has already seen through.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Gap owned. Controls designed.',
          tone:     'good',
          result:   'Your honest account of the governance gap — and your responsibility for it — is followed by a credible remediation proposal. The General Counsel approves the approved tools register and enterprise DPA requirement as immediate priorities. The policy and training follow. The remediation plan is documented and tracked.',
          learning: 'Owning a governance gap and immediately proposing a fix is far more effective than deflecting or minimising. The person responsible for governance who acknowledges the failure and leads the remediation is more valuable than one who manages the narrative.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Governance gap eventually acknowledged.',
          tone:     'warn',
          result:   'The gap is acknowledged after the policy deflection is exposed. The remediation is the same — approved tools register, enterprise DPA requirement, training — but the path there was slower and included an unnecessary deflection. The General Counsel notes both the gap and how it was initially characterised.',
          learning: 'A governance gap acknowledged directly is better than one that has to be drawn out. The remediation is the same either way; the difference is in the trust the General Counsel has in your account.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Deflection compounds the problem.',
          tone:     'bad',
          result:   'You deflected responsibility to individual staff. The General Counsel confirms you were aware of the practice and did not act. The deflection is now part of the record alongside the original governance failure. Your position has become significantly more difficult.',
          learning: 'When you had visibility of a risk and did not act, deflecting to individual staff when the risk materialises compounds the governance failure. Accountability for governance sits with the governance owner.',
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk-privacy',
          caption:     'The logs confirm it. Consumer AI endpoint. Two paralegal devices. Three sessions over two weeks.',
          sub_caption: 'You cannot recover what data was submitted — only that the connection was made.',
          decision: {
            prompt: 'The General Counsel asks you to brief her on what the logs show. How do you frame the findings?',
            choices: [
              { id: 'a', label: 'State exactly what the logs confirm and what they cannot confirm — connection, timing, and device; not content.',
                quality: 'good',
                note: 'Precise and accurate. The GC needs to know what is evidenced and what is not. Overstating the logs creates a false picture; understating them misses the relevant facts.' },
              { id: 'b', label: 'Confirm that the team was using the AI tool and that client data was likely submitted.',
                quality: 'partial',
                note: '\'Likely\' is an inference, not what the logs show. The logs show connection; content is confirmed by the paralegal\'s account, not the logs. Keep the two sources separate.' },
              { id: 'c', label: 'Confirm that client data was submitted to an external AI endpoint.',
                quality: 'poor',
                note: 'The logs cannot confirm what data was submitted — only that a connection was made. Presenting a log finding as evidence of data content overstates what you know and could be challenged.' },
            ],
          },
          branches: { a: 'n2_precise', b: 'n2_inference', c: 'n_unravel' },
        },

        n_unravel: {
          scene:       `analyst-desk`,
          caption:     `You told the General Counsel that client data was submitted to the external endpoint. Legal begins drafting a breach notification on that basis — then asks you to substantiate it. The logs show the connection and timing, but cannot show what content was sent.`,
          sub_caption: `You stated as fact something the logs can't establish.`,
          decision: {
            prompt: `How do you handle it?`,
            choices: [
              { id: 'a', label: `Correct it now: the logs confirm the connection, not the content; the data claim comes only from the paralegal's account.`, quality: 'good',
                note: `Walking the overstatement back before the notification goes out protects both the firm and your credibility.` },
              { id: 'b', label: `Soften it to "data was likely submitted" without flagging the evidence gap.`, quality: 'partial',
                note: `Hedging the wording without naming the evidence gap still leaves Legal acting on more than you can prove.` },
              { id: 'c', label: `Stand by the original statement — the connection is as good as confirmation.`, quality: 'poor',
                note: `Treating a connection as proof of content is the overstatement itself; insisting on it sends Legal down the wrong path.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow', c: 'n_dig' },
        },

        n_dig: {
          scene:       `desk-focused`,
          caption:     `Legal asks you to put the data-submission claim in writing for the notification. The logs in front of you show endpoints and timestamps — nothing about content.`,
          sub_caption: `Your name will be on the evidentiary basis.`,
          decision: {
            prompt: `What do you write?`,
            choices: [
              { id: 'a', label: `Write what the logs actually support, separate the paralegal's account, and flag that content cannot be confirmed from logs.`, quality: 'partial',
                note: `A late correction that keeps the notification defensible; the initial overstatement is noted.` },
              { id: 'b', label: `Write that the logs confirm client data was submitted.`, quality: 'poor',
                note: `Putting an unprovable claim in the evidentiary record is the overstatement that undermines the whole finding.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'outcome_bad' },
        },

        n3_follow: {
          scene:       `office-meeting`,
          caption:     `The briefing is clean. The General Counsel asks for the single most effective technical control.`,
          sub_caption: `Your recommendation shapes the remediation plan.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `DLP rules that detect and block submission of content matching client documents to external endpoints.`, quality: 'good',
                note: `Targets the exact failure path — content leaving for an unapproved destination.` },
              { id: 'b', label: `Web filtering that blocks consumer AI tools from firm devices.`, quality: 'partial',
                note: `Helps, but device-level filtering is easily bypassed and doesn't follow the data.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_precise: {
          scene:       'office-meeting-aftermath',
          caption:     'The General Counsel asks what controls should have prevented this from a technical perspective.',
          sub_caption: 'Your recommendations will inform the remediation plan.',
          decision: {
            prompt: 'What is the single most effective technical control you recommend?',
            choices: [
              { id: 'a', label: 'DLP rules that detect and block submission of document content matching client file patterns to unapproved AI endpoints.',
                quality: 'good',
                note: 'Correct priority. DLP targeting AI endpoints with document content detection addresses the specific pathway — large blocks of structured text going to consumer AI URLs.' },
              { id: 'b', label: 'Web filtering that blocks access to consumer AI tools from firm devices.',
                quality: 'partial',
                note: 'Effective but blunt. Blocking all consumer AI access without providing approved alternatives drives shadow AI to personal devices. DLP plus approved enterprise tools is a better combination.' },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },

        n2_inference: {
          scene:       `desk-working`,
          caption:     `The General Counsel asks you to separate what the logs show from what the paralegal confirmed. The two are different evidence sources.`,
          sub_caption: `You revise your briefing. The delay is noted.`,
          decision: {
            prompt: `How do you revise the briefing?`,
            choices: [
              { id: 'a', label: `Separate them cleanly: the logs show the connection and timing; the data content comes only from the paralegal's account.`, quality: 'good',
                note: `Distinguishing what each source can and cannot establish is the core of a credible security briefing.` },
              { id: 'b', label: `Restate the combined picture without clearly distinguishing the two sources.`, quality: 'partial',
                note: `Blending log evidence with recollection is exactly what overstates a finding — the thing to avoid here.` },
            ],
          },
          branches: { a: 'n3_follow', b: 'n3_follow' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Precise briefing. Strong remediation.',
          tone:     'good',
          result:   'Your precise briefing — what the logs confirm and what they do not — gives the General Counsel a solid evidentiary foundation. Your DLP recommendation is adopted as the priority technical control alongside the enterprise API tier requirement. The remediation is documented and tracked. Your analytical rigour is noted.',
          learning: 'In a privacy incident investigation, the value of a technical briefing is in its precision. Confirming what the evidence shows — and being clear about what it does not show — is more valuable than a confident account that conflates different evidence sources.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Briefing corrected. Recommendation sound.',
          tone:     'warn',
          result:   'The briefing required correction after the General Counsel separated the log evidence from the paralegal\'s account. The technical recommendation — DLP on AI endpoints — is sound and adopted. But the initial briefing conflation created a moment of confusion in a time-sensitive situation.',
          learning: 'In an incident briefing, evidence sources should be kept separate and clearly labelled. Logs confirm connections; witness accounts confirm content. Conflating them — even innocently — creates confusion that takes time to correct.',
          score:    55,
        },
        outcome_bad: {
          heading:  'Overstated findings.',
          tone:     'bad',
          result:   'Your briefing stated the logs confirmed data content when they only confirmed connection. The General Counsel\'s subsequent review identified the overstatement. An already difficult situation now includes a question about the quality of your technical analysis. The DLP recommendation is still adopted, but your briefing\'s credibility has been questioned.',
          learning: 'Technical briefings in incident response are relied on by decision-makers. Overstating what the evidence shows — however well-intentioned — undermines the decision-making process and your credibility as an analyst.',
          score:    15,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: 'Privacy Impact Assessment (PIA/DPIA)',
      effort: 'Medium', owner: 'Legal', go_live: true,
      context: 'No PIA was completed before the legal team began using AI tools with client data. A PIA would have identified that confidential contract text constitutes personal and commercially sensitive information requiring protection.',
    },
    {
      id: 'c2', label: 'Enterprise API tier for external AI',
      effort: 'Low', owner: 'Procurement', go_live: true,
      context: 'The consumer-tier tool used had no DPA — submitted data could be retained and used for training. An enterprise tier with a confirmed no-training clause would have contained the exposure pathway.',
    },
    {
      id: 'c3', label: 'Data minimisation controls',
      effort: 'Medium', owner: 'Technology', go_live: true,
      context: 'Jordan pasted the full contract including pricing schedules because it was faster. PII detection on AI inputs would have flagged the client identifiers and confidential commercial terms before submission.',
    },
    {
      id: 'c4', label: 'Acceptable use policy for AI tools (data focus)',
      effort: 'Low', owner: 'HR', go_live: true,
      context: 'No policy existed. The team was using consumer AI tools informally with no guidance on what data classifications were permitted. A clear policy — with specific examples for legal work — would have changed the behaviour.',
    },
  ],
};
