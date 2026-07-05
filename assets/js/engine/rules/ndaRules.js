export const evaluateNDARisk = (extractedData, userContext, ruleThresholds) => {
  const flags = [];
  
  // 1. Duration Risk (Strict Trade Secret logic)
  const isPerpetual = !extractedData.termYears && extractedData.termYearsMissingButHandled;
  const hasTradeSecretClause = extractedData.mentionsTradeSecrets;
  
  if (!extractedData.termYears && !extractedData.termYearsMissingButHandled && !hasTradeSecretClause) {
    flags.push({ severity: 'MEDIUM', clause: 'Term', message: 'No expiration date found. Standard confidential info should have a fixed term (unlike Trade Secrets).' });
  } else if (isPerpetual && !hasTradeSecretClause) {
    flags.push({ severity: 'MEDIUM', clause: 'Term', message: 'Term is perpetual but no trade secret exception was found.' });
  } else if (extractedData.termYears > ruleThresholds.ndaMaxTerm && !hasTradeSecretClause) {
    flags.push({ severity: 'MEDIUM', clause: 'Term', message: `Duration exceeds standard ${ruleThresholds.ndaMaxTerm} years for non-trade-secret information.` });
  }

  // 2. Jurisdiction Risk (Only flag 3rd party venues)
  if (extractedData.jurisdiction && userContext?.homeState) {
     const isMyState = extractedData.jurisdiction.toLowerCase() === userContext.homeState.toLowerCase();
     const isOtherPartyState = extractedData.counterpartyState && extractedData.jurisdiction.toLowerCase() === extractedData.counterpartyState.toLowerCase();
     
     if (!isMyState && !isOtherPartyState && !ruleThresholds.neutralStates.map(s=>s.toLowerCase()).includes(extractedData.jurisdiction.toLowerCase())) {
         flags.push({ severity: 'MEDIUM', clause: 'Governing Law', message: `Jurisdiction is ${extractedData.jurisdiction}, which matches neither party's location.` });
     } else if (!isMyState) {
         flags.push({ severity: 'LOW', clause: 'Governing Law', message: `Governing law is ${extractedData.jurisdiction} (Counterparty's state).` });
     }
  }

  // 3. Unilateral Risk Context
  if (extractedData.isUnilateral && userContext?.role === 'Receiving Party') {
     flags.push({ severity: 'LOW', clause: 'Scope', message: 'This is a unilateral NDA where you are the receiving party. Verify you are not required to disclose any of your own confidential information.' });
  }


  // 4. Blank Fields / Templates
  if (extractedData.hasBlankFields) {
     flags.push({ severity: 'MEDIUM', clause: 'Incomplete Document', message: 'Blank fields or placeholders detected. Ensure the template is fully filled out before signing to prevent enforceability issues.' });
  }

  // 5. Injunctive Relief
  if (extractedData.hasInjunctiveRelief) {
     flags.push({ severity: 'MEDIUM', clause: 'Injunctive Relief', message: 'Allows the disclosing party to seek immediate court orders without proving actual monetary damages.' });
  }

  // 6. Indemnification
  if (extractedData.hasIndemnity) {
     flags.push({ severity: 'HIGH', clause: 'Indemnity', message: 'Requires you to compensate the disclosing party for legal losses or expenses in case of a breach, creating significant financial exposure.' });
  }

  // 7. Broad Definitions
  if (extractedData.hasBroadDefinition) {
     flags.push({ severity: 'LOW', clause: 'Scope', message: 'The definition of confidential information is extremely broad, favoring the disclosing party.' });
  }

  return flags;

};
