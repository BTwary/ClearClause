/**
 * @fileoverview engineRegistry.js
 * Dependency-driven orchestrator for Legal Analysis Engines.
 * Executes engines in the correct order based on their dependsOn/provides contracts,
 * applying their PatchSets to the LegalIR immutably.
 */

export class EngineRegistry {
  /**
   * @param {import('./legalIRBuilder.js').LegalIRBuilder} irBuilder 
   * @param {import('../../knowledge/KnowledgeProvider.js').KnowledgeProvider} knowledgeProvider 
   */
  constructor(irBuilder, knowledgeProvider) {
    this.irBuilder = irBuilder;
    this.knowledgeProvider = knowledgeProvider;
    
    /** @type {Map<string, import('../types.js').Engine>} */
    this.engines = new Map();
    
    // Simple event bus
    this.listeners = {};
    
    // Mock cache for Phase 1
    this.cache = {
      get: (key) => null,
      set: (key, value) => {}
    };
  }

  /**
   * Registers a new engine plugin.
   * @param {import('../types.js').Engine} engine 
   */
  register(engine) {
    this.engines.set(engine.id, engine);
  }

  /**
   * Subscribes to registry events (engine:start, engine:end, patch:applied)
   */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  /**
   * Builds execution order using Kahn's algorithm for topological sorting.
   * @returns {string[]} Ordered array of engine IDs
   */
  _buildExecutionPlan() {
    const inDegree = new Map();
    const adj = new Map();
    
    // Initialize
    for (const [id] of this.engines) {
      inDegree.set(id, 0);
      adj.set(id, []);
    }
    
    // Build graph based on dependsOn
    for (const [id, engine] of this.engines) {
      if (engine.dependsOn) {
        for (const dep of engine.dependsOn) {
          if (this.engines.has(dep)) {
            adj.get(dep).push(id);
            inDegree.set(id, inDegree.get(id) + 1);
          }
        }
      }
    }
    
    const queue = [];
    for (const [id, degree] of inDegree) {
      if (degree === 0) queue.push(id);
    }
    
    const order = [];
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);
      
      for (const neighbor of adj.get(current)) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    if (order.length !== this.engines.size) {
      throw new Error("Cycle detected in Engine dependencies!");
    }
    
    return order;
  }

  /**
   * Executes all registered engines in dependency order.
   * Re-evaluates if an engine emits an 'Invalidate' patch.
   */
  async run() {
    const plan = this._buildExecutionPlan();
    
    /** @type {import('../types.js').Context} */
    const context = {
      ir: this.irBuilder.document,
      knowledgeProvider: this.knowledgeProvider,
      config: { features: {} },
      statistics: { startTime: Date.now() },
      logger: { log: console.log, warn: console.warn, error: console.error },
      cache: this.cache
    };

    let stabilized = false;
    let iteration = 0;
    const MAX_ITERATIONS = 3; // Prevent infinite invalidation loops

    while (!stabilized && iteration < MAX_ITERATIONS) {
      stabilized = true;
      iteration++;
      
      for (const engineId of plan) {
        const engine = this.engines.get(engineId);
        
        this.emit('engine:start', { engine: engineId, iteration });
        
        try {
          const startTime = Date.now();
          const result = await engine.execute(context);
          const duration = Date.now() - startTime;
          
          // Ensure defaults for the ExecutionResult
          const executionResult = {
            patches: result.patches || [],
            findings: result.findings || [],
            metrics: result.metrics || {},
            logs: result.logs || [],
            events: result.events || [],
            cacheHit: result.cacheHit || false,
            duration: result.duration || duration,
            rerun: result.rerun || false,
            diagnostics: result.diagnostics || { warnings: [], errors: [], statistics: {} }
          };

          if (executionResult.patches.length > 0) {
            // Re-wrap patches into a PatchSet for the IRBuilder for backward compatibility
            const patchSet = {
              engine: engineId,
              version: engine.version,
              timestamp: Date.now(),
              patches: executionResult.patches
            };
            
            const success = this.irBuilder.applyPatchSet(patchSet);
            if (success) {
              this.emit('patch:applied', { engine: engineId, patches: patchSet.patches.length });
              
              // Check for invalidations
              if (patchSet.patches.some(p => p.op === 'Invalidate')) {
                stabilized = false;
              }
            }
          }

          // Emit findings if any
          if (executionResult.findings.length > 0) {
            this.emit('findings:emitted', { engine: engineId, findings: executionResult.findings });
            // In the future, attach these findings to the IR Document directly.
            if (!this.irBuilder.document.findings) this.irBuilder.document.findings = [];
            this.irBuilder.document.findings.push(...executionResult.findings);
          }
          
          // Emit full execution result for logging/telemetry
          this.emit('engine:end', { engine: engineId, result: executionResult });

          if (executionResult.rerun) {
            stabilized = false;
          }

        } catch (err) {
          this.emit('engine:error', { engine: engineId, error: err });
          console.error(`Engine ${engineId} failed:`, err);
        }
      }
    }
    
    this.emit('completed', { iterations: iteration });
    return this.irBuilder.document;
  }
}
