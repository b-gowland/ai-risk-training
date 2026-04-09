// G1 — Single Point
// AI Concentration Risk & Provider Dependency
//
// Setting: A financial services firm's customer-facing AI assistant depends
// entirely on a single LLM provider API. 4-hour outage. No fallback exists.
// Customer service centre unable to serve customers for the full duration.
//
// Differentiation from all live scenarios:
//   No AI failure. No bad actor. No bad decision. The LLM provider had an outage
//   — that's normal infrastructure behaviour. The risk is entirely in the
//   organisation's architecture: one dependency, no fallback, no BCP scenario.
//   First scenario about infrastructure resilience rather than AI behaviour.
//   The lesson is about what you build before something goes wrong, not
//   what you do when AI produces a bad output.

export const scenario = {
  id:                `g1-concentration-risk`,
  risk_ref:          `G1`,
  title:             `Single Point`,
  subtitle:          `AI Concentration Risk & Provider Dependency`,
  domain:            `G — Systemic & Societal`,
  difficulty:        `Foundational`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-g-systemic/g1-concentration-risk`,
  estimated_minutes: 11,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Customer Service Representative`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `It's 9:17am on a Monday. The AI assistant has gone down. The queue is building. You have no tools to serve customers and no guidance on what to do instead.`,
      premise:   `You're a customer service rep. The AI assistant your team uses to handle enquiries, look up accounts, and draft responses went offline at 9:05am. The system shows a generic error. Your team lead has sent a message: "Known issue, waiting on IT." The customer queue has 47 people in it. You don't have access to the customer data outside the AI interface. You don't have a documented manual process. The customers don't know why they're waiting.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Operating Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `It's 9:20am. The AI provider's status page shows a major outage. Estimated resolution: 2–4 hours. Your customer service centre cannot serve customers. You have no fallback.`,
      premise:   `The AI provider's status page is unambiguous: major outage, all regions affected, estimated resolution 2–4 hours. Your customer service AI assistant depends entirely on this provider. There is no fallback. No secondary provider. No degraded manual mode. The customer queue is building. You're about to find out that the business continuity plan doesn't have an AI provider outage scenario. APRA CPS 230 requires tested fallback arrangements for material service providers. The AI provider is a material service provider. It has no tested fallback.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Digital Channels Lead`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You deployed the AI assistant eight months ago. Provider dependency was flagged as a risk during design. You assessed it as low likelihood and moved on. Today is the first outage.`,
      premise:   `You led the AI assistant deployment. The design document has a risk register. Item 7: "Single provider dependency — if provider experiences outage, service unavailable." Likelihood: Low. Impact: High. Mitigation: "Monitor provider status." That was eight months ago. No fallback was ever built. No secondary provider was integrated. No manual process was documented. Today is the first outage. The COO wants the risk register item in front of her in 10 minutes.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Technology Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `The AI provider is on the material service provider register. APRA CPS 230 requires a tested fallback for material service providers. There is no tested fallback. You need to assess the regulatory exposure.`,
      premise:   `The AI provider is listed on the material service provider register under APRA CPS 230. You completed the annual review four months ago. The fallback arrangements column for the AI provider reads: "Monitoring of provider status page." CPS 230 requires tested fallback arrangements — not monitoring. The COO is asking you to confirm the regulatory position. The outage has been running for 45 minutes. You have a 4-hour window before this becomes a 4-hour outage on the CPS 230 record with no tested fallback.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `api-outage`,
          caption:     `9:17am. AI assistant offline. Queue: 47 customers. No manual process documented. No guidance from management yet.`,
          sub_caption: `"Known issue, waiting on IT." That was 12 minutes ago.`,
          decision: {
            prompt: `The queue is building and you have no tools. What do you do?`,
            choices: [
              { id: `a`, label: `Contact your team lead directly — you need either a manual process or guidance on how to communicate with waiting customers`, quality: `good`,
                note: `Your team lead needs to know the queue is building and that you need direction. "Known issue, waiting on IT" is not operational guidance.` },
              { id: `b`, label: `Start calling customers in the queue to let them know there\'s a system issue and offer a callback`, quality: `good`,
                note: `Also right — customers waiting without information will be more frustrated than customers who receive a brief, honest update. Both this and escalating to your team lead are correct moves.` },
              { id: `c`, label: `Wait for IT to fix it — there\'s nothing you can do without the system`, quality: `poor`,
                note: `There\'s always something you can do: communicate with waiting customers, escalate the queue impact, or ask for any available manual process. Waiting passively makes the customer experience worse.` },
            ],
          },
          branches: { a: `n2_escalates`, b: `n2_contacts_customers`, c: `n2_waits` },
        },

        n2_escalates: {
          scene:       `office-briefing`,
          caption:     `Your team lead confirms there is no documented manual process. They\'re escalating to operations. The queue is now 68 customers.`,
          sub_caption: `The gap isn\'t the outage. The gap is that nobody planned for it.`,
          decision: {
            prompt: `While operations works on a response, the queue keeps building. What do you do for the customers already waiting?`,
            choices: [
              { id: `a`, label: `Start contacting waiting customers to acknowledge the issue and give them a realistic timeframe or callback option`, quality: `good`,
                note: `Customers waiting without information assume the worst and escalate. A brief honest message — system issue, we\'ll call you back — is significantly better than silence.` },
              { id: `b`, label: `Continue waiting for the official communications guidance before saying anything to customers`, quality: `partial`,
                note: `Waiting for official guidance is reasonable up to a point. But customers who\'ve been waiting 30 minutes in silence are already forming negative impressions. Some proactive communication is better than none.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_contacts_customers: {
          scene:       `desk-working`,
          caption:     `You start working through the queue, leaving brief messages: system issue, estimated 2-4 hours, we\'ll call back. Most customers respond positively. Several say they appreciate being told.`,
          sub_caption: `You\'ve managed the customer experience through the outage. The system gap remains.`,
          decision: {
            prompt: `Operations asks what you need to be able to serve customers when the system comes back up. What do you tell them?`,
            choices: [
              { id: `a`, label: `A manual fallback process — even a basic one — so the next outage doesn\'t leave the team with no options`, quality: `good`,
                note: `The specific operational need is a documented manual process. Your direct experience of the gap is exactly the input operations needs to design it.` },
              { id: `b`, label: `A better estimated resolution time from the provider — the 2-4 hour window is too vague to plan around`, quality: `partial`,
                note: `Provider communication is a real gap. But it\'s secondary to the manual fallback gap — even with a precise ETA, you still had nothing to do while waiting.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_waits: {
          scene:       `desk-focused`,
          caption:     `Two hours pass. The queue grows to 134 customers. Some have called the main line and been told to call back. Three have lodged complaints via the website.`,
          sub_caption: `The outage is the same. The customer experience didn\'t have to be this bad.`,
          decision: {
            prompt: `The system comes back at 11:08am. Your team lead asks for a debrief. What\'s your main observation?`,
            choices: [
              { id: `a`, label: `The team had no manual process and no customer communication guidance — both gaps made the outage significantly worse than it needed to be`, quality: `good`,
                note: `Accurate and actionable. The debrief needs the operational perspective — what it actually felt like to have no tools and no guidance for two hours.` },
              { id: `b`, label: `IT needs better escalation processes for system issues`, quality: `poor`,
                note: `IT\'s response is one part of the picture. The bigger gap is that the team had no fallback and no customer communication process. That\'s an operations design gap, not an IT response gap.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Customer experience managed, operational gap surfaced`,
          tone:    `good`,
          result:  `Customers in the queue received proactive communication. Complaint volume was significantly lower than the queue size would have predicted. Your specific feedback — no manual process, no customer communication guidance — was cited in the post-incident review as the operational perspective that shaped the fallback design. A manual process was documented within two weeks.`,
          learning: `When a system goes down, two things matter: what you can do for customers right now, and what you can tell operations about the gap so it gets fixed. Both are available to you even when the system isn\'t.`,
          score:   100,
        },
        outcome_good: {
          heading: `Outage navigated, gap identified`,
          tone:    `good`,
          result:  `The outage was managed with some proactive customer communication or clear operational feedback. The experience was better than it would have been with passive waiting. The post-incident review incorporated your observations. A manual fallback process was designed.`,
          learning: `In a system outage, customer communication and operational feedback are both within your control. Both matter for managing the immediate experience and preventing the same gap recurring.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Passive during outage, constructive in debrief`,
          tone:    `warn`,
          result:  `The two hours of the outage were worse than they needed to be — 134 customers waited without communication. The debrief was constructive and your observation about the manual process gap was accurate and useful. The post-incident review used it. But the debrief couldn\'t undo two hours of poor customer experience.`,
          learning: `The debrief shapes what happens next time. The response during the outage shapes what customers experienced this time. Both matter — but the during-outage response can\'t be recovered after the fact.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Passive during and after, gap unaddressed in debrief`,
          tone:    `bad`,
          result:  `134 customers experienced a two-hour wait without communication. The debrief focused on IT escalation processes rather than the manual process and customer communication gaps. The post-incident review did not recommend a manual fallback. The next outage — six months later — played out identically.`,
          learning: `System outages are foreseeable. The manual process and customer communication design that would have made this outage manageable were designed for after incidents, not before. The debrief is the opportunity to change that.`,
          score:   5,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `api-outage`,
          caption:     `Provider status page: major outage, estimated 2-4 hours. Customer service AI: offline. Fallback: none. BCP scenario for AI provider outage: doesn\'t exist.`,
          sub_caption: `APRA CPS 230 requires tested fallback arrangements for material service providers. This provider is on the register. There is no tested fallback.`,
          decision: {
            prompt: `You have roughly 4 hours before this outage ends. What are your two immediate priorities?`,
            choices: [
              { id: `a`, label: `First: activate whatever manual capability exists for the customer queue. Second: get the CPS 230 exposure confirmed before the outage becomes a regulatory disclosure`, quality: `good`,
                note: `Two separate problems running in parallel: the operational problem (customers waiting) and the regulatory problem (CPS 230 exposure). Both need action now.` },
              { id: `b`, label: `Escalate to the provider for a precise ETA and hold until you have a clear timeline`, quality: `poor`,
                note: `Provider communication matters but it\'s not your first priority. 47 customers are in the queue now and the BCP gap exists regardless of when the system comes back.` },
            ],
          },
          branches: { a: `n2_two_tracks`, b: `n2_waits_for_provider` },
        },

        n2_two_tracks: {
          scene:       `office-meeting`,
          caption:     `Operations has activated a manual callback process — slower than the AI, but customers are being served. The compliance team has confirmed the CPS 230 exposure: material service provider, no tested fallback, 4-hour outage will be on the record.`,
          sub_caption: `The operational crisis is being managed. The regulatory question remains.`,
          decision: {
            prompt: `Compliance asks whether to notify APRA proactively or wait to see if the outage triggers their own review. What do you decide?`,
            choices: [
              { id: `a`, label: `Notify proactively — APRA typically responds better to organisations that self-report compliance gaps than to those who wait to be asked`, quality: `good`,
                note: `Proactive disclosure is almost always the right regulatory approach. APRA\'s review of a self-reported gap is usually more collaborative than one triggered by their own monitoring.` },
              { id: `b`, label: `Wait to see if APRA raises it — a 4-hour outage may not cross their materiality threshold`, quality: `partial`,
                note: `Possibly correct on materiality. But the gap isn\'t just the outage — it\'s the absence of a tested fallback for a listed material service provider. That gap predates the outage and is the CPS 230 issue.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_waits_for_provider: {
          scene:       `desk-focused`,
          caption:     `The provider updates their status page: estimated resolution extended to 4–6 hours. The customer queue is now 89 people. No manual process has been activated.`,
          sub_caption: `Waiting for the provider\'s ETA has cost 40 minutes of queue build.`,
          decision: {
            prompt: `The ETA has extended. The queue is at 89. What now?`,
            choices: [
              { id: `a`, label: `Activate whatever manual capability exists immediately — the provider timeline is irrelevant to the queue that\'s building now`, quality: `good`,
                note: `Correct. The provider ETA should have been irrelevant from the start. Customers in the queue need service regardless of when the system comes back.` },
              { id: `b`, label: `Brief the CEO and let them decide whether to activate a manual process`, quality: `partial`,
                note: `The CEO briefing is appropriate. But activating a manual process for a building customer queue is an operational decision — it doesn\'t require CEO approval to start.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Operational response activated, regulatory position managed`,
          tone:    `good`,
          result:  `Manual callbacks were running within 30 minutes. APRA was notified proactively. Their response acknowledged the disclosure and requested a remediation plan for the fallback architecture. The plan was submitted within 30 days. The follow-up review rated the incident response positively. The fallback architecture — secondary provider integration and documented manual process — was live within 90 days.`,
          learning: `Concentration risk events test two things: your operational resilience in the moment, and your regulatory posture in the disclosure. Proactive disclosure and a credible remediation plan are better than waiting to be asked.`,
          score:   100,
        },
        outcome_good: {
          heading: `Operational response activated, regulatory exposure managed conservatively`,
          tone:    `good`,
          result:  `Manual callbacks were activated. The regulatory decision to wait rather than proactively disclose was conservative. APRA did not raise the outage in their next review cycle. The fallback architecture was built regardless. The regulatory outcome was the same — the approach was riskier than necessary.`,
          learning: `CPS 230 compliance isn\'t just about the outage — it\'s about the absence of a tested fallback for a listed material service provider. That gap exists regardless of APRA\'s review cycle. Proactive disclosure of a known gap is generally lower risk than waiting to be found.`,
          score:   65,
        },
        outcome_bad: {
          heading: `Delayed response, extended customer impact`,
          tone:    `bad`,
          result:  `The customer queue grew to 134 before any manual process was activated. The CEO briefing added 45 minutes to the response time. The regulatory disclosure was eventually made — APRA\'s follow-up was less collaborative than it would have been with a proactive notification. The fallback architecture was built but the remediation plan was submitted under more scrutiny than a proactive approach would have generated.`,
          learning: `In a concentration risk event, two decisions determine the outcome: how quickly you serve customers when the primary system fails, and how you engage with regulators when a compliance gap is exposed. Delays in both are compounding.`,
          score:   10,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ─────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `Risk register, Item 7: "Single provider dependency." Likelihood: Low. Impact: High. Mitigation: "Monitor provider status." The outage happened. The mitigation was watching a status page.`,
          sub_caption: `"Monitor provider status" is not a fallback. It\'s a way of knowing you\'re failing.`,
          decision: {
            prompt: `The COO has the risk register item in front of her. She asks why the mitigation was "monitor provider status" rather than a fallback architecture. What do you tell her?`,
            choices: [
              { id: `a`, label: `The honest answer: the fallback was assessed as out of scope for the initial deployment budget and timeline. Low likelihood was the rationale for deferring it.`, quality: `good`,
                note: `Accurate and specific. The COO needs to understand the decision that was made, not a general explanation of why fallbacks are hard.` },
              { id: `b`, label: `The risk was identified and accepted at the time. The assessment proved incorrect.`, quality: `partial`,
                note: `True but incomplete. Risk acceptance is valid — but the mitigation of "monitor the status page" doesn\'t meaningfully reduce the impact of an outage. It just tells you it\'s happening.` },
              { id: `c`, label: `Single provider dependency is industry standard — most organisations don\'t have secondary LLM provider fallbacks`, quality: `poor`,
                note: `Possibly true in practice but not relevant to CPS 230. The standard is the regulation, not industry common practice.` },
            ],
          },
          branches: { a: `n2_honest`, b: `n2_risk_accepted`, c: `n2_industry_standard` },
        },

        n2_honest: {
          scene:       `office-bright`,
          caption:     `The COO accepts the account. She asks what a realistic fallback architecture looks like — not a theoretical one — and what it would have cost to build at deployment.`,
          sub_caption: `She\'s asking for the tradeoff decision that wasn\'t made explicitly at the time.`,
          decision: {
            prompt: `What do you tell her?`,
            choices: [
              { id: `a`, label: `Two options at deployment: secondary provider integration (4 weeks, ~$40K) or documented manual process (1 week, minimal cost). The manual process alone would have given the team something to work with today.`, quality: `good`,
                note: `Specific and honest. The manual process was the low-cost, high-value option that wasn\'t taken. Making that concrete for the COO frames the remediation decision clearly.` },
              { id: `b`, label: `Full secondary provider integration — the only robust fallback for a customer-facing AI system`, quality: `partial`,
                note: `Secondary provider integration is the robust solution. But the manual process was available at near-zero cost and would have meaningfully improved today\'s outage experience. Presenting only the expensive option narrows the remediation choices unnecessarily.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_risk_accepted: {
          scene:       `boardroom`,
          caption:     `The COO asks: "Was the risk acceptance documented and signed off by Risk?" You check the project file. There is no formal risk acceptance record — it was a project team decision.`,
          sub_caption: `Risk acceptance without formal sign-off isn\'t risk acceptance — it\'s a deferred decision.`,
          decision: {
            prompt: `The documentation gap has surfaced. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the gap — the risk should have been formally escalated for sign-off rather than managed as a project team decision`, quality: `good`,
                note: `A High impact risk on the register should not have been accepted without formal sign-off. Acknowledging that is the accurate account.` },
              { id: `b`, label: `Explain that the project team had authority to make risk acceptance decisions within the programme scope`, quality: `poor`,
                note: `That authority may exist for Low impact risks. A High impact item on the register — especially one with CPS 230 implications — required escalation.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_industry_standard: {
          scene:       `desk-working`,
          caption:     `The COO asks what CPS 230 requires for material service providers. You know the answer: tested fallback arrangements. "Monitor provider status" isn\'t that.`,
          sub_caption: `Industry standard isn\'t the CPS 230 standard.`,
          decision: {
            prompt: `The regulatory standard has been established. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the CPS 230 gap directly and propose the remediation options`, quality: `good`,
                note: `The industry standard defence has failed. Acknowledging the regulatory gap and moving to remediation is the constructive response.` },
              { id: `b`, label: `Recommend engaging external legal counsel to confirm the CPS 230 interpretation before accepting the exposure`, quality: `poor`,
                note: `CPS 230 is clear on tested fallback requirements. Seeking legal cover to delay accepting the obvious reading of the regulation is not a good look in a post-outage review.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Honest account, concrete remediation options`,
          tone:    `good`,
          result:  `The COO had the information she needed to make a remediation decision within 30 minutes of your conversation. The manual process was documented and deployed within one week — in time to be tested before the next scheduled maintenance window. The secondary provider integration was approved for the following quarter. The post-incident review noted that the remediation options were practical and costed.`,
          learning: `When a risk materialises that was deferred at deployment, the most useful thing you can bring to the post-incident conversation is specific options with realistic costs and timelines — not just an explanation of why the risk was deferred.`,
          score:   100,
        },
        outcome_good: {
          heading: `Account given, remediation path found`,
          tone:    `good`,
          result:  `The account was honest and the remediation was eventually scoped. The conversation took longer than it needed to because the full range of options wasn\'t presented upfront. Both the manual process and secondary provider integration were implemented. The timeline was slightly longer than the fastest path.`,
          learning: `Presenting all available remediation options — including the low-cost ones — gives decision-makers a complete picture. Narrowing to the most expensive option leaves the quick wins unaddressed.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Risk acceptance gap acknowledged, credibility reduced`,
          tone:    `warn`,
          result:  `The formal risk acceptance gap was acknowledged. The COO noted it in the post-incident review. The remediation was implemented. But the combination of deferred risk and undocumented acceptance meant the review was more critical of the programme governance than the technical gap alone would have warranted.`,
          learning: `Risk acceptance decisions need to be documented at the right level. A High impact risk accepted informally at project team level is not actually accepted — it\'s unresolved.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Defence failed, remediation delayed`,
          tone:    `bad`,
          result:  `The industry standard and legal delay defences added 30 minutes to the post-incident conversation and achieved nothing. The remediation was eventually scoped and implemented. The COO\'s review noted that the programme manager\'s initial response to the incident review had not been constructive. The same remediation options that were available from the start were implemented — three weeks later.`,
          learning: `When a risk materialises after being deferred, the post-incident conversation requires honesty about why it was deferred and concrete options for fixing it. Defences that delay that conversation don\'t change the outcome — they just make the path to it longer.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `Material service provider register: AI provider listed. CPS 230 requirement: tested fallback arrangements. Fallback status: "Monitor provider status." Outage duration so far: 45 minutes.`,
          sub_caption: `The COO wants the regulatory position confirmed. You know what it is.`,
          decision: {
            prompt: `The COO asks you to confirm the CPS 230 position. What do you tell her?`,
            choices: [
              { id: `a`, label: `Clear exposure: the provider is listed as material, CPS 230 requires tested fallback, the listed mitigation doesn\'t meet that standard. Proactive disclosure is likely the right approach.`, quality: `good`,
                note: `Accurate, specific, and includes a recommendation on next steps. The COO needs the clear picture and a direction, not a hedged analysis.` },
              { id: `b`, label: `Potential exposure depending on APRA\'s interpretation of "tested" — recommend legal review before confirming`, quality: `partial`,
                note: `Legal review may be appropriate for complex questions. "Tested fallback arrangements" for a material service provider is not a complex interpretive question — it\'s a clear requirement.` },
              { id: `c`, label: `The outage may not cross APRA\'s materiality threshold — 4 hours is relatively short`, quality: `poor`,
                note: `The issue isn\'t the outage duration — it\'s the absence of a tested fallback for a listed material service provider. That gap existed before the outage and is the CPS 230 issue.` },
            ],
          },
          branches: { a: `n2_clear_position`, b: `n2_legal_hedge`, c: `n2_materiality` },
        },

        n2_clear_position: {
          scene:       `office-briefing`,
          caption:     `The COO accepts your analysis. She asks: what does the remediation look like, and what should the APRA notification say?`,
          sub_caption: `You\'ve confirmed the exposure. Now you need to help resolve it.`,
          decision: {
            prompt: `What do you recommend for the APRA notification?`,
            choices: [
              { id: `a`, label: `Self-report the gap proactively: identify the material service provider, describe the outage, acknowledge the fallback gap, and present the remediation plan with a 30-day timeline`, quality: `good`,
                note: `This is the complete notification. APRA expects self-reporting of known compliance gaps. Presenting the remediation plan with the notification demonstrates the gap is being addressed, not just acknowledged.` },
              { id: `b`, label: `Notify APRA of the outage and await their guidance on whether remediation is required`, quality: `partial`,
                note: `Notifying is right. But waiting for APRA to tell you remediation is required when you already know it is positions the organisation as reactive rather than compliant.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_legal_hedge: {
          scene:       `desk-working`,
          caption:     `Legal responds in 2 hours: "Tested fallback arrangements" is a clear CPS 230 requirement. "Monitor provider status" does not meet the standard. The COO asks why you didn\'t confirm this yourself.`,
          sub_caption: `Two hours added to the analysis for a conclusion you already knew.`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the hedge was unnecessary — the standard is clear and you had the information to confirm it directly`, quality: `good`,
                note: `Honest. The COO\'s question is fair. Two hours on a clear regulatory question delayed the response unnecessarily.` },
              { id: `b`, label: `Maintain that legal confirmation was appropriate given the regulatory stakes`, quality: `partial`,
                note: `Legal confirmation has value for genuinely ambiguous questions. This wasn\'t one. Defending the hedge when it cost two hours during a live incident doesn\'t serve anyone.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_materiality: {
          scene:       `office-meeting`,
          caption:     `The COO reads the CPS 230 requirement directly: "tested fallback arrangements for material service arrangements." She asks whether the AI provider is a material service arrangement. It\'s on the register. You listed it yourself.`,
          sub_caption: `The materiality question has answered itself.`,
          decision: {
            prompt: `The CPS 230 position is now clear regardless of your initial analysis. What do you tell the COO?`,
            choices: [
              { id: `a`, label: `Confirm the exposure directly and recommend proactive disclosure with a remediation plan`, quality: `good`,
                note: `The right answer, arriving late. Giving it clearly now is better than continuing to hedge.` },
              { id: `b`, label: `Recommend waiting to see if the outage resolves within 4 hours before deciding on disclosure`, quality: `poor`,
                note: `The disclosure question is about the fallback gap, not the outage duration. The gap existed before the outage started and will exist after it ends.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Clear regulatory position, complete notification approach`,
          tone:    `good`,
          result:  `The COO had the regulatory position and a notification approach within 30 minutes of the outage starting. APRA was notified proactively with a remediation plan. Their response was collaborative. The fallback architecture — documented manual process and secondary provider integration — was live within 90 days. Your analysis was cited in the remediation submission as the basis for the disclosure approach.`,
          learning: `A clear regulatory analysis with a specific recommendation is more useful than a hedged one with a direction toward legal review. When the standard is clear, say so clearly and recommend the action.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct position confirmed, notification made`,
          tone:    `good`,
          result:  `The regulatory position was eventually confirmed clearly. Notification was made. APRA\'s response was standard. The remediation was completed. The timeline was slightly longer than the fastest path due to the hedge or the partial recommendation. The outcome was the same.`,
          learning: `Regulatory analysis that\'s accurate but late or hedged still produces the right outcome — just more slowly. When speed matters, clarity matters.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Late confirmation, response delayed`,
          tone:    `warn`,
          result:  `The regulatory position was confirmed two hours after it could have been. The notification was made on time. APRA\'s response included a note that the organisation\'s internal compliance process had added unnecessary delay to the confirmation. The fallback architecture was built and the matter was closed, but the process observation stayed on the record.`,
          learning: `In regulatory analysis, the cost of hedging a clear question is time — and time has a cost during a live incident. Legal review is right for ambiguous questions. Clear standards don\'t need legal cover.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Wrong analysis held, exposure extended`,
          tone:    `bad`,
          result:  `The materiality and outage duration framing delayed the regulatory response by 90 minutes. The COO eventually overrode the analysis and directed notification. APRA\'s response noted the delay and requested an explanation of the internal compliance process. The explanation did not reflect well on the technology risk function.`,
          learning: `Regulatory exposure analysis has to start from the regulation, not from an outcome you prefer. "The outage might not be material" is a conclusion in search of support. The question is what the regulation requires — and on this one, it was clear.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `AI provider dependency mapping`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `The provider was on the material service provider register. The dependency was known. What was missing was the fallback architecture that CPS 230 requires for listed material service providers. Mapping the dependency without designing the fallback creates a documented gap rather than a managed risk.`,
    },
    {
      id:      `c2`,
      label:   `Fallback architecture or degraded mode`,
      effort:  `High`,
      owner:   `Technology`,
      go_live: true,
      context: `No fallback existed. A documented manual process — the low-cost option — would have given the customer service team something to work with during the outage at minimal build cost. Secondary provider integration is the robust solution; a manual process is the minimum viable fallback.`,
    },
    {
      id:      `c3`,
      label:   `Business continuity planning for AI`,
      effort:  `Medium`,
      owner:   `Risk`,
      go_live: false,
      context: `The BCP had no AI provider outage scenario. The outage was the first time the organisation discovered it had no manual process, no customer communication plan, and no clear escalation path for this type of failure.`,
    },
  ],
};
