import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts } from '../../redux/slices/alertsSlice';

export default function LiveFeedDrawer({ isOpen, onClose, onInvestigateClick, onReviewClick, onCardClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: alerts, loading } = useSelector(state => state.alerts);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAlerts());
    }
  }, [isOpen, dispatch]);

  const handleViewAll = () => {
    if (onClose) onClose();
    navigate('/fraud-detection');
  };

  const handleExport = () => {
    if (!alerts || alerts.length === 0) return;
    
    const headers = ['Timestamp', 'Account', 'Amount', 'Merchant', 'Risk Score', 'Reason'];
    const csvRows = [headers.join(',')];
    
    alerts.forEach(alert => {
      const row = [
        new Date(alert.timestamp).toISOString(),
        alert.accountId || 'Unknown',
        alert.amount || 0,
        `"${alert.merchant || 'Unknown'}"`,
        Math.round(alert.riskScore || 0) + '%',
        `"${alert.alertReason || ''}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'unprocessed transaction.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;


  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}></div>
      <div className="drawer-panel">
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">
              LIVE FEED <span className="drawer-dot"></span>
            </h2>
            <div className="drawer-subtitle">
              <span>AUTO-REFRESH: 5S</span>
              <span style={{ marginLeft: '12px' }}>SHOWING {alerts.length} ALERTS</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {loading && alerts.length === 0 ? <p style={{color: 'white', padding: '20px'}}>Loading alerts...</p> : null}
          {[...alerts].sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }).map((alert) => {
            const riskScore = alert.riskScore || 0;
            const type = riskScore >= 80 ? 'danger' : riskScore >= 50 ? 'warning' : 'yellow';
            
            return (
            <div 
              key={alert.id || alert.transactionId} 
              className={`alert-card border-${type}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (onCardClick) onCardClick(alert);
                if (onClose) onClose();
              }}
            >
              <div className="alert-top">
                <span className="alert-time">{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}</span>
                <span className={`alert-badge badge-${type}`}>{Math.round(riskScore)}% RISK</span>
              </div>
              <div className="alert-account">{alert.accountId || 'Unknown Account'}</div>
              <div className="alert-amount">$ {alert.amount?.toFixed(2) || '0.00'}</div>
              <div className="alert-merchant">Merchant: {alert.merchant || 'Unknown'}</div>
              <div className={`alert-reason text-${type}`}>{alert.alertReason || 'Suspicious activity detected'}</div>
              
              <div className="alert-actions" onClick={(e) => e.stopPropagation()}>
                {type === 'danger' && (
                  <>
                    <button className="alert-btn btn-dark-red" onClick={(e) => { e.stopPropagation(); onInvestigateClick(alert.id); }}>INVESTIGATE</button>
                    <button className="alert-btn btn-outline-red" onClick={(e) => { e.stopPropagation(); onReviewClick(alert.id); }}>REVIEW</button>
                  </>
                )}
                {type === 'warning' && (
                  <>
                    <button className="alert-btn btn-dark-orange" onClick={(e) => { e.stopPropagation(); onInvestigateClick(alert.id); }}>INVESTIGATE</button>
                    <button className="alert-btn btn-outline-orange" onClick={(e) => { e.stopPropagation(); onReviewClick(alert.id); }}>REVIEW</button>
                  </>
                )}
                {type === 'yellow' && (
                  <>
                    <button className="alert-btn btn-dark-yellow" onClick={(e) => { e.stopPropagation(); onInvestigateClick(alert.id); }}>INVESTIGATE</button>
                    <button className="alert-btn btn-outline-yellow" onClick={(e) => { e.stopPropagation(); onReviewClick(alert.id); }}>REVIEW</button>
                  </>
                )}
              </div>
            </div>
          )})}
        </div>

        <div className="drawer-footer">
          <button className="drawer-footer-btn btn-dark-red" onClick={handleExport}>
            EXPORT ALERTS
          </button>
        </div>
      </div>
    </>
  );
}
