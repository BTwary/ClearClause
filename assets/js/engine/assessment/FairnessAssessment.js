import { AssessmentContract } from './AssessmentContract.js';

export class FairnessAssessment {
  /**
   * Consumes all findings and actions to evaluate balance.
   * @param {Array<Object>} actions
   * @param {Array<Object>} findings
   * @returns {AssessmentContract}
   */
  evaluate(actions, findings) {
    const fairnessFindings = findings.filter(f => f.category === 'Fairness');
    
    // Very naive deterministic fairness calculation based on actor balance for now.
    // In reality, this would use the fairness findings from the rule engine.
    const actorCounts = {};
    for (const a of actions) {
       if (a.actor) {
         actorCounts[a.actor] = (actorCounts[a.actor] || 0) + 1;
       }
    }

    const actors = Object.keys(actorCounts);
    let severity = 'Neutral';
    let summary = 'The document appears generally balanced based on obligations.';

    if (fairnessFindings.length > 0) {
       severity = fairnessFindings.some(f => f.severity === 'Critical') ? 'Critical' : 'High';
       summary = `Imbalance detected: ${fairnessFindings.map(f => f.type).join(', ')}.`;
    } else if (actors.length > 1) {
       const counts = Object.values(actorCounts);
       const max = Math.max(...counts);
       const min = Math.min(...counts);
       if (max > min * 3) {
          severity = 'High';
          summary = 'One party holds significantly more obligations than the other.';
       }
    }

    const evidence = fairnessFindings.map(f => ({ findingId: f.id, type: f.type }));
    
    return new AssessmentContract('Fairness', severity, summary, evidence, [], 0.9);
  }
}
