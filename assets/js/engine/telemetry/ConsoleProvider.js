/**
 * @fileoverview ConsoleProvider.js
 * Implements the TelemetryProvider interface for local development debugging.
 */

import { TelemetryProvider } from './TelemetryProvider.js';

export class ConsoleProvider extends TelemetryProvider {
  async logAnalysisStarted(analysisId, metadata) {
    console.log(`[Telemetry:Console] Analysis Started: ${analysisId}`, metadata);
  }

  async logEngineRun(analysisId, engineId, executionResult) {
    console.log(`[Telemetry:Console] Engine Run: ${engineId} (${executionResult.duration}ms, Patches: ${executionResult.patches.length})`);
    if (executionResult.diagnostics?.warnings?.length > 0) {
      console.warn(`[Telemetry:Console]   Warnings:`, executionResult.diagnostics.warnings);
    }
  }

  async logFinding(analysisId, finding) {
    console.log(`[Telemetry:Console] Finding Emitted: [${finding.severity}] ${finding.type} (Rule: ${finding.rule})`);
  }

  async logAnalysisCompleted(analysisId, summary) {
    console.log(`[Telemetry:Console] Analysis Completed: ${analysisId} (Duration: ${summary.duration}ms)`);
  }
}
