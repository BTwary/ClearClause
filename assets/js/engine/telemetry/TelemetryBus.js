/**
 * @fileoverview TelemetryBus.js
 * Central event router that multiplexes events to all registered TelemetryProviders.
 */

export class TelemetryBus {
  constructor() {
    this.providers = [];
  }

  /**
   * Registers a new telemetry provider (e.g. Console, Supabase).
   * @param {import('./TelemetryProvider.js').TelemetryProvider} provider 
   */
  registerProvider(provider) {
    this.providers.push(provider);
  }

  async logAnalysisStarted(analysisId, metadata) {
    await Promise.all(this.providers.map(p => p.logAnalysisStarted(analysisId, metadata).catch(e => console.error(e))));
  }

  async logEngineRun(analysisId, engineId, executionResult) {
    await Promise.all(this.providers.map(p => p.logEngineRun(analysisId, engineId, executionResult).catch(e => console.error(e))));
  }

  async logFinding(analysisId, finding) {
    await Promise.all(this.providers.map(p => p.logFinding(analysisId, finding).catch(e => console.error(e))));
  }

  async logAnalysisCompleted(analysisId, summary) {
    await Promise.all(this.providers.map(p => p.logAnalysisCompleted(analysisId, summary).catch(e => console.error(e))));
  }
}
