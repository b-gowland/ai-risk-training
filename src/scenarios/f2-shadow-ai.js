// f2-shadow-ai.js — The Shortcut
// At Work. Rebuilt July 2026 to the four-beat schema (FREE_PRODUCT §4).
// Perspective: the person who pastes, not the person who investigates.

export const scenario = {
  id: `f2-shadow-ai`,
  door: `work`,
  risk_ref: `F2`,
  title: `The Shortcut`,
  shelfLine: `A colleague tells you to paste the client brief into a free AI tool.`,
  hook: `It's four o'clock. Your colleague says just put the client brief through an AI tool.`,
  doorScene: `door-work`,
  scene: `desk-casual`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-f-deployment/f2-shadow-ai`,
  regulatory_tags: [`eu-ai-act-article-26`, `nist-ai-rmf-govern-2`, `jurisdiction-au`, `jurisdiction-eu`],
  mit_subdomain: `mit-2.1`,

  coldOpen: [
    `It is four o'clock on a Wednesday. The client one-pager is due at nine tomorrow, and what you have is three pages of product notes.`,
    `Your colleague leans across the desk. "Just put it through an AI tool. Two minutes."`,
    `You look at the notes again. The client's name is in there. So is what they pay you.`,
  ],

  standing: `Jamie, marketing team, eighteen months in the job`,
  authority: `You choose what goes into the tool and what doesn't. You can't approve software, rewrite a policy, or move tomorrow's meeting.`,
  ending: `You find out where the file went, and how the person who has to explain it reads what you did.`,

  begin: `Open the file`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The notes were written for internal use. Nobody expected them to leave the building, so nobody was careful about what went in them.`,
      ],
      artefact: {
        type: `document`,
        caption: `The file on your screen`,
        filename: `Q3_product_notes_INTERNAL.docx`,
        meta: `Last edited by R. Okonkwo · 11 days ago`,
        lines: [
          { text: `Northwind Group — renewal positioning`, heading: true },
          `Account owner: R. Okonkwo. Renewal date 14 Oct.`,
          `Current contract: $412,000 annual. Northwind have flagged budget pressure twice this quarter.`,
          `Proposed Q4 pricing (NOT ANNOUNCED — do not circulate): tier 2 moves to $38/seat, tier 3 to $61/seat.`,
          `Three competitors are believed to be in conversation with them. Positioning should avoid naming any of them.`,
        ],
      },
      decision: {
        prompt: `What do you do with it?`,
        choices: [
          { id: `a`, label: `Paste the lot in and see what comes back`, quality: `poor`,
            consequence: `It takes about ninety seconds. What comes back is better than what you would have written at four o'clock on a Wednesday.` },
          { id: `b`, label: `Ask your colleague whether this is allowed`, quality: `partial`,
            consequence: `She shrugs. "Everyone does it." She has been here four years, so you take that as a yes.` },
          { id: `c`, label: `Look for a policy before you do anything`, quality: `good`,
            consequence: `You search the intranet for "AI". Eleven results. Nine are about a webinar.` },
          { id: `d`, label: `Write it yourself and lose the evening`, quality: `good`,
            consequence: `It takes forty-five minutes. The one-pager is fine, and nobody will ever know there was a choice to make.` },
        ],
      },
      branches: { a: `n2_output`, b: `n2_asked`, c: `n2_policy`, d: `n2_slow` },
    },

    n2_asked: {
      prose: [
        `You go back to your screen. The deadline has not moved and neither has the file.`,
      ],
      decision: {
        prompt: `What now?`,
        choices: [
          { id: `a`, label: `Paste it. She'd know if it were a problem.`, quality: `poor`,
            consequence: `She wouldn't. Nobody has told her either.` },
          { id: `b`, label: `Ask your team lead instead`, quality: `good`,
            consequence: `He doesn't seem to mind being asked.` },
          { id: `c`, label: `Go and find the policy yourself`, quality: `good`,
            consequence: `Eleven results for "AI" on the intranet. Nine of them are about a webinar.` },
        ],
      },
      branches: { a: `n2_output`, b: `n3_lead`, c: `n3_lead` },
    },

    n2_policy: {
      prose: [
        `The tenth result is the policy, filed somewhere you have never needed to look.`,
      ],
      artefact: {
        type: `document`,
        caption: `Intranet › Governance 2022 › Technology`,
        filename: `Acceptable Use — External Tools and Services`,
        meta: `Owner: Information Security · Last reviewed March 2022`,
        lines: [
          { text: `4.3 Third-party processing of company information`, heading: true },
          `Company information classified Internal or above must not be entered into external tools or services that have not been assessed and approved by Information Security.`,
          `An approved-tools register is maintained by Information Security and is available on request.`,
          { text: `This document was last reviewed in March 2022 and is scheduled for review annually.`, faint: true },
        ],
      },
      decision: {
        prompt: `The policy is older than the tool your colleague means. What now?`,
        choices: [
          { id: `a`, label: `It says no. That's enough.`, quality: `good`,
            consequence: `It is four years old and never imagined tools like this. It still says no.` },
          { id: `b`, label: `Ask Information Security which tools are approved`, quality: `good`,
            consequence: `You send three lines to a shared inbox and go back to the notes while you wait.` },
          { id: `c`, label: `Treat it as out of date and paste anyway`, quality: `poor`,
            consequence: `Old policy, new tool, real deadline. All true, and the file still goes out.` },
        ],
      },
      branches: { a: `n3_lead`, b: `n3_lead`, c: `n2_output` },
    },

    n2_slow: {
      prose: [
        `You send the one-pager at ten past five. It is good enough and it cost you an evening.`,
        `Across the desk, your colleague is still pasting.`,
      ],
      decision: {
        prompt: `Do you do anything about that?`,
        choices: [
          { id: `a`, label: `No. It's not your call to make.`, quality: `partial`,
            consequence: `True. Your colleague keeps pasting either way.` },
          { id: `b`, label: `Mention it to your team lead`, quality: `good`,
            consequence: `You keep it short and you don't name her. He asks what tool.` },
          { id: `c`, label: `Ask whether the team is supposed to have a rule about this`, quality: `good`,
            consequence: `Nobody knows. That turns out to be the useful answer, because it shows the gap.` },
        ],
      },
      branches: { a: `n2_slow_b`, b: `n3_lead`, c: `n3_lead` },
    },

    n2_output: {
      prose: [
        `Ninety seconds. It is a good one-pager.`,
      ],
      artefact: {
        type: `assistant_output`,
        tool: `Brightline AI — Free plan`,
        prompt: `Turn these product notes into a punchy one-page client summary for a meeting tomorrow. [3 pages pasted]`,
        response: [
          `Here is a one-page summary positioned for a renewal conversation:`,
          `NORTHWIND GROUP — PARTNERSHIP REVIEW. Three years in, Northwind's usage has grown across every tier. As we move into Q4, our pricing has been structured to reward exactly that pattern of growth.`,
          `I have kept the competitive landscape implicit rather than explicit, and framed the Q4 tier changes as value alignment rather than an increase. Want me to draft a version that opens on the budget question instead?`,
        ],
        citations: [
          `Free plan: conversations may be reviewed to improve our models. Manage in Settings › Data.`,
        ],
      },
      decision: {
        prompt: `What do you do with the output?`,
        choices: [
          { id: `a`, label: `Send it. It's better than yours.`, quality: `poor`,
            consequence: `You attach it and go home. The meeting goes well. For three weeks, nothing at all happens.` },
          { id: `b`, label: `Read the line about data first`, quality: `good`,
            consequence: `Settings › Data. There is a switch to stop this, but on the free plan you can't turn it off. There is an upgrade link underneath.` },
          { id: `c`, label: `Delete the conversation, then send it`, quality: `poor`,
            consequence: `The chat disappears from your history. The company that runs the tool still has it.` },
        ],
      },
      branches: { a: `n3_after_send`, b: `n3_terms`, c: `n3_after_send` },
    },

    n3_terms: {
      prose: [
        `The upgrade page is much clearer than the free plan.`,
      ],
      artefact: {
        type: `document`,
        caption: `Brightline AI › Plans`,
        filename: `Data handling by plan`,
        lines: [
          { text: `Free`, heading: true },
          `Conversations are retained and may be used to improve our models and reviewed by our staff. Deleting a conversation removes it from your history.`,
          { text: `Business`, heading: true },
          `Conversations are not used for model training. Retention configurable. Available with a company agreement.`,
        ],
      },
      decision: {
        prompt: `The file is already in. What now?`,
        choices: [
          { id: `a`, label: `Stop, and write the one-pager yourself`, quality: `good`,
            consequence: `You lose the evening you were trying to save. The pricing is still on someone else's servers, and now you know it.` },
          { id: `b`, label: `It's one document. Send it and move on.`, quality: `poor`,
            consequence: `You close the tab. It's one document, until someone has to count them all.` },
        ],
      },
      branches: { a: `n4_notice_clean`, b: `n3_hold` },
    },

    n3_lead: {
      prose: [
        `There is an approved tool. It has been available since March, under a company agreement, but the email about it went to a mailing list you're not on.`,
      ],
      decision: {
        prompt: `He offers to get you access. It takes a day to set up.`,
        choices: [
          { id: `a`, label: `Take it, and do tomorrow's one-pager by hand`, quality: `good`,
            consequence: `You lose one evening. From Friday you have the tool everyone assumed you already had.` },
          { id: `b`, label: `A day is a day too long. Use the free one tonight.`, quality: `poor`,
            consequence: `You already know the free plan keeps what you give it. That will matter later.` },
        ],
      },
      branches: { a: `n4_notice_clean`, b: `n2_output` },
    },

    n3_hold: {
      prose: [
        `Three weeks pass. Nothing happens.`,
        `Then this lands in the marketing team inbox on a Monday.`,
      ],
      artefact: {
        type: `email`,
        caption: `Monday, 8:52am`,
        subject: `Preservation notice — AI tool usage, Q3`,
        fromName: `Legal Operations`,
        fromAddress: `legal.ops@ourcompany.example`,
        to: `Marketing (all)`,
        date: `Mon 8:52`,
        body: [
          `A preservation notice is now in effect covering all records relating to the use of external AI tools in connection with Northwind Group account activity during Q3.`,
          `Do not delete any material that may fall within scope. This includes browser history, conversation logs in third-party tools, drafts, and attachments.`,
          `If you believe you hold material within scope, contact Legal Operations directly. You do not need to determine scope yourself.`,
        ],
        signature: `Legal Operations`,
      },
      decision: {
        prompt: `You know exactly what this is about.`,
        choices: [
          { id: `a`, label: `Say nothing. Nobody knows it was you.`, quality: `poor`,
            consequence: `You reread the email twice and then archive it. The rest of Monday is hard, and you can't tell anyone why.` },
          { id: `b`, label: `Tell your manager before lunch`, quality: `good`,
            consequence: `It takes four minutes, and it's harder than you expected. He asks what date and what tool, and writes both down.` },
          { id: `c`, label: `Contact Legal Operations directly, as the email says`, quality: `good`,
            consequence: `The reply comes within the hour, calm and matter-of-fact. They ask for the date, the tool, and the plan you were on.` },
        ],
      },
      branches: { a: `n4_silence`, b: `n4_disclose`, c: `n4_disclose` },
    },


    /* ── The clean back half: you did not paste, and the notice lands anyway */

    n2_slow_b: {
      prose: [
        `Thursday. Your colleague asks whether you can run hers through the same way you did yours, because the deadline moved again.`,
        `She means the AI tool. She has assumed all week that is what you used.`,
      ],
      decision: {
        prompt: `What do you say?`,
        choices: [
          { id: `a`, label: `Tell her you wrote it by hand, and why`, quality: `good`,
            consequence: `"You did the whole thing manually?" She is not persuaded, but she stops assuming, and she asks who would know.` },
          { id: `b`, label: `Just say you're busy`, quality: `partial`,
            consequence: `That's true. She finds someone else to ask by eleven.` },
        ],
      },
      branches: { a: `n4_notice_clean`, b: `n4_notice_clean` },
    },

    n4_notice_clean: {
      prose: [
        `Three weeks later this lands in the marketing team inbox on a Monday. It goes to everyone, including you.`,
        `You did not put anything into that tool. You are fairly sure you know who did.`,
      ],
      artefact: {
        type: `email`,
        caption: `Monday, 8:52am`,
        subject: `Preservation notice — AI tool usage, Q3`,
        fromName: `Legal Operations`,
        fromAddress: `legal.ops@ourcompany.example`,
        to: `Marketing (all)`,
        date: `Mon 8:52`,
        body: [
          `Please keep anything relating to the use of outside AI tools for Northwind Group work during Q3. That covers chat histories, drafts, attachments and browser history.`,
          `Do not delete anything, even if you think it is irrelevant. If you think you might have something, contact us and we will work out whether it counts. You do not need to decide that yourself.`,
        ],
        signature: `Legal Operations`,
      },
      decision: {
        prompt: `The notice doesn't ask you to do anything. Do you?`,
        choices: [
          { id: `a`, label: `Say nothing. It isn't yours to report.`, quality: `partial`,
            consequence: `Fair enough. But it leaves your colleague deciding alone whether to own up.` },
          { id: `b`, label: `Tell your colleague the notice covers what she did`, quality: `good`,
            consequence: `She goes very quiet. Then: "I didn't know it was a thing. Everyone does it." You already know that is true.` },
          { id: `c`, label: `Tell your team lead what you saw`, quality: `partial`,
            consequence: `He thanks you and asks whether you have spoken to her. You have not.` },
        ],
      },
      branches: { a: `n5_speak`, b: `n5_speak`, c: `n5_speak` },
    },

    n5_speak: {
      prose: [
        `By Wednesday the whole team is talking about it, in bits and pieces.`,
        `Nobody knows what is allowed. Two people have been using the same tool since March.`,
      ],
      decision: {
        prompt: `Your team lead asks what would help.`,
        choices: [
          { id: `a`, label: `Ask for a list of tools people are allowed to use`, quality: `good`,
            consequence: `There is one, and has been since March. The email about it went to a mailing list none of you are on.` },
          { id: `b`, label: `Say people just need to be more careful`, quality: `poor`,
            consequence: `Everyone agrees, as they always have. On Friday someone pastes a pricing sheet into a free tool because the deadline moved.` },
          { id: `c`, label: `Ask what people are supposed to do when a deadline won't move`, quality: `good`,
            consequence: `Nobody has an answer, and it's the problem the team keeps running into. He writes it down.` },
        ],
      },
      branches: { a: `n6_end`, b: `n6_end`, c: `n6_end` },
    },

    /* ── The disclosed back half gets the same closing beat ─────────────── */

    n5_after: {
      prose: [
        `It's handled: the people who needed to know now know.`,
        `Nothing has changed for next month.`,
      ],
      decision: {
        prompt: `Your team lead asks what would stop this happening again.`,
        choices: [
          { id: `a`, label: `Ask for a list of tools people are allowed to use`, quality: `good`,
            consequence: `There is one, and has been since March. The email about it went to a mailing list you're not on.` },
          { id: `b`, label: `Say you'll be more careful`, quality: `poor`,
            consequence: `You will be. But two other people have been doing the same thing since March.` },
        ],
      },
      branches: { a: `outcome_disclosed`, b: `outcome_found` },
    },


    n3_after_send: {
      prose: [
        `The meeting is on Thursday and it goes well. Northwind's account manager says the one-pager was the clearest thing they have had from you all year.`,
        `Nobody asks how it was written. There is no reason anyone would.`,
      ],
      decision: {
        prompt: `You have all of Friday to say something. Do you?`,
        choices: [
          { id: `a`, label: `Mention it to your team lead`, quality: `good`,
            consequence: `Four minutes on a Friday afternoon. It's much easier now than it would be in three weeks. He asks what tool and writes it down.` },
          { id: `b`, label: `Nothing happened. Let it go.`, quality: `poor`,
            consequence: `Nothing has happened yet. You don't get to choose when that changes.` },
        ],
      },
      branches: { a: `n3_hold`, b: `n3_hold` },
    },

    n6_end: {
      prose: [
        `A fortnight later there is a short item in the team meeting about approved tools, and a link nobody clicks.`,
        `Your colleague is still on a deadline every Wednesday.`,
      ],
      decision: {
        prompt: `The link goes to the approved-tools list. What do you do with it?`,
        choices: [
          { id: `a`, label: `Send it to the two people you know are using something else`, quality: `good`,
            consequence: `One of them replies within the hour asking whether it does summarising. It does.` },
          { id: `b`, label: `Bookmark it and get on with your day`, quality: `partial`,
            consequence: `You're covered. Your colleague still has a deadline every Wednesday.` },
        ],
      },
      branches: { a: `outcome_route`, b: `outcome_quiet` },
    },

    n4_silence: {
      prose: [
        `Nobody finds out for nine days.`,
      ],
      artefact: {
        type: `system_output`,
        caption: `What the security analyst is looking at`,
        system: `NetGuard DLP · Retrospective review`,
        status: `Match`,
        headline: `Outbound text volume to unapproved domain — 1 device, 1 session`,
        fields: [
          { label: `Device`, value: `CORP-LAP-0482` },
          { label: `Assigned`, value: `J. Mirza, Marketing` },
          { label: `Destination`, value: `brightline.ai` },
          { label: `Volume`, value: `847 KB` },
          { label: `Session`, value: `Wed 16:04 AEST` },
        ],
        rationale: `Not blocked at the time. Personal browser profile, outside the managed session, so no inline policy applied.`,
        trail: [
          `Flagged during Q3 retrospective review requested by Legal Operations.`,
          `Device assignment resolved from asset register.`,
          `Escalated to Information Security lead.`,
        ],
      },
      decision: {
        prompt: `Your manager asks you to come to a meeting room. What do you say when you get there?`,
        choices: [
          { id: `a`, label: `All of it, straight away`, quality: `partial`,
            consequence: `It's the right answer, nine days late. He doesn't need to say so.` },
          { id: `b`, label: `That you don't remember the details`, quality: `poor`,
            consequence: `The session timestamp is on the screen behind him. So is the volume.` },
        ],
      },
      branches: { a: `n5_after`, b: `n5_after` },
    },

    n4_disclose: {
      prose: [
        `By Wednesday the facts are clear: one file, one session, one date, and a tool nobody had checked.`,
      ],
      decision: {
        prompt: `Legal ask whether anything else went the same way.`,
        choices: [
          { id: `a`, label: `Check properly before you answer`, quality: `good`,
            consequence: `You find two more, both small, both yours. Adding them feels bad for ten minutes and helps from then on.` },
          { id: `b`, label: `Say it was only the one`, quality: `poor`,
            consequence: `You're fairly sure. But fairly sure isn't checked, and Legal will ask again.` },
        ],
      },
      branches: { a: `n5_after`, b: `n5_after` },
    },
  },

  outcomes: {
    outcome_route: {
      heading: `You ended up on the tool that was already paid for`,
      tone: `good`,
      score: 100,
      reaction: `The pull here was a nine o'clock meeting and a colleague who sounded like she knew.`,
      description: [
        `You asked before you pasted. The company had bought an approved tool in March and emailed a mailing list you weren't on.`,
        `You lost one evening writing the one-pager by hand. Nothing about Northwind left the building.`,
      ],
      judgement: `What worked was asking a question that felt slightly stupid, in an organisation where the answer had sat unread since March.`,
    },

    outcome_quiet: {
      heading: `You were careful. The team wasn't.`,
      tone: `warn`,
      score: 55,
      reaction: `"Not my call" is fair. You've been there eighteen months and you can't approve a tool.`,
      description: [
        `You wrote the one-pager by hand and nothing of yours left the building.`,
        `Across the desk, your colleague kept pasting. The preservation notice three weeks later didn't name you. It didn't need to.`,
      ],
      judgement: `One careful person doesn't protect a whole team. You could have asked whether the team should have a rule, and that would have helped everyone, not just you.`,
    },

    outcome_disclosed: {
      heading: `Contained, because you counted properly`,
      tone: `good`,
      score: 85,
      reaction: `Telling your manager was a hard four minutes. It was still the easiest it was ever going to be.`,
      description: [
        `You said so on the Monday the notice landed. When Legal asked whether anything else had gone the same way, you checked instead of answering from memory.`,
        `Two more turned up. Both small. Both on the list.`,
      ],
      judgement: `Owning up is easiest early, and the full count mattered more than the first admission. A problem that grows after you've described it costs far more, and the person who under-reported gets asked why.`,
    },

    outcome_found: {
      heading: `The logs got there before you did`,
      tone: `bad`,
      score: 20,
      reaction: `"Nobody knows it was me" was true for nine days, and nine days is long enough to feel like an answer.`,
      description: [
        `A review prompted by the preservation notice traced the upload to your laptop, and your laptop to you. Nobody suspected you. Somebody just looked at everything.`,
        `By the time you were in the room, the timestamp and the volume were already on the screen.`,
      ],
      judgement: `The chance to speak up closed while you were deciding. The facts didn't change between Monday and the meeting. Who found them did, and that turns a mistake into a cover-up.`,
    },
  },

  debrief: {
    frame: [
      `None of this looked like a security decision. It looked like a deadline, a colleague who sounded certain, and a tool that wrote better than you could at four in the afternoon.`,
      `Most cases of staff using unapproved AI look like this. The tool is good, the person is competent and busy, and the policy is four years old and filed where nobody looks. The gap is between what an organisation has decided and what it has told anyone.`,
    ],
  },

  recall: {
    id: `f2-recall`,
    prompt: `Different week. A supplier sends a spreadsheet of their staff contact details so you can plan a joint event, and you want an AI tool to tidy the formatting. Which question decides it?`,
    options: [
      { id: `a`, quality: `partial`, label: `Whether the spreadsheet is confidential`,
        note: `A habit more than a rule. Plenty of what leaks isn't marked confidential, and these contact details are still someone else's personal information.` },
      { id: `b`, quality: `good`, label: `Whether that tool has been assessed and approved for this kind of information`,
        note: `Yes. Same question as the one-pager, and you don't have to classify anything yourself. Someone else can answer it, which makes it usable at four in the afternoon.` },
      { id: `c`, quality: `poor`, label: `Whether you can delete the conversation afterwards`,
        note: `Deleting removes it from your history and nowhere else. That was the free-plan trap in the scenario, and it works the same way here.` },
    ],
  },

  act: [
    { id: `a1`, label: `Find out this week whether your organisation has an approved AI tool, and who holds the list` },
    { id: `a2`, label: `Check which plan you are on in any AI tool you already use for work` },
    { id: `a3`, label: `Ask your team lead whether the team is supposed to have a rule about this` },
  ],

  controls_summary: [
    { id: `c1`, label: `An approved-tools list people can find`, effort: `Low`, owner: `Information Security`, go_live: true,
      context: `The list existed, but the email about it went to a mailing list Jamie wasn't on. For Jamie, it might as well not have existed.` },
    { id: `c2`, label: `A company plan for approved AI tools`, effort: `Medium`, owner: `IT / Procurement`, go_live: true,
      context: `The free plan retains conversations for model improvement. The business tier does not. That difference is a contract, not a setting.` },
    { id: `c3`, label: `A no-blame way to report mistakes, with a promised response time`, effort: `Low`, owner: `Risk / Legal`, go_live: true,
      context: `Every good ending here runs through someone telling somebody early. Every bad one runs through the nine days they spent deciding.` },
  ],

  tell: `Before you paste anything into an AI tool at work, ask whether that tool has been approved for this kind of information, and ask someone who would know.`,
};
