import { useState, useEffect } from 'react';
import { X, Search, Paperclip, FileText, Globe, User } from 'lucide-react';
import { getAlertById } from '../../services/fraudApi';
import { startInvestigation } from '../../services/investigationApi';

export default function InvestigationDrawer({ isOpen, onClose, targetId, onEscalateClick }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && targetId) {
      setLoading(true);
      getAlertById(targetId)
        .then(res => setData(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [isOpen, targetId]);

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
              <textarea placeholder="Add investigation note..." className="note-textarea"></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn-attachment">
                  <Paperclip size={14} /> Add Attachment
                </button>
              </div>
            </div>
          </div>

          {/* Available Evidence */}
          <div className="section-block">
            <div className="section-title" style={{ fontSize: '0.85rem' }}>Available Evidence</div>
            <div className="evidence-buttons">
              <button className="btn-evidence"><FileText size={14} /> Transaction Log</button>
              <button className="btn-evidence"><Globe size={14} /> IP Log</button>
              <button className="btn-evidence"><User size={14} /> Merchant Profile</button>
            </div>
          </div>

          {/* Case History */}
          <div className="section-block">
            <div className="section-title" style={{ fontSize: '0.85rem' }}>Case History</div>
            <div className="timeline">
              {data.actionHistory?.map((act, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${act === 'FREEZE' || act === 'BLOCK' ? 'dot-danger' : 'dot-success'}`}></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Action taken: {act}</div>
                    <div className="timeline-time">Completed</div>
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
          <button className="drawer-footer-btn" style={{ backgroundColor: '#10B981', color: 'white', border: 'none' }}>APPROVE</button>
          <button className="drawer-footer-btn" style={{ backgroundColor: '#9F1239', color: 'white', border: 'none' }}>BLOCK</button>
          <button className="drawer-footer-btn" style={{ backgroundColor: '#F59E0B', color: 'white', border: 'none' }} onClick={onEscalateClick}>ESCALATE</button>
          <button className="drawer-footer-btn" style={{ backgroundColor: 'white', color: '#6B7280', border: '1px solid #E5E7EB' }}>CLOSE CASE</button>
        </div>
      </div>
    </>
  );
}
