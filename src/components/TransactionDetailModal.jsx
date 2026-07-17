// src/components/TransactionDetailModal.jsx
// A modal that displays transaction receipt details and supports printing/downloading.

import { useRef } from "react";
import { X, CheckCircle, XCircle, Clock, ShieldCheck, Printer, Download } from "lucide-react";

const STATUS_CONFIG = {
  Completed: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "COMPLETED" },
  Successful: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "COMPLETED" },
  Pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "PENDING" },
  Processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "PROCESSING" },
  Failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "FAILED" },
  Cancelled: { icon: XCircle, color: "text-slate-400", bg: "bg-slate-50", label: "CANCELLED" },
};

function formatFullDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatCurrency(amount) {
  return Number(amount).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TransactionDetailModal({ transaction, onClose }) {
  const receiptRef = useRef(null);

  if (!transaction) return null;

  const t = transaction;
  const statusCfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.Pending;
  const StatusIcon = statusCfg.icon;

  const amount = Number(t.amount) || 0;
  const processingFeeRate = 0.012;
  const processingFee = amount * processingFeeRate;
  const gatewayFee = 8.39;
  const netSettlement = amount - processingFee - gatewayFee;

  // Generate a pseudo latency & risk score from the transaction ID for demo
  const hash = (t.transactionId || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const latency = 80 + (hash % 200);
  const riskScore = ((hash % 50) / 1000).toFixed(2);

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=420,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction Receipt - ${t.transactionId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 32px; max-width: 420px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 24px; }
            .amount { font-size: 28px; font-weight: 700; margin: 8px 0 4px; }
            .status { display: inline-block; padding: 2px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
            .status.completed { background: #ecfdf5; color: #059669; }
            .status.failed { background: #fef2f2; color: #dc2626; }
            .status.pending { background: #fffbeb; color: #d97706; }
            .divider { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
            .row .label { color: #64748b; }
            .row .value { font-weight: 500; text-align: right; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin: 16px 0 8px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-weight: 700; }
            .metrics { display: flex; gap: 16px; margin-top: 8px; }
            .metric-box { flex: 1; background: #f8fafc; border-radius: 8px; padding: 12px; text-align: center; }
            .metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; }
            .metric-value { font-size: 18px; font-weight: 700; margin-top: 4px; }
            .security-badge { margin-top: 16px; background: #ecfdf5; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
            .security-badge .icon { color: #059669; }
            .security-badge .title { font-size: 13px; font-weight: 600; color: #059669; }
            .security-badge .subtitle { font-size: 11px; color: #64748b; }
            .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
            @media print { body { padding: 16px; } }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>PayGateway – Real Time Payment Processing</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownload = () => {
    const content = receiptRef.current;
    if (!content) return;
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Receipt - ${t.transactionId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; padding: 32px; max-width: 420px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 24px; }
            .amount { font-size: 28px; font-weight: 700; margin: 8px 0 4px; }
            .status { display: inline-block; padding: 2px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
            .status.completed { background: #ecfdf5; color: #059669; }
            .status.failed { background: #fef2f2; color: #dc2626; }
            .status.pending { background: #fffbeb; color: #d97706; }
            .divider { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
            .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
            .row .label { color: #64748b; }
            .row .value { font-weight: 500; text-align: right; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; margin: 16px 0 8px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-weight: 700; }
            .metrics { display: flex; gap: 16px; margin-top: 8px; }
            .metric-box { flex: 1; background: #f8fafc; border-radius: 8px; padding: 12px; text-align: center; }
            .metric-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 600; }
            .metric-value { font-size: 18px; font-weight: 700; margin-top: 4px; }
            .security-badge { margin-top: 16px; background: #ecfdf5; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
            .security-badge .title { font-size: 13px; font-weight: 600; color: #059669; }
            .security-badge .subtitle { font-size: 11px; color: #64748b; }
            .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>PayGateway – Real Time Payment Processing</p>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${t.transactionId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusClass =
    t.status === "Completed" || t.status === "Successful"
      ? "completed"
      : t.status === "Failed"
      ? "failed"
      : "pending";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-lg font-bold text-slate-900">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable receipt content */}
        <div className="max-h-[70vh] overflow-y-auto px-6 pb-4">
          <div ref={receiptRef}>
            {/* Amount & Status */}
            <div className="header text-center py-4">
              <div className="flex justify-center mb-2">
                <StatusIcon className={`h-12 w-12 ${statusCfg.color}`} />
              </div>
              <p className="amount text-3xl font-bold text-slate-900">
                Rs.{formatCurrency(amount)}
              </p>
              <span
                className={`status ${statusClass} inline-block mt-1 rounded-full px-3 py-0.5 text-xs font-semibold`}
                style={{
                  background:
                    statusClass === "completed"
                      ? "#ecfdf5"
                      : statusClass === "failed"
                      ? "#fef2f2"
                      : "#fffbeb",
                  color:
                    statusClass === "completed"
                      ? "#059669"
                      : statusClass === "failed"
                      ? "#dc2626"
                      : "#d97706",
                }}
              >
                {statusCfg.label}
              </span>
            </div>

            <hr className="divider border-t border-slate-200 my-3" />

            {/* Transaction Info */}
            <div className="space-y-2">
              <div className="row flex justify-between text-sm">
                <span className="label text-slate-500">Transaction ID</span>
                <span className="value font-medium text-slate-900">{t.transactionId}</span>
              </div>
              <div className="row flex justify-between text-sm">
                <span className="label text-slate-500">Merchant</span>
                <span className="value font-medium text-slate-900">
                  {t.description || t.merchantName || "Online Payment"}
                </span>
              </div>
              <div className="row flex justify-between text-sm">
                <span className="label text-slate-500">Timestamp</span>
                <span className="value font-medium text-slate-900">
                  {formatFullDateTime(t.dateTime || t.createdAt)}
                </span>
              </div>
              <div className="row flex justify-between text-sm">
                <span className="label text-slate-500">Network</span>
                <span className="value font-medium text-slate-900">
                  {t.method || "VISA NET (LK)"}
                </span>
              </div>
            </div>

            <hr className="divider border-t border-slate-200 my-3" />

            {/* Fee Breakdown */}
            <div>
              <p className="section-title text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Fee Breakdown
              </p>
              <div className="space-y-1.5">
                <div className="row flex justify-between text-sm">
                  <span className="label text-slate-500">Processing Fee (1.2%)</span>
                  <span className="value font-medium text-slate-900">
                    Rs.{formatCurrency(processingFee)}
                  </span>
                </div>
                <div className="row flex justify-between text-sm">
                  <span className="label text-slate-500">Fixed Gateway Fee</span>
                  <span className="value font-medium text-slate-900">
                    Rs.{formatCurrency(gatewayFee)}
                  </span>
                </div>
              </div>

              <hr className="divider border-t border-slate-200 my-3" />

              <div className="total-row flex justify-between text-sm font-bold">
                <span className="text-slate-700">Total Net Settlement</span>
                <span className="text-slate-900">Rs.{formatCurrency(netSettlement)}</span>
              </div>
            </div>
            {/* Security Badge */}
            <div className="security-badge mt-4 bg-emerald-50 rounded-lg p-3 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="title text-sm font-semibold text-emerald-600">Encrypted Transaction</p>
                <p className="subtitle text-xs text-slate-500">
                  Verified via AES-256 Protocol Hub
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-5 pt-2 space-y-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0F1117] py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Statement
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
