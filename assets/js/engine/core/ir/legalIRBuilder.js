/**
 * @fileoverview legalIRBuilder.js
 * Manages the Immutable Legal IR. Provides methods to build the initial tree
 * and safely apply JSON-Patch style operations transactionally.
 */

import { Tokenizer } from '../parser/tokenizer.js';

export class LegalIRBuilder {
  constructor() {
    /** @type {import('../types.js').DocumentIR} */
    this.document = {
      metadata: {},
      nodes: [],
      edges: [],
      findings: [],
      annotations: {}
    };
  }

  /**
   * Initializes the IR from raw text.
   * In Phase 1, we just do a flat structure. A more advanced builder
   * would parse "1.1" numbers and nest nodes accordingly.
   * @param {string} text 
   */
  buildFromText(text) {
    const nodes = Tokenizer.tokenize(text);
    this.document.nodes = [...nodes];
    return this.document;
  }

  /**
   * Applies a PatchSet transactionally.
   * @param {import('../types.js').PatchSet} patchSet 
   * @returns {boolean} True if successful, false if rollback occurred
   */
  applyPatchSet(patchSet) {
    // Deep clone state for rollback
    const snapshot = JSON.stringify(this.document);
    
    try {
      for (const patch of patchSet.patches) {
        this._applyPatch(patch);
      }
      return true;
    } catch (err) {
      console.error(`PatchSet from engine ${patchSet.engine} failed. Rolling back.`, err);
      if (patchSet.rollback) {
        try { patchSet.rollback(); } catch(e) {}
      }
      // Restore IR state
      this.document = JSON.parse(snapshot);
      return false;
    }
  }

  /**
   * Internal dispatcher for a single patch.
   * @param {import('../types.js').Patch} patch 
   */
  _applyPatch(patch) {
    switch (patch.op) {
      case 'Add':
      case 'Replace':
      case 'Annotate':
        this._mutatePath(patch.path, patch.value, patch.op);
        break;
      case 'Remove':
        this._mutatePath(patch.path, null, patch.op);
        break;
      case 'Link':
        this.document.edges.push({
          id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          from: patch.from,
          to: patch.to,
          relation: patch.relation
        });
        break;
      case 'Invalidate':
        // Handled at the EngineRegistry level, but tracked here if needed
        break;
      default:
        throw new Error(`Unsupported patch operation: ${patch.op}`);
    }
  }

  /**
   * Mutates a deep path in the document (e.g. '/nodes/node_1/metadata/category')
   * @param {string} path 
   * @param {any} value 
   * @param {string} op 
   */
  _mutatePath(path, value, op) {
    const parts = path.split('/').filter(Boolean);
    let current = this.document;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      // Handle array indices
      if (Array.isArray(current)) {
        const idx = current.findIndex(item => item.id === part);
        if (idx !== -1) current = current[idx];
        else throw new Error(`Path element not found: ${part}`);
      } else {
        if (!(part in current)) current[part] = {};
        current = current[part];
      }
    }
    
    const lastPart = parts[parts.length - 1];
    if (op === 'Remove') {
      delete current[lastPart];
    } else if (op === 'Annotate') {
      // Merge for Annotate
      if (typeof current[lastPart] === 'object' && current[lastPart] !== null) {
        Object.assign(current[lastPart], value);
      } else {
        current[lastPart] = value;
      }
    } else {
      current[lastPart] = value; // Add/Replace
    }
  }
}
