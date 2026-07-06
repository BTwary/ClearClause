export class ExecutiveSummary {
  /**
   * Generates a purely factual, deterministic summary object.
   * @param {Object} ir The Legal IR
   * @param {Array<Object>} findings 
   * @param {Object} riskAssessment 
   * @param {Object} positiveAssessment 
   * @returns {Object} Factual summary dictionary
   */
  evaluate(ir, findings, riskAssessment, positiveAssessment) {
    const criticalFindings = findings.filter(f => f.severity === 'Critical');
    const highFindings = findings.filter(f => f.severity === 'High');
    const mediumFindings = findings.filter(f => f.severity === 'Medium');

    return {
      documentType: ir.metadata?.category || "Unknown Document Type",
      parties: ir.metadata?.parties || [],
      highestRisk: riskAssessment.severity !== 'Low' && riskAssessment.evidence.length > 0 ? riskAssessment.evidence[0].type : "None identified",
      highestPositive: positiveAssessment.severity === 'Positive' && positiveAssessment.evidence.length > 0 ? positiveAssessment.evidence[0].type : "None identified",
      findingCounts: {
        critical: criticalFindings.length,
        high: highFindings.length,
        medium: mediumFindings.length,
        total: findings.length
      }
    };
  }
}
