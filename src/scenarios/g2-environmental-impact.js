// G2 — The Hidden Cost
// AI Environmental Impact & Sustainability Governance
//
// Setting: An organisation announces net-zero targets. Three months later they
// announce a major AI capability investment requiring data centre expansion.
// An investor raises the question at the AGM: is AI compute in the emissions forecast?
//
// Differentiation from all live scenarios:
//   The risk here is a governance gap between two valid organisational priorities —
//   sustainability commitments and AI investment. No bad actor, no system failure.
//   The tension is between what was publicly committed and what was actually planned.
//   First scenario about ESG/sustainability governance and investor accountability.
//   The learning is about integration: AI governance and sustainability governance
//   need to talk to each other before announcements are made.

export const scenario = {
  id:                `g2-environmental-impact`,
  risk_ref:          `G2`,
  title:             `The Hidden Cost`,
  subtitle:          `AI Environmental Impact & Sustainability Governance`,
  domain:            `G — Systemic & Societal`,
  difficulty:        `Foundational`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-g-systemic/g2-environmental-impact`,
  estimated_minutes: 11,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Sustainability Analyst`,
      character: `Sam`,
      icon:      `◇`,
      framing:   `You prepared the net-zero pathway model six months ago. The AI investment that was just announced wasn't in it. You need to work out how significant the gap is before the AGM in two weeks.`,
      premise:   `You work in the sustainability team. Six months ago you built the net-zero pathway model that underpinned the public commitment — a 42% emissions reduction by 2030. Last week, the Chief Digital Officer announced a major AI capability investment: three new GPU clusters, a data centre expansion, and significant cloud AI inference spending. None of it was in your model. The AGM is in two weeks. An investor advisory firm has already posted on LinkedIn asking whether the AI investment is consistent with the net-zero commitment. Your manager has asked you to quantify the gap before the board is briefed.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Sustainability Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `An investor has stood up at the AGM and asked whether AI compute is included in the net-zero pathway modelling. You don't know the answer. The CDO is sitting next to you.`,
      premise:   `The AGM is underway. An institutional investor — representing 4.2% of shares — has the microphone. "Can the board confirm that the energy consumption associated with the AI capability investment announced last month is included in the company's net-zero pathway modelling and emissions forecasts?" You turn to the CDO. He gives you a look you recognise: it wasn't coordinated. You have about ten seconds to decide how to answer.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `AI Infrastructure Programme Lead`,
      character: `Priya`,
      icon:      `◎`,
      framing:   `You're running the AI infrastructure programme. Energy consumption was in your cost model. It was never shared with the sustainability team. They didn't ask. You didn't think to tell them.`,
      premise:   `You've been running the AI infrastructure programme for four months. Your cost model has detailed energy projections — GPU cluster power draw, cooling overhead, cloud inference costs. It's all there. What you didn't do is share it with the sustainability team. They weren't in your stakeholder map. The programme was scoped as a technology initiative, not an ESG one. The CDO has just called you from the AGM. The sustainability team is asking for your energy figures right now.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `ESG Data Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You need to quantify whether the AI investment materially changes the net-zero pathway. You have the infrastructure programme's energy projections. The question is whether they break the commitment.`,
      premise:   `The sustainability team has just received the AI infrastructure programme's energy model — GPU clusters, cooling, cloud inference. You need to assess whether these additions materially change the net-zero pathway and, if so, by how much. The board needs a briefing within 24 hours. The investor is expecting a written response within 48 hours. You have the numbers. The question is how to present a finding that may be uncomfortable.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Sam ───────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `GPU clusters, data centre expansion, cloud inference spend. None of it was in the net-zero model. The AGM is in two weeks.`,
          sub_caption: `An investor advisory firm is already asking questions publicly.`,
          decision: {
            prompt: `You need to quantify the gap. What do you do first?`,
            choices: [
              { id: `a`, label: `Request the AI infrastructure programme's energy projections from the technology team immediately — you can't quantify the gap without their numbers`, quality: `good`,
                note: `The infrastructure programme has the energy data. Getting it is the prerequisite for everything else — the board briefing, the investor response, the model update.` },
              { id: `b`, label: `Estimate the gap yourself using publicly available GPU power draw benchmarks and the announced investment scale`, quality: `partial`,
                note: `A reasonable interim approach if the technology team is slow to respond. But estimates based on public benchmarks are less accurate than the programme's own projections and will need to be replaced.` },
              { id: `c`, label: `Check whether the net-zero commitment was worded in a way that might exclude AI compute from scope`, quality: `poor`,
                note: `Looking for a drafting escape hatch before understanding the actual gap is the wrong priority. If the gap is material, the investor will find it regardless of the wording.` },
            ],
          },
          branches: { a: `n2_data_request`, b: `n2_estimate`, c: `n2_wording` },
        },

        n2_data_request: {
          scene:       `office-briefing`,
          caption:     `The infrastructure programme shares their energy model within two hours. GPU cluster power draw: 2.4MW. Cooling overhead: 0.8MW. Cloud inference: estimated 1.2MW equivalent. Total additional load: ~4.4MW annually.`,
          sub_caption: `Your current net-zero model assumed a 3% year-on-year efficiency improvement. This is a 12% step increase in energy consumption.`,
          decision: {
            prompt: `The numbers are significant. What does your analysis tell the board?`,
            choices: [
              { id: `a`, label: `The AI investment materially changes the net-zero pathway — the 2030 target requires either offsetting this load through additional reductions elsewhere, or updating the public commitment`, quality: `good`,
                note: `Accurate and honest. The board needs this framing to make an informed decision. Softening it before the board sees it delays a decision that needs to be made.` },
              { id: `b`, label: `The gap can probably be offset through accelerated efficiency measures elsewhere — frame it as a pathway adjustment rather than a breach`, quality: `partial`,
                note: `If the efficiency offsets are identified and costed, this framing is legitimate. If they're hypothetical, it's optimistic framing that the investor will see through.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_estimate: {
          scene:       `desk-focused`,
          caption:     `Your benchmark estimate: ~3.8MW additional load annually, based on announced GPU cluster scale and public data centre efficiency ratios.`,
          sub_caption: `This is approximately a 10% step increase on your current baseline — material by any ESG definition.`,
          decision: {
            prompt: `Your estimate suggests a material gap. The infrastructure programme's actual numbers will be more precise. What do you do?`,
            choices: [
              { id: `a`, label: `Share the estimate with the board as preliminary, flag the methodology, and request the programme's actual data urgently`, quality: `good`,
                note: `A clearly labelled preliminary estimate with a request for actual data is the honest approach. It moves the board briefing forward while being clear about confidence levels.` },
              { id: `b`, label: `Wait for the actual programme data before briefing anyone — an estimate could be misleading`, quality: `partial`,
                note: `If the actual data is coming within hours, waiting is fine. If it takes days, the investor advisory firm will have published their own estimate before the board knows the internal picture.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_wording: {
          scene:       `desk-reading`,
          caption:     `The commitment wording: "We commit to a 42% reduction in Scope 1, 2, and 3 emissions by 2030 from our 2023 baseline." AI cloud inference is Scope 3. This is in scope.`,
          sub_caption: `There is no drafting escape. The commitment covers it.`,
          decision: {
            prompt: `The wording doesn't help. The gap is real. What now?`,
            choices: [
              { id: `a`, label: `Request the infrastructure programme's energy data and quantify the gap before the board is briefed`, quality: `good`,
                note: `Correct — the wording question was a detour. The data is still needed. Get it now.` },
              { id: `b`, label: `Escalate to your manager that the commitment may not be achievable given the AI investment, without yet knowing the scale`, quality: `partial`,
                note: `Escalating before knowing the scale adds urgency without adding information. Get the numbers first, then escalate with a complete picture.` },
            ],
          },
          branches: { a: `n2_data_request`, b: `outcome_warn` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Gap quantified accurately, board informed`,
          tone:    `good`,
          result:  `Your analysis gave the board a clear picture before the investor response deadline. The 12% step increase was confirmed by the infrastructure programme's actual data. The board approved an updated net-zero pathway incorporating the AI investment, with three specific efficiency measures to compensate. The investor received a written response within 48 hours acknowledging the gap and the updated pathway. The advisory firm rated the response positively.`,
          learning: `AI investments and sustainability commitments need to be developed together, not announced separately. The sustainability team not being in the AI programme's stakeholder map is the governance gap — not the energy consumption itself.`,
          score:   100,
        },
        outcome_good: {
          heading: `Preliminary estimate, pathway adjusted`,
          tone:    `good`,
          result:  `The preliminary estimate was close to the actual figures. The board acted on it while the precise numbers were confirmed. The updated pathway was published within a week. The investor response was slightly delayed but accurate. The investor advisory firm noted the response was complete and credible.`,
          learning: `A well-labelled preliminary estimate with a clear methodology is more useful than silence while waiting for perfect data. The board needs to move; give them what you have with the appropriate caveats.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Gap identified late, investor timeline missed`,
          tone:    `warn`,
          result:  `The data arrived two days after the investor expected a response. The advisory firm published their own estimate — less accurate than yours but publicly visible before your response. The board briefing used your more accurate numbers but the timeline damage was done. The CDO and CSO were both called to a board sub-committee to explain the coordination failure.`,
          learning: `In ESG governance, investor timelines are not negotiable. The investor is asking about public commitments — they will form their own view on the available timeline if the company doesn't respond to theirs.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Wording search, gap unquantified before AGM`,
          tone:    `bad`,
          result:  `The time spent on the wording analysis meant the gap wasn't quantified before the AGM. The CSO was unable to answer the investor's question with numbers. The board asked for a written response within 48 hours. The infrastructure programme's data was eventually obtained — but the AGM exchange had already been reported in the financial press as an unanswered ESG question.`,
          learning: `When an investor raises a question about a public commitment, the answer has to be data-driven. Wording analysis is a legal question, not an ESG one. Get the numbers first.`,
          score:   10,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom-agm`,
          caption:     `An institutional investor. 4.2% of shares. Microphone in hand. "Is the AI compute investment included in your net-zero pathway modelling?" You and the CDO exchange a look.`,
          sub_caption: `Ten seconds to decide how to answer.`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: `a`, label: `"That's an important question. I want to give you a complete and accurate answer — we'll provide a written response within 48 hours that addresses this specifically."`, quality: `good`,
                note: `Honest and buys the time needed to get the actual answer. An AGM answer that's incomplete is better than one that's wrong. Investors respect "we'll give you the precise answer in writing" more than a hedged verbal response.` },
              { id: `b`, label: `"Our net-zero programme encompasses all material energy uses — AI infrastructure investment is naturally part of that framework."`, quality: `partial`,
                note: `Technically this might become true after the pathway is updated. Right now it's not accurate. If the investor does their own analysis, this answer creates a credibility problem.` },
              { id: `c`, label: `Defer to the CDO to answer — this is a technology question.`, quality: `poor`,
                note: `The sustainability commitment is yours, not the CDO's. Passing it to the CDO signals to the room that you don't own the ESG agenda you publicly committed to.` },
            ],
          },
          branches: { a: `n2_committed_response`, b: `n2_deflected`, c: `n2_deferred` },
        },

        n2_committed_response: {
          scene:       `office-bright`,
          caption:     `The AGM moves on. Afterwards, you have 48 hours to deliver the written response. The sustainability team needs the infrastructure programme's energy data within the day.`,
          sub_caption: `The 48-hour commitment is now your deadline.`,
          decision: {
            prompt: `The written response needs to do two things: answer the question accurately and address the pathway implications. What is your position on the pathway?`,
            choices: [
              { id: `a`, label: `Acknowledge the AI investment wasn't in the original pathway model, commit to a revised pathway within 30 days, and describe the specific measures being identified to compensate`, quality: `good`,
                note: `Honest, specific, forward-looking. This is what institutional investors expect from credible ESG governance — not perfection, but transparency and a clear remediation path.` },
              { id: `b`, label: `State that the AI investment is within the company's overall sustainability framework and that the 2030 target remains the commitment`, quality: `partial`,
                note: `If the pathway analysis confirms the target is still achievable with the AI load, this is accurate. If it's being said before that analysis is complete, it's premature.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_deflected: {
          scene:       `boardroom-agm`,
          caption:     `Post-AGM. The investor advisory firm has posted: "Management confirmed AI infrastructure is within the net-zero framework — we will seek quantitative confirmation." Your sustainability team has just told you the AI investment was not in the model.`,
          sub_caption: `The answer you gave at the AGM was inaccurate. The investor will know this when the numbers arrive.`,
          decision: {
            prompt: `The AGM answer and the actual position have diverged. What do you do?`,
            choices: [
              { id: `a`, label: `Proactively contact the investor with a correction and the accurate position before they ask`, quality: `good`,
                note: `Proactive correction is always better than waiting to be caught. Investors have long memories about AGM accuracy. Getting ahead of it preserves credibility.` },
              { id: `b`, label: `Wait for the written response deadline and address it there — no need to draw additional attention`, quality: `poor`,
                note: `The advisory firm's post is already public. Waiting until the deadline means the inaccurate answer sits on the record longer and the correction looks reactive.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },

        n2_deferred: {
          scene:       `boardroom-agm`,
          caption:     `The CDO gives a technical answer about GPU efficiency and cloud provider sustainability commitments. The investor follows up: "But is the total energy consumption in your emissions model?" The CDO doesn't know.`,
          sub_caption: `Both of you are now visibly without the answer.`,
          decision: {
            prompt: `The AGM moment has become uncomfortable. How do you recover?`,
            choices: [
              { id: `a`, label: `Step back in: "We'll provide a complete written response within 48 hours — that's the appropriate way to give you an accurate and detailed answer."`, quality: `good`,
                note: `Recovering the situation with a clear commitment is better than extending the uncomfortable exchange. The room will respect the pivot.` },
              { id: `b`, label: `Let the CDO continue — stepping back in will make the uncertainty more visible`, quality: `poor`,
                note: `The uncertainty is already visible. Continuing to let the CDO field a question they can\'t answer makes it worse, not better.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Honest AGM answer, credible written response`,
          tone:    `good`,
          result:  `The 48-hour written response acknowledged the pathway gap, committed to a revised model within 30 days, and identified three specific measures being assessed. The investor advisory firm rated the response as "transparent and constructive." The revised pathway was published on schedule. The episode became a case study in how to handle an ESG governance gap professionally.`,
          learning: `Investors don't expect perfection on sustainability — they expect transparency and credible governance. "We'll give you the accurate answer in writing" is a stronger position than an inaccurate verbal answer at a microphone.`,
          score:   100,
        },
        outcome_good: {
          heading: `Written response delivered, position clarified`,
          tone:    `good`,
          result:  `The written response addressed the question. Whether it was fully accurate or required a pathway revision depended on the analysis completed in time. The investor received a substantive answer. The advisory firm's follow-up assessment was mixed — the substance was there but the initial framing at the AGM had created some uncertainty.`,
          learning: `The AGM answer and the written response need to be consistent. A verbal answer that turns out to be optimistic, followed by a written response that adjusts the position, creates a credibility gap even if the final position is accurate.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Recovered from poor start, timeline tight`,
          tone:    `warn`,
          result:  `The pivot at the AGM was well-received. The written response was delivered on time with the accurate position. The fact that it took two executives to not answer the question before committing to a written response was noted in the advisory firm's commentary — but the response quality offset it.`,
          learning: `The strongest position at an AGM is the CSO owning the ESG question directly and immediately committing to a written response. Passing to the CDO first costs credibility before the pivot.`,
          score:   35,
        },
        outcome_bad: {
          heading: `AGM exchange reported, credibility damaged`,
          tone:    `bad`,
          result:  `The extended AGM exchange — CDO unable to answer, CSO visibly without numbers — was covered in two financial press outlets. The written response came in on time but the framing had already been set. The chair asked the CSO and CDO to present a joint governance review of how the AI investment and sustainability commitments were coordinated. The answer: they weren't.`,
          learning: `ESG governance failures at an AGM are public events with a public record. The coordination failure — AI investment and sustainability commitments developed independently — is the root cause. The AGM exchange is the consequence.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Priya ───────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `Your cost model has detailed energy projections. The sustainability team wasn't in your stakeholder map. The CDO is calling from the AGM asking for your figures right now.`,
          sub_caption: `The data exists. It was never shared.`,
          decision: {
            prompt: `The CDO needs your energy numbers in the next hour. What do you send?`,
            choices: [
              { id: `a`, label: `Send the full energy model immediately — GPU cluster draw, cooling overhead, cloud inference estimate, and methodology notes`, quality: `good`,
                note: `The sustainability team needs accurate numbers fast. Send everything — the methodology notes matter as much as the figures so they can assess confidence levels.` },
              { id: `b`, label: `Send the headline figures only — the full model might cause confusion without context`, quality: `partial`,
                note: `Speed is right. But the sustainability team needs the methodology to assess accuracy. Headlines without methodology will generate follow-up questions that slow things down.` },
              { id: `c`, label: `Ask what format the sustainability team needs before sending anything`, quality: `poor`,
                note: `There is no time to negotiate format. Send the data now in whatever format it exists — format can be refined later.` },
            ],
          },
          branches: { a: `n2_full_data`, b: `n2_headlines`, c: `n2_format_delay` },
        },

        n2_full_data: {
          scene:       `office-meeting-aftermath`,
          caption:     `Data sent. The sustainability team comes back within the hour: the AI investment represents a 12% step increase in energy consumption. The net-zero pathway needs updating.`,
          sub_caption: `Your numbers are accurate. The gap is real.`,
          decision: {
            prompt: `The CDO asks you to propose how the programme can reduce its energy footprint to help close the pathway gap. What do you recommend?`,
            choices: [
              { id: `a`, label: `Three specific options: preferred cloud regions with higher renewable mix, GPU cluster workload scheduling to off-peak renewable periods, and smaller model evaluation for inference tasks`, quality: `good`,
                note: `Specific, costed options give the sustainability team something to model. This is the programme taking ownership of its contribution to the problem.` },
              { id: `b`, label: `Recommend the sustainability team model the gap and identify what offsetting measures are needed organisation-wide`, quality: `partial`,
                note: `Organisation-wide measures are appropriate. But the programme also has direct levers — renewable region selection, workload scheduling — that are faster to implement than organisation-wide initiatives.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_headlines: {
          scene:       `desk-working`,
          caption:     `The sustainability team receives the headline figures. Within 30 minutes they come back: they need the methodology to assess whether the cloud inference estimate is Scope 2 or Scope 3 and what confidence level to assign.`,
          sub_caption: `The follow-up questions cost 30 minutes you didn't have.`,
          decision: {
            prompt: `The methodology questions are arriving. Send the full model now?`,
            choices: [
              { id: `a`, label: `Yes — send the full model with methodology notes immediately`, quality: `good`,
                note: `Should have been sent first. Send it now — the 30-minute delay is the cost of the partial approach.` },
              { id: `b`, label: `Answer the Scope 2/3 question verbally and send the rest of the model separately`, quality: `partial`,
                note: `The verbal answer helps but the full model still needs to go. Send both simultaneously.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_format_delay: {
          scene:       `desk-colleague`,
          caption:     `The format negotiation takes 20 minutes. By the time data is shared, the sustainability team has 40 minutes to produce the board briefing. The analysis is rushed.`,
          sub_caption: `The data existed. The delay was process.`,
          decision: {
            prompt: `The sustainability team has produced a rushed analysis. The board briefing has a confidence caveat attached. What do you do?`,
            choices: [
              { id: `a`, label: `Offer to review the analysis against your model for accuracy before it goes to the board`, quality: `good`,
                note: `The right response to having caused a delay is to actively help close the gap it created.` },
              { id: `b`, label: `The analysis is the sustainability team\'s responsibility — they have the data now`, quality: `poor`,
                note: `The delay was yours. The rushed analysis is a consequence you can help fix. Stepping back at this point doesn\'t reflect well.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Data shared immediately, mitigation options provided`,
          tone:    `good`,
          result:  `The sustainability team had accurate data with methodology within the hour. Your three mitigation options — renewable cloud regions, workload scheduling, smaller model evaluation — were modelled and two were included in the investor response. The CDO cited the programme's proactive response in the board briefing as an example of responsible AI deployment.`,
          learning: `When an AI programme creates an environmental impact, owning the numbers and offering specific mitigations is the responsible response. The gap between the programme and the sustainability team shouldn\'t have existed — but once it did, the speed and completeness of the data handoff determined the quality of the outcome.`,
          score:   100,
        },
        outcome_good: {
          heading: `Data eventually complete, gap closed`,
          tone:    `good`,
          result:  `The full model arrived in time for the board briefing. The methodology questions caused a 30-minute delay but the analysis was completed accurately. The investor response was on time and substantive. The CDO asked the programme to be added to the sustainability team\'s stakeholder map for future AI deployments.`,
          learning: `Sending complete data with methodology upfront is faster than sending headlines and answering follow-up questions. The sustainability team can\'t assess confidence without the methodology.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Data late, analysis partially accurate`,
          tone:    `warn`,
          result:  `The format delay and partial data handoff meant the board briefing had a confidence caveat that could have been avoided. The investor received an accurate response but the internal process was noted as a coordination failure in the post-AGM review. The programme was added to the sustainability team\'s stakeholder map with a note about data sharing expectations.`,
          learning: `In a time-critical governance situation, format and process questions should never delay sending data. The data goes first in whatever format it exists.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Delay caused, responsibility not taken`,
          tone:    `bad`,
          result:  `The rushed analysis had an error in the Scope 3 cloud inference estimate. The investor\'s written response had to be corrected 24 hours after it was sent. The post-AGM review identified the programme as a contributing factor to both the original gap and the analysis quality issue. The CDO mandated joint planning between the AI infrastructure programme and sustainability for all future phases.`,
          learning: `When a programme causes a governance gap through poor data sharing, the response needs to be active engagement — not stepping back once the data is eventually transferred.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `drift-dashboard`,
          caption:     `GPU clusters: 2.4MW. Cooling: 0.8MW. Cloud inference: ~1.2MW equivalent. Total addition: ~4.4MW annually. Current baseline: ~37MW. That's a 12% step increase.`,
          sub_caption: `The net-zero pathway assumed 3% year-on-year efficiency improvements. This changes the picture significantly.`,
          decision: {
            prompt: `The board briefing is in four hours. How do you frame the finding?`,
            choices: [
              { id: `a`, label: `Lead with the material finding clearly: the AI investment adds ~12% to energy consumption and was not in the net-zero pathway model — then present pathway options`, quality: `good`,
                note: `The board needs the clear finding first, then the options. A finding buried after context and caveats makes the decision harder, not easier.` },
              { id: `b`, label: `Frame it as a pathway adjustment — the target is still achievable with additional efficiency measures, and lead with that`, quality: `partial`,
                note: `If the efficiency measures are identified and costed, this framing is appropriate. If they\'re speculative, leading with "still achievable" before the board has seen the gap is premature optimism.` },
              { id: `c`, label: `Present the raw numbers without interpretation and let the board decide what they mean`, quality: `poor`,
                note: `The board needs analysis, not raw data. Raw numbers without interpretation require the board to do the analyst\'s job in the room — that\'s not what the briefing is for.` },
            ],
          },
          branches: { a: `n2_clear_finding`, b: `n2_optimistic`, c: `n2_raw_data` },
        },

        n2_clear_finding: {
          scene:       `office-briefing`,
          caption:     `The board has the clear finding. The CSO asks: what are the pathway options and what do they cost?`,
          sub_caption: `You\'ve modelled three scenarios.`,
          decision: {
            prompt: `Which framing best serves the board's decision?`,
            choices: [
              { id: `a`, label: `Three scenarios with costs and timeline: (1) revise the 2030 target, (2) offset the AI load through accelerated efficiency measures, (3) prioritise renewable sourcing for AI infrastructure`, quality: `good`,
                note: `Three options with costs and timelines is the right analytical output. The board can see the tradeoffs and make an informed decision.` },
              { id: `b`, label: `Recommend the most achievable scenario and present that with supporting analysis`, quality: `partial`,
                note: `A recommendation is useful. But on a question with commercial and ESG implications this significant, presenting options and letting the board decide is more appropriate than a single recommendation.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_optimistic: {
          scene:       `desk-focused`,
          caption:     `The CSO asks: "What efficiency measures are you proposing to compensate?" You haven't identified specific measures yet — the framing assumed they were achievable but the modelling isn't complete.`,
          sub_caption: `The optimistic framing has run ahead of the analysis.`,
          decision: {
            prompt: `The efficiency measures weren\'t modelled before the briefing. How do you recover?`,
            choices: [
              { id: `a`, label: `Acknowledge the measures haven\'t been modelled yet and provide three candidate options you can model within 24 hours`, quality: `good`,
                note: `Acknowledging the gap and providing a credible path to completing the analysis is the honest and constructive response.` },
              { id: `b`, label: `Identify the three most common efficiency measures in the industry and present them as the likely pathway`, quality: `partial`,
                note: `Industry examples provide context but aren\'t a substitute for costed analysis of your specific situation. Make clear these are indicative, not modelled.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_raw_data: {
          scene:       `boardroom`,
          caption:     `The board is looking at a table of numbers. Three directors are doing mental arithmetic. One asks: "Is this a problem?" Another asks: "Does this mean we need to revise the 2030 target?" A third: "What's the investor going to say?"`,
          sub_caption: `The board is doing the analysis in the room. This is what happens without interpretation.`,
          decision: {
            prompt: `The board is asking you the interpretation questions you should have answered in the briefing. How do you respond?`,
            choices: [
              { id: `a`, label: `Answer each question directly and clearly — provide the interpretation the briefing should have contained`, quality: `good`,
                note: `Better late than never. Answer the questions clearly and commit to providing a properly framed briefing document within the day.` },
              { id: `b`, label: `Note that interpretation requires additional analysis and recommend a second briefing`, quality: `poor`,
                note: `You have the data and you can interpret it now. Deferring to a second briefing when you can answer the questions in the room wastes everyone\'s time.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Clear finding, three-scenario analysis`,
          tone:    `good`,
          result:  `The board had the finding and three options with costs and timelines in a single briefing. They approved scenario 3 — renewable sourcing for AI infrastructure — within the session and asked for the revised pathway to be modelled. The investor response was delivered within 48 hours with specific commitments. The advisory firm rated it as one of the more substantive ESG responses they\'d received in the sector.`,
          learning: `ESG analysis for a board needs the finding, the options, and the costs — in that order. A board can make a good decision with good analysis. They can\'t make a good decision with raw numbers.`,
          score:   100,
        },
        outcome_good: {
          heading: `Sound analysis, single recommendation`,
          tone:    `good`,
          result:  `The board received clear analysis with a recommendation. They accepted it, with one director noting they\'d have liked to see the alternative scenarios costed. The investor response was on time and credible. The recommendation was implemented within the committed timeline.`,
          learning: `A recommendation supported by analysis is useful. On material ESG questions, showing the alternatives and their tradeoffs is more valuable to the board than a single recommendation — it demonstrates the analysis was thorough.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Optimistic framing, analysis incomplete`,
          tone:    `warn`,
          result:  `The optimistic framing was partially recoverable. The 24-hour extension was granted. The modelled efficiency measures were achievable and the pathway was updated. But the board and the CSO both noted that the briefing had been framed ahead of the analysis — a credibility issue for future briefings.`,
          learning: `Analytical framing should follow the analysis, not precede it. Leading with an optimistic conclusion before the supporting analysis is complete risks the finding when the analysis doesn\'t support it.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Raw data presented, board did the analysis`,
          tone:    `bad`,
          result:  `The board spent 40 minutes doing analysis that should have been in the briefing. The CSO was visibly frustrated. The investor response was delayed by 24 hours while the proper analysis was completed. The post-AGM review noted that the ESG data analyst\'s briefing had not met the standard expected for board-level reporting.`,
          learning: `A board briefing is not a data dump. The analyst\'s job is to interpret the data so the board can make decisions, not to present raw numbers and expect the board to do the interpretation.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `AI energy consumption tracking`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: false,
      context: `The infrastructure programme had detailed energy projections that were never shared with the sustainability team. Without integration between AI governance and ESG reporting, material energy commitments can be made without the sustainability team knowing they exist.`,
    },
    {
      id:      `c2`,
      label:   `Efficient model selection review`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: false,
      context: `The AI investment was sized without an efficiency evaluation — whether smaller models or renewable cloud regions could deliver the required capability at lower energy cost. This review would have reduced the gap and provided credible mitigation evidence for the investor response.`,
    },
    {
      id:      `c3`,
      label:   `AI compute governance`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: false,
      context: `The AI infrastructure programme was approved as a technology initiative without an ESG impact assessment. A governance gate requiring sustainability team sign-off for AI investments above a defined energy threshold would have surfaced the pathway conflict before the public announcement.`,
    },
  ],
};
