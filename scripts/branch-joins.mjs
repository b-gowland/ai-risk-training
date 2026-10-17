#!/usr/bin/env node
// branch-joins.mjs — print every join in a scenario for a human read.
//
// A screen reached from several choices has to read correctly from each of
// them, and an ending reached by many routes may only claim what every route
// did. Neither shows up in a playthrough, which only ever walks one route.
// This prints, for every node and ending:
//
//   === INTO <target>: its opening text (conditional lines shown as [when …])
//     <- node.choice "label" → consequence        one line per way in
//
// and, for every ending, the choices made on EVERY route into it. Anything
// the ending says about the player that is not in that list needs a
// { when } condition (see resolveParas in src/engine/narrativeEngine.js).
//
//   npm run joins                 all scenarios
//   npm run joins -- d3-ip        one scenario

import { scenarios } from '../src/scenarios/index.js';

const only = process.argv[2];
const para = (p) => (typeof p === 'string' ? p
  : `[${p.when ? `when ${[p.when].flat().join('|')}` : `unless ${[p.unless].flat().join('|')}`}] ${p.text}`);

for (const s of scenarios) {
  if (only && s.id !== only) continue;
  const routes = [];
  const walk = (id, trail) => {
    if (id.startsWith('outcome_')) { routes.push([...trail, id]); return; }
    const n = s.nodes[id];
    for (const c of n.decision.choices) walk(n.branches?.[c.id] || n.next, [...trail, `${id}.${c.id}`]);
  };
  walk(s.entry || 'start', []);
  console.log(`\n######## ${s.id} (${routes.length} routes)`);

  const incoming = {};
  for (const [id, n] of Object.entries(s.nodes)) {
    for (const c of n.decision.choices) (incoming[n.branches?.[c.id] || n.next] ??= []).push({ id, c });
  }
  for (const [target, ins] of Object.entries(incoming)) {
    const t = target.startsWith('outcome_') ? s.outcomes[target] : s.nodes[target];
    const open = target.startsWith('outcome_')
      ? `[${t.heading}] ${t.description.map(para).join(' ')}`
      : t.prose.map(para).join(' ');
    console.log(`\n=== INTO ${target}: ${open}`);
    for (const { id, c } of ins) console.log(`  <- ${id}.${c.id} "${c.label}" → ${c.consequence}`);
  }

  const label = (k) => {
    const [n, c] = k.split('.');
    return `${k} "${s.nodes[n].decision.choices.find((x) => x.id === c).label}"`;
  };
  for (const [oid, o] of Object.entries(s.outcomes)) {
    const rs = routes.filter((r) => r.at(-1) === oid).map((r) => r.slice(0, -1));
    const always = rs.length ? rs[0].filter((k) => rs.every((r) => r.includes(k))) : [];
    console.log(`\n--- ${oid}: ${rs.length} route(s). Reaction: ${o.reaction} Judgement: ${o.judgement}`);
    console.log(`    chosen on every route: ${always.map(label).join(' ; ') || '(nothing)'}`);
  }
}
