// a1-hallucination.js — Confident and Wrong
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the person whose name is on the briefing, not the person who
// rolled the tool out. Decision tree carried from the business_user tree;
// framing rebuilt.
//
// Discrimination note (CONTENT_STYLE_GUIDE): the tool has been accurate for
// weeks, and that reliability is the trap. The scenario must not teach "AI is
// always wrong" — it teaches that fluency is not verification.

export const scenario = {
  id: `a1-hallucination`,
  door: `work`,
  risk_ref: `A1`,
  title: `Confident and Wrong`,
  shelfLine: `A client can't find one of the regulations your AI-drafted briefing cited.`,
  hook: `A client is on the phone. One of the regulations your briefing cited doesn't exist.`,
  scene: `document-error`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-a-technical/a1-hallucination`,
  regulatory_tags: [`eu-ai-act-article-13`, `nist-ai-rmf-measure-2`, `jurisdiction-global`],
  mit_subdomain: `mit-3.1`,

  coldOpen: [
    `Thursday morning. A client rings about the regulatory briefing you sent yesterday, the one you drafted with the new AI writing assistant.`,
    `They can't find one of the documents you cited. You check. The clause numbers, the date, the publication reference are all there, and none of it is real.`,
    `They've already shared the briefing with their board.`,
  ],

  standing: `Sam, client services, three years in`,
  authority: `You can call the client, correct the document, and commit your own time. You can't rewrite the firm's AI policy or speak for the partners.`,
  ending: `You find out how far the made-up citation spread, and whether the client still trusts the rest of what you sent.`,

  begin: `Take the call`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The tool has been accurate for three weeks. It was fast, clean, and right every time you checked. Lately you've checked less and less.`,
        `One citation is now confirmed invented. Before you deal with the call, you have to decide what that means for everything else in the document.`,
      ],
      artefact: {
        type: `assistant_output`,
        tool: `DraftWise — Regulatory brief`,
        prompt: `Summarise the current disclosure obligations for a mid-size financial services client, with citations.`,
        response: [
          `Under the Financial Disclosure and Transparency Regulation 2021 (FDTR), §14(3)(b), in-scope firms must file quarterly beneficial-ownership statements within 30 days of period end.`,
          `This was tightened by the 2023 amendment (FDTR Amendment No. 2), which extended the requirement to indirect holdings above 10%.`,
        ],
        citations: [
          `Financial Disclosure and Transparency Regulation 2021, §14(3)(b). Published 4 March 2021.`,
        ],
      },
      decision: {
        prompt: `One citation is made up. What do you assume about the rest?`,
        choices: [
          { id: `a`, label: `Treat every citation as unchecked: this document and everything else the tool drafted this week`, quality: `good`,
            consequence: `You write down four document names on a sticky note. It is going to be a long day and you have not spoken to the client yet.` },
          { id: `b`, label: `Verify the other two in this document before you say anything`, quality: `partial`,
            consequence: `Two citations, about nine minutes. That tells you nothing about the four briefings that went out on Monday and Tuesday.` },
          { id: `c`, label: `Likely a one-off. The tool's been right for three weeks.`, quality: `poor`,
            consequence: `Three weeks of being right is why you stopped checking. That hasn't changed, and the document is still wrong.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `The client is still on the phone. Two other citations sit in the document, unchecked.`,
      ],
      decision: {
        prompt: `They're waiting. What do you do first?`,
        choices: [
          { id: `a`, label: `Say now that it's wrong, and that you're reviewing the whole document`, quality: `good`,
            consequence: `"Right. Thanks for ringing me straight back." The call lasts under two minutes, and they stay friendly.` },
          { id: `b`, label: `Check the other citations first. You want the full picture before you speak`, quality: `partial`,
            consequence: `You tell them you'll call back within the hour. That leaves them waiting an hour about a document their board has already seen.` },
          { id: `c`, label: `Say it may be real but obscure, and you'll find the source`, quality: `poor`,
            consequence: `They accept that, because it is plausible and because you sound certain. Their compliance team starts searching for it, and so do you.` },
        ],
      },
      branches: { a: `n2_called`, b: `n2_audit_first`, c: `n2_defended` },
    },

    n2_called: {
      prose: [
        `The client appreciates the immediate call. Then they ask the question you were hoping to avoid: is the rest of it reliable?`,
        `You check the other two while they wait. One is real. One is not.`,
      ],
      decision: {
        prompt: `Two of three citations are made up, and it's gone to their board. What do you offer?`,
        choices: [
          { id: `a`, label: `A fully checked replacement within 24 hours, every citation linked`, quality: `good`,
            consequence: `You have just committed your evening and someone else's. They say that sounds fine and ask you to send it to the board list directly.` },
          { id: `b`, label: `A corrected version of the two wrong citations by end of day`, quality: `partial`,
            consequence: `They agree to it. Then: "And the rest of it? You've been through the rest of it?" You have not, yet.` },
        ],
      },
      branches: { a: `n_scope`, b: `n_scope` },
    },

    n2_audit_first: {
      prose: [
        `You check the whole document before calling back. Two of three citations are made up.`,
        `While you were checking, a follow-up email arrived, copying their compliance director. The tone has changed.`,
      ],
      decision: {
        prompt: `They want an explanation. What do you send?`,
        choices: [
          { id: `a`, label: `The truth: two citations were invented, here's what happened, here's the replacement`, quality: `good`,
            consequence: `The compliance director replies in eleven minutes, copying nobody new. She wants the replacement and she wants to know what changed in your process.` },
          { id: `b`, label: `That there were "formatting issues" with the references and you'll resend`, quality: `poor`,
            consequence: `Her team has already searched three official registers. They know it isn't a formatting problem.` },
        ],
      },
      branches: { a: `n_scope`, b: `outcome_bad` },
    },

    n2_defended: {
      prose: [
        `Four hours later you still cannot find the document anywhere. The client's compliance team has searched every official source. It does not exist, and you spent the afternoon implying it might.`,
      ],
      decision: {
        prompt: `They're asking for an explanation. Now what?`,
        choices: [
          { id: `a`, label: `Come clean: it was AI-drafted, you didn't check it, here's a replacement`, quality: `partial`,
            consequence: `It lands worse at five o'clock than it would have at eleven. They spent the afternoon searching because you said it might exist.` },
          { id: `b`, label: `Go to your manager first, without replying to the client`, quality: `poor`,
            consequence: `Your manager needs to know. The client's last email is still sitting there unanswered while the two of you work out what to say.` },
        ],
      },
      branches: { a: `n_scope`, b: `outcome_bad` },
    },

    n_scope: {
      prose: [
        `The client is handled. Now the part nobody's watching: the tool has drafted four other briefings this week, all already sent, all client-facing.`,
        `Checking them properly is most of a day you don't have.`,
      ],
      decision: {
        prompt: `What do you do about the other four?`,
        choices: [
          { id: `a`, label: `Check all four against source today, and flag whatever turns up`, quality: `good`,
            consequence: `Two are clean. One has a wrong figure, small, nobody has acted on it. One has a citation you can't confirm or rule out. It bothers you all evening.` },
          { id: `b`, label: `Check the two that went to the most sensitive clients`, quality: `partial`,
            consequence: `Both clean, and it takes an hour. Nobody checks the other two.` },
          { id: `c`, label: `Assume they're fine. This was one bad document.`, quality: `poor`,
            consequence: `This was the one a client noticed. Nobody ringing about the other four doesn't mean they're right.` },
        ],
      },
      branches: { a: `n_colleague`, b: `n_colleague`, c: `n_colleague` },
    },

    n_colleague: {
      prose: [
        `A colleague drafted two of those four. They used the tool the way everyone was shown to (prompt, skim, send) and they're now watching you check their work with a look you recognise.`,
        `"Wait, are we not supposed to trust it? Nobody said that."`,
      ],
      decision: {
        prompt: `They're not wrong that nobody said it. What do you tell them?`,
        choices: [
          { id: `a`, label: `That the tool is useful, but every citation gets checked against its source, and show them how`, quality: `good`,
            consequence: `It takes four minutes to show and they are quiet afterwards, thinking about the two they sent on Monday.` },
          { id: `b`, label: `That this one was a fluke, not to worry`, quality: `poor`,
            consequence: `They relax visibly. On Friday they send a briefing with three citations in it and check none of them, because you told them it was a fluke.` },
        ],
      },
      branches: { a: `n3_process`, b: `n3_process` },
    },

    n3_process: {
      prose: [
        `The immediate problem is nearly sorted. The compliance director's question is still open: how does the firm check AI-written content?`,
        `Right now the honest answer is none. The tool went out with a note in training that it "can sometimes make things up", and no required step.`,
      ],
      decision: {
        prompt: `Your manager asks what would stop this happening again.`,
        choices: [
          { id: `a`, label: `A required check: every AI-drafted citation is checked against its source before it goes out`, quality: `good`,
            consequence: `He asks how long it adds per document. About six minutes, you think. He writes that down next to the two weeks of repair work this week has cost.` },
          { id: `b`, label: `Remind everyone to be careful with the tool`, quality: `poor`,
            consequence: `He agrees, and sends the reminder. A version of that reminder went out with the training in March.` },
          { id: `c`, label: `Ask whether the tool should touch client-facing work at all`, quality: `partial`,
            consequence: `That goes up to the partners, where it will sit for some weeks. The four briefings from this week still need checking tonight, by you.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_warn`, c: `outcome_good` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Owned fast, fixed properly, and the hole got closed`,
      tone: `good`,
      score: 100,
      reaction: `Admitting an error before you know its full size is uncomfortable. It's also the only version of this that keeps the client.`,
      description: [
        `The checked replacement arrived the next morning with every citation linked to source. The client's note was short: glad you sorted it fast.`,
        `The required-check rule went out to the team, so the next briefing can't leave the way this one did.`,
      ],
      judgement: `The client never expected the tool to be perfect. They expected someone to own the output. A fast admission, a real fix and a better process is the whole response. The process is the part most people skip.`,
    },

    outcome_good: {
      heading: `Handled well. The fix is above your desk.`,
      tone: `warn`,
      score: 75,
      reaction: `Asking whether the tool belongs in client work at all is the right instinct, and it isn't yours to settle.`,
      description: [
        `You admitted it fast, offered a checked replacement, and the relationship held.`,
        `Whether the tool should touch client work went up to the partners. Meanwhile this week's four briefings still need checking, by hand, by you.`,
      ],
      judgement: `Knowing what isn't your decision is a skill. So is not using that as an excuse. You passed the policy question up and still did today's checking. Doing only the first is how the next made-up citation goes out.`,
    },

    outcome_warn: {
      heading: `The client's calm. The gap that caused it is still open.`,
      tone: `warn`,
      score: 45,
      reaction: `"Remind everyone to be careful" feels like a response because it names the problem. It doesn't change anything.`,
      description: [
        `You handled the call well and the replacement went out. Asked what would stop a repeat, you suggested a reminder, which is what was in place when this happened.`,
        `The tool still generates citations, and the next invented one will be just as fluent.`,
      ],
      judgement: `Being careful doesn't stop AI making things up. The people here were competent and trying. What was missing was a step that doesn't rely on anyone remembering to be vigilant on a busy Thursday.`,
    },

    outcome_bad: {
      heading: `"Formatting issues" became a complaint`,
      tone: `bad`,
      score: 10,
      reaction: `Reaching for a smaller word than "the AI invented a law" is a human move under pressure. It turns a fixable error into a dispute.`,
      description: [
        `The reply was quick: formatting issues don't make regulations disappear. Your manager is now in the chain.`,
        `A 24-hour correction became two weeks of repair work, with a client who now reads everything you send more carefully.`,
      ],
      judgement: `Clients broadly understand that AI makes things up. What they don't forgive is dodging the question, because that's a choice. Playing down an error to someone who already has the facts adds a second error to the first.`,
    },
  },

  debrief: {
    frame: [
      `The fake citation was convincing because everything around it was right: real formatting, a plausible clause number, a date, and a real citation right next to it. Weeks of accurate output made it easier to trust, not harder.`,
      `A wrong answer that looks wrong gets caught. One delivered in the same confident voice as every right answer doesn't. So the check can't depend on the output looking suspicious. It never will.`,
    ],
  },

  recall: {
    id: `a1-recall`,
    prompt: `A month later the same tool drafts an internal market summary and cites three industry reports. You recognise two of the three firms. What do you do before circulating it?`,
    options: [
      { id: `a`, quality: `poor`, label: `Circulate it. You recognise the sources, so they're real`,
        note: `Knowing the firm doesn't mean the report exists. Sounding plausible is what the model does best, and "it's only internal" lowers your guard without lowering the risk.` },
      { id: `b`, quality: `good`, label: `Check all three against source, including the two you recognise`,
        note: `Yes. Sounding right isn't the same as being checked, and a familiar name only sounds right to you. A wrong figure in an internal summary still drives a decision.` },
      { id: `c`, quality: `partial`, label: `Check only the third one, since the other two look right`,
        note: `Better than nothing, and it repeats the original mistake. "Looks right" is the judgement the briefing proved unreliable.` },
    ],
  },

  act: [
    { id: `a1`, label: `Add a source-check step to any AI-drafted document before it leaves you this week` },
    { id: `a2`, label: `Ask whether your team has a required checking step, or just a suggestion` },
    { id: `a3`, label: `Spot-check one AI-assisted document you've already sent, against source` },
  ],

  controls_summary: [
    { id: `c1`, label: `A required citation check, not a suggested one`, effort: `Low`, owner: `Team lead`, go_live: true,
      context: `Training said the tool "can sometimes make things up". A note is not a control; a required step before sending is.` },
    { id: `c2`, label: `Primary-source linking for any external citation`, effort: `Medium`, owner: `Client services`, go_live: true,
      context: `Every good ending here runs through matching the citation to a real document. Make that the default, not the recovery.` },
    { id: `c3`, label: `Fast, no-blame client acknowledgement norm`, effort: `Low`, owner: `Client services`, go_live: true,
      context: `The difference between the best and worst endings was how quickly someone said "this is wrong" out loud.` },
  ],

  tell: `An AI citation that looks right hasn't been checked. A real source is one you've opened yourself.`,
};
