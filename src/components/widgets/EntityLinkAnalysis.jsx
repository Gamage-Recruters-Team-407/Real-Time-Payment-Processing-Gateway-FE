import { useState, useEffect } from 'react';
import { Search, Activity } from 'lucide-react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getEntityLinkData, runLivePrediction } from '../../services/fraudApi';
import { useSelector } from 'react-redux';

export default function EntityLinkAnalysis({ onLiveFeedClick, onInvestigateClick, onWhitelistClick }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activeSeedId, setActiveSeedId] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const { items: alerts } = useSelector(state => state.alerts);

  useEffect(() => {
    const fetchGraph = async () => {
      // Use the latest alert's userId as the seed for the graph, if available
      const seedId = alerts.length > 0 ? alerts[0].accountId || alerts[0].userId : 'USER-DEFAULT';
      
      try {
        const data = await getEntityLinkData(seedId);
        if (data && data.nodes) {
          // Map backend nodes to React Flow format
          const mappedNodes = data.nodes.map((n, idx) => ({
            id: n.id,
            position: { x: 150 + (idx * 120), y: 150 + (idx % 2 === 0 ? 50 : -50) },
            data: { label: n.label + ' ' + (n.properties?.userId || n.properties?.id || n.id) },
            style: { 
              background: n.label === 'Account' ? '#6C1E20' : '#D1D5DB',
              color: n.label === 'Account' ? '#fff' : '#000',
              borderRadius: n.label === 'Account' ? '50%' : '8px',
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
          setActiveSeedId(data.seedId);
        }
      } catch (err) {
        console.error("Failed to load graph data", err);
      }
    };
    fetchGraph();
  }, [alerts]);

  const handlePredict = async () => {
    const targetId = alerts[0]?._id || alerts[0]?.id || alerts[0]?.transactionId || activeSeedId;
    if (!targetId) return;

    try {
      setIsPredicting(true);
      const res = await runLivePrediction(targetId);
      if (res && res.prediction) {
        alert(`ML Prediction Complete!\nVerdict: ${res.prediction.verdict}\nProbability: ${(res.prediction.probability * 100).toFixed(2)}%\nRisk Score: ${res.prediction.risk_score}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to run live prediction on this entity.');
    } finally {
      setIsPredicting(false);
    }
  };

  const getTargetId = () => alerts[0]?._id || alerts[0]?.id || alerts[0]?.transactionId || null;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Entity Link Analysis</h2>
          <p className="panel-subtitle">Cluster mapping of suspicious account associations</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-dark" onClick={onLiveFeedClick}>LIVE FEED</button>
        </div>
      </div>
      
      <div className="graph-container" style={{ width: '100%', height: '300px', position: 'relative' }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="tooltip-card">
        {alerts.length > 0 ? (
          <>
            <div className="tooltip-header">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: alerts[0].riskScore >= 90 ? '#6C1E20' : '#F59E0B' }}></div>
                <span>Flagged Entity (Score: {Math.round(alerts[0].riskScore || 0)})</span>
            </div>
            <p className="tooltip-desc">
              {alerts[0].alertReason || "Suspicious activity detected. Account flagged for review."}
              <br/><br/>
              <strong>Account:</strong> {alerts[0].accountId || alerts[0].userId || 'Unknown'}<br/>
              <strong>Transaction:</strong> {alerts[0].transactionId || alerts[0].id || 'Unknown'}
            </p>
          </>
        ) : (
          <>
            <div className="tooltip-header">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6C1E20' }}></div>
                <span>Live Entity Cluster</span>
            </div>
            <p className="tooltip-desc">
              Tracking network behavior for central node. Connected IPs, devices, and merchants are mapped above.
              <br/><br/>
              <strong>Account Seed:</strong> {activeSeedId || 'Unknown'}
            </p>
          </>
        )}
        <div className="tooltip-actions">
          <button 
            className="tooltip-btn btn-investigate" 
            onClick={() => {
              const target = getTargetId();
              if (target) onInvestigateClick(target);
            }}
          >
            <Search size={14} /> Investigate
          </button>
          <button 
            className="tooltip-btn btn-whitelist" 
            onClick={() => {
              const target = getTargetId();
              if (target) onWhitelistClick(target);
            }}
          >
            <span style={{ fontSize: '14px' }}>⚲</span> Whitelist
          </button>
        </div>
      </div>
    </div>
  );
}
