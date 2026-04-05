// B3 — AI Lifecycle Governance Failure
// "Still Running"
// A vendor silently upgrades the underlying LLM in a customer service
// AI product. Behaviour changes. The product owner investigates.
// Personas navigate the lifecycle governance failure.

export const scenario = {
  id:                'b3-lifecycle',
  risk_ref:          'B3',
  title:             'Still Running',
  subtitle:          'AI Lifecycle Governance Failure',
  domain:            'B — Governance',
  difficulty:        'Intermediate',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b3-lifecycle-governance',
  estimated_minutes: 11,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Customer Service Team Leader',
      character: 'Quinn',
      icon:      '◇',
      framing:   'Your team noticed the AI started giving different answers three weeks ago. You logged it. Nothing happened.',
      premise:   `You are Quinn, Customer Service Team Leader. Your team uses an AI assistant to handle first-line customer queries. Three weeks ago, your staff started flagging that the AI's responses felt different — more formal, occasionally wrong on product details. You logged the concern in the team issue tracker. No response came. This morning you were pulled into a meeting: the vendor has confirmed they upgraded the underlying model two months ago without notifying anyone.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief Operating Officer',
      character: 'Blake',
      icon:      '◈',
      framing:   'The vendor changed the model without telling you. Your customers have been receiving AI-generated responses from an untested system for two months.',
      premise:   `You are Blake, Chief Operating Officer. A vendor AI product used in customer service has been running on a new underlying model for two months — without notification, without testing, and without your knowledge. Customer service staff flagged behavioural changes three weeks ago. The flag sat unactioned in a team issue tracker. You are now managing two separate failures: the vendor's breach of contract and your organisation's failure to detect and act on operational signals.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'AI Product Owner',
      character: 'Avery',
      icon:      '◎',
      framing:   'You own this product. The vendor change notification clause is in the contract. It was never triggered.',
      premise:   `You are Avery, AI Product Owner. You are responsible for the customer service AI product. The vendor contract includes a 30-day advance notification requirement for material model changes. The vendor did not notify you. You are also responsible for the team issue tracker — which is where Quinn's flag sat unread for three weeks. Both failures are yours to answer for.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'AI Quality Analyst',
      character: 'Drew',
      icon:      '◉',
      framing:   'You have monitoring dashboards on this system. Something should have shown up weeks ago. You need to work out why it didn\'t.',
      premise:   `You are Drew, AI Quality Analyst. You maintain the monitoring dashboards for the customer service AI. The system has been producing outputs from a new underlying model for two months. Your dashboards show accuracy metrics — but they are based on a test set that was built for the old model. The new model passes those tests well enough that no alert fired. You are about to work out what the monitoring missed and why.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-colleague',
          caption:     'Your team flagged this three weeks ago. The flag went nowhere.',
          sub_caption: 'The COO wants to know: what specifically changed, and when did your team first notice?',
          decision: {
            prompt: 'What can you tell the COO?',
            choices: [
              { id: 'a', label: 'Specific examples: which queries changed, what the old and new responses looked like, and the date your team first noticed.', quality: 'good',
                note: 'This is exactly what the investigation needs. Concrete examples with dates establish a timeline and help assess customer impact. You have this — you logged it.' },
              { id: 'b', label: 'A general description — responses felt more formal and occasionally wrong — but you don\'t have specifics documented.', quality: 'partial',
                note: 'General descriptions help but won\'t establish the timeline APRA or Legal may need. If the logs exist, retrieve them now.' },
              { id: 'c', label: 'You prefer to let the vendor explain what changed — they have the technical detail.', quality: 'poor',
                note: 'The vendor can explain the technical change. Only your team can explain the operational impact. These are different questions and both need answers.' },
            ],
          },
          branches: { a: 'n2_documented', b: 'n2_general', c: 'outcome_warn' },
        },

        n2_documented: {
          scene:       'office-meeting',
          caption:     'Your log entries become the timeline for the incident investigation.',
          sub_caption: 'The COO asks: what should have happened when your team first flagged this?',
          decision: {
            prompt: 'What do you recommend?',
            choices: [
              { id: 'a', label: 'AI system behavioural changes flagged by operational staff should route to the product owner automatically — not sit in a team tracker.', quality: 'good',
                note: 'The flag went to the right place — a documented log — but the wrong destination. A direct escalation route to the product owner closes the gap.' },
              { id: 'b', label: 'Staff need better training on when to escalate AI issues versus handle them through normal service channels.', quality: 'partial',
                note: 'Training is useful but the problem was routing, not staff judgment. Quinn\'s team did the right thing — they flagged it. The system failed to route it correctly.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_general: {
          scene:       'desk-focused',
          caption:     'The COO asks for the log entries. You retrieve them — specific enough to be useful.',
          sub_caption: 'The operational picture is clearer than you thought.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Operational signal documented and acted on.',
          tone:     'good',
          result:   'Your log entries establish the operational timeline: first flag three weeks ago, specific examples documented, routing failure identified. Your recommendation — direct escalation route from operational flags to the product owner — is implemented. The COO notes that your team\'s documentation is the clearest evidence in the investigation.',
          learning: 'Operational staff are often the first to detect AI behavioural changes. Documenting specific examples — not just a general concern — turns a team observation into an actionable investigation trigger.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Signal documented. Routing gap remains.',
          tone:     'warn',
          result:   'Your log entries are useful for the investigation. But the training recommendation doesn\'t address the root cause — the flag was correctly raised and correctly logged, just routed to a dead end. The next behavioural change will follow the same path.',
          learning: 'When a correct action produces no result, the failure is usually in the system that received the action — not in the person who took it. Fixing routing is more durable than training people to do something they already did correctly.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Operational perspective missing.',
          tone:     'bad',
          result:   'The vendor explains the technical change. But without your operational account — when the changes were first noticed, what they looked like to customers — the investigation cannot establish the impact timeline. The COO asks why your team\'s flag sat unread. You cannot answer because you deferred to the vendor rather than contributing what only your team knows.',
          learning: 'Vendors can explain model changes. Only operational staff can explain what those changes felt like to customers and when. Both perspectives are required for a complete incident account.',
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'Two failures. One vendor breach. One internal detection failure.',
          sub_caption: 'Customers received AI-generated responses from an untested system for two months.',
          decision: {
            prompt: 'What is your immediate priority?',
            choices: [
              { id: 'a', label: 'Suspend the AI system pending regression testing against the new model. Then issue a formal breach notice to the vendor.', quality: 'good',
                note: 'Suspension stops further untested outputs reaching customers. Breach notice is contractually required and establishes your position. Both must happen — in that order.' },
              { id: 'b', label: 'Issue the breach notice to the vendor first — establish the contractual position before taking any operational action.', quality: 'partial',
                note: 'The breach notice is important but the system is still running on an untested model while you write it. Customers are still being served by something that hasn\'t been validated.' },
              { id: 'c', label: 'Request a meeting with the vendor to understand what changed before taking any action.', quality: 'poor',
                note: 'The vendor has already confirmed the change. Understanding the detail is useful but not a precondition for suspension. The system should not run on an untested model while you hold a meeting.' },
            ],
          },
          branches: { a: 'n2_suspend', b: 'n2_breach', c: 'outcome_warn' },
        },

        n2_suspend: {
          scene:       'office-bright',
          caption:     'System suspended. Vendor breach notice issued. Regression testing underway.',
          sub_caption: 'The board wants to know what governance failure allowed this to happen.',
          decision: {
            prompt: 'What do you tell the board?',
            choices: [
              { id: 'a', label: 'Two failures: the vendor breached the change notification clause, and internally the operational flag from customer service was not routed to the product owner. We are fixing both.', quality: 'good',
                note: 'Accurate and complete. The board needs both failures — external and internal — and the remediation plan for each. Single-blaming the vendor misses half the story.' },
              { id: 'b', label: 'The vendor breached the contract and we are pursuing remedies. Our internal processes worked — the team logged the issue.', quality: 'partial',
                note: 'The team did log the issue. But logging it in a tracker that nobody read for three weeks is not the same as internal processes working. The board will notice the gap.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_breach: {
          scene:       'desk-working',
          caption:     'Breach notice drafted. The system is still running on the untested model.',
          sub_caption: 'A customer complaint arrives about an incorrect response received this morning.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Both failures owned. System secured.',
          tone:     'good',
          result:   'The system is suspended within hours, breach notice issued, and regression testing scheduled. The board receives a clear account of both failures — vendor breach and internal routing gap — with a remediation plan for each: contract renegotiation and an operational escalation protocol. The COO\'s decisive response is noted positively.',
          learning: 'When a vendor breach is discovered, two questions must be answered simultaneously: what do we do about the vendor, and what did our own processes miss? Both need remediation plans.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Breach addressed. Internal gap unacknowledged.',
          tone:     'warn',
          result:   'The vendor breach is addressed. But the board\'s review finds that the internal operational flag sat unread for three weeks — and the COO presented this as the processes working. The board asks for a fuller account of the detection failure. A follow-up is required.',
          learning: 'A flag that is logged but not routed is a governance gap, not a functioning process. The distinction matters to boards and regulators reviewing what the organisation knew and when.',
          score:    45,
        },
        outcome_warn_2: {
          heading:  'System still running. Complaint received.',
          tone:     'warn',
          result:   'The breach notice is drafted but the system runs for another four hours on the untested model. A customer complaint about an incorrect response is received in that window. The complaint and the incident are now linked in the investigation file. The legal team asks why the system wasn\'t suspended while the breach notice was being prepared.',
          learning: 'A breach notice establishes your legal position. Suspending the system protects your customers. These are not alternatives — both must happen, and suspension is more urgent.',
          score:    30,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-working',
          caption:     'The vendor changed the model. The contract clause was never triggered. The team flag sat in your tracker.',
          sub_caption: 'You own both failures.',
          decision: {
            prompt: 'The COO asks: how did the vendor change slip through, and how did the team flag go unread for three weeks?',
            choices: [
              { id: 'a', label: 'The vendor did not trigger the notification clause — that\'s a contract breach. The team flag went to a shared tracker I don\'t actively monitor — that\'s a process gap I own.', quality: 'good',
                note: 'Taking ownership of both — clearly and without deflection — is the right move. The COO needs to know the root cause of each, not a defence of either.' },
              { id: 'b', label: 'The vendor breach is the primary issue — the contract clause exists precisely to prevent this. The tracker issue is secondary.', quality: 'partial',
                note: 'The vendor breach is serious. But framing the internal failure as secondary doesn\'t address why it took three weeks for a customer-facing behavioural change to reach you.' },
              { id: 'c', label: 'The team should have escalated more urgently — a tracker entry is not an escalation.', quality: 'poor',
                note: 'The team did what they were asked to do — log it. If a tracker entry is not an escalation, that is a process design failure, not a staff failure.' },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_vendor_focus', c: 'outcome_bad' },
        },

        n2_own: {
          scene:       'office-bright',
          caption:     'The COO asks you to design the fix for both gaps.',
          sub_caption: 'You have 48 hours.',
          decision: {
            prompt: 'What are your two primary recommendations?',
            choices: [
              { id: 'a', label: 'Add a monitoring alert that routes directly to the product owner when AI behavioural metrics shift materially. And add the vendor change notification clause to the renewal negotiation as a contractual remedy — with a penalty clause.', quality: 'good',
                note: 'Addresses both root causes technically and contractually. The alert closes the detection gap; the penalty clause gives the notification clause teeth.' },
              { id: 'b', label: 'Require weekly product owner review of the team tracker and a dedicated AI incident channel separate from general service issues.', quality: 'partial',
                note: 'Better than the current state but still relies on manual review. An automated alert on metric shifts is more durable than a scheduled review.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_vendor_focus: {
          scene:       'desk-focused',
          caption:     'The COO presses on the tracker. Why did it take three weeks?',
          sub_caption: 'She wants to understand the detection gap, not just the vendor breach.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Both gaps owned and fixed.',
          tone:     'good',
          result:   'You own both failures clearly and propose fixes that address root causes: an automated alert on metric shifts and a penalty clause for the vendor notification requirement. The COO approves both. The monitoring alert catches a minor drift in a different product the following month — the fix is already working.',
          learning: 'Owning two failures simultaneously is harder than owning one. But producing a fix for both — automated detection and contractual remedy — converts the incident into a governance improvement that extends beyond the immediate system.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Fixes proposed. Manual dependency remains.',
          tone:     'warn',
          result:   'The weekly review and dedicated channel are implemented. Detection improves. But a manual review cycle means the next behavioural change could sit for up to a week before being seen. Three months later, a different product has a minor drift that is caught at the next weekly review — seven days after it started.',
          learning: 'Manual review cycles create detection lag. For AI systems producing customer-facing outputs, a week is a long time. Automated alerting on metric shifts is more durable and faster than scheduled human review.',
          score:    55,
        },
        outcome_bad: {
          heading:  'Staff blamed. Root cause missed.',
          tone:     'bad',
          result:   'The COO asks the team leader directly whether the flag was raised. It was — three weeks ago, exactly as required. Your account is contradicted immediately. The COO concludes that the tracker was an inadequate escalation mechanism you designed — and that you\'ve deflected responsibility to the staff who used it correctly.',
          learning: 'Staff who follow the process correctly cannot be held accountable when the process fails. Process owners are accountable for process design. If the tracker was inadequate, that is a product owner failure — not a team failure.',
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'Two months of outputs from an untested model. Your monitoring didn\'t catch it.',
          sub_caption: 'You need to understand why before you can fix it.',
          decision: {
            prompt: 'What do you investigate first?',
            choices: [
              { id: 'a', label: 'The test set: was it built for the old model? If the new model scores well on old-model tests, the monitoring is testing the wrong thing.', quality: 'good',
                note: 'Correct first question. A monitoring system that tests the right metrics on the wrong benchmark will produce false confidence. This is likely the root cause.' },
              { id: 'b', label: 'The alert thresholds: were they set too loosely? A tighter threshold might have caught the drift earlier.', quality: 'partial',
                note: 'Thresholds matter, but if the test set itself is misaligned with the new model\'s outputs, tightening thresholds on a wrong metric won\'t help.' },
              { id: 'c', label: 'The vendor\'s documentation: what did they say the new model could do differently?', quality: 'partial',
                note: 'Useful for understanding the change, but you need to understand your monitoring failure first — not just what the new model does.' },
            ],
          },
          branches: { a: 'n2_testset', b: 'n2_threshold', c: 'n2_threshold' },
        },

        n2_testset: {
          scene:       'desk-working',
          caption:     'Confirmed: the test set was built 18 months ago for the original model. The new model passes it easily — it\'s just different enough that the tests don\'t catch the behavioural shift.',
          sub_caption: 'The COO asks: how do you fix this and how long will it take?',
          decision: {
            prompt: 'What do you recommend?',
            choices: [
              { id: 'a', label: 'Rebuild the test set using current production outputs. Add a control requiring any vendor model update to trigger a test set refresh before the change goes live. Four weeks to implement fully.', quality: 'good',
                note: 'Addresses the root cause — a stale test set — and adds a process control that prevents the same gap recurring when the next model update arrives.' },
              { id: 'b', label: 'Add human-in-the-loop review for a sample of AI outputs each week to catch drift the automated monitoring misses.', quality: 'partial',
                note: 'Human sampling catches some issues. But systematic behavioural shift — the kind caused by a model change — is better caught by updated automated tests than by sampling.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_threshold: {
          scene:       'desk-focused',
          caption:     'Tighter thresholds reveal some drift in the logs — but the fundamental issue is the test set.',
          sub_caption: 'You find the root cause anyway, just via a longer route.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Root cause found. Monitoring rebuilt.',
          tone:     'good',
          result:   'You identify the stale test set as the root cause and propose a fix: rebuild the test set from current production outputs and require a test set refresh before any vendor model update goes live. The COO approves both. The rebuilt monitoring catches a minor drift in a different system three months later — the fix is already working.',
          learning: 'Monitoring that measures the right metrics against the wrong benchmark produces false confidence. When a model changes, the test set must change with it — or be rebuilt to cover both the old and new model\'s output space.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Drift caught. Systematic fix missing.',
          tone:     'warn',
          result:   'Human sampling catches some issues and gives the team more confidence. But the next vendor model update — six months later — produces the same situation: the automated test set is built for the previous model, and behavioural shift is caught by a human reviewer eleven days after the change went live.',
          learning: 'Human sampling is a useful supplement to automated monitoring. It is not a substitute for test sets that are current and aligned to the model being tested.',
          score:    50,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: 'Pre-deployment testing checklist',
      effort: 'Low', owner: 'Technology', go_live: true,
      context: 'The new model was never tested before it went live — because nobody knew it had been deployed. A pre-deployment checklist that requires regression testing before any model change goes into production would have caught this before customers were affected.',
    },
    {
      id: 'c2', label: 'Vendor model change notification',
      effort: 'Low', owner: 'Procurement', go_live: false,
      context: 'The contract included a 30-day notification clause. The vendor didn\'t trigger it. A clause without a penalty has limited deterrent effect — the renewal negotiation should add contractual consequences for non-notification.',
    },
    {
      id: 'c3', label: 'AISDLC framework',
      effort: 'High', owner: 'Technology', go_live: false,
      context: 'There was no process for what happens when a vendor changes an underlying model. An AISDLC framework defines change management for AI systems — including vendor updates — so the organisation knows what testing and sign-off is required before a changed model touches customers.',
    },
    {
      id: 'c4', label: 'Decommissioning protocol',
      effort: 'Low', owner: 'Technology', go_live: false,
      context: 'The old model was replaced without a formal handover — no documentation of what changed, no archival of the baseline. A decommissioning protocol ensures that when a model is retired, its performance baseline is preserved for comparison against what replaced it.',
    },
  ],
};
