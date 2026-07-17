import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { getTransactions } from '../../services/fraudApi';

export default function MerchantProfileModal({ isOpen, onClose, merchantName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && merchantName) {
      setLoading(true);
      getTransactions({ search: merchantName, limit: 100 })
        .then(res => {
          const txs = res.data || res.transactions || res;
          if (Array.isArray(txs)) {
            const totalVolume = txs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            const fraudCount = txs.filter(tx => tx.riskScore > 80 || tx.status === 'BLOCKED').length;
            setStats({
              totalTransactions: txs.length,
              totalVolume,
              fraudCount,
              fraudRate: txs.length > 0 ? (fraudCount / txs.length) * 100 : 0,
              lastActive: txs[0]?.createdAt || 'N/A'
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setStats(null);
    }
  }, [isOpen, merchantName]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}></div>
      <div className="modal-container" style={{ zIndex: 110, maxWidth: '400px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={20} className="text-muted" />
            <span>Merchant Profile</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <p>Loading profile...</p>
          ) : stats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>{merchantName}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>Verified Merchant</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 'bold' }}>TOTAL VOLUME</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>${stats.totalVolume.toFixed(2)}</div>
                </div>
                <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 'bold' }}>TRANSACTIONS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{stats.totalTransactions}</div>
                </div>
                <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', backgroundColor: stats.fraudRate > 10 ? '#FEF2F2' : '#FFFFFF' }}>
                  <div style={{ fontSize: '0.7rem', color: stats.fraudRate > 10 ? '#9F1239' : '#6B7280', fontWeight: 'bold' }}>FRAUD RATE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: stats.fraudRate > 10 ? '#9F1239' : '#111827' }}>
                    {stats.fraudRate.toFixed(1)}%
                  </div>
                </div>
                <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 'bold' }}>LAST ACTIVE</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>
                    {stats.lastActive !== 'N/A' ? new Date(stats.lastActive).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Profile not found.</p>
          )}
        </div>
      </div>
    </>
  );
}
