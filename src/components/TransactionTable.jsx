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
          <p className="text-sm text-slate-500">{merchantName} transaction history from MongoDB</p>
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
                    <td className="px-5 py-4 text-sm text-slate-700">{transaction.paymentMethod || "-"}</td>
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
                      <p className="font-medium text-slate-800">{transaction.paymentMethod || "-"}</p>
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
