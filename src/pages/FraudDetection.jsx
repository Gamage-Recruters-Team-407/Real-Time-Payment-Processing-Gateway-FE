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
import EscalateModal from '../components/widgets/EscalateModal';
import ReviewModal from '../components/widgets/ReviewModal';
import { XCircle, ActivitySquare, AlertTriangle, FolderGit2 } from 'lucide-react';

import { handleTransactionAction } from '../services/actionApi';

export default function FraudDetection() {
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);
  const [investigationTarget, setInvestigationTarget] = useState(null);
  const [whitelistTarget, setWhitelistTarget] = useState(null);
  const [escalateTarget, setEscalateTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const dispatch = useDispatch();
  const { data: metrics } = useSelector(state => state.metrics);
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    dispatch(fetchMetrics());
    dispatch(fetchAlerts());
    try {
      const res = await getTransactions({ limit: 10 });
      if (res && res.data) setTransactions(res.data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5s auto-refresh
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
      <div className="stats-row">
        <StatCard 
          title="Blocked Attempts" 
          value={metrics.blockedAttempts?.value?.toLocaleString() || "0"} 
          trend="up" 
          trendValue="Live Updates" 
          icon={<XCircle size={24} />} 
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
          value="" 
          trend="cases" 
          trendValue={{ open: metrics.highRiskEntities?.openCases || 0, escalated: metrics.highRiskEntities?.escalated || 0 }} 
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
        onEscalateClick={() => setEscalateTarget(investigationTarget)}
      />
      <WhitelistModal 
        isOpen={!!whitelistTarget} 
        targetId={whitelistTarget}
        onClose={() => setWhitelistTarget(null)} 
      />
      <EscalateModal 
        isOpen={!!escalateTarget} 
        targetId={escalateTarget}
        onClose={() => setEscalateTarget(null)} 
      />
      <ReviewModal
        isOpen={!!reviewTarget}
        targetId={reviewTarget}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
}
