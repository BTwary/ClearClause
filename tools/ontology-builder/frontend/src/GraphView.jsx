import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeTypes = {}; // Default node is fine with custom styling via CSS classes

export default function GraphView() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/graph')
      .then(res => res.json())
      .then(data => {
        // Layout randomly or just linearly for now since we don't have dagre
        const formattedNodes = data.nodes.map((n, i) => {
          let typeClass = 'react-flow__node-concept';
          if (n.id.startsWith('ACTION')) typeClass = 'react-flow__node-action';
          if (n.id.startsWith('ENTITY')) typeClass = 'react-flow__node-entity';
          if (n.id.startsWith('PHRASE')) typeClass = 'react-flow__node-phrase';
          if (n.id.startsWith('DOC')) typeClass = 'react-flow__node-doc';
          
          return {
            id: n.id,
            position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 150 },
            data: { label: n.name || n.id },
            className: typeClass
          };
        });

        const formattedEdges = data.edges.map((e, i) => ({
          id: `e-${i}`,
          source: e.source, // Warning: relations in our ontology might point to generic 'Party' not specific IDs. We'll link actual graph edges later.
          target: e.target,
          label: e.type,
          animated: true,
          style: { stroke: 'var(--accent)' }
        }));
        
        // Let's create implicit edges from "related", "actions", "entities" for better visualization
        let implicitEdges = [];
        data.nodes.forEach(n => {
          if (n.actions) {
            n.actions.forEach(act => implicitEdges.push({ id: `${n.id}-${act}`, source: n.id, target: act, style: { stroke: '#94a3b8' } }));
          }
          if (n.entities) {
            n.entities.forEach(ent => implicitEdges.push({ id: `${n.id}-${ent}`, source: n.id, target: ent, style: { stroke: '#f59e0b', strokeDasharray: '5 5' } }));
          }
          if (n.related) {
             n.related.forEach(rel => implicitEdges.push({ id: `${n.id}-${rel}`, source: n.id, target: rel, animated: true, style: { stroke: '#8b5cf6' } }));
          }
        });

        setNodes(formattedNodes);
        setEdges([...formattedEdges, ...implicitEdges]);
      })
      .catch(console.error);
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="var(--border)" gap={16} />
        <Controls style={{ background: 'var(--bg-panel)', border: 'none', fill: 'var(--text-main)' }} />
      </ReactFlow>
    </div>
  );
}
