export const riskRules = [
  { "pattern": "indemnify", "score": 12, "level": "Medium" },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium" },
  { "pattern": "jury trial", "score": 12, "level": "Medium" },
  { "pattern": "sole discretion", "score": 8, "level": "Medium" },

  // Loan-specific
  { "pattern": "confession of judgment", "score": 25, "level": "High" },
  { "pattern": "personal guarantee", "score": 15, "level": "High" },
  { "pattern": "personal guaranty", "score": 15, "level": "High" },
  { "pattern": "acceleration", "score": 12, "level": "Medium" },
  { "pattern": "immediately due and payable", "score": 12, "level": "Medium" },
  { "pattern": "default rate", "score": 10, "level": "Medium" },
  { "pattern": "compound interest", "score": 8, "level": "Medium" },
  { "pattern": "balloon payment", "score": 10, "level": "Medium" },
  { "pattern": "prepayment penalty", "score": 8, "level": "Medium" },
  { "pattern": "late fee", "score": 6, "level": "Low" },
  { "pattern": "security interest", "score": 8, "level": "Medium" },
  { "pattern": "collateral", "score": 6, "level": "Low" },
  { "pattern": "cross-default", "score": 12, "level": "Medium" }
];
