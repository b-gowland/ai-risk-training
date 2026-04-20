// C3 — Model Theft & Intellectual Property Extraction
// Scenario: "The Extraction"
// A financial services firm's proprietary credit scoring API
// is being systematically queried by a single partner key.
// 50,000 requests in 24 hours — input features varied systematically.
// Each persona navigates the detection and response.

export const scenario = {
  id:                'c3-model-theft',
  risk_ref:          'C3',
  title:             'The Extraction',
  subtitle:          'Model Theft & Intellectual Property Extraction',
  domain:            'C — Security & Adversarial',
  difficulty:        'Intermediate',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-c-security/c3-model-theft',
  estimated_minutes: 12,
  has_business_user: false,

  personas: {
    executive: {
      label:     'Executive',
      role:      'Chief Risk Officer',
      character: 'Helena',
      icon:      '◈',
      framing:   'Security has flagged a partner API key making 50,000 requests in 24 hours. The pattern looks deliberate.',
      premise:   `You are Helena, Chief Risk Officer. The credit scoring model underpinning your personal lending business took four years and significant proprietary data to build. This morning your security team flagged an anomaly: a single integration partner's API key made 50,000 requests in 24 hours — systematically varying applicant income, age, and loan amount in small increments. The pattern is consistent with model extraction: someone is querying the API enough times to reconstruct the model's decision logic from the outside. The key belongs to a fintech partner whose integration contract is three months old.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'API Partnerships Lead',
      character: 'Marcus',
      icon:      '◎',
      framing:   'You onboarded this partner three months ago. The API contract has rate limits — but they were never enforced.',
      premise:   `You are Marcus, API Partnerships Lead. You own the commercial relationship with the fintech partner whose key has been flagged. You onboarded them three months ago. The integration contract specifies a daily limit of 500 requests per key — standard terms. You relied on the technology team to implement rate limiting in the gateway. Looking at the incident report, you can see the limit exists in the contract but was never configured in the system. 50,000 requests went through unchecked because no one connected the paper control to the technical one.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Security Analyst',
      character: 'Priya',
      icon:      '◉',
      framing:   'Your monitoring alert fired at 2am. The query pattern is unmistakably systematic. You are the first person to know.',
      premise:   `You are Priya, Security Analyst. Your API monitoring dashboard flagged the anomaly overnight: key ID PT-2847 — the fintech partner's integration key — made 50,183 requests in 23 hours. You pull the query log. The requests vary a single input variable at a time across its full range, then move to the next variable. It is a textbook model extraction pattern. The attacker — or the partner — is mapping the credit model's decision surface. The extraction may already be complete. It is 7am. You are the first person in the building who knows.`,
    },
  },

  trees: {

    executive: {
      nodes: {
        start: {
          scene:       'boardroom-crisis',
          caption:     '50,000 systematic API queries in 24 hours. The pattern is consistent with model extraction.',
          sub_caption: 'The key belongs to a commercial partner. The integration contract is three months old.',
          decision: {
            prompt: 'Security is waiting for direction. What is your first call?',
            choices: [
              { id: 'a', label: 'Revoke the key immediately, preserve all query logs, and brief Legal before contacting the partner.', quality: 'good',
                note: 'Right order. Revocation stops ongoing extraction. Log preservation protects your legal position. Legal needs to advise before any partner communication — what you say now will matter.' },
              { id: 'b', label: 'Contact the partner directly to ask for an explanation before taking any technical action.', quality: 'partial',
                note: 'Reasonable instinct — but alerting the partner before revoking the key gives them time to cover their tracks, and your logs may be your only evidence.' },
              { id: 'c', label: 'Wait for a fuller technical analysis before acting — you want to be certain before damaging a commercial relationship.', quality: 'poor',
                note: 'If this is an extraction, every hour of delay adds to the completeness of the stolen model. Commercial relationships can be managed. An extracted proprietary model cannot be unextracted.' },
            ],
          },
          branches: { a: 'n2_legal', b: 'n2_contact_first', c: 'n2_wait' },
        },

        n2_legal: {
          scene:       'boardroom-crisis',
          caption:     'Key revoked. Logs preserved. Legal is now in the room.',
          sub_caption: 'Legal asks: what do you want the outcome to be — remediation, or enforcement?',
          decision: {
            prompt: 'Legal can pursue this as a contract breach or as IP theft. Which way do you lean?',
            choices: [
              { id: 'a', label: 'Both — seek evidence of what was extracted, enforce the contract, and pursue IP remedies if the model has been used commercially.', quality: 'good',
                note: 'This is the correct scope. Contract breach is immediate and easier to prove. IP theft claims require evidence the extracted model was used — worth pursuing if it was.' },
              { id: 'b', label: 'Remediation only — revoke access, strengthen controls, and move on without litigation.', quality: 'partial',
                note: 'Clean and fast. But if the partner is now running a competing product built on your model, remediation without enforcement leaves that standing.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_contact_first: {
          scene:       'office-briefing',
          caption:     'The partner says it was an automated testing script that ran out of control. They offer to delete the data.',
          sub_caption: 'Legal notes: there is no way to verify deletion, and the offer itself is an implicit admission.',
          decision: {
            prompt: 'The partner is cooperative but Legal is urging you not to accept their explanation at face value. What do you do?',
            choices: [
              { id: 'a', label: 'Revoke the key, instruct Legal to treat the admission as evidence, and conduct a proper investigation.', quality: 'partial',
                note: 'Correct recovery — but you have already given the partner notice, which limited your investigative options. The outcome is workable but the sequence cost you leverage.' },
              { id: 'b', label: 'Accept the explanation, reinstate the key with tighter limits, and document the incident as resolved.', quality: 'poor',
                note: 'An unverifiable deletion offer from a party who just extracted your proprietary model is not a resolution. Reinstatement before investigation is not a defensible position.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_wait: {
          scene:       'desk-working-night',
          caption:     'Technical analysis confirms the pattern is extraction. The model decision surface is likely fully mapped.',
          sub_caption: 'Four hours have passed. The partner is unreachable.',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Extraction contained. Legal position preserved.',
          tone:     'good',
          result:   'The key is revoked, logs are preserved, and Legal has a clear evidentiary trail. The investigation confirms the partner used a commercial extraction tool — the queries map to a known model-stealing library. Legal pursues contract breach and IP remedies. The incident drives a redesign of the API gateway: rate limiting enforced in code, output obfuscation enabled, anomaly alerting active on all partner keys. The model remains proprietary.',
          learning: 'Model extraction via API querying is systematic and leaves a clear log trail — but only if you preserve it. The sequence matters: revoke first, preserve logs, then brief Legal before any partner contact. What you say to the partner before Legal advises can limit your options.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Extraction likely complete. Partial remediation achieved.',
          tone:     'warn',
          result:   'The key is eventually revoked and controls are strengthened. But the sequence — contacting the partner before revoking, or settling without investigation — either gave the partner time to act or left the extracted model in use without consequence. The technical remediation is sound. The legal outcome is weaker than it could have been.',
          learning: 'Commercial relationships are easier to repair than extracted intellectual property. When the evidence points clearly to model theft, legal preservation comes before partner management. The order of operations determines what remedies remain available.',
          score:    45,
        },
        outcome_bad: {
          heading:  'Extraction complete. No legal recourse.',
          tone:     'bad',
          result:   'The delay allowed the extraction to complete. The partner is now unreachable. Without preserved logs and prompt revocation, your legal position is weak — you cannot prove the timeline or the scope. The model that took four years to build is now likely in use by a competitor. The board wants to understand why the monitoring alert did not trigger an immediate response.',
          learning: 'Waiting for certainty before acting on a clear extraction signal is the wrong instinct. The cost of a false positive — revoking a legitimate partner key — is a difficult conversation. The cost of waiting on a true positive is an unrecoverable competitive loss.',
          score:    8,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-review',
          caption:     'The rate limit is in the contract. It was never configured in the API gateway.',
          sub_caption: 'You are the partnerships lead who onboarded this partner three months ago.',
          decision: {
            prompt: 'The CRO asks how 50,000 requests went through unchecked. What do you say?',
            choices: [
              { id: 'a', label: 'The contract control exists but was never implemented technically — I owned the onboarding and should have verified that configuration was complete.', quality: 'good',
                note: 'Accurate and accountable. The gap between a paper control and a technical one is a process failure. Owning it clearly is faster and more credible than deflecting.' },
              { id: 'b', label: 'Rate limiting is a technical implementation — that sits with engineering, not partnerships.', quality: 'partial',
                note: 'Engineering owns the configuration, but you owned the onboarding process. If the control was in your contract and not verified at go-live, the accountability is shared — and starting with deflection signals the wrong priorities.' },
              { id: 'c', label: 'The partner gave no indication of malicious intent during onboarding — there was no way to predict this.', quality: 'poor',
                note: 'True, but beside the point. The rate limit exists to prevent this regardless of intent. The question being asked is why the control was not in place — not whether you could have predicted malice.' },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_deflect', c: 'n2_intent' },
        },

        n2_own: {
          scene:       'office-bright',
          caption:     'The CRO accepts the account. She wants a remediation proposal within 48 hours.',
          sub_caption: 'The gap exists across all partner integrations, not just this one.',
          decision: {
            prompt: 'Your audit finds eight other partner keys with no rate limiting configured. What do you propose?',
            choices: [
              { id: 'a', label: 'Immediate rate limit configuration on all active partner keys, verified by security sign-off before any key remains active.', quality: 'good',
                note: 'Right scope and right sequence. Existing keys are the live risk — they need to be fixed before new onboarding process improvements matter.' },
              { id: 'b', label: 'Update the onboarding checklist so future integrations require rate limit verification at go-live.', quality: 'partial',
                note: 'Necessary but insufficient. Fixing the process for future partners does not address the eight keys already live without the control. The immediate risk is in the existing base.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_future_only' },
        },

        n2_deflect: {
          scene:       'office-briefing',
          caption:     'The CRO asks engineering. Engineering confirms the configuration was never requested during onboarding.',
          sub_caption: 'The onboarding process your team owns had no technical verification step.',
          decision: {
            prompt: 'The deflection has not held. The CRO is waiting. What now?',
            choices: [
              { id: 'a', label: 'Acknowledge the process gap in onboarding and propose the cross-functional fix.', quality: 'partial',
                note: 'Right move — one exchange late. The deflection cost credibility but the pivot to a fix is the correct response.' },
              { id: 'b', label: 'Maintain that engineering should have implemented the control without being asked.', quality: 'poor',
                note: 'Engineering cannot implement a control they were not told was required. The contract sat in your team. The gap is the absence of a handoff — and that sits with the process owner.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_intent: {
          scene:       'office-briefing',
          caption:     'The CRO notes that intent is not the question. The rate limit is a control, not a trust signal.',
          sub_caption: 'She asks again: why was it not configured?',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },

        n3_future_only: {
          scene:       'desk-review',
          caption:     'The updated checklist goes live. Two weeks later, security flags unusual query volume from a second partner key — one of the eight with no rate limiting.',
          sub_caption: 'The existing risk was not addressed.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Gap owned. All keys remediated.',
          tone:     'good',
          result:   'All eight live partner keys have rate limits configured and verified by security within 48 hours. The onboarding process is updated to require technical verification as a blocking step. A quarterly audit of API controls is added to the security review calendar. The incident becomes a case study in the difference between a paper control and an implemented one.',
          learning: 'A control in a contract is not a control in production. Onboarding processes for external API access must include explicit technical verification — not just commercial agreement — before a key is issued. The immediate risk is always in the existing base, not just future integrations.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Process fixed. Existing risk addressed late.',
          tone:     'warn',
          result:   'The onboarding process is improved and the rate limits are eventually configured on all partner keys — but after a delay, or after a second incident made the gap undeniable. The fix happened, but the sequence suggested the response was reactive rather than systematic.',
          learning: 'When an audit reveals a gap across multiple live integrations, the immediate remediation of existing exposure must precede process improvements for future integrations. Starting with the checklist while live keys remain unprotected gets the priority backwards.',
          score:    42,
        },
        outcome_bad: {
          heading:  'Control gap defended instead of fixed.',
          tone:     'bad',
          result:   'The deflection to engineering did not hold and damaged your credibility with the CRO at the moment she needed a clear account and a credible plan. The remediation is assigned to a cross-functional team rather than led by you. The incident report notes that the onboarding process lacked a technical verification step and that the initial response focused on accountability rather than resolution.',
          learning: 'Owning a process gap clearly — and leading its remediation — is faster and more credible than deflecting it. The question after an incident is not who is to blame but what is going to be fixed and by whom.',
          score:    8,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     '50,183 requests in 23 hours. One key. Each query varies a single input variable across its full range.',
          sub_caption: 'The pattern matches a textbook model extraction attack. It is 7am.',
          decision: {
            prompt: 'You are the first person in the building who knows. What do you do?',
            choices: [
              { id: 'a', label: 'Document the anomaly with full query log evidence and escalate to the CISO immediately — do not wait for 9am.', quality: 'good',
                note: 'Model extraction does not pause for business hours. The CRO and Legal need to be in the room before the working day starts — every hour matters for log preservation and key revocation.' },
              { id: 'b', label: 'Spend an hour building a more complete technical case before escalating — you want to be certain it is extraction and not a legitimate automated test.', quality: 'partial',
                note: 'Reasonable instinct, but the pattern is unambiguous. Escalate with what you have and continue building the case in parallel — do not let verification become delay.' },
              { id: 'c', label: 'Email the on-call engineer to check if this was an approved automated test before doing anything else.', quality: 'poor',
                note: 'An approved test would be in the change log. Checking informally before escalating to the CISO introduces delay and risks the alert being dismissed before the right people see it.' },
            ],
          },
          branches: { a: 'n2_escalated', b: 'n2_delayed', c: 'n2_informal' },
        },

        n2_escalated: {
          scene:       'boardroom-crisis',
          caption:     'The CISO is on a call with you by 7:40am. She asks for your technical assessment of extraction completeness.',
          sub_caption: 'The CRO and Legal are joining in ten minutes.',
          decision: {
            prompt: 'How do you characterise the extraction risk to the CISO?',
            choices: [
              { id: 'a', label: 'The query pattern is consistent with full model surface mapping — assume extraction is complete and proceed accordingly.', quality: 'good',
                note: 'Correct conservative framing. If extraction is complete and you treat it as partial, you underreact. If it is partial and you treat it as complete, you overreact — but the response is the same either way. Assume worst case.' },
              { id: 'b', label: 'Extraction may be partial — the queries cover most input ranges but not all combinations.', quality: 'partial',
                note: 'Technically defensible but risks creating a false sense of margin. The response to a partial extraction and a complete one should be identical — full revocation and legal engagement.' },
            ],
          },
          branches: { a: 'n2_ciso_brief', b: 'n2_ciso_brief' },
        },

        n2_ciso_brief: {
          scene:       'analyst-desk',
          caption:     'The CISO accepts your assessment. She asks you to prepare a technical evidence package for Legal.',
          sub_caption: 'Legal needs: query log timeline, input variation pattern, and your assessment of what the attacker can reconstruct.',
          decision: {
            prompt: 'What does your evidence package prioritise?',
            choices: [
              { id: 'a', label: 'Timeline of queries, visualisation of the systematic input variation, and an estimate of model reconstructability from the observed query volume.', quality: 'good',
                note: 'All three are what Legal needs. The timeline proves when it started. The variation pattern proves intent. The reconstructability estimate establishes the harm.' },
              { id: 'b', label: 'The query log and a note that the pattern looks like extraction — Legal can draw their own conclusions.', quality: 'partial',
                note: 'The log is the foundation but Legal needs your technical interpretation — they cannot independently assess whether 50,000 queries is sufficient to reconstruct the model. That analysis is yours to provide.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_delayed: {
          scene:       'desk-working',
          caption:     'Your extended analysis confirms extraction. It is now 9:15am. The partner\'s offices opened at 9am.',
          sub_caption: 'The CISO asks why the escalation did not come earlier.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },

        n2_informal: {
          scene:       'office-briefing',
          caption:     'The engineer confirms there is no approved test in the change log. It is now 8:30am.',
          sub_caption: 'The CISO asks why you went to an engineer before coming to her.',
          decision: {
            prompt: 'The CISO is visibly frustrated by the sequencing. How do you respond?',
            choices: [
              { id: 'a', label: 'Acknowledge the escalation should have come first — brief her fully now and focus on what still needs to happen.', quality: 'partial',
                note: 'Correct recovery. The sequencing cost time and raised a question about your escalation judgement, but the right move now is a complete brief and moving forward.' },
              { id: 'b', label: 'Explain that you wanted to rule out a false positive before waking the CISO at 7am.', quality: 'poor',
                note: 'A change-log check would have taken two minutes. The real issue is that the escalation threshold for a clear extraction pattern is not "I am certain" — it is "this is significant enough for the CISO to decide."' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Alert escalated. Evidence package complete.',
          tone:     'good',
          result:   'Your 7:40am escalation gives the organisation time to revoke the key, preserve logs, and brief Legal before the partner\'s working day starts. Your evidence package — timeline, variation pattern, reconstructability estimate — becomes the foundation of the legal case. The CISO notes in the post-incident review that the early escalation preserved options that a delayed response would have closed.',
          learning: 'Security analysts are the first line of detection, not the last line of decision. Escalating a clear anomaly to the CISO immediately — with your evidence and your assessment — is the job. What happens next is the CISO\'s call, not yours. Do not let the desire for certainty delay escalation of a significant finding.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Escalated — but time was lost.',
          tone:     'warn',
          result:   'The escalation happened and the response was sound — but the delay, whether from extended analysis or informal routing, compressed the window before the partner\'s working day started. The evidence package was also less complete than it could have been, requiring Legal to follow up for technical interpretation. The outcome is workable but the post-incident review notes both gaps.',
          learning: 'Parallel analysis is better than sequential. Escalate with what you have; continue building the technical case while the CISO and Legal are briefed. The two activities do not need to happen in sequence — and treating them as sequential creates unnecessary delay.',
          score:    42,
        },
        outcome_bad: {
          heading:  'Escalation process questioned.',
          tone:     'bad',
          result:   'The informal routing to an engineer before the CISO created a two-hour delay in a time-sensitive incident and raised questions about your escalation judgement. The CISO had to reconstruct the timeline. The post-incident review recommends a clearer escalation protocol for API anomalies — and notes that the analyst role in the first two hours of this incident needed to operate differently.',
          learning: 'Escalation thresholds for security incidents are not about personal certainty — they are about getting the right people involved in time for their decisions to matter. A pattern that looks like model extraction at 7am requires CISO involvement at 7am, not after an informal loop that takes two hours.',
          score:    10,
        },
      },
    },

  },

  controls_summary: [
    {
      id: 'c1', label: 'API rate limiting — enforced in gateway, not just contract',
      effort: 'Low', owner: 'Technology', go_live: true,
      context: 'The rate limit existed in the partner contract but was never configured in the API gateway. 50,000 queries went through unchecked because a paper control had no technical enforcement. Rate limiting in the gateway would have stopped the extraction after the first few hundred requests.',
    },
    {
      id: 'c2', label: 'Output obfuscation',
      effort: 'Low', owner: 'Technology', go_live: true,
      context: 'The API returned exact confidence scores, making it straightforward to reconstruct the model\'s decision surface from query responses. Returning probability ranges or categorical outputs instead of exact scores significantly increases the query volume needed for extraction — raising the cost and the detectability of any attempt.',
    },
    {
      id: 'c3', label: 'Anomaly detection on API query patterns',
      effort: 'Medium', owner: 'Security', go_live: true,
      context: 'The monitoring system detected the anomaly — but only because an analyst was watching. Automated anomaly detection on systematic input variation patterns, with alerting to the security team, would have flagged this within the first hour rather than after 23 hours of extraction.',
    },
    {
      id: 'c4', label: 'Model watermarking',
      effort: 'High', owner: 'Technology', go_live: false,
      context: 'A detective control that does not prevent extraction but enables detection of a stolen model in use. If the partner deploys a product built on the extracted model, watermarking allows you to prove it originated from yours — strengthening the legal case considerably.',
    },
  ],
};
