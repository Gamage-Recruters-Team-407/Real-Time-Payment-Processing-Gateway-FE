import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log("Navbar - User data:", user);

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.name || user.fullName || user.fullname || user.displayName || user.username || user.email;
    if (!name) return "U";
    if (typeof name === 'string') {
      const names = name.split(" ");
      if (names.length >= 2 && names[0] && names[1]) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (!user) return "User";
    if (user.name) return user.name;
    if (user.fullName) return user.fullName;
    if (user.fullname) return user.fullname;
    if (user.displayName) return user.displayName;
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side - Title only */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-[#0F1117]">
          Gamage<span className="text-[#10B981]">Pay</span>
        </span>
      </div>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
        />
        <span 
          onClick={() => navigate("/settings")} 
          className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
        >
          ⚙️
        </span>
        <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors relative">
          🔔
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </span>

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer pl-2 border-l border-gray-200"
        >
          <div className="w-8 h-8 rounded-full bg-[#8A192F] flex items-center justify-center text-white text-xs font-medium">
            {getUserInitials()}
          </div>
          <span className="text-sm text-gray-700 font-medium">{getUserName()}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 border-l border-gray-200 pl-4 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;