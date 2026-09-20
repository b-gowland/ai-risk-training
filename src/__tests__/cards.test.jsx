// Discussion cards — render test.
//
// The cards are a second renderer of the corpus, so they carry the same risk
// that shipped three blank artefacts on 2 Aug: valid data, fields nobody reads,
// every gate green. This renders every registered scenario's deck and asserts
// that the authored content each card depends on reached the DOM.

import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Cards, { CardArtefact } from '../pages/Cards.jsx';
import { scenarios } from '../scenarios/index.js';

const norm = (t) => (t || '').replace(/\s+/g, ' ').trim();

function artefactStrings(a) {
  const first = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : undefined);
  switch (a.type) {
    case 'message_thread':   return [a.contact, first(a.messages)?.text];
    case 'email':            return [a.subject, a.fromName, a.fromAddress, first(a.body)];
    case 'assistant_output': return [first(a.response)];
    case 'document': { const l = first(a.lines); return [a.filename, typeof l === 'string' ? l : l?.text]; }
    case 'system_output':    return [a.system, a.headline, first(a.fields)?.value];
    case 'transcript':       return [a.source, first(a.lines)?.text];
    default:                 return [];
  }
}

const renderDeck = (id) =>
  render(
    <MemoryRouter initialEntries={[`/cards?s=${id}`]}>
      <Cards />
    </MemoryRouter>
  );

describe('discussion cards', () => {
  it.each(scenarios.map((s) => [s.id, s]))('%s renders eight cards with its authored content', (_id, sc) => {
    const { container } = renderDeck(sc.id);
    const cards = container.querySelectorAll('article[data-card]');
    expect(cards.length).toBe(8);

    const text = (n) => norm(container.querySelector(`article[data-card="${n}"]`).textContent);
    const start = sc.nodes[sc.entry || 'start'];

    expect(text(1)).toContain(norm(sc.title));
    expect(text(1)).toContain(norm(sc.coldOpen[0]));
    expect(text(1)).toContain(norm(sc.authority));

    if (start.artefact) {
      const expected = artefactStrings(start.artefact);
      expect(expected.length, `no assertions for artefact type ${start.artefact.type}`).toBeGreaterThan(0);
      for (const v of expected) {
        expect(v, `${start.artefact.type} has an empty load-bearing field`).toBeTruthy();
        expect(text(2)).toContain(norm(v));
      }
    }

    for (const c of start.decision.choices) {
      expect(text(3)).toContain(norm(c.label));
      expect(text(4)).toContain(norm(c.consequence));
    }
    expect(text(5)).toContain(norm(sc.debrief.frame[0]));
    for (const o of sc.recall.options) {
      expect(text(6)).toContain(norm(o.label));
      expect(text(7)).toContain(norm(o.note));
    }
    expect(text(8)).toContain(norm(sc.tell));
    for (const a of sc.act) expect(text(8)).toContain(norm(a.label));
  });

  it('never shows choice quality', () => {
    const { container } = renderDeck(scenarios[0].id);
    // quality lives in data attributes nowhere and in text nowhere
    expect(container.innerHTML).not.toMatch(/data-quality|quality/i);
  });

  it('credits the project, not a person', () => {
    // Public material carries the project name only. If the credit line
    // changes, change it here deliberately.
    renderDeck(scenarios[0].id);
    expect(screen.getByText(/crediting AI Risk Practice \(github\.com\/b-gowland\/ai-risk-training\)/)).toBeTruthy();
  });

  it('falls back to the first scenario for an unknown id', () => {
    const { container } = renderDeck('not-a-scenario');
    expect(norm(container.querySelector('article[data-card="1"]').textContent)).toContain(norm(scenarios[0].title));
  });

  it('includes the facilitator sheet', () => {
    renderDeck(scenarios[0].id);
    const sheet = screen.getByRole('region', { name: 'Running a table' });
    expect(within(sheet).getByText(/Deal the deck in order/)).toBeTruthy();
  });

  it('renders every artefact type in the closed vocabulary without throwing', () => {
    const all = scenarios.flatMap((s) => Object.values(s.nodes).map((n) => n.artefact).filter(Boolean));
    for (const a of all) {
      const { container, unmount } = render(<CardArtefact artefact={a} />);
      for (const v of artefactStrings(a)) expect(norm(container.textContent)).toContain(norm(v));
      unmount();
    }
  });
});
