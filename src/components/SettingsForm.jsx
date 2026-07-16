import React from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsForm({
  loginAlerts,
  setLoginAlerts,
  rememberDevice,
  setRememberDevice,
  loadingSettings,
  handleTogglePreference,
  preferenceError,
}) {
  const { logout } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#0A192F] mb-6">Security Preferences</h2>
      {preferenceError && (
        <p className="text-xs text-rose-500 mb-4 font-medium">{preferenceError}</p>
      )}
      {loadingSettings ? (
        <div className="space-y-6 animate-pulse py-3">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div className="h-5 bg-slate-100 rounded-full w-10"></div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
            <div className="h-5 bg-slate-100 rounded-full w-10"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Login Alerts Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0A192F]">Login Alerts</p>
              <p className="text-xs text-slate-400 mt-0.5">Get notified of logins from new devices or locations.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePreference("alerts", loginAlerts, setLoginAlerts)}
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
              <p className="text-xs text-slate-400 mt-0.5">Keep my session active on this device for 30 days.</p>
            </div>
            <button
              type="button"
              onClick={() => handleTogglePreference("remember", rememberDevice, setRememberDevice)}
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

          {/* Logout Button */}
          <div className="pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2 cursor-pointer text-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
