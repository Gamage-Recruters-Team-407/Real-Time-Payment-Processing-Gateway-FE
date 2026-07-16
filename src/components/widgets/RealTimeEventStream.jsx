import { useState, useEffect } from 'react';
import { Filter, Flag, MoreHorizontal, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RealTimeEventStream({ transactions = [], onReviewClick, onInvestigateClick, onFreezeClick, onReleaseClick }) {
  const [pulse, setPulse] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (transactions.length > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [transactions]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const displayTransactions = isExpanded ? sortedTransactions : sortedTransactions.slice(0, 5);

  return (
    <>
    <style>{`
      @keyframes floatBubble {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }
    `}</style>
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="panel-header" style={{ alignItems: 'center' }}>
        <div>
          <h2 className="panel-title">Real-Time Event Stream</h2>
          <p className="panel-subtitle">Live transaction audit log with automated risk scoring</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #10B981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: 'rgba(16,185,129,0.05)' }}>
             <div className="engine-dot" style={{ opacity: pulse ? 1 : 0.4, transition: 'opacity 0.2s ease-in-out' }}></div>
             LIVE MONITORING
           </div>
           <Filter size={20} className="text-main cursor-pointer" />
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: isExpanded ? '600px' : 'none', overflowY: isExpanded ? 'auto' : 'visible' }}>
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
            {displayTransactions.map((tx, i) => {
              const isAlert = tx.status === 'HIGH_RISK' || tx.status === 'BLOCKED' || tx.status === 'ESCALATED' || tx.status === 'UNDER_REVIEW';
              const statusType = tx.status === 'BLOCKED' ? 'blocked' : ((tx.status === 'HIGH_RISK' || tx.status === 'ESCALATED') ? 'danger' : ((tx.status === 'REVIEW' || tx.status === 'UNDER_REVIEW') ? 'warning' : 'success'));
              let action = 'MORE';
              if (tx.status === 'BLOCKED') {
                action = 'RELEASE';
              } else if (tx.status === 'HIGH_RISK' || tx.status === 'REVIEW' || tx.status === 'ESCALATED' || tx.status === 'UNDER_REVIEW') {
                action = (tx.riskScore > 50 || tx.status === 'ESCALATED' || tx.status === 'UNDER_REVIEW') ? 'INVESTIGATE' : 'REVIEW NOW';
              }
              
              // Extract HH:mm:ss.SSS from ISO string if possible, else fallback
              const timeString = tx.createdAt ? new Date(tx.createdAt).toISOString().slice(11, 23) : '00:00:00.000';
              const rowClass = tx.status === 'ESCALATED' ? 'row-escalated' : (isAlert ? 'row-danger' : '');

              return (
                <tr key={tx._id || i} className={rowClass}>
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
                              else if (action === 'INVESTIGATE' && onInvestigateClick) onInvestigateClick(tx._id);
                              else if (action === 'FREEZE' && onFreezeClick) onFreezeClick(tx._id);
                              else if (action === 'RELEASE' && onReleaseClick) onReleaseClick(tx._id);
                            }}
                          >
                            {action}
                          </button>
                          {action === 'FREEZE' && (
                            <Flag 
                              size={16} 
                              className="text-muted cursor-pointer" 
                              onClick={() => { if (onReviewClick) onReviewClick(tx._id); }} 
                            />
                          )}
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

      <div className="table-footer" style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
        <a 
          href="#" 
          className="view-all-link" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Minimize Audit Trail' : 'View Full Audit Trail'} <ArrowRight size={16} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
        </a>
        <div className="engine-status" style={{ position: 'fixed', bottom: '24px', right: '32px', zIndex: 30, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#111827', padding: '10px 20px', borderRadius: '9999px', color: '#F9FAFB', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.025em', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'default', animation: 'floatBubble 3s ease-in-out infinite' }}>
           <span style={{ color: '#9CA3AF', fontWeight: 500 }}>ENGINE STATUS</span> 
           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', opacity: pulse ? 1 : 0.4, transition: 'opacity 0.15s ease-in', boxShadow: pulse ? '0 0 8px #10B981' : 'none' }}></div>
           SENTINEL-X AI ACTIVE
        </div>
      </div>
    </div>
    </>
  );
}
