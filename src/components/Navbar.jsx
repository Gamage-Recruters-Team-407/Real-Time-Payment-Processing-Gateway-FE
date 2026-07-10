import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Nav Links */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <span className="cursor-pointer hover:text-[#0F1117]">Reports</span>
        <span className="cursor-pointer hover:text-[#0F1117]">Transaction Fee/security</span>
        <span className="cursor-pointer hover:text-[#0F1117]">Integrations</span>
        <span className="cursor-pointer hover:text-[#0F1117]">Payment History</span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
        />
        <span className="text-gray-500 cursor-pointer">⚙️</span>
        <span className="text-gray-500 cursor-pointer">🔔</span>

        <div className="flex items-center gap-2 cursor-pointer" onClick={logout}>
          <div className="w-8 h-8 rounded-full bg-[#8A192F] flex items-center justify-center text-white text-xs font-medium">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;