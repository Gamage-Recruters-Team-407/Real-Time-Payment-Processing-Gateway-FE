import { useState, useEffect } from 'react';
import { X, Search, Paperclip, FileText, Globe, User } from 'lucide-react';
import { getAlertById, handleTransactionAction } from '../../services/fraudApi';
import { startInvestigation, addInvestigationNote } from '../../services/investigationApi';

export default function InvestigationDrawer({ isOpen, onClose, targetId, onEscalateClick, onActionComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      getAlertById(targetId)
        .then(res => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
      setNoteText('');
    }
  }, [isOpen, targetId]);

  const handleSubmitNote = async () => {
    if (!noteText.trim()) return;
    try {
      setNoteLoading(true);
      if (data?.investigationData?.caseId) {
        await addInvestigationNote(data.investigationData.caseId, { content: noteText, analyst: 'Analyst #1' });
      } else {
        await startInvestigation(data?.transactionDetails?.id || targetId, { assignedTo: 'Analyst #1', priority: 'MEDIUM', notes: noteText });
      }
      setNoteText('');
      // Refresh case data
      const res = await getAlertById(targetId);
      setData(res);
      if (onActionComplete) onActionComplete();
    } catch (e) {
      console.error("Failed to submit note", e);
      alert('Failed to submit note');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!data) return;
    try {
      setActionLoading('APPROVE');
      await handleTransactionAction(targetId, { action: 'RELEASE', notes: 'Approved from investigation', performedBy: 'Analyst #1' });
      if (onActionComplete) onActionComplete();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to approve transaction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async () => {
    if (!data) return;
    try {
      setActionLoading('BLOCK');
      await handleTransactionAction(targetId, { action: 'BLOCK', notes: 'Blocked from investigation', performedBy: 'Analyst #1' });
      if (onActionComplete) onActionComplete();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to block transaction');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 60 }}></div>
      <div className="drawer-panel" style={{ zIndex: 70, width: '480px' }}>
        <div className="drawer-header" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} color="#9F1239" />
            <h2 className="drawer-title" style={{ margin: 0, fontSize: '1.125rem' }}>
              Investigation Case #INV-2026-0842
            </h2>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="drawer-content" style={{ padding: '20px', gap: '20px', backgroundColor: '#FFFFFF' }}>
          
          {loading && <p>Loading case details...</p>}
          {!loading && data && (
            <>
          {/* Escalation Warning Banner */}
          {data.riskInformation?.status === 'ESCALATED' && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#9F1239', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.85rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span> This transaction has been escalated and requires senior analyst review.
            </div>
          )}

          {/* Top Form Grid */}
          <div className="investigation-form-grid">
            <div className="form-group">
              <label>CASE STATUS</label>
              <select defaultValue={data.investigationData?.status || 'CREATE'} disabled>
                <option value="CREATE">Pending Creation</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="ESCALATED">Escalated</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label>PRIORITY</label>
              <select defaultValue={data.investigationData?.priority || 'HIGH'} className="text-danger font-bold">
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
              </select>
            </div>
            <div className="form-group">
              <label>ASSIGNED TO</label>
              <select defaultValue={data.investigationData?.assignedTo || 'Unassigned'}>
                <option>Analyst #4</option>
                <option>Analyst #1</option>
                <option>Unassigned</option>
              </select>
            </div>
            <div className="form-group">
              <label>CREATED:</label>
              <div className="created-text">{new Date(data.transactionDetails.timestamp).toLocaleDateString()}</div>
            </div>
          </div>

          {/* Entity Info Box */}
          <div className="entity-info-box">
            <div className="entity-header">
              <div>
                <div className="entity-account">{data.entityLinks?.accountId || 'Unknown Account'}</div>
                <div className="entity-merchant">{data.transactionDetails?.merchant || 'Merchant Account'}</div>
              </div>
              <div className="badge badge-danger">{Math.round(data.riskInformation?.riskScore || 0)}% HIGH RISK</div>
            </div>
            
            <div className="entity-details-grid">
              <div>
                <div className="detail-label">DETECTED TIME</div>
                <div className="detail-value">{new Date(data.transactionDetails?.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div className="detail-label">AMOUNT</div>
                <div className="detail-value">${data.transactionDetails?.amount?.toFixed(2)}</div>
              </div>
            </div>

            <div className="entity-reason">
              <div className="detail-label">RISK REASON</div>
              <div className="detail-value" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                {data.riskInformation?.alertReason || 'Suspicious activity detected.'}
              </div>
            </div>
          </div>

          {/* Investigation Notes */}
          <div className="section-block">
            <div className="section-title">
              <span style={{ fontSize: '1rem', marginRight: '8px' }}>≡</span> Investigation Notes
            </div>
            
            <div className="notes-list">
              {data.investigationData?.notes?.map((n, i) => (
                <div key={i} className="note-item">
                  <div className="note-avatar">{n.analyst?.substring(0, 2) || 'SYS'}</div>
                  <div className="note-content-box">
                    <p>{n.content}</p>
                    <span className="note-time">{new Date(n.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {!data.investigationData?.notes?.length && <p className="text-muted" style={{fontSize: '0.8rem'}}>No notes yet.</p>}
            </div>

            <div className="add-note-container">
              <textarea 
                placeholder="Add investigation note..." 
                className="note-textarea"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button 
                  className="btn-evidence" 
                  style={{ backgroundColor: '#6C1E20', color: 'white' }}
                  onClick={handleSubmitNote}
                  disabled={noteLoading || !noteText.trim()}
                >
                  {noteLoading ? 'Submitting...' : 'Submit Note'}
                </button>
              </div>
            </div>
          </div>

          {/* Available Evidence */}
          <div className="section-block">
            <div className="section-title" style={{ fontSize: '0.85rem' }}>Available Evidence</div>
            <div className="evidence-buttons">
              <button 
                className="btn-evidence"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `evidence_${data.transactionDetails?.id || targetId}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <FileText size={14} /> Transaction Log
              </button>
              <button 
                className="btn-evidence"
                onClick={() => window.open(`https://whatismyipaddress.com/ip/${data.transactionDetails?.ip || ''}`, '_blank')}
              >
                <Globe size={14} /> IP Log
              </button>
              <button 
                className="btn-evidence"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(data.transactionDetails?.merchant || '')}`, '_blank')}
              >
                <User size={14} /> Merchant Profile
              </button>
            </div>
          </div>

          {/* Case History */}
          <div className="section-block">
            <div className="section-title" style={{ fontSize: '0.85rem' }}>Case History</div>
            <div className="timeline">
              {data.actionHistory?.map((act, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${act?.action === 'FREEZE' || act?.action === 'BLOCK' ? 'dot-danger' : 'dot-success'}`}></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Action taken: {typeof act === 'string' ? act : act?.action || 'UNKNOWN'}</div>
                    <div className="timeline-time">{act?.timestamp ? new Date(act.timestamp).toLocaleString() : 'Completed'}</div>
                  </div>
                </div>
              ))}
              <div className="timeline-item">
                <div className="timeline-dot dot-neutral"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Case Initialized</div>
                  <div className="timeline-time">{new Date(data.transactionDetails?.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px' }}>
          <button 
            className="drawer-footer-btn" 
            style={{ backgroundColor: '#10B981', color: 'white', border: 'none', opacity: actionLoading ? 0.6 : 1 }}
            onClick={handleApprove}
            disabled={!!actionLoading}
          >
            {actionLoading === 'APPROVE' ? 'PROCESSING...' : 'MARK SAFE'}
          </button>
          <button 
            className="drawer-footer-btn" 
            style={{ backgroundColor: '#9F1239', color: 'white', border: 'none', opacity: actionLoading ? 0.6 : 1 }}
            onClick={handleBlock}
            disabled={!!actionLoading}
          >
            {actionLoading === 'BLOCK' ? 'PROCESSING...' : 'MARK FRAUD'}
          </button>
          <button 
            className="drawer-footer-btn" 
            style={{ backgroundColor: data?.riskInformation?.status === 'ESCALATED' ? '#F3F4F6' : '#F59E0B', color: data?.riskInformation?.status === 'ESCALATED' ? '#9CA3AF' : 'white', border: 'none', cursor: data?.riskInformation?.status === 'ESCALATED' ? 'not-allowed' : 'pointer' }} 
            onClick={data?.riskInformation?.status === 'ESCALATED' ? undefined : onEscalateClick}
            disabled={data?.riskInformation?.status === 'ESCALATED'}
          >
            {data?.riskInformation?.status === 'ESCALATED' ? 'ALREADY ESCALATED' : 'ESCALATE'}
          </button>
          <button 
            className="drawer-footer-btn" 
            style={{ backgroundColor: 'white', color: '#6B7280', border: '1px solid #E5E7EB' }}
            onClick={onClose}
          >
            CLOSE CASE
          </button>
        </div>
      </div>
    </>
  );
}
