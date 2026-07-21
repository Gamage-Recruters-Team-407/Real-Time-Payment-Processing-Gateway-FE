import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import { getAllRefunds } from "../services/refundService";
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
  const document = new jsPDF("landscape");
  const generatedAt = new Date().toLocaleString();
  const filterSummary =
    [
      filters.status ? `Status: ${filters.status}` : "Status: All",
      filters.minAmount ? `Min amount: ${filters.minAmount}` : null,
      filters.maxAmount ? `Max amount: ${filters.maxAmount}` : null,
      filters.date ? `Date: ${filters.date}` : null,
    ]
      .filter(Boolean)
      .join(" | ") || "None";

  const tableRows =
    transactions.length > 0
      ? transactions.map((transaction, index) => [
          index + 1,
          transaction.transactionId || "-",
          formatDateTime(transaction.createdAt),
          transaction.customerName || "-",
          formatAmount(transaction.amount, transaction.currency),
          transaction.paymentMethod || "-",
          transaction.status || "-",
          transaction.paymentReference || "-",
        ])
      : [["-", "-", "-", "-", "-", "-", "-", "No transactions found for the selected filters."]];

  document.setFont("helvetica", "bold");
  document.setFontSize(18);
  document.text("Transactions", 14, 18);

  document.setFont("helvetica", "normal");
  document.setFontSize(10);
  document.text(`Generated on ${generatedAt}`, 14, 26);
  document.text(`Applied filters: ${filterSummary}`, 14, 32);

  document.setFontSize(11);
  document.text(`Total records: ${transactions.length}`, 14, 40);
  document.text(
    `Successful payments: ${transactions.filter((item) => item.status === "Successful").length}`,
    78,
    40
  );
  document.text(
    `Failed payments: ${transactions.filter((item) => item.status === "Failed").length}`,
    165,
    40
  );

  autoTable(document, {
    startY: 48,
    head: [[
      "#",
      "Transaction ID",
      "Date",
      "Customer",
      "Amount",
      "Method",
      "Status",
      "Reference",
    ]],
    body: tableRows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: {
      top: 14,
      left: 14,
      right: 14,
      bottom: 16,
    },
    didDrawPage: () => {
      const pageWidth = document.internal.pageSize.getWidth();
      const pageHeight = document.internal.pageSize.getHeight();
      const pageNumber = document.internal.getCurrentPageInfo().pageNumber;

      document.setFont("helvetica", "normal");
      document.setFontSize(9);
      document.text("Real-Time Payment Processing Gateway", 14, pageHeight - 8);
      document.text(`Page ${pageNumber}`, pageWidth - 26, pageHeight - 8);
    },
  });

  const reportDate = new Date().toISOString().split("T")[0];
  document.save(`transaction_report_${reportDate}.pdf`);
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load transactions"
  );
};

const getLatestRefundForTransaction = (refunds, transactionId) => {
  return refunds
    .filter((refund) => refund.transactionId === transactionId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))[0] || null;
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

  const handleRefresh = () => {
    setError("");
    setSearchInput("");
    setDraftFilters(EMPTY_FILTERS);
    setCurrentPage(1);
    setAppliedCriteria({
      search: "",
      filters: EMPTY_FILTERS,
    });
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
      let refundDetails = null;

      if (data.refundSummary?.hasRefundRequest && data.transactionId) {
        const refundResponse = await getAllRefunds();
        const refunds = Array.isArray(refundResponse?.data)
          ? refundResponse.data
          : refundResponse?.data?.data || [];

        refundDetails = getLatestRefundForTransaction(refunds, data.transactionId);
      }

      setDetailsTransaction({
        ...data,
        refundDetails,
      });
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
              </div>

              <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
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
              {detailsTransaction.refundDetails ? (
                <>
                  <DetailRow label="Refund ID" value={detailsTransaction.refundDetails.refundId} />
                  <DetailRow label="Refund amount" value={formatAmount(detailsTransaction.refundDetails.amount, detailsTransaction.currency)} />
                  <DetailRow label="Refund reason" value={detailsTransaction.refundDetails.reason} />
                  <DetailRow label="Refund requested date" value={formatDateTime(detailsTransaction.refundDetails.createdAt)} />
                  <DetailRow label="Refund approved date" value={formatDateTime(detailsTransaction.refundDetails.approvedDate)} />
                  <DetailRow label="Refunded date" value={formatDateTime(detailsTransaction.refundDetails.refundedDate)} />
                </>
              ) : null}
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
