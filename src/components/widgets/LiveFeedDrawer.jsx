import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts } from '../../redux/slices/alertsSlice';

export default function LiveFeedDrawer({ isOpen, onClose, onInvestigateClick, onReviewClick }) {
  const dispatch = useDispatch();
  const { items: alerts, loading } = useSelector(state => state.alerts);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAlerts());
    }
  }, [isOpen, dispatch]);

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
          {alerts.map((alert) => {
            const riskScore = alert.riskScore || 0;
            const type = riskScore > 80 ? 'danger' : riskScore > 40 ? 'warning' : 'success';
            
            return (
            <div key={alert.id || alert.transactionId} className={`alert-card border-${type}`}>
              <div className="alert-top">
                <span className="alert-time">{alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}</span>
                <span className={`alert-badge badge-${type}`}>{Math.round(riskScore)}% RISK</span>
              </div>
              <div className="alert-account">{alert.accountId || 'Unknown Account'}</div>
              <div className="alert-amount">$ {alert.amount?.toFixed(2) || '0.00'}</div>
              <div className="alert-merchant">Merchant: {alert.merchant || 'Unknown'}</div>
              <div className={`alert-reason text-${type}`}>{alert.alertReason || 'Suspicious activity detected'}</div>
              
              <div className="alert-actions">
                {type === 'danger' && (
                  <>
                    <button className="alert-btn btn-dark-red" onClick={() => onInvestigateClick(alert.id)}>INVESTIGATE</button>
                    <button className="alert-btn btn-outline-red">BLOCK</button>
                  </>
                )}
                {type === 'warning' && (
                  <>
                    <button className="alert-btn btn-dark" onClick={() => onInvestigateClick(alert.id)}>INVESTIGATE</button>
                    <button className="alert-btn btn-outline-yellow" onClick={() => onReviewClick(alert.id)}>REVIEW</button>
                  </>
                )}
                {type === 'success' && (
                  <button className="alert-btn btn-full-green">CLEARED</button>
                )}
              </div>
            </div>
          )})}
        </div>

        <div className="drawer-footer">
          <button className="drawer-footer-btn btn-dark-red">
            VIEW ALL ALERTS →
          </button>
          <button className="drawer-footer-btn btn-outline-dark">
            EXPORT ALERTS
          </button>
        </div>
      </div>
    </>
  );
}
