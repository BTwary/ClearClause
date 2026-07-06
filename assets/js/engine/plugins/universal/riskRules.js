export const riskRules = [
  { "pattern": "indemnify", "score": 20, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
  { "pattern": "hold harmless", "score": 20, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
  { "pattern": "injunct", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek an immediate court order to stop you from doing something." },
  { "pattern": "equitable relief", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek non-financial court remedies against you." },

  // Dispute resolution / access-to-court waivers
  { "pattern": "binding arbitration", "score": 12, "level": "Medium", "explanation": "This forces you to resolve disputes privately out of court, removing your right to sue or have a trial." },
  { "pattern": "jury trial", "score": 12, "level": "Medium", "explanation": "This waives your constitutional right to have a jury hear a dispute." },
  { "pattern": "class action", "score": 12, "level": "Medium", "explanation": "This prevents you from joining with others to sue the company collectively." },

  // IP / licensing
  { "pattern": "perpetual", "score": 15, "level": "High", "explanation": "This agreement or right lasts forever with no specific end date." },
  { "pattern": "irrevocable", "score": 10, "level": "Medium", "explanation": "Contains the legal term 'irrevocable' which may pose a risk." },

  // Liability
  { "pattern": "shall not exceed", "score": 10, "level": "Medium", "explanation": "This places a hard cap on liabilities, damages, or obligations." },
  { "pattern": "liquidated damages", "score": 10, "level": "Medium", "explanation": "This specifies a predetermined amount of money you must pay if you breach the agreement." },
  { "pattern": "no liability", "score": 10, "level": "Medium", "explanation": "Contains the legal term 'no liability' which may pose a risk." },

  // One-sided control / discretion
  { "pattern": "sole discretion", "score": 8, "level": "Medium", "explanation": "This gives the other party absolute power to make decisions without consulting you." },
  { "pattern": "at any time without notice", "score": 12, "level": "Medium", "explanation": "The other party can cancel or change terms instantly without warning." },

  // Renewal / lock-in
  { "pattern": "automatically renew", "score": 8, "level": "Medium", "explanation": "This agreement will renew itself without your explicit permission unless you cancel in time." },
  { "pattern": "auto-renew", "score": 8, "level": "Medium", "explanation": "This agreement will renew itself automatically without your explicit permission." },

  // Warranty
  { "pattern": "as is", "score": 5, "level": "Low", "explanation": "Contains the legal term 'as is' which may pose a risk." },
  { "pattern": "without warranty", "score": 8, "level": "Low", "explanation": "Contains the legal term 'without warranty' which may pose a risk." },
  { "pattern": "disclaims all warranties", "score": 8, "level": "Low", "explanation": "Contains the legal term 'disclaims all warranties' which may pose a risk." },

  // Restrictive covenants
  { "pattern": "non-compete", "score": 10, "level": "Medium", "explanation": "This restricts you from working for competitors or starting a competing business." },
  { "pattern": "shall not compete", "score": 10, "level": "Medium", "explanation": "This restricts you from working for competitors or starting a competing business." },

  // Broad/vague scope language
  { "pattern": "any and all information", "score": 8, "level": "Low", "explanation": "Contains the legal term 'any and all information' which may pose a risk." },
  { "pattern": "information whatsoever", "score": 8, "level": "Low", "explanation": "Contains the legal term 'information whatsoever' which may pose a risk." }
];