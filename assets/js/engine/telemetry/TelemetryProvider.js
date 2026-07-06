/**
 * @fileoverview TelemetryProvider.js
 * Abstract interface for all telemetry providers (Console, Supabase, PostHog, etc.)
 */

export class TelemetryProvider {
  /**
   * Called when a full document analysis begins.
   */
  async logAnalysisStarted(analysisId, metadata) { throw new Error("Not implemented"); }

  /**
   * Called when an engine finishes execution.
   */
  async logEngineRun(analysisId, engineId, executionResult) { throw new Error("Not implemented"); }

  /**
   * Called when the Finding Engine emits a finding.
   */
  async logFinding(analysisId, finding) { throw new Error("Not implemented"); }

  /**
   * Called when the full analysis completes.
   */
  async logAnalysisCompleted(analysisId, summary) { throw new Error("Not implemented"); }
}
