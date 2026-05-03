// D3 — Intellectual Property & Copyright
// Scenario: "Who Owns This?"
// A development team uses an AI coding assistant throughout a product build.
// A legal audit flags a production function nearly identical to GPL-licensed code.
// Each persona navigates the licence contamination finding.

export const scenario = {
  id:                'd3-ip',
  risk_ref:          'D3',
  title:             'Who Owns This?',
  subtitle:          'AI-Generated Code & Licence Contamination',
  domain:            'D — Data',
  difficulty:        'Foundational',
  kb_url:            'https://library.airiskpractice.org/docs/domain-d-data/d3-intellectual-property',
  estimated_minutes: 11,
  has_business_user: true,

  personas: {
    business_user: {
      label:     'Business User',
      role:      'Software Developer',
      character: 'Chris',
      icon:      '◇',
      framing:   'You used the AI coding assistant to build that function. You had no idea it might carry licence obligations.',
      premise:   `You are Chris, a Software Developer on a product team at a financial services technology firm. Three months ago you used an AI coding assistant to help write a data transformation function — it was a tricky bit of logic and the AI suggestion was elegant and worked first time. You reviewed it for correctness, merged it, and moved on. This morning Legal sent a message asking all developers who used AI code generation in the last six months to flag which functions they contributed. The message includes a link to a legal guidance note about GPL licence contamination.`,
    },
    executive: {
      label:     'Executive',
      role:      'Chief Technology Officer',
      character: 'Sasha',
      icon:      '◈',
      framing:   'A GPL-contaminated function is in production. The implications for the proprietary codebase need to be assessed immediately.',
      premise:   `You are Sasha, CTO. Legal has flagged a function in the production codebase that is nearly identical to a GPL-3.0 licensed open-source library. An AI coding assistant generated the function; the developer reviewed it for functionality and merged it without licence scanning. GPL contamination in a proprietary product is a material legal risk — in the worst case, it creates an obligation to disclose the entire module incorporating that function under the GPL licence. You need to understand the scope, contain it, and prevent recurrence.`,
    },
    pm: {
      label:     'Project Manager',
      role:      'Engineering Team Lead',
      character: 'Alex',
      icon:      '◎',
      framing:   'The code review process your team follows didn\'t include licence scanning. That gap is now a legal finding.',
      premise:   `You are Alex, Engineering Team Lead. Your team adopted an AI coding assistant six months ago and it has been a productivity win. Code reviews on your team check functionality, security, and style. Licence compatibility has never been on the checklist — it was never needed before because all code was written by humans and the source was obvious. Legal has now flagged a GPL-contaminated function that went through your review process unchanged. You need to update the process.`,
    },
    analyst: {
      label:     'Analyst',
      role:      'Security & Compliance Engineer',
      character: 'Nadia',
      icon:      '◉',
      framing:   'Legal has confirmed the finding. Now you need to scope it — how much of the codebase was touched by AI generation?',
      premise:   `You are Nadia, Security & Compliance Engineer. A GPL-3.0 contamination finding has been confirmed in the production codebase. Legal wants to know: is this one function or a pattern? Your task is to scope the exposure — identify all AI-generated code in the codebase, run it through a software composition analysis tool, and report which functions have findings and at what severity. You also need to recommend a remediation approach and a process to prevent recurrence.`,
    },
  },

  trees: {
    business_user: {
      nodes: {
        start: {
          scene:       'desk-working',
          caption:     'Legal is asking all developers who used AI code generation to self-identify. The message is clear — this is serious.',
          sub_caption: 'You know you used AI assistance on that data transformation function.',
          decision: {
            prompt: 'Legal\'s message asks you to flag any functions you wrote using an AI coding assistant. What do you do?',
            choices: [
              { id: 'a', label: 'Flag the function immediately and provide the pull request link and date.', quality: 'good',    note: 'Self-identification is the fastest way to scope the exposure. Providing the PR link and date lets Legal and the compliance team trace the code path quickly.' },
              { id: 'b', label: 'Flag it but note that you reviewed the code thoroughly and it looked correct to you.', quality: 'partial', note: 'Self-identifying is right. The note about review is understandable but slightly misses the point — the issue is licence provenance, not functional correctness. Both can be true at the same time.' },
              { id: 'c', label: 'Wait to see what the licence scanning tool finds — it might not flag your function.', quality: 'poor',    note: 'Waiting for an automated scan when you know you used AI generation is not self-identification — it\'s hoping not to be found. The legal message is asking for voluntary disclosure specifically because automated scanning may not catch everything.' },
            ],
          },
          branches: { a: 'n2_flagged', b: 'n2_flagged', c: 'outcome_wait' },
        },
        n2_flagged: {
          scene:       'office-briefing',
          caption:     'You\'ve flagged the function. Legal confirms it matches the GPL-3.0 finding.',
          decision: {
            prompt: 'Legal asks if you remember what prompt you used to generate the function. Why does this matter, and what do you tell them?',
            choices: [
              { id: 'a', label: 'Share what you remember — the context helps Legal understand whether similar prompts were used elsewhere.', quality: 'good',    note: 'Prompt context helps the compliance team assess whether the same pattern of generation might have produced similar outputs in other parts of the codebase. It also informs future guidance on what prompts to avoid.' },
              { id: 'b', label: 'You can\'t remember exactly — it was three months ago and you don\'t keep prompt records.', quality: 'partial', note: 'Reasonable — prompt records weren\'t a requirement. This highlights a gap: there\'s no mechanism for tracking which AI tool generated which code. That gap becomes a recommendation in the compliance report.' },
              { id: 'c', label: 'The prompt doesn\'t matter — the AI tool is responsible for what it generated.', quality: 'poor',    note: 'The organisation using the AI tool is responsible for the code it incorporates into its product. The AI tool\'s terms of service and indemnification provisions are relevant, but the developer and the organisation bear the compliance obligation.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_norecord', c: 'outcome_blame' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Self-Identification Helped',
          tone:     'good',
          result:   'Your immediate self-identification and context about the generation prompt let Legal scope the finding quickly. The function was isolated, rewritten without AI assistance, and the GPL risk was contained to that module. Your cooperation was noted in the remediation record.',
          learning: 'When an organisation-wide licence review is triggered, self-identification by developers who used AI generation is faster and more complete than automated scanning alone. AI coding assistants don\'t always produce code with obvious provenance markers — human memory fills the gap.',
          score:    100,
        },
        outcome_norecord: {
          heading:  'Finding Contained, Gap Identified',
          tone:     'warn',
          result:   'The function was identified and remediated. The absence of prompt records became a specific finding in the compliance report — future AI code generation should include documentation of the tool and prompt context at least at pull request level. A lightweight convention (AI-ASSISTED tag in commit messages) was added to the development standard.',
          learning: 'Not keeping prompt records wasn\'t a failure in the moment — it wasn\'t required. But when licence questions arise, prompt context helps scope similar risks. A simple commit tagging convention is a low-overhead way to maintain this record without disrupting development flow.',
          score:    70,
        },
        outcome_blame: {
          heading:  'Responsibility Misunderstood',
          tone:     'warn',
          result:   'The function was still found and remediated through scanning. But the position that the AI tool bears the compliance responsibility delayed the conversation about what developers need to do differently. The AI vendor\'s indemnification programme has conditions — the organisation still needs to implement the controls the vendor requires.',
          learning: 'AI coding assistants are tools. The organisation that incorporates their output into a proprietary product bears the licence compliance obligation — not the tool. Vendor indemnification programmes exist and are valuable, but they have conditions and don\'t eliminate the need for licence scanning.',
          score:    40,
        },
        outcome_wait: {
          heading:  'Scanning Found It Anyway',
          tone:     'warn',
          result:   'The automated scan flagged your function. By not self-identifying, you delayed the scoping process and the compliance team had to follow up individually. The outcome was the same, but the process was slower and the non-response was noted.',
          learning: 'Voluntary self-identification when you have direct knowledge is faster than waiting for automated scanning. It also signals the kind of transparency that compliance teams need to trust a development process. Automated tools don\'t catch everything — human memory is part of the evidence.',
          score:    35,
        },
      },
    },

    executive: {
      nodes: {
        start: {
          scene:       'desk-reading',
          caption:     'GPL contamination confirmed in production. The scope of the risk depends on how extensively AI code generation was used.',
          decision: {
            prompt: 'Legal asks whether you want to scope the full codebase for AI-generated code before deciding on a response, or act immediately on the confirmed finding only. What do you decide?',
            choices: [
              { id: 'a', label: 'Scope the full codebase first — one finding likely means more. Act on complete information.', quality: 'good',    note: 'One confirmed finding in a team that has been using AI assistance for six months is a signal, not an isolated event. Scoping fully before committing to a remediation approach prevents a second round of disruption.' },
              { id: 'b', label: 'Remediate the confirmed finding immediately and scan in parallel — contain the known risk now.', quality: 'good',    note: 'A reasonable dual-track approach — isolating the confirmed risk while building a picture of total exposure. Both actions are compatible and together are faster than sequential approach.' },
              { id: 'c', label: 'Remediate the confirmed finding and close the issue — one function is a manageable risk.', quality: 'poor',    note: 'Treating one confirmed finding as the complete picture, in a codebase where AI generation has been used without licence scanning, is unlikely to reflect reality. The risk is the process gap, not just the specific function.' },
            ],
          },
          branches: { a: 'n2_scope', b: 'n2_scope', c: 'outcome_narrow' },
        },
        n2_scope: {
          scene:       'office-meeting',
          caption:     'The scan is running. Legal wants to know what structural changes you\'ll make to prevent recurrence.',
          decision: {
            prompt: 'Legal asks you to choose between two approaches to prevent recurrence: (A) mandatory licence scanning in CI/CD — blocks merges with critical findings, or (B) developer training on AI code generation risks — relies on awareness. Which do you implement?',
            choices: [
              { id: 'a', label: 'Both — CI/CD scanning as the technical gate, training so developers understand why.', quality: 'good',    note: 'Technical gates and human awareness are complementary. The gate catches what training misses; training means developers understand the control rather than treating it as an obstacle.' },
              { id: 'b', label: 'CI/CD scanning only — technical gates are more reliable than relying on developer behaviour.', quality: 'partial', note: 'CI/CD scanning is the right primary control. But without developer awareness, developers may work around the gate or generate code in ways that evade detection. Training strengthens the control.' },
              { id: 'c', label: 'Developer training only — scanning adds friction to the development process.', quality: 'poor',    note: 'Awareness training without a technical gate relies on developers correctly identifying licence risk in every AI-generated function — a task they are not trained to do and that scanning tools handle automatically. Training alone is insufficient.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_technical', c: 'outcome_training' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Root Cause Addressed',
          tone:     'good',
          result:   'The full scope scan found two additional functions with licence findings, both remediated. CI/CD scanning now blocks merges with critical licence findings, and all developers received a 45-minute briefing on AI code generation risks and the new process. The vendor\'s indemnification programme conditions were reviewed and met.',
          learning: 'Licence contamination from AI code generation requires both a technical gate (scanning in CI/CD) and human awareness (developers understanding why the gate exists). One without the other leaves gaps — either in detection or in people working around controls they don\'t understand.',
          score:    100,
        },
        outcome_technical: {
          heading:  'Gate Works, Understanding Thin',
          tone:     'warn',
          result:   'CI/CD scanning caught three more AI-generated functions with licence findings in the two months after implementation. The gate worked. But two developers attempted to bypass it using code reformatting to evade matching — they didn\'t understand what the gate was protecting against. Developer briefing was added three months later.',
          learning: 'Technical controls are most robust when the people subject to them understand their purpose. A CI/CD licence gate without developer awareness training creates a compliance gap — developers who treat the gate as friction rather than protection may look for ways around it.',
          score:    65,
        },
        outcome_training: {
          heading:  'Awareness Without a Safety Net',
          tone:     'bad',
          result:   'Developer training improved awareness and reduced AI code generation without licence consideration. But three months later another function with a high-risk licence finding made it through — a developer who was under deadline pressure and confident the code looked original. Training reduces risk; scanning eliminates it.',
          learning: 'Developer training on licence risk is valuable but not sufficient as the sole control. Under deadline pressure, awareness competes with other priorities. An automated technical gate in CI/CD does not depend on developer attention — it catches what slips through regardless.',
          score:    30,
        },
        outcome_narrow: {
          heading:  'Incomplete Scope',
          tone:     'bad',
          result:   'The confirmed function was remediated. Two months later an external security researcher flagged a second GPL-contaminated function in the same codebase. The researcher published the finding publicly before Legal was notified. The reputational and process cost of the second finding significantly exceeded what a full coping exercise would have cost.',
          learning: 'One confirmed licence finding in a codebase where AI generation has been used without scanning controls is evidence of a process gap, not an isolated event. Scoping the full exposure — even when it takes longer — is almost always less costly than discovering additional findings after the fact.',
          score:    15,
        },
      },
    },

    pm: {
      nodes: {
        start: {
          scene:       'desk-review',
          caption:     'Your code review process doesn\'t include licence scanning. That gap produced this finding.',
          decision: {
            prompt: 'Your manager asks you to update the code review process immediately. What do you add?',
            choices: [
              { id: 'a', label: 'A mandatory step requiring licence scan completion before any AI-generated code is merged — with a finding disposition record.', quality: 'good',    note: 'Making licence scanning a mandatory step with a disposition record — not just a recommendation — closes the gap. The record provides evidence of compliance for future audits.' },
              { id: 'b', label: 'A note in the code review template reminding reviewers to consider licence risk for AI-generated code.', quality: 'partial', note: 'A reminder is better than nothing but is not a control — it depends on reviewer attention and knowledge. Under deadline pressure, reminders are skipped. A mandatory step with a blocking gate is more reliable.' },
              { id: 'c', label: 'A requirement that developers declare whether they used AI assistance in their PR description.', quality: 'partial', note: 'AI assistance declaration is a useful tracking mechanism and supports subsequent scanning. But declaration alone doesn\'t scan for licence risk — it needs to be paired with a scanning requirement to be a complete control.' },
            ],
          },
          branches: { a: 'n2_gate', b: 'n2_reminder', c: 'n2_declare' },
        },
        n2_gate: {
          scene:       'office-meeting',
          caption:     'The mandatory scanning step is in place. Now you need to handle the backlog — six months of AI-generated code with no prior scanning.',
          decision: {
            prompt: 'The security team estimates scanning the six-month backlog will take two weeks and may find more issues. Do you pause AI code generation during the scan, or keep it running with the new controls in place?',
            choices: [
              { id: 'a', label: 'Pause AI code generation until the backlog scan is complete — then resume with the new controls.', quality: 'good',    note: 'Pausing prevents the backlog from growing during the scan and gives a clean baseline once controls are in place. The two-week cost is bounded; the cost of a growing unscanned backlog is not.' },
              { id: 'b', label: 'Keep running — apply the new controls to new code and scan the backlog in parallel.', quality: 'partial', note: 'A workable approach if the new CI/CD gate is confirmed operational. The risk is that parallel scanning of the backlog competes with development priority and gets deprioritised.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_parallel' },
        },
        n2_reminder: {
          scene:       'desk-working',
          caption:     'The reminder is added. But reminders depend on people reading and acting on them consistently.',
          decision: {
            prompt: 'Three weeks later another developer merges AI-generated code without a licence check. The reminder was in the template. What do you do?',
            choices: [
              { id: 'a', label: 'Escalate to implement a mandatory blocking gate in CI/CD — the reminder has proven insufficient.',       quality: 'good', note: 'One failure of a non-mandatory control is evidence that the control design is insufficient. Escalating to a technical gate is the right response.' },
              { id: 'b', label: 'Address it with the developer individually and reinforce the expectation — the reminder process needs time to bed in.', quality: 'poor', note: 'Individual enforcement of a non-mandatory process does not make the process mandatory. The same failure will recur under deadline pressure with different developers.' },
            ],
          },
          branches: { a: 'outcome_gate', b: 'outcome_individual' },
        },
        n2_declare: {
          scene:       'office-briefing',
          caption:     'AI assistance declarations are now in PR descriptions. You can see which PRs used AI generation.',
          decision: {
            prompt: 'The compliance team asks what you do with the AI declaration — is there a scanning step attached to it?',
            choices: [
              { id: 'a', label: 'Add a mandatory licence scan requirement for all PRs declaring AI assistance — declarations trigger the scan.', quality: 'good',    note: 'Declaration plus mandatory scan is a complete control. Declaration tells you which code to scan; the scan assesses the licence risk. Together they close the gap.' },
              { id: 'b', label: 'The declaration is the control — reviewers know to look more carefully at declared AI-generated code.', quality: 'poor',    note: 'Reviewer attention is not a licence scan. Licence contamination is often not visually apparent — it requires matching against a database of known open-source code. Declaration without scanning is not a complete control.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_attention' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Process Gap Closed',
          tone:     'good',
          result:   'The mandatory scanning step with disposition records closed the process gap. The backlog scan found one additional function with a moderate licence finding, remediated before it became a formal finding. New AI-generated code now goes through scanning as a standard part of the review process.',
          learning: 'A code review process built before AI coding assistants were adopted needs explicit updating to include licence scanning. The update must be mandatory — a blocking step, not a reminder — because licence risk is not visually apparent to human reviewers.',
          score:    100,
        },
        outcome_parallel: {
          heading:  'Backlog Risk Remains',
          tone:     'warn',
          result:   'New code is now scanning correctly. The backlog scan was deprioritised twice due to release pressure and is still 40% complete three months later. Until the backlog scan is finished, the organisation does not have a complete picture of its licence exposure.',
          learning: 'A backlog of unscanned AI-generated code is a known risk. Parallel scanning that competes with development priority tends to get deprioritised. A bounded pause to complete the scan — even if it costs two weeks — produces a complete baseline that parallel scanning under pressure does not.',
          score:    60,
        },
        outcome_gate: {
          heading:  'Escalation Worked',
          tone:     'warn',
          result:   'The failure of the reminder control prompted escalation to a technical gate, which is the right outcome. The two-week delay between the reminder\'s failure and the gate implementation produced one more unscanned merge. The gate has now been in place for a month without further findings.',
          learning: 'When a non-mandatory control fails, the right response is to escalate to a mandatory one — not to reinforce the non-mandatory control. One failure is diagnostic. Escalating promptly limits the window during which the insufficient control is in place.',
          score:    65,
        },
        outcome_individual: {
          heading:  'Reminder Still Insufficient',
          tone:     'bad',
          result:   'Individual reinforcement of a non-mandatory process produced three more unscanned merges over the following month. A second formal escalation was required before a technical gate was implemented. The extended window produced two more licence findings.',
          learning: 'Individual enforcement of a process that is not mandatory does not make it mandatory. It redistributes the compliance burden to line managers and produces inconsistent results. When a control depends on individual attention and is failing, the answer is a better-designed control — not more individual attention.',
          score:    20,
        },
        outcome_attention: {
          heading:  'Declaration Without Scanning',
          tone:     'bad',
          result:   'Two months later, a reviewer who was confident in their assessment of AI-generated code merged a function with a high-risk licence finding. The declaration was there; the reviewer looked carefully and didn\'t spot it. Licence contamination is not visually apparent without tooling. The scan requirement was added after the second finding.',
          learning: 'Licence risk in AI-generated code is not visible to human reviewers without tooling. A reviewer looking carefully at code cannot identify that it matches a GPL-licensed function in a public repository — that requires a software composition analysis tool. Declaration without scanning is not a complete control.',
          score:    20,
        },
      },
    },

    analyst: {
      nodes: {
        start: {
          scene:       'analyst-desk-privacy',
          caption:     'One confirmed GPL finding. Your job is to scope the full exposure across six months of AI-generated code.',
          decision: {
            prompt: 'To scope the codebase you need to identify which code was AI-generated. Commit records don\'t flag AI assistance. What\'s your approach?',
            choices: [
              { id: 'a', label: 'Developer self-identification plus automated scanning of the full codebase — belt and braces.',            quality: 'good',    note: 'Self-identification finds code that automated scanning might miss (e.g. reformatted or refactored AI suggestions); automated scanning finds code that developers don\'t remember or didn\'t flag. Both together give the most complete picture.' },
              { id: 'b', label: 'Automated SCA scan of the full codebase — systematic and doesn\'t depend on developer memory.', quality: 'partial', note: 'Automated scanning is the right primary tool. But SCA tools detect known code matches — reformatted or substantially modified AI suggestions may evade detection. Self-identification fills that gap.' },
              { id: 'c', label: 'Ask developers to self-identify only — scanning the full codebase will take too long.',               quality: 'poor',    note: 'Self-identification alone misses code that developers don\'t remember using AI for, don\'t recognise as AI-generated, or don\'t disclose. For a compliance scope exercise, automated scanning is necessary.' },
            ],
          },
          branches: { a: 'n2_both', b: 'n2_scan', c: 'outcome_selfreport' },
        },
        n2_both: {
          scene:       'desk-focused',
          caption:     'Self-identification and scanning are running in parallel. Three functions flagged so far.',
          decision: {
            prompt: 'The SCA tool returns findings at four severity levels: critical (copyleft contamination), high (weak copyleft), medium (permissive with conditions), low (minimal restrictions). Legal wants to know which findings require immediate action. What do you recommend?',
            choices: [
              { id: 'a', label: 'Critical findings are immediate action: rewrite or seek legal review. High findings: legal review before next release. Medium and low: document and schedule.', quality: 'good',    note: 'Tiered response by severity is the right framework. Copyleft (critical) creates mandatory disclosure obligations — it cannot wait. Weak copyleft and permissive findings can be managed with appropriate urgency without stopping the release cycle.' },
              { id: 'b', label: 'All findings require immediate legal review — treat everything as critical until Legal categorises it.', quality: 'partial', note: 'Escalating everything to Legal creates a bottleneck and delays remediation of the genuinely critical findings. The licence risk taxonomy exists precisely to prioritise response — use it.' },
              { id: 'c', label: 'Only the confirmed GPL-3.0 finding requires immediate action — the others are low risk.', quality: 'poor',    note: 'High-risk weak copyleft findings (LGPL, MPL) also create licence obligations that need addressing before the next release. Treating them as low risk because they\'re not GPL-3.0 understates the exposure.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_bottleneck', c: 'outcome_understate' },
        },
        n2_scan: {
          scene:       'desk-working',
          caption:     'Automated scanning is running. Self-identification would have given you an additional data point.',
          decision: {
            prompt: 'The scan returns three findings. Two match known GPL code; one matches LGPL. A developer then self-identifies a fourth function the scan missed — it was substantially refactored after AI generation. How do you handle the fourth function?',
            choices: [
              { id: 'a', label: 'Treat it the same as the scan findings — send to Legal for licence assessment regardless of how much it was refactored.', quality: 'good',    note: 'Substantial refactoring of GPL-origin code may or may not break the licence obligation — that is a legal question, not a technical one. Legal needs to assess it.' },
              { id: 'b', label: 'The refactoring is sufficient to break the licence chain — document it and close the finding.', quality: 'poor',    note: 'Whether refactoring breaks a GPL licence obligation is a complex legal question — not a technical determination. This decision requires legal input, not an engineering judgement call.' },
            ],
          },
          branches: { a: 'outcome_great', b: 'outcome_legal' },
        },
      },
      outcomes: {
        outcome_great: {
          heading:  'Exposure Scoped Completely',
          tone:     'good',
          result:   'The dual approach found four functions with licence findings: two critical (GPL-3.0), one high (LGPL-2.1), one caught only by self-identification that scanning missed. All four were triaged by severity. The two critical functions were rewritten immediately; LGPL compliance steps were implemented; the fourth function was referred to Legal. The CI/CD scanning gate was implemented as the permanent control.',
          learning: 'Scoping AI code generation licence exposure requires both automated scanning (systematic, doesn\'t depend on memory) and developer self-identification (catches reformatted or substantially modified AI suggestions that scanning misses). Together they produce a complete picture; separately, each has blind spots.',
          score:    100,
        },
        outcome_bottleneck: {
          heading:  'Legal Bottleneck',
          tone:     'warn',
          result:   'Escalating all four findings to Legal simultaneously created a two-week queue. The critical GPL-3.0 functions sat in the queue alongside low-risk permissive findings. By the time Legal had reviewed everything, the next release had already shipped — including code that contained the LGPL finding. A tiered approach would have allowed the critical functions to be remediated immediately.',
          learning: 'Licence risk taxonomy exists to prioritise response. Escalating all findings at the same urgency level creates a bottleneck that slows remediation of the genuinely critical items. Critical copyleft findings should be escalated immediately; permissive findings can follow a scheduled review.',
          score:    50,
        },
        outcome_understate: {
          heading:  'LGPL Obligation Missed',
          tone:     'bad',
          result:   'The LGPL finding was not treated as requiring action before the next release. The product shipped incorporating LGPL-licensed code without compliance with LGPL terms — specifically, without making the LGPL-licensed component separable. A subsequent legal review flagged this as a compliance obligation that now requires a product architecture change.',
          learning: 'LGPL and MPL are weak copyleft licences — they do require compliance steps even though they don\'t require disclosure of the entire codebase. Treating them as no different from permissive licences understates the obligation. The severity taxonomy is a guide to urgency, not a determination of compliance requirements.',
          score:    20,
        },
        outcome_selfreport: {
          heading:  'Incomplete Scope',
          tone:     'bad',
          result:   'Developer self-identification surfaced two functions. Automated scanning — run three months later as part of a separate exercise — found four more. The incomplete scope meant two months of undetected exposure and a second remediation cycle. Self-identification alone is not sufficient for a compliance scope exercise.',
          learning: 'Developer self-identification is a valuable input but not sufficient as the sole scoping mechanism for a compliance exercise. Developers may not remember all AI-generated code, may not recognise it as such, or may not disclose everything. Automated scanning is the systematic complement that catches what self-identification misses.',
          score:    25,
        },
        outcome_legal: {
          heading:  'Engineering Call on a Legal Question',
          tone:     'bad',
          result:   'The engineering determination that refactoring broke the GPL licence chain was incorrect — substantial refactoring of GPL-origin code can still carry the GPL obligation depending on how much of the original structure and logic was retained. Legal assessed it six weeks later and concluded the obligation remained. A rewrite was required.',
          learning: 'Whether refactoring breaks a GPL licence obligation is a legal question — not a technical one. The degree of similarity required to trigger the GPL copyleft obligation is determined by copyright law and case precedent, not by how many lines were changed. Always refer GPL-origin code questions to Legal regardless of how much it was modified.',
          score:    25,
        },
      },
    },
  },

  controls_summary: [
    {
      id: 'c1',
      label: 'Output review policy for AI-generated content',
      effort: 'Low',
      owner: 'Legal',
      go_live: true,
      context: 'The developer reviewed the AI-generated function for functional correctness. There was no policy requiring review for licence compatibility. A policy requiring licence review of AI-generated code before merge would have been the prompt for the missing step.',
    },
    {
      id: 'c2',
      label: 'Code licence scanning',
      effort: 'Low',
      owner: 'Technology',
      go_live: true,
      context: 'No software composition analysis tool was integrated into the code review or CI/CD process. A licence scanning gate would have flagged the GPL match before the function was merged to production.',
    },
    {
      id: 'c3',
      label: 'AI-generated content labelling',
      effort: 'Low',
      owner: 'Technology',
      go_live: false,
      context: 'Commit records did not indicate which code was AI-generated. A simple tagging convention (AI-ASSISTED in commit messages) would have made the scope exercise faster and more complete.',
    },
    {
      id: 'c4',
      label: 'Vendor training data documentation',
      effort: 'Low',
      owner: 'Procurement',
      go_live: true,
      context: 'The AI coding assistant\'s indemnification programme has conditions — the organisation must implement licence scanning to qualify. Vendor documentation would have surfaced this requirement at procurement rather than after a finding.',
    },
  ],
};
