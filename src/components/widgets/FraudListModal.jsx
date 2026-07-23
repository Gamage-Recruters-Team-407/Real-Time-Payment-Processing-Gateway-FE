import { useState, useEffect } from 'react';
import { ShieldAlert, X, Search, Trash2, FileSearch } from 'lucide-react';
import api from '../../services/api';

export default function FraudListModal({ isOpen, onClose, onReInvestigate }) {
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchBlacklist();
    }
  }, [isOpen]);

  const fetchBlacklist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fraud/blacklist');
      setBlacklist(res.data);
    } catch (err) {
      console.error('Failed to fetch fraud list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this entity from the Fraud List?")) return;
    try {
      await api.delete(`/fraud/blacklist/${id}`);
      fetchBlacklist();
    } catch (err) {
      console.error('Failed to remove from blacklist:', err);
    }
  };

  const handleReInvestigate = async (item) => {
    try {
      const res = await api.post(`/fraud/blacklist/${item._id}/reinvestigate`);
      if (res.data.success && res.data.alertId) {
        onClose();
        if (onReInvestigate) onReInvestigate(res.data.alertId);
      } else {
        alert("Could not find a previous alert for this user to re-investigate.");
      }
    } catch (err) {
      console.error("Failed to re-investigate:", err);
    }
  };

  if (!isOpen) return null;

  const filteredList = blacklist.filter(item => 
    item.entityId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 300, backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
      <div className="modal-container" style={{ zIndex: 310, width: '650px', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', backgroundColor: '#9F1239', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1.25rem' }}>
            <ShieldAlert size={24} /> Fraud List (Blacklist)
          </div>
          <button onClick={onClose} style={{ color: 'white', opacity: 0.8 }}><X size={24} /></button>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text" 
              placeholder="Search by ID or reason..." 
              style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px', backgroundColor: '#fff' }}>
          {loading ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Loading fraud list...</p>
          ) : filteredList.length === 0 ? (
            <p style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF' }}>No blacklisted entities found.</p>
          ) : (
            <table className="data-table" style={{ marginTop: '16px', marginBottom: '24px' }}>
              <thead>
                <tr>
                  <th>ENTITY</th>
                  <th>TYPE</th>
                  <th>REASON</th>
                  <th>DATE ADDED</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item._id} style={{ backgroundColor: '#FEF2F2' }}>
                    <td style={{ fontWeight: 600, color: '#9F1239' }}>{item.entityId}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#FCA5A5', color: '#7F1D1D' }}>
                        {item.entityType}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{item.reason}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(item.addedAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleReInvestigate(item)}
                          style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer' }}
                          title="Re-Investigate"
                        >
                          <FileSearch size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemove(item._id)}
                          style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                          title="Remove from Fraud List"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
      </div>
    </>
  );
}
