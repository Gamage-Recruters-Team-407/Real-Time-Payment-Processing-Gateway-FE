import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Bell,
  Settings,
  ReceiptText,
  ShieldCheck,
  LayoutDashboard,
  Users,
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    name: 'Settlement',
    icon: CreditCard,
    path: '/',
  },

  // My part
  {
    name: 'User Management',
    icon: Users,
    path: '/user-management',
  },

  {
    name: 'Fraud Detection',
    icon: ShieldCheck,
    path: '/fraud-detection',
  },
  {
    name: 'Notifications',
    icon: Bell,
    path: '/notifications',
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

const getActiveItemFromPath = (pathname) => {
  if (pathname.startsWith('/transaction-management')) {
    return 'Transaction Management';
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

  if (pathname.startsWith('/profile')) {
    return '';
  }

  if (pathname === '/') {
    return 'Settlement';
  }

  return '';
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(() =>
    getActiveItemFromPath(location.pathname)
  );

  // Automatically update the active menu item when URL changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    navigate(item.path);
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

        {/* Main menu */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors ${
                  isActive
                    ? 'bg-[#10B981] text-white shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive ? 'text-white' : 'text-[#8A8FA3]'
                  }
                />

                <span className="text-sm font-semibold">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Transaction Management */}
        <button
          type="button"
          onClick={() => navigate('/transaction-management')}
          className={`mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-colors ${
            activeItem === 'Transaction Management'
              ? 'bg-[#10B981] text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ReceiptText
            size={18}
            className={
              activeItem === 'Transaction Management'
                ? 'text-white'
                : 'text-[#8A8FA3]'
            }
          />

          <span className="text-sm font-semibold">
            Transaction Management
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;