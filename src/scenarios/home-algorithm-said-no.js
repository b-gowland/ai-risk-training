// home-algorithm-said-no.js — The Algorithm Said No
// At Home. Four-beat schema (FREE_PRODUCT §4). Built from the everyday-p3
// employment-screening scenario, July 2026.
// Perspective: a job applicant rejected by an automated screening tool before
// a human saw the application — the receiving end of algorithmic bias, and a
// deliberate counterpart to E1 (the employee who spots it).
//
// At Home: no standing, player brings their own. Depth band 4-5.
//
// CLAIMS DISCIPLINE. An earlier version asserted a general right to be given
// reasons for a private-sector rejection in most Australian states. No source
// supports that. What is supportable: you can always ask; employers routinely
// answer; a screening criterion absent from the ad is a fair thing to put to
// them; and if you suspect the filter tracked a protected attribute, the
// anti-discrimination commissions take complaints. The scenario now says only
// those things, and the tell — which is the share object — claims no right.
// Discrimination note: the scenario does not assume the rejection is bias for
// certain — it turns on an undisclosed criterion the applicant genuinely
// didn't meet by one year, which is a fair-process problem whether or not it
// is unlawful. And "any application to a firm using that tool is pointless" is
// marked as the wrong lesson.

export const scenario = {
  id: `home-algorithm-said-no`,
  door: `home`,
  risk_ref: `E1`,
  title: `The Algorithm Said No`,
  shelfLine: `An automated system rejected you before a human saw your application. You're qualified.`,
  hook: `You met every requirement. An automated system rejected you before a human saw your name.`,
  scene: `rejection-email`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-e-fairness/e1-algorithmic-bias`,
  regulatory_tags: [`eu-ai-act-annex-iii`, `jurisdiction-au`],
  mit_subdomain: `mit-1.1`,

  coldOpen: [
    `You applied for a project coordinator job and met every listed requirement. Three days later an email arrives: "After careful consideration, we are unable to progress your application." There's no reason and no person's name.`,
    `A colleague with similar experience who applied the same day has been invited to interview. You ask around: the company uses an AI screening tool.`,
    `They don't have to explain. But nothing stops you asking.`,
  ],

  authority: `You can ask for reasons, request a human review, and decide how you use what you learn. You can't make the company change its tool.`,
  ending: `You find out whether an automated 'no' is the end of it, and whether what you learn helps only you or the people applying after you.`,

  begin: `Read it again`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The email gives you nothing to go on: no reason, no score, no person to reply to. It looks like a computer decided before anyone read your name.`,
        `Your colleague, who applied the same day with similar experience, is preparing for an interview.`,
      ],
      artefact: {
        type: `email`,
        subject: `Your application — Project Coordinator`,
        fromName: `Recruitment`,
        fromAddress: `no-reply@company.example`,
        to: `you`,
        date: `3 days ago`,
        body: [
          `Thank you for your interest in the Project Coordinator role.`,
          `After careful consideration, we are unable to progress your application at this time.`,
          `We wish you the best in your search.`,
        ],
        signature: `— Recruitment Team`,
      },
      decision: {
        prompt: `What do you do?`,
        choices: [
          { id: `a`, label: `Accept it and move on. This is just how hiring works now`, quality: `poor`,
            consequence: `You close the email. It is the fourth one this month with the same three sentences. It has never occurred to you that you could ask.` },
          { id: `b`, label: `Email HR and ask what the screening tool filtered on and why you didn't meet it`, quality: `good`,
            consequence: `Six polite lines, no accusations. You reread it twice before sending. It feels like a bigger ask than it is.` },
        ],
      },
      branches: { a: `n2_accepted`, b: `n2_asked` },
    },

    n2_accepted: {
      prose: [
        `You let it go. Two weeks later a friend who works in HR, and uses AI screening tools, asks your view over coffee.`,
        `"We use it to save time. Do you reckon that's fair?"`,
      ],
      decision: {
        prompt: `What do you tell them?`,
        choices: [
          { id: `a`, label: `Tell them what happened to you, and that almost nobody thinks to ask why`, quality: `good`,
            consequence: `They put their coffee down. "Nobody has ever asked us. Not once." They look unsettled by that.` },
          { id: `b`, label: `Say AI screening's fine. Hiring teams are busy and it saves time`, quality: `poor`,
            consequence: `They look relieved. "Good. Three hundred applications a role, we'd never cope otherwise." The conversation moves on to something else.` },
        ],
      },
      branches: { a: `n_friend_asks`, b: `n_friend_asks` },
    },

    n_friend_asks: {
      prose: [
        `Your friend leans in. This clearly landed. "So what would you want us to do differently? We're not trying to be unfair, we just don't have time to read three hundred applications by hand."`,
        `It's a real problem. It's also where saving time and being fair pull in different directions.`,
      ],
      decision: {
        prompt: `What do you tell them the fix looks like?`,
        choices: [
          { id: `a`, label: `Put every screening requirement in the ad, and have a human glance at the borderline rejections`, quality: `good`,
            consequence: `They get their phone out and type it into a note. "Every requirement in the ad, human eyes on the near-misses." Then: "That's not much work."` },
          { id: `b`, label: `Just tell them to trust the tool less in general`, quality: `partial`,
            consequence: `They agree that it's worrying. On Monday they have three hundred applications and the same tool.` },
        ],
      },
      branches: { a: `n_pass_it_on`, b: `n_pass_it_on` },
    },

    n2_asked: {
      prose: [
        `HR replies with a surprisingly specific answer: the tool filtered on "5+ years in financial services."`,
        `You have four years, and the job ad never mentioned this.`,
      ],
      artefact: {
        type: `email`,
        subject: `RE: Your application — Project Coordinator`,
        fromName: `HR`,
        fromAddress: `hr@company.example`,
        to: `you`,
        date: `today`,
        body: [
          `Thanks for your note. Our screening tool ranks applications against role requirements.`,
          `For this role it filtered for 5+ years in financial services. Your application recorded 4 years, so it was not shortlisted.`,
        ],
        signature: `— HR`,
      },
      decision: {
        prompt: `A rule that wasn't in the ad screened you out. What do you do?`,
        choices: [
          { id: `a`, label: `Point out it wasn't in the ad, and ask for a person to review your application`, quality: `good`,
            consequence: `You quote the ad back at them, the whole requirements section, and ask where the five years appears. It isn't there.` },
          { id: `b`, label: `Thank them for explaining and leave it there`, quality: `poor`,
            consequence: `You thank them for being so clear about it, which they were. Nothing else happens.` },
        ],
      },
      branches: { a: `n3_escalated`, b: `n3_dropped` },
    },

    n3_escalated: {
      prose: [
        `HR passes it up the line. Two days later the hiring manager calls. They didn't know the tool was filtering on something that wasn't in the ad.`,
        `They apologise, and offer you an interview.`,
      ],
      decision: {
        prompt: `What do you do with the offer?`,
        choices: [
          { id: `a`, label: `Accept, and suggest they review the screening requirements for future applicants`, quality: `good`,
            consequence: `You say it in one sentence at the end of the call, half expecting it to land badly. There is a pause and then: "No, you're right. I'll look at the others."` },
          { id: `b`, label: `Accept and leave it there. You got what you wanted`, quality: `partial`,
            consequence: `You take the slot and say thank you twice. The ad is still live and still says nothing about five years.` },
        ],
      },
      branches: { a: `n_close_systemic`, b: `n_close_personal` },
    },

    n3_dropped: {
      prose: [
        `You thank them and let it go. You move on to other applications.`,
        `A month later the same role is re-advertised: same ad, still no five-year threshold listed. The same tool is still running, and the next applicant won't know to ask.`,
      ],
      decision: {
        prompt: `Do you apply again?`,
        choices: [
          { id: `a`, label: `Apply, and ask upfront whether the screening requirements match the job ad`, quality: `good`,
            consequence: `You put one line at the end of the cover note asking whether the ad lists everything the screening looks for. Somebody has to read that.` },
          { id: `b`, label: `Don't bother. If they use that tool, any application is pointless`, quality: `poor`,
            consequence: `You close the tab. The role stays open for another five weeks.` },
        ],
      },
      branches: { a: `n_pass_it_on`, b: `outcome_walked` },
    },

    n_pass_it_on: {
      prose: [
        `Whatever you did about your own application, you now know two things most people don't: this happens, and you're allowed to ask why.`,
        `You get chances to pass that on: the friend in HR, someone job-hunting, a comment thread full of people who got the same blank rejection.`,
      ],
      decision: {
        prompt: `What do you do with what you learned?`,
        choices: [
          { id: `a`, label: `Tell people the useful part: ask why, and point out any rule that wasn't in the ad`, quality: `good`,
            consequence: `You say it in about fifteen words. Two people ask you to repeat it so they can remember it.` },
          { id: `b`, label: `Keep it vague ("AI hiring is dodgy") and leave it there`, quality: `partial`,
            consequence: `Everyone in the thread agrees with you. Nobody does anything differently on Monday.` },
        ],
      },
      branches: { a: `outcome_spoke_up`, b: `outcome_silent` },
    },

    n_close_systemic: {
      prose: [
        `You take the interview and, before you hang up, mention that they should check whether the tool screened out anyone else the same way.`,
        `The manager's quiet for a second. They hadn't thought about how many other people it had screened out.`,
      ],
      decision: {
        prompt: `They ask what you'd want to see change. What do you say?`,
        choices: [
          { id: `a`, label: `Every screening requirement should appear in the job ad, and a human should see borderline rejections`, quality: `good`,
            consequence: `Two sentences, and they write both down. They worry the second one, a person checking the near-misses, will take too long. Then they agree to it.` },
          { id: `b`, label: `Just that they should "be careful with the tool"`, quality: `partial`,
            consequence: `They nod and thank you for the feedback. Nothing about the tool changes.` },
        ],
      },
      branches: { a: `outcome_systemic`, b: `outcome_personal` },
    },

    n_close_personal: {
      prose: [
        `You take the interview and leave the wider issue alone. Fair enough. You came for a job, not a crusade.`,
        `Still, the tool that nearly cost you this hasn't changed, and the next person won't get a phone call.`,
      ],
      decision: {
        prompt: `A week later a friend job-hunting mentions a blank automated rejection of their own. What do you do?`,
        choices: [
          { id: `a`, label: `Tell them what you did: ask for reasons, and question any rule that wasn't in the ad`, quality: `good`,
            consequence: `You send them the email you sent, almost word for word. They send something like it that evening.` },
          { id: `b`, label: `Commiserate and leave it. Automated rejections are just how it is now`, quality: `partial`,
            consequence: `They feel better for ten minutes. You know the question that got you an interview, and you didn't share it.` },
        ],
      },
      branches: { a: `outcome_spoke_up`, b: `outcome_silent` },
    },
  },

  outcomes: {
    outcome_systemic: {
      heading: `Challenged it, and fixed it for the next person`,
      tone: `good`,
      score: 100,
      reaction: `Asking why takes nerve when no human signed the rejection. Turning your interview into a fix for everyone after you is rarer.`,
      description: [
        `HR admitted the hidden requirement, a person read your application, and you got the interview.`,
        `Because you raised the wider issue, the company is checking that every screening requirement appears in its ads.`,
      ],
      judgement: `Asking about an automated decision is professional, not confrontational, and you could have done it on day one. The interview wasn't the best part. Naming the process problem was, because it fixes it for people who'd never think to push.`,
    },

    outcome_personal: {
      heading: `Got your interview. The process rolls on.`,
      tone: `warn`,
      score: 60,
      reaction: `Getting the decision reversed is a real win. "Be careful with the tool" was just softer than the fix in front of you.`,
      description: [
        `You challenged it, got a human review and got the interview. When the manager asked what should change, your answer stayed vague.`,
        `So the hidden requirement and the missing human check are still there for the next applicant.`,
      ],
      judgement: `You did the hard part and it worked. The gap to the best ending is one concrete sentence: put every requirement in the ad, and have a person check the near-misses. A tool responds to its settings, not to care.`,
    },

    outcome_spoke_up: {
      heading: `Made your experience count for someone else`,
      tone: `good`,
      score: 85,
      reaction: `Handing the next person the exact move, that they can ask why, is worth more than sympathy about how broken hiring is.`,
      description: [
        `You passed on the usable part: candidates can ask for reasons, and a requirement that wasn't in the ad is fair to question.`,
        `Someone checked their screening tool, or someone job-hunting asked a question they wouldn't have, because you were specific.`,
      ],
      judgement: `Screening errors last because most people accept the blank no and move on. The most useful thing here was never winning your own case. It was making it normal to ask.`,
    },

    outcome_silent: {
      heading: `Learned it, kept it`,
      tone: `warn`,
      score: 40,
      reaction: `"AI hiring is dodgy" feels like saying something. It leaves the listener wary but no better able to act.`,
      description: [
        `You learned that asking often works and that a requirement missing from the ad is fair to raise, then kept it to yourself or blurred it into a grumble.`,
        `The next person meets the same blank rejection with the same blank options.`,
      ],
      judgement: `"AI hiring is unfair" makes people cautious. "You can ask why, and challenge a requirement that wasn't in the ad" lets them act. You had the second and passed on the first.`,
    },

    outcome_walked: {
      heading: `Wrote it off, and it kept running`,
      tone: `bad`,
      score: 15,
      reaction: `Deciding any application is pointless feels like realism after a bad rejection. It's the one response that guarantees nothing changes.`,
      description: [
        `You didn't apply again. The tool might have been fixed, and the hiring manager might not have known what it was doing.`,
        `Three more qualified candidates were screened out on the same hidden threshold before the role was filled.`,
      ],
      judgement: `An automated no isn't final, and treating it as final is a decision too. Walking away is understandable after being burned, and it leaves the tool doing the same thing to everyone behind you.`,
    },
  },

  debrief: {
    frame: [
      `The rejection told you nothing: no reason, no name. When a tool filters you on a bar you never saw, you can't tell if it's fair, arbitrary, or tracking age or a career break.`,
      `Employers don't have to give reasons, but asking is free and often works. From 10 December 2026, employers covered by the Privacy Act must say in their privacy policy which significant decisions they automate. A filter that looks discriminatory goes to an anti-discrimination commission.`,
    ],
  },

  recall: {
    id: `home-algorithm-said-no-recall`,
    prompt: `A friend is rejected within an hour of applying, with no reason given, for a role they're well qualified for. What's the most useful thing to tell them?`,
    options: [
      { id: `a`, quality: `poor`, label: `Not much they can do. Automated hiring is a black box, so move on`,
        note: `This is the resignation the scenario warns against. A rejection within the hour is exactly the case worth asking about. Nobody has to answer, but plenty do.` },
      { id: `b`, quality: `good`, label: `Ask why, and if a requirement turns up that wasn't in the ad, put it back to them`,
        note: `Yes. You can ask why, and a requirement that wasn't in the ad is fair to question. It can get a person to look again, for them and later applicants.` },
      { id: `c`, quality: `partial`, label: `Tell them AI hiring tools are often biased so they shouldn't take it personally`,
        note: `Kind, and one step short of useful. "Don't take it personally" eases the sting. "You can ask why" gives them something to do.` },
    ],
  },

  act: [
    { id: `a1`, label: `Next time an automated rejection gives you no reason, send four lines asking for one` },
    { id: `a2`, label: `Tell one person job-hunting that asking why is allowed, free, and often answered` },
    { id: `a3`, label: `If you're ever on the hiring side, check that every screening requirement is in the ad` },
  ],

  controls_summary: [
    { id: `c1`, label: `Ask for the reasons behind an automated rejection`, effort: `Low`, owner: `You`, go_live: true,
      context: `The whole scenario turns on the opaque no. Asking is the only lever the applicant holds, and it costs four lines.` },
    { id: `c2`, label: `Question any requirement that wasn't in the job ad`, effort: `Low`, owner: `You`, go_live: true,
      context: `A hidden requirement is a fair thing to question, and often the fastest way to get a person to look again.` },
    { id: `c3`, label: `Pass on that asking is allowed`, effort: `Low`, owner: `You`, go_live: true,
      context: `Screening errors persist because people accept the blank rejection. Making it ordinary to ask is what corrects them.` },
  ],

  tell: `An automated rejection isn't the final word. Ask why, and if a requirement turns up that was never in the ad, say so.`,
};
