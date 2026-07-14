import React from "react";
import {
  CheckCircle2,
  XCircle,
  Landmark,
  ShieldAlert,
  KeyRound,
  Info,
} from "lucide-react";
import { T, bodyFont, monoFont, NOTIFICATION_TYPES } from "./tokens";

const ICONS = {
  payment_success: CheckCircle2,
  payment_failed: XCircle,
  settlement: Landmark,
  security: ShieldAlert,
  otp: KeyRound,
  system: Info,
};

/**
 * NotificationCard — single notification row.
 *
 * Props:
 *  - notification: { id, type, title, message, timestamp, read, actionLabel? }
 *  - onClick: called with the notification's id (marks as read / navigates)
 */
export default function NotificationCard({ notification, onClick }) {
  const { id, type, title, message, timestamp, read, actionLabel } = notification;
  const style = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.system;
  const Icon = ICONS[type] || Info;

  return (
    <button
      onClick={() => onClick?.(id)}
      className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition"
      style={{
        background: read ? "transparent" : T.bg,
        fontFamily: bodyFont,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.slateSoft)}
      onMouseLeave={(e) => (e.currentTarget.style.background = read ? "transparent" : T.bg)}
    >
      <div
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ width: 34, height: 34, background: style.bg, color: style.color }}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-sm truncate"
            style={{ color: T.ink, fontWeight: read ? 500 : 600 }}
          >
            {title}
          </span>
          {!read && (
            <span
              className="flex-shrink-0 rounded-full"
              style={{ width: 7, height: 7, background: T.accent }}
            />
          )}
        </div>
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: T.inkSoft }}>
          {message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px]" style={{ color: T.inkSoft, fontFamily: monoFont }}>
            {timestamp}
          </span>
          {actionLabel && (
            <>
              <span style={{ color: T.border }}>•</span>
              <span className="text-[11px] font-medium" style={{ color: style.color }}>
                {actionLabel}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}