// d2-privacy.js — The Accidental Disclosure
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the person who pasted the contract into a public tool — a staff
// decision, not the partner's or the security team's.
//
// The scenario turns on honesty under pressure, not on detecting the tool.
// The exposure already happened; every decision is about what you do once
// asked. Discrimination note: the tool was genuinely useful and the summary it
// produced was good — the harm is in what was pasted to get it, not in the
// output.

export const scenario = {
  id: `d2-privacy`,
  door: `work`,
  risk_ref: `D2`,
  title: `The Accidental Disclosure`,
  shelfLine: `You pasted a client contract into a public AI tool. Now the client is asking questions.`,
  hook: `A client's confidential wording leaked. You'd run that contract through a public AI tool last week.`,
  scene: `desk-intranet`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-d-data/d2-privacy`,
  regulatory_tags: [`eu-ai-act-article-10`, `eu-ai-act-article-26`, `jurisdiction-au`, `jurisdiction-eu`],
  mit_subdomain: `mit-2.1`,

  coldOpen: [
    `Last week you were behind on a contract summary, so you pasted the whole thing into a free AI tool to get a first draft. It was fast, and the summary was good.`,
    `This morning the client has flagged that some of their confidential wording has appeared somewhere they didn't expect.`,
    `The partner has called you in. She knows the team has been using AI tools, and she's about to ask you a direct question.`,
  ],

  standing: `Junior in a small legal team, eighteen months in`,
  authority: `You can give a full account and recommend a fix. You can't decide the firm's disclosure to the client or change firm policy alone.`,
  ending: `You find out whether the firm can respond to the client with a straight story, and whether that story includes you telling the truth the first time.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The partner isn't angry yet. She's gathering facts, and the client is waiting for a callback.`,
        `She asks whether you used an AI tool with this client's contract.`,
      ],
      artefact: {
        type: `system_output`,
        source: `IT — endpoint activity, your device`,
        lines: [
          `chat.<public-ai-tool>.com — outbound session`,
          `3 sessions · Tuesday 14:02, 14:19, 15:41`,
          `~11,400 words submitted across sessions`,
        ],
        note: `You don't know it yet, but this log exists and IT is already pulling it.`,
      },
      decision: {
        prompt: `What do you tell the partner?`,
        choices: [
          { id: `a`, label: `Yes — I used a public AI tool on the contract summary last week`, quality: `good`,
            consequence: `Honest and immediate. It is the only answer that lets the firm respond correctly, and the logs would confirm it regardless.` },
          { id: `b`, label: `I may have — I'd need to check which tool I used`, quality: `partial`,
            consequence: `Fine if you genuinely can't remember. If you do remember, the hedge only delays the moment the firm can start helping the client.` },
          { id: `c`, label: `No — I only used the firm's approved drafting tools`, quality: `poor`,
            consequence: `The logs already show the consumer-AI connection from your device. This answer doesn't protect you; it adds a second problem on top of the first.` },
        ],
      },
      branches: { a: `n2_honest`, b: `n2_uncertain`, c: `n_unravel` },
    },

    n_contain: {
      prose: [
        `You've told her the truth. Her first question is practical, and fast: can any of it be pulled back?`,
        `You know the answer is mostly no — once text goes into a public tool, it's in that tool's systems and out of your hands. But there are still things that can be done in the next hour.`,
      ],
      decision: {
        prompt: `What do you do first to contain it?`,
        choices: [
          { id: `a`, label: `Stop using the tool for anything client-related now, and note exactly what was submitted so the firm can scope it`, quality: `good`,
            consequence: `You can't retract the data, but you can stop adding to it and give the firm a precise picture. That precision is what the whole response is built on.` },
          { id: `b`, label: `Delete your chat history in the tool so it's not sitting there`, quality: `partial`,
            consequence: `Understandable instinct, and it does little — the data left your control the moment it was pasted, and deleting your view of it can look like tidying up evidence. Scoping matters more than hiding.` },
          { id: `c`, label: `Wait to see if the client noticed anything before doing anything`, quality: `poor`,
            consequence: `The client already noticed — that's why you're in this room. Waiting only shortens the time the firm has to respond well.` },
        ],
      },
      branches: { a: `n_scope`, b: `n_scope`, c: `n_scope` },
    },

    n_unravel: {
      prose: [
        `An hour later, IT mentions in passing that the security team is pulling tool-usage logs for the client call.`,
        `The logs will show the consumer-AI connection from your device, and exactly when. The denial is about to meet the record.`,
      ],
      decision: {
        prompt: `What do you do before the logs come back?`,
        choices: [
          { id: `a`, label: `Correct it with the partner now — what you pasted, and when`, quality: `good`,
            consequence: `Getting ahead of the log is the only way to stay credible and start helping contain the exposure. It is a hard conversation and it is the recoverable one.` },
          { id: `b`, label: `Tell only IT, and ask them to keep it quiet for now`, quality: `partial`,
            consequence: `Honesty aimed at the wrong person. The partner still has to face the client without the facts she needs.` },
          { id: `c`, label: `Say nothing and hope the logs are inconclusive`, quality: `poor`,
            consequence: `They aren't inconclusive. Silence is the step that turns a mistake into a cover-up.` },
        ],
      },
      branches: { a: `n_contain`, b: `n_contain`, c: `n_dig` },
    },

    n_dig: {
      prose: [
        `The security log is on the table now: the consumer-AI endpoint, your device, three sessions. The partner asks you directly whether you used the tool on this contract.`,
        `There is no version of this where the log says otherwise.`,
      ],
      decision: {
        prompt: `What do you say?`,
        choices: [
          { id: `a`, label: `Admit it fully — what you submitted, when, and that it should have been said at the start`, quality: `partial`,
            consequence: `A late complete correction is recoverable. The initial denial is now part of the record, and that's the cost you're carrying forward.` },
          { id: `b`, label: `Hold the line that you only used approved tools`, quality: `poor`,
            consequence: `A denial against your own logged activity converts a data incident into a cover-up the firm cannot defend to the client or the regulator.` },
        ],
      },
      branches: { a: `n_contain`, b: `outcome_bad` },
    },

    n2_honest: {
      prose: [
        `The partner takes it without drama. Then the question that actually determines the firm's exposure: what did you put into the tool?`,
      ],
      decision: {
        prompt: `You remember pasting the full contract, pricing schedules and all. What do you say?`,
        choices: [
          { id: `a`, label: `The full contract text, including the pricing schedules`, quality: `good`,
            consequence: `Complete and accurate. The partner can only scope the exposure as well as you describe it, and she now has the real picture.` },
          { id: `b`, label: `Parts of it — I don't remember exactly what I included`, quality: `partial`,
            consequence: `If you genuinely don't know, say so. But a vague account of what was exposed makes the firm's disclosure harder and may need correcting later.` },
        ],
      },
      branches: { a: `n_contain`, b: `n_contain` },
    },

    n2_uncertain: {
      prose: [
        `The partner asks you to check. You look at your browser history, and the AI tool connection is there — three sessions, on this contract.`,
        `Twenty minutes have passed. The client is still waiting.`,
      ],
      decision: {
        prompt: `You've confirmed it. What do you tell the partner now?`,
        choices: [
          { id: `a`, label: `The full picture — you used it on this contract and pasted the pricing schedules`, quality: `good`,
            consequence: `Confirming the specifics is what lets the firm scope the exposure and respond to the client honestly.` },
          { id: `b`, label: `That you used it, but stay vague on exactly what went in`, quality: `partial`,
            consequence: `Half an answer leaves the firm guessing about the exposure it has to disclose.` },
        ],
      },
      branches: { a: `n_contain`, b: `n_contain` },
    },

    n_scope: {
      prose: [
        `The partner has your account. Now the question that decides how big this is: was this the only time?`,
        `You think about it honestly. You've used the tool for a few things this month — a couple of other clients' documents, some internal notes.`,
      ],
      decision: {
        prompt: `What do you tell her about the wider pattern?`,
        choices: [
          { id: `a`, label: `Everything: which other client documents went through the tool, so the firm can check them too`, quality: `good`,
            consequence: `Painful and correct. The firm would far rather find the other two exposures itself than have a second client ring.` },
          { id: `b`, label: `Just this contract for now — deal with the others if they come up`, quality: `partial`,
            consequence: `Understandable instinct to contain the damage. It also leaves two more exposures live, waiting to become their own incidents.` },
          { id: `c`, label: `That this was a one-off, to keep the problem small`, quality: `poor`,
            consequence: `It wasn't a one-off, and the same logs that caught this one will catch the others. Shrinking the problem now just delays a bigger version of this conversation.` },
        ],
      },
      branches: { a: `n_notify`, b: `n_notify`, c: `n_notify` },
    },

    n_notify: {
      prose: [
        `The partner has to call the client back. She turns to you: the client is going to ask how their confidential wording ended up exposed, and she wants your view on what to tell them.`,
        `The honest answer isn't comfortable — it involves saying a staff member pasted their contract into a public tool.`,
      ],
      decision: {
        prompt: `What do you think the firm should tell the client?`,
        choices: [
          { id: `a`, label: `The straight version: what happened, what was exposed, and what you're doing about it`, quality: `good`,
            consequence: `The client will be unhappy either way. A clear factual account is the only one that survives them asking a second question, and it's what a breach notification has to rest on anyway.` },
          { id: `b`, label: `That there was "a data handling issue" the firm is resolving`, quality: `partial`,
            consequence: `Softer, and it holds only until the client asks what kind of issue. Vagueness in a notification tends to read as evasion once the details come out.` },
          { id: `c`, label: `Play down the exposure until the firm is sure how bad it is`, quality: `poor`,
            consequence: `The firm already knows what was pasted. Minimising a known exposure to the affected client is how a recoverable incident becomes a complaint.` },
        ],
      },
      branches: { a: `n3_strong`, b: `n3_soft`, c: `n3_soft` },
    },

    n3_strong: {
      prose: [
        `The client call is scheduled with a straight account to give. The immediate fire is nearly out, and the partner asks the question that outlasts this incident: what should change so it can't happen again?`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `An approved enterprise tool, and a hard rule: client-confidential text never goes into consumer AI`, quality: `good`,
            consequence: `Names the control and the boundary. It's actionable, and it gives people a sanctioned way to get the speed they wanted in the first place.` },
          { id: `b`, label: `Remind the team to be more careful with AI tools`, quality: `partial`,
            consequence: `Everyone was already trying to be careful. Awareness without an approved alternative changes nothing.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good` },
    },

    n3_soft: {
      prose: [
        `The client call is scheduled, but the account it rests on is softer than the facts. The partner asks what should change so this can't recur.`,
      ],
      decision: {
        prompt: `What do you recommend?`,
        choices: [
          { id: `a`, label: `An approved enterprise tool, and a hard rule: client-confidential text never goes into consumer AI`, quality: `good`,
            consequence: `The right control. It lands better when the account it sits alongside is equally straight — the fix is strong, the framing to the client less so.` },
          { id: `b`, label: `Remind the team to be more careful with AI tools`, quality: `partial`,
            consequence: `A soft account and a soft fix. Nothing here would stop the next paste, or explain this one clearly to the client.` },
        ],
      },
      branches: { a: `outcome_good`, b: `outcome_warn` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Full account, and a fix that holds`,
      tone: `good`,
      score: 100,
      reaction: `Telling the partner about the other two documents, unprompted, is the hardest thing in this whole scenario. It's also what makes you someone the firm can trust with the next problem.`,
      description: [
        `Your complete account gave the partner everything she needed to scope the exposure and advise the client. The breach assessment could actually proceed, and the client call was honest because it could be.`,
        `And the fix you named — an approved tool plus a hard boundary — gives the team the speed they wanted without the exposure. The rule went out that afternoon.`,
      ],
      judgement: `A data exposure through a consumer tool is common and recoverable. What determines the outcome is almost never the paste itself — it's whether the first account is complete. The firm can only respond as accurately as you let it, and the version of this that ends well is the one where you make the problem fully visible before anyone else has to find it.`,
    },

    outcome_good: {
      heading: `Handled well, one edge left soft`,
      tone: `good`,
      score: 78,
      reaction: `Getting most of this right under pressure is genuinely good work. The soft edge — whether in what the client was told or what you proposed — is the difference between good and clean.`,
      description: [
        `The firm could respond, the exposure was scoped, and either the fix or the client account was strong. One of the two was softer than it needed to be, and the partner noticed.`,
        `It holds. It's the version of a good outcome with a small amount of friction still in it — recoverable, but not quite the standard the best response set.`,
      ],
      judgement: `The gap between this and the cleanest ending is small and worth naming: a strong control paired with a vague client account, or a straight account paired with a weak fix, each leaves one edge for the client's trust to catch on. Doing both halves fully is what turns a handled incident into a demonstration of competence.`,
    },

    outcome_warn: {
      heading: `Honest account, vague fix`,
      tone: `warn`,
      score: 55,
      reaction: `"Be more careful" feels responsible because it admits fault. It just doesn't stop the next person doing exactly what you did.`,
      description: [
        `You gave a straight account and the firm could respond to the client. That's the part that mattered most, and you got it right.`,
        `But when asked what should change, "remind the team to be careful" is what was in place before this happened. The tool is still there, still faster than the approved options, still one deadline away from the next paste.`,
      ],
      judgement: `Honesty in the moment and a real control afterwards are two different skills, and this ending has the first without the second. People paste confidential text into consumer AI because it's quicker and there's no sanctioned alternative. Until there is one, care is the only thing standing between the firm and a repeat — and care is exactly what failed the first time.`,
    },

    outcome_bad: {
      heading: `The log contradicted your account`,
      tone: `bad`,
      score: 5,
      reaction: `Holding the line against your own logged activity feels, in the moment, like the only way out. It's the move that closes the exit.`,
      description: [
        `The security logs confirmed the consumer-AI connection from your device on the day in question. Your account was contradicted by the evidence in the room.`,
        `The partner now has two problems instead of one: the data exposure, and a member of the team whose word doesn't match the record. The first was recoverable. The second is about you.`,
      ],
      judgement: `Endpoint connections are logged, and a denial that the evidence contradicts turns a data incident into a conduct issue. The underlying exposure — a contract pasted into a public tool — is the kind of thing firms handle regularly. The cover-up is the thing they can't, because it's a choice rather than a mistake, and it's the choice that becomes the story.`,
    },
  },

  debrief: {
    frame: [
      `The tool wasn't the villain here, and that's the part worth sitting with. The summary it produced was genuinely good, and using AI to draft faster is a reasonable thing to want. The exposure was in one specific act — pasting client-confidential text, including pricing, into a system the firm doesn't control and can't retrieve from.`,
      `Once that happened, the scenario stopped being about AI at all. Every decision after the paste was an ordinary honesty-under-pressure decision, and the logs meant there was only ever one account that would survive contact with the evidence. The lesson people take from this is usually "be careful with AI tools" — but the sharper one is that consumer AI is an uncontrolled disclosure channel, and confidential text doesn't go into channels you can't control, however good the output is.`,
    ],
  },

  recall: {
    id: `d2-recall`,
    prompt: `A colleague says they've been using the same free tool but only for "internal stuff — team notes, nothing client-facing." Is that fine?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes — internal notes aren't confidential client data, so there's no exposure`,
        note: `Internal notes routinely contain client names, deal terms, staff information and strategy. "Internal" is not the same as "safe to send to a system you don't control" — the channel is uncontrolled regardless of what you put through it.` },
      { id: `b`, quality: `good`, label: `Not really — the issue is the uncontrolled channel, not whether the text is client-facing`,
        note: `Right. The problem in this scenario was never the label on the document; it was pasting text into a system the firm can't retrieve from. Internal material has its own exposure, and the fix is the same: an approved tool, or nothing.` },
      { id: `c`, quality: `partial`, label: `Probably fine, but they should check with the partner to be safe`,
        note: `Checking is better than not. But it frames this as a permission question when it's a channel question — the answer doesn't depend on who says yes, it depends on whether the tool is one the firm controls.` },
    ],
  },

  act: [
    { id: `a1`, label: `Check whether your team has an approved AI tool for confidential work, and use it if so` },
    { id: `a2`, label: `Before your next AI paste, ask: could the firm retrieve this if it had to?` },
    { id: `a3`, label: `Raise the "no client-confidential text in consumer AI" boundary with whoever owns policy` },
  ],

  controls_summary: [
    { id: `c1`, label: `An approved enterprise AI tool with a data agreement`, effort: `Medium`, owner: `IT / partners`, go_live: true,
      context: `People reach for consumer AI because it's fast and sanctioned options don't exist. Give them one and the pressure that caused this drops.` },
    { id: `c2`, label: `A hard boundary: client-confidential text never enters consumer AI`, effort: `Low`, owner: `Team lead`, go_live: true,
      context: `A clear line is enforceable in a way "be careful" is not. It's the control every good ending here names.` },
    { id: `c3`, label: `A no-blame first-account norm for exposure incidents`, effort: `Low`, owner: `Partners`, go_live: true,
      context: `The difference between the best and worst endings was whether it felt safe to tell the whole truth immediately. Make that the cheaper option.` },
  ],

  tell: `Consumer AI is a channel you can't take anything back from — confidential text doesn't go in, however good the draft that comes out.`,
};
