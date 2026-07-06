/**
 * @fileoverview legalGrammarEngine.js
 * True Legal Grammar Parser. Uses the Lexer to tokenize sentences into Legal Primitives,
 * then parses the token stream to build Canonical Action objects.
 */

import { LegalLexer, TokenType } from '../core/parser/lexer.js';

const lexer = new LegalLexer();

/** @type {import('../core/types.js').Engine} */
export default {
  id: "legalGrammarEngine",
  version: "2.0.0",
  priority: 40,
  dependsOn: ["partyResolver"],
  provides: ["syntaxTree"],
  invalidates: [],
  cost: 10,
  
  /**
   * @param {import('../core/types.js').Context} context
   * @returns {import('../core/types.js').ExecutionResult}
   */
  execute: (context) => {
    const { ir } = context;
    const patches = [];
    
    ir.nodes.forEach(node => {
      const tokens = lexer.tokenize(node.text);
      const syntaxTree = [];

      // Parsing state
      let currentStatement = null;
      let currentState = 'SEEK_MODAL'; // SEEK_MODAL -> CAPTURE_OBJECT -> CAPTURE_CONDITION | CAPTURE_EXCEPTION

      // Temporary buffers
      let subjectBuffer = [];
      let objectBuffer = [];
      let conditionBuffer = [];
      let exceptionBuffer = [];
      let statementStart = 0;

      const flushStatement = (endIndex) => {
        if (currentStatement) {
          if (objectBuffer.length > 0) currentStatement.object = objectBuffer.map(t => t.value).join(' ').trim();
          if (conditionBuffer.length > 0) currentStatement.conditions.push(conditionBuffer.map(t => t.value).join(' ').trim());
          if (exceptionBuffer.length > 0) currentStatement.exceptions.push(exceptionBuffer.map(t => t.value).join(' ').trim());
          
          currentStatement.evidence.end = endIndex;
          currentStatement.evidence.matchedText = node.text.substring(currentStatement.evidence.start, endIndex);
          
          syntaxTree.push(currentStatement);
          currentStatement = null;
          objectBuffer = [];
          conditionBuffer = [];
          exceptionBuffer = [];
          currentState = 'SEEK_MODAL';
        }
      };

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (currentState === 'SEEK_MODAL') {
          if (token.type === TokenType.MODAL) {
            // We found a modal! The preceding TEXT tokens form the subject.
            const subject = subjectBuffer.map(t => t.value).join(' ').trim();
            statementStart = subjectBuffer.length > 0 ? subjectBuffer[0].start : token.start;
            
            // Check next token for the verb
            let verb = null;
            if (i + 1 < tokens.length && tokens[i+1].type === TokenType.ACTION_VERB) {
              verb = tokens[++i].value;
            }

            currentStatement = {
              type: 'Statement',
              subject: subject || null,
              modal: token.value.toLowerCase(),
              verb: verb ? verb.toLowerCase() : null,
              object: null,
              conditions: [],
              exceptions: [],
              evidence: {
                start: statementStart,
                end: 0,
                matchedText: ""
              }
            };

            currentState = 'CAPTURE_OBJECT';
            subjectBuffer = [];
          } else {
            // Accumulate potential subject
            subjectBuffer.push(token);
          }
        } 
        else if (currentState === 'CAPTURE_OBJECT') {
          if (token.type === TokenType.CONDITION_TRIGGER) {
            currentState = 'CAPTURE_CONDITION';
            conditionBuffer.push(token);
          } else if (token.type === TokenType.EXCEPTION_TRIGGER) {
            currentState = 'CAPTURE_EXCEPTION';
            exceptionBuffer.push(token);
          } else if (token.type === TokenType.PUNCTUATION && token.value === '.') {
            flushStatement(token.end);
          } else {
            objectBuffer.push(token);
          }
        }
        else if (currentState === 'CAPTURE_CONDITION') {
          if (token.type === TokenType.EXCEPTION_TRIGGER) {
            currentStatement.conditions.push(conditionBuffer.map(t => t.value).join(' ').trim());
            conditionBuffer = [token];
            currentState = 'CAPTURE_EXCEPTION';
          } else if (token.type === TokenType.PUNCTUATION && token.value === '.') {
            flushStatement(token.end);
          } else {
            conditionBuffer.push(token);
          }
        }
        else if (currentState === 'CAPTURE_EXCEPTION') {
          if (token.type === TokenType.CONDITION_TRIGGER) {
            currentStatement.exceptions.push(exceptionBuffer.map(t => t.value).join(' ').trim());
            exceptionBuffer = [token];
            currentState = 'CAPTURE_CONDITION';
          } else if (token.type === TokenType.PUNCTUATION && token.value === '.') {
            flushStatement(token.end);
          } else {
            exceptionBuffer.push(token);
          }
        }
      }

      // Flush at end of node if not ended by a period
      if (currentStatement && tokens.length > 0) {
        flushStatement(tokens[tokens.length - 1].end);
      }

      if (syntaxTree.length > 0) {
        patches.push({
          op: 'Annotate',
          path: `/nodes/${node.id}/syntaxTree`,
          value: syntaxTree
        });
      }
    });

    return {
      patches,
      findings: [],
      diagnostics: { warnings: [], errors: [], statistics: { nodesVisited: ir.nodes.length } }
    };
  }
};
