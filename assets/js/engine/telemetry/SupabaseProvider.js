/**
 * @fileoverview SupabaseProvider.js
 * Implements the TelemetryProvider interface for production telemetry logging to Supabase.
 */

import { TelemetryProvider } from './TelemetryProvider.js';

export class SupabaseProvider extends TelemetryProvider {
  constructor(supabaseClient) {
    super();
    this.supabase = supabaseClient;
  }

  async logAnalysisStarted(analysisId, metadata) {
    if (!this.supabase) return;
    try {
      await this.supabase.from('analyses').insert({
        id: analysisId,
        document_hash: metadata.documentHash || null,
        document_type: metadata.documentType || 'Unknown',
        engine_version: metadata.engineVersion || '1.0.0',
        knowledge_version: metadata.knowledgeVersion || '1.0.0',
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("[Telemetry:Supabase] Error logging analysis start", err);
    }
  }

  async logEngineRun(analysisId, engineId, executionResult) {
    if (!this.supabase) return;
    try {
      await this.supabase.from('engine_runs').insert({
        analysis_id: analysisId,
        engine: engineId,
        duration: executionResult.duration || 0,
        cache_hit: executionResult.cacheHit || false,
        rerun: executionResult.rerun || false,
        nodes_visited: executionResult.diagnostics?.statistics?.nodesVisited || 0,
        patches: executionResult.patches || [],
        diagnostics: executionResult.diagnostics || {}
      });
    } catch (err) {
      console.error("[Telemetry:Supabase] Error logging engine run", err);
    }
  }

  async logFinding(analysisId, finding) {
    if (!this.supabase) return;
    try {
      await this.supabase.from('findings').insert({
        analysis_id: analysisId,
        finding_type: finding.type,
        severity: finding.severity,
        confidence: finding.confidence,
        rule: finding.rule,
        node: finding.node
      });
    } catch (err) {
      console.error("[Telemetry:Supabase] Error logging finding", err);
    }
  }

  async logAnalysisCompleted(analysisId, summary) {
    if (!this.supabase) return;
    try {
      await this.supabase.from('analyses').update({
        analysis_duration: summary.duration
      }).eq('id', analysisId);
    } catch (err) {
      console.error("[Telemetry:Supabase] Error logging analysis completion", err);
    }
  }
}
