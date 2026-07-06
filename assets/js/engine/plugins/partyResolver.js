/**
 * @fileoverview partyResolver.js
 * Scans the Legal IR for common party aliases (e.g., "Company", "Disclosing Party")
 * and resolves them to Canonical Party IDs. Issues Annotate patches.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "partyResolver",
  version: "1.0.0",
  priority: 10,
  dependsOn: [],
  provides: ["parties"],
  invalidates: [],
  cost: 1,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    /** @type {import('../core/types.js').Patch[]} */
    const patches = [];

    // Simple heuristic for Phase 1: look for specific labels
    const knownAliases = ['Company', 'Vendor', 'Client', 'Disclosing Party', 'Receiving Party'];
    
    // We would normally establish Canonical Parties from the prologue/header of the document.
    // For Phase 1, we will just map aliases found in nodes to dummy canonical IDs.
    
    let partyCounter = 1;
    const partyMap = new Map();

    ir.nodes.forEach(node => {
      // Very basic substring match for demo purposes
      knownAliases.forEach(alias => {
        if (node.text.includes(alias)) {
          let canonicalId = partyMap.get(alias);
          if (!canonicalId) {
            canonicalId = `PARTY_00${partyCounter++}`;
            partyMap.set(alias, canonicalId);
            
            // Add party definition to IR metadata
            patches.push({
              op: 'Annotate',
              path: `/metadata/parties/${canonicalId}`,
              value: { alias, type: 'Organization' } // simplified
            });
          }
          
          // Annotate the node with the mentioned party
          const currentParties = node.metadata.mentionedParties || [];
          if (!currentParties.includes(canonicalId)) {
            patches.push({
              op: 'Annotate',
              path: `/nodes/${node.id}/metadata/mentionedParties`,
              value: [...currentParties, canonicalId]
            });
          }
        }
      });
    });

        return {
      patches,
      findings: [],
      diagnostics: { warnings: [], errors: [], statistics: { nodesVisited: ir.nodes.length } }
    };
  }
};
