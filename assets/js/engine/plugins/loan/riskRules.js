export const riskRules = [
  { "pattern": "indemnify", "score": 12, "level": "Medium", "explanation": "This clause may require you to pay for the other party's legal damages or losses." },
  { "pattern": "binding arbitration", "score": 12, "level": "Medium", "explanation": "This forces you to resolve disputes privately out of court, removing your right to sue or have a trial." },
  { "pattern": "jury trial", "score": 12, "level": "Medium", "explanation": "This waives your constitutional right to have a jury hear a dispute." },
  { "pattern": "sole discretion", "score": 8, "level": "Medium", "explanation": "This gives the other party absolute power to make decisions without consulting you." },

  // Loan-specific
  { "pattern": "confession of judgment", "score": 25, "level": "High", "explanation": "You are agreeing in advance to let the lender win a lawsuit against you without a defense." },
  { "pattern": "personal guarantee", "score": 15, "level": "High", "explanation": "You are personally responsible for repaying this debt if the business fails, putting your personal assets at risk." },
  { "pattern": "personal guaranty", "score": 15, "level": "High", "explanation": "You are personally responsible for repaying this debt if the business fails, putting your personal assets at risk." },
  { "pattern": "acceleration", "score": 12, "level": "Medium", "explanation": "The lender can demand full repayment of the entire loan immediately if you violate certain terms." },
  { "pattern": "immediately due and payable", "score": 12, "level": "Medium", "explanation": "The entire debt must be paid back instantly under certain conditions." },
  { "pattern": "default rate", "score": 10, "level": "Medium", "explanation": "A significantly higher interest rate will be charged if you miss a payment." },
  { "pattern": "compound interest", "score": 8, "level": "Medium", "explanation": "Interest is charged on both the principal and the accumulated interest, growing the debt faster." },
  { "pattern": "balloon payment", "score": 10, "level": "Medium", "explanation": "A very large, lump-sum payment is due at the end of the loan term." },
  { "pattern": "prepayment penalty", "score": 8, "level": "Medium", "explanation": "You will be charged a fee if you pay off the loan early." },
  { "pattern": "late fee", "score": 6, "level": "Low", "explanation": "This clause imposes a financial penalty if payments are delayed." },
  { "pattern": "security interest", "score": 8, "level": "Medium", "explanation": "The lender has a legal claim to specific property you own if you fail to repay." },
  { "pattern": "collateral", "score": 6, "level": "Low", "explanation": "You are putting up property that the lender can take if you don't repay the loan." },
  { "pattern": "cross-default", "score": 12, "level": "Medium", "explanation": "If you default on any other loan, it automatically triggers a default on this loan too." }
];
