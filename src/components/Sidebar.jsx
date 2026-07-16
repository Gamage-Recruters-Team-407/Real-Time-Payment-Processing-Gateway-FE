import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, ReceiptText, ShieldCheck, LayoutDashboard, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Fraud Detection', icon: ShieldCheck, path: '/fraud-detection' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const userMenuItems = [
  { name: 'Settlement', icon: CreditCard, path: '/dashboard' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const getActiveItemFromPath = (pathname) => {
  if (pathname === '/transaction-management') {
    return 'Transaction Management';
  }
  if (pathname === '/fraud-detection') {
    return 'Fraud Detection';
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
  const { isAdmin } = useAuth();
  const [activeItem, setActiveItem] = useState(() => getActiveItemFromPath(location.pathname));

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    if (item.path) {
      navigate(item.path);
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

        {/* Transaction Management - Admin only */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setActiveItem('Transaction Management');
              navigate('/transaction-management');
            }}
            className={`mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
              activeItem === 'Transaction Management'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-transparent text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ReceiptText
              size={18}
              className={activeItem === 'Transaction Management' ? 'text-white' : 'text-[#8A8FA3]'}
            />
            <span className="text-sm font-semibold">Transaction Management</span>
          </button>
        )}
      </div>

      {/* New Analysis Button - Bottom */}
      <button className="bg-[#0F1117] text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors">
        + New Analysis
      </button>
    </div>
  );
};

export default Sidebar;