export function parseNDA(text, definitions) {
  const extracted = {
    termYears: null,
    termYearsMissingButHandled: false,
    confidentialityScope: '',
    jurisdiction: null,
    counterpartyState: null, // Note: Robust extraction of counterparty state requires AI or strict templating. 
    isUnilateral: false,
    mentionsTradeSecrets: false,
    hasBlankFields: false,
    hasInjunctiveRelief: false,
    hasIndemnity: false,
    hasBroadDefinition: false,
  };

  // 1. Duration / Term parsing
  const termRegex = /period of (\d+|one|two|three|four|five|ten) years?/i;
  const matchTerm = text.match(termRegex);
  if (matchTerm) {
    let num = matchTerm[1].toLowerCase();
    const map = { one: 1, two: 2, three: 3, four: 4, five: 5, ten: 10 };
    extracted.termYears = map[num] || parseInt(num, 10);
  } else if (/perpetual|indefinite|survive termination/i.test(text)) {
    extracted.termYearsMissingButHandled = true;
  }

  // 2. Scope & Trade Secrets
  const scopeRegex = /Confidential Information(?: shall)? means (.*?)(?=\.|$)/i;
  const matchScope = text.match(scopeRegex);
  if (matchScope) {
    extracted.confidentialityScope = matchScope[1];
    if (/(?:any and all|all information|any information|every|whatsoever)/i.test(matchScope[1])) {
      extracted.hasBroadDefinition = true;
    }
  } else if (/confidential information/i.test(text)) {
    extracted.confidentialityScope = 'Found mentions of confidential information.';
    if (/(?:any and all|all information|any information) (?:that is )?(?:disclosed|provided)/i.test(text)) {
      extracted.hasBroadDefinition = true;
    }
  }

  extracted.mentionsTradeSecrets = /trade secret/i.test(text);

  // 3. Jurisdiction
  const jurisdictionRegex = /(?:governed by the laws of|jurisdiction of) (the State of )?([A-Z][a-zA-Z\s]+)/i;
  const matchJur = text.match(jurisdictionRegex);
  if (matchJur && matchJur[2]) {
    extracted.jurisdiction = matchJur[2].trim();
  }

  // 4. Unilateral vs Mutual
  const hasMutual = /mutual(?: non-disclosure| confidentiality)/i.test(text);
  const hasDisclosing = /disclosing party/i.test(text);
  const hasReceiving = /receiving party/i.test(text);
  
  if (hasMutual) {
    extracted.isUnilateral = false;
  } else if (hasDisclosing && hasReceiving) {
    extracted.isUnilateral = true;
  }
  
  // 5. Blank Fields / Templates
  if (/_{4,}|\[(?:Party Name|Address|Company|Date|State)\]|<(?:Party Name|Address|Company|Date|State)>/i.test(text)) {
    extracted.hasBlankFields = true;
  }
  
  // 6. Injunctive Relief
  if (/injunct(?:ion|ive relief)|equitable relief/i.test(text)) {
    extracted.hasInjunctiveRelief = true;
  }
  
  // 7. Indemnification
  if (/indemnify|indemnification|hold harmless/i.test(text)) {
    extracted.hasIndemnity = true;
  }

  return extracted;
}
