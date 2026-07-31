// Path length, derived from the tree at render time so it can never drift
// from what was authored (§4.2: "derived from the tree, never authored").
// Branching means there is no single length — the honest number is a band.
export function depthBand(scenario) {
  const lengths = [];
  const walk = (id, d, trail) => {
    if (!id || id.startsWith('outcome_') || trail.has(id)) { lengths.push(d); return; }
    const node = scenario.nodes[id];
    if (!node) { lengths.push(d); return; }
    const nd = node.decision ? d + 1 : d;
    const outs = node.branches ? Object.values(node.branches) : [node.next];
    if (!outs.length) { lengths.push(nd); return; }
    for (const t of outs) walk(t, nd, new Set([...trail, id]));
  };
  walk(scenario.entry || 'start', 0, new Set());
  return { min: Math.min(...lengths), max: Math.max(...lengths) };
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
export const spell = (n) => WORDS[n] ?? String(n);
