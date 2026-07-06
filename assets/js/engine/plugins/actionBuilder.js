/**
 * @fileoverview actionBuilder.js
 * Converts the Syntactic AST from the Legal Grammar Engine into Legal Semantic Actions.
 */

export default {
  id: "actionBuilder",
  version: "1.0.0",
  priority: 45, // Runs right after grammar
  dependsOn: ["legalGrammarEngine"],
  provides: ["actions"],
  invalidates: [],
  cost: 5,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').ExecutionResult}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    ir.nodes.forEach(node => {
      if (!node.syntaxTree || node.syntaxTree.length === 0) return;
      
      const actions = [];
      let actionCounter = 1;

      node.syntaxTree.forEach(stmt => {
        if (stmt.type !== 'Statement') return;
        
        actions.push({
          id: `${node.id}_ACT_${actionCounter++}`,
          actor: stmt.subject || null,
          modal: stmt.modal || null,
          verb: stmt.verb || null,
          object: stmt.object || null,
          recipient: null,
          conditions: [...stmt.conditions],
          exceptions: [...stmt.exceptions],
          deadlines: [],
          constraints: [],
          references: [],
          confidence: 0.90,
          evidence: {
            matchedText: stmt.evidence.matchedText,
            start: stmt.evidence.start,
            end: stmt.evidence.end
          }
        });
      });

      if (actions.length > 0) {
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/actions`,
          value: actions
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
