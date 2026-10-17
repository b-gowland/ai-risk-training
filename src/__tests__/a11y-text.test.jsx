// What a screen reader hears, and the sources line.
//
// Adjacent visual labels with no text between them are read as one word:
// the decision counter came out as "01decision" and an artefact header as
// "licence scan Review required". These pin the separators in place.

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Decision from '../player/Decision.jsx';
import Close from '../player/Close.jsx';
import Artefact from '../components/Artefact/Artefact.jsx';
import { byId } from '../scenarios/index.js';

const noop = () => {};

describe('screen-reader text', () => {
  it('the decision counter is visual only; the step is announced once', () => {
    const node = byId('d3-ip').nodes.start;
    const { container } = render(<Decision node={node} path={[]} index={1} minDepth={3} onCommit={noop} onAdvance={noop} />);
    expect(screen.getByText('Decision 1')).toBeTruthy();
    for (const el of container.querySelectorAll('[aria-hidden="true"]')) {
      expect(['01', 'decision', '']).toContain(el.textContent.trim());
    }
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('01');
  });

  it('an artefact status badge is read with a label, not run into the name', () => {
    const { container } = render(
      <Artefact artefact={{ type: 'system_output', system: 'Licence scan', status: 'Review required', headline: 'H' }} />
    );
    expect(container.textContent.replace(/\s+/g, ' ')).toContain('Licence scan. Status: Review required');
  });

  it('transcript lines separate time, speaker and words', () => {
    const { container } = render(
      <Artefact artefact={{ type: 'transcript', source: 'Call', duration: '2:10', lines: [{ time: '0:12', speaker: 'Mum', text: 'Hello' }] }} />
    );
    const text = container.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Call, 2:10');
    expect(text).toContain('0:12, Mum: Hello');
  });
});

describe('sources', () => {
  it('a scenario with a dated legal claim shows its primary source on the close screen', () => {
    const sc = byId('home-algorithm-said-no');
    render(
      <MemoryRouter>
        <Close scenario={sc} recallAnswer={null} actChoice={null} onRecall={noop} onAct={noop} onReplay={noop} onShared={noop} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: sc.sources[0].title });
    expect(link.getAttribute('href')).toBe(sc.sources[0].url);
    expect(screen.getByRole('list', { name: 'Sources' }).textContent).toContain(sc.sources[0].quote);
  });
});
