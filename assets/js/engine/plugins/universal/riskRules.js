export const riskRules = [
  { "pattern": "indemnify", "score": 20, "level": "High" },
  { "pattern": "hold harmless", "score": 20, "level": "High" },
  { "pattern": "injunct", "score": 10, "level": "Medium" },
  { "pattern": "equitable relief", "score": 10, "level": "Medium" },

  // Dispute resolution / access-to-court waivers
  { "pattern": "binding arbitration", "score": 12, "level": "Medium" },
  { "pattern": "jury trial", "score": 12, "level": "Medium" },
  { "pattern": "class action", "score": 12, "level": "Medium" },

  // IP / licensing
  { "pattern": "perpetual", "score": 15, "level": "High" },
  { "pattern": "irrevocable", "score": 10, "level": "Medium" },

  // Liability
  { "pattern": "shall not exceed", "score": 10, "level": "Medium" },
  { "pattern": "liquidated damages", "score": 10, "level": "Medium" },
  { "pattern": "no liability", "score": 10, "level": "Medium" },

  // One-sided control / discretion
  { "pattern": "sole discretion", "score": 8, "level": "Medium" },
  { "pattern": "at any time without notice", "score": 12, "level": "Medium" },

  // Renewal / lock-in
  { "pattern": "automatically renew", "score": 8, "level": "Medium" },
  { "pattern": "auto-renew", "score": 8, "level": "Medium" },

  // Warranty
  { "pattern": "as is", "score": 5, "level": "Low" },
  { "pattern": "without warranty", "score": 8, "level": "Low" },
  { "pattern": "disclaims all warranties", "score": 8, "level": "Low" },

  // Restrictive covenants
  { "pattern": "non-compete", "score": 10, "level": "Medium" },
  { "pattern": "shall not compete", "score": 10, "level": "Medium" },

  // Broad/vague scope language
  { "pattern": "any and all information", "score": 8, "level": "Low" },
  { "pattern": "information whatsoever", "score": 8, "level": "Low" }
];