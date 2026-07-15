import React from "react";
import { Bell } from "lucide-react";
import { T } from "./tokens";

/**
 * NotificationBadge — bell icon + unread count, meant to sit in the Navbar.
 *
 * Props:
 *  - count: number of unread notifications
 *  - onClick: opens the notification dropdown/page
 */
export default function NotificationBadge({ count = 0, onClick }) {
  const showCount = count > 0;
  const displayCount = count > 9 ? "9+" : count;

  return (
    <button
      onClick={onClick}
      aria-label={`Notifications${showCount ? `, ${count} unread` : ""}`}
      className="relative flex items-center justify-center h-9 w-9 rounded-full transition hover:opacity-80"
      style={{ background: T.slateSoft }}
    >
      <Bell size={17} style={{ color: T.ink }} />
      {showCount && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-semibold text-white px-1"
          style={{
            background: T.red,
            minWidth: 16,
            height: 16,
            lineHeight: "16px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}