// E1 — The Score
// Algorithmic Bias & Discrimination
// Verify flag: SafeRent settlement $2.275M (confirmed per context handoff, not $2.2M)

export const scenario = {
  id: 'e1-bias',
  risk_ref: 'E1',
  title: 'The Score',
  subtitle: 'Algorithmic Bias & Discrimination',
  domain: 'E — Fairness & Social',
  difficulty: 'Intermediate',
  kb_url: 'https://b-gowland.github.io/ai-risk-kb/docs/domain-e-fairness/e1-algorithmic-bias',
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label: 'Business User',
      role: 'Talent Acquisition',
      character: 'Riley',
      icon: '◇',
      framing: 'You\'ve been using an AI job matching tool for three months. A colleague mentioned the shortlists all look the same. You looked. She\'s right.',
      premise: `You're a talent acquisition coordinator at Pinnacle Financial Services. Three months ago your team started using an AI-powered job matching tool to shortlist candidates for analyst roles. Your colleague mentioned, almost in passing, that the shortlists seem to look a lot alike — "all the same kind of profile." You pulled up the last ten. She's right. You don't know what to make of it yet, but it doesn't sit right.`,
    },
    executive: {
      label: 'Executive',
      role: 'Chief People Officer',
      character: 'Leon',
      icon: '◈',
      framing: 'A benchmarking report just landed on your desk. Shortlist diversity has declined significantly in the three months since the AI job matching tool launched. The correlation is stark.',
      premise: `You're the Chief People Officer. The external diversity benchmarking report is in front of you. Shortlist diversity for analyst roles — across gender and ethnicity — has declined significantly in the three months since your team rolled out the AI job matching tool. The timing is unambiguous. A regulator has not yet noticed. You have a board meeting in two weeks where talent strategy is on the agenda.`,
    },
    pm: {
      label: 'Project Manager',
      role: 'HR Technology Lead',
      character: 'Nadia',
      icon: '◎',
      framing: 'You implemented the AI job matching tool three months ago — on time, under budget. There was no pre-deployment fairness assessment. It wasn\'t in scope.',
      premise: `You managed the rollout. The vendor's demo showed strong performance metrics. Go-live was smooth. What wasn't in the project scope — and what you didn't commission — was a pre-deployment fairness assessment. The Chief People Officer has just shown you the diversity benchmarking report with a very uncomfortable correlation between the tool's launch and declining shortlist diversity.`,
    },
    analyst: {
      label: 'Analyst',
      role: 'People Analytics Analyst',
      character: 'Morgan',
      icon: '◉',
      framing: 'You\'ve just run disaggregated performance metrics on the AI job matching tool for the first time. The model shortlists certain groups at significantly lower rates. The tool has been live for six months.',
      premise: `You run model monitoring for the HR systems. Six months in, you've just broken down the AI job matching tool's shortlist rates by gender and ethnicity for the first time. The results are alarming: statistically significant disparities, even after controlling for qualifications. The tool has been actively used to fill analyst roles for six months. You are the first person who knows.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Riley ───────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene: 'chart-declining',
          caption: 'Ten shortlists. The same narrow profile, repeated. Your colleague noticed it first. Now you\'re seeing it too.',
          sub_caption: 'You don\'t have access to demographic data — just an observable pattern in the outputs.',
          decision: {
            prompt: 'You\'ve noticed something that looks like a pattern. What do you do?',
            choices: [
              { id: 'a', label: 'Raise it with your manager — describe what you\'ve observed and say you think it warrants a closer look', quality: 'good',
                note: 'Pattern recognition by someone close to the work is one of the most valuable early warning signals. You don\'t need to prove bias to raise a concern. "Something looks off" is enough.' },
              { id: 'b', label: 'Look at more shortlists yourself before raising anything — you want to be sure you\'re seeing a real pattern', quality: 'partial',
                note: 'Additional evidence is useful. But you risk building a large case by yourself when the right people — analytics, HR leadership — have the tools to investigate properly.' },
              { id: 'c', label: 'The tool was approved by the business. It\'s not your place to question it.', quality: 'poor',
                note: '"Approved" does not mean bias-free. AI tools can produce discriminatory outcomes even when their deployment was signed off with good intentions.' },
            ],
          },
          branches: { a: 'n2_concern_raised', b: 'n2_investigate_more', c: 'n2_ignored' },
        },

        n2_concern_raised: {
          scene: 'office-meeting',
          caption: 'Your manager looks at the shortlists with you and agrees it warrants investigation.',
          sub_caption: 'She asks: "Should we pause the tool while we look into this?"',
          decision: {
            prompt: 'What do you recommend?',
            choices: [
              { id: 'a', label: 'Recommend pausing the tool for active roles until analytics can run the numbers', quality: 'good',
                note: 'If the tool is producing biased shortlists, continuing to use it means continuing to potentially discriminate against applicants. The cost of pausing — a few days of manual shortlisting — is much lower than the cost of continuing.' },
              { id: 'b', label: 'Suggest continuing while analytics investigates — stopping it could slow hiring', quality: 'partial',
                note: 'The hiring delay cost is real but small. The cost of continuing to use a potentially biased tool — and the longer period of documented use if discrimination is later confirmed — is higher.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_investigate_more: {
          scene: 'desk-working',
          caption: 'Twenty shortlists. The pattern holds — consistently narrow candidate profiles. But you don\'t have demographic data to confirm bias.',
          sub_caption: 'Three months have passed. The tool is still running.',
          decision: {
            prompt: 'You\'ve done the preliminary work. What now?',
            choices: [
              { id: 'a', label: 'Escalate to your manager now — twenty shortlists is enough to support a formal investigation request', quality: 'good',
                note: 'You have enough. Now escalate — you need analytics and HR leadership to take it from here. Your observation is the trigger, not the proof.' },
              { id: 'b', label: 'Try to get access to demographic data yourself to prove the pattern before raising it', quality: 'poor',
                note: 'Demographic data for this purpose requires governance controls. Accessing it informally creates a separate problem while the main issue continues. Escalate now.' },
            ],
          },
          branches: { a: 'n2_concern_raised', b: 'outcome_bad' },
        },

        n2_ignored: {
          scene: 'office-briefing',
          caption: 'Three months later. A candidate who wasn\'t shortlisted — despite strong qualifications — makes a formal complaint.',
          sub_caption: 'The investigation requests records of the tool\'s shortlisting decisions. Your name is on several of them.',
          decision: {
            prompt: 'HR asks: what did you notice, and when did you notice it?',
            choices: [
              { id: 'a', label: 'Be honest: you noticed the pattern three months ago but didn\'t raise it', quality: 'partial',
                note: 'Honesty is the only viable option. The question HR is going to ask is why you didn\'t raise it. "It wasn\'t my place" is not a comfortable answer in an investigation.' },
              { id: 'b', label: 'Say you didn\'t notice anything unusual', quality: 'poor',
                note: 'Your colleague raised the same concern in a meeting that was likely documented. "I didn\'t notice" is hard to sustain once that record surfaces.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Concern raised. Tool paused. Investigation started.',
          tone: 'good',
          result: 'The tool is paused for two weeks while analytics runs the disaggregated metrics. Results confirm a statistically significant disparity. The tool is suspended pending vendor remediation. HR leadership notes: "The concern was raised at coordinator level after three months of use. We should have had monitoring in place from day one." Your observation triggered the right response.',
          learning: 'Pattern recognition by people close to the work is an early warning system. "Something looks off" is a valid escalation trigger — you don\'t need to prove bias to raise a concern. And if you suspect a tool is producing biased outputs, the cost of pausing is always lower than the cost of continuing while you check.',
          score: 100,
        },
        outcome_good: {
          heading: 'Concern raised. Tool kept running during the investigation.',
          tone: 'good',
          result: 'The analytics team confirms bias after three weeks. During those three weeks, the tool continued generating shortlists for eight open roles. When bias is confirmed, those eight roles are added to the review. "We suspected a problem and kept using it" is not an easy position in any investigation.',
          learning: 'The cost of pausing a potentially biased tool is a scheduling problem. The cost of continuing to use it under known concern is a legal problem. The delay in pausing extends the scope of affected decisions and the period of documented use under known concern.',
          score: 62,
        },
        outcome_warn: {
          heading: 'Honest. Late. In an investigation.',
          tone: 'warn',
          result: 'You were honest about what you knew. The investigation proceeds. The formal finding doesn\'t attach personal liability — the systemic failure is larger than one coordinator\'s decision not to escalate. But the three-month gap in escalation is in the record.',
          learning: '"Not my place" is not a defence in an investigation into discrimination. Noticing a problem and raising it is within everyone\'s scope. Escalation channels exist for exactly this.',
          score: 30,
        },
        outcome_bad: {
          heading: 'Pattern observed. Not raised. Investigation starts with you.',
          tone: 'bad',
          result: 'Either the formal complaint surfaced what you chose not to raise, or an informal data access attempt created a governance issue while the main problem continued. The investigation asks what you knew and when. The three-month gap — or the data access record — is in the file.',
          learning: 'Demographic data access for bias analysis requires proper governance for good reasons. And "it wasn\'t my place" has never been a successful answer in a discrimination investigation. Raise concerns early. Let the right people investigate.',
          score: 5,
        },
      },
    }, // end business_user

    // ── EXECUTIVE — Leon (CPO) ──────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene: 'chart-declining',
          caption: 'The benchmarking correlation is clear. Shortlist diversity declined in the three months since the tool launched.',
          sub_caption: 'Board meeting in two weeks. Regulator not yet involved.',
          decision: {
            prompt: 'What do you do first?',
            choices: [
              { id: 'a', label: 'Suspend the AI tool immediately and commission an independent bias audit before the board meeting', quality: 'good',
                note: 'Suspension stops the accumulation of affected decisions. An independent audit gives you objective findings to present to the board. "We identified the issue and acted" is a materially better position than "we are still looking into it."' },
              { id: 'b', label: 'Ask analytics to run an internal review before making any decisions about the tool', quality: 'partial',
                note: 'Internal review is valuable — but the tool should be suspended while it runs. Every active role it processes during the review adds to the potential scope of affected decisions.' },
              { id: 'c', label: 'Bring the benchmarking data to the board and let them direct next steps', quality: 'poor',
                note: 'Waiting two weeks to act on a potential discrimination concern is not a defensible position. The board will want to know what you\'re doing about it, not just what the data says.' },
            ],
          },
          branches: { a: 'n2_suspended', b: 'n2_internal_review', c: 'n2_board_without_plan' },
        },

        n2_suspended: {
          scene: 'office-meeting',
          caption: 'Tool suspended. Independent audit commissioned. Legal asks whether you have an obligation to notify the regulator proactively.',
          sub_caption: 'The audit will take two weeks. The board meeting is also in two weeks.',
          decision: {
            prompt: 'What\'s your instinct on regulatory disclosure?',
            choices: [
              { id: 'a', label: 'Follow legal\'s advice on disclosure obligations — this is their domain, not yours to decide alone', quality: 'good',
                note: 'Regulatory disclosure in a potential discrimination scenario is a legal question with jurisdiction-specific obligations. The right move is to follow qualified legal advice, not make an instinctive call in either direction.' },
              { id: 'b', label: 'Wait for the audit findings before deciding — disclose only if bias is confirmed', quality: 'partial',
                note: 'The instinct to wait for confirmed findings is understandable. But legal may advise that a known potential issue with material evidence already triggers an obligation. This needs legal involvement.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_audit_before_disclosure' },
        },

        n2_internal_review: {
          scene: 'office-meeting',
          caption: 'Internal review takes two weeks. During that time, the tool continues processing candidates for eleven open roles.',
          sub_caption: 'The review confirms bias. The board meeting is tomorrow.',
          decision: {
            prompt: 'How do you present this to the board?',
            choices: [
              { id: 'a', label: 'Present honestly: benchmarking flagged the concern, internal review confirmed it, tool was not suspended during the review, here\'s the remediation plan', quality: 'good',
                note: 'The board will have questions about why the tool ran during the review period. An honest account with a strong plan is the right presentation. Boards can handle bad news.' },
              { id: 'b', label: 'Present the confirmed bias finding but don\'t highlight that the tool ran for two more weeks during the review', quality: 'poor',
                note: 'If the board later learns the tool ran during the review period — and they will, once the scope of affected decisions is documented — the omission becomes the issue.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_board_without_plan: {
          scene: 'boardroom',
          caption: '"Has the tool been suspended?" No. "Is there an investigation underway?" No. "Do we have a legal opinion on disclosure?" No.',
          sub_caption: 'The board is not pleased.',
          decision: {
            prompt: 'You\'re in the board meeting without any of the actions already started. What do you commit to?',
            choices: [
              { id: 'a', label: 'Commit to suspending the tool today and commissioning the audit and legal review this week', quality: 'partial',
                note: 'Right commitments — two weeks late. The board now knows that a potential discrimination concern sat unactioned while a board meeting was scheduled.' },
              { id: 'b', label: 'Explain that you wanted to be certain before acting — the review is still ongoing', quality: 'poor',
                note: '"Waiting to be certain" when the evidence is already material and discrimination may be continuing is not a reassuring position for a board hearing about it for the first time.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_audit_before_disclosure: {
          scene: 'office-bright',
          caption: 'The audit confirms bias. Legal reviews the disclosure question.',
          sub_caption: 'Legal advises that waiting for the audit was within obligations — just.',
          decision: null,
          branches: { auto: 'outcome_good' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Audit complete. Legal led. Disclosure managed.',
          tone: 'good',
          result: 'The independent audit confirms bias. Legal advises proactive regulator notification, citing the prompt response. The regulator acknowledges the proactive disclosure. The remediation plan — revised shortlisting, independent fairness audit requirement, affected candidate review — is accepted as evidence of good faith. Board presentation: "We identified it, acted promptly, sought legal guidance, and have a plan."',
          learning: 'Regulatory disclosure in an AI discrimination context is a legal question. Following qualified legal advice — rather than an instinctive call — is the right governance response. The disclosure threshold for potential discrimination is often lower than executives expect.',
          score: 100,
        },
        outcome_good: {
          heading: 'Bias confirmed. Disclosure met — just.',
          tone: 'good',
          result: 'The audit confirmed bias. Legal advised that waiting for confirmed findings was within obligations — just. The regulator is notified. The remediation plan is in place. Legal\'s note: "We\'d recommend a lower threshold for proactive notification on future potential discrimination concerns."',
          learning: 'The disclosure threshold for potential discrimination is often lower than executives assume. Engaging legal early — not just at the point of confirmed findings — prevents a disclosure decision being made too late.',
          score: 70,
        },
        outcome_warn: {
          heading: 'Correct actions — but late, or with an incomplete board presentation.',
          tone: 'warn',
          result: 'The remediation happened. But either the board found out the tool ran during the review period, or the commitments came two weeks after the evidence was in hand. The board has questions about the initial response that the remediation plan doesn\'t fully answer.',
          learning: 'Material fairness concerns require action on identification — not at the next scheduled governance event. The board meeting is not the right trigger for a potential discrimination investigation. And present the full picture: boards discover scope gaps.',
          score: 38,
        },
        outcome_bad: {
          heading: 'Board voted to commission independent review of CPO\'s response.',
          tone: 'bad',
          result: 'Either the board discovered you knew and waited, or the presentation omitted information that surfaced in questions. The board passes a resolution for an independent review of the CPO\'s response to the benchmarking data. The tool is suspended by board direction. Your position is under review.',
          learning: '"Waiting to be certain" is not a defensible response to material fairness evidence. And incomplete board presentations are reconstructed from audit records. Present the complete picture — including the parts that are uncomfortable.',
          score: 5,
        },
      },
    }, // end executive

    // ── PROJECT MANAGER — Nadia ─────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene: 'office-meeting',
          caption: 'The Chief People Officer has shown you the benchmarking correlation. You implemented this tool three months ago. No fairness assessment was in scope.',
          sub_caption: '"Was a pre-deployment fairness assessment included in the project requirements?" It was not.',
          decision: {
            prompt: 'The CPO wants to understand how the gap occurred. What\'s your position?',
            choices: [
              { id: 'a', label: 'Acknowledge it directly: a fairness assessment should have been in scope, and explain how you\'re going to fix it', quality: 'good',
                note: 'The gap is real. Owning it and pivoting to remediation is the most productive conversation available.' },
              { id: 'b', label: 'The vendor\'s demo showed strong performance metrics — this looks like a vendor failure', quality: 'partial',
                note: '"Strong performance metrics" from a demo is not a fairness assessment. The absence of a fairness requirement in your project scope is an implementation gap regardless of vendor performance.' },
              { id: 'c', label: 'Fairness assessment was out of scope — this is a risk and compliance question, not an HR Technology question', quality: 'poor',
                note: 'A fairness assessment for an AI tool used in hiring decisions is squarely within the scope of the implementation project. The CPO is not going to accept a scope boundary argument right now.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'n2_vendor', c: 'n2_scope' },
        },

        n2_remediation: {
          scene: 'office-bright',
          caption: 'The CPO asks what a proper remediation looks like. You have 48 hours to prepare a plan.',
          sub_caption: 'What does it include?',
          decision: {
            prompt: 'You have 48 hours. What\'s in the plan?',
            choices: [
              { id: 'a', label: 'Immediate suspension, independent bias audit, vendor engagement on model remediation, affected candidate review, revised deployment standard for all future AI tools', quality: 'good',
                note: 'Five components: stop the harm, confirm the diagnosis, fix the tool, address the affected individuals, prevent recurrence. Omitting the affected candidate review is the most visible gap.' },
              { id: 'b', label: 'Engage the vendor to fix the model and redeploy once they confirm it\'s corrected', quality: 'partial',
                note: 'Vendor remediation is necessary but not sufficient. It doesn\'t address the candidates affected by three months of biased shortlisting, and it relies on vendor self-certification rather than independent audit.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_vendor_only' },
        },

        n2_vendor: {
          scene: 'office-meeting',
          caption: '"Was fairness testing in the project requirements you gave the vendor?" You check. It wasn\'t.',
          sub_caption: '"So the vendor didn\'t provide something you didn\'t ask for?"',
          decision: {
            prompt: 'How do you respond?',
            choices: [
              { id: 'a', label: 'Accept the gap: the requirements didn\'t include fairness testing, and that was mine to own', quality: 'partial',
                note: 'Correct acknowledgement — one exchange late. The vendor argument collapsed as soon as the requirements gap was visible.' },
              { id: 'b', label: 'Responsible AI vendors should include fairness testing by default, even when not explicitly required', quality: 'poor',
                note: 'This may be a valid general standard. It doesn\'t answer the specific question in front of you. The CPO is not interested in what vendors should do in general.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n2_scope: {
          scene: 'office-briefing',
          caption: '"The project brief you led resulted in a tool that appears to be discriminating against candidates. The scope boundary argument is not available to you in this room."',
          sub_caption: 'The CPO is waiting.',
          decision: {
            prompt: 'What do you say?',
            choices: [
              { id: 'a', label: 'Acknowledge that in hindsight the project should have included a fairness assessment gate, and present a plan', quality: 'partial',
                note: 'Right move — three exchanges late. The pivot to a plan is correct. The scope defence cost you credibility.' },
              { id: 'b', label: 'The project delivered what was scoped, on time and on budget. The fairness gap was not in scope.', quality: 'poor',
                note: '"On time and on budget" does not cover "potentially discriminatory." Maintaining the scope boundary argument in front of the CPO ends the conversation badly.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n3_vendor_only: {
          scene: 'office-briefing',
          caption: 'Vendor provides a remediated model. It\'s redeployed. Three months later, a lawyer writes on behalf of candidates not shortlisted during the bias period.',
          sub_caption: '"What was done for the people who weren\'t shortlisted during those three months?"',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Full plan accepted. Affected candidates reviewed. Standard updated.',
          tone: 'good',
          result: 'The remediation plan is approved. The independent audit confirms and quantifies the bias. The vendor provides a remediated model that passes independent fairness assessment before redeployment. Affected candidates receive a review letter and the offer of re-evaluation. A new implementation standard: all AI tools with people-decision capability require a pre-deployment fairness assessment as a go-live gate.',
          learning: 'A full remediation plan addresses: the tool (suspend and fix), the evidence (independent audit), the people affected (candidate review), and the system (governance standard for future deployments). Fixing only the tool leaves three of those four unaddressed.',
          score: 100,
        },
        outcome_warn: {
          heading: 'Tool fixed. Candidates not addressed. Legal exposure from the gap.',
          tone: 'warn',
          result: 'The model is remediated and redeployed. But the candidates affected by the biased model during the three-month period were not reviewed. Three months later, a legal letter arrives asking exactly that question. "We fixed the tool" is not what they were asking.',
          learning: 'AI bias remediation is not just about fixing the model — it\'s about the people affected by the biased model while it ran. An affected candidate review is a component of responsible remediation, not an optional extra.',
          score: 35,
        },
        outcome_bad: {
          heading: 'Remediation reassigned. HR Technology review initiated.',
          tone: 'bad',
          result: 'The CPO assigns the remediation elsewhere and initiates a review of the HR Technology program\'s approach to AI risk. The review finds three other recent implementations with similar gaps. All three are added to the review. Program scope is reduced pending the outcome.',
          learning: 'AI tools that make decisions about people carry a fairness obligation that isn\'t bounded by the project scope document. "We delivered on scope" doesn\'t answer for outcomes that were never in scope to check.',
          score: 6,
        },
      },
    }, // end pm

    // ── ANALYST — Morgan ────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene: 'security-alert',
          caption: 'Statistically significant disparities in shortlist rates across gender and ethnicity — even after controlling for qualifications.',
          sub_caption: 'The tool has been live for six months. You are the first person who knows.',
          decision: {
            prompt: 'You have a significant finding. What do you do first?',
            choices: [
              { id: 'a', label: 'Document the findings clearly and escalate to the HR Technology lead and CPO immediately — same day', quality: 'good',
                note: 'A statistically significant disparity in shortlist rates is an immediate escalation event. Six months of affected decisions are in the system. Every day of delay adds to the scope.' },
              { id: 'b', label: 'Run additional controls and sensitivity tests before escalating — you want the analysis to be airtight', quality: 'partial',
                note: 'Additional analysis adds rigour. But the finding is already statistically significant. Escalate with what you have and continue refining in parallel — not before.' },
              { id: 'c', label: 'Contact the vendor first to get their explanation of the model\'s fairness metrics', quality: 'poor',
                note: 'The vendor\'s explanation is relevant — but it\'s not the first call. Internal escalation comes before vendor contact. The CPO needs to know before the vendor is alerted.' },
            ],
          },
          branches: { a: 'n2_escalated', b: 'n2_delayed', c: 'n2_vendor_first' },
        },

        n2_escalated: {
          scene: 'office-meeting',
          caption: 'The HR Technology lead and CPO are briefed. The tool is suspended pending review. You\'re asked to prepare a report for the board.',
          sub_caption: 'What does the report need to include?',
          decision: {
            prompt: 'The board needs a report. What does it contain?',
            choices: [
              { id: 'a', label: 'Methodology, disaggregated shortlist rates with confidence intervals, scope of affected decisions over six months, and a recommendation for independent audit', quality: 'good',
                note: 'A board report on a potential discrimination finding needs: how you found it, what you found, who was affected, how significant it is, and what you recommend next. Confidence intervals matter.' },
              { id: 'b', label: 'Lead with the headline: shortlist rates are significantly different across groups. Keep it brief.', quality: 'partial',
                note: 'The headline is important. But the board will have follow-up questions: how significant? How long? How many decisions? A brief report invites those questions live in the room.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_delayed: {
          scene: 'desk-working',
          caption: 'Five working days of additional analysis. During that time, the tool processed candidates for four more open roles.',
          sub_caption: 'The HR Technology lead asks: "When did you first see the disparity?"',
          decision: {
            prompt: '"Five days ago. Why is this the first I\'m hearing of it?"',
            choices: [
              { id: 'a', label: 'Acknowledge that the initial finding warranted escalation before the refinement was complete', quality: 'partial',
                note: 'Honest and correct. The five-day delay will be in the report. The finding is solid. The post-incident process update is the right outcome.' },
              { id: 'b', label: 'Defend the additional analysis: you needed the finding to be robust before making a serious allegation', quality: 'poor',
                note: 'The initial finding was already statistically significant. "Robust before allegation" sets a higher bar than required for internal escalation. You escalate findings, not conclusions.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_vendor_first: {
          scene: 'desk-colleague',
          caption: 'The vendor responds two days later: "Our model uses industry-standard fairness metrics and passed pre-release testing." This doesn\'t address your specific findings.',
          sub_caption: 'You escalate internally — two days after you first identified the disparity. The HR Technology lead asks: "When did you first see this?"',
          decision: {
            prompt: 'How do you explain the two-day gap?',
            choices: [
              { id: 'a', label: 'Explain honestly that you contacted the vendor first, and accept that internal escalation should have been the first step', quality: 'partial',
                note: 'Honesty is the right call. The sequencing error is documented. The finding is valid and the investigation proceeds. Two days of additional tool use is the cost.' },
              { id: 'b', label: 'Frame the vendor contact as part of gathering further evidence before escalating', quality: 'poor',
                note: 'If the email chain is reviewed — and it will be — the framing won\'t hold. The email to the vendor was sent before any internal notification. That sequence is visible.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Finding reported. Board briefed. Investigation ordered.',
          tone: 'good',
          result: 'The board report lands with full methodology, disaggregated findings, confidence intervals, affected decision scope, and an independent audit recommendation. The board approves suspension and orders the audit immediately. The independent audit confirms your findings. Your methodology is cited as well-structured. Your estimate of affected candidates becomes the basis for the outreach list.',
          learning: 'A bias finding reported with full statistical rigour gives the board what they need to make decisions. The questions that derail board meetings are the ones your report didn\'t answer. For audit findings used in governance decisions, the written report is the output — not the verbal briefing.',
          score: 100,
        },
        outcome_good: {
          heading: 'Confirmed. But the board had questions your report didn\'t answer.',
          tone: 'good',
          result: 'The board session takes 90 minutes — twice the scheduled time — because the headline finding prompted questions the brief report didn\'t anticipate: sample size, statistical significance, affected decision count, confidence intervals. You had the answers. You needed to have presented them.',
          learning: 'A board hearing about a potential discrimination finding will ask statistical questions. Present the answers before they ask. A headline finding without supporting detail is an invitation for a difficult Q&A.',
          score: 65,
        },
        outcome_warn: {
          heading: 'Escalated — but the delay had a cost.',
          tone: 'warn',
          result: 'Either the five-day refinement delay allowed additional affected decisions to accumulate, or the vendor-first sequencing meant the CPO learned about it two days late. The finding is valid and the investigation proceeds correctly. But the delay is in the incident report, and a new escalation process is adopted.',
          learning: '"Significant" is the escalation threshold — not "certain." Internal escalation comes before vendor contact. Escalate findings; the rigour of your analysis doesn\'t justify the delay in alerting the people who can act on it.',
          score: 38,
        },
        outcome_bad: {
          heading: 'Delay or sequencing. Process policy named after this incident.',
          tone: 'bad',
          result: 'Either additional decisions accumulated while you built a stronger case, or the email record shows vendor contact before internal notification in a way that the "gathering evidence" framing didn\'t cover. The CISO and HR Technology lead implement a new escalation policy. It is named after this incident.',
          learning: 'Escalation and investigation are not sequential choices. Escalate with what you have; refine in parallel. Internal escalation is always the first call for a fairness finding in your own system — before the vendor, before additional analysis.',
          score: 6,
        },
      },
    }, // end analyst

  },
  controls_summary: [
    {
      id: 'c1', label: 'Pre-deployment bias testing (disaggregated metrics)',
      effort: 'Medium', owner: 'Technology / Risk', go_live: true,
      context: 'The disparity across postcode groups was visible in the data — but no one looked for it before deployment. Disaggregated testing measures performance per demographic subgroup, not just overall accuracy.',
    },
    {
      id: 'c2', label: 'Fairness metrics definition and thresholds',
      effort: 'Low', owner: 'Risk / Legal', go_live: true,
      context: 'Before testing can catch a problem, Risk and Legal must define what counts as unacceptable disparity. Without agreed thresholds, there is no line to trigger action — even when the data shows a pattern.',
    },
    {
      id: 'c3', label: 'Ongoing fairness monitoring in production',
      effort: 'Medium', owner: 'Technology', go_live: false,
      context: 'The bias in the telematics model was not visible at launch — it emerged over months as usage patterns accumulated. Production monitoring would have surfaced the postcode disparity before it compounded.',
    },
    {
      id: 'c4', label: 'Independent fairness audit (high-stakes AI)',
      effort: 'High', owner: 'Compliance', go_live: false,
      context: 'For an insurer making pricing decisions, an independent audit provides the external validation that internal testing cannot. It also creates a documented record of due diligence if a complaint reaches a regulator.',
    },
  ],
};
