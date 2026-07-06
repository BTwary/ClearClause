import { useState } from 'react';
import { Target, ArrowRight } from 'lucide-react';

export default function ImpactView() {
  const [conceptId, setConceptId] = useState('');
  const [impactData, setImpactData] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:3001/api/impact/${conceptId}`);
      if (!res.ok) throw new Error("Node not found");
      const data = await res.json();
      setImpactData(data);
    } catch (e) {
      setError(e.message);
      setImpactData(null);
    }
  };

  return (
    <div className="view-container">
      <div className="header">
        <h1>Impact Analysis</h1>
        <p>See exactly what breaks if you modify or delete a concept.</p>
      </div>

      <div className="search-bar" style={{ display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Enter ID (e.g. CONCEPT_TERMINATION)" 
          value={conceptId}
          onChange={(e) => setConceptId(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        <button onClick={analyze} style={{ padding: '12px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Analyze Impact
        </button>
      </div>

      {error && <div style={{ color: '#ef4444', marginTop: '16px' }}>{error}</div>}

      {impactData && (
        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h2 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={24} color="var(--node-concept)" /> {impactData.name} ({impactData.id})
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Affected Rules ({impactData.affectedRules.length})</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {impactData.affectedRules.length === 0 ? <li style={{ color: 'var(--text-muted)' }}>None</li> : null}
                  {impactData.affectedRules.map(rule => (
                    <li key={rule} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #f59e0b', fontFamily: 'monospace' }}>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>Affected Documents ({impactData.affectedDocuments.length})</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {impactData.affectedDocuments.length === 0 ? <li style={{ color: 'var(--text-muted)' }}>None</li> : null}
                  {impactData.affectedDocuments.map(doc => (
                    <li key={doc} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #06b6d4', fontFamily: 'monospace' }}>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
