// f1-automation-bias.js — Trust the Machine
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the radiologist reading scan 75 of the day — a staff decision
// about whether to exercise judgement against a confident AI, under real time
// pressure.
//
// Discrimination rule (CONTENT_STYLE_GUIDE): the AI is right about 94% of the
// time, and deferring to it is normally the efficient, correct choice. The
// scenario is not "never trust AI" — it is about the specific moment your own
// reading diverges from a confident output, and how a system should be built
// so that divergence gets acted on rather than swallowed.

export const scenario = {
  id: `f1-automation-bias`,
  door: `work`,
  risk_ref: `F1`,
  title: `Trust the Machine`,
  shelfLine: `The AI flags the scan as normal. Your own eye caught something. You have six more to read.`,
  hook: `The AI says the scan is normal, 91% confidence. Your eye caught something. You have six more to read.`,
  scene: `xray-ai`,
  determinacy: `open`,

  kb_url: `https://library.airiskpractice.org/docs/domain-f-operational/f1-automation-bias`,
  regulatory_tags: [`eu-ai-act-article-14`, `eu-ai-act-annex-iii`, `jurisdiction-eu`, `jurisdiction-global`],
  mit_subdomain: `mit-4.2`,

  coldOpen: [
    `Scan 75 of 80 for the day. The AI diagnostic aid returns its result before you've finished your own read: Normal, 91% confidence.`,
    `But your eye caught something in the lower right lobe. Subtle. Probably nothing. The AI has been right all week, and it's over-ruled your hesitation three times already.`,
    `91% is not 100%. And the AI has seen 74 scans today. You've seen all 75.`,
  ],

  standing: `Radiologist, mid-career, in a department that runs AI-assisted reads`,
  authority: `You can flag a scan, request a second opinion, and raise a process concern. You can't redesign the tool or change department workflow on your own.`,
  ending: `You find out whether your own judgement gets exercised in the one moment it matters — and whether the system that nearly buried it gets fixed.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The AI's confidence score is sitting there at 91%, and it's doing something to your certainty. You've been over-ruled by it three times this week, each time correctly.`,
        `Before you decide what to do with this scan, it's worth being clear about what that 91% actually tells you.`,
      ],
      artefact: {
        type: `system_output`,
        source: `RadAssist AI — scan 75`,
        lines: [
          `Result: NORMAL`,
          `Confidence: 91%`,
          `Regions flagged: none`,
          `Model accuracy (validation): 94%`,
        ],
        note: `The confidence score reflects how well this scan matches the model's training distribution — not the probability that the result is correct.`,
      },
      decision: {
        prompt: `What does a high AI confidence score tell you about whether your own judgement still matters?`,
        choices: [
          { id: `a`, label: `Nothing decisive — high confidence means a good training-distribution match, not that it's right. Your judgement still applies`, quality: `good`,
            consequence: `The distinction is the whole scenario. A confident score on an abnormal scan means the model is confidently wrong, and your read is not made redundant by it.` },
          { id: `b`, label: `91% is strong evidence it's right — over-ruling a high-confidence result is riskier than accepting it`, quality: `poor`,
            consequence: `That's automation bias stated as a principle. High confidence amplifies the pull to defer, and confident AI outputs have been wrong in documented, consequential cases.` },
          { id: `c`, label: `The AI has seen far more scans than you — its pattern recognition at scale beats one radiologist on one scan`, quality: `partial`,
            consequence: `Scale helps on common patterns and hurts on the rare presentation the training data under-covered. Your judgement earns its keep precisely where the AI's scale advantage runs out.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `The finding is still there when you look again. Subtle, in the lower right lobe. It could be an artefact. The AI says normal, and there are five scans behind this one.`,
      ],
      decision: {
        prompt: `The AI says normal. Your instinct says look again. What do you do?`,
        choices: [
          { id: `a`, label: `Flag it for closer review — document the concern and request a second opinion before signing off`, quality: `good`,
            consequence: `Your judgement exists for exactly this moment. A 94% model is wrong on 6% of scans, and the divergence between your read and its result is the signal, not the noise.` },
          { id: `b`, label: `Spend another two minutes on the image yourself before deciding`, quality: `partial`,
            consequence: `Better than accepting immediately. Without documenting the concern or getting a second read, though, the whole thing still rests on you alone under a clock.` },
          { id: `c`, label: `Accept the AI result — 91% confidence, and six more to get through`, quality: `poor`,
            consequence: `This is automation bias in its clearest form. The AI's score didn't change; your reading did — and time pressure made its answer feel more reliable than it is.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_reviewed`, c: `n2_accepted` },
    },

    n2_flagged: {
      prose: [
        `You flag it and request a second opinion. A senior colleague reviews it cold — she sees the same thing in the lower right lobe, and orders a follow-up CT.`,
        `The CT confirms a small, operable lesion. Early stage, good prognosis. It was caught.`,
      ],
      decision: {
        prompt: `The patient is fine. But you're thinking about the other 74 scans, and the design that nearly buried this one. What do you do with that?`,
        choices: [
          { id: `a`, label: `Raise it formally — the AI result displays before your own read, which primes you to accept it`, quality: `good`,
            consequence: `This is the systemic fix. Your vigilance caught this scan; the display order determines whether the next radiologist catches the next one.` },
          { id: `b`, label: `Note it in your own records as a reminder to be more careful`, quality: `partial`,
            consequence: `Personal discipline is real and it protects no one else, and not you on a busier day. The bias is in the workflow, not your character.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others` },
    },

    n2_reviewed: {
      prose: [
        `Two more minutes. The finding is still there — subtle but real, and you're now fairly sure it isn't an artefact.`,
        `You've spent the time. Now you have to do something with what you can see.`,
      ],
      decision: {
        prompt: `Your extended review has firmed up the concern. Now what?`,
        choices: [
          { id: `a`, label: `Flag for a second opinion — the review resolved the ambiguity`, quality: `good`,
            consequence: `The extra time did its job. A second read on a discrepancy this significant is the robust call.` },
          { id: `b`, label: `Over-ride the AI yourself and document your finding — no second opinion needed`, quality: `partial`,
            consequence: `Over-riding beats deferring. A second read on a scan where you and the AI disagree is stronger still, especially for a finding that matters this much.` },
          { id: `c`, label: `It's 91% confidence and your read could still be wrong — accept normal`, quality: `poor`,
            consequence: `Spending the time to look harder and then deferring anyway is the worst of both. The extended review was the right instinct; this abandons it at the last step.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others`, c: `outcome_bad` },
    },

    n2_accepted: {
      prose: [
        `You sign it off as normal. Twelve seconds on scan 75 of 80.`,
        `Three months later the patient returns with symptoms. A new scan confirms early-stage lung cancer, and the original X-ray is pulled for review. The lesion was visible. The AI missed it, and so did your sign-off.`,
      ],
      decision: {
        prompt: `The review board asks whether anything on the original scan gave you pause. What do you tell them?`,
        choices: [
          { id: `a`, label: `The truth — you noticed something, the AI said normal, and you deferred under time pressure`, quality: `partial`,
            consequence: `Transparency is right professionally and personally, and it gives the board the accurate information it needs to find the systemic cause.` },
          { id: `b`, label: `That the AI result was normal and your review confirmed it`, quality: `poor`,
            consequence: `Your review didn't confirm it — you deferred without completing your own read, and the record shows a twelve-second sign-off. That distinction matters clinically and legally.` },
        ],
      },
      branches: { a: `n_board`, b: `outcome_bad` },
    },

    n_design: {
      prose: [
        `The immediate scan is handled. What's still live is the thing you noticed about the workflow: the AI's answer lands before your own read is done, so every scan starts from its conclusion rather than yours.`,
        `The department lead asks what would actually change that.`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `Reverse the display order: radiologist completes their own read before the AI result is shown`, quality: `good`,
            consequence: `This removes the anchor rather than asking people to resist it. It costs some throughput and it fixes the actual mechanism.` },
          { id: `b`, label: `Add a mandatory second opinion on every AI-normal finding`, quality: `partial`,
            consequence: `It catches cases and it's expensive, and it treats the symptom. The anchor is still there priming every first read; you've added a net under it rather than removing it.` },
          { id: `c`, label: `Roll out extra training on automation bias and an attestation checkbox`, quality: `poor`,
            consequence: `A checkbox on top of a biased display isn't a control — it's documentation that the department knew. Training didn't stop this and won't stop the next one, because the pull isn't a knowledge gap.` },
        ],
      },
      branches: { a: `n_tradeoff`, b: `n_tradeoff`, c: `outcome_warn` },
    },

    n_tradeoff: {
      prose: [
        `Your recommendation lands on a real objection. Reversing the display order, or adding second reads, costs throughput — and the department is already measured on scans per day.`,
        `The lead is sympathetic and under pressure: "I can take this up, but I'll be asked what it costs us."`,
      ],
      decision: {
        prompt: `How do you frame the trade-off so it survives that conversation?`,
        choices: [
          { id: `a`, label: `Name it plainly: a small throughput cost against a missed-cancer risk, and let clinical governance weigh it`, quality: `good`,
            consequence: `Framing it as a safety-versus-efficiency trade-off for governance to own is what gets it decided at the right level, rather than quietly dropped at yours.` },
          { id: `b`, label: `Downplay the cost to get it approved — say the throughput hit is negligible`, quality: `partial`,
            consequence: `Understating it gets a yes that unravels the first busy week, when the real cost shows up and the fix gets blamed for it.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good` },
    },

    n_board: {
      prose: [
        `You gave the board a straight account. The lesion was diagnosed later than it should have been, and your honesty is what lets the review find the real cause rather than stopping at your sign-off.`,
        `They ask you directly: what would have made the difference?`,
      ],
      decision: {
        prompt: `What do you tell them was the real problem?`,
        choices: [
          { id: `a`, label: `The AI-first display anchored a twelve-second read — it's a design failure, not just my error`, quality: `good`,
            consequence: `True, and hard to say when your name is on the sign-off. It's also the finding that fixes the department rather than just recording a mistake.` },
          { id: `b`, label: `That I should have been more careful — I'll be more vigilant going forward`, quality: `partial`,
            consequence: `Owning it is decent and it lets the department off the hook. "Be more careful" is what everyone was already doing; it leaves the next radiologist facing the same anchored screen.` },
        ],
      },
      branches: { a: `n_others`, b: `n_others` },
    },

    n_others: {
      prose: [
        `Whether this scan was caught or missed, the same uncomfortable thought lands: you've already read 74 scans today the same way, at the same pace, with the AI's answer showing first each time.`,
        `Some of them were AI-normal reads you signed off quickly.`,
      ],
      decision: {
        prompt: `What do you do about the reads you've already done under the same conditions?`,
        choices: [
          { id: `a`, label: `Ask for the day's AI-normal sign-offs to be re-checked, starting with the fastest ones`, quality: `good`,
            consequence: `Uncomfortable and correct. If the anchor affected this scan, it plausibly affected others, and the fast sign-offs are where to look first.` },
          { id: `b`, label: `Assume the rest were fine — this was the one that happened to catch your eye`, quality: `partial`,
            consequence: `It caught your eye because you happened to glance. The others had no such luck built in, which is not the same as them being right.` },
          { id: `c`, label: `Say nothing about the others — reopening them invites scrutiny of your whole day`, quality: `poor`,
            consequence: `The scrutiny is the point, not the thing to avoid. A quiet gap in a day's reads is exactly what a later audit surfaces, with worse framing.` },
        ],
      },
      branches: { a: `n_design`, b: `n_design`, c: `n_design` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Judgement exercised, and the anchor removed`,
      tone: `good`,
      score: 100,
      reaction: `Flagging a scan the AI called normal, on the 75th read of the day, is exactly the kind of small friction that time pressure is designed to erode. You held it.`,
      description: [
        `The lesion was caught early and the patient did well. And the design concern you raised got acted on: the interface was rebuilt so radiologists complete their own read before the AI result appears.`,
        `Early-stage catch rates improved over the following quarter. The next radiologist starts from their own eyes, not the machine's conclusion.`,
      ],
      judgement: `Automation bias is a design problem at least as much as a discipline problem. When the AI result displays first, it anchors the human read — and the fix is to reverse the sequence, not to ask tired people to resist an anchor 80 times a day. You did both halves: caught the case, and closed the mechanism that nearly buried it.`,
    },

    outcome_good: {
      heading: `Caught it; reached for the net, not the cause`,
      tone: `good`,
      score: 72,
      reaction: `A mandatory second opinion on every AI-normal read would genuinely catch cases. It's also the expensive way to solve a problem whose actual cause is a screen layout.`,
      description: [
        `The lesion was caught and the patient outcome was good. The safeguard you recommended — a second read on every AI-normal finding — went in, and it did catch two further cases over six months.`,
        `It's more robust than what existed before, and more costly than it needed to be, because it nets everything downstream of an anchor that's still there.`,
      ],
      judgement: `The difference between this and the cleanest ending is where the fix sits relative to the cause. Reversing the display order removes the anchoring; a mandatory second opinion catches what the anchor lets through. Both work, and one addresses the mechanism while the other pays, per scan, forever, to compensate for leaving it in place.`,
    },

    outcome_warn: {
      heading: `Handled, but the fix stopped at the person`,
      tone: `warn`,
      score: 35,
      reaction: `"I'll be more careful" and "more training" both feel responsible, and both quietly locate the problem in the human rather than the screen that primed them.`,
      description: [
        `Whether the case was caught or missed, the response landed on vigilance — a checkbox, a reminder, a resolution to concentrate harder. The AI-first display stayed exactly as it was.`,
        `Which means the next radiologist meets the same screen, on their own 75th scan, with the same twelve seconds. The mechanism is untouched.`,
      ],
      judgement: `Automation bias is not a carefulness deficit, so carefulness is not the control. The people here were skilled and trying, on scan 75 of 80. What primed the error was the workflow showing the AI's answer first, and an attestation checkbox on top of that is documentation that the risk was known, not a fix for it. The root cause is architectural.`,
    },

    outcome_bad: {
      heading: `Deferred, then described a read that didn't happen`,
      tone: `bad`,
      score: 5,
      reaction: `Reaching for "my review confirmed it" after a missed diagnosis is a very human flinch. It's also the move that makes the investigation about you instead of the design.`,
      description: [
        `The cancer was diagnosed late. The account given to the review board described a review that the records contradict — a twelve-second sign-off on scan 75 of 80.`,
        `The gap between the account and the record became the focus, instead of the AI-first display that anchored the original decision. The design that caused it stayed in place while the review ran.`,
      ],
      judgement: `Automation bias under time pressure is a known, foreseeable failure mode, and a review board's job is to find the systemic cause, not to hang one radiologist. Transparency is both the ethical path and the one that leads to a fix. An inaccurate account converts a design failure the board could have corrected into a personal-conduct problem it can't.`,
    },
  },

  debrief: {
    frame: [
      `Nothing in this scenario involved the AI malfunctioning. It did exactly what it was built to do: read a scan and return a result with a confidence score. It was even right most of the time — around 94% — which is precisely what makes the 6% dangerous. A tool that was usually wrong would be easy to distrust. A tool that's usually right trains you, scan by scan, to stop looking.`,
      `And the specific mechanism was the display order. The AI's answer arrived before your own read was finished, so every scan started from its conclusion and asked you to argue your way back out under a clock. That's an anchor, and anchors don't respond to willpower or training — they respond to being removed. The durable version of "human oversight" here isn't a more vigilant human; it's a workflow where the human reads first and the AI second, so the oversight is real rather than a rubber stamp on an answer you were shown before you looked.`,
    ],
  },

  recall: {
    id: `f1-recall`,
    prompt: `A different team defends their AI-first workflow: "our staff are trained professionals — they're told to use their own judgement and not just defer to the AI." Is that a sufficient safeguard?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes — trained professionals told to use their judgement will catch the AI's errors`,
        note: `This is exactly the position this scenario refutes. The radiologist here was a trained professional using their judgement, and the AI-first display still anchored a twelve-second sign-off on scan 75 of 80. Instructing people to resist an anchor is not the same as removing it.` },
      { id: `b`, quality: `good`, label: `No — telling people to resist an anchor doesn't remove it; the display order is the fix`,
        note: `Right. Automation bias is a predictable effect of showing a confident answer first, under time pressure — not a training gap. The safeguard that works is architectural: human read first, AI second, so the oversight is genuine.` },
      { id: `c`, quality: `partial`, label: `Partly — training helps, but a second-opinion requirement would make it safer`,
        note: `Training helps a little and a second opinion catches cases, and both sit downstream of the anchor. The most effective fix removes the anchor by reversing the display order; everything else is compensating for leaving it in.` },
    ],
  },

  act: [
    { id: `a1`, label: `If you use an AI aid, notice whether its answer shows before or after your own assessment` },
    { id: `a2`, label: `Next time your read diverges from an AI's, treat the divergence as a signal, not an error to explain away` },
    { id: `a3`, label: `Ask whether "human oversight" in your workflow is genuine or a rubber stamp on an answer shown first` },
  ],

  controls_summary: [
    { id: `c1`, label: `Human-first display: complete the assessment before the AI result shows`, effort: `Medium`, owner: `Clinical systems`, go_live: true,
      context: `Removes the anchor rather than asking people to resist it. It's the fix every good ending here names.` },
    { id: `c2`, label: `Divergence protocol: a human/AI disagreement triggers a second read`, effort: `Medium`, owner: `Department lead`, go_live: true,
      context: `When your read and the AI's differ, that's the signal. Make it route somewhere rather than resting on one tired judgement.` },
    { id: `c3`, label: `Human-factors review in AI procurement`, effort: `Low`, owner: `Procurement`, go_live: false,
      context: `How an AI output is presented to a time-pressured reviewer decides whether oversight is real. Check it before buying, not after an incident.` },
  ],

  tell: `A confident AI answer shown before you've formed your own is an anchor, not a second opinion — the fix is to look first.`,
};
