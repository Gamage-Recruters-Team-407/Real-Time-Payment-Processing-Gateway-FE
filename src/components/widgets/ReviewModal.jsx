import { useState, useEffect } from 'react';
import { Eye, X, Globe, MapPin, AlertTriangle, CheckCircle, Flag, Ban, FileText } from 'lucide-react';
import { getAlertById, handleTransactionAction } from '../../services/fraudApi';
import { startInvestigation } from '../../services/investigationApi';

export default function ReviewModal({ isOpen, onClose, targetId, onActionComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
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

  const handleSuccess = () => {
    if (onActionComplete) onActionComplete();
    else onClose();
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await handleTransactionAction(targetId, { action: 'RELEASE', notes, performedBy: 'Analyst #1' });
      handleSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to approve transaction');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlag = async () => {
    try {
      setActionLoading(true);
      await startInvestigation(targetId, { assignedTo: 'Analyst #1', priority: 'MEDIUM', notes });
      handleSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to flag transaction for investigation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      setActionLoading(true);
      await handleTransactionAction(targetId, { action: 'BLOCK', notes, performedBy: 'Analyst #1' });
      handleSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to block transaction');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 200, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
      <div className="modal-container" style={{ zIndex: 210, width: '520px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #FCA5A5', backgroundColor: '#fff', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontWeight: 700, fontSize: '1.2rem' }}>
            <Eye size={22} /> Review Transaction
          </div>
          <button onClick={onClose} style={{ color: '#6B7280' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', backgroundColor: '#fff', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p>Loading...</p>
          ) : data ? (
            <>
              {/* Properties Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>TRANSACTION ID</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 500 }}>{data.transactionDetails?.id || targetId || 'UNKNOWN'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>AMOUNT</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700 }}>${data.transactionDetails?.amount?.toFixed(2) || '0.00'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>MERCHANT</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 500 }}>{data.transactionDetails?.merchant || 'UNKNOWN'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>RISK SCORE</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#FEF3C7', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${data.riskInformation?.riskScore || 0}%`, height: '100%', backgroundColor: '#D97706' }}></div>
                    </div>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {Math.round(data.riskInformation?.riskScore || 0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>IP ADDRESS</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={14} color="#6B7280" /> {data.transactionDetails?.ip || '0.0.0.0'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>IP LOCATION</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    {data.transactionDetails?.location || 'Unknown'} <MapPin size={14} color="#6B7280" />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#FCA5A5', letterSpacing: '1px', marginBottom: '4px' }}>TIMESTAMP (SERVER TIME)</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 500 }}>
                    {data.timestamp ? new Date(data.timestamp).toISOString().split('T')[1].replace('Z','') : '14:02:41.882'}
                  </div>
                </div>
              </div>

              {/* Alert Box */}
              <div style={{ border: '1px solid #FECACA', backgroundColor: '#FFF5F5', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <AlertTriangle size={20} color="#9F1239" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9F1239', letterSpacing: '1px', marginBottom: '4px' }}>ALERT TRIGGERED</div>
                  <div style={{ color: '#881337', fontWeight: 500, fontSize: '0.95rem' }}>{data.riskInformation?.alertReason || data.alertReason || 'Unusual geographic location detected'}</div>
                </div>
              </div>

              {/* Quick Notes */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4B5563', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={12} /> QUICK NOTES (OPTIONAL)
                </div>
                <textarea 
                  placeholder="Add internal commentary for the audit trail..." 
                  style={{ width: '100%', minHeight: '80px', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '12px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', color: '#1F2937' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              {/* Warning Box */}
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="#D97706" />
                <span style={{ color: '#D97706', fontWeight: 600, fontSize: '0.8rem' }}>⚠️ Quick review only. For complex cases, use INVESTIGATE</span>
              </div>
            </>
          ) : (
            <p>Failed to load data.</p>
          )}
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#FEF2F2', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FEE2E2', flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: '8px 20px', backgroundColor: 'white', border: '1px solid #9CA3AF', borderRadius: '6px', color: '#4B5563', fontWeight: 600, fontSize: '0.85rem' }}>
            Cancel
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleApprove}
              disabled={!data || actionLoading}
              style={{ backgroundColor: '#10B981', color: 'white', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: (!data || actionLoading) ? 0.6 : 1 }}
            >
              <CheckCircle size={16} /> MARK SAFE
            </button>
            <button 
              onClick={handleFlag}
              disabled={!data || actionLoading}
              style={{ backgroundColor: '#D97706', color: 'white', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: (!data || actionLoading) ? 0.6 : 1 }}
            >
              <Flag size={16} /> FLAG
            </button>
            <button 
              onClick={handleBlock}
              disabled={!data || actionLoading}
              style={{ backgroundColor: '#9F1239', color: 'white', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: (!data || actionLoading) ? 0.6 : 1 }}
            >
              <Ban size={16} /> MARK FRAUD
            </button>
          </div>
        </div>
        
      </div>
    </>
  );
}
