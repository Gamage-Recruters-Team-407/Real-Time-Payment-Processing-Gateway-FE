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
  exportTransactions,
  getTransactionById,
  getTransactions,
} from "../services/transactionService";

const EMPTY_FILTERS = {
  status: "",
  minAmount: "",
  maxAmount: "",
  startDate: "",
  endDate: "",
};

const STATUS_OPTIONS = ["", "Pending", "Processing", "Successful", "Failed", "Cancelled"];
const SINGLE_SHOP_NAME = "Main Shop";

const DUMMY_TRANSACTIONS = [
  {
    _id: "demo-001",
    transactionId: "TXN-100001",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Nimal Perera",
    customerEmail: "nimal.perera@example.com",
    amount: 4500,
    currency: "LKR",
    paymentMethod: "Visa",
    status: "Successful",
    paymentReference: "PAY-2026-1001",
    description: "Monthly grocery purchase",
    metadata: { terminalId: "POS-01", channel: "Card Present" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-10T08:21:00.000Z",
        reason: "Payment request received",
      },
      {
        status: "Processing",
        previousStatus: "Pending",
        changedAt: "2026-07-10T08:22:10.000Z",
        reason: "Gateway authorized the transaction",
      },
      {
        status: "Successful",
        previousStatus: "Processing",
        changedAt: "2026-07-10T08:24:30.000Z",
        reason: "Funds captured successfully",
      },
    ],
    createdAt: "2026-07-10T08:21:00.000Z",
    updatedAt: "2026-07-10T08:24:30.000Z",
  },
  {
    _id: "demo-002",
    transactionId: "TXN-100002",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Ayesha Ali",
    customerEmail: "ayesha.ali@example.com",
    amount: 12850,
    currency: "LKR",
    paymentMethod: "MasterCard",
    status: "Processing",
    paymentReference: "PAY-2026-1002",
    description: "Online device purchase",
    metadata: { terminalId: "WEB-12", channel: "E-Commerce" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-10T10:10:00.000Z",
        reason: "Payment request received",
      },
      {
        status: "Processing",
        previousStatus: "Pending",
        changedAt: "2026-07-10T10:11:25.000Z",
        reason: "Awaiting bank confirmation",
      },
    ],
    createdAt: "2026-07-10T10:10:00.000Z",
    updatedAt: "2026-07-10T10:11:25.000Z",
  },
  {
    _id: "demo-003",
    transactionId: "TXN-100003",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Mohamed Shiraz",
    customerEmail: "shiraz@example.com",
    amount: 22000,
    currency: "LKR",
    paymentMethod: "Bank Transfer",
    status: "Failed",
    paymentReference: "PAY-2026-1003",
    description: "Hotel booking payment",
    metadata: { terminalId: "MOB-08", channel: "Mobile App" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-09T14:00:00.000Z",
        reason: "Payment request received",
      },
      {
        status: "Failed",
        previousStatus: "Pending",
        changedAt: "2026-07-09T14:00:40.000Z",
        reason: "Insufficient balance",
      },
    ],
    createdAt: "2026-07-09T14:00:00.000Z",
    updatedAt: "2026-07-09T14:00:40.000Z",
  },
  {
    _id: "demo-004",
    transactionId: "TXN-100004",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Dinesh Fernando",
    customerEmail: "dinesh.fernando@example.com",
    amount: 3650,
    currency: "LKR",
    paymentMethod: "Visa",
    status: "Cancelled",
    paymentReference: "PAY-2026-1004",
    description: "Medicine order cancellation",
    metadata: { terminalId: "POS-04", channel: "Card Present" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-08T09:30:00.000Z",
        reason: "Payment request received",
      },
      {
        status: "Cancelled",
        previousStatus: "Pending",
        changedAt: "2026-07-08T09:34:18.000Z",
        reason: "Customer cancelled before settlement",
      },
    ],
    createdAt: "2026-07-08T09:30:00.000Z",
    updatedAt: "2026-07-08T09:34:18.000Z",
  },
  {
    _id: "demo-005",
    transactionId: "TXN-100005",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Anushka Silva",
    customerEmail: "anushka.silva@example.com",
    amount: 18700,
    currency: "LKR",
    paymentMethod: "Apple Pay",
    status: "Successful",
    paymentReference: "PAY-2026-1005",
    description: "Software license renewal",
    metadata: { terminalId: "WEB-31", channel: "E-Commerce" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-07T16:45:00.000Z",
        reason: "Payment request received",
      },
      {
        status: "Processing",
        previousStatus: "Pending",
        changedAt: "2026-07-07T16:45:40.000Z",
        reason: "Gateway authorization in progress",
      },
      {
        status: "Successful",
        previousStatus: "Processing",
        changedAt: "2026-07-07T16:46:08.000Z",
        reason: "Funds captured successfully",
      },
    ],
    createdAt: "2026-07-07T16:45:00.000Z",
    updatedAt: "2026-07-07T16:46:08.000Z",
  },
  {
    _id: "demo-006",
    transactionId: "TXN-100006",
    merchantName: SINGLE_SHOP_NAME,
    customerName: "Kasun Rajapaksha",
    customerEmail: "kasun.rajapaksha@example.com",
    amount: 8900,
    currency: "LKR",
    paymentMethod: "QR Pay",
    status: "Pending",
    paymentReference: "PAY-2026-1006",
    description: "Fuel top-up transaction",
    metadata: { terminalId: "MOB-19", channel: "Mobile App" },
    lifecycleHistory: [
      {
        status: "Pending",
        previousStatus: null,
        changedAt: "2026-07-11T07:10:00.000Z",
        reason: "Payment request received",
      },
    ],
    createdAt: "2026-07-11T07:10:00.000Z",
    updatedAt: "2026-07-11T07:10:00.000Z",
  },
];

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '""';
  }

  const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
};

