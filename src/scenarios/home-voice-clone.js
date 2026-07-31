// home-voice-clone.js — Is That Really Mum?
// At Home. Four-beat schema (FREE_PRODUCT §4).
//
// Per §5.4 this is NOT a scenario about listening harder. Human detection of
// cloned voice is poor and getting worse, so every decision turns on the
// surrounding evidence — who is asking, what they want done, which channel it
// came on, and whether it can be checked anywhere else.
//
// DEPTH (§4.1, band 4-5 for At Home). Every path runs start → resolution →
// aftermath → who else, so catching the scam does not end the scenario two
// decisions in. The first version shipped with all four good endings as the
// SHORTEST paths, which handed the careful player the least practice. The
// aftermath spine is where the transferable behaviour actually lives: the
// call was never going to be the last one made to this family.
//
// Voice per CONTENT_STYLE_GUIDE public track: the player is never blamed for
// being deceived, and no ending is written as a telling-off.
//
// NOTE: no `scene` — every image in public/scenes is a workplace.

export const scenario = {
  id: `home-voice-clone`,
  door: `home`,
  risk_ref: `C4`,
  title: `Is That Really Mum?`,
  shelfLine: `Your mum calls in tears, needs money in twenty minutes, and says not to tell your dad.`,
  hook: `It's your mum's number. She's crying, and she needs money in twenty minutes.`,
  doorScene: `door-home`,
  determinacy: `clean`,

  kb_url: `https://library.airiskpractice.org/docs/domain-c-security/c4-deepfakes`,
  regulatory_tags: [`eu-ai-act-article-50`, `jurisdiction-au`],
  mit_subdomain: `mit-4.2`,

  coldOpen: [
    `Saturday afternoon. Your phone rings and it is your mum's number.`,
    `She is crying so hard you can barely follow what she is asking for.`,
    `It is money, and she needs it in twenty minutes.`,
  ],

  // No standing. §4.2 — At Home the player brings their own, and explaining
  // what it is to be someone's child is what makes a screen read as coursework.
  standing: null,
  authority: `You can move money from your phone, make a call, or do nothing for sixty seconds. You cannot see her.`,
  ending: `You find out who was on the call, what would have settled it in half a minute, and who gets the next one.`,

  entry: `start`,

  nodes: {
    start: {
      prose: [
        `You have heard your mum cry maybe four times. This sounds like all four.`,
        `It takes most of the call to work out what has actually happened.`,
      ],
      artefact: {
        type: `transcript`,
        caption: `The call, as it happened`,
        source: `Incoming — Mum (mobile)`,
        duration: `1m 48s`,
        lines: [
          { time: `0:02`, speaker: `Caller`, text: `Oh thank god. Thank god you picked up.` },
          { time: `0:06`, speaker: `You`, text: `Mum? What's happened?` },
          { time: `0:08`, speaker: `Caller`, text: `They've taken my bag. My whole— everything's in it, my cards, and they won't let the car out without— sorry. Sorry.` },
          { time: `0:19`, speaker: `You`, text: `Where are you?` },
          { time: `0:21`, speaker: `Caller`, text: `The long-stay car park. They shut at four. It's eight hundred and I've got nothing, I've got nothing on me.` },
          { time: `0:33`, speaker: `Caller`, text: `Don't tell your father. Please. You know what he's like, he'll get in the car.` },
          { time: `0:41`, speaker: `You`, text: `Okay. Okay, hang on.` },
          { time: `0:44`, speaker: `Caller`, text: `I'll text you the account. Can you do it now? I've got about twenty minutes.` },
        ],
        note: `The number that called is the one saved in your phone as Mum.`,
      },
      decision: {
        prompt: `Twenty minutes. What do you do?`,
        choices: [
          { id: `a`, label: `Send the money. Sort out the rest afterwards.`, quality: `poor`,
            consequence: `It takes under a minute. You tell her it is done and she says thank you about six times.` },
          { id: `b`, label: `Ask her something only your mum would know`, quality: `partial`,
            consequence: `You ask what the dog was called before Bess. There is a pause of maybe two seconds.` },
          { id: `c`, label: `Say you'll call her straight back, and hang up`, quality: `good`,
            consequence: `She protests. You hang up anyway, which feels genuinely awful for about four seconds.` },
          { id: `d`, label: `Stay on the line and message your dad at the same time`, quality: `good`,
            consequence: `You keep her talking about the car park while you type one-handed.` },
        ],
      },
      branches: { a: `n2_sent`, b: `n2_question`, c: `n2_callback`, d: `n2_dad` },
    },

    /* ── D2: the resolution ──────────────────────────────────────── */

    n2_question: {
      prose: [
        `"Sweetheart, I can't— I'm standing in a car park." A breath. "Ruby. It was Ruby, wasn't it? Why are you asking me this?"`,
        `Ruby is right.`,
      ],
      decision: {
        prompt: `She got it. Does that settle it?`,
        choices: [
          { id: `a`, label: `Yes. Send the money.`, quality: `poor`,
            consequence: `Your mum has posted about the dogs for eleven years. So has your aunt. So, once, did you.` },
          { id: `b`, label: `No. Hang up and call her back.`, quality: `good`,
            consequence: `You say you'll ring in two minutes and end the call before she can talk you out of it. She picks up on the fifth ring, at home, with the radio on.` },
          { id: `c`, label: `Ask her to video call instead`, quality: `partial`,
            consequence: `"I haven't got— my phone's about to die, love, please." Which is either true or the easiest thing in the world to say. You ring her own number instead, and she answers from the garden.` },
        ],
      },
      branches: { a: `n3_gone`, b: `n3_who`, c: `n3_who` },
    },

    n2_callback: {
      prose: [
        `You find her in your contacts and press call. Not the number that just rang you. The one that has been in your phone for nine years.`,
      ],
      decision: {
        prompt: `It rings four times.`,
        choices: [
          { id: `a`, label: `Wait it out`, quality: `good`,
            consequence: `On the fifth ring she picks up. There is a radio on behind her. She has not been to an airport since March.` },
          { id: `b`, label: `Hang up and call your dad instead`, quality: `good`,
            consequence: `He answers on the second ring, mid-sentence, talking to someone in the room. That someone is her.` },
        ],
      },
      branches: { a: `n3_who`, b: `n3_who` },
    },

    n2_dad: {
      prose: [
        `Three dots. Then: *shes in the garden. why*`,
      ],
      artefact: {
        type: `message_thread`,
        caption: `Your phone, while the call is still connected`,
        contact: `Dad`,
        contactNote: `You are still on a call with "Mum"`,
        messages: [
          { from: `you`, text: `is mum with you`, meta: `3:41pm` },
          { from: `them`, text: `shes in the garden. why` },
          { from: `you`, text: `can you go and look. now` },
          { from: `them`, text: `shes right here. whats going on` },
        ],
      },
      decision: {
        prompt: `The voice in your ear is still asking about the transfer.`,
        choices: [
          { id: `a`, label: `Hang up`, quality: `good`,
            consequence: `You end the call without saying anything else. Your hands are shaking slightly, which surprises you.` },
          { id: `b`, label: `Tell the caller you know`, quality: `partial`,
            consequence: `The line goes dead before you finish the sentence. There was never going to be a satisfying moment here.` },
        ],
      },
      branches: { a: `n3_who`, b: `n3_who` },
    },

    n2_sent: {
      prose: [
        `Eight minutes later your phone goes again. Same number.`,
      ],
      artefact: {
        type: `message_thread`,
        caption: `Messages from your mum's number`,
        contact: `Mum`,
        contactNote: `Mobile · saved contact`,
        messages: [
          { from: `them`, text: `bless you darling. its gone through` },
          { from: `them`, text: `theyre saying theres a release fee on top. 1200. im so sorry to ask` },
          { from: `you`, text: `1200 more??`, meta: `3:52pm` },
          { from: `them`, text: `i know. i know. please love i just want to come home` },
        ],
      },
      decision: {
        prompt: `Twelve hundred more.`,
        choices: [
          { id: `a`, label: `Send it. You've come this far.`, quality: `poor`,
            consequence: `The second transfer goes at 3:54pm. There is no third message.` },
          { id: `b`, label: `Stop, and ring the number in your contacts`, quality: `good`,
            consequence: `She picks up on the fifth ring. There is a radio on behind her, and she has not been to an airport since March.` },
          { id: `c`, label: `Ring your bank first`, quality: `good`,
            consequence: `You get through in four minutes, which is fast. They put a hold on the second payment before it moves.` },
        ],
      },
      branches: { a: `n3_gone`, b: `n3_bank`, c: `n3_bank` },
    },

    /* ── D3: what you do with what you now know ──────────────────── */

    n3_who: {
      prose: [
        `Nothing has been lost. Someone has your mum's number appearing on your screen and enough of her voice to make you doubt yourself for a minute, and that is still true after you hang up.`,
        `She wants to know why you rang twice.`,
      ],
      decision: {
        prompt: `What do you tell her?`,
        choices: [
          { id: `a`, label: `All of it, plainly`, quality: `good`,
            consequence: `She is quieter about it than you expected. "That was my voice?" She asks you to play it back and you have nothing to play.` },
          { id: `b`, label: `Play it down. She'll only worry.`, quality: `partial`,
            consequence: `You say it was a wrong number and a bad line. She lets it go. She is the one whose voice it was, and she now knows less about that than a stranger does.` },
          { id: `c`, label: `Nothing. Report it and move on.`, quality: `partial`,
            consequence: `Scamwatch takes four minutes. The report is filed against a number, and the number is not the thing that will be used again.` },
        ],
      },
      branches: { a: `n4_after_caught`, b: `n4_after_caught`, c: `n4_after_caught` },
    },

    n3_bank: {
      prose: [
        `The first eight hundred is probably gone. The rest of it is not.`,
        `The bank asks whether you want it reported to Scamwatch as well, and whether anyone else in the family might get the same call.`,
      ],
      decision: {
        prompt: `That second question is not rhetorical.`,
        choices: [
          { id: `a`, label: `Say yes, and start with your mum`, quality: `good`,
            consequence: `She is more shaken by it than you are, because it was her voice. She asks how much of her is out there and neither of you knows.` },
          { id: `b`, label: `Report it. Keep the rest to yourself.`, quality: `partial`,
            consequence: `The report is filed. The person whose voice was used still has no idea it is in circulation.` },
        ],
      },
      branches: { a: `n4_after_late`, b: `n4_after_late` },
    },

    n3_gone: {
      prose: [
        `Nothing comes back. Not that evening, not the next morning.`,
        `You ring your mum on Sunday to ask how the trip home was. She asks what trip.`,
      ],
      decision: {
        prompt: `Two thousand dollars, sent from your phone, yesterday and the day before.`,
        choices: [
          { id: `a`, label: `Call the bank now and report it`, quality: `good`,
            consequence: `Sunday, so it takes longer. They log it, freeze the receiving details on their side, and tell you honestly that recovery is unlikely once it has moved on.` },
          { id: `b`, label: `Wait until Monday when you can think straight`, quality: `poor`,
            consequence: `Monday is sixteen hours later. Money that has already been moved on does not wait for you to feel ready.` },
        ],
      },
      branches: { a: `n4_after_loss`, b: `n4_after_loss` },
    },

    /* ── D4: who gets the next one ───────────────────────────────── */

    n4_after_caught: {
      prose: [
        `Your mum's sister is in the same address book. So are two cousins, and a family friend who has been in your mum's phone since before either of you had mobiles.`,
        `Whoever built that voice did not build it for one call.`,
      ],
      decision: {
        prompt: `Do you do anything about that?`,
        choices: [
          { id: `a`, label: `Tell the family group chat what happened, in plain terms`, quality: `good`,
            consequence: `Four replies in an hour. Two people say they nearly fell for something similar. One of them is your aunt, and she had not told anybody.` },
          { id: `b`, label: `Just tell your aunt, quietly`, quality: `partial`,
            consequence: `She is grateful and slightly embarrassed, which is the reaction that stops most people passing it on any further.` },
          { id: `c`, label: `Nothing. It's your family, not a public service announcement.`, quality: `poor`,
            consequence: `Reasonable, and the number is still in circulation. Six weeks later your cousin sends four hundred dollars to a car park.` },
        ],
      },
      branches: { a: `outcome_protected`, b: `outcome_protected`, c: `outcome_caught_alone` },
    },

    n4_after_late: {
      prose: [
        `Eight hundred is gone and twelve hundred is not, which is a better Saturday than it might have been.`,
        `Your aunt rings on Tuesday. She has had a call from your mum's number.`,
      ],
      decision: {
        prompt: `She is asking you what to do while it is happening.`,
        choices: [
          { id: `a`, label: `Tell her to hang up and ring Mum's number herself`, quality: `good`,
            consequence: `She does it while you are still on the line. Your mum picks up from the kitchen. That is the whole thing, in about thirty seconds.` },
          { id: `b`, label: `Tell her to ask a question only Mum would know`, quality: `poor`,
            consequence: `It answers correctly. She rings you back afterwards, still unsure, and by then she has been on the call for nine minutes.` },
        ],
      },
      branches: { a: `outcome_late`, b: `outcome_late` },
    },

    n4_after_loss: {
      prose: [
        `The bank is clear that the money is unlikely to come back. What is still open is everything that has not happened yet.`,
      ],
      decision: {
        prompt: `Your mum wants to know what she is supposed to do about a voice she cannot take back.`,
        choices: [
          { id: `a`, label: `Agree something between you that a real emergency call would include`, quality: `good`,
            consequence: `You settle on a word, and on a rule: any call about money gets hung up and rung back. It takes about a minute to agree and it does not depend on either of you spotting anything.` },
          { id: `b`, label: `Tell her to be careful about what she posts`, quality: `partial`,
            consequence: `She has eleven years of birthdays and dogs on there, and a voicemail greeting in her own voice. Careful from here does not reach any of it.` },
        ],
      },
      branches: { a: `outcome_loss`, b: `outcome_loss` },
    },
  },

  outcomes: {
    outcome_protected: {
      heading: `You caught it, and then you told people`,
      tone: `good`,
      score: 100,
      reaction: `Hanging up on someone who sounds like your mother in distress is genuinely hard. Everything about the call was built so that you would not.`,
      description: [
        `You checked against something you already had — her real number, or your dad — instead of trying to work out whether the voice was right.`,
        `Then you said so out loud, to the people whose numbers sit in the same address book. Your aunt had nearly fallen for something similar and had told nobody.`,
      ],
      judgement: `You did not detect the fake and you did not need to. Calling back on a number you already hold does not depend on you noticing anything, which is why it keeps working as the clones get better. The second half matters as much: a scam that works once on a family will be tried again on the same family, and the only thing that reliably stops the second attempt is somebody being unembarrassed about the first.`,
    },

    outcome_caught_alone: {
      heading: `You caught it. Your cousin didn't.`,
      tone: `warn`,
      score: 65,
      reaction: `It is your family, not a public service announcement — that is a fair instinct, and most people share it.`,
      description: [
        `You lost nothing. You checked against a number you already had and the call went nowhere.`,
        `Six weeks later your cousin sent four hundred dollars to a car park, from the same address book, to the same voice.`,
      ],
      judgement: `Shame is the mechanism these run on. People who nearly fall for one rarely mention it, so each person in a family meets the same call cold. Saying plainly what happened to you costs a message and removes the surprise for everyone else, and surprise is most of what the script has.`,
    },

    outcome_late: {
      heading: `Eight hundred gone. The rest stopped, and your aunt didn't lose anything.`,
      tone: `warn`,
      score: 70,
      reaction: `The second ask is where most people stop, and stopping there is not a small thing. The script depends on you not stopping.`,
      description: [
        `The first transfer went. When the number came back for twelve hundred more you checked instead of sending, and the bank held it before it moved.`,
        `On Tuesday your aunt got the same call and rang you mid-way through.`,
      ],
      judgement: `A story that needs a second payment will need a third. What made the difference on Tuesday was not that your aunt was more sceptical than you had been — it was that she had somewhere to check and someone who had already said out loud that this happens.`,
    },

    outcome_loss: {
      heading: `Two thousand dollars, and it was never her`,
      tone: `bad`,
      score: 15,
      reaction: `You heard your mum crying and you moved. That is not a failure of judgement — it is exactly what the attack was built to produce, and it works on people who are careful about everything else.`,
      description: [
        `Two transfers went out. You found out on Sunday when you rang to ask about the trip home and she asked what trip.`,
        `The number on your screen was hers, which is trivial to fake. The voice was close enough, which now takes very little audio to produce.`,
      ],
      judgement: `The thing that would have stopped this was not being more suspicious of the voice. It was one call back on the number already in your phone, before anything moved, and it costs thirty seconds when you turn out to be wrong. The agreement you reached afterwards is the same control arriving late: any call about money gets hung up and rung back, by everyone, every time.`,
    },
  },

  debrief: {
    frame: [
      `Everything about this call was engineered to close the gap where checking would happen. A twenty-minute deadline. A voice you have known your whole life. A request not to involve the one person in the world who could have answered it instantly.`,
      `Voice cloning now needs only a few seconds of audio and it will keep getting better, which is why "listen carefully, does it sound right" is bad advice — it puts the work on a skill people do not reliably have. Everything that actually catches this sits outside the call: the number you already hold, the other person in the house, the bank. And because the audio gets reused, the last decision is not really the aftermath. It is the next person in the address book.`,
    ],
  },

  recall: {
    id: `home-voice-clone-recall`,
    prompt: `Three months later, a video call from your brother's account. He is on screen, he looks stressed, and he needs you to move money for a bond on a flat before close of business. What settles it?`,
    options: [
      { id: `a`, quality: `poor`, label: `You can see his face, so it's him`,
        note: `Video is now about as easy to fake as voice, and it is the same trap in a newer wrapper. What you can see was never the evidence.` },
      { id: `b`, quality: `good`, label: `Hang up and reach him another way before anything moves`,
        note: `Yes. Same step, different channel. Reaching him on a number or an app you already had, or through someone who is with him, does not depend on you spotting anything.` },
      { id: `c`, quality: `partial`, label: `Ask him something personal on the call`,
        note: `Better than nothing and weaker than it feels. Anything you both know is often findable, and a caller who cannot answer can simply get upset that you asked — which is what happened in the car park.` },
    ],
  },

  act: [
    { id: `a1`, label: `Agree with one family member this week that any call about money gets hung up and rung back` },
    { id: `a2`, label: `Tell one person what a voice-clone call actually sounds like, before they get one` },
    { id: `a3`, label: `Save your bank's fraud line in your phone so you are not searching for it under pressure` },
  ],

  controls_summary: [
    { id: `c1`, label: `Call back on a number you already hold`, effort: `Low`, owner: `You`, go_live: true,
      context: `The single step that would have ended this at any point, including after the first transfer.` },
    { id: `c2`, label: `Treat "don't tell anyone" as the signal`, effort: `Low`, owner: `You`, go_live: true,
      context: `The secrecy request was doing more work in this script than the story about the car park.` },
    { id: `c3`, label: `Say out loud that it happened`, effort: `Low`, owner: `You`, go_live: true,
      context: `Cloned audio gets reused across an address book. Embarrassment is what lets the second attempt land.` },
  ],

  tell: `If someone you love rings needing money urgently, hang up and call them back on a number you already have — it costs thirty seconds when you're wrong.`,
};
