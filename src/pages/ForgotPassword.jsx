import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { requestPasswordReset } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     
      await requestPasswordReset(email);

 
      navigate(`/otp-verification?email=${encodeURIComponent(email)}&mode=reset`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not send reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset Access</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your account email and we'll send a one-time code to verify it's you.
          </p>
        </div>

        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
          {error && (
            <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. j_smith_ops@company.com"
                  required
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? "Sending code..." : "Send Reset Code"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3 h-3" />
              A ONE-TIME CODE WILL BE SENT TO THIS EMAIL
            </div>
          </form>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;