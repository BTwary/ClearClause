/**
 * @fileoverview inspector.js
 * Developer Inspector utility for tracing Engine Registry execution.
 * Captures events emitted by the EngineRegistry and generates a timeline report.
 */

export class DeveloperInspector {
  /**
   * @param {import('./ir/engineRegistry.js').EngineRegistry} registry
   */
  constructor(registry) {
    this.registry = registry;
    this.timeline = [];
    this.startTime = Date.now();
    this.engineStats = new Map();

    this._attachListeners();
  }

  _attachListeners() {
    this.registry.on('engine:start', (e) => {
      this.timeline.push({ type: 'START', engine: e.engine, iteration: e.iteration, time: Date.now() });
    });

    this.registry.on('patch:applied', (e) => {
      this.timeline.push({ type: 'PATCH', engine: e.engine, count: e.patches, time: Date.now() });
      const stats = this.engineStats.get(e.engine) || { patches: 0, duration: 0 };
      stats.patches += e.patches;
      this.engineStats.set(e.engine, stats);
    });

    this.registry.on('engine:end', (e) => {
      this.timeline.push({ type: 'END', engine: e.engine, result: e.result, time: Date.now() });
      const stats = this.engineStats.get(e.engine) || { patches: 0, duration: 0 };
      stats.duration += e.result.duration;
      
      if (e.result.diagnostics.warnings.length > 0) {
        stats.warnings = e.result.diagnostics.warnings;
      }
      this.engineStats.set(e.engine, stats);
    });
  }

  /**
   * Generates a text-based summary of the execution timeline.
   */
  printReport() {
    const totalDuration = Date.now() - this.startTime;
    console.log("\n==================================================");
    console.log("             DEVELOPER INSPECTOR REPORT           ");
    console.log("==================================================");
    console.log(`Total Execution Time: ${totalDuration}ms\n`);
    
    console.log("ENGINE TIMELINE:");
    let currentEngine = null;
    let engineStart = 0;
    
    this.timeline.forEach(event => {
      if (event.type === 'START') {
        currentEngine = event.engine;
        engineStart = event.time;
        console.log(`  ▶ [${event.engine}] Iteration ${event.iteration}`);
      } else if (event.type === 'PATCH') {
        console.log(`      + Applied ${event.count} patches to IR`);
      } else if (event.type === 'END') {
        const duration = event.time - engineStart;
        console.log(`  ⏹ [${event.engine}] Completed in ${duration}ms`);
        if (event.result.diagnostics.warnings && event.result.diagnostics.warnings.length > 0) {
          console.log(`      ⚠ Warnings: ${event.result.diagnostics.warnings.join(', ')}`);
        }
      }
    });

    console.log("\n==================================================\n");
  }
}
