import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, ChevronDown, Calendar, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationBadge from "./NotificationBadge";
import { getUnreadCount } from "../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Live clock in the top-left date/time chips
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live unread notification count for the bell badge
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

  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log("Navbar - User data:", user);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    // Try different possible name fields
    const name = user.name || user.fullName || user.fullname || user.displayName || user.username || user.email;

    if (!name) return "U";

    if (typeof name === "string") {
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
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left side - Date and Time */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-[#8A192F]/8 text-[#8A192F] px-3 py-1.5 rounded-lg">
          <Calendar size={14} strokeWidth={2.25} />
          <span className="text-sm font-semibold">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#10B981]/10 text-[#0d9268] px-3 py-1.5 rounded-lg">
          <Clock size={14} strokeWidth={2.25} />
          <span className="text-sm font-semibold font-mono tabular-nums">{formattedTime}</span>
        </div>
      </div>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-4">
        <Settings
          size={20}
          onClick={() => navigate("/settings")}
          className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
        />

        <NotificationBadge count={unreadCount} onClick={() => navigate("/notifications")} />

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer pl-3 ml-1 border-l border-gray-200 rounded-xl py-1.5 pr-2 hover:bg-[#F8FAFC] transition-colors duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-[#8A192F] ring-2 ring-[#8A192F]/15 flex items-center justify-center text-white text-xs font-semibold">
            {getUserInitials()}
          </div>
          <div className="leading-tight">
            <p className="text-sm text-[#0F1117] font-semibold">{getUserName()}</p>
            <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wide">
              {isAdmin ? "Admin" : "User"}
            </p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;