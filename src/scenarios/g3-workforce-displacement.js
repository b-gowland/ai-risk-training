// G3 — The Redundancy Leak
// AI-Driven Workforce Displacement
//
// Setting: A financial services firm deploys an AI system automating a significant
// portion of mortgage processing work. 25 of 40 staff face redundancy. They find
// out through a media leak before any internal communication.
//
// Differentiation from all live scenarios:
//   Every other scenario involves harm to customers, data, or systems.
//   This is the only scenario where the harm is to employees — the people
//   inside the organisation. No technical failure. No bad actor. The AI worked
//   exactly as intended. The failure is entirely in governance and communication.
//   Different emotional register: personal, consequential, trust-destroying.
//   The learning is about process obligations and human dignity, not controls.

export const scenario = {
  id:                `g3-workforce-displacement`,
  risk_ref:          `G3`,
  title:             `The Redundancy Leak`,
  subtitle:          `AI-Driven Workforce Displacement`,
  domain:            `G — Systemic & Societal`,
  difficulty:        `Foundational`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-g-systemic/g3-workforce-displacement`,
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Mortgage Processing Specialist`,
      character: `Sam`,
      icon:      `◇`,
      framing:   `You've worked in mortgage processing for six years. You just read a news article saying your firm is cutting 25 roles in your team because of an AI system. This is the first you've heard of it.`,
      premise:   `It's Tuesday morning. A colleague sends you a link to a Financial Review article: "Lenders deploy AI to slash processing headcount." The firm is named. The number quoted is 25. Your team has 40 people. You check your email. Nothing from management. You check the intranet. Nothing. You open Slack. Your colleagues are posting the article with question marks. Your manager is online but hasn't said anything. HR's status shows as busy. You have a mortgage processing queue of 47 applications in front of you. You don't know if your role is one of the 25.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Operating Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The media got the story before your staff did. 40 people in mortgage processing found out about potential redundancies from a news article. Your phone hasn't stopped.`,
      premise:   `It's 7:42am. Your Chief of Staff has sent three messages. The Financial Review has published a story about the AI deployment and the headcount reduction — accurately, including the 25 figure, which came from a board paper. You haven't spoken to the affected team yet. The internal communication was planned for Thursday. HR's consultation process was scheduled to begin next week. The affected staff have now had 40 minutes to read the article, talk to each other, and form conclusions without any information from you. Your CEO has just called.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Transformation Programme Lead`,
      character: `Priya`,
      icon:      `◎`,
      framing:   `You led the AI deployment. You knew about the headcount impact for three months. The communication plan was HR\'s responsibility. You assumed it was under control.`,
      premise:   `You've been running the mortgage automation programme for eight months. The AI system went live four weeks ago — on time, under budget, exceeding performance targets. Three months ago, the workforce impact assessment confirmed 25 roles would be affected. You flagged it to HR and assumed the communication planning was in hand. You didn't check. This morning's article has named the programme explicitly. Journalists have your LinkedIn profile. HR is in crisis mode. The CEO wants to know why affected staff weren't told before the press was.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `People & Culture Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You prepared the workforce impact assessment three months ago. It recommended an eight-week consultation period starting six weeks before go-live. The AI system went live four weeks ago. The consultation never started.`,
      premise:   `Your workforce impact assessment was clear: 25 roles affected, consultation required under the Fair Work Act, eight-week minimum consultation period, communication to affected staff before any public announcement. The assessment was submitted three months ago. You followed up once, six weeks ago, and were told the communication plan was being finalised. You assumed it was in hand. The system went live four weeks ago. This morning you're reading a news article about the deployment. The consultation never happened. You're now being asked to confirm whether the firm has a Fair Work Act exposure.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Sam ───────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `news-leak`,
          caption:     `A news article. 25 roles. Your team. No word from management. Your colleagues are in the Slack channel right now, reading the same thing.`,
          sub_caption: `Your manager is online. They haven't said anything.`,
          decision: {
            prompt: `Your colleagues are asking in Slack if anyone knows more. What do you do?`,
            choices: [
              { id: `a`, label: `Message your manager directly and ask for an urgent conversation`, quality: `good`,
                note: `Going directly to your manager is the right channel. It gets you accurate information faster than speculation and signals you're handling this professionally.` },
              { id: `b`, label: `Post in the Slack channel — your colleagues deserve to know you're in the same position`, quality: `partial`,
                note: `Your instinct to support colleagues is right. But adding to the public channel before getting facts from management is likely to amplify anxiety rather than help.` },
              { id: `c`, label: `Keep your head down and process your queue — if something was happening you'd have been told`, quality: `poor`,
                note: `You have been told — by a journalist. Continuing as if nothing has happened doesn't resolve the uncertainty and leaves you without information you need.` },
            ],
          },
          branches: { a: `n2_manager_contact`, b: `n2_slack_post`, c: `n2_head_down` },
        },

        n2_manager_contact: {
          scene:       `office-meeting`,
          caption:     `Your manager responds immediately: "I know. I'm waiting for something from HR to send you. I'm sorry you saw it this way."`,
          sub_caption: `They're in the same position — waiting for information from above.`,
          decision: {
            prompt: `Your manager confirms the article is accurate but doesn't yet have details on who is affected. What do you do while you wait?`,
            choices: [
              { id: `a`, label: `Ask your manager what the process looks like from here — what should you expect and when`, quality: `good`,
                note: `Understanding the process gives you something concrete to hold onto. It also signals to your manager that you want to engage constructively, which matters.` },
              { id: `b`, label: `Ask your manager directly whether your role is one of the 25`, quality: `partial`,
                note: `Completely understandable. But your manager almost certainly doesn\'t know yet — and putting them in that position without HR guidance may not get you useful information.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_slack_post: {
          scene:       `desk-colleague`,
          caption:     `You post that you're in the same position as everyone else — no word from management. Within ten minutes, eleven people have replied. Three have said they're calling their union rep. Two have said they're contacting Fair Work.`,
          sub_caption: `The channel is now a live anxiety forum. Management is watching it.`,
          decision: {
            prompt: `The channel is escalating fast. Your manager has just messaged you privately asking you to encourage people to wait for an official communication. What do you do?`,
            choices: [
              { id: `a`, label: `Post in the channel that official communication is coming and suggest people direct questions to their manager directly`, quality: `good`,
                note: `You can help contain the situation without asking people to simply accept the silence. Directing to managers is more productive than a group speculation thread.` },
              { id: `b`, label: `Tell your manager you can\'t ask people to wait — they found out from a newspaper`, quality: `partial`,
                note: `Fair point, and not wrong. But declining to help without offering an alternative leaves the channel to escalate further, which doesn\'t serve you or your colleagues.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_head_down: {
          scene:       `desk-working`,
          caption:     `You process three applications. At 10am, HR sends a calendar invite for an all-hands at 11am. Subject: "Important Update — Mortgage Processing Team."`,
          sub_caption: `Three hours after the article. Your colleagues have been speculating for three hours.`,
          decision: {
            prompt: `The all-hands is in an hour. How do you approach it?`,
            choices: [
              { id: `a`, label: `Attend and ask directly: why did staff find out from the press before management told us?`, quality: `good`,
                note: `A legitimate question that deserves a direct answer. Asking it in the meeting is appropriate — it\'s what most of the room wants to know.` },
              { id: `b`, label: `Attend and say nothing — wait to see what they tell you before reacting`, quality: `partial`,
                note: `Reasonable approach. But if everyone takes this position, the all-hands becomes a broadcast without the feedback the organisation needs to hear.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Information sought through the right channel`,
          tone:    `good`,
          result:  `You connected with your manager early and got clarity on the process. When the official communication came two hours later, you already had context that helped you process it constructively. Your manager noted that you were the first person on the team to handle the morning professionally — which mattered when the consultation process began.`,
          learning: `When significant news arrives through the wrong channel, your job is to get accurate information through the right channel — as quickly as possible. Speculation fills the vacuum; a conversation with your manager empties it.`,
          score:   100,
        },
        outcome_good: {
          heading: `Direct question, process clarity`,
          tone:    `good`,
          result:  `Your manager didn\'t have the answer to your specific question but confirmed the consultation process would clarify individual positions. The all-hands followed two hours later. You had more context than most of your colleagues when it started.`,
          learning: `Asking your manager directly is always the right first move after significant news like this. They may not have all the answers — but they have more than the Slack channel.`,
          score:   75,
        },
        outcome_warn: {
          heading: `Channel escalated, situation harder`,
          tone:    `warn`,
          result:  `The Slack channel became a significant issue for management — HR tracked it carefully and it was referenced in the post-incident review as evidence of how damaging the communication failure was. You were mentioned by name as an early contributor. Your individual outcome was the same as everyone else\'s — but your association with the channel\'s escalation coloured the early consultation conversations.`,
          learning: `In a high-stakes communication failure, the Slack channel is not a good place to process uncertainty collectively. It feels supportive but it amplifies anxiety and creates a record that outlasts the moment.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Passive response, three hours of uncertainty absorbed`,
          tone:    `bad`,
          result:  `You processed applications for three hours while your colleagues speculated around you. When the all-hands came, you had no information and no clarity. The consultation process that followed was the same for everyone — but you spent three hours in unnecessary uncertainty that a single message to your manager would have partially resolved.`,
          learning: `Finding out about major changes from the press is a serious governance failure — but it doesn\'t change your ability to seek information through the right channels. Waiting passively maximises the time you spend in uncertainty.`,
          score:   20,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `40 people read about their potential redundancy in a newspaper. The internal communication was planned for Thursday. It is Tuesday. Your CEO is on the phone.`,
          sub_caption: `The AI system is working perfectly. The governance around its deployment is not.`,
          decision: {
            prompt: `You\'re on with the CEO. She asks what you\'re doing in the next 60 minutes. What do you tell her?`,
            choices: [
              { id: `a`, label: `Convene an emergency all-hands for the affected team within the hour — they need to hear from leadership now, not Thursday`, quality: `good`,
                note: `Every minute the team spends with the newspaper story as their only information source makes the trust damage worse. The Thursday plan is obsolete. This needs to happen now.` },
              { id: `b`, label: `Get HR to send an immediate email acknowledging the article and confirming official communication is coming`, quality: `partial`,
                note: `Better than silence. But an email from HR is not leadership communication — it confirms management knows but isn\'t engaging directly with the impact on people.` },
              { id: `c`, label: `Find out who leaked the story before doing anything else`, quality: `poor`,
                note: `The leak investigation matters — but not in the next 60 minutes. 40 people are sitting in uncertainty right now. The leak is a yesterday problem. This is today\'s problem.` },
            ],
          },
          branches: { a: `n2_allhands`, b: `n2_email`, c: `n2_leak_hunt` },
        },

        n2_allhands: {
          scene:       `office-meeting`,
          caption:     `You\'re in front of the team within 45 minutes. The room is quiet in a way that makes clear people are angry, not calm.`,
          sub_caption: `You don\'t have all the answers. You do have a room full of people who need to hear something true.`,
          decision: {
            prompt: `What do you lead with?`,
            choices: [
              { id: `a`, label: `An apology — finding out from the press is not acceptable. Then what you know, what you don\'t, and exactly what happens next`, quality: `good`,
                note: `The apology has to come first. It doesn\'t fix what happened but it\'s the only honest way to open. Then substance: facts, timeline, process. In that order.` },
              { id: `b`, label: `What you know about the programme — the business rationale, the AI performance, the investment in the technology`, quality: `poor`,
                note: `This is the wrong sequence entirely. The room doesn\'t need a technology briefing. They need acknowledgement that how this happened was wrong, and then clarity on what it means for them.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_warn` },
        },

        n2_email: {
          scene:       `office-briefing`,
          caption:     `HR sends the email at 9:15am. By 9:30am, three union reps have called. Two employment lawyers have been contacted by staff. The Fair Work question is now on the table.`,
          sub_caption: `The email acknowledged the article. It didn\'t say anything that materially helped anyone.`,
          decision: {
            prompt: `The email hasn\'t stopped the escalation. What now?`,
            choices: [
              { id: `a`, label: `Get in front of the team personally — the email was a holding measure, not a response`, quality: `good`,
                note: `Correct pivot. The email bought a small amount of time. Use it to get a real communication together. The team needs you in the room, not another email.` },
              { id: `b`, label: `Let HR manage the process from here — this is an employment matter now`, quality: `poor`,
                note: `HR manages the process. Leadership owns the relationship. Stepping back at this moment sends exactly the wrong signal about how much the organisation values the affected people.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },

        n2_leak_hunt: {
          scene:       `boardroom`,
          caption:     `Legal is investigating. The leak almost certainly came from the board paper distribution. That investigation will take days. Meanwhile, the mortgage processing team has now been in uncertainty for 90 minutes.`,
          sub_caption: `You\'ve spent 90 minutes on the wrong problem.`,
          decision: {
            prompt: `Legal has the leak investigation. The team is still waiting. What now?`,
            choices: [
              { id: `a`, label: `Get in front of the team now — 90 minutes late is better than waiting for the leak investigation to conclude`, quality: `good`,
                note: `Correct. The leak investigation doesn\'t change what the team needs to hear. Go now.` },
              { id: `b`, label: `Send the Thursday communication today — the content is ready, just move it forward`, quality: `partial`,
                note: `Moving Thursday\'s communication to today is better than waiting. But a document prepared for a managed process is not the same as a genuine leadership response to a trust crisis.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Immediate honest communication, trust partially restored`,
          tone:    `good`,
          result:  `The all-hands was hard but it happened. Your apology was received with silence, then questions. You answered what you could and were honest about what you didn\'t know. The formal consultation process began the following day. Two staff subsequently told HR it was the first time they\'d seen senior leadership own a mistake directly. The Fair Work exposure was real — but the consultation process, once started, was genuine.`,
          learning: `When a communication failure of this magnitude occurs, the first response has to be personal, direct, and honest. An apology followed by substance is the only credible path. Everything else extends the damage.`,
          score:   100,
        },
        outcome_good: {
          heading: `Late response, right direction`,
          tone:    `good`,
          result:  `The in-person communication happened — later than it should have, and after an email that didn\'t help. Trust was partially restored. The consultation process was genuine. The Fair Work exposure was managed. The post-incident review noted that the email created a window where escalation happened that direct leadership communication would have prevented.`,
          learning: `In a workforce communication crisis, email is a holding measure at best. Leadership presence is what rebuilds trust. The sooner it happens, the less damage accumulates.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Wrong sequence, trust damage extended`,
          tone:    `warn`,
          result:  `The all-hands happened but led with the wrong content. The apology came eventually — at the end, after the business rationale. By then the room had hardened. Several staff formally engaged union representatives during the meeting. The consultation process that followed was adversarial rather than constructive. The Fair Work exposure was managed but at significant cost.`,
          learning: `In a communication failure involving people\'s livelihoods, the sequence matters as much as the content. Business rationale before apology tells people that the organisation\'s interests come before theirs. That perception, once formed, is hard to shift.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Leadership absent, trust destroyed`,
          tone:    `bad`,
          result:  `HR managed the process. Two formal Fair Work complaints were lodged. The consultation process was conducted under legal scrutiny throughout. Seven of the 25 affected staff resigned before the redundancy process completed — taking their institutional knowledge with them and forfeiting redundancy entitlements they would otherwise have received. The post-incident review found that leadership absence in the critical first hours was the single most damaging factor.`,
          learning: `AI-driven workforce displacement is a human event, not a technology event. The people affected are owed direct engagement from the leaders who made the decision. Delegating that engagement to HR is not neutrality — it is a choice with consequences.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Priya ───────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The programme delivered. The AI is working. 25 people found out about their potential redundancy from a journalist. The workforce impact assessment you commissioned three months ago recommended consultation start six weeks before go-live.`,
          sub_caption: `The AI went live four weeks ago. Consultation never started.`,
          decision: {
            prompt: `The COO asks why the consultation process wasn\'t running before go-live. What do you tell them?`,
            choices: [
              { id: `a`, label: `You flagged the workforce impact three months ago and handed it to HR. You should have confirmed it was actioned — you didn\'t. That\'s a gap in your programme governance.`, quality: `good`,
                note: `Accurate and complete. The handoff to HR was right. The failure to confirm it was actioned was yours. Owning that is the honest account.` },
              { id: `b`, label: `HR was responsible for the communication plan. You delivered your part — the impact assessment. The communication failure is theirs.`, quality: `partial`,
                note: `HR did own the communication plan. But the consultation timeline was a dependency of your programme — if it wasn\'t met, the programme had a governance gap. You were the programme lead.` },
              { id: `c`, label: `The programme had a hard delivery deadline. Delaying go-live for the consultation process would have cost the programme its business case.`, quality: `poor`,
                note: `This answer prioritises the programme\'s commercial success over the legal and ethical obligation to consult. That\'s not a defence — it\'s the problem.` },
            ],
          },
          branches: { a: `n2_owns`, b: `n2_deflects`, c: `n2_justifies` },
        },

        n2_owns: {
          scene:       `office-bright`,
          caption:     `The COO accepts the account. She asks what you would change in the programme governance structure to ensure this can\'t happen again.`,
          sub_caption: `She\'s not asking for an apology. She\'s asking for a fix.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: `a`, label: `Workforce consultation completion should be a hard dependency gate before any AI programme go-live — same as legal sign-off or security sign-off. Not an HR workstream running in parallel.`, quality: `good`,
                note: `This is the structural fix. Treating consultation as a parallel workstream means it can slip without blocking delivery. Making it a gate means it can\'t.` },
              { id: `b`, label: `A weekly cross-functional check-in between programme management and HR for any deployment with workforce impact`, quality: `partial`,
                note: `Better than nothing. But a check-in can be missed or deprioritised. A gate is technically enforced — the programme can\'t close without evidence consultation is complete.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_deflects: {
          scene:       `boardroom`,
          caption:     `The COO notes that the workforce impact assessment — your document — specified consultation should begin six weeks before go-live. The programme went live four weeks ago. She asks whether you were aware the timeline had been missed.`,
          sub_caption: `You were. You assumed HR had handled it.`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge you were aware the timeline had slipped and didn\'t escalate it — that was the governance failure`, quality: `good`,
                note: `Correct. Knowing the timeline had slipped and not escalating it is the specific failure. Acknowledging it is the professional response.` },
              { id: `b`, label: `Maintain that the consultation process was HR\'s responsibility and outside your programme governance scope`, quality: `poor`,
                note: `The consultation timeline was specified in your impact assessment. You knew it was slipping. The COO has the document. This position isn\'t tenable.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },

        n2_justifies: {
          scene:       `office-meeting`,
          caption:     `The COO says: "The business case doesn\'t override the Fair Work Act." Legal has confirmed a potential consultation obligation breach. The question is now the organisation\'s legal exposure, not the programme delivery timeline.`,
          sub_caption: `The programme\'s commercial success is no longer the relevant measure.`,
          decision: {
            prompt: `The framing has shifted entirely. What is your contribution to the response?`,
            choices: [
              { id: `a`, label: `Provide everything the legal team needs: the impact assessment, the timeline, every communication between you, HR, and the affected business unit`, quality: `good`,
                note: `The legal response needs accurate information. Providing it fully and quickly is your most useful contribution at this point.` },
              { id: `b`, label: `Recommend delaying further AI deployments in the programme until the legal position is clarified`, quality: `partial`,
                note: `Reasonable risk management. But the legal team will make that call — your most useful contribution right now is accurate information, not recommendations about programme pace.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Root cause owned, structural fix proposed`,
          tone:    `good`,
          result:  `Your recommendation — workforce consultation as a hard programme gate — was adopted as a requirement for all AI deployments with workforce impact. The post-incident review noted that the programme governance framework lacked this gate, and that adding it was the specific fix. The three future AI programmes in your portfolio all had consultation gates built into their schedules from day one.`,
          learning: `Workforce consultation isn\'t an HR workstream — it\'s a programme dependency. When it can slip without blocking delivery, it will. Making it a gate is the only reliable fix.`,
          score:   100,
        },
        outcome_good: {
          heading: `Accountability taken, partial fix`,
          tone:    `good`,
          result:  `The check-in mechanism was implemented. It improved coordination. Two subsequent programmes had their consultation timelines actively tracked as a result. Neither was as clean as a hard gate would have been — one required a schedule adjustment when the check-in surfaced a consultation delay — but both went better than the mortgage programme.`,
          learning: `A check-in is a softer version of a gate. It improves coordination but doesn\'t prevent slippage with the same certainty. The structural fix is the gate.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Legal exposure acknowledged, accountability deflected`,
          tone:    `warn`,
          result:  `The legal response was managed. The Fair Work exposure was real but ultimately not pursued after a genuine consultation process was initiated late. The programme governance changes were eventually made — but without your leadership, because your credibility in that conversation had been compromised.`,
          learning: `When a programme failure has a legal dimension, accurate information is your first obligation. The governance fix can come second — but it needs to come from someone with standing to propose it.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Accountability avoided, trust and standing lost`,
          tone:    `bad`,
          result:  `The legal investigation identified the impact assessment timeline clearly. The record showed you knew the consultation had slipped and hadn\'t escalated it. The post-incident review was not kind. The programme governance changes were made — without your input. Your next programme had significantly more oversight from the COO\'s office than you had previously experienced.`,
          learning: `Programme accountability includes the dependencies you flag and don\'t follow up. Knowing a critical dependency has slipped and not escalating it is a governance failure — regardless of whose workstream it technically belongs to.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `Your workforce impact assessment said: consultation required, eight weeks minimum, must begin six weeks before go-live. The system went live four weeks ago. Consultation never started. You are now being asked to confirm the Fair Work Act exposure.`,
          sub_caption: `You followed up once. You assumed it was in hand.`,
          decision: {
            prompt: `Legal asks you to confirm whether the organisation has a Fair Work Act consultation obligation exposure. What do you tell them?`,
            choices: [
              { id: `a`, label: `Yes — the assessment identified a consultation obligation. The required timeline wasn\'t met. That creates a prima facie exposure.`, quality: `good`,
                note: `Accurate and complete. Legal needs to know the exposure clearly stated, not softened. Your job here is to be accurate, not to protect the programme.` },
              { id: `b`, label: `Possibly — the obligation depends on enterprise agreement terms and whether the change meets the threshold. You\'d want legal to confirm.`, quality: `partial`,
                note: `Appropriately cautious about legal conclusions. But "possibly" undersells what your assessment already found. Lead with the finding, then add the caveat about legal confirmation.` },
              { id: `c`, label: `The consultation obligation was HR\'s to manage — your assessment flagged it, your role ends there`, quality: `poor`,
                note: `Legal is asking you to confirm what your assessment found. Declining to engage with the question because the obligation was HR\'s doesn\'t answer what they\'re asking.` },
            ],
          },
          branches: { a: `n2_clear_finding`, b: `n2_cautious`, c: `n2_deflects` },
        },

        n2_clear_finding: {
          scene:       `office-briefing`,
          caption:     `Legal confirms the exposure is real. They\'re now asking what a remediation path looks like — can the consultation obligation be partially met through a genuine process starting today?`,
          sub_caption: `The damage is done. The question is whether it can be limited.`,
          decision: {
            prompt: `What does your assessment say about remediation options?`,
            choices: [
              { id: `a`, label: `A genuine consultation process started today, with the full required content and real opportunity for staff input, partially mitigates the failure — courts look at whether consultation was genuine, not just whether timing was perfect`, quality: `good`,
                note: `Accurate and useful. The Fair Work Act looks at the substance of consultation, not just the timing. Starting a genuine process now is the best available remediation.` },
              { id: `b`, label: `The timeline breach is the breach — remediation isn\'t possible after the fact`, quality: `partial`,
                note: `The timeline breach is real. But courts do consider whether the organisation made genuine efforts to consult once the failure was identified. "Nothing can be done" isn\'t accurate and doesn\'t help legal build a response.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_cautious: {
          scene:       `desk-working`,
          caption:     `Legal asks for your assessment document. They read it. "This says consultation should have started six weeks before go-live. The system has been live for four weeks." They look at you.`,
          sub_caption: `The document says what it says.`,
          decision: {
            prompt: `Legal asks you to confirm your finding directly. What do you say?`,
            choices: [
              { id: `a`, label: `Confirm it clearly: the assessment identified a consultation obligation, the timeline wasn\'t met, there is a prima facie exposure`, quality: `good`,
                note: `The document already says this. Confirming it directly is the honest and useful response.` },
              { id: `b`, label: `Note that the assessment was a recommendation, not a legal opinion — legal should make the exposure determination`, quality: `partial`,
                note: `Fair caveat. But you can still confirm what the assessment found without claiming to make a legal determination. The two aren\'t mutually exclusive.` },
            ],
          },
          branches: { a: `n2_clear_finding`, b: `outcome_good` },
        },

        n2_deflects: {
          scene:       `office-meeting`,
          caption:     `Legal reads your assessment. The consultation obligation is explicitly on page 3. They ask why you\'re characterising your role as ending at the flag.`,
          sub_caption: `Your document is the evidence. Your engagement with it is now part of the record.`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the deflection was unhelpful and confirm the exposure clearly`, quality: `good`,
                note: `Correcting the deflection and engaging directly is the right move. Legal needs accurate information — give it to them.` },
              { id: `b`, label: `Maintain that legal determination is outside your scope — you flag, legal confirms`, quality: `poor`,
                note: `Legal is asking you to confirm what your document says. That\'s within your scope. This position creates an unhelpful standoff with the people trying to protect the organisation.` },
            ],
          },
          branches: { a: `n2_clear_finding`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Clear finding, actionable remediation path`,
          tone:    `good`,
          result:  `Legal had a clear picture and a remediation path within an hour of your conversation. The genuine consultation process was started the same day. The Fair Work matter was not pursued by staff representatives, in part because the consultation that followed was substantive and the redundancy process was handled respectfully. Your assessment was cited in the post-incident review as the document that should have been a programme gate, not an HR workstream input.`,
          learning: `A workforce impact assessment that identifies a legal obligation is only useful if the obligation is met. When it isn\'t, the most important thing you can do is give legal an accurate picture and a useful path forward — not protect the people who didn\'t act on it.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct finding, cautious framing`,
          tone:    `good`,
          result:  `Legal confirmed the exposure from the document. Your caution about legal determinations was appropriate — but it cost time. The remediation process started later than it would have with a clearer initial answer. The outcome was the same; the path was slower.`,
          learning: `Distinguishing between your analytical finding and a legal determination is correct. But you can state what your assessment found clearly while still noting that legal confirmation is appropriate. The distinction doesn\'t require hedging the core finding.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Deflection corrected, trust in your analysis reduced`,
          tone:    `warn`,
          result:  `Legal eventually got the clear picture they needed. But the initial deflection meant they spent time going around you rather than with you. Your assessment was accurate and useful. Your initial response to questions about it wasn\'t. That gap was noted.`,
          learning: `The value of an accurate assessment depends on your willingness to stand behind it when it becomes inconvenient. An assessment you hedge when it matters is worth less than one you don\'t.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Assessment accurate, analyst unhelpful`,
          tone:    `bad`,
          result:  `Legal worked around your position and confirmed the exposure directly from your document. Your assessment was accurate. Your contribution to the legal response was zero. The post-incident review noted a gap between the quality of the analytical work and the analyst\'s engagement with its consequences.`,
          learning: `Producing a good assessment and then declining to engage with its findings when they become uncomfortable is a contradiction. The assessment is only as useful as the person willing to own what it says.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Workforce impact assessment`,
      effort:  `Medium`,
      owner:   `HR`,
      go_live: true,
      context: `The assessment was completed but its findings — consultation required, eight-week minimum, start six weeks before go-live — were never enforced as a programme dependency. The assessment existed; the control it was meant to trigger did not.`,
    },
    {
      id:      `c2`,
      label:   `Stakeholder communication plan`,
      effort:  `Low`,
      owner:   `HR`,
      go_live: true,
      context: `No communication plan was executed before the media leak. The absence of planned internal communication before public announcement is the direct cause of the trust damage and the Fair Work exposure.`,
    },
    {
      id:      `c3`,
      label:   `Consultation gate in programme governance`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `Workforce consultation was treated as a parallel HR workstream rather than a hard go-live dependency. Making consultation completion a programme gate — like legal sign-off or security sign-off — would have prevented the AI going live before consultation was complete.`,
    },
  ],
};
