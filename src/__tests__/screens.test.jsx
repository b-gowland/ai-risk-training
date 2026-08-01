// Screens — does it actually render, and does it obey §4.4?
//
// The build passing proves the modules resolve. It proves nothing about
// whether a decision screen renders, whether committing reveals a
// consequence, or whether evaluative chrome crept back in. These do.

import { describe, it, expect, vi } from 'vitest';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Setup reads router location to know whether the cold open has already been
// read on the doorway card, so every render needs a router around it.
const render = (ui, { entry = '/' } = {}) =>
  rtlRender(<MemoryRouter initialEntries={[entry]}>{ui}</MemoryRouter>);
const renderFromCard = (ui) =>
  rtlRender(<MemoryRouter initialEntries={[{ pathname: '/', state: { fromCard: true } }]}>{ui}</MemoryRouter>);
import Setup from '../player/Setup.jsx';
import Decision from '../player/Decision.jsx';
import Debrief from '../player/Debrief.jsx';
import Close from '../player/Close.jsx';
import Artefact from '../components/Artefact/Artefact.jsx';
import { scenario as f2 } from '../scenarios/f2-shadow-ai.js';
import { scenario as home } from '../scenarios/home-voice-clone.js';
import { scenarios } from '../scenarios/index.js';

describe('Setup', () => {
  it('carries the cold open, the standing and the authority on a direct arrival', () => {
    render(<Setup scenario={f2} onBegin={() => {}} />);
    expect(screen.getByText(/four o'clock on a Wednesday/)).toBeTruthy();
    expect(screen.getByText(f2.standing)).toBeTruthy();
    expect(screen.getByText(f2.authority)).toBeTruthy();
  });

  // The doorway carries one display line over the image, not the whole open,
  // so Setup carries it for every arrival and nothing is shown twice.
  it('carries the cold open on a card arrival too, since the card only showed the hook', () => {
    renderFromCard(<Setup scenario={f2} onBegin={() => {}} />);
    expect(screen.getByText(/four o'clock on a Wednesday/)).toBeTruthy();
  });

  it('every registered scenario has a hook distinct from its cold open', async () => {
    const { scenarios: live } = await import('../scenarios/index.js');
    for (const sc of live) {
      expect(sc.hook, `${sc.id} has no hook`).toBeTruthy();
      expect(sc.hook.length, `${sc.id} hook is too long for display size`).toBeLessThan(105);
      expect(sc.coldOpen).not.toContain(sc.hook);
    }
  });

  // §4.2 — At Home the player brings their own standing.
  it('omits the standing row entirely for At Home', () => {
    const { container } = render(<Setup scenario={home} onBegin={() => {}} />);
    expect(container.textContent).not.toContain('You are');
    expect(screen.getByText(home.authority)).toBeTruthy();
  });

  it('states the decision count as a band, derived from the tree', () => {
    render(<Setup scenario={f2} onBegin={() => {}} />);
    // Branching means there is no single length; a hard number would be a
    // promise the tree cannot keep.
    expect(screen.getByText(/six to eight decisions/)).toBeTruthy();
    render(<Setup scenario={home} onBegin={() => {}} />);
    expect(screen.getByText(/four decisions/)).toBeTruthy();
  });

  it('appends the no-clean-answer clause only when determinacy is open', () => {
    const { unmount } = render(<Setup scenario={f2} onBegin={() => {}} />);
    expect(screen.queryByText(/no clean answer/)).toBeTruthy();
    unmount();
    render(<Setup scenario={home} onBegin={() => {}} />);
    expect(screen.queryByText(/no clean answer/)).toBeNull();
  });

  it('renders without a scene rather than crashing', () => {
    const noScene = { ...home };
    delete noScene.scene;
    render(<Setup scenario={noScene} onBegin={() => {}} />);
    expect(document.querySelector('img')).toBeNull();
  });

  it('promises nothing is scored', () => {
    render(<Setup scenario={f2} onBegin={() => {}} />);
    expect(screen.getByText(/nothing scored/)).toBeTruthy();
  });
});

describe('Decision', () => {
  const node = f2.nodes.start;

  it('shows every choice as a button before a commit', () => {
    render(<Decision node={node} index={1} revealedChoice={null} onCommit={() => {}} onAdvance={() => {}} />);
    for (const c of node.decision.choices) expect(screen.getByText(c.label)).toBeTruthy();
  });

  it('calls onCommit with the chosen option', () => {
    const onCommit = vi.fn();
    render(<Decision node={node} index={1} revealedChoice={null} onCommit={onCommit} onAdvance={() => {}} />);
    fireEvent.click(screen.getByText(node.decision.choices[0].label));
    expect(onCommit).toHaveBeenCalledWith(node.decision.choices[0]);
  });

  it('replaces the options with the consequence once revealed — no re-choosing', () => {
    const chosen = node.decision.choices[0];
    render(<Decision node={node} index={1} revealedChoice={chosen} onCommit={() => {}} onAdvance={() => {}} />);
    expect(screen.getByText(chosen.consequence)).toBeTruthy();
    expect(screen.queryByText(node.decision.choices[1].label)).toBeNull();
  });

  it('renders the artefact when the node carries one', () => {
    render(<Decision node={node} index={1} revealedChoice={null} onCommit={() => {}} onAdvance={() => {}} />);
    expect(screen.getByText(/Q3_product_notes_INTERNAL/)).toBeTruthy();
  });

  // §4.4 — the screen must not grade the choice. This is the regression guard
  // for getLocalFeedback, which prefixed every consequence with a verdict.
  it('renders no verdict word anywhere on a revealed consequence', () => {
    const { container } = render(
      <Decision node={node} index={1} revealedChoice={node.decision.choices[0]} onCommit={() => {}} onAdvance={() => {}} />
    );
    const text = container.textContent;
    for (const banned of ['Good call', 'Correct', 'Incorrect', 'Well done', 'Partially right', 'Missed this', 'Not the right move']) {
      expect(text).not.toContain(banned);
    }
  });

  it('does not render the quality value as text', () => {
    const { container } = render(
      <Decision node={node} index={1} revealedChoice={node.decision.choices[2]} onCommit={() => {}} onAdvance={() => {}} />
    );
    expect(container.textContent).not.toMatch(/\b(good|partial|poor)\b/);
  });
});

describe('Debrief', () => {
  const outcome = f2.outcomes.outcome_found;

  it('carries reaction, description and judgement on one screen', () => {
    render(<Debrief outcome={outcome} onClose={() => {}} />);
    expect(screen.getByText(outcome.reaction)).toBeTruthy();
    expect(screen.getByText(outcome.description[0])).toBeTruthy();
    expect(screen.getByText(outcome.judgement)).toBeTruthy();
  });

  // The ending is two screens, not five. The decision recap was cut: it listed
  // back choices the player had just made and told them nothing new.
  it('does not list the decisions back', () => {
    const { container } = render(<Debrief outcome={outcome} onClose={() => {}} />);
    expect(container.querySelector('ol')).toBeNull();
  });

  it('never renders the score', () => {
    const { container } = render(<Debrief outcome={outcome} onClose={() => {}} />);
    expect(container.textContent).not.toContain(String(outcome.score));
  });

  it('hands off to the close in one step', () => {
    const onClose = vi.fn();
    render(<Debrief outcome={outcome} onClose={onClose} />);
    fireEvent.click(screen.getByText('Go on'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Close', () => {
  const props = { scenario: f2, recallAnswer: null, actChoice: null, onRecall: () => {}, onAct: () => {}, onReplay: () => {} };

  it('carries the frame, the recall, the tell and the act list on one screen', () => {
    render(<Close {...props} />);
    // The frame leads with its first sentence as a display line, remainder below.
    const leadSentence = f2.debrief.frame[0].match(/^(.*?[.!?])(\s|$)/)[1];
    expect(screen.getByText(leadSentence)).toBeTruthy();
    expect(screen.getByText(f2.recall.prompt)).toBeTruthy();
    expect(screen.getByText(f2.tell)).toBeTruthy();
    expect(screen.getByText('None of these fits')).toBeTruthy();
  });

  it('leads the frame with a short takeaway line, not a wall of prose', () => {
    render(<Close {...props} />);
    const leadSentence = f2.debrief.frame[0].match(/^(.*?[.!?])(\s|$)/)[1];
    const lead = screen.getByText(leadSentence);
    // The lead is its own element, and short enough to read at a glance.
    expect(lead.tagName).toBe('P');
    expect(lead.textContent.split(/\s+/).length).toBeLessThan(26);
    // And the rest of the frame still renders (content preserved, not cut).
    if (f2.debrief.frame.length > 1) {
      expect(screen.getByText(f2.debrief.frame[1])).toBeTruthy();
    }
  });

  it('offers a skip on recall — it is never gated', () => {
    render(<Close {...props} />);
    expect(screen.getByText('Skip this')).toBeTruthy();
  });

  it('does not author "none" into the act list', () => {
    expect(f2.act.some((a) => a.id === 'none')).toBe(false);
  });

  it('congratulates nobody', () => {
    const { container } = render(<Close {...props} />);
    for (const banned of ['Congratulations', 'Well done', 'certificate', 'Certificate', 'badge', 'Score']) {
      expect(container.textContent).not.toContain(banned);
    }
  });

  it('reveals the recall note only after answering', () => {
    const { unmount } = render(<Close {...props} />);
    expect(screen.queryByText(f2.recall.options[1].note)).toBeNull();
    unmount();
    render(<Close {...props} recallAnswer="b" />);
    expect(screen.getByText(f2.recall.options[1].note)).toBeTruthy();
  });
});

describe('Artefact', () => {
  const samples = {
    message_thread: { type: 'message_thread', contact: 'Dad', messages: [{ from: 'you', text: 'is mum with you' }] },
    email: { type: 'email', subject: 'S', fromName: 'N', fromAddress: 'a@b.example', to: 'you', body: ['b'] },
    assistant_output: { type: 'assistant_output', response: ['r'] },
    document: { type: 'document', filename: 'f.docx', lines: ['l'] },
    system_output: { type: 'system_output', system: 'S', headline: 'H' },
    transcript: { type: 'transcript', source: 'call', lines: [{ speaker: 'You', text: 't' }] },
  };

  for (const [type, artefact] of Object.entries(samples)) {
    it(`renders ${type}`, () => {
      const { container } = render(<Artefact artefact={artefact} />);
      expect(container.querySelector('figure')).toBeTruthy();
    });
  }

  it('renders nothing for a null artefact', () => {
    const { container } = render(<Artefact artefact={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('throws in dev on a type outside the closed vocabulary', () => {
    expect(() => render(<Artefact artefact={{ type: 'carrier_pigeon' }} />)).toThrow(/closed vocabulary/);
  });

  it('keeps the display name and the real address both visible on an email', () => {
    const { container } = render(<Artefact artefact={samples.email} />);
    expect(container.textContent).toContain('N');
    expect(container.textContent).toContain('a@b.example');
  });

  it('leaves faint document lines in the accessibility tree', () => {
    const a = { type: 'document', filename: 'f.docx', lines: [{ text: 'buried instruction', faint: true }] };
    render(<Artefact artefact={a} />);
    expect(screen.getByText('buried instruction')).toBeTruthy();
  });
});

describe('every registered scenario', () => {
  for (const sc of scenarios) {
    it(`${sc.id}: setup, first decision and close all render`, () => {
      const { unmount } = render(<Setup scenario={sc} onBegin={() => {}} />);
      unmount();
      const entry = sc.nodes[sc.entry || 'start'];
      const r2 = render(<Decision node={entry} index={1} revealedChoice={null} onCommit={() => {}} onAdvance={() => {}} />);
      r2.unmount();
      render(<Close scenario={sc} recallAnswer={null} actChoice={null} onRecall={() => {}} onAct={() => {}} onReplay={() => {}} />);
      expect(screen.getByText(sc.tell)).toBeTruthy();
    });
  }
});

// ── Stale deep links from the knowledge base ─────────────────────────────
// 32 KB entries link to /#/scenario/<id>. Most of those ids are not
// registered. None of them may land on a dead end.
describe('stale deep links', () => {
  it('every KB-linked scenario id is either registered or known on disk', async () => {
    const { KNOWN_IDS, scenarios: live } = await import('../scenarios/index.js');
    const kbLinked = [
      'a1-hallucination', 'a2-model-drift', 'a3-robustness', 'a4-explainability',
      'b1-accountability', 'b2-compliance', 'b3-lifecycle', 'b4-supply-chain', 'b5-agentic-logging',
      'c1-data-poisoning', 'c2-prompt-injection', 'c3-model-theft', 'c4-deepfakes',
      'c5-ai-cyber-attacks', 'c6-mcp-attack', 'c7-multi-agent-trust', 'c8-computer-use-hijacking',
      'd1-data-quality', 'd2-privacy', 'd3-ip',
      'e1-bias', 'e2-harmful-content', 'e3-misinformation',
      'f1-automation-bias', 'f2-shadow-ai', 'f3-scope-creep', 'f4-irreversibility',
      'g1-concentration-risk', 'g2-environmental-impact', 'g3-workforce-displacement',
      'g4-ai-safety', 'g5-excessive-agency',
    ];
    const liveIds = new Set(live.map((s) => s.id));
    const orphans = kbLinked.filter((id) => !liveIds.has(id) && !KNOWN_IDS.includes(id));
    expect(orphans).toEqual([]);
  });
});

// ── Claims discipline ────────────────────────────────────────────────────
// Two corrections from testing: the product does record aggregate usage, so
// "nothing saved" was a promise it does not keep; and scenarios are built on
// documented events rather than reconstructing them, so "has actually
// happened" overclaimed.
describe('claims', () => {
  it('never promises nothing is saved — shell or homepage', async () => {
    const App = (await import('../App.jsx')).default;
    const Homepage = (await import('../components/Homepage/Homepage.jsx')).default;
    for (const ui of [<App />, <Homepage />]) {
      const { container, unmount } = rtlRender(<MemoryRouter>{ui}</MemoryRouter>);
      expect(container.textContent.toLowerCase()).not.toContain('nothing is saved');
      expect(container.textContent.toLowerCase()).not.toContain('nothing saved');
      unmount();
    }
  });

  it('describes the source material as based on real incidents, not as reenactment', async () => {
    const App = (await import('../App.jsx')).default;
    const { container } = rtlRender(<MemoryRouter><App /></MemoryRouter>);
    expect(container.textContent).toContain('Based on real incidents and known risks');
    expect(container.textContent).not.toContain('actually happened to someone');
  });
});

// ── Browse index + next-scenario (added after the toggle/dead-end fix) ──────
describe('homepage index', () => {
  it('shows every scenario without a toggle — the catalogue is not hidden', async () => {
    const Homepage = (await import('../components/Homepage/Homepage.jsx')).default;
    const { scenarios: live } = await import('../scenarios/index.js');
    render(<Homepage />);
    // Every scenario's shelfLine is present on first render, no interaction.
    for (const sc of live) {
      expect(screen.getByText(sc.shelfLine), `${sc.id} missing from index`).toBeTruthy();
    }
  });
});

describe('close — try another', () => {
  const props = { scenario: f2, recallAnswer: null, actChoice: null, onRecall: () => {}, onAct: () => {}, onReplay: () => {} };
  it('offers a next scenario rather than dead-ending at the homepage', () => {
    render(<Close {...props} />);
    expect(screen.getByText('Try another')).toBeTruthy();
    // At least one suggested link that is not the scenario just played.
    const links = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(links.some((h) => h && h.includes('/scenario/') && !h.includes('f2-shadow-ai'))).toBe(true);
  });
});

// ── About page (mission, feedback channel, claims discipline) ───────────────
describe('about page', () => {
  it('offers a real feedback channel', async () => {
    const About = (await import('../pages/About.jsx')).default;
    const { container } = render(<About />);
    const mailtos = [...container.querySelectorAll('a[href^="mailto:"]')];
    expect(mailtos.length).toBeGreaterThanOrEqual(1);
    expect(mailtos.some((a) => a.getAttribute('href').includes('@airiskpractice.org'))).toBe(true);
  });

  it('makes no efficacy or certification claim', async () => {
    const About = (await import('../pages/About.jsx')).default;
    const { container } = render(<About />);
    const t = container.textContent.toLowerCase();
    for (const banned of ['proven to', 'makes you compliant', 'certified', 'guarantee']) {
      expect(t, `About must not contain "${banned}"`).not.toContain(banned);
    }
  });
});
