/**
 * @fileoverview RuleCompiler.js
 * Validates the JSON DSL and compiles it into a highly optimized executable predicate tree.
 */

export class RuleCompiler {
  
  /**
   * Compiles an entire Rule Pack into executable rules.
   * @param {Object[]} rules - Array of JSON rules
   * @returns {Object[]} Compiled rules
   */
  compilePack(rules) {
    return rules.map(rule => this.compileRule(rule));
  }

  /**
   * Compiles a single JSON rule.
   * @param {Object} rule 
   */
  compileRule(rule) {
    // Schema Validation could happen here.
    if (!rule.id || !rule.when || !rule.then) {
      throw new Error(`Rule ${rule.id || 'UNKNOWN'} is missing required fields.`);
    }

    const predicate = this._compileCondition(rule.when);

    return {
      id: rule.id,
      category: rule.category || "General",
      severity: rule.severity || "Medium",
      requires: rule.requires || [],
      metadata: rule,
      evaluate: (context) => {
         return predicate(context);
      }
    };
  }

  _compileCondition(condition) {
    // Logical Operators
    if (condition.and) {
      const preds = condition.and.map(c => this._compileCondition(c));
      return (ctx) => preds.every(p => p(ctx));
    }
    if (condition.or) {
      const preds = condition.or.map(c => this._compileCondition(c));
      return (ctx) => preds.some(p => p(ctx));
    }
    if (condition.not) {
      const pred = this._compileCondition(condition.not);
      return (ctx) => !pred(ctx);
    }
    if (condition.all) {
      const preds = condition.all.map(c => this._compileCondition(c));
      return (ctx) => preds.every(p => p(ctx));
    }
    if (condition.any) {
      const preds = condition.any.map(c => this._compileCondition(c));
      return (ctx) => preds.some(p => p(ctx));
    }

    // Field-based Operators
    if (condition.field) {
      const field = condition.field;

      // Existence
      if (condition.exists === true) return (ctx) => ctx.resolveField(field).length > 0;
      if (condition.missing === true) return (ctx) => ctx.resolveField(field).length === 0;
      
      // Values
      if (condition.equals !== undefined) {
         return (ctx) => ctx.resolveField(field).includes(condition.equals);
      }
      if (condition.not_equals !== undefined) {
         return (ctx) => !ctx.resolveField(field).includes(condition.not_equals);
      }
      if (condition.contains !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => typeof val === 'string' && val.includes(condition.contains));
      }
      if (condition.starts_with !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => typeof val === 'string' && val.startsWith(condition.starts_with));
      }
      if (condition.ends_with !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => typeof val === 'string' && val.endsWith(condition.ends_with));
      }
      if (condition.in !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => condition.in.includes(val));
      }
      if (condition.greater_than !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => val > condition.greater_than);
      }
      if (condition.less_than !== undefined) {
         return (ctx) => ctx.resolveField(field).some(val => val < condition.less_than);
      }
    }

    // Missing field fallback
    if (condition.missing !== undefined && typeof condition.missing === 'string') {
       return (ctx) => ctx.resolveField(condition.missing).length === 0;
    }

    // Default falback to false if not recognized to prevent false positives
    return () => false;
  }
}
