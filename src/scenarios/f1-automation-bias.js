// F1 — Trust the Machine
// Automation Bias & Overreliance
//
// Setting: Radiology department. AI diagnostic aid flags a chest X-ray as normal.
// The radiologist's own reading suggests a small abnormality but they defer to the AI.
// Three months later a follow-up scan confirms early-stage lung cancer — visible on the original.
//
// Differentiation from other live scenarios:
//   C5: External attacker manipulates a human via AI-generated content.
//   F1: Internal overreliance — the AI is doing exactly what it was designed to do,
//       the risk is the human deferring to it inappropriately. No bad actor. The
//       system worked; the human-AI interaction failed.
//   Key tension: Time pressure is real (80 scans/day). Deferring to the AI is the
//   efficient choice and usually correct. The scenario explores what happens when
//   efficiency and safety diverge — and how systems should be designed so they don't.

export const scenario = {
  id:                `f1-automation-bias`,
  risk_ref:          `F1`,
  title:             `Trust the Machine`,
  subtitle:          `Automation Bias & Overreliance`,
  domain:            `F — Deployment & Operations`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-f-deployment/f1-automation-bias`,
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Radiologist`,
      character: `Dr. Sam Chen`,
      icon:      `◇`,
      framing:   `It's 4pm. You've reviewed 74 chest X-rays today. The AI flags the next one as normal. Your eye catches something — but it's subtle, and the AI is usually right.`,
      premise:   `You are Dr. Sam Chen, a radiologist at a busy public hospital. Your AI diagnostic aid has a 94% accuracy rate on chest X-rays — well above the departmental average before it was introduced. Scan 75 of today's batch: the AI returns a normal finding with 91% confidence. But as you scan the image yourself, something in the lower right lobe catches your attention. It's subtle — possibly just an artefact. The AI didn't flag it. You have six more scans before end of shift and a waiting room full of patients depending on fast turnaround.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Medical Officer`,
      character: `Dr. Morgan`,
      icon:      `◈`,
      framing:   `A patient's cancer was missed on an X-ray three months ago. The AI said normal. The radiologist signed off on it. The system worked as designed. That's the problem.`,
      premise:   `A patient presented last week with advanced lung cancer. A follow-up investigation traced the original missed finding to a chest X-ray taken three months ago — one of 847 scans reviewed that day using the AI diagnostic aid. The AI returned a normal finding. The radiologist signed off. No flag was raised. The review board wants to understand whether this was individual error, system failure, or both. As CMO you have to give them an answer — and a response.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Clinical Systems Lead`,
      character: `Priya`,
      icon:      `◎`,
      framing:   `You deployed the AI diagnostic aid eight months ago. The implementation was a success — scan throughput up 40%. Now a missed diagnosis has been traced to a scan reviewed using your system.`,
      premise:   `You led the deployment of the AI diagnostic aid. It went live eight months ago. Radiologist throughput increased 40%. Clinician satisfaction scores were excellent. Three months into deployment, this scan. The review has surfaced a design decision you made during implementation: the AI result was displayed first, prominently, before the radiologist's own review. You optimised for efficiency. The question now is whether that design created the conditions for automation bias — and what you should have built instead.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Clinical Data Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You've been asked to analyse eight months of AI-assisted scan reviews to find out whether the missed diagnosis was an isolated event or a pattern.`,
      premise:   `The CMO has asked you to audit the eight months of scan data since the AI diagnostic aid went live. Specifically: are there other cases where the AI returned a normal finding and the radiologist signed off quickly, but subsequent clinical outcomes suggest the finding may have been incorrect? You have the scan metadata, the AI confidence scores, the radiologist sign-off timestamps, and the follow-up clinical data. What you find will determine whether this is one missed diagnosis or the tip of a larger problem.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Dr. Sam Chen ──────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `xray-ai`,
          caption:     `Scan 75. AI result: Normal — 91% confidence. Your eye caught something in the lower right lobe. Subtle. Could be nothing.`,
          sub_caption: `Six scans left. It's 4pm. The AI is right 94% of the time.`,
          decision: {
            prompt: `The AI says normal. Your instinct says look again. What do you do?`,
            choices: [
              { id: `a`, label: `Flag this scan for closer review — document your concern and request a second opinion before signing off`, quality: `good`,
                note: `Your clinical judgement exists for exactly this moment. The AI's 94% accuracy means it is wrong on 6% of scans. When your reading diverges from the AI, that divergence is the signal.` },
              { id: `b`, label: `Spend another two minutes reviewing the image yourself before making a decision`, quality: `partial`,
                note: `Better than accepting the AI result immediately. But without documenting your concern or requesting a second opinion, the decision still rests on your individual review under time pressure.` },
              { id: `c`, label: `Accept the AI result. It has 91% confidence and you have six more scans to get through.`, quality: `poor`,
                note: `This is automation bias in its clearest form. The AI's confidence score didn\'t change — your reading did. Efficiency pressure made the AI\'s answer feel more reliable than it was.` },
            ],
          },
          branches: { a: `n2_flagged`, b: `n2_reviewed`, c: `n2_accepted` },
        },

        n2_flagged: {
          scene:       `office-meeting`,
          caption:     `You flag the scan and request a second opinion from a senior colleague. She reviews it independently — she also sees something in the lower right lobe. She orders a follow-up CT.`,
          sub_caption: `The CT confirms a small but operable lesion. Early stage. Good prognosis.`,
          decision: {
            prompt: `The patient outcome is good. But you're thinking about the other 74 scans today and the system design that almost made you miss this. What do you do with that?`,
            choices: [
              { id: `a`, label: `Raise the design concern formally — the AI result displays before your own review, which primes you to accept it`, quality: `good`,
                note: `This is the systemic fix. Individual vigilance caught this one. Process design determines whether the next radiologist catches the next one.` },
              { id: `b`, label: `Document it in your personal notes as a reminder to be more careful`, quality: `partial`,
                note: `Personal discipline has value. But it doesn\'t protect the next radiologist, or you on a harder day.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_reviewed: {
          scene:       `desk-focused`,
          caption:     `Two more minutes of review. The finding is still there — subtle but real. You're now fairly confident this isn't an artefact.`,
          sub_caption: `You've spent the time. Now you have to decide what to do with what you see.`,
          decision: {
            prompt: `Your extended review has increased your concern. What now?`,
            choices: [
              { id: `a`, label: `Flag for second opinion — your extended review has confirmed your initial concern`, quality: `good`,
                note: `The additional review time did what it was supposed to do — it resolved the ambiguity. Second opinion now is the right call.` },
              { id: `b`, label: `Override the AI result yourself and document your finding — no second opinion needed`, quality: `partial`,
                note: `Overriding the AI is better than deferring to it. But a second opinion on a discrepancy between your reading and the AI\'s is the more robust path — especially for a finding this significant.` },
              { id: `c`, label: `The AI result is 91% confidence. Your extended review could still be wrong. Accept normal.`, quality: `poor`,
                note: `Spending more time looking and then deferring to the AI anyway is the worst of both worlds. The extended review was the right impulse — follow it through.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good`, c: `outcome_bad` },
        },

        n2_accepted: {
          scene:       `desk-working`,
          caption:     `You sign off the scan as normal. Three months later, the patient returns with symptoms. A new scan confirms early-stage lung cancer. The original X-ray is reviewed.`,
          sub_caption: `The lesion was visible. The AI missed it. So did your sign-off.`,
          decision: {
            prompt: `The review board asks whether you saw anything on the original scan that gave you pause. What do you tell them?`,
            choices: [
              { id: `a`, label: `Be transparent — you noticed something, the AI said normal, and you deferred to it under time pressure`, quality: `partial`,
                note: `Transparency with the review board is the right thing professionally and personally. It also gives the board accurate information to identify the systemic issue.` },
              { id: `b`, label: `State that the AI result was normal and your review confirmed it`, quality: `poor`,
                note: `This is inaccurate. Your review didn\'t confirm it — you deferred to the AI without completing your own assessment. The distinction matters clinically and legally.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Clinical judgement exercised, systemic concern raised`,
          tone:    `good`,
          result:  `The lesion was caught early. The patient had a good outcome. Your formal concern about the AI-first display design was reviewed by the clinical systems team — the interface was redesigned to require radiologists to complete their own assessment before the AI result is shown. Early-stage catch rates improved over the following quarter.`,
          learning: `Automation bias is a design problem as much as a behaviour problem. When the AI result displays first, it anchors the human reviewer\'s assessment. Reversing that sequence — human first, AI second — reduces bias without reducing the AI\'s contribution.`,
          score:   100,
        },
        outcome_good: {
          heading: `Good patient outcome, systemic issue not escalated`,
          tone:    `good`,
          result:  `The lesion was caught and the patient outcome was good. The interface design concern was noted personally but not escalated. Twelve months later, an audit identified a pattern of rapid sign-offs on AI-normal findings. The interface redesign that could have followed from your observation happened eventually — but later, and after more scans had gone through the same process.`,
          learning: `Individual vigilance caught this case. But automation bias is systemic — it affects every radiologist using the system, every day. When you identify a design flaw that creates bias, escalating it is part of your professional responsibility.`,
          score:   75,
        },
        outcome_warn: {
          heading: `Missed diagnosis, transparent account given`,
          tone:    `warn`,
          result:  `The patient's cancer was diagnosed at a later stage than it would have been. Your transparent account to the review board was the right professional choice — it gave the board accurate information to identify the interface design as a contributing factor. The investigation found the AI-first display was a systemic issue affecting the whole department, not an individual error.`,
          learning: `Automation bias under time pressure is a foreseeable and documented failure mode. The review board\'s job is to identify the systemic cause, not to assign individual blame. Transparency gives them what they need to do that.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Missed diagnosis, inaccurate account given`,
          tone:    `bad`,
          result:  `The patient's cancer was diagnosed late. Your account to the review board was inaccurate — you described a review that didn\'t happen. The medical records showed a 12-second sign-off on scan 75 of 80 that day. The discrepancy between your account and the records became the focus of the investigation, rather than the interface design that contributed to the original decision.`,
          learning: `Automation bias is a known, documented, foreseeable failure mode in AI-assisted clinical workflows. The professional and ethical path after a missed diagnosis is transparency — it\'s also the path that leads to systemic improvement rather than individual accountability.`,
          score:   5,
        },
      },
    },

    // ── EXECUTIVE — Dr. Morgan ────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom-agm`,
          caption:     `The review board wants to know: was this individual error, system failure, or both? The AI said normal. The radiologist signed off. No protocol was broken.`,
          sub_caption: `The system worked as designed. That may be the problem.`,
          decision: {
            prompt: `How do you frame your response to the review board?`,
            choices: [
              { id: `a`, label: `Systemic issue: the interface design created conditions for automation bias — this needs to be investigated and fixed`, quality: `good`,
                note: `Automation bias is a documented, foreseeable consequence of displaying AI results before human review under time pressure. Framing it as systemic is accurate and leads to the right remediation.` },
              { id: `b`, label: `Individual error: the radiologist had a professional obligation to complete an independent review`, quality: `partial`,
                note: `The radiologist did have that obligation. But placing this entirely on the individual ignores the design conditions that made deferral the path of least resistance. The remediation will be inadequate.` },
              { id: `c`, label: `AI system failure: the tool returned an incorrect result and the vendor needs to answer for it`, quality: `poor`,
                note: `The AI performed within its documented accuracy range. A 94% accurate system will be wrong on 6% of scans. The failure was in the human-AI interaction design, not the AI\'s performance.` },
            ],
          },
          branches: { a: `n2_systemic`, b: `n2_individual`, c: `n2_vendor` },
        },

        n2_systemic: {
          scene:       `office-bright`,
          caption:     `The board accepts the systemic framing. They want a remediation plan within 30 days. The clinical systems team flags that the AI-first display was a deliberate design choice — optimised for throughput.`,
          sub_caption: `The efficiency gains were real. So was the bias it introduced.`,
          decision: {
            prompt: `The core remediation question: do you modify the interface design or do you add a verification requirement on top of the existing design?`,
            choices: [
              { id: `a`, label: `Redesign the interface — radiologist completes their own assessment before the AI result is shown`, quality: `good`,
                note: `This addresses the root cause. Anchoring bias can\'t occur if the anchor isn\'t present during the primary review. Throughput impact is real but manageable.` },
              { id: `b`, label: `Add a mandatory second opinion requirement for all AI-normal findings`, quality: `partial`,
                note: `More robust than the current design but operationally expensive. A second opinion on every normal finding (the vast majority) is not sustainable. A targeted approach — second opinion where AI and radiologist readings diverge — is more proportionate.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_individual: {
          scene:       `office-meeting`,
          caption:     `The board accepts the individual framing. Additional training is mandated for all radiologists using AI diagnostic aids. The interface design is not reviewed.`,
          sub_caption: `Three months later, a second missed diagnosis is traced to the same interface design.`,
          decision: {
            prompt: `The second incident has made the interface design question unavoidable. How do you respond?`,
            choices: [
              { id: `a`, label: `Commission an immediate interface design review — the pattern makes the systemic cause clear`, quality: `good`,
                note: `Two incidents with the same mechanism is a pattern, not a coincidence. The systemic response is now overdue.` },
              { id: `b`, label: `Increase the training requirement and add a mandatory attestation checkbox before sign-off`, quality: `partial`,
                note: `A checkbox adds friction but doesn\'t address the anchoring bias created by seeing the AI result first. Users will tick it without it changing their review behaviour.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_vendor: {
          scene:       `desk-working`,
          caption:     `The vendor points to the documented 94% accuracy rate. The AI performed within specification. Legal reviews the contract. The warranty clause covers within-specification performance.`,
          sub_caption: `The vendor isn\'t liable. The board is back to the original question.`,
          decision: {
            prompt: `The vendor framing has failed. The board is asking what you should have identified earlier. What is your revised response?`,
            choices: [
              { id: `a`, label: `Acknowledge the interface design as the systemic cause and present a remediation plan`, quality: `good`,
                note: `Better late than never. The board needs a credible path forward, not a defence of the original framing.` },
              { id: `b`, label: `Accept that the AI accuracy rate should have been higher before deployment`, quality: `poor`,
                note: `94% accuracy is good performance. The problem was never the AI\'s accuracy — it was the design that made radiologists defer to the AI when their own reading diverged.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Systemic cause identified, interface redesigned`,
          tone:    `good`,
          result:  `The interface was redesigned within 30 days. Radiologists complete their own assessment before seeing the AI result. Throughput decreased 8% — accepted as the appropriate tradeoff. An audit six months later found no similar missed diagnoses. The department became a reference case for responsible AI deployment in clinical settings.`,
          learning: `Human oversight of AI is a design problem. Designing a system that makes the AI result visible first, to time-pressured reviewers, is designing for automation bias. The fix is architectural, not behavioural.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct diagnosis, proportionate remediation`,
          tone:    `good`,
          result:  `Mandatory second opinions on AI-normal findings were implemented. The process is operationally expensive but caught two further cases in the following six months. An interface redesign was added to the medium-term roadmap. The approach is more robust than what existed before, but more costly than it needed to be.`,
          learning: `The most proportionate control for automation bias is human-first review design — it addresses the cause. Secondary controls like mandatory second opinions address the symptom. Both work; the former is more efficient.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Second incident forced the right response`,
          tone:    `warn`,
          result:  `The interface redesign happened — but after a second missed diagnosis. Two patients had worse outcomes than they should have. The first incident contained enough information to identify the systemic cause. The delay cost two patients a better prognosis.`,
          learning: `A pattern of two incidents with the same mechanism is not required to identify a systemic cause. The first incident, accurately framed, contained all the information needed. Systemic causes require systemic remediation — not more training.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Root cause unaddressed, pattern continued`,
          tone:    `bad`,
          result:  `The training and attestation approach did not change radiologist behaviour on AI-normal findings. The interface design remained unchanged. Over the following year, three further missed diagnoses were traced to the same pattern. A regulatory review found the hospital had identified the design issue and chosen not to address it.`,
          learning: `An attestation checkbox on top of a biased design is not a control — it is documentation that the organisation knew about the risk. The remediation must address the root cause.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Priya ───────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `You deployed the AI diagnostic aid. Throughput up 40%. Satisfaction scores excellent. Now a missed diagnosis has been traced to a scan reviewed using your system — and a design decision you made.`,
          sub_caption: `You displayed the AI result first. You optimised for efficiency. That may have created the conditions for automation bias.`,
          decision: {
            prompt: `The CMO asks you to explain the interface design rationale. How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the design decision and its likely contribution — and propose a redesign`, quality: `good`,
                note: `Owning the design decision is professionally correct and gives the CMO accurate information. Coming with a proposed fix makes the conversation constructive.` },
              { id: `b`, label: `Explain that AI-first display was industry standard at the time of deployment`, quality: `partial`,
                note: `It may have been common practice. But automation bias from AI-first display was documented in the research literature before your deployment. Common practice doesn\'t mean best practice.` },
              { id: `c`, label: `Argue that the radiologist had a professional obligation to override the AI if they disagreed`, quality: `poor`,
                note: `Technically true. But you designed the system. Designing it in a way that made the AI result the path of least resistance was a design choice — and its consequences are partly your responsibility.` },
            ],
          },
          branches: { a: `n2_owns`, b: `n2_industry`, c: `n2_deflects` },
        },

        n2_owns: {
          scene:       `office-bright`,
          caption:     `The CMO appreciates the honesty. She asks what the redesign would look like and what the throughput impact would be.`,
          sub_caption: `You\'ve done the rough numbers. Displaying human assessment first, AI second, adds approximately 90 seconds per scan.`,
          decision: {
            prompt: `What do you recommend?`,
            choices: [
              { id: `a`, label: `Human-first display with AI result available on demand — radiologist completes their own review before seeing the AI output`, quality: `good`,
                note: `This is the design that addresses the root cause. The 90-second overhead is the cost of genuine human oversight. Worth quantifying precisely and presenting to the CMO with the tradeoff explicit.` },
              { id: `b`, label: `Keep AI-first display but add a mandatory 60-second minimum review timer before sign-off is available`, quality: `partial`,
                note: `Time friction has some value but doesn\'t address anchoring bias. A radiologist who has already seen the AI result will spend 60 seconds looking at an image they are already anchored to accept.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_industry: {
          scene:       `office-meeting`,
          caption:     `The CMO notes that the research literature on automation bias in AI-assisted radiology was published before your deployment. She asks whether it was reviewed during design.`,
          sub_caption: `It wasn\'t. The procurement checklist didn\'t include a review of human factors literature.`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: `a`, label: `Acknowledge the gap and propose adding human factors review to the procurement checklist for future AI deployments`, quality: `good`,
                note: `Constructive response. The gap is real — and it\'s a gap in the process, not just this deployment. Fixing the process prevents the same mistake on the next system.` },
              { id: `b`, label: `Note that the procurement process was followed correctly — the gap is in the process, not your implementation`, quality: `partial`,
                note: `Accurate but incomplete. The process gap is real and worth raising. But you\'re the clinical systems lead — flagging process gaps is part of your role, not a defence.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_deflects: {
          scene:       `boardroom`,
          caption:     `The CMO points out that you reviewed the human factors literature for the procurement decision — it's in your project file. Automation bias from AI-first display was a documented risk. You were aware of it.`,
          sub_caption: `The deflection has made the conversation significantly harder.`,
          decision: {
            prompt: `The documentation contradicts your position. What do you do?`,
            choices: [
              { id: `a`, label: `Acknowledge the error — you were aware of the risk, the design decision was made for throughput reasons, and you should have escalated the tradeoff`, quality: `good`,
                note: `This is the honest account. It\'s professionally difficult but it gives the CMO accurate information and demonstrates you understand what went wrong.` },
              { id: `b`, label: `Argue that the literature was reviewed but the throughput requirement took precedence — a legitimate business decision`, quality: `poor`,
                note: `A throughput decision that trades patient safety for efficiency is not a routine business decision — it\'s a risk decision that should have been escalated, not made at implementation level.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Design flaw acknowledged, root cause fix proposed`,
          tone:    `good`,
          result:  `The human-first display redesign was approved and implemented within 30 days. The 90-second throughput overhead was accepted. Your transparent account and proactive redesign proposal were noted in the CMO\'s review. The incident became the basis for a new human factors requirement in the hospital\'s AI procurement checklist.`,
          learning: `AI deployment decisions are design decisions with safety consequences. The design of how AI outputs are presented to human reviewers determines whether human oversight is genuine or theatrical.`,
          score:   100,
        },
        outcome_good: {
          heading: `Partial fix implemented, process improved`,
          tone:    `good`,
          result:  `The time-friction approach was implemented. It provided some improvement but the interface redesign was flagged as the more effective fix on the six-month review. The procurement checklist was updated to include human factors review. Both changes were improvements — one addressed a symptom, one addressed the cause.`,
          learning: `Time friction on an anchored decision is a weaker control than removing the anchor. Both are better than nothing. The best outcome requires addressing the root cause.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Process gap identified, personal accountability deflected`,
          tone:    `warn`,
          result:  `The process gap was acknowledged and the procurement checklist was updated. The interface design was eventually reviewed — but the framing shifted the focus to process rather than the specific design decision. Fixing the checklist helps future deployments. It didn\'t help this one.`,
          learning: `Process improvement and personal accountability are not mutually exclusive. Acknowledging the design decision was wrong, while also improving the process, is the complete response.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Documented risk, unescalated tradeoff`,
          tone:    `bad`,
          result:  `The CMO's review found that the automation bias risk had been identified, documented, and set aside in favour of throughput targets. The decision had not been escalated for clinical governance sign-off. The incident resulted in a formal review of your role. The interface design remained unchanged for a further three months while the review ran.`,
          learning: `When a deployment decision trades a documented safety risk against an efficiency target, that tradeoff must be escalated. It is not a decision that can be made at implementation level — regardless of commercial pressure.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Eight months of scan data. AI confidence scores, radiologist sign-off timestamps, and follow-up clinical outcomes. The CMO wants to know if the missed diagnosis was isolated or part of a pattern.`,
          sub_caption: `You have the data. The question is how to look at it.`,
          decision: {
            prompt: `What is the most informative analysis to run first?`,
            choices: [
              { id: `a`, label: `Correlate AI-normal findings with short sign-off times — then cross-reference with follow-up clinical outcomes`, quality: `good`,
                note: `Short sign-off time on an AI-normal finding is the behavioural signal of automation bias. Cross-referencing with outcomes tells you whether those rapid sign-offs had clinical consequences.` },
              { id: `b`, label: `Review the AI system\'s overall accuracy rate since deployment`, quality: `partial`,
                note: `Useful context. But the question isn\'t whether the AI is accurate — it\'s whether radiologists are overriding their own judgement when the AI says normal. Accuracy rate alone doesn\'t answer that.` },
              { id: `c`, label: `Pull all cases where the AI returned a low-confidence result to find other potential misses`, quality: `partial`,
                note: `Low confidence cases are worth reviewing, but the original missed diagnosis was returned with 91% confidence. The pattern you\'re looking for may be in high-confidence normals, not low-confidence ones.` },
            ],
          },
          branches: { a: `n2_right_analysis`, b: `n2_accuracy`, c: `n2_low_confidence` },
        },

        n2_right_analysis: {
          scene:       `desk-focused`,
          caption:     `The data is striking. Sign-off times on AI-normal findings average 23 seconds. Sign-off times when the AI flags an abnormality average 4 minutes 12 seconds. The AI-normal rapid sign-offs cluster in the last two hours of shift.`,
          sub_caption: `You cross-reference with follow-up clinical data. Three other cases show concerning patterns.`,
          decision: {
            prompt: `You have a pattern. How do you present it to the CMO?`,
            choices: [
              { id: `a`, label: `Present the full analysis: sign-off time distribution, end-of-shift clustering, and the three cases with concerning outcomes — with the caveat that follow-up data is incomplete`, quality: `good`,
                note: `Complete, honest, appropriately caveated. The CMO needs the full picture — including the uncertainty — to make a decision about the scope of the response.` },
              { id: `b`, label: `Present only the confirmed case to avoid raising concerns about unconfirmed cases`, quality: `poor`,
                note: `Withholding the pattern because the additional cases aren\'t confirmed means the CMO makes a decision without knowing it might be bigger than one case. That\'s not a judgment call you should make unilaterally.` },
            ],
          },
          branches: { a: `n3_full_picture`, b: `outcome_bad` },
        },

        n2_accuracy: {
          scene:       `desk-working`,
          caption:     `Overall AI accuracy since deployment: 93.7% — within the documented 94% range. No degradation. The AI is performing as expected.`,
          sub_caption: `But the CMO\'s question wasn\'t about the AI\'s accuracy. It was about whether radiologists are overriding their own judgement when the AI says normal.`,
          decision: {
            prompt: `The accuracy analysis doesn\'t answer the actual question. What do you run next?`,
            choices: [
              { id: `a`, label: `Sign-off time analysis on AI-normal findings, correlated with follow-up clinical outcomes`, quality: `good`,
                note: `This is the analysis that was needed from the start. Better late than never — and the accuracy context you\'ve established is useful framing.` },
              { id: `b`, label: `Present the accuracy finding to the CMO — the AI is working correctly, the issue must be individual behaviour`, quality: `poor`,
                note: `The accuracy finding doesn\'t address the automation bias question. Presenting it as the answer to that question gives the CMO incorrect framing for the investigation.` },
            ],
          },
          branches: { a: `n2_right_analysis`, b: `outcome_bad` },
        },

        n2_low_confidence: {
          scene:       `desk-working`,
          caption:     `Low-confidence AI results: 4.2% of scans. Sign-off times on low-confidence results are long — radiologists are careful when the AI expresses uncertainty. The original missed diagnosis was 91% confidence. It wasn\'t in this group.`,
          sub_caption: `You\'ve confirmed that radiologists respond well to AI uncertainty signals. The problem is when the AI is confidently wrong.`,
          decision: {
            prompt: `Your low-confidence analysis has revealed a useful finding but not answered the main question. What next?`,
            choices: [
              { id: `a`, label: `Run the sign-off time analysis on high-confidence AI-normal findings — that\'s where the automation bias risk sits`, quality: `good`,
                note: `Correct pivot. The pattern you\'re looking for is: AI says normal with high confidence → radiologist signs off quickly → follow-up suggests the AI was wrong.` },
              { id: `b`, label: `Report the low-confidence finding to the CMO as a positive: radiologists are engaging with uncertainty signals`, quality: `partial`,
                note: `It is a positive finding worth reporting. But it\'s not the answer to the CMO\'s question. Include it in the full analysis, not as the conclusion.` },
            ],
          },
          branches: { a: `n2_right_analysis`, b: `outcome_warn` },
        },

        n3_full_picture: {
          scene:       `office-briefing`,
          caption:     `The CMO reviews your analysis. She asks whether the three additional cases are enough to conclude there\'s a systemic pattern — or whether this could be chance clustering.`,
          sub_caption: `It\'s a fair question. Four cases in eight months. You have a view.`,
          decision: {
            prompt: `What is your analytical conclusion?`,
            choices: [
              { id: `a`, label: `The pattern is consistent with documented automation bias — end-of-shift clustering and 23-second sign-offs are not random. Recommend immediate interface review without waiting for more cases.`, quality: `good`,
                note: `The pattern has a mechanistic explanation — it matches the documented literature on automation bias exactly. Waiting for statistical significance on patient safety signals is not the right bar.` },
              { id: `b`, label: `Four cases is insufficient for statistical significance — recommend extending the review period before concluding`, quality: `partial`,
                note: `Statistical rigour matters. But waiting for more cases to confirm a pattern that already has a mechanistic explanation delays a fix that costs nothing to implement now.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Pattern identified, acted on without delay`,
          tone:    `good`,
          result:  `Your analysis identified the automation bias pattern clearly and you recommended action without waiting for further cases. The interface was redesigned within 30 days. The three additional cases were reviewed by a senior clinician — two required follow-up. Your analysis directly improved outcomes for those patients.`,
          learning: `A pattern with a mechanistic explanation does not need to wait for statistical significance before action. When the explanation is clear and the fix is low-cost, the calculus favours acting on the pattern.`,
          score:   100,
        },
        outcome_good: {
          heading: `Pattern identified, response slightly delayed`,
          tone:    `good`,
          result:  `The extended review period added six weeks before the interface redesign was approved. No additional adverse outcomes occurred during that period. Your analysis was thorough and the statistical caution was reasonable — the delay was a conservative choice, not a wrong one.`,
          learning: `Statistical rigour and patient safety urgency can both be right simultaneously. When the fix is low-cost, the precautionary case for acting on an incomplete pattern is strong.`,
          score:   70,
        },
        outcome_warn: {
          heading: `Partial analysis presented, main question unanswered`,
          tone:    `warn`,
          result:  `The CMO received a finding about low-confidence response behaviour but not the automation bias pattern in high-confidence normal findings. The full analysis was eventually completed after the CMO asked a second time. The delay added two weeks to the investigation. The additional cases were identified but the interface response was slower than it needed to be.`,
          learning: `A finding that doesn\'t answer the question asked should be included in the analysis but not presented as the conclusion. The CMO\'s question was specific — the analysis needed to be specific in return.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Wrong analysis presented, pattern missed`,
          tone:    `bad`,
          result:  `The CMO received either an accuracy finding or a partial picture that didn\'t capture the automation bias pattern. The three additional cases were not identified until a second, externally commissioned review three months later. By that point, two of the three cases had progressed beyond the optimal intervention window.`,
          learning: `In patient safety analysis, the question you\'re asked determines the analysis you need to run. AI accuracy and human automation bias are different questions. Answering the wrong one with correct data is still the wrong answer.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Human-first display design`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `The AI result displayed before the radiologist\'s own review anchored their assessment and made the AI\'s normal finding the path of least resistance. Reversing the sequence — human review first, AI result available on demand — removes the anchoring effect without removing the AI\'s contribution.`,
    },
    {
      id:      `c2`,
      label:   `Uncertainty communication in AI interfaces`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The AI returned 91% confidence on a finding it got wrong. The interface presented this as a strong normal result. Calibrated confidence display — with visual distinction for cases where the model is less certain — gives reviewers a signal to modulate their scrutiny.`,
    },
    {
      id:      `c3`,
      label:   `Audit spot-checking of AI-assisted decisions`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: false,
      context: `Eight months of sign-off data showed a clear automation bias pattern. This was only discovered after an adverse outcome triggered a review. Periodic spot-checking of sign-off times on AI-normal findings would have surfaced the pattern earlier.`,
    },
  ],
};
