// B1 — Accountability Gaps
// "Nobody's Problem"
// An APRA supervisory review of a credit AI system reveals no named
// Accountable Person in the AI Register. Each persona navigates the
// accountability failure from their vantage point.

export const scenario = {
  id:                'b1-accountability',
  risk_ref:          'B1',
  title:             "Nobody's Problem",
  subtitle:          'AI Accountability Gaps',
  domain:            'B — Governance',
  difficulty:        'Intermediate',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b1-accountability',
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Credit Operations Officer',
      character: 'Quinn',
      icon:      '◇',
      framing:   'The credit AI makes decisions about your customers every day. The APRA reviewer just asked you who is responsible for it.',
      premise:   `You are Quinn, a Credit Operations Officer at an APRA-supervised bank. The AI system that supports credit decisions has been running for 18 months. You use it daily. This morning, an APRA supervisory reviewer sat down with your team and asked a simple question: who is accountable for this system's decisions? You looked around the room. Nobody answered.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief Risk Officer',
      character: 'Blake',
      icon:      '◈',
      framing:   'APRA is asking who owns the credit AI. The AI Register lists a vendor and a team — no named individual.',
      premise:   `You are Blake, Chief Risk Officer. An APRA supervisory review of your credit AI system is underway. The reviewer has asked for the AI Register entry showing the Accountable Person for the system. Your team has just confirmed: the entry names the model vendor and the technology team, but no specific individual is listed. Under the Financial Accountability Regime, you are accountable for what happens next.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'AI Programme Manager',
      character: 'Avery',
      icon:      '◎',
      framing:   'You built the AI Register. The accountability field was left blank because everyone assumed someone else owned it.',
      premise:   `You are Avery, AI Programme Manager. You designed and maintain the AI Register. When the credit AI was deployed 18 months ago, the Accountable Person field was left blank — the vendor said accountability was shared, the technology team said it belonged to Risk, and Risk said it would be clarified later. It never was. APRA is now asking to see the entry.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Model Risk Analyst',
      character: 'Drew',
      icon:      '◉',
      framing:   'You flagged the missing accountability entry six months ago. The issue was closed without resolution.',
      premise:   `You are Drew, a Model Risk Analyst. During a routine model review six months ago, you flagged that the credit AI's AI Register entry had no named Accountable Person and raised it as a finding. The finding was acknowledged and closed — marked "in progress." Nothing changed. APRA arrived this morning. Your finding report is now part of the supervisory review file.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-casual',
          caption:     'The reviewer\'s question hangs in the air. Nobody in the room answered.',
          sub_caption: 'She makes a note and moves on. You know this isn\'t over.',
          decision: {
            prompt: 'After the session, your manager asks if you have any context on who the system\'s owner is. What do you say?',
            choices: [
              { id: 'a', label: 'I\'ve never seen a named owner — it\'s always been unclear between the vendor and the technology team.', quality: 'good',
                note: 'Accurate and useful. Your honest operational account gives your manager the context to escalate correctly.' },
              { id: 'b', label: 'I thought Risk owned it — that\'s always been my assumption.', quality: 'partial',
                note: 'An assumption is better than nothing but assumptions are what created the gap. Flag it as an assumption, not a fact.' },
              { id: 'c', label: 'I\'m not sure it\'s my place to say — that\'s a governance question above my level.', quality: 'poor',
                note: 'You use this system daily. Your operational perspective is exactly what your manager needs right now. Deferring doesn\'t help anyone.' },
            ],
          },
          branches: { a: 'n2_clear', b: 'n2_assumption', c: 'outcome_warn' },
        },

        n2_clear: {
          scene:       'office-meeting',
          caption:     'Your manager thanks you. She confirms the gap has been escalated to the CRO.',
          sub_caption: 'The reviewer has requested a formal response within five business days.',
          decision: {
            prompt: 'The CRO asks your team to document how the system has been operating without a named owner. What do you contribute?',
            choices: [
              { id: 'a', label: 'A clear account of how decisions are made day-to-day and who in practice gets called when something goes wrong.', quality: 'good',
                note: 'This is exactly what the review needs — the operational reality behind the governance gap. Your account helps close it.' },
              { id: 'b', label: 'You prefer not to document anything until Legal has reviewed what can be shared with APRA.', quality: 'partial',
                note: 'Legal involvement is appropriate but this framing suggests concealment. The operational facts are not sensitive — the gap is the gap.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_assumption: {
          scene:       'desk-focused',
          caption:     'Your manager checks with Risk. Risk says they assumed Technology owned it.',
          sub_caption: 'Two layers of assumption. Still no owner.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Operational account closes the gap.',
          tone:     'good',
          result:   'Your clear account of day-to-day operations — who gets called, how decisions are queried, what happens when something breaks — gives the governance team exactly what they need. The CRO uses it to name an Accountable Person with full context of what the role actually involves. APRA receives a credible response within the five-day window.',
          learning: 'The person closest to an AI system\'s operation often has the clearest view of its accountability gaps. That operational knowledge is not below the governance conversation — it is central to it.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Gap acknowledged. Response delayed.',
          tone:     'warn',
          result:   'The accountability gap is confirmed but the response to APRA is slower than it needed to be. Assumptions passed between teams, and the operational picture took longer to establish than it should have. APRA receives a response, but with a note that the gap predates this review.',
          learning: 'Accountability gaps compound through layers of assumption. Each team assuming another owns a system is how a system ends up with no owner for 18 months.',
          score:    50,
        },
        outcome_bad: {
          heading:  'No account provided.',
          tone:     'bad',
          result:   'Without your operational perspective, the governance team is working blind on what the system actually does day-to-day. The response to APRA is thin. The reviewer notes that even operational staff could not speak to accountability — which extends the supervisory concern beyond the register entry to the organisation\'s overall AI governance culture.',
          learning: 'Deferring accountability questions upward without contributing what you know creates a vacuum that regulators notice. Every level has a role in accountability — including the people who use the system.',
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'The AI Register entry is on the table. The Accountable Person field is blank.',
          sub_caption: 'APRA has five days to receive a formal response.',
          decision: {
            prompt: 'What is your first action?',
            choices: [
              { id: 'a', label: 'Name an Accountable Person immediately, brief them fully, and confirm with APRA that the gap has been remediated.', quality: 'good',
                note: 'The right move. Naming an owner immediately and briefing them properly converts a compliance gap into a governance response. APRA responds better to decisive action than extended review.' },
              { id: 'b', label: 'Commission a review to determine who should be named before making any appointment.', quality: 'partial',
                note: 'Methodologically correct but slow. In a five-day window, an extended review risks missing the deadline. Name an interim owner while the review proceeds.' },
              { id: 'c', label: 'Respond to APRA that accountability is shared across the risk and technology functions.', quality: 'poor',
                note: 'Shared accountability is no accountability under FAR. APRA will read this as a failure to understand the accountability regime — which compounds the original gap.' },
            ],
          },
          branches: { a: 'n2_name', b: 'n2_review', c: 'outcome_bad' },
        },

        n2_name: {
          scene:       'office-bright',
          caption:     'You name yourself as interim Accountable Person. The AI Register is updated within the hour.',
          sub_caption: 'Now you need to understand what you are accountable for.',
          decision: {
            prompt: 'The system has been running for 18 months without a named owner. What do you commission immediately?',
            choices: [
              { id: 'a', label: 'A rapid model review: performance, fairness testing results, incident history, and monitoring status — all within the five-day window.', quality: 'good',
                note: 'As Accountable Person you need to know the system\'s actual state. Commissioning a rapid review before responding to APRA demonstrates you are discharging the role, not just holding the title.' },
              { id: 'b', label: 'A board paper on AI governance to be presented at the next meeting — this needs board visibility.', quality: 'partial',
                note: 'Board visibility is appropriate but the timing is wrong. APRA\'s five-day window needs a response first. Board paper can follow.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_review: {
          scene:       'office-meeting',
          caption:     'Three days into the review. Two candidates identified. No decision yet.',
          sub_caption: 'Two days until APRA\'s deadline.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Named, briefed, and accountable.',
          tone:     'good',
          result:   'You named yourself as interim Accountable Person, updated the AI Register within hours, and commissioned a rapid model review. APRA receives a response within the deadline confirming: named owner, register updated, model review underway, permanent accountability framework to follow within 30 days. The supervisory finding is noted but the response is credible.',
          learning: 'When an accountability gap is discovered under regulatory scrutiny, decisive action — naming an owner, understanding the system, responding within the deadline — demonstrates governance maturity. The gap is the gap; the response defines whether it becomes something worse.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Response made. Deadline tight.',
          tone:     'warn',
          result:   'A name is eventually provided but close to the deadline, with limited evidence that the newly named person understands the system. APRA notes the response but requests a follow-up meeting to discuss how the gap persisted for 18 months without detection.',
          learning: 'Accountability appointments made under regulatory pressure without adequate briefing create a different risk: a named person who cannot discharge the role. Naming and briefing must happen together.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Shared accountability rejected.',
          tone:     'bad',
          result:   'APRA\'s response to "shared accountability" is unambiguous: the Financial Accountability Regime requires a named individual, not a function or collective. The response is rejected and a formal supervisory letter issued requiring remediation within 30 days. The gap has become a finding.',
          learning: 'Under FAR and equivalent accountability regimes, shared accountability is not accountability. Regulators are explicit on this: a named individual must be identifiable and reachable when something goes wrong.',
          score:    0,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-intranet',
          caption:     'The AI Register is open in front of you. The Accountable Person field has been blank for 18 months.',
          sub_caption: 'APRA found it in 20 minutes.',
          decision: {
            prompt: 'The CRO asks how this happened. What do you tell her?',
            choices: [
              { id: 'a', label: 'The field was left blank because accountability was genuinely contested at deployment — vendor, technology, and risk all declined ownership. I should have escalated rather than left it open.', quality: 'good',
                note: 'Honest and takes appropriate responsibility. The CRO needs the root cause, not a managed account. This answer gives her both the systemic explanation and the individual decision point.' },
              { id: 'b', label: 'The register template didn\'t make the field mandatory — it was a process design gap, not an individual failure.', quality: 'partial',
                note: 'Technically accurate but incomplete. A non-mandatory field doesn\'t explain 18 months without resolution. The process gap is real but so is the failure to escalate.' },
              { id: 'c', label: 'The technology team confirmed they would fill it in after go-live. I assumed they had.', quality: 'poor',
                note: 'Shifting responsibility to another team under regulatory scrutiny creates a credibility problem. Even if true, the register is your responsibility to maintain — assumptions are not a defence.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_process', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       'office-bright',
          caption:     'The CRO accepts your account. She asks what the register needs to prevent this recurring.',
          sub_caption: 'You have an opportunity to fix the system, not just the entry.',
          decision: {
            prompt: 'What is your primary recommendation?',
            choices: [
              { id: 'a', label: 'Make the Accountable Person field mandatory with a named individual — not a team — and block AI Register submission without it. Add a quarterly review to confirm owners are still current.', quality: 'good',
                note: 'Addresses the root cause: a non-mandatory field and no review cycle. Making it blocking and adding a review cycle closes both gaps.' },
              { id: 'b', label: 'Add guidance text to the field explaining what an Accountable Person is and why it must be named.', quality: 'partial',
                note: 'Guidance is useful but won\'t prevent blank fields. A mandatory blocking control is more durable than explanatory text.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_process: {
          scene:       'desk-typing',
          caption:     'The CRO notes that the template is your responsibility. The process gap doesn\'t explain why it wasn\'t fixed.',
          sub_caption: 'She asks you to come back with a root cause and a fix.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Root cause owned. System fixed.',
          tone:     'good',
          result:   'Your honest account of what happened — contested accountability at deployment, failure to escalate — gives the CRO a clear picture. Your recommendation to make the field mandatory and blocking, with a quarterly review cycle, is implemented. The AI Register now prevents the same gap from recurring for any system.',
          learning: 'Governance tools that allow optional fields for mandatory information will have blank mandatory fields. Making accountability entry blocking — not advisory — is the only durable fix. Owning the failure is also the only path to being trusted to fix it.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Gap acknowledged. Fix insufficient.',
          tone:     'warn',
          result:   'The guidance text is added but the field remains optional. Within six months, two more systems are deployed with blank Accountable Person entries. The fix addressed the symptom — the blank field — without addressing the cause — nothing blocks submission without one.',
          learning: 'Guidance without enforcement is not a control. When a governance gap allows optional compliance, the fix must make compliance mandatory — not clearer.',
          score:    45,
        },
        outcome_bad: {
          heading:  'Accountability deflected.',
          tone:     'bad',
          result:   'The technology team is consulted. They confirm they were told accountability would be handled by Risk post-deployment. Risk confirms they said the same thing about Technology. The root cause is exactly what you described to yourself — contested ownership left unresolved — but you deflected rather than owning your part in it. The CRO asks why you didn\'t escalate when the field stayed blank.',
          learning: 'Register administrators are accountable for register completeness. Pointing to another team when a field stays blank for 18 months does not answer the question of why it wasn\'t escalated.',
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'Your finding from six months ago is in the APRA review file. It was closed without resolution.',
          sub_caption: 'The reviewer has asked to speak with you directly.',
          decision: {
            prompt: 'The APRA reviewer asks what happened when you raised the finding. What do you say?',
            choices: [
              { id: 'a', label: 'I raised it as a finding in the model review. It was acknowledged and closed as in-progress. I didn\'t follow up when nothing changed.', quality: 'good',
                note: 'Accurate and complete — including the part where you didn\'t follow up. The reviewer has the file. A complete account protects you and gives APRA the full picture.' },
              { id: 'b', label: 'I raised it and it was closed. I assumed it had been addressed.', quality: 'partial',
                note: 'An assumption after a finding is closed without evidence of remediation is weaker than it sounds. The reviewer will probe what "assumed" means.' },
              { id: 'c', label: 'I raised it and was told it was being handled. That was the end of my responsibility for it.', quality: 'poor',
                note: 'A finding closed without evidence of resolution is not handled. Framing it as the end of your responsibility may be technically defensible but reads poorly in a regulatory context.' },
            ],
          },
          branches: { a: 'n2_full', b: 'n2_assumption', c: 'outcome_warn' },
        },

        n2_full: {
          scene:       'office-meeting',
          caption:     'The reviewer thanks you. She asks what the finding process should require to prevent this happening again.',
          sub_caption: 'Your view — as the person who raised it — is directly relevant.',
          decision: {
            prompt: 'What do you recommend?',
            choices: [
              { id: 'a', label: 'Findings related to accountability and regulatory obligations should require evidence of remediation before closure — not just a status change. And a re-raise protocol if no evidence arrives within 30 days.', quality: 'good',
                note: 'Addresses both failure modes: closure without evidence and no follow-up mechanism. This is a systemic fix, not just a rule change.' },
              { id: 'b', label: 'Findings should require sign-off from a more senior reviewer before closure.', quality: 'partial',
                note: 'Senior sign-off helps but doesn\'t prevent a senior reviewer closing a finding without evidence either. Evidence of remediation is the key requirement.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_assumption: {
          scene:       'desk-focused',
          caption:     'The reviewer asks what "assumed" means in this context. You don\'t have a good answer.',
          sub_caption: 'She returns to the finding log. The closure note says "in progress." Nothing more.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Finding followed through.',
          tone:     'good',
          result:   'Your complete account — including the follow-up failure — gives APRA a clear picture of the systemic issue: findings could be closed without evidence of remediation. Your recommendation for evidence-based closure and a re-raise protocol is adopted. The APRA report notes that an internal analyst had identified the gap six months prior — a finding that strengthens the case for systemic remediation rather than individual accountability.',
          learning: 'Raising a finding is the first step. Following through when it is closed without evidence is the second. Both matter — but the systemic fix is evidence-based closure, not individual persistence.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Finding raised. Follow-up gap remains.',
          tone:     'warn',
          result:   'Your account is accepted. The senior sign-off requirement is implemented. But without evidence-based closure, the next accountability finding may follow the same path: raised, signed off by a senior reviewer, closed without actual remediation. The underlying failure mode is still present.',
          learning: 'Process improvements that address form without addressing substance — adding a senior approver without requiring evidence — reproduce the same gap in a slightly more credentialed wrapper.',
          score:    55,
        },
        outcome_bad: {
          heading:  'Incomplete account.',
          tone:     'bad',
          result:   'The reviewer probes the word "handled." The finding log shows the finding was closed with a status change and no evidence of remediation. Your account of having assumed it was resolved is inconsistent with what the log shows. She asks whether you reviewed the closure. The answer is no.',
          learning: 'A finding closed without evidence of remediation is not closed. Assuming otherwise — without checking — converts a completed process step into an open risk that compounds over time.',
          score:    15,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: 'AI Register with named owners',
      effort: 'Medium', owner: 'Risk', go_live: true,
      context: 'The credit AI had an AI Register entry — but the Accountable Person field was blank. A register that allows blank mandatory fields is not a control. The fix is making named ownership a blocking requirement before an entry can be submitted.',
    },
    {
      id: 'c2', label: 'FAR/accountability mapping',
      effort: 'Low', owner: 'Compliance', go_live: true,
      context: 'Under the Financial Accountability Regime, accountability cannot be shared or assigned to a vendor. The review exposed that no mapping to a named FAR Accountable Person had ever been done for this system — despite it making credit decisions for 18 months.',
    },
    {
      id: 'c3', label: 'Third-party accountability clauses',
      effort: 'Medium', owner: 'Legal', go_live: true,
      context: 'The vendor declined ownership at deployment and the organisation accepted that position. A contract clause explicitly allocating accountability to the deploying organisation — not the vendor — would have prevented the contested ownership from becoming a permanent gap.',
    },
    {
      id: 'c4', label: 'RACI for AI lifecycle',
      effort: 'Low', owner: 'Risk', go_live: false,
      context: 'When something went wrong with the system, nobody knew who had authority to pause it. The RACI defines not just who owns accountability but who can act in an incident — a question APRA asked and the organisation could not answer.',
    },
  ],
};
