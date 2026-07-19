import { useState, useEffect } from 'react';
import { X, ShieldHalf, AlertTriangle } from 'lucide-react';
import { getAlertById, addToWhitelist } from '../../services/fraudApi';
import { useAuth } from '../../context/AuthContext';

export default function WhitelistModal({ isOpen, onClose, targetId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const { user } = useAuth();

  const getAnalystName = () => {
    if (!user) return "Analyst";
    if (user.name) return user.name;
    if (user.fullName) return user.fullName;
    if (user.fullname) return user.fullname;
    if (user.displayName) return user.displayName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    if (user.email) return user.email.split("@")[0];
    return "Analyst";
  };

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      getAlertById(targetId)
        .then(res => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
      setReason('');
    }
  }, [isOpen, targetId]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    try {
      setSubmitting(true);
      const entityId = data?.transactionDetails?.userId || data?.accountId || data?.userId || targetId;
      await addToWhitelist({
        entityType: 'ACCOUNT', 
        entityId: entityId,
        reason: reason,
        performedBy: getAnalystName()
      });
      // Optionally trigger a parent reload here if needed
      onClose(true);
    } catch (err) {
      console.error(err);
      alert('Failed to whitelist entity.');
    } finally {
      setSubmitting(false);
    }
  };

  const riskScore = data?.riskInformation?.riskScore || data?.riskScore || 0;
  const transactionId = data?.transactionDetails?.id || targetId || 'Loading...';
  const accountId = data?.transactionDetails?.userId || data?.accountId || data?.userId || 'Unknown';

  return (
    <>
      <div className="modal-backdrop" onClick={() => onClose(false)} style={{ zIndex: 300 }}></div>
      <div className="modal-container" style={{ zIndex: 310 }}>
        <div className="modal-header">
          <div className="modal-title">
            <ShieldHalf size={20} className="text-muted" />
            <span>Add to Whitelist</span>
          </div>
          <button className="modal-close" onClick={() => onClose(false)} disabled={submitting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-prompt">Are you sure you want to whitelist this entity?</p>

          <div className="entity-summary-box">
            <div className="summary-grid">
              <div>
                <div className="summary-label">ID</div>
                <div className="summary-value">{transactionId}</div>
              </div>
              <div>
                <div className="summary-label">ACCOUNT ID</div>
                <div className="summary-value font-normal">{accountId}</div>
              </div>
            </div>
            
            <div className="summary-risk">
              <div className="summary-label" style={{ marginBottom: '4px' }}>RISK SCORE</div>
              <div className="risk-bar-container">
                <span className="risk-badge">{Math.round(riskScore)}%</span>
                <div className="risk-bar">
                  <div className="risk-fill" style={{ width: `${Math.min(riskScore, 100)}%`, backgroundColor: riskScore > 80 ? '#9F1239' : '#F59E0B' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.65rem' }}>REASON FOR WHITELISTING</label>
            <textarea 
              placeholder="Verified legitimate merchant. False positive." 
              className="whitelist-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={submitting}
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
          <button className="btn-cancel" onClick={() => onClose(false)} disabled={submitting}>Cancel</button>
          <button 
            className="btn-confirm" 
            onClick={handleConfirm}
            disabled={submitting || !reason.trim()}
          >
            {submitting ? 'Processing...' : 'Confirm Whitelist'}
          </button>
        </div>
      </div>
    </>
  );
}
