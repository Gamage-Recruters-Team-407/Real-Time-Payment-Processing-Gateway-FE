import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  FileText,
  Eye,
  ArrowDown,
  X,
  Printer,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

// ---- Mock transaction data --------------------------------------------
// NOTE: the transaction table itself belongs to Dev 6 (Payment History) /
// Dev 11 (Transaction Management) — swap TRANSACTIONS below for their
// GET /api/transactions endpoint once it's ready. Only the 3 stat cards
// above the table are wired to this module's own backend (userController.js).
const TRANSACTIONS = [
  {
    id: "TXN_98214300",
    date: "June 24, 2026",
    time: "14:32:05",
    method: "Visa •••• 4421",
    amount: "$1,240.00",
    amountSub: "Rs.",
    status: "COMPLETED",
    merchant: "Amazon Web Services",
    network: "VISA NET (LK)",
    fee: "Rs.14.88",
    fixedFee: "Rs.0.30",
    net: "Rs.1,224.82",
    latency: "142ms",
    risk: "0.02",
  },
  {
    id: "TXN_98214295",
    date: "June 20, 2026",
    time: "12:15:11",
    method: "Wire Transfer",
    amount: "$55,000.00",
    amountSub: "Rs.",
    status: "FLAGGED",
    merchant: "Silverline Traders",
    network: "SWIFT",
    fee: "Rs.660.00",
    fixedFee: "Rs.0.30",
    net: "Rs.54,339.70",
    latency: "980ms",
    risk: "0.71",
  },
  {
    id: "TXN_98214211",
    date: "June 18, 2026",
    time: "22:01:44",
    method: "G-Credits",
    amount: "$12.45",
    amountSub: "Rs.",
    status: "COMPLETED",
    merchant: "Google Play",
    network: "G-CREDITS",
    fee: "Rs.0.15",
    fixedFee: "Rs.0.30",
    net: "Rs.12.00",
    latency: "88ms",
    risk: "0.01",
  },
  {
    id: "TXN_98214199",
    date: "June 15, 2026",
    time: "19:44:22",
    method: "Visa •••• 1192",
    amount: "$15.99",
    amountSub: "Rs.",
    status: "FAILED",
    merchant: "Netflix",
    network: "VISA NET (LK)",
    fee: "Rs.0.00",
    fixedFee: "Rs.0.00",
    net: "Rs.0.00",
    latency: "210ms",
    risk: "0.05",
  },
];

const STATUS_STYLES = {
  COMPLETED: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  FLAGGED: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  FAILED: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};

