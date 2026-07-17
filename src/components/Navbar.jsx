import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NotificationBadge from "./NotificationBadge";
import { getUnreadCount } from "../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadUnreadCount() {
      try {
        const count = await getUnreadCount();
        if (!cancelled) setUnreadCount(count);
      } catch (err) {
        console.error("Failed to load unread notification count:", err);
      }
    }

    loadUnreadCount();
    // Poll every 30s so the badge stays roughly live without needing sockets.
    const interval = setInterval(loadUnreadCount, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  console.log("Navbar - User data:", user);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    // Try different possible name fields
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

  // Get user display name
  const getUserName = () => {
    if (!user) return "User";

    // Try different possible name fields in order
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

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end">
      {/* Right side - Search and User */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-56 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981]"
        />
        <span className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">⚙️</span>
        <NotificationBadge count={unreadCount} onClick={() => navigate("/notifications")} />
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer pl-2 border-l border-gray-200"
        >
          <div className="w-8 h-8 rounded-full bg-[#8A192F] flex items-center justify-center text-white text-xs font-medium">
            {getUserInitials()}
          </div>
          <span className="text-sm text-gray-700 font-medium">{getUserName()}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
