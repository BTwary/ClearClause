/**
 * @fileoverview findingEngine.js
 * The overarching Reasoning Engine that evaluates the fully enriched Legal IR against compiled Rule DSLs.
 * Replaces the old regex-based riskEngine and fairness engines.
 */

import { RuleEvaluator } from '../rules/RuleEvaluator.js';

export default {
  id: "findingEngine",
  version: "1.0.0",
  priority: 90, // Runs at the end, after all extraction and enrichment
  dependsOn: ["actionBuilder", "constraintEngine", "entityEngine", "referenceResolver", "deadlineNormalizer"],
  provides: ["findings"],
  invalidates: [],
  cost: 20, // Complex execution
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').ExecutionResult}
   */
  execute: (context) => {
    const { ir, knowledgeProvider } = context;
    
    // In a real system, the KnowledgeProvider wraps the RuleRegistry.
    // For this prototype phase, we pull compiledRules from it.
    const compiledRules = knowledgeProvider.getCompiledRules ? knowledgeProvider.getCompiledRules() : [];
    
    const evaluator = new RuleEvaluator(compiledRules);
    const findings = evaluator.evaluate(ir);

    return {
      patches: [], // Finding engine doesn't mutate IR directly
      findings: findings,
      diagnostics: { 
        warnings: compiledRules.length === 0 ? ["No compiled rules found in KnowledgeProvider"] : [], 
        errors: [], 
        statistics: { rulesEvaluated: compiledRules.length, findingsGenerated: findings.length } 
      }
    };
  }
};
