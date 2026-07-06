export const riskRules = [
  { "pattern": "indemnify", "score": 15, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
  { "pattern": "hold harmless", "score": 15, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium", "explanation": "This forces you to resolve disputes privately out of court, removing your right to sue or have a trial." },
  { "pattern": "sole discretion", "score": 8, "level": "Medium", "explanation": "This gives the other party absolute power to make decisions without consulting you." },
  { "pattern": "shall not exceed", "score": 10, "level": "Medium", "explanation": "This places a hard cap on liabilities, damages, or obligations." },
  { "pattern": "automatically renew", "score": 8, "level": "Medium", "explanation": "This agreement will renew itself without your explicit permission unless you cancel in time." },
  { "pattern": "auto-renew", "score": 8, "level": "Medium", "explanation": "This agreement will renew itself automatically without your explicit permission." },

  // Service/consulting-specific
  { "pattern": "work made for hire", "score": 10, "level": "Medium", "explanation": "The company automatically owns all intellectual property you create during your employment." },
  { "pattern": "work for hire", "score": 10, "level": "Medium", "explanation": "The company automatically owns all intellectual property you create during your employment." },
  { "pattern": "exclusivity", "score": 10, "level": "Medium", "explanation": "You are forbidden from offering these services to or buying these goods from anyone else." },
  { "pattern": "exclusive", "score": 6, "level": "Low", "explanation": "This grants sole rights, meaning no one else can participate or compete." },
  { "pattern": "non-solicitation", "score": 8, "level": "Medium", "explanation": "This prevents you from poaching the company's employees or clients." },
  { "pattern": "non-compete", "score": 12, "level": "Medium", "explanation": "This restricts you from working for competitors or starting a competing business." },
  { "pattern": "at any time without notice", "score": 12, "level": "Medium", "explanation": "The other party can cancel or change terms instantly without warning." },
  { "pattern": "sole and exclusive remedy", "score": 10, "level": "Medium", "explanation": "If something goes wrong, this is the ONLY type of compensation you can get." },
  { "pattern": "independent contractor", "score": 4, "level": "Low", "explanation": "You are explicitly classified as not an employee, meaning you don't get benefits, overtime, or labor protections." }
];
