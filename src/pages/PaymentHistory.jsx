// src/pages/PaymentHistory.jsx
//
// Renders Navbar + Sidebar inline, same pattern as AdminDashboard.jsx, since
// UserLayout.jsx/AdminLayout.jsx are still empty.
//
// Data: real API via transactionService.js (no mock data). Requires
// transactionRoutes.js mounted at /api/transactions (already added to
// server.js).

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, RotateCcw } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getTransactionSummary,
  getTransactions,
} from "../services/transactionService";
import { StatusBadge } from "./PaymentSuccess";

const FILTERS = ["All", "Completed", "Pending", "Flagged", "Failed"];
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

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(null);

  useEffect(() => {
    getTransactionSummary()
      .then(setSummary)
      .catch(() => setSummaryError("Couldn't load summary stats."));
  }, []);

  useEffect(() => {
    setLoading(true);
    setTableError(null);
    const handle = setTimeout(() => {
      getTransactions({ status, search, page, limit: PAGE_SIZE })
        .then((res) => {
          setRows(res.results);
          setTotal(res.total);
        })
        .catch(() => setTableError("Couldn't load transactions. Please try again."))
        .finally(() => setLoading(false));
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
      formatDateTime(t.dateTime),
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

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 px-8 py-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Financial operations
                </p>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Payment history
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Monitoring your payment activity.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#0F1117] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Schedule report
                </button>
              </div>
            </div>

            {summaryError && (
              <p className="text-sm text-red-500">{summaryError}</p>
            )}

            <div className="grid grid-cols-4 gap-4">
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
                    : ""
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
                label="Flagged"
                value={summary ? summary.flaggedCount.toLocaleString() : "—"}
                caption="Manual review required"
              />
              <StatCard
                dotColor="bg-red-500"
                label="Failed"
                value={summary ? summary.failedCount.toLocaleString() : "—"}
                caption="System declines or bounce-backs"
              />
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by transaction ID or method..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
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
                          ? "bg-[#0F1117] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-3 font-medium">Date / time</th>
                      <th className="px-4 py-3 font-medium">Transaction ID</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : tableError ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-red-500">
                          {tableError}
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                          No transactions match your search.
                        </td>
                      </tr>
                    ) : (
                      rows.map((t) => (
                        <tr
                          key={t.id}
                          className="border-t border-slate-50 text-slate-700 hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 text-slate-500">
                            {formatDateTime(t.dateTime)}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {t.transactionId}
                          </td>
                          <td className="px-4 py-3">{t.method}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {formatAmount(t.amount, t.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={t.status} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3 text-slate-400">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/refund/${t.transactionId}`);
                                }}
                                title="Request Refund"
                                className="text-rose-500 hover:text-rose-700 transition-colors"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                              <ChevronRight className="h-4 w-4 text-slate-300" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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
      </div>
    </div>
  );
}

function StatCard({ dotColor, label, value, caption }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {label}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5 font-medium">{caption}</p>
    </div>
  );
}