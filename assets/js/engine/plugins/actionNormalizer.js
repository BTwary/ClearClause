/**
 * @fileoverview actionNormalizer.js
 * Phase 2B Enrichment Engine.
 * Normalizes raw drafting variations to canonical verbs (e.g. "make payment" -> ACTION_PAY)
 * and resolves actor names to canonical Party IDs based on the PartyResolver output.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "actionNormalizer",
  version: "1.0.0",
  priority: 50,
  dependsOn: ["actionBuilder"],
  provides: ["normalizedActions"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir, knowledgeProvider } = context;
    const patches = [];

    ir.nodes.forEach(node => {
      if (!node.actions || node.actions.length === 0) return;

      let changed = false;
      const updatedActions = node.actions.map(act => {
        let newVerb = act.verb;
        
        // Normalize verb
        if (act.verb) {
          const resolved = knowledgeProvider.resolveActionSynonym(act.verb);
          if (resolved) {
            newVerb = resolved;
            changed = true;
          }
        }

        // Attempt to resolve the 'actor' to a canonical Party ID from the metadata
        let newActor = act.actor;
        if (act.actor && ir.metadata.parties) {
          for (const [canonicalId, info] of Object.entries(ir.metadata.parties)) {
            if (info.alias && (act.actor.includes(info.alias) || info.alias.includes(act.actor))) {
              newActor = canonicalId;
              changed = true;
              break;
            }
          }
        }

        return { ...act, verb: newVerb, actor: newActor };
      });

      if (changed) {
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/actions`,
          value: updatedActions
        });
      }
    });

        return {
      patches,
      findings: [],
      diagnostics: { warnings: [], errors: [], statistics: { nodesVisited: ir.nodes.length } }
    };
  }
};
