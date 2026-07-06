import fs from 'fs';
import path from 'path';

// Usage: node index.js <DomainName> <BaseConceptID>

const [,, domainName, baseConceptId] = process.argv;

if (!domainName || !baseConceptId) {
    console.error("Usage: node index.js <DomainName> <BaseConceptID>");
    console.error("Example: node index.js Confidentiality CONCEPT_CONFIDENTIALITY");
    process.exit(1);
}

const root = path.join(process.cwd(), '..', '..', 'assets', 'js', 'engine', 'knowledge', 'v1', 'domains');
const domainDir = path.join(root, domainName);

if (fs.existsSync(domainDir)) {
    console.error(`Error: Domain '${domainName}' already exists at ${domainDir}`);
    process.exit(1);
}

fs.mkdirSync(domainDir, { recursive: true });
const testsDir = path.join(domainDir, 'tests');
fs.mkdirSync(testsDir, { recursive: true });

const conceptId = baseConceptId.toUpperCase();
const actionId = `ACTION_${domainName.toUpperCase()}`;

// 0. coverage.json
const coverageTemplate = {
    domain: domainName,
    supportedDocuments: ["NDA", "MSA", "Employment", "Lease", "SaaS"],
    jurisdictions: ["US", "UK", "Global"],
    ruleCount: 6,
    phraseCount: 1,
    testCount: 18,
    coverageScore: 0
};
fs.writeFileSync(path.join(domainDir, 'coverage.json'), JSON.stringify(coverageTemplate, null, 2));

// 1. concept.json
const conceptTemplate = {
    id: conceptId,
    name: domainName,
    description: `Core concept representing ${domainName}.`,
    category: "Contract Clause",
    introduced: "1.0.0",
    deprecated: false,
    replacedBy: null,
    status: "draft",
    maturity: "Experimental",
    owner: "Trothix",
    reviewed: new Date().toISOString().split('T')[0],
    nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actions: [actionId],
    phrases: [],
    entities: [],
    documents: [],
    related: [],
    rules: [
        `${conceptId}_PRESENT`,
        `${conceptId}_MISSING`,
        `${conceptId}_RISK`,
        `${conceptId}_FAIRNESS`,
        `${conceptId}_POSITIVE`,
        `${conceptId}_NEGOTIATION`
    ]
};
fs.writeFileSync(path.join(domainDir, 'concept.json'), JSON.stringify(conceptTemplate, null, 2));

// 1.5 relations.json
const relationsTemplate = [
    {
        id: `REL_${domainName.toUpperCase()}_EXAMPLE`,
        source: conceptId,
        target: "CONCEPT_UNKNOWN",
        relation: "references",
        strength: "optional"
    }
];
fs.writeFileSync(path.join(domainDir, 'relations.json'), JSON.stringify(relationsTemplate, null, 2));

// 2. actions.json
const actionsTemplate = {
    id: actionId,
    name: domainName,
    synonyms: [],
    grammar: {
        subject: "Party",
        object: "Information",
        recipient: "Party",
        constraints: []
    }
};
fs.writeFileSync(path.join(domainDir, 'actions.json'), JSON.stringify(actionsTemplate, null, 2));

// 3. entities.json
const entitiesTemplate = [
    {
        id: `ENTITY_${domainName.toUpperCase()}_TERM`,
        name: `${domainName} Term`,
        extractor: "durationExtractor",
        normalizer: "durationNormalizer"
    }
];
fs.writeFileSync(path.join(domainDir, 'entities.json'), JSON.stringify(entitiesTemplate, null, 2));

// 4. phrases.json (with metadata)
const phrasesTemplate = [
    {
        id: `PHRASE_${domainName.toUpperCase()}_MARKER`,
        text: `sample ${domainName.toLowerCase()} phrase`,
        intent: "Obligation",
        strength: "High",
        concept: conceptId
    }
];
fs.writeFileSync(path.join(domainDir, 'phrases.json'), JSON.stringify(phrasesTemplate, null, 2));

// 5. rules.json (6 rules with extended metadata)
const buildRule = (suffix, category, severity, findingType) => ({
    id: `${conceptId}_${suffix}`,
    concept: conceptId,
    name: `${domainName} ${suffix.toLowerCase().replace(/^\w/, c => c.toUpperCase())}`,
    category,
    severity,
    rationale: `TODO: Add rationale for why ${domainName} ${suffix.toLowerCase()} matters.`,
    evidence: `TODO: Add evidence pattern.`,
    tests: [
        `${suffix.toLowerCase()}_positive.test.js`,
        `${suffix.toLowerCase()}_negative.test.js`,
        `${suffix.toLowerCase()}_edge.test.js`
    ],
    introduced: "1.0.0",
    status: "Experimental",
    when: { "all": [{ "type": "conceptExists", "value": conceptId }] },
    then: { "type": "createFinding", "findingType": findingType }
});

const rulesTemplate = [
    buildRule("PRESENT", "Completeness", "Neutral", `${domainName}Present`),
    buildRule("MISSING", "Completeness", "High", `Missing${domainName}`),
    buildRule("RISK", "Risk", "High", `Risky${domainName}`),
    buildRule("FAIRNESS", "Fairness", "Medium", `Unfair${domainName}`),
    buildRule("POSITIVE", "Positive", "Low", `Favorable${domainName}`),
    buildRule("NEGOTIATION", "Negotiation", "Neutral", `Negotiate${domainName}`)
];

// Specific logic override for MISSING
rulesTemplate[1].when = {
    "all": [
        { "type": "documentRequiresConcept", "value": conceptId },
        { "type": "conceptMissing", "value": conceptId }
    ]
};

fs.writeFileSync(path.join(domainDir, 'rules.json'), JSON.stringify(rulesTemplate, null, 2));

// 6. tests/ scaffold
const goldenTemplate = (ruleId, caseType) => `/**
 * Golden Test for ${ruleId} (${caseType} Case)
 * Generated by Knowledge Generator
 */
import { executePipeline } from '../../../../../../../Trothix.js';
import assert from 'assert';

async function runTest() {
    const text = "TODO: Insert example clause here.";
    const result = await executePipeline(text, { documentType: "Generic" });
    
    const finding = result.findings.find(f => f.rule === '${ruleId}');
    
    ${caseType === 'Negative' 
        ? `assert.ok(!finding, "Expected to NOT find rule ${ruleId}");`
        : `assert.ok(finding, "Expected to find rule ${ruleId}");`
    }
    
    console.log("✅ Golden Test Passed.");
}
runTest().catch(err => {
    console.error("❌ Golden Test Failed:", err.message);
    process.exit(1);
});
`;

const ruleSuffixes = ['PRESENT', 'MISSING', 'RISK', 'FAIRNESS', 'POSITIVE', 'NEGOTIATION'];
const cases = ['Positive', 'Negative', 'Edge'];

ruleSuffixes.forEach(suffix => {
    cases.forEach(caseType => {
        const ruleId = `${conceptId}_${suffix}`;
        const fileName = `${suffix.toLowerCase()}_${caseType.toLowerCase()}.test.js`;
        fs.writeFileSync(path.join(testsDir, fileName), goldenTemplate(ruleId, caseType));
    });
});

console.log(`✅ Successfully scaffolded domain: ${domainName}`);
console.log(`Location: ${domainDir}`);
