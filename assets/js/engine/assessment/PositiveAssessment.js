import { AssessmentContract } from './AssessmentContract.js';

export class PositiveAssessment {
  evaluate(findings) {
    const positiveFindings = findings.filter(f => f.category === 'Positive');
    
    if (positiveFindings.length === 0) {
      return new AssessmentContract('Positive', 'Neutral', 'No specific strong protections detected.', [], [], 1.0);
    }

    const strengths = positiveFindings.map(f => f.type);
    const summary = `Detected ${positiveFindings.length} strong protections: ${strengths.join(', ')}.`;
    const evidence = positiveFindings.map(f => ({ findingId: f.id, type: f.type }));

    return new AssessmentContract('Positive', 'Positive', summary, evidence, [], 0.95);
  }
}
