// Artefact render smoke test.
//
// WHY THIS EXISTS. Three scenarios shipped with an opening artefact that
// rendered as an empty frame: the object had a valid `type` but used field
// names no renderer reads. Lint, unit tests, route-audit, scenario-audit and
// build were all green, because none of them rendered anything. §5.3 says the
// artefact carries everything the decision turns on, so an empty artefact is a
// broken decision screen, not a cosmetic defect.
//
// scenario-audit now checks artefact field shape statically. This is the
// second net and the one that cannot drift from the component: it renders
// every artefact in the live corpus and asserts that the content authored into
// its load-bearing fields actually reached the DOM. Asserting only that
// "something rendered" is too weak — a partially wired artefact passes that.

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Artefact from '../components/Artefact/Artefact.jsx';
import { scenarios } from '../scenarios/index.js';

// For each type, the authored values that must be findable in the output.
function expectedStrings(a) {
  const first = (arr) => (Array.isArray(arr) && arr.length ? arr[0] : undefined);
  switch (a.type) {
    case 'message_thread':
      return [a.contact, first(a.messages)?.text];
    case 'email':
      return [a.subject, a.fromName, a.fromAddress, a.to, first(a.body)];
    case 'assistant_output':
      return [first(a.response)];
    case 'document': {
      const l = first(a.lines);
      return [a.filename, typeof l === 'string' ? l : l?.text];
    }
    case 'system_output':
      return [a.system, a.headline];
    case 'transcript':
      return [a.source, first(a.lines)?.text];
    default:
      return [];
  }
}

const artefacts = scenarios.flatMap((s) =>
  Object.entries(s.nodes)
    .filter(([, n]) => n.artefact)
    .map(([nodeId, n]) => ({ id: `${s.id}/${nodeId}`, artefact: n.artefact }))
);

const norm = (t) => (t || '').replace(/\s+/g, ' ').trim();

describe('every artefact in the registered corpus renders its authored content', () => {
  it('finds artefacts to test', () => {
    expect(artefacts.length).toBeGreaterThan(10);
  });

  it.each(artefacts)('$id renders the fields the renderer reads', ({ artefact }) => {
    const { container } = render(<Artefact artefact={artefact} />);
    const text = norm(container.textContent);

    const expected = expectedStrings(artefact);
    // A type with nothing to assert means expectedStrings has drifted from the
    // closed vocabulary, which is itself a failure.
    expect(expected.length).toBeGreaterThan(0);

    for (const value of expected) {
      expect(value, `${artefact.type} has an empty load-bearing field`).toBeTruthy();
      expect(text).toContain(norm(value));
    }
  });
});
