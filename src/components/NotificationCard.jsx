import React from "react";
import { useNavigate } from "react-router-dom";
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
  const { id, type, title, message, timestamp, read, actionLabel, link } = notification;
  const style = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.system;
  const Icon = ICONS[type] || Info;
  const navigate = useNavigate();

  function handleCardClick() {
    onClick?.(id);
    if (link) navigate(link);
  }

  function handleActionClick(e) {
    // Action link has its own click target so it can navigate even though
    // the whole card is also clickable — stop the event from double-firing.
    e.stopPropagation();
    onClick?.(id);
    if (link) navigate(link);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition cursor-pointer"
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
              <span
                role="link"
                tabIndex={0}
                onClick={handleActionClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleActionClick(e);
                  }
                }}
                className="text-[11px] font-medium hover:underline"
                style={{ color: style.color, cursor: link ? "pointer" : "default" }}
              >
                {actionLabel}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}