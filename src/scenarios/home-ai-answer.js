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
        `The answer didn't hesitate. It named an Act, gave a clean rule, and told you to check your PDS anyway. That makes it feel more careful.`,
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
            consequence: `It saves you $232. You stop thinking about it somewhere over the Tasman.` },
          { id: `b`, label: `Ring the insurer before you decide`, quality: `good`,
            consequence: `Eleven minutes on hold. You spend most of it wondering whether this is a silly question to be asking.` },
        ],
      },
      branches: { a: `n2_booked`, b: `n2_checked` },
    },

    n2_booked: {
      prose: [
        `Day three. A car park in Nelson, a reversing camera you are not used to, and a bollard you would swear was not there.`,
        `Nobody is hurt, but the back of the car is badly dented. You ring your insurer from the car park.`,
      ],
      decision: {
        prompt: `The consultant says your policy covers your own vehicle, in Australia. What do you do?`,
        choices: [
          { id: `a`, label: `Push back. The AI cited a specific Act`, quality: `poor`,
            consequence: `You read the name of the Act down the phone. There is a pause, and then she asks you to spell it.` },
          { id: `b`, label: `Take it, and ask what your options are now`, quality: `good`,
            consequence: `She is straightforward about it. Your travel insurance might carry rental excess cover; a lot of policies do, and yours turns out not to.` },
        ],
      },
      branches: { a: `n3_argued`, b: `n3_accepted` },
    },

    n3_argued: {
      prose: [
        `Two hours and two calls later, the answer is still no.`,
        `Afterwards you look up the Act. It doesn't exist, and it never has. You pay the rental company's excess: four thousand dollars.`,
      ],
      decision: {
        prompt: `How do you take it?`,
        choices: [
          { id: `a`, label: `Pay it, and set one rule: check the specifics that cost money`, quality: `good`,
            consequence: `You write the rule down. It feels a bit silly, but you keep it.` },
          { id: `b`, label: `Decide AI can't be trusted for anything and stop using it`, quality: `poor`,
            consequence: `You delete the app on the flight home. Three weeks later you are back to using it for the things it was always good at, with no rule about where it goes wrong.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_overcorrected` },
    },

    n3_accepted: {
      prose: [
        `You pay the excess and get on with the trip. It stings for about a day.`,
        `Then, on the fourth night, you catch yourself doing it again. You ask the same assistant two things. Can you take the rental car on the Cook Strait ferry? Is your Australian licence enough without an international permit?`,
      ],
      decision: {
        prompt: `Two more confident, specific answers. What do you do with them?`,
        choices: [
          { id: `a`, label: `Ring the rental company and check both`, quality: `good`,
            consequence: `The licence is fine. The ferry is not: their agreement says the car stays on this island and you swap vehicles at the terminal. The assistant had been certain about both.` },
          { id: `b`, label: `These two are smaller. Let them go.`, quality: `poor`,
            consequence: `You find out about the vehicle swap at the terminal, with a sailing in forty minutes.` },
        ],
      },
      branches: { a: `n_forward`, b: `outcome_silent` },
    },

    n_forward: {
      prose: [
        `You're home. The trip was mostly good.`,
        `A friend mentions, in passing, that they ask an assistant this kind of thing all the time.`,
      ],
      decision: {
        prompt: `What do you say?`,
        choices: [
          { id: `a`, label: `Tell them it makes up details, so check the ones that cost money`, quality: `good`,
            consequence: `It takes about twenty seconds. They ask you to say the Act name again, and laugh, and then go quiet.` },
          { id: `b`, label: `Keep it to yourself. It's a bit embarrassing.`, quality: `partial`,
            consequence: `Nobody likes being the cautionary tale, so you keep it to yourself.` },
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
          { id: `a`, label: `Something specific: check the AI on facts that cost money`, quality: `good`,
            consequence: `You take the excess reduction at the desk. You never need it, which is how it usually goes.` },
          { id: `b`, label: `A general sense that you should be more careful with AI`, quality: `partial`,
            consequence: `You take the excess reduction anyway. By the time you land, you've mostly forgotten why.` },
        ],
      },
      branches: { a: `n_second`, b: `n_second` },
    },

    n_second: {
      prose: [
        `Fourth night, in Picton. Without thinking much, you ask the same assistant two more things. Is your Australian licence enough without an international permit? Can you take the rental car on the Cook Strait ferry?`,
        `Both answers sound just as sure as the first one.`,
      ],
      decision: {
        prompt: `You know how sure it sounded last time. What do you do?`,
        choices: [
          { id: `a`, label: `Ring the rental company and check both`, quality: `good`,
            consequence: `The licence is fine. The ferry is not: their agreement says the car stays on this island and you swap vehicles at the terminal.` },
          { id: `b`, label: `These are smaller questions. Trust them.`, quality: `partial`,
            consequence: `Smaller questions aren't safer. You find out about the vehicle swap at the terminal, with a sailing in forty minutes.` },
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
          { id: `a`, label: `Explain where it goes wrong, and tell her to ring the pharmacist`, quality: `good`,
            consequence: `The pharmacist takes four minutes and says there is an interaction worth spacing the doses around. It wasn't dangerous, but it wasn't fine either.` },
          { id: `b`, label: `It's usually right about that sort of thing`, quality: `poor`,
            consequence: `Your friend doesn't ask anyone else. You were the person she asked.` },
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
      reaction: `You made a phone call that felt like a silly question. Those eleven minutes on hold made the difference.`,
      description: [
        `Checking first cost you nothing and saved a four-thousand-dollar excess you were one click from declining.`,
        `Then your friend got the accurate version: where AI goes wrong and what to do instead.`,
      ],
      judgement: `These tools make up details, like laws, prices, policy terms and drug interactions, and sound just as sure as when they're right. Catching your own mistake was half the value. Telling your friend where it goes wrong is the half that protects someone else's mum.`,
    },

    outcome_safe_silent: {
      heading: `Caught yours. Undid it for her.`,
      tone: `warn`,
      score: 65,
      reaction: `"It's usually right" is true, so it's easy to say.`,
      description: [
        `You checked when it counted, and your own trip was covered.`,
        `Your friend asked you because you're the person she asks. She didn't ring the pharmacist, because you'd already answered.`,
      ],
      judgement: `Checking protected you and stopped there. "It's usually right" is the same unchecked reassurance the assistant gave you, now coming from someone she trusts more.`,
    },

    outcome_overcorrected: {
      heading: `Paid the excess, threw away the lesson`,
      tone: `bad`,
      score: 20,
      reaction: `Swearing off the tool after it costs you money feels responsible. You keep the cost and lose the lesson you paid for.`,
      description: [
        `Four thousand dollars of excess, and you deleted the app.`,
        `Three weeks later you were using it again, because it's useful, and this time with no rule at all about where it fails.`,
      ],
      judgement: `Match your trust to the question. These tools make up laws, prices, policy terms and doses, so check those at the source. For drafting and summarising they're fast and useful. "Never use it" also leaves you unable to tell anyone where the danger sits.`,
    },

    outcome_shared: {
      heading: `Paid for it, then made it worth something`,
      tone: `warn`,
      score: 55,
      reaction: `Turning your own expensive week into twenty seconds of useful advice is the best use of it.`,
      description: [
        `The excess was yours, and there was no getting it back.`,
        `But you gave your friend the rule, not just the story, and the rule is the part that helps.`,
      ],
      judgement: `A real example beats general caution, because it happened to someone the listener knows. The assistant sounded most convincing exactly where it was making things up. Check the answers with money or health behind them.`,
    },

    outcome_silent: {
      heading: `Learned it privately, at full price`,
      tone: `warn`,
      score: 35,
      reaction: `Nobody enjoys being the cautionary tale, and this is the ending where that instinct wins.`,
      description: [
        `You paid the excess, or stood at a ferry terminal with forty minutes and the wrong car, and kept it to yourself.`,
        `The next person you could have told is still one confident answer away from their own version.`,
      ],
      judgement: `The cost of the lesson is fixed. What varies is how many people get it free. "Be careful" fades in a fortnight. "It makes up details, so check the ones that cost money" sticks.`,
    },
  },

  debrief: {
    frame: [
      `The answer had every sign of a good one. It was instant, named an Act, gave a rule with a number, and told you to check your PDS anyway. That last line did the most harm, because it sounded careful.`,
      `The tool wasn't broken. It writes smooth text, and nothing in it checks whether the details are real. Made-up details turn up most in laws, prices, policy terms and doses. The real answer is usually one phone call away.`,
    ],
  },

  recall: {
    id: `home-ai-answer-recall`,
    prompt: `You paste a long article in and ask for a summary. Separately, you ask what the excess is on a home-insurance policy you name. Which one do you check before you rely on it?`,
    options: [
      { id: `a`, quality: `poor`, label: `Neither. It handled both, so both are fine`,
        note: `The excess is a fact about a document the assistant has never seen, so it can invent a plausible number. "It handled both" is how you decline the cover.` },
      { id: `b`, quality: `good`, label: `The excess. The summary you can check against the text you gave it.`,
        note: `Yes. You can check the summary against the text you gave it. The excess comes from nowhere on your screen, which is exactly the kind of answer these tools invent.` },
      { id: `c`, quality: `partial`, label: `The summary. Long articles get garbled`,
        note: `Summaries can be wrong too, but you can check them against what you pasted. The riskier answer is the one you can't check from anything in front of you.` },
    ],
  },

  act: [
    { id: `a1`, label: `Next time an AI gives you a law, price or policy detail that costs money, check it at the source` },
    { id: `a2`, label: `Pick one AI answer you acted on that mattered, and check it now` },
    { id: `a3`, label: `Tell one person the specific problem (AI makes up details) rather than just "be careful with AI"` },
  ],

  controls_summary: [
    { id: `c1`, label: `One rule: check insurance, legal and medical details with the real source`, effort: `Low`, owner: `You`, go_live: true,
      context: `The whole failure is treating a confident answer as a checked one. A standing habit for the answers with money or health behind them is the entire fix.` },
    { id: `c2`, label: `Check with the source, not a second AI`, effort: `Low`, owner: `You`, go_live: true,
      context: `A second assistant can produce the same plausible invention. The insurer, the pharmacist or the document itself settles it.` },
  ],

  tell: `AI invents most confidently on specific facts you could check, like laws, prices and doses. Check those at the source.`,
};
