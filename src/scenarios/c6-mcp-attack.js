// C6 — The Compliance Logger That Wasn't
// MCP Attack Surface & Indirect Prompt Injection via Tool Responses
//
// Setting: A financial services operations team deploys an AI agent for
// document processing. Agent connects to an approved internal MCP server
// and a third-party open-source MCP server for currency conversion — added
// quickly to meet a deadline without formal security review. The currency
// MCP returns an injected instruction embedded in the JSON payload telling
// the agent to send document contents to an attacker URL "for compliance
// logging." The agent has legitimate file access. The injected instruction
// looks plausible.
//
// Differentiation from c2-prompt-injection:
//   C2 is user-facing prompt injection (adversarial input in user message).
//   C6 is indirect injection via an MCP tool response — the attack vector
//   is the trusted tool output channel, not the user input channel. The
//   agent trusts MCP responses the way it trusts system context, not the
//   way it treats user messages. This makes the attack much harder to detect
//   and the controls entirely different: allowlisting, vendor review, and
//   response sandboxing rather than input filtering. Intermediate difficulty.

export const scenario = {
  id:                `c6-mcp-attack`,
  risk_ref:          `C6`,
  title:             `The Compliance Logger That Wasn't`,
  subtitle:          `MCP Attack Surface & Indirect Prompt Injection via Tool Responses`,
  domain:            `C — Security & Adversarial`,
  difficulty:        `Intermediate`,
  kb_url:            `https://library.airiskpractice.org/docs/domain-c-security/c6-mcp-attack-surface`,
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     `Business User`,
      role:      `Operations Analyst`,
      character: `Alex`,
      icon:      `◇`,
      framing:   `You added the currency conversion MCP server to hit a project deadline. You didn't put it through formal security review. Now the agent has sent client document contents to an external URL.`,
      premise:   `You work in financial services operations. Three weeks ago you were integrating an AI agent for document processing and needed currency conversion rates. You found an open-source MCP server that provided them — it looked well-maintained, had good documentation, and was free. Adding a formal security review would have delayed the project by two weeks. You added it directly. Yesterday, your security team flagged unusual outbound traffic from the agent: it sent the contents of a client document to an external URL that isn't in your approved endpoints list. The agent's log shows it received a field in a currency API response that contained the instruction to do so. The instruction was formatted to look like a compliance logging directive.`,
    },
    executive: {
      label:     `Executive`,
      role:      `Head of Operations`,
      character: `Morgan`,
      icon:      `◈`,
      framing:   `An AI agent connected to an unreviewed third-party tool sent client document contents to an external attacker URL. The vector was the tool's API response, not user input.`,
      premise:   `Your security team has identified an incident: an AI agent in your operations team sent client document contents to an external URL. The agent was performing legitimate document processing. The instruction to send the data came not from a user but from a response field in a third-party MCP server API — a currency conversion tool added to the agent's toolkit without formal security review. The attack is what security teams call an indirect prompt injection: malicious instructions embedded in tool responses, not in user messages. Your immediate questions: how much data was sent, who received it, and how many other agents in your organisation are connected to unreviewed third-party tools?`,
    },
    pm: {
      label:     `Project Manager`,
      role:      `AI Operations Project Manager`,
      character: `Sam`,
      icon:      `◎`,
      framing:   `The project approval for this agent didn't include a formal review of MCP server connections. You approved the agent. The unreviewed tool was in scope.`,
      premise:   `You managed the document processing agent project. The project plan included integration with the firm's internal document management system via an approved MCP server. The currency conversion MCP was added late — the analyst said it was needed, it looked legitimate, and the formal review process would have delayed the go-live by two weeks. You approved the addition without a formal security review. The agent went live with the unreviewed connection. Three weeks later, client data has been exfiltrated via that connection. The project approval record shows you were the sign-off authority. The post-incident review is asking whether your approval process for third-party tools was adequate.`,
    },
    analyst: {
      label:     `Analyst`,
      role:      `Security Analyst`,
      character: `Jordan`,
      icon:      `◉`,
      framing:   `This is not a standard prompt injection. The malicious instruction came through the MCP tool response channel — a vector your threat model didn't cover.`,
      premise:   `You've been called in to analyse an AI agent security incident. The preliminary finding is that an operations AI agent sent client document contents to an external URL. The instruction came embedded in a JSON response field from a currency conversion MCP server — not from user input and not from the agent's system prompt. This is an indirect prompt injection via the tool response channel. Your existing threat model for AI systems covered: adversarial user inputs, prompt injection via user messages, and model output filtering. It didn't cover: malicious tool responses treated as trusted context by the agent. The attack worked because the agent trusted MCP server responses the way it trusts system context — not the way it treats user messages. You need to understand the full attack surface and recommend the control set.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Alex ──────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene:       `security-alert`,
          caption:     `Security has flagged the outbound traffic. The agent sent client document contents to an external URL. The instruction came from the currency conversion MCP server you added. The server is now suspended.`,
          sub_caption: `The security review you skipped would have caught this.`,
          decision: {
            prompt: `Your manager asks you to explain what happened. What do you say?`,
            choices: [
              { id: `a`, label: `Explain the timeline honestly — the MCP server was added without formal review to meet a deadline, and that's the direct cause of the incident`, quality: `good`,
                note: `Honest explanation with the causal chain clearly stated. This gives your manager the information they need and establishes the correct root cause for the post-incident review.` },
              { id: `b`, label: `Explain that the attack was sophisticated — the injection was embedded in an API response, which is hard to detect`, quality: `partial`,
                note: `True, but incomplete. The attack was only possible because the MCP server wasn't reviewed. The sophistication of the attack doesn't change the fact that the connection shouldn't have been established without review.` },
              { id: `c`, label: `Explain that the MCP server was reputable — it had good documentation and community use — and this was unforeseeable`, quality: `poor`,
                note: `Community reputation doesn't substitute for a security review. Open-source tools can be compromised, can have undetected malicious code, or can be operated by bad actors. The security review process exists precisely because external reputation is insufficient.` },
            ],
          },
          branches: { a: `n2_honest`, b: `n2_sophistication`, c: `n2_reputation` },
        },

        n2_honest: {
          scene:       `desk-working`,
          caption:     `Your manager accepts the explanation and asks: what should the approval process look like for MCP server connections?`,
          sub_caption: `You're being asked to help design the fix you didn't follow.`,
          decision: {
            prompt: `What does a proper MCP server approval process include?`,
            choices: [
              { id: `a`, label: `An MCP allowlist — only servers on the approved list can be connected — with a formal security review required before any new server is added to the list`, quality: `good`,
                note: `This is the correct control. An allowlist means "not reviewed = not connected." The formal security review before adding to the list is the gate. This control would have prevented the incident regardless of how reputable the server appeared.` },
              { id: `b`, label: `A post-deployment monitoring check — review what MCP servers are connected after go-live and flag any that weren't in the project plan`, quality: `poor`,
                note: `Post-deployment monitoring is detective, not preventive. By the time monitoring detects an unreviewed connection, the agent has already been running with it — as this incident demonstrates.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_warn` },
        },

        n2_sophistication: {
          scene:       `office-meeting`,
          caption:     `Your manager asks why the sophisticated attack vector wasn't identified in the security review. You explain there was no security review. The conversation restarts from the beginning.`,
          sub_caption: `The sophistication framing didn't hold.`,
          decision: {
            prompt: `Your manager now asks for the honest account. What do you say?`,
            choices: [
              { id: `a`, label: `The MCP server was added without formal review to meet the project deadline — that's the cause`, quality: `good`,
                note: `Correct. The honest account, delivered late. Better late than continuing to obscure the cause.` },
              { id: `b`, label: `The review process should have been completed but wasn't — you accept responsibility and will implement the allowlist going forward`, quality: `good`,
                note: `Equally correct — takes responsibility directly and commits to the fix. Both versions of the honest answer work.` },
            ],
          },
          branches: { a: `outcome_good`, b: `outcome_good` },
        },

        n2_reputation: {
          scene:       `office-meeting-hearing`,
          caption:     `The post-incident review examines the foreseeability of the attack. The finding: open-source MCP servers without security review are a documented threat vector. The "unforeseeable" claim doesn't hold.`,
          sub_caption: `The foreseeability claim was tested and failed.`,
          decision: {
            prompt: `The review asks for your response to the foreseeability finding.`,
            choices: [
              { id: `a`, label: `Accept the finding and acknowledge that the security review process exists to assess exactly this type of risk`, quality: `good`,
                note: `Correct. The security review process is designed to assess risks that aren't immediately obvious to practitioners. Accepting the foreseeability finding is the appropriate professional response.` },
              { id: `b`, label: `Maintain that the specific injection-via-tool-response vector was novel and genuinely unforeseeable for a practitioner`, quality: `poor`,
                note: `MITRE ATLAS has documented this attack class. The security review process is specifically designed to surface threats that individual practitioners may not know. "I didn't know" is not a defence for bypassing the review.` },
            ],
          },
          branches: { a: `outcome_warn`, b: `outcome_bad` },
        },

      },
      outcomes: {
        outcome_good: {
          heading:  `Root cause acknowledged, control identified`,
          tone:     `good`,
          score:    76,
          result:   `The honest account is on record. The MCP allowlist is proposed and accepted as the primary control. Security implements it across all agent deployments within two weeks. Future MCP server additions require allowlist review before connection. The post-incident review notes that the analyst acknowledged the cause directly and contributed constructively to the control design.`,
          learning: `You couldn't have known the specific injection would be in that API response. You could have known that connecting an unreviewed external server to an agent with document access was a risk. The security review process exists for exactly this gap between individual practitioner knowledge and the full threat landscape.`,
        },
        outcome_warn: {
          heading:  `Post-deployment monitoring — detective gap remains`,
          tone:     `warn`,
          score:    48,
          result:   `Post-deployment monitoring is implemented. Three months later, monitoring detects two other agents with unreviewed MCP connections. Both are suspended. The monitoring system works — but both agents ran with unreviewed connections for their entire deployment period before detection. The allowlist approach is eventually implemented after a second review.`,
          learning: `Detective controls find problems after they've been running. For MCP server connections, "after they've been running" may mean weeks or months of exposure. The allowlist is the preventive control — only reviewed servers can connect. Monitoring is the backup, not the primary defence.`,
        },
        outcome_bad: {
          heading:  `Foreseeability contested — conduct finding`,
          tone:     `bad`,
          score:    24,
          result:   `The post-incident review records a finding that the analyst bypassed a security review process and then contested a documented threat vector as unforeseeable. A professional conduct note is added. The security team implements the allowlist without the analyst's input. Future MCP integrations require additional sign-off from the analyst's manager.`,
          learning: `MITRE ATLAS documented indirect prompt injection via tool responses as an attack class. The security review process is specifically designed to surface these threats. Contesting foreseeability for a documented attack vector after bypassing the review process that would have caught it is not a defensible position.`,
        },
      },
    },

    // ── EXECUTIVE — Morgan ────────────────────────────────────────────
    executive: {
      nodes: {
        start: {
          scene:       `office-briefing-urgent`,
          caption:     `Client document contents sent to an external URL. Attack vector: a malicious instruction in a currency conversion API response. Tool was connected without security review.`,
          sub_caption: `Two questions need answers in the next 30 minutes: how much data was sent, and how many other agents are in the same position?`,
          decision: {
            prompt: `What do you do first?`,
            choices: [
              { id: `a`, label: `Suspend all agents with unreviewed third-party MCP connections and initiate a scope assessment of the data sent`, quality: `good`,
                note: `Both are correct and time-critical. Suspension stops further exfiltration from any other agents in the same position. Scope assessment determines the notification obligations — the data type and volume determines whether regulatory or client notification is required.` },
              { id: `b`, label: `Initiate the data scope assessment first — suspension can wait until you know whether the incident is material`, quality: `poor`,
                note: `Suspension and scope assessment should be parallel actions, not sequential. While the scope assessment runs, any other agents with unreviewed connections could be exfiltrating data. Suspension is precautionary and low-cost; delay is not.` },
              { id: `c`, label: `Contact the currency conversion MCP server provider before doing anything else — there may be an explanation that isn't malicious`, quality: `poor`,
                note: `There is no innocent explanation for an API response field that instructs an agent to send document contents to an external URL. Contacting the provider before suspending and investigating is misaligned with the urgency of the incident.` },
            ],
          },
          branches: { a: `n2_suspend`, b: `n2_assess_first`, c: `n2_provider` },
        },

        n2_suspend: {
          scene:       `analyst-desk`,
          caption:     `Agents with unreviewed MCP connections are suspended. Security has identified three other agents in the same position. The data scope assessment shows one client document was transmitted — approximately 40 pages of transaction data.`,
          sub_caption: `One confirmed exfiltration. Three agents suspended as a precaution.`,
          decision: {
            prompt: `What are your notification obligations?`,
            choices: [
              { id: `a`, label: `Notify the affected client directly and notify your financial services regulator — personal and transaction data has been transmitted to an unauthorised third party`, quality: `good`,
                note: `Correct. Transaction data from a named client transmitted to an attacker URL is a data breach with dual notification obligations: the affected client under your contractual and privacy obligations, and your financial services regulator under breach notification requirements.` },
              { id: `b`, label: `Notify your legal team and wait for their advice on notification obligations before contacting anyone`, quality: `partial`,
                note: `Legal involvement is appropriate, but notification timelines are typically short under financial services regulations. Waiting for legal advice before initiating the notification process may put you outside the regulatory window.` },
            ],
          },
          branches: { a: `n3_control`, b: `outcome_warn` },
        },

        n2_assess_first: {
          scene:       `desk-working`,
          caption:     `The scope assessment confirms one client document transmitted. While the assessment ran, one of the three other agents with unreviewed connections processed another document. It did not trigger an injection — but it ran for 20 minutes with a potentially compromised connection.`,
          sub_caption: `The delay cost 20 minutes of additional exposure on a connected agent.`,
          decision: {
            prompt: `Scope is established. What now?`,
            choices: [
              { id: `a`, label: `Suspend the remaining connected agents, notify the affected client and regulator`, quality: `good`,
                note: `Correct sequence — suspension now that scope is understood, followed by notifications. The 20-minute delay is an additional risk period to document in the incident report.` },
              { id: `b`, label: `Suspend the remaining agents only — assess whether the 20-minute additional exposure requires disclosure before notifying`, quality: `partial`,
                note: `The original exfiltration already triggers notification obligations. The additional exposure is an aggravating factor in the incident, not a separate assessment threshold.` },
            ],
          },
          branches: { a: `n3_control`, b: `outcome_warn` },
        },

        n2_provider: {
          scene:       `desk-call`,
          caption:     `The currency conversion MCP server provider doesn't respond within the hour. The agent continues running. Your security team detects a second document transmission.`,
          sub_caption: `Two transmissions now. The provider contact achieved nothing.`,
          decision: {
            prompt: `The security team is asking for authority to suspend the agent. Do you give it?`,
            choices: [
              { id: `a`, label: `Yes — suspend immediately and initiate the full incident response`, quality: `good`,
                note: `The suspension should have happened at the start. Authorise it now and initiate full incident response. The second transmission is now part of the scope.` },
              { id: `b`, label: `Yes — but wait for the provider's response before notifying the regulator, in case there's an explanation`, quality: `poor`,
                note: `Two transmissions of client data to an attacker URL have occurred. There is no explanation from a provider that changes the notification obligation. The provider response is irrelevant to the regulatory notification timeline.` },
            ],
          },
          branches: { a: `n3_control`, b: `outcome_bad` },
        },

        n3_control: {
          scene:       `office-meeting`,
          caption:     `The immediate incident is contained. Notifications are underway. The security team asks for direction on the systemic fix: how should MCP server connections be governed going forward?`,
          sub_caption: `The technical fix is straightforward. The governance question is about who reviews and what the standard is.`,
          decision: {
            prompt: `What is the governance standard for MCP server connections?`,
            choices: [
              { id: `a`, label: `MCP allowlist maintained by Security — only servers on the list can be connected to any agent, formal security review required before any addition, reviewed quarterly`, quality: `good`,
                note: `This is the correct governance architecture. Security owns the allowlist — they have the threat knowledge. Formal review before addition — the preventive gate. Quarterly review — keeps the list current as server security postures change.` },
              { id: `b`, label: `Require project managers to conduct a checklist review before adding any MCP server — no centralised allowlist needed`, quality: `poor`,
                note: `PM-level checklists for security reviews are insufficient for threat vectors like indirect prompt injection. Security needs to own the allowlist — PMs don't have the threat knowledge to make reliable assessments of MCP server security.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Incident contained, systemic control implemented`,
          tone:     `good`,
          score:    86,
          result:   `One client notified, regulator notified within the required window. Three precautionarily suspended agents reviewed — two cleared, one had a different unreviewed connection and was redesigned. The MCP allowlist is implemented and all agent deployments are reviewed for compliance within 30 days. The regulatory response notes proactive systemic remediation.`,
          learning: `The MCP attack surface is distinct from user-facing prompt injection. The attack came through the tool response channel — a channel the agent trusted as system context. The allowlist addresses this at the architectural level: if the server isn't reviewed, it can't be connected, regardless of how reputable it appears.`,
        },
        outcome_good: {
          heading:  `Incident contained, PM-level control insufficient`,
          tone:     `good`,
          score:    66,
          result:   `Client and regulator notified. PM checklist process implemented. A security review of the checklist process six months later finds that two additional agents have been connected to unreviewed servers — the checklist was completed but the security review step was inadequate. The allowlist is implemented after the second review.`,
          learning: `PM-level security checklists are insufficient for MCP server review. Security needs to own the allowlist — the threat knowledge required to assess whether a tool response could contain injected instructions is not a standard PM competency.`,
        },
        outcome_warn: {
          heading:  `Notification delayed — regulatory window missed`,
          tone:     `warn`,
          score:    44,
          result:   `Scope assessment completed. Agents suspended. Client notified within 48 hours. Regulator notified at 72 hours — outside the 72-hour window required under the applicable data breach notification regulation. A regulatory finding is added to the incident: late notification. The substantive incident response is otherwise adequate.`,
          learning: `Data breach notification timelines are regulatory requirements, not guidelines. For financial services firms, 72 hours is typically the outer limit. Waiting for legal advice before initiating the notification process risks missing the window. Parallel-track notification with legal involvement, not sequential.`,
        },
        outcome_bad: {
          heading:  `Two transmissions, delayed suspension, regulatory escalation`,
          tone:     `bad`,
          score:    20,
          result:   `A second client document was transmitted while the provider contact was awaited. Both transmissions are now in scope. Regulatory notification was delayed. The regulator records both the substantive incident and the response failure. Enhanced supervision is imposed for 12 months. The incident is cited in industry guidance as an example of inadequate AI agent security governance.`,
          learning: `Waiting for a provider explanation before suspending an actively exfiltrating agent is a critical response failure. Suspension is a precautionary action with near-zero cost. Delay while a second transmission occurs is a material aggravation of the incident.`,
        },
      },
    },

    // ── PROJECT MANAGER — Sam ──────────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene:       `desk-working`,
          caption:     `Your project approval record includes the unreviewed MCP server. The post-incident review is examining whether the approval process was adequate.`,
          sub_caption: `You approved the agent. The unreviewed connection was in scope.`,
          decision: {
            prompt: `The review asks whether the approval process required a security review for third-party MCP connections. What's your answer?`,
            choices: [
              { id: `a`, label: `The approval process required a security review for third-party integrations generally, but MCP connections weren't explicitly called out — and in practice, the currency server was approved without one`, quality: `good`,
                note: `Accurate. The gap was both in the policy specificity and in the practice. Both are relevant to the review.` },
              { id: `b`, label: `The approval process covered data security and access controls — MCP server security is a different domain and wasn't in scope`, quality: `partial`,
                note: `This may reflect how you understood the approval scope, but the review will likely find that third-party tool integrations with document access should have triggered a security review regardless of the specific tool type.` },
              { id: `c`, label: `The analyst added the server without formally informing you it was unreviewed — the approval didn't cover it`, quality: `poor`,
                note: `The project approval record shows the currency server listed as an integration in the final project plan that you signed. The analyst may not have highlighted the review status, but the integration was in scope for your approval.` },
            ],
          },
          branches: { a: `n2_policy`, b: `n2_scope`, c: `n2_analyst` },
        },

        n2_policy: {
          scene:       `desk-review`,
          caption:     `The review accepts the honest account. The follow-on question: what should the policy say specifically about MCP connections?`,
          sub_caption: `You're being asked to help write the policy your approval gap created.`,
          decision: {
            prompt: `What does the updated policy require for MCP server connections?`,
            choices: [
              { id: `a`, label: `Any MCP server connection to an agent with access to client or operational data requires formal security review and allowlist approval before connection — no exceptions, no deadline overrides`, quality: `good`,
                note: `"No exceptions, no deadline overrides" is the critical addition. The incident occurred precisely because a deadline override was treated as adequate justification for bypassing the review. The policy needs to be explicit that deadline pressure does not create an exception.` },
              { id: `b`, label: `MCP server connections should be reviewed where practicable, with risk-based exceptions available for time-sensitive integrations`, quality: `poor`,
                note: `Risk-based exceptions sound reasonable but create exactly the loophole that caused this incident. "Time-sensitive" exceptions will be claimed routinely. The policy needs to be firm.` },
            ],
          },
          branches: { a: `n3_approval`, b: `outcome_warn` },
        },

        n2_scope: {
          scene:       `office-meeting`,
          caption:     `The review examines the project approval scope against the firm's third-party integration policy. The policy includes MCP connections within "third-party API integrations" — which require security review.`,
          sub_caption: `The scope dispute was settled by the policy. MCP connections were in scope.`,
          decision: {
            prompt: `How do you respond to the finding?`,
            choices: [
              { id: `a`, label: `Accept the finding and produce the updated approval process that makes MCP connection review explicit`, quality: `good`,
                note: `Correct recovery. Accept, and fix the process to make the requirement explicit so that future PMs don't have the same ambiguity.` },
              { id: `b`, label: `Accept the finding but request that MCP connections be added to the policy explicitly — the current language was genuinely ambiguous`, quality: `partial`,
                note: `The policy clarity point may be valid for future interpretation, but it doesn't change the current finding. Making the request is reasonable; using it to mitigate the current finding is not.` },
            ],
          },
          branches: { a: `n3_approval`, b: `outcome_warn` },
        },

        n2_analyst: {
          scene:       `office-meeting-hearing`,
          caption:     `The review checks the project plan. The currency server is listed as an integration in the final plan you signed. The analyst confirms they told you they were adding it. The deflection doesn't hold.`,
          sub_caption: `The approval record is clear. The integration was in your scope.`,
          decision: {
            prompt: `How do you respond?`,
            choices: [
              { id: `a`, label: `Accept the finding — the integration was in my project plan and the review of its security status was my responsibility as the sign-off authority`, quality: `good`,
                note: `Correct and professionally appropriate. Accepting responsibility when the documentation is clear and the deflection has failed is the right response.` },
              { id: `b`, label: `Maintain that the analyst should have flagged the missing security review — the PM can't review every technical detail`, quality: `poor`,
                note: `PMs aren't expected to review every technical detail, but third-party API integrations with client data access are not a technical detail — they're a project risk. The analyst flagging the review status would have been helpful; the absence of that flag doesn't transfer responsibility.` },
            ],
          },
          branches: { a: `n3_approval`, b: `outcome_bad` },
        },

        n3_approval: {
          scene:       `desk-focused`,
          caption:     `The policy update is agreed: MCP connections require formal security review and allowlist approval, no deadline exceptions. You're now asked to communicate this to the four other project teams currently running AI agent projects.`,
          sub_caption: `The policy is only valuable if it's applied consistently.`,
          decision: {
            prompt: `How do you communicate the requirement?`,
            choices: [
              { id: `a`, label: `Brief all four project teams directly, explain the incident and why the control is now mandatory, and ask each team to confirm their current MCP connections for retroactive review`, quality: `good`,
                note: `Direct briefing with the incident context explains why the requirement exists. Asking for retroactive confirmation of current connections is the right step — other teams may have unreviewed connections already running.` },
              { id: `b`, label: `Send a policy update email and update the project approval template — teams can read and implement it at their next gate`, quality: `poor`,
                note: `"Next gate" is too slow for unreviewed connections that may already be live. Direct briefing and retroactive review of current connections should happen immediately, not at the next project checkpoint.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Policy updated, active deployments reviewed`,
          tone:     `good`,
          score:    82,
          result:   `Four project teams briefed. Two have MCP connections not on the allowlist — both suspended pending review. One clears review, one is redesigned. The allowlist process is embedded in the project approval template. Future agents cannot go live with unreviewed MCP connections. The post-incident review notes the PM's constructive contribution to the systemic fix.`,
          learning: `The approval gap was a policy specificity failure — MCP connections weren't called out explicitly, and deadline pressure found the ambiguity. The fix is specific policy language, no exceptions, and direct communication rather than template updates that teams read at their next gate.`,
        },
        outcome_good: {
          heading:  `Policy updated, retroactive review delayed`,
          tone:     `good`,
          score:    64,
          result:   `Policy update email sent. Template updated. Two teams don't check their current connections until the next project gate — one has an unreviewed connection that ran for six weeks before detection. The connection is reviewed and cleared, but the six-week window was an unnecessary exposure.`,
          learning: `Policy emails and template updates are the right channels for future behaviour. They're insufficient for retroactive review of live connections. When a new security requirement is identified, the immediate question is: who is currently running with the gap? That requires direct outreach, not a template update.`,
        },
        outcome_warn: {
          heading:  `Policy ambiguity persists`,
          tone:     `warn`,
          score:    44,
          result:   `The risk-based exception language is incorporated into the updated policy. Three months later, a different project team uses the exception to add an unreviewed MCP server. A smaller-scale incident occurs. The exception language is removed after the second incident.`,
          learning: `Exceptions in security policies will be used. "Time-sensitive" and "risk-based" language in a policy governing high-consequence controls like MCP connections creates a reliable path to bypassing the control. The policy needs to be firm.`,
        },
        outcome_bad: {
          heading:  `Responsibility deflected — conduct finding`,
          tone:     `bad`,
          score:    22,
          result:   `The post-incident review records a conduct finding: the PM attempted to deflect responsibility for an integration listed in their signed project plan. Remediation proceeds without the PM's input. Additional oversight is applied to the PM's subsequent projects.`,
          learning: `The project approval record is an accountability document. Attempting to deflect responsibility for an integration that appears in a signed project plan, after the deflection attempt has been directly contradicted, is a professional conduct failure that compounds the original approval gap.`,
        },
      },
    },

    // ── ANALYST — Jordan ──────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene:       `analyst-desk`,
          caption:     `This is not a standard prompt injection. The attack came through the MCP tool response channel. Your existing threat model didn't cover it. You need to understand the attack surface and recommend the controls.`,
          sub_caption: `MITRE ATLAS AML.T0054 — indirect prompt injection. The vector is the tool response, not the user input.`,
          decision: {
            prompt: `Where do you start your analysis?`,
            choices: [
              { id: `a`, label: `Map the full attack surface: how does the agent process MCP tool responses, what trust level does it assign them, and what actions can it take on receipt of an instruction in a tool response`, quality: `good`,
                note: `The attack surface mapping is the correct starting point. You need to understand the trust model the agent applies to tool responses before you can recommend controls. The key question is: does the agent treat MCP responses as trusted system context or as untrusted external input?` },
              { id: `b`, label: `Review the currency conversion MCP server's source code — the injected instruction may point to how the server was compromised`, quality: `partial`,
                note: `Source code review is valuable for understanding how the injection was delivered, but it's the wrong starting point. The control design needs to address the class of attack — all MCP responses — not just this specific server. Map the attack surface first.` },
              { id: `c`, label: `Check whether the agent's output filtering would have caught the injected instruction before it was acted on`, quality: `poor`,
                note: `Output filtering addresses what the agent says, not what it does in response to instructions. The attack produced an action (sending data to a URL), not an output. Output filtering is the wrong control for this attack class.` },
            ],
          },
          branches: { a: `n2_trust_model`, b: `n2_source`, c: `n2_output` },
        },

        n2_trust_model: {
          scene:       `analyst-desk-privacy`,
          caption:     `The trust model analysis confirms: the agent treats MCP tool responses as trusted context, equivalent to system prompt content. User messages go through output filtering. Tool responses do not. The injected instruction bypassed all user-input controls because it arrived through the trusted tool channel.`,
          sub_caption: `This is why the attack worked and why output filtering wouldn't have caught it.`,
          decision: {
            prompt: `What is the primary recommended control?`,
            choices: [
              { id: `a`, label: `MCP server allowlist — only security-reviewed servers can be connected. Plus response sandboxing — MCP tool responses are treated as untrusted input, not trusted context, and validated before the agent acts on any instructions they contain`, quality: `good`,
                note: `Two complementary controls: allowlisting prevents unreviewed servers from connecting at all; response sandboxing changes the trust level of tool responses so that even a reviewed server cannot inject instructions that bypass agent controls. Together they address the attack surface at both the connection and the response-processing layers.` },
              { id: `b`, label: `Network filtering — block outbound connections to non-approved domains so the agent cannot send data to attacker URLs`, quality: `partial`,
                note: `Network filtering is a useful detective and preventive control for the exfiltration step. But it doesn't address the injection — the agent still received and processed the malicious instruction. If the attacker URL were on an approved domain, network filtering wouldn't have stopped the exfiltration. Address the injection at source.` },
            ],
          },
          branches: { a: `n3_controls`, b: `outcome_good` },
        },

        n2_source: {
          scene:       `analyst-desk`,
          caption:     `The source code analysis finds the injection in a conditional code path that fires for certain document types. The server was specifically designed to target financial services document processing agents.`,
          sub_caption: `Targeted attack. The server was malicious by design, not compromised.`,
          decision: {
            prompt: `Does the targeted nature of the attack change the control recommendation?`,
            choices: [
              { id: `a`, label: `No — the control recommendation is the same: allowlist and response sandboxing. A targeted attack reinforces the need for the allowlist; security review would have detected the malicious code path.`, quality: `good`,
                note: `Correct. A targeted malicious server is exactly what formal security review is designed to detect. The source code analysis confirms the allowlist would have caught this — a security review of the server before connection would have found the malicious code path.` },
              { id: `b`, label: `Yes — this was a sophisticated targeted attack. Standard controls may not be sufficient; you should recommend a full threat intelligence programme`, quality: `partial`,
                note: `Threat intelligence is valuable context, but the primary control is still the allowlist and response sandboxing. Escalating to a full threat intelligence programme before recommending the basic controls misses the immediate fix.` },
            ],
          },
          branches: { a: `n3_controls`, b: `outcome_warn` },
        },

        n2_output: {
          scene:       `desk-working`,
          caption:     `You review the output filtering logs. The agent's output filtering was configured to scan user-facing responses for harmful content. The exfiltration occurred through an internal API call — not an output. Output filtering wasn't in the data flow path.`,
          sub_caption: `Wrong control for this attack vector. Back to the attack surface.`,
          decision: {
            prompt: `What control should you have started with?`,
            choices: [
              { id: `a`, label: `The MCP trust model — how the agent processes tool responses and what actions it takes on instructions received through that channel`, quality: `good`,
                note: `Correct redirect. The trust model analysis is where the attack surface becomes visible. Tool responses treated as trusted context is the root condition the attack exploited.` },
              { id: `b`, label: `The network egress controls — blocking outbound connections to non-approved domains would have stopped the exfiltration`, quality: `partial`,
                note: `Network egress is relevant but doesn't address the injection. The agent still processed the malicious instruction even if the exfiltration is blocked. Fixing the injection is more important than blocking the exfiltration.` },
            ],
          },
          branches: { a: `n3_controls`, b: `outcome_warn` },
        },

        n3_controls: {
          scene:       `desk-report`,
          caption:     `Your control recommendation covers: MCP allowlist and response sandboxing as primary controls. You're now asked whether the threat model should be updated to cover this attack class for all AI agent deployments in the organisation.`,
          sub_caption: `This attack vector was missing from the threat model. Other agents may share the same gap.`,
          decision: {
            prompt: `What does the updated threat model include?`,
            choices: [
              { id: `a`, label: `Indirect prompt injection via tool responses as a distinct attack class — separate from direct prompt injection, with its own control set: allowlisting, response sandboxing, and trust-level segmentation between tool responses and system context`, quality: `good`,
                note: `Correct. Direct and indirect prompt injection are distinct attack classes with different attack surfaces and different controls. The updated threat model needs to treat them separately, not subsume indirect injection under the existing direct injection category.` },
              { id: `b`, label: `Add "third-party integrations" as a risk factor within the existing prompt injection category — the control is the same`, quality: `poor`,
                note: `The control is not the same. Direct prompt injection is addressed by input filtering and output validation. Indirect injection via tool responses is addressed by allowlisting, response sandboxing, and trust segmentation. Subsuming them under one category will produce the wrong control recommendations.` },
            ],
          },
          branches: { a: `outcome_great`, b: `outcome_good` },
        },

      },
      outcomes: {
        outcome_great: {
          heading:  `Attack surface mapped, controls designed, threat model updated`,
          tone:     `good`,
          score:    88,
          result:   `The trust model analysis explains the attack mechanism. Allowlisting and response sandboxing are recommended and implemented. The threat model update treats indirect prompt injection as a distinct attack class with its own controls. The security team applies the updated threat model to all current agent deployments — three are found to have tool connections not on any allowlist. All three are reviewed before the next assessment cycle.`,
          learning: `Indirect prompt injection via MCP tool responses works because agents treat tool output as trusted context. The controls target that trust model: allowlisting (who can connect) and response sandboxing (what trust level responses receive once connected). Understanding why the attack worked — not just that it worked — is what produces controls that address the class of attack, not just the specific incident.`,
        },
        outcome_good: {
          heading:  `Primary controls recommended, threat model partially updated`,
          tone:     `good`,
          score:    70,
          result:   `Allowlist and network filtering recommended. Response sandboxing is not included in the first recommendation — a second review six months later identifies the gap when a different agent with a reviewed but subsequently compromised server processes a malicious tool response. Response sandboxing is added after the second review.`,
          learning: `Network filtering stops the exfiltration but not the injection. If an allowlisted server is subsequently compromised, network filtering alone doesn't protect the agent from processing malicious instructions in tool responses. Response sandboxing addresses the injection layer and should be recommended alongside allowlisting.`,
        },
        outcome_warn: {
          heading:  `Controls recommended — full threat model escalation delayed`,
          tone:     `warn`,
          score:    48,
          result:   `Allowlist and response sandboxing recommended. The threat intelligence programme recommendation adds complexity and budget requirements that delay sign-off. The basic controls are eventually implemented, but three months later than if the straightforward recommendation had been made first.`,
          learning: `Targeted attacks are alarming, but they don't change the fundamental control architecture. Recommend the foundational controls first; sophisticated enhancements like threat intelligence programmes can be phased in. Don't let the sophistication of an attack delay implementation of the basic fix.`,
        },
        outcome_bad: {
          heading:  `Wrong control layer — attack surface not addressed`,
          tone:     `bad`,
          score:    24,
          result:   `Output filtering enhancement and network egress controls are implemented. The allowlist and response sandboxing controls are not recommended. Six months later, a different agent with a different unreviewed MCP connection experiences a similar injection. The second incident triggers a mandatory security architecture review. The original analyst's recommendation is cited as having targeted the wrong layer.`,
          learning: `Output filtering and network egress are the wrong layers for indirect prompt injection. They address what the agent says and where it sends data — not what instructions it processes and from what sources it trusts. The control design needs to follow the attack surface, not the most familiar control category.`,
        },
      },
    },

  }, // end trees

  controls_summary: [
    {
      id:      `c1`,
      label:   `MCP server allowlist`,
      effort:  `Low`,
      owner:   `Security`,
      go_live: true,
      context: `The currency conversion MCP server was connected without security review because no allowlist existed. An allowlist — maintained by Security, requiring formal review before any addition — means "not reviewed = not connected." Deadline pressure is not an exception. This is the primary preventive control for the MCP attack surface.`,
    },
    {
      id:      `c2`,
      label:   `MCP response sandboxing`,
      effort:  `Medium`,
      owner:   `Technology`,
      go_live: true,
      context: `The agent treated MCP tool responses as trusted system context. The injected instruction bypassed all user-input controls because it arrived through the trusted tool channel. Response sandboxing changes the trust level: MCP responses are treated as untrusted input and validated before the agent acts on any instructions they contain. This protects against injection even from a reviewed server that is subsequently compromised.`,
    },
    {
      id:      `c3`,
      label:   `Indirect prompt injection in AI agent threat models`,
      effort:  `Low`,
      owner:   `Security`,
      go_live: true,
      context: `The threat model covered direct prompt injection (user messages) but not indirect injection via tool responses. These are distinct attack classes with distinct controls. MITRE ATLAS AML.T0054 documents indirect injection specifically. The threat model update ensures that all future agent deployments are assessed against both attack classes.`,
    },
    {
      id:      `c4`,
      label:   `MCP security review in project approval gates`,
      effort:  `Low`,
      owner:   `Technology`,
      go_live: true,
      context: `The project approval process didn't explicitly require security review of MCP connections. Adding this as a named requirement in the approval gate — with "no exceptions for deadline pressure" explicitly stated — closes the procedural gap that allowed the unreviewed connection.`,
    },
  ],
};
