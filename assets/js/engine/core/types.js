/**
 * @fileoverview Centralized Types & Interfaces for the Trothix Deterministic Legal Analysis Engine
 * 
 * This file contains JSDoc type definitions that serve as the strict contracts
 * for the Legal IR, Engine Registry, Patch System, and Findings.
 */

/**
 * @typedef {Object} LegalNode
 * @property {string} id - Unique identifier for the node (e.g., 'node_1')
 * @property {'Clause'|'Section'|'Article'|'Definition'|'Schedule'|'Appendix'|'Table'|'Signature'|'Paragraph'} kind - The structural kind of the node
 * @property {string|null} parent - ID of the parent node
 * @property {string[]} children - IDs of child nodes
 * @property {string} text - The raw text content of the node
 * @property {Object} fingerprints - The triple hashes of the node
 * @property {string} fingerprints.raw - Exact bytes hash (detects any character change)
 * @property {string} fingerprints.structural - Formatting and whitespace removed
 * @property {string} fingerprints.canonical - Normalized via ontology mapping
 * @property {Object} metadata - Arbitrary metadata attached to the node
 */

/**
 * @typedef {Object} Edge
 * @property {string} id - Unique identifier for the edge
 * @property {string} from - Source node ID
 * @property {string} to - Target node ID
 * @property {'references'|'defines'|'modifies'|'excepts'} relation - Type of relationship
 */

/**
 * @typedef {Object} TraceEvidence
 * @property {string} matchedText - The exact substring matched
 * @property {number} start - Character start index
 * @property {number} end - Character end index
 */

/**
 * @typedef {Object} Action
 * @property {string} id - Unique action ID
 * @property {string|null} actor - Canonical Party ID
 * @property {string|null} modal - Raw modal (shall, may, must)
 * @property {string|null} verb - Canonical action verb (e.g., ACTION_PAY)
 * @property {string|null} object - Canonical Object or Def ID
 * @property {string|null} recipient - Canonical Party ID
 * @property {string[]} conditions - Array of raw condition strings
 * @property {string[]} exceptions - Array of raw exception strings
 * @property {Object[]} deadlines - Array of structured deadlines
 * @property {Constraint[]} constraints - Array of structured constraints
 * @property {string[]} references - Array of resolved node IDs
 * @property {number} confidence - 0.0 to 1.0
 * @property {TraceEvidence} evidence - Extraction traceability
 */

/**
 * @typedef {Object} Constraint
 * @property {'money'|'duration'|'percentage'|'count'} type
 * @property {number} value
 * @property {string} [unit]
 * @property {string} [currency]
 */

/**
 * @typedef {Object} DocumentIR
 * @property {Object} metadata - Document-level metadata
 * @property {LegalNode[]} nodes - All nodes in the document
 * @property {Edge[]} edges - All relationships between nodes
 * @property {Finding[]} findings - All findings emitted by engines
 * @property {Object} annotations - Arbitrary annotations
 */

/**
 * @typedef {Object} Patch
 * @property {'Add'|'Replace'|'Remove'|'Link'|'Annotate'|'Invalidate'} op - The patch operation
 * @property {string} path - Target path (e.g., '/nodes/node_1/metadata/category')
 * @property {any} [value] - Value to apply (for Add, Replace, Annotate)
 * @property {string} [from] - For 'Link' operations
 * @property {string} [to] - For 'Link' operations
 * @property {string} [relation] - For 'Link' operations
 */

/**
 * @typedef {Object} PatchSet
 * @property {string} engine - ID of the engine generating the patch set
 * @property {string} version - Version of the engine
 * @property {number} timestamp - Unix timestamp
 * @property {Patch[]} patches - Array of patches to apply transactionally
 * @property {function} [rollback] - Optional rollback logic
 */

/**
 * @typedef {Object} Context
 * @property {DocumentIR} ir - The current state of the Legal IR
 * @property {any} knowledgeProvider - Interface to query rules and ontology
 * @property {Object} config - System configuration and feature flags
 * @property {Object} statistics - Execution metrics
 * @property {any} logger - Logger interface
 * @property {any} cache - Engine cache interface
 */

/**
 * @typedef {Object} EngineDiagnostics
 * @property {string[]} warnings
 * @property {string[]} errors
 * @property {Object} statistics
 */

/**
 * @typedef {Object} ExecutionResult
 * @property {Patch[]} patches - Array of IR mutations
 * @property {Object[]} findings - Array of Findings (e.g. Risk, Fairness)
 * @property {Object} metrics - Key-value performance/business metrics
 * @property {Object[]} logs - Engine-specific debug logs
 * @property {Object[]} events - System events to broadcast
 * @property {boolean} cacheHit - True if result was pulled from cache
 * @property {number} duration - Execution time in milliseconds
 * @property {boolean} rerun - True if the engine requests another pass
 * @property {EngineDiagnostics} diagnostics - Warnings, errors, and stats
 */

/**
 * @typedef {Object} Engine
 * @property {string} id - Unique plugin identifier
 * @property {string} version - Semantic version
 * @property {number} priority - Execution priority (lower is earlier)
 * @property {string[]} dependsOn - Array of engine IDs this depends on
 * @property {string[]} provides - Array of data keys this engine provides
 * @property {string[]} invalidates - Array of engine IDs to re-run if this patches
 * @property {number} cost - Estimated computational cost (1-10)
 * @property {(context: Context) => ExecutionResult | Promise<ExecutionResult>} execute - The main logic block
 */

/**
 * @typedef {Object} Rule
 * @property {string} id - Rule identifier (e.g., 'RISK_101')
 * @property {string} priority - 'critical' | 'high' | 'medium' | 'low'
 * @property {number} score - Rule weight
 * @property {string} severity - Severity label
 * @property {any[]} when - Rule DSL conditions
 */

/**
 * @typedef {Object} Finding
 * @property {string} id - Unique finding ID
 * @property {string} type - e.g., 'Risk', 'Completeness', 'Conflict'
 * @property {string} severity - Severity label
 * @property {number} confidence - 0.0 to 1.0 confidence score
 * @property {string} reason - Explainability text for why this was flagged
 * @property {string|null} nodeId - The associated node ID
 * @property {string|null} partyId - The associated party ID
 * @property {string|null} ruleId - The triggered rule ID
 * @property {string} title - Short title for UI
 * @property {string} description - Detailed description
 * @property {Object[]} evidence - Traceability evidence (e.g., matched phrases)
 * @property {string} recommendation - Actionable advice
 */

/**
 * @typedef {Object} Candidate
 * @property {string} id - Canonical ID (e.g., 'TERM_001')
 * @property {number} score - Confidence score (0.0 to 1.0)
 */

export {};
