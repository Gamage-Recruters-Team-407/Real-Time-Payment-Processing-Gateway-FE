import { useState, useEffect } from 'react';
import { getRegionalVelocity } from '../../services/fraudApi';

export default function RegionalVelocity() {
  const [regions, setRegions] = useState([
    { name: 'Loading...', riskLevel: 'STABLE' }
  ]);

  useEffect(() => {
    getRegionalVelocity().then(data => {
      if (data && data.regions) setRegions(data.regions);
    }).catch(console.error);
  }, []);

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
              (r.riskLevel === 'CRITICAL' ? 'badge-danger ' : '') + 
              (r.riskLevel === 'HIGH' ? 'badge-danger ' : '') + 
              (r.riskLevel === 'MEDIUM' ? 'badge-warning ' : '') + 
              (r.riskLevel === 'STABLE' || r.riskLevel === 'LOW' ? 'badge-success ' : '')
            } style={r.riskLevel === 'CRITICAL' ? { backgroundColor: '#FCE7F3', color: '#BE185D' } : {}}>
              {r.riskLevel} {r.fraudRate ? `(${r.fraudRate}%)` : ''}
            </span>
          </div>
        ))}
      </div>

      <div className="map-container">
         {/* Live World Map Background */}
         <img 
           src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
           alt="World Map" 
           style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} 
         />
         
         {/* Map nodes */}
         {regions.map((r, i) => {
           let top = `${30 + (i * 10)}%`;
           let left = `${30 + (i * 15)}%`;

           if (r.lat !== undefined && r.lon !== undefined) {
             // Convert GPS coordinates to percentage for equirectangular map projection
             left = `${((r.lon + 180) / 360) * 100}%`;
             top = `${((90 - r.lat) / 180) * 100}%`;
           } else {
             // Fallbacks if no real data is present
             const fallbackCoords = {
               'US': { top: '40%', left: '20%' },
               'CA': { top: '25%', left: '25%' },
               'RU': { top: '30%', left: '65%' },
               'NG': { top: '60%', left: '50%' },
               'GB': { top: '35%', left: '48%' },
               'HK': { top: '45%', left: '80%' },
               'East Asia': { top: '45%', left: '80%' },
               'Eastern Europe': { top: '30%', left: '65%' },
               'North America': { top: '40%', left: '20%' }
             }[r.name] || { top: `${30 + (i * 10)}%`, left: `${30 + (i * 15)}%` };
             top = fallbackCoords.top;
             left = fallbackCoords.left;
           }

           const color = r.riskLevel === 'CRITICAL' ? '#BE185D' : r.riskLevel === 'HIGH' ? '#E11D48' : r.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981';
           const size = r.riskLevel === 'CRITICAL' ? '18px' : r.riskLevel === 'HIGH' ? '16px' : '12px';

           return (
             <div key={r.name} style={{ position: 'absolute', top: top, left: left, width: size, height: size, backgroundColor: color, borderRadius: '50%', boxShadow: `0 0 10px ${color}80` }}></div>
           );
         })}
      </div>
    </div>
  );
}
