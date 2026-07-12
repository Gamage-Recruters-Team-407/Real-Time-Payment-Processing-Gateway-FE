
export default function RegionalVelocity() {
  const regions = [
    { name: 'East Asia Cluster', status: 'HIGH RISK', type: 'danger' },
    { name: 'Eastern Europe', status: 'CRITICAL', type: 'critical' },
    { name: 'North America', status: 'STABLE', type: 'success' },
  ];

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="panel-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 className="panel-title" style={{ fontSize: '1rem' }}>Regional Velocity</h2>
          <p className="panel-subtitle">High-frequency login attempt heatmap</p>
        </div>
      </div>
      
      <div className="region-list">
        {regions.map(r => (
          <div key={r.name} className="region-item">
            <span>{r.name}</span>
            <span className={
              `badge ` + 
              (r.type === 'danger' ? 'badge-danger ' : '') + 
              (r.type === 'critical' ? 'badge-danger ' : '') + 
              (r.type === 'success' ? 'badge-success ' : '')
            } style={r.type === 'critical' ? { backgroundColor: '#FCE7F3', color: '#BE185D' } : {}}>
              {r.status}
            </span>
          </div>
        ))}
      </div>

      <div className="map-container">
         {/* Simple SVG World Map outline mock */}
         <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ opacity: 0.1 }}>
            <path d="M50 50 Q 100 20 150 50 T 250 50 T 350 50" stroke="#000" strokeWidth="2" fill="none"/>
            <path d="M50 100 Q 100 70 150 100 T 250 100 T 350 100" stroke="#000" strokeWidth="2" fill="none"/>
            <path d="M50 150 Q 100 120 150 150 T 250 150 T 350 150" stroke="#000" strokeWidth="2" fill="none"/>
         </svg>
         
         {/* Map nodes */}
         <div style={{ position: 'absolute', top: '40%', left: '20%', width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
         <div style={{ position: 'absolute', top: '35%', left: '55%', width: '16px', height: '16px', backgroundColor: '#F59E0B', borderRadius: '50%', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}></div>
         <div style={{ position: 'absolute', top: '30%', left: '60%', width: '12px', height: '12px', backgroundColor: '#E11D48', borderRadius: '50%', boxShadow: '0 0 10px rgba(225,29,72,0.5)' }}></div>
         <div style={{ position: 'absolute', top: '50%', left: '80%', width: '18px', height: '18px', backgroundColor: '#BE185D', borderRadius: '50%', boxShadow: '0 0 10px rgba(190,24,93,0.5)' }}></div>
      </div>
    </div>
  );
}
