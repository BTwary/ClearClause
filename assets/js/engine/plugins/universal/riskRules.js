export const riskRules = [
  // Liability & Risk
  { "pattern": "indemnify", "score": 20, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
  { "pattern": "hold harmless", "score": 20, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
  { "pattern": "liquidated damages", "score": 15, "level": "Medium", "explanation": "This specifies a predetermined amount of money you must pay if you breach the agreement." },
  { "pattern": "liability shall be limited", "score": 15, "level": "Medium", "explanation": "This limits the amount of money you can recover if the other party breaches the agreement." },
  { "pattern": "maximum liability", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'maximum liability' which may pose a risk." },
  { "pattern": "shall not exceed", "score": 10, "level": "Medium", "explanation": "Contains the legal term 'shall not exceed' which may pose a risk." },
  
  // Dispute Resolution / Waivers
  { "pattern": "binding arbitration", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'binding arbitration' which may pose a risk." },
  { "pattern": "class action waiver", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'class action waiver' which may pose a risk." },
  { "pattern": "waives any right to a jury", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'waives any right to a jury' which may pose a risk." },
  { "pattern": "injunct", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek an immediate court order to stop you from doing something." },
  { "pattern": "equitable relief", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek non-financial court remedies against you." },
  
  // IP / Licenses
  { "pattern": "perpetual", "score": 20, "level": "High", "explanation": "Contains the legal term 'perpetual' which may pose a risk." },
  { "pattern": "irrevocable", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'irrevocable' which may pose a risk." },
  
  // Termination & Renewals
  { "pattern": "automatically renew", "score": 10, "level": "Medium", "explanation": "This agreement will renew itself without your explicit permission unless you cancel in time." },
  { "pattern": "terminate at any time", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'terminate at any time' which may pose a risk." },
  { "pattern": "terminate without cause", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'terminate without cause' which may pose a risk." },
  
  // Warranties
  { "pattern": "as is", "score": 10, "level": "Medium", "explanation": "Contains the legal term 'as is' which may pose a risk." },
  { "pattern": "without warranty", "score": 10, "level": "Medium", "explanation": "Contains the legal term 'without warranty' which may pose a risk." },
  { "pattern": "disclaims all warranties", "score": 15, "level": "Medium", "explanation": "Contains the legal term 'disclaims all warranties' which may pose a risk." }
];
