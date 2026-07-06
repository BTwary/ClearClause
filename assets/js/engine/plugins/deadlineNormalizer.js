/**
 * @fileoverview deadlineNormalizer.js
 * Phase 2B Enrichment Engine.
 * Scans the action text for temporal triggers and normalizes them into structured deadlines.
 */

/** @type {import('../core/types.js').Engine} */
export default {
  id: "deadlineNormalizer",
  version: "1.0.0",
  priority: 60,
  dependsOn: ["actionBuilder"],
  provides: ["normalizedDeadlines"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').PatchSet}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    // Pattern: [relation] [value] [unit]
    // e.g. "within 30 days"
    const deadlineRegex = /(within|before|after|no later than)\s+(\d+)\s+(day|month|year)s?/i;

    ir.nodes.forEach(node => {
      if (!node.actions || node.actions.length === 0) return;

      let changed = false;
      const updatedActions = node.actions.map(act => {
        const deadlines = [...(act.deadlines || [])];
        
        // Scan the original extracted evidence text for the action
        if (act.evidence && act.evidence.matchedText) {
          const match = deadlineRegex.exec(act.evidence.matchedText);
          if (match) {
            deadlines.push({
              raw: match[0],
              relation: match[1].toLowerCase(),
              value: parseInt(match[2], 10),
              unit: match[3].toLowerCase()
            });
            changed = true;
          }
        }

        return { ...act, deadlines };
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
