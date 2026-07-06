export const riskRules = [
  // Shared/general risks that matter for employment specifically
  { "pattern": "indemnify", "score": 15, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
  { "pattern": "hold harmless", "score": 15, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium", "explanation": "This forces you to resolve disputes privately out of court, removing your right to sue or have a trial." },
  { "pattern": "jury trial", "score": 12, "level": "Medium", "explanation": "This waives your constitutional right to have a jury hear a dispute." },
  { "pattern": "class action", "score": 12, "level": "Medium", "explanation": "This prevents you from joining with others to sue the company collectively." },
  { "pattern": "perpetual", "score": 10, "level": "Medium", "explanation": "This agreement or right lasts forever with no specific end date." },
  { "pattern": "sole discretion", "score": 8, "level": "Medium", "explanation": "This gives the other party absolute power to make decisions without consulting you." },

  // Employment-specific
  { "pattern": "non-compete", "score": 15, "level": "High", "explanation": "This restricts you from working for competitors or starting a competing business." },
  { "pattern": "shall not compete", "score": 15, "level": "High", "explanation": "This restricts you from working for competitors or starting a competing business." },
  { "pattern": "non-solicitation", "score": 10, "level": "Medium", "explanation": "This prevents you from poaching the company's employees or clients." },
  { "pattern": "restrictive covenant", "score": 10, "level": "Medium", "explanation": "This places legally binding restrictions on your future actions or employment." },
  { "pattern": "at will", "score": 5, "level": "Low", "explanation": "You can be fired at any time, for any legal reason, without warning." },
  { "pattern": "at-will", "score": 5, "level": "Low", "explanation": "You can be fired at any time, for any legal reason, without warning." },
  { "pattern": "without notice", "score": 12, "level": "Medium", "explanation": "The other party can take severe actions (like termination) without warning you." },
  { "pattern": "without cause", "score": 8, "level": "Medium", "explanation": "The other party can end this agreement or fire you without needing a specific reason." },
  { "pattern": "work made for hire", "score": 8, "level": "Medium", "explanation": "The company automatically owns all intellectual property you create during your employment." },
  { "pattern": "work for hire", "score": 8, "level": "Medium", "explanation": "The company automatically owns all intellectual property you create during your employment." },
  { "pattern": "assign all right, title", "score": 10, "level": "Medium", "explanation": "You are giving away all ownership rights to the specified property or work." },
  { "pattern": "garden leave", "score": 6, "level": "Low", "explanation": "The company can pay you not to work during your notice period to keep you away from competitors." },
  { "pattern": "forfeiture", "score": 10, "level": "Medium", "explanation": "You risk losing assets, equity, or compensation under certain conditions." },
  { "pattern": "clawback", "score": 10, "level": "Medium", "explanation": "The company has the right to demand you return money or equity already paid to you." }
];
