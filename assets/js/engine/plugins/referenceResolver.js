/**
 * @fileoverview referenceResolver.js
 * Phase 2B Enrichment Engine.
 * Resolves references within Action conditions/exceptions to actual LegalNodes.
 * Also resolves Action objects to Canonical Definitions if applicable.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "referenceResolver",
  version: "1.0.0",
  priority: 55,
  dependsOn: ["legalGrammarEngine", "definitionEngine"],
  provides: ["resolvedReferences"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    // Very basic regex to find "Clause X"
    const clauseRefRegex = /Clause\s+(\d+)/i;

    ir.nodes.forEach(node => {
      if (!node.actions || node.actions.length === 0) return;

      let changed = false;
      const updatedActions = node.actions.map(act => {
        const references = [...(act.references || [])];
        let newObject = act.object;

        // Resolve Object to Definition ID
        if (act.object && ir.metadata.definitions) {
          for (const [defId, defInfo] of Object.entries(ir.metadata.definitions)) {
            if (act.object.includes(defInfo.term) || defInfo.term.includes(act.object)) {
              newObject = defId;
              changed = true;
              break;
            }
          }
        }

        // Resolve Clause References in exceptions/conditions
        [...act.conditions, ...act.exceptions].forEach(text => {
          const match = clauseRefRegex.exec(text);
          if (match) {
            // In a real system, we'd look up the node by its actual section number
            // For Phase 2 demo, we just fabricate a NODE_ reference
            const targetId = `NODE_00${match[1]}`;
            if (!references.includes(targetId)) {
              references.push(targetId);
              changed = true;
            }
          }
        });

        return { ...act, object: newObject, references };
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
