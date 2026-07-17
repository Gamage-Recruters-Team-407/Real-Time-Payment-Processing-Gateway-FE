import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, ReceiptText, ShieldCheck, LayoutDashboard, CreditCard, Undo2, LogOut, Plus, ChevronLeft } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div
      className={`relative z-30 min-h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
      }`}
    >
      {/* Collapse / Expand toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft
          size={14}
          className={`text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      <div>
        {/* Logo - Title at top */}
        <div className={`mb-6 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <h1 className="text-xl font-bold text-[#0F1117]">
              G<span className="text-[#10B981]">P</span>
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-[#0F1117]">
              Gamage<span className="text-[#10B981]">Pay</span>
            </h1>
          )}
          <div className={`flex items-center gap-1.5 mt-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0"></span>
            {!isCollapsed && (
              <span className="text-gray-500 text-xs font-medium">System Active</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => handleNavigation(item)}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-xl py-3 transition-colors ${
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-4 text-left'
              } ${
                item.name === activeItem
                  ? 'bg-[#10B981] text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon
                size={18}
                className={`shrink-0 ${item.name === activeItem ? 'text-white' : 'text-[#8A8FA3]'}`}
              />
              {!isCollapsed && (
                <span className="text-sm font-semibold leading-tight">{item.name}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Button - Bottom */}
      <button
        type="button"
        onClick={handleLogout}
        title={isCollapsed ? 'Logout' : undefined}
        className={`flex items-center justify-center gap-2 bg-[#0F1117] text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors ${
          isCollapsed ? 'px-0' : ''
        }`}
      >
        <LogOut size={16} />
        {!isCollapsed && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
