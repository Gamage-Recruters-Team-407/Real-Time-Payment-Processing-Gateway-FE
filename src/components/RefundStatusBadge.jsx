const REFUND_STATUS_CONFIG = {
  PENDING: { label: "Refund Pending", style: "bg-amber-50 text-amber-600" },
  APPROVED: { label: "Refund Completed", style: "bg-emerald-50 text-emerald-600" },
  REJECTED: { label: "Refund Rejected", style: "bg-red-50 text-red-600" },
  REFUNDED: { label: "Refund Completed", style: "bg-emerald-50 text-emerald-600" },
};

export default function RefundStatusBadge({ refundStatus }) {
  if (!refundStatus) return null;

  const normalized = String(refundStatus).trim().toUpperCase();
  const { label, style } = REFUND_STATUS_CONFIG[normalized] || REFUND_STATUS_CONFIG.PENDING;

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
