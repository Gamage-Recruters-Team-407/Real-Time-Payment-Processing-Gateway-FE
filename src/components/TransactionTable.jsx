import { ChevronLeft, ChevronRight, Eye, Printer } from "lucide-react";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Processing: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Successful: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Failed: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  Cancelled: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const formatAmount = (amount, currency) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) {
    return "-";
  }

  return `${currency || "USD"} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getPaymentMethodConfig = (paymentMethod) => {
  const value = String(paymentMethod || "").trim().toLowerCase();

  if (value === "gpay" || value === "google pay") {
    return {
      label: "GPay",
      shortLabel: "G",
      iconBg: "bg-white",
      chipClass: "border border-sky-200 bg-sky-50 text-sky-700",
      iconClass: "border border-slate-200 text-slate-700",
    };
  }

  if (value.includes("paypal")) {
    return {
      label: "PayPal",
      shortLabel: "P",
      iconBg: "bg-[#003087]",
      chipClass: "border border-blue-200 bg-blue-50 text-blue-700",
      iconClass: "text-white",
    };
  }

  if (
    value === "card" ||
    value === "credit card" ||
    value === "debit card" ||
    value === "credit/debit card" ||
    value === "credit / debit card" ||
    value === "visa" ||
    value === "mastercard"
  ) {
    return {
      label: "Credit / Debit Card",
      shortLabel: "Card",
      iconBg: "bg-slate-900",
      chipClass: "border border-slate-200 bg-slate-50 text-slate-700",
      iconClass: "text-white",
    };
  }

  return {
    label: paymentMethod || "-",
    shortLabel: "?",
    iconBg: "bg-slate-200",
    chipClass: "border border-slate-200 bg-white text-slate-700",
    iconClass: "text-slate-700",
  };
};

function PaymentMethodBadge({ method }) {
  const config = getPaymentMethodConfig(method);
  const icon = (() => {
    if (config.label === "GPay") {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
          <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M16 6a10 10 0 1 0 7.08 17.08l-2.92-2.12A6.2 6.2 0 1 1 22.2 16h-6.2v3.6h9.9c.08-.46.1-.93.1-1.4C26 11.37 21.52 6 16 6Z" />
            <path fill="#34A853" d="M10.96 19.02 8.1 21.2A10 10 0 0 0 16 26c2.72 0 5.02-.9 6.78-2.44l-3.2-2.58A5.87 5.87 0 0 1 16 22.2c-2.2 0-4.14-1.4-5.04-3.18Z" />
            <path fill="#FBBC05" d="M10.7 16c0-.66.1-1.28.26-1.86L8 11.9A10 10 0 0 0 6 16c0 1.46.3 2.84.84 4.08l3.04-2.36c-.12-.54-.18-1.12-.18-1.72Z" />
            <path fill="#EA4335" d="M16 9.8c1.5 0 2.84.52 3.9 1.54l2.84-2.84C20.98 6.9 18.7 6 16 6A10 10 0 0 0 8 11.9l2.96 2.24C11.84 11.36 13.8 9.8 16 9.8Z" />
          </svg>
        </span>
      );
    }

    if (config.label === "PayPal") {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003087] shadow-sm">
          <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
            <path fill="#fff" d="M12.6 8h6.18c2.9 0 4.72 1.62 4.24 4.28-.54 2.98-2.94 4.48-6.1 4.48h-2.06l-.94 5.24h-3.2L12.6 8Zm3.14 6.12h1.66c1.54 0 2.36-.54 2.58-1.72.2-1.08-.44-1.68-1.88-1.68h-1.56l-.8 3.4Z" />
            <path fill="#7EB6FF" d="M14.98 11.24h4.32c1.58 0 2.4.8 2.08 2.38-.4 1.98-2.08 3.06-4.34 3.06h-1.82l-.64 3.42h-2.4l1.8-8.86Z" />
          </svg>
        </span>
      );
    }

    if (config.label === "Credit / Debit Card") {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 shadow-sm">
          <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
            <rect x="5" y="8" width="22" height="16" rx="3" fill="#fff" opacity="0.15" />
            <rect x="7" y="11" width="18" height="2.8" rx="1.4" fill="#fff" />
            <rect x="8.5" y="18" width="5.5" height="2.4" rx="1.2" fill="#fff" />
            <rect x="16" y="18" width="7.5" height="2.4" rx="1.2" fill="#93C5FD" />
          </svg>
        </span>
      );
    }

    return (
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full px-2 text-[11px] font-bold ${config.iconBg} ${config.iconClass}`}
      >
        {config.shortLabel}
      </span>
    );
  })();

  return (
    <div className={`inline-flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-semibold ${config.chipClass}`}>
      {icon}
      <span>{config.label}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}>
      {status || "Pending"}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

export default function TransactionTable({
  transactions = [],
  loading = false,
  error = "",
  total = 0,
  currentPage = 1,
  totalPages = 1,
  merchantName = "Main Shop",
  onPageChange,
  onViewDetails,
  onViewReceipt,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Transaction Records</h2>
        </div>
        <p className="text-sm text-slate-500">{total} total records</p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="px-5 py-8 text-sm text-rose-600">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="px-5 py-14 text-center">
          <p className="text-base font-medium text-slate-900">No transactions found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting the search or filters.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Method</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Refund</th>
                  <th className="px-5 py-4">Payment Reference</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-900">{transaction.transactionId}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(transaction.createdAt)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <div>{transaction.customerName || "-"}</div>
                      <div className="text-xs text-slate-500">{transaction.customerEmail || "-"}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatAmount(transaction.amount, transaction.currency)}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <PaymentMethodBadge method={transaction.paymentMethod} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {transaction.refundSummary?.hasRefundRequest
                        ? transaction.refundSummary.latestRefundStatus || "Requested"
                        : "None"}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">{transaction.paymentReference || "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewDetails(transaction)}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewReceipt(transaction)}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          <Printer size={14} />
                          View Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 lg:hidden">
            {transactions.map((transaction) => (
              <article key={transaction._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{transaction.transactionId}</p>
                    <p className="text-xs text-slate-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <StatusBadge status={transaction.status} />
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Shop</p>
                    <p className="font-medium text-slate-800">{merchantName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Customer</p>
                      <p className="font-medium text-slate-800">{transaction.customerName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Amount</p>
                      <p className="font-medium text-slate-800">{formatAmount(transaction.amount, transaction.currency)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Method</p>
                      <PaymentMethodBadge method={transaction.paymentMethod} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Reference</p>
                      <p className="font-medium text-slate-800">{transaction.paymentReference || "-"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Refund</p>
                    <p className="font-medium text-slate-800">
                      {transaction.refundSummary?.hasRefundRequest
                        ? transaction.refundSummary.latestRefundStatus || "Requested"
                        : "None"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails(transaction)}
                    className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewReceipt(transaction)}
                    className="flex-1 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700"
                  >
                    View Receipt
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing page {currentPage} of {Math.max(totalPages, 1)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage <= 1}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Prev
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-2 font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
