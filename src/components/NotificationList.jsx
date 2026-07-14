import React, { useMemo } from "react";
import { BellOff } from "lucide-react";
import NotificationCard from "./NotificationCard";
import { T, displayFont, bodyFont } from "./tokens";

/**
 * NotificationList — groups notifications into "Today" / "Earlier" and renders them.
 *
 * Props:
 *  - notifications: array of { id, type, title, message, timestamp, read, group }
 *      `group` is a pre-computed bucket label from the backend (e.g. "Today", "Yesterday",
 *      "This Week"). Keeping bucketing server-side avoids timezone drift between client/API.
 *  - onItemClick: (id) => void
 */
export default function NotificationList({ notifications = [], onItemClick }) {
  const grouped = useMemo(() => {
    const map = {};
    for (const n of notifications) {
      const key = n.group || "Earlier";
      if (!map[key]) map[key] = [];
      map[key].push(n);
    }
    return map;
  }, [notifications]);

  if (notifications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        style={{ fontFamily: bodyFont }}
      >
        <BellOff size={28} style={{ color: T.slate }} />
        <p className="text-sm font-medium mt-3" style={{ color: T.ink }}>
          You're all caught up
        </p>
        <p className="text-xs mt-1" style={{ color: T.inkSoft }}>
          New notifications will show up here.
        </p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          <div
            className="px-4 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: T.inkSoft, fontFamily: displayFont }}
          >
            {group}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            {items.map((n, i) => (
              <div
                key={n.id}
                style={{
                  borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none",
                }}
              >
                <NotificationCard notification={n} onClick={onItemClick} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}