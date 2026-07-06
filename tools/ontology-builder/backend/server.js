import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ONTOLOGY_PATH = path.join(__dirname, '../../../assets/js/engine/knowledge/v1/ontology');

const app = express();
app.use(cors());
app.use(express.json());

// Helper to read all files in a dir
function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (file.endsWith('.json')) {
            filelist.push(filepath);
        }
    }
    return filelist;
}

// GET /api/graph - Returns the full ontology graph
app.get('/api/graph', (req, res) => {
    const nodes = [];
    const edges = [];
    
    const files = walkSync(ONTOLOGY_PATH);
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            data._filepath = file; // Attach filepath for saving later
            if (data.id?.startsWith('REL_')) {
                edges.push(data);
            } else {
                nodes.push(data);
            }
        } catch (e) {
            console.error("Error reading file", file, e.message);
        }
    }
    
    res.json({ nodes, edges });
});

// Helper to build the in-memory lookup graph quickly for analysis
function buildGraph() {
    const nodes = new Map();
    const edges = [];
    const files = walkSync(ONTOLOGY_PATH);
    for (const file of files) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (data.id?.startsWith('REL_')) {
                edges.push(data);
            } else if (data.id) {
                nodes.set(data.id, data);
            }
        } catch (e) { }
    }
    return { nodes, edges };
}

// GET /api/impact/:id - Impact Analysis
app.get('/api/impact/:id', (req, res) => {
    const { nodes } = buildGraph();
    const targetId = req.params.id;
    const target = nodes.get(targetId);
    
    if (!target) return res.status(404).json({ error: "Node not found" });

    // Find affected documents (documents that include this concept/rule)
    const affectedDocs = [];
    // Find affected rules (rules that reference this concept)
    const affectedRules = target.rules || [];
    
    for (const [id, node] of nodes.entries()) {
        if (id.startsWith('DOC_')) {
            if (node.expectedConcepts?.includes(targetId) || 
                node.minimumSections?.includes(targetId) ||
                node.recommendedSections?.includes(targetId) ||
                node.optionalSections?.includes(targetId)) {
                affectedDocs.push(id);
            }
        }
    }

    res.json({
        id: targetId,
        name: target.name || targetId,
        affectedRules,
        affectedDocuments: affectedDocs
    });
});

// GET /api/coverage/:id - Coverage Metrics
app.get('/api/coverage/:id', (req, res) => {
    const { nodes } = buildGraph();
    const targetId = req.params.id;
    const target = nodes.get(targetId);
    
    if (!target) return res.status(404).json({ error: "Node not found" });

    // Mock metrics calculation
    const rulesConfigured = target.rules?.length || 0;
    const rulesTarget = 5; // Arbitrary target for demonstration
    
    // Check document coverage
    const documentCoverage = [];
    for (const [id, node] of nodes.entries()) {
        if (id.startsWith('DOC_')) {
            const covers = node.expectedConcepts?.includes(targetId) || 
                           node.minimumSections?.includes(targetId) ||
                           node.recommendedSections?.includes(targetId);
            documentCoverage.push({
                document: node.name || id,
                covered: covers
            });
        }
    }

    res.json({
        rules: { current: rulesConfigured, target: rulesTarget, percent: Math.min(100, (rulesConfigured/rulesTarget)*100) },
        documents: documentCoverage
    });
});

app.listen(3001, () => {
    console.log('Ontology Builder Backend running on http://localhost:3001');
});
