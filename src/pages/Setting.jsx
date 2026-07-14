import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LogOut
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Setting() {
  // 1. Security Preferences State
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");

  // 2. Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 3. Reset Password State
  const [recoveryEmail, setRecoveryEmail] = useState("admin@merchant.com");

  // Password validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

  const validationRules = [
    { label: "8+ characters", met: hasMinLength },
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

  const handleLogoutAll = () => {
    alert("Logged out from all other devices successfully.");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      alert("Please ensure your new password meets all security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendResetLink = (e) => {
    e.preventDefault();
    alert(`Reset link sent to ${recoveryEmail}`);
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
            <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
              <h2 className="text-base font-semibold text-[#0A192F] mb-6">Security Preferences</h2>
              <div className="space-y-6">
                
                {/* 2FA Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A192F]">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-slate-400 mt-0.5">Require a code from your mobile device when logging in.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      twoFactor ? 'bg-[#10B981]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        twoFactor ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Login Alerts Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A192F]">Login Alerts</p>
                    <p className="text-xs text-slate-400 mt-0.5">Get notified of logins from new devices or locations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginAlerts(!loginAlerts)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      loginAlerts ? 'bg-[#10B981]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        loginAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Remember Device Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A192F]">Remember Device</p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow trusted devices to bypass 2FA for 30 days.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRememberDevice(!rememberDevice)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rememberDevice ? 'bg-[#10B981]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        rememberDevice ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Session Timeout Selector */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0A192F]">Session Timeout</p>
                    <p className="text-xs text-slate-400 mt-0.5">Automatically log out after inactivity.</p>
                  </div>
                  <div className="relative">
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-[#0A192F] font-semibold outline-none focus:border-[#10B981] appearance-none pr-8 cursor-pointer"
                    >
                      <option value="15 Minutes">15 Minutes</option>
                      <option value="30 Minutes">30 Minutes</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="4 Hours">4 Hours</option>
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">&#9660;</span>
                  </div>
                </div>

                {/* Logout All Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleLogoutAll}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout from all devices
                  </button>
                </div>

              </div>
            </div>

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

              </form>
            </div>

            {/* 3. Reset Password Card */}
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
              </form>
            </div>

            {/* 4. Login Activity Card */}
            <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0A192F]">Login Activity</h2>
                <a href="#" className="text-xs font-semibold text-[#10B981] hover:underline hover:text-emerald-600">
                  View All
                </a>
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
                    <tr>
                      <td className="py-3.5 font-semibold text-slate-700">Successful Login</td>
                      <td className="py-3.5 text-slate-500">Chrome / Windows</td>
                      <td className="py-3.5 text-slate-500">2026-07-14 10:30 AM</td>
                      <td className="py-3.5">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium text-[10px] flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-semibold text-slate-700">Password Changed</td>
                      <td className="py-3.5 text-slate-500">Chrome / Windows</td>
                      <td className="py-3.5 text-slate-500">2026-07-13 04:15 PM</td>
                      <td className="py-3.5">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium text-[10px] flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          Success
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-semibold text-slate-700">Failed Login Attempt</td>
                      <td className="py-3.5 text-slate-500">Unknown Device</td>
                      <td className="py-3.5 text-slate-500">2026-07-12 08:20 PM</td>
                      <td className="py-3.5">
                        <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium text-[10px] flex items-center gap-1 w-fit border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                          Warning
                        </span>
                      </td>
                    </tr>
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
