/**
 * @fileoverview entityEngine.js
 * Extracts Dates, Courts, Jurisdictions, and Laws.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "entityEngine",
  version: "1.0.0",
  priority: 45,
  dependsOn: [],
  provides: ["entities"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    // Basic deterministic extraction (Phase 2A)
    const lawRegex = /(?:laws of|under the laws of)\s+([A-Z][a-zA-Z\s]+)/g;
    const courtRegex = /courts of\s+([A-Z][a-zA-Z\s]+)/g;

    ir.nodes.forEach(node => {
      const entities = [];
      let match;

      while ((match = lawRegex.exec(node.text)) !== null) {
        entities.push({
          type: 'Jurisdiction_Law',
          value: match[1].trim(),
          evidence: { matchedText: match[0], start: match.index, end: match.index + match[0].length }
        });
      }

      while ((match = courtRegex.exec(node.text)) !== null) {
        entities.push({
          type: 'Jurisdiction_Court',
          value: match[1].trim(),
          evidence: { matchedText: match[0], start: match.index, end: match.index + match[0].length }
        });
      }

      if (entities.length > 0) {
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/metadata/entities`,
          value: entities
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
