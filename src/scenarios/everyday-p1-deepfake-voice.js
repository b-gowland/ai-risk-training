// everyday-p1-deepfake-voice.js
// Personal bundle — Scenario 1
// AU-framed. Scamwatch referenced as the AU reporting body (clearly AU-specific).

export const scenario = {
  id: `everyday-p1-deepfake-voice`,
  risk_ref: `C4`,
  title: `Is That Really Mum?`,
  subtitle: `Deepfake voice scam`,
  domain: `everyday`,
  difficulty: `Everyday`,
  estimated_minutes: 3,
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
            prompt: `What do you do?`,
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
            prompt: `The real Mum is confused. What do you do now?`,
            choices: [
              {
                id: `a`,
                label: `Call your bank immediately — report it as a scam transfer.`,
                quality: `good`,
                note: `Speed is everything. Banks can sometimes recall transfers if contacted within minutes. In Australia, also report to Scamwatch (scamwatch.gov.au) — it builds the national picture and can help others.`,
              },
              {
                id: `b`,
                label: `Wait and hope — maybe the money will come back.`,
                quality: `poor`,
                note: `Scam transfers move through accounts in minutes. Every second you wait reduces the chance of recovery to near zero. There's no mechanism for automatic reversal — only your bank acting fast has any chance.`,
              },
            ],
          },
          branches: { a: `outcome_transferred_reported`, b: `outcome_transferred_lost` },
        },

        n2_called_back: {
          scene: `call-safe`,
          caption: `Mum answers immediately. She's at home watching television.`,
          sub_caption: `She never called you. Her voice was cloned.`,
          decision: {
            prompt: `You just stopped a scam. What next?`,
            choices: [
              {
                id: `a`,
                label: `Tell Mum — and help her find public audio the scammer might have used.`,
                quality: `good`,
                note: `Voice cloning pulls from audio found online — voicemails, social posts, birthday reels. Checking and tightening her privacy settings reduces future attack surface for the whole family.`,
              },
              {
                id: `b`,
                label: `Say nothing — no harm done, don't worry her.`,
                quality: `poor`,
                note: `The attacker still has the cloned voice and will try again — on you, or on other family members who haven't seen this coming. Telling her takes two minutes and closes the loop.`,
              },
            ],
          },
          branches: { a: `outcome_safe_reported`, b: `outcome_safe_silent` },
        },
      },

      outcomes: {
        outcome_transferred_reported: {
          heading: `SCAMMED — but you moved fast`,
          tone: `warn`,
          result: `You lost $800 to a voice clone. But you called your bank within minutes and reported to Scamwatch. The receiving account is flagged. The money may not come back — but you gave it the best chance, and the next person this scammer targets is a little safer.`,
          learning: `Report scam transfers immediately. Speed is the only variable you control.`,
          outcome_label: `PARTIAL`,
        },
        outcome_transferred_lost: {
          heading: `SCAMMED — and the money is gone`,
          tone: `bad`,
          result: `The $800 moved through three accounts while you waited. Your bank has no mechanism to reverse it now. Voice cloning attacks are designed around this — they create urgency so you act, then doubt so you delay reporting.`,
          learning: `Call your bank the second you realise. Waiting costs everything.`,
          outcome_label: `SCAMMED`,
        },
        outcome_safe_reported: {
          heading: `SAFE — and smarter for next time`,
          tone: `good`,
          result: `One callback. Thirty seconds. The scam collapsed. You warned Mum, she tightened her privacy settings, and the family is harder to target now. The attacker got nothing except a wasted afternoon.`,
          learning: `One callback defeats voice cloning entirely. The tech is impressive — the defence is beautifully simple.`,
          outcome_label: `SAFE`,
        },
        outcome_safe_silent: {
          heading: `SAFE — this time`,
          tone: `warn`,
          result: `You didn't lose money. But the attacker still has Mum's cloned voice and will use it again — maybe on her, maybe on another family member who picks up and doesn't think to call back. Two minutes of conversation would have helped.`,
          learning: `Staying quiet after a near-miss leaves the next person exposed.`,
          outcome_label: `CLOSE CALL`,
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
      context: `Call back on a number you already have. Never use a number provided in the suspicious call itself.`,
    },
  ],
};
