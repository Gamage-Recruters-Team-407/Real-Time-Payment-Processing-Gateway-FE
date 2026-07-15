import { useState, useEffect } from 'react';
import { FileSearch, AlertCircle } from 'lucide-react';
import { getAlertById } from '../../services/fraudApi';
import { startInvestigation } from '../../services/investigationApi';

export default function ReviewModal({ isOpen, onClose, targetId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      getAlertById(targetId)
        .then(res => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
      setNotes('');
    }
  }, [isOpen, targetId]);

  const handleConfirm = async () => {
    try {
      await startInvestigation(targetId, { 
        assignedTo: 'Analyst #1', 
        priority: 'MEDIUM',
        notes: notes 
      });
      onClose();
    } catch (err) {
      console.error("Failed to start investigation", err);
      alert("Failed to start investigation");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200 }}></div>
      <div className="modal-container" style={{ zIndex: 210 }}>
        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FileSearch size={20} color="#D97706" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>Review Case</span>
          </div>
          <p className="modal-prompt" style={{ color: '#4B5563', fontWeight: 500, marginBottom: '24px' }}>
            Are you sure you want to initiate a formal review for this case?
          </p>

          {loading ? (
            <p>Loading case details...</p>
          ) : data ? (
          <div className="entity-summary-box" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="summary-label">CASE REFERENCE</div>
              <div className="summary-value" style={{ fontFamily: 'monospace' }}>{data.transactionDetails?.id || 'UNKNOWN'}</div>
            </div>
            
            <div className="summary-grid" style={{ marginBottom: '16px' }}>
              <div>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Status</div>
                <div className="summary-value font-normal">Pending Review</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Priority</div>
                <div className="summary-value" style={{ color: '#D97706' }}>MEDIUM</div>
              </div>
            </div>

            <div className="summary-grid" style={{ marginBottom: 0 }}>
              <div>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Risk Score</div>
                <div className="risk-bar-container" style={{ marginTop: '4px' }}>
                  <span className="risk-badge" style={{ backgroundColor: 'transparent', padding: 0, fontSize: '0.8rem', color: '#D97706' }}>
                    {Math.round(data.riskInformation?.riskScore || 0)}%
                  </span>
                  <div className="risk-bar" style={{ width: '80px', height: '4px' }}>
                    <div className="risk-fill" style={{ width: `${Math.min(data.riskInformation?.riskScore || 0, 100)}%`, backgroundColor: '#F59E0B' }}></div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="summary-label" style={{ textTransform: 'none', fontWeight: 500, color: '#6B7280' }}>Amount</div>
                <div className="summary-value" style={{ fontFamily: 'monospace' }}>${data.transactionDetails?.amount?.toFixed(2)}</div>
              </div>
            </div>
          </div>
          ) : (
            <p className="text-danger">Failed to load transaction data.</p>
          )}

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.65rem' }}>REASON FOR REVIEW <span style={{ color: '#D97706' }}>*</span></label>
            <textarea 
              placeholder="Provide initial observations (e.g., unusual geographic login, inconsistent purchasing behavior...)" 
              className="whitelist-textarea"
              style={{ minHeight: '100px', borderColor: '#FDE68A' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="warning-box" style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}>
            <AlertCircle size={18} className="text-muted" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#4B5563', fontWeight: 500 }}>
              This case will be assigned to you and its status will change to "Under Review".
            </p>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm} disabled={loading || !data} style={{ backgroundColor: '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileSearch size={14} /> Confirm Review
          </button>
        </div>
      </div>
    </>
  );
}
