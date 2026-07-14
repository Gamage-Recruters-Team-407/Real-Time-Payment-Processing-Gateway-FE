<<<<<<< HEAD
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
=======
import { useState } from 'react';

const menuItems = [
  { name: 'Settlement', icon: '💳' },
  { name: 'Notifications', icon: '🔔' },
  { name: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Settlement');

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4">
      <div>
        {/* Logo - Title at top */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0F1117]">
            Gamage<span className="text-[#10B981]">Pay</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-gray-500 text-xs font-medium">System Active</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                item.name === activeItem
                  ? 'bg-[#10B981] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Button - New Analysis */}
      <button className="bg-[#0F1117] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors">
        + New Analysis
      </button>
    </div>
  );
};

export default Sidebar;
>>>>>>> 7a051d36abc14e415ae16a765d38c7d41f42a337
