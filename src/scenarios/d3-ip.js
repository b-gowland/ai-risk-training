// d3-ip.js — Who Owns This?
// At Work. Migrated to the four-beat schema (FREE_PRODUCT §4) July 2026.
// Perspective: the developer who accepted an AI-suggested function that turns
// out to match GPL-licensed source — a staff decision about disclosure and
// what "review" actually caught.
//
// Discrimination note (CONTENT_STYLE_GUIDE): the code was reviewed carefully
// and it works. The scenario is not "AI code is bad" — it's that functional
// review answers correctness, not provenance, and those are different
// questions. The competent developer here did nothing lazy; they checked the
// wrong thing because the right thing is invisible without tooling.

export const scenario = {
  id: `d3-ip`,
  door: `work`,
  risk_ref: `D3`,
  title: `Who Owns This?`,
  shelfLine: `Legal says code you wrote with AI matches someone else's licensed code. You checked it carefully.`,
  hook: `Legal says code you shipped is almost identical to someone else's licensed code. You wrote it with AI.`,
  scene: `desk-working`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-d-data/d3-intellectual-property`,
  regulatory_tags: [`eu-ai-act-article-53`, `jurisdiction-global`, `jurisdiction-eu`],
  mit_subdomain: `mit-6.3`,

  coldOpen: [
    `The message from Legal is open on your screen. Three months ago you used the AI coding assistant to write a piece of code that reformats data. You checked it, it worked first time, and you added it to the product.`,
    `Legal's automated scan says it's almost identical to open-source code published under the GPL licence. Using GPL code in a product you sell can oblige you to publish your own code too.`,
    `Before you reply, you have to decide how seriously to take it.`,
  ],

  standing: `Developer on a product team that ships proprietary software`,
  authority: `You can own up, explain what happened, and suggest process changes. You can't decide the legal position or speak for Legal.`,
  ending: `You find out whether a licence problem gets found and fixed everywhere, or whether "the tool did it" lets it spread.`,

  begin: `Open Legal's message`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `You remember the code. It was clean, it passed review, and it's been running for three months without a problem. But Legal isn't asking whether it works.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `The scan result attached to Legal's message`,
        system: `Composition analysis · licence scan`,
        status: `Review required`,
        headline: `transform_records() matches published GPL-3.0 source`,
        fields: [
          { label: `Similarity`, value: `94% to a public GPL-3.0 repository` },
          { label: `Origin`, value: `AI-assisted commit, three months ago` },
          { label: `Product licence`, value: `Proprietary` },
          { label: `Obligation`, value: `Potential copyleft` },
        ],
        rationale: `A functional review confirms the code works. It does not reveal where the code came from.`,
      },
      decision: {
        prompt: `How do you think about the code you wrote with AI?`,
        choices: [
          { id: `a`, label: `As something that might break a licence you never checked, worth flagging however clean it looks`, quality: `good`,
            consequence: `You reply to Legal within the hour with a link to the code. The code hasn't changed, but what you know about it has.` },
          { id: `b`, label: `As probably fine. You reviewed it carefully and it worked first time`, quality: `partial`,
            consequence: `You say so in the reply, twice. Legal's response does not mention correctness at all.` },
          { id: `c`, label: `As the tool's output. If there's a licence problem, that's the AI vendor's`, quality: `poor`,
            consequence: `Legal forwards you the AI vendor's terms with two clauses highlighted. Neither says what you assumed.` },
        ],
      },
      branches: { a: `n_response`, b: `n_response`, c: `n_response` },
    },

    n_response: {
      prose: [
        `Legal has asked every developer who used AI to write code to come forward. The message is clear: this is a real risk, and they want to know how big it is, fast.`,
        `You know you used AI on that code.`,
      ],
      decision: {
        prompt: `What do you do?`,
        choices: [
          { id: `a`, label: `Flag it now with the pull-request link and date`, quality: `good`,
            consequence: `Four lines and a link, sent before lunch. You are the second person to reply and there are eleven developers on the list.` },
          { id: `b`, label: `Flag it, but note that you reviewed it thoroughly and it looked correct`, quality: `partial`,
            consequence: `You add a paragraph defending the review. Legal reads the first two lines, which are the ones with the date and the link.` },
          { id: `c`, label: `Wait for the scanning tool. It might not flag your code`, quality: `poor`,
            consequence: `Nothing happens for six days, and you stop thinking about it.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_flagged`, c: `n_recover` },
    },

    n_recover: {
      prose: [
        `You decided to wait. A week later the scan flags your code anyway, and Legal follows up. The records show you used AI and didn't reply to their request.`,
      ],
      decision: {
        prompt: `Legal asks why you didn't flag it. What do you do?`,
        choices: [
          { id: `a`, label: `Own it: confirm you used AI, and share the code link and what you remember`, quality: `good`,
            consequence: `You send everything you have, a week later than eleven other people did. They take it and use it.` },
          { id: `b`, label: `Say you assumed the scan would catch anything, and point to your review`, quality: `partial`,
            consequence: `"We know it caught it. We asked people to tell us." Then they move on and ask for the pull request.` },
          { id: `c`, label: `Frame it as a non-issue. The scan found it, so the process worked`, quality: `poor`,
            consequence: `There is a short silence on the call. Somebody types something.` },
        ],
      },
      branches: { a: `n2_flagged`, b: `n2_flagged`, c: `outcome_wait` },
    },

    n2_flagged: {
      prose: [
        `You've flagged it, and Legal confirms it matches the GPL code. Then a question you weren't expecting: do you remember the prompt you used?`,
      ],
      decision: {
        prompt: `Why does the prompt matter, and what do you tell them?`,
        choices: [
          { id: `a`, label: `Share what you remember. It helps them see whether similar prompts were used elsewhere`, quality: `good`,
            consequence: `You find roughly what you asked for in an old branch description. It turns out two other people phrased it almost identically.` },
          { id: `b`, label: `You can't recall exactly. It was three months ago and you don't keep prompt records`, quality: `partial`,
            consequence: `Nobody was ever asked to keep them. Legal notes that nothing in the code shows which parts came from AI.` },
          { id: `c`, label: `The prompt doesn't matter. The tool is responsible for what it generated`, quality: `poor`,
            consequence: `They send you the AI vendor's promise to cover legal costs. It has three conditions, and the team meets one.` },
        ],
      },
      branches: { a: `n_scope`, b: `n_scope`, c: `n_scope` },
    },

    n_scope: {
      prose: [
        `Your code is being fixed. The bigger question is how far this goes. If the AI copied licensed code once, in code that was never scanned, how much else is in there?`,
      ],
      decision: {
        prompt: `Legal asks how wide the check should be. What do you recommend?`,
        choices: [
          { id: `a`, label: `Scan all the company's code for licence matches, not just yours`, quality: `good`,
            consequence: `The scan takes four hours to set up and eleven minutes to run across nine years of code.` },
          { id: `b`, label: `Check the other code you personally wrote with AI first, then decide`, quality: `partial`,
            consequence: `Your own commits come back clean apart from the one. But eleven other developers have used the same AI since March.` },
          { id: `c`, label: `Just fix the one confirmed match. There's no evidence of others`, quality: `poor`,
            consequence: `The one piece of code is rewritten by Thursday. Nobody looks at anything else.` },
        ],
      },
      branches: { a: `n_remediate`, b: `n_remediate`, c: `n_remediate` },
    },

    n_remediate: {
      prose: [
        `The scan finds a handful of matches. Two more are under GPL, one is under a looser licence called LGPL, and some allow free reuse.`,
        `Legal asks how you'd handle the GPL ones, since you know the code.`,
      ],
      decision: {
        prompt: `What do you recommend for the GPL matches?`,
        choices: [
          { id: `a`, label: `Rewrite them from scratch without AI, and send the LGPL one to Legal rather than guessing`, quality: `good`,
            consequence: `Two rewrites, half a day each, no assistant. Legal comes back on the LGPL one with a set of steps you would not have guessed at.` },
          { id: `b`, label: `Heavily rewrite the GPL code (rename, restructure) so it's not the original anymore`, quality: `partial`,
            consequence: `You rename and rearrange until it looks different. Legal asks how much of the original logic is still there, and you can't give a clear answer.` },
          { id: `c`, label: `Ignore the LGPL and free-to-reuse matches, and just fix the two GPL ones`, quality: `poor`,
            consequence: `The two GPL matches get rewritten. The LGPL one sits in the ignore pile with the free-to-reuse ones.` },
        ],
      },
      branches: { a: `n_control`, b: `n_control`, c: `n_control` },
    },

    n_control: {
      prose: [
        `The clean-up is planned. The last question is how to stop this happening again. Code review was designed before AI assistants, and nothing in it checks where code came from.`,
        `Your lead asks what should change.`,
      ],
      decision: {
        prompt: `What do you recommend as the lasting fix?`,
        choices: [
          { id: `a`, label: `An automatic licence scan that blocks problem code, plus a short briefing on why it's there`, quality: `good`,
            consequence: `The scan is in place within a fortnight. The briefing takes five minutes at a stand-up and half the room has questions.` },
          { id: `b`, label: `An automatic licence scan that blocks problem code, and leave it at that`, quality: `partial`,
            consequence: `The scan goes in and starts blocking code on day two. Nobody has explained to anyone why it is there.` },
          { id: `c`, label: `A reminder to developers to think about licences, and a tick-box to confirm they did`, quality: `poor`,
            consequence: `The tick-box is added to every code submission. Everybody ticks it, and believes it when they do.` },
        ],
      },
      branches: { a: `outcome_great`, b: `outcome_good`, c: `outcome_bad` },
    },
  },

  outcomes: {
    outcome_great: {
      heading: `Found everywhere, and blocked for the future`,
      tone: `good`,
      score: 100,
      reaction: `Asking for a whole-codebase scan when your own fix was underway is the slower call, and the one that keeps this out of the news.`,
      description: [
        `The full scan found two more problem matches, both fixed. An automatic scan now blocks new ones, and a short briefing explained why.`,
        `Owning up early, with your prompt, helped Legal size it up fast. The whole risk is closed.`,
      ],
      judgement: `AI-written code needs two safeguards: an automatic check that catches what people can't see, and enough understanding that nobody works around it. At every step you could have played the problem down, and you didn't.`,
    },

    outcome_good: {
      heading: `Scan in place, but nobody told why`,
      tone: `warn`,
      score: 68,
      reaction: `An automatic scan is the right fix. Skipping the "why" shows up later as someone rearranging code to get past it.`,
      description: [
        `The risk was sized up and an automatic licence scan went in. It works, and caught more matches in the months after.`,
        `With no briefing, two developers saw it as an obstacle and tried to rearrange code to get past it. The briefing came later.`,
      ],
      judgement: `A check works best when people know what it's for. Without that, developers see it as an obstacle and look for a way round. Five minutes of explanation makes it stick.`,
    },

    outcome_wait: {
      heading: `The scan found it. You didn't flag it.`,
      tone: `warn`,
      score: 35,
      reaction: `Waiting for the scan feels free when the result is the same. It costs trust, and that shows up later.`,
      description: [
        `The automated scan flagged your code. Not speaking up when asked slowed things down, and Legal had to chase you.`,
        `The fix was the same. The silence is on record, and it affects how far the team trusts you next time.`,
      ],
      judgement: `Speaking up when you know is faster than waiting for a tool. Scans miss things, and people's memory is part of the evidence. A developer who knows and waits is holding back part of the picture.`,
    },

    outcome_bad: {
      heading: `A tick-box where a real check was needed`,
      tone: `bad`,
      score: 15,
      reaction: `A tick-box feels like a safeguard because it leaves a record. The record says the team knew the risk and skipped a real check.`,
      description: [
        `The reminder and tick-box left the gap open. Two months later a developer on deadline added more code with a serious licence match.`,
        `They looked carefully and couldn't see it, because nobody can without a tool. The scan went in after that.`,
      ],
      judgement: `No reviewer can see licence risk in generated code by reading it. Matching against public GPL source takes a scanning tool. A tick-box on unscanned code proves the team understood the risk and chose a process that couldn't catch it.`,
    },
  },

  debrief: {
    frame: [
      `The developer did nothing careless. They checked the code, it worked, and it ran for three months. The risk was in what they couldn't see: where the code came from.`,
      `A match against public GPL code is invisible without a scan, however hard you look. The legal responsibility sits with whoever ships the code. The AI vendor may cover some costs, but that doesn't fix the code.`,
    ],
  },

  recall: {
    id: `d3-recall`,
    prompt: `A teammate says they've made AI-suggested code safe by "refactoring it heavily. Renamed everything, restructured the logic, so it's not the original code anymore." Does that solve the GPL problem?`,
    options: [
      { id: `a`, quality: `poor`, label: `Yes. If it's been substantially rewritten, it's no longer the licensed code`,
        note: `Whether a rewrite is enough is a legal question. It depends on how much of the structure and logic survived, judged by past cases, not by how different it looks.` },
      { id: `b`, quality: `good`, label: `Not necessarily. Whether a rewrite gets around the licence is a question for Legal`,
        note: `Right. "I changed it enough" is an engineering answer to a legal question. Code of GPL origin goes to Legal however heavily it was rewritten.` },
      { id: `c`, quality: `partial`, label: `Mostly. A heavy rewrite usually gets around it, though there are exceptions`,
        note: `"Usually" is doing a lot of work, and it isn't the developer's call. The licence can still apply if the structure and logic remain, so refer it to Legal.` },
    ],
  },

  act: [
    { id: `a1`, label: `Find out whether your team automatically scans new code for licence problems` },
    { id: `a2`, label: `Next time you accept AI-suggested code, note it. A short tag is enough to find it later` },
    { id: `a3`, label: `If AI-origin code raises a GPL question, send it to Legal rather than judging the rewrite yourself` },
  ],

  controls_summary: [
    { id: `c1`, label: `An automatic licence scan that blocks problem code`, effort: `Medium`, owner: `Platform / eng lead`, go_live: true,
      context: `Licence problems are invisible to a human reviewer. Only a check that doesn't rely on someone spotting it can catch them.` },
    { id: `c2`, label: `A simple tag marking AI-written code`, effort: `Low`, owner: `Dev team`, go_live: true,
      context: `Nobody could remember which code came from AI. A simple tag fixes that without slowing anyone down.` },
    { id: `c3`, label: `A short briefing on why the scan exists`, effort: `Low`, owner: `Eng lead`, go_live: true,
      context: `People work around checks they don't understand. Five minutes explaining the purpose stops that.` },
  ],

  tell: `AI can hand you licensed code with no trace of where it came from. Review shows it works. Only a scan shows what it is.`,
};
