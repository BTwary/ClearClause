import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Network, Search, Target, Activity } from 'lucide-react';
import GraphView from './GraphView';
import Explorer from './Explorer';
import ImpactView from './ImpactView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <h2>Trothix</h2>
            <span>Ontology Builder</span>
          </div>
          <div className="nav-links">
            <Link to="/"><Network size={20} /> Graph Builder</Link>
            <Link to="/explorer"><Search size={20} /> Knowledge Explorer</Link>
            <Link to="/impact"><Target size={20} /> Impact Analysis</Link>
            <Link to="/coverage"><Activity size={20} /> Coverage Metrics</Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GraphView />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/impact" element={<ImpactView />} />
            <Route path="/coverage" element={<div className="coming-soon">Coverage Metrics Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
