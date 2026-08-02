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
  hook: `A client's contract wording turned up on a public page. You ran that contract through a free AI tool.`,
  scene: `desk-intranet`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-d-data/d2-privacy`,
  regulatory_tags: [`eu-ai-act-article-10`, `eu-ai-act-article-26`, `jurisdiction-au`, `jurisdiction-eu`],
  mit_subdomain: `mit-2.1`,

  coldOpen: [
    `Last week you were behind on a contract summary, so you pasted the whole thing into a free AI tool to get a first draft. It was fast, and the summary was good.`,
    `This morning the client has flagged that a passage of their contract wording turned up somewhere it should not have been. A shared conversation link from that tool, indexed and public.`,
    `The partner has called you in. She knows the team has been using AI tools, and she's about to ask you a direct question.`,
  ],

  standing: `Junior in a small legal team, eighteen months in`,
  authority: `You can give a full account and recommend a fix. You can't decide the firm's disclosure to the client or change firm policy alone.`,
  ending: `You find out whether the firm can respond to the client with a straight story, and whether that story includes you telling the truth the first time.`,

  begin: `Go and see the partner`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The partner isn't angry yet. She's gathering facts, and the client is waiting for a callback.`,
        `She asks whether you used an AI tool with this client's contract.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `What IT is pulling while you answer`,
        system: `Endpoint activity · your device`,
        status: `Logged`,
        headline: `Outbound sessions to an unapproved AI service`,
        fields: [
          { label: `Destination`, value: `chat.brightline.example` },
          { label: `Sessions`, value: `3 — Tuesday 14:02, 14:19, 15:41` },
          { label: `Text submitted`, value: `~11,400 words` },
          { label: `Managed session`, value: `No — personal browser profile` },
        ],
        rationale: `You do not know this log exists. It was written at the time and nothing you do now changes it.`,
      },
      decision: {
        prompt: `What do you tell the partner?`,
        choices: [
          { id: `a`, label: `Yes — I used a public AI tool on the contract summary last week`, quality: `good`,
            consequence: `She writes down the date and the name of the tool. She does not react to it at all, which is somehow worse than if she had.` },
          { id: `b`, label: `I may have — I'd need to check which tool I used`, quality: `partial`,
            consequence: `"Then check, please, now." The client is still waiting for a callback and the clock on that has not stopped.` },
          { id: `c`, label: `No — I only used the firm's approved drafting tools`, quality: `poor`,
            consequence: `She thanks you and moves on to the next question. Two floors away, IT is already exporting endpoint activity for the client call.` },
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
            consequence: `It takes you twenty minutes to reconstruct what went in. Three sessions, the full contract, the pricing schedules, one clause you pasted twice.` },
          { id: `b`, label: `Delete your chat history in the tool so it's not sitting there`, quality: `partial`,
            consequence: `The history clears in one click. Nothing else about the situation changes, and there is now a deletion sitting in the middle of a live incident.` },
          { id: `c`, label: `Wait to see if the client noticed anything before doing anything`, quality: `poor`,
            consequence: `The client noticed four hours ago. That is why you are in this room.` },
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
            consequence: `You knock on her door before you have worked out how to start the sentence. It goes worse than the first conversation would have and better than the one that was coming.` },
          { id: `b`, label: `Tell only IT, and ask them to keep it quiet for now`, quality: `partial`,
            consequence: `The IT lead is sympathetic and says nothing to anyone. The partner rings the client at four with an account that is missing the only fact that matters.` },
          { id: `c`, label: `Say nothing and hope the logs are inconclusive`, quality: `poor`,
            consequence: `They are not inconclusive. The export takes about ninety minutes.` },
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
            consequence: `You tell her everything, an hour later than the log did. She listens to all of it and then asks why you said no the first time.` },
          { id: `b`, label: `Hold the line that you only used approved tools`, quality: `poor`,
            consequence: `The log is on the table between you, with the timestamps on it. Nobody says anything for a moment.` },
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
            consequence: `She writes "pricing schedules" and underlines it twice. That is the part the client will care about most and you both know it.` },
          { id: `b`, label: `Parts of it — I don't remember exactly what I included`, quality: `partial`,
            consequence: `She writes "parts — unclear" and looks at it. A notification cannot be drafted from that, so somebody will be asking you again this afternoon.` },
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
            consequence: `Twenty minutes late and complete. She has what she needs to make the call.` },
          { id: `b`, label: `That you used it, but stay vague on exactly what went in`, quality: `partial`,
            consequence: `She has a tool and a date and no idea what was in it. The client's first question will be what was in it.` },
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
            consequence: `Two more names come out of your mouth before you have decided to say them. Her expression does not change and the list gets longer.` },
          { id: `b`, label: `Just this contract for now — deal with the others if they come up`, quality: `partial`,
            consequence: `The conversation ends sooner. Two other clients' documents stay where they are, in the same place as this one.` },
          { id: `c`, label: `That this was a one-off, to keep the problem small`, quality: `poor`,
            consequence: `The same export that produced today's three sessions covers the whole month. It has already been run.` },
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
            consequence: `She drafts it in front of you, in plain words, and reads it back. It is a worse email to receive and an easier one to answer questions about.` },
          { id: `b`, label: `That there was "a data handling issue" the firm is resolving`, quality: `partial`,
            consequence: `It reads better. The client's second email asks what kind of issue, and now the plain version has to arrive as a correction.` },
          { id: `c`, label: `Play down the exposure until the firm is sure how bad it is`, quality: `poor`,
            consequence: `You already know what was pasted. So does the partner, and so, in an hour, does the file.` },
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
            consequence: `She asks what an enterprise licence costs and whether anyone has priced one. Nobody has.` },
          { id: `b`, label: `Remind the team to be more careful with AI tools`, quality: `partial`,
            consequence: `She nods and writes it down. The tool is still free, still faster, and still open in three people's browsers.` },
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
            consequence: `She takes it and says she will price a licence. The email going to the client is still the softer version.` },
          { id: `b`, label: `Remind the team to be more careful with AI tools`, quality: `partial`,
            consequence: `The meeting ends early. Nothing said in it would stop a Tuesday afternoon happening again.` },
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
