import { Filter, Flag, MoreHorizontal, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RealTimeEventStream({ transactions = [], onReviewClick, onFreezeClick, onReleaseClick }) {

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
            {transactions.map((tx, i) => {
              const isAlert = tx.status === 'HIGH_RISK' || tx.status === 'BLOCKED';
              const statusType = tx.status === 'BLOCKED' ? 'blocked' : (tx.status === 'HIGH_RISK' ? 'danger' : (tx.status === 'REVIEW' ? 'warning' : 'success'));
              const action = tx.status === 'BLOCKED' ? 'RELEASE' : (tx.status === 'HIGH_RISK' ? 'FREEZE' : (tx.status === 'REVIEW' ? 'REVIEW NOW' : 'MORE'));
              
              // Extract HH:mm:ss.SSS from ISO string if possible, else fallback
              const timeString = tx.createdAt ? new Date(tx.createdAt).toISOString().slice(11, 23) : '00:00:00.000';

              return (
                <tr key={tx._id || i} className={isAlert ? 'row-danger' : ''}>
                  <td className="cell-timestamp">{timeString}</td>
                  <td className="cell-account">
                    <div className="cell-account-inner">
                      {tx.userId || 'Unknown'} 
                      {isAlert && <AlertTriangle size={14} color="#9F1239" style={{ marginLeft: '8px' }} />}
                    </div>
                  </td>
                  <td className="cell-transaction">
                    <div className="cell-transaction-inner">
                      <span className="tx-amount">$ {tx.amount?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
                      <span className="tx-merchant" style={{ textTransform: 'uppercase' }}>Merchant: {tx.merchant}</span>
                    </div>
                  </td>
                  <td>
                    <div className="risk-bar-container">
                      <div className="risk-bar">
                        <div className="risk-fill" style={{ 
                          width: `${tx.riskScore}%`,
                          backgroundColor: tx.riskScore >= 90 ? '#7F1D1D' : tx.riskScore > 80 ? '#9F1239' : tx.riskScore > 50 ? '#F59E0B' : '#10B981'
                        }}></div>
                      </div>
                      <span className="risk-score-text" style={{ color: tx.riskScore >= 90 ? '#7F1D1D' : tx.riskScore > 80 ? '#9F1239' : tx.riskScore > 50 ? '#F59E0B' : '#10B981' }}>
                        {tx.riskScore === 100 ? 'MAX' : `${String(Math.round(tx.riskScore)).padStart(2, '0')}%`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={
                      `badge ` + 
                      (statusType === 'danger' ? 'badge-danger ' : '') + 
                      (statusType === 'success' ? 'badge-success ' : '') + 
                      (statusType === 'warning' ? 'badge-warning ' : '')
                    } style={statusType === 'blocked' ? { backgroundColor: 'transparent', color: '#E11D48', padding: 0 } : {}}>
                      {statusType === 'blocked' && <span style={{ marginRight: '4px' }}>⊘</span>}
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {action === 'MORE' ? (
                        <button className="btn-action icon-only"><MoreHorizontal size={14} /></button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            className={`btn-action ${action.toLowerCase().replace(' ', '-')}`}
                            onClick={() => {
                              if (action === 'REVIEW NOW' && onReviewClick) onReviewClick(tx._id);
                              else if (action === 'FREEZE' && onFreezeClick) onFreezeClick(tx._id);
                              else if (action === 'RELEASE' && onReleaseClick) onReleaseClick(tx._id);
                            }}
                          >
                            {action}
                          </button>
                          {action === 'FREEZE' && <Flag size={16} className="text-muted cursor-pointer" />}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
