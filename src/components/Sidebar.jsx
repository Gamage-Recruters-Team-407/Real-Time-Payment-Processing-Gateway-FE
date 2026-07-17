import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, ReceiptText, ShieldCheck, LayoutDashboard, CreditCard, Undo2, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Transaction Management', icon: ReceiptText, path: '/transaction-management' },
  { name: 'Refund Management', icon: Undo2, path: '/refund-management' },
  { name: 'Fraud Detection', icon: ShieldCheck, path: '/fraud-detection' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const userMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: "New Transaction", icon: Plus, path: "/payment" },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const getActiveItemFromPath = (pathname) => {
  if (pathname === '/payment') {
    return 'New Transaction';
  }
  if (pathname === '/transaction-management') {
    return 'Transaction Management';
  }
  if (pathname === '/fraud-detection') {
    return 'Fraud Detection';
  }
  if (pathname === '/refund-management') {
    return 'Refund Management';
  }
  if (pathname === '/notifications') {
    return 'Notifications';
  }
  if (pathname === '/settings') {
    return 'Settings';
  }
  if (pathname === '/dashboard') {
    return 'Dashboard';
  }
  if (pathname === '/profile') {
    return '';
  }
  return 'Dashboard';
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const [activeItem, setActiveItem] = useState(() => getActiveItemFromPath(location.pathname));

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="relative z-30 w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4 shrink-0">
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
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                item.name === activeItem
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon
                size={18}
                className={item.name === activeItem ? 'text-white' : 'text-[#8A8FA3]'}
              />
              <span className="text-sm font-semibold">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Button - Bottom */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-[#0F1117] text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
