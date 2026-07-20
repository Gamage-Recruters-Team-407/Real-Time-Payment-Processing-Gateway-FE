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
  ChevronLeft,
  Menu,
  X,
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
  if (pathname.startsWith('/payment')) {
    return 'New Transaction';
  }

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  // Close the mobile drawer automatically whenever the route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleNavigation = (item) => {
    setActiveItem(item.name);
    navigate(item.path);
    setIsMobileOpen(false); // auto-close on mobile after clicking
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Toggle - only visible on small screens */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className={`fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm md:hidden ${
          isMobileOpen ? 'hidden' : 'flex'
        }`}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-64 shrink-0 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6 transition-transform duration-300 md:relative md:translate-x-0 md:transition-all ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <X size={18} />
        </button>

        {/* Collapse Toggle - desktop only */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-8 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 md:flex"
        >
          <ChevronLeft
            size={14}
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        <div>
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#0F1117]">
              {isCollapsed ? (
                <span className="hidden text-[#10B981] md:inline">GP</span>
              ) : (
                <>
                  <span className="md:hidden">
                    Gamage<span className="text-[#10B981]">Pay</span>
                  </span>
                </>
              )}
              {!isCollapsed && (
                <span className="hidden md:inline">
                  Gamage<span className="text-[#10B981]">Pay</span>
                </span>
              )}
            </h1>

            <div className={`mt-2 flex items-center gap-1.5 ${isCollapsed ? 'md:justify-center' : ''}`}>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />

              {(!isCollapsed || isMobileOpen) && (
                <span className="text-xs font-medium text-gray-500">
                  System Active
                </span>
              )}
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
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors ${
                    isCollapsed ? 'md:justify-center md:px-0' : ''
                  } ${
                    isActive
                      ? 'bg-[#10B981] text-white shadow-sm'
                      : 'bg-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${isActive ? 'text-white' : 'text-[#8A8FA3]'}`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="text-sm font-semibold">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Button - Bottom */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          title={isCollapsed ? 'Logout' : undefined}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F1117] py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <LogOut size={16} />
          {(!isCollapsed || isMobileOpen) && 'Logout'}
        </button>

        {/* Custom Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 sm:h-12 sm:w-12">
                <LogOut size={20} className="text-[#8A192F] sm:size-[22px]" />
              </div>
              <h2 className="mb-1 text-base font-bold text-[#0F1117] sm:text-lg">Log out?</h2>
              <p className="mb-6 text-sm text-gray-500">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="flex-1 rounded-xl bg-[#8A192F] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#711526]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;