import { useState, useEffect } from 'react';
import { Filter, Flag, MoreHorizontal, ArrowRight, CheckCircle2, AlertTriangle, Trash2, Download } from 'lucide-react';

export default function RealTimeEventStream({ transactions = [], onReviewClick, onInvestigateClick, onFreezeClick, onReleaseClick, onDeleteClick, onTransactionSelect }) {
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
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  const displayTransactions = isExpanded ? sortedTransactions : sortedTransactions.slice(0, 5);

  const handleExport = () => {
    if (!transactions || transactions.length === 0) return;
    
    const headers = ['Timestamp', 'Account ID', 'Amount', 'Merchant', 'Risk Score', 'Status'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(tx => {
      const riskScore = tx.riskScore || 0;
      let computedStatus = tx.status;
      if (tx.whitelisted) {
        computedStatus = 'WHITELISTED';
      } else if (tx.actions && tx.actions.length > 0) {
        const lastAction = tx.actions[tx.actions.length - 1].action;
        if (lastAction === 'BLOCK' || lastAction === 'FREEZE') {
          computedStatus = 'BLOCKED';
        } else if (lastAction === 'RELEASE') {
          computedStatus = 'CLEARED';
        }
      }
      const row = [
        tx.createdAt ? new Date(tx.createdAt).toISOString() : new Date().toISOString(),
        tx.userId || 'Unknown',
        tx.amount || 0,
        `"${tx.merchant || 'Unknown'}"`,
        Math.round(riskScore) + '%',
        computedStatus
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `processed transaction.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
           <button 
             onClick={handleExport}
             style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #E5E7EB', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#374151', backgroundColor: '#F9FAFB', cursor: 'pointer' }}
           >
             <Download size={14} /> EXPORT CSV
           </button>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #10B981', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#059669', backgroundColor: 'rgba(16,185,129,0.05)' }}>
             <div className="engine-dot" style={{ opacity: pulse ? 1 : 0.4, transition: 'opacity 0.2s ease-in-out' }}></div>
             LIVE MONITORING
           </div>
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
            {displayTransactions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px 16px', color: '#6B7280' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={32} color="#10B981" opacity={0.6} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>No processed transactions found</span>
                    <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>When you review or investigate alerts, they will appear here as an audit log.</span>
                  </div>
                </td>
              </tr>
            ) : displayTransactions.map((tx, i) => {
              let computedStatus = tx.status;
              let action = 'MORE';
              
              if (tx.riskScore > 80) {
                action = 'INVESTIGATE';
              } else if (tx.riskScore >= 50) {
                action = 'REVIEW';
              } else {
                action = 'MORE';
              }

              // If it's already been reviewed/investigated
              if (tx.whitelisted) {
                computedStatus = 'WHITELISTED';
                if (!tx.actions || tx.actions.length === 0) {
                  action = 'AUTO-CLEARED';
                } else {
                  action = tx.investigation?.caseId ? 'RE-INVESTIGATE' : 'RE-REVIEW';
                }
              } else if (tx.actions && tx.actions.length > 0) {
                const lastAction = tx.actions[tx.actions.length - 1].action;
                if (lastAction === 'BLOCK' || lastAction === 'FREEZE') {
                  computedStatus = 'BLOCKED';
                } else if (lastAction === 'RELEASE') {
                  computedStatus = 'CLEARED';
                }
                action = tx.investigation?.caseId ? 'RE-INVESTIGATE' : 'RE-REVIEW';
              } else if (computedStatus === 'BLOCKED') {
                action = 'AUTO-BLOCKED';
              }

              const isAlert = computedStatus === 'HIGH_RISK' || computedStatus === 'BLOCKED' || computedStatus === 'UNDER_REVIEW' || computedStatus === 'FLAGGED' || computedStatus === 'WHITELISTED';
              const statusType = computedStatus === 'BLOCKED' ? 'blocked' : (computedStatus === 'HIGH_RISK' ? 'danger' : ((computedStatus === 'MEDIUM_RISK' || computedStatus === 'REVIEW' || computedStatus === 'UNDER_REVIEW' || computedStatus === 'FLAGGED') ? 'warning' : 'yellow'));
              
              // Extract HH:mm:ss.SSS from ISO string if possible, else fallback
              const timeString = tx.createdAt ? new Date(tx.createdAt).toISOString().slice(11, 23) : '00:00:00.000';
              const rowClass = isAlert ? 'row-danger' : '';

              return (
                <tr 
                  key={tx._id || i} 
                  className={`event-row ${rowClass}`}
                  onClick={() => onTransactionSelect && onTransactionSelect(tx)}
                  style={{ cursor: onTransactionSelect ? 'pointer' : 'default' }}
                >
                  <td className="cell-timestamp">{timeString}</td>
                  <td className="cell-account">
                    <div className="cell-account-inner">
                      {tx.userId || 'Unknown'} 
                      {isAlert && <AlertTriangle size={14} color="#9F1239" style={{ marginLeft: '8px' }} />}
                    </div>
                  </td>
                  <td className="cell-transaction">
                    <div className="cell-transaction-inner">
                      <span className="tx-amount">Rs. {tx.amount?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}</span>
                      <span className="tx-merchant" style={{ textTransform: 'uppercase' }}>Merchant: {tx.merchant}</span>
                    </div>
                  </td>
                  <td>
                    <div className="risk-bar-container">
                      <div className="risk-bar">
                        <div className="risk-fill" style={{ 
                          width: `${tx.riskScore}%`,
                          backgroundColor: tx.riskScore > 80 ? '#DC2626' : tx.riskScore >= 50 ? '#F97316' : '#EAB308'
                        }}></div>
                      </div>
                      <span className="risk-score-text" style={{ color: tx.riskScore > 80 ? '#DC2626' : tx.riskScore >= 50 ? '#F97316' : '#EAB308' }}>
                        {tx.riskScore === 100 ? 'MAX' : `${String(Math.round(tx.riskScore)).padStart(2, '0')}%`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={
                      `badge ` + 
                      (statusType === 'danger' ? 'badge-danger ' : '') + 
                      (statusType === 'yellow' ? 'badge-yellow ' : '') + 
                      (statusType === 'warning' ? 'badge-warning ' : '')
                    } style={statusType === 'blocked' ? { backgroundColor: 'transparent', color: '#E11D48', padding: 0 } : {}}>
                      {statusType === 'blocked' && <span style={{ marginRight: '4px' }}>⊘</span>}
                      {computedStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {action === 'MORE' ? (
                        <button className="btn-action icon-only"><MoreHorizontal size={14} /></button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            className={`btn-action`}
                            style={{
                              color: tx.riskScore > 80 ? '#DC2626' : tx.riskScore >= 50 ? '#F97316' : '#EAB308',
                              borderColor: tx.riskScore > 80 ? '#DC2626' : tx.riskScore >= 50 ? '#F97316' : '#EAB308',
                              minWidth: '135px'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if ((action === 'REVIEW NOW' || action === 'REVIEW' || action === 'RE-REVIEW' || action === 'AUTO-CLEARED' || action === 'AUTO-BLOCKED') && onReviewClick) onReviewClick(tx._id);
                              else if ((action === 'INVESTIGATE' || action === 'RE-INVESTIGATE') && onInvestigateClick) onInvestigateClick(tx._id);
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
                              onClick={(e) => { e.stopPropagation(); if (onReviewClick) onReviewClick(tx._id); }} 
                            />
                          )}
                          <button 
                            className="btn-action icon-only btn-delete" 
                            style={{ color: '#9CA3AF', border: '1px solid transparent', cursor: 'pointer' }} 
                            title="Delete Transaction"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDeleteClick) onDeleteClick(tx._id);
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
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
           ACTIVE
        </div>
      </div>
    </div>
    </>
  );
}
