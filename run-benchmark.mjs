{
  "nda_01.txt": {
    "id": "NDA-001",
    "purpose": "Label-style party layout (no inline aliasing). Out-of-state jurisdiction that matches neither party. Unilateral NDA with a trade-secret survival carve-out.",
    "origin": "synthetic",
    "difficulty": "intermediate",
    "status": "passing",
    "introduced": "2026-07-05",
    "docType": "NDA",
    "expected": {
      "termYears": 2,
      "jurisdiction": "Texas",
      "counterpartyState": "Delaware",
      "isUnilateral": true,
      "mentionsTradeSecrets": true
    }
  },
  "nda_02.txt": {
    "id": "NDA-002",
    "purpose": "Inline-alias mutual NDA. Jurisdiction matches the user's home state. Checks that 'mutual' language correctly overrides unilateral detection even though both role labels appear in the text.",
    "origin": "synthetic",
    "difficulty": "intermediate",
    "status": "passing",
    "introduced": "2026-07-05",
    "docType": "NDA",
    "expected": {
      "termYears": 3,
      "jurisdiction": "New York",
      "isUnilateral": false,
      "mentionsTradeSecrets": false
    }
  },
  "nda_03.txt": {
    "id": "NDA-003",
    "purpose": "Defined terms (Disclosing/Receiving Party) appear in section 3, AFTER they're first used in section 1's obligations clause. Checks that definitions.js resolves aliases regardless of where they're defined in document order. No term/trade-secret specified -- should require AI fallback.",
    "origin": "synthetic",
    "difficulty": "edge",
    "status": "passing",
    "introduced": "2026-07-05",
    "docType": "NDA",
    "expected": {
      "termYears": null,
      "jurisdiction": "Illinois",
      "mentionsTradeSecrets": false,
      "requiresAIFallback": true
    }
  },
  "nda_04.txt": {
    "id": "NDA-004",
    "purpose": "hereinafter-style alias with perpetual term explicitly justified by trade secrets -- checks the perpetual+trade-secret carve-out doesn't get flagged as missing a term.",
    "origin": "synthetic",
    "difficulty": "edge",
    "status": "passing",
    "introduced": "2026-07-05",
    "docType": "NDA",
    "expected": {
      "jurisdiction": "Washington",
      "mentionsTradeSecrets": true,
      "termYearsMissingButHandled": true
    }
  },
  "nda_05.txt": {
    "id": "NDA-005",
    "purpose": "Jurisdiction is a neutral/standard state (California) -- should not trigger the 'matches neither party's location' MEDIUM flag.",
    "origin": "synthetic",
    "difficulty": "basic",
    "status": "passing",
    "introduced": "2026-07-05",
    "docType": "NDA",
    "expected": {
      "termYears": 1,
      "jurisdiction": "California",
      "isUnilateral": true,
      "mentionsTradeSecrets": false
    }
  }
}
