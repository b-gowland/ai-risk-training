// G5 — The Registry That Wasn't
// Excessive Agency & Uncontrolled Action Chains
//
// Setting: A large organisation has deployed AI agents across 8 business units
// over 18 months. Each unit deployed independently. A governance analyst
// discovers that collectively the agents have unrestricted file server read,
// email sending capability, write access to the customer database, and access
// to the vendor payment API. Three specific agent pairs could produce:
// external transmission of employee PII, unauthorised customer record
// modification, and vendor payments without dual-approval.
//
// Differentiation from g4-ai-safety:
//   G4 is a single agent that took a catastrophic irreversible action.
//   G5 is about the systemic pattern across an organisation — no single agent
//   has done something obviously wrong. The risk is the aggregate: no policy,
//   no registry, no chain analysis. The finding is structural, not incident-driven.
//   Controls are enterprise-level (policy, registry, chain analysis) not
//   deployment-level (kill switch, approval gate). Advanced difficulty.

export const scenario = {
  id:                `g5-excessive-agency`,
  risk_ref:          `G5`,
  title:             `The Registry That Wasn't`,
  subtitle:          `Excessive Agency & Uncontrolled Agentic Action Chains`,
  domain:            `G — Systemic & Societal`,
  difficulty:        `Advanced`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-g-systemic/g5-excessive-agency`,
  estimated_minutes: 14,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Governance Analyst`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `You mapped what the AI agents in your organisation can actually do. The picture is worse than anyone expected.`,
      premise:   `You joined the AI governance team three months ago. Your first task: build an AI agent registry. You started by asking each of the eight business units what agents they had deployed and what permissions they had. The responses were inconsistent — some detailed, some vague. You spent six weeks cross-checking with IT access logs and API call records. What you found: collectively, the deployed agents have unrestricted read access to the employee file server, email sending capability on behalf of six business functions, write access to the customer database, and calls to the external vendor payment API. No single agent has all four. But three specific pairs of agents, if they operated on a related task, could produce combinations that amount to: external transmission of employee PII, unauthorised customer record modification, and vendor payments without dual-approval. You have 45 days before a regulatory examination.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Chief Risk Officer`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `Your governance analyst has just briefed you. Eight AI agents. No enterprise policy. Three risk chains that could produce regulatory incidents. Forty-five days.`,
      premise:   `The governance analyst's briefing is brief and stark: the organisation has been deploying AI agents for 18 months without an enterprise policy governing what those agents may do autonomously. Each business unit made its own decisions. No capability registry existed until now. The analyst has identified three specific risk chains — sequences of permitted actions by different agent pairs that could produce prohibited outcomes: external PII transmission, unauthorised customer record modification, and vendor payments without dual-approval. None of the three has happened. All three are technically permitted by existing configurations. The regulatory examination is in 45 days. You need to decide what to do — and in what order.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `AI Programme Manager`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You've been coordinating AI deployments across eight business units. You thought you had a handle on what was out there. The registry says otherwise.`,
      premise:   `You've been the central coordination point for AI deployments across the organisation for 18 months. You tracked project timelines, stakeholder sign-offs, and go-live dates. What you did not track: what specific capabilities each agent was given. That was left to individual technical teams. The governance analyst has now produced an inventory. You're looking at it for the first time: eight agents, capability sets documented, three risk chains identified. The question you're being asked is: how should remediation be sequenced in 45 days? You have no enterprise policy to apply, no standard for what "fixed" looks like. You need to decide how to build one fast enough to be meaningful before the examination.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Technology Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You reviewed three of the eight AI agent deployments. Your risk assessments covered access controls and data security. They did not cover action chain analysis. That gap is now visible.`,
      premise:   `You completed technology risk assessments for three of the eight AI agents in the organisation — the vendor payment integration, the customer service agent, and the HR document processor. Your assessments covered data classification, access control adequacy, and API security. Looking at them now, you notice what they don't contain: any analysis of what sequences of permitted actions could produce prohibited outcomes. "Action chain analysis" isn't in your standard risk assessment template. The governance analyst has now produced that analysis and identified three risk chains. One of them runs through an agent you approved. The regulatory examination is in 45 days. You need to determine what a retrospective action chain assessment should include, and whether any of the chains you're now responsible for require immediate technical remediation before the examination.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-review`,
          caption:     `You've finished the registry. Eight agents. Three risk chains. The findings are technically accurate — but you're a junior analyst presenting to the CRO in two hours.`,
          sub_caption: `No individual agent has done anything wrong. The risk is in the combinations.`,
          decision: {
            prompt: `How do you frame the finding for the CRO?`,
            choices: [
              { id: `a`, label: `Lead with the three specific risk chains — name the agents involved, the data at risk, and the regulatory consequence if a chain fires`, quality: `good`,
                note: `The CRO needs to understand the specific exposure, not an abstract governance gap. Naming the chains makes the risk concrete and actionable. This is also the accurate framing — the risk is three specific chains, not a general control weakness.` },
              { id: `b`, label: `Lead with the governance gap — no enterprise policy, no registry, no chain analysis — and present the risk chains as evidence of why that matters`, quality: `partial`,
                note: `The governance framing is correct, but the CRO's immediate need is to understand what the organisation is exposed to in 45 days. Lead with the exposure, then explain the root cause.` },
              { id: `c`, label: `Present the full registry first so the CRO understands the complete picture before you get to the risk findings`, quality: `poor`,
                note: `An eight-agent inventory table is not how you open a 45-day risk briefing. The CRO needs the risk finding first. The registry is supporting evidence, not the lead.` },
            ],
          },
          branches: { a: `n2_chains`, b: `n2_governance`, c: `n2_registry` },
        },

        n2_chains: {
          scene:       `office-meeting`,
          caption:     `You brief the CRO on the three chains: PII transmission, customer record modification, vendor payment without dual-approval. The CRO asks one question: which of the three is most urgent?`,
          sub_caption: `All three are technically permitted. None has fired yet.`,
          decision: {
            prompt: `Which chain do you recommend prioritising for immediate technical remediation?`,
            choices: [
              { id: `a`, label: `The vendor payment chain — unsanctioned financial transactions are the most immediate regulatory and financial exposure`, quality: `good`,
                note: `Vendor payments without dual-approval directly violate financial controls and payment authorisation frameworks. This chain has the clearest direct financial consequence and the most certain regulatory finding. It should be the first technical fix.` },
              { id: `b`, label: `The PII transmission chain — external data exfiltration is the most visible to regulators and the hardest to explain`, quality: `partial`,
                note: `PII transmission is serious and regulators will focus on it. But the dual-approval payment chain is more immediately fixable — limiting which agent can initiate payment API calls is a simpler technical change than overhauling email permissions across six business functions.` },
              { id: `c`, label: `The customer record modification chain — data integrity issues affect the most people and are the hardest to reverse`, quality: `partial`,
                note: `Record modification integrity matters, but financial control failures tend to attract the most direct regulatory consequence. The payment chain should be first.` },
            ],
          },
          branches: { a: `n3_payment`, b: `n3_pii`, c: `outcome_warn` },
        },

        n2_governance: {
          scene:       `office-meeting`,
          caption:     `The CRO listens to the governance framing. Then asks: "What's the worst thing that could happen in the next 45 days?" You pivot to the risk chains.`,
          sub_caption: `Good instinct from the CRO. The exposure, not the framework gap, is what needs to be on the table.`,
          decision: {
            prompt: `The CRO wants to understand the most urgent chain. Which do you flag?`,
            choices: [
              { id: `a`, label: `The vendor payment chain — unsanctioned financial transactions are the most certain regulatory finding`, quality: `good`,
                note: `Correct prioritisation. The payment chain is the most immediately consequential and technically fixable. PII and record modification are also serious but require more complex remediation.` },
              { id: `b`, label: `All three are equally urgent — you can't prioritise without knowing which agents are currently active and processing related tasks`, quality: `partial`,
                note: `Reasonable caution, but the CRO needs a prioritisation. "Equally urgent" is not an actionable answer. The payment chain is the clearest immediate priority on financial control grounds.` },
            ],
          },
          branches: { a: `n3_payment`, b: `outcome_warn` },
        },

        n2_registry: {
          scene:       `desk-review`,
          caption:     `You walk the CRO through the eight-agent inventory. By the time you get to the risk chains, you've used 40 minutes of a 60-minute slot.`,
          sub_caption: `The CRO now understands the full picture — but the meeting ends before you've discussed remediation sequencing.`,
          decision: {
            prompt: `The CRO asks for a follow-up brief focused on the risk chains and remediation. What's your first step?`,
            choices: [
              { id: `a`, label: `Produce a one-page chain summary: which agents, what data, what happens if it fires, what fixes it`, quality: `good`,
                note: `This is the right output — the CRO needs a decision-ready brief, not a longer version of what you already presented. One page, three chains, technical fix for each.` },
              { id: `b`, label: `Start with the enterprise policy draft — the chains are a symptom and the policy is the cure`, quality: `poor`,
                note: `Policy development is important but takes weeks. The examination is in 45 days. Technical chain remediation is faster and more directly addresses the examiner's concern.` },
            ],
          },
          branches: { a: `n3_payment`, b: `outcome_bad` },
        },

        n3_payment: {
          scene:       `analyst-desk`,
          caption:     `You've identified the vendor payment chain as the priority. The chain runs through two agents: the AP automation agent and the vendor data enrichment agent. The fix requires limiting which agent can initiate payment API calls.`,
          sub_caption: `45 days. The technical fix is straightforward. The policy documentation is not.`,
          decision: {
            prompt: `IT can implement the technical fix in a week. What do you prioritise in the remaining time?`,
            choices: [
              { id: `a`, label: `Document the enterprise agentic action classification policy — the registry and technical fixes are evidence it's working, but the policy is what the examiner will ask to see`, quality: `good`,
                note: `Regulators examine governance frameworks, not just incident records. A documented policy that classifies autonomous action tiers (autonomous / approval-required / prohibited) shows the organisation has a systematic approach — not just a reactive fix.` },
              { id: `b`, label: `Extend the chain analysis to cover all eight agents systematically — find any additional chains before the examiner does`, quality: `partial`,
                note: `Important, but if the three identified chains aren't technically fixed and documented first, additional chains only deepen the exposure. Fix first, then extend analysis.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

        n3_pii: {
          scene:       `analyst-desk`,
          caption:     `You've flagged PII transmission as the priority. The chain is more complex — it runs through agents that have legitimate email access across six business functions. Limiting it without breaking legitimate workflows takes two to three weeks minimum.`,
          sub_caption: `The vendor payment chain could have been fixed in a week.`,
          decision: {
            prompt: `While the PII remediation is underway, the CRO asks what can be done immediately. What do you recommend?`,
            choices: [
              { id: `a`, label: `Implement a monitoring alert for any agent email sending to external domains — not a fix, but a detection layer while the structural fix is built`, quality: `good`,
                note: `Correct. A detective control while the preventive control is being built is the right interim step. It also gives you evidence to show the examiner that the risk is being actively managed.` },
              { id: `b`, label: `Suspend all agent email permissions immediately until the fix is complete`, quality: `partial`,
                note: `Effective, but potentially disruptive to legitimate workflows across six business functions. The monitoring approach is less disruptive and still provides evidence of active risk management.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Systemic risk surfaced, prioritised, and remediated`,
          tone:     `good`,
          score:    92,
          result:   `The vendor payment chain is technically fixed within the first week. The enterprise agentic action classification policy — three tiers, autonomous/approval-required/prohibited — is drafted, reviewed by Legal, and signed off by the CRO in 30 days. The regulatory examination finds a registry, a policy, and documented remediation. The examiner notes the organisation identified and addressed the gap proactively.`,
          learning: `Excessive agency risk is architectural, not behavioural. No individual agent did anything wrong. The exposure was in the aggregate capability set and the absence of an enterprise policy to govern it. The registry was the foundation — once you could see what was deployed, you could see the chains. The policy was the fix — not just for the chains you found, but for every agent deployed after.`,
        },
        outcome_good: {
          heading:  `Risk chains identified and partially remediated`,
          tone:     `good`,
          score:    74,
          result:   `The most urgent technical fixes are implemented. The extended chain analysis surfaces one additional risk chain. The enterprise policy is drafted but not fully signed off before the examination. The examiner notes active remediation is underway and the organisation's governance posture has improved significantly since the registry was built.`,
          learning: `Getting the technical fixes right matters more than getting the policy perfect in 45 days. A partial policy with full chain analysis and documented fixes is a stronger showing than a complete policy with unresolved chains still open.`,
        },
        outcome_warn: {
          heading:  `Partial response — governance gap remains visible`,
          tone:     `warn`,
          score:    52,
          result:   `Some technical remediation is completed. The enterprise policy is not in place. The examiner notes that the organisation identified the risk chains but did not implement a systematic governance response. The finding is recorded as a control weakness requiring remediation within 90 days of the examination.`,
          learning: `Individual technical fixes without a policy framework tell the examiner you found the fire and put it out — but not that you've installed smoke detectors. The policy is what demonstrates systemic governance, not just reactive remediation.`,
        },
        outcome_bad: {
          heading:  `Governance gap unresolved — examination finding`,
          tone:     `bad`,
          score:    28,
          result:   `The examination finds no enterprise policy, an incomplete registry, and no documented remediation of the identified risk chains. The finding is significant: three specific risk chains remain technically possible, no governance framework governs autonomous action across the organisation's deployed agents. Remediation is required within 60 days under the examiner's direction.`,
          learning: `The governance analyst did the hardest part — building the registry and identifying the chains. The failure was in not converting that finding into a structured remediation plan fast enough. The registry without the policy and the fixes is evidence of a problem found but not resolved.`,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom`,
          caption:     `The governance analyst's briefing is on your desk. Eight agents. Three risk chains. No enterprise policy. Forty-five days to the regulatory examination.`,
          sub_caption: `No chain has fired. All three are technically possible.`,
          decision: {
            prompt: `Your first decision: what is the immediate organisational response?`,
            choices: [
              { id: `a`, label: `Convene a cross-functional response team: Legal, Technology, Risk, and the three business units whose agents are in the risk chains`, quality: `good`,
                note: `The right move. The three risk chains span multiple functions — remediation decisions need input from the functions affected. A cross-functional team also signals to the examiner that the response was organised, not ad hoc.` },
              { id: `b`, label: `Escalate to the board immediately — this is material risk and they should be informed before remediation decisions are made`, quality: `partial`,
                note: `Board escalation may be appropriate eventually, but 45 days before an examination is not the moment to pause remediation for a board briefing cycle. Inform the board in parallel; don't make board notification the gate for action.` },
              { id: `c`, label: `Task IT to suspend all agent operations until the risk chains are assessed and cleared`, quality: `poor`,
                note: `Blanket suspension would be operationally disruptive and likely disproportionate — five of the eight agents have no identified risk chains. The response should be targeted, not total.` },
            ],
          },
          branches: { a: `n2_response`, b: `n2_board`, c: `n2_suspend` },
        },

        n2_response: {
          scene:       `office-meeting`,
          caption:     `The cross-functional team convenes. Three business units are in the room. Legal and Technology have reviewed the chain analysis. The payment chain is identified as the most urgent fix.`,
          sub_caption: `The team agrees on the technical priority. The policy question is harder.`,
          decision: {
            prompt: `The enterprise agentic action classification policy doesn't exist. What's your directive?`,
            choices: [
              { id: `a`, label: `Commission Legal and Risk to produce a draft policy within two weeks — classify action types into three tiers: autonomous, approval-required, prohibited`, quality: `good`,
                note: `The three-tier classification (autonomous / approval-required / prohibited) is the standard from OWASP LLM06 and NIST AI RMF. Two weeks is achievable and leaves 30 days for sign-off and documentation before the examination.` },
              { id: `b`, label: `Apply the existing financial controls framework to agent actions — dual-approval requirements already exist for payments, extend them to agent-initiated actions`, quality: `partial`,
                note: `Pragmatic for the payment chain specifically, but financial controls don't map cleanly to agent action types across domains. A dedicated agentic action policy is needed in addition to extending payment controls.` },
            ],
          },
          branches: { a: `n3_policy`, b: `outcome_good` },
        },

        n2_board: {
          scene:       `boardroom`,
          caption:     `You brief the board. They are appropriately concerned. They ask for a full report in 30 days. The remediation clock is running.`,
          sub_caption: `The board notification was correct. But the 30-day report cycle has consumed a third of your available time.`,
          decision: {
            prompt: `You need to begin remediation immediately. What do you direct while the board report is prepared?`,
            choices: [
              { id: `a`, label: `Direct the cross-functional team to begin technical remediation of the payment chain immediately — don't wait for the board report`, quality: `good`,
                note: `Correct. Board reporting and technical remediation are parallel tracks, not sequential. The payment chain fix can be implemented in a week — there's no reason to hold it pending the board report.` },
              { id: `b`, label: `Wait for the board's direction before proceeding — they are the appropriate decision authority for an organisation-wide risk response`, quality: `poor`,
                note: `The board is not the right decision authority for the technical remediation of specific agent capability chains. That is an operational decision within the CRO's authority. Waiting 30 days creates material additional risk.` },
            ],
          },
          branches: { a: `n3_policy`, b: `outcome_bad` },
        },

        n2_suspend: {
          scene:       `office-briefing-urgent`,
          caption:     `IT suspends all eight agents. Three business units report operational disruption within two hours. The legal team flags that two of the suspended agents are required to meet contractual SLAs.`,
          sub_caption: `The response was disproportionate. You need to restore service to unaffected agents quickly.`,
          decision: {
            prompt: `How do you manage the fallout?`,
            choices: [
              { id: `a`, label: `Restore the five agents with no identified risk chains immediately and conduct targeted review of the three in the chains`, quality: `good`,
                note: `Correct. Targeted response proportionate to identified risk. Restoring the five clean agents addresses the SLA and operational concerns while maintaining focus on the actual risk.` },
              { id: `b`, label: `Keep all agents suspended until the enterprise policy is complete — consistency is more important than operational disruption`, quality: `poor`,
                note: `Enterprise policy development takes weeks. Suspending all agents for that duration is operationally untenable and legally problematic given the SLA exposure. Proportionate targeted response is the right approach.` },
            ],
          },
          branches: { a: `n3_policy`, b: `outcome_bad` },
        },

        n3_policy: {
          scene:       `desk-report`,
          caption:     `The payment chain is fixed. The policy draft is in review. The examination is in 15 days. The analyst asks: should the registry and the chain analysis be included in the examination pack?`,
          sub_caption: `You could present only the policy and the fixes. Or you could present the full picture — registry, chains found, chains fixed, policy now in place.`,
          decision: {
            prompt: `What do you include in the examination pack?`,
            choices: [
              { id: `a`, label: `Full picture: registry built, chains identified, chains remediated, policy drafted — the proactive identification is the story`, quality: `good`,
                note: `Correct. Regulators respond well to organisations that find and fix their own problems. The registry and chain analysis are evidence of a functioning governance process, not just evidence of risk found. Lead with the proactive identification.` },
              { id: `b`, label: `Policy and technical fixes only — presenting the chains found could be read as an admission of prior control failure`, quality: `poor`,
                note: `Withholding the registry and chain analysis from the examination pack would be strategically counterproductive. The examiner will likely find the same issues independently. Proactive disclosure is always the better regulatory strategy.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_warn` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Proactive governance response recognised`,
          tone:     `good`,
          score:    90,
          result:   `The examination finds a functioning governance response: registry built, risk chains identified and remediated, enterprise policy in place. The examiner notes the organisation identified and addressed the gap without an incident trigger. The examination closes with no material findings. The regulatory relationship is strengthened.`,
          learning: `The best regulatory outcome is not "no problems found" — it is "problems found, addressed, and documented by the organisation itself." The registry and chain analysis, presented proactively, are evidence of governance maturity, not admission of failure.`,
        },
        outcome_good: {
          heading:  `Risk remediated, policy partially complete`,
          tone:     `good`,
          score:    72,
          result:   `Technical remediation is complete. The enterprise policy is drafted but not fully signed off at examination time. The examiner notes active progress and records a minor finding: agentic action classification policy to be finalised within 60 days. No material findings on the chains themselves.`,
          learning: `A draft policy with documented intent and active remediation is materially better than no policy. The examination outcome is acceptable, but the policy sign-off should not have been the last item on the list.`,
        },
        outcome_warn: {
          heading:  `Partial response — gaps remain visible`,
          tone:     `warn`,
          score:    48,
          result:   `The examination finds some remediation completed but a governance response that is incomplete. The policy is not in place. The examiner records a significant finding: enterprise-wide agentic action governance is absent. Remediation required within 90 days under regulatory direction.`,
          learning: `A technically-fixed chain without a policy framework tells the examiner you managed the incident but haven't addressed the systemic gap. The policy is the examiner's signal that the organisation has a repeatable process, not just a reactive response.`,
        },
        outcome_bad: {
          heading:  `Governance failure confirmed at examination`,
          tone:     `bad`,
          score:    22,
          result:   `The examination finds an organisation that identified a significant agentic governance gap and failed to respond effectively. No enterprise policy. Partial technical remediation. The examiner records a material finding. Regulatory engagement intensifies. The board is formally notified by the regulator.`,
          learning: `Waiting for the board or suspending all operations without a targeted response both fail in the same way: they substitute process for action. The risk was specific and time-bound. The response needed to be proportionate and fast.`,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ──────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `You've been coordinating AI deployments for 18 months. You tracked timelines. You didn't track capability sets. The registry the analyst built shows what you missed.`,
          sub_caption: `Eight agents. Three risk chains. A programme you coordinated produced this.`,
          decision: {
            prompt: `The CRO asks you to lead the remediation programme. Your first step?`,
            choices: [
              { id: `a`, label: `Build the remediation sequencing plan: technical chain fixes in week one, policy draft in weeks two to four, documentation complete by day 40`, quality: `good`,
                note: `A sequenced plan with milestones is the right starting point. Technical fixes have fixed timelines; policy development can run in parallel. Day 40 leaves five days before the examination for review and final documentation.` },
              { id: `b`, label: `Start with root cause analysis — understand how 18 months of deployments happened without a capability registry before you commit to a remediation plan`, quality: `partial`,
                note: `Root cause analysis is important for prevention, but it shouldn't delay remediation. Run root cause in parallel with the technical fixes, not before them.` },
              { id: `c`, label: `Require all eight business units to conduct their own agent assessments — they own the deployments, they should own the remediation`, quality: `poor`,
                note: `Business unit ownership is appropriate for long-term governance, but the 45-day window requires central coordination. Decentralising the response at this point risks inconsistent quality and missed deadlines.` },
            ],
          },
          branches: { a: `n2_plan`, b: `n2_rca`, c: `n2_decentral` },
        },

        n2_plan: {
          scene:       `desk-focused`,
          caption:     `The remediation plan is agreed. Week one: vendor payment chain fix. Weeks two to four: enterprise policy draft. Day 40: documentation complete. You're coordinating five teams across three business units.`,
          sub_caption: `The payment chain fix is straightforward. The policy is where the complexity lives.`,
          decision: {
            prompt: `The policy needs to classify actions into three tiers. Who leads the classification work?`,
            choices: [
              { id: `a`, label: `Legal and Risk co-lead, with Technology validating that the classifications are technically implementable`, quality: `good`,
                note: `Legal and Risk own the governance framework; Technology needs to confirm that the tier assignments can be enforced technically. This is the right split — governance design with technical reality-check built in.` },
              { id: `b`, label: `Technology leads — they know what the agents can do and what the technical constraints are`, quality: `partial`,
                note: `Technology understanding is essential, but Legal and Risk need to own the policy. A Technology-led classification may be technically accurate but miss regulatory obligation mapping. The governance functions need to be in the lead.` },
            ],
          },
          branches: { a: `n3_policy`, b: `outcome_good` },
        },

        n2_rca: {
          scene:       `desk-review`,
          caption:     `Root cause analysis runs for two weeks. Finding: no standard capability assessment was required as part of the AI deployment approval process. Technical teams made capability decisions independently.`,
          sub_caption: `The finding is correct. But two weeks are gone.`,
          decision: {
            prompt: `You have 23 days left. How do you allocate the remaining time?`,
            choices: [
              { id: `a`, label: `Technical fixes first, then policy — you can still get both done in 23 days if you move fast`, quality: `good`,
                note: `23 days is tight but achievable for the payment chain fix and a first-draft policy. Technical fix in a week, policy in two weeks, one week for documentation. It works if nothing slips.` },
              { id: `b`, label: `Focus on the policy — it's the systemic fix and the root cause analysis gives you the evidence to write a credible one`, quality: `partial`,
                note: `The policy is important, but the examiner will also want to see the risk chains technically addressed. A policy without technical remediation of the identified chains is incomplete.` },
            ],
          },
          branches: { a: `n3_policy`, b: `outcome_warn` },
        },

        n2_decentral: {
          scene:       `office-meeting`,
          caption:     `Three of the eight business units don't complete their assessments. The remaining five are inconsistent — different formats, different levels of detail. The risk chains are not formally addressed in any of the unit-level assessments.`,
          sub_caption: `45 days in. No remediation complete. Examination in two weeks.`,
          decision: {
            prompt: `You need to recover the programme. What do you do?`,
            choices: [
              { id: `a`, label: `Centralise immediately — take back coordination, implement the payment chain fix directly, start the policy draft today`, quality: `good`,
                note: `The right recovery move. Centralise, move fast on the highest-priority technical fix, and produce a policy draft that shows the examination the organisation has a systematic response.` },
              { id: `b`, label: `Request a two-week extension from the regulator`, quality: `poor`,
                note: `Regulatory examination dates are not negotiated. There is no mechanism to request an extension for an examination that the organisation has not yet disclosed its governance gap to. This is not a realistic option.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

        n3_policy: {
          scene:       `desk-report`,
          caption:     `The enterprise agentic action classification policy is drafted: Tier 1 autonomous, Tier 2 approval-required, Tier 3 prohibited. Legal has reviewed it. The CRO has signed off. You have five days before the examination.`,
          sub_caption: `The vendor payment chain is fixed. The policy is signed. The registry is complete.`,
          decision: {
            prompt: `What goes in the examination pack?`,
            choices: [
              { id: `a`, label: `Registry, chain analysis, remediation log, and signed policy — the full governance story from identification to fix`, quality: `good`,
                note: `This is the complete governance narrative: gap identified, analysed, remediated, and prevented from recurring. Regulatory examiners are looking for exactly this arc. Present it in full.` },
              { id: `b`, label: `Policy and remediation log only — presenting the registry and chains could create unnecessary focus on the gap that existed`, quality: `poor`,
                note: `Withholding the registry and chain analysis is counterproductive. If the examiner reconstructs the timeline independently, the absence of proactive disclosure damages the relationship. The full story is stronger than a partial one.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_warn` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Remediation programme delivered on time`,
          tone:     `good`,
          score:    88,
          result:   `The examination finds a completed remediation programme: registry, chain analysis, technical fixes, and a signed enterprise policy. The programme is cited as an example of effective AI governance response. The CRO notes that the root cause — no capability standard in the deployment approval process — has been corrected. Future deployments will require a documented capability assessment as a gate.`,
          learning: `The programme you coordinated for 18 months lacked one critical process: capability assessment at deployment approval. Adding that gate — requiring every new agent deployment to document its capability set against the enterprise action classification policy — closes the structural gap that produced the risk chains.`,
        },
        outcome_good: {
          heading:  `Core risk addressed, policy partially complete`,
          tone:     `good`,
          score:    70,
          result:   `Technical remediation is complete. The policy is drafted but the tier classification for three action types is still under Legal review at examination time. The examiner notes progress and records a minor finding: policy finalisation required within 60 days.`,
          learning: `Technology-led classification produced technically accurate tier assignments, but the Legal review cycle extended beyond the examination window. Building Legal into the classification process from the start would have produced the same output faster.`,
        },
        outcome_warn: {
          heading:  `Programme partially delivered`,
          tone:     `warn`,
          score:    50,
          result:   `Some technical remediation complete. Policy in draft but not signed. The examination finds the response credible but incomplete. Minor finding recorded.`,
          learning: `The root cause analysis was valuable, but sequencing it before remediation cost two weeks. The right sequence is: fix what can be fixed immediately, then understand why it happened. Never let root cause block technical remediation.`,
        },
        outcome_bad: {
          heading:  `Programme stalled — examination finds governance gap unresolved`,
          tone:     `bad`,
          score:    24,
          result:   `Decentralised response failed. Risk chains unresolved at examination. No enterprise policy in place. Material finding. Regulatory direction to remediate within 60 days under examiner oversight.`,
          learning: `Decentralising a 45-day remediation programme across eight business units with no standard and no enforcement is a programme management failure. The timeline required central coordination, not distributed ownership. The right time to decentralise is when the enterprise policy exists and the governance framework is established.`,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `You approved three of the eight AI agent deployments. One of them is in a risk chain. Your risk assessment template has no action chain analysis section.`,
          sub_caption: `The gap isn't in your assessment of that specific agent. It's in your assessment methodology.`,
          decision: {
            prompt: `Where do you start?`,
            choices: [
              { id: `a`, label: `Run an action chain analysis for the three agents you assessed — identify whether any combinations produce prohibited outcomes beyond the one already identified`, quality: `good`,
                note: `Correct first step. You are responsible for the assessments you produced. Understanding the full chain exposure across your three agents is your professional obligation before escalating to the enterprise level.` },
              { id: `b`, label: `Escalate immediately to the enterprise risk function — this is an organisation-wide problem, not something one analyst can resolve`, quality: `partial`,
                note: `Escalation is correct, but you need to bring more than the problem — you need to bring an analysis of your own assessments first. "I found a gap in my methodology and here's the chain analysis I've now completed" is more credible than "there's a problem."` },
              { id: `c`, label: `Review your risk assessment template and fix the methodology — the root cause is the missing action chain analysis section`, quality: `poor`,
                note: `Template improvement is important for future assessments, but it doesn't address the current chains from past assessments. Fix the immediate risk first, then fix the methodology.` },
            ],
          },
          branches: { a: `n2_chain_analysis`, b: `n2_escalate`, c: `n2_template` },
        },

        n2_chain_analysis: {
          scene:       `analyst-desk-privacy`,
          caption:     `You work through the chain analysis for your three agents. The vendor payment agent is in the identified chain. You find one additional partial chain in the HR document processor — it can read employee PII and has an internal reporting API, but cannot send externally. Lower severity.`,
          sub_caption: `Four potential chains identified across your assessments. One high severity. One lower.`,
          decision: {
            prompt: `How do you present this to the enterprise risk function?`,
            choices: [
              { id: `a`, label: `Present both chains, their severity differences, and your recommended control for each — the higher-severity chain first`, quality: `good`,
                note: `Correct framing. Two chains, differentiated by severity, with control recommendations. The enterprise risk function needs to understand not just what you found but what the right response is. Leading with severity ordering is the correct analytical approach.` },
              { id: `b`, label: `Present only the high-severity chain — the partial chain is within acceptable risk tolerance and doesn't need escalation`, quality: `partial`,
                note: `Reasonable judgment, but partial chains should still be documented even if they don't require escalation. The registry should reflect all identified chains, including those below escalation threshold.` },
            ],
          },
          branches: { a: `n3_methodology`, b: `outcome_good` },
        },

        n2_escalate: {
          scene:       `office-meeting`,
          caption:     `You escalate to the enterprise risk function. They ask you to complete a chain analysis for your three assessments before the next meeting. You're back to where you should have started.`,
          sub_caption: `The escalation was correct. The sequence wasn't.`,
          decision: {
            prompt: `You now have three agent chain analyses to complete. What's your approach?`,
            choices: [
              { id: `a`, label: `Start with the vendor payment agent — it's already in an identified chain, so your analysis will either confirm or extend what's known`, quality: `good`,
                note: `Starting with the known chain is efficient — you're building on existing analysis, not starting from scratch. Confirm the identified chain, check for extensions, then move to the other two agents.` },
              { id: `b`, label: `Analyse all three simultaneously — you can't prioritise without knowing what the other two contain`, quality: `partial`,
                note: `Parallel analysis is less efficient than sequential analysis starting from the known risk. The vendor payment agent's chain is already identified — your contribution is to confirm or extend it, which is faster than a full cold-start analysis.` },
            ],
          },
          branches: { a: `n3_methodology`, b: `outcome_good` },
        },

        n2_template: {
          scene:       `desk-focused`,
          caption:     `You revise the risk assessment template. It takes five days. The enterprise risk programme is underway without your chain analysis input.`,
          sub_caption: `The template fix is correct for future assessments. It doesn't help with the current examination risk.`,
          decision: {
            prompt: `You've finished the template. Now what?`,
            choices: [
              { id: `a`, label: `Apply the new template retrospectively to your three assessments — produce chain analyses for all three before the examination`, quality: `good`,
                note: `Correct. Five days for template development is recoverable if you immediately produce the retrospective analyses. The examination pack needs your chain analysis for all three agents you assessed.` },
              { id: `b`, label: `Brief the enterprise risk function on the template improvement — the methodology fix is the most important contribution you can make`, quality: `poor`,
                note: `The methodology improvement matters, but the chain analyses for the three agents you assessed are more urgent. The examination is in 45 days. The template can be briefed after the chains are documented.` },
            ],
          },
          branches: { a: `n3_methodology`, b: `outcome_warn` },
        },

        n3_methodology: {
          scene:       `desk-report`,
          caption:     `You've completed the chain analyses for your three agents. You've identified the high-severity payment chain and a lower-severity partial chain. The enterprise risk function has both analyses. You've also revised the risk assessment template.`,
          sub_caption: `Your contribution: chain analysis for past assessments and a corrected template for future ones.`,
          decision: {
            prompt: `The enterprise policy is being drafted. What should the action chain analysis requirement look like?`,
            choices: [
              { id: `a`, label: `Mandatory for every new agentic system deployment — enumerate all possible action sequences, classify as autonomous/approval-required/prohibited, document in the AI Register`, quality: `good`,
                note: `This is the correct standard. The requirement needs to be mandatory (not optional), applied at deployment (not retrospectively), and documented in the AI Register (so it's auditable). This is exactly what the G5 controls framework specifies.` },
              { id: `b`, label: `Required only for agents with external communication capability — internal-only agents have lower risk`, quality: `partial`,
                note: `External communication capability is a higher-risk indicator, but internal-only agents can still produce prohibited outcomes through record modification, privilege escalation, or access to other systems. The requirement should apply to all agentic systems.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Methodology gap found, chain analyses complete, standard strengthened`,
          tone:     `good`,
          score:    86,
          result:   `Your chain analyses confirm the high-severity payment chain and identify a lower-severity partial chain. Both are documented in the examination pack. The revised risk assessment template is adopted as the enterprise standard. The action chain analysis requirement — mandatory, at deployment, documented in the AI Register — is incorporated into the enterprise policy. Future agentic deployments will be assessed against a methodology that closes the gap your earlier assessments missed.`,
          learning: `The gap in your methodology wasn't a personal failure — action chain analysis didn't exist as a standard when you wrote the template. The failure would have been not updating the methodology once the gap became visible. Retrospective application to past assessments and mandatory prospective application to future ones is the complete response.`,
        },
        outcome_good: {
          heading:  `Chain analyses complete, methodology partially updated`,
          tone:     `good`,
          score:    68,
          result:   `Your chain analyses are complete and in the examination pack. The template update applies the action chain analysis requirement only to agents with external communication capability. The examiner notes the requirement is narrower than recommended and queries whether the scope should be broader. A widening of the requirement is agreed post-examination.`,
          learning: `Scoping the action chain analysis requirement narrowly is understandable as a first step, but the examination found it incomplete. The requirement should cover all agentic systems — the attack surface of internal-only agents is smaller but not zero.`,
        },
        outcome_warn: {
          heading:  `Methodology improved, chain analyses incomplete`,
          tone:     `warn`,
          score:    46,
          result:   `The template is improved, but the chain analyses for your three assessed agents are incomplete at examination time. The examiner notes that two of the three agents you assessed have no chain analysis documentation. The enterprise risk function flags that your contribution to the examination pack is below what was expected.`,
          learning: `Fixing the methodology without applying it retrospectively is like installing a smoke detector and not checking whether the fire is still burning. The retrospective analyses for your three agents were the most time-critical output.`,
        },
        outcome_bad: {
          heading:  `No chain analysis produced — examination gap widened`,
          tone:     `bad`,
          score:    26,
          result:   `No chain analyses for your three assessed agents are produced before the examination. The examiner finds that three of the eight agents have no chain analysis documentation — all three were approved by you. The methodology gap is recorded as a personal competency finding as well as a systemic governance finding.`,
          learning: `The enterprise risk function can manage the systemic governance gap. Your specific responsibility was the three agents you assessed. Not producing chain analyses for them leaves a gap in the examination record that the enterprise response cannot cover.`,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Enterprise agentic action classification policy`,
      effort:  `Medium`,
      owner:   `Risk / Legal`,
      go_live: true,
      context: `No enterprise policy governed what AI agents could do autonomously across the organisation. The three risk chains were all technically permitted because no tier classification existed. The policy — autonomous / approval-required / prohibited — is the foundational control. Without it, each new agent deployment makes its own capability decisions in isolation.`,
    },
    {
      id:      `c2`,
      label:   `AI agent capability registry`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The risk chains were invisible until the registry was built. Eight agents deployed over 18 months with no central inventory of what they could do. The registry was the prerequisite for everything else — chain analysis, remediation sequencing, policy drafting, and examination preparation all depended on knowing what was deployed.`,
    },
    {
      id:      `c3`,
      label:   `Action chain analysis at design`,
      effort:  `Medium`,
      owner:   `Security`,
      go_live: true,
      context: `No individual agent violated its permissions. The three risk chains required two agents operating on related tasks. Action chain analysis — enumerating what sequences of permitted actions across deployed agents could produce prohibited outcomes — is the control that catches this class of risk. It must be conducted at design time for each new agent, not retrospectively.`,
    },
    {
      id:      `c4`,
      label:   `Capability assessment gate in deployment approval`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The root cause was structural: no capability assessment was required as part of AI deployment approval. Technical teams made capability decisions independently. Adding a mandatory capability documentation step to the deployment approval gate — aligned to the enterprise action classification policy — prevents new agents from being deployed without a record of what they can do.`,
    },
  ],
};
