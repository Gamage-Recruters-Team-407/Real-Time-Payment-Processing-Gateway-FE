import { useState, useEffect } from 'react';
import { X, User, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { getTransactions, getMerchantProfile } from '../../services/fraudApi';

export default function MerchantProfileModal({ isOpen, onClose, merchantName }) {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && merchantName) {
      setLoading(true);
      
      Promise.all([
        getTransactions({ search: merchantName, limit: 100 }),
        getMerchantProfile(merchantName).catch(err => {
          console.warn('Merchant profile not found:', err.message);
          return null; // Return null on 404
        })
      ])
        .then(([txRes, profileRes]) => {
          // Process transactions for stats
          const txs = txRes.data || txRes.transactions || txRes;
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
          
          // Set real merchant profile
          if (profileRes) {
            setProfile(profileRes);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setStats(null);
      setProfile(null);
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
                <h3 style={{ margin: 0, color: '#111827', fontSize: '1.25rem' }}>{profile?.name || merchantName}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>
                  {profile?.accessLabel || profile?.role || 'Unverified Merchant'}
                </p>
                
                {profile && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px', fontSize: '0.8rem', color: '#4B5563' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {profile.email}
                      </div>
                      {profile.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {profile.phone}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', fontSize: '0.8rem', color: '#4B5563' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Registered: {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </>
                )}
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
