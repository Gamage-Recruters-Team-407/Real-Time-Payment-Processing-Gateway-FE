import { useState, useEffect } from 'react';
import { X, History } from 'lucide-react';
import { getTransactions } from '../../services/fraudApi';

export default function TransactionHistoryModal({ isOpen, onClose, userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      getTransactions({ search: userId, limit: 50 })
        .then(res => setTransactions(res.data || res.transactions || res))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setTransactions([]);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 100 }}></div>
      <div className="modal-container" style={{ zIndex: 110, maxWidth: '600px', width: '90%' }}>
        <div className="modal-header">
          <div className="modal-title">
            <History size={20} className="text-muted" />
            <span>Transaction History: {userId}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <p>Loading history...</p>
          ) : transactions.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Date</th>
                  <th style={{ padding: '8px' }}>Transaction ID</th>
                  <th style={{ padding: '8px' }}>Merchant</th>
                  <th style={{ padding: '8px' }}>Amount</th>
                  <th style={{ padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id || tx.transactionId} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '8px' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>{tx.transactionId}</td>
                    <td style={{ padding: '8px' }}>{tx.merchant}</td>
                    <td style={{ padding: '8px' }}>${tx.amount?.toFixed(2)}</td>
                    <td style={{ padding: '8px' }}>
                      <span className={`badge ${tx.status === 'CLEARED' ? 'badge-success' : tx.status === 'BLOCKED' ? 'badge-danger' : 'badge-warning'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transaction history found.</p>
          )}
        </div>
      </div>
    </>
  );
}
