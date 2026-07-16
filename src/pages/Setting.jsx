import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LogOut
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import SettingsForm from "../components/SettingsForm";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function Setting() {
  // 1. Security Preferences State
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);

  // 2. Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 3. Reset Password State
  const [recoveryEmail, setRecoveryEmail] = useState("admin@merchant.com");

  // 4. Login Activity State
  const [activities, setActivities] = useState([]);

  // 5. Status State Trackers (Inline alerts replacing popups)
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [preferenceError, setPreferenceError] = useState("");
  const [resetEmailSuccess, setResetEmailSuccess] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");

  // Loading state to prevent toggle flipping on reload
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setLoginAlerts(data.loginAlertsEnabled);
        setRememberDevice(data.rememberDeviceEnabled);
        setRecoveryEmail(data.recoveryEmail);
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Update specific toggles
  const handleTogglePreference = async (field, currentValue, setter) => {
    const nextValue = !currentValue;
    setPreferenceError("");
    try {
      const updatePayload = {
        loginAlertsEnabled: field === "alerts" ? nextValue : loginAlerts,
        rememberDeviceEnabled: field === "remember" ? nextValue : rememberDevice
      };
      await api.put("/settings", updatePayload);
      setter(nextValue);
    } catch (error) {
      setPreferenceError("Failed to save preference changes.");
    }
  };


  // Password validation rules
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


  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setPasswordSuccess("");

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      setNewPasswordError("Please ensure your new password meets all security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New passwords do not match.");
      return;
    }
    try {
      await api.put("/settings/password", { currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      const { data } = await api.get("/settings");
      setActivities(data.activities || []);
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update password.";
      if (msg.toLowerCase().includes("current password")) {
        setCurrentPasswordError(msg);
      } else {
        setNewPasswordError(msg);
      }
    }
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setResetEmailSuccess("");
    setResetEmailError("");
    try {
      const { data } = await api.post("/settings/reset-link", { recoveryEmail });
      setResetEmailSuccess(data.message || `Reset link sent to ${recoveryEmail}`);
      setTimeout(() => setResetEmailSuccess(""), 5000);
    } catch (error) {
      setResetEmailError(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[720px] mx-auto w-full space-y-6 pb-12">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-[#0A192F]">Settings</h1>
              <p className="text-sm text-slate-400 mt-1">
                Manage your account security, password, and login preferences.
              </p>
            </div>

            {/* 1. Security Preferences Card */}
            <SettingsForm
              loginAlerts={loginAlerts}
              setLoginAlerts={setLoginAlerts}
              rememberDevice={rememberDevice}
              setRememberDevice={setRememberDevice}
              loadingSettings={loadingSettings}
              handleTogglePreference={handleTogglePreference}
              preferenceError={preferenceError}
            />

            {/* 2. Change Password Card */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-[#0A192F] mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                
                {/* Current Password */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-[#0A192F] outline-none transition focus:border-[#10B981] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {currentPasswordError && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{currentPasswordError}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-[#0A192F] outline-none transition focus:border-[#10B981] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPasswordError && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{newPasswordError}</p>
                  )}
                </div>

                {/* Password Strength Progress */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full ${progressWidth} ${progressColor} transition-all duration-300`} />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Strength: <span className="font-bold text-[#0A192F]">{strengthText}</span>
                    </p>
                  </div>
                )}

                {/* Confirm New Password */}
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
                  {confirmPasswordError && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium">{confirmPasswordError}</p>
                  )}
                </div>

                {/* Validation Checklist */}
                <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-xs space-y-1.5">
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0A192F] hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2"
                >
                  Change Password
                </button>
                {passwordSuccess && (
                  <p className="text-xs text-emerald-500 mt-2.5 text-center font-semibold">{passwordSuccess}</p>
                )}

              </form>
            </div>

            {/* 3. Reset Password Card */}
            <ResetPasswordForm
              recoveryEmail={recoveryEmail}
              setRecoveryEmail={setRecoveryEmail}
              handleSendResetLink={handleSendResetLink}
              resetEmailSuccess={resetEmailSuccess}
              resetEmailError={resetEmailError}
            />

            {/* 4. Security Activity Card */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0A192F]">Security Activity</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Device</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                      <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs">
                    {activities.length > 0 ? (
                      activities.map((act, index) => (
                        <tr key={index}>
                          <td className="py-3.5 font-semibold text-slate-700">{act.activity}</td>
                          <td className="py-3.5 text-slate-500">{act.device}</td>
                          <td className="py-3.5 text-slate-500">
                            {new Date(act.timestamp).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full font-medium text-[10px] flex items-center gap-1 w-fit ${
                              act.status === "Success"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                                act.status === "Success" ? "bg-emerald-500" : "bg-rose-500"
                              }`}></span>
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">
                          No recent login activity found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
