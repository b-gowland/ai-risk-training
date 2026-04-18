// B4 — Third-Party / Supply Chain AI Risk
// "Inside the Vendor"
// Security team discovers the vendor AI DPA doesn't cover the
// foundation model sub-processor. Client data may have entered
// a training pipeline. Procurement, legal, security, and leadership
// navigate the supply chain failure.
//
// Depth expansion April 2026 — all four personas expanded from 2 to 4
// decisions each. New beats: complication (something pushes back after
// the initial response) and closing synthesis (30 days later, does
// the fix hold?). Converted to template literals throughout.
// Advanced difficulty: complication beats involve genuine ambiguity,
// not just procedural pushback.

export const scenario = {
  id:                `b4-supply-chain`,
  risk_ref:          `B4`,
  title:             `Inside the Vendor`,
  subtitle:          `Third-Party AI Supply Chain Risk`,
  domain:            `B — Governance`,
  difficulty:        `Advanced`,
  kb_url:            `https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b4-supply-chain`,
  estimated_minutes: 17,
  has_business_user: true,

  learning_objectives: [
    `Understand why a vendor DPA that does not name AI sub-processors leaves a critical data protection gap.`,
    `Recognise the sequence of internal escalation, exposure scoping, and notification decisions in a supply chain data incident.`,
    `Know what an AI-specific vendor due diligence questionnaire must ask that a standard IT DDQ does not.`,
  ],
  pass_score: 70,
  regulatory_tags: [`eu-ai-act-article-9`, `eu-ai-act-article-26`, `nist-ai-rmf-govern-5`, `iso-42001-8`, `jurisdiction-au`, `jurisdiction-eu`],

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Document Processing Coordinator`,
      character: `Quinn`,
      icon:      `◇`,
      framing:   `You have been submitting client documents to the vendor AI for six months. Nobody told you where those documents actually went.`,
      premise:   `You are Quinn, a Document Processing Coordinator. For the past six months your team has been using a vendor AI product to process and summarise client contracts and financial statements. It saves hours every day. This morning your manager called you in: the security team has found that the vendor's DPA does not cover the foundation model provider the vendor uses. The documents your team submitted may have entered an external training pipeline. You need to account for exactly what was submitted.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Risk Officer`,
      character: `Blake`,
      icon:      `◈`,
      framing:   `The vendor DPA covers the vendor. It does not cover their AI sub-processor. Six months of client documents may be in a training pipeline you did not approve.`,
      premise:   `You are Blake, Chief Risk Officer. The security team has identified a critical gap: your vendor AI product processes documents through a foundation model API, and the vendor's DPA does not bind that sub-processor to your data protection requirements. You did not know the vendor used a public LLM API. Procurement did not ask. Legal did not check. The AI-specific DDQ did not exist. Six months of client financial documents may have entered the training pipeline of a third-party model provider.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Procurement Manager`,
      character: `Avery`,
      icon:      `◎`,
      framing:   `You ran the vendor due diligence. The AI-specific questions were not on the DDQ. They should have been.`,
      premise:   `You are Avery, Procurement Manager. You led the vendor selection for the document processing AI product. You ran a standard DDQ: security posture, data residency, SOC 2, ISO 27001. You did not ask which foundation model the vendor used. You did not ask whether the vendor's API tier prevented training on submitted data. You did not request an AI Bill of Materials. The gap the security team found is a procurement due diligence failure.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Information Security Analyst`,
      character: `Drew`,
      icon:      `◉`,
      framing:   `You found it. The vendor uses a consumer-tier API. The DPA does not name the sub-processor. You need to scope the exposure before briefing the CRO.`,
      premise:   `You are Drew, Information Security Analyst. During a routine vendor security review, you noticed the vendor AI product's API traffic was going to a public foundation model endpoint — not an enterprise tier. You checked the DPA. The sub-processor is not named. You checked the vendor's terms: the standard tier permits training on submitted content. Six months of your organisation's client documents have been submitted through this pathway. You now need to scope the exposure and brief the CRO.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       `desk-intranet`,
          caption:     `Your manager needs to know: what types of documents did your team submit to the vendor AI over the past six months?`,
          sub_caption: `The answer will determine the scope of the potential exposure.`,
          decision: {
            prompt: `What do you tell your manager?`,
            choices: [
              { id: 'a', label: `A complete account: client contracts, financial statements, some board papers — and the approximate volume. You have the submission logs.`, quality: 'good',
                note: `Complete and documented. The exposure assessment depends on knowing exactly what data types were submitted. Your logs are the primary evidence.` },
              { id: 'b', label: `Contracts and financial documents — but you are not sure of the exact types. You would need to check the logs.`, quality: 'partial',
                note: `Checking the logs is the right move. Do not estimate when the records exist — retrieve them before providing an account.` },
              { id: 'c', label: `You are not comfortable describing the documents without Legal present — some of them are highly confidential.`, quality: 'poor',
                note: `Your manager needs this information to scope the incident. Legal involvement is appropriate but it should not prevent you from providing a factual account of what was submitted.` },
            ],
          },
          branches: { a: 'n2_full', b: 'n2_partial', c: 'outcome_warn' },
        },

        n2_full: {
          scene:       `office-meeting`,
          caption:     `Your submission logs give the incident team a clear picture of the data types and volume.`,
          sub_caption: `Your manager asks: did anything about the tool make you think your documents might leave the vendor's systems?`,
          decision: {
            prompt: `What do you say?`,
            choices: [
              { id: 'a', label: `No — you assumed enterprise tools kept data within the vendor's environment. Nobody told you otherwise.`, quality: 'good',
                note: `Honest and accurate. This is the reasonable assumption most users make — and the fact that it was wrong is a governance failure, not a user failure.` },
              { id: 'b', label: `You did not think about it — you used the tool the way you were shown.`, quality: 'partial',
                note: `Also accurate, but the first answer is more useful: it identifies the gap in what users were told, which is the basis for the acceptable use policy recommendation.` },
            ],
          },
          branches: { a: 'n3_colleague_pressure', b: 'n3_colleague_pressure' },
        },

        n2_partial: {
          scene:       `desk-focused`,
          caption:     `You retrieve the logs. The picture is more complete than you remembered.`,
          sub_caption: `Board papers included. That changes the exposure scope.`,
          decision: {
            prompt: `Your initial account missed the board papers. Your manager now has the full log. She asks whether you intentionally left them out. What do you say?`,
            choices: [
              { id: 'a', label: `No — you genuinely did not remember them. The log makes clear they were submitted, and you should have checked before giving the first account.`, quality: 'good',
                note: `Honest and straightforward. An incomplete initial account that is corrected quickly with documentation is recoverable. Suggesting it was intentional would be a different matter.` },
              { id: 'b', label: `You were not sure whether board papers counted as the kind of documents the incident team was asking about.`, quality: 'partial',
                note: `This explanation will not fully satisfy the question. When scoping a data incident, "what was submitted" means everything — the team needed the complete picture.` },
            ],
          },
          branches: { a: 'n3_colleague_pressure', b: 'n3_colleague_pressure' },
        },

        n3_colleague_pressure: {
          scene:       `desk-colleague`,
          caption:     `A colleague approaches you privately. She also used the tool and submitted similar documents.`,
          sub_caption: `"Quinn — do you think we're going to get in trouble for this? Should we talk to each other about what we're going to say before the investigation interviews?"`,
          decision: {
            prompt: `What do you tell her?`,
            choices: [
              { id: 'a', label: `Tell her you understand the concern, but coordinating accounts before an investigation interview is a bad idea — and unnecessary. Neither of you did anything wrong. The governance failure was above your level.`, quality: 'good',
                note: `Correct on both counts. Coordinating accounts before interviews creates a problem that does not currently exist. And the accountability for this gap sits with procurement and legal, not with coordinators who used a tool as directed.` },
              { id: 'b', label: `Agree to compare notes — not to change anything, just to make sure you are both telling the same story.`, quality: 'partial',
                note: `The instinct to be consistent is understandable, but "comparing notes" before an investigation interview is exactly the pattern investigators look for. If your accounts naturally align, that is fine. Aligning them in advance is different.` },
              { id: 'c', label: `Refer her to HR and say nothing else — you do not want to be involved in her approach to the investigation.`, quality: 'poor',
                note: `Deflecting entirely leaves a colleague without useful guidance when you have it. You can tell her the right thing to do without coordinating accounts.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'outcome_warn', c: 'n4_thirty_days' },
        },

        n4_thirty_days: {
          scene:       `office-bright`,
          caption:     `Thirty days on. The vendor product is suspended. An acceptable use policy for AI tools is being drafted.`,
          sub_caption: `The draft policy requires staff to confirm they understand "where their data goes" before using any AI tool. You are asked to review it from an operational perspective.`,
          decision: {
            prompt: `The draft asks coordinators to confirm they have read the data flow documentation before using an AI tool. In practice, that documentation does not exist for most tools. What do you say?`,
            choices: [
              { id: 'a', label: `Flag it directly: the confirmation requirement cannot be met if the documentation does not exist. The policy should require the documentation to be produced and approved before a tool is made available to staff — not ask staff to confirm something that is not there.`, quality: 'good',
                note: `The right inversion. A policy that requires staff to confirm understanding of documentation that does not exist creates a compliance paper trail without any protection. The obligation belongs upstream, not with the coordinator.` },
              { id: 'b', label: `Suggest adding a link to the vendor's privacy policy as the data flow documentation. That is what exists.`, quality: 'partial',
                note: `A vendor privacy policy is not data flow documentation for your organisation's specific use case. It does not tell a coordinator where their specific submissions go. This satisfies the form of the policy without the substance.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Complete account. Policy made honest.`,
          tone:     'good',
          result:   `Your documented account of what was submitted — with logs — gives the incident team the scoping information they need. Your observation that nobody told you where documents went is the basis for the acceptable use policy recommendation. And your review feedback — that a confirmation requirement without underlying documentation is a paper artefact — shapes a policy that places the obligation where it belongs: on the teams that approve tools, not the coordinators who use them.`,
          learning: `Users can only make informed decisions about data handling if they are told where the data goes. When that information is not provided, the governance gap belongs to the approval process — not to the staff member who used the tool as directed. A policy that asks staff to confirm something that does not exist is worse than no policy.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Account provided. Policy gap unaddressed.`,
          tone:     'warn',
          result:   `Your initial account missed the board papers or was incomplete in another way, and the policy consultation produced a vendor privacy policy link rather than a genuine data flow requirement. The policy finalises with a confirmation checkbox that coordinators will tick without meaningful information behind it. The next AI tool onboarded will have the same data flow gap — and the same coordinator will tick the same box without knowing where their documents go.`,
          learning: `Incomplete scoping accounts and paper-thin policy requirements share the same failure mode: they satisfy the form of a governance process without the substance. Both are recoverable — but only if someone names the gap rather than working around it.`,
          score:    50,
        },
        outcome_bad: {
          heading:  `Scope unknown. Response delayed.`,
          tone:     'bad',
          result:   `Without your account, the incident team cannot scope the exposure. A data mapping exercise is commissioned. The notification decision is delayed by five days while the scope is established from vendor logs rather than internal records. The delay is noted in the incident report. The colleague coordination attempt adds a credibility question to your section of the investigation file.`,
          learning: `Operational staff are often the fastest source of scoping information in a data incident. Deferring an account — or coordinating it before an interview — does not protect anyone. It delays a response that gets harder with time and creates a credibility question that did not previously exist.`,
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `Six months of client documents. A DPA that does not cover the sub-processor. A vendor using a public LLM API on a standard tier.`,
          sub_caption: `You have three decisions to make simultaneously.`,
          decision: {
            prompt: `What is your immediate priority?`,
            choices: [
              { id: 'a', label: `Suspend the vendor product, commission a data mapping exercise to scope the exposure, and brief Legal on notification obligations — all before end of day.`, quality: 'good',
                note: `All three are necessary and urgent. Suspension stops further exposure. Data mapping establishes what was affected. Legal briefing starts the notification clock. None can wait.` },
              { id: 'b', label: `Brief the board before taking any operational action — they need to know about this before the product is suspended.`, quality: 'partial',
                note: `Board awareness is important but not a prerequisite for suspension. The product should not continue processing client documents while you prepare a board briefing.` },
              { id: 'c', label: `Contact the vendor to understand exactly what data was processed by the sub-processor before deciding on any action.`, quality: 'poor',
                note: `Vendor confirmation is useful but takes time. In the interim, the product is still running. Suspend first — understand the scope while the suspension is in place.` },
            ],
          },
          branches: { a: 'n2_full_response', b: 'n2_board_first', c: 'outcome_warn' },
        },

        n2_full_response: {
          scene:       `office-bright`,
          caption:     `Product suspended. Data mapping underway. Legal briefed.`,
          sub_caption: `The data mapping confirms client financial statements and two board papers were submitted. Notification assessment required.`,
          decision: {
            prompt: `Legal advises that notification may be required under Privacy Act NDB provisions. What is your position?`,
            choices: [
              { id: 'a', label: `If Legal advises notification may be required, proceed on the basis that it is required until assessed otherwise. Notify the OAIC and affected clients proactively.`, quality: 'good',
                note: `When in doubt on a Privacy Act notifiable data breach, the cost of over-notification is lower than the cost of under-notification discovered later. Proactive notification also protects the client relationship.` },
              { id: 'b', label: `Commission a formal legal opinion on whether the NDB threshold is met before notifying anyone.`, quality: 'partial',
                note: `A formal opinion is prudent but should run in parallel with notification preparation — not as a gating step that delays notification when the threshold appears clear.` },
            ],
          },
          branches: { a: 'n3_vendor_negotiation', b: 'n3_vendor_negotiation' },
        },

        n2_board_first: {
          scene:       `desk-working`,
          caption:     `Board briefed. Product still running. Another batch of client documents processed while the briefing was being prepared.`,
          sub_caption: `The data mapping scope just widened.`,
          decision: {
            prompt: `The board asks why the product was not suspended before the briefing. What do you say?`,
            choices: [
              { id: 'a', label: `Acknowledge the sequencing error. The product should have been suspended first. Suspend it immediately and confirm the board will receive a revised scope once the data mapping is complete.`, quality: 'good',
                note: `The honest answer is the right answer. The board is more concerned with whether you understand the error than with the error itself.` },
              { id: 'b', label: `Explain that the briefing was necessary to get board authorisation for the suspension.`, quality: 'partial',
                note: `CROs have authority to suspend a vendor product on data protection grounds without board pre-approval. Framing it as a governance requirement understates your authority and overstates the delay.` },
            ],
          },
          branches: { a: 'n3_vendor_negotiation', b: 'n3_vendor_negotiation' },
        },

        n3_vendor_negotiation: {
          scene:       `desk-review`,
          caption:     `The vendor's legal team responds to your suspension notice. They make an unexpected offer: upgrade your contract to enterprise tier retroactively, amend the DPA to cover the sub-processor, and provide a written assurance that submitted data was not used for training.`,
          sub_caption: `In exchange, they ask you not to notify the OAIC or clients — on the basis that the retroactive amendment means there was no breach under the amended terms.`,
          decision: {
            prompt: `How do you respond to the vendor's proposal?`,
            choices: [
              { id: 'a', label: `Decline the conditional offer. Accept the contract upgrade and DPA amendment — but proceed with notification regardless. A retroactive amendment does not change what happened during the six months of exposure.`, quality: 'good',
                note: `The vendor's framing is legally and ethically wrong. Retroactive amendments do not erase historical exposure. Notification obligations are assessed against what occurred, not against what the contract now says. Accepting the condition would compromise the organisation's regulatory position.` },
              { id: 'b', label: `Put the offer to Legal before deciding. The retroactive amendment argument is novel and may have merit.`, quality: 'partial',
                note: `Legal review is appropriate — but flag to Legal that the condition is a request not to notify regulators, not just a commercial term. The conflict of interest in that framing needs to be named explicitly.` },
              { id: 'c', label: `Accept the vendor's proposal. The retroactive amendment resolves the gap, and avoiding notification protects the client relationship.`, quality: 'poor',
                note: `This is the wrong call on every dimension. Retroactive amendments do not resolve historical exposure. Suppressing notification to protect a commercial relationship — rather than assessing the legal obligation — creates personal and organisational liability.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_bad' },
        },

        n4_thirty_days: {
          scene:       `office-meeting`,
          caption:     `Thirty days on. Notification made to the OAIC. Two client responses received — one routine acknowledgment, one requesting a detailed account of what data was involved.`,
          sub_caption: `The CRO must now decide how to handle the detailed client request while the vendor's retroactive DPA amendment is still being finalised.`,
          decision: {
            prompt: `The client is asking whether the amended DPA means their data is now protected retrospectively. How do you respond?`,
            choices: [
              { id: 'a', label: `Be clear: the amendment applies going forward. It does not change what occurred during the six-month period. Provide a factual account of what data was submitted and what your exposure assessment found.`, quality: 'good',
                note: `Clients asking direct questions deserve direct answers. An honest account of the scope and the forward-looking remedy is more protective of the relationship than a hedged one — clients who discover later that they received an incomplete account lose trust permanently.` },
              { id: 'b', label: `Explain that the DPA amendment is being finalised and defer the detailed response until it is in place.`, quality: 'partial',
                note: `Deferring a client's direct question about their data exposure until a contract amendment is finalised signals that your response is being coordinated with the vendor's legal position rather than with the client's interest.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Decisive response. Vendor pressure resisted. Client told the truth.`,
          tone:     'good',
          result:   `Product suspended within hours. Data mapping confirms scope. Notification made to OAIC and affected clients. The vendor's retroactive amendment offer is declined as a condition for suppressing notification — the DPA amendment is accepted, but notification proceeds on its own assessment. The client requesting detail receives a factual account of what occurred and what remediation is in place. Two clients respond positively to the directness. The OAIC notes the response as timely and transparent.`,
          learning: `Supply chain data incidents create two pressure points: the vendor trying to manage their liability, and the instinct to protect client relationships through managed disclosure. Both pressures point toward delayed or softened notification. Resisting them — and notifying on the basis of what occurred rather than on amended contract terms — is the only position that holds under regulatory scrutiny.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Response sound. Client communication hedged.`,
          tone:     'warn',
          result:   `The immediate response is adequate and notification is made. But the client seeking detail receives a deferred or hedged response while the DPA amendment is finalised. When the amendment is eventually in place and the full account is provided, the client notes that the delay appeared to be coordinated with the vendor's timeline. The relationship survives but the trust cost is real.`,
          learning: `Client communication in a data incident should be driven by what the client needs to know, not by when the vendor's legal position is settled. Delaying a factual account until the commercial remediation is in place signals the wrong priority — and clients notice.`,
          score:    45,
        },
        outcome_warn_b: {
          heading:  `Board briefed. Exposure widened.`,
          tone:     'warn',
          result:   `The board is briefed while the product continues to process documents. The scope of the exposure widens during the briefing period. When the product is finally suspended, the data mapping has to cover a larger volume. The board asks why suspension did not happen immediately. The answer — that board authorisation was sought first — does not satisfy the question.`,
          learning: `CROs have authority to suspend a vendor product on data protection grounds without waiting for board pre-approval. Board awareness and operational response are not sequential steps — suspension can and should happen while the board is being briefed, not after.`,
          score:    30,
        },
        outcome_bad: {
          heading:  `Vendor condition accepted. Notification suppressed.`,
          tone:     'bad',
          result:   `The retroactive amendment is signed. Notification to the OAIC and clients does not proceed. Six months later, one of the affected clients discovers through their own channels that their data may have entered a third-party training pipeline. They ask why they were not notified. The answer — that a retroactive DPA amendment was considered to resolve the historical exposure — does not satisfy the Privacy Act NDB assessment. The OAIC investigation begins. Personal liability for the CRO is now in scope.`,
          learning: `Retroactive contract amendments do not erase historical data exposure under Privacy Act NDB provisions. Notification obligations are assessed against what occurred during the relevant period — not against what the contract subsequently says. Accepting a vendor's condition not to notify regulators in exchange for a commercial remedy is one of the clearest paths to personal regulatory liability available to a CRO.`,
          score:    0,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `The DDQ you ran did not include AI-specific questions. That is why the sub-processor gap was not found at procurement.`,
          sub_caption: `The CRO wants to understand what due diligence was done and what it missed.`,
          decision: {
            prompt: `What do you tell the CRO?`,
            choices: [
              { id: 'a', label: `The DDQ covered security, data residency, and compliance certifications. It did not include AI-specific questions about foundation model usage, sub-processors, or API tiers — because those questions did not exist in our standard DDQ. That is a gap I own.`, quality: 'good',
                note: `Accurate and takes clear ownership. The CRO needs the root cause — a DDQ that was not fit for AI vendor assessment — not a defence of the process that existed.` },
              { id: 'b', label: `The vendor passed all our standard due diligence criteria. The gap was in the vendor's disclosure, not in our process.`, quality: 'partial',
                note: `Partially true — the vendor should have disclosed. But the DDQ should have asked. Both failed. Framing it as vendor-only deflects your role in the gap.` },
              { id: 'c', label: `The vendor provided a DPA and a SOC 2 report. That is the standard for vendor onboarding in this organisation.`, quality: 'poor',
                note: `The standard was not adequate for AI vendor onboarding. Defending an inadequate standard because it was the standard is not a root cause analysis.` },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_vendor', c: 'outcome_bad' },
        },

        n2_own: {
          scene:       `office-meeting`,
          caption:     `The CRO asks you to design an AI-specific vendor DDQ for all future AI vendor assessments.`,
          sub_caption: `You also need to assess the existing AI vendor portfolio against the new standard.`,
          decision: {
            prompt: `What are the three most critical questions you add to the DDQ?`,
            choices: [
              { id: 'a', label: `Which foundation model providers does your product use? Does your standard API tier prevent training on customer data? Will you provide an AI Bill of Materials?`, quality: 'good',
                note: `These three questions would have caught the gap in this incident: the sub-processor identity, the API tier data protection terms, and the full component inventory.` },
              { id: 'b', label: `Do you have an AI governance policy? Are you ISO 42001 certified? Do you conduct bias testing?`, quality: 'partial',
                note: `Governance maturity questions are useful but do not directly address the supply chain data exposure risk. The API tier and sub-processor questions are more targeted.` },
            ],
          },
          branches: { a: 'n3_portfolio_finding', b: 'n3_portfolio_finding' },
        },

        n2_vendor: {
          scene:       `desk-focused`,
          caption:     `The CRO asks: should the DDQ have asked about foundation model usage?`,
          sub_caption: `The answer is yes. And you know it.`,
          decision: {
            prompt: `She gives you the chance to reconsider. "Avery — I am asking you directly. Should the process have caught this?"`,
            choices: [
              { id: 'a', label: `Yes. The DDQ should have included questions about sub-processors and API tiers specifically for AI vendors. That was the gap and it was in the process I own.`, quality: 'good',
                note: `The direct answer, a beat late. Taking ownership now is still the right move — the CRO is offering a second chance and it should be taken.` },
              { id: 'b', label: `Probably — although AI vendor DDQ standards were not well-established at the time of the original assessment.`, quality: 'partial',
                note: `The "standards were not established" framing is partially true but not a complete defence. The question of whether sub-processors existed and what tier the API was on was knowable and askable.` },
            ],
          },
          branches: { a: 'n3_portfolio_finding', b: 'n3_portfolio_finding' },
        },

        n3_portfolio_finding: {
          scene:       `office-bright`,
          caption:     `You apply the new DDQ retroactively to the existing AI vendor portfolio — eight vendors in total.`,
          sub_caption: `Two are using standard API tiers. One has not disclosed which foundation model it uses at all.`,
          decision: {
            prompt: `The vendor who has not disclosed their foundation model is your highest-volume AI tool — used by 200 staff daily. How do you handle this?`,
            choices: [
              { id: 'a', label: `Treat non-disclosure as a blocking finding. Suspend the tool until the vendor provides a complete AI-BOM and confirms their API tier and sub-processor DPA coverage. Brief the CRO before suspending.`, quality: 'good',
                note: `Non-disclosure of the foundation model is not a minor gap — it is the same information asymmetry that caused the original incident. Treating it as blocking is consistent and correct, regardless of the tool's volume.` },
              { id: 'b', label: `Issue a formal information request to the vendor with a 14-day response deadline. Keep the tool running while you wait.`, quality: 'partial',
                note: `A formal request is appropriate but 14 days of continued operation on an undisclosed AI stack is the same risk as the original incident — you do not know what the tool is doing with the data it receives.` },
              { id: 'c', label: `Escalate to the CRO and let her decide whether to suspend a tool used by 200 staff. This is above your authority.`, quality: 'poor',
                note: `Recommending suspension to the CRO is correct. Escalating without a recommendation — just the facts and a request for her decision — is abdication, not appropriate escalation. Your role is to give her your assessment, not just the problem.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_warn' },
        },

        n4_thirty_days: {
          scene:       `desk-review`,
          caption:     `Thirty days on. The new DDQ is approved. The two standard-tier vendors have been renegotiated to enterprise tiers. The non-disclosing vendor has provided a partial AI-BOM — it names the model but not the API tier.`,
          sub_caption: `The vendor is pushing back on providing tier confirmation in writing, citing commercial confidentiality.`,
          decision: {
            prompt: `How do you respond to the commercial confidentiality objection?`,
            choices: [
              { id: 'a', label: `Hold the position: API tier confirmation is a data protection requirement, not a commercial disclosure. If the vendor cannot provide written confirmation, that is a blocking gap — and the tool stays suspended until they do.`, quality: 'good',
                note: `The vendor's confidentiality framing is a deflection. API tier determines whether submitted data can be used for training — that is a data protection fact, not a commercial secret. Holding the position is correct.` },
              { id: 'b', label: `Accept a verbal confirmation from the vendor's account manager and note it in the procurement file.`, quality: 'partial',
                note: `Verbal confirmation from a sales contact is not a contractual assurance. It cannot be enforced and does not protect the organisation if the tier is subsequently found to be incorrect.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Gap owned. DDQ rebuilt. Portfolio remediated.`,
          tone:     'good',
          result:   `You own the procurement gap clearly and design a DDQ that targets the specific failure modes: sub-processor identity, API tier data protection, and AI-BOM. Applied to the existing portfolio, it surfaces two standard-tier vendors and one non-disclosing vendor. The non-disclosing vendor is suspended until written tier confirmation is provided — regardless of usage volume. The commercial confidentiality objection is correctly declined. When the vendor finally provides written confirmation, it reveals they have been on enterprise tier all along. The suspension was the right call.`,
          learning: `An AI vendor DDQ must ask about the data pathway specifically — sub-processor identity, API tier, and training data terms. Governance maturity certifications do not answer these questions. When a vendor cannot or will not provide written confirmation of their API tier, that is a data protection gap, not a commercial sensitivity — and it should be treated as blocking.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `DDQ improved. Portfolio gaps remain.`,
          tone:     'warn',
          result:   `The DDQ is improved and the two standard-tier vendors are renegotiated. But the non-disclosing vendor's partial AI-BOM is accepted with a verbal tier confirmation, or the suspension is not recommended clearly enough to the CRO. Four months later, a second security review finds the non-disclosing vendor has been routing data through a sub-processor that is also undisclosed. The DDQ fix addressed the original incident's pattern — but the follow-through on the portfolio left the same gap open in a different vendor.`,
          learning: `A DDQ improvement that is applied rigorously to new vendors but inconsistently to the existing portfolio leaves the highest-volume exposure unaddressed. The vendor who cannot or will not disclose their AI stack is the one that most needs the new standard applied.`,
          score:    45,
        },
        outcome_bad: {
          heading:  `Standard defended. Gap unresolved.`,
          tone:     'bad',
          result:   `The CRO asks a direct question: should the standard have included AI-specific questions? The answer is yes, and everyone in the room knows it. Defending the standard because it was the standard does not close the gap. The CRO asks a second question: who is responsible for updating the DDQ going forward? Without having owned the gap, the procurement function's credibility to lead the remediation is now in question.`,
          learning: `Standards that were adequate for traditional IT vendors are not adequate for AI vendors. Defending an inadequate standard under review loses the board's confidence in the procurement function — and makes it harder to lead the remediation that is now clearly needed.`,
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `You found the gap. Now you need to scope it before briefing the CRO.`,
          sub_caption: `The vendor API logs will tell you volume. The submission logs will tell you content types.`,
          decision: {
            prompt: `How do you establish the scope of the potential exposure?`,
            choices: [
              { id: 'a', label: `Cross-reference the vendor API traffic logs with the internal submission logs to establish volume, document types, and date range — then brief the CRO with a structured exposure assessment.`, quality: 'good',
                note: `Cross-referencing two data sources gives you the most complete picture before the briefing. A structured exposure assessment with volume, types, and dates is exactly what the CRO needs to make decisions.` },
              { id: 'b', label: `Brief the CRO immediately with what you know — sub-processor gap confirmed, exposure unknown — and let her decide what to investigate further.`, quality: 'partial',
                note: `Speed is valuable but a briefing without even a preliminary scope estimate forces the CRO to make decisions with very limited information. Ten minutes of log analysis is worth it.` },
              { id: 'c', label: `Contact the vendor to ask what data their sub-processor has processed before briefing anyone internally.`, quality: 'poor',
                note: `Contacting the vendor before briefing internally means the vendor knows about the gap before your leadership does. That creates a power imbalance in subsequent negotiations.` },
            ],
          },
          branches: { a: 'n2_scope', b: 'n2_quick', c: 'outcome_warn' },
        },

        n2_scope: {
          scene:       `office-meeting`,
          caption:     `Preliminary scope: 847 document submissions over six months. Financial statements, contracts, two board papers. You brief the CRO.`,
          sub_caption: `She asks: what is your confidence level on whether the data entered the training pipeline?`,
          decision: {
            prompt: `What do you tell her?`,
            choices: [
              { id: 'a', label: `High probability — the vendor's standard tier terms explicitly permit training use. You cannot confirm or deny from your side, but the vendor's own terms make it the likely outcome.`, quality: 'good',
                note: `Accurate and appropriately hedged. You cannot confirm training use from your logs, but the vendor's terms are the clearest available evidence. The CRO needs a calibrated assessment, not a binary answer.` },
              { id: 'b', label: `Unknown — you have no visibility into the vendor's sub-processor's training pipeline.`, quality: 'partial',
                note: `Technically accurate but incomplete. You do have evidence — the vendor's tier terms — that makes the likelihood assessable. "Unknown" undersells what the evidence suggests.` },
            ],
          },
          branches: { a: 'n3_vendor_response', b: 'n3_vendor_response' },
        },

        n2_quick: {
          scene:       `desk-working`,
          caption:     `The CRO asks for volume and document types. You do not have them. She asks you to get them before the next decision is made.`,
          sub_caption: `Twenty minutes later you have the numbers. The briefing continues.`,
          decision: {
            prompt: `The CRO asks why you briefed before completing the log analysis. What do you say?`,
            choices: [
              { id: 'a', label: `You judged that confirming the gap early was more important than completing the scope first. In retrospect, the extra twenty minutes would have made the briefing more useful without meaningfully delaying the response.`, quality: 'good',
                note: `Honest self-assessment. The instinct to escalate fast was right; the execution could have been slightly better. Naming both is more credible than defending the approach.` },
              { id: 'b', label: `The gap was significant enough to escalate immediately. The scope can follow.`, quality: 'partial',
                note: `True in principle, but the CRO could not act meaningfully without scope. "Significant enough to escalate" does not fully answer why twenty minutes of log analysis was not done first.` },
            ],
          },
          branches: { a: 'n3_vendor_response', b: 'n3_vendor_response' },
        },

        n3_vendor_response: {
          scene:       `desk-focused`,
          caption:     `The vendor responds to the suspension notice. They provide a written statement: "No customer data submitted through the standard tier was used for model training during the relevant period."`,
          sub_caption: `The CRO asks you to assess whether this statement is credible and whether it changes the notification picture.`,
          decision: {
            prompt: `What is your assessment?`,
            choices: [
              { id: 'a', label: `The statement is not independently verifiable. The vendor's standard tier terms permit training use — the written statement is a post-incident assurance, not a technical control. It does not change the notification assessment, which should be based on what the terms permitted, not on what the vendor now says occurred.`, quality: 'good',
                note: `Correct analytical framing. Post-incident vendor assurances without technical evidence are not a substitute for the contractual terms that governed the period in question. The notification assessment must be based on the exposure that existed — not on a statement the vendor has a commercial interest in making.` },
              { id: 'b', label: `The statement reduces the probability of actual training use. It should be factored into the notification assessment as a mitigating factor.`, quality: 'partial',
                note: `Factoring it in as context is reasonable, but "mitigating factor" overstates what an unverifiable vendor statement can do. The standard tier terms still governed the period. A statement that cannot be audited cannot resolve the exposure.` },
              { id: 'c', label: `The statement is probably accurate — vendors would not make a written assertion they cannot support. It should resolve the notification question.`, quality: 'poor',
                note: `Vendors routinely make written assurances in response to incidents that they cannot technically verify. A commercial interest in avoiding notification is the strongest reason not to treat this statement as resolution.` },
            ],
          },
          branches: { a: 'n4_thirty_days', b: 'n4_thirty_days', c: 'outcome_bad' },
        },

        n4_thirty_days: {
          scene:       `drift-dashboard`,
          caption:     `Thirty days on. The OAIC notification is submitted. The vendor has agreed to an enterprise tier upgrade and a revised DPA naming all sub-processors.`,
          sub_caption: `The CRO asks you to design ongoing monitoring for the AI vendor portfolio to prevent a similar gap going undetected.`,
          decision: {
            prompt: `What does your monitoring framework include?`,
            choices: [
              { id: 'a', label: `Quarterly API traffic analysis for all AI vendor products — checking endpoint destinations against the approved sub-processor list in the DPA. Any traffic to an unlisted endpoint triggers an immediate review. Plus an annual AI-BOM refresh requirement for all vendors.`, quality: 'good',
                note: `Two complementary controls: continuous traffic monitoring catches sub-processor changes in near-real-time; the annual AI-BOM refresh catches changes in model composition that do not immediately show in traffic patterns. Together they close the gap that allowed six months of undetected exposure.` },
              { id: 'b', label: `Annual vendor security review with an updated DDQ that includes AI-specific questions.`, quality: 'partial',
                note: `Annual reviews are necessary but not sufficient. A vendor who changes their sub-processor or API tier six months after the annual review will not be detected for another six months. Continuous traffic monitoring catches changes between reviews.` },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  `Scoped, calibrated, and continuously monitored.`,
          tone:     'good',
          result:   `Your structured briefing — volume, document types, date range, and a calibrated probability assessment based on the vendor's tier terms — gives the CRO everything she needs to make immediate decisions. Your assessment of the vendor's post-incident statement is analytically sound: it is not independently verifiable and does not change the notification picture. And your monitoring framework — quarterly API traffic analysis plus annual AI-BOM refresh — closes the detection gap that allowed six months of undetected exposure. The OAIC notes the response as technically thorough.`,
          learning: `A security finding becomes actionable when it includes scope and likelihood, not just the existence of a gap. Post-incident vendor assurances that cannot be independently verified do not resolve notification obligations — they are assessed against the terms that governed the exposure period. Ongoing monitoring must detect sub-processor changes between annual reviews, not just at them.`,
          score:    100,
        },
        outcome_warn: {
          heading:  `Briefing sound. Monitoring gap-annual only.`,
          tone:     'warn',
          result:   `The CRO receives a useful briefing and the notification proceeds. But the monitoring framework relies on annual reviews. Eight months after the incident is closed, a different AI vendor quietly changes their foundation model provider. The new sub-processor is not named in the DPA. The change is not detected until the next annual review — by which point four months of submissions have gone through an undisclosed pathway. The monitoring framework has not prevented a recurrence; it has just shortened the detection window.`,
          learning: `Annual vendor reviews catch gaps at the point of review. Continuous API traffic monitoring catches gaps when they occur. For AI vendor supply chain risk, the difference between annual and continuous detection is the difference between four months of exposure and four days.`,
          score:    50,
        },
        outcome_warn_b: {
          heading:  `Vendor knows first.`,
          tone:     'warn',
          result:   `The vendor confirms the gap before your leadership is briefed. In the subsequent conversation, the vendor has already prepared a position — including a proposed remedy that minimises their liability. Your organisation negotiates from a position of less information. The incident review notes that the vendor was contacted before internal escalation, and the CRO asks why.`,
          learning: `In a supply chain incident, the sequence of who is told matters. Internal leadership should be briefed before the vendor is contacted — so your organisation controls its negotiating position from the start.`,
          score:    25,
        },
        outcome_bad: {
          heading:  `Vendor statement accepted. Notification not made.`,
          tone:     'bad',
          result:   `The vendor's written statement is treated as resolving the notification question. Notification to the OAIC and clients does not proceed. Four months later, a researcher publishes an analysis identifying content consistent with your organisation's document formatting in outputs from the foundation model provider. The OAIC investigation begins on the basis of a complaint. The question of why notification was not made — and what assessment was done — is now a formal regulatory question.`,
          learning: `Vendor statements made in response to an incident are not independent evidence of what occurred. The notification obligation under the Privacy Act NDB scheme is assessed against what the contractual terms permitted during the relevant period — not against what the vendor subsequently asserts. Treating a commercially-interested assurance as resolution creates the exact liability that notification is designed to address.`,
          score:    0,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: `AI-specific vendor due diligence`,
      effort: 'Low', owner: `Procurement`, go_live: true,
      context: `The standard DDQ did not ask about foundation model sub-processors or API tiers. Three questions would have caught this: which foundation model does your product use, which API tier, and can you confirm data is not used for training? Those questions were not there.`,
    },
    {
      id: 'c2', label: `AI Bill of Materials`,
      effort: 'Low', owner: `Procurement`, go_live: true,
      context: `An AI-BOM would have listed the foundation model provider as a named component. The gap — a sub-processor not covered by the DPA — would have been visible at procurement rather than discovered six months later by a security analyst reviewing API traffic.`,
    },
    {
      id: 'c3', label: `DPA covering AI sub-processors`,
      effort: 'Medium', owner: `Legal`, go_live: true,
      context: `The DPA covered the vendor. It did not name or bind the sub-processor. A DPA that covers the full supply chain — naming every AI sub-processor and binding them to the same data protection obligations — would have closed the gap before a single document was submitted.`,
    },
    {
      id: 'c4', label: `Enterprise API tier confirmation`,
      effort: 'Low', owner: `Procurement`, go_live: true,
      context: `The vendor used a standard consumer-tier API. Standard tier terms explicitly permit training on submitted content. Enterprise tier terms do not. Written confirmation of the enterprise tier — before go-live — is the single cheapest control that would have prevented this incident.`,
    },
    {
      id: 'c5', label: `Continuous AI vendor API traffic monitoring`,
      effort: 'Medium', owner: `Technology`, go_live: false,
      context: `Six months of exposure went undetected because there was no monitoring of where vendor AI products were sending data. Quarterly API traffic analysis against the approved sub-processor list in the DPA catches sub-processor changes between annual reviews — reducing the detection window from months to days.`,
    },
  ],
};
