export const riskRules = [
  { "pattern": "indemnify", "score": 15, "level": "High" },
  { "pattern": "hold harmless", "score": 15, "level": "High" },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium" },
  { "pattern": "sole discretion", "score": 8, "level": "Medium" },
  { "pattern": "shall not exceed", "score": 10, "level": "Medium" },
  { "pattern": "automatically renew", "score": 8, "level": "Medium" },
  { "pattern": "auto-renew", "score": 8, "level": "Medium" },

  // Service/consulting-specific
  { "pattern": "work made for hire", "score": 10, "level": "Medium" },
  { "pattern": "work for hire", "score": 10, "level": "Medium" },
  { "pattern": "exclusivity", "score": 10, "level": "Medium" },
  { "pattern": "exclusive", "score": 6, "level": "Low" },
  { "pattern": "non-solicitation", "score": 8, "level": "Medium" },
  { "pattern": "non-compete", "score": 12, "level": "Medium" },
  { "pattern": "at any time without notice", "score": 12, "level": "Medium" },
  { "pattern": "sole and exclusive remedy", "score": 10, "level": "Medium" },
  { "pattern": "independent contractor", "score": 4, "level": "Low" }
];
