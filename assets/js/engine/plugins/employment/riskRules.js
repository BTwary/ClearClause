export const riskRules = [
  // Shared/general risks that matter for employment specifically
  { "pattern": "indemnify", "score": 15, "level": "High" },
  { "pattern": "hold harmless", "score": 15, "level": "High" },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium" },
  { "pattern": "jury trial", "score": 12, "level": "Medium" },
  { "pattern": "class action", "score": 12, "level": "Medium" },
  { "pattern": "perpetual", "score": 10, "level": "Medium" },
  { "pattern": "sole discretion", "score": 8, "level": "Medium" },

  // Employment-specific
  { "pattern": "non-compete", "score": 15, "level": "High" },
  { "pattern": "shall not compete", "score": 15, "level": "High" },
  { "pattern": "non-solicitation", "score": 10, "level": "Medium" },
  { "pattern": "restrictive covenant", "score": 10, "level": "Medium" },
  { "pattern": "at will", "score": 5, "level": "Low" },
  { "pattern": "at-will", "score": 5, "level": "Low" },
  { "pattern": "without notice", "score": 12, "level": "Medium" },
  { "pattern": "without cause", "score": 8, "level": "Medium" },
  { "pattern": "work made for hire", "score": 8, "level": "Medium" },
  { "pattern": "work for hire", "score": 8, "level": "Medium" },
  { "pattern": "assign all right, title", "score": 10, "level": "Medium" },
  { "pattern": "garden leave", "score": 6, "level": "Low" },
  { "pattern": "forfeiture", "score": 10, "level": "Medium" },
  { "pattern": "clawback", "score": 10, "level": "Medium" }
];
