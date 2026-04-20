// E3 — The Fabricated Story
// AI Misinformation & Synthetic Content Integrity
//
// REFRAMED from original KB seed (synthetic personas in political consultation).
// Setting: A professional services firm runs a competitive recruitment process
// for a senior role. A large proportion of applications contain AI-generated
// cover letters and CVs with fabricated credentials — indistinguishable from
// genuine applications. The firm's recruitment process has no detection
// capability. The hiring manager shortlists two candidates who were later
// confirmed to have submitted substantially fabricated applications.
//
// Controls taught: synthetic content disclosure, C2PA provenance,
// AI content detection for inbound content, media literacy training.
// All apply directly to this setting. No political content, no stress.
// The misinformation risk is identical: synthetic content erodes trust
// in information, and systems designed for genuine input are not equipped
// to handle it at scale.

export const scenario = {
  id:                `e3-misinformation`,
  risk_ref:          `E3`,
  title:             `The Fabricated Story`,
  subtitle:          `AI-Generated Synthetic Content & Credential Integrity`,
  domain:            `E — Fairness & Social`,
  difficulty:        `Intermediate`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-e-fairness/e3-misinformation`,
  estimated_minutes: 12,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Recruitment Coordinator`,
      character: `Sam`,
      icon:      `◇`,
      framing:   `You\'ve screened 140 applications for a senior analyst role. 40 cover letters are suspiciously similar in structure and phrasing. When you look closer, several contain job titles and companies that don\'t match LinkedIn profiles.`,
      premise:   `You're coordinating recruitment for a Senior Data Analyst role. 140 applications arrived in the first 48 hours. As you work through them, you notice something: around 40 cover letters follow an almost identical structure — same opening line pattern, same claim format, same closing. Several of these applications list employer names and roles that, when you search LinkedIn, don't match the candidate's actual profile. One application lists a research publication that doesn't appear to exist. You haven\'t been given any guidance on how to handle AI-generated applications. You\'re not sure if this is against the rules. But something is clearly wrong.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief People Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `Two candidates made the final shortlist for a senior role. Post-offer checks have revealed both submitted substantially fabricated applications — AI-generated cover letters and embellished CVs. The offers haven\'t been accepted yet. The recruitment process has no policy on AI-generated applications.`,
      premise:   `You\'ve just been briefed by HR. Two of the four final shortlisted candidates for the Senior Data Analyst role have applications that, on reference and credential check, contain significant fabrications. One candidate claimed a research publication that doesn\'t exist. The other listed a senior role at a previous employer that HR verification found to be a junior contract position. Both used cover letters that appear to be AI-generated — same structural patterns as dozens of other applications in the same batch. The offers haven\'t been signed. You need to decide what to do about these two candidates and, separately, what the organisation\'s policy on AI-generated applications should be going forward.`,
    },
    pm: {
      lead:      `Project Manager`,
      label:     `Project Manager`,
      role:      `HR Systems Lead`,
      character: `Priya`,
      icon:      `◎`,
      framing:   `The ATS (Applicant Tracking System) the firm uses doesn\'t have AI content detection. Nobody asked for it when the system was procured two years ago. The question now is what a detection-capable process looks like.`,
      premise:   `You manage the HR technology systems including the ATS. The Chief People Officer has asked you to assess what capability exists — or could be added — to detect AI-generated application materials. The current ATS can keyword-match, rank by qualification, and flag duplicates. It has no AI content detection. The vendor\'s roadmap includes an AI detection module launching next quarter. The question is whether to wait for the vendor module, deploy a third-party detection tool in the interim, or design a human-review process for detecting synthetic content. The CPO needs a recommendation within a week.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `HR Data Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You need to assess the scale of AI-generated applications in the current recruitment batch and determine what proportion of the shortlist process was affected by synthetic content.`,
      premise:   `The CPO has asked you to analyse the current Senior Data Analyst recruitment batch: 140 applications. Specifically: (1) What proportion of applications appear to be AI-generated? (2) Of the 12 candidates who reached the screening stage, how many appear to have AI-generated or substantially embellished materials? (3) What patterns distinguish AI-generated applications from genuine ones in this batch? You have access to all 140 applications. You do not have an AI detection tool. You need to design the analysis methodology.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Sam ───────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `40 applications with suspiciously similar cover letters. Several with credentials that don\'t match LinkedIn. One with a publication that doesn\'t exist.`,
          sub_caption: `No policy on AI-generated applications. No guidance on what to do.`,
          decision: {
            prompt: `You\'ve identified a pattern that looks like widespread use of AI-generated and potentially fabricated application materials. What do you do?`,
            choices: [
              { id: `a`, label: `Flag it to HR management immediately with your specific observations — the structural patterns, the LinkedIn mismatches, the non-existent publication`, quality: `good`,
                note: `HR management needs to know this is happening before the shortlisting process advances further. Your specific observations give them something concrete to act on.` },
              { id: `b`, label: `Continue screening, note the suspicious applications separately, and raise it at the end-of-week team meeting`, quality: `partial`,
                note: `Noting them separately is right. But waiting until end-of-week means the shortlisting process advances on potentially fabricated materials. Earlier is better.` },
              { id: `c`, label: `Reject all 40 applications with the similar cover letters — if they used AI, they don\'t deserve consideration`, quality: `poor`,
                note: `Rejecting applications without a defined policy, and based on an assumption about AI use, creates its own risk — legitimate candidates using AI assistance may be unfairly excluded.` },
            ],
          },
          branches: { a: `n2_escalates`, b: `n2_waits`, c: `n2_rejects` },
        },

        n2_escalates: {
          scene:       `office-briefing`,
          caption:     `Your manager reviews your observations. The LinkedIn mismatches and the non-existent publication are the clearest signals. She asks you to hold the shortlisting process while HR assesses the batch.`,
          sub_caption: `The process is paused. Your observations are being taken seriously.`,
          decision: {
            prompt: `HR asks for your full list of flagged applications with your specific observations for each. How do you document it?`,
            choices: [
              { id: `a`, label: `Document each flagged application with the specific observation: cover letter structural match, credential mismatch with LinkedIn, unverifiable reference, non-existent publication`, quality: `good`,
                note: `Specific per-application documentation gives HR the evidence base for each decision. "Suspicious" is not actionable; "listed employer not on LinkedIn and credential unverified" is.` },
              { id: `b`, label: `List the 40 applications and note that all have similar cover letter structures`, quality: `partial`,
                note: `Cover letter structure alone is weaker evidence than specific factual discrepancies. Document the credentials mismatches and verification failures separately from the structural observation.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_waits: {
          scene:       `desk-colleague`,
          caption:     `End of week. You raise it at the team meeting. By this point, 12 candidates have been shortlisted — including candidates from the suspicious batch. The process has advanced.`,
          sub_caption: `Earlier escalation would have caught this before the shortlist was set.`,
          decision: {
            prompt: `The shortlist includes some candidates from the suspicious batch. HR asks for your observations now. What do you provide?`,
            choices: [
              { id: `a`, label: `Your full observations — structural matches, LinkedIn mismatches, the non-existent publication — and acknowledge you should have raised it sooner`, quality: `good`,
                note: `Complete and honest. The delay is yours to own. HR needs the information regardless of when it arrives.` },
              { id: `b`, label: `Your observations on the 40 flagged applications, without noting the timing delay`, quality: `partial`,
                note: `The observations are right. But HR would benefit from understanding that the shortlist has already been set — that context shapes the urgency of their response.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n2_rejects: {
          scene:       `office-meeting`,
          caption:     `Your manager reviews the batch and asks why 40 applications were rejected. You explain your reasoning. She notes that the rejection reason can\'t be "used AI" without a policy — and that some of the rejected applications may have been legitimate candidates who used AI assistance appropriately.`,
          sub_caption: `The rejections need to be reviewed. Some may need to be reinstated.`,
          decision: {
            prompt: `Your manager asks you to work with HR to review the 40 rejected applications and identify which ones have verifiable discrepancies versus those that were just AI-assisted. What\'s your approach?`,
            choices: [
              { id: `a`, label: `Focus the review on factual verifiability: credentials, employers, publications — not on whether the writing style appears AI-generated`, quality: `good`,
                note: `Verifiable discrepancies are the defensible basis for rejection. Writing style alone isn\'t — AI-assisted writing is not inherently deceptive.` },
              { id: `b`, label: `Reinstate all 40 applications and start the screening over`, quality: `partial`,
                note: `Full reinstatement is the safe legal option. But it doesn\'t distinguish between applications with genuine fabrications and those that were just AI-assisted. The factual verification approach is more targeted.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Pattern escalated early, specific evidence documented`,
          tone:    `good`,
          result:  `Your early escalation paused the shortlisting process before candidates with fabricated credentials reached the shortlist. Your specific per-application documentation gave HR the evidence base to reject applications with verifiable fabrications while retaining legitimate candidates who had used AI assistance for writing. The two candidates with the most significant fabrications were identified before any offers were made.`,
          learning: `When application materials contain specific verifiable discrepancies — credentials that don\'t match LinkedIn, publications that don\'t exist — that\'s the escalation trigger. The evidence is factual and actionable, not a judgment about AI use generally.`,
          score:   100,
        },
        outcome_good: {
          heading: `Escalated, structural evidence only`,
          tone:    `good`,
          result:  `The escalation was timely. The structural cover letter evidence triggered the review. The verification team found the factual discrepancies during the review. The shortlist was held. Both fabricated-credential candidates were identified before offers were made.`,
          learning: `Cover letter structure is weaker evidence than factual discrepancies. Both are worth documenting, but the specific verifiable discrepancies — the LinkedIn mismatches, the non-existent publication — are what the verification team needs most.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Shortlist advanced before escalation`,
          tone:    `warn`,
          result:  `Two candidates with fabricated credentials reached the shortlist before the escalation. Both were identified during reference checks. No offers had been made. The week delay added HR verification work that earlier escalation would have avoided.`,
          learning: `Patterns in application materials that suggest systematic fabrication are worth escalating immediately, not at the next team meeting. The shortlisting process advancing on fabricated materials is harder to manage than pausing it before shortlisting begins.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Bulk rejection without policy, reinstatement required`,
          tone:    `bad`,
          result:  `The bulk rejection created a legal exposure — candidates rejected on the basis of suspected AI use without a defined policy. Six of the 40 were reinstated after the review found no verifiable fabrications. Two of the six were ultimately shortlisted. The process took two additional weeks. The Chief People Officer used the incident to develop an explicit AI application policy — something that should have existed before the recruitment opened.`,
          learning: `AI-generated writing is not the same as fabricated credentials. A candidate who used AI to help write their cover letter has not necessarily lied about their qualifications. The distinction matters legally and practically — and it means the screening question is always about factual accuracy, not writing style.`,
          score:   10,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `Two finalists. Both with substantially fabricated applications. Offers not yet signed. No policy on AI-generated applications.`,
          sub_caption: `Two decisions needed: what to do about these candidates, and what the policy should be going forward.`,
          decision: {
            prompt: `What do you do about the two shortlisted candidates?`,
            choices: [
              { id: `a`, label: `Withdraw both from the process — the fabricated credentials are disqualifying regardless of interview performance`, quality: `good`,
                note: `Fabricated credentials — not AI-assisted writing, but actual factual misrepresentation — are a disqualifying integrity failure. Interview performance doesn\'t override that.` },
              { id: `b`, label: `Give both candidates the opportunity to respond to the specific discrepancies before a final decision`, quality: `partial`,
                note: `A right of response is procedurally fair. But factual discrepancies — a publication that doesn\'t exist, a seniority that\'s been inflated — aren\'t ambiguous. A response opportunity may be appropriate but shouldn\'t change the outcome.` },
              { id: `c`, label: `Keep one candidate whose fabrications were less significant and withdraw the other`, quality: `poor`,
                note: `Degree of fabrication is a murky distinction. Both candidates misrepresented their credentials. Continuing with either creates an integrity risk in the role.` },
            ],
          },
          branches: { a: `n2_withdraws`, b: `n2_right_of_response`, c: `n2_partial` },
        },

        n2_withdraws: {
          scene:       `office-bright`,
          caption:     `Both candidates withdrawn. Now the policy question. AI-generated applications will only increase in prevalence. The organisation needs a position.`,
          sub_caption: `The policy needs to distinguish AI-assisted writing from AI-fabricated credentials.`,
          decision: {
            prompt: `What does the organisation\'s policy on AI-generated applications say?`,
            choices: [
              { id: `a`, label: `AI assistance in writing is acceptable and does not require disclosure. Factual accuracy is required and will be verified. Misrepresentation of credentials, employers, or publications is grounds for immediate disqualification.`, quality: `good`,
                note: `This is the right distinction. AI-assisted writing is not inherently deceptive. Fabricated facts are. The policy focuses enforcement where the actual harm is.` },
              { id: `b`, label: `All use of AI in application materials must be disclosed. Undisclosed AI use is grounds for disqualification.`, quality: `partial`,
                note: `Disclosure requirements are defensible. But enforcement is difficult — AI detection tools are probabilistic. A policy that depends on detection you can\'t reliably perform is harder to apply consistently.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_right_of_response: {
          scene:       `desk-focused`,
          caption:     `Both candidates respond. One acknowledges the publication was "forthcoming" rather than published — it doesn\'t exist. The other says their previous role title reflects their responsibilities rather than their formal title.`,
          sub_caption: `The responses confirm the fabrications. Both need to be withdrawn.`,
          decision: {
            prompt: `The responses confirm the fabrications. The withdrawals are now straightforward. What is your policy position going forward?`,
            choices: [
              { id: `a`, label: `Policy focused on factual accuracy and verification, not AI use per se`, quality: `good`,
                note: `Correct policy direction regardless of how you arrived here. The right of response added a week but the outcome and the policy are the same.` },
              { id: `b`, label: `Require AI disclosure going forward — the right of response process was too slow for a competitive recruitment`, quality: `partial`,
                note: `Speed concern is legitimate. But an AI disclosure requirement doesn\'t actually solve the fabrication problem — it adds a process without improving factual verification.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_partial: {
          scene:       `office-meeting`,
          caption:     `The candidate you retained was offered the role. During onboarding, a background check surfaces that their listed employer doesn\'t match their P60s. The offer has to be withdrawn at the onboarding stage — significantly more disruptive than withdrawal from the shortlist.`,
          sub_caption: `The degree-of-fabrication distinction didn\'t hold.`,
          decision: {
            prompt: `The onboarding withdrawal is awkward and has cost the team several weeks. The policy question needs to be resolved. What do you put in place?`,
            choices: [
              { id: `a`, label: `Policy: factual accuracy required, verified at shortlist stage. Any misrepresentation of employers, credentials, or publications is disqualifying — regardless of degree.`, quality: `good`,
                note: `The incident demonstrated that degree-of-fabrication distinctions are unworkable. Clear, binary policy on factual accuracy is more consistent and more enforceable.` },
              { id: `b`, label: `Enhanced reference checking at shortlist stage before any offers are made`, quality: `partial`,
                note: `Enhanced checking is useful. But it\'s a process improvement, not a policy. The policy question — what level of fabrication is acceptable — still needs to be answered.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Clean withdrawals, right policy`,
          tone:    `good`,
          result:  `Both candidates were withdrawn promptly. The policy — factual accuracy required, AI writing assistance acceptable — was communicated to the recruitment team and published on the careers page. The next recruitment round included the policy prominently. HR noted a reduction in applications with verifiable discrepancies in the following quarter, and a significant increase in cover letter quality overall.`,
          learning: `An application policy that distinguishes AI-assisted writing (acceptable) from AI-fabricated credentials (disqualifying) is both fair and enforceable. It focuses scrutiny where the actual harm is — factual misrepresentation — rather than on writing style, which is a poor proxy for integrity.`,
          score:   100,
        },
        outcome_good: {
          heading: `Correct outcome, one week delay`,
          tone:    `good`,
          result:  `Both candidates were eventually withdrawn. The right of response process added a week. The policy was developed based on the factual accuracy principle. The process for the next recruitment round was cleaner.`,
          learning: `A right of response for clearly documented factual discrepancies is procedurally careful but typically doesn\'t change the outcome. The policy development is the more important lesson from the incident.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Onboarding withdrawal, policy eventually correct`,
          tone:    `warn`,
          result:  `The onboarding withdrawal was expensive and disruptive — the role had been unfilled for an additional six weeks and the offer withdrawal required legal review. The incident generated the right policy eventually. The cost of the degree-of-fabrication distinction was a lesson learned expensively.`,
          learning: `"Less severe" fabrication is still fabrication. The integrity question is binary. A policy that tries to distinguish degrees of misrepresentation will be inconsistently applied and will produce exactly the outcome seen here.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Process improvement without policy, problem recurring`,
          tone:    `bad`,
          result:  `Enhanced reference checking was implemented. The policy question — what constitutes acceptable AI use in applications — was not resolved. In the next recruitment round, three more applications with fabricated credentials reached the shortlist before the enhanced checks caught them. The absence of a clear policy meant each case required individual judgment, which was inconsistent and slow.`,
          learning: `Process improvements address individual instances. Policy addresses the recurring pattern. When AI-generated and AI-fabricated applications are a structural feature of recruitment, a clear policy is the right organisational response — not just better verification steps.`,
          score:   5,
        },
      },
    },

    // ── PROJECT MANAGER — Priya ───────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `ATS capability: keyword matching, qualification ranking, duplicate detection. AI content detection: none. Vendor AI detection module: launching next quarter. The CPO needs a recommendation within a week.`,
          sub_caption: `Three options: wait for vendor module, deploy third-party tool now, or design a human-review process.`,
          decision: {
            prompt: `What do you recommend to the CPO?`,
            choices: [
              { id: `a`, label: `Don\'t wait for the vendor module — deploy a third-party AI detection tool now for the current recruitment, then evaluate the vendor module when it launches`, quality: `good`,
                note: `The current recruitment has already been affected. Waiting a quarter for the vendor module means all roles recruited in the interim are unprotected. Third-party tools are available now.` },
              { id: `b`, label: `Wait for the vendor module — it\'ll be integrated and supported, which is better than a third-party tool bolted on`, quality: `partial`,
                note: `Integration and support are real advantages. But "next quarter" means an unknown number of additional recruitment rounds without detection capability. The interim exposure is the cost of waiting.` },
              { id: `c`, label: `Design a human-review process — a trained reviewer can identify AI-generated writing patterns without technology`, quality: `partial`,
                note: `Human review is reliable for skilled reviewers but doesn\'t scale. At 140+ applications per role, a human-review-only approach is likely to miss cases or create unsustainable workload.` },
            ],
          },
          branches: { a: `n2_third_party`, b: `n2_wait`, c: `n2_human` },
        },

        n2_third_party: {
          scene:       `office-meeting`,
          caption:     `You recommend deploying a third-party AI detection tool for the current recruitment batch and evaluating the vendor module when it launches. The CPO asks: what are the limitations of AI detection tools you should disclose?`,
          sub_caption: `Disclosure of limitations is part of responsible recommendation.`,
          decision: {
            prompt: `What limitations do you disclose?`,
            choices: [
              { id: `a`, label: `Three: false positive rate (legitimate writing flagged as AI), false negative rate (AI content not detected), and rapid obsolescence as generation models improve. Detection should be used as a flag for human review, not as a determinative rejection trigger.`, quality: `good`,
                note: `Complete and honest. The CPO needs to understand that AI detection is decision-support, not a pass/fail system. The policy consequences of detection results need to reflect the tool\'s probabilistic nature.` },
              { id: `b`, label: `Detection accuracy varies — recommend treating results as indicative rather than definitive`, quality: `partial`,
                note: `Correct direction. More specific disclosure of false positive/negative rates and obsolescence helps the CPO calibrate expectations more precisely.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_wait: {
          scene:       `desk-waiting`,
          caption:     `The vendor module launches in 11 weeks. During that period, two more recruitment rounds are affected by AI-generated and fabricated applications. Both require significant post-shortlist remediation.`,
          sub_caption: `The integration advantage didn\'t outweigh the 11-week gap.`,
          decision: {
            prompt: `The vendor module is about to launch. The CPO asks what implementation looks like and what the limitations are.`,
            choices: [
              { id: `a`, label: `Implement immediately with full limitations disclosure — and acknowledge the 11-week delay was a cost worth recognising`, quality: `good`,
                note: `Acknowledging the cost of the decision helps the CPO calibrate future technology timing decisions. The implementation and the limitations disclosure are both needed.` },
              { id: `b`, label: `Implement and note the limitations without reflecting on the timing decision`, quality: `partial`,
                note: `Implementation is right. The timing reflection helps the organisation learn from the interim period — it\'s worth including.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_human: {
          scene:       `office-briefing`,
          caption:     `The human-review process is implemented. After two weeks, the reviewer reports that at 150+ applications per role, it\'s unsustainable at the level of scrutiny needed. They\'re reviewing cover letters at speed and likely missing cases.`,
          sub_caption: `Human review scales poorly at application volumes common in competitive recruitment.`,
          decision: {
            prompt: `The human-review approach has hit a scaling limit. What do you recommend now?`,
            choices: [
              { id: `a`, label: `Third-party AI detection tool to augment the human review — detection flags cases for detailed human scrutiny rather than requiring full manual review of every application`, quality: `good`,
                note: `Technology-assisted human review is the right architecture: detection narrows the review scope, humans make the determination on flagged cases. Neither alone is sufficient.` },
              { id: `b`, label: `Reduce the recruitment pool size to make human review sustainable`, quality: `poor`,
                note: `Restricting the applicant pool to make manual review feasible reduces the quality of the candidate pool. It treats the scaling problem as a volume problem rather than a process problem.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Third-party tool deployed, limitations disclosed`,
          tone:    `good`,
          result:  `The third-party tool was deployed within the week. The CPO understood the probabilistic nature of the results and designed the policy accordingly — detection flags cases for factual verification, not automatic rejection. The vendor module was evaluated on launch and adopted when it proved superior. The combined detection-plus-verification process identified fabricated credential applications at the shortlist stage across the next three recruitment rounds.`,
          learning: `AI detection tools for inbound content are decision-support, not determinative. Their value is in flagging applications for targeted verification — which is faster and more accurate than AI detection alone. The limitation disclosure is as important as the tool recommendation.`,
          score:   100,
        },
        outcome_good: {
          heading: `Tool deployed or designed correctly, partial limitations disclosed`,
          tone:    `good`,
          result:  `The detection capability was implemented. Limitations were disclosed with varying completeness. The process worked — fabricated applications were identified before final shortlisting in subsequent rounds. The false positive rate created some additional human review workload, which would have been anticipated with full limitations disclosure.`,
          learning: `AI detection tool limitations — particularly false positive rates — have direct workload implications. Complete disclosure upfront allows the process to be designed to handle them rather than discovering them in operation.`,
          score:   65,
        },
        outcome_warn: {
          heading: `11-week gap cost two recruitment rounds`,
          tone:    `warn`,
          result:  `The vendor module was implemented successfully. The 11-week gap affected two recruitment rounds. The implementation was good; the timing decision was not. The CPO used the incident in a review of the HR technology decision-making process — specifically, the tradeoff between integration quality and interim exposure.`,
          learning: `In technology selection, "wait for the better integrated solution" is the right call when the gap is weeks and the risk is low. When the gap is a quarter and the risk is ongoing fraudulent applications, interim capability matters more than integration quality.`,
          score:   30,
        },
        outcome_bad: {
          heading: `Restricted pool, reduced candidate quality`,
          tone:    `bad`,
          result:  `The reduced pool made human review sustainable but reduced candidate quality visibly. Three subsequent roles had significantly fewer qualified applicants than historical benchmarks. The CPO asked for a reassessment. The technology-augmented human review approach was eventually implemented — but only after two quarters of reduced talent pool access.`,
          learning: `Scaling problems in recruitment processes should be solved with better process design, not smaller talent pools. AI-assisted detection narrows the human review scope to manageable levels without restricting who can apply.`,
          score:   5,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `desk-focused`,
          caption:     `140 applications. No AI detection tool. You need to assess the scale and identify the patterns. Your methodology will determine how accurate the picture is.`,
          sub_caption: `Manual analysis, designed carefully, can still produce a useful finding.`,
          decision: {
            prompt: `How do you approach the analysis without a dedicated AI detection tool?`,
            choices: [
              { id: `a`, label: `Three-signal approach: (1) structural similarity across cover letters using text comparison, (2) factual verifiability of specific claims, (3) stylistic consistency within each application`, quality: `good`,
                note: `Three independent signals are stronger than one. Structural similarity identifies patterns; factual verifiability identifies fabrication; stylistic consistency distinguishes AI-generated uniform style from genuine varied expression.` },
              { id: `b`, label: `Focus on factual verifiability only — credentials, employers, publications. That\'s the actionable signal.`, quality: `partial`,
                note: `Factual verifiability is the most actionable signal. But structural similarity helps scope the problem — it tells you whether you\'re looking at an isolated incident or a systematic pattern.` },
              { id: `c`, label: `Use a free AI detection tool online to scan cover letters for AI probability scores`, quality: `partial`,
                note: `Free AI detection tools provide a signal. Their accuracy and reliability are variable. Treat results as one input alongside human analysis, not as a determinative score.` },
            ],
          },
          branches: { a: `n2_three_signal`, b: `n2_factual_only`, c: `n2_free_tool` },
        },

        n2_three_signal: {
          scene:       `analyst-desk`,
          caption:     `Three-signal analysis complete. Structural similarity: 43 cover letters with >70% structural overlap. Factual verification: 12 applications with unverifiable or contradicted claims. Stylistic inconsistency: 8 applications where cover letter style is significantly more polished than CV narrative sections.`,
          sub_caption: `The signals converge on a core of approximately 12 high-concern applications.`,
          decision: {
            prompt: `How do you present this to the CPO?`,
            choices: [
              { id: `a`, label: `Lead with the 12 factually unverifiable applications as the primary finding, present the structural similarity as context for scale, and recommend targeted verification of all 12 before the shortlist is finalised`, quality: `good`,
                note: `Correct framing. The 12 factually unverifiable applications are the actionable finding. The 43 structurally similar ones tell the CPO about the broader pattern. Both matter, but the factual finding drives the immediate action.` },
              { id: `b`, label: `Present all three signals with equal weight and let the CPO decide on the threshold for action`, quality: `partial`,
                note: `Analytical balance is appropriate. But the CPO needs a recommendation, not just data. The factual verifiability signal is the highest-confidence finding — lead with it.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n2_factual_only: {
          scene:       `desk-working`,
          caption:     `Factual verification of all 140 applications: 12 with unverifiable or contradicted claims. You have the actionable finding. But you don\'t know the structural scale of the AI-generated application problem.`,
          sub_caption: `The 12 are identified. The broader pattern — how many are AI-generated but factually accurate — is unknown.`,
          decision: {
            prompt: `The CPO asks whether these 12 are an isolated cluster or the tip of a larger pattern. You haven\'t done the structural analysis. What do you tell her?`,
            choices: [
              { id: `a`, label: `Acknowledge the structural analysis hasn\'t been done — you focused on factual verification. Offer to complete it within the day.`, quality: `good`,
                note: `Honest account of the analysis scope, with a clear path to completing the picture. Better than speculating about the broader pattern.` },
              { id: `b`, label: `Note that the 12 are the confirmed fabrications — whether the pattern is broader is a separate question for the policy, not the current recruitment`, quality: `partial`,
                note: `The distinction is fair but the CPO is asking a legitimate question that your analysis can answer. Offer to complete it.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_free_tool: {
          scene:       `desk-colleague`,
          caption:     `Free AI detection tool results: 67 applications flagged with >50% AI probability. The tool flagged 2 of the 12 confirmed fabricated applications — and flagged 65 others you haven\'t verified.`,
          sub_caption: `The tool produced a signal. Its accuracy on this batch is unknown. You have 65 unverified flagged applications and 10 confirmed fabrications the tool missed.`,
          decision: {
            prompt: `The free tool\'s results are unreliable for definitive decisions. How do you design the follow-on analysis?`,
            choices: [
              { id: `a`, label: `Use the free tool output as a prioritisation guide — verify the 67 flagged applications factually, and also verify the unflagged applications on structural similarity patterns`, quality: `good`,
                note: `Technology as prioritisation tool, human verification as determination. This architecture handles the tool\'s unreliability while still benefiting from its signal.` },
              { id: `b`, label: `Present the 67 flagged applications to HR and note the tool has variable accuracy`, quality: `poor`,
                note: `Presenting 67 applications flagged by an unreliable tool without factual verification puts HR in a difficult position — they can\'t act fairly on a probabilistic flag without supporting evidence.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },
      },

      outcomes: {
        outcome_great: {
          heading: `Three-signal analysis, clear actionable finding`,
          tone:    `good`,
          result:  `Your three-signal analysis gave the CPO the complete picture: 12 factually unverifiable applications for immediate targeted verification, and 43 structurally similar applications as context for the scale of AI-generated content in the batch. The verification of the 12 confirmed 7 with material fabrications. The structural analysis informed the policy development — the CPO could see that AI-generated applications were a significant portion of the batch, not an isolated outlier.`,
          learning: `Multi-signal analysis is more robust than single-signal. Factual verifiability is the highest-confidence signal for action. Structural similarity is the scale signal. Stylistic inconsistency is a supporting indicator. Together they give a complete picture.`,
          score:   100,
        },
        outcome_good: {
          heading: `Factual finding complete, scale added`,
          tone:    `good`,
          result:  `The factual finding was complete and accurate. The structural scale was added subsequently. The CPO had both for the policy development. The actionable decisions were made on the factual finding. The timing of the structural analysis was a minor efficiency gap.`,
          learning: `The factual verifiability analysis is always the most important output for a recruitment context — it\'s the basis for defensible decisions. The structural scale analysis is valuable context but doesn\'t hold up the action.`,
          score:   65,
        },
        outcome_warn: {
          heading: `Factual analysis only, scale question deferred`,
          tone:    `warn`,
          result:  `The 12 confirmed fabrications were identified. The structural scale question was noted for follow-up. The policy development proceeded without the scale data — which meant the policy was designed without knowing how prevalent AI-generated applications were in the batch. The structural analysis was completed eventually and informed the next recruitment process, but not the policy design.`,
          learning: `Scale and pattern data improves policy quality. When a finding has two components — the actionable cases and the broader pattern — both are worth producing together if the timeline allows.`,
          score:   35,
        },
        outcome_bad: {
          heading: `Unreliable tool results presented without verification`,
          tone:    `bad`,
          result:  `HR received 67 flagged applications from an unreliable tool and had to make rejection decisions without factual verification. Three candidates were initially excluded on the basis of tool flags without supporting evidence. Two filed complaints. The reversal process took two weeks. The free tool was eventually supplemented with factual verification — the process that should have been designed from the start.`,
          learning: `AI detection tool output is probabilistic. It is never a standalone basis for an adverse decision affecting a candidate. The tool narrows the verification scope; human verification makes the determination. Presenting tool flags as findings without verification creates legal exposure and unfair process.`,
          score:   5,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Synthetic content disclosure`,
      effort:  `Low`,
      owner:   `Compliance`,
      go_live: false,
      context: `The recruitment process had no policy on AI-generated application materials. Candidates who used AI assistance to fabricate credentials were operating in a policy vacuum. A clear disclosure requirement — factual accuracy required, AI writing assistance acceptable, fabricated credentials disqualifying — sets expectations before applications are submitted.`,
    },
    {
      id:      `c2`,
      label:   `AI content detection for inbound content`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: false,
      context: `The ATS had no AI content detection capability. Manual review at 140+ applications per role is neither sustainable nor sufficiently accurate. AI detection tools — used as a prioritisation signal for targeted factual verification, not as a determinative rejection trigger — would have identified the high-concern applications earlier in the process.`,
    },
    {
      id:      `c3`,
      label:   `Media literacy and staff training`,
      effort:  `Low`,
      owner:   `HR`,
      go_live: false,
      context: `Recruitment coordinators and hiring managers had no training on identifying AI-generated application materials or on the distinction between AI-assisted writing (acceptable) and AI-fabricated credentials (disqualifying). The recruitment coordinator who identified the pattern did so through individual initiative, not through a trained process.`,
    },
  ],
};
