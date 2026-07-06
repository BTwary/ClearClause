/**
 * @fileoverview AssessmentContract.js
 * The canonical interface for all Trothix Assessments.
 * Ensures the Risk, Fairness, Completeness, and Positive assessments all behave identically.
 */

export class AssessmentContract {
  /**
   * @param {string} category 
   * @param {string} severity (e.g., 'Critical', 'High', 'Medium', 'Low', 'Neutral', 'Positive')
   * @param {string} summary A deterministic factual summary (not AI generated).
   * @param {Array<Object>} evidence Pointers to the Findings or IR actions that triggered this.
   * @param {Array<string>} recommendations Deterministic standard suggestions.
   * @param {number} confidence Between 0 and 1.
   */
  constructor(category, severity, summary, evidence = [], recommendations = [], confidence = 1.0) {
    this.category = category;
    this.severity = severity;
    this.summary = summary;
    this.evidence = evidence;
    this.recommendations = recommendations;
    this.confidence = confidence;
  }
}
