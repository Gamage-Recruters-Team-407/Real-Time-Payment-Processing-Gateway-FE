import { useState, useEffect } from 'react';
import { X, Search, Paperclip, FileText, Globe, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAlertById, handleTransactionAction, addToWhitelist } from '../../services/fraudApi';
import { startInvestigation, addInvestigationNote } from '../../services/investigationApi';
import TransactionHistoryModal from './TransactionHistoryModal';
import MerchantProfileModal from './MerchantProfileModal';
import WhitelistModal from './WhitelistModal';

export default function InvestigationDrawer({ isOpen, onClose, targetId, onActionComplete }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [merchantModalOpen, setMerchantModalOpen] = useState(false);
  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false);
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

  const getAvatarInitials = (nameStr) => {
    if (!nameStr) return "SYS";
    if (typeof nameStr === 'string') {
      const names = nameStr.split(" ");
      if (names.length >= 2 && names[0] && names[1]) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return nameStr[0].toUpperCase();
    }
    return "U";
  };

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      getAlertById(targetId)
        .then(res => {
          setData(res);
          // Auto-start investigation if it doesn't exist
          if (!res.investigationData || !res.investigationData.caseId) {
            startInvestigation(targetId, { 
              assignedTo: getAnalystName(), 
              priority: 'MEDIUM', 
              notes: 'Investigation opened' 
            }).then(() => {
              getAlertById(targetId).then(updatedRes => setData(updatedRes));
            }).catch(err => console.error("Failed to auto-start investigation", err));
          }
        })
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
      const analystName = getAnalystName();
      if (data?.investigationData?.caseId) {
        await addInvestigationNote(data.investigationData.caseId, { content: noteText, analyst: analystName });
      } else {
        await startInvestigation(data?.transactionDetails?.id || targetId, { assignedTo: analystName, priority: 'MEDIUM', notes: noteText });
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
      await handleTransactionAction(data.transactionDetails.id, { action: 'RELEASE', notes: 'Approved from investigation', performedBy: getAnalystName() });
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
      await handleTransactionAction(data.transactionDetails.id, { action: 'BLOCK', notes: 'Blocked from investigation', performedBy: getAnalystName() });
      if (onActionComplete) onActionComplete();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to block transaction');
    } finally {
      setActionLoading(null);
    }
  };

  const handleWhitelist = () => {
    setWhitelistModalOpen(true);
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
          
          {loading && <p style={{ padding: '20px', textAlign: 'center' }}>Loading case details...</p>}
          
          {!loading && !data && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
               <AlertTriangle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
               <h3 style={{ marginBottom: '8px' }}>Case Not Found</h3>
               <p>This case may have been deleted or the database was refreshed. Please reload the dashboard or select a valid transaction.</p>
            </div>
          )}

          {!loading && data && (
            <>

          {/* Entity Info Box */}
          <div className="entity-info-box">
            <div className="entity-header">
              <div>
                <div className="entity-account">{data.entityLinks?.accountId || 'Unknown Account'}</div>
                <div className="entity-merchant">{data.transactionDetails?.merchant || 'Merchant Account'}</div>
              </div>
              <div className={`badge ${
                (data.riskInformation?.riskScore >= 80) ? 'badge-danger' :
                (data.riskInformation?.riskScore >= 50) ? 'badge-warning' :
                'badge-yellow'
              }`}>
                {Math.round(data.riskInformation?.riskScore || 0)}% {
                (data.riskInformation?.riskScore >= 80) ? 'HIGH RISK' :
                (data.riskInformation?.riskScore >= 50) ? 'MEDIUM RISK' :
                'LOW RISK'
                }
              </div>
            </div>
            
            <div className="entity-details-grid">
              <div>
                <div className="detail-label">DETECTED TIME</div>
                <div className="detail-value">{new Date(data.transactionDetails?.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div className="detail-label">AMOUNT</div>
                <div className="detail-value">Rs. {data.transactionDetails?.amount?.toFixed(2)}</div>
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
              {data.investigationData?.notes?.map((n, i) => {
                const displayAnalyst = n.analyst === 'Analyst #1' ? getAnalystName() : (n.analyst || 'System');
                return (
                <div key={i} className="note-item">
                  <div className="note-avatar">{getAvatarInitials(displayAnalyst)}</div>
                  <div className="note-content-box" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{displayAnalyst}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {new Date(n.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: '1.5' }}>{n.content}</p>
                  </div>
                </div>
              )})}
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
                onClick={() => setHistoryModalOpen(true)}
              >
                <FileText size={14} /> Transaction History
              </button>
              <button 
                className="btn-evidence"
                onClick={() => setMerchantModalOpen(true)}
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
            style={{ backgroundColor: '#F59E0B', color: 'white', border: 'none', opacity: actionLoading ? 0.6 : 1 }}
            onClick={handleWhitelist}
            disabled={!!actionLoading}
          >
            {actionLoading === 'WHITELIST' ? 'PROCESSING...' : 'WHITELIST'}
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

      <TransactionHistoryModal 
        isOpen={historyModalOpen} 
        onClose={() => setHistoryModalOpen(false)} 
        userId={data?.transactionDetails?.userId || data?.entityLinks?.accountId} 
      />
      <MerchantProfileModal 
        isOpen={merchantModalOpen} 
        onClose={() => setMerchantModalOpen(false)} 
        merchantName={data?.transactionDetails?.merchant} 
      />
      <WhitelistModal
        isOpen={whitelistModalOpen}
        onClose={async (success) => {
          setWhitelistModalOpen(false);
          if (success) {
            // If they successfully whitelisted via the modal, also release the transaction!
            if (data?.transactionDetails?.id) {
              try {
                await handleTransactionAction(data.transactionDetails.id, { 
                  action: 'RELEASE', 
                  notes: 'Whitelisted user', 
                  performedBy: getAnalystName() 
                });
              } catch (e) {
                console.error("Failed to release transaction after whitelisting", e);
              }
            }
            if (onActionComplete) onActionComplete();
            onClose(); // Close the drawer
          }
        }}
        targetId={targetId}
      />
    </>
  );
}
