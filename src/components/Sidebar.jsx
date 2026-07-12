import { 
  CheckCircle, 
  ShieldCheck, 
  Activity, 
  Briefcase, 
  Headset, 
  BadgeCheck, 
  Users, 
  BellRing,
  Shield
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Payment Validation', icon: <CheckCircle size={20} /> },
    { name: 'Fraud Detection', icon: <ShieldCheck size={20} />, active: true },
    { name: 'Risk Analysis', icon: <Activity size={20} /> },
    { name: 'Settlement', icon: <Briefcase size={20} /> },
    { name: 'Support', icon: <Headset size={20} /> },
    { name: 'Verification Status', icon: <BadgeCheck size={20} /> },
    { name: 'Account Management', icon: <Users size={20} /> },
    { name: 'Notifications', icon: <BellRing size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Gamage <span className="highlight">Pay</span>
      </div>
      
      <div className="sidebar-status">
        <div className="status-dot"></div>
        System Active
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className={`nav-item ${item.active ? 'active' : ''}`}>
              <div className="icon">{item.icon}</div>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-box">
          <div className="shield-icon">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-sm font-bold">System Active</div>
            <div className="text-xs text-muted">All nodes operational</div>
          </div>
        </div>
        
        <button className="btn-primary">
          New Analysis
        </button>
      </div>
    </aside>
  );
}
