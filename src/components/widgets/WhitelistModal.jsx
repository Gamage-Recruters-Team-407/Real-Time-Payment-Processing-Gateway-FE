import { X, ShieldHalf, AlertTriangle } from 'lucide-react';

export default function WhitelistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <ShieldHalf size={20} className="text-muted" />
            <span>Add to Whitelist</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-prompt">Are you sure you want to whitelist this entity?</p>

          <div className="entity-summary-box">
            <div className="summary-grid">
              <div>
                <div className="summary-label">ID</div>
                <div className="summary-value">GP-8839-XXXX</div>
              </div>
              <div>
                <div className="summary-label">TYPE</div>
                <div className="summary-value font-normal">Merchant Account</div>
              </div>
            </div>
            
            <div className="summary-risk">
              <div className="summary-label" style={{ marginBottom: '4px' }}>RISK SCORE</div>
              <div className="risk-bar-container">
                <span className="risk-badge">94%</span>
                <div className="risk-bar">
                  <div className="risk-fill" style={{ width: '94%', backgroundColor: '#9F1239' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.65rem' }}>REASON FOR WHITELISTING</label>
            <textarea 
              placeholder="Verified legitimate merchant. False positive." 
              className="whitelist-textarea"
            ></textarea>
          </div>

          <div className="warning-box">
            <AlertTriangle size={18} className="text-warning" />
            <p>
              This entity will be marked as <span style={{ fontWeight: 700, color: '#D97706' }}>TRUSTED</span> and will not trigger future fraud alerts.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm">Confirm Whitelist</button>
        </div>
      </div>
    </>
  );
}
