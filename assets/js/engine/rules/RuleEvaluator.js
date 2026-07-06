/**
 * @fileoverview RuleEvaluator.js
 * Executes compiled rules against the Legal IR safely.
 */

import { RuleContext } from './RuleContext.js';

export class RuleEvaluator {
  /**
   * @param {Object[]} compiledRules - From RuleRegistry
   */
  constructor(compiledRules) {
    this.rules = compiledRules;
  }

  /**
   * Evaluates all rules against the provided Legal IR Document.
   * @param {Object} ir 
   * @returns {Object[]} Array of Findings
   */
  evaluate(ir) {
    const context = new RuleContext(ir);
    const findings = [];
    
    // In Phase 3, we execute sequentially. Later this can be parallelized.
    for (const rule of this.rules) {
       try {
          const isTriggered = rule.evaluate(context);
          if (isTriggered) {
             findings.push({
               id: `FINDING_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
               type: rule.metadata.then ? rule.metadata.then.trigger : rule.id,
               category: rule.category,
               severity: rule.severity,
               confidence: rule.metadata.confidence || 1.0,
               rule: rule.id,
               node: null // In the future, pinpoint exact node by evaluating locally instead of globally
             });
          }
       } catch (err) {
          console.error(`[RuleEvaluator] Error evaluating rule ${rule.id}:`, err);
       }
    }
    
    return findings;
  }
}
