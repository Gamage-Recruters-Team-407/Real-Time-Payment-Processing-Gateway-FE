import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../services/authService";

const NewPasswordSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, newPassword: formData.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900">Password Reset Successful</h1>
          <p className="text-sm text-slate-500 mt-2">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose a strong new password for {email || "your account"}.
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
                New Password
              </label>
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  required
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
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
              {loading ? "Updating..." : "Reset Password"}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3 h-3" />
              END-TO-END ENCRYPTION ACTIVE
            </div>
          </form>
        </div>

        <Link to="/login" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-5">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default NewPasswordSetup;