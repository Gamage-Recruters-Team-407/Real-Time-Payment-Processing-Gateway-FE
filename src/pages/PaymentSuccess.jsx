// src/pages/PaymentSuccess.jsx
//
// Renders Navbar + Sidebar inline, same pattern as AdminDashboard.jsx, since
// UserLayout.jsx/AdminLayout.jsx are still empty. Once those layouts exist,
// this can drop the Navbar/Sidebar lines and just export the inner content.
//
// Data: real API via transactionService.js (no mock data).
// If the payment flow navigates here with
// navigate('/payment-success', { state: { transaction } }), that data is
// used directly instead of an extra fetch - see the useEffect below.
//
// Note: there's no merchant/counterparty field anywhere in the backend
// (Payment.js has no such field, and Users are Admin/HR/Manager/Employee,
// not customers/merchants) - so unlike the Figma mockup, this doesn't show
// a "Paid to X" line. Ask Nimna if a real merchant field should be added to
// Payment.js; happy to wire it through once it exists.

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getLatestTransaction,
  downloadReceipt,
} from "../services/transactionService";

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
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(
    location.state?.transaction ?? null
  );
  const [loading, setLoading] = useState(!location.state?.transaction);
  const [loadError, setLoadError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    if (transaction) return;

    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getLatestTransaction()
      .then((data) => {
        if (!cancelled) setTransaction(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err.response?.status === 401
              ? "You need to be signed in to view this."
              : "Couldn't load your transaction. Please try again."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [transaction]);

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadReceipt(transaction.transactionId);
    } catch (err) {
      setDownloadError("Couldn't generate the receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDone = () => {
    navigate("/payment-history");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 flex items-center justify-center px-8 py-12">
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            ) : loadError || !transaction ? (
              <p className="text-sm text-slate-400">
                {loadError || "We couldn't find that transaction."}
              </p>
            ) : (
              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
                    <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />
                  </div>

                  <p className="mt-4 text-sm font-medium text-emerald-600">
                    Payment successful
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <Row label="Transaction ID" value={transaction.transactionId} />
                  <Row
                    label="Date & time"
                    value={formatDateTime(transaction.dateTime)}
                  />
                  <Row label="Payment method" value={transaction.method} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Status</span>
                    <StatusBadge status={transaction.status} />
                  </div>
                </div>

                {downloadError && (
                  <p className="mt-4 text-center text-xs text-red-500">
                    {downloadError}
                  </p>
                )}

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    disabled={downloading}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloading ? "Preparing…" : "Download receipt"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDone}
                    className="flex-1 rounded-lg bg-[#0F1117] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

const STATUS_STYLES = {
  Completed: "bg-emerald-50 text-emerald-600",
  Pending: "bg-slate-100 text-slate-600",
  Flagged: "bg-amber-50 text-amber-600",
  Failed: "bg-red-50 text-red-600",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}