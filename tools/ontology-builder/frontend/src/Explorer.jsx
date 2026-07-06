import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function Explorer() {
  const [data, setData] = useState({ nodes: [] });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/graph')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const filteredNodes = data.nodes.filter(n => 
    n.id.toLowerCase().includes(search.toLowerCase()) || 
    (n.name && n.name.toLowerCase().includes(search.toLowerCase()))
  );

  const getBadgeClass = (id) => {
    if (id.startsWith('CONCEPT')) return 'badge concept';
    if (id.startsWith('ACTION')) return 'badge action';
    if (id.startsWith('ENTITY')) return 'badge entity';
    if (id.startsWith('DOC')) return 'badge doc';
    return 'badge';
  };

  return (
    <div className="view-container">
      <div className="header">
        <h1>Knowledge Explorer</h1>
        <p>Browse and search the entire Legal Ontology.</p>
      </div>

      <div className="search-bar">
        <Search style={{ position: 'absolute', margin: '12px', color: 'var(--text-muted)' }} size={20} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search concepts, actions, entities..." 
          style={{ paddingLeft: '44px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>ID</th>
            <th>Name</th>
            <th>Introduced</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredNodes.map(node => (
            <tr key={node.id}>
              <td><span className={getBadgeClass(node.id)}>{node.id.split('_')[0]}</span></td>
              <td style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{node.id}</td>
              <td>{node.name || '-'}</td>
              <td>{node.introduced || '1.0.0'}</td>
              <td>{node.status || 'production'}</td>
            </tr>
          ))}
          {filteredNodes.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
