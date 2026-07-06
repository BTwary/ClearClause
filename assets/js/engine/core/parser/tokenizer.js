/**
 * @fileoverview tokenizer.js
 * Breaks raw document text into initial un-nested Paragraph nodes.
 * The LegalIRBuilder will take these raw nodes and construct the hierarchical Legal IR.
 */

import { generateFingerprints } from '../utils/hashUtils.js';

export class Tokenizer {
  /**
   * Tokenizes plain text into a flat array of raw LegalNodes.
   * @param {string} text 
   * @returns {import('../types.js').LegalNode[]}
   */
  static tokenize(text) {
    if (!text) return [];

    // Split by multiple newlines (crude paragraph splitting for Phase 1)
    const blocks = text.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    
    return blocks.map((block, index) => {
      const isTitle = block.length < 100 && /^[A-Z0-9\s\.\,\-]+$/.test(block) && !block.includes('\n');
      
      /** @type {import('../types.js').LegalNode} */
      const node = {
        id: `node_${index}`,
        kind: isTitle ? 'Article' : 'Clause', // Initial guess, will be refined by AST builder/classifiers
        parent: null,
        children: [],
        text: block,
        fingerprints: generateFingerprints(block),
        metadata: {}
      };
      
      return node;
    });
  }
}
