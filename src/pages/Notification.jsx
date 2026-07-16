import React, { useMemo, useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import NotificationList from "../components/NotificationList";
import { T, displayFont, monoFont } from "../components/tokens";

/* ---------------------------------------------------------------------- */
/* Mock data — replace with a fetch to GET /api/notifications              */
/* ---------------------------------------------------------------------- */
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "payment_success",
    title: "Payment received",
    message: "LKR 8,240.00 from Serendib Home & Living was successfully processed.",
    timestamp: "10:42 AM",
    read: false,
    group: "Today",
    actionLabel: "View receipt",
  },
  {
    id: "n2",
    type: "security",
    title: "New device sign-in",
    message: "Your account was accessed from a new device in Colombo, Sri Lanka.",
    timestamp: "9:15 AM",
    read: false,
    group: "Today",
    actionLabel: "Review activity",
  },
  {
    id: "n3",
    type: "otp",
    title: "OTP verification required",
    message: "Enter the 6-digit code sent to your registered mobile number to confirm this transaction.",
    timestamp: "8:52 AM",
    read: true,
    group: "Today",
  },
  {
    id: "n4",
    type: "settlement",
    title: "Settlement completed",
    message: "STL-2026-08841 for Lanka Fresh Grocers has been paid out — LKR 4,701,715.",
    timestamp: "Yesterday, 6:30 PM",
    read: true,
    group: "Yesterday",
    actionLabel: "View settlement",
  },
  {
    id: "n5",
    type: "payment_failed",
    title: "Payment declined",
    message: "A LKR 1,176,796 settlement batch failed bank confirmation — exception EXC-4471 opened.",
    timestamp: "Yesterday, 3:12 PM",
    read: false,
    group: "Yesterday",
    actionLabel: "Resolve exception",
  },
  {
    id: "n6",
    type: "system",
    title: "Scheduled maintenance",
    message: "Gamage Pay will undergo scheduled maintenance on July 14, 1:00 AM – 2:00 AM.",
    timestamp: "2 days ago",
    read: true,
    group: "This Week",
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "payment_success,payment_failed,settlement", label: "Payments" },
  { key: "security,otp", label: "Security" },
];

export default function Notification() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    const types = filter.split(",");
    return notifications.filter((n) => types.includes(n.type));
  }, [notifications, filter]);

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div
              className="flex items-center gap-2 text-xs uppercase tracking-widest mb-2"
              style={{ color: T.accent, fontFamily: monoFont }}
            >
              <Bell size={13} />
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </div>
            <h1
              className="text-2xl font-semibold"
              style={{ fontFamily: displayFont, letterSpacing: "-0.01em", color: T.ink }}
            >
              Notifications
            </h1>
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: unreadCount === 0 ? T.slate : T.ink,
              opacity: unreadCount === 0 ? 0.5 : 1,
              cursor: unreadCount === 0 ? "default" : "pointer",
            }}
          >
            <CheckCheck size={13} />
            Mark all as read
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition"
              style={{
                background: filter === f.key ? T.ink : T.surface,
                color: filter === f.key ? "#fff" : T.inkSoft,
                border: `1px solid ${filter === f.key ? T.ink : T.border}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <NotificationList notifications={filtered} onItemClick={markAsRead} />
        </div>
      </div>
    </div>
  );
}