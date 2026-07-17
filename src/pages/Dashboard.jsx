import React, { useEffect, useState } from "react";
import { Plus, FileText, Eye, Download, Search, RefreshCw } from "lucide-react";
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
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [refreshKey, setRefreshKey] = useState(0);
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
      getPaymentHistory({ status, search, page, limit: PAGE_SIZE, month })
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
  }, [status, search, page, month, refreshKey]);

  const handleFilterChange = (next) => {
    setStatus(next);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleExportPdf = async () => {
    try {
      const res = await getPaymentHistory({ status, search, page: 1, limit: 100000, month });
      const transactions = res.results || [];
      
      const totalVolume = transactions
        .filter((t) => t.status === "Successful" || t.status === "Completed")
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const successfulCount = transactions.filter((t) => t.status === "Successful" || t.status === "Completed").length;
      const pendingCount = transactions.filter((t) => t.status === "Pending" || t.status === "Processing").length;
      const failedCount = transactions.filter((t) => t.status === "Failed").length;

      const nowStr = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const monthDisplay = month ? new Date(month + "-02").toLocaleString("default", { month: "long", year: "numeric" }) : "All Months";
      const statusDisplay = status;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>GamagePay - Transaction Statement</title>
            <style>
              body {
                font-family: 'Segoe UI', -apple-system, sans-serif;
                color: #1e293b;
                padding: 40px;
                background-color: #ffffff;
                margin: 0;
              }
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #f1f5f9;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .brand-title {
                font-size: 28px;
                font-weight: 800;
                color: #0F1117;
                margin: 0;
                letter-spacing: -0.025em;
              }
              .brand-title span {
                color: #10b981;
              }
              .statement-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #64748b;
                margin: 4px 0 0 0;
                font-weight: 700;
              }
              .meta-info {
                text-align: right;
                font-size: 12px;
                color: #64748b;
                line-height: 1.6;
              }
              .filter-badge-container {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
              }
              .filter-badge {
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
              }
              .filter-badge strong {
                color: #0F1117;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 30px;
              }
              .stat-box {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 14px;
                background-color: #f8fafc;
              }
              .stat-label {
                font-size: 11px;
                text-transform: uppercase;
                color: #64748b;
                font-weight: 600;
                letter-spacing: 0.05em;
              }
              .stat-value {
                font-size: 18px;
                font-weight: 700;
                color: #0F1117;
                margin-top: 4px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
                font-size: 12px;
                margin-top: 10px;
              }
              th {
                background-color: #f8fafc;
                color: #475569;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 0.05em;
                padding: 12px 16px;
                border-bottom: 1px solid #e2e8f0;
              }
              td {
                padding: 12px 16px;
                border-bottom: 1px solid #f1f5f9;
                color: #334155;
              }
              tr:nth-child(even) td {
                background-color: #fbfcfd;
              }
              .status-pill {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 99px;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
              }
              .status-completed {
                background-color: #ecfdf5;
                color: #059669;
              }
              .status-pending {
                background-color: #fffbeb;
                color: #d97706;
              }
              .status-failed {
                background-color: #fef2f2;
                color: #dc2626;
              }
              .amount-failed {
                color: #dc2626;
                font-weight: 600;
              }
              .amount-normal {
                font-weight: 600;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 11px;
                color: #94a3b8;
                border-top: 1px solid #e2e8f0;
                padding-top: 16px;
              }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header-container">
              <div>
                <h1 class="brand-title">Gamage<span>Pay</span></h1>
                <p class="statement-title">Transaction Statement</p>
              </div>
              <div class="meta-info">
                <div>Statement Date: <strong>${nowStr}</strong></div>
                <div>Account Owner: <strong>${userName || 'Valued Merchant'}</strong></div>
              </div>
            </div>

            <div class="filter-badge-container">
              <div class="filter-badge">Month Range: <strong>${monthDisplay}</strong></div>
              <div class="filter-badge">Status Filter: <strong>${statusDisplay}</strong></div>
              ${search ? `<div class="filter-badge">Search Term: <strong>"${search}"</strong></div>` : ''}
            </div>

            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Total Volume</div>
                <div class="stat-value">LKR ${totalVolume.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Successful</div>
                <div class="stat-value">${successfulCount}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Pending</div>
                <div class="stat-value">${pendingCount}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Failed</div>
                <div class="stat-value">${failedCount}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date / Time</th>
                  <th>Transaction ID</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.length === 0 ? `
                  <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">
                      No transactions found for the selected filters.
                    </td>
                  </tr>
                ` : transactions.map(t => {
                  const statusClass = t.status === "Successful" || t.status === "Completed" ? "status-completed" : t.status === "Failed" ? "status-failed" : "status-pending";
                  const amtClass = t.status === "Failed" ? "amount-failed" : "amount-normal";
                  return `
                    <tr>
                      <td>${formatDateTime(t.dateTime || t.createdAt)}</td>
                      <td style="font-family: monospace; font-size: 11px;">${t.transactionId}</td>
                      <td>${t.method}</td>
                      <td class="${amtClass}">LKR ${Number(t.amount || 0).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td><span class="status-pill ${statusClass}">${t.status}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="footer">
              This is a system-generated statement from GamagePay and does not require a signature.
            </div>

            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error("Failed to export PDF:", err);
      alert("Failed to export PDF statement. Please try again.");
    }
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
                onClick={handleExportPdf}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <FileText size={15} /> Export PDF
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
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by transaction ID"
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
                        ? "bg-[#0A192F] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <input
                type="month"
                value={month}
                onChange={(e) => { setMonth(e.target.value); setPage(1); }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                  setPage(1);
                  const now = new Date();
                  setMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
                  setRefreshKey((k) => k + 1);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
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

