import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import api from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Enforce 10+ characters complexity
  const hasMinLength = newPassword.length >= 10;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

  const validationRules = [
    { label: "10+ characters", met: hasMinLength },
    { label: "Uppercase letter", met: hasUppercase },
    { label: "Lowercase letter", met: hasLowercase },
    { label: "Number", met: hasNumber },
    { label: "Special character", met: hasSpecialChar },
  ];

  const metCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  let strengthText = "None";
  let progressWidth = "w-0";
  let progressColor = "bg-slate-200";

  if (metCount === 1) {
    strengthText = "Very Weak";
    progressWidth = "w-1/5";
    progressColor = "bg-rose-500";
  } else if (metCount === 2) {
    strengthText = "Weak";
    progressWidth = "w-2/5";
    progressColor = "bg-orange-500";
  } else if (metCount === 3) {
    strengthText = "Fair";
    progressWidth = "w-3/5";
    progressColor = "bg-[#10B981]";
  } else if (metCount === 4) {
    strengthText = "Good";
    progressWidth = "w-4/5";
    progressColor = "bg-blue-500";
  } else if (metCount === 5) {
    strengthText = "Strong";
    progressWidth = "w-full";
    progressColor = "bg-emerald-500";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!token) {
      setErrorMsg("Reset token is missing from the link URL.");
      return;
    }
    if (metCount < 5) {
      setErrorMsg("Please ensure your password meets all strength criteria.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const { data } = await api.post("/auth/reset-password", { token, newPassword });
      setSuccessMsg(data.message || "Password updated successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-sans px-4">
      <div className="w-full max-w-[420px] bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        
        <div className="text-center space-y-1.5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-[#0A192F]">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-bold text-[#0A192F]">Set New Password</h1>
          <p className="text-xs text-slate-400">Please choose a secure new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-[#0A192F] outline-none transition focus:border-[#10B981] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Strength progress */}
          {newPassword.length > 0 && (
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                <div className={`h-full ${progressWidth} ${progressColor} transition-all duration-300`} />
              </div>
              <p className="text-[10px] font-medium text-slate-500">
                Strength: <span className="font-bold text-[#0A192F]">{strengthText}</span>
              </p>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-[#0A192F] outline-none transition focus:border-[#10B981] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-[10px] space-y-1.5">
            {validationRules.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2">
                <span className={`font-semibold ${rule.met ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {rule.met ? '✓' : '✗'}
                </span>
                <span className={rule.met ? 'text-emerald-700' : 'text-slate-400'}>
                  {rule.label}
                </span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-500 text-center font-medium">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-xs text-emerald-500 text-center font-semibold">{successMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#0A192F] hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
