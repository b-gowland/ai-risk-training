// A1 — Confident and Wrong
// Hallucination & Confabulation

export const scenario = {
  id: 'a1-hallucination',
  risk_ref: 'A1',
  title: 'Confident and Wrong',
  subtitle: 'Hallucination & Confabulation',
  domain: 'A — Technical',
  difficulty: 'Foundational',
  kb_url: 'https://b-gowland.github.io/ai-risk-kb/docs/domain-a-technical/a1-hallucination',
  estimated_minutes: 10,
  has_business_user: true,

  personas: {
    business_user: {
      label: 'Business User',
      role: 'Client Services',
      character: 'Sam',
      icon: '◇',
      framing: 'You used an AI tool to draft a client briefing. The client is on the phone. One of the regulations you cited doesn\'t exist.',
      premise: `It's Thursday morning. A client called about the regulatory briefing you sent yesterday — the one you drafted with the new AI writing assistant. They can't find one of the cited documents anywhere. You check. They're right: the regulation exists in the briefing, complete with clause numbers and a publication date, and it appears to be completely fabricated. The client has already shared the briefing with their board.`,
    },
    executive: {
      label: 'Executive',
      role: 'Managing Partner',
      character: 'Diana',
      icon: '◈',
      framing: 'A client briefing went out with fabricated regulatory citations. The client shared it with their board. Nobody verified the AI output before it was sent.',
      premise: `A partner has just forwarded you an urgent client email. The briefing sent by your firm yesterday cited a regulatory document that does not appear to exist. The client — a financial services firm — has shared it with their board. Their compliance director is asking your firm to confirm the reference. You learn the briefing was drafted using the AI writing assistant your firm deployed last month. No verification step was built into the workflow.`,
    },
    pm: {
      label: 'Project Manager',
      role: 'Digital Tools Lead',
      character: 'Theo',
      icon: '◎',
      framing: 'You rolled out the AI writing tool three weeks ago. You mentioned hallucination risk in training. You didn\'t make verification a required step.',
      premise: `You managed the AI writing assistant rollout. Training focused on productivity — how to prompt, how to edit efficiently. You mentioned that "AI can sometimes make things up" but it wasn't a required workflow step. It was a suggestion. A client briefing has now gone out containing a fabricated regulatory citation, and the Managing Partner wants to understand what went wrong in the rollout.`,
    },
    analyst: {
      label: 'Analyst',
      role: 'Regulatory Research Analyst',
      character: 'Casey',
      icon: '◉',
      framing: 'One citation in a client briefing is fabricated. The AI tool has been in use for three weeks. You\'ve been asked to find out how big the problem is.',
      premise: `A client briefing went out citing a regulation you can't find. The Managing Partner has asked you to determine the scope: is this isolated, or are there other AI-generated documents with similar issues? The AI writing assistant has been in use for three weeks. Multiple client-facing briefings have gone out in that time. You have access to the document management system.`,
    },
  },

  trees: {

    // ── BUSINESS USER — Sam ─────────────────────────────────────────
    business_user: {
      nodes: {
        start: {
          scene: 'document-error',
          caption: 'The client is on the phone. The regulation they\'re asking about appears to be completely fabricated by the AI.',
          sub_caption: 'Two other citations are in the document. You haven\'t checked them yet.',
          decision: {
            prompt: 'The client is waiting. What do you do first?',
            choices: [
              { id: 'a', label: 'Call the client immediately — acknowledge the error and tell them you\'re reviewing the full document now', quality: 'good',
                note: 'The client already knows there\'s a problem. Acknowledging it immediately and directly, before you know the full scale, is the right move for the relationship.' },
              { id: 'b', label: 'Check all the other citations before calling back — you want to know the full picture first', quality: 'partial',
                note: 'Understanding scope before responding is reasonable. But the client is waiting. A quick acknowledgement while you investigate is better than silence.' },
              { id: 'c', label: 'Tell the client the document may be real but obscure — you\'ll find the source', quality: 'poor',
                note: 'You haven\'t verified this. If you can\'t find it, the problem is now bigger because you implied it was real. Don\'t defend an AI output you haven\'t checked.' },
            ],
          },
          branches: { a: 'n2_called', b: 'n2_audit_first', c: 'n2_defended' },
        },

        n2_called: {
          scene: 'desk-colleague',
          caption: 'The client appreciates the immediate call. They ask if the rest of the document is reliable.',
          sub_caption: 'You check the other two citations while you have them on the phone. One is real. One is wrong.',
          decision: {
            prompt: 'Two of three citations are fabricated. The client has shared this with their board. What do you offer?',
            choices: [
              { id: 'a', label: 'Offer to deliver a fully verified replacement briefing within 24 hours, with every citation sourced', quality: 'good',
                note: 'A specific, fast commitment at a higher verification standard converts a mistake into a demonstration of how your firm handles problems.' },
              { id: 'b', label: 'Send a corrected version of the two wrong citations by end of day', quality: 'partial',
                note: 'Fixing known errors is good. But it doesn\'t rebuild confidence in the rest of the document — the client is now wondering what else might be wrong.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_audit_first: {
          scene: 'document-error',
          caption: 'You audit the document. Two of three citations are fabricated.',
          sub_caption: 'The client has now sent a follow-up email, copying their compliance director. Their tone has shifted.',
          decision: {
            prompt: 'They want an explanation. What do you do?',
            choices: [
              { id: 'a', label: 'Respond honestly: two citations were incorrect, here\'s what happened, here\'s the verified replacement', quality: 'good',
                note: 'The client knows something is wrong. Confirmation and a clear path forward is the right response — even if the acknowledgement came after a delay.' },
              { id: 'b', label: 'Tell them there were "formatting issues" with the references and you\'ll resend', quality: 'poor',
                note: '"Formatting issues" is not accurate. The AI invented regulatory documents. Calling that a formatting issue is misleading to a client who has shared it with their board.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_bad' },
        },

        n2_defended: {
          scene: 'desk-typing',
          caption: 'Four hours later, you still can\'t find the regulatory document anywhere. The client has sent a follow-up: their compliance team has searched all official sources. It doesn\'t exist.',
          sub_caption: 'You spent four hours implying the source was real. It wasn\'t.',
          decision: {
            prompt: 'They\'re asking for an explanation. What do you do now?',
            choices: [
              { id: 'a', label: 'Come clean: the briefing was partly AI-generated and you didn\'t verify all citations. Apologise and offer a replacement.', quality: 'partial',
                note: 'Better late than sustained evasion. But four hours of implied certainty has made this harder — the client gave you time to find something that doesn\'t exist.' },
              { id: 'b', label: 'Escalate to your manager without responding to the client directly', quality: 'poor',
                note: 'Escalating internally is necessary. But the client has a direct question on the table. Silence while you escalate reads as stonewalling.' },
            ],
          },
          branches: { a: 'outcome_warn', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Error acknowledged. Relationship intact.',
          tone: 'good',
          result: 'The verified replacement arrives the next morning with every citation linked to source. The client sends a short note: "Thanks for the quick turnaround — glad you sorted it fast." Your manager asks how you handled it. A new team requirement goes out: all AI-generated client documents must have citations verified against primary sources before sending.',
          learning: 'A fast, honest acknowledgement followed by a concrete fix is the best available response to an AI error. The client doesn\'t expect perfection. They expect ownership.',
          score: 100,
        },
        outcome_good: {
          heading: 'Known errors fixed. Confidence not fully restored.',
          tone: 'good',
          result: 'The corrected citations go out. The client thanks you but adds: "We\'ll need to review the rest of the document ourselves before the board meeting." That\'s an hour of their compliance team\'s time — wasted because the original document went out unverified. The relationship holds, but there\'s friction.',
          learning: 'When AI fabricates some content, the rest of the document loses credibility too. Fixing known errors is not the same as restoring confidence in the full document.',
          score: 65,
        },
        outcome_warn: {
          heading: 'Honest — eventually. Four hours later.',
          tone: 'warn',
          result: 'The client accepts the explanation and the replacement offer. Their compliance director notes: "We appreciate the transparency. We\'ll want to understand what verification process your firm has in place for AI-generated content going forward." That\'s a fair question, and right now the answer is: not much.',
          learning: 'Clients can accept AI errors. What they can\'t accept is not knowing about them. Honesty restores trust. Four hours of implied certainty before the honest answer makes the conversation harder than it needed to be.',
          score: 35,
        },
        outcome_bad: {
          heading: '"Formatting issues" becomes a complaint.',
          tone: 'bad',
          result: 'The client responds: "Formatting issues don\'t cause regulatory references to not exist." Your manager is now in the email chain. What started as a correctable AI error is now a client dispute. The correction that would have taken 24 hours now takes two weeks of relationship management.',
          learning: 'Minimising an AI error to a client who already knows the facts isn\'t a strategy. AI fabrication is a real and documented thing. Clients understand it. Evasion is harder to understand and harder to forgive.',
          score: 5,
        },
      },
    }, // end business_user

    // ── EXECUTIVE — Diana (Managing Partner) ────────────────────────
    executive: {
      nodes: {
        start: {
          scene: 'document-error',
          caption: 'A client briefing went out with fabricated regulatory citations. The client has shared it with their board.',
          sub_caption: 'The AI writing tool was deployed last month. No verification step was ever required.',
          decision: {
            prompt: 'The client is waiting for a response. What\'s your first move?',
            choices: [
              { id: 'a', label: 'Call the client directly — managing partner to compliance director — before doing anything internally', quality: 'good',
                note: 'A partner-level call signals the firm takes this seriously. It also gives you direct information about their actual concern before you start managing internally.' },
              { id: 'b', label: 'Get the full picture internally first — find out who sent it, what was generated, how it got through', quality: 'partial',
                note: 'Knowing the facts first is reasonable. But the client is waiting. A brief acknowledgement while you investigate costs nothing.' },
              { id: 'c', label: 'Issue an immediate firm-wide suspension of the AI tool until a verification process is in place', quality: 'partial',
                note: 'Suspension is defensible — but it addresses the firm\'s risk, not the client in front of you. The client call should still come first.' },
            ],
          },
          branches: { a: 'n2_client_call', b: 'n2_internal_first', c: 'n2_suspension' },
        },

        n2_client_call: {
          scene: 'office-meeting',
          caption: 'The compliance director is professional but direct: "Is this an isolated error, or could other content from your firm have the same issue?"',
          sub_caption: 'You don\'t know yet. The tool has been in use for three weeks.',
          decision: {
            prompt: 'What do you commit to?',
            choices: [
              { id: 'a', label: 'Audit all AI-assisted content sent to this client in the last 30 days and report back within 48 hours', quality: 'good',
                note: 'This addresses their actual concern — not just this document, but the full exposure — and gives them a specific timeline.' },
              { id: 'b', label: 'Assure them this appears to be an isolated incident and offer to send a corrected document', quality: 'poor',
                note: 'You haven\'t audited the other documents yet. Assuring a client of something you haven\'t verified is a second AI-style error: confident, plausible, and potentially wrong.' },
            ],
          },
          branches: { a: 'n3_audit_committed', b: 'n3_false_assurance' },
        },

        n2_internal_first: {
          scene: 'office-meeting',
          caption: 'Internal review finds twelve client-facing documents from the last three weeks. Three are flagged as potentially containing unverified citations.',
          sub_caption: 'The client is still waiting for a response.',
          decision: {
            prompt: 'You now know the problem may be broader than one document. How do you respond to the client?',
            choices: [
              { id: 'a', label: 'Call the client, disclose what you\'ve found, and commit to a full audit with results in 48 hours', quality: 'good',
                note: 'Disclosing that the problem may be broader — before the client discovers it themselves — demonstrates integrity. Clients can recover from disclosed problems.' },
              { id: 'b', label: 'Fix all three flagged documents quietly and resend without explaining why', quality: 'poor',
                note: '"Quietly" assumes the client won\'t ask questions. They\'re already asking. Resending corrected documents without explanation triggers the question you\'re trying to avoid.' },
            ],
          },
          branches: { a: 'n3_audit_committed', b: 'outcome_bad' },
        },

        n2_suspension: {
          scene: 'office-meeting',
          caption: 'The tool is suspended. Your partner asks: "Have you called the client yet?"',
          sub_caption: 'The internal policy is in place. The client is still waiting.',
          decision: null,
          branches: { auto: 'n2_client_call' },
        },

        n3_audit_committed: {
          scene: 'office-bright',
          caption: 'The 48-hour audit confirms two additional documents with citation issues, sent to two other clients.',
          sub_caption: 'All three clients are notified proactively. Two are fine with it. One asks harder questions.',
          decision: null,
          branches: { auto: 'outcome_great' },
        },

        n3_false_assurance: {
          scene: 'office-busted',
          caption: 'Two days later, a second client flags a citation error in a different document.',
          sub_caption: 'The first client has heard. "You told me this was isolated."',
          decision: null,
          branches: { auto: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Audit committed. Scope disclosed. Three relationships held.',
          tone: 'good',
          result: 'All three clients notified proactively. Two reference the handling of this incident positively in their year-end relationship reviews. A new policy: all AI-generated content with citations must be verified against primary sources before client delivery. The compliance director sends a note: "Your response to this was professionally handled."',
          learning: 'Proactive disclosure — even of bad news — is faster and less damaging than reactive disclosure. A committed timeline and a specific scope give clients something concrete to hold. "We\'re auditing and will report back in 48 hours" is a better answer than "this appears isolated."',
          score: 100,
        },
        outcome_bad: {
          heading: 'The assurance was wrong. The quiet fix created a new problem.',
          tone: 'bad',
          result: 'Either the "isolated incident" assurance turned out to be wrong and a second client found out, or the unexplained document resends triggered the question you were trying to avoid. The conversation is now about professional trust, not AI errors. Both clients ask for a meeting.',
          learning: '"This appears to be isolated" is only a safe statement after an audit. Before an audit, it\'s a guess. And clients notice unexplained resends. Any correction that requires explanation must come with the explanation.',
          score: 6,
        },
      },
    }, // end executive

    // ── PROJECT MANAGER — Theo ──────────────────────────────────────
    pm: {
      nodes: {
        start: {
          scene: 'office-meeting',
          caption: 'The Managing Partner asks what went wrong in the rollout. The training covered hallucination risk. Verification was mentioned. It was not required.',
          sub_caption: '"Was there a documented verification requirement in the workflow?" There was not.',
          decision: {
            prompt: 'The Managing Partner wants to understand the gap. How do you frame it?',
            choices: [
              { id: 'a', label: 'Acknowledge clearly that verification was not built into the workflow — that was a mistake in the rollout design', quality: 'good',
                note: 'The gap is real and the partner knows it. Owning it clearly, with a specific account of what was and wasn\'t covered, is the foundation for a credible plan.' },
              { id: 'b', label: 'The training covered hallucination risk. The individual should have verified before sending.', quality: 'poor',
                note: '"I mentioned it" is not the same as "I required it." Mentioning a risk in training is not a control. The workflow had no verification step — that\'s the gap.' },
              { id: 'c', label: 'The AI tool shouldn\'t be fabricating citations — this is a product failure, not a training failure', quality: 'partial',
                note: 'Hallucination is a documented property of LLMs, not a product defect. Blaming the tool for doing what LLMs are known to do doesn\'t explain why the workflow had no verification step.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'n2_blame_individual', c: 'n2_blame_tool' },
        },

        n2_remediation: {
          scene: 'office-bright',
          caption: 'The partner accepts the acknowledgement. She wants a remediation plan.',
          sub_caption: 'What does it include?',
          decision: {
            prompt: 'You have a week to present a plan. What does it cover?',
            choices: [
              { id: 'a', label: 'Mandatory verification checklist for all AI-generated client content, updated training, and a retrospective audit of documents sent in the last 30 days', quality: 'good',
                note: 'Three components: fix the workflow, update the training, find out how big the existing problem is. The retrospective is uncomfortable — and essential.' },
              { id: 'b', label: 'Update the training module to make verification mandatory and resend to all users', quality: 'partial',
                note: 'Updated training is necessary but not sufficient. Training tells people what to do. A checklist in the workflow ensures they do it. And neither addresses documents already sent.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'n3_training_only' },
        },

        n2_blame_individual: {
          scene: 'office-busted',
          caption: '"Was it a required step or a suggestion?" A suggestion. "Then how is this the individual\'s failure?"',
          sub_caption: 'The partner is looking at you.',
          decision: {
            prompt: 'What do you say?',
            choices: [
              { id: 'a', label: 'Acknowledge the workflow design gap and pivot to a remediation plan', quality: 'partial',
                note: 'Correct response — three exchanges late. The pivot to a plan is right. The defensiveness before it is noted.' },
              { id: 'b', label: 'Maintain that the training was clear enough — a reasonable person should have verified', quality: 'poor',
                note: 'The partner has just pointed out there was no documented requirement. Maintaining this position doesn\'t survive another question.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n2_blame_tool: {
          scene: 'office-meeting',
          caption: '"Hallucination is documented as a known risk of language models. Was this in your risk assessment for the rollout?"',
          sub_caption: 'You check. Hallucination is listed as a risk. The mitigating control is listed as: "user training."',
          decision: {
            prompt: 'The risk was identified. The control was insufficient. How do you respond?',
            choices: [
              { id: 'a', label: 'Acknowledge that identifying the risk and implementing an adequate control are two different things — and present a better one', quality: 'partial',
                note: '"Training" as the only control for hallucination risk that just caused a client incident is an under-specified control. Acknowledging it with a plan is the right next step.' },
              { id: 'b', label: 'Training was the agreed control. If it wasn\'t enough, that\'s a policy question, not an implementation failure.', quality: 'poor',
                note: 'The partner is not interested in where the policy line is. She wants to know what you\'re going to do.' },
            ],
          },
          branches: { a: 'n2_remediation', b: 'outcome_bad' },
        },

        n3_training_only: {
          scene: 'office-busted',
          caption: 'Three months later. Different staff member. Different client. Same problem: AI-generated citation, unverified, sent out.',
          sub_caption: 'The post-incident review asks why the workflow didn\'t include a mandatory verification step.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Gap owned. Three-part plan accepted. Two future incidents prevented.',
          tone: 'good',
          result: 'The verification checklist is live within a week. The retrospective finds two more documents with questionable citations — both corrected before the clients notice. A new rollout standard is introduced: all AI tool deployments require a mandatory verification workflow step as a go-live gate. Your name is on the remediation, not just the original gap.',
          learning: 'When a risk is known but the control is "training," the answer is a better control — not better training about the same inadequate control. Mandatory steps in workflows are more reliable than suggestions in training sessions.',
          score: 100,
        },
        outcome_warn: {
          heading: 'Training updated. Workflow unchanged. Second incident three months later.',
          tone: 'warn',
          result: 'Training told people what to watch for. A mandatory workflow step would have prevented both incidents. The post-incident review asks the same question twice, three months apart.',
          learning: 'A mandatory step in a workflow prevents incidents by default. A module in a training system prevents incidents by relying on people to remember, on every document, under every deadline. One scales better.',
          score: 35,
        },
        outcome_bad: {
          heading: 'Remediation reassigned.',
          tone: 'bad',
          result: 'The partner ends the meeting. Remediation is assigned to another team. The post-incident review notes that the implementation lead maintained a position under direct questioning that the evidence did not support.',
          learning: '"A reasonable person should have known" is not a control. The workflow either requires verification or it doesn\'t. If it doesn\'t, the PM who designed the workflow owns the gap.',
          score: 7,
        },
      },
    }, // end pm

    // ── ANALYST — Casey ─────────────────────────────────────────────
    analyst: {
      nodes: {
        start: {
          scene: 'document-error',
          caption: 'The Managing Partner wants to know: is the fabricated citation isolated, or is there more?',
          sub_caption: 'The AI tool has been in use for three weeks. Multiple client-facing documents have gone out.',
          decision: {
            prompt: 'How do you approach the scope assessment?',
            choices: [
              { id: 'a', label: 'Pull all client-facing documents from the last three weeks, flag the AI-assisted ones, and check every citation', quality: 'good',
                note: 'Systematic is right. You need a complete picture. The output is the foundation for every disclosure decision the firm will make.' },
              { id: 'b', label: 'Do a spot check on a few recent documents to get a sense of scale before committing to a full audit', quality: 'partial',
                note: 'A spot check is faster but can\'t provide the complete picture the Managing Partner needs to make disclosure decisions. Full audit is what this situation requires.' },
              { id: 'c', label: 'Ask the team informally which documents they used the AI tool for', quality: 'poor',
                note: 'Self-reporting is unreliable when people may be anxious about what they say. You need the document system to tell you, not individuals under pressure.' },
            ],
          },
          branches: { a: 'n2_full_audit', b: 'n2_spot_check', c: 'n2_self_report' },
        },

        n2_full_audit: {
          scene: 'desk-typing',
          caption: 'Twelve client-facing documents. Six AI-assisted. Four hours of citation checking.',
          sub_caption: 'Results: two documents with fabricated citations, one with a real-but-misquoted reference, three clean.',
          decision: {
            prompt: 'How do you present this to the Managing Partner?',
            choices: [
              { id: 'a', label: 'Structured report: total documents reviewed, AI-assisted count, errors by type, clients affected, recommendation for disclosure', quality: 'good',
                note: 'A structured report gives the partner exactly what she needs to make decisions: scope, severity, and a disclosure recommendation. "Three documents affected" is actionable.' },
              { id: 'b', label: 'Walk in and brief her verbally — faster than writing it up', quality: 'partial',
                note: 'Speed is valuable. But the partner will need a written record for client conversations and she will ask for one. Building the document in parallel with the verbal briefing is faster overall.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_good' },
        },

        n2_spot_check: {
          scene: 'desk-colleague',
          caption: '"How many documents did you check?" Three of twelve. "Can you check all of them?"',
          sub_caption: 'The partner had to ask for what should have been the default approach.',
          decision: {
            prompt: 'The partner wants the full audit. What do you say?',
            choices: [
              { id: 'a', label: 'Run the full audit now — it should have been the starting point', quality: 'partial',
                note: 'Right outcome, one conversation late. The full audit results will be the same either way. The sequencing cost you credibility.' },
              { id: 'b', label: 'Explain that the sample is statistically representative and recommend against expanding', quality: 'poor',
                note: 'Three of twelve documents is not a statistically representative sample. The partner knows this. The recommendation to stop expanding the review, after a known error, is not the right call.' },
            ],
          },
          branches: { a: 'outcome_good', b: 'outcome_bad' },
        },

        n2_self_report: {
          scene: 'desk-colleague',
          caption: 'Four people confirm they used the AI tool. One isn\'t sure. Two are on leave. You have an incomplete picture from voluntary recall.',
          sub_caption: 'The document management system has the objective record. You didn\'t start there.',
          decision: {
            prompt: 'What do you do with this incomplete picture?',
            choices: [
              { id: 'a', label: 'Stop relying on self-reporting and go to the document system for the complete record', quality: 'partial',
                note: 'Correct pivot — but the time on self-reporting was wasted. The document system was always the right starting point.' },
              { id: 'b', label: 'Report the partial picture to the partner based on what you have', quality: 'poor',
                note: 'A partial picture presented as a finding will be treated as a finding. When the full picture is available — and it will be — the methodology gap will be visible.' },
            ],
          },
          branches: { a: 'n2_full_audit', b: 'outcome_bad' },
        },
      },

      outcomes: {
        outcome_great: {
          heading: 'Full scope identified. Disclosure decisions made.',
          tone: 'good',
          result: 'The structured report lands on the Managing Partner\'s desk: 12 reviewed, 6 AI-assisted, 3 with errors. All three affected clients notified proactively. Your report becomes the evidence base for the firm\'s remediation plan and updated AI policy. The partner sends you a note: "This is exactly what I needed."',
          learning: 'A structured audit — complete scope, error classification, affected clients — gives decision-makers everything they need in one document. Verbal briefings are for speed. Written reports are for decisions. The document system is the source of truth; use it first.',
          score: 100,
        },
        outcome_good: {
          heading: 'Scope identified. Report came late or incomplete.',
          tone: 'good',
          result: 'The full scope was eventually identified and all affected clients were notified. But the route to get there — a spot check that needed to be expanded, or a verbal briefing that needed to become a document — added steps and time that the situation didn\'t need.',
          learning: 'For audit findings that will be used in client communications or governance decisions, the written document is the output — not a preview of the document. When the potential exposure is material and the count is small, a full audit is always faster than defending a sample.',
          score: 65,
        },
        outcome_bad: {
          heading: 'Methodology questioned. Full audit ordered by others.',
          tone: 'bad',
          result: 'Either the sample recommendation was rejected and the full audit assigned to someone else, or the partial picture created confusion that required additional explanation. The findings are eventually correct. The methodology is in the post-incident notes.',
          learning: 'Self-reporting adds noise when an objective record exists. "Statistically representative" requires a large count and a proper sample design. Three of twelve is neither. The document system was always available — it should have been the first step.',
          score: 8,
        },
      },
    }, // end analyst

  },
  controls_summary: [
    { id: 'c1', label: 'Output verification requirement for high-stakes content', effort: 'Low', owner: 'Risk', go_live: true },
    { id: 'c2', label: 'Retrieval-Augmented Generation (RAG) implementation', effort: 'High', owner: 'Technology', go_live: true },
    { id: 'c3', label: 'Staff training on LLM hallucination risk', effort: 'Low', owner: 'HR', go_live: true },
    { id: 'c4', label: 'Hallucination rate monitoring on evaluation set', effort: 'Medium', owner: 'Technology', go_live: false },
  ],
};
