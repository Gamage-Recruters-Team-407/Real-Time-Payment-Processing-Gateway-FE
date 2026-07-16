import React from "react";
import { Mail } from "lucide-react";

export default function ResetPasswordForm({
  recoveryEmail,
  setRecoveryEmail,
  handleSendResetLink,
  resetEmailSuccess,
  resetEmailError,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#0A192F] mb-4">Reset Password</h2>
      <p className="text-xs text-slate-400 mb-4">
        A secure reset link will be sent to your registered email address.
      </p>
      <form onSubmit={handleSendResetLink} className="space-y-4">
        <div>
          <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Recovery Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              <Mail size={15} />
            </span>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm text-[#0A192F] outline-none transition focus:border-[#10B981] focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-lg border border-slate-200 transition-colors"
        >
          <span>⊳</span> Send reset link
        </button>
        {resetEmailSuccess && (
          <p className="text-xs text-emerald-500 mt-2 font-medium">{resetEmailSuccess}</p>
        )}
        {resetEmailError && (
          <p className="text-xs text-rose-500 mt-2 font-medium">{resetEmailError}</p>
        )}
      </form>
    </div>
  );
}
