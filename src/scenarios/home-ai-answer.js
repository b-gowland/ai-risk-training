// home-ai-answer.js — The Answer That Wasn't
// At Home. Four-beat schema (FREE_PRODUCT §4). Built from the everyday-p2
// hallucination scenario, July 2026.
// Perspective: someone planning a trip who asks an AI a consequential
// insurance question and gets a confident, fabricated answer.
//
// At Home: no standing, player brings their own (§4.2). Depth band 4-5.
// Discrimination rule: the failure is specific — a fabricated legal citation
// on a consequential fact — and the scenario explicitly marks "so AI is
// useless now" as the wrong lesson. The tool is fine for drafting and
// exploring; the lesson is calibration, not abandonment.

export const scenario = {
  id: `home-ai-answer`,
  door: `home`,
  risk_ref: `A1`,
  title: `The Answer That Wasn't`,
  shelfLine: `An AI told you your insurance covers driving abroad. You're about to book on that.`,
  hook: `The AI said your insurance covers you to drive in New Zealand, and cited a law. You're about to book.`,
  scene: `phone-search`,
  determinacy: `open`,

  kb_url: `https://library.airiskpractice.org/docs/domain-a-technical/a1-hallucination`,
  regulatory_tags: [`jurisdiction-au`, `jurisdiction-global`],
  mit_subdomain: `mit-3.1`,

  coldOpen: [
    `You're planning a road trip and asked an AI assistant whether your car insurance covers you to drive in New Zealand.`,
    `It answered instantly: "Yes — under Australian insurance law, comprehensive policies automatically extend to New Zealand for trips under 90 days. Check your PDS for exclusions."`,
    `It sounds authoritative. It cites something that sounds like a real law. You're about to book the ferry.`,
  ],

  authority: `You can check your own policy or call your insurer. You can't make the insurer honour something it doesn't cover, whatever an AI told you.`,
  ending: `You find out whether a confident answer holds up when it actually matters — and what you take from it if it doesn't.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The answer didn't hesitate. It named a law, gave a clean rule, even told you to check your PDS — which somehow makes it feel more trustworthy, not less.`,
        `The ferry booking page is open in the next tab.`,
      ],
      artefact: {
        type: `assistant_output`,
        tool: `AI assistant`,
        prompt: `Does my Australian comprehensive car insurance cover me to drive in New Zealand?`,
        response: [
          `Yes — under Australian insurance law, comprehensive policies automatically extend to New Zealand for trips under 90 days.`,
          `Check your Product Disclosure Statement for any specific exclusions.`,
        ],
      },
      decision: {
        prompt: `What do you do?`,
        choices: [
          { id: `a`, label: `Book the ferry — the answer was clear and that's good enough`, quality: `poor`,
            consequence: `AI assistants produce confident, plausible legal and insurance claims that can be entirely invented. "Sounds like a real law" and "is a real law" are not the same thing, and only one of them pays out.` },
          { id: `b`, label: `Check your actual PDS, or call your insurer, before booking`, quality: `good`,
            consequence: `AI is useful for drafting, summarising and exploring. For a decision with real money or legal stakes, the primary source is the only thing that counts — and here it takes one phone call.` },
        ],
      },
      branches: { a: `n2_booked`, b: `n2_checked` },
    },

    n2_booked: {
      prose: [
        `You book on the strength of the answer. Day three in New Zealand, a minor collision in a car park — no one hurt, but there's damage.`,
        `You call your insurer to make a claim.`,
      ],
      decision: {
        prompt: `The consultant says your policy doesn't cover New Zealand driving. What do you do?`,
        choices: [
          { id: `a`, label: `Argue — the AI said it does, and cited a specific law`, quality: `poor`,
            consequence: `The insurer is bound by your PDS, not by what an AI told you. The citation doesn't match any real law or policy term, and the claim won't succeed on it.` },
          { id: `b`, label: `Accept it and ask what your options are now`, quality: `good`,
            consequence: `Accepting the situation quickly is the right move. The repair comes out of pocket this time, and the real fix is verifying AI answers on money and legal questions before acting on them.` },
        ],
      },
      branches: { a: `n3_argued`, b: `n3_accepted` },
    },

    n3_argued: {
      prose: [
        `Two hours on hold gets you the same answer. The claim is rejected. You look up the law the AI cited, and it doesn't exist.`,
        `The repair bill is yours.`,
      ],
      decision: {
        prompt: `How do you take the lesson?`,
        choices: [
          { id: `a`, label: `Pay it, and set a rule: verify AI answers on insurance, legal and medical questions`, quality: `good`,
            consequence: `Expensive, and the right response. The habit is small — for consequential specifics, check the actual document. AI is the starting point, not the finish line.` },
          { id: `b`, label: `Decide AI tools can't be trusted for anything and stop using them`, quality: `poor`,
            consequence: `The failure was specific: a fabricated citation on a consequential fact. That's a known failure mode, not a verdict on the whole technology — and writing the tool off means missing the actual lesson, which is about calibration.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_overcorrected` },
    },

    n3_accepted: {
      prose: [
        `You pay the repair out of pocket. It stings, but the path is clear and you're not compounding it by arguing a citation that doesn't exist.`,
        `Back home, a friend texts: "ChatGPT said it's fine to take these two medications together. Should I trust that?"`,
      ],
      decision: {
        prompt: `What do you tell your friend?`,
        choices: [
          { id: `a`, label: `Tell them what just happened to you, and say to call their pharmacist`, quality: `good`,
            consequence: `Medication interactions are exactly where confident AI fabrication is most dangerous — specific combinations, doses, contraindications. A pharmacist takes two minutes and is authoritative.` },
          { id: `b`, label: `Say AI is probably fine for health questions — it's usually right`, quality: `poor`,
            consequence: `It is often right, and the failure mode on specific facts is confident fabrication. Health questions carry higher stakes than travel insurance, and your friend needs the real picture, not the average one.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_silent` },
    },

    n_forward: {
      prose: [
        `The bill's paid and the trip's behind you. What's left is what you do with it — whether it stays a private, expensive story or becomes something useful.`,
      ],
      decision: {
        prompt: `A friend mentions they lean on AI for exactly these kinds of questions. What do you do?`,
        choices: [
          { id: `a`, label: `Tell them the specific pattern — AI fabricates confident specifics, so check those at the source`, quality: `good`,
            consequence: `The pattern is more useful than the story. "Check consequential specifics" is portable; "I had a bad time with insurance" isn't.` },
          { id: `b`, label: `Keep it to yourself — it's a bit embarrassing`, quality: `partial`,
            consequence: `Understandable, and the pattern that caught you is waiting for them too. A two-minute account is worth more than the small awkwardness of telling it.` },
        ],
      },
      branches: { a: `outcome_shared`, b: `outcome_silent` },
    },

    n2_checked: {
      prose: [
        `You call your insurer before booking. The consultant checks: your policy does not extend to New Zealand — you'd need a paid add-on. The law the AI cited isn't one they recognise.`,
        `A $45 extension sorts it. The trip goes ahead, fully covered.`,
      ],
      decision: {
        prompt: `You dodged a real cost by checking. What do you take from that near-miss?`,
        choices: [
          { id: `a`, label: `A specific rule — verify AI on consequential facts, keep using it for the rest`, quality: `good`,
            consequence: `The precise version: the answer was fabricated, you caught it because you checked, and the fix is a habit for specific facts rather than a verdict on the tool.` },
          { id: `b`, label: `A vague sense that you should be a bit more careful with AI`, quality: `partial`,
            consequence: `Better than nothing, and "be careful" fades fast. A concrete rule — check consequential specifics at the source — is the thing that's still there next time.` },
        ],
      },
      branches: { a: `n_second`, b: `n_second` },
    },

    n_second: {
      prose: [
        `Buoyed by dodging that one, you keep planning. The same AI cheerfully tells you the rental company accepts your Australian licence with no international permit needed, and that the ferry lets you bring the car's spare fuel canister aboard.`,
        `Two more confident, specific claims.`,
      ],
      decision: {
        prompt: `Having just been burned once, what do you do with these two?`,
        choices: [
          { id: `a`, label: `Check both with the rental company and the ferry operator directly`, quality: `good`,
            consequence: `Same pattern, same fix. Both are specific external facts the AI can fabricate as fluently as the insurance one, and both are a quick call to the actual source.` },
          { id: `b`, label: `Trust these two — they're smaller, and the AI was only wrong about the big one`, quality: `partial`,
            consequence: `The AI wasn't wrong because the question was big; it was wrong because it was a specific external fact. Size isn't the signal, and the fuel-canister rule in particular is one you don't want to discover at the dock.` },
        ],
      },
      branches: { a: `n_friend`, b: `n_friend` },
    },

    n_friend: {
      prose: [
        `A week later a friend texts: "ChatGPT said it's fine to take these two medications together. Should I trust that?"`,
        `You've just lived the exact shape of this.`,
      ],
      decision: {
        prompt: `What do you tell your friend?`,
        choices: [
          { id: `a`, label: `Share what happened, and where AI specifically fails — the consequential specifics`, quality: `good`,
            consequence: `The nuanced picture is the useful one. AI fabricates on specific facts — citations, laws, prices, doses — and is fast and reliable for drafting and exploring. Your friend can act on that distinction.` },
          { id: `b`, label: `Tell them AI's probably fine for health questions — it's usually right`, quality: `poor`,
            consequence: `It is often right, and the failure mode on specific facts is confident fabrication. Medication interactions are the high-stakes version of exactly what nearly caught you.` },
        ],
      },
      branches: { a: `outcome_safe_shared`, b: `outcome_safe_silent` },
    },
  },

  outcomes: {
    outcome_safe_shared: {
      heading: `Caught it, and passed on the real lesson`,
      tone: `good`,
      score: 100,
      reaction: `The instinct to check a confident answer before spending money on it is the whole game, and you had it.`,
      description: [
        `The $45 extension meant the trip happened with no coverage gap. And you gave your friend the accurate version — not "AI is fine" or "AI is useless", but where it specifically fails.`,
        `Two safe outcomes from one habit, and someone else now has the pattern too.`,
      ],
      judgement: `The failure mode is precise and worth being able to name: AI fabricates confidently on specific facts — laws, citations, prices, policy terms — and is genuinely fast and reliable for drafting, summarising and exploring ideas. Catching the error was half of it. Passing on the calibrated version rather than a blanket verdict is the half most people skip.`,
    },

    outcome_safe_silent: {
      heading: `Caught it; kept the lesson to yourself`,
      tone: `warn`,
      score: 65,
      reaction: `You did the hard part and verified. Telling your friend "it's probably fine" quietly undoes it for them.`,
      description: [
        `Your trip was covered. But your friend took the AI's answer about their own insurance at face value, on your word that it's fine.`,
        `They got lucky this time. The pattern that would have caught you out is still waiting for them, and a two-minute conversation would have handed it over.`,
      ],
      judgement: `Verifying protected you and stopped there. The value of hitting a failure mode is partly in passing the pattern on — "check consequential specifics against the source" — and "it's probably fine" is the opposite of that. It's the same confident, unverified reassurance the AI gave you, just from a friend.`,
    },

    outcome_overcorrected: {
      heading: `Paid the bill, missed the lesson`,
      tone: `bad`,
      score: 20,
      reaction: `Swearing off AI entirely feels like the safe response after being burned. It's actually the response that keeps the cost and throws away the lesson.`,
      description: [
        `The repair was yours, and you swore off AI altogether. But the failure was specific: a fabricated citation on a consequential question, which is a known, predictable pattern.`,
        `Writing off the whole tool means paying the price and still not knowing where the danger actually is — so the next person you advise gets a verdict, not the pattern.`,
      ],
      judgement: `Calibrate trust to the task. AI fabricates most on specific facts — citations, dates, laws, prices — and there the rule is verify. For drafting, summarising and exploring, it's fast and reliable. "Never use it" costs you a useful tool and, worse, leaves you unable to say where the real failure lives.`,
    },

    outcome_shared: {
      heading: `Paid it forward`,
      tone: `warn`,
      score: 55,
      reaction: `Turning your own bad afternoon into a warning that reaches someone else, on a higher-stakes question, is the best available use of it.`,
      description: [
        `You paid the repair and gave your friend a straight account of what happened. They called their pharmacist instead of trusting the AI on their medication — which, it turned out, mattered.`,
        `Your loss became someone else's near-miss avoided.`,
      ],
      judgement: `Real examples are the most effective warning there is — more than any general caution about AI. Medication interactions are precisely the high-stakes, specific-fact domain where confident fabrication is most dangerous, and the two minutes it takes to ask a pharmacist is the whole fix. Sharing the pattern is the highest-value thing you could do with what it cost you.`,
    },

    outcome_silent: {
      heading: `Absorbed it privately`,
      tone: `warn`,
      score: 35,
      reaction: `"AI's probably fine for health stuff" feels harmless because it usually is fine. The failure mode lives in the specific cases, which is exactly what a medication question is.`,
      description: [
        `You paid the repair and took the lesson quietly. When your friend asked about mixing medications, you told them AI was probably fine.`,
        `They acted on the AI's answer without checking. They got lucky — but the pattern that caught you is the same one, at higher stakes.`,
      ],
      judgement: `The specific danger here is that AI is usually right, so "usually fine" feels true — until the confident fabrication lands on drug interactions or dosages, where the cost of being wrong is not a repair bill. You'd just paid to learn the pattern. Passing it on takes two minutes and is the difference between one person's lesson and two people's safety.`,
    },
  },

  debrief: {
    frame: [
      `The answer that started all this had every marker of trustworthiness. It was instant, it was specific, it named a law, it even told you to double-check your PDS — the kind of caveat that makes something feel more reliable, not less. And it was fabricated. Not the tool malfunctioning; this is the tool doing exactly what it does, which is generate fluent, plausible text, whether or not the specifics behind it are real.`,
      `That's why the lesson isn't "don't use AI" and isn't "AI is usually right so relax". It's that confident fabrication clusters in a predictable place: specific, checkable facts — laws, citations, prices, policy terms, drug interactions. For those, a primary source is the finish line, and it's usually one phone call away. For drafting an email, summarising an article, or thinking something through, the same tool is fast and genuinely useful. The skill is knowing which kind of question you're asking, and reaching for the source when the answer is going to cost you if it's wrong.`,
    ],
  },

  recall: {
    id: `home-ai-answer-recall`,
    prompt: `You ask an AI to summarise a long article you've pasted in, and separately to tell you the current excess on a home-insurance policy you name. Which answer should you verify before relying on it?`,
    options: [
      { id: `a`, quality: `poor`, label: `Neither — the AI handled both, so both should be fine`,
        note: `The insurance excess is exactly the kind of specific, external, checkable fact this scenario is about — the AI has no reliable access to your actual policy and can fabricate a plausible number. "It handled both" is the confidence that leads to booking the ferry.` },
      { id: `b`, quality: `good`, label: `The insurance excess — it's a specific external fact; the summary you can check against the text you gave it`,
        note: `Right. The summary is drawn from text you supplied, so you can verify it against the source in front of you. The excess is an external specific fact the AI may invent — that's the one to confirm with the insurer before relying on it.` },
      { id: `c`, quality: `partial`, label: `The summary — AI often gets long articles slightly wrong`,
        note: `Summaries can drift, and you can check that against the text you pasted in. The higher-risk answer is the external specific fact — the excess — which you can't verify from anything in front of you and which the AI may have fabricated.` },
    ],
  },

  act: [
    { id: `a1`, label: `Next time an AI gives you a law, price, or policy detail that matters, check it against the real source` },
    { id: `a2`, label: `Pick one consequential AI answer you acted on recently and verify it after the fact` },
    { id: `a3`, label: `Tell one person the specific pattern — AI fabricates confident specifics — not just "be careful with AI"` },
  ],

  controls_summary: [
    { id: `c1`, label: `A personal rule: primary source for insurance, legal and medical specifics`, effort: `Low`, owner: `You`, go_live: true,
      context: `The whole failure turns on treating a confident answer as a verified one. A standing habit for consequential specifics is the entire fix.` },
    { id: `c2`, label: `Reach for the source, not a second AI, to check`, effort: `Low`, owner: `You`, go_live: true,
      context: `A second AI can repeat the same plausible fabrication. The insurer, the pharmacist, the actual document — those are the things that settle it.` },
  ],

  tell: `AI fabricates most confidently on specific checkable facts — laws, prices, doses — so those are the ones to verify at the source.`,
};
