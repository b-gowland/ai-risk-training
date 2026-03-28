# QA Review — F2 Shadow AI
**Review date:** March 2026  
**Reviewer:** Automated audit + editorial pass  
**Scenario version:** Initial release  
**Status:** Issues found — patch required before next push

---

## Technical audit

| Check | Result |
|---|---|
| All branch references resolve | PASS |
| All 8 paths (4 personas × first/last choice) reach valid outcomes | PASS |
| Build compiles without errors | PASS |
| No API keys in source | PASS |
| No product names (ChatGPT) in scenario data | PASS (2 residual in comments only) |

---

## Content issues found

### Severity definitions
- **P1 — Broken:** Confusing to a first-time player, breaks immersion, or references something the player hasn't seen
- **P2 — Weak:** Technically correct but clunky, vague, or inconsistent in tone
- **P3 — Polish:** Minor wording improvement

---

### P1 — Broken (fix before next push)

| ID | Location | Issue | Current text | Fix |
|---|---|---|---|---|
| F2-C-001 | business_user / n3_honest / b | "It mostly does" — dangling reference, unclear what "it" refers to | "Fair. It mostly does. You get a written note-to-file. No further action." | "Fair enough. The matter is quietly resolved — written note-to-file, no further action." |
| F2-C-002 | pm / n4_volunteer / b | Same "it mostly does" pattern | "Understandable. It mostly does. Note to file. No further action." | "Understandable. The matter fades. Note to file, no further action." |
| F2-C-003 | business_user / n3_lied / b | "You are now a case study" — same broken fourth-wall pattern as the Priya reference | "The log is not wrong. IT is very sure of this. You are now a case study." | "The log is not wrong. IT is very sure of this. This is how people become cautionary tales." |
| F2-C-004 | pm / n2_lied / b | Same "case study" pattern | "The log is not wrong. IT is extremely confident of this. You are now a case study in what not to do." | "The log is not wrong. IT is extremely confident of this. Doubling down on a false statement in writing is the decision that turns a data incident into a conduct matter." |
| F2-C-005 | pm / n3_systemic / c | "You are now the scapegoat" — breaks fourth wall | "The director points at you specifically. You are now the scapegoat and the person who didn't help." | "The director points at you specifically. Silence bought you nothing — you're carrying the incident alone and you gave up any chance of reframing it as a systemic issue." |
| F2-C-006 | analyst / n3_escalated / b | "You are now part of the incident" — breaks fourth wall | "Legal asks to see the report. There is no report. You are now part of the incident." | "Legal asks to see the report. There is no report. A false prior claim in an active legal matter is a significantly worse position than the original log anomaly." |
| F2-C-007 | executive / n3_good_board / b | "You are now the poster child" — breaks fourth wall, also the board fires you is fine as comedy but needs setup | "'Company refuses to comment on AI malpractice scandal.' You are now the poster child. The board fires you. Not ideal." | "'Company refuses to comment on AI malpractice scandal.' The story runs for three days. By day two you are the industry's favourite cautionary example. The board meeting on day four is short." |

---

### P2 — Weak (fix in same pass)

| ID | Location | Issue | Current text | Fix |
|---|---|---|---|---|
| F2-C-008 | business_user / start / c | Intranet quote breaks the flow slightly — the sarcasm lands but the sentence is clunky | "There is one. It's buried in the intranet under 'Governance 2022' but it exists." | "There is one. Buried on the intranet under a folder called 'Governance 2022', last updated before half the team joined. But it exists and it says no." |
| F2-C-009 | analyst / n4_gap_analysis / a | Too sparse — "Slightly expensive. CISO approves it." reads like a placeholder | "Closes the specific gap. Slightly expensive. CISO approves it." | "Closes the specific gap. The CISO approves it in the same week — turns out a documented incident makes budget conversations easier." |
| F2-C-010 | pm / n3_minimised / b | "But plausible." as a standalone sentence is weak | "Plausible. The M&A section was pretty clearly labelled. But plausible." | "Plausible. The M&A section was clearly labelled but you can credibly claim you didn't register its significance. HR notes the ambiguity." |
| F2-C-011 | executive / n2_tuscany / a | "The conversation is shorter than it could have been" is awkward | "They're still unhappy. But you've shown initiative. The conversation is shorter than it could have been." | "They're still unhappy about the four-day gap. But you called before being summoned — that registers. The conversation is difficult and brief." |

---

### P3 — Polish (batch with P1/P2 fixes, low priority)

| ID | Location | Issue |
|---|---|---|
| F2-C-012 | analyst / n2_investigated / b | "at least" appears in two consecutive notes — minor repetition |
| F2-C-013 | business_user / n2_asked / a | Legal defence joke is good but "Just so you know" slightly weakens it |
| F2-C-014 | pm / start / b | "Vague enough to buy time. Honest enough not to be a lie. Just." — "Just." as a one-word sentence works but is an acquired taste |

---

## Blank screen issue

**Reported:** Player reached blank screen after "Continue" on feedback step.  
**Technical finding:** All paths simulate correctly — no broken branch references.  
**Likely cause:** Transient GitHub Pages deploy completing mid-session (stale JS bundle loaded in browser while new one deployed). Not a code bug.  
**Action:** Monitor on next deploy. If it recurs, add an error boundary component to catch runtime state errors and show a "restart" prompt rather than a blank screen.  
**Priority:** P2 — add error boundary in next content patch.

---

## Review checklist for future scenarios

Use this checklist before pushing any new scenario:

### Technical
- [ ] Run branch reference audit (`node --input-type=module audit.js`)
- [ ] Simulate all paths (first-choice and last-choice for each persona)
- [ ] Confirm all paths reach a valid outcome
- [ ] Build compiles without errors
- [ ] No hardcoded product names (ChatGPT, Claude, GPT-4 etc.)
- [ ] No API keys or credentials in source

### Content — note fields
- [ ] No dangling references ("it mostly does", "as above", "same as")
- [ ] No unexplained fourth-wall breaks ("you are now X", "you are now a case study")
- [ ] Every poor-quality choice explains *why* it's wrong, not just *that* it's wrong
- [ ] Comedy consequences are specific and plausible, not random
- [ ] No note field under 8 words (too sparse) or over 40 words (too long)
- [ ] Consistent use of second person ("you") throughout
- [ ] No character names that only make sense in a different persona track

### Content — outcomes
- [ ] Result text is a complete narrative, not a list of events
- [ ] Learning text states one clear principle, not multiple
- [ ] Tone matches the outcome quality (good/warn/bad)
- [ ] No outcome result under 25 words

### Content — captions and prompts
- [ ] Each caption advances the story, not just describes what's visible in the scene
- [ ] Decision prompts are direct questions, not statements
- [ ] Sub-captions add information not visible in the illustration

---

## Next actions

| Priority | Action | Owner |
|---|---|---|
| P1 | Apply F2-C-001 through F2-C-007 fixes | Claude (next session) |
| P1 | Apply F2-C-008 through F2-C-011 fixes | Claude (next session) |
| P2 | Add error boundary component for blank screen prevention | Claude (next session) |
| P3 | Apply F2-C-012 through F2-C-014 polish | Claude (next session) |
| P2 | Extract audit script to `scripts/qa-audit.js` for reuse | Claude (next session) |
