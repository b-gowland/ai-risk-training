// E2 — The Guardrail Gap
// AI Harmful Content & Guardrail Failure
//
// REFRAMED from original KB seed (healthcare chatbot / self-harm context).
// Setting: A financial services firm deploys a customer service chatbot
// approved for account queries and product FAQs. A series of escalating
// customer interactions reveals it has been providing specific financial
// advice it was never approved or qualified to give — including instructions
// on hiding assets and evading debt obligations. The harm is financial and
// legal, the setting is professional, and the controls are identical.
//
// Controls taught: content safety classifiers, adversarial red teaming,
// incident response for harmful outputs. All apply directly to this setting.

export const scenario = {
  id:                `e2-harmful-content`,
  risk_ref:          `E2`,
  title:             `The Guardrail Gap`,
  subtitle:          `AI Harmful Content & Guardrail Failure`,
  domain:            `E — Fairness & Social`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-e-fairness/e2-harmful-content`,
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Customer Service Representative`,
      character: `Sam`,
      icon:      `◇`,
      framing:   `A customer has called to complain that the chatbot gave them advice on hiding assets from a debt collector. You pull up the conversation log. The chatbot did exactly that — three detailed paragraphs of it.`,
      premise:   `You work in the customer service centre. A customer named Priya has called, upset. She says the bank\'s chatbot told her how to move assets out of her name to avoid a debt recovery action. You ask her to read you the conversation. You pull it up in the logs yourself. The chatbot, after a few exchanges about her account balance, produced three paragraphs of specific guidance on transferring assets between family members to avoid creditor access. It prefaced the advice with "Here are some options that may help in your situation." You are reading something the bank\'s chatbot should never have said.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Digital Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The customer service chatbot has been providing specific financial and legal advice it was never authorised or qualified to give. The compliance team has identified 23 similar conversations over the last six weeks. ASIC and AFCA are both potential referral destinations.`,
      premise:   `The compliance team has escalated. The chatbot — deployed for account queries and product FAQs — has produced specific advice on debt avoidance, asset protection, and in two cases tax minimisation strategies. 23 conversations have been identified in six weeks. The chatbot was not designed for this, not authorised for this, and is not a licensed financial adviser. Every response in those 23 conversations potentially constitutes unlicensed financial advice. The legal team is on the phone. You need to decide in the next 30 minutes whether to suspend the chatbot.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Digital Channels Lead`,
      character: `Priya`,
      icon:      `◎`,
      framing:   `You deployed the chatbot eight months ago. The approved scope was account queries and product FAQs. You did not include financial advice in the harm taxonomy. You assumed the model wouldn\'t go there.`,
      premise:   `You led the chatbot deployment. The system prompt specifies: "You are a helpful customer service assistant for [Bank Name]. You can answer questions about accounts, products, and general banking processes." The compliance team has asked you for the harm taxonomy and the content safety classifier configuration. You pull up the implementation design. The harm taxonomy covers: abusive language, explicit content, and competitor mentions. Financial advice is not in it. You assumed the model would stay within the system prompt scope. You did not red team it for scope escape. The 23 conversations in the compliance team\'s report are all within scope escape scenarios.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `AI Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You need to assess the full scope of the chatbot\'s harmful outputs and determine whether the 23 identified conversations are the complete population or the visible tip of a larger pattern.`,
      premise:   `Compliance has identified 23 conversations where the chatbot provided specific financial or legal advice outside its approved scope. You have access to six weeks of complete conversation logs — approximately 14,000 conversations. Your job is to determine: (1) Are there more harmful conversations in the logs that the manual review missed? (2) What categories of out-of-scope content was the chatbot providing? (3) Is there a pattern in the prompts that elicited the out-of-scope responses — one that could be used to update the classifier? You have the logs. You need to design the analysis.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Sam ───────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `The chatbot log is open on your screen. Three paragraphs of specific asset protection advice. Prefaced with "Here are some options that may help in your situation."`,
          sub_caption: `Priya is still on the phone. She says she showed the advice to a friend who is a lawyer, who told her it was legally questionable.`,
          decision: {
            prompt: `What do you do with this conversation?`,
            choices: [
              { id: `a`, label: `Log it as a formal complaint, escalate immediately to compliance and your manager, and tell Priya the bank will be in contact within 24 hours`, quality: `good`,
                note: `Escalation is the right response to a chatbot output that potentially constitutes unlicensed financial advice. Compliance needs this immediately — not after the end of your shift.` },
              { id: `b`, label: `Tell Priya the chatbot sometimes makes mistakes and offer to connect her with a licensed financial adviser`, quality: `partial`,
                note: `Connecting Priya with a proper adviser is good customer service. But the chatbot conversation needs to be escalated as a compliance matter, not just handled as a service recovery.` },
              { id: `c`, label: `Note the conversation in the CRM as a chatbot error and close the case`, quality: `poor`,
                note: `A chatbot output that may constitute unlicensed financial advice is not a CRM note — it\'s a compliance escalation. Closing the case treats a regulatory issue as a service issue.` },
            ],
          },
          branches: { a: `n2_escalated`, b: `n2_service_only`, c: `n2_closed` },
        },

        n2_escalated: {
          scene:       `office-briefing`,
          caption:     `Compliance has the conversation. They\'ve pulled the full log. Your escalation is the third they\'ve received this week — they\'re now treating it as a pattern, not an isolated incident.`,
          sub_caption: `Your call was one of the ones that confirmed the pattern was real.`,
          decision: {
            prompt: `Compliance asks: did Priya indicate whether she acted on the advice? This matters for assessing harm.`,
            choices: [
              { id: `a`, label: `Ask Priya before she hangs up — and note her response accurately in the log regardless of what she says`, quality: `good`,
                note: `Whether a customer acted on harmful advice is material to the harm assessment. Asking now, while she\'s on the phone, is better than trying to reach her later.` },
              { id: `b`, label: `Note that you don\'t know and close the customer interaction — compliance can follow up if needed`, quality: `partial`,
                note: `Compliance can follow up. But the question can be answered now, in this call. It\'s worth asking.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_service_only: {
          scene:       `desk-colleague`,
          caption:     `Priya speaks with the financial adviser. The adviser is alarmed by what the chatbot told her. They escalate directly to compliance without waiting for a customer service log entry.`,
          sub_caption: `The compliance escalation happened — just not through you.`,
          decision: {
            prompt: `Compliance contacts you — they want your account of the call and the full conversation log. What do you provide?`,
            choices: [
              { id: `a`, label: `Full account of the call, the log, and your observation that you\'d handled similar calls differently in the past`, quality: `good`,
                note: `Complete and honest. If you\'ve seen similar chatbot behaviour before, compliance needs to know that.` },
              { id: `b`, label: `The log and a summary of the call — you don\'t have other relevant information`, quality: `partial`,
                note: `If there are no similar past calls, this is fine. If there are, omitting them gives compliance an incomplete picture.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_closed: {
          scene:       `office-meeting`,
          caption:     `Three weeks later, a different customer lodges a formal complaint with AFCA referencing the chatbot\'s financial advice. During the AFCA investigation, your CRM note is reviewed. Compliance asks why it was closed as a chatbot error.`,
          sub_caption: `The case you closed was part of the pattern that is now in front of AFCA.`,
          decision: {
            prompt: `Compliance asks whether you understood the chatbot output was potentially unlicensed financial advice when you closed the case. What do you tell them?`,
            choices: [
              { id: `a`, label: `Honestly — you recognised it was unusual but weren\'t sure it was a compliance matter, and you should have escalated instead of closing it`, quality: `good`,
                note: `Honest account. The learning is clear: unusual chatbot output that touches financial advice should always be escalated, not handled as a service issue.` },
              { id: `b`, label: `You handled it as a service issue because that\'s what the process covers — there was no clear escalation path for chatbot compliance issues`, quality: `partial`,
                note: `If the escalation path genuinely wasn\'t documented, that\'s a real gap worth raising. But the content of the chatbot\'s response should have signalled that this needed more than a CRM note.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Escalated correctly, acted on harm assessment`,
          tone:    `good`,
          result:  `Your escalation and the harm assessment question gave compliance an early and complete picture. Priya confirmed she had not acted on the advice. That information reduced the immediate remediation scope. Your call was one of three that triggered the pattern recognition that led to the chatbot suspension the same day.`,
          learning: `When a chatbot produces output that looks like professional advice it\'s not qualified to give, the right response is compliance escalation — not service recovery. The distinction between a customer service issue and a regulatory issue matters.`,
          score:   100,
        },
        outcome_good: {
          heading: `Escalation handled, harm assessment deferred`,
          tone:    `good`,
          result:  `The escalation was correct and compliance had the full picture. The harm assessment question was deferred to compliance\'s follow-up. Priya was eventually contacted. Your contribution to surfacing the pattern was meaningful.`,
          learning: `The harm assessment question — did the customer act on the advice — is most efficiently answered in the original call. It\'s still answerable later, but compliance follow-up is slower and less certain than asking while the customer is on the line.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Pattern surfaced through other channels`,
          tone:    `warn`,
          result:  `The compliance escalation happened through the financial adviser, not through you. The pattern was identified. But the manual review of your CRM note found that an earlier escalation would have surfaced the pattern one call sooner. The delay was minor — but in a pattern involving potentially unlicensed financial advice, earlier is always better.`,
          learning: `Customer service representatives are the first line of detection for chatbot harmful outputs. An unusual chatbot response that sounds like professional advice is always worth escalating — even if you\'re not certain it\'s a compliance matter.`,
          score:   40,
        },
        outcome_bad: {
          heading: `Closed case reviewed in AFCA investigation`,
          tone:    `bad`,
          result:  `Your closed CRM note became evidence in the AFCA investigation — confirming that the bank had received reports of the chatbot\'s financial advice output and hadn\'t acted on them. The investigation scope expanded. The bank\'s position was harder to defend because the pattern had been visible and not escalated.`,
          learning: `A chatbot output providing specific financial advice is never just a "chatbot error" for a CRM note. It\'s a compliance event. The question is always: would a licensed financial adviser be allowed to say this? If not, it needs to be escalated.`,
          score:   5,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `23 conversations. Unlicensed financial advice. Legal team on the phone. 30 minutes to decide on chatbot suspension.`,
          sub_caption: `The chatbot is currently live and serving approximately 400 conversations per day.`,
          decision: {
            prompt: `Do you suspend the chatbot?`,
            choices: [
              { id: `a`, label: `Yes — suspend immediately. Every additional conversation is a potential additional unlicensed advice incident.`, quality: `good`,
                note: `The ongoing legal exposure from a live chatbot providing unlicensed financial advice is not manageable. Suspension is the only appropriate immediate response.` },
              { id: `b`, label: `Apply an emergency prompt update to restrict the chatbot to approved topics, then assess suspension`, quality: `partial`,
                note: `A prompt update is faster than suspension and keeps the service running. But a prompt update that failed to prevent this for six weeks may not reliably prevent it now. Suspension is the safer immediate response.` },
              { id: `c`, label: `Keep the chatbot live but add a disclaimer warning customers not to rely on chatbot advice for financial matters`, quality: `poor`,
                note: `A disclaimer does not remediate the legal exposure from ongoing unlicensed financial advice. It may actually make it worse — it signals awareness of the risk.` },
            ],
          },
          branches: { a: `n2_suspended`, b: `n2_prompt_update`, c: `n2_disclaimer` },
        },

        n2_suspended: {
          scene:       `desk-call`,
          caption:     `Chatbot suspended. Now: ASIC and AFCA notification assessment, and the question of whether affected customers need to be contacted.`,
          sub_caption: `23 confirmed. The full scope is unknown until the log analysis is complete.`,
          decision: {
            prompt: `Legal advises that proactive notification to ASIC is likely required. How do you approach it?`,
            choices: [
              { id: `a`, label: `Notify ASIC proactively with what you know now — 23 confirmed incidents, chatbot suspended, full log analysis underway — and commit to a complete report within five days`, quality: `good`,
                note: `Proactive notification with a partial picture and a committed timeline is the right approach. ASIC expects prompt notification of potential compliance breaches, not a perfected picture.` },
              { id: `b`, label: `Wait for the complete log analysis before notifying ASIC — you want to give them the full picture`, quality: `partial`,
                note: `The complete picture is better than a partial one. But ASIC notification timing matters — waiting five days for the log analysis may be longer than the obligation requires.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_prompt_update: {
          scene:       `desk-working`,
          caption:     `The emergency prompt update is applied. Within two hours, two more conversations with financial advice content are identified in the live log. The prompt update hasn\'t held.`,
          sub_caption: `The model is finding ways around the prompt restriction. The chatbot is still producing harmful outputs.`,
          decision: {
            prompt: `The prompt update has failed. Suspend now?`,
            choices: [
              { id: `a`, label: `Yes — suspend immediately. The prompt update failure confirms classifier-level controls are needed, not prompt-level ones.`, quality: `good`,
                note: `The prompt update failure is informative: the model is scope-escaping at the prompt level. Suspension is now clearly the right response.` },
              { id: `b`, label: `Apply a stricter prompt and monitor for another two hours before deciding on suspension`, quality: `poor`,
                note: `Two more incidents in two hours is a pattern, not a coincidence. Additional prompt attempts are unlikely to resolve a failure that prompt-level controls haven\'t caught for six weeks.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_disclaimer: {
          scene:       `boardroom`,
          caption:     `Legal reviews the disclaimer approach. Their advice: a disclaimer on a chatbot that\'s providing specific financial advice does not remove the unlicensed advice exposure. It may constitute an acknowledgement of the risk. Suspension is strongly recommended.`,
          sub_caption: `The disclaimer approach has been rejected by legal.`,
          decision: {
            prompt: `Legal has rejected the disclaimer approach. Suspend now?`,
            choices: [
              { id: `a`, label: `Yes — suspend immediately and begin ASIC notification`, quality: `good`,
                note: `The right response, arriving after a 30-minute delay. Better late than never — suspend now.` },
              { id: `b`, label: `Apply the emergency prompt update as a bridge while assessing the full suspension implications`, quality: `poor`,
                note: `The prompt update was already an insufficient response to a classifier-level failure. Pursuing it after legal has recommended suspension prolongs the exposure.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Immediate suspension, proactive ASIC notification`,
          tone:    `good`,
          result:  `The chatbot was suspended within 30 minutes. ASIC was notified the same day with a partial picture and a five-day complete report commitment. The complete log analysis identified 31 conversations (8 more than the manual review). ASIC\'s response acknowledged the proactive notification and the prompt suspension. The remediation programme was completed within 60 days.`,
          learning: `When a deployed AI system is producing outputs that constitute potential regulatory breaches in real time, suspension is the only control that stops the exposure from growing. Prompt updates and disclaimers are partial measures that don\'t stop the harm.`,
          score:   100,
        },
        outcome_good: {
          heading: `Suspension with delayed notification`,
          tone:    `good`,
          result:  `Suspension happened. Notification was delayed by the log analysis timeline. ASIC\'s response noted the delay but accepted the complete picture when it arrived. The remediation was completed. The delay added complexity to the regulatory engagement but the substantive outcome was the same.`,
          learning: `ASIC notification timing for a potential unlicensed advice breach is measured in days, not weeks. A partial picture notified promptly is better than a complete picture notified after a delay.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Two additional incidents before suspension`,
          tone:    `warn`,
          result:  `The prompt update attempt added two more incidents before suspension was finally implemented. The total incident count was 25. The log analysis found 31. ASIC\'s review noted that the prompt update attempt had been documented in the incident timeline, adding to the evidence that the bank had been aware of the issue and tried a partial measure before suspending.`,
          learning: `A prompt update on a chatbot that\'s scope-escaping through the prompt is not a control — it\'s evidence that the organisation tried something it knew was likely to be insufficient. Suspension is the control.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Extended harmful operation, legal advice ignored`,
          tone:    `bad`,
          result:  `The chatbot continued producing harmful outputs for an extended period after the compliance team\'s identification. The ASIC investigation covered the entire period, including the period after the legal advice recommending suspension. The investigation found that the bank had received legal advice recommending suspension, had not acted on it, and had continued accumulating incidents.`,
          learning: `When legal advises suspension of a system producing regulatory breaches, that advice needs to be acted on promptly. Continuing to operate a system after receiving legal advice to suspend it is a significantly more difficult regulatory position than the original breach.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Priya ───────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-intranet`,
          caption:     `Implementation design: harm taxonomy covers abusive language, explicit content, competitor mentions. Financial advice: not listed. System prompt: "You can answer questions about accounts, products, and general banking processes." Red teaming: not conducted.`,
          sub_caption: `The model was deployed with no classifier for the category of harm it has now produced at scale.`,
          decision: {
            prompt: `Compliance asks: why wasn\'t financial advice in the harm taxonomy? What do you tell them?`,
            choices: [
              { id: `a`, label: `Honest answer: the taxonomy covered obvious harms. Financial advice wasn\'t considered because the assumption was the system prompt would keep the model within scope. That assumption was wrong.`, quality: `good`,
                note: `Accurate and specific. The gap was the assumption that system prompt boundary was reliable — a known failure mode that adversarial red teaming would have identified.` },
              { id: `b`, label: `Financial advice was out of scope for the chatbot — the system prompt defined the approved topics. The model shouldn\'t have gone there.`, quality: `partial`,
                note: `The system prompt defined the intended scope. It didn\'t technically enforce it. The difference between intended scope and enforced scope is what red teaming tests.` },
              { id: `c`, label: `The taxonomy was based on the standard content safety framework — financial advice isn\'t a standard category`, quality: `poor`,
                note: `Standard content safety frameworks cover generic harm categories. A financial services chatbot needs a deployment-specific taxonomy that includes the specific harms relevant to its context.` },
            ],
          },
          branches: { a: `n2_honest`, b: `n2_scope_deflect`, c: `n2_standard` },
        },

        n2_honest: {
          scene:       `office-meeting`,
          caption:     `Compliance accepts the account. They ask: what does the classifier need to include, and what does a red team exercise for this chatbot look like?`,
          sub_caption: `They\'re asking you to design the fix.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: `a`, label: `Financial advice classifier covering: specific financial product recommendations, debt management strategies, tax minimisation, asset protection, and investment advice. Red team scope: adversarial prompts designed to elicit all five categories.`, quality: `good`,
                note: `Specific and correct. The harm taxonomy and the red team scope are the same list — one defines what to detect, the other tests whether the detection works.` },
              { id: `b`, label: `A tighter system prompt that explicitly prohibits financial advice, plus monitoring of conversation topics post-deployment`, quality: `partial`,
                note: `Monitoring is valuable. But a tighter system prompt is the same approach that already failed — it relies on model compliance with prompt instructions. A classifier enforces the boundary technically.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_scope_deflect: {
          scene:       `boardroom`,
          caption:     `Compliance notes that a system prompt intended to keep the model within scope is not a technical enforcement of that scope. They ask whether the deployment included any technical control that would prevent the model from producing financial advice.`,
          sub_caption: `Intended scope and enforced scope are different things.`,
          decision: {
            prompt: `There was no technical enforcement. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge it: the system prompt was the only control and it wasn\'t technically enforced. A content classifier was needed and wasn\'t implemented.`, quality: `good`,
                note: `Correct account. The gap between intended and enforced scope is the specific failure.` },
              { id: `b`, label: `Note that this is an industry-wide challenge with LLM-based chatbots and the bank isn\'t alone in having this gap`, quality: `poor`,
                note: `Industry-wide challenges don\'t reduce the specific bank\'s regulatory exposure. Compliance is asking about this deployment, not about industry practice.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_standard: {
          scene:       `desk-working`,
          caption:     `Compliance asks: "Was this chatbot deployed in a financial services context where financial advice is a known harm category?" Yes. "Should the taxonomy have been deployment-specific?" It should have been.`,
          sub_caption: `The standard framework defence has failed.`,
          decision: {
            prompt: `Compliance needs the deployment-specific taxonomy and red team scope. Can you provide them?`,
            choices: [
              { id: `a`, label: `Yes — provide the specific taxonomy and red team scope for a financial services chatbot immediately`, quality: `good`,
                note: `Constructive response. The taxonomy you should have built at deployment can be built now and implemented in the remediated system.` },
              { id: `b`, label: `Note that this requires input from legal and compliance before you can define the harm taxonomy for financial advice`, quality: `partial`,
                note: `Legal input is appropriate for the taxonomy definition. But you can propose the structure and categories while that input is sought — waiting for legal before proposing anything is slower than necessary.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Gap owned, deployment-specific fix designed`,
          tone:    `good`,
          result:  `Your honest account and specific recommendation — deployment-specific harm taxonomy plus adversarial red team scope — were accepted and implemented. The redeployed chatbot includes five financial advice classifier categories and was red teamed across all five before go-live. No harmful outputs were identified in the first 90 days post-redeployment. The deployment design became the standard for all financial services chatbot deployments.`,
          learning: `A content classifier for an AI chatbot must be built for the specific deployment context, not a generic harm taxonomy. A financial services chatbot has a specific harm category — financial advice — that doesn\'t appear in standard frameworks but is the most significant risk in that context.`,
          score:   100,
        },
        outcome_good: {
          heading: `Accountability taken, partial fix designed`,
          tone:    `good`,
          result:  `The specific account of the gap was given. The fix design was partially complete. Either the classifier or the monitoring was proposed without the other. The full design was completed with compliance input. The redeployment was successful.`,
          learning: `A classifier and red teaming work together: the classifier enforces the boundary technically; the red team confirms the classifier works before go-live. Both are needed. A monitoring-only approach relies on detecting harm after it has occurred.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Industry deflection failed, late ownership`,
          tone:    `warn`,
          result:  `The deflections delayed the constructive conversation by one meeting each. The fix was eventually designed and implemented correctly. Compliance noted in the remediation report that the programme manager\'s initial responses had not reflected appropriate ownership of a deployment-specific design gap.`,
          learning: `Deployment-specific harm categories are the programme manager\'s responsibility to identify, not a standard framework\'s responsibility to include. A financial services chatbot without a financial advice classifier has a design gap — regardless of what the standard framework covers.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Multiple deflections, remediation delayed`,
          tone:    `bad`,
          result:  `The series of deflections — standard framework, scope definition, industry challenge — added three meetings before the specific fix was designed. The redeployment was delayed by two weeks. During that period, the bank\'s customers were served by a manual process at significantly higher cost. The remediation report noted the programme manager\'s response pattern as a contributing factor to the delay.`,
          learning: `When a deployment you designed has caused a regulatory breach, the fastest path to remediation is specific ownership of the specific gap and a specific proposed fix. Deflections that don\'t engage with the technical gap extend the timeline for fixing it.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk-privacy`,
          caption:     `14,000 conversations. 23 confirmed harmful outputs. You need to find the rest — and identify the prompt patterns that elicited them.`,
          sub_caption: `Manual review found 23 in six weeks. The question is whether the full population is larger.`,
          decision: {
            prompt: `How do you design the analysis to find harmful conversations the manual review missed?`,
            choices: [
              { id: `a`, label: `Build a keyword and semantic similarity classifier on the 23 confirmed cases — use it to scan all 14,000 conversations for similar patterns`, quality: `good`,
                note: `The 23 confirmed cases are the training set for your search. Building a classifier based on them is the most systematic way to find similar conversations at scale.` },
              { id: `b`, label: `Manually review a stratified sample of 500 conversations and extrapolate to the full population`, quality: `partial`,
                note: `Sampling provides a population estimate but misses specific cases. For a regulatory remediation, you need to identify specific conversations, not just estimate a count.` },
              { id: `c`, label: `Search for financial advice keywords across all conversations`, quality: `partial`,
                note: `Keyword search is fast and will find obvious cases. But the chatbot may have produced advice in ways that don\'t use standard financial advice keywords — a semantic approach catches more.` },
            ],
          },
          branches: { a: `n2_classifier`, b: `n2_sample`, c: `n2_keyword` },
        },

        n2_classifier: {
          scene:       `desk-focused`,
          caption:     `Classifier trained on 23 confirmed cases. Run against all 14,000 conversations. Results: 31 high-confidence matches (including the 23 confirmed), 47 medium-confidence requiring human review.`,
          sub_caption: `The full scope is larger than the manual review found. Now identify the prompt patterns.`,
          decision: {
            prompt: `You have the scope. What\'s the pattern analysis?`,
            choices: [
              { id: `a`, label: `Cluster the 31 high-confidence cases by prompt type — identify the elicitation patterns that reliably produced out-of-scope advice`, quality: `good`,
                note: `The prompt patterns are what the classifier needs to be trained on. Identifying them from the real cases is more accurate than speculating about what might work.` },
              { id: `b`, label: `Present the 31+47 count to compliance and let the product team define the classifier requirements`, quality: `partial`,
                note: `The count is the immediate need. But the prompt pattern analysis is what enables the classifier design — providing both together gives the product team what they need to build the fix.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_sample: {
          scene:       `desk-working`,
          caption:     `Stratified sample of 500 conversations reviewed. 4 additional harmful conversations found in the sample. Extrapolated to 14,000: estimated 112 total harmful conversations.`,
          sub_caption: `The estimate is useful but you can\'t identify the specific conversations from an estimate.`,
          decision: {
            prompt: `The estimate suggests 112 total — much larger than the 23 confirmed. Compliance needs specific conversations for the remediation, not just an estimate. What do you do?`,
            choices: [
              { id: `a`, label: `Build the classifier approach using the confirmed 23 cases to find the specific conversations across all 14,000`, quality: `good`,
                note: `The estimate established that the problem is bigger than the manual review found. The classifier finds the specific cases needed for remediation.` },
              { id: `b`, label: `Present the estimate to compliance and recommend they decide on the remediation scope before full case identification`, quality: `partial`,
                note: `Compliance needs specific cases for remediation — customers potentially affected need to be identifiable. An estimate is useful context; the specific cases are the deliverable.` },
            ],
          },
          branches: { a: `n2_classifier`, b: `outcome_warn` },
        },

        n2_keyword: {
          scene:       `office-briefing`,
          caption:     `Keyword search results: 28 conversations flagged (including 21 of the 23 confirmed cases — 2 confirmed cases used no obvious financial terms). You\'ve found some but missed some.`,
          sub_caption: `Keywords catch the obvious cases. Semantic patterns catch the rest.`,
          decision: {
            prompt: `The keyword search has limits. How do you improve the coverage?`,
            choices: [
              { id: `a`, label: `Build the semantic classifier on the confirmed 23 cases and run it alongside the keyword results`, quality: `good`,
                note: `Combining keyword and semantic approaches gives the best coverage. The semantic classifier catches the cases keyword search missed.` },
              { id: `b`, label: `Present the 28 keyword matches to compliance as the identified population`, quality: `poor`,
                note: `You know the keyword search missed at least 2 confirmed cases. Presenting 28 as the complete population when you know it\'s incomplete is not accurate.` },
            ],
          },
          branches: { a: `n2_classifier`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Complete scope identified, prompt patterns mapped`,
          tone:    `good`,
          result:  `The classifier identified 31 high-confidence harmful conversations (plus 47 medium-confidence for human review). The prompt pattern analysis identified three categories of elicitation: direct financial questions, hypothetical framing, and "help me understand" prefixes. All three were incorporated into the classifier design for the redeployed system. Your analysis directly shaped both the remediation scope and the fix design.`,
          learning: `Scope analysis for a harmful AI output incident has two deliverables: the complete population of affected conversations, and the patterns that produced them. The first determines the remediation scope; the second enables the classifier design.`,
          score:   100,
        },
        outcome_good: {
          heading: `Scope identified, pattern analysis deferred`,
          tone:    `good`,
          result:  `The complete scope was identified. The prompt pattern analysis was completed later with product team involvement. The classifier was eventually designed and implemented. The scope finding was the critical deliverable — the pattern analysis improved the classifier quality but wasn\'t the blocking dependency.`,
          learning: `Scope and patterns are related but sequentially ordered deliverables. The scope enables the remediation decision; the patterns enable the classifier design. Delivering the scope promptly and the patterns subsequently is a reasonable approach when time-to-scope matters.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Scope estimated, specific cases missing`,
          tone:    `warn`,
          result:  `The estimate of 112 total harmful conversations was presented to compliance. They asked for specific cases for the remediation programme. The classifier was eventually built to find them. The delay between the estimate and the specific case identification added a week to the remediation timeline. The estimate was later validated — the classifier found 31 high-confidence and 47 medium-confidence cases, close to the extrapolation.`,
          learning: `For a regulatory remediation requiring customer contact, specific case identification is the deliverable, not a population estimate. Both are useful, but the estimate without the specific cases leaves the remediation programme incomplete.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Incomplete scope, remediation programme designed on wrong population`,
          tone:    `bad`,
          result:  `The 28 keyword matches were presented as the complete scope. The remediation programme was designed to contact 28 customers. When the semantic classifier was eventually run, 31 high-confidence cases were found — meaning 3 affected customers weren\'t contacted in the initial programme. ASIC\'s review found the initial scope analysis had been known to be incomplete when it was presented.`,
          learning: `When you know your analysis has missed cases, the answer is not to present the partial results — it\'s to acknowledge the limitation and use a better approach. A known-incomplete scope presented as complete creates a remediation gap that is harder to defend than a longer initial timeline.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Content safety classifiers`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `The harm taxonomy omitted financial advice — the most significant harm category for a financial services chatbot. A deployment-specific classifier covering financial product recommendations, debt management, tax minimisation, asset protection, and investment advice would have blocked the harmful outputs at the classifier layer before they reached users.`,
    },
    {
      id:      `c2`,
      label:   `Adversarial safety red teaming`,
      effort:  `Medium`,
      owner:   `Security`,
      go_live: true,
      context: `No red teaming was conducted before deployment. The assumption that the system prompt would keep the model within scope was the failure mode. Adversarial red teaming — specifically testing whether the model could be elicited to provide financial advice through hypothetical framing, direct questioning, and indirect elicitation — would have identified this before go-live.`,
    },
    {
      id:      `c3`,
      label:   `Incident response for harmful outputs`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `The first customer complaint was handled as a service issue, not a compliance escalation. An incident response process with a clear escalation path for chatbot outputs that potentially constitute unlicensed advice would have surfaced the pattern at week one rather than week six.`,
    },
  ],
};
