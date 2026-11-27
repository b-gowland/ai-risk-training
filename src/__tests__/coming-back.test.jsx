// The benign twin and the login-free ways back (27 Nov 2026).
import { describe, it, expect, vi } from 'vitest';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Close from '../player/Close.jsx';
import { reminderFile, scenarioUrl, SITE } from '../player/reminder.js';
import { scenario as home } from '../scenarios/home-voice-clone.js';
import { scenarios } from '../scenarios/index.js';

const render = (ui) => rtlRender(<MemoryRouter>{ui}</MemoryRouter>);
const base = { scenario: home, actChoice: null, onRecall: () => {}, onAct: () => {}, onReplay: () => {} };

describe('benign twin', () => {
  it('waits until the recall item is answered', () => {
    render(<Close {...base} recallAnswer={null} />);
    expect(screen.queryByText(home.recallTwin.prompt)).toBeNull();
  });

  it('follows the recall answer, reports its choice and shows the note', () => {
    const onRecallTwin = vi.fn();
    render(<Close {...base} recallAnswer="b" onRecallTwin={onRecallTwin} />);
    expect(screen.getByText(home.recallTwin.prompt)).toBeTruthy();
    const good = home.recallTwin.options.find((o) => o.quality === 'good');
    fireEvent.click(screen.getByText(good.label));
    expect(onRecallTwin).toHaveBeenCalledWith(good.id);
    expect(screen.getByText(good.note)).toBeTruthy();
  });

  it('grades voice-clone answers as procedure against paralysis', () => {
    // Calling back is right whether or not the call is genuine, so the twin
    // never marks checking as wrong. Refusing without checking is the costly
    // answer when the call is real; paying without checking is never good.
    const byQuality = Object.fromEntries(home.recallTwin.options.map((o) => [o.quality, o.label]));
    expect(byQuality.good).toMatch(/ring her back/i);
    expect(byQuality.partial).toMatch(/refuse/i);
    expect(byQuality.poor).toMatch(/pay straight away/i);
  });

  it('is only ever authored with an id and a good option', () => {
    for (const s of scenarios.filter((x) => x.recallTwin)) {
      expect(s.recallTwin.id).toBeTruthy();
      expect(s.recallTwin.options.some((o) => o.quality === 'good')).toBe(true);
    }
  });
});

describe('ways back without a login', () => {
  it('sends family the public static page, never the current address', () => {
    render(<Close {...base} recallAnswer={null} />);
    const link = screen.getByText('Send to family on WhatsApp').closest('a');
    expect(link.getAttribute('href').startsWith('https://wa.me/?text=')).toBe(true);
    const text = decodeURIComponent(link.getAttribute('href').split('text=')[1]);
    expect(text).toContain(home.tell);
    expect(text).toContain(`${SITE}/scenarios/${home.id}/`);
  });

  it('counts the share method only', () => {
    const onShared = vi.fn();
    render(<Close {...base} recallAnswer={null} onShared={onShared} />);
    fireEvent.click(screen.getByText('Send to family on WhatsApp'));
    expect(onShared).toHaveBeenCalledWith('whatsapp');
  });

  it('builds a valid all-day reminder fourteen days out', () => {
    const now = new Date(2026, 11, 20, 21, 30);
    const ics = reminderFile(home, now);
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART;VALUE=DATE:20270103');
    expect(ics).toContain('DTEND;VALUE=DATE:20270104');
    expect(ics).toContain(`URL:${scenarioUrl(home.id)}`);
    for (const line of ics.split('\r\n')) expect(line.length).toBeLessThanOrEqual(75);
    // Commas and semicolons in the text are escaped, not left to break fields.
    expect(ics.replace(/\r\n /g, '')).toMatch(/SUMMARY:AI Risk Practice: Is That Really Mum\?/);
    expect(ics.replace(/\r\n /g, '')).not.toMatch(/DESCRIPTION:[^\r]*[^\\],/);
  });
});

describe('flags: what makes you pause', () => {
  const start = home.nodes.start;

  it('asks for flags before the choices, and can be skipped', async () => {
    const { default: Decision } = await import('../player/Decision.jsx');
    render(<Decision node={start} path={[]} revealedChoice={null} onCommit={() => {}} onAdvance={() => {}} index={1} minDepth={4} />);
    expect(screen.getByText(start.flags.prompt)).toBeTruthy();
    expect(screen.queryByText(start.decision.choices[0].label)).toBeNull();
    const go = screen.getByRole('button', { name: 'Tap at least one' });
    expect(go.disabled).toBe(true);
    fireEvent.click(screen.getByText(start.flags.items[0].label));
    fireEvent.click(screen.getByRole('button', { name: 'Now decide' }));
    expect(screen.getByText(start.decision.choices[0].label)).toBeTruthy();
  });

  it('after the choice, separates warning signs from what settles nothing', async () => {
    const { default: Decision } = await import('../player/Decision.jsx');
    const chosen = start.decision.choices[0];
    render(<Decision node={start} path={[]} revealedChoice={chosen} onCommit={() => {}} onAdvance={() => {}} index={1} minDepth={4} />);
    expect(screen.getByText(start.flags.signsHead)).toBeTruthy();
    expect(screen.getByText(start.flags.neutralHead)).toBeTruthy();
    for (const f of start.flags.items) expect(screen.getByText(f.label)).toBeTruthy();
  });

  it('never treats how real the call feels as a warning sign', () => {
    const byId = Object.fromEntries(start.flags.items.map((f) => [f.id, f.matters]));
    expect(byId.voice).toBe(false);
    expect(byId.number).toBe(false);
    expect(byId.secret).toBe(true);
  });
});
