// everyday-p1-deepfake-voice.js
// Personal bundle — Scenario 1
// Expanded May 2026: 3–4 decision nodes per path for 3–5 min play.
// AU-framed. Scamwatch referenced as the AU reporting body.

export const scenario = {
  id: `everyday-p1-deepfake-voice`,
  risk_ref: `C4`,
  title: `Is That Really Mum?`,
  subtitle: `Deepfake voice scam`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 5,
  has_business_user: false,
  kb_url: `https://b-gowland.github.io/ai-risk-kb/docs/domain-c-security/c4-deepfakes`,

  personas: {
    player: {
      label: `You`,
      role: `Anyone`,
      character: `You`,
      framing: `Your phone rings. It's Mum's number. Her voice sounds urgent.`,
      premise: `It's Saturday afternoon. Your phone rings — Mum's number. Her voice is shaking. She says she's stranded at a car park, wallet stolen, needs $800 in the next 20 minutes or she'll miss her flight. She's crying. You can hear traffic. "Don't tell Dad — he'll panic." The account number she gives you isn't one you recognise.`,
    },
  },

  trees: {
    player: {
      nodes: {
        start: {
          scene: `phone-call`,
          caption: `Mum's voice. Crying. Urgent. $800. Twenty minutes.`,
          sub_caption: `"Don't tell Dad."`,
          decision: {
            prompt: `What do you do first?`,
            choices: [
              {
                id: `a`,
                label: `Transfer the $800. It's Mum — this sounds real.`,
                quality: `poor`,
                note: `Urgency, secrecy, and emotion are the three tools of this attack. AI voice cloning needs only 3 seconds of audio — a voicemail, a birthday reel, a social media video is enough.`,
              },
              {
                id: `b`,
                label: `Hang up and call Mum back on the number you have saved.`,
                quality: `good`,
                note: `Out-of-band verification. Takes 30 seconds. Completely defeats voice cloning — the attacker cannot answer Mum's actual phone.`,
              },
            ],
          },
          branches: { a: `n2_transferred`, b: `n2_called_back` },
        },

        n2_transferred: {
          scene: `payment-sent`,
          caption: `You sent the money. Five minutes later, Mum calls from her actual phone.`,
          sub_caption: `She's at home. She never called you.`,
          decision: {
            prompt: `The real Mum is confused. What do you do right now?`,
            choices: [
              {
                id: `a`,
                label: `Call your bank immediately — tell them it was a scam transfer.`,
                quality: `good`,
                note: `Speed is everything. Banks can sometimes recall transfers if contacted within minutes. Say "scam transfer" — most banks have a dedicated 24/7 fraud line.`,
              },
              {
                id: `b`,
                label: `Wait until Monday when the bank opens properly.`,
                quality: `poor`,
                note: `Scam transfers move through accounts in minutes. By Monday the money has cycled through multiple accounts and is effectively gone. Fraud lines are available 24/7 — this is exactly what they're for.`,
              },
            ],
          },
          branches: { a: `n3_bank_called`, b: `n3_bank_waited` },
        },

        n3_bank_called: {
          scene: `phone-verify`,
          caption: `Your bank flags the transfer. They ask: have you reported this anywhere else?`,
          sub_caption: `The money may not be fully gone yet.`,
          decision: {
            prompt: `What do you do next?`,
            choices: [
              {
                id: `a`,
                label: `Report to Scamwatch and warn the whole family about the cloned voice.`,
                quality: `good`,
                note: `Scamwatch (scamwatch.gov.au) builds the national picture. And the attacker still has Mum's cloned voice — your siblings, cousins, and friends are next unless someone warns them.`,
              },
              {
                id: `b`,
                label: `Leave it at the bank report — that's enough.`,
                quality: `poor`,
                note: `The bank report protects this transaction. Scamwatch protects others. Without warning your family, the attacker will try the same voice clone on the next person in your contacts who picks up.`,
              },
            ],
          },
          branches: { a: `outcome_transferred_recovered`, b: `outcome_transferred_partial` },
        },

        n3_bank_waited: {
          scene: `desk-review`,
          caption: `Monday. Your bank confirms the funds are gone — the receiving account was emptied within an hour.`,
          sub_caption: `Waiting cost you the only window to recover the money.`,
          decision: {
            prompt: `The bank can't reverse it. What do you do now?`,
            choices: [
              {
                id: `a`,
                label: `Report to Scamwatch and warn your family — the voice clone is still out there.`,
                quality: `good`,
                note: `The money is likely gone, but reporting still matters. And your family needs to know — the attacker will reuse Mum's cloned voice on others.`,
              },
              {
                id: `b`,
                label: `Accept the loss and move on — there's nothing else to do.`,
                quality: `poor`,
                note: `There's nothing more to do about this $800. But the attacker still has Mum's voice and your family's trust. Two minutes of warning could save a sibling or cousin from the same loss.`,
              },
            ],
          },
          branches: { a: `outcome_transferred_reported_late`, b: `outcome_transferred_lost` },
        },

        n2_called_back: {
          scene: `call-safe`,
          caption: `Mum answers immediately. She's at home watching television.`,
          sub_caption: `She never called you. Her voice was cloned.`,
          decision: {
            prompt: `You just stopped a scam. What does Mum need to know?`,
            choices: [
              {
                id: `a`,
                label: `Tell Mum about the attack and help her find where her voice was sourced.`,
                quality: `good`,
                note: `Voice cloning pulls from audio found online — birthday videos, voicemails, podcast appearances, social posts. Checking and tightening her privacy settings reduces future attack surface for the whole family.`,
              },
              {
                id: `b`,
                label: `Say nothing — no harm done, no point worrying her.`,
                quality: `poor`,
                note: `The attacker still has Mum's cloned voice and will try again — on you, or on another family member who doesn't think to call back. Two minutes of conversation closes the loop.`,
              },
            ],
          },
          branches: { a: `n3_told_mum`, b: `n3_stayed_silent` },
        },

        n3_told_mum: {
          scene: `desk-colleague`,
          caption: `Mum found three public videos with clear audio — a birthday on Facebook, a church talk on YouTube.`,
          sub_caption: `She sets them to private. The attack surface shrinks.`,
          decision: {
            prompt: `Should you also report this to Scamwatch?`,
            choices: [
              {
                id: `a`,
                label: `Yes — even a near-miss report helps protect others.`,
                quality: `good`,
                note: `Scamwatch uses reports to track emerging scam patterns and alert the public. A near-miss report is exactly as useful as a loss report — it shows the attack vector is active in your area.`,
              },
              {
                id: `b`,
                label: `No — nothing happened, no point reporting.`,
                quality: `partial`,
                note: `Understandable — but near-miss reports are valuable. The attacker didn't succeed here, but they'll try the same script elsewhere. A report costs two minutes and contributes to the national picture.`,
              },
            ],
          },
          branches: { a: `outcome_safe_full`, b: `outcome_safe_unreported` },
        },

        n3_stayed_silent: {
          scene: `phone-incoming`,
          caption: `Three weeks later. Your sister calls you — she just sent $600 to "Mum."`,
          sub_caption: `Same script. Same cloned voice. Different target.`,
          decision: {
            prompt: `Your sister has been scammed. What do you tell her first?`,
            choices: [
              {
                id: `a`,
                label: `Call her bank immediately — then warn the whole family together.`,
                quality: `good`,
                note: `Fast bank contact is the only real chance of recovery. And now is the moment to warn everyone — group message, five minutes, everyone knows to call back before sending anything.`,
              },
              {
                id: `b`,
                label: `Tell her there's nothing she can do and commiserate.`,
                quality: `poor`,
                note: `There's still a chance if she calls her bank now. And the family still needs warning — this attacker has Mum's voice and will keep using it.`,
              },
            ],
          },
          branches: { a: `outcome_safe_silent_recovered`, b: `outcome_safe_silent_lost` },
        },
      },

      outcomes: {
        outcome_transferred_recovered: {
          heading: `SCAMMED — but you moved fast and warned everyone`,
          tone: `warn`,
          result: `You lost $800 but called your bank within minutes — the transfer was flagged and partially frozen. You reported to Scamwatch and warned the family. The attacker got far less than they planned, and your family now knows the "don't tell Dad" script by heart.`,
          learning: `Speed and reporting after a scam loss are the only variables you control. Both matter.`,
          score: 65,
          outcome_label: `PARTIAL WIN`,
        },
        outcome_transferred_partial: {
          heading: `SCAMMED — and only half the loop closed`,
          tone: `warn`,
          result: `You called the bank quickly and they flagged the transaction. But without warning your family, the attacker tried the same script on your cousin the following week. The voice clone is still out there. Two more minutes would have closed the second loop.`,
          learning: `The bank report protects this transfer. Warning your family protects everyone else.`,
          score: 45,
          outcome_label: `PARTIAL`,
        },
        outcome_transferred_reported_late: {
          heading: `SCAMMED — but you did the right things after`,
          tone: `warn`,
          result: `The $800 is gone — waiting until Monday meant the funds had cleared. But you reported to Scamwatch and warned your family. The attacker won't get a second chance using Mum's voice with anyone who heard from you.`,
          learning: `Call your bank the second you realise. But reporting and warning still matter even when the money is gone.`,
          score: 40,
          outcome_label: `COSTLY`,
        },
        outcome_transferred_lost: {
          heading: `SCAMMED — and the money is gone`,
          tone: `bad`,
          result: `The $800 moved through three accounts while you waited. Your bank has no mechanism to reverse it. The attacker still has Mum's cloned voice and your family doesn't know to watch for it.`,
          learning: `Call your bank the second you realise. Waiting costs everything. Warn your family immediately after.`,
          score: 10,
          outcome_label: `SCAMMED`,
        },
        outcome_safe_full: {
          heading: `SAFE — and the loop is fully closed`,
          tone: `good`,
          result: `One callback. Thirty seconds. The scam collapsed. Mum tightened her privacy settings, the family was warned, and you filed a Scamwatch report that may help protect someone else. The attacker got nothing and lost a working clone.`,
          learning: `One callback defeats voice cloning. Reporting and warning turn a near-miss into genuine protection.`,
          score: 100,
          outcome_label: `SAFE`,
        },
        outcome_safe_unreported: {
          heading: `SAFE — almost everything right`,
          tone: `good`,
          result: `You stopped the scam, told Mum, and she cleaned up her public audio. The only gap is the Scamwatch report — a two-minute step that helps others. Everything else was handled well.`,
          learning: `Near-miss reports are as valuable as loss reports. Two minutes, scamwatch.gov.au.`,
          score: 80,
          outcome_label: `SAFE`,
        },
        outcome_safe_silent_recovered: {
          heading: `YOUR SISTER SAFE — because you acted`,
          tone: `warn`,
          result: `Your sister called her bank in time and the transfer was frozen. You spent the next hour warning every family member. The attacker lost the clone's value the moment the family knew the script. Staying silent after your near-miss was the mistake — but you corrected it when it mattered.`,
          learning: `A near-miss is a warning. Share it immediately — the attacker will reuse the same voice.`,
          score: 50,
          outcome_label: `CLOSE CALL`,
        },
        outcome_safe_silent_lost: {
          heading: `YOUR SISTER SCAMMED — because you stayed quiet`,
          tone: `bad`,
          result: `Your sister lost $600. The attacker used Mum's cloned voice three weeks after you stopped them — because you didn't warn anyone. A two-minute family message after your near-miss would have been enough.`,
          learning: `Staying quiet after a near-miss leaves the next person exposed. Always share the script.`,
          score: 15,
          outcome_label: `PREVENTABLE`,
        },
      },
    },
  },

  controls_summary: [
    {
      id: `ev-c1`,
      label: `Out-of-band verification`,
      owner: `Anyone`,
      effort: `low`,
      go_live: true,
      context: `Call back on a number you already have. Never use a number provided in the suspicious call itself.`,
    },
    {
      id: `ev-c2`,
      label: `Public audio hygiene`,
      owner: `Anyone`,
      effort: `low`,
      go_live: true,
      context: `Voice cloning sources audio from public content. Periodic review of publicly accessible videos and voicemails reduces attack surface.`,
    },
  ],
};
