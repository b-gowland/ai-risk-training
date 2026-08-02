// home-ai-answer.js — The Answer That Wasn't
// At Home. Four-beat schema (FREE_PRODUCT §4). Built from the everyday-p2
// hallucination scenario, July 2026.
// Perspective: someone planning a trip who asks an AI a consequential
// insurance question and gets a confident, fabricated answer.
//
// At Home: no standing, player brings their own (§4.2). Depth band 4-5.
//
// PREMISE ACCURACY. An earlier version had the player about to book a ferry
// to drive their own car to New Zealand on an Australian policy "extended"
// for $45. There is no vehicle ferry across the Tasman and no such extension
// exists, which put a fabricated insurance mechanism inside a scenario about
// fabricated insurance answers. The premise is now the real one: you fly, you
// rent a car there, and Australian comprehensive cover does not follow you.
//
// The failure taught is specific — a confident, invented rule on a
// consequential external fact — and "so AI is useless now" is authored as the
// wrong lesson. The tool is fine for drafting and thinking; the lesson is
// calibration, not abandonment.

export const scenario = {
  id: `home-ai-answer`,
  door: `home`,
  risk_ref: `A1`,
  title: `The Answer That Wasn't`,
  shelfLine: `An AI says your car insurance covers you overseas. You're about to book on that.`,
  hook: `The AI said your car insurance covers you driving in New Zealand, and named a law. You're about to book.`,
  scene: `phone-search`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-a-technical/a1-hallucination`,
  regulatory_tags: [`jurisdiction-au`, `jurisdiction-global`],
  mit_subdomain: `mit-3.1`,

  coldOpen: [
    `You're flying to New Zealand in three weeks and picking up a rental car at the airport. The booking page wants to know whether you'd like excess reduction, and it is not cheap.`,
    `So you asked an AI assistant whether your Australian comprehensive policy already covers you. It answered straight away, and it named a law.`,
    `The booking page is still open in the other tab.`,
  ],

  authority: `You can read your own policy, or ring your insurer, or take the rental desk's cover. You cannot make an insurer pay for something it does not cover, whatever an AI told you.`,
  ending: `You find out whether a confident answer holds up when there is money behind it, and what you do with that afterwards.`,

  begin: `Go back to the booking page`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The answer didn't hesitate. It named an Act, gave a clean rule, and told you to check your PDS anyway — which somehow makes it feel more careful rather than less.`,
        `Excess reduction is $29 a day. Eight days.`,
      ],
      artefact: {
        type: `assistant_output`,
        caption: `What you asked, and what came back`,
        tool: `AI assistant`,
        prompt: `Does my Australian comprehensive car insurance cover me driving a rental car in New Zealand?`,
        response: [
          `Yes. Under the Motor Vehicle Insurance (Reciprocal Cover) Act, Australian comprehensive policies extend to rental vehicles in New Zealand for trips of up to 90 days, provided you are a named driver on the policy.`,
          `You should still check your Product Disclosure Statement for any specific exclusions.`,
        ],
      },
      decision: {
        prompt: `Excess reduction, or not?`,
        choices: [
          { id: `a`, label: `Decline it. The answer was clear enough.`, quality: `poor`,
            consequence: `It saves you two hundred and thirty dollars, which you notice, and then stop thinking about somewhere over the Tasman.` },
          { id: `b`, label: `Ring the insurer before you decide`, quality: `good`,
            consequence: `Eleven minutes on hold. You spend most of it wondering whether this is a silly question to be asking.` },
        ],
      },
      branches: { a: `n2_booked`, b: `n2_checked` },
    },

    n2_booked: {
      prose: [
        `Day three. A car park in Nelson, a reversing camera you are not used to, and a bollard you would swear was not there.`,
        `Nobody is hurt. The rear quarter panel is not fine. You ring your insurer from the car park.`,
      ],
      decision: {
        prompt: `The consultant says your policy covers your own vehicle, in Australia. What do you do?`,
        choices: [
          { id: `a`, label: `Push back — the AI cited a specific Act`, quality: `poor`,
            consequence: `You read the name of the Act down the phone. There is a pause, and then she asks you to spell it.` },
          { id: `b`, label: `Take it, and ask what your options are now`, quality: `good`,
            consequence: `She is straightforward about it. Your travel insurance might carry rental excess cover; a lot of policies do, and yours turns out not to.` },
        ],
      },
      branches: { a: `n3_argued`, b: `n3_accepted` },
    },

    n3_argued: {
      prose: [
        `Two hours across two calls gets you the same answer in three different tones of voice.`,
        `Afterwards you look up the Act. There is no such Act. There has never been such an Act. The rental company's standard excess is four thousand dollars and the repair comes in under it, which is the only luck in this.`,
      ],
      decision: {
        prompt: `How do you take it?`,
        choices: [
          { id: `a`, label: `Pay it, and set one rule: check the specifics that cost money`, quality: `good`,
            consequence: `You write the rule down, which feels slightly ridiculous, and then you keep it.` },
          { id: `b`, label: `Decide AI can't be trusted for anything and stop using it`, quality: `poor`,
            consequence: `You delete the app on the flight home. Three weeks later you are back to using it for the things it was always good at, with no rule and no idea where the edge is.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_overcorrected` },
    },

    n3_accepted: {
      prose: [
        `You pay the excess and get on with the trip. It stings for about a day.`,
        `Then, on the fourth night, you catch yourself doing it again — asking the same assistant whether the rental agreement lets you take the car across on the Cook Strait ferry, and whether your Australian licence is enough without an international permit.`,
      ],
      decision: {
        prompt: `Two more confident, specific answers. What do you do with them?`,
        choices: [
          { id: `a`, label: `Ring the rental company and check both`, quality: `good`,
            consequence: `The licence is fine. The ferry is not: their agreement says the car stays on this island and you swap vehicles at the terminal. The assistant had been certain about both.` },
          { id: `b`, label: `These two are smaller. Let them go.`, quality: `poor`,
            consequence: `You find out about the vehicle swap at the terminal, at the terminal, with a sailing in forty minutes.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_silent` },
    },

    n_forward: {
      prose: [
        `Home. The trip was good, mostly. What is left is a story you could tell badly or well.`,
        `A friend mentions, in passing, that they ask an assistant this kind of thing all the time.`,
      ],
      decision: {
        prompt: `What do you actually say?`,
        choices: [
          { id: `a`, label: `Name the pattern — it invents specifics, so check the ones that cost you`, quality: `good`,
            consequence: `It takes about twenty seconds. They ask you to say the Act name again, and laugh, and then go quiet.` },
          { id: `b`, label: `Keep it to yourself. It's a bit embarrassing.`, quality: `partial`,
            consequence: `Nobody enjoys being the cautionary tale. The story stays yours, and so does the pattern.` },
        ],
      },
      branches: { a: `outcome_shared`, b: `outcome_silent` },
    },

    n2_checked: {
      prose: [
        `The consultant is clear and slightly amused. Your comprehensive policy covers your own listed vehicle, in Australia. It does not follow you into someone else's car in another country.`,
        `She has not heard of the Act either.`,
      ],
      decision: {
        prompt: `That was going to be a four-thousand-dollar excess. What do you take from it?`,
        choices: [
          { id: `a`, label: `Something specific — check the AI on facts that cost money`, quality: `good`,
            consequence: `You take the excess reduction at the desk and it never matters, which is what most good decisions look like from the outside.` },
          { id: `b`, label: `A general sense that you should be more careful with AI`, quality: `partial`,
            consequence: `You take the excess reduction anyway. By the time you land, "be careful" has worn down to roughly nothing.` },
        ],
      },
      branches: { a: `n_second`, b: `n_second` },
    },

    n_second: {
      prose: [
        `Fourth night, Picton. You ask the same assistant two more things without really thinking about it: whether your Australian licence is enough without an international permit, and whether the rental agreement lets you take the car across on the Cook Strait ferry.`,
        `Both answers arrive with the same easy certainty as the first one.`,
      ],
      decision: {
        prompt: `You already know what that certainty is worth. So?`,
        choices: [
          { id: `a`, label: `Ring the rental company and check both`, quality: `good`,
            consequence: `The licence is fine. The ferry is not: their agreement says the car stays on this island and you swap vehicles at the terminal.` },
          { id: `b`, label: `These are smaller questions. Trust them.`, quality: `partial`,
            consequence: `The size of the question was never what made the first one wrong. You find out about the vehicle swap at the terminal, with a sailing in forty minutes.` },
        ],
      },
      branches: { a: `n_friend`, b: `n_friend` },
    },

    n_friend: {
      prose: [
        `A week after you get back, a friend texts. Her mother has been prescribed something new and she has asked a chatbot whether it's safe alongside what she already takes.`,
        `*It said it's fine. Would you trust that?*`,
      ],
      decision: {
        prompt: `What do you send back?`,
        choices: [
          { id: `a`, label: `Where it fails specifically — and say to ring the pharmacist`, quality: `good`,
            consequence: `The pharmacist takes four minutes and says there is an interaction worth spacing the doses around. Nobody was ever going to die of it. It was also not fine.` },
          { id: `b`, label: `It's usually right about that sort of thing`, quality: `poor`,
            consequence: `It is usually right about that sort of thing. Your friend does not ask anyone else, because you were the person she asked.` },
        ],
      },
      branches: { a: `outcome_safe_shared`, b: `outcome_safe_silent` },
    },
  },

  outcomes: {
    outcome_safe_shared: {
      heading: `Caught it, and passed on the useful half`,
      tone: `good`,
      score: 100,
      reaction: `You made a phone call about something that felt like a silly question. The whole scenario turns on that eleven minutes on hold.`,
      description: [
        `Checking first cost you nothing and saved a four-thousand-dollar excess you were one click away from declining.`,
        `Then your friend got the accurate version rather than a verdict. Not "AI is fine", not "AI is dangerous", but where it goes wrong and what to do instead.`,
      ],
      judgement: `The failure mode is narrow enough to name. These systems invent specifics — laws, prices, policy terms, interactions — in the same fluent voice they use for everything else, and they are genuinely fast and useful for drafting, summarising and thinking out loud. Catching your own case was half the value. Handing on the calibrated version rather than a blanket warning is the half most people skip, and it is the half that reaches someone else's mother.`,
    },

    outcome_safe_silent: {
      heading: `Caught yours. Undid it for her.`,
      tone: `warn`,
      score: 65,
      reaction: `"It's usually right" is true, which is exactly why it is such an easy thing to say.`,
      description: [
        `You verified when it counted and your own trip was covered.`,
        `Your friend asked you because you are the person she asks. She did not ring the pharmacist, because you had already answered.`,
      ],
      judgement: `Verifying protected you and stopped at you. The value of hitting a failure mode is mostly in what you do with it afterwards, and "it's usually right" is the same confident unverified reassurance the assistant gave you in the first place, arriving from someone she trusts more.`,
    },

    outcome_overcorrected: {
      heading: `Paid the excess, threw away the lesson`,
      tone: `bad`,
      score: 20,
      reaction: `Swearing off the tool after it costs you money feels like the responsible response. It is the one that keeps the cost and loses everything you paid for.`,
      description: [
        `Four thousand dollars of excess, and you deleted the app.`,
        `Three weeks later you were using it again, because it is genuinely useful, and this time with no rule at all about where it fails.`,
      ],
      judgement: `Calibrate the trust to the question. Specific external facts — an Act, a price, a policy term, a drug interaction — are where these systems invent, and there the answer is to check the source. For drafting, summarising and thinking something through they are fast and reliable. "Never use it" costs you a good tool and, worse, leaves you unable to tell anyone where the danger actually sits.`,
    },

    outcome_shared: {
      heading: `Paid for it, then made it worth something`,
      tone: `warn`,
      score: 55,
      reaction: `Turning your own expensive week into twenty seconds of useful advice is the best available use of it.`,
      description: [
        `The excess was yours, and there was no getting it back.`,
        `But you gave your friend the pattern rather than the anecdote, which is the part that travels.`,
      ],
      judgement: `A real example beats any general caution about AI, because it is specific and it happened to someone the listener knows. The thing worth passing on is not that you had a bad week in Nelson. It is that the assistant was most convincing exactly where it was inventing, and that the questions worth checking are the ones with money or health behind them.`,
    },

    outcome_silent: {
      heading: `Learned it privately, at full price`,
      tone: `warn`,
      score: 35,
      reaction: `Nobody enjoys being the cautionary tale, and this is the ending where that instinct wins.`,
      description: [
        `You paid the excess, or stood at a ferry terminal with forty minutes and the wrong car, and you kept it to yourself.`,
        `The pattern that caught you is unchanged and unshared. The next person you could have told is still one confident answer away from their own version.`,
      ],
      judgement: `The cost of an expensive lesson is fixed. What varies is how many people get it for free. A vague resolution to be careful fades inside a fortnight; a specific sentence — it invents the specifics, so check the ones that cost you — survives being repeated, which is the only way any of this reaches anyone.`,
    },
  },

  debrief: {
    frame: [
      `The answer that started this had every marker of a good one. Instant. Specific. It named an Act, it gave a clean rule with a number in it, and it told you to check your PDS anyway. That last touch is the one that does the damage, because a caveat reads as care. None of it was real.`,
      `This is not the tool breaking. It is the tool working as built: producing fluent, plausible text, with no separate step anywhere in it that checks whether the specifics exist. Which is why the lesson is neither "don't use AI" nor "it's usually right, relax". The invention clusters somewhere predictable — laws, citations, prices, policy terms, doses, interactions — and for those a primary source is the finish line, usually one phone call away. For drafting an email or thinking a problem through, the same tool is fast and genuinely good. The skill is noticing which kind of question you just asked, and reaching for the source when being wrong has a number attached.`,
    ],
  },

  recall: {
    id: `home-ai-answer-recall`,
    prompt: `You paste a long article in and ask for a summary. Separately, you ask what the excess is on a home-insurance policy you name. Which one do you check before you rely on it?`,
    options: [
      { id: `a`, quality: `poor`, label: `Neither — it handled both, so both are fine`,
        note: `The excess is a specific external fact about a document the assistant has never seen. It can produce a completely plausible number for it. "It handled both" is the confidence that declines the excess reduction.` },
      { id: `b`, quality: `good`, label: `The excess. The summary you can check against the text you gave it.`,
        note: `Yes. The summary is drawn from something in front of you, so verifying it costs a scroll. The excess is external and unverifiable from anything on your screen, which is exactly the shape of answer these systems invent.` },
      { id: `c`, quality: `partial`, label: `The summary — long articles get garbled`,
        note: `Summaries do drift, and you can catch that against the source you pasted. The riskier answer is the one you cannot check from anything in front of you.` },
    ],
  },

  act: [
    { id: `a1`, label: `Next time an AI gives you a law, price or policy detail that costs money, check it at the source` },
    { id: `a2`, label: `Pick one consequential AI answer you already acted on, and verify it after the fact` },
    { id: `a3`, label: `Tell one person the specific pattern — it invents the specifics — rather than "be careful with AI"` },
  ],

  controls_summary: [
    { id: `c1`, label: `One rule: primary source for insurance, legal and medical specifics`, effort: `Low`, owner: `You`, go_live: true,
      context: `The whole failure is treating a confident answer as a checked one. A standing habit for the answers with money or health behind them is the entire fix.` },
    { id: `c2`, label: `Check with the source, not a second AI`, effort: `Low`, owner: `You`, go_live: true,
      context: `A second assistant can produce the same plausible invention. The insurer, the pharmacist, the actual document — those settle it.` },
  ],

  tell: `AI invents most confidently on specific checkable facts — laws, prices, doses — so those are the ones to check at the source.`,
};
