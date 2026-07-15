
export default function StatCard({ title, value, trend, trendValue, icon, isAlert }) {
  return (
    <div className="card">
      <div className="stat-card-top">
        <div className="stat-title">{title}</div>
        <div className={`stat-icon-wrapper ${isAlert ? 'text-danger' : ''}`}>
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">
        {trend === 'up' && <span className="trend-up">↗ {trendValue}</span>}
        {trend === 'neutral' && <span className="trend-neutral">{trendValue}</span>}
        {trend === 'danger' && <span className="text-danger">● {trendValue}</span>}
        {trend === 'cases' && (
          <div style={{ display: 'flex', gap: '16px' }}>
             <span className="font-bold text-main">{trendValue.open} <span className="text-muted font-normal text-xs uppercase">OPEN CASES</span></span>
             <span className="font-bold text-danger">{trendValue.escalated} <span className="text-muted font-normal text-xs uppercase">ESCALATED</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
