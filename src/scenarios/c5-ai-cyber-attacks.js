// C5 — The Convincing Email
// AI-Enabled Cyber Attacks — Business Email Compromise
//
// Differentiation from C4 (The Fabricated Call — Deepfakes):
//   C4: Real-time AV deepfake, one targeted victim, detection via AV artefacts.
//   C5: AI-generated text email, organisationally-scaled attack, detection via
//       email metadata — no AV anomalies to spot. Staff who now guard against
//       deepfake calls are targeted via the vector they stopped worrying about.
//       Controls focus is process (dual authorisation, payment policy) not
//       individual vigilance, because the email is genuinely indistinguishable
//       from legitimate correspondence.
//
// Incident anchor: Arup January 2024 ($25M deepfake call) is C4.
// C5 is grounded in the broader documented wave of AI-enhanced BEC —
// FBI IC3 2023 report: BEC losses exceeded $2.9B; AI-generated content
// now a documented attacker capability per ACSC and FBI advisories 2024.
// Amount used ($47,500) is deliberately sub-threshold to avoid dual-auth
// triggers — a documented attacker tactic.

export const scenario = {
  id:                `c5-ai-cyber-attacks`,
  risk_ref:          `C5`,
  title:             `The Convincing Email`,
  subtitle:          `AI-Enabled Business Email Compromise`,
  domain:            `C — Security & Adversarial`,
  difficulty:        `Foundational`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-c-security/c5-ai-cyber-attacks`,
  estimated_minutes: 14,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Finance Operations`,
      character: `Jamie`,
      icon:      `◇`,
      framing:   `An email from your CFO asks you to process an urgent supplier payment. It's grammatically perfect and mentions a real contract. Nothing looks wrong.`,
      premise:   `It's Thursday afternoon. An email arrives from CFO Dana Okafor. It references the Northgate Infrastructure contract — a real project you've processed payments for before. The email explains a subcontractor invoice needs to be settled today to avoid a penalty clause. The amount is $47,500. Dana's name, her correct title, even the project reference number: all accurate. She notes the payment team lead is travelling and asks you to handle it directly. She'll approve the expense report when she's back. There's a revised bank account for this payment — the supplier changed institutions last month.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Financial Officer`,
      character: `Dana`,
      icon:      `◈`,
      framing:   `A $47,500 payment left the company in your name. You sent no such instruction. Your name and a real project reference were used to make it look routine.`,
      premise:   `It's Monday morning. Your inbox shows a query from accounts payable about a $47,500 transfer processed Thursday. You have no record of requesting it. When you pull the email chain, you see it: an email from your address — except the domain has a single transposed character you'd only catch on close inspection. The email referenced the Northgate project accurately. The amount sat below your organisation's dual-authorisation threshold. Someone researched this carefully. The money is gone. You now have to manage what comes next — and decide what changes so this doesn't happen again.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Infrastructure Project Lead`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `Your project reference was used to make a fraudulent payment look legitimate. Finance is asking how the attacker knew those details.`,
      premise:   `You're the project lead on Northgate Infrastructure. On Friday afternoon, finance contacts you: a $47,500 payment was processed Thursday referencing your project, but the receiving account doesn't match your records. The subcontractor says they've received nothing. You pull your project documentation — the contract value, the penalty clause structure, the subcontractor name: all accurate in the fraudulent email. Your project status update is publicly summarised on the company website. The attacker didn't guess — they researched. Finance wants to know what project information is publicly visible and whether your communications process has any controls on payment instructions.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Security Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `Finance flagged the payment. You've pulled the email headers. The sending infrastructure tells a story the content never would have.`,
      premise:   `A $47,500 payment has been escalated to your team. The email that triggered it looked legitimate — correct name, correct title, accurate project context, no grammar errors, no urgency red flags. You open the raw email headers. The sending domain is d-a-n-a-o-k-a-f-o-r.com — not your company domain. SPF: fail. DKIM: none. The domain was registered six days ago. The sending IP has no prior reputation. Your email security gateway passed it because the content heuristics found nothing to flag. The email was, by every content measure, indistinguishable from a real one.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Jamie ─────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The email is accurate in every detail. The project reference, the penalty clause, even the subcontractor name. Nothing looks wrong.`,
          sub_caption: `Dana says the payment team lead is travelling. She's asking you to handle it directly.`,
          decision: {
            prompt: `The payment is ready to submit. The amount is $47,500 — below the threshold that requires dual sign-off. What do you do?`,
            choices: [
              { id: `a`, label: `Check the sending email address carefully before doing anything else`, quality: `good`,
                note: `One character off. You'd only see it if you looked. This is the moment the attack either works or doesn't.` },
              { id: `b`, label: `Send Dana a quick reply asking her to confirm the new bank account`, quality: `partial`,
                note: `Replying to the email asks the attacker to confirm. It's the right instinct — verify before paying — but the wrong channel.` },
              { id: `c`, label: `Process the payment. Everything checks out and the deadline is today.`, quality: `poor`,
                note: `The deadline pressure is part of the design. The email was written to make this feel like the safe, efficient choice.` },
            ],
          },
          branches: { a: `n2_checked_address`, b: `n2_replied`, c: `n2_paid` },
        },

        n2_checked_address: {
          scene:       `desk-focused`,
          caption:     `You zoom in on the sender field. The domain reads d-a-n-a-o-k-a-f-o-r.com. Your company domain is different. This email did not come from inside your organisation.`,
          sub_caption: `It would have been invisible at a glance. You caught it.`,
          decision: {
            prompt: `You've confirmed the email is fraudulent. What do you do next?`,
            choices: [
              { id: `a`, label: `Report to IT security immediately and forward the full email with headers`, quality: `good`,
                note: `Security can analyse the attack, warn others, and check whether the same campaign targeted anyone else — while the evidence is fresh.` },
              { id: `b`, label: `Call Dana directly to let her know, then wait for her to decide what to do`, quality: `partial`,
                note: `Looping in Dana is right. But the security team needs to know simultaneously — Dana can't investigate the technical side of the attack.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_replied: {
          scene:       `desk-colleague`,
          caption:     `Twenty minutes pass. A reply comes back: "Confirmed — please proceed." The reply is from the same fraudulent domain. You didn't notice.`,
          sub_caption: `You verified with the attacker. They said yes.`,
          decision: {
            prompt: `You have a reply confirming the account. The deadline is close. What now?`,
            choices: [
              { id: `a`, label: `Something feels off. Call Dana on her mobile before submitting — the number you have saved from previous payments`, quality: `good`,
                note: `You caught yourself. Thirty seconds on the phone with the real Dana ends this.` },
              { id: `b`, label: `The reply confirms it. Process the payment.`, quality: `poor`,
                note: `The confirmation came from the attacker\'s domain. You verified with the wrong person.` },
            ],
          },
          branches: { a: `n3_late_catch`, b: `outcome_bad` },
        },

        n2_paid: {
          scene:       `office-briefing`,
          caption:     `The transfer goes through. Dana posts in the all-staff channel that afternoon: "Flagging a potential phishing campaign using my name. If you\'ve received any unusual payment requests, contact security immediately."`,
          sub_caption: `She had no idea there was a real contract reference in the emails. Neither did you.`,
          decision: {
            prompt: `You realise the payment you processed this morning was fraudulent. What do you do?`,
            choices: [
              { id: `a`, label: `Contact your manager and IT security immediately — provide the email and every detail you have`, quality: `partial`,
                note: `This is the right move. Fast reporting gives the bank the best chance of flagging the transaction, even if recovery is unlikely.` },
              { id: `b`, label: `Wait to see if the bank reversal processes — raise it tomorrow if it doesn\'t`, quality: `poor`,
                note: `Every hour reduces recovery odds. Waiting doesn\'t change what happened — it only narrows the options.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n3_late_catch: {
          scene:       `desk-working`,
          caption:     `Dana answers. She has never heard of this payment request. "Do not process it. Call IT security right now."`,
          sub_caption: `You stopped it. You nearly didn\'t.`,
          decision: {
            prompt: `Payment stopped. Dana asks you to report everything to security. What do you include?`,
            choices: [
              { id: `a`, label: `Forward the full original email including headers, plus the confirmation reply and the fraudulent account details`, quality: `good`,
                note: `Headers, sending domain, account details — all of it gives security the full picture of the attack infrastructure.` },
              { id: `b`, label: `Write a brief summary of what happened and send that`, quality: `partial`,
                note: `A summary loses the technical detail in the email headers that security needs to investigate the campaign properly.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Attack detected and reported`,
          tone:    `good`,
          result:  `You caught the domain mismatch and reported immediately. Security identified two other employees who received versions of the same email. The campaign was blocked and the fraudulent domain taken down before anyone else was targeted. Your fast reporting made the difference.`,
          learning: `AI-generated phishing eliminates every content signal — grammar, formatting, personalisation. The only reliable check is the one attackers can't fake: the sending domain. One look at the sender field is the whole game.`,
          score:   100,
        },
        outcome_good: {
          heading: `Attack stopped, reporting partial`,
          tone:    `good`,
          result:  `You stopped the payment and the fraud was prevented. The delayed or incomplete report meant security had less time and less data to work with. Two other employees received variants of the campaign. One processed a smaller payment before the warning went out.`,
          learning: `Stopping the payment is the critical win. But the reporting quality matters too — full headers and artefacts let security map the whole campaign, not just the one you saw.`,
          score:   80,
        },
        outcome_warn: {
          heading: `Payment processed, loss reported quickly`,
          tone:    `warn`,
          result:  `The $47,500 transfer went through. Your immediate report gave the bank a narrow window. The transaction was flagged but recovery was not confirmed. The incident triggered a review of payment approval thresholds — the amount had been chosen specifically to sit below the dual-authorisation limit.`,
          learning: `The threshold was the attack design. Sub-threshold payments often bypass controls that would have stopped this. Verification behaviour — call the sender on a known number — has to apply regardless of amount.`,
          score:   40,
        },
        outcome_bad: {
          heading: `Payment processed, reporting delayed`,
          tone:    `bad`,
          result:  `The $47,500 is gone. The delay in reporting closed the only window for bank intervention. The post-incident review found three things: the sending domain had been registered six days earlier; your email security passed it on content quality alone; the payment sat exactly $2,500 below your dual-authorisation threshold. None of these are your fault individually — but together they describe a set of controls that failed.`,
          learning: `AI-generated phishing is indistinguishable from real email on content. The controls that actually stop it operate at the infrastructure level — email metadata checks, payment policy design, out-of-band verification. Individual vigilance matters, but it can\'t be the last line of defence.`,
          score:   10,
        },
      },
    },

    // ── EXECUTIVE — Dana ─────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `office-briefing`,
          caption:     `A $47,500 payment left the company Thursday in your name. You gave no such instruction. The email used your name, your title, and an accurate project reference.`,
          sub_caption: `The amount was $2,500 below the dual-authorisation threshold. That wasn\'t a coincidence.`,
          decision: {
            prompt: `You're looking at a confirmed fraud. What is your immediate priority?`,
            choices: [
              { id: `a`, label: `Contact the bank immediately to attempt to freeze or recover the transfer`, quality: `good`,
                note: `Recovery odds are low after 72 hours but not zero. The bank needs to know before the funds clear to the next account in the chain.` },
              { id: `b`, label: `Brief the CEO before doing anything else — this has board implications`, quality: `partial`,
                note: `The CEO needs to know, but not before the bank is contacted. Every hour matters for recovery. Internal briefings can happen in parallel.` },
              { id: `c`, label: `Ask IT security to investigate how this happened before escalating`, quality: `poor`,
                note: `Investigation is important but not the first call. The bank needs to be contacted while there\'s still a window to act.` },
            ],
          },
          branches: { a: `n2_bank_contacted`, b: `n2_ceo_first`, c: `n2_it_first` },
        },

        n2_bank_contacted: {
          scene:       `desk-focused`,
          caption:     `Bank notified. They flag the receiving account and initiate a trace. Recovery is not guaranteed — the funds have already moved once — but the window is open.`,
          sub_caption: `Now you have to deal with the internal side.`,
          decision: {
            prompt: `Bank is working on it. You now need to decide what changes so this doesn\'t happen again. The amount was deliberately chosen to sit below dual-auth thresholds. What do you address first?`,
            choices: [
              { id: `a`, label: `Lower the dual-authorisation threshold and require out-of-band verification for any new or changed payment account`, quality: `good`,
                note: `These are the two process gaps the attacker exploited. Both are fixable in days without new technology.` },
              { id: `b`, label: `Commission a full cyber security review before making any policy changes`, quality: `partial`,
                note: `A review is appropriate — but the two specific gaps are already visible. Waiting for the review to close them creates unnecessary exposure.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_ceo_first: {
          scene:       `boardroom`,
          caption:     `The CEO is briefed. He asks why the bank hasn\'t been called yet. You call now — 40 minutes after the Monday morning discovery.`,
          sub_caption: `The window narrowed, but it isn\'t closed.`,
          decision: {
            prompt: `Bank is now notified. They\'re looking. The CEO asks what you\'re changing to prevent a recurrence. What\'s your answer?`,
            choices: [
              { id: `a`, label: `Lower the payment approval threshold and mandate out-of-band verification for any payment to a new or changed account`, quality: `good`,
                note: `Process controls are the right answer here. They don\'t rely on individuals spotting a nearly-invisible domain mismatch.` },
              { id: `b`, label: `Commit to a company-wide phishing awareness campaign`, quality: `partial`,
                note: `Training has value, but it puts the burden on individuals to detect something AI has made undetectable on content alone. Process controls are more robust.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_it_first: {
          scene:       `analyst-desk`,
          caption:     `IT security starts the investigation. Ninety minutes pass. The bank is eventually contacted — but Monday morning is now nearly over.`,
          sub_caption: `The funds have moved to a second account. The trace is harder now.`,
          decision: {
            prompt: `The investigation is running but the recovery window has narrowed significantly. What do you tell the board?`,
            choices: [
              { id: `a`, label: `Full transparency: the fraud, the sequence of events, the process gaps, and what changes immediately`, quality: `good`,
                note: `Boards need accurate information to provide oversight. Early transparency also protects you personally.` },
              { id: `b`, label: `Provide a summary now, full detail after the investigation completes`, quality: `partial`,
                note: `Reasonable — but if the investigation takes weeks, the board is operating without the information they need to exercise oversight.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Fast response, systemic fix`,
          tone:    `good`,
          result:  `The bank flagged the account and partial recovery was initiated. The dual-authorisation threshold was lowered within the week and out-of-band verification was mandated for any new payment destination. The same campaign targeted two other organisations in your sector — neither had updated their controls and both lost money.`,
          learning: `BEC fraud below approval thresholds is a documented attacker tactic. The fix isn\'t better vigilance — it\'s process design that doesn\'t give attackers a gap to aim at.`,
          score:   100,
        },
        outcome_good: {
          heading: `Recovery attempted, control gap partly addressed`,
          tone:    `good`,
          result:  `Bank notified, trace initiated. Recovery uncertain. Control changes were partially implemented — threshold lowered, but out-of-band verification was deferred pending a wider review. The review took six weeks. During that window, a second attempt against a different employee was narrowly stopped by the employee\'s own instinct.`,
          learning: `Partial controls leave partial gaps. The out-of-band verification requirement for new payment accounts is the single most effective control — it costs nothing to implement and breaks the attack entirely.`,
          score:   75,
        },
        outcome_warn: {
          heading: `Delayed response, recovery window closed`,
          tone:    `warn`,
          result:  `The bank was contacted too late. The funds moved through two accounts before the trace caught up. Loss confirmed at $47,500. The board received a full briefing and committed to a control review. The review identified the threshold gap that had been visible from the start.`,
          learning: `In BEC fraud, every hour after a transfer reduces recovery odds. The bank contact is always the first call — internal briefings run in parallel, not before.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Recovery failed, board without information`,
          tone:    `bad`,
          result:  `Funds unrecoverable. The board was briefed late and with incomplete information. The investigation eventually identified three control failures: email security relying on content signals, the payment threshold gap, and no out-of-band verification requirement. All three were known risk patterns before the incident.`,
          learning: `This was a foreseeable attack against foreseeable gaps. The gaps weren\'t unknown — they were unactioned. Executive response to cyber incidents requires the bank call first, board briefing simultaneously, and control changes immediately — not after the investigation completes.`,
          score:   10,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ─────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `The fraudulent email referenced your project accurately: contract name, penalty clause structure, subcontractor. Finance wants to know how the attacker knew this.`,
          sub_caption: `Your project status update has been on the company website for three months.`,
          decision: {
            prompt: `Finance is asking what project information is publicly visible and whether your team has any controls on payment instructions. What\'s your first step?`,
            choices: [
              { id: `a`, label: `Audit what project information is publicly accessible — website, LinkedIn, press releases, partner announcements`, quality: `good`,
                note: `You can\'t fix the exposure until you know its scope. The attacker harvested this from somewhere — finding that source is the starting point.` },
              { id: `b`, label: `Tell finance this isn\'t a project management issue — the fraud was in the payment process`, quality: `poor`,
                note: `The project details were what made the email credible. The payment process failed, but your public information was the attacker\'s raw material.` },
              { id: `c`, label: `Ask your communications team to take down the project page immediately`, quality: `partial`,
                note: `Reducing exposure is right. But taking things down without understanding what else is visible first may leave other sources intact.` },
            ],
          },
          branches: { a: `n2_audit`, b: `n2_deflect`, c: `n2_takedown` },
        },

        n2_audit: {
          scene:       `desk-working`,
          caption:     `You find it quickly. The company website has a project update with the contract name, the subcontractor relationship, and a note about the penalty clause structure. It went up three months ago for a client announcement.`,
          sub_caption: `Everything the attacker needed was there. It took you four minutes to find.`,
          decision: {
            prompt: `You\'ve identified the source. What do you recommend to the CFO?`,
            choices: [
              { id: `a`, label: `Limit project-specific financial detail in public communications — contract structures and subcontractor relationships shouldn\'t be public`, quality: `good`,
                note: `This is the structural fix. Not all project information should be public — especially financial structure details that make social engineering precise.` },
              { id: `b`, label: `Implement a payment instruction control: any new or changed bank account must be verified via phone before a payment is processed`, quality: `good`,
                note: `This is the process fix. Even if attackers have perfect context, an out-of-band verification requirement breaks the attack at the last step.` },
              { id: `c`, label: `Recommend both — restrict public financial detail and mandate out-of-band verification for changed accounts`, quality: `good`,
                note: `Both are right and neither is sufficient alone. Restricting information reduces the attack surface; the verification control catches what still gets through.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_good`, c: `outcome_great` },
        },

        n2_deflect: {
          scene:       `office-meeting`,
          caption:     `Finance escalates to the CFO. The CFO pulls you into the review anyway. The question is now on record: did your team contribute to this exposure?`,
          sub_caption: `Your project update page is still publicly visible.`,
          decision: {
            prompt: `You\'re now in the review meeting. The source of the attacker\'s information has been identified as your public project page. What do you say?`,
            choices: [
              { id: `a`, label: `Acknowledge the exposure, explain how it happened, and propose what changes`, quality: `good`,
                note: `Taking ownership and proposing solutions is the right response. The CFO needs a path forward, not a defence.` },
              { id: `b`, label: `Argue that the public page is standard practice and not your decision to publish`, quality: `poor`,
                note: `It may be standard practice. That doesn\'t mean it\'s right. Standard practice is precisely what this attack was designed to exploit.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_takedown: {
          scene:       `desk-intranet`,
          caption:     `The page is down. But the cached version is still indexed on Google. And the original press release is on two other sites. The information is still out there.`,
          sub_caption: `You\'ve reduced visibility but not eliminated it.`,
          decision: {
            prompt: `The original source is harder to unpublish than expected. What do you recommend as the practical control?`,
            choices: [
              { id: `a`, label: `Focus on the payment process — mandate out-of-band verification for any changed account, regardless of how credible the request looks`, quality: `good`,
                note: `Information suppression is imperfect — cached, scraped, shared. A process control that works even when attackers have accurate information is more robust.` },
              { id: `b`, label: `Continue trying to remove the information from all sources before recommending other changes`, quality: `partial`,
                note: `Removing the information has value but takes time and is rarely complete. The payment process needs fixing now, in parallel.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Root cause identified, both gaps closed`,
          tone:    `good`,
          result:  `You identified the public information source in four minutes and recommended both fixes: restricting financial detail from public project communications, and mandating out-of-band verification for changed payment accounts. Both were implemented within the month. The CFO noted in the incident review that your response had moved faster than the security team.`,
          learning: `AI-enhanced BEC is a research attack. The attacker spent time finding accurate context to make the email credible. Reducing that context and adding a verification step that works regardless of context are the two controls that matter.`,
          score:   100,
        },
        outcome_good: {
          heading: `One gap addressed`,
          tone:    `good`,
          result:  `You identified the public information exposure and recommended a fix. One of the two controls was implemented quickly. The other was deferred to a broader review. Three months later, a second attempt hit a different project — the partial control slowed it down but didn\'t stop it entirely.`,
          learning: `Both controls work together. Reducing the attacker\'s information advantage makes emails less credible. The out-of-band verification requirement catches the ones that still get through.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Exposure identified late, response reactive`,
          tone:    `warn`,
          result:  `The public information source was identified only after you were pulled into the formal review. Recommendations were made but the pace was slower than the threat warranted. The incident review noted that the exposure had been visible for three months before it was exploited.`,
          learning: `Proactive information exposure audits — checking what\'s publicly visible about financial relationships and project structures — are a low-cost control with asymmetric value. By the time an attacker uses the information, it\'s too late to take it down.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Exposure unaddressed, accountability avoided`,
          tone:    `bad`,
          result:  `The public information remained visible. No project communication controls were implemented. Six months later, the same attacker infrastructure was used against a different project in your portfolio. This time the payment was larger and the dual-authorisation threshold had not been lowered.`,
          learning: `Deflecting accountability doesn\'t change the exposure. Standard practice in public project communications was designed before AI made every publicly visible detail usable as a social engineering asset. The practice needs to change.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `The email that triggered a $47,500 transfer passed every content check. Perfect grammar. Accurate context. No urgency red flags. But the headers tell a different story.`,
          sub_caption: `SPF: fail. DKIM: none. Domain registered six days ago. The email security gateway saw none of this.`,
          decision: {
            prompt: `You\'re looking at a content-perfect phishing email that bypassed your email security. What\'s the most important finding to document first?`,
            choices: [
              { id: `a`, label: `The email security gateway is configured to weight content signals — grammar, formatting, keywords — over metadata signals like SPF and domain age`, quality: `good`,
                note: `This is the structural failure. Content-based detection is now obsolete for AI-generated phishing. The gateway needs reconfiguring, not just updating.` },
              { id: `b`, label: `The fraudulent domain was registered six days before the attack — threat intelligence would have flagged it`, quality: `partial`,
                note: `True, and worth documenting. But it\'s a symptom of the same root cause: the gateway wasn\'t checking the signals that still work.` },
              { id: `c`, label: `The employee should have checked the sender domain — include this in the incident report`, quality: `poor`,
                note: `The employee could have caught it. But a gateway that properly checks metadata would have stopped it before it reached any inbox. Individual detection shouldn\'t be the primary control.` },
            ],
          },
          branches: { a: `n2_structural`, b: `n2_intel`, c: `n2_user_blame` },
        },

        n2_structural: {
          scene:       `desk-focused`,
          caption:     `You\'ve identified the root cause. The gateway is tuned for content anomalies that AI now eliminates. It passed a syntactically perfect email with a six-day-old sending domain.`,
          sub_caption: `The question is: how quickly can this be reconfigured, and what does that look like?`,
          decision: {
            prompt: `You\'re writing the remediation recommendation. What do you prioritise?`,
            choices: [
              { id: `a`, label: `Shift gateway weighting to metadata signals: SPF/DKIM/DMARC alignment, domain age, sending infrastructure reputation, display name mismatch detection`, quality: `good`,
                note: `These are the signals AI-generated content can\'t fake. This is the technical fix.` },
              { id: `b`, label: `Recommend the organisation deploy a new AI-powered email security product`, quality: `partial`,
                note: `Possibly the right long-term move, but it takes months to procure and deploy. The existing gateway can be reconfigured now to weight the right signals.` },
            ],
          },
          branches: { a: `n3_recommend`, b: `outcome_good` },
        },

        n2_intel: {
          scene:       `desk-working`,
          caption:     `You check your threat intelligence feeds. The sending domain and IP appear in two advisories from the past week. Your gateway wasn\'t subscribed to those feeds.`,
          sub_caption: `The intelligence existed. Your tooling didn\'t have it.`,
          decision: {
            prompt: `You\'ve found the intelligence gap. What\'s the broader recommendation?`,
            choices: [
              { id: `a`, label: `Subscribe the gateway to relevant threat intel feeds AND shift detection weighting from content to metadata signals`, quality: `good`,
                note: `Intelligence feeds catch known infrastructure. Metadata signal weighting catches novel infrastructure. Both are needed — they address different parts of the attack surface.` },
              { id: `b`, label: `Subscribe to threat intel feeds — that would have caught this one`, quality: `partial`,
                note: `It would have caught this specific attack. But the next campaign will use fresh infrastructure not yet in any feed. The metadata weighting fix addresses the structural problem.` },
            ],
          },
          branches: { a: `n3_recommend`, b: `outcome_warn` },
        },

        n2_user_blame: {
          scene:       `office-meeting`,
          caption:     `Your draft report includes a finding about the employee\'s behaviour. Your manager reads it and asks: "If we\'d checked the SPF record, would this email have reached any inbox at all?"`,
          sub_caption: `No. It wouldn\'t have.`,
          decision: {
            prompt: `Your manager has identified the real gap. How do you revise the report?`,
            choices: [
              { id: `a`, label: `Reframe: root cause is gateway configuration, not user behaviour. User behaviour is a contributing factor, not the primary failure.`, quality: `good`,
                note: `Accurate framing matters for remediation. If the report blames users, the fix will be more training. If it blames the gateway, the fix will be better controls.` },
              { id: `b`, label: `Keep both findings equally weighted — the user and the gateway both failed`, quality: `partial`,
                note: `Both did fail. But the gateway failure is structural and preventable; the user failure is downstream of a control gap. Equal weighting produces a weaker remediation.` },
            ],
          },
          branches: { a: `n3_recommend`, b: `outcome_warn` },
        },

        n3_recommend: {
          scene:       `office-bright`,
          caption:     `Your report is clear: the gateway needs reconfiguring. You\'ve identified the specific signals to weight up and the content heuristics to deprioritise. Now you need to decide how to present the finding.`,
          sub_caption: `Security leadership will need to approve the change. Finance will want to know the risk is contained.`,
          decision: {
            prompt: `How do you present the gateway reconfiguration recommendation to leadership?`,
            choices: [
              { id: `a`, label: `Lead with the specific gap — content heuristics can\'t detect AI-generated phishing — and provide the reconfiguration spec with expected detection improvement`, quality: `good`,
                note: `Leadership needs to understand why the change is needed, not just what to do. The detection improvement data makes the case for acting quickly.` },
              { id: `b`, label: `Lead with the incident cost ($47,500) and recommend a full email security product replacement`, quality: `partial`,
                note: `Cost framing gets attention. But a product replacement takes months. The reconfiguration fix is available now and addresses the specific failure mode.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Root cause identified, structural fix recommended clearly`,
          tone:    `good`,
          result:  `Your report correctly identified the gateway configuration as the structural failure. The reconfiguration was approved and deployed within two weeks. Detection testing against AI-generated phishing samples improved significantly. Your report was used as the basis for an industry information-sharing submission through FS-ISAC.`,
          learning: `AI-generated phishing has made content-based email detection obsolete. Metadata signals — SPF alignment, domain age, sending infrastructure reputation — are what AI can\'t fake. Shifting detection to these signals is the technical fix. It\'s available now, without new tooling.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct diagnosis, slower remediation`,
          tone:    `good`,
          result:  `The root cause was correctly identified. The recommended fix was either partially implemented or delayed by procurement timelines. Detection improved but the full reconfiguration took longer than it needed to. A second campaign hit the organisation two months later and was caught — but only because the threat intel feeds had been updated.`,
          learning: `The gateway reconfiguration is faster than a product replacement and addresses the same structural gap. When you have an available fix and a known failure mode, the fastest path to the specific fix is usually better than the most comprehensive path to a new solution.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Partial diagnosis, incomplete remediation`,
          tone:    `warn`,
          result:  `The threat intelligence gap was closed but the underlying gateway configuration was not addressed. The next attacker used fresh infrastructure — not in any feed — with an equally perfect AI-generated email. It bypassed the gateway again. The incident review noted that the first incident\'s remediation had been incomplete.`,
          learning: `Threat intelligence catches known infrastructure. It doesn\'t address the detection architecture that passed a perfect email with a six-day-old domain. Both fixes are needed — intelligence feeds for breadth, metadata signal weighting for depth.`,
          score:   35,
        },
        outcome_bad: {
          heading: `User blamed, structural gap unaddressed`,
          tone:    `bad`,
          result:  `The report recommended additional phishing awareness training. Training was completed across the organisation. Three months later, a second campaign succeeded against a different employee who had completed the training. The gateway passed it. The post-incident review found the gateway configuration had never been changed.`,
          learning: `Training teaches people to look for signals that AI-generated phishing no longer contains. It can\'t fix a gateway that doesn\'t check the signals that still work. When a control gap exists at the infrastructure level, training is not the remediation.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:       `c1`,
      label:    `Out-of-band verification for payment instructions`,
      effort:   `Low`,
      owner:    `Finance / Operations`,
      go_live:  true,
      context:  `The fraud succeeded because the email was the only verification channel used. A requirement to verify any new or changed payment account via phone — to a number already on file, not one in the email — breaks the attack at the final step regardless of how credible the email appears.`,
    },
    {
      id:       `c2`,
      label:    `Email security signal reconfiguration`,
      effort:   `Medium`,
      owner:    `Security / IT`,
      go_live:  false,
      context:  `The email security gateway passed a syntactically perfect email from a six-day-old domain with no SPF or DKIM. Content heuristics are obsolete for AI-generated phishing. Metadata signals — domain age, SPF/DKIM/DMARC alignment, sending infrastructure reputation — are what AI can\'t fake.`,
    },
    {
      id:       `c3`,
      label:    `Payment approval threshold review`,
      effort:   `Low`,
      owner:    `Finance`,
      go_live:  false,
      context:  `The $47,500 amount was chosen to sit below the dual-authorisation threshold. Thresholds designed before AI-enhanced BEC should be reviewed — lower thresholds or risk-based triggers (new payee, changed account) are more appropriate than fixed amounts.`,
    },
    {
      id:       `c4`,
      label:    `Public information exposure audit`,
      effort:   `Low`,
      owner:    `Communications / Project Leads`,
      go_live:  false,
      context:  `The attacker used accurate project details harvested from the company website. Financial relationship details — contract structures, subcontractor names, penalty clauses — in public project communications create the raw material for precision social engineering.`,
    },
  ],
};
