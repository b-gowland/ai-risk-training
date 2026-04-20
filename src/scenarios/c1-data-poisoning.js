// C1 — Training Data Poisoning
// Scenario: "Poisoned at the Source"
// A fraud detection model retrains weekly on confirmed labels.
// Write access to the labelling pipeline is broad.
// Fraud metrics improve while actual fraud losses increase.
// Each persona navigates the detection and systemic failure.

export const scenario = {
  id:                'c1-data-poisoning',
  risk_ref:          'C1',
  title:             'Poisoned at the Source',
  subtitle:          'Training Data Poisoning & Model Integrity',
  domain:            'C — Security & Adversarial',
  difficulty:        'Advanced',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-c-security/c1-data-poisoning',
  estimated_minutes: 15,
  has_business_user: false,

  personas: {
    executive: {
      label:     'Executive',
      role:      'Chief Risk Officer',
      character: 'Ingrid',
      icon:      '◈',
      framing:   'The fraud detection model is showing its best metrics in two years. Confirmed fraud losses are up 40%. Something is wrong.',
      premise:   `You are Ingrid, Chief Risk Officer. For the past three months, your fraud detection model has been posting its best precision and recall figures since deployment. The data science team celebrated. This morning your financial crime team presented a different picture: confirmed fraud losses are up 40% year-on-year over the same period. You asked to see the model's training data pipeline. What you learn is that write access to the label confirmation system — the database where fraud analysts mark transactions as confirmed fraud or legitimate — is held by twelve people across three teams. No one audited it when the model started performing unusually well. The model did not get better at detecting fraud. It learned that fraud is legitimate.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'ML Platform Lead',
      character: 'Reuben',
      icon:      '◎',
      framing:   'You own the model retraining pipeline. Write access to the labelling system is broader than it should be — and was flagged in a review eight months ago.',
      premise:   `You are Reuben, ML Platform Lead. You own the technical infrastructure for the fraud detection model — training pipelines, labelling systems, deployment. Eight months ago an internal security review flagged that write access to the label confirmation database was too broad: twelve accounts could modify confirmed fraud labels, when the design called for three. You added it to the backlog. It was deprioritised twice. This morning the CRO's investigation has traced a label manipulation pattern to two accounts in that set. The vulnerability you knew about was exploited.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Model Risk Analyst',
      character: 'Tara',
      icon:      '◉',
      framing:   'Your routine model performance review surfaced an anomaly — precision is up but fraud losses are rising. You are the first person to connect these two facts.',
      premise:   `You are Tara, Model Risk Analyst. Your monthly model performance review is routine — pull the metrics, check for drift, write the report. This month something does not add up: the fraud model's precision score is at a two-year high, but the financial crime team's loss report shows confirmed fraud up 40%. High precision means the model is rarely wrong when it flags fraud. Rising fraud losses mean fraud is getting through. These two facts are not compatible unless the model is being shown the wrong labels during training — learning that real fraud is legitimate. You are looking at the data. You think you understand what it means. You are the first person to connect these two numbers.`,
    },
  },

  trees: {

    executive: {
      nodes: {
        start: {
          scene:       'boardroom-crisis',
          caption:     'Model precision at a two-year high. Confirmed fraud losses up 40%. The training label pipeline has twelve people with write access.',
          sub_caption: 'The model did not get better. It was taught that fraud is legitimate.',
          decision: {
            prompt: 'The data science team are preparing a technical briefing. What do you instruct in parallel?',
            choices: [
              { id: 'a', label: 'Suspend the fraud model\'s automated decisions immediately and revert to manual review while the pipeline is investigated.', quality: 'good',
                note: 'If the model has been trained on manipulated labels, every automated decision it makes is suspect. The suspension cost — manual review overhead — is far less than the cost of continuing to rely on a compromised model.' },
              { id: 'b', label: 'Keep the model running but flag all low-confidence decisions for manual review while the investigation proceeds.', quality: 'partial',
                note: 'Low-confidence flagging assumes the confidence scores are meaningful. If the labels were manipulated, the model\'s confidence calibration is also suspect — a high-confidence fraudulent transaction may be exactly what the manipulation was designed to produce.' },
              { id: 'c', label: 'Wait for the technical briefing before making any operational changes — you need the full picture first.', quality: 'poor',
                note: 'The full picture will take days. In the meantime, the model is making automated fraud decisions based on training data that may be comprehensively corrupted. Waiting for certainty is the wrong instinct here.' },
            ],
          },
          branches: { a: 'n2_suspended', b: 'n2_partial', c: 'n2_wait' },
        },

        n2_suspended: {
          scene:       'office-meeting',
          caption:     'Model suspended. The technical investigation is underway. Manual review has a backlog within four hours.',
          sub_caption: 'The data science team confirms: label manipulation across 847 training records over eleven weeks.',
          decision: {
            prompt: 'The scale of the manipulation is confirmed. What is your next decision?',
            choices: [
              { id: 'a', label: 'Retrain the model on verified pre-manipulation data, implement label access controls, and notify the board before reinstating automated decisions.', quality: 'good',
                note: 'The three parts are all required. Retraining on clean data restores the model. Access controls prevent recurrence. Board notification is appropriate given the scale and the financial impact.' },
              { id: 'b', label: 'Retrain the model on verified data and reinstate automated decisions once retraining is complete — board notification can follow.', quality: 'partial',
                note: 'Retraining is correct. But 847 manipulated records over eleven weeks, with a 40% increase in confirmed fraud losses, is a board-level event. Notifying after reinstatement rather than before puts the board in the position of learning about a resolved incident rather than exercising oversight.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_partial: {
          scene:       'desk-review',
          caption:     'The technical investigation confirms manipulation. The model\'s high-confidence decisions are the ones most affected — the manipulation was designed to produce them.',
          sub_caption: 'Low-confidence flagging was the wrong filter. The compromised decisions were the high-confidence ones.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },

        n2_wait: {
          scene:       'desk-waiting',
          caption:     'The technical briefing takes two days. In that time, the model makes 1,400 automated decisions.',
          sub_caption: 'Investigation confirms the manipulation targets high-value transactions specifically.',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Model suspended. Pipeline secured. Board informed.',
          tone:     'good',
          result:   'Automated decisions are suspended within the hour. The investigation identifies 847 manipulated labels across eleven weeks. Retraining on verified pre-manipulation data restores model integrity. Label write access is restricted to three accounts with audit logging. The board is briefed before reinstatement. The incident triggers a regulatory disclosure review. The response is assessed as prompt and controlled.',
          learning: 'A fraud model with a two-year precision high and 40% rising losses is not performing well — it has been trained to fail in a specific, deliberate way. Suspending automated decisions when a model\'s training data integrity is in question is not excessive caution: it is the correct response to operating a compromised system. The board notification before reinstatement matters — oversight requires information before decisions are made, not after.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Model eventually secured. Losses continued during investigation.',
          tone:     'warn',
          result:   'The model is eventually retrained on clean data and reinstated safely. But the partial measure — low-confidence flagging while the investigation ran — allowed the model\'s compromised high-confidence decisions to continue processing. The manipulation was specifically designed to produce high-confidence outputs. The losses during the investigation period are attributable to the decision not to suspend.',
          learning: 'When a model\'s training data is suspected of manipulation, its confidence scores are also suspect — the manipulation may have been designed to produce artificially high confidence on targeted decisions. Partial mitigation measures that assume confidence score validity do not protect against a sophisticated attack.',
          score:    42,
        },
        outcome_bad: {
          heading:  'Two days of compromised decisions while waiting.',
          tone:     'bad',
          result:   'The 1,400 automated decisions made during the two-day wait include a disproportionate number of high-value fraud cases that were incorrectly approved. The investigation confirms the manipulation targeted exactly these decisions. The board is informed of both the original breach and the decision to continue operating the model during investigation. The regulatory review asks why automated decisions were not suspended when data integrity was in question.',
          learning: 'Waiting for a complete technical picture before suspending a compromised automated decision system means making operational decisions on behalf of a model you believe may have been manipulated. The cost of suspension — backlog — is recoverable. The cost of 1,400 compromised decisions is not.',
          score:    5,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'office-meeting',
          caption:     'The security review flagged the broad write access eight months ago. You added it to the backlog. It was deprioritised twice.',
          sub_caption: 'Two of the twelve accounts were used to manipulate 847 training labels.',
          decision: {
            prompt: 'The CRO asks why the access control recommendation was not implemented. What is your account?',
            choices: [
              { id: 'a', label: 'The risk was flagged, I owned the backlog, and I deprioritised it twice. That was the wrong call and I should have escalated it when it was pushed back the second time.', quality: 'good',
                note: 'Accurate and accountable. A security finding on write access to a production ML training pipeline is not a routine backlog item to be traded against feature work. The second deprioritisation should have triggered an escalation, not an acceptance.' },
              { id: 'b', label: 'The security team flagged it but did not classify it as critical — the backlog prioritisation reflected that assessment.', quality: 'partial',
                note: 'If the security team\'s classification influenced the prioritisation, that context matters. But you owned the platform and the pipeline — the accountability for a known gap in write access controls on production training data sits with the platform lead.' },
              { id: 'c', label: 'Twelve accounts with write access is within normal parameters for a team of our size — the security review was overly conservative.', quality: 'poor',
                note: 'The design specification called for three accounts. The security review flagged twelve as a gap against the design intent. Retroactively characterising the recommendation as overly conservative does not explain why the gap was left open.' },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_classify', c: 'n2_normal' },
        },

        n2_own: {
          scene:       'office-bright',
          caption:     'The CRO accepts the account. She wants the access controls implemented before the model is retrained.',
          sub_caption: 'You also need to establish whether other ML pipelines have the same issue.',
          decision: {
            prompt: 'You audit the other ML pipelines. Three have similar broad write access to labelling systems. What do you propose?',
            choices: [
              { id: 'a', label: 'Restrict all three to minimum-required accounts with audit logging before any of them process a training run — include this in the retraining readiness criteria.', quality: 'good',
                note: 'The fraud model incident is not an isolated configuration error — it is a pattern. Addressing all three before the next training run treats the systemic issue rather than just the incident that surfaced it.' },
              { id: 'b', label: 'Prioritise the fraud model fix first, schedule the other three pipelines for the next sprint.', quality: 'partial',
                note: 'Getting the fraud model fixed is urgent. But if the other three pipelines are already being used for training runs, the next sprint may be too slow. The fix for a known write access gap on a production training pipeline should not wait for a sprint cycle.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_one_pipeline' },
        },

        n2_classify: {
          scene:       'office-meeting',
          caption:     'The CRO asks to see the security review classification and the deprioritisation decisions.',
          sub_caption: 'The review classified the finding as medium severity. You deprioritised a medium-severity gap in write access to a production training pipeline twice.',
          decision: {
            prompt: 'The classification made the deprioritisation look reasonable at the time. Does it hold up now?',
            choices: [
              { id: 'a', label: 'The medium classification was reasonable at the time, but write access to a production ML pipeline should have been treated as higher regardless — I should have pushed back on the severity rating.', quality: 'partial',
                note: 'Honest and reflective. The classification influenced the prioritisation but platform leads are expected to apply domain judgement. Write access to training data for a production fraud model warranted more scrutiny than a medium backlog item.' },
              { id: 'b', label: 'Medium severity findings get deprioritised regularly — this was a process failure, not a judgement failure.', quality: 'poor',
                note: 'Process failures and judgement failures are not mutually exclusive. The question is whether a platform lead with domain knowledge should have recognised that a medium-severity write access gap on a production ML training pipeline warranted escalation.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_normal: {
          scene:       'office-briefing-urgent',
          caption:     'The CRO pulls the design specification. Three accounts — that was the design intent. Twelve was the gap.',
          sub_caption: '"This was not a conservative recommendation. The design called for three. Why did you have twelve?"',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },

        n3_one_pipeline: {
          scene:       'desk-working',
          caption:     'The fraud model fix is implemented. Six weeks later, a second model shows an anomalous performance pattern.',
          sub_caption: 'One of the three other pipelines with broad write access has been used for a training run in the interim.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Root cause owned. All pipelines secured.',
          tone:     'good',
          result:   'Write access on all four affected pipelines is restricted and audit-logged before the next training run. The retraining readiness criteria for the fraud model include access control sign-off. The post-incident review notes the platform lead owned the gap clearly and led a systemic remediation rather than a point fix. A new classification standard is introduced: write access to production ML training pipelines is always treated as high-severity regardless of the security team\'s initial rating.',
          learning: 'A known access control gap in a production ML training pipeline is not a medium-priority backlog item — it is a direct path to model integrity failure. When a platform lead knows about a gap and deprioritises it twice, the second deprioritisation is the point at which escalation to the CRO is required. The cost of escalation is a difficult conversation. The cost of not escalating is an eleven-week poisoning campaign.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Primary pipeline fixed. Second incident from remaining gap.',
          tone:     'warn',
          result:   'The fraud model pipeline is secured and the model retrained cleanly. But the decision to schedule the other three pipelines for the next sprint left a window that was used. The second incident is smaller in scale but demonstrates that the point fix, rather than the systemic fix, left risk on the table.',
          learning: 'When an incident exposes a pattern — broad write access across multiple ML pipelines — the response should address the pattern, not just the incident. Scheduling the systemic fix for the next sprint while known vulnerabilities remain active is not a workable interim position.',
          score:    42,
        },
        outcome_bad: {
          heading:  'Gap defended. Credibility lost.',
          tone:     'bad',
          result:   'The attempts to characterise the access gap as within normal parameters, or to attribute the deprioritisation entirely to process, did not hold up against the design specification or the incident record. The CRO has lost confidence in the platform lead\'s risk judgement. The remediation is assigned to the security team. The post-incident review recommends that ML platform leads complete adversarial ML security training before managing production pipelines.',
          learning: 'Defending a known gap after an incident that the gap enabled is not a viable position. The question is not whether the gap was within normal parameters — it was documented as a deviation from design intent. The question is why a platform lead with that knowledge deprioritised it twice without escalating.',
          score:    5,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'Fraud model precision at a two-year high. Confirmed fraud losses up 40% year-on-year. These two numbers are not compatible.',
          sub_caption: 'You are the first person to connect them. The model did not get better. Something is wrong with the training data.',
          decision: {
            prompt: 'You have a hypothesis. What do you do before escalating?',
            choices: [
              { id: 'a', label: 'Check whether the precision improvement correlates with specific label batches — narrow the anomaly to something concrete before escalating.', quality: 'good',
                note: 'One analytical step before escalation is justified here because it changes what you are escalating. A vague "precision and losses don\'t match" is hard to act on. "Precision improvement correlates with label batches from these three weeks" is actionable. Keep it short — 30 minutes maximum, then escalate regardless.' },
              { id: 'b', label: 'Escalate the anomaly to the model risk committee immediately with the two numbers — let them investigate.', quality: 'partial',
                note: 'Escalating quickly is correct. But the two numbers alone may not be enough for the committee to know where to start. A single analytical step that narrows the hypothesis makes the escalation more actionable without meaningfully delaying it.' },
              { id: 'c', label: 'Run a full audit of the training data pipeline before escalating — you want to bring the complete picture.', quality: 'poor',
                note: 'A full pipeline audit could take days. If data poisoning is ongoing, the model continues retraining on manipulated labels in the meantime. Escalate with a narrowed hypothesis, not a complete investigation.' },
            ],
          },
          branches: { a: 'n2_targeted', b: 'n2_immediate', c: 'n2_full_audit' },
        },

        n2_targeted: {
          scene:       'desk-working',
          caption:     'In 25 minutes you find it: precision improvement tracks label changes in the fraud-confirmed bucket — specifically, transactions above $8,000 being relabelled as legitimate across 11 weeks of training batches.',
          sub_caption: 'This is not drift. This is deliberate.',
          decision: {
            prompt: 'You have a targeted finding that points to deliberate label manipulation. How do you escalate?',
            choices: [
              { id: 'a', label: 'Escalate directly to the CRO and the model risk committee simultaneously — this is a security incident, not a model performance issue.', quality: 'good',
                note: 'Deliberate label manipulation of a production fraud model is a security incident with financial crime implications. It needs the CRO and security, not just the model risk committee. The escalation path matters — the wrong path delays the right response.' },
              { id: 'b', label: 'Escalate to the model risk committee — they own the fraud model and can decide whether to involve the CRO.', quality: 'partial',
                note: 'The model risk committee is a reasonable first step, but deliberate data manipulation is beyond their usual remit. The CRO needs to be informed simultaneously — not via a committee decision about whether to escalate further.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_committee_only' },
        },

        n2_immediate: {
          scene:       'office-briefing',
          caption:     'The model risk committee receives your escalation. They ask for a more specific hypothesis before suspending the model.',
          sub_caption: 'The targeted analysis you skipped would have given them what they need now.',
          decision: {
            prompt: 'The committee needs a narrower finding before acting. What do you do?',
            choices: [
              { id: 'a', label: 'Run the targeted label correlation analysis now and bring the result back within 30 minutes.', quality: 'partial',
                note: 'Correct recovery. The 30-minute delay is acceptable given the alternative. The escalation was right — the additional analysis step just happens after rather than before.' },
              { id: 'b', label: 'Push the committee to act on the anomaly alone — the two numbers are enough to suspend the model.', quality: 'partial',
                note: 'The two numbers are suggestive but the committee is asking a reasonable question. Pushing without providing the analysis they need is less effective than providing it.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_warn' },
        },

        n2_full_audit: {
          scene:       'desk-focused',
          caption:     'Your full audit takes two days. The investigation finds 847 manipulated labels. The model has retrained twice more in the interim.',
          sub_caption: 'Two additional training runs on manipulated data have deepened the corruption.',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },

        n3_committee_only: {
          scene:       'office-meeting',
          caption:     'The model risk committee escalates to the CRO 90 minutes later. The CRO asks why she was not notified directly when the finding pointed to deliberate manipulation.',
          sub_caption: 'The committee agrees the escalation path should have been parallel, not sequential.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Targeted finding. Correct escalation path. Model suspended.',
          tone:     'good',
          result:   'Your 25-minute targeted analysis gives the CRO and model risk committee a specific, actionable finding: 847 labels, $8,000+ transactions, eleven weeks. The model is suspended within two hours of your escalation. The CRO later notes that the combination of a targeted hypothesis and the correct dual escalation path — security incident to the CRO, not just a model performance issue to the committee — is what enabled a fast response.',
          learning: 'The distinction between a model performance anomaly and a security incident changes the escalation path entirely. Precision drift goes to the model risk committee. Deliberate label manipulation goes to the CRO and the committee simultaneously. A 25-minute targeted analysis is worth doing before escalating if it narrows a vague anomaly to a specific, actionable finding — but the analysis window should be short and fixed, not open-ended.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Anomaly escalated. Delay in targeted finding or escalation path.',
          tone:     'warn',
          result:   'The anomaly is escalated and the investigation reaches the right conclusion. But either the immediate escalation without a targeted finding required a 30-minute return trip for more analysis, or the sequential escalation via the committee added 90 minutes before the CRO was involved. The model is suspended, but the path there was longer than it needed to be.',
          learning: 'In model integrity investigations, the escalation path and the preparation before escalation are both optimisable. A brief targeted analysis before escalating makes the escalation more actionable. And a finding that points to deliberate manipulation — rather than drift — should reach the CRO directly, not via a committee relay.',
          score:    42,
        },
        outcome_bad: {
          heading:  'Two additional training runs on corrupted data.',
          tone:     'bad',
          result:   'The two-day full audit meant the model retrained twice on manipulated labels before the investigation concluded. The manipulation is now more deeply embedded. The post-incident review asks why the anomaly — surfaced on day one — did not trigger an immediate escalation while the investigation ran in parallel.',
          learning: 'A complete investigation and an immediate escalation are not mutually exclusive. When you have an anomaly that suggests data integrity failure in a production fraud model, escalate what you have — today, with your current hypothesis — and continue the investigation in parallel. The cost of a preliminary escalation that turns out to be wrong is a false alarm. The cost of waiting is two more training runs on poisoned data.',
          score:    5,
        },
      },
    },

  },

  controls_summary: [
    {
      id: 'c1', label: 'Restricted write access to training data pipelines',
      effort: 'Low', owner: 'Security', go_live: true,
      context: 'The control that was identified and not implemented. A security review eight months before the incident flagged that twelve accounts had write access to the label confirmation system when three was the design intent. Restricting to minimum-required accounts with audit logging would have made the manipulation campaign significantly harder to execute and easier to detect.',
    },
    {
      id: 'c2', label: 'Training data integrity verification before each retraining run',
      effort: 'Medium', owner: 'Technology', go_live: true,
      context: 'Cryptographic hashing of training datasets before each weekly retraining run would have detected the label modifications without requiring human review. A hash mismatch halts training and alerts the model owner — the manipulation would have been caught at the first corrupted training run rather than eleven weeks later.',
    },
    {
      id: 'c3', label: 'Statistical anomaly detection on label distributions',
      effort: 'Medium', owner: 'Technology', go_live: true,
      context: 'Monitoring the distribution of fraud labels — particularly in high-value transaction bands — between training runs would have detected the systematic relabelling of $8,000+ transactions as legitimate. The signal was present in the data for eleven weeks before the loss figures surfaced it through a different channel.',
    },
    {
      id: 'c4', label: 'Model performance monitoring against independent ground truth',
      effort: 'Medium', owner: 'Technology', go_live: false,
      context: 'Comparing model predictions against a held-out set of independently verified labels — not drawn from the retraining pipeline — would have detected the divergence between model precision and actual fraud rates earlier. The manipulation worked in part because precision was measured against the same label set being manipulated.',
    },
  ],
};
