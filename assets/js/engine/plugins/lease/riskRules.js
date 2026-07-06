export const riskRules = [
 { "pattern": "indemnify", "score": 20, "level": "High", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
 { "pattern": "hold harmless", "score": 20, "level": "High", "explanation": "This clause prevents you from holding the other party liable for certain damages." },
 { "pattern": "late fee", "score": 10, "level": "Medium", "explanation": "This clause imposes a financial penalty if payments are delayed." },
 { "pattern": "eviction", "score": 10, "level": "Medium", "explanation": "This mentions eviction, which could result in you being forced to leave the property." },
 { "pattern": "maintenance", "score": 5, "level": "Low", "explanation": "Contains the legal term 'maintenance' which may pose a risk." }
];