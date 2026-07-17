import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Filter,
  Printer,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";
import {
  getTransactionById,
  getTransactions,
} from "../services/transactionService";

const EMPTY_FILTERS = {
  status: "",
  minAmount: "",
  maxAmount: "",
  date: "",
};

const STATUS_OPTIONS = ["", "Pending", "Processing", "Successful", "Failed", "Cancelled"];
const SINGLE_SHOP_NAME = "Main Shop";

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString(undefined, {
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

const escapeHtml = (value) =>
  String(value ?? "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildAppliedFilters = (filters) => {
  const selectedDate = filters.date?.trim();

  return {
    status: filters.status,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    startDate: selectedDate,
    endDate: selectedDate,
  };
};

const openTransactionPdfReport = ({ merchantName, filters, transactions }) => {
  const reportWindow = window.open("", "_blank", "width=1280,height=900");

  if (!reportWindow) {
    throw new Error("Popup blocked. Please allow popups to generate the PDF report.");
  }

  const generatedAt = new Date().toLocaleString();
  const filterSummary = [
    filters.status ? `Status: ${filters.status}` : "Status: All",
    filters.minAmount ? `Min amount: ${filters.minAmount}` : null,
    filters.maxAmount ? `Max amount: ${filters.maxAmount}` : null,
    filters.date ? `Date: ${filters.date}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const rowsMarkup =
    transactions.length > 0
      ? transactions
          .map(
            (transaction, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(transaction.transactionId)}</td>
                <td>${escapeHtml(formatDateTime(transaction.createdAt))}</td>
                <td>${escapeHtml(transaction.customerName || "-")}</td>
                <td>${escapeHtml(transaction.customerEmail || "-")}</td>
                <td>${escapeHtml(formatAmount(transaction.amount, transaction.currency))}</td>
                <td>${escapeHtml(transaction.paymentMethod || "-")}</td>
                <td>${escapeHtml(transaction.status || "-")}</td>
                <td>${escapeHtml(transaction.paymentReference || "-")}</td>
              </tr>
            `
          )
          .join("")
      : `
          <tr>
            <td colspan="9" class="empty">No transactions found for the selected filters.</td>
          </tr>
        `;

  const reportMarkup = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Transaction Report</title>
        <style>
          :root {
            color-scheme: light;
            --ink: #0f172a;
            --muted: #475569;
            --line: #dbe3ef;
            --soft: #f8fafc;
            --accent: #059669;
            --accent-soft: #ecfdf5;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            font-family: "Segoe UI", Tahoma, sans-serif;
            color: var(--ink);
            background: white;
          }
          .sheet {
            border: 1px solid var(--line);
            border-radius: 24px;
            overflow: hidden;
          }
          .header {
            padding: 28px 32px 20px;
            background: linear-gradient(135deg, #f0fdf4, #eff6ff);
            border-bottom: 1px solid var(--line);
          }
          .eyebrow {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 999px;
            background: var(--accent-soft);
            color: var(--accent);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          h1 {
            margin: 14px 0 8px;
            font-size: 28px;
          }
          .meta, .summary {
            color: var(--muted);
            font-size: 14px;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            padding: 20px 32px 0;
          }
          .card {
            border: 1px solid var(--line);
            border-radius: 18px;
            padding: 16px;
            background: var(--soft);
          }
          .card strong {
            display: block;
            font-size: 22px;
            color: var(--ink);
            margin-top: 6px;
          }
          .filters {
            padding: 20px 32px 8px;
            font-size: 13px;
            color: var(--muted);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }
          thead {
            background: #f8fafc;
          }
          th, td {
            padding: 12px 14px;
            border-top: 1px solid var(--line);
            text-align: left;
            vertical-align: top;
            font-size: 13px;
          }
          th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
          }
          tbody tr:nth-child(even) {
            background: #fcfdff;
          }
          .table-wrap {
            padding: 0 32px 28px;
          }
          .empty {
            text-align: center;
            color: var(--muted);
            padding: 28px;
          }
          @media print {
            body {
              padding: 0;
            }
            .sheet {
              border: 0;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <section class="sheet">
          <div class="header">
            <span class="eyebrow">Transaction PDF Report</span>
            <h1>${escapeHtml(merchantName)} Transactions</h1>
            <div class="meta">Generated on ${escapeHtml(generatedAt)}</div>
          </div>

          <div class="summary">
            <div class="card">
              <span>Total records</span>
              <strong>${transactions.length}</strong>
            </div>
            <div class="card">
              <span>Successful payments</span>
              <strong>${transactions.filter((item) => item.status === "Successful").length}</strong>
            </div>
            <div class="card">
              <span>Failed payments</span>
              <strong>${transactions.filter((item) => item.status === "Failed").length}</strong>
            </div>
          </div>

          <div class="filters">
            <strong>Applied filters:</strong> ${escapeHtml(filterSummary || "None")}
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                ${rowsMarkup}
              </tbody>
            </table>
          </div>
        </section>
      </body>
    </html>
  `;

  reportWindow.document.open();
  reportWindow.document.write(reportMarkup);
  reportWindow.document.close();
  reportWindow.focus();

  reportWindow.onload = () => {
    reportWindow.setTimeout(() => {
      reportWindow.focus();
      reportWindow.print();
    }, 300);
  };
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load transactions"
  );
};

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value || "-"}</span>
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function TransactionManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [draftFilters, setDraftFilters] = useState(EMPTY_FILTERS);
  const [appliedCriteria, setAppliedCriteria] = useState({
    search: "",
    filters: EMPTY_FILTERS,
  });
  const [transactions, setTransactions] = useState([]);
  const [merchantName, setMerchantName] = useState(SINGLE_SHOP_NAME);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    pageSize: 10,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsTransaction, setDetailsTransaction] = useState(null);
  const [receiptTransaction, setReceiptTransaction] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const pageSize = pagination.pageSize;

  const activeParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: appliedCriteria.search,
      ...buildAppliedFilters(appliedCriteria.filters),
    }),
    [appliedCriteria.filters, appliedCriteria.search, currentPage, pageSize]
  );

  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async (showLoading = true) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getTransactions(activeParams);

        if (cancelled) {
          return;
        }

        const apiTransactions = data.transactions || [];
        setTransactions(apiTransactions);
        setMerchantName(data.merchantName || SINGLE_SHOP_NAME);
        setPagination({
          currentPage: data.currentPage || currentPage,
          totalPages: data.totalPages || 1,
          total: data.total || apiTransactions.length,
          pageSize: data.pageSize || pageSize,
        });
        setError("");
      } catch (requestError) {
        if (!cancelled) {
          setTransactions([]);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    };

    loadTransactions(true);
    const intervalId = setInterval(() => loadTransactions(false), 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [activeParams, currentPage, pageSize, refreshToken]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setAppliedCriteria({
      search: searchInput.trim(),
      filters: { ...draftFilters },
    });
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedCriteria({
      search: searchInput.trim(),
      filters: { ...draftFilters },
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDraftFilters(EMPTY_FILTERS);
    setCurrentPage(1);
    setAppliedCriteria({
      search: "",
      filters: EMPTY_FILTERS,
    });
  };

  const handleRefresh = () => {
    setError("");
    setRefreshToken((value) => value + 1);
  };

  const handleExport = async () => {
    try {
      const reportData = await getTransactions({
        page: 1,
        limit: Math.max(pagination.total || 0, pageSize, 10),
        search: appliedCriteria.search,
        ...buildAppliedFilters(appliedCriteria.filters),
      });
      openTransactionPdfReport({
        merchantName,
        filters: appliedCriteria.filters,
        transactions: reportData.transactions || [],
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleViewDetails = async (transaction) => {
    try {
      const data = await getTransactionById(transaction._id);
      setDetailsTransaction(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleViewReceipt = async (transaction) => {
    try {
      const data = await getTransactionById(transaction._id);
      setReceiptTransaction(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area,
          .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Active shop: {merchantName}
            </div>
            <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Transaction Management
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Transaction Management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Track, inspect, and export payment transactions for your shop directly from MongoDB.
                </p>
              </div>

              <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search transaction ID, customer, or payment reference"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800"
                >
                  <Search size={16} />
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                >
                  <Download size={16} />
                  Export PDF
                </button>
              </form>

              <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
                <select
                  value={draftFilters.status}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, status: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status || "all"} value={status}>
                      {status || "All statuses"}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftFilters.minAmount}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, minAmount: event.target.value }))
                  }
                  placeholder="Minimum amount"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftFilters.maxAmount}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, maxAmount: event.target.value }))
                  }
                  placeholder="Maximum amount"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400"
                />
                <input
                  type="date"
                  value={draftFilters.date}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, date: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <Filter size={16} />
                  Apply Filter
                </button>
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <TransactionTable
              transactions={transactions}
              loading={loading}
              error=""
              total={pagination.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              merchantName={merchantName}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
              onViewReceipt={handleViewReceipt}
            />
          </div>
        </main>
      </div>

      {detailsTransaction ? (
        <ModalShell title="Transaction Details" onClose={() => setDetailsTransaction(null)}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <DetailRow label="Transaction ID" value={detailsTransaction.transactionId} />
              <DetailRow label="Shop name" value={detailsTransaction.merchantName || merchantName} />
              <DetailRow label="Customer name" value={detailsTransaction.customerName} />
              <DetailRow label="Customer email" value={detailsTransaction.customerEmail} />
              <DetailRow label="Amount" value={formatAmount(detailsTransaction.amount, detailsTransaction.currency)} />
              <DetailRow label="Currency" value={detailsTransaction.currency} />
              <DetailRow label="Payment method" value={detailsTransaction.paymentMethod} />
              <DetailRow label="Payment reference" value={detailsTransaction.paymentReference} />
              <DetailRow label="Status" value={detailsTransaction.status} />
              <DetailRow
                label="Refund status"
                value={
                  detailsTransaction.refundSummary?.hasRefundRequest
                    ? detailsTransaction.refundSummary.latestRefundStatus || "Requested"
                    : "No refund request"
                }
              />
              <DetailRow label="Description" value={detailsTransaction.description} />
              <DetailRow label="Created date" value={formatDateTime(detailsTransaction.createdAt)} />
              <DetailRow label="Updated date" value={formatDateTime(detailsTransaction.updatedAt)} />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">Metadata</h4>
                <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                  {JSON.stringify(detailsTransaction.metadata || {}, null, 2)}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-slate-900">Lifecycle History</h4>
                <div className="mt-3 space-y-3">
                  {(detailsTransaction.lifecycleHistory || []).length === 0 ? (
                    <p className="text-sm text-slate-500">No lifecycle history available.</p>
                  ) : (
                    detailsTransaction.lifecycleHistory.map((entry, index) => (
                      <div key={`${entry.changedAt}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{entry.status}</p>
                          <p className="text-xs text-slate-500">{formatDateTime(entry.changedAt)}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          Previous status: {entry.previousStatus || "None"}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          Reason: {entry.reason || "-"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {receiptTransaction ? (
        <ModalShell title="Transaction Receipt" onClose={() => setReceiptTransaction(null)}>
          <div className="print-area rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="border-b border-dashed border-slate-300 pb-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Receipt</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">Transaction Receipt</h3>
            </div>

            <div className="mt-5 space-y-2">
              <DetailRow label="Transaction ID" value={receiptTransaction.transactionId} />
              <DetailRow label="Shop name" value={receiptTransaction.merchantName || merchantName} />
              <DetailRow label="Customer name" value={receiptTransaction.customerName} />
              <DetailRow label="Amount" value={formatAmount(receiptTransaction.amount, receiptTransaction.currency)} />
              <DetailRow label="Currency" value={receiptTransaction.currency} />
              <DetailRow label="Payment method" value={receiptTransaction.paymentMethod} />
              <DetailRow label="Payment reference" value={receiptTransaction.paymentReference} />
              <DetailRow label="Status" value={receiptTransaction.status} />
              <DetailRow label="Transaction date" value={formatDateTime(receiptTransaction.createdAt)} />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => setReceiptTransaction(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={printReceipt}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Printer size={16} />
                Print Receipt
              </button>
            </div>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}
