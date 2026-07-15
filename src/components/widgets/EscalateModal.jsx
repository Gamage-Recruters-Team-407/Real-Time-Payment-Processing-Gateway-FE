import { AlertTriangle } from 'lucide-react';

export default function EscalateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200 }}></div>
      <div className="modal-container" style={{ zIndex: 210 }}>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#9F1239" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9F1239' }}>Escalate Case</span>
          </div>
          <p className="modal-prompt" style={{ color: '#4B5563', fontWeight: 500, marginBottom: '24px' }}>
            Are you sure you want to escalate this case?
          </p>

          <div className="entity-summary-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="summary-label">CASE REFERENCE</div>
              <div className="summary-value" style={{ fontFamily: 'monospace' }}>INV-2026-0842</div>
            </div>
            
            <div className="summary-grid" style={{ marginBottom: '16px' }}>
              <div>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Status</div>
                <div className="summary-value font-normal">Under Review</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Priority</div>
                <div className="summary-value" style={{ color: '#9F1239' }}>HIGH</div>
              </div>
            </div>

            <div className="summary-grid" style={{ marginBottom: 0 }}>
              <div>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Risk Score</div>
                <div className="risk-bar-container" style={{ marginTop: '4px' }}>
                  <span className="risk-badge" style={{ backgroundColor: 'transparent', padding: 0, fontSize: '0.8rem' }}>94%</span>
                  <div className="risk-bar" style={{ width: '80px', height: '4px' }}>
                    <div className="risk-fill" style={{ width: '94%', backgroundColor: '#9F1239' }}></div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Amount</div>
                <div className="summary-value" style={{ fontFamily: 'monospace' }}>$4,950.00</div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.65rem' }}>REASON FOR ESCALATION <span style={{ color: '#9F1239' }}>*</span></label>
            <textarea 
              placeholder="Provide detailed justification for senior review (e.g., suspicious IP velocity, high-value cross-border pattern matching...)" 
              className="whitelist-textarea"
              style={{ minHeight: '100px' }}
            ></textarea>
          </div>

          <div className="warning-box">
            <AlertTriangle size={18} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#D97706', fontWeight: 500 }}>
              Case will be assigned to Senior Analyst #1 and priority set to CRITICAL. This action cannot be undone by junior staff.
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" style={{ backgroundColor: '#9F1239', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Confirm Escalate
          </button>
        </div>
      </div>
    </>
  );
}
