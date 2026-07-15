import { X, Search, Paperclip, FileText, Globe, User } from 'lucide-react';

export default function InvestigationDrawer({ isOpen, onClose, onEscalateClick }) {
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
          
          {/* Top Form Grid */}
          <div className="investigation-form-grid">
            <div className="form-group">
              <label>CASE STATUS</label>
              <select defaultValue="Under Review">
                <option>Under Review</option>
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label>PRIORITY</label>
              <select defaultValue="HIGH" className="text-danger font-bold">
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
            <div className="form-group">
              <label>ASSIGNED TO</label>
              <select defaultValue="Analyst #4">
                <option>Analyst #4</option>
                <option>Analyst #1</option>
                <option>Unassigned</option>
              </select>
            </div>
            <div className="form-group">
              <label>CREATED:</label>
              <div className="created-text">2026-07-08</div>
            </div>
          </div>

          {/* Entity Info Box */}
          <div className="entity-info-box">
            <div className="entity-header">
              <div>
                <div className="entity-account">GP-8839-XXXX</div>
                <div className="entity-merchant">Merchant Account</div>
              </div>
              <div className="badge badge-danger">94% HIGH RISK</div>
            </div>
            
            <div className="entity-details-grid">
              <div>
                <div className="detail-label">DETECTED TIME</div>
                <div className="detail-value">2026-07-08 14:02:11</div>
              </div>
              <div>
                <div className="detail-label">COUNTRY</div>
                <div className="detail-value">Seychelles <span className="text-muted">(High Risk Jurisdiction)</span></div>
              </div>
            </div>

            <div className="entity-reason">
              <div className="detail-label">RISK REASON</div>
              <div className="detail-value" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                Velocity threshold exceeded: 24 transactions in 180 seconds totaling $42,800. IP origin mismatches previous 12-month profile. Possible account takeover detected.
              </div>
            </div>
          </div>

          {/* Investigation Notes */}
          <div className="section-block">
            <div className="section-title">
              <span style={{ fontSize: '1rem', marginRight: '8px' }}>≡</span> Investigation Notes
            </div>
            
            <div className="notes-list">
              <div className="note-item">
                <div className="note-avatar">A4</div>
                <div className="note-content-box">
                  <p>Cross-referencing transaction logs with known proxy exit nodes. Confirmed IP mismatch with last successful login.</p>
                  <span className="note-time">2026-07-08 15:45</span>
                </div>
              </div>
              
              <div className="note-item">
                <div className="note-avatar">A4</div>
                <div className="note-content-box">
                  <p>Initial flagging by automated engine for high velocity. Escalating for manual IP log review.</p>
                  <span className="note-time">2026-07-08 14:38</span>
                </div>
              </div>
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
              <div className="timeline-item">
                <div className="timeline-dot dot-neutral"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Awaiting Evidence</div>
                  <div className="timeline-time">2026-07-08 16:00</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dot-danger"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Analyst Assigned (Analyst #4)</div>
                  <div className="timeline-time">2026-07-08 14:38</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dot-success"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Under Review</div>
                  <div className="timeline-time">2026-07-08 14:15</div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dot-success"></div>
                <div className="timeline-content">
                  <div className="timeline-title">Case Created (Auto-Flagged)</div>
                  <div className="timeline-time">2026-07-08 14:02</div>
                </div>
              </div>
            </div>
          </div>
          
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
