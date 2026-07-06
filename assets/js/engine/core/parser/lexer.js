/**
 * @fileoverview lexer.js
 * Tokenizes legal sentences into Legal Primitives rather than English words.
 */

export const TokenType = {
  MODAL: 'MODAL',
  ACTION_VERB: 'ACTION_VERB',
  CONDITION_TRIGGER: 'CONDITION_TRIGGER',
  EXCEPTION_TRIGGER: 'EXCEPTION_TRIGGER',
  TEMPORAL_TRIGGER: 'TEMPORAL_TRIGGER',
  NUMBER: 'NUMBER',
  TIME_UNIT: 'TIME_UNIT',
  REFERENCE: 'REFERENCE',
  PUNCTUATION: 'PUNCTUATION',
  TEXT: 'TEXT'
};

const matchers = [
  { type: TokenType.MODAL, regex: /^(shall|may|must|agrees to|reserves the right to|is entitled to)\b/i },
  { type: TokenType.CONDITION_TRIGGER, regex: /^(provided that|if|in the event that|subject to)\b/i },
  { type: TokenType.EXCEPTION_TRIGGER, regex: /^(unless|except where|notwithstanding)\b/i },
  { type: TokenType.TEMPORAL_TRIGGER, regex: /^(within|before|after|no later than|upon)\b/i },
  { type: TokenType.TIME_UNIT, regex: /^(day|month|year|week|hour)s?\b/i },
  { type: TokenType.ACTION_VERB, regex: /^(make payment|pay|terminate|cancel|disclose|indemnify|hold harmless|provide)\b/i },
  { type: TokenType.REFERENCE, regex: /^(Clause|Section|Article)\s+\d+\b/i },
  { type: TokenType.NUMBER, regex: /^(USD|\$)?\s*[\d,]+(\.\d{1,2})?\b/i },
  { type: TokenType.PUNCTUATION, regex: /^[,.;]/ }
];

export class LegalLexer {
  /**
   * Tokenizes a raw string into a stream of Legal Primitive tokens.
   * @param {string} text 
   * @returns {Object[]} Array of tokens
   */
  tokenize(text) {
    const tokens = [];
    let current = 0;
    
    while (current < text.length) {
      const remaining = text.slice(current);
      
      // Skip whitespace
      const wsMatch = remaining.match(/^\s+/);
      if (wsMatch) {
        current += wsMatch[0].length;
        continue;
      }

      let matched = false;

      // Try specific legal primitives
      for (const matcher of matchers) {
        const match = remaining.match(matcher.regex);
        if (match) {
          tokens.push({
            type: matcher.type,
            value: match[0],
            start: current,
            end: current + match[0].length
          });
          current += match[0].length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Fallback to consuming a generic word if no legal primitive matches
        const wordMatch = remaining.match(/^([a-zA-Z0-9_\-"']+)/);
        if (wordMatch) {
          tokens.push({
            type: TokenType.TEXT,
            value: wordMatch[0],
            start: current,
            end: current + wordMatch[0].length
          });
          current += wordMatch[0].length;
        } else {
          // If we can't even match a word, just skip one character to avoid infinite loops
          current++;
        }
      }
    }
    
    return tokens;
  }
}
