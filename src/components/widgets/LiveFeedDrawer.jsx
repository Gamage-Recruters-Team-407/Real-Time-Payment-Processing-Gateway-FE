import { X } from 'lucide-react';

export default function LiveFeedDrawer({ isOpen, onClose, onInvestigateClick, onReviewClick }) {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      timestamp: '14:02:49',
      account: 'GP-8839-XXXX',
      amount: '$ 4,950.00',
      merchant: 'Merchant: UNK_TECH_HKG',
      riskScore: 94,
      riskLabel: '94% RISK',
      reason: 'Multiple transactions in short time window',
      type: 'danger',
      actions: [
        { label: 'INVESTIGATE', type: 'dark-red' },
        { label: 'FREEZE', type: 'outline-red' },
        { label: 'DISMISS', type: 'text' }
      ]
    },
    {
      id: 2,
      timestamp: '14:02:41',
      account: 'GP-1039-XXXX',
      amount: '$ 890.00',
      merchant: 'Merchant: CRYPTO_GATE_IE',
      riskScore: 62,
      riskLabel: '62% RISK',
      reason: 'Unusual geographic location detected',
      type: 'warning',
      actions: [
        { label: 'INVESTIGATE', type: 'dark' },
        { label: 'REVIEW', type: 'outline-yellow' },
        { label: 'DISMISS', type: 'text' }
      ]
    },
    {
      id: 3,
      timestamp: '14:02:38',
      account: 'GP-5512-XXXX',
      amount: '$ 12,000.00',
      merchant: 'Merchant: LUX_RETAIL_LON',
      riskScore: 100,
      riskLabel: 'MAX RISK',
      reason: 'Amount exceeds threshold by 140%',
      type: 'danger',
      actions: [
        { label: 'INVESTIGATE', type: 'dark' },
        { label: 'BLOCK', type: 'dark-red' },
        { label: 'DISMISS', type: 'text' }
      ]
    },
    {
      id: 4,
      timestamp: '14:02:45',
      account: 'GP-2201-XXXX',
      amount: '$ 22.40',
      merchant: 'Merchant: STARBUCKS_SEA',
      riskScore: 2,
      riskLabel: '02% RISK',
      reason: 'Normal transaction pattern - Cleared by system',
      type: 'success',
      actions: [
        { label: 'CLEARED', type: 'full-green' }
      ]
    },
    {
      id: 5,
      timestamp: '14:02:45',
      account: 'GP-2201-XXXX',
      amount: '$ 22.40',
      merchant: 'Merchant: STARBUCKS_SEA',
      riskScore: 2,
      riskLabel: '02% RISK',
      reason: 'Normal transaction pattern - Cleared by system',
      type: 'success',
      actions: [
        { label: 'CLEARED', type: 'full-green' }
      ]
    }
  ];

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
              <span style={{ marginLeft: '12px' }}>SHOWING 4 OF 12 ALERTS</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-card border-${alert.type}`}>
              <div className="alert-top">
                <span className="alert-time">{alert.timestamp}</span>
                <span className={`alert-badge badge-${alert.type}`}>{alert.riskLabel}</span>
              </div>
              <div className="alert-account">{alert.account}</div>
              <div className="alert-amount">{alert.amount}</div>
              <div className="alert-merchant">{alert.merchant}</div>
              <div className={`alert-reason text-${alert.type}`}>{alert.reason}</div>
              
              <div className="alert-actions">
                {alert.actions.map((action, i) => (
                  <button 
                    key={i} 
                    className={`alert-btn btn-${action.type}`}
                    style={action.type.startsWith('full') ? { width: '100%' } : {}}
                    onClick={action.label === 'INVESTIGATE' ? onInvestigateClick : action.label === 'REVIEW' ? onReviewClick : undefined}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
