/**
 * @fileoverview hashUtils
 * Provides hashing functions for generating LegalNode fingerprints.
 * Uses Web Crypto API when available, with a fallback synchronous hash.
 */

/**
 * A fast, synchronous 32-bit integer hash (cyrb53).
 * Used as a synchronous fallback if async SHA-256 is overkill.
 * @param {string} str
 * @param {number} seed
 * @returns {string} Hex string representation
 */
export function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

/**
 * Generates the triple fingerprints for a LegalNode.
 * @param {string} text 
 * @returns {{raw: string, structural: string, canonical: string}}
 */
export function generateFingerprints(text) {
  // 1. Raw Hash: Exact bytes
  const raw = cyrb53(text, 1);

  // 2. Structural Hash: Whitespace, formatting, punctuation, and leading numbers removed
  // e.g. "1.2  The Receiving Party..." -> "thereceivingparty..."
  const structuralText = text
    .replace(/^[\d\.\(\)a-zA-Z]+\s+/, '') // Remove leading list markers like "1.2 " or "(a) "
    .replace(/[\s\p{P}]+/gu, '') // Remove whitespace and punctuation
    .toLowerCase();
  const structural = cyrb53(structuralText, 2);

  // 3. Canonical Hash: (Placeholder for Phase 2 ontology normalization)
  // For now, it matches structural until we map words to ontology IDs.
  const canonical = cyrb53(structuralText, 3);

  return { raw, structural, canonical };
}
