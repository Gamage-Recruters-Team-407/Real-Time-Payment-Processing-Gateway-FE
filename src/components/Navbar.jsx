import { useNavigate } from "react-router-dom";
const Navbar = () => {
const navigate = useNavigate();
  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side - Title only (no ADMIN badge) */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-[#0F1117]">
          Gamage<span className="text-[#10B981]">Pay</span>
        </span>
      </div>

      {/* Center - Nav Links with Dashboard Active */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <span className="cursor-pointer text-[#0F1117] font-medium border-b-2 border-[#10B981] pb-1">Dashboard</span>
        <span className="cursor-pointer hover:text-[#0F1117] transition-colors">Reports</span>
        <span className="cursor-pointer hover:text-[#0F1117] transition-colors">Transaction Fee/Security</span>
        <span className="cursor-pointer hover:text-[#0F1117] transition-colors">Integrations</span>
        <span className="cursor-pointer hover:text-[#0F1117] transition-colors">Payment History</span>
      </div>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
        />
        <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">⚙️</span>
        <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors relative">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </span>
        <div 
            onClick={() => navigate("/profile")} 
            className="flex items-center gap-2 cursor-pointer pl-2 border-l border-gray-200"
        >
          <div className="w-8 h-8 rounded-full bg-[#8A192F] flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
          <span className="text-sm text-gray-700 font-medium">User</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;