const formatCurrency = (value) =>
  `Rs.${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// -----------------------------------------------------------------------

function StatCard({ label, value, sub, trend }) {
  const subColor =
    trend === "success" ? "text-emerald-600" : trend === "error" ? "text-rose-500" : "text-slate-400";
  return (
    <div className="flex-1 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#0A192F]">{value}</p>
      <p className={`mt-1 text-xs ${subColor}`}>{sub}</p>
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function TransactionDetails({ txn, onClose }) {
  if (!txn) return null;
  return (
    <aside className="w-[340px] shrink-0 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#0A192F]">Transaction Details</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close transaction details"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck size={20} />
        </div>
        <p className="mt-3 text-2xl font-semibold text-[#0A192F]">{txn.amount}</p>
        <p className="text-xs font-medium text-emerald-600">{txn.status}</p>
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-400">Merchant</dt>
          <dd className="font-medium text-[#0A192F]">{txn.merchant}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Timestamp</dt>
          <dd className="font-medium text-[#0A192F]">{txn.date} {txn.time}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-400">Network</dt>
          <dd className="font-medium text-[#0A192F]">{txn.network}</dd>
        </div>
      </dl>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Fee breakdown</p>
      <dl className="mt-2 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Processing Fee (1.2%)</dt>
          <dd className="text-[#0A192F]">{txn.fee}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Fixed Gateway Fee</dt>
          <dd className="text-[#0A192F]">{txn.fixedFee}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
          <dt className="text-[#0A192F]">Total Net Settlement</dt>
          <dd className="text-[#0A192F]">{txn.net}</dd>
        </div>
      </dl>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Technical metrics</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] uppercase text-slate-400">Latency</p>
          <p className="text-sm font-semibold text-[#0A192F]">{txn.latency}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] uppercase text-slate-400">Risk score</p>
          <p className="text-sm font-semibold text-[#0A192F]">{txn.risk}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
        <ShieldCheck size={16} className="shrink-0" />
        <div>
          <p className="font-semibold">Encrypted Transaction</p>
          <p className="text-emerald-600">Verified via AES-256 Protocol Hub</p>
        </div>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A192F] py-2.5 text-sm font-medium text-white hover:bg-[#0d223f]">
        <Printer size={15} /> Print Statement
      </button>
      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50">
        <AlertTriangle size={15} /> Dispute Transaction
      </button>
    </aside>
  );
}

export default function Dashboard() {
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/users/me");
        if (!cancelled) setDashboardData(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Couldn't load dashboard data. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = dashboardData?.stats;

  const STATS = [
    {
      label: "Total Volume",
      value: formatCurrency(stats?.totalVolume),
      sub: "All-time settled volume",
      trend: "up",
    },
    {
      label: "Successful",
      value: stats?.successful ?? 0,
      sub: `${stats?.successRate ?? 0}% success rate`,
      trend: "success",
    },
    {
      label: "Failed",
      value: stats?.failed ?? 0,
      sub: "System declines or bounce-backs",
      trend: "error",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      {/* ---------------- Sidebar ---------------- */}
      <Sidebar />

      {/* ---------------- Main ---------------- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top nav */}
        <Navbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F]">
                {dashboardData?.name ? `Welcome, ${dashboardData.name}` : "Payment History"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Monitoring financial activities across all merchant terminals.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                <FileText size={15} /> Export CSV
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#0A192F] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d223f]">
                <Plus size={15} /> New Transaction
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 flex gap-4">
            {loading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 flex-1 animate-pulse rounded-xl bg-white ring-1 ring-slate-100"
                  />
                ))
              : STATS.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Filter bar */}
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-400">
              <Search size={15} />
              <span>Search Merchant, ID, or Customer</span>
            </div>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
              June 01 - June 31, 2026
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
              All Statuses
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500">
              Payment Method
            </button>
            <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
              <SlidersHorizontal size={16} />
            </button>
            <button className="text-sm font-medium text-emerald-600">Clear All</button>
          </div>

          <div className="mt-6 flex gap-6">
            {/* Table (still mock — belongs to Dev 6 / Dev 11's endpoint) */}
            <div className="flex-1 rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-medium">Date/Time</th>
                    <th className="px-5 py-3 font-medium">Transaction ID</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((txn) => (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50 ${
                        selectedTxn?.id === txn.id ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#0A192F]">{txn.date}</p>
                        <p className="text-xs text-slate-400">{txn.time}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{txn.id}</td>
                      <td className="px-5 py-4 text-slate-500">{txn.method}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#0A192F]">{txn.amount}</p>
                        <p className="text-xs text-slate-400">{txn.amountSub}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill status={txn.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-slate-400">
                          <Eye size={15} className="hover:text-[#0A192F]" />
                          <ArrowDown size={15} className="hover:text-[#0A192F]" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-5 py-4 text-sm text-slate-400">
                <span>Showing 1 to 10 of 2,401 transactions</span>
                <div className="flex items-center gap-1">
                  <button className="rounded p-1 hover:bg-slate-100">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="h-7 w-7 rounded bg-[#0A192F] text-xs font-medium text-white">1</button>
                  <button className="h-7 w-7 rounded text-xs font-medium hover:bg-slate-100">2</button>
                  <button className="h-7 w-7 rounded text-xs font-medium hover:bg-slate-100">3</button>
                  <span className="px-1">...</span>
                  <button className="h-7 w-7 rounded text-xs font-medium hover:bg-slate-100">240</button>
                  <button className="rounded p-1 hover:bg-slate-100">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Detail panel */}
            <TransactionDetails txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
          </div>
        </main>
      </div>
    </div>
  );
}