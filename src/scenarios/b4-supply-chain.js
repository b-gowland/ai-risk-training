// B4 — Third-Party / Supply Chain AI Risk
// "Inside the Vendor"
// Security team discovers the vendor AI DPA doesn't cover the
// foundation model sub-processor. Client data may have entered
// a training pipeline. Procurement, legal, security, and leadership
// navigate the supply chain failure.

export const scenario = {
  id:                'b4-supply-chain',
  risk_ref:          'B4',
  title:             'Inside the Vendor',
  subtitle:          'Third-Party AI Supply Chain Risk',
  domain:            'B — Governance',
  difficulty:        'Advanced',
  kb_url:            'https://b-gowland.github.io/ai-risk-kb/docs/domain-b-governance/b4-supply-chain',
  estimated_minutes: 13,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Document Processing Coordinator',
      character: 'Quinn',
      icon:      '◇',
      framing:   'You\'ve been submitting client documents to the vendor AI for six months. Nobody told you where those documents actually went.',
      premise:   `You are Quinn, a Document Processing Coordinator. For the past six months your team has been using a vendor AI product to process and summarise client contracts and financial statements. It saves hours every day. This morning your manager called you in: the security team has found that the vendor's DPA doesn't cover the foundation model provider the vendor uses. The documents your team submitted may have entered an external training pipeline. You need to account for exactly what was submitted.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief Risk Officer',
      character: 'Blake',
      icon:      '◈',
      framing:   'The vendor DPA covers the vendor. It doesn\'t cover their AI sub-processor. Six months of client documents may be in a training pipeline you didn\'t approve.',
      premise:   `You are Blake, Chief Risk Officer. The security team has identified a critical gap: your vendor AI product processes documents through a foundation model API, and the vendor's DPA does not bind that sub-processor to your data protection requirements. You did not know the vendor used a public LLM API. Procurement didn't ask. Legal didn't check. The AI-specific DDQ didn't exist. Six months of client financial documents may have entered the training pipeline of a third-party model provider.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'Procurement Manager',
      character: 'Avery',
      icon:      '◎',
      framing:   'You ran the vendor due diligence. The AI-specific questions weren\'t on the DDQ. They should have been.',
      premise:   `You are Avery, Procurement Manager. You led the vendor selection for the document processing AI product. You ran a standard DDQ: security posture, data residency, SOC 2, ISO 27001. You did not ask which foundation model the vendor used. You did not ask whether the vendor's API tier prevented training on submitted data. You did not request an AI Bill of Materials. The gap the security team found is a procurement due diligence failure.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Information Security Analyst',
      character: 'Drew',
      icon:      '◉',
      framing:   'You found it. The vendor uses a consumer-tier API. The DPA doesn\'t name the sub-processor. You need to scope the exposure before anyone else does.',
      premise:   `You are Drew, Information Security Analyst. During a routine vendor security review, you noticed the vendor AI product's API traffic was going to a public foundation model endpoint — not an enterprise tier. You checked the DPA. The sub-processor is not named. You checked the vendor's terms: the standard tier permits training on submitted content. Six months of your organisation's client documents have been submitted through this pathway. You now need to scope the exposure and brief the CRO.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-intranet',
          caption:     'Your manager needs to know: what types of documents did your team submit to the vendor AI over the past six months?',
          sub_caption: 'The answer will determine the scope of the potential exposure.',
          decision: {
            prompt: 'What do you tell your manager?',
            choices: [
              { id: 'a', label: 'A complete account: client contracts, financial statements, some board papers — and the approximate volume. You have the submission logs.', quality: 'good',
                note: 'Complete and documented. The exposure assessment depends on knowing exactly what data types were submitted. Your logs are the primary evidence.' },
              { id: 'b', label: 'Contracts and financial documents — but you\'re not sure of the exact types. You\'d need to check the logs.', quality: 'partial',
                note: 'Checking the logs is the right move. Don\'t estimate when the records exist — retrieve them before providing an account.' },
              { id: 'c', label: 'You\'re not comfortable describing the documents without Legal present — some of them are highly confidential.', quality: 'poor',
                note: 'Your manager needs this information to scope the incident. Legal involvement is appropriate but it shouldn\'t prevent you from providing a factual account of what was submitted.' },
            ],
          },
          branches: { a: 'n2_full', b: 'n2_partial', c: 'outcome_warn' },
        },

        n2_full: {
          scene:       'office-meeting',
          caption:     'Your submission logs give the incident team a clear picture of the data types and volume.',
          sub_caption: 'Your manager asks: did anything about the tool make you think your documents might leave the vendor\'s systems?',
          decision: {
            prompt: 'What do you say?',
            choices: [
              { id: 'a', label: 'No — you assumed enterprise tools kept data within the vendor\'s environment. Nobody told you otherwise.', quality: 'good',
                note: 'Honest and accurate. This is the reasonable assumption most users make — and the fact that it was wrong is a governance failure, not a user failure.' },
              { id: 'b', label: 'You didn\'t think about it — you used the tool the way you were shown.', quality: 'partial',
                note: 'Also accurate, but the first answer is more useful: it identifies the gap in what users were told, which is the basis for the acceptable use policy recommendation.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_partial: {
          scene:       'desk-focused',
          caption:     'You retrieve the logs. The picture is more complete than you remembered.',
          sub_caption: 'Board papers included. That changes the exposure scope.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Complete account. Governance gap identified.',
          tone:     'good',
          result:   'Your documented account of what was submitted — with logs — gives the incident team the scoping information they need. Your observation that nobody told you documents left the vendor environment is the basis for the acceptable use policy recommendation: users need to know where their data goes, not just what tool to use.',
          learning: 'Users can only make informed decisions about data handling if they are told where the data goes. When that information isn\'t provided, the gap is in governance — not in user behaviour.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Account provided. Scope underestimated.',
          tone:     'warn',
          result:   'Your initial account missed the board papers. When the full log is reviewed, the scope is wider than reported. The incident team has to revise its exposure assessment. The delay in establishing accurate scope extends the notification decision window.',
          learning: 'In an incident involving data exposure, an underestimated scope creates a second problem: notification decisions made on incomplete information may need to be revised. Retrieve the logs before providing an account.',
          score:    50,
        },
        outcome_bad: {
          heading:  'Scope unknown. Response delayed.',
          tone:     'bad',
          result:   'Without your account, the incident team cannot scope the exposure. Legal is consulted. A data mapping exercise is commissioned. The notification decision is delayed by five days while the scope is established from vendor logs rather than internal records. The delay is noted in the incident report.',
          learning: 'Operational staff are often the fastest source of scoping information in a data incident — they know what they submitted. Deferring an account doesn\'t protect anyone; it delays a response that gets harder with time.',
          score:    0,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'boardroom',
          caption:     'Six months of client documents. A DPA that doesn\'t cover the sub-processor. A vendor using a public LLM API on a standard tier.',
          sub_caption: 'You have three decisions to make simultaneously.',
          decision: {
            prompt: 'What is your immediate priority?',
            choices: [
              { id: 'a', label: 'Suspend the vendor product, commission a data mapping exercise to scope the exposure, and brief Legal on notification obligations — all before end of day.', quality: 'good',
                note: 'All three are necessary and urgent. Suspension stops further exposure. Data mapping establishes what was affected. Legal briefing starts the notification clock. None can wait.' },
              { id: 'b', label: 'Brief the board before taking any operational action — they need to know about this before the product is suspended.', quality: 'partial',
                note: 'Board awareness is important but not a prerequisite for suspension. The product should not continue processing client documents while you prepare a board briefing.' },
              { id: 'c', label: 'Contact the vendor to understand exactly what data was processed by the sub-processor before deciding on any action.', quality: 'poor',
                note: 'Vendor confirmation is useful but takes time. In the interim, the product is still running. Suspend first — understand the scope while the suspension is in place.' },
            ],
          },
          branches: { a: 'n2_full_response', b: 'n2_board_first', c: 'outcome_warn' },
        },

        n2_full_response: {
          scene:       'office-bright',
          caption:     'Product suspended. Data mapping underway. Legal briefed.',
          sub_caption: 'The data mapping confirms client financial statements and two board papers were submitted. Notification assessment required.',
          decision: {
            prompt: 'Legal advises that notification may be required under Privacy Act NDB provisions. What is your position?',
            choices: [
              { id: 'a', label: 'If Legal advises notification may be required, proceed on the basis that it is required until assessed otherwise. Notify the OAIC and affected clients proactively.', quality: 'good',
                note: 'When in doubt on a Privacy Act notifiable data breach, the cost of over-notification is lower than the cost of under-notification discovered later. Proactive notification also protects the client relationship.' },
              { id: 'b', label: 'Commission a formal legal opinion on whether the NDB threshold is met before notifying anyone.', quality: 'partial',
                note: 'A formal opinion is prudent but should run in parallel with notification preparation — not as a gating step that delays notification if the threshold is clear.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_board_first: {
          scene:       'desk-typing',
          caption:     'Board briefed. Product still running. Another batch of client documents processed while the briefing was being prepared.',
          sub_caption: 'The data mapping scope just widened.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Decisive response. Proactive disclosure.',
          tone:     'good',
          result:   'Product suspended within hours. Data mapping confirms scope. Proactive notification to OAIC and affected clients. The clients receive clear, honest accounts of what happened and what data was involved. Two clients respond positively to the proactive approach. The incident report notes the response as timely and transparent.',
          learning: 'Supply chain data exposure incidents have two stakeholders that must be managed simultaneously: regulators (who need timely notification) and clients (who need honest accounts). Proactive disclosure to both is almost always better than delayed disclosure discovered through other channels.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Response sound. Notification delayed.',
          tone:     'warn',
          result:   'The formal legal opinion takes eight days. Notification follows on day nine. The OAIC notes that the NDB threshold appeared clear from the initial data mapping and asks why notification was delayed. The response — awaiting formal opinion — is accepted but noted.',
          learning: 'Formal legal opinions are valuable. They should not delay notification when the NDB threshold is apparent from the facts. Prepare the notification while the opinion is being obtained — don\'t gate on it.',
          score:    45,
        },
        outcome_warn_b: {
          heading:  'Board briefed. Exposure widened.',
          tone:     'warn',
          result:   'The board is briefed while the product continues to process documents. The scope of the exposure widens during the briefing period. When the product is finally suspended, the data mapping has to cover a larger volume. The board asks why suspension didn\'t happen immediately.',
          learning: 'Board awareness of an incident and operational response to that incident are not sequential steps. Suspension can — and should — happen while the board is being briefed, not after.',
          score:    30,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-casual',
          caption:     'The DDQ you ran didn\'t include AI-specific questions. That\'s why the sub-processor gap wasn\'t found at procurement.',
          sub_caption: 'The CRO wants to understand what due diligence was done and what it missed.',
          decision: {
            prompt: 'What do you tell the CRO?',
            choices: [
              { id: 'a', label: 'The DDQ covered security, data residency, and compliance certifications. It didn\'t include AI-specific questions about foundation model usage, sub-processors, or API tiers — because those questions didn\'t exist in our standard DDQ. That\'s a gap I own.', quality: 'good',
                note: 'Accurate and takes clear ownership. The CRO needs the root cause — a DDQ that wasn\'t fit for AI vendor assessment — not a defence of the process that existed.' },
              { id: 'b', label: 'The vendor passed all our standard due diligence criteria. The gap was in the vendor\'s disclosure, not in our process.', quality: 'partial',
                note: 'Partially true — the vendor should have disclosed. But the DDQ should have asked. Both failed. Framing it as vendor-only deflects your role in the gap.' },
              { id: 'c', label: 'The vendor provided a DPA and a SOC 2 report. That\'s the standard for vendor onboarding in this organisation.', quality: 'poor',
                note: 'The standard was not adequate for AI vendor onboarding. Defending an inadequate standard because it was the standard is not a root cause analysis — it\'s a circular argument.' },
            ],
          },
          branches: { a: 'n2_own', b: 'n2_vendor', c: 'outcome_bad' },
        },

        n2_own: {
          scene:       'office-meeting',
          caption:     'The CRO asks you to design an AI-specific vendor DDQ for all future AI vendor assessments.',
          sub_caption: 'You also need to assess the existing AI vendor portfolio against the new standard.',
          decision: {
            prompt: 'What are the three most critical questions you add to the DDQ?',
            choices: [
              { id: 'a', label: 'Which foundation model providers does your product use? Does your standard API tier prevent training on customer data? Will you provide an AI Bill of Materials?', quality: 'good',
                note: 'These three questions would have caught the gap in this incident: the sub-processor identity, the API tier data protection terms, and the full component inventory. Each targets a specific failure mode.' },
              { id: 'b', label: 'Do you have an AI governance policy? Are you ISO 42001 certified? Do you conduct bias testing?', quality: 'partial',
                note: 'Governance maturity questions are useful but don\'t directly address the supply chain data exposure risk. The API tier and sub-processor questions are more targeted.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_vendor: {
          scene:       'desk-focused',
          caption:     'The CRO asks: should the DDQ have asked about foundation model usage?',
          sub_caption: 'The answer is yes. And you know it.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Gap owned. DDQ rebuilt.',
          tone:     'good',
          result:   'You own the procurement gap clearly and design a DDQ that targets the specific failure modes: sub-processor identity, API tier data protection, and AI-BOM. The CRO approves it. Applied retroactively to the existing AI vendor portfolio, it surfaces two other vendors using standard API tiers — both are renegotiated to enterprise tiers within 60 days.',
          learning: 'An AI vendor DDQ that doesn\'t ask about foundation model sub-processors and API tiers is not an AI vendor DDQ — it\'s a standard IT vendor DDQ applied to the wrong context. The three questions that would have caught this incident are the minimum bar for AI-specific due diligence.',
          score:    100,
        },
        outcome_warn: {
          heading:  'DDQ improved. Key gaps remain.',
          tone:     'warn',
          result:   'The governance maturity questions improve the DDQ. But the specific sub-processor and API tier questions aren\'t there. Four months later, a different AI vendor is onboarded. Their governance policy is strong. Their AI product uses a consumer API tier. The gap isn\'t caught.',
          learning: 'AI vendor DDQs must ask specifically about the data pathway — not just governance maturity. A vendor can have excellent governance policies and still route your data through an unprotected API tier.',
          score:    45,
        },
        outcome_bad: {
          heading:  'Standard defended. Gap unresolved.',
          tone:     'bad',
          result:   'The CRO asks a direct question: should the standard have included AI-specific questions? The answer is yes, and everyone in the room knows it. Defending the standard because it was the standard does not close the gap — it just confirms that the person responsible for the standard doesn\'t think it needs changing.',
          learning: 'Standards that were adequate for traditional IT vendors are not adequate for AI vendors. Defending an inadequate standard under review is the fastest way to lose the board\'s confidence in the procurement function.',
          score:    0,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk',
          caption:     'You found the gap. Now you need to scope it before briefing the CRO.',
          sub_caption: 'The vendor API logs will tell you volume. The submission logs will tell you content types.',
          decision: {
            prompt: 'How do you establish the scope of the potential exposure?',
            choices: [
              { id: 'a', label: 'Cross-reference the vendor API traffic logs with the internal submission logs to establish volume, document types, and date range — then brief the CRO with a structured exposure assessment.', quality: 'good',
                note: 'Cross-referencing two data sources gives you the most complete picture before the briefing. A structured exposure assessment with volume, types, and dates is exactly what the CRO needs to make decisions.' },
              { id: 'b', label: 'Brief the CRO immediately with what you know — sub-processor gap confirmed, exposure unknown — and let her decide what to investigate further.', quality: 'partial',
                note: 'Speed is valuable but a briefing without even a preliminary scope estimate forces the CRO to make decisions with very limited information. Ten minutes of log analysis is worth it.' },
              { id: 'c', label: 'Contact the vendor to ask what data their sub-processor has processed before you brief anyone internally.', quality: 'poor',
                note: 'Contacting the vendor before briefing internally means the vendor knows about the gap before your leadership does. That creates a power imbalance in subsequent negotiations.' },
            ],
          },
          branches: { a: 'n2_scope', b: 'n2_quick', c: 'outcome_warn' },
        },

        n2_scope: {
          scene:       'office-meeting',
          caption:     'Preliminary scope: 847 document submissions over six months. Financial statements, contracts, two board papers. You brief the CRO.',
          sub_caption: 'She asks: what\'s your confidence level on whether the data entered the training pipeline?',
          decision: {
            prompt: 'What do you tell her?',
            choices: [
              { id: 'a', label: 'High probability — the vendor\'s standard tier terms explicitly permit training use. We cannot confirm or deny from our side, but the vendor\'s own terms make it the likely outcome.', quality: 'good',
                note: 'Accurate and appropriately hedged. You can\'t confirm training use from your logs, but the vendor\'s terms are the clearest available evidence. The CRO needs a calibrated assessment, not a binary answer.' },
              { id: 'b', label: 'Unknown — we have no visibility into the vendor\'s sub-processor\'s training pipeline.', quality: 'partial',
                note: 'Technically accurate but incomplete. You do have evidence — the vendor\'s tier terms — that makes the likelihood assessable. "Unknown" undersells what the evidence suggests.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_warn' },
        },

        n2_quick: {
          scene:       'desk-typing',
          caption:     'The CRO asks for volume and document types. You don\'t have them. She asks you to get them before the next decision is made.',
          sub_caption: 'Twenty minutes later you have the numbers. The briefing continues.',
          decision: null,
          branches: { auto: 'outcome_warn' },
        },
      },

      outcomes: {
        outcome_great: {
          heading:  'Scoped and calibrated briefing.',
          tone:     'good',
          result:   'Your structured briefing — volume, document types, date range, and a calibrated probability assessment based on the vendor\'s tier terms — gives the CRO everything she needs to make immediate decisions. Product is suspended, data mapping confirmed, notification process initiated. Your analysis is the foundation of the incident report.',
          learning: 'A security finding becomes actionable when it includes scope and likelihood, not just the existence of a gap. The extra ten minutes spent cross-referencing logs before the briefing is worth more than ten hours of decisions made with incomplete information.',
          score:    100,
        },
        outcome_warn: {
          heading:  'Briefing sound. Confidence understated.',
          tone:     'warn',
          result:   'The CRO accepts "unknown" and initiates a formal enquiry to the vendor. The vendor\'s response takes four days. Meanwhile, the scope assessment is complete and the notification decision is ready — but the CRO is waiting on a vendor response to a question your own evidence already answered. Four days of delay.',
          learning: 'When the available evidence supports a probability assessment, provide it. "Unknown" is accurate but unhelpful when the vendor\'s own terms describe what likely happened. A calibrated estimate with stated assumptions is more useful than a binary unknown.',
          score:    50,
        },
        outcome_warn_b: {
          heading:  'Vendor knows first.',
          tone:     'warn',
          result:   'The vendor confirms the gap before your leadership is briefed. In the subsequent conversation, the vendor has already prepared a position — including a proposed remedy that minimises their liability. Your organisation negotiates from a position of less information. The incident review notes that the vendor was contacted before internal escalation.',
          learning: 'In a supply chain incident, the sequence of who is told matters. Internal leadership should be briefed before the vendor is contacted — so your organisation controls its negotiating position.',
          score:    25,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1', label: 'AI-specific vendor due diligence',
      effort: 'Low', owner: 'Procurement', go_live: true,
      context: 'The standard DDQ didn\'t ask about foundation model sub-processors or API tiers. Three questions would have caught this: which foundation model does your product use, which API tier, and can you confirm data isn\'t used for training? Those questions weren\'t there.',
    },
    {
      id: 'c2', label: 'AI Bill of Materials (AI-BOM)',
      effort: 'Low', owner: 'Procurement', go_live: true,
      context: 'An AI-BOM would have listed the foundation model provider as a component. The gap — a sub-processor not covered by the DPA — would have been visible at procurement rather than discovered six months later by a security analyst reviewing API traffic.',
    },
    {
      id: 'c3', label: 'DPA with AI sub-processors',
      effort: 'Medium', owner: 'Legal', go_live: true,
      context: 'The DPA covered the vendor. It didn\'t name or bind the sub-processor. A DPA that covers the full supply chain — naming every AI sub-processor and binding them to the same data protection obligations — would have closed the gap before a single document was submitted.',
    },
    {
      id: 'c4', label: 'Enterprise API tier confirmation',
      effort: 'Low', owner: 'Procurement', go_live: true,
      context: 'The vendor used a standard consumer-tier API. Standard tier terms explicitly permit training on submitted content. Enterprise tier terms don\'t. Written confirmation of the enterprise tier — before go-live — is the single cheapest control that would have prevented this incident.',
    },
  ],
};
