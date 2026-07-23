import React, { useEffect, useState } from "react";
import { CheckCheck, Bell, Loader2 } from "lucide-react";
import NotificationList from "../components/NotificationList";
import { T, displayFont, bodyFont, monoFont } from "../components/tokens";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "payment_success,payment_failed,settlement", label: "Payments" },
  { key: "security,otp", label: "Security" },
];

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function loadNotifications(activeFilter = filter) {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications(activeFilter);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(
        err.response?.data?.message || "Couldn't load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleItemClick(id) {
    // Optimistic update so the UI feels instant
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      loadNotifications(filter); // revert by re-syncing with the server
    }
  }

  async function handleMarkAllRead() {
    const prev = notifications;
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      setNotifications(prev); // revert on failure
    }
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: T.bg, fontFamily: bodyFont, color: T.ink }}
    >
      <div className="mx-auto max-w-2xl px-6 py-8">
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
              style={{ fontFamily: displayFont, letterSpacing: "-0.01em" }}
            >
              Notifications
            </h1>
          </div>
          <button
            onClick={handleMarkAllRead}
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 size={22} className="animate-spin" style={{ color: T.accent }} />
              <span className="text-xs" style={{ color: T.inkSoft }}>
                Loading notifications…
              </span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
              <span className="text-sm font-medium" style={{ color: T.red }}>
                {error}
              </span>
              <button
                onClick={() => loadNotifications(filter)}
                className="text-xs font-medium mt-1"
                style={{ color: T.accent }}
              >
                Try again
              </button>
            </div>
          ) : (
            <NotificationList notifications={notifications} onItemClick={handleItemClick} />
          )}
        </div>
      </div>
    </div>
  );
}
