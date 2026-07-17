import React, { useEffect, useState } from "react";
import { Plus, FileText, Eye, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TransactionDetailModal from "../components/TransactionDetailModal";
import api from "../services/api";
import {
  getPaymentSummary,
  getPaymentHistory,
} from "../services/paymentHistoryService";
import { StatusBadge } from "./PaymentSuccess";

const FILTERS = ["All", "Completed", "Pending", "Failed"];
const PAGE_SIZE = 5;

function formatAmount(amount, currency) {
  const formatted = Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

const REFUND_WINDOW_DAYS = 7;

function computeIsRefundable(t) {
  if (t.refundSummary?.isRefundable !== undefined) {
    return t.refundSummary.isRefundable;
  }
  const transactionDate = new Date(t.createdAt || t.dateTime);
  const differenceInDays =
    (Date.now() - transactionDate.getTime()) / (1000 * 3600 * 24);
  const isWithinWindow = differenceInDays <= REFUND_WINDOW_DAYS;
  return (
    t.status === "Completed" &&
    !t.refundSummary?.hasRefundRequest &&
    isWithinWindow
  );
}

function StatCard({ dotColor, label, value, caption }) {
  return (
    <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{caption}</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Only kept to show the user's name in the welcome heading
  const [userName, setUserName] = useState(null);

  // Summary stat cards
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  // Payment history table state
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch user name for welcome heading
  useEffect(() => {
    let cancelled = false;
    api
      .get("/users/me")
      .then((res) => {
        if (!cancelled) setUserName(res.data?.name ?? null);
      })
      .catch(() => {
        // Silently fall back — heading shows generic text
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch summary stats for the 4 cards
  useEffect(() => {
    getPaymentSummary()
      .then(setSummary)
      .catch(() => setSummaryError("Couldn't load summary stats."));
  }, []);

  // Load transactions
  useEffect(() => {
    setTableLoading(true);
    setTableError(null);
    const handle = setTimeout(() => {
      getPaymentHistory({ status, search, page, limit: PAGE_SIZE })
        .then((res) => {
          setRows(res.results);
          setTotal(res.total);
        })
        .catch(() =>
          setTableError("Couldn't load transactions. Please try again.")
        )
        .finally(() => setTableLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [status, search, page]);

  const handleFilterChange = (next) => {
    setStatus(next);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleExportCsv = () => {
    const header = ["Date/Time", "Transaction ID", "Method", "Amount", "Status"];
    const lines = rows.map((t) => [
      formatDateTime(t.dateTime || t.createdAt),
      t.transactionId,
      t.method,
      formatAmount(t.amount, t.currency),
      t.status,
    ]);
    const csv = [header, ...lines].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleDownloadReceipt = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* ── Header row ── */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F]">
                {userName ? `Welcome, ${userName}` : "Payment History"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Monitoring financial activities across all merchant terminals.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <FileText size={15} /> Export CSV
              </button>
              {/* <button
                type="button"
                onClick={() => navigate("/payment")}
                className="flex items-center gap-2 rounded-lg bg-[#0A192F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d223f]"
              >
                <Plus size={15} />
                New Transaction
              </button> */}
            </div>
          </div>

          {/* ── Stat Cards ── */}
          {summaryError && (
            <p className="mt-4 text-sm text-red-500">{summaryError}</p>
          )}
          <div className="mt-6 flex gap-4">
            <StatCard
              dotColor="bg-emerald-500"
              label="Total volume"
              value={
                summary
                  ? `LKR ${(summary.totalVolume / 1_000_000).toFixed(2)}M`
                  : "—"
              }
              caption={
                summary?.totalVolumeChangePct != null
                  ? `+${summary.totalVolumeChangePct}% from last month`
                  : "All-time settled volume"
              }
            />
            <StatCard
              dotColor="bg-emerald-500"
              label="Successful"
              value={summary ? summary.successfulCount.toLocaleString() : "—"}
              caption={summary ? `${summary.successRatePct}% success rate` : ""}
            />
            
            <StatCard
              dotColor="bg-amber-500"
              label="Pending"
              value={summary ? (summary.pendingCount ?? 0).toLocaleString() : "—"}
              caption="Awaiting processing"
            />

            <StatCard
              dotColor="bg-red-500"
              label="Failed"
              value={summary ? summary.failedCount.toLocaleString() : "—"}
              caption="System declines or bounce-backs"
            />
          </div>

          {/* Search + filters — OUTSIDE the table card */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by transaction ID or method..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => handleFilterChange(f)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      status === f
                        ? "bg-[#0A192F] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Payment History Table ── */}
            <div className="bg-white rounded-xl border border-slate-200">
              {/* Table */}
              <div className="overflow-x-auto">


              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 font-medium">Date / Time</th>
                    <th className="px-4 py-3 font-medium">Transaction ID</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : tableError ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-red-500"
                      >
                        {tableError}
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-slate-400"
                      >
                        No transactions match your search.
                      </td>
                    </tr>
                  ) : (
                    rows.map((t) => {
                      const isRefundable = computeIsRefundable(t);
                      return (
                        <tr
                          key={t.id}
                          className="border-t border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-4 text-slate-500">
                            {formatDateTime(t.dateTime || t.createdAt)}
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-900">
                            {t.transactionId}
                          </td>
                          <td className="px-4 py-4">{t.method}</td>
                          <td className={`px-4 py-4 font-medium ${t.status === "Failed" ? "text-red-600" : "text-slate-900"}`}>
                            {formatAmount(t.amount, t.currency)}
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              {isRefundable ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/refund/${t.transactionId}`);
                                  }}
                                  className="rounded bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 shadow-sm transition-colors hover:bg-rose-100"
                                >
                                  Return &amp; Refund
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  title="Only available for Completed transactions within 7 days."
                                  className="cursor-not-allowed rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-400 opacity-50"
                                >
                                  Return &amp; Refund
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(t);
                                }}
                                title="View Details"
                                className="text-slate-400 transition-colors hover:text-slate-600"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadReceipt(t);
                                }}
                                title="Download Receipt"
                                className="text-slate-400 transition-colors hover:text-slate-600"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-slate-100 p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {from} to {to} of {total.toLocaleString()} transactions
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

