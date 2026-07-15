import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, User, Mail, Lock, Eye, EyeOff, Check, UserPlus2, ShieldCheck, Fingerprint } from "lucide-react";
import { registerUser } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordStrength = () => {
    const len = formData.password.length;
    if (len === 0) return { label: "", width: "0%", color: "bg-slate-200" };
    if (len < 6) return { label: "Security Level: Low", width: "33%", color: "bg-red-500" };
    if (len < 10) return { label: "Security Level: Medium", width: "66%", color: "bg-amber-500" };
    return { label: "Security Level: High", width: "100%", color: "bg-emerald-500" };
  };
  const strength = passwordStrength();

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
    if (!agreed) {
      setError("Please agree to the Terms of Service to continue");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">
        {/* Illustration panel */}
        <div className="hidden md:flex relative items-center justify-center h-[560px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-3xl" />

          <div className="relative w-56 h-96 bg-white border-[6px] border-slate-900 rounded-[2rem] shadow-xl flex flex-col items-center pt-10 px-5 gap-4">
            <UserPlus2 className="w-12 h-12 text-slate-300" strokeWidth={1.2} />

            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="w-full flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <div className="h-2 flex-1 bg-slate-200 rounded-full" />
              <Fingerprint className="w-4 h-4 text-slate-300" />
            </div>

            <div className="mt-auto mb-8 w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="absolute top-10 left-6 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Mail className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="absolute bottom-20 right-4 w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <Lock className="w-6 h-6 text-slate-500" />
          </div>
        </div>

        {/* Form panel */}
        <div>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign up for Gamage Pay</h1>
            <p className="text-sm text-slate-500 mt-1">
              Architecting secure global transactions for the modern enterprise.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
            {error && (
              <p className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-4">
                {error}
              </p>
            )}

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

            <div className="relative text-center my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Architect Name"
                    required
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Work Email
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Password
                </label>
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
                {formData.password && (
                  <div className="mt-1.5">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-emerald-600"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-slate-700 font-medium">Terms of Service</span> and{" "}
                  <span className="text-slate-700 font-medium">Security Protocols</span>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRightIcon />
              </button>
            </form>
          </div>

          <p className="text-sm text-slate-500 text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-700 font-medium hover:underline">
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> PCI DSS COMPLIANT
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> 256-BIT AES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// small inline arrow to avoid an extra top-level import line
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default Register;