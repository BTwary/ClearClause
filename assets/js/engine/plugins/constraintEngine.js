/**
 * @fileoverview constraintEngine.js
 * Extracts generic constraints (money, percentages, durations) from the Legal IR.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "constraintEngine",
  version: "1.0.0",
  priority: 45,
  dependsOn: ["actionBuilder"],
  provides: ["constraints"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    // Very basic regex for Phase 2A
    const moneyRegex = /(?:USD|\$)\s*([\d,]+)/g;
    const durationRegex = /(\d+)\s+(day|month|year)s?/g;
    const percentRegex = /(\d+)\s*%/g;

    ir.nodes.forEach(node => {
      const constraints = [];
      let match;

      while ((match = moneyRegex.exec(node.text)) !== null) {
        constraints.push({
          type: 'money',
          currency: 'USD', // Hardcoded for demo
          value: parseInt(match[1].replace(/,/g, ''), 10),
          evidence: { matchedText: match[0], start: match.index, end: match.index + match[0].length }
        });
      }

      while ((match = durationRegex.exec(node.text)) !== null) {
        constraints.push({
          type: 'duration',
          value: parseInt(match[1], 10),
          unit: match[2],
          evidence: { matchedText: match[0], start: match.index, end: match.index + match[0].length }
        });
      }

      while ((match = percentRegex.exec(node.text)) !== null) {
        constraints.push({
          type: 'percentage',
          value: parseInt(match[1], 10),
          evidence: { matchedText: match[0], start: match.index, end: match.index + match[0].length }
        });
      }

      // Attach constraints to actions if any exist on the node
      if (constraints.length > 0 && node.actions && node.actions.length > 0) {
        node.actions.forEach(act => {
          act.constraints = [...constraints]; // Broadcast for now
        });
        
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/actions`,
          value: node.actions
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
