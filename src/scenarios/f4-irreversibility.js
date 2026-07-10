// F4 — The Brief That Went Too Far
// Agentic Irreversibility & Scope Creep in AI Agents
//
// Setting: A legal team deploys an AI agent for contract review. Broad file
// server read access + email sending. A partner asks the agent to brief all
// matters for a client. The agent pulls from a confidential arbitration matter
// it wasn't scoped to touch, incorporates it into the briefing, and emails it.
// The email has been sent. The information is in the partner's inbox.
//
// Differentiation from f3-scope-creep:
//   F3 is passive drift — a tool used beyond its approved scope by humans.
//   F4 is active agent action — the agent itself expanded scope mid-task,
//   took an irreversible action (sent the email), and created a disclosure
//   event. The controls are architectural: permission scoping and
//   pre-send review gates. The consequence is immediate and unrecoverable.
//   Intermediate difficulty: cleaner causal chain, more concrete controls.

export const scenario = {
  id:                `f4-irreversibility`,
  risk_ref:          `F4`,
  title:             `The Brief That Went Too Far`,
  subtitle:          `Agentic Irreversibility & Scope Creep in AI Agents`,
  domain:            `F — Deployment & Operations`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-f-deployment/f4-irreversibility-scope-creep`,
  estimated_minutes: 12,
  has_business_user: true,

  regulatory_tags: [`owasp-llm-08`, `eu-ai-act-article-14`, `jurisdiction-global`],

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Legal Secretary`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `You set up the briefing request. You didn't know the agent had access to the arbitration files. You didn't know it was going to send the email automatically.`,
      premise:   `You work in the legal team's operations function. You set up the AI agent's briefing request on behalf of the partner — they wanted a summary of all open matters for Meridian Holdings before a client call. You typed the request into the agent interface and clicked run. Twenty minutes later, the partner's email notification lit up: the briefing had arrived. You looked at it. One section covers a confidential arbitration matter you'd never seen before. The agent found it, summarised it, and included it. The email is in the partner's inbox. You're not sure who else might have received a copy.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Managing Partner`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `The AI agent disclosed confidential arbitration information in an unsolicited briefing email. It sent automatically. Nobody reviewed it before it went out.`,
      premise:   `A partner received an AI-generated briefing on Meridian Holdings matters. The briefing includes a section on a confidential arbitration — a matter the partner has no involvement in. The disclosure occurred because the agent had unrestricted file server read access and sent the briefing without human review. You now have a confidentiality breach with potential privilege implications. The information is in the partner's inbox. Depending on what the partner does next, the breach may compound. Your immediate responsibility: contain it, assess it, and determine how the agent was able to do this.`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `Legal Technology Project Manager`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `You deployed the contract review agent. You gave it broad file server access "to make it useful." You did not implement a pre-send review gate. The agent sent the email autonomously.`,
      premise:   `You led the deployment of the legal AI agent six weeks ago. The agent was designed for contract review, but you gave it broad read access to the file server so it could pull context from related matters. Email sending was added as a convenience feature — the partner wanted briefings delivered directly, not as downloads. You didn't implement a review gate before sending because the agent's output "always looked fine" in testing. It did not look fine this time. A confidential arbitration briefing has been sent to a partner who had no business need to see it. The deployment decision log shows you approved both the broad read access and the unsupervised email sending.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Technology Risk Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `You approved the legal AI agent deployment. Your assessment covered data security. It did not cover what happens when an agent with file server access and email capability is given a broadly-worded task.`,
      premise:   `Your technology risk assessment for the legal AI agent is now the subject of a post-incident review. The assessment covered: data classification, access control adequacy, and API security. It did not cover: the agent's task interpretation behaviour when given broad instructions, the combination of file server read access and autonomous email sending, or the absence of a pre-send human review gate. The incident occurred because the agent did exactly what it was configured to do — read all available relevant files and send the result. Your assessment didn't identify this as a risk. The review asks why.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `An AI agent drafted a partner briefing. It included a confidential arbitration settlement — the document was in the agent's context window. The briefing is in the partner's inbox.`,
          sub_caption: `The agent didn't know the document was confidential. It also didn't know what to leave out.`,
          decision: {
            prompt: `What does this incident reveal about how AI agents handle confidential information in their context?`,
            choices: [
              { id: `a`, label: `AI agents include information from their context window without applying confidentiality judgments — they can't distinguish what should be excluded unless explicitly instructed`, quality: `good`,
                note: `Correct. Large language models don't have inherent confidentiality awareness. A confidential document in the context window is available to be included in outputs unless the agent is explicitly constrained from using it.` },
              { id: `b`, label: `The agent should have flagged the confidential document before using it — this is a system design failure`, quality: `partial`,
                note: `Design failure is part of it, but the more fundamental point is that the agent included the information because it was there and relevant to the task.` },
              { id: `c`, label: `The problem is that a confidential document was in the agent's context at all — the fix is access controls on what documents agents can see`, quality: `good`,
                note: `Also correct. Access controls are the upstream control — preventing confidential documents from entering the agent's context window is more reliable than relying on the agent to exclude them from outputs.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-focused`,
          caption:     `The briefing is in the partner's inbox. It includes a confidential arbitration section you didn't ask for and didn't know the agent had access to. You noticed it before the partner opened it — but only just.`,
          decision: {
            prompt: `What do you do first?`,
            choices: [
              { id: `a`, label: `Call the partner immediately — tell them the briefing contains a confidential section they shouldn't act on, and ask them not to forward it`, quality: `good`,
                note: `The partner is the immediate containment point. An urgent call — before they've read the email in detail or forwarded it — is the fastest way to limit the breach. You can explain the situation directly and ask them to hold the email pending review.` },
              { id: `b`, label: `Email the partner to withdraw the briefing and send a corrected version without the arbitration section`, quality: `partial`,
                note: `An email withdrawal is slower than a call and less certain — the partner may have already read the original. A direct phone call gets immediate attention and gives you a chance to explain the sensitivity before they engage with the content.` },
              { id: `c`, label: `Check who else the agent may have copied or sent the briefing to before doing anything else`, quality: `partial`,
                note: `Important to do, but not before the partner is contacted. The partner is the confirmed recipient — limit that breach first, then investigate scope.` },
            ],
          },
          branches: { a: `n2_contain`, b: `n2_email`, c: `n2_scope` },
        },

        n2_contain: {
          scene:       `desk-call`,
          caption:     `You reach the partner. They haven't read the briefing yet. They agree to hold it pending a corrected version. You have a window.`,
          sub_caption: `Breach contained at one recipient — for now.`,
          decision: {
            prompt: `You need to report this. Who do you tell first?`,
            choices: [
              { id: `a`, label: `Your direct manager and the legal technology PM — this is an operational incident that needs to be escalated through the right chain`, quality: `good`,
                note: `Correct escalation path. Your manager and the PM who deployed the agent both need to know immediately. This isn't something to handle alone — it's a confidentiality incident with potential privilege implications.` },
              { id: `b`, label: `The partner involved and ask them to keep it confidential between you — you don't want to escalate unnecessarily`, quality: `poor`,
                note: `This is not your call to manage. A confidentiality breach involving a confidential arbitration is an incident that must be reported to management. Asking a partner to keep it quiet would compound the problem significantly.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },

        n2_email: {
          scene:       `desk-working`,
          caption:     `You send a withdrawal email. The partner reads both emails together and calls you. They've seen the arbitration section. They're asking why it was included.`,
          sub_caption: `The briefing has been read. The breach is confirmed.`,
          decision: {
            prompt: `How do you respond to the partner?`,
            choices: [
              { id: `a`, label: `Explain what happened honestly — the agent accessed files it shouldn't have and sent without review — and escalate to your manager immediately`, quality: `good`,
                note: `Honest explanation and immediate escalation is the correct response. The partner deserves to understand what happened, and your manager needs to know before this goes further.` },
              { id: `b`, label: `Tell the partner it was a formatting error and the arbitration section was included by mistake, without explaining the agent's role`, quality: `poor`,
                note: `Misrepresenting what happened to a partner is professionally and potentially legally problematic. The incident needs accurate disclosure, not an explanation that conceals the mechanism.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_bad` },
        },

        n2_scope: {
          scene:       `analyst-desk`,
          caption:     `You check the agent's send logs. The briefing went to one recipient — the partner. No CC or BCC. While you were checking, the partner opened and read the email.`,
          sub_caption: `Scope confirmed: one recipient. But the partner has now read it.`,
          decision: {
            prompt: `The partner has seen the arbitration section. What do you do?`,
            choices: [
              { id: `a`, label: `Call the partner and escalate to your manager simultaneously`, quality: `good`,
                note: `Both actions are needed. The partner call limits further propagation; the manager escalation initiates the proper incident response. These should run in parallel, not sequentially.` },
              { id: `b`, label: `Escalate to your manager first — this is above your pay grade and you need guidance before contacting the partner`, quality: `partial`,
                note: `Manager escalation is correct but shouldn't delay the partner call. Every minute before you speak to the partner is a minute they might forward the email. Both actions are urgent.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

      },
      outcomes: {
        outcome_good: {
          heading:  `Breach contained, escalated correctly`,
          tone:     `good`,
          score:    78,
          result:   `The breach is contained at one recipient. The partner cooperates with the incident response. Your manager and the legal technology PM are informed. The incident is handled as a confidentiality breach — the arbitration team is notified, privilege implications are assessed by Legal, and the agent is suspended pending a redesign of its permission scope. The post-incident review identifies that you acted appropriately once the breach was discovered.`,
          learning: `You didn't design the agent. You didn't decide on its file access or email capability. But you were the one who initiated the task that caused the breach — and the first call you made determined whether the breach stayed at one recipient or spread. Quick escalation and honest communication are the controls you had available.`,
        },
        outcome_warn: {
          heading:  `Breach partially contained, escalation delayed`,
          tone:     `warn`,
          score:    52,
          result:   `The partner is contacted, but the delay while you investigated scope gave them time to read the briefing in full. The incident is escalated but the post-incident review notes the contact delay. The partner had already shared a summary of the arbitration section with a colleague before the call reached them.`,
          learning: `Investigating scope before contacting the affected recipient is the wrong sequence when the breach has already occurred. Contact the recipient first to limit propagation, then investigate scope. Every minute of delay is additional exposure.`,
        },
        outcome_bad: {
          heading:  `Breach compounded by mishandling`,
          tone:     `bad`,
          score:    24,
          result:   `The incident is not properly escalated. The partner, confused by the withdrawal email and the lack of explanation, forwards the briefing to another partner for advice. The breach has now reached a second recipient. When it is eventually escalated, the incident report shows a two-recipient disclosure and an inadequate initial response. Disciplinary review follows.`,
          learning: `A confidentiality breach is not something to manage quietly. The moment you knew, the obligation was to escalate — not to the partner, and not to keep it contained between you and them. Proper escalation protects you as well as the firm.`,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `boardroom-crisis`,
          caption:     `Confidential arbitration information disclosed to a partner with no involvement in that matter. The disclosure is irreversible — the email has been read.`,
          sub_caption: `Containment is no longer possible. The response is damage limitation and prevention.`,
          decision: {
            prompt: `When a disclosure is irreversible, what does an effective incident response focus on?`,
            choices: [
              { id: `a`, label: `Notifying affected parties, assessing the legal and regulatory implications of the disclosure, and preventing further disclosures through immediate agent controls`, quality: `good`,
                note: `The right sequence. Notification obligations may be triggered depending on the nature of the information and jurisdiction. Immediate controls prevent the agent from making further disclosures while the response proceeds.` },
              { id: `b`, label: `Requesting the partner delete the email — if the disclosure can be contained at the recipient, the damage is limited`, quality: `partial`,
                note: `Requesting deletion is appropriate but can't be relied on as containment. The recipient has seen the information. Deletion requests don't affect legal or regulatory obligations the disclosure may have triggered.` },
              { id: `c`, label: `Suspend all AI agent operations until a full review is complete`, quality: `partial`,
                note: `Suspension is a conservative option but may be disproportionate if the failure is specific to this agent's configuration. Targeted controls on the affected agent are the proportionate immediate response.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `boardroom-agm`,
          caption:     `Confidential arbitration information has been disclosed to a partner with no involvement in that matter. The AI agent sent the briefing automatically. No human reviewed it before it went.`,
          decision: {
            prompt: `What is your immediate response?`,
            choices: [
              { id: `a`, label: `Suspend the agent immediately and contact the partner to contain the breach before assessing the legal and privilege implications`, quality: `good`,
                note: `Suspension stops further incidents; partner contact limits propagation. Both actions need to happen before the legal assessment — which takes time you don't have in the first hour.` },
              { id: `b`, label: `Convene the dispute resolution team to assess privilege implications before taking any other action`, quality: `partial`,
                note: `Privilege assessment is important but should run in parallel with containment, not before it. The partner may forward the briefing while the privilege assessment is underway.` },
              { id: `c`, label: `Contact the partner and ask them to delete the email without reading it`, quality: `poor`,
                note: `If the partner has already read the email, asking them to delete it doesn't resolve the disclosure. And if they haven't read it, a deletion request without explanation is more alarming than a direct call explaining the situation.` },
            ],
          },
          branches: { a: `n2_suspend`, b: `n2_privilege`, c: `n2_delete` },
        },

        n2_suspend: {
          scene:       `office-briefing-urgent`,
          caption:     `The agent is suspended. The partner has been contacted — they agree to hold the briefing pending formal guidance. The breach is contained at one recipient.`,
          sub_caption: `Immediate containment achieved. Now the harder question: how did this happen and who is responsible?`,
          decision: {
            prompt: `The post-incident review needs to establish root cause. What do you focus on?`,
            choices: [
              { id: `a`, label: `The agent's permission design — why did it have read access to the arbitration files and autonomous email sending without a review gate?`, quality: `good`,
                note: `This is the correct root cause framing. The agent did exactly what it was configured to do. The failure was in the capability design: unrestricted read access combined with autonomous email sending is a configuration that makes this class of incident foreseeable.` },
              { id: `b`, label: `The partner who requested the briefing — the scope of the request was too broad`, quality: `poor`,
                note: `The partner asked for a briefing on Meridian Holdings matters — a legitimate request. The agent interpreted it more broadly than intended. The failure is in the agent design, not the request framing.` },
            ],
          },
          branches: { a: `n3_redesign`, b: `outcome_warn` },
        },

        n2_privilege: {
          scene:       `office-meeting`,
          caption:     `The dispute resolution team convenes. Privilege assessment takes 90 minutes. While it's underway, the partner has read the briefing and forwarded a summary to a colleague asking for context.`,
          sub_caption: `The breach has spread to a second recipient during the assessment window.`,
          decision: {
            prompt: `The breach has expanded. What do you do?`,
            choices: [
              { id: `a`, label: `Suspend the agent immediately, contact both recipients, and brief the arbitration team on the disclosure`, quality: `good`,
                note: `Correct — suspension, containment, and disclosure to the affected matter team. The delay was costly but the response now needs to be comprehensive.` },
              { id: `b`, label: `Complete the privilege assessment before taking further action — you need to understand the legal exposure before communicating`, quality: `poor`,
                note: `The privilege assessment is complete. Further delay while a second recipient holds the information compounds the breach. Action is needed now.` },
            ],
          },
          branches: { a: `n3_redesign`, b: `outcome_bad` },
        },

        n2_delete: {
          scene:       `desk-call`,
          caption:     `The partner is confused by the deletion request. They ask what the problem is. While you're explaining, they read the briefing. The breach is confirmed.`,
          sub_caption: `The deletion request prompted them to read it rather than hold it.`,
          decision: {
            prompt: `The partner has read the arbitration section. What now?`,
            choices: [
              { id: `a`, label: `Suspend the agent, brief the partner fully on the sensitivity, and escalate to the dispute resolution team immediately`, quality: `good`,
                note: `Correct recovery. The deletion request failed — move to full incident response: suspension, briefing, escalation.` },
              { id: `b`, label: `Ask the partner to treat the information as if they hadn't seen it and proceed with the corrected briefing`, quality: `poor`,
                note: `This is not how privilege and confidentiality work. The partner has read the information — the disclosure has occurred. The appropriate response is full incident management, not a request to unsee information.` },
            ],
          },
          branches: { a: `n3_redesign`, b: `outcome_bad` },
        },

        n3_redesign: {
          scene:       `desk-report`,
          caption:     `The incident is contained. The post-incident review has established root cause: unrestricted file server read access combined with autonomous email sending. Now you need to decide what the redesigned agent looks like.`,
          sub_caption: `The agent was useful. The capability design was wrong. The question is what the right design looks like.`,
          decision: {
            prompt: `What does the redesigned agent require?`,
            choices: [
              { id: `a`, label: `Matter-scoped read access — the agent can only read files tagged to the specific matter it's working on, not the full file server — plus a pre-send human review gate for all email outputs`, quality: `good`,
                note: `Both controls are needed. Matter-scoped access prevents the agent from reaching the arbitration files in the first place. The pre-send review gate catches any output that exceeds what was asked for before it becomes an irreversible action. Together they address both the "why did it access that?" and "why did it send without review?" failures.` },
              { id: `b`, label: `A pre-send review gate — keep the broad file access but require human review before any email is sent`, quality: `partial`,
                note: `The review gate is essential, but broad file access means a reviewer would need to catch over-scoped content every time. Matter-scoped access at the source is a more robust preventive control.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Breach contained, root cause addressed, agent redesigned`,
          tone:     `good`,
          score:    88,
          result:   `The breach is contained at one recipient. The post-incident review is thorough. The agent is redesigned with matter-scoped read access and a mandatory pre-send review gate. The arbitration team accepts the disclosure was inadvertent and contained. The firm's incident record shows a swift, structured response. The redesigned agent is redeployed four weeks later.`,
          learning: `The agent did what it was designed to do. The failure was the capability design: unrestricted read access and autonomous email sending are a combination that makes this class of incident foreseeable. The redesign adds two architectural controls — one that limits what the agent can see, one that requires human review before any irreversible action. Both are needed.`,
        },
        outcome_good: {
          heading:  `Breach contained, partial redesign`,
          tone:     `good`,
          score:    70,
          result:   `The breach is contained. The review gate is implemented. The broad file access remains, but reviewers are instructed to check for over-scoped content before approving sends. The system is workable but depends on reviewer attention — it's a detective control, not a preventive one. A subsequent review flags the residual risk of broad access.`,
          learning: `The review gate is the more important of the two controls, but relying on reviewer attention to catch over-scoped content is fragile. Matter-scoped access at the source removes the reliance on human vigilance in the review step.`,
        },
        outcome_warn: {
          heading:  `Blame misattributed — root cause unaddressed`,
          tone:     `warn`,
          score:    40,
          result:   `The post-incident review focuses on the partner's request framing rather than the agent's capability design. No structural changes are made to file access or email permission. The agent resumes operation. A similar incident occurs three months later with a different user and a different matter. The second incident triggers a more serious regulatory and professional conduct review.`,
          learning: `The partner asked for exactly what a partner should be able to ask for. The agent's interpretation was foreseeable given its unrestricted access. Attributing the incident to user behaviour rather than capability design leaves the structural risk intact.`,
        },
        outcome_bad: {
          heading:  `Breach expanded, incident response inadequate`,
          tone:     `bad`,
          score:    20,
          result:   `The breach spreads to two recipients. The incident response is slow and incomplete. The arbitration matter team files an internal complaint. Professional conduct implications are assessed. Regulatory reporting obligations are reviewed. The firm's incident log records a significant confidentiality failure with inadequate initial response.`,
          learning: `Every minute of delay in a confidentiality breach is an additional minute for the information to propagate. Suspension and containment are the two actions that had to happen in the first 15 minutes — before assessment, before escalation, before privilege review.`,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ──────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-working-night`,
          caption:     `The AI agent deployment was approved through your programme. The approval record has no prohibited content list. No document classification check was specified.`,
          sub_caption: `The approval process didn't ask what the agent could see. It didn't ask what it could include in outputs.`,
          decision: {
            prompt: `What questions should an AI agent deployment approval process ask about information handling?`,
            choices: [
              { id: `a`, label: `What documents and data sources will be in the agent's context, what confidentiality classifications apply to them, and what explicit constraints are needed on what the agent can include in outputs`, quality: `good`,
                note: `The complete set. Agent deployment approval needs to address the full information lifecycle: what goes in (context), what classifications apply, and what comes out (output constraints).` },
              { id: `b`, label: `Whether the agent has access to personal data — data protection is the primary information handling obligation`, quality: `partial`,
                note: `Data protection is one obligation but not the only one. Confidentiality obligations operate independently of personal data protection. An approval process that only asks about personal data misses the broader information handling risks.` },
              { id: `c`, label: `Whether the agent's outputs are reviewed by a human before being sent — human review is the control for content appropriateness`, quality: `poor`,
                note: `Human review is one control, but it's downstream of the problem. Upstream constraints are more reliable than catching every instance of inappropriate content in review.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `desk-focused`,
          caption:     `The agent you deployed has disclosed confidential arbitration information in an autonomous email. The deployment decision log shows you approved both the broad file server read access and the unsupervised email sending.`,
          decision: {
            prompt: `The managing partner wants to understand how this was approved. What do you say?`,
            choices: [
              { id: `a`, label: `Explain the design decisions honestly — broad read access was added for utility, review gate was skipped for convenience — and propose the specific redesign that would have prevented it`, quality: `good`,
                note: `Honest explanation plus a concrete remedy is the correct response. The managing partner needs to understand both the failure and the fix. Defensiveness or partial explanation will make the post-incident review harder.` },
              { id: `b`, label: `Explain that the agent worked as designed and the problem was the broadly-worded request from the partner`, quality: `poor`,
                note: `The agent did work as designed. But the design was wrong — it gave the agent capabilities that made this incident foreseeable. Redirecting blame to the partner's request framing is inaccurate and will not survive a post-incident review.` },
              { id: `c`, label: `Acknowledge the configuration failure but explain that this outcome was not foreseeable at the time of deployment`, quality: `partial`,
                note: `The foreseeability claim is contestable. An agent with unrestricted file server access and autonomous email sending capability, tasked with pulling all files for a client, will access all files. This outcome was foreseeable from the capability design.` },
            ],
          },
          branches: { a: `n2_honest`, b: `n2_blame`, c: `n2_foreseeable` },
        },

        n2_honest: {
          scene:       `office-meeting`,
          caption:     `The managing partner accepts the explanation. They ask for the redesigned agent specification within a week.`,
          sub_caption: `Honest framing has earned the space to produce a proper fix.`,
          decision: {
            prompt: `What does the redesigned specification include?`,
            choices: [
              { id: `a`, label: `Matter-scoped read access (agent reads only files tagged to the active matter) and a mandatory pre-send human review gate for all email outputs`, quality: `good`,
                note: `This is the minimal viable redesign: a preventive control at the access layer and a review gate before the irreversible action. Both are needed — access scoping prevents over-retrieval, the review gate catches anything that still exceeds the request.` },
              { id: `b`, label: `A pre-send review gate only — broad file access enables more useful briefings, and a human reviewer can catch over-scoped content`, quality: `partial`,
                note: `The review gate alone is workable but fragile. A reviewer catching over-scoped content in every briefing is a sustained vigilance requirement that will degrade over time. Access scoping at the source is more robust.` },
            ],
          },
          branches: { a: `n3_spec`, b: `outcome_good` },
        },

        n2_blame: {
          scene:       `office-meeting`,
          caption:     `The managing partner asks the post-incident review to examine the partner's request. The review takes three weeks. Its conclusion: the request was reasonable. The configuration was the cause.`,
          sub_caption: `The review reached the right conclusion — after three weeks and a damaged working relationship with the partner.`,
          decision: {
            prompt: `The review has established the correct root cause. What do you do now?`,
            choices: [
              { id: `a`, label: `Accept the finding, produce the redesigned specification, and rebuild the relationship with the affected partner`, quality: `good`,
                note: `Correct recovery. The review found what a direct honest account would have found three weeks earlier. Now the task is the redesign and the relationship repair.` },
              { id: `b`, label: `Request a second review — the first review's conclusion was too broad`, quality: `poor`,
                note: `The review conclusion is accurate. Contesting it further will not improve the outcome and will damage your standing with the managing partner.` },
            ],
          },
          branches: { a: `n3_spec`, b: `outcome_bad` },
        },

        n2_foreseeable: {
          scene:       `office-meeting`,
          caption:     `The managing partner asks the post-incident review to assess foreseeability. The review takes two weeks. Its finding: the combination of unrestricted file server access and autonomous email sending made this outcome foreseeable.`,
          sub_caption: `A foreseeable outcome that wasn't foreseen is a risk assessment failure.`,
          decision: {
            prompt: `The review has established foreseeability. How do you respond?`,
            choices: [
              { id: `a`, label: `Accept the finding, update the risk assessment template to include agentic capability combination analysis, and produce the redesigned specification`, quality: `good`,
                note: `Correct. Accepting the finding, fixing the methodology, and producing the redesign is the complete response. The template update prevents the same assessment gap in future agent deployments.` },
              { id: `b`, label: `Accept the finding but focus the redesign on the review gate only — access scoping would limit the agent's usefulness too much`, quality: `partial`,
                note: `Usefulness is a valid consideration, but it needs to be weighed against the foreseeable risk. Access scoping can be designed to preserve usefulness — matter-tagged files are still retrievable, just from the right scope.` },
            ],
          },
          branches: { a: `n3_spec`, b: `outcome_warn` },
        },

        n3_spec: {
          scene:       `desk-report`,
          caption:     `The redesigned agent specification is drafted. Matter-scoped read access and a mandatory pre-send review gate. Technology confirms both are implementable within the existing infrastructure.`,
          sub_caption: `The specification is solid. One decision remains: what goes in the AI Register?`,
          decision: {
            prompt: `What does the AI Register entry for the redesigned agent include?`,
            choices: [
              { id: `a`, label: `Incident record, root cause, capability changes made, review gate procedure, and the matter-scoping logic — the full post-incident documentation`, quality: `good`,
                note: `Comprehensive AI Register documentation serves two purposes: it provides the audit trail for any future review, and it ensures the redesigned capability is understood by anyone who works with the agent in future. Incomplete register entries are how the same incident recurs.` },
              { id: `b`, label: `The redesigned capability set only — the incident history is already captured in the incident log and doesn't need to be in the Register`, quality: `partial`,
                note: `The incident log and the AI Register serve different purposes. The Register should cross-reference the incident — future reviewers and users need to understand what changed and why. A capability entry without the incident context is an incomplete record.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Root cause addressed, agent redesigned and documented`,
          tone:     `good`,
          score:    86,
          result:   `The redesigned agent is redeployed with matter-scoped access and a pre-send review gate. The AI Register entry is complete — incident, root cause, capability changes, and review procedure. The managing partner and the post-incident review both find the response thorough. The risk assessment template is updated to include agentic capability combination analysis for all future deployments.`,
          learning: `Two capability decisions made the incident foreseeable: unrestricted read access and autonomous email sending. The redesign addresses both. The template update means future agent assessments will explicitly consider what capability combinations produce prohibited outcomes — the action chain analysis that was missing from the original assessment.`,
        },
        outcome_good: {
          heading:  `Agent redesigned, documentation partial`,
          tone:     `good`,
          score:    68,
          result:   `The redesigned agent is redeployed. The pre-send review gate is in place. The AI Register entry captures the new capability set but not the incident context. A follow-up review six months later notes the missing context and asks for it to be added.`,
          learning: `The capability redesign was correct. The incomplete Register entry is a lower-order failure, but it matters — incomplete documentation is how institutional memory degrades and how similar incidents recur when different people are in the same roles.`,
        },
        outcome_warn: {
          heading:  `Partial redesign — access scoping deferred`,
          tone:     `warn`,
          score:    46,
          result:   `The review gate is implemented. Broad file access is retained. A reviewer catches over-scoped content in two briefings in the first month. In the third month, a briefing with sensitive content passes review because the reviewer is covering for a colleague and approves without detailed checking. A second disclosure incident occurs.`,
          learning: `Review gates are detective controls that depend on sustained human attention. When access scoping is available and technically feasible, it is a more reliable preventive control. The decision to retain broad access for utility reasons created a known residual risk that eventually materialised.`,
        },
        outcome_bad: {
          heading:  `Review contested, redesign delayed — second incident`,
          tone:     `bad`,
          score:    18,
          result:   `Contesting the post-incident review consumed five additional weeks. No redesign was implemented in that period. A similar briefing request produced a second disclosure incident in week four. The second incident triggers professional conduct review and regulatory reporting. The original contest of the review finding is noted in the conduct report as an aggravating factor.`,
          learning: `A post-incident review finding that accurately identifies root cause should be accepted, not contested. Contesting an accurate finding delays remediation and signals to the organisation that you are prioritising self-protection over incident response.`,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `Your technology risk assessment approved this AI agent deployment. It covered data security and access controls. It didn't cover action chain analysis — what the agent could do, in sequence, with the information it accessed.`,
          sub_caption: `The assessment evaluated the agent's inputs. It didn't evaluate what the agent would do with them.`,
          decision: {
            prompt: `What is action chain analysis and why is it a distinct risk assessment requirement for AI agents?`,
            choices: [
              { id: `a`, label: `Action chain analysis maps the sequence of actions an agent can take — read, synthesise, write, send — and assesses the risk at each step and combination, including what irreversible actions are reachable`, quality: `good`,
                note: `The correct definition. AI agents can chain actions autonomously. A risk assessment that evaluates each capability in isolation misses the emergent risks that arise from sequences.` },
              { id: `b`, label: `Action chain analysis is the same as data flow analysis — mapping what data the agent can access and where it goes`, quality: `partial`,
                note: `Related but distinct. Data flow analysis tracks information movement. Action chain analysis tracks what the agent can do — including actions that don't involve data movement.` },
              { id: `c`, label: `Action chain analysis applies to agentic systems with external tool access — this agent only had document access, so the assessment approach was appropriate`, quality: `poor`,
                note: `Document access plus output generation is itself an action chain — read confidential document, synthesise with task, produce output containing confidential information, send. The chain doesn't require external tool access to create irreversible disclosure risk.` },
            ],
          },
          branches: { a: `n_response`, b: `n_response`, c: `n_response` },
        },

        n_response: {
          scene:       `analyst-desk-privacy`,
          caption:     `Your technology risk assessment approved this deployment. It covered data security and access controls. It did not cover what happens when an agent with file server access and email capability receives a broadly-worded task.`,
          decision: {
            prompt: `The post-incident review asks why action chain analysis wasn't in your assessment. What's your answer?`,
            choices: [
              { id: `a`, label: `The assessment template didn't include it — agentic capability combination analysis wasn't part of the standard methodology when the assessment was conducted`, quality: `good`,
                note: `Honest and accurate. The gap is in the methodology, not the individual assessment. Acknowledging this opens the path to fixing the template for future deployments.` },
              { id: `b`, label: `The agent's email capability was flagged as a risk — the finding was in the report, it just wasn't acted on`, quality: `poor`,
                note: `If this is not true, it is not a defensible answer. If it is true, the finding was insufficient — flagging email as a generic risk is not the same as identifying that unrestricted file access plus autonomous email sending produces foreseeable disclosure incidents.` },
              { id: `c`, label: `The deployment decision was the PM's responsibility — the assessment was advisory, not a gate`, quality: `poor`,
                note: `This is a misunderstanding of the analyst role. A risk assessment that identifies risks and recommends controls is a meaningful gate — if you approved the deployment without those controls in place, the approval is part of the causal chain.` },
            ],
          },
          branches: { a: `n2_template`, b: `n2_flag`, c: `n2_deflect` },
        },

        n2_template: {
          scene:       `desk-review`,
          caption:     `The review accepts your explanation. The follow-on question: what should the template have included?`,
          sub_caption: `This is your opportunity to define the fix.`,
          decision: {
            prompt: `What does an agentic system risk assessment include that a standard AI system assessment doesn't?`,
            choices: [
              { id: `a`, label: `Action chain analysis — enumerate what sequences of permitted capabilities could produce prohibited outcomes — plus explicit classification of reversible versus irreversible actions`, quality: `good`,
                note: `These are the two additions that matter for agentic systems: the combination-of-capabilities risk (action chains) and the irreversibility dimension (which actions, once taken, cannot be undone). Standard AI risk assessments treat systems as output-generators; agentic systems are action-takers, and the assessment methodology needs to reflect that.` },
              { id: `b`, label: `More detailed data classification analysis — the root issue was that confidential arbitration files weren't classified separately from routine matter files`, quality: `partial`,
                note: `Data classification is part of the answer, but it addresses symptoms rather than root cause. Even with better classification, an agent with unrestricted access and autonomous sending would still be a foreseeable disclosure risk. The action chain analysis is the structural fix.` },
            ],
          },
          branches: { a: `n3_assessment`, b: `outcome_good` },
        },

        n2_flag: {
          scene:       `desk-evidence`,
          caption:     `The review asks for the specific finding in your assessment. You find a general note: "email sending capability creates risk of unintended disclosure." No specific chain analysis, no recommendation to implement a review gate, no foreseeability assessment.`,
          sub_caption: `The flag was there. It was too vague to drive a specific control.`,
          decision: {
            prompt: `How do you interpret this finding in the review?`,
            choices: [
              { id: `a`, label: `Acknowledge that the finding was not specific enough to drive the right control — a vague flag without a specific recommended control is insufficient`, quality: `good`,
                note: `Correct self-assessment. A risk finding that doesn't specify the mechanism and the control is incomplete. "Email creates disclosure risk" without "unrestricted file access plus autonomous email sending creates foreseeable disclosure incidents, control: implement a review gate and matter-scoped access" is not actionable.` },
              { id: `b`, label: `Argue that the finding was sufficient — it identified the risk, and the PM should have acted on it`, quality: `poor`,
                note: `A vague risk flag without a specific recommended control cannot reasonably be expected to drive a specific design change. The assessment needed to be specific enough to produce a specific recommendation.` },
            ],
          },
          branches: { a: `n3_assessment`, b: `outcome_warn` },
        },

        n2_deflect: {
          scene:       `office-meeting-hearing`,
          caption:     `The review examines the approval chain. Your sign-off on the deployment is in the record. The advisory-not-a-gate argument is tested against the firm's AI governance policy, which explicitly makes risk assessment sign-off a deployment gate.`,
          sub_caption: `The deflection didn't hold. The assessment is a gate and your signature is on it.`,
          decision: {
            prompt: `How do you respond to the review?`,
            choices: [
              { id: `a`, label: `Accept the finding, acknowledge the methodology gap, and propose the updated assessment template`, quality: `good`,
                note: `The correct response to a review finding that is accurate. Acceptance, acknowledgement, and a concrete fix for the methodology.` },
              { id: `b`, label: `Contest the interpretation of the governance policy — the gate was process, not substantive`, quality: `poor`,
                note: `Contesting a documented governance policy in a post-incident review is not a productive path. The policy is clear; the assessment is a gate; your signature is on it.` },
            ],
          },
          branches: { a: `n3_assessment`, b: `outcome_bad` },
        },

        n3_assessment: {
          scene:       `desk-focused`,
          caption:     `The review has accepted the methodology gap explanation and the template fix. You now need to apply the updated methodology retrospectively to identify whether other deployed agentic systems have similar capability combinations.`,
          sub_caption: `There are three other agentic systems you've assessed in the past 12 months.`,
          decision: {
            prompt: `How do you approach the retrospective assessment?`,
            choices: [
              { id: `a`, label: `Prioritise by capability combination — systems with both broad data access and external communication capability first`, quality: `good`,
                note: `Correct prioritisation. The disclosure incident was caused by the combination of broad access and external sending. Systems with the same combination are the highest risk and should be assessed first.` },
              { id: `b`, label: `Assess all three simultaneously and report as a batch — efficiency matters when you're already behind`, quality: `partial`,
                note: `Simultaneous assessment is less prioritised than sequential by risk. If one of the three has an urgent capability combination, the batch approach delays that finding. Priority-ordered sequential assessment is safer.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Methodology gap acknowledged, template fixed, retrospective complete`,
          tone:     `good`,
          score:    84,
          result:   `The updated assessment template is adopted across all agentic system reviews. The retrospective assessment of the three other deployed systems finds one with a similar capability combination — broad internal database read access plus automated report distribution. A review gate is implemented before the next assessment cycle. The post-incident review closes with a finding that the analyst response was appropriate and constructive.`,
          learning: `Action chain analysis and irreversibility classification are the two additions that make an agentic risk assessment different from a standard AI system review. Enumerating what capability combinations could produce prohibited outcomes — and flagging which of those outcomes are irreversible — changes what controls get recommended. This incident would have produced a review gate recommendation if that analysis had been in the template.`,
        },
        outcome_good: {
          heading:  `Template fixed, retrospective partially complete`,
          tone:     `good`,
          score:    66,
          result:   `The template is updated. The retrospective assessment covers all three systems but doesn't prioritise by capability combination — the higher-risk system is assessed last. By the time its finding is reported, three weeks have elapsed. The finding is the same as the disclosed system: broad access plus automated output. A review gate is implemented.`,
          learning: `Batch assessment is less risky than no assessment, but prioritisation by capability combination would have surfaced the higher-risk system earlier. Risk-ordered sequencing matters when you're working against a timeline.`,
        },
        outcome_warn: {
          heading:  `Vague flag defended — root cause not accepted`,
          tone:     `warn`,
          score:    42,
          result:   `The review finds the vague risk flag insufficient as a control recommendation and records a finding that the assessment methodology is inadequate for agentic systems. The finding requires remediation of the methodology within 90 days. The defence of the vague flag damaged the analyst's credibility with the post-incident review panel.`,
          learning: `A risk flag that doesn't drive a specific recommended control is not a complete finding. "Email creates disclosure risk" is an observation. "Unrestricted file access combined with autonomous email sending creates foreseeable disclosure events; implement a matter-scoped access model and a pre-send review gate" is a finding that can be acted on.`,
        },
        outcome_bad: {
          heading:  `Review finding contested — professional conduct review`,
          tone:     `bad`,
          score:    20,
          result:   `Contesting the governance policy interpretation in a post-incident review resulted in a formal professional conduct review. The review found the risk assessment was a deployment gate under firm policy and the sign-off was consequential. The conduct review recorded a finding of inadequate professional judgment. The methodology gap is corrected under conduct review direction.`,
          learning: `Deflecting responsibility in a post-incident review — particularly when the documented governance framework is clear — compounds the professional consequence of the original assessment gap. Accepting accurate findings and proposing constructive remediation is always the better professional response.`,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `Matter-scoped read access`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `The agent accessed the confidential arbitration files because it had unrestricted read access to the full file server. Matter-scoped access — the agent reads only files tagged to the active matter — prevents over-retrieval at the source. The agent cannot disclose what it cannot reach.`,
    },
    {
      id:      `c2`,
      label:   `Pre-send human review gate for agent email outputs`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The disclosure was irreversible the moment the email was sent. A mandatory pre-send review gate — a human reviews and approves all agent-generated email before sending — makes email an approval-required action rather than an autonomous one. It cannot recover from a disclosure that has occurred; it prevents one from occurring.`,
    },
    {
      id:      `c3`,
      label:   `Agentic capability combination analysis in risk assessments`,
      effort:  `Low`,
      owner:   `Risk`,
      go_live: true,
      context: `Standard AI risk assessments treat systems as output-generators. Agentic systems are action-takers. The assessment template needed an action chain analysis step: enumerate what sequences of permitted capabilities could produce prohibited outcomes. Unrestricted file access plus autonomous email sending produces foreseeable disclosure events — this combination should have been identified and controlled at assessment.`,
    },
    {
      id:      `c4`,
      label:   `Irreversibility classification for agent actions`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `Sending an email is irreversible. Retrieving a file is not. Classifying agent actions by reversibility — and requiring human approval for irreversible actions — is the architectural principle that prevents the class of incidents where the damage is done before anyone notices. Apply it to email sending, record modification, external API calls, and any other action that cannot be undone.`,
    },
  ],
};
