import { Filter, Flag, MoreHorizontal, ArrowRight } from 'lucide-react';

export default function RealTimeEventStream({ onReviewClick }) {
  const events = [
    {
      timestamp: '14:02:49.032',
      account: 'GP-8839-XXXX',
      isAlert: true,
      amount: '$ 4,950.00',
      merchant: 'Merchant: UNK_TECH_HKG',
      riskScore: 94,
      status: 'HIGH RISK',
      statusType: 'danger',
      action: 'FREEZE',
      actionIcon: <Flag size={14} />
    },
    {
      timestamp: '14:02:45.118',
      account: 'GP-2201-XXXX',
      isAlert: false,
      amount: '$ 22.40',
      merchant: 'Merchant: STARBUCKS_SEA',
      riskScore: 2,
      status: 'CLEARED',
      statusType: 'success',
      action: 'MORE',
      actionIcon: <MoreHorizontal size={14} />
    },
    {
      timestamp: '14:02:41.882',
      account: 'GP-1039-XXXX',
      isAlert: false,
      amount: '$ 890.00',
      merchant: 'Merchant: CRYPTO_GATE_IE',
      riskScore: 62,
      status: 'REVIEW',
      statusType: 'warning',
      action: 'REVIEW NOW',
      actionIcon: null
    },
    {
      timestamp: '14:02:38.991',
      account: 'GP-5512-XXXX',
      isAlert: false,
      amount: '$ 12,000.00',
      merchant: 'Merchant: LUX_RETAIL_LON',
      riskScore: 100,
      status: 'BLOCKED',
      statusType: 'blocked',
      action: 'RELEASE',
      actionIcon: null
    }
  ];

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="panel-header" style={{ alignItems: 'center' }}>
        <div>
          <h2 className="panel-title">Real-Time Event Stream</h2>
          <p className="panel-subtitle">Live transaction audit log with automated risk scoring</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #10B981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: 'rgba(16,185,129,0.05)' }}>
             <div className="engine-dot"></div>
             LIVE MONITORING
           </div>
           <Filter size={20} className="text-main cursor-pointer" />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>ACCOUNT ID</th>
              <th>TRANSACTION</th>
              <th>RISK SCORE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <tr key={i} className={ev.isAlert ? 'row-danger' : ''}>
                <td className="cell-timestamp">{ev.timestamp}</td>
                <td className="cell-account">
                  {ev.account} 
                  {ev.isAlert && <span style={{ color: '#E11D48' }}>⚠</span>}
                </td>
                <td className="cell-transaction">
                  <span className="tx-amount">{ev.amount}</span>
                  <span className="tx-merchant">{ev.merchant}</span>
                </td>
                <td>
                  <div className="risk-bar-container">
                    <div className="risk-bar">
                      <div className="risk-fill" style={{ 
                        width: `${ev.riskScore}%`,
                        backgroundColor: ev.riskScore > 90 ? '#9F1239' : ev.riskScore > 80 ? '#E11D48' : ev.riskScore > 50 ? '#F59E0B' : '#10B981'
                       }}></div>
                    </div>
                    <span className="risk-score-text" style={{ color: ev.riskScore > 90 ? '#9F1239' : ev.riskScore > 80 ? '#E11D48' : ev.riskScore > 50 ? '#F59E0B' : '#10B981' }}>
                      {ev.riskScore === 100 ? 'MAX' : `${String(ev.riskScore).padStart(2, '0')}%`}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={
                    `badge ` + 
                    (ev.statusType === 'danger' ? 'badge-danger ' : '') + 
                    (ev.statusType === 'success' ? 'badge-success ' : '') + 
                    (ev.statusType === 'warning' ? 'badge-warning ' : '')
                  } style={ev.statusType === 'blocked' ? { backgroundColor: 'transparent', color: '#E11D48', padding: 0 } : {}}>
                    {ev.statusType === 'blocked' && <span style={{ marginRight: '4px' }}>⊘</span>}
                    {ev.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {ev.action === 'MORE' ? (
                      <button className="btn-action icon-only">{ev.actionIcon}</button>
                    ) : (
                      <>
                        <button 
                          className={`btn-action ${ev.action.toLowerCase().replace(' ', '-')}`}
                          onClick={ev.action === 'REVIEW NOW' ? onReviewClick : undefined}
                        >
                          {ev.action}
                        </button>
                        {ev.actionIcon && <button className="btn-action icon-only">{ev.actionIcon}</button>}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div></div> {/* spacer */}
        <a href="#" className="view-all-link">
          View Full Audit Trail <ArrowRight size={16} />
        </a>
        <div className="engine-status">
           <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>ENGINE STATUS</span> 
           SENTINEL-X AI ACTIVE
        </div>
      </div>
    </div>
  );
}
