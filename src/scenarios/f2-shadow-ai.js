// F2 Shadow AI — full branching scenario with 4 personas
// Schema: each persona has its own opening, panels, and decision tree
// Decisions chain: choice at node N unlocks specific node at N+1

export const scenario = {
  id: 'f2-shadow-ai',
  risk_ref: 'F2',
  title: 'The Shortcut',
  subtitle: 'Shadow AI & Data Exposure',
  domain: 'F — HCI & Deployment',
  difficulty: 'Foundational',
  kb_url: 'https://library.airiskpractice.org/docs/domain-f-deployment/f2-shadow-ai',
  estimated_minutes: 10,
  has_business_user: true,

  personas: {
    business_user: {
      label: 'Business User',
      role: 'Marketing Team',
      character: 'Jamie',
      icon: '◇',
      framing: 'You work in marketing. Someone just told you to paste the client brief into a free AI tool.',
      premise: `It's Wednesday afternoon. You've been asked to turn three pages of product notes into a punchy one-pager for tomorrow's client meeting. Your colleague leans over: "Just paste it into an AI tool — takes two minutes." You glance at the notes. They include the client's name, their contract value, and some pricing that hasn't been announced yet.`,
    },
    executive: {
      label: 'Executive',
      role: 'Chief Risk Officer',
      character: 'Alex',
      icon: '◈',
      framing: 'You are the CRO. A legal hold notice just landed on your desk and you have no idea why.',
      premise: `It's Monday morning. External counsel. Legal hold. "All records relating to AI tool usage during Q3 board preparation." Your EA is already asking if she should cancel your 9am. You have no idea what triggered this.`,
    },
    pm: {
      label: 'Project Manager',
      role: 'Senior Project Manager',
      character: 'Priya',
      icon: '◎',
      framing: 'You are the PM who pasted the board deck into an unapproved AI tool. Your manager just pinged you.',
      premise: `You're the one who did it. Last quarter, under deadline pressure, you pasted the Q3 strategy deck into a free public AI tool to polish the board summary. You didn't think it was a big deal. Now your manager has just sent: "Hey — quick question, did you use any external tools during board prep last quarter? IT is asking."`,
    },
    analyst: {
      label: 'Security Analyst',
      role: 'InfoSec Analyst',
      character: 'Marcus',
      icon: '◉',
      framing: 'You found something in the logs. Nobody else has noticed yet.',
      premise: `Three weeks after Q3 board prep, your log review flags an anomaly. Device: CORP-LAP-0482. Destination: free-ai-tool.example. Data transferred: 847KB of text. Your DLP system didn't fire because it was a personal browser session. You are the first person to know this happened.`,
    },
  },

  // ── DECISION TREES ─────────────────────────────────────────────
  // Each persona has an independent branching tree.
  // nodes[] are sequential beats. Each node has:
  //   - scene: which SVG illustration to show
  //   - panel_text: the illustrated story beat
  //   - caption / sub_caption: caption bar text
  //   - decision: the choice object (null for pure story beats)
  //   - branches: maps choice_id → next node_id (or 'outcome_X')

  trees: {

    // ── BUSINESS USER ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene: 'desk-casual',
          caption: 'Jamie stares at the notes. The deadline is tomorrow. The shortcut is right there.',
          sub_caption: 'The document includes the client name, contract value, and unannounced pricing.',
          decision: {
            prompt: 'Your colleague just said "everyone does it." What do you do?',
            choices: [
              { id: 'a', label: 'Just paste it in — it\'ll take two minutes', quality: 'poor',
                note: 'It does take two minutes. The one-pager is great. The data left the organisation though — and you won\'t find out until three weeks later.' },
              { id: 'b', label: 'Ask your colleague if it\'s actually okay', quality: 'partial',
                note: 'They have no idea either. But at least you asked. That counts for something.' },
              { id: 'c', label: 'Check if there\'s a company policy first', quality: 'good',
                note: 'There is one. Buried on the intranet under a folder called Governance 2022, last updated before half the team joined. But it exists and it says no.' },
              { id: 'd', label: 'Do it the slow way yourself', quality: 'good',
                note: 'Takes 45 minutes. One-pager is fine. You sleep well. Genuinely the correct call.' },
            ],
          },
          branches: { a: 'n2_used_it', b: 'n2_asked', c: 'n2_found_policy', d: 'n2_did_it_slow' },
        },

        n2_used_it: {
          scene: 'desk-typing',
          caption: 'The one-pager is excellent. Your manager loves it. Three weeks pass.',
          sub_caption: 'Then IT sends a company-wide email asking about "external tool usage last quarter."',
          decision: {
            prompt: 'The IT email lands in your inbox. You know what you did. What now?',
            choices: [
              { id: 'a', label: 'Reply honestly — you used a free AI tool once for a client doc', quality: 'good',
                note: 'Uncomfortable. Also the right move. Getting ahead of it is always better.' },
              { id: 'b', label: 'Ignore it — surely they won\'t track it to you specifically', quality: 'poor',
                note: 'They have the logs. CORP-LAP-0482 is your laptop. They absolutely will.' },
              { id: 'c', label: 'Reply "no" — it was just one time, barely anything sensitive', quality: 'poor',
                note: 'The contract value and unannounced pricing beg to differ.' },
            ],
          },
          branches: { a: 'n3_honest', b: 'n3_ignored', c: 'n3_lied' },
        },

        n2_asked: {
          scene: 'desk-colleague',
          caption: '"I think it\'s fine?" your colleague says. "Everyone does it."',
          sub_caption: 'Neither of you actually knows. But at least you paused.',
          decision: {
            prompt: 'Your colleague shrugged. You still need to make the call. What next?',
            choices: [
              { id: 'a', label: 'Decide that if everyone does it, it must be fine', quality: 'poor',
                note: '"Everyone does it" has never once been a legal defence. Worth filing that away.' },
              { id: 'b', label: 'Ask your manager before you do anything', quality: 'good',
                note: 'Your manager pauses, then says "actually, hold off." Crisis quietly averted.' },
              { id: 'c', label: 'Do it the slow way — the risk doesn\'t feel worth it', quality: 'good',
                note: 'Solid instinct. You didn\'t need to know the policy to make the right call.' },
            ],
          },
          branches: { a: 'n2_used_it', b: 'n3_manager_saved_it', c: 'outcome_good' },
        },

        n2_found_policy: {
          scene: 'desk-intranet',
          caption: 'You find the policy. It says: "Do not submit confidential client data to external AI tools."',
          sub_caption: 'Clear. Unambiguous. Also about 14 months out of date, but still.',
          decision: {
            prompt: 'Policy says no. But the deadline is tomorrow and your colleague says everyone ignores it.',
            choices: [
              { id: 'a', label: 'Follow the policy — do it manually', quality: 'good',
                note: 'The deadline is tight but you make it. The policy existed for exactly this reason.' },
              { id: 'b', label: 'Use the free AI tool anyway — the policy looks old and probably doesn\'t apply', quality: 'poor',
                note: 'The policy is old. It absolutely still applies. Age is not a legal loophole.' },
              { id: 'c', label: 'Ask your manager to clarify before you do anything', quality: 'good',
                note: 'Manager gets the policy updated and approves an enterprise tool. You helped fix a gap.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'n2_used_it', c: 'outcome_great' },
        },

        n2_did_it_slow: {
          scene: 'desk-focused',
          caption: 'Forty-five minutes later, the one-pager is done. It\'s good. Not AI-assisted-good, but good.',
          sub_caption: 'You didn\'t expose any client data. You also didn\'t know that was what you were avoiding.',
          decision: {
            prompt: 'Your colleague asks why you didn\'t just use ChatGPT like she suggested.',
            choices: [
              { id: 'a', label: 'Say you weren\'t sure if it was okay to share client data', quality: 'good',
                note: 'Exactly right. That instinct is the whole lesson. You had it without needing training.' },
              { id: 'b', label: 'Say you just didn\'t think of it', quality: 'partial',
                note: 'Fine outcome, accidental reasoning. Worth understanding why it was the right call.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n3_honest: {
          scene: 'office-meeting',
          caption: 'Your manager appreciates the honesty. IT logs confirm it was a one-time thing.',
          sub_caption: 'The data included client pricing. It shouldn\'t have left the building.',
          decision: {
            prompt: 'HR asks if you\'d be willing to share your experience in a team awareness session.',
            choices: [
              { id: 'a', label: 'Yes — if it helps others avoid the same mistake', quality: 'good',
                note: 'You accidentally became the most valuable person in the AI governance rollout.' },
              { id: 'b', label: 'Hard pass — you\'d rather this just quietly went away', quality: 'partial',
                note: 'Fair enough. The matter is quietly resolved — written note-to-file, no further action.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n3_ignored: {
          scene: 'office-busted',
          caption: 'IT correlates the log with your device ID. Your manager calls you in.',
          sub_caption: 'You didn\'t respond to the email. That\'s now also on the list of things to explain.',
          decision: {
            prompt: 'You\'re in your manager\'s office. The IT report is on the desk.',
            choices: [
              { id: 'a', label: 'Come clean fully — what you did and why you didn\'t respond', quality: 'good',
                note: 'Late honesty is still honesty. It lands better than you expect.' },
              { id: 'b', label: 'Claim you never saw the IT email', quality: 'poor',
                note: 'Read receipts. Email tracking. The IT department is not your ally in this story.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_lied: {
          scene: 'office-busted',
          caption: 'IT matches the log to your device. Your "no" reply is now in the incident record.',
          sub_caption: 'You have gone from "data policy issue" to "data policy issue plus false statement."',
          decision: {
            prompt: 'Your manager is looking at the log and your email reply simultaneously.',
            choices: [
              { id: 'a', label: 'Correct the record immediately — admit you made a mistake', quality: 'partial',
                note: 'The situation is worse than it needed to be, but correcting it now still helps.' },
              { id: 'b', label: 'Double down — insist the log must be wrong', quality: 'poor',
                note: 'The log is not wrong. IT is very sure of this. This is how people become cautionary tales.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_manager_saved_it: {
          scene: 'desk-focused',
          caption: 'Your manager flagged it to IT. Turns out three others had already done the same thing.',
          sub_caption: 'Your question triggered a policy review. The approved tool list ships next month.',
          decision: null,
          branches: { auto: 'outcome_great' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Quietly heroic',
          tone: 'good',
          result: 'You either avoided the problem entirely or asked the right question at the right time. Your manager mentioned you to the CRO as "someone who flagged a governance gap." You didn\'t even know that conversation happened.',
          learning: 'You don\'t need to be a risk professional to make good decisions. The only question you ever needed was: "Is this data okay to share with a third party?" If you\'re not sure, ask before you share — not after.',
          score: 100,
        },
        outcome_good: {
          heading: 'Clean exit',
          tone: 'good',
          result: 'No data left the building, or you caught it early enough that the impact was contained. Nothing on your file. The policy gets updated partly because of your situation.',
          learning: 'The right outcome for the right reason is better than the right outcome by accident — but both are better than the wrong one. Understanding why something was risky helps next time.',
          score: 78,
        },
        outcome_warn: {
          heading: 'Bruised but standing',
          tone: 'warn',
          result: 'Note to file. Mandatory awareness training (which you actually find useful). The data exposure was real but limited. Your manager goes out of their way to mention you handled the follow-up well.',
          learning: 'The mistake was sharing data you weren\'t sure about. The recovery was honesty. Late is always better than never when it comes to coming clean about a data incident.',
          score: 45,
        },
        outcome_bad: {
          heading: 'The case study nobody wants to be',
          tone: 'bad',
          result: 'Formal disciplinary process. The incident gets referenced in the company\'s AI governance training as an anonymised example. You are not told this, but your colleague recognises the story immediately and says nothing.',
          learning: 'The data mistake was manageable. The cover-up made it unmanageable. In data incidents, the thing that gets people into serious trouble is almost never the original error — it\'s what happens in the 48 hours after.',
          score: 8,
        },
      },
    }, // end business_user

    // ── EXECUTIVE ──────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene: 'boardroom',
          caption: 'The legal hold notice is two pages long. Your EA is hovering.',
          sub_caption: '"All records relating to AI tool usage during Q3 board preparation." You have no idea what this is about.',
          decision: {
            prompt: 'Monday 8:47am. What\'s your first move?',
            choices: [
              { id: 'a', label: 'Immediately convene IT, Legal, and the board secretary', quality: 'good',
                note: 'You have a name and a log within the hour. Painful but contained.' },
              { id: 'b', label: 'Ask your EA to draft a "we are reviewing" holding response', quality: 'partial',
                note: 'Buys 48 hours. Legal finds out you delayed. Not a great look, but recoverable.' },
              { id: 'c', label: 'Forward to your General Counsel and assume it\'s probably nothing', quality: 'poor',
                note: 'Your GC is in Tuscany. The letter sits in their inbox for four days.' },
            ],
          },
          branches: { a: 'n2_fast_response', b: 'n2_delayed', c: 'n2_tuscany' },
        },

        n2_fast_response: {
          scene: 'boardroom',
          caption: 'IT pulls the logs. Unapproved AI tool. 847KB. Q3 board prep. One employee. The data included M&A target names.',
          sub_caption: 'Your acceptable use policy was in draft at the time. It had been in draft for six months.',
          decision: {
            prompt: 'You now know what happened. How do you frame it for the board?',
            choices: [
              { id: 'a', label: 'Present the facts, the gap, and a 30-day remediation plan', quality: 'good',
                note: 'Board respects the candour. You keep your job. Policy ships within the month.' },
              { id: 'b', label: 'Emphasise this was one employee acting outside normal practice', quality: 'partial',
                note: 'Board accepts it. The draft policy detail surfaces in questions. You look slightly evasive.' },
              { id: 'c', label: 'Blame IT for not having DLP controls in place', quality: 'poor',
                note: 'The CISO resigns. In the meeting. Via Teams. While still on screen.' },
            ],
          },
          branches: { a: 'n3_good_board', b: 'n3_partial_board', c: 'n3_ciso_gone' },
        },

        n2_delayed: {
          scene: 'desk-review',
          caption: 'The holding response buys 48 hours. Legal returns from a site visit and is not pleased.',
          sub_caption: '"You received a legal hold and didn\'t call me immediately?" That\'s a direct quote.',
          decision: {
            prompt: 'Legal is now involved and annoyed. You still need to get the facts.',
            choices: [
              { id: 'a', label: 'Get IT on a call immediately and establish what happened', quality: 'good',
                note: 'You\'re two days late but the facts are the same. Scope the damage, then fix it.' },
              { id: 'b', label: 'Let Legal lead from here — this is their problem now', quality: 'poor',
                note: 'Legal needs facts that only IT has. You\'ve just created a three-way coordination failure.' },
            ],
          },
          branches: { a: 'n2_fast_response', b: 'n3_legal_chaos' },
        },

        n2_tuscany: {
          scene: 'desk-colleague',
          caption: 'Day four. Your GC returns from Tuscany to find a legal hold, four missed escalation emails, and a board chair who has heard about it from external counsel directly.',
          sub_caption: 'The chair\'s email to you is eleven words long. None of them are positive.',
          decision: {
            prompt: 'You are four days behind. The chair wants to talk. Today.',
            choices: [
              { id: 'a', label: 'Call the chair before the meeting — get ahead of their questions', quality: 'good',
                note: 'They\'re still unhappy about the four-day gap. But you called before being summoned — that registers. The conversation is difficult and mercifully brief.' },
              { id: 'b', label: 'Wait for the scheduled meeting and prepare a full briefing pack', quality: 'partial',
                note: 'The briefing pack is excellent. The four-day gap is not explained by a briefing pack.' },
            ],
          },
          branches: { a: 'n2_fast_response', b: 'n3_partial_board' },
        },

        n3_good_board: {
          scene: 'boardroom',
          caption: 'The board accepts the briefing. Honest, structured, remediation-led.',
          sub_caption: 'The chair notes it in the minutes as "management identified and addressed a governance gap."',
          decision: {
            prompt: 'The journalist from a tech publication has heard about the legal hold. They want comment.',
            choices: [
              { id: 'a', label: 'Prepared statement: acknowledge, remediation steps, forward-looking', quality: 'good',
                note: 'Story runs as a measured "lessons learned" piece. The industry nods approvingly.' },
              { id: 'b', label: 'No comment', quality: 'poor',
                note: '\'Company refuses to comment on AI malpractice scandal.\' The story runs for three days. By day two you are the industry\'s favourite cautionary example. The board meeting on day four is short.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_bad_pr' },
        },

        n3_partial_board: {
          scene: 'boardroom',
          caption: 'The board accepts the briefing but asks pointed questions about the draft policy.',
          sub_caption: '"If the policy was in draft for six months, whose job was it to finalise it?" Yours, as it turns out.',
          decision: {
            prompt: 'The chair wants a governance accountability review. You can shape what that looks like.',
            choices: [
              { id: 'a', label: 'Commission an independent review — you want the real picture', quality: 'good',
                note: 'Review finds three other gaps. You fix them all. Reputation recovers.' },
              { id: 'b', label: 'Propose an internal review run by your own team', quality: 'partial',
                note: 'Chair accepts it but notes the independence question. The review is fine. Narrowly.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_warn' },
        },

        n3_ciso_gone: {
          scene: 'office-bright',
          caption: 'The CISO resigned in the meeting. HR is now involved. Legal is now involved. The board chair has questions.',
          sub_caption: 'The incident is no longer about AI data governance. It\'s about leadership.',
          decision: {
            prompt: 'The chair asks you directly: "Did you handle this well?"',
            choices: [
              { id: 'a', label: '"No. I made a mistake in how I framed this and I\'m correcting it."', quality: 'good',
                note: 'Brutal self-assessment. Chair visibly respects it. Your position stabilises.' },
              { id: 'b', label: 'Defend the decision — the CISO was already a performance concern', quality: 'poor',
                note: 'HR has the CISO\'s last three reviews. They were all satisfactory. This is now in writing.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },

        n3_legal_chaos: {
          scene: 'office-briefing-urgent',
          caption: 'Legal needs facts. IT needs direction. The board needs a briefing. Nobody is talking to each other.',
          sub_caption: 'External counsel sends a follow-up letter noting the organisation has not responded within the specified timeframe.',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_good: {
          heading: 'Contained and credited',
          tone: 'good',
          result: 'The incident is resolved. The policy ships. External counsel closes the matter with no further action. The board notes in the next committee review that management responded appropriately to a governance gap. Your name is attached to the remediation, not the failure.',
          learning: 'The incident wasn\'t the problem — the governance gap was. The CRO\'s job isn\'t to prevent every mistake, it\'s to ensure the organisation can detect, respond, and learn. You did all three.',
          score: 88,
        },
        outcome_warn: {
          heading: 'Survived, not celebrated',
          tone: 'warn',
          result: 'The matter is resolved but the board has noted concerns about response time and governance maturity. You keep your role but the next performance review has a pointed section on "AI risk oversight." The policy ships, which is something.',
          learning: 'Speed of response matters almost as much as quality of response in data incidents. The gap between knowing and acting is where reputations are made or lost.',
          score: 52,
        },
        outcome_bad: {
          heading: 'The exit package',
          tone: 'bad',
          result: 'The board chair requests your resignation at a private meeting the following week. The official reason is "strategic differences." The unofficial reason is in the incident report, the CISO\'s resignation letter, and the external counsel\'s correspondence file.',
          learning: 'The original data incident was manageable. Each subsequent decision made it less so. The CRO\'s job is to de-escalate crises, not accelerate them.',
          score: 5,
        },
        outcome_bad_pr: {
          heading: 'Poster child',
          tone: 'bad',
          result: 'The story runs for three days. You are referred to as a "leading example of AI governance failure" in an industry newsletter. The board fires you at the next meeting. Your successor\'s first act is to approve the AI acceptable use policy that has been in draft for six months.',
          learning: '"No comment" is a choice. It just happens to be the choice that maximises negative coverage while giving you zero control over the narrative. Always have a prepared statement.',
          score: 3,
        },
      },
    }, // end executive

    // ── PROJECT MANAGER ────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene: 'desk-typing',
          caption: 'The Slack notification sits there. You know exactly what they\'re asking about.',
          sub_caption: '"Did you use any external tools during board prep last quarter? IT is asking."',
          decision: {
            prompt: 'You have about thirty seconds before not-replying becomes suspicious. What do you send?',
            choices: [
              { id: 'a', label: '"Yes, I used a free AI tool once for the summary. Happy to explain."', quality: 'good',
                note: 'Uncomfortable. Also the right move. Getting ahead of it is always better than being found.' },
              { id: 'b', label: '"I used a few tools — can we talk? Want to make sure I understand what\'s being asked."', quality: 'partial',
                note: 'Vague enough to buy time. Honest enough not to be a lie. Just.' },
              { id: 'c', label: '"No, I only used approved tools."', quality: 'poor',
                note: 'IT has the browser logs. CORP-LAP-0482 is your laptop. You have just lied to your manager. In writing. On Slack. Which is archived.' },
            ],
          },
          branches: { a: 'n2_honest', b: 'n2_vague', c: 'n2_lied' },
        },

        n2_honest: {
          scene: 'desk-colleague',
          caption: 'Your manager and an HR rep are in the room. The tone is serious but not hostile.',
          sub_caption: 'They want to know: what exactly was in the document, and did you know it was a problem?',
          decision: {
            prompt: 'How do you explain the decision you made?',
            choices: [
              { id: 'a', label: 'Fully: what you pasted, why, and that you genuinely didn\'t realise it was a problem', quality: 'good',
                note: 'The policy was in draft. HR notes shared responsibility. Your candour is recorded.' },
              { id: 'b', label: 'Partially: "It was mostly just the summary, nothing really sensitive"', quality: 'poor',
                note: 'IT has confirmed M&A targets were in the paste. Minimising now damages your credibility.' },
            ],
          },
          branches: { a: 'n3_systemic', b: 'n3_minimised' },
        },

        n2_vague: {
          scene: 'desk-focused',
          caption: '"Can we talk" led to a meeting. Your manager and HR are both here. The vague reply is now in the record.',
          sub_caption: 'They\'re giving you a chance to explain. The logs are already pulled.',
          decision: {
            prompt: 'The IT report is on the desk. This is the moment.',
            choices: [
              { id: 'a', label: 'Come clean fully — what you did and why', quality: 'good',
                note: 'The vague Slack reply doesn\'t help you but full honesty here does. HR notes the correction.' },
              { id: 'b', label: 'Maintain the vagueness — "I may have used some tools, I\'d have to check"', quality: 'poor',
                note: 'They have the logs. "I\'d have to check" about something on your own laptop is not credible.' },
            ],
          },
          branches: { a: 'n3_systemic', b: 'n3_caught' },
        },

        n2_lied: {
          scene: 'desk-evidence',
          caption: 'Your manager has the IT log and your Slack reply open side by side.',
          sub_caption: 'The log shows an unapproved AI tool. Your message says "only approved tools." This is a problem.',
          decision: {
            prompt: 'Your manager asks you to "talk them through your tool usage during Q3 board prep."',
            choices: [
              { id: 'a', label: 'Correct the record immediately — you made a mistake and weren\'t honest', quality: 'partial',
                note: 'Late honesty. The situation is worse than it needed to be but correcting it now still matters.' },
              { id: 'b', label: 'Double down — maybe the log is wrong', quality: 'poor',
                note: 'The log is not wrong. IT is extremely confident of this. Doubling down on a false statement in writing is exactly what turns a data incident into a conduct matter.' },
            ],
          },
          branches: { a: 'n3_caught', b: 'outcome_bad' },
        },

        n3_systemic: {
          scene: 'office-meeting',
          caption: 'While reviewing logs, IT finds two other PMs and a director did the same thing. You\'re not alone.',
          sub_caption: 'The investigation is quietly reframing from "individual breach" to "systemic governance gap."',
          decision: {
            prompt: 'HR asks if you have any thoughts on why this is happening across multiple teams.',
            choices: [
              { id: 'a', label: 'The approved tool is slow and nobody knows what the policy is', quality: 'good',
                note: 'Accurate and useful. HR notes it. The policy and tooling both get fixed.' },
              { id: 'b', label: 'Point out the approved tool has been broken for months with no fix', quality: 'good',
                note: 'Also accurate. IT is called in. The root cause gets addressed, not just the symptom.' },
              { id: 'c', label: 'Say nothing — let the others explain it', quality: 'poor',
                note: 'The director points at you specifically. Silence bought nothing — you carry the incident alone and lost any chance of reframing it as a systemic issue.' },
            ],
          },
          branches: { a: 'n4_volunteer', b: 'n4_volunteer', c: 'outcome_warn' },
        },

        n3_minimised: {
          scene: 'boardroom-crisis',
          caption: 'HR pulls up the data classification. M&A targets. Projected offer prices. Executive redundancy list.',
          sub_caption: '"Nothing really sensitive" turns out to be the most sensitive category of data the company holds.',
          decision: {
            prompt: 'Your manager asks you to reconsider your characterisation of the data.',
            choices: [
              { id: 'a', label: 'Acknowledge you underestimated the sensitivity — fully this time', quality: 'good',
                note: 'Late but honest. The minimisation note stays on file. The full honesty also stays on file.' },
              { id: 'b', label: 'Maintain that you didn\'t know it was that sensitive', quality: 'partial',
                note: 'Plausible. The M&A section was clearly labelled but you can credibly claim you didn\'t register its significance at the time. HR notes the ambiguity.' },
            ],
          },
          branches: { a: 'n3_systemic', b: 'outcome_warn' },
        },

        n3_caught: {
          scene: 'desk-focused',
          caption: 'You corrected the record. Late, but you corrected it.',
          sub_caption: 'The written note reflects the correction. The initial response — vague or false — is also in the record.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },

        n4_volunteer: {
          scene: 'desk-thirty-days',
          caption: 'The governance review recommends both a policy and an approved tools rollout.',
          sub_caption: 'Someone needs to help implement the acceptable use training for the PM community.',
          decision: {
            prompt: 'HR asks if you\'d be willing to contribute to the rollout given your experience.',
            choices: [
              { id: 'a', label: 'Yes — if anyone knows why people reach for these tools, it\'s me', quality: 'good',
                note: 'You turn a disaster into a genuine career moment. The training references your scenario (anonymised, mostly).' },
              { id: 'b', label: 'Hard pass — you\'d rather this whole thing quietly disappeared', quality: 'partial',
                note: 'Understandable. The matter fades without much ceremony — note to file, no further action.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_ok' },
        },
      },

      outcomes: {
        outcome_good: {
          heading: 'The accidental policy champion',
          tone: 'good',
          result: 'You\'re now co-authoring the AI acceptable use training. Your scenario is in there, anonymised as "a senior project manager at a financial services firm." Your colleagues will complete this training in two months. Three of them will recognise the story. None of them will say anything.',
          learning: 'The mistake was understandable. Shadow AI happens everywhere the approved path is slower than the unapproved one. The correct response to discovering you\'re part of a systemic problem is to help fix the system, not just survive the investigation.',
          score: 92,
        },
        outcome_ok: {
          heading: 'Quietly resolved',
          tone: 'good',
          result: 'Note to file. Mandatory training (you find it somewhat ironic). The policy ships. The approved tool gets fixed. Your manager checks in three months later and explicitly says the matter is closed.',
          learning: 'Coming clean early, even when it\'s uncomfortable, consistently produces better outcomes than the alternatives. The data was the problem. The honesty was the solution.',
          score: 70,
        },
        outcome_warn: {
          heading: 'Written warning, lesson learned',
          tone: 'warn',
          result: 'Formal written warning. Mandatory retraining. Three months later, you\'re the most scrupulous person in the team about data classification. You check every tool before you use it. Your colleagues find this slightly annoying and also quite useful.',
          learning: 'The consequence of the warning is real but finite. The consequence of the cover-up would have been worse. Every step away from honesty in a data incident makes the eventual reckoning harder.',
          score: 38,
        },
        outcome_bad: {
          heading: 'The case study',
          tone: 'bad',
          result: 'Disciplinary process. Formal outcome: final written warning, demotion, mandatory retraining. The incident is referenced in the company\'s AI governance training as "Case Study F2-B." You know it\'s you. Your successor on the board prep process asks HR about the history. HR says "it\'s been addressed."',
          learning: 'The data incident was manageable. The false statement made it a conduct issue. The doubling down made it a case study. At each decision point there was a better path. The cost of not taking it compounded.',
          score: 6,
        },
      },
    }, // end pm

    // ── ANALYST ───────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene: 'analyst-desk',
          caption: 'Log entry: 14:32:08. CORP-LAP-0482. free-ai-tool.io. 847KB transferred.',
          sub_caption: 'DLP didn\'t fire. Personal browser session. You\'re the only one who\'s seen this.',
          decision: {
            prompt: 'You have twelve other alerts open. Eleven are the printer on floor 3. What do you do with this one?',
            choices: [
              { id: 'a', label: 'Cross-reference device ID, confirm the user, classify the data type', quality: 'good',
                note: 'Twenty minutes of work. You have a name, a date, and a rough data classification. Solid.' },
              { id: 'b', label: 'Flag low priority — probably a personal project, not a policy issue', quality: 'poor',
                note: 'Three weeks later you discover it was M&A data. This flag is in your record now.' },
              { id: 'c', label: 'Close the ticket. You\'ll come back to it.', quality: 'poor',
                note: 'You don\'t come back to it. Nobody does. The printer gets ticket #13.' },
            ],
          },
          branches: { a: 'n2_investigated', b: 'n2_flagged_low', c: 'outcome_bad' },
        },

        n2_investigated: {
          scene: 'analyst-desk-privacy',
          caption: 'Device registered to: Priya Sharma, Senior PM. Data volume consistent with a full slide deck.',
          sub_caption: 'You search the Q3 calendar. Board prep. Strategy deck. The timing matches exactly.',
          decision: {
            prompt: 'You have enough to escalate. Your manager says "it\'s quarter-end, Marcus — are you sure this is worth it right now?"',
            choices: [
              { id: 'a', label: 'Send a formal written incident report immediately, regardless of timing', quality: 'good',
                note: 'Creates a paper trail. When this becomes a legal matter, you are clearly on the right side of it.' },
              { id: 'b', label: 'Agree to wait a week but document your recommendation to escalate now', quality: 'partial',
                note: 'Compromise. Slightly uncomfortable. You protected yourself in writing at least.' },
              { id: 'c', label: 'Defer to your manager — they\'re probably right that it can wait', quality: 'poor',
                note: 'External counsel contacts the company four days later. Your manager does not remember this conversation the way you do.' },
            ],
          },
          branches: { a: 'n3_escalated', b: 'n3_delayed_escalation', c: 'n3_too_late' },
        },

        n2_flagged_low: {
          scene: 'analyst-desk-privacy',
          caption: 'Three weeks later, a legal hold notice arrives referencing "AI tool usage during Q3 board preparation."',
          sub_caption: 'Your low-priority flag on ticket #4471 is now exhibit A in why the organisation didn\'t catch this earlier.',
          decision: {
            prompt: 'Legal is asking what InfoSec knew and when. You need to explain ticket #4471.',
            choices: [
              { id: 'a', label: 'Pull the ticket and present it accurately — you flagged it but misjudged severity', quality: 'partial',
                note: 'Honest. The misjudgement is on record. So is the fact that you found it at all.' },
              { id: 'b', label: 'Quietly update the ticket status before Legal looks at it', quality: 'poor',
                note: 'Audit logs track ticket modifications. Legal is looking at those too.' },
            ],
          },
          branches: { a: 'n3_escalated', b: 'outcome_bad' },
        },

        n3_escalated: {
          scene: 'boardroom-crisis',
          caption: 'Legal is involved. They want to understand what controls InfoSec had and why DLP didn\'t catch this.',
          sub_caption: '"The personal browser session bypasses our corporate DLP entirely. That\'s the gap."',
          decision: {
            prompt: 'Legal asks directly: "Was this a known gap? Had it been flagged?"',
            choices: [
              { id: 'a', label: 'Accurate answer: known class of gap, not specifically flagged for this vector', quality: 'good',
                note: 'Legally precise. Technically honest. Legal notes it as "acknowledged risk, not remediated." That\'s manageable.' },
              { id: 'b', label: 'Claim you\'d flagged this previously (you hadn\'t)', quality: 'poor',
                note: 'Legal asks to see the report. There is no report. A false prior claim in an active legal matter puts you in a significantly worse position than the original log anomaly.' },
            ],
          },
          branches: { a: 'n4_gap_analysis', b: 'outcome_bad' },
        },

        n3_delayed_escalation: {
          scene: 'office-briefing',
          caption: 'You escalated a week late. Legal has the original log timestamp and your incident report timestamp.',
          sub_caption: 'The gap is seven days. Legal notes it. Your documented recommendation to escalate sooner helps.',
          decision: {
            prompt: 'The CISO asks why you waited.',
            choices: [
              { id: 'a', label: 'Explain the manager pushback honestly — and show the written recommendation', quality: 'good',
                note: 'The document you created protecting yourself now protects the whole picture. This is why you write things down.' },
              { id: 'b', label: 'Take responsibility — you should have pushed harder regardless', quality: 'partial',
                note: 'Noble. Also lets your manager off the hook entirely. The CISO would have found it interesting to know.' },
            ],
          },
          branches: { a: 'n4_gap_analysis', b: 'n4_gap_analysis' },
        },

        n3_too_late: {
          scene: 'desk-focused',
          caption: 'External counsel arrived before your incident report. Legal is doing the investigation now, not InfoSec.',
          sub_caption: 'Your manager is being asked why they advised waiting. They are not mentioning that conversation.',
          decision: {
            prompt: 'Legal asks you directly what your recommendation was when you saw the log.',
            choices: [
              { id: 'a', label: 'Tell the truth — you recommended escalating, your manager said to wait', quality: 'good',
                note: 'Uncomfortable. Accurate. Legal notes the management decision. Your position improves.' },
              { id: 'b', label: 'Cover for your manager — "we decided together to review it the following week"', quality: 'poor',
                note: 'Your manager is already telling a different story. Your stories now contradict each other.' },
            ],
          },
          branches: { a: 'n4_gap_analysis', b: 'outcome_bad' },
        },

        n4_gap_analysis: {
          scene: 'analyst-desk-privacy',
          caption: 'The CISO wants a gap analysis: what DLP covers, what it doesn\'t, and what closing the gap costs.',
          sub_caption: 'This is your wheelhouse. This is actually your job.',
          decision: {
            prompt: 'You have budget approval for one additional control. Which do you prioritise?',
            choices: [
              { id: 'a', label: 'Endpoint DLP that covers personal browser sessions', quality: 'good',
                note: 'Closes the specific gap. The CISO approves it within the week — a documented incident makes budget conversations considerably easier.' },
              { id: 'b', label: 'Block unapproved AI tool domains at the network level', quality: 'partial',
                note: 'Users switch to mobile hotspots within 48 hours. The block gets reversed. You\'re back to square one.' },
              { id: 'c', label: 'Recommend banning all external AI tools organisation-wide', quality: 'poor',
                note: 'The CEO uses Copilot for their emails. The ban lasts four hours and generates seventeen complaints.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_warn', c: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_good: {
          heading: 'The analyst who caught it',
          tone: 'good',
          result: 'The incident report, the escalation, the gap analysis, and the DLP implementation all have your name on them. The CISO presents the remediation to the board and specifically credits "the InfoSec team\'s rapid identification and structured response." The printer on floor 3 generates fourteen more false positives. You close them all.',
          learning: 'Detective controls only work if someone acts on what they find. You found it, escalated it, explained the gap honestly, and built the fix. That\'s the whole job.',
          score: 95,
        },
        outcome_warn: {
          heading: 'Incident resolved, gap partially closed',
          tone: 'warn',
          result: 'The incident is resolved. The gap analysis is on file. The network block lasted 48 hours before operations reversed it. You submit a revised proposal for endpoint DLP. Budget review is Q2. You have it in writing that the risk is acknowledged and the remediation is pending.',
          learning: 'Technical controls that create friction without solving the underlying need get bypassed immediately. The right control addresses the behaviour, not just the channel.',
          score: 55,
        },
        outcome_bad: {
          heading: 'Part of the problem',
          tone: 'bad',
          result: 'You are named in the legal hold response as someone who either missed, delayed, or mischaracterised the incident. The CISO\'s review of the InfoSec function includes a recommendation for "improved triage protocols and escalation clarity." Your annual review has a pointed section on "professional judgement under pressure."',
          learning: 'The log was the evidence. How you handled it after finding it is what determined your outcome. In incident response, the paper trail you create in the first 48 hours is the record that defines everything that follows.',
          score: 7,
        },
      },
    }, // end analyst
  }, // end trees

  // Controls summary for outcome screen
  controls_summary: [
    {
      id: 'c1', label: 'Approved AI tools register',
      effort: 'Low', owner: 'IT / Risk', go_live: true,
      context: 'Jamie had no way to know what was approved because no list existed. An accessible register — not buried in governance docs — gives staff a real basis for making the right call.',
    },
    {
      id: 'c2', label: 'Acceptable use policy for AI',
      effort: 'Low', owner: 'Legal / Risk', go_live: true,
      context: 'The policy existed — buried under "Governance 2022." For it to work, it must be communicated, acknowledged, and kept current. A policy staff cannot find is not a control.',
    },
    {
      id: 'c3', label: 'Endpoint DLP for personal browser sessions',
      effort: 'High', owner: 'InfoSec', go_live: false,
      context: 'IT had the logs. DLP would have flagged the submission at the time — or blocked it — rather than surfacing it weeks later in an audit sweep.',
    },
    {
      id: 'c4', label: 'Enterprise AI tool provisioning',
      effort: 'Medium', owner: 'IT', go_live: false,
      context: 'Jamie used a public tool because no approved alternative was available. Providing a sanctioned enterprise tool removes the incentive that drives shadow AI in the first place.',
    },
    {
      id: 'c5', label: 'Staff awareness training',
      effort: 'Low', owner: 'HR / Risk', go_live: true,
      context: 'Jamie did not know public AI tools may retain submitted data. Colleagues were guessing. Awareness training means staff understand the risk — not just that a policy exists.',
    },
  ],
};
