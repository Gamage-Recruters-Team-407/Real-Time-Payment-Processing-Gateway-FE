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
  const formattedDateShort = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const formattedTimeShort = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

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
    <div className="w-full bg-white border-b border-gray-200 pl-16 pr-2 py-2 min-[380px]:pl-16 min-[380px]:pr-3 sm:pl-6 sm:pr-6 sm:py-3 flex items-center justify-between gap-1 min-[380px]:gap-2 overflow-hidden">
      {/* Left side - Date and Time */}
      <div className="flex items-center gap-1 min-[380px]:gap-1.5 sm:gap-2.5 min-w-0 overflow-hidden">
        {/* Date chip: hidden on the smallest screens, shown from xs up */}
        <div className="hidden min-[380px]:flex items-center gap-1 sm:gap-1.5 bg-[#8A192F]/8 text-[#8A192F] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shrink-0">
          <Calendar size={13} strokeWidth={2.25} className="shrink-0" />
          <span className="hidden text-sm font-semibold sm:inline">{formattedDate}</span>
          <span className="text-[11px] font-semibold whitespace-nowrap sm:hidden">{formattedDateShort}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#10B981]/10 text-[#0d9268] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shrink-0">
          <Clock size={13} strokeWidth={2.25} className="shrink-0" />
          <span className="hidden text-sm font-semibold font-mono tabular-nums sm:inline">
            {formattedTime}
          </span>
          <span className="text-[11px] font-semibold font-mono tabular-nums whitespace-nowrap sm:hidden">
            {formattedTimeShort}
          </span>
        </div>
      </div>

      {/* Right side - Search and User */}
      <div className="flex items-center gap-1.5 min-[380px]:gap-2 sm:gap-4 shrink-0">
        <Settings
          size={19}
          onClick={() => navigate("/settings")}
          className="hidden text-gray-400 cursor-pointer hover:text-gray-600 transition-colors sm:block"
        />

        <NotificationBadge count={unreadCount} onClick={() => navigate("/notifications")} />

        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-0 sm:gap-3 cursor-pointer pl-0 sm:pl-3 ml-0 sm:ml-1 sm:border-l border-gray-200 rounded-xl py-1 sm:py-1.5 pr-0 sm:pr-2 hover:bg-[#F8FAFC] transition-colors duration-200"
        >
          <div className="w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 sm:w-9 sm:h-9 rounded-full bg-[#8A192F] ring-2 ring-[#8A192F]/15 flex items-center justify-center text-white text-[11px] min-[380px]:text-xs font-semibold shrink-0">
            {getUserInitials()}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm text-[#0F1117] font-semibold whitespace-nowrap">{getUserName()}</p>
            <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-wide">
              {isAdmin ? "Admin" : "User"}
            </p>
          </div>
          <ChevronDown size={16} className="hidden text-gray-400 sm:block" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;