import { AssessmentContract } from './AssessmentContract.js';

export class RiskAssessment {
  /**
   * Consumes all findings and produces a singular Risk Assessment.
   * @param {Array<Object>} findings
   * @returns {AssessmentContract}
   */
  evaluate(findings) {
    const riskFindings = findings.filter(f => f.category === 'Risk');
    
    if (riskFindings.length === 0) {
      return new AssessmentContract('Risk', 'Low', 'No significant contractual risks were identified.', [], [], 1.0);
    }

    let maxSeverity = 'Low';
    if (riskFindings.some(f => f.severity === 'Critical')) maxSeverity = 'Critical';
    else if (riskFindings.some(f => f.severity === 'High')) maxSeverity = 'High';
    else if (riskFindings.some(f => f.severity === 'Medium')) maxSeverity = 'Medium';

    const evidence = riskFindings.map(f => ({
      findingId: f.id,
      type: f.type,
      rule: f.rule,
      severity: f.severity
    }));

    // Deterministic summary generation
    const findingTypes = [...new Set(riskFindings.map(f => f.type))];
    const summary = `Detected ${riskFindings.length} risk(s) related to: ${findingTypes.join(', ')}.`;

    // Mock deterministic recommendations
    const recommendations = riskFindings.map(f => `Review ${f.type} clause for excessive exposure.`);

    return new AssessmentContract('Risk', maxSeverity, summary, evidence, recommendations, 1.0);
  }
}
