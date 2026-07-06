/**
 * @fileoverview definitionEngine.js
 * Scans for definitions ("means", "shall mean") and issues Link patches.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "definitionEngine",
  version: "1.0.0",
  priority: 20,
  dependsOn: [], // Can run independently for now
  provides: ["definitions", "links"],
  invalidates: ["clauseClassifier"],
  cost: 2,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    // Pattern to catch "Term" means / shall mean
    // Simplified for Phase 1
    const definitionRegex = /["']?([A-Z][a-zA-Z\s]{2,30})["']?\s+(?:means|shall mean|is defined as)\s+/g;
    
    const dictionary = new Map();

    // Pass 1: Extract definitions
    ir.nodes.forEach(node => {
      let match;
      while ((match = definitionRegex.exec(node.text)) !== null) {
        const term = match[1].trim();
        if (!dictionary.has(term)) {
          const defId = `DEF_${term.replace(/\s+/g, '').toUpperCase()}`;
          dictionary.set(term, { id: defId, sourceNode: node.id });
          
          patches.push({
            op: 'Annotate',
            path: `/metadata/definitions/${defId}`,
            value: { term, sourceNode: node.id }
          });
        }
      }
    });

    // Pass 2: Find usages of defined terms and Link them
    if (dictionary.size > 0) {
      ir.nodes.forEach(node => {
        dictionary.forEach((defInfo, term) => {
          // Avoid self-referential links for the defining node
          if (node.id === defInfo.sourceNode) return;
          
          // Basic word boundary check
          const usageRegex = new RegExp(`\\b${term}\\b`, 'g');
          if (usageRegex.test(node.text)) {
            patches.push({
              op: 'Link',
              from: node.id,
              to: defInfo.sourceNode,
              relation: 'references'
            });
          }
        });
      });
    }

        return {
      patches,
      findings: [],
      diagnostics: { warnings: [], errors: [], statistics: { nodesVisited: ir.nodes.length } }
    };
  }
};
