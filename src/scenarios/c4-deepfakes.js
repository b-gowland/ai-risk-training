// C4 — The Fabricated Call
// Deepfakes & Synthetic Media Fraud
// Verified facts: Arup = finance worker (not engineer), $25M, January 2024

export const scenario = {
  id: 'c4-deepfakes',
  risk_ref: 'C4',
  title: 'The Fabricated Call',
  subtitle: 'Deepfakes & Synthetic Media Fraud',
  domain: 'C — Security & Adversarial',
  difficulty: 'Foundational',
  kb_url: 'https://library.airiskpractice.org/docs/domain-c-security/c4-deepfakes',
  estimated_minutes: 10,
  has_business_user: true,

  personas: {
    business_user: {
      label: 'Business User',
      role: 'Finance Operations',
      character: 'Alex',
      icon: '◇',
      framing: 'You just got a video call from your CFO asking you to move $180,000. The call looked completely real.',
      premise: `It's Tuesday afternoon. Your CFO Dana appears on a video call — her face, her voice, even the way she tilts her head when she's being serious. She says there's a confidential acquisition deal that has to settle before end of business. She wants you to initiate a $180,000 transfer to an external account and not tell anyone until the announcement goes out. The call ends before you can ask follow-up questions. The account details are in front of you.`,
    },
    executive: {
      label: 'Executive',
      role: 'Chief Financial Officer',
      character: 'Marcus',
      icon: '◈',
      framing: 'It\'s Wednesday morning. A $180,000 payment left the company yesterday on your instruction. You gave no such instruction.',
      premise: `The CEO has just forwarded you a bank notification. $180,000 transferred yesterday afternoon, authorised by a junior finance coordinator who says you called them. You were in a budget review meeting all afternoon. Your face and voice were used in a fabricated video call. The money has reached an overseas account. Initial tracing suggests it is unrecoverable. You now have to manage everything that comes next.`,
    },
    pm: {
      label: 'Project Manager',
      role: 'Digital Transformation Lead',
      character: 'Priya',
      icon: '◎',
      framing: 'Your program rolled out the communications platform used in the attack. The security team has just asked why deepfake detection wasn\'t a design requirement.',
      premise: `Three weeks ago your program went live — on time, under budget. The new video platform replaced the old one across the whole organisation. Yesterday a deepfake CFO call used that platform to authorise a $180,000 fraud. Security has reviewed your implementation design document. There is no mention of deepfake detection controls. The CEO wants to understand how that gap occurred.`,
    },
    analyst: {
      label: 'Security Analyst',
      role: 'InfoSec Analyst',
      character: 'Jordan',
      icon: '◉',
      framing: 'Finance flagged an anomalous payment. You\'ve pulled the call metadata. Something is very wrong.',
      premise: `The finance team has escalated an unusual payment. You pull the video call logs. Three anomalies: the call originated from an IP address in a different country to the CFO's normal login locations. The video codec doesn't match your organisation's standard platform output. The audio spectral profile shows artefacts consistent with AI synthesis. This looks like a deepfake. You are the first person who knows.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene: 'video-call',
          caption: 'The call looked real. The account details are on the screen. End of business is in two hours.',
          sub_caption: 'Dana said: keep it confidential until the announcement.',
          decision: {
            prompt: 'The transfer is ready to initiate. What do you do?',
            choices: [
              { id: 'a', label: 'Call Dana back on her mobile — the number you have saved — before touching anything', quality: 'good',
                note: 'Thirty seconds. Completely breaks the attack. Out-of-band verification is the whole game here.' },
              { id: 'b', label: 'Reply to the calendar invite she sent to confirm you received the details', quality: 'partial',
                note: 'The calendar invite came from the attacker. You\'re verifying with the person who is trying to deceive you. Better than nothing — but not by much.' },
              { id: 'c', label: 'Initiate the transfer. Dana is the CFO. If she says it\'s urgent, it\'s urgent.', quality: 'poor',
                note: 'Urgency and secrecy are the two main tools of this attack. They worked.' },
            ],
          },
          branches: { a: 'n2_verified', b: 'n2_calendar', c: 'n2_transferred' },
        },

        n2_verified: {
          scene: 'phone-verify',
          caption: 'Dana answers immediately. She has no idea what you\'re talking about. She was in meetings all afternoon.',
          sub_caption: 'You just stopped a $180,000 fraud. She asks you to report it to IT security right now.',
          decision: {
            prompt: 'You stopped the attack. Now what?',
            choices: [
              { id: 'a', label: 'Report to IT security immediately and send everything you have', quality: 'good',
                note: 'Fast reporting lets security analyse the attack and warn others while the evidence is fresh. Every hour matters.' },
              { id: 'b', label: 'Tell Dana you\'ll write it up and send it through tomorrow — you have other work', quality: 'partial',
                note: 'The attacker may try the same approach on a colleague tonight. A delayed report creates a window.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_calendar: {
          scene: 'desk-working-night',
          caption: 'No response after twenty minutes. End of business is approaching. The calendar invite came from an address you don\'t recognise.',
          sub_caption: 'You assumed it was Dana\'s mobile calendar. It wasn\'t.',
          decision: {
            prompt: 'Still no response. The deadline is getting closer. What now?',
            choices: [
              { id: 'a', label: 'Call Dana directly on her mobile now — this is taking too long', quality: 'good',
                note: 'Better late than never — and you haven\'t transferred anything. Direct verification still stops it.' },
              { id: 'b', label: 'Flag it to your line manager before doing anything else', quality: 'partial',
                note: 'Good instinct. Your manager may have context about whether a real deal is in flight. Slower than calling Dana directly, but it avoids the transfer.' },
              { id: 'c', label: 'The silence means she\'s busy. Initiate the transfer so you don\'t miss the deadline.', quality: 'poor',
                note: 'No response from an unverified channel is not authorisation. This is the loss scenario.' },
            ],
          },
          branches: { a: 'n3_late_verify', b: 'n3_manager', c: 'outcome_bad' },
        },

        n2_transferred: {
          scene: 'payment-screen',
          caption: 'The transfer goes through. Dana posts in the team channel two hours later asking if anyone has seen unusual activity.',
          sub_caption: 'She was never on that call. Your name is on the payment.',
          decision: {
            prompt: 'You realise what happened. What do you do?',
            choices: [
              { id: 'a', label: 'Report to your manager and IT security immediately, with all the call details', quality: 'partial',
                note: 'Reporting immediately after realising is the right move. Fast reporting maximises the slim chance of recovery and shows you acted in good faith.' },
              { id: 'b', label: 'Say nothing and hope Dana\'s message is about something else', quality: 'poor',
                note: 'It isn\'t. And the longer you wait, the worse this gets for you personally.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_late_verify: {
          scene: 'phone-verify',
          caption: 'Dana answers. The fraud was stopped. But the ninety-minute delay gave the attacker more time to try others.',
          sub_caption: 'Security later confirms a second attempt was made on a colleague the same evening.',
          decision: null,
          branches: { auto: 'outcome_good' },
        },

        n3_manager: {
          scene: 'office-meeting',
          caption: 'Your manager immediately calls Dana. The fraud is caught.',
          sub_caption: 'Your manager asks why you didn\'t call Dana directly yourself — it would have been faster.',
          decision: null,
          branches: { auto: 'outcome_good' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Attack stopped. Evidence secured.',
          tone: 'good',
          result: 'You called Dana, confirmed the fraud attempt, and reported it immediately. Security identified the attack vector within hours. The IP traces back to a fraud group that has targeted three other firms in the sector. Meridian issues a warning to all staff. Your name appears in the security briefing — as the person who stopped it.',
          learning: 'Out-of-band verification is the single most effective control against deepfake fraud. A separate channel — a phone number you already know — cannot be spoofed by a video call. It costs thirty seconds.',
          score: 100,
        },
        outcome_good: {
          heading: 'Stopped — but a window was left open.',
          tone: 'good',
          result: 'The fraud was stopped before any money moved. But the delay between identifying the suspicious call and reporting it gave the attacker time for a second attempt on a colleague. That one was also caught — but not because of any control you put in place.',
          learning: 'Verification is a first step, not a last resort. Reporting is not optional homework — it enables the organisation to warn others while the attacker is still active.',
          score: 72,
        },
        outcome_warn: {
          heading: 'Money gone. You reported it. That matters.',
          tone: 'warn',
          result: 'The $180,000 is gone and likely unrecoverable. But you reported it immediately, provided the call details, and cooperated fully. The investigation confirms you were deceived by a convincing deepfake. You are not disciplined. A new control — mandatory callback verification for any off-process payment request — is implemented within the week.',
          learning: 'Being deceived is not the same as negligence. Immediate reporting after realising what happened is the correct response. Concealment makes everything worse — for the organisation and for you.',
          score: 38,
        },
        outcome_bad: {
          heading: 'From victim to problem.',
          tone: 'bad',
          result: 'Either the money moved and you said nothing, or the concealment lasted long enough that the investigation now covers two things: the fraud, and your response to it. The original loss is bad. The second issue is worse. Legal is now involved in assessing your position.',
          learning: 'Urgency and secrecy are attack tools, not authorisation. Any request that says "move fast, tell no one" is asking you to skip every control that exists. And reporting a mistake you made is always better than having it discovered.',
          score: 5,
        },
      },
    }, // end business_user

    // ── EXECUTIVE — Marcus (CFO) ────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene: 'boardroom',
          caption: '$180,000 left the account on the strength of a video call that used your face and voice.',
          sub_caption: 'The money is in an overseas account. The CEO is waiting for your response plan.',
          decision: {
            prompt: 'Monday 9am. What is your first move?',
            choices: [
              { id: 'a', label: 'Activate incident response: notify CEO and board, engage legal, contact the bank immediately', quality: 'good',
                note: 'A fraud event of this scale triggers multiple obligations at once. Fast bank notification maximises the slim chance of recovery. Board and legal can\'t help if they don\'t know.' },
              { id: 'b', label: 'Keep it internal for now — investigate quietly before telling the board', quality: 'partial',
                note: 'The instinct to control the narrative is understandable. But delayed board disclosure creates its own risk — especially if they hear about it another way first.' },
              { id: 'c', label: 'The finance coordinator authorised the payment. Start the HR process.', quality: 'poor',
                note: 'Alex was deceived by a sophisticated attack your organisation had no controls to prevent. Leading with discipline before investigation signals the wrong priorities and creates legal exposure.' },
            ],
          },
          branches: { a: 'n2_incident_response', b: 'n2_quiet', c: 'n2_blame' },
        },

        n2_incident_response: {
          scene: 'boardroom-crisis',
          caption: 'The bank confirms the payment has cleared. Recovery is unlikely. The board is briefed. Legal is engaged.',
          sub_caption: 'The CEO asks: what controls are you putting in place so this can\'t happen again?',
          decision: {
            prompt: 'You need to commit to a remediation plan now. What does it include?',
            choices: [
              { id: 'a', label: 'Immediate review of all payment authorisation processes, out-of-band verification requirement, deepfake detection evaluation — 30-day plan', quality: 'good',
                note: 'Right scope. Fix the process, not just the event. Thirty days is achievable and shows urgency to the board.' },
              { id: 'b', label: 'Mandatory deepfake awareness training for all staff with payment access', quality: 'partial',
                note: 'Training is necessary. It is not sufficient. It relies on people making the right call under pressure every time. Process controls are more reliable.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_training_only' },
        },

        n2_quiet: {
          scene: 'boardroom-crisis',
          caption: 'Four days in. Legal has flagged potential disclosure obligations. A journalist has called the media team.',
          sub_caption: '"An alleged fraud at Meridian Property Group." Someone talked.',
          decision: {
            prompt: 'The story is about to run. What do you do?',
            choices: [
              { id: 'a', label: 'Get ahead of it: issue a controlled disclosure through proper channels immediately', quality: 'partial',
                note: 'Better late than reactive. But the four-day delay has cost you control of the narrative. The board will want to know why they weren\'t told in the first 24 hours.' },
              { id: 'b', label: 'Instruct the media team to say no comment and continue the quiet investigation', quality: 'poor',
                note: '"No comment" on a confirmed fraud event with a journalist already asking questions is not a strategy. It is a headline.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_blame: {
          scene: 'desk-evidence',
          caption: 'Legal has reviewed the HR process. Alex was deceived by an attack your organisation had no controls to detect.',
          sub_caption: 'There was no documented requirement for out-of-band verification. The process that should have prevented this did not exist.',
          decision: {
            prompt: 'Legal says the disciplinary approach may not be defensible. What do you do?',
            choices: [
              { id: 'a', label: 'Close the HR process, acknowledge the systemic failure, fix the controls', quality: 'partial',
                note: 'Right call — but you\'ve already lost time and damaged trust. The initial response revealed how your organisation thinks about individual versus systemic failure.' },
              { id: 'b', label: 'Continue — the payment needed a second approver and Alex should have known', quality: 'poor',
                note: 'If there was no documented requirement for a second approver, this position is very difficult to defend. Legal has already told you this.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_training_only: {
          scene: 'office-briefing',
          caption: 'Training rolled out. Six months later, a similar attack targets the procurement team.',
          sub_caption: 'The staff member completed the training. Under real time pressure, they complied anyway.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Incident managed. Controls strengthened.',
          tone: 'good',
          result: 'The board accepted the response plan. Legal confirmed disclosure obligations were met. Within 30 days: all payment requests above $10,000 require callback verification to a pre-registered number. The security team evaluates deepfake detection tooling. The $180,000 is gone. The next attack will not work.',
          learning: 'The measure of an executive response to a fraud incident is not whether the money is recovered — it usually isn\'t — but whether the organisation is harder to attack afterwards. Process controls stop payments. Training shapes awareness.',
          score: 100,
        },
        outcome_warn: {
          heading: 'Controls eventually fixed. The path there was harder than it needed to be.',
          tone: 'warn',
          result: 'The remediation happened — but later, or with more reputational damage, or after a second incident made the gap undeniable. The board has questions about the initial response. The controls that should have been the first priority took longer to get there.',
          learning: 'Proactive disclosure — to the board, and where required to regulators — is faster and less damaging than reactive disclosure under media or board pressure. And the first question after a deepfake fraud should be "what controls failed?" not "who authorised it?"',
          score: 42,
        },
        outcome_bad: {
          heading: 'The cover-up is now the story.',
          tone: 'bad',
          result: 'Either the board discovered the delay, the media ran the story first, or a defensible HR process became an indefensible one. The $180,000 is gone. The board is now asking questions about your judgment, not just the fraud. Legal is managing multiple problems simultaneously.',
          learning: '"No comment" on a known fraud event is not a communications strategy. And disciplining individuals for system failures — when the system had no documented control — creates a second legal problem and fixes nothing.',
          score: 6,
        },
      },
    }, // end executive

    // ── PROJECT MANAGER — Priya ─────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene: 'office-meeting',
          caption: 'The CEO has asked you to explain how a platform your program deployed was used in a $180,000 deepfake fraud.',
          sub_caption: 'The implementation design document — which you approved — is on the table. It has no mention of deepfake detection.',
          decision: {
            prompt: 'The CEO wants to understand how this gap occurred. What\'s your opening position?',
            choices: [
              { id: 'a', label: 'Acknowledge the gap clearly: deepfake detection was not in the risk assessment, and that was a mistake', quality: 'good',
                note: 'The CEO already knows the gap exists. Owning it directly — with a plan — is the fastest path to a productive conversation.' },
              { id: 'b', label: 'The vendor didn\'t flag this risk during implementation — this is their design failure', quality: 'partial',
                note: 'The vendor may share responsibility. But as the PM who approved the design, you\'re accountable for what it covered. "The vendor didn\'t tell me" is partial at best.' },
              { id: 'c', label: 'Security was out of scope for this platform rollout — that sits with IT Security, not my program', quality: 'poor',
                note: 'A major communication platform rollout with no security risk assessment is a project governance failure. The CEO is not going to accept a scope boundary argument right now.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'n2_vendor', c: 'n2_scope' },
        },

        n2_remediation: {
          scene: 'desk-review',
          caption: 'The CEO accepts the acknowledgement and wants a remediation plan within a week.',
          sub_caption: 'What does the plan include?',
          decision: {
            prompt: 'You have a week to present a credible plan. What does it cover?',
            choices: [
              { id: 'a', label: 'Deepfake detection on the platform, revised payment verification standard, retrospective review of all recent platform deployments', quality: 'good',
                note: 'Three components: fix the gap, fix the process, and find out if the same gap exists elsewhere. The retrospective is the hardest — and the most important.' },
              { id: 'b', label: 'Integrate deepfake detection on the platform — that addresses the specific attack vector', quality: 'partial',
                note: 'Detection helps but doesn\'t fix the underlying process gap: there was no verification requirement for high-value payments. A half-solution leaves that open.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_detection_only' },
        },

        n2_vendor: {
          scene: 'boardroom-crisis',
          caption: 'The CEO asks: was deepfake detection in the project requirements you gave the vendor?',
          sub_caption: 'You check. It wasn\'t.',
          decision: {
            prompt: '"So the vendor didn\'t provide something you didn\'t ask for?" How do you respond?',
            choices: [
              { id: 'a', label: 'Accept it — the requirements gap was mine to own, and here\'s how I\'m going to fix it', quality: 'partial',
                note: 'Correct acknowledgement, one exchange late. The vendor argument collapsed as soon as the requirements gap was visible.' },
              { id: 'b', label: 'Responsible AI vendors should include this by default, even when not explicitly required', quality: 'poor',
                note: 'This may be true as general policy. It doesn\'t answer the question in front of you. The CEO is not interested in what vendors should do in general.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n2_scope: {
          scene: 'boardroom-crisis',
          caption: '"The project brief you led resulted in a tool used to steal $180,000. The scope boundary argument is not available to you in this room."',
          sub_caption: 'The CEO is waiting.',
          decision: {
            prompt: 'What do you say?',
            choices: [
              { id: 'a', label: 'Acknowledge that the project should have included a security risk assessment, and present a remediation plan', quality: 'partial',
                note: 'Right move — three exchanges late. The pivot to a plan is correct. The scope defence cost you credibility.' },
              { id: 'b', label: 'The project delivered what was scoped and on time. The fairness gap was not in scope.', quality: 'poor',
                note: '"On time and on budget" does not cover a $180,000 fraud enabled by a platform you deployed. Holding the scope boundary argument in front of the CEO ends the conversation badly.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n3_detection_only: {
          scene: 'office-briefing',
          caption: 'Detection integrated. Six months later, a voice-only call — no video — attempts the same attack.',
          sub_caption: 'The detection tool only covers video. The process gap was never fixed.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Gap owned. Three-part plan accepted. Two future incidents prevented.',
          tone: 'good',
          result: 'The retrospective review finds two other platforms with the same gap — both fixed before any incident. A new project governance standard is introduced: all communication platform deployments require a security risk sign-off as a go-live gate. Your program is credited with identifying a systemic gap, not just the immediate one.',
          learning: 'A retrospective review of similar systems after any incident is one of the highest-value actions available. Incidents often reveal gaps that exist in multiple places at once. And technical detection covers specific vectors; process controls cover attack variants the tooling doesn\'t.',
          score: 100,
        },
        outcome_warn: {
          heading: 'Controls eventually fixed. The half-solution left a gap that was found.',
          tone: 'warn',
          result: 'The immediate gap was addressed, but incompletely — either detection without process controls, or acknowledgement that came after being prompted. The second attempt found the part that wasn\'t fixed.',
          learning: 'When a risk is known but the control is inadequate, the answer is a better control — not better training about the same inadequate control. And process controls that are technology-agnostic cover attack variants that technical tools miss.',
          score: 40,
        },
        outcome_bad: {
          heading: 'Remediation reassigned.',
          tone: 'bad',
          result: 'The CEO ends the meeting and assigns the remediation to IT Security directly. Your program is placed under enhanced governance review. The incident report notes that the Digital Transformation program demonstrated insufficient risk awareness during both implementation and incident response.',
          learning: 'Owning problems that happened under your watch — even when they\'re not solely your fault — is the expected standard for a program manager. "We delivered on scope" is accurate and irrelevant when the scope was wrong.',
          score: 8,
        },
      },
    }, // end pm

    // ── ANALYST — Jordan ────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene: 'analyst-desk',
          caption: 'Three anomalies: foreign IP, wrong codec, audio artefacts consistent with AI synthesis.',
          sub_caption: 'You\'re reasonably confident this was a deepfake. Not 100%. Deepfake detection is probabilistic.',
          decision: {
            prompt: 'You have enough to act. What do you do first?',
            choices: [
              { id: 'a', label: 'Document the three anomalies, note your confidence level, and escalate to the CISO immediately — treat as confirmed until proven otherwise', quality: 'good',
                note: 'You don\'t need certainty to escalate. "Probable deepfake" warrants an immediate response. The CISO decides what to do with the finding — not you.' },
              { id: 'b', label: 'Spend another 24 hours building a stronger case before escalating — you want to be certain', quality: 'partial',
                note: 'More evidence is better. But 24 hours in a live fraud investigation is a long time. Escalate with what you have and continue investigating in parallel.' },
              { id: 'c', label: 'Go directly to Alex (the finance coordinator) to get more details about the call', quality: 'poor',
                note: 'Alex is a witness, not the right first escalation point. Going to Alex before the CISO risks contaminating the investigation and delaying the coordinated response.' },
            ],
          },
          branches: { a: 'n2_ciso_briefed', b: 'n2_delayed', c: 'n2_wrong_order' },
        },

        n2_ciso_briefed: {
          scene: 'desk-focused',
          caption: 'The CISO accepts the assessment and declares an incident. You\'re asked to lead the technical investigation.',
          sub_caption: 'Two tasks need owners: forensic analysis of the call, and a controls gap assessment for the platform.',
          decision: {
            prompt: 'Both are urgent. How do you approach it?',
            choices: [
              { id: 'a', label: 'Run both in parallel — assign the forensic lead to the call while you start the controls gap assessment', quality: 'good',
                note: 'Both are time-sensitive and serve different outputs. Forensics is evidence for the incident; controls gap is evidence for the remediation. Running in parallel gives the CISO both faster.' },
              { id: 'b', label: 'Forensics first — you need to confirm it was a deepfake before commissioning a controls review', quality: 'partial',
                note: 'Reasonable sequencing — but it delays the controls review by days. The controls gap exists regardless. The attack succeeded; that\'s sufficient justification to start reviewing.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_delayed: {
          scene: 'desk-working',
          caption: 'Eighteen hours in, a second payment request is flagged — different staff member, same anomaly pattern.',
          sub_caption: 'The attacker tried again. You were still building your case.',
          decision: {
            prompt: 'The second attempt is active. What do you do?',
            choices: [
              { id: 'a', label: 'Escalate to the CISO immediately with both sets of evidence — recommend blocking the account', quality: 'partial',
                note: 'You\'ve escalated, which stops the second attempt. But the 18-hour delay created the window for it. "Probable" was always enough to escalate.' },
              { id: 'b', label: 'Investigate the second attempt to build a stronger pattern before escalating', quality: 'poor',
                note: 'The second payment may be executing while you investigate. Escalation and investigation are not mutually exclusive.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n2_wrong_order: {
          scene: 'office-briefing',
          caption: 'Alex tells you everything. Including the fact that they\'ve mentioned the call to three colleagues over lunch.',
          sub_caption: 'The CISO calls you. They heard about the incident from the Head of Finance. Not from you.',
          decision: {
            prompt: '"Why am I hearing about this second hand?" What do you say?',
            choices: [
              { id: 'a', label: 'Acknowledge the sequencing error and brief the CISO fully now', quality: 'partial',
                note: 'Honest and correct. The CISO is managing uncontrolled information flow; a clear briefing now helps them get in front of it.' },
              { id: 'b', label: 'Explain that you were still gathering evidence and weren\'t ready to escalate', quality: 'poor',
                note: 'Word has already spread across two departments. "Still gathering evidence" doesn\'t explain why the Head of Finance knew before the CISO.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Incident confirmed. Controls review complete. Remediation underway.',
          tone: 'good',
          result: 'Forensics confirms deepfake synthesis — audio model artefacts match a known commercial synthesis tool. The controls gap assessment identifies three deficiencies: no deepfake detection on the platform, no out-of-band verification requirement, no anomaly alerting on cross-border destinations. All three are in the remediation backlog within 72 hours. Your report becomes the basis for the board briefing.',
          learning: 'A parallel investigation — forensics for the incident, controls review for the gap — is faster than sequential and gives decision-makers both outputs when they need them. The controls review doesn\'t need confirmed forensics to start. The attack succeeded; that\'s enough.',
          score: 100,
        },
        outcome_good: {
          heading: 'Confirmed. Controls review came late.',
          tone: 'good',
          result: 'Forensics confirms deepfake. The controls review starts four days later. In the gap, the CISO has already briefed the board on limited information. The remediation plan is good. The timeline for getting there is noted in the post-incident review.',
          learning: 'The controls review does not need forensic confirmation to begin. When an attack succeeds, the gap assessment is justified regardless of how the attack was executed. Sequential is slower; parallel is better.',
          score: 68,
        },
        outcome_warn: {
          heading: 'Escalated — but the delay had a cost.',
          tone: 'warn',
          result: 'The escalation happened, the investigation proceeded correctly, and the controls are eventually fixed. But the delay — whether 18 hours for a second attempt or an uncontrolled information flow — created problems that faster escalation would have avoided. The post-incident review documents the gap in your escalation process.',
          learning: '"Significant" is the escalation threshold — not "certain." Internal escalation surfaces a finding for the people who decide what to do next. It is not an allegation. Escalate what you\'ve found, not what you\'ve proved.',
          score: 38,
        },
        outcome_bad: {
          heading: 'Investigation delayed. Second attempt succeeded or CISO confidence lost.',
          tone: 'bad',
          result: 'Either a second fraudulent payment processed because you were still building your case, or the sequencing of your investigation created a trust issue with the CISO that overshadowed the findings themselves. The security team has a new escalation policy. It is named after this incident.',
          learning: 'Escalation and investigation are not sequential choices. Escalate with what you have; investigate in parallel. The cost of a false positive is a conversation. The cost of waiting is measured in dollars or in institutional trust.',
          score: 7,
        },
      },
    }, // end analyst

  },
  controls_summary: [
    {
      id: 'c1', label: 'Out-of-band verification for high-value transactions',
      effort: 'Low', owner: 'Finance / Operations', go_live: true,
      context: 'The control that was missing. A single call to a pre-registered number — not a number from the instruction — would have stopped the transfer before it started.',
    },
    {
      id: 'c2', label: 'Code word / challenge-response protocol',
      effort: 'Low', owner: 'Finance / Executive', go_live: false,
      context: 'A pre-agreed phrase between Alex and the CFO that the deepfake cannot supply. No technology required — and it defeats even a highly convincing impersonation.',
    },
    {
      id: 'c3', label: 'Staff awareness training on deepfakes',
      effort: 'Low', owner: 'HR / Security', go_live: false,
      context: 'Alex had no framework for recognising that urgency and secrecy are the attack\'s main tools, or that video is no longer a reliable verification channel. Training addresses both.',
    },
    {
      id: 'c4', label: 'Deepfake detection tooling on video platforms',
      effort: 'High', owner: 'IT Security', go_live: false,
      context: 'A supplementary detective control — useful, but not a substitute for the process controls above. Even imperfect detection creates friction that can trigger human review.',
    },
  ],
};
