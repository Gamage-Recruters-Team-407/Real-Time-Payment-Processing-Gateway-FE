import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Fingerprint, UserCircle2 } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);
    console.log("Login result:", result);

    if (result.success) {
      console.log("User role:", result.user.role);
      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
        {/* Illustration panel */}
        <div className="hidden md:flex relative items-center justify-center h-[520px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-3xl" />

          <div className="relative w-56 h-96 bg-white border-[6px] border-slate-900 rounded-[2rem] shadow-xl flex flex-col items-center pt-10 px-5 gap-4">
            <UserCircle2 className="w-14 h-14 text-slate-300" strokeWidth={1.2} />

            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <Fingerprint className="w-4 h-4 text-slate-300" />
            </div>

            <div className="mt-auto mb-8 w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute top-10 left-6 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="absolute bottom-16 right-4 w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <Shield className="w-6 h-6 text-slate-500" />
          </div>
        </div>

        {/* Form panel */}
        <div>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gamage Pay</h1>
            <p className="text-sm text-slate-500 mt-1">
              Enterprise-grade payment orchestration for secure transactions.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium mb-5">
              <ShieldCheck className="w-3.5 h-3.5" />
              SECURE ENVIRONMENT
            </div>

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
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. j_smith_ops"
                    required
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Credentials
                  </label>
                  <Link to="/forgot-password/otp?purpose=password_forgot" className="text-xs text-emerald-600 hover:underline">
                    Forgot Access?
                  </Link>
                </div>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                  <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
                  <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.4l4-3.1z" />
                  <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1c.9-2.8 3.5-4.9 6.6-4.9z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400">
                  OR SIGN IN WITH CREDENTIALS
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Signing in..." : "Secure Sign In"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3 h-3" />
                END-TO-END ENCRYPTION ACTIVE
              </div>
            </form>
          </div>

          <p className="text-sm text-slate-500 text-center mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-700 font-medium hover:underline">
              Register
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-4">
            <span>SUPPORT PORTAL</span>
            <span>COMPLIANCE CENTER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;