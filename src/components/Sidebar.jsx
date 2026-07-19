import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Settings,
  ReceiptText,
  ShieldCheck,
  LayoutDashboard,
  Undo2,
  LogOut,
  Plus,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const adminMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Transaction Management', icon: ReceiptText, path: '/transaction-management' },
  { name: 'Refund Management', icon: Undo2, path: '/refund-management' },
  { name: 'User Management', icon: Users, path: '/user-management' },
  { name: 'Fraud Detection', icon: ShieldCheck, path: '/fraud-detection' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const userMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'New Transaction', icon: Plus, path: '/payment' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const getActiveItemFromPath = (pathname) => {
  if (pathname.startsWith('/transaction-management')) {
    return 'Transaction Management';
  }

  if (pathname.startsWith('/refund-management')) {
    return 'Refund Management';
  }

  if (pathname.startsWith('/user-management')) {
    return 'User Management';
  }

  if (pathname.startsWith('/fraud-detection')) {
    return 'Fraud Detection';
  }

  if (pathname.startsWith('/notifications')) {
    return 'Notifications';
  }

  if (pathname.startsWith('/settings')) {
    return 'Settings';
  }

  if (pathname.startsWith('/dashboard')) {
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

  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    navigate(item.path);
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  return (
    <aside className="relative z-30 flex min-h-screen w-64 shrink-0 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6">
      <div>
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0F1117]">
            Gamage<span className="text-[#10B981]">Pay</span>
          </h1>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />

            <span className="text-xs font-medium text-gray-500">
              System Active
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === activeItem;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                  isActive
                    ? 'bg-[#10B981] text-white shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : 'text-[#8A8FA3]'}
                />
                <span className="text-sm font-semibold">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Button - Bottom */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#0F1117] py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;