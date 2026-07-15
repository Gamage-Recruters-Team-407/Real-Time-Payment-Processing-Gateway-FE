import { Search } from 'lucide-react';

export default function EntityLinkAnalysis({ onLiveFeedClick, onInvestigateClick, onWhitelistClick }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Entity Link Analysis</h2>
          <p className="panel-subtitle">Cluster mapping of suspicious account associations</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline">EXPORT GRAPH</button>
          <button className="btn-dark" onClick={onLiveFeedClick}>LIVE FEED</button>
        </div>
      </div>
      
      <div className="graph-container">
        {/* Mocking the network graph with CSS absolute positioning */}
        <div style={{ position: 'absolute', top: '35%', left: '30%', width: '12px', height: '12px', backgroundColor: '#6C1E20', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '55%', left: '42%', width: '40px', height: '16px', backgroundColor: '#D1D5DB', borderRadius: '8px' }}></div>
        <div style={{ position: 'absolute', top: '65%', left: '45%', width: '8px', height: '8px', backgroundColor: '#8B5C5C', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '12px', height: '12px', backgroundColor: '#8B1E20', borderRadius: '50%' }}></div>
        
        {/* SVG lines between nodes */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line x1="30%" y1="35%" x2="45%" y2="65%" stroke="#E5E7EB" strokeWidth="2" />
          <line x1="45%" y1="65%" x2="60%" y2="50%" stroke="#E5E7EB" strokeWidth="2" />
        </svg>

        {/* Tooltip Card */}
        <div className="tooltip-card">
          <div className="tooltip-header">
             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6C1E20' }}></div>
             <span>Flagged Entity (Score &gt; 90)</span>
          </div>
          <p className="tooltip-desc">
            System identified high-velocity lateral movement between peer accounts. Multi-node hop detected.
          </p>
          <div className="tooltip-actions">
            <button className="tooltip-btn btn-investigate" onClick={onInvestigateClick}>
              <Search size={14} /> Investigate
            </button>
            <button className="tooltip-btn btn-whitelist" onClick={onWhitelistClick}>
              <span style={{ fontSize: '14px' }}>⚲</span> Whitelist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
