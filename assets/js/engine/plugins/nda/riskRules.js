export const riskRules = [
 { "pattern": "indemnify", "score": 20, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
 { "pattern": "hold harmless", "score": 20, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
 { "pattern": "injunct", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek an immediate court order to stop you from doing something." },
 { "pattern": "equitable relief", "score": 10, "level": "Medium", "explanation": "This allows the other party to seek non-financial court remedies against you." },
 { "pattern": "any and all information", "score": 8, "level": "Low", "explanation": "Contains the legal term 'any and all information' which may pose a risk." },
 { "pattern": "information whatsoever", "score": 8, "level": "Low", "explanation": "Contains the legal term 'information whatsoever' which may pose a risk." }
];