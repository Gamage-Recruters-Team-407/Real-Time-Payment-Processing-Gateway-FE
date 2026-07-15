import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetrics } from '../redux/slices/metricsSlice';
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

export default function FraudDetection() {
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);
  const [isInvestigationOpen, setIsInvestigationOpen] = useState(false);
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const dispatch = useDispatch();
  const { data: metrics } = useSelector(state => state.metrics);

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  return (
    <div className="dashboard-grid">
      <div className="stats-row">
        <StatCard 
          title="Blocked Attempts" 
          value={metrics.blockedTransactions?.toLocaleString() || "0"} 
          trend="up" 
          trendValue="Live Updates" 
          icon={<XCircle size={24} />} 
        />
        <StatCard 
          title="Suspicious Patterns" 
          value={metrics.totalAlerts?.toLocaleString() || "0"} 
          trend="neutral" 
          trendValue="Real-time AI monitoring active" 
          icon={<ActivitySquare size={24} />} 
        />
        <StatCard 
          title="High Risk Entities" 
          value={metrics.highRiskEntities?.toLocaleString() || "0"} 
          trend="danger" 
          trendValue="●●●" 
          icon={<AlertTriangle size={24} />}
          isAlert={true} 
        />
        <StatCard 
          title="Investigation Center" 
          value="" 
          trend="cases" 
          trendValue={{ open: metrics.pendingInvestigations || 0, escalated: 0 }} 
          icon={<FolderGit2 size={24} />} 
        />
      </div>

      <div className="middle-row">
        <EntityLinkAnalysis 
          onLiveFeedClick={() => setIsLiveFeedOpen(true)} 
          onInvestigateClick={() => setIsInvestigationOpen(true)}
          onWhitelistClick={() => setIsWhitelistOpen(true)}
        />
        <RegionalVelocity />
      </div>

      <RealTimeEventStream 
        onInvestigateClick={() => setIsInvestigationOpen(true)} 
        onReviewClick={() => setIsReviewOpen(true)}
      />

      <LiveFeedDrawer 
        isOpen={isLiveFeedOpen} 
        onClose={() => setIsLiveFeedOpen(false)} 
        onInvestigateClick={() => setIsInvestigationOpen(true)}
        onReviewClick={() => setIsReviewOpen(true)}
      />
      <InvestigationDrawer 
        isOpen={isInvestigationOpen} 
        onClose={() => setIsInvestigationOpen(false)} 
        onEscalateClick={() => setIsEscalateOpen(true)}
      />
      <WhitelistModal 
        isOpen={isWhitelistOpen} 
        onClose={() => setIsWhitelistOpen(false)} 
      />
      <EscalateModal 
        isOpen={isEscalateOpen} 
        onClose={() => setIsEscalateOpen(false)} 
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
}
