// home-algorithm-said-no.js — The Algorithm Said No
// At Home. Four-beat schema (FREE_PRODUCT §4). Built from the everyday-p3
// employment-screening scenario, July 2026.
// Perspective: a job applicant rejected by an automated screening tool before
// a human saw the application — the receiving end of algorithmic bias, and a
// deliberate counterpart to E1 (the employee who spots it).
//
// At Home: no standing, player brings their own. Depth band 4-5. AU-framed
// (right to request reasons in most Australian states).
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
  // scene: unset until the At Home 'rejection-email' watercolour is generated.
  determinacy: `open`,

  kb_url: `https://library.airiskpractice.org/docs/domain-e-societal/e1-bias`,
  regulatory_tags: [`eu-ai-act-annex-iii`, `jurisdiction-au`],
  mit_subdomain: `mit-1.1`,

  coldOpen: [
    `You applied for a project coordinator role you meet every listed requirement for. Three days later: "After careful consideration, we are unable to progress your application." No reason, no human name on the email.`,
    `A colleague with similar experience who applied the same day has been invited to interview. You ask around: the company uses an AI screening tool.`,
    `In most Australian states, you have the right to ask why you were rejected.`,
  ],

  authority: `You can ask for reasons, request a human review, and decide how you use what you learn. You can't compel the company to change its tool.`,
  ending: `You find out whether an automated 'no' is the end of it — and whether what you learn helps only you or the people applying after you.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `The email gives you nothing to go on. No criterion, no score, no person to reply to. Just a decision that arrived before anyone read your name.`,
        `Your colleague, similar experience, same day, is preparing for an interview.`,
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
          { id: `a`, label: `Accept it and move on — this is just how hiring works now`, quality: `poor`,
            consequence: `Under equal-opportunity law in most Australian states you can request the reasons for a hiring decision. Accepting without asking leaves a possibly flawed automated decision standing, unchallenged.` },
          { id: `b`, label: `Email HR and ask what the screening tool filtered on and why you didn't meet it`, quality: `good`,
            consequence: `A direct, professional request. Organisations using AI in hiring have transparency and fairness obligations, and asking for an explanation is squarely within your rights.` },
        ],
      },
      branches: { a: `n2_accepted`, b: `n2_asked` },
    },

    n2_accepted: {
      prose: [
        `You let it go. Two weeks later a friend who works in HR — and uses AI screening tools — asks your view over coffee.`,
        `"We use it to save time. Do you reckon that's fair?"`,
      ],
      decision: {
        prompt: `What do you tell them?`,
        choices: [
          { id: `a`, label: `Share what happened to you, and that candidates have the right to ask why they were rejected`, quality: `good`,
            consequence: `This is exactly the feedback that shapes HR practice. Screening tools make systematic errors that go uncorrected when nobody challenges them, and your friend can build a fairer process knowing that.` },
          { id: `b`, label: `Say AI screening's fine — hiring teams are busy and it saves time`, quality: `poor`,
            consequence: `It is faster, and it's also frequently biased in ways that fall hardest on women, people from non-English-speaking backgrounds, and career changers. "Saves time" and "is fair" are different questions.` },
        ],
      },
      branches: { a: `n_friend_asks`, b: `n_friend_asks` },
    },

    n_friend_asks: {
      prose: [
        `Your friend leans in — this clearly landed. "So what would you actually want us to do differently? We're not trying to be unfair, we just don't have time to read three hundred applications by hand."`,
        `It's a real constraint, and it's the exact place where the tool's convenience and its fairness pull apart.`,
      ],
      decision: {
        prompt: `What do you tell them the fix looks like?`,
        choices: [
          { id: `a`, label: `Put every screening criterion in the ad, and have a human glance at the borderline rejections`, quality: `good`,
            consequence: `It keeps the time-saving and closes the trap. Disclosed criteria let people self-select honestly, and a human on the margins catches the four-versus-five-years cases the tool gets wrong.` },
          { id: `b`, label: `Just tell them to trust the tool less in general`, quality: `partial`,
            consequence: `Distrust without a concrete change leaves them exactly where they started — busy, using the tool, with no better process to switch to.` },
        ],
      },
      branches: { a: `n_pass_it_on`, b: `n_pass_it_on` },
    },

    n2_asked: {
      prose: [
        `HR replies, and the answer is oddly specific: the tool filtered on "5+ years in financial services."`,
        `You have four years. And that threshold was nowhere in the job ad.`,
      ],
      artefact: {
        type: `email`,
        subject: `RE: Your application — Project Coordinator`,
        fromName: `HR`,
        fromAddress: `hr@company.example`,
        to: `you`,
        date: `today`,
        body: [
          `Thanks for your note. Our screening tool ranks applications against role criteria.`,
          `For this role it filtered for 5+ years in financial services. Your application recorded 4 years, so it was not shortlisted.`,
        ],
        signature: `— HR`,
      },
      decision: {
        prompt: `A criterion that wasn't disclosed screened you out. What do you do?`,
        choices: [
          { id: `a`, label: `Point out the discrepancy and ask for a human to review your application`, quality: `good`,
            consequence: `Entirely reasonable. The criterion wasn't in the ad, which is a real fair-process question, and a human review may find you meet the actual requirements.` },
          { id: `b`, label: `Thank them for explaining and leave it there`, quality: `poor`,
            consequence: `You've found a genuine problem — an undisclosed screening criterion. Dropping it means the same tool screens the next candidate on a bar they were never shown either.` },
        ],
      },
      branches: { a: `n3_escalated`, b: `n3_dropped` },
    },

    n3_escalated: {
      prose: [
        `HR escalates it. Two days later the hiring manager calls — and it turns out they didn't know the tool was filtering on a criterion that never made the ad.`,
        `They apologise, and offer you an interview.`,
      ],
      decision: {
        prompt: `What do you do with the offer?`,
        choices: [
          { id: `a`, label: `Accept, and suggest they review the screening criteria for future applicants`, quality: `good`,
            consequence: `Accepting is the easy part. The suggestion takes ten seconds and could fix the process for everyone who applies after you — including people who wouldn't have known to push back.` },
          { id: `b`, label: `Accept and leave it there — you got what you wanted`, quality: `partial`,
            consequence: `The interview is a real win. The same undisclosed threshold will still screen out the next qualified person who doesn't push, and a brief mention costs your application nothing.` },
        ],
      },
      branches: { a: `n_close_systemic`, b: `n_close_personal` },
    },

    n3_dropped: {
      prose: [
        `You thank them and let it go. You move on to other applications.`,
        `A month later the same role is re-advertised — same ad, still no five-year threshold listed. The same tool is still running, and the next applicant won't know to ask.`,
      ],
      decision: {
        prompt: `Do you apply again?`,
        choices: [
          { id: `a`, label: `Apply, and ask upfront whether the screening criteria match the job ad`, quality: `good`,
            consequence: `Reasonable and useful. Asking upfront is practical for you and signals to HR that candidates know they can expect transparency.` },
          { id: `b`, label: `Don't bother — if they use that tool, any application is pointless`, quality: `poor`,
            consequence: `The tool may have been updated, or the manager may never have known what it was doing. Refusing to apply is a fair choice, and it also lets the flawed process run unchallenged, which is the opposite of what nearly worked for you.` },
        ],
      },
      branches: { a: `n_pass_it_on`, b: `outcome_walked` },
    },

    n_pass_it_on: {
      prose: [
        `Whatever you did about your own application, you're now the person in the room who knows this happens — and knows there's a right to ask.`,
        `The chance to make that count comes up more than once: the friend in HR, someone job-hunting, a comment thread full of people who got the same blank rejection.`,
      ],
      decision: {
        prompt: `What do you do with what you learned?`,
        choices: [
          { id: `a`, label: `Tell people the specific, usable thing: you can ask why, and undisclosed criteria are challengeable`, quality: `good`,
            consequence: `The portable lesson beats the war story. "You have the right to ask, and an undisclosed criterion is a fair question" is something the next person can actually use.` },
          { id: `b`, label: `Keep it vague — "AI hiring is dodgy" — and leave it there`, quality: `partial`,
            consequence: `True as far as it goes, and it doesn't hand anyone a next step. "It's dodgy" makes people wary; "you can ask why" makes them able to do something.` },
        ],
      },
      branches: { a: `outcome_spoke_up`, b: `outcome_silent` },
    },

    n_close_systemic: {
      prose: [
        `You take the interview and, before you hang up, mention that the criteria mismatch is probably worth a look for the whole pipeline.`,
        `The manager's quiet for a second — they hadn't thought about how many others it had quietly filtered.`,
      ],
      decision: {
        prompt: `They ask what you'd actually want to see change. What do you say?`,
        choices: [
          { id: `a`, label: `Every screening criterion should appear in the job ad, and a human should see borderline rejections`, quality: `good`,
            consequence: `Concrete and fair to both sides. Disclosed criteria let people self-select honestly, and a human check on the margins catches the four-versus-five-years cases the tool gets wrong.` },
          { id: `b`, label: `Just that they should "be careful with the tool"`, quality: `partial`,
            consequence: `Care is what was already assumed. The specific fix — disclose the criteria, review the borderline nos — is the thing that actually changes the next applicant's odds.` },
        ],
      },
      branches: { a: `outcome_systemic`, b: `outcome_personal` },
    },

    n_close_personal: {
      prose: [
        `You take the interview and leave the wider issue alone. Fair enough — you came for a job, not a crusade.`,
        `Still, the thought sits there: the tool that nearly cost you this is untouched, and the next person won't get a phone call.`,
      ],
      decision: {
        prompt: `A week later a friend job-hunting mentions a blank automated rejection of their own. What do you do?`,
        choices: [
          { id: `a`, label: `Tell them exactly what you did — ask for reasons, challenge undisclosed criteria`, quality: `good`,
            consequence: `You can't fix the company's tool, and you can hand the next person the move that worked. That's the part of this that travels.` },
          { id: `b`, label: `Commiserate and leave it — automated rejections are just how it is now`, quality: `partial`,
            consequence: `Sympathy is something, and it withholds the useful part. You know the right to ask exists and that undisclosed criteria are challengeable; your friend doesn't yet.` },
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
      reaction: `Asking why, on an automated rejection with no human name attached, takes a bit of nerve. Turning your own interview into a fix for everyone after you is the rare, generous version.`,
      description: [
        `HR acknowledged the undisclosed threshold, your application went to a human, and you got the interview. Because you raised the systemic issue, the company is now checking whether all screening criteria appear in their ads.`,
        `The next applicant with four years and the right skills gets a fairer read than you did.`,
      ],
      judgement: `Asking for transparency about an automated decision is professional, not confrontational, and it's a right you had the whole time. The thing that made this the best outcome wasn't getting your own interview back — it was the ten seconds naming the process problem, which fixes it for the people who'd never have known to push.`,
    },

    outcome_personal: {
      heading: `Got your interview; the process rolls on`,
      tone: `warn`,
      score: 60,
      reaction: `Getting the decision reversed is a genuine win, and it's completely fair to stop there. "Be careful with the tool" is just softer than the fix that was right in front of you.`,
      description: [
        `You challenged it, got a human review, and got the interview. When the manager asked what should change, the answer stayed vague.`,
        `So the specific fault — undisclosed criteria, no human check on the margins — is still in place, and the next four-years-not-five applicant meets the same silent bar you did.`,
      ],
      judgement: `You did the hard part: you pushed back and it worked. The gap between this and the best ending is one concrete sentence — disclose the criteria, review the borderline rejections — versus a general "be careful". The tool doesn't respond to care; it responds to its settings, and only the specific fix changes them.`,
    },

    outcome_spoke_up: {
      heading: `Made your experience count for someone else`,
      tone: `good`,
      score: 85,
      reaction: `Handing the next person the exact move — you can ask why — is worth more than any amount of sympathy about how broken hiring is.`,
      description: [
        `Whatever happened with your own application, you passed on the usable part: candidates can request reasons, and an undisclosed criterion is a fair thing to challenge.`,
        `Someone reviewed their screening tool, or someone job-hunting asked a question they wouldn't have asked, because you said the specific thing rather than the vague one.`,
      ],
      judgement: `Systematic screening errors go uncorrected precisely because most people accept the blank 'no' and move on. The highest-value thing available here isn't winning your own case — it's making the right-to-ask common knowledge, one specific conversation at a time, so the error stops being invisible.`,
    },

    outcome_silent: {
      heading: `Learned it, kept it`,
      tone: `warn`,
      score: 40,
      reaction: `"AI hiring is dodgy" feels like you've said something. It leaves the listener wary but no more able to do anything than before.`,
      description: [
        `You came away knowing more than you did — that the right to ask exists, that undisclosed criteria are challengeable — and you kept the useful part to yourself, or blurred it into a general grumble.`,
        `The next person you might have helped meets the same blank rejection with the same blank options.`,
      ],
      judgement: `The gap here is between a warning and a tool. "AI hiring is unfair" makes people cautious; "you can ask why you were rejected, and an undisclosed criterion is a fair challenge" makes them able to act. You had the second one and passed on the first, which is the version that changes nothing for anyone.`,
    },

    outcome_walked: {
      heading: `Wrote it off, and it kept running`,
      tone: `bad`,
      score: 15,
      reaction: `Deciding any application is pointless feels like clear-eyed realism after a bad rejection. It's the one response that guarantees nothing changes.`,
      description: [
        `You didn't apply again, on the assumption the tool made it hopeless. But the tool might have been updated, and the hiring manager might never have known what it was doing — you'd found earlier that they often don't.`,
        `Three more qualified candidates were screened out on the same undisclosed threshold before the role was filled by someone who happened to clear an arbitrary number nobody was shown.`,
      ],
      judgement: `An automated 'no' isn't final, and treating it as final is its own decision. Refusing to engage is understandable after being burned, and it also lets a flawed, invisible process run exactly as it is. The move that worked — ask why, challenge the undisclosed criterion — was still available; walking away is the one path that leaves the tool doing the same thing to everyone behind you.`,
    },
  },

  debrief: {
    frame: [
      `The rejection told you nothing on purpose: no criterion, no score, no name. That opacity is the real problem, more than any single wrong decision. When a tool filters you out on a bar you were never shown, you can't tell whether it's a reasonable requirement, an arbitrary threshold, or something that quietly tracks age, background, or a career break — and neither, often, can the hiring manager, who may not know what the tool is doing either.`,
      `Which is why the useful response here isn't outrage and isn't resignation — it's the specific, boring, effective move: ask why. In most Australian states you can request the reasons for a hiring decision, and an undisclosed screening criterion is a fair thing to challenge. That single question does two things at once: it can get your own application a human read, and it drags an invisible process into the light where it can be fixed. The scenario's best endings all run through someone asking the question and then passing on that you can — because a systematic error stays systematic exactly as long as everyone accepts the blank 'no' and moves on.`,
    ],
  },

  recall: {
    id: `home-algorithm-said-no-recall`,
    prompt: `A friend is rejected within an hour of applying, with no reason given, for a role they're well qualified for. What's the most useful thing to tell them?`,
    options: [
      { id: `a`, quality: `poor`, label: `Not much they can do — automated hiring is a black box, so move on to the next one`,
        note: `This is the resignation the scenario warns against. A near-instant rejection with no reason is the exact case where asking for the reasons is worth it — in most Australian states it's a right, and an undisclosed criterion is challengeable. "Move on" is how the black box stays a black box.` },
      { id: `b`, quality: `good`, label: `They can request the reasons for the decision, and an undisclosed criterion is a fair challenge`,
        note: `Right. The portable, usable lesson: you can ask why, and if the answer reveals a criterion that wasn't in the ad, that's a legitimate fair-process question that can get a human review — for them, and for the applicants after them.` },
      { id: `c`, quality: `partial`, label: `Tell them AI hiring tools are often biased so they shouldn't take it personally`, note: `Reassuring, and it stops one step short of useful. "Don't take it personally" eases the sting; "you can ask why, and challenge an undisclosed criterion" gives them something to actually do about it.` },
    ],
  },

  act: [
    { id: `a1`, label: `If an automated rejection ever gives you no reason, ask for one — it's often your right` },
    { id: `a2`, label: `Tell one person job-hunting that they can request the reasons for a hiring decision` },
    { id: `a3`, label: `If you're ever on the hiring side, check that every screening criterion is actually in the ad` },
  ],

  controls_summary: [
    { id: `c1`, label: `Ask for the reasons behind an automated rejection`, effort: `Low`, owner: `You`, go_live: true,
      context: `The whole scenario turns on the opaque 'no'. The right to request reasons is the single lever that opens it.` },
    { id: `c2`, label: `Challenge any criterion that wasn't in the job ad`, effort: `Low`, owner: `You`, go_live: true,
      context: `An undisclosed threshold is a fair-process problem the applicant can name — and often the fastest route to a human review.` },
    { id: `c3`, label: `Pass on the right to ask, specifically`, effort: `Low`, owner: `You`, go_live: true,
      context: `Systematic screening errors persist because people accept the blank rejection. Making the right-to-ask common knowledge is what corrects them.` },
  ],

  tell: `An automated rejection isn't the final word — in most of Australia you can ask why, and an undisclosed criterion is a fair challenge.`,
};
