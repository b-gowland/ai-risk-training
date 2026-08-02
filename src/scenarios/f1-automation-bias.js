// f1-automation-bias.js — Trust the Machine
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the radiologist reading scan 75 of the day — a staff decision
// about whether to exercise judgement against a confident AI, under real time
// pressure.
//
// The aid is accurate on most studies, and deferring to it is normally the
// efficient, correct choice. The scenario is not "never trust AI": it is about
// the specific moment your own reading diverges from a confident output, and
// how a workflow should be built so that divergence gets acted on rather than
// swallowed.
//
// OUTSTANDING (FREE_PRODUCT B1): this scenario is designated a discrimination
// scenario and the discrimination authoring has not been done. Every played
// path currently vindicates the alarming read. Closing that needs a benign
// resolution authored into the tree, which is new authoring, not a correction.

export const scenario = {
  id: `f1-automation-bias`,
  door: `work`,
  risk_ref: `F1`,
  title: `Trust the Machine`,
  shelfLine: `The AI flags the scan as normal. Your own eye caught something. You have six more to read.`,
  hook: `The AI says the scan is normal, 91% confidence. Your eye caught something. You have six more to read.`,
  scene: `xray-ai`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-f-deployment/f1-automation-bias`,
  regulatory_tags: [`eu-ai-act-article-14`, `eu-ai-act-annex-iii`, `jurisdiction-eu`, `jurisdiction-global`],
  mit_subdomain: `mit-5.1`,

  coldOpen: [
    `Scan 75 of 80 for the day. The AI diagnostic aid returns its result before you've finished your own read: Normal, 91% confidence.`,
    `But your eye caught something in the lower right lobe. Subtle. Probably nothing. The AI has been right all week, and it's over-ruled your hesitation three times already.`,
    `91% is not 100%. And the AI has seen 74 scans today. You've seen all 75.`,
  ],

  standing: `Radiologist, mid-career, in a department that runs AI-assisted reads`,
  authority: `You can flag a scan, request a second opinion, and raise a process concern. You can't redesign the tool or change department workflow on your own.`,
  ending: `You find out whether your own judgement gets exercised in the one moment it matters — and whether the system that nearly buried it gets fixed.`,

  begin: `Open study 75`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The AI's confidence score is sitting there at 91%, and it's doing something to your certainty. You've been over-ruled by it three times this week, each time correctly.`,
        `Before you decide what to do with this scan, it's worth being clear about what that 91% actually tells you.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `The AI read, on screen before yours`,
        system: `RadAssist AI · study 75 of 80`,
        status: `Normal`,
        headline: `No regions flagged`,
        fields: [
          { label: `Result`, value: `Normal` },
          { label: `Confidence`, value: `91%` },
          { label: `Regions flagged`, value: `None` },
          { label: `Validation`, value: `94% overall accuracy; 88% sensitivity on abnormal studies` },
        ],
        rationale: `Confidence is the model's own output, not an audited probability that this result is right. Models tend to report high confidence on studies that resemble their training data.`,
        trail: [
          `Result returned automatically when the study loaded.`,
          `Displayed before the reporting radiologist enters their own read.`,
        ],
      },
      decision: {
        prompt: `What does that 91% actually tell you?`,
        choices: [
          { id: `a`, label: `Less than it feels like. It is the model's own figure, not a checked probability that this study is normal`, quality: `good`,
            consequence: `You look at the validation line underneath it. Ninety-four per cent overall, eighty-eight on the abnormal studies, which is the number that would matter if this one is abnormal.` },
          { id: `b`, label: `91% is strong evidence it is right. Over-ruling a high-confidence result is the riskier move`, quality: `poor`,
            consequence: `You have over-ruled your own hesitation three times this week and been right to. The fourth time is indistinguishable from the first three while you are in it.` },
          { id: `c`, label: `The model has seen far more studies than you have`, quality: `partial`,
            consequence: `It has, and all of them before today. Whatever it under-saw in training, it under-sees now, and there is nothing in the score that tells you which this is.` },
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
            consequence: `You write two lines describing what you can see and send it for a second read. It takes ninety seconds you did not have.` },
          { id: `b`, label: `Spend another two minutes on the image yourself before deciding`, quality: `partial`,
            consequence: `You zoom in twice and change nothing about what you can see. Nothing about the finding is recorded anywhere yet.` },
          { id: `c`, label: `Accept the AI result — 91% confidence, and six more to get through`, quality: `poor`,
            consequence: `Twelve seconds, sign-off, next study. The one after this is a straightforward fracture and you are back on rhythm.` },
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
            consequence: `You write it up properly, which takes longer than the flag did. The department lead reads it that afternoon and asks you to come and explain the display order to him.` },
          { id: `b`, label: `Note it in your own records as a reminder to be more careful`, quality: `partial`,
            consequence: `You note it in your own file and mean it. Nobody else's screen changes.` },
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
            consequence: `Your colleague looks at it cold and finds the same thing inside a minute, which is both reassuring and not.` },
          { id: `b`, label: `Over-ride the AI yourself and document your finding — no second opinion needed`, quality: `partial`,
            consequence: `You write your own report against the aid's result and sign it. It is your name and your read, alone, on study 75 of 80.` },
          { id: `c`, label: `It's 91% confidence and your read could still be wrong — accept normal`, quality: `poor`,
            consequence: `You spent four minutes looking and then signed what the aid said. There are five studies left and it is twenty past six.` },
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
            consequence: `You tell them about the hesitation, the score, and the clock. It is a hard sentence to get out and the room is quieter afterwards than you expected.` },
          { id: `b`, label: `That the AI result was normal and your review confirmed it`, quality: `poor`,
            consequence: `The audit log has the sign-off at twelve seconds. It is projected on the wall behind you while you are speaking.` },
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
            consequence: `The vendor says it is configurable. Clinical systems say it is a four-week change and asks who is signing off the throughput impact.` },
          { id: `b`, label: `Add a mandatory second opinion on every AI-normal finding`, quality: `partial`,
            consequence: `It goes in within a fortnight, which is fast for anything here. Every first read still opens on the aid's answer.` },
          { id: `c`, label: `Roll out extra training on automation bias and an attestation checkbox`, quality: `poor`,
            consequence: `Ninety minutes of e-learning and a tickbox at the end of each session. Everyone who takes it already knew everything in it.` },
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
            consequence: `He writes down your two sentences almost word for word and takes them upstairs. It stops being your decision, which is the point.` },
          { id: `b`, label: `Downplay the cost to get it approved — say the throughput hit is negligible`, quality: `partial`,
            consequence: `It is approved in a week. Six weeks later, in a bad fortnight, the list backs up and the first thing anyone reaches for is the change you made.` },
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
            consequence: `Saying it with your own name on the report is not comfortable. One of the board members asks the clinical systems lead to bring the screen layout to the next meeting.` },
          { id: `b`, label: `That I should have been more careful — I'll be more vigilant going forward`, quality: `partial`,
            consequence: `The board accepts it and the finding is recorded against you. The screen is the same on Monday.` },
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
            consequence: `Nineteen of the day's sign-offs come back under twenty seconds. Two of those get a second read and one of the two gets a follow-up.` },
          { id: `b`, label: `Assume the rest were fine — this was the one that happened to catch your eye`, quality: `partial`,
            consequence: `You go home at seven. The other seventy-four sit in the system exactly as you left them.` },
          { id: `c`, label: `Say nothing about the others — reopening them invites scrutiny of your whole day`, quality: `poor`,
            consequence: `Nobody asks. The day's reads stay as they are, and so does the timestamp on every one of them.` },
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
      judgement: `Automation bias is a design problem at least as much as a discipline problem. A result shown first anchors the read that follows it, and the fix is to reverse the sequence. Asking tired people to resist an anchor eighty times a day was never going to hold. You did both halves here: caught the case, and closed the mechanism that nearly buried it.`,
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
      judgement: `Nobody here was being careless, so carefulness was never the control. These were skilled people trying hard, on study 75 of 80. What primed the error was a workflow that showed the aid's answer first. An attestation checkbox on top of that documents the risk rather than reducing it, and the display order goes on doing what it did.`,
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
      judgement: `Automation bias under time pressure is a known and foreseeable failure mode, and a review board exists to find the systemic cause rather than to hang one radiologist. Transparency is the ethical path here and also the practical one. An inaccurate account converts a design failure the board could have corrected into a conduct problem it cannot.`,
    },
  },

  debrief: {
    frame: [
      `Nothing here involved the AI malfunctioning. It did what it was built to do: read a study and return a result with a confidence figure attached. It is accurate on most studies, and that is precisely the problem. A tool that was usually wrong would be easy to distrust. A tool that is usually right trains you, study by study, to stop looking. And the confidence figure is the model's own output, not an audited probability, so a high number on a study the model has misread reads exactly like a high number on one it has read correctly.`,
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
