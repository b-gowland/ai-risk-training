// D1 — Training Data Quality & Representativeness
// Scenario: "The Blind Spot"
// An insurer's AI claims triage model is six months in production.
// A fairness audit reveals it approves metropolitan claims significantly
// faster than identical claims from regional and rural areas.
// Each persona navigates the data quality failure from their position.

export const scenario = {
  id:                'd1-data-quality',
  risk_ref:          'D1',
  title:             'The Blind Spot',
  subtitle:          'Training Data Quality & Representativeness',
  domain:            'D — Data',
  difficulty:        'Intermediate',
  kb_url:            'https://library.airiskpractice.org/docs/domain-d-data/d1-training-data-quality',
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Claims Assessor',
      character: 'Jordan',
      icon:      '◇',
      framing:   'You process claims the AI flags for manual review. Regional claims keep landing on your desk.',
      premise:   `You are Jordan, a Claims Assessor at a general insurer. Six months ago the business launched an AI triage model that routes claims — straightforward ones get fast-tracked automatically, complex or borderline cases come to you for manual review. You've noticed a pattern: almost everything landing on your desk comes from regional or rural postcodes. Metropolitan claims seem to sail through. A colleague from the fairness team has just sent a message asking if you can spare 20 minutes to talk about what you've been seeing.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief Claims Officer',
      character: 'Renata',
      icon:      '◈',
      framing:   'The fairness audit result is on your desk. Regional policyholders are being systematically disadvantaged.',
      premise:   `You are Renata, Chief Claims Officer. The AI claims triage model was your initiative — it reduced average settlement time by 34% and was held up as a digital transformation success. This morning the internal fairness team presented their six-month audit: metropolitan policyholders receive automatic fast-track approval at nearly twice the rate of equivalent rural and regional claims. The model is not broken — it learned from five years of historical claims data that reflected historical assessor behaviour. That historical behaviour was the problem.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'AI Claims Project Lead',
      character: 'Dana',
      icon:      '◎',
      framing:   'You delivered this model. The data quality assessment was in the project plan — marked complete.',
      premise:   `You are Dana, AI Claims Project Lead. You delivered the triage model on time and under budget. There was a data quality assessment in the project plan — the data science team ran descriptive statistics on the training dataset and confirmed there were no missing values or data integrity issues. What the assessment did not do was examine subgroup representation: how rural and regional policyholders appeared in five years of historical data relative to their share of the current policyholder base. That gap is now the centre of an urgent remediation conversation.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Fairness & Model Risk Analyst',
      character: 'Sione',
      icon:      '◉',
      framing:   'Your audit found the gap. Now you have to explain what caused it and what fixes it.',
      premise:   `You are Sione, Fairness & Model Risk Analyst. Your six-month post-deployment audit has surfaced a significant representativeness problem in the AI claims triage model. Rural and regional policyholders make up 28% of the current book but represented only 11% of the historical training data — the company had lower regional market share five years ago. The model learned approval patterns from an era when the company's regional footprint was smaller. The audit is complete. Now you need to brief the remediation team.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-working',
          caption:     'Regional claims keep landing on your desk. The pattern has been building for months.',
          sub_caption: 'The fairness team wants to know what you\'ve seen.',
          decision: {
            prompt: 'The fairness analyst asks what you\'ve noticed about the claims being routed to manual review. What do you tell them?',
            choices: [
              { id: 'a', label: 'Share the pattern clearly — regional postcodes, similar claim types, but different routing outcomes.', quality: 'good',    note: 'Frontline observations are critical data for a fairness investigation. Describing the pattern specifically gives the analyst something concrete to test.' },
              { id: 'b', label: 'Mention it but downplay it — you assumed there was a legitimate reason for the routing difference.', quality: 'partial', note: 'Partial disclosure slows the investigation. The pattern you noticed is exactly what the analyst needs to hear — including your assumptions about it.' },
              { id: 'c', label: 'Stay quiet — raising concerns about the model feels above your pay grade.', quality: 'poor',    note: 'Frontline staff are often the first to see systematic model failures. Not escalating observed patterns delays detection and prolongs harm to policyholders.' },
            ],
          },
          branches: { a: 'n2_data', b: 'n2_data', c: 'outcome_silent' },
        },
        n2_data: {
          scene:       'desk-review',
          caption:     'The analyst pulls six months of your manual review cases. The postcode pattern is statistically clear.',
          decision: {
            prompt: 'The analyst asks if you noticed any cases where a regional claim and a metropolitan claim looked identical but got routed differently. What do you say?',
            choices: [
              { id: 'a', label: 'Yes — you can name two specific examples from the past month.', quality: 'good',    note: 'Specific examples let the analyst verify the pattern in the data and document concrete instances of differential treatment for the remediation record.' },
              { id: 'b', label: 'Probably, but you didn\'t keep records — you just processed what came through.', quality: 'partial', note: 'Reasonable — keeping records wasn\'t your job. But flagging that this pattern felt systematic is still useful even without specifics.' },
              { id: 'c', label: 'You can\'t be sure — maybe regional claims are genuinely more complex.', quality: 'poor',    note: 'Assuming the model\'s output reflects genuine complexity rather than a data artefact is the bias the audit is trying to surface. The analyst needs your observation, not a rationalisation of the model.' },
            ],
          },
          branches: { a: 'n3_outcome', b: 'n3_outcome', c: 'outcome_rationalise' },
        },
        n3_outcome: {
          scene:       'office-meeting-aftermath',
          caption:     'Your observations match the statistical finding. The fairness team includes your testimony in the audit report.',
          decision: null,
          branches: { auto: 'outcome_great' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Frontline Insight Confirmed',
          tone:     'good',
          result:   'Your observations provided direct evidence linking the statistical finding to real-world claim routing. The audit report cites your testimony alongside the postcode analysis. The remediation team now has both quantitative and qualitative evidence of the problem — and a clearer picture of which claim types were most affected.',
          learning: 'Frontline staff often detect model failures before analytics teams do. Systematic observation of routing patterns — even informal — is a legitimate and valuable input to fairness audits.',
          score:    100,
        },
        outcome_rationalise: {
          heading:  'Pattern Missed',
          tone:     'warn',
          result:   'By attributing the routing difference to genuine claim complexity rather than a data artefact, your testimony didn\'t help the audit find the pattern faster. The statistical analysis still found it, but without your corroboration it took longer to rule out legitimate explanations. The remediation is the same — just slower.',
          learning: 'When an AI model produces unexpected patterns, the first question should be whether the pattern reflects genuine differences in the input data or an artefact of how the model was trained. Frontline staff are well-placed to distinguish these — but only if they report what they see rather than what they assume.',
          score:    55,
        },
        outcome_silent: {
          heading:  'Six More Months',
          tone:     'bad',
          result:   'Without frontline corroboration, the audit relied entirely on statistical analysis, which took longer to achieve confidence. Regional policyholders experienced differential treatment for an additional quarter while the investigation was completed. The remediation outcome is the same, but the duration of harm was extended.',
          learning: 'Systematic model failures often appear first at the frontline — as patterns in workload, in the types of cases escalated, or in informal conversations between colleagues. Organisations need to make it easy for frontline staff to surface these observations without feeling it is above their role to do so.',
          score:    20,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'The audit finding is confirmed. The model is disadvantaging regional policyholders at scale.',
          sub_caption: 'The question now is what you do with it.',
          decision: {
            prompt: 'The fairness team recommends suspending automatic fast-track for regional claims while retraining is underway. This adds 2–3 weeks to average settlement time for 28% of claimants. What do you decide?',
            choices: [
              { id: 'a', label: 'Suspend the fast-track for regional claims immediately — accept the delay, eliminate the differential.', quality: 'good',    note: 'Continuing to operate a model known to produce discriminatory outcomes after a confirmed finding creates regulatory and legal exposure. Suspension is the defensible position.' },
              { id: 'b', label: 'Keep the model running but add a manual review layer for all regional claims while retraining proceeds.', quality: 'partial', note: 'A workable interim position that eliminates the differential treatment without suspending service. Requires resourcing the manual review layer — this must be confirmed before this option is viable.' },
              { id: 'c', label: 'Continue operating and fast-track retraining — the model is still faster than manual processing overall.', quality: 'poor',    note: 'Operating a model you know is producing discriminatory outcomes, once the finding is confirmed, is difficult to defend to a regulator. Speed of retraining does not eliminate the interim harm.' },
            ],
          },
          branches: { a: 'n2_suspend', b: 'n2_interim', c: 'outcome_continue' },
        },
        n2_suspend: {
          scene:       'office-bright',
          caption:     'Regional fast-track suspended. All claims go to manual review while retraining is underway.',
          decision: {
            prompt: 'The board asks what systemic change will prevent this from recurring. What do you commit to?',
            choices: [
              { id: 'a', label: 'Mandatory subgroup representation analysis before any AI model goes live — with sign-off from Risk.', quality: 'good',    note: 'Making the gap in the data quality assessment a structural requirement — not a project-level decision — addresses the root cause and creates a repeatable control.' },
              { id: 'b', label: 'A post-deployment fairness review at three months for all AI models.', quality: 'partial', note: 'Post-deployment monitoring is necessary but insufficient on its own — it means harm occurs before it is detected. The root cause here was a pre-deployment data quality gap.' },
              { id: 'c', label: 'More thorough vendor due diligence on future model purchases.', quality: 'poor',    note: 'The model was built internally using internal historical data. Vendor due diligence does not address the root cause — the failure was in the organisation\'s own data quality assessment process.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_monitor', c: 'outcome_vendor' },
        },
        n2_interim: {
          scene:       'office-meeting',
          caption:     'Manual review layer added for regional claims. The differential is eliminated while retraining proceeds.',
          decision: {
            prompt: 'Two weeks in, the manual review team is at capacity and timelines are slipping. What do you prioritise?',
            choices: [
              { id: 'a', label: 'Authorise additional temporary resource for manual review — hold the control until retraining is complete.', quality: 'good',    note: 'The interim control must be adequately resourced to function. Under-resourcing it produces the same outcome as not having it.' },
              { id: 'b', label: 'Accelerate retraining at the cost of some data quality rigour — get the model back faster.', quality: 'poor',    note: 'Rushing the retraining to relieve pressure on the manual review team risks reproducing the original problem. The retraining must include the representativeness assessment that was missed the first time.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_rush' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Root Cause Addressed',
          tone:     'good',
          result:   'The suspension and mandatory subgroup analysis requirement addressed both the immediate harm and the systemic gap. The retrained model includes representative data for current regional policyholder volumes, and the data quality assessment gate is now a mandatory pre-deployment control for all AI models at the insurer.',
          learning: 'When a fairness audit confirms differential treatment, the response needs two components: stopping the harm immediately, and fixing the structural gap that allowed it to occur. Post-deployment monitoring alone treats symptoms; pre-deployment data quality assessment treats causes.',
          score:    100,
        },
        outcome_monitor: {
          heading:  'Monitoring Helps, But Doesn\'t Prevent',
          tone:     'warn',
          result:   'The suspension eliminated the immediate harm, and the three-month monitoring programme will detect future problems earlier. However, without a mandatory pre-deployment representativeness assessment, future models can still be deployed with similar data gaps — you\'ll catch them faster, but not before they cause harm.',
          learning: 'Post-deployment fairness monitoring is necessary but not sufficient. It means harm occurs before it is detected. The root cause here was a gap in pre-deployment data quality assessment — that gap needs to be closed structurally, not compensated for by faster detection after the fact.',
          score:    65,
        },
        outcome_vendor: {
          heading:  'Wrong Root Cause',
          tone:     'warn',
          result:   'The model was built internally on internal historical data. Improved vendor due diligence would not have prevented this. The board accepted the commitment, but the underlying data quality assessment gap remains — and will produce the same failure in the next internally-developed model.',
          learning: 'Diagnosing the wrong root cause produces remediation that does not prevent recurrence. This failure was caused by a gap in the organisation\'s own data quality assessment process — the absence of subgroup representation analysis before training. That gap must be addressed structurally.',
          score:    30,
        },
        outcome_continue: {
          heading:  'Known Risk, Continued Harm',
          tone:     'bad',
          result:   'Continuing to operate the model after a confirmed fairness finding, without an interim control, extended the period of differential treatment. When the regulator\'s market conduct review six months later reviewed the insurer\'s AI systems, the documented finding and the decision to continue operating were both on file. The remediation cost significantly exceeded what suspension would have cost.',
          learning: 'Operating an AI system known to produce discriminatory outcomes — after an internal finding confirms it — is a materially different risk position than operating a system where the problem is unknown. Documented awareness without action is regulatorily and legally indefensible.',
          score:    10,
        },
        outcome_rush: {
          heading:  'Retraining Under Pressure',
          tone:     'warn',
          result:   'The accelerated retraining relieved pressure on the manual review team, but the representativeness assessment was compressed and did not fully address the geographic gap. The retrained model performed better but still showed a modest disparity at the six-month check. A second remediation cycle was required.',
          learning: 'Retraining a model to fix a data quality problem requires the same rigour in data assessment as the original training — if not more. Pressure to restore automated processing speed should not compress the quality gate that exists to prevent the same problem recurring.',
          score:    40,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-review',
          caption:     'The data quality assessment you signed off is now central to the audit finding.',
          sub_caption: 'The assessment confirmed data integrity. It did not examine subgroup representation.',
          decision: {
            prompt: 'The audit team asks you to walk them through what the data quality assessment covered. What do you say?',
            choices: [
              { id: 'a', label: 'Be precise — the assessment covered completeness, missing values, and data integrity. Subgroup representation was not in scope.', quality: 'good',    note: 'Accurate description of what was and wasn\'t assessed is essential for a proper root cause analysis. Being precise about scope does not assign blame — it defines the gap.' },
              { id: 'b', label: 'Say the assessment was thorough — you don\'t want to flag the gap before you understand the implications.', quality: 'poor',    note: 'Misrepresenting the scope of the assessment obstructs the audit and delays finding the root cause. If the gap comes out later — and it will — the misrepresentation compounds the problem.' },
              { id: 'c', label: 'Acknowledge the gap immediately and note that subgroup analysis wasn\'t standard practice at the time.', quality: 'good',    note: 'Contextualising the gap accurately — it wasn\'t standard practice, not that it was deliberately omitted — helps the audit distinguish systemic from individual failure and design effective remediation.' },
            ],
          },
          branches: { a: 'n2_scope', b: 'outcome_obstruct', c: 'n2_scope' },
        },
        n2_scope: {
          scene:       'office-meeting-hearing',
          caption:     'The audit team now understands what the assessment covered. The root cause is a gap in methodology, not data integrity.',
          decision: {
            prompt: 'The remediation lead asks you to design a revised data quality assessment process for all future AI models. What does it include?',
            choices: [
              { id: 'a', label: 'Subgroup representation analysis comparing training data to deployment population — mandatory, with documented sign-off.', quality: 'good',    note: 'Mandatory subgroup analysis with documented sign-off is the specific control that would have caught this problem. Making it mandatory and documented prevents it being deprioritised under project pressure.' },
              { id: 'b', label: 'A broader checklist covering more data quality dimensions — representativeness as one item among many.', quality: 'partial', note: 'A broader checklist is an improvement, but representativeness should be elevated — not just one item among many. A comprehensive checklist with a critical item buried in it does not guarantee the critical item gets the attention it needs.' },
              { id: 'c', label: 'More thorough vendor data certification requirements for externally sourced data.', quality: 'poor',    note: 'This model was trained on internal historical data — vendor certification requirements would not have addressed the gap. The assessment process for internal data needs to be fixed.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_checklist', c: 'outcome_vendor' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Gap Closed at the Source',
          tone:     'good',
          result:   'The revised data quality assessment process makes subgroup representation analysis a mandatory, documented gate for all AI models — not an optional step that can be deprioritised. The remediation team used your design as the template for the updated AI development standard.',
          learning: 'A data quality assessment that does not examine subgroup representation is incomplete for any AI model used in decision-making about people. The fix is structural — making representativeness analysis mandatory and documented, not discretionary and undocumented.',
          score:    100,
        },
        outcome_checklist: {
          heading:  'Better Process, Same Weak Point',
          tone:     'warn',
          result:   'The expanded checklist is an improvement. But with representativeness as one item among many, future projects under time pressure may deprioritise it the same way it was deprioritised here. Critical quality gates need structural enforcement — mandatory sign-off, not just a checklist item.',
          learning: 'A checklist that includes an important item is not the same as a mandatory gate for that item. For requirements where failure produces regulatory and legal risk, the control mechanism needs to match the severity — a blocking sign-off, not a tickbox.',
          score:    55,
        },
        outcome_vendor: {
          heading:  'Wrong Fix',
          tone:     'bad',
          result:   'Vendor data certification requirements address externally sourced data. This model was trained on five years of the insurer\'s own historical claims data. The assessment process for internal data has not been changed. The next internally-trained model will go through the same gap.',
          learning: 'Root cause analysis must distinguish between the proximate cause (the specific gap) and the contributing factors (no mandatory representativeness assessment). Fixing something adjacent to the root cause does not prevent recurrence.',
          score:    20,
        },
        outcome_obstruct: {
          heading:  'Audit Obstructed',
          tone:     'bad',
          result:   'Describing the assessment as thorough when it had a material scope gap delayed the root cause analysis. When the full picture emerged — as it did — the misrepresentation was documented in the audit record. The remediation conversation shifted from process improvement to individual accountability.',
          learning: 'In a post-incident audit, accuracy about what was and wasn\'t done is more important than defensiveness about what could have been done differently. Root cause analysis requires accurate information — and misrepresentation, once discovered, becomes its own finding.',
          score:    10,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'Your audit is complete. Rural and regional policyholders are underrepresented in training data by 17 percentage points.',
          sub_caption: 'The remediation team wants your assessment of what needs to happen.',
          decision: {
            prompt: 'The remediation team asks: can the current model be recalibrated, or does it need to be retrained from scratch?',
            choices: [
              { id: 'a', label: 'Retrain on a representative dataset — recalibration adjusts outputs but doesn\'t fix the underlying representation gap.',           quality: 'good',    note: 'Post-hoc recalibration can adjust score thresholds but cannot teach the model patterns it never saw in training. A representativeness gap requires representative training data.' },
              { id: 'b', label: 'Recalibrate the approval thresholds for regional postcodes — it\'s faster and achieves similar outcomes.', quality: 'partial', note: 'Threshold adjustment is a legitimate short-term interim measure, but it is treating the symptom. The model still lacks exposure to regional claim patterns and will fail in ways threshold adjustment cannot anticipate.' },
              { id: 'c', label: 'Apply synthetic data augmentation to the existing model — generate representative regional samples.',                               quality: 'partial', note: 'Synthetic augmentation is a viable technique, but requires validation that the synthetic data faithfully represents real regional claim patterns — not just fills the numeric gap. This must be documented and tested.' },
            ],
          },
          branches: { a: 'n2_retrain', b: 'n2_threshold', c: 'n2_synthetic' },
        },
        n2_retrain: {
          scene:       'desk-focused',
          caption:     'Retraining recommended. The data team needs to source representative regional claims data.',
          decision: {
            prompt: 'The data team asks how to ensure the retrained model doesn\'t reproduce the same gap. What do you specify?',
            choices: [
              { id: 'a', label: 'A formal representativeness assessment comparing training data composition to the current policyholder book before training starts.',  quality: 'good',    note: 'Pre-training representativeness assessment is the control that was missing the first time. Specifying it formally — with documented sign-off — makes it a repeatable requirement, not a one-off.' },
              { id: 'b', label: 'A post-training bias test comparing approval rates by postcode band before deployment.', quality: 'partial', note: 'Post-training testing is necessary but catches the problem after the training investment is made. Pre-training assessment prevents training on unrepresentative data in the first place.' },
              { id: 'c', label: 'A third-party model audit before deployment — external eyes will catch what internal teams miss.', quality: 'partial', note: 'External audit adds rigour, but it still operates after training is complete. The most efficient fix is pre-training representativeness analysis — catching the gap before it is trained into the model.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_posttest', c: 'outcome_audit' },
        },
        n2_threshold: {
          scene:       'desk-working',
          caption:     'Threshold adjustment is a faster fix, but the underlying model hasn\'t changed.',
          decision: {
            prompt: 'The remediation team asks what monitoring you\'d put in place if they go with threshold adjustment rather than retraining.',
            choices: [
              { id: 'a', label: 'Monthly disaggregated performance reports by postcode band — with an automatic escalation trigger if the gap reopens.', quality: 'good',    note: 'If threshold adjustment is the chosen interim measure, intensive monitoring is the compensating control. Monthly disaggregated reporting with a defined escalation trigger makes the monitoring operational rather than aspirational.' },
              { id: 'b', label: 'The same quarterly cadence as the original monitoring schedule — the gap is now known, so normal cadence resumes.', quality: 'poor',    note: 'A quarterly cadence detected this problem after six months. With a known risk and an interim-only fix, monitoring should be more frequent — not reverted to the cadence that missed this problem.' },
            ],
          },
          branches: { a: 'outcome_interim', b: 'outcome_sparse' },
        },
        n2_synthetic: {
          scene:       'desk-review',
          caption:     'Synthetic augmentation is proposed. It needs validation before use.',
          decision: {
            prompt: 'The data science team asks what validation the synthetic data needs to pass before it\'s used for retraining.',
            choices: [
              { id: 'a', label: 'Statistical distribution testing — confirm synthetic regional claims match real regional claim distributions on key features.',    quality: 'good',    note: 'KS tests and chi-squared tests on key features confirm the synthetic data is a valid proxy for real data. This is the minimum validation standard — document it and retain results.' },
              { id: 'b', label: 'Visual inspection of a sample — experienced assessors can tell if the synthetic claims look realistic.', quality: 'poor',    note: 'Expert review is useful but not sufficient. Distributional differences in synthetic data that drive model failures are not always visually apparent. Statistical validation is required.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_visual' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Representativeness Built In',
          tone:     'good',
          result:   'Retraining on a representative dataset with a formal pre-training representativeness assessment closed the root cause. The retrained model shows no material difference in approval rates across geographic bands. The assessment process is now documented as a mandatory step in the AI model development standard.',
          learning: 'Training data quality failures require training data fixes. Recalibration adjusts outputs; retraining on representative data fixes the underlying model. Pre-training representativeness assessment — checking that training data matches the deployment population before training — is the control that prevents the problem from being trained in.',
          score:    100,
        },
        outcome_posttest: {
          heading:  'Testing After the Fact',
          tone:     'warn',
          result:   'Post-training bias testing will catch the problem if it recurs — but after the training investment is made, finding a representativeness gap means starting over. Pre-training assessment is more efficient and prevents the problem from being encoded in the first place.',
          learning: 'Post-training bias testing is a necessary safety net but not a substitute for pre-training data quality assessment. The most efficient place to address representativeness gaps is before training starts — not after the model is built.',
          score:    60,
        },
        outcome_audit: {
          heading:  'External Rigour, Late in the Process',
          tone:     'warn',
          result:   'External audit adds rigour, but it operates after the model is built. If the audit finds a representativeness problem, retraining is required — at additional cost and delay. Pre-training assessment catches the gap before the training investment is made.',
          learning: 'External audits are valuable for independent validation, but their value is highest when they can influence the process — ideally pre-training. Post-training audits that find data quality problems require the most expensive remediation: starting over.',
          score:    60,
        },
        outcome_interim: {
          heading:  'Managed Interim',
          tone:     'warn',
          result:   'The threshold adjustment eliminated the immediate disparity, and monthly monitoring with an escalation trigger makes the interim control operational. The remediation plan includes retraining within six months. This is a defensible short-term position — but interim controls have an expiry date.',
          learning: 'When an interim fix is chosen over root cause remediation, the compensating control — monitoring — must be proportionate to the known risk. Monthly disaggregated reporting with an escalation trigger is the minimum for a known fairness gap operating under an interim fix.',
          score:    65,
        },
        outcome_sparse: {
          heading:  'Gap Reopened',
          tone:     'bad',
          result:   'Quarterly monitoring at normal cadence was insufficient for an interim-only fix. Three months later the gap had widened again as claim mix shifted — the threshold had drifted out of calibration. The quarterly audit caught it, but not before it had been operating for twelve weeks.',
          learning: 'The monitoring cadence for a known interim fix must be calibrated to the risk — not the same as steady-state monitoring. A quarterly cadence that failed to detect the original problem in six months is not adequate monitoring for a known risk with an interim-only control.',
          score:    25,
        },
        outcome_visual: {
          heading:  'Synthetic Data Not Validated',
          tone:     'bad',
          result:   'The synthetic regional claims looked realistic to expert reviewers but had distributional differences on two key features that visual inspection missed. The retrained model performed better than the original but still showed a residual gap on those features. A third remediation cycle was required after statistical validation was eventually run.',
          learning: 'Synthetic data validation requires statistical testing — not expert visual review. Distributional differences that drive model failures are often subtle and not visually apparent. KS tests and chi-squared tests on all key features are the minimum standard before synthetic data is used in retraining.',
          score:    25,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1',
      label: 'Data profiling and quality assessment',
      effort: 'Medium',
      owner: 'Technology',
      go_live: true,
      context: 'The original assessment confirmed data integrity — no missing values, no corruption. It did not examine subgroup representation. A representativeness assessment would have flagged the geographic gap before training.',
    },
    {
      id: 'c2',
      label: 'Data lineage documentation',
      effort: 'Low',
      owner: 'Technology',
      go_live: true,
      context: 'The training dataset covered five years of historical claims data. Without lineage documentation, the team could not immediately determine when the company\'s regional market share had been lower — which explained why regional policyholders were underrepresented.',
    },
    {
      id: 'c3',
      label: 'Diverse and representative data sourcing',
      effort: 'Medium',
      owner: 'Technology',
      go_live: true,
      context: 'The company\'s current policyholder base is 28% regional. Its historical claims data reflected 11% regional — from when its regional footprint was smaller. Sourcing additional regional data or validating the representativeness gap before training was the missed control.',
    },
    {
      id: 'c4',
      label: 'Regular data refresh schedule',
      effort: 'Medium',
      owner: 'Technology',
      go_live: false,
      context: 'As the insurer\'s regional market share grew, the training data became increasingly unrepresentative. A data refresh schedule would have prompted reassessment of the training dataset as the deployment population evolved.',
    },
  ],
};
