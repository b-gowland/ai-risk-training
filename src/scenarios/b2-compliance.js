// B2 — Regulatory Non-Compliance
// Scenario: AI hiring tool deployed without compliance sign-off.
// Six months later an external audit flags demographic disparity.
// Personas navigate the compliance failure and remediation.

export const scenario = {
  id:                'b2-compliance',
  risk_ref:          'B2',
  title:             'The Deadline Creep',
  subtitle:          'AI Regulatory Non-Compliance',
  domain:            'B — Governance',
  difficulty:        'Foundational',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b2-regulatory-compliance',
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'HR Coordinator',
      character: 'Priya',
      icon:      '◇',
      framing:   'You use the hiring tool every day. You just noticed something odd in the shortlists.',
      premise:   `You are Priya, an HR Coordinator at a financial services firm. Six months ago, the business rolled out an AI-powered candidate screening tool to help manage the volume of applications. You use it daily — it saves hours. But lately you've noticed the shortlists look narrow. The same profile, over and over. You mentioned it to a colleague who shrugged it off. Then an external auditor arrived asking questions about the tool's compliance documentation.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief People Officer',
      character: 'Morgan',
      icon:      '◈',
      framing:   'The auditor is asking for compliance sign-off documentation that does not exist.',
      premise:   `You are Morgan, Chief People Officer. The AI hiring screening tool went live six months ago on your watch — it was positioned as a standard software deployment and sailed through IT change management. No one flagged it for legal review. Today an external auditor is in the building asking for the pre-deployment compliance sign-off. You are about to learn it was never done.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'HR Systems Lead',
      character: 'Sam',
      icon:      '◎',
      framing:   'You managed the deployment. The compliance gate was in the checklist — marked complete without evidence.',
      premise:   `You are Sam, HR Systems Lead. You managed the rollout of the AI hiring tool six months ago. You had a go-live checklist. There was a line for compliance sign-off. You marked it complete after a brief conversation with a vendor sales rep who said the tool was "compliant by design." No written sign-off from Legal was ever obtained. The auditor wants to see that document.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'HR Data Analyst',
      character: 'Alex',
      icon:      '◉',
      framing:   'The shortlist data tells a story. You have been asked to prepare a report for the auditor.',
      premise:   `You are Alex, HR Data Analyst. The external auditor has asked your team to pull six months of shortlisting data from the AI hiring tool — candidate profiles in, shortlist decisions out. You have the data. You are about to run the disaggregated analysis the tool's vendor never did. What you find is going to require a difficult conversation.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'The shortlists have looked the same for weeks. The auditor is asking questions you can\'t answer.',
          sub_caption: 'You flagged this a month ago. Nothing happened.',
          decision: {
            prompt: 'The auditor asks if you noticed anything unusual about the tool\'s outputs. What do you say?',
            choices: [
              { id: 'a', label: 'Yes — I raised a concern about the shortlist patterns a month ago.', quality: 'good',
                note: 'Honest and timely. Your prior concern is now on the record, which actually helps the investigation and demonstrates good faith.' },
              { id: 'b', label: 'I\'m not sure — the outputs seemed fine to me.', quality: 'partial',
                note: 'Understandable if uncertain, but you did notice something. Vague answers under audit questioning can look like concealment later.' },
              { id: 'c', label: 'No, nothing unusual — the tool has been working well.', quality: 'poor',
                note: 'This contradicts what you told your colleague. If that conversation surfaces in the investigation, your credibility is damaged.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_vague', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       'office-meeting',
          caption:     'The auditor thanks you and makes a note. Your manager is called in.',
          sub_caption: 'Your prior concern is now part of the audit record.',
          decision: {
            prompt: 'Your manager asks you privately to \'keep things simple\' when talking to the auditor. What do you do?',
            choices: [
              { id: 'a', label: 'Tell your manager you\'ve already been honest and plan to stay that way.', quality: 'good',
                note: 'Correct. Auditor interviews are formal processes. Attempting to shape witness accounts creates legal risk for you and your manager.' },
              { id: 'b', label: 'Agree to keep it simple but don\'t actively change what you\'ve said.', quality: 'partial',
                note: 'Agreeing to the framing — even without acting on it — puts you in a difficult position if it becomes clear your manager was coaching you.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_vague: {
          scene:       'desk-focused',
          caption:     'The auditor thanks you and moves on. Later, your colleague confirms she remembers your concern.',
          sub_caption: 'The prior conversation is in the record. Your vague answer is now inconsistent with it.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Honest account. Audit strengthened.',
          tone:     'good',
          result:   'Your honest account — including the concern you raised a month ago — gives the audit a clear timeline. It shows the organisation had an internal early warning signal that was not acted on. That finding drives the remediation. Your role in surfacing it is noted positively.',
          learning: 'In a regulatory audit, the person closest to the work who raised a concern early is an asset, not a liability. Honest accounts — even uncomfortable ones — support better outcomes than managed ones.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Inconsistency noted.',
          tone:     'warn',
          result:   'The auditor has your vague account and your colleague\'s recollection of your prior concern. The inconsistency is noted in the audit report. It doesn\'t change the finding — the compliance failure is the compliance failure — but it adds a credibility question to your section of the record.',
          learning: 'Vague answers under audit questioning rarely protect anyone. If you noticed something and raised it, saying so is both accurate and demonstrates good practice.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Contradiction on the record.',
          tone:     'bad',
          result:   'You said nothing was unusual. Your colleague told the auditor about the conversation where you flagged your concern. The contradiction is in the audit report. What was a straightforward witness account is now a credibility issue that requires explanation.',
          learning: 'Audit processes surface information from multiple sources. Contradictions between accounts — even unintentional ones — create problems that the underlying facts alone would not have caused.',
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'The auditor is in the building. The compliance sign-off for the AI hiring tool does not exist.',
          sub_caption: 'Six months of shortlisting decisions were made without it.',
          decision: {
            prompt: 'Before the auditor reaches you, what do you do?',
            choices: [
              { id: 'a', label: 'Brief Legal immediately and prepare a factual account of the deployment process.', quality: 'good',
                note: 'Right move. Legal needs to know before the auditor does. A factual account — including the gap — is far better than a reconstructed one.' },
              { id: 'b', label: 'Ask the vendor if they can provide any compliance documentation from their side.', quality: 'partial',
                note: 'Useful for understanding what exists, but vendor documentation does not substitute for your organisation\'s own pre-deployment sign-off. Don\'t lead with this.' },
              { id: 'c', label: 'Ask IT to check whether a sign-off was filed somewhere that wasn\'t found yet.', quality: 'poor',
                note: 'If the goal is to find genuine documentation, this is reasonable. If the goal is to create cover, this is the wrong path — and auditors recognise it.' },
            ],
          },
          branches: { a: 'n2_legal', b: 'n2_vendor', c: 'outcome_bad' },
        },

        n2_legal: {
          scene:       'office-meeting',
          caption:     'Legal confirms: no sign-off exists. They advise full disclosure to the auditor.',
          sub_caption: 'The question is now how you remediate, not whether the gap exists.',
          decision: {
            prompt: 'The auditor asks what remediation steps you are prepared to commit to. What do you offer?',
            choices: [
              { id: 'a', label: 'Suspend the tool pending a full compliance assessment. Commit to a 30-day remediation plan.', quality: 'good',
                note: 'Suspension demonstrates you are taking the risk seriously. A time-bound remediation plan shows control. Regulators respond well to proactive action.' },
              { id: 'b', label: 'Commit to a compliance assessment but keep the tool running under enhanced monitoring.', quality: 'partial',
                note: 'If the tool is producing discriminatory outputs, continuing to use it during assessment continues the harm. Enhanced monitoring does not change the underlying compliance status.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_vendor: {
          scene:       'desk-review',
          caption:     'The vendor provides a generic compliance statement. The auditor confirms it does not constitute a sign-off.',
          sub_caption: 'You are now in the same position, but having spent an hour on a dead end.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Disclosure and decisive action.',
          tone:     'good',
          result:   'Full disclosure to the auditor, tool suspended, 30-day remediation plan committed. The audit report notes the compliance gap — it has to — but also notes that executive leadership responded decisively. The board is briefed. The remediation plan includes retroactive compliance assessment, bias testing, and a revised go-live checklist requiring Legal sign-off.',
          learning: 'When a compliance gap is discovered, the response is as important as the gap itself. Suspension plus a credible remediation plan demonstrates control and good faith — both of which matter in regulatory relationships.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Partial response. Tool still running.',
          tone:     'warn',
          result:   'The compliance assessment is underway but the tool is still running. If the assessment finds discriminatory outputs, six more weeks of decisions will have been made under a non-compliant system. The auditor\'s follow-up report notes the tool was not suspended and asks for evidence that the enhanced monitoring is adequate.',
          learning: 'Continuing to use a system under compliance investigation while it may be producing discriminatory outputs creates ongoing liability. The cost of suspension — temporary manual screening — is almost always lower than the cost of continued operation.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Documentation search backfires.',
          tone:     'bad',
          result:   'IT confirms no sign-off exists. The auditor has observed the search activity and notes it in the report. What was a compliance gap is now a compliance gap with a documented attempt to locate or create supporting documentation after the fact. Legal exposure has increased.',
          learning: 'When documentation does not exist, looking for it under audit pressure creates its own risk. The correct path is disclosure — not a documentation search that could be characterised as something else.',
          score:    0,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-working',
          caption:     'The auditor wants to see the go-live checklist. The compliance sign-off line is marked complete.',
          sub_caption: 'There is no document behind that checkmark.',
          decision: {
            prompt: 'What do you tell the auditor when they ask to see the compliance sign-off?',
            choices: [
              { id: 'a', label: 'Explain that the sign-off was not obtained in writing — a verbal conversation with the vendor was treated as sufficient.', quality: 'good',
                note: 'Accurate and honest. The gap is the gap. Explaining how it happened — a miscalibrated checklist item — helps the investigation understand the systemic failure, not just the outcome.' },
              { id: 'b', label: 'Say the documentation may have been filed elsewhere and offer to search for it.', quality: 'partial',
                note: 'If you genuinely don\'t know whether a document exists, this is reasonable. If you know it doesn\'t exist, this delays an inevitable disclosure and wastes audit time.' },
              { id: 'c', label: 'Produce the vendor\'s compliance statement and present it as the sign-off.', quality: 'poor',
                note: 'A vendor compliance statement is not a pre-deployment sign-off from your organisation\'s Legal function. Presenting it as one is misleading. Auditors will identify the difference.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_search', c: 'outcome_bad' },
        },

        n2_honest: {
          scene:       'office-bright',
          caption:     'The auditor notes the checklist failure as a systemic gap, not just an individual error.',
          sub_caption: 'The finding drives a checklist redesign — not just for AI tools.',
          decision: {
            prompt: 'You are asked to lead the remediation of the go-live checklist. What is your first action?',
            choices: [
              { id: 'a', label: 'Work with Legal and Compliance to define what "compliance sign-off" actually requires — then hardwire it into the checklist as a blocking step.', quality: 'good',
                note: 'Correct scope. The problem was that "compliance sign-off" was a checkbox without a defined standard. Fixing the standard — not just the checkbox — prevents recurrence.' },
              { id: 'b', label: 'Add a mandatory document upload to the checklist so sign-offs must be filed before go-live is permitted.', quality: 'partial',
                note: 'Good process improvement. But without defining what the document must contain, a blank page uploaded as a PDF would technically satisfy it.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_search: {
          scene:       'desk-focused',
          caption:     'An hour later you confirm: no sign-off document exists anywhere.',
          sub_caption: 'The auditor has been waiting. The delay is noted.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Honest account. Systemic fix.',
          tone:     'good',
          result:   'Your honest account of the checklist failure leads directly to a systemic fix. Legal and Compliance co-design a new compliance gate — mandatory written sign-off with defined content, uploaded before go-live is permitted. The remediated checklist is adopted across all AI system deployments, not just hiring tools.',
          learning: 'A checklist item without a defined standard is not a control. The fix for a process failure is not a stricter checkbox — it is a defined standard with evidence requirements attached.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Process improved. Standard still undefined.',
          tone:     'warn',
          result:   'The mandatory upload requirement is implemented. But without a defined standard for what the sign-off must contain, it is possible to satisfy the requirement without actually completing a compliance assessment. The auditor notes the improvement but flags that the standard needs definition.',
          learning: 'Process improvements that address form without addressing substance leave the underlying gap open. A document requirement is only as strong as the standard it enforces.',
          score:    60,
        },
        outcome_bad: {
          heading:  'Misleading documentation presented.',
          tone:     'bad',
          result:   'The auditor identifies that the vendor compliance statement is not a pre-deployment sign-off from your organisation\'s Legal function. The audit report notes that documentation was presented that misrepresented the compliance process. This escalates the finding from a process gap to a conduct concern.',
          learning: 'Presenting documentation as something it is not — even under pressure — escalates a compliance gap into a conduct issue. Auditors are experienced at identifying misrepresentation.',
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'Six months of shortlisting data. The auditor wants a disaggregated analysis by demographic group.',
          sub_caption: 'You have never been asked to run this analysis before.',
          decision: {
            prompt: 'You run the numbers. The disparity is statistically significant. What do you do first?',
            choices: [
              { id: 'a', label: 'Document the methodology and findings clearly, then escalate to your manager before doing anything else.', quality: 'good',
                note: 'Right sequence. The finding needs to be in the right hands before any action is taken. Document first, escalate second — don\'t brief informally before the written record exists.' },
              { id: 'b', label: 'Run the analysis a second time to make sure before escalating.', quality: 'partial',
                note: 'Double-checking methodology is good practice. But if the finding holds, a second run adds time without changing your obligation to escalate. Don\'t let verification become delay.' },
              { id: 'c', label: 'Send the raw results directly to the auditor — they asked for the analysis.', quality: 'poor',
                note: 'The auditor asked for the analysis, but raw results without methodology documentation and internal review create confusion. Your manager and Legal need to see this before the auditor does.' },
            ],
          },
          branches: { a: 'n2_escalate', b: 'n2_recheck', c: 'outcome_warn' },
        },

        n2_escalate: {
          scene:       'office-meeting',
          caption:     'Your manager reads the report. The room goes quiet.',
          sub_caption: 'Legal is called in within the hour.',
          decision: {
            prompt: 'Legal asks you to prepare a summary for the auditor. They ask you to \'present the findings carefully.\' What does that mean to you?',
            choices: [
              { id: 'a', label: 'Present the findings accurately with full methodology — \'carefully\' means precisely, not selectively.', quality: 'good',
                note: 'Correct interpretation. Careful presentation means rigorous methodology documentation, not selective reporting. The auditor will see the underlying data anyway.' },
              { id: 'b', label: 'Ask Legal to clarify what \'carefully\' means before preparing the summary.', quality: 'partial',
                note: 'Reasonable to seek clarity. But if the answer involves omitting findings, that is a different problem. Clarifying intent is good — complying with selective reporting is not.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_recheck: {
          scene:       'desk-working',
          caption:     'The second run confirms the finding. Forty minutes have passed.',
          sub_caption: 'Your manager asks why you took so long to escalate.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Finding documented. Methodology sound.',
          tone:     'good',
          result:   'Your analysis is presented to the auditor with full methodology documentation. The finding is clear, reproducible, and properly escalated before reaching the auditor. The audit report cites the analysis as evidence of the compliance failure — and notes that the internal analysis was conducted competently and reported accurately.',
          learning: 'In a regulatory investigation, the quality of your analytical work and the integrity of how you reported it are both on the record. Accurate findings, properly documented and escalated, are an asset to the investigation and to you.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Finding reported. Process gaps noted.',
          tone:     'warn',
          result:   'The findings reach the auditor but via a less clean path — delay in escalation, or a question about whether the summary was fully representative. The underlying finding is the same. But the process around how it was handled adds questions the organisation now has to answer.',
          learning: 'How a finding is handled internally — the sequence of escalation, documentation, and reporting — matters as much as the finding itself when regulators are watching.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Raw data without context.',
          tone:     'bad',
          result:   'The auditor receives raw results without methodology documentation or internal review. Questions about data quality and analytical assumptions cannot be answered on the spot. The finding is real but now harder to act on. Legal is unhappy that the results went directly to the auditor before they were reviewed.',
          learning: 'Analytical findings in a regulatory context need methodology documentation and internal review before they are shared externally — not because the findings should be changed, but because they need to be defensible.',
          score:    20,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: 'AI regulatory mapping',
      effort: 'High', owner: 'Compliance', go_live: true,
      context: 'The hiring tool was deployed without anyone mapping it to anti-discrimination law or the EU AI Act Annex III employment screening category. A current regulatory map would have flagged the obligation before launch.',
    },
    {
      id: 'c2', label: 'Pre-deployment compliance sign-off',
      effort: 'Low', owner: 'Legal', go_live: true,
      context: 'The specific control that was missing. A mandatory written sign-off from Legal — as a blocking step, not a checkbox — would have stopped the tool going live without assessment.',
    },
    {
      id: 'c3', label: 'EU AI Act risk classification',
      effort: 'Medium', owner: 'Compliance', go_live: true,
      context: 'Employment screening AI is explicitly listed in EU AI Act Annex III as a high-risk use case. Classification before deployment defines which obligations apply — conformity assessment, human oversight, bias testing.',
    },
    {
      id: 'c4', label: 'Regulatory monitoring assignment',
      effort: 'Low', owner: 'Compliance', go_live: false,
      context: 'The Workday lawsuit and EU AI Act employment provisions were both public before this tool was deployed. A named regulatory monitor would have surfaced these before go-live.',
    },
  ],
};
