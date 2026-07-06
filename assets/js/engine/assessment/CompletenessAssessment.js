import { AssessmentContract } from './AssessmentContract.js';

export class CompletenessAssessment {
  evaluate(findings) {
    const completenessFindings = findings.filter(f => f.category === 'Completeness');
    
    if (completenessFindings.length === 0) {
      return new AssessmentContract('Completeness', 'Neutral', 'Document contains all expected standard provisions.', [], [], 1.0);
    }

    const missingItems = completenessFindings.map(f => f.type);
    const summary = `Missing recommended clauses: ${missingItems.join(', ')}.`;
    const evidence = completenessFindings.map(f => ({ findingId: f.id, type: f.type }));

    return new AssessmentContract('Completeness', 'Medium', summary, evidence, missingItems.map(m => `Insert ${m} clause.`), 0.95);
  }
}
