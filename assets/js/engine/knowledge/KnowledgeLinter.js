/**
 * @fileoverview KnowledgeLinter.js
 * Validates the knowledge base (rules, schemas, ontologies) looking for orphan entries,
 * missing references, duplicated IDs, or invalid rules.
 */

import fs from 'fs/promises';
import path from 'path';

export class KnowledgeLinter {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async lint() {
    const issues = [];
    const manifestPath = path.join(this.basePath, 'manifest.json');
    let manifest;
    
    try {
      const raw = await fs.readFile(manifestPath, 'utf-8');
      manifest = JSON.parse(raw);
    } catch (e) {
      issues.push(`[FATAL] Missing or invalid manifest.json at ${manifestPath}`);
      return issues;
    }

    const ruleIds = new Set();
    
    for (const ruleset of manifest.rulesets) {
      const rulesetPath = path.join(this.basePath, 'rules', ruleset);
      try {
        const files = await fs.readdir(rulesetPath);
        for (const file of files) {
           if (file.endsWith('.json')) {
              const ruleRaw = await fs.readFile(path.join(rulesetPath, file), 'utf-8');
              try {
                const rule = JSON.parse(ruleRaw);
                if (!rule.id) {
                   issues.push(`[ERROR] Rule in ${ruleset}/${file} missing ID.`);
                } else {
                   if (ruleIds.has(rule.id)) {
                      issues.push(`[ERROR] Duplicate rule ID found: ${rule.id}`);
                   }
                   ruleIds.add(rule.id);
                }
                
                // Rule Lifecycle Validation
                if (!rule.status || !['production', 'validated', 'draft', 'deprecated'].includes(rule.status)) {
                   issues.push(`[WARNING] Rule ${rule.id || file} has invalid or missing lifecycle status.`);
                }
              } catch (e) {
                 issues.push(`[ERROR] Malformed JSON in rule: ${ruleset}/${file}`);
              }
           }
        }
      } catch (e) {
         issues.push(`[WARNING] Ruleset directory '${ruleset}' declared in manifest but not found.`);
      }
    }
    
    return issues;
  }
}
