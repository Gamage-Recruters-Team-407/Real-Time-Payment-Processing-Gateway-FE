import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetrics } from '../redux/slices/metricsSlice';
import { fetchAlerts } from '../redux/slices/alertsSlice';
import { getTransactions } from '../services/fraudApi';
import StatCard from '../components/widgets/StatCard';
import EntityLinkAnalysis from '../components/widgets/EntityLinkAnalysis';
import RegionalVelocity from '../components/widgets/RegionalVelocity';
import RealTimeEventStream from '../components/widgets/RealTimeEventStream';
import LiveFeedDrawer from '../components/widgets/LiveFeedDrawer';
import InvestigationDrawer from '../components/widgets/InvestigationDrawer';
import WhitelistModal from '../components/widgets/WhitelistModal';
import ReviewModal from '../components/widgets/ReviewModal';
import FraudListModal from '../components/widgets/FraudListModal';
import { XCircle, ActivitySquare, AlertTriangle, FolderGit2, ShieldAlert } from 'lucide-react';

import { handleTransactionAction } from '../services/actionApi';

export default function FraudDetection() {
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);
  const [investigationTarget, setInvestigationTarget] = useState(null);
  const [whitelistTarget, setWhitelistTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [isFraudListOpen, setIsFraudListOpen] = useState(false);

  const dispatch = useDispatch();
  const { data: metrics } = useSelector(state => state.metrics);
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    dispatch(fetchMetrics());
    dispatch(fetchAlerts());
    try {
      const res = await getTransactions({ limit: 50 });
      if (res && res.data) {
        // Remove the restrictive filter so the Real-Time Event Stream shows all 
        // transactions (LOW_RISK, MEDIUM_RISK, HIGH_RISK, etc.) as the component logic intends.
        setTransactions(res.data.slice(0, 10)); // keep top 10
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useEffect(() => {
    loadData();
    
    // Connect to WebSocket for instant updates
    import('socket.io-client').then(({ io }) => {
      const socket = io('http://localhost:5000');
      
      socket.on('new_alert', (alert) => {
        console.log('Received real-time alert via WebSocket:', alert);
        loadData(); // Instantly refresh data when an alert is pushed
      });

      // Cleanup
      return () => {
        socket.disconnect();
      };
    });

    const interval = setInterval(loadData, 5000); // fallback auto-refresh
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleAction = async (id, actionType) => {
    try {
      await handleTransactionAction(id, { action: actionType });
      loadData(); // instantly refresh UI
    } catch (err) {
      console.error(`Failed to ${actionType} transaction`, err);
    }
  };

  return (
    <div className="dashboard-grid">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>Fraud Detection Dashboard</h1>
        <button 
          onClick={() => setIsFraudListOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#9F1239', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(159, 18, 57, 0.2)' }}
        >
          <ShieldAlert size={18} /> View Fraud List
        </button>
      </div>
      <div className="stats-row">
        <StatCard 
          title="Fraud List (Blacklist)" 
          value={metrics.fraudList?.value?.toLocaleString() || "0"} 
          trend="up" 
          trendValue="Live Updates" 
          icon={<ShieldAlert size={24} />} 
        />
        <StatCard 
          title="Suspicious Patterns" 
          value={metrics.suspiciousPatterns?.value?.toLocaleString() || "0"} 
          trend="neutral" 
          trendValue="Real-time AI monitoring active" 
          icon={<ActivitySquare size={24} />} 
        />
        <StatCard 
          title="High Risk Entities" 
          value={metrics.highRiskEntities?.value?.toLocaleString() || "0"} 
          trend="danger" 
          trendValue="●●●" 
          icon={<AlertTriangle size={24} />}
          isAlert={true} 
        />
        <StatCard 
          title="Investigation Center" 
          value={metrics.highRiskEntities?.openCases || "0"} 
          trend="neutral" 
          trendValue="Open Cases" 
          icon={<FolderGit2 size={24} />} 
        />
      </div>

      <div className="middle-row">
        <EntityLinkAnalysis 
          onLiveFeedClick={() => setIsLiveFeedOpen(true)} 
          onInvestigateClick={(id) => setInvestigationTarget(id)}
          onWhitelistClick={(id) => setWhitelistTarget(id)}
        />
        <RegionalVelocity />
      </div>

      <RealTimeEventStream 
        transactions={transactions}
        onInvestigateClick={(id) => setInvestigationTarget(id)} 
        onReviewClick={(id) => setReviewTarget(id)}
        onFreezeClick={(id) => handleAction(id, 'FREEZE')}
        onReleaseClick={(id) => handleAction(id, 'RELEASE')}
      />

      <LiveFeedDrawer 
        isOpen={isLiveFeedOpen} 
        onClose={() => setIsLiveFeedOpen(false)} 
        onInvestigateClick={(id) => { setIsLiveFeedOpen(false); setInvestigationTarget(id); }}
        onReviewClick={(id) => { setIsLiveFeedOpen(false); setReviewTarget(id); }}
      />
      <InvestigationDrawer 
        isOpen={!!investigationTarget} 
        targetId={investigationTarget}
        onClose={() => setInvestigationTarget(null)} 
        onActionComplete={loadData}
      />
      <WhitelistModal 
        isOpen={!!whitelistTarget} 
        targetId={whitelistTarget}
        onClose={() => setWhitelistTarget(null)} 
      />

      <FraudListModal 
        isOpen={isFraudListOpen} 
        onClose={() => setIsFraudListOpen(false)} 
        onReInvestigate={(alertId) => {
          setInvestigationTarget(alertId);
          loadData();
        }}
      />
      <ReviewModal
        isOpen={!!reviewTarget}
        targetId={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onActionComplete={() => {
          setReviewTarget(null);
          loadData();
        }}
      />
    </div>
  );
}
