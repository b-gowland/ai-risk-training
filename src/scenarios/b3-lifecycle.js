// B3 — AI Lifecycle Governance Failure
// "Still Running"
// A vendor silently upgrades the underlying LLM in a customer service
// AI product. Behaviour changes. The product owner investigates.
// Personas navigate the lifecycle governance failure.
//
// Depth expansion April 2026 — all four personas expanded from 2 to 4
// decisions each. New beats: complication (something pushes back after
// the initial response) and closing synthesis (30 days later, does
// the fix hold?). Converted to template literals throughout.

export const scenario = {
  id:                `b3-lifecycle`,
  risk_ref:          `B3`,
  title:             `Still Running`,
  subtitle:          `AI Lifecycle Governance Failure`,
  domain:            `B — Governance`,
  difficulty:        `Intermediate`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b3-lifecycle-governance`,
  estimated_minutes: 16,
  has_business_user: true,

  learning_objectives: [
    `Recognise the difference between a vendor breach and an internal detection failure — and understand that both need remediation.`,
    `Know what it means for a monitoring system to test the wrong thing, and why stale test sets produce false confidence.`,
    `Understand what durable lifecycle governance looks like thirty days after the immediate response.`,
  ],
  pass_score: 70,
  regulatory_tags: [`eu-ai-act-article-9`, `eu-ai-act-article-14`, `nist-ai-rmf-manage-3`, `iso-42001-8`, `jurisdiction-eu`],

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Customer Service Team Leader`,
      character: `Quinn`,
      icon:      `◇`,
      framing:   `Your team noticed the AI started giving different answers three weeks ago. You logged it. Nothing happened.`,
      premise:   `You are Quinn, Customer Service Team Leader. Your team uses an AI assistant to handle first-line customer queries. Three weeks ago, your staff started flagging that the AI's responses felt different — more formal, occasionally wrong on product details. You logged the concern in the team issue tracker. No response came. This morning you were pulled into a meeting: the vendor has confirmed they upgraded the underlying model two months ago without notifying anyone.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Operating Officer`,
      character: `Blake`,
      icon:      `◈`,
      framing:   `The vendor changed the model without telling you. Your customers have been receiving AI-generated responses from an untested system for two months.`,
      premise:   `You are Blake, Chief Operating Officer. A vendor AI product used in customer service has been running on a new underlying model for two months — without notification, without testing, and without your knowledge. Customer service staff flagged behavioural changes three weeks ago. The flag sat unactioned in a team issue tracker. You are now managing two separate failures: the vendor's breach of contract and your organisation's failure to detect and act on operational signals.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `AI Product Owner`,
      character: `Avery`,
      icon:      `◎`,
      framing:   `You own this product. The vendor change notification clause is in the contract. It was never triggered.`,
      premise:   `You are Avery, AI Product Owner. You are responsible for the customer service AI product. The vendor contract includes a 30-day advance notification requirement for material model changes. The vendor did not notify you. You are also responsible for the team issue tracker — which is where Quinn's flag sat unread for three weeks. Both failures are yours to answer for.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `AI Quality Analyst`,
      character: `Drew`,
      icon:      `◉`,
      framing:   `You have monitoring dashboards on this system. Something should have shown up weeks ago. You need to work out why it did not.`,
      premise:   `You are Drew, AI Quality Analyst. You maintain the monitoring dashboards for the customer service AI. The system has been producing outputs from a new underlying model for two months. Your dashboards show accuracy metrics — but they are based on a test set that was built for the old model. The new model passes those tests well enough that no alert fired. You are about to work out what the monitoring missed and why.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       `desk-colleague`,
          caption:     `Your team flagged this three weeks ago. The flag went nowhere.`,
          sub_caption: `The COO wants to know: what specifically changed, and when did your team first notice?`,
          decision: {
            prompt: `What can you tell the COO?`,
            choices: [
              { id: 'a', label: `Specific examples: which query types changed, what the old and new responses looked like, and the date your team first noticed.`, quality: 'good',
                note: `This is exactly what the investigation needs. Concrete examples with dates establish a timeline and help assess customer impact. You have this — you logged it.` },
              { id: 'b', label: `A general description — responses felt more formal and occasionally wrong — but you do not have specifics documented.`, quality: 'partial',
                note: `General descriptions help but will not establish the timeline Legal may need. If the logs exist, retrieve them before providing an account.` },
              { id: 'c', label: `You prefer to let the vendor explain what changed — they have the technical detail.`, quality: 'poor',
                note: `The vendor can explain the technical change. Only your team can explain the operational impact. These are different questions and both need answers.` },
            ],
          },
          branches: { a: 'n2_documented', b: 'n2_general', c: 'outcome_warn' },
        },

        n2_documented: {
          scene:       `office-meeting`,
          caption:     `Your log entries become the timeline for the incident investigation.`,
          sub_caption: `The COO asks: what should have happened when your team first flagged this?`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `AI system behavioural changes flagged by operational staff should route to the product owner automatically — not sit in a team tracker.`, quality: 'good',
                note: `The flag went to the right place — a documented log — but the wrong destination. A direct escalation route to the product owner closes the gap.` },
              { id: 'b', label: `Staff need better training on when to escalate AI issues versus handle them through normal service channels.`, quality: 'partial',
                note: `Training is useful but the problem was routing, not staff judgment. Your team did the right thing — they flagged it. The system failed to route it correctly.` },
            ],
          },
          branches: { a: 'n3_staff_resistance', b: 'n3_staff_resistance' },
        },

        n2_general: {
          scene:       `desk-focused`,
          caption:     `The COO asks for the log entries. You retrieve them — specific enough to be useful.`,
          sub_caption: `The operational picture is clearer than you thought.`,
          decision: {
            prompt: `One of your team members is reluctant to have their specific flagged examples included in the investigation file. "I don't want to get anyone in trouble," she says. What do you tell her?`,
            choices: [
              { id: 'a', label: `Her examples aren't getting anyone in trouble — they're showing that the team did the right thing. The investigation needs them to establish the timeline.`, quality: 'good',
                note: `Reframing is correct. The staff flags are evidence of good practice, not a liability. Making that clear protects your team member and keeps the investigation complete.` },
              { id: 'b', label: `Leave her examples out. You have enough from the other log entries.`, quality: 'partial',
                note: `Workable if the remaining entries are sufficient, but you are removing evidence from an investigation to protect a staff member's comfort. If the timeline later proves thin, this decision will be revisited.` },
            ],
          },
          branches: { a: 'n3_staff_resistance', b: 'n3_staff_resistance' },
        },

        n3_staff_resistance: {
          scene:       `office-bright`,
          caption:     `The product owner has proposed a new routing protocol: any AI behavioural change flagged by operational staff routes directly to the product owner's inbox within 24 hours.`,
          sub_caption: `Three of your team members are uncomfortable. "That feels like surveillance — like we're being monitored for raising issues."`,
          decision: {
            prompt: `How do you address the concern with your team?`,
            choices: [
              { id: 'a', label: `Explain that the routing is on the flag itself, not on the person who raised it — the purpose is to make sure the right person sees it, not to track who raised it. Ask the product owner to confirm this in writing.`, quality: 'good',
                note: `The concern is legitimate and worth taking seriously. Asking for written confirmation of the routing purpose gives your team something concrete and tests whether the product owner has thought through the design.` },
              { id: 'b', label: `Reassure your team that the protocol is about fixing the system, not monitoring staff, and ask them to trust the process.`, quality: 'partial',
                note: `Verbal reassurance without a concrete mechanism is less durable than a written confirmation of purpose. Your team's concern is reasonable — "trust the process" does not answer it.` },
              { id: 'c', label: `Tell your team to raise the concern with HR if they are uncomfortable — it is not your decision to make.`, quality: 'poor',
                note: `This is your decision to manage. Your team is raising a concern about a protocol that affects them and that you advocated for. Deflecting to HR signals you are not willing to be accountable for the recommendation.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-review`,
          caption:     `Thirty days on. The routing protocol is live. Your team has used it twice — once for a genuine issue, once for a query that turned out to be a new product feature, not a model error.`,
          sub_caption: `The product owner asks your team to filter more carefully before routing. "We're getting noise in the channel."`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: 'a', label: `Push back gently: the point of the protocol is to route uncertain signals, not just confirmed problems. If your team has to be certain before routing, they will default to not routing — which is what happened before.`, quality: 'good',
                note: `The product owner's instinct to reduce noise is understandable but dangerous. A filter that only routes certain problems re-creates the original gap. The cost of false positives is low; the cost of missed signals is high.` },
              { id: 'b', label: `Agree to add a brief triage step — your team will discuss a flag with you before routing it, to filter genuine behavioural changes from product updates.`, quality: 'partial',
                note: `Adds a layer of judgment that will be helpful sometimes and too slow other times. When your team is uncertain, the instinct will be to wait — and waiting is the problem the protocol was designed to fix.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Operational signal protected and kept usable.`,
          tone:     'good',
          result:   `Your log entries establish the operational timeline. Your routing recommendation — flagged in the right terms — drives a protocol designed to receive uncertain signals, not just confirmed ones. When the product owner asks you to filter, you push back with the right argument: a protocol that only routes certainty re-creates the gap. Your team continues to route flags without over-filtering. Three months later, the protocol catches a genuine behavioural shift in a different product two weeks before customers start complaining.`,
          learning: `Operational staff are the earliest detection system for AI behavioural change. A routing protocol that works is one they will use — even for uncertain signals — because the cost of a false positive is lower than the cost of a missed one. Filtering protocols down to certainty undoes the design.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Signal documented. Routing friction introduced.`,
          tone:     'warn',
          result:   `The protocol is live but a triage step or training requirement has been added. Your team now pauses before routing, which means uncertain signals sometimes wait. When the product owner's "noise" concern re-emerged, the protocol quietly shifted from "route when unsure" to "route when certain." Six months later, a minor model drift sits in your team tracker for eight days before someone decides it is worth routing. The original pattern has returned at a lower scale.`,
          learning: `Routing protocols degrade when they add friction for uncertain signals. The design that works is the one that makes routing easier than not routing — not one that adds a judgment step that defaults to silence.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `Operational perspective missing.`,
          tone:     'bad',
          result:   `The vendor explains the technical change. But without your operational account — when the changes were first noticed, what they looked like in practice — the investigation cannot establish the customer impact timeline. The COO asks why your team's flag sat unread. You cannot answer because you deferred to the vendor rather than contributing what only your team knows.`,
          learning: `Vendors can explain model changes. Only operational staff can explain what those changes felt like to customers and when they were first noticed. Both perspectives are required for a complete incident account.`,
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `Two failures. One vendor breach. One internal detection failure.`,
          sub_caption: `Customers received AI-generated responses from an untested system for two months.`,
          decision: {
            prompt: `What is your immediate priority?`,
            choices: [
              { id: 'a', label: `Suspend the AI system pending regression testing against the new model. Then issue a formal breach notice to the vendor.`, quality: 'good',
                note: `Suspension stops further untested outputs reaching customers. Breach notice is contractually required and establishes your position. Both must happen — in that order.` },
              { id: 'b', label: `Issue the breach notice to the vendor first — establish the contractual position before taking any operational action.`, quality: 'partial',
                note: `The breach notice is important but the system is still running on an untested model while you write it. Customers are being served by something that has not been validated.` },
              { id: 'c', label: `Request a meeting with the vendor to understand what changed before taking any action.`, quality: 'poor',
                note: `The vendor has already confirmed the change. Understanding the detail is useful but not a precondition for suspension. The system should not run on an untested model while you hold a meeting.` },
            ],
          },
          branches: { a: 'n2_suspend', b: 'n2_breach', c: 'outcome_warn' },
        },

        n2_suspend: {
          scene:       `office-bright`,
          caption:     `System suspended. Vendor breach notice issued. Regression testing underway.`,
          sub_caption: `The board wants to know what governance failure allowed this to happen.`,
          decision: {
            prompt: `What do you tell the board?`,
            choices: [
              { id: 'a', label: `Two failures: the vendor breached the change notification clause, and internally the operational flag from customer service was not routed to the product owner. We are remediating both.`, quality: 'good',
                note: `Accurate and complete. The board needs both failures — external and internal — and the remediation plan for each. Blaming only the vendor misses half the story.` },
              { id: 'b', label: `The vendor breached the contract and we are pursuing remedies. Our internal processes worked — the team logged the issue.`, quality: 'partial',
                note: `The team did log the issue. But logging it in a tracker that nobody read for three weeks is not the same as internal processes working. The board will notice the gap.` },
            ],
          },
          branches: { a: 'n3_contract_challenge', b: 'n3_contract_challenge' },
        },

        n2_breach: {
          scene:       `desk-working`,
          caption:     `Breach notice drafted. The system is still running on the untested model.`,
          sub_caption: `A customer complaint arrives about an incorrect response received this morning.`,
          decision: {
            prompt: `You now have a breach notice drafted and a live complaint. What do you do?`,
            choices: [
              { id: 'a', label: `Suspend the system immediately. Link the complaint to the breach notice. Brief the board on both the suspension and the complaint in the same communication.`, quality: 'good',
                note: `The complaint makes suspension more urgent, not less. Linking it to the breach notice gives the board a complete picture and avoids two separate crisis communications.` },
              { id: 'b', label: `Handle the complaint through normal service channels and continue with the breach notice. The complaint may not be related to the model change.`, quality: 'partial',
                note: `The timing makes it almost certainly related. Treating them as separate incidents when they are likely connected means two incomplete investigations.` },
            ],
          },
          branches: { a: 'n3_contract_challenge', b: 'n3_contract_challenge' },
        },

        n3_contract_challenge: {
          scene:       `boardroom`,
          caption:     `Legal has reviewed the breach notice. The vendor's legal team is pushing back.`,
          sub_caption: `Their argument: the contract clause requires notification of "material changes to core functionality." They claim the model upgrade did not materially alter functionality — it improved it.`,
          decision: {
            prompt: `How do you respond to the vendor's position?`,
            choices: [
              { id: 'a', label: `Reject the interpretation. "Material" is defined by whether your organisation can assess the change before it goes live — not by whether the vendor considers the change an improvement. The test is whether you had the opportunity to test it. You did not.`, quality: 'good',
                note: `This is the correct legal and governance framing. The notification clause exists to give the deploying organisation a testing window. A change that denies that window is material by definition, regardless of whether it improved performance.` },
              { id: 'b', label: `Ask Legal to review the contract definition of "material" before responding. Avoid hardening your position until you know the legal ground.`, quality: 'partial',
                note: `Prudent as an instinct, but the governance argument is not dependent on the contract definition alone. The operational impact — two months of untested outputs — is the evidence. Waiting for Legal risks appearing to accept the vendor framing.` },
              { id: 'c', label: `Acknowledge the vendor's point. If performance improved, pursue a commercial remedy rather than a contract breach.`, quality: 'poor',
                note: `Performance improvement is irrelevant to the notification obligation. Accepting the vendor's framing abandons the contractual position and signals that notification can be bypassed if the change is characterised as beneficial.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `office-meeting`,
          caption:     `Thirty days on. Regression testing is complete. The new model is cleared for use. The vendor has agreed to a revised notification clause.`,
          sub_caption: `The AI product owner proposes the system go back live immediately. The board wants to know your position.`,
          decision: {
            prompt: `What conditions do you set for reinstatement?`,
            choices: [
              { id: 'a', label: `Three conditions: the revised contract clause is signed before go-live, the test set is rebuilt against the new model, and the internal routing protocol for operational flags is confirmed live and tested.`, quality: 'good',
                note: `All three address root causes, not symptoms. The contract clause prevents recurrence. The rebuilt test set closes the monitoring gap. The routing protocol closes the detection gap. None is optional.` },
              { id: 'b', label: `Regression testing passed — that is the reinstatement condition. The contract and routing changes can follow in parallel.`, quality: 'partial',
                note: `Reinstating on technical clearance alone before the governance changes are in place means going live on the same governance footing that allowed the original incident. "In parallel" becomes "later."` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Both failures owned. System reinstated on new terms.`,
          tone:     'good',
          result:   `The system is suspended, both failures named to the board, the vendor's interpretation challenged with the right argument, and reinstatement conditional on all three governance fixes being in place. The vendor signs the revised clause. The rebuilt test set and the routing protocol are live before the system goes back online. The incident becomes a governance improvement case study. A follow-up board review notes that all three conditions were met before reinstatement.`,
          learning: `When a vendor AI incident involves both an external breach and an internal detection failure, the governance response must address both — and reinstatement should only follow when the fixes for both are in place. Using the reinstatement decision as a forcing function for governance change is one of the few levers available to a COO.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Breach addressed. Internal gaps still open.`,
          tone:     'warn',
          result:   `The vendor breach is addressed and the system reinstated on technical clearance. The contract revision and routing protocol follow, but not before go-live. Three months later, a minor model drift goes undetected for eleven days because the test set was not rebuilt before reinstatement — it was rebuilt afterward, but the rebuilt version was not deployed yet when the drift began.`,
          learning: `Reinstatement decisions are one of the few points at which a COO can make governance changes blocking rather than aspirational. Using it only for technical clearance leaves the governance gaps open at exactly the moment when the system is most scrutinised.`,
          score:    45,
        },
        outcome_warn_b: {
          heading:  `System still running. Complaint received.`,
          tone:     'warn',
          result:   `The breach notice is drafted but the system runs on the untested model for several more hours. The customer complaint arrives in that window and is linked in the investigation file. Legal asks why the system was not suspended while the breach notice was being prepared. The answer — that contractual position was being established first — does not satisfy the question of why customers were still being served by an untested model.`,
          learning: `A breach notice establishes your legal position. Suspending the system protects your customers. These are not alternatives and suspension is the more urgent of the two.`,
          score:    30,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The vendor changed the model. The contract clause was never triggered. The team flag sat in your tracker.`,
          sub_caption: `You own both failures.`,
          decision: {
            prompt: `The COO asks: how did the vendor change slip through, and how did the team flag go unread for three weeks?`,
            choices: [
              { id: 'a', label: `The vendor did not trigger the notification clause — that is a contract breach. The team flag went to a shared tracker I do not actively monitor — that is a process gap I own.`, quality: 'good',
                note: `Taking clear ownership of both — without deflection — is the right move. The COO needs the root cause of each, not a defence of either.` },
              { id: 'b', label: `The vendor breach is the primary issue — the contract clause exists precisely to prevent this. The tracker issue is secondary.`, quality: 'partial',
                note: `The vendor breach is serious. But framing the internal failure as secondary does not address why it took three weeks for a customer-facing behavioural change to reach you.` },
              { id: 'c', label: `The team should have escalated more urgently — a tracker entry is not an escalation.`, quality: 'poor',
                note: `The team did what they were asked to do — log it. If a tracker entry is not an escalation, that is a process design failure, not a staff failure.` },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_vendor_focus', c: 'outcome_bad' },
        },

        n2_own: {
          scene:       `office-bright`,
          caption:     `The COO asks you to design the fix for both gaps.`,
          sub_caption: `You have 48 hours.`,
          decision: {
            prompt: `What are your two primary recommendations?`,
            choices: [
              { id: 'a', label: `Add a monitoring alert that routes directly to the product owner when AI behavioural metrics shift materially. And add a penalty clause to the vendor contract renewal for non-notification — the current clause has no teeth.`, quality: 'good',
                note: `Addresses both root causes: the detection gap and the contractual deterrent. The alert closes routing; the penalty clause gives the notification obligation real weight.` },
              { id: 'b', label: `Require weekly product owner review of the team tracker and create a dedicated AI incident channel separate from general service issues.`, quality: 'partial',
                note: `Better than the current state but still relies on manual review. An automated alert on metric shifts is more durable than a scheduled review.` },
            ],
          },
          branches: { a: 'n3_cab_pushback', b: 'n3_cab_pushback' },
        },

        n2_vendor_focus: {
          scene:       `desk-focused`,
          caption:     `The COO presses on the tracker. Why did it take three weeks?`,
          sub_caption: `She wants to understand the detection gap, not just the vendor breach.`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `The tracker is not actively monitored — it is a passive log. Flags sit there until someone looks. I should have had an alert on it. That is a design failure I own.`, quality: 'good',
                note: `The direct answer is the right one. The COO is asking why — not for a defence of what the tracker was designed to do.` },
              { id: 'b', label: `The tracker was intended for general service issues. AI behavioural changes were not a defined flag category at the time.`, quality: 'partial',
                note: `Accurate but process-defensive. The COO is more interested in what you are going to do about it than in the history of the tracker's design intent.` },
            ],
          },
          branches: { a: 'n3_cab_pushback', b: 'n3_cab_pushback' },
        },

        n3_cab_pushback: {
          scene:       `office-meeting`,
          caption:     `You present the automated alert proposal to the IT Change Advisory Board.`,
          sub_caption: `The CAB questions the alert threshold: "If it fires too easily, your team will start ignoring it. What's the right sensitivity?"`,
          decision: {
            prompt: `How do you answer?`,
            choices: [
              { id: 'a', label: `Propose a two-tier design: a low-sensitivity alert that routes to the product owner for review (not action), and a high-sensitivity alert that triggers automatic suspension pending investigation. Both thresholds are calibrated to the historical baseline and reviewed after 60 days.`, quality: 'good',
                note: `The two-tier design directly addresses the CAB's concern. Routing for review at low sensitivity does not create alert fatigue; automatic suspension at high sensitivity prevents the response delay that caused the incident.` },
              { id: 'b', label: `Set a high threshold to avoid false positives. The goal is to catch major shifts, not minor fluctuations.`, quality: 'partial',
                note: `A high threshold may miss the kind of gradual drift that occurred here — where the shift was real but not dramatic. The two months of undetected operation was not a massive anomaly; it was a consistent but moderate deviation.` },
              { id: 'c', label: `Start with the same sensitivity the current monitoring uses and increase it gradually as you learn what to expect.`, quality: 'poor',
                note: `The current monitoring sensitivity is the one that failed to catch two months of model change. Starting there is not a baseline; it is the problem.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-review`,
          caption:     `Thirty days after go-live. The alert has fired once — a low-sensitivity flag on a product feature update that was expected.`,
          sub_caption: `The product owner reviewed it and cleared it in 20 minutes. No false negative.`,
          decision: {
            prompt: `The COO asks for your assessment: is the governance fix holding?`,
            choices: [
              { id: 'a', label: `One false positive cleared in 20 minutes is a good result — the routing is working and the review time is low. The high-sensitivity threshold has not fired, which means no automatic suspensions. Propose a 60-day calibration review with the quality analyst to confirm thresholds are still correctly set.`, quality: 'good',
                note: `Evidence-based assessment with a forward action. The 60-day calibration review tests whether the thresholds hold as the model's normal variation is better understood.` },
              { id: 'b', label: `The system is working. One false positive with no false negatives after 30 days is a strong signal.`, quality: 'partial',
                note: `30 days is a short window. A stronger answer includes a planned calibration point rather than treating a quiet month as confirmation.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Both gaps owned and fixed with calibration built in.`,
          tone:     'good',
          result:   `You own both failures clearly and produce fixes that address root causes: a two-tier alert on metric shifts, a penalty clause for the vendor notification obligation, and a 60-day calibration review. The COO approves all three. The calibration review runs and confirms the low-sensitivity threshold can be tightened slightly as the baseline is better understood. The following month, the alert catches a minor drift in a different product — the governance fix has extended beyond the original incident.`,
          learning: `Owning two governance failures simultaneously — external breach and internal detection — and producing fixes that address both root causes converts an incident into a durable improvement. Calibration reviews built into the fix acknowledge that thresholds set on incomplete baseline data will need adjustment.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Fixes in place. Calibration deferred.`,
          tone:     'warn',
          result:   `The alert and the contract changes are implemented. The 30-day window is clean. But without a calibration review, the threshold that was set conservatively to avoid false positives stays conservative. Seven months later, a gradual shift in response quality accumulates over six weeks before the high-sensitivity threshold is triggered. The low-sensitivity alert fired three times during that period — each cleared as noise, none escalated to the COO.`,
          learning: `Alert thresholds set at deployment are based on incomplete baseline data. A calibration review after 60 days uses operational experience to confirm whether the sensitivity is correctly tuned. Skipping it means the threshold can be either too tight or too loose without anyone knowing.`,
          score:    55,
        },
        outcome_bad: {
          heading:  `Staff blamed. Root cause missed.`,
          tone:     'bad',
          result:   `The COO asks the team leader directly whether the flag was raised. It was — three weeks ago, exactly as required. Your account is contradicted immediately. The COO concludes that the tracker was an inadequate escalation mechanism you designed — and that you have deflected responsibility to staff who used it correctly. The internal failure is now attributed to the product owner rather than to the process.`,
          learning: `Staff who follow the process correctly cannot be held accountable when the process fails. Process owners are accountable for process design. If the tracker was an inadequate escalation mechanism, that is a product owner failure — not a team failure.`,
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Two months of outputs from an untested model. Your monitoring did not catch it.`,
          sub_caption: `You need to understand why before you can fix it.`,
          decision: {
            prompt: `What do you investigate first?`,
            choices: [
              { id: 'a', label: `The test set: was it built for the old model? If the new model scores well on old-model tests, the monitoring is measuring the wrong thing.`, quality: 'good',
                note: `Correct first question. A monitoring system that tests the right metrics on the wrong benchmark produces false confidence. This is likely the root cause.` },
              { id: 'b', label: `The alert thresholds: were they set too loosely? A tighter threshold might have caught the drift earlier.`, quality: 'partial',
                note: `Thresholds matter, but if the test set is misaligned with the new model's outputs, tightening thresholds on the wrong metric will not help.` },
              { id: 'c', label: `The vendor's documentation: what did they say the new model could do differently?`, quality: 'partial',
                note: `Useful context, but you need to understand your monitoring failure first. The vendor documentation tells you what changed — it does not explain why your dashboards missed it.` },
            ],
          },
          branches: { a: 'n2_testset', b: 'n2_threshold', c: 'n2_threshold' },
        },

        n2_testset: {
          scene:       `desk-working`,
          caption:     `Confirmed: the test set was built 18 months ago for the original model. The new model passes it easily — it is just different enough that the tests do not catch the behavioural shift.`,
          sub_caption: `The COO asks: how do you fix this and how long will it take?`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `Rebuild the test set using current production outputs from both models in parallel for two weeks. Add a process control requiring any vendor model update to trigger a test set refresh before the new model goes live.`, quality: 'good',
                note: `Addresses the root cause — a stale test set — and adds a process control that prevents the same gap when the next model update arrives.` },
              { id: 'b', label: `Add human-in-the-loop review of a sample of AI outputs each week to catch drift the automated monitoring misses.`, quality: 'partial',
                note: `Human sampling catches some issues. But systematic behavioural shift caused by a model change is better caught by updated automated tests than by sampling.` },
            ],
          },
          branches: { a: 'n3_baseline_question', b: 'n3_baseline_question' },
        },

        n2_threshold: {
          scene:       `desk-focused`,
          caption:     `Tighter thresholds reveal some anomalies in the logs — but the fundamental issue is the test set, not the sensitivity.`,
          sub_caption: `You find the root cause via a longer route.`,
          decision: {
            prompt: `You have the root cause: a stale test set. The COO asks: would tighter alert thresholds have caught the drift even with the old test set?`,
            choices: [
              { id: 'a', label: `Probably not — the new model scores well enough on the old test that even tight thresholds on the same metrics would not have fired on a genuine shift. The tests need to change, not just the sensitivity.`, quality: 'good',
                note: `The honest answer. Threshold tightening on the wrong benchmark would have produced more false positives without catching the real signal. The test set is the root cause, not the threshold.` },
              { id: 'b', label: `Possibly — with tight enough thresholds, some anomalies might have triggered. But a rebuilt test set is a more reliable fix.`, quality: 'partial',
                note: `Technically hedged but gives the wrong impression. The monitoring failure is a test set problem. "Possibly tight thresholds" muddies the root cause.` },
            ],
          },
          branches: { a: 'n3_baseline_question', b: 'n3_baseline_question' },
        },

        n3_baseline_question: {
          scene:       `office-meeting`,
          caption:     `The product owner is reviewing your test set rebuild proposal.`,
          sub_caption: `She raises a question you were not expecting: "If we rebuild the test set from current production outputs, and the current outputs are from the new model, how do we know what the old model should have produced?"`,
          decision: {
            prompt: `How do you answer?`,
            choices: [
              { id: 'a', label: `The old baseline is archived in the monitoring logs. The rebuild uses both: the new model's current outputs set the forward benchmark, and the archived old-model logs allow a comparison assessment. Both are needed for the two-week parallel run.`, quality: 'good',
                note: `Correct and technically complete. The archived logs are the evidence that makes the comparison possible — this is why monitoring log retention matters, and the product owner should know it.` },
              { id: 'b', label: `The rebuild focuses on the new model's current outputs. The old model is no longer in production so its baseline is less relevant to future monitoring.`, quality: 'partial',
                note: `Forward-looking monitoring is correct. But losing the comparison baseline means the two-week parallel run cannot assess how much the outputs have actually shifted — which is the question the investigation still needs to answer.` },
              { id: 'c', label: `That is a good question — you will need to go back and check what was archived before confirming the proposal.`, quality: 'poor',
                note: `You should know this before proposing the rebuild. This answer signals that the proposal was not fully thought through, which reduces confidence in it at the point when it needs approval.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `drift-dashboard`,
          caption:     `Thirty days on. The rebuilt test set is live. The monitoring dashboard now shows two tracks: new-model accuracy against the rebuilt benchmark, and a comparison view against the archived old-model baseline.`,
          sub_caption: `The product owner asks you to set the go-forward review cadence for the test set.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: 'a', label: `Quarterly test set review for routine model versions. Mandatory immediate rebuild triggered by any vendor model change notification — not waiting for the quarter. And a 6-month archive retention policy so comparison baselines are always available for future incidents.`, quality: 'good',
                note: `Three interlocking decisions: a routine cadence, an event-triggered refresh, and a retention policy. Together they close the stale test set gap and the missing baseline gap simultaneously.` },
              { id: 'b', label: `Quarterly review. If a vendor model change notification arrives, include it in the next quarterly cycle unless the change looks significant.`, quality: 'partial',
                note: `A quarterly cycle with a significance judgment creates the same gap as the notification clause the vendor bypassed: the judgment call about whether something is "significant enough" is made by the wrong party at the wrong time.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Root cause found. Monitoring rebuilt with retention policy.`,
          tone:     'good',
          result:   `You identify the stale test set as the root cause, rebuild it using both the new and archived baselines, answer the product owner's comparison question with technical accuracy, and set a cadence that includes an event-triggered refresh on any vendor model change. The 6-month archive retention policy means the comparison baseline will always be available. The rebuilt monitoring catches a minor drift in a different product two months later — the fix is already working across the portfolio.`,
          learning: `Monitoring that measures the right metrics against the wrong benchmark produces false confidence. When a model changes, the test set must change with it — and the archive that makes comparison possible must be retained long enough to be useful. A quarterly cadence with an event-triggered override closes both the routine and the incident gap.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Drift caught. Systematic refresh missing.`,
          tone:     'warn',
          result:   `The test set is rebuilt and the monitoring improves. But the go-forward cadence leaves a significance judgment in the hands of the product owner, and archive retention is not formalised. Six months later, a different AI product receives a vendor model update. The product owner judges it minor and defers the test set review to the next quarter. Eleven days into the new model, a quality analyst doing a manual check notices something. The monitoring did not fire.`,
          learning: `Human judgment about whether a vendor model change is "significant enough" to trigger a monitoring refresh is the same gap as the notification clause the vendor bypassed. The test set refresh should be triggered by the event, not by a significance assessment made after the fact.`,
          score:    50,
        },
        outcome_warn_b: {
          heading:  `Proposal not fully formed.`,
          tone:     'warn',
          result:   `The product owner's baseline question reveals that the rebuild proposal was not fully thought through before it was presented. The meeting is paused while you check the archives. The delay costs half a day and reduces confidence in the proposal. The rebuild proceeds, but the two-week parallel run is shortened to one week to compensate — which is not long enough to fully characterise the new model's output space.`,
          learning: `Technical proposals in governance contexts should anticipate the obvious questions before they are raised. The baseline question — how do you compare the new model to the old one — is the first question any product owner would ask. Having the answer ready is not a detail; it is the foundation of the proposal.`,
          score:    30,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: `Vendor model change notification clause`,
      effort: 'Low', owner: `Procurement`, go_live: false,
      context: `The contract included a 30-day notification clause. The vendor did not trigger it and argued the change was an improvement, not a material alteration. A clause with a defined penalty for non-notification — and a clear definition of "material" that includes any change to the underlying model — closes both the deterrent and the interpretation gaps.`,
    },
    {
      id: 'c2', label: `Operational flag routing protocol`,
      effort: 'Low', owner: `Technology`, go_live: false,
      context: `The customer service team flagged behavioural changes in the issue tracker. The flag sat unread for three weeks because the tracker was passive and unmonitored. An automated routing protocol that delivers operational flags to the product owner within 24 hours converts a passive log into an active escalation channel.`,
    },
    {
      id: 'c3', label: `Event-triggered test set refresh`,
      effort: 'Medium', owner: `Technology`, go_live: false,
      context: `The monitoring test set was 18 months old and built for the original model. The new model passed it without triggering alerts — because the tests were measuring the right metrics on the wrong benchmark. A process control requiring a test set rebuild before any vendor model change goes live closes the stale-benchmark gap at the point when it matters most.`,
    },
    {
      id: 'c4', label: `Monitoring log archive retention`,
      effort: 'Low', owner: `Technology`, go_live: false,
      context: `The comparison between old and new model outputs was only possible because monitoring logs were retained. A formal 6-month retention policy ensures the baseline is always available for future incident investigations and test set comparisons — not dependent on whether someone happened to keep the logs.`,
    },
  ],
};
