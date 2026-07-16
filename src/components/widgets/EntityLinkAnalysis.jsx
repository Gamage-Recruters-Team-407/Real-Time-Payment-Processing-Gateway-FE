import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getEntityLinkData } from '../../services/fraudApi';
import { useSelector } from 'react-redux';

export default function EntityLinkAnalysis({ onLiveFeedClick, onInvestigateClick, onWhitelistClick }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { items: alerts } = useSelector(state => state.alerts);

  useEffect(() => {
    const fetchGraph = async () => {
      // Use the latest alert's userId as the seed for the graph, if available
      const seedId = alerts.length > 0 ? alerts[0].accountId || alerts[0].userId : 'USER-DEFAULT';
      if (!seedId) return;
      
      try {
        const data = await getEntityLinkData(seedId);
        if (data && data.nodes) {
          // Map backend nodes to React Flow format
          const mappedNodes = data.nodes.map((n, idx) => ({
            id: n.id,
            position: { x: 150 + (idx * 120), y: 150 + (idx % 2 === 0 ? 50 : -50) },
            data: { label: n.label + ' ' + (n.properties?.userId || n.properties?.id || n.id) },
            style: { 
              background: n.label === 'User' ? '#6C1E20' : '#D1D5DB',
              color: n.label === 'User' ? '#fff' : '#000',
              borderRadius: n.label === 'User' ? '50%' : '8px',
              padding: '10px',
              border: '1px solid #8B1E20'
            }
          }));
          const mappedEdges = data.edges.map((e, idx) => ({
            id: `e-${idx}`,
            source: e.from,
            target: e.to,
            label: e.type,
            animated: true,
            style: { stroke: '#8B1E20' }
          }));
          setNodes(mappedNodes);
          setEdges(mappedEdges);
        }
      } catch (err) {
        console.error("Failed to load graph data", err);
      }
    };
    fetchGraph();
  }, [alerts]);

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
      
      <div className="graph-container" style={{ width: '100%', height: '300px', position: 'relative' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div className="tooltip-card">
        <div className="tooltip-header">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6C1E20' }}></div>
            <span>Flagged Entity (Score &gt; 90)</span>
        </div>
        <p className="tooltip-desc">
          System identified high-velocity lateral movement between peer accounts. Multi-node hop detected.
        </p>
        <div className="tooltip-actions">
          <button className="tooltip-btn btn-investigate" onClick={() => onInvestigateClick(alerts[0]?._id)}>
            <Search size={14} /> Investigate
          </button>
          <button className="tooltip-btn btn-whitelist" onClick={onWhitelistClick}>
            <span style={{ fontSize: '14px' }}>⚲</span> Whitelist
          </button>
        </div>
      </div>
    </div>
  );
}