const buildCsv = (transactions) => {
  const headers = [
    "transactionId",
    "merchantName",
    "customerName",
    "customerEmail",
    "amount",
    "currency",
    "paymentMethod",
    "status",
    "paymentReference",
    "description",
    "metadata",
    "createdAt",
    "updatedAt",
  ];

  const rows = transactions.map((transaction) =>
    [
      transaction.transactionId,
      transaction.merchantName,
      transaction.customerName,
      transaction.customerEmail,
      transaction.amount,
      transaction.currency,
      transaction.paymentMethod,
      transaction.status,
      transaction.paymentReference,
      transaction.description,
      transaction.metadata,
      transaction.createdAt,
      transaction.updatedAt,
    ]
      .map(escapeCsvValue)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
};

const downloadTextFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

const applyLocalFilters = (transactions, criteria) => {
  const search = criteria.search.trim().toLowerCase();
  const filters = criteria.filters;
  const minAmount = filters.minAmount === "" ? null : Number(filters.minAmount);
  const maxAmount = filters.maxAmount === "" ? null : Number(filters.maxAmount);
  const startDate = filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters.endDate ? new Date(filters.endDate) : null;

  return transactions.filter((transaction) => {
    const searchableValues = [
      transaction.transactionId,
      transaction.merchantName,
      transaction.customerName,
      transaction.paymentReference,
    ]
      .join(" ")
      .toLowerCase();

    if (search && !searchableValues.includes(search)) {
      return false;
    }

    if (filters.status && transaction.status !== filters.status) {
      return false;
    }

    const amount = Number(transaction.amount);
    if (minAmount !== null && amount < minAmount) {
      return false;
    }

    if (maxAmount !== null && amount > maxAmount) {
      return false;
    }

    const transactionDate = new Date(transaction.createdAt);
    if (startDate && transactionDate < startDate) {
      return false;
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (transactionDate > endOfDay) {
        return false;
      }
    }

    return true;
  });
};

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
  const [dataMode, setDataMode] = useState("api");
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
  const localTransactions = useMemo(
    () => applyLocalFilters(DUMMY_TRANSACTIONS, appliedCriteria),
    [appliedCriteria]
  );
  const localTotalPages = Math.max(Math.ceil(localTransactions.length / pageSize), 1);
  const localCurrentPage = Math.min(currentPage, localTotalPages);
  const localVisibleTransactions = useMemo(() => {
    const start = (localCurrentPage - 1) * pageSize;
    return localTransactions.slice(start, start + pageSize);
  }, [localCurrentPage, localTransactions, pageSize]);

  const activeParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: appliedCriteria.search,
      ...appliedCriteria.filters,
    }),
    [appliedCriteria.filters, appliedCriteria.search, currentPage, pageSize]
  );

  useEffect(() => {
    if (dataMode === "dummy") {
      setLoading(false);
      setError("");
      return undefined;
    }

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
        if (apiTransactions.length === 0) {
          setDataMode("dummy");
          setError("");
          return;
        }

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
          setDataMode("dummy");
          setError("");
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
  }, [activeParams, currentPage, dataMode, pageSize, refreshToken]);

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
    if (dataMode === "dummy") {
      setCurrentPage(1);
      setError("");
      return;
    }

    setRefreshToken((value) => value + 1);
  };

  const handleExport = async () => {
    try {
      if (dataMode === "dummy") {
        downloadTextFile(buildCsv(localTransactions), "transactions.csv", "text/csv;charset=utf-8;");
        return;
      }

      const response = await exportTransactions({
        search: appliedCriteria.search,
        ...appliedCriteria.filters,
      });
      downloadTextFile(response.data, "transactions.csv", "text/csv;charset=utf-8;");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleViewDetails = async (transaction) => {
    try {
      if (dataMode === "dummy") {
        setDetailsTransaction(transaction);
        return;
      }

      const data = await getTransactionById(transaction._id);
      setDetailsTransaction(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleViewReceipt = async (transaction) => {
    try {
      if (dataMode === "dummy") {
        setReceiptTransaction(transaction);
        return;
      }

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
                {dataMode === "dummy" ? (
                  <div className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                    Demo data loaded locally
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleSearch} className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto_auto]">
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
                  onClick={handleApplyFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <Filter size={16} />
                  Apply Filters
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
                  Export CSV
                </button>
              </form>

              <div className="grid gap-3 lg:grid-cols-5">
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
                  value={draftFilters.startDate}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, startDate: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
                <input
                  type="date"
                  value={draftFilters.endDate}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, endDate: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {error ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <TransactionTable
              transactions={dataMode === "dummy" ? localVisibleTransactions : transactions}
              loading={loading}
              error=""
              total={dataMode === "dummy" ? localTransactions.length : pagination.total}
              currentPage={dataMode === "dummy" ? localCurrentPage : pagination.currentPage}
              totalPages={dataMode === "dummy" ? localTotalPages : pagination.totalPages}
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
