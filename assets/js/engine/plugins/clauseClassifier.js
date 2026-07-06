/**
 * @fileoverview clauseClassifier.js
 * Uses a tiered deterministic progression to assign ranked category candidates to nodes.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "clauseClassifier",
  version: "1.0.0",
  priority: 30,
  dependsOn: ["definitionEngine"], // Often needs to know if a term is defined
  provides: ["classifications"],
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
      // Very basic Mock Implementation for Phase 1
      // In production, this would do: Regex -> Heading -> Phrase Graph -> Ontology
      let candidates = [];
      
      const text = node.text.toLowerCase();
      
      if (text.includes('confidential') || text.includes('disclose')) {
        candidates.push({ id: 'CONFIDENTIALITY', score: 0.95 });
      }
      
      if (text.includes('terminate') || text.includes('expire')) {
        candidates.push({ id: 'TERMINATION', score: 0.92 });
        candidates.push({ id: 'TERM', score: 0.70 }); // secondary candidate
      }

      if (text.includes('shall pay') || text.includes('invoice')) {
        candidates.push({ id: 'PAYMENT', score: 0.88 });
      }
      
      if (candidates.length > 0) {
        // Sort by score descending
        candidates.sort((a, b) => b.score - a.score);
        
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/metadata/candidates`,
          value: candidates
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
