import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, ShieldCheck, Cpu, ArrowLeftRight, MessageSquareWarning } from "lucide-react";
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
      setError(result.message || "Invalid credentials or unauthorized access.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 flex items-center justify-center px-4 py-4 overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-black/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-black/10 rounded-full animate-float-delay"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-black/10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-black/10 rounded-full animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-black/5 rounded-full animate-pulse-slow"></div>
        
        {/* Animated lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent animate-slide-right"></div>
          <div className="absolute bottom-1/4 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-black/20 to-transparent animate-slide-left"></div>
          <div className="absolute top-0 left-1/3 w-px h-1/3 bg-gradient-to-b from-transparent via-black/20 to-transparent animate-slide-down"></div>
          <div className="absolute bottom-0 right-1/3 w-px h-1/3 bg-gradient-to-t from-transparent via-black/20 to-transparent animate-slide-up"></div>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-black/10 rounded-lg animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-black/10 rounded-full animate-spin-slow-reverse"></div>
        <div className="absolute top-1/2 left-10 w-8 h-8 border-2 border-black/10 transform rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-1/2 right-10 w-8 h-8 border-2 border-black/10 transform rotate-12 animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-6xl h-full max-h-[90vh] grid lg:grid-cols-2 gap-6 items-stretch relative z-10">
        
        {/* Left Panel - Gamage Pay Gateway Branding & Info */}
        <div className="hidden lg:flex h-full">
          <div className="bg-transparent backdrop-blur-sm rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden w-full flex flex-col">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')]"></div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Company Title & Description */}
              <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Gamage Pay</h1>
                  <p className="text-white/70 text-[11px] mt-0.5">Enterprise Payment Processing Partner</p>
                </div>
              </div>

              {/* Main Visual Image with Green Overlay - flex-1 to take remaining space */}
              <div className="flex-1 min-h-0 mb-4 relative overflow-hidden rounded-2xl shadow-md border border-white/10">
                <img 
                  src="https://res.cloudinary.com/dt2xaqo32/image/upload/v1784609699/ChatGPT_Image_Jul_15_2026_11_47_10_AM_z0nwdu.png"
                  alt="Gamage Pay Secure Gateway"
                  className="w-full h-full object-cover"
                />
                {/* Green overlay on image */}
                <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 via-transparent to-emerald-900/20"></div>
              </div>

              {/* Gateway Feature Badges with Descriptions - flex-shrink-0 to keep at bottom */}
              <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 text-center hover:bg-white/20 transition-all">
                  <Cpu className="w-4 h-4 text-white mx-auto mb-0.5" />
                  <span className="text-[11px] font-semibold text-white">FAST API</span>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">Real-time settlement</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 text-center hover:bg-white/20 transition-all">
                  <ArrowLeftRight className="w-4 h-4 text-white mx-auto mb-0.5" />
                  <span className="text-[11px] font-semibold text-white">SEAMLESS</span>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">Bank-Client Bridge</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10 text-center hover:bg-white/20 transition-all">
                  <ShieldCheck className="w-4 h-4 text-white mx-auto mb-0.5" />
                  <span className="text-[11px] font-semibold text-white">PCI-DSS</span>
                  <p className="text-[9px] text-white/70 mt-0.5 leading-tight">Level 1 Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Partner / Merchant Login Form */}
        <div className="h-full">
          <div className="bg-transparent backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl h-full flex flex-col">
            {/* Header - flex-shrink-0 */}
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-white/90 text-[11px] font-semibold mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                MERCHANT & PARTNER PORTAL
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In to Dashboard</h2>
              <p className="text-white/70 text-sm mt-0.5">Manage transactions, API keys, and client integrations.</p>
            </div>

            {/* Error Notification - flex-shrink-0 */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border-l-4 border-red-500 text-white text-sm rounded-md px-4 py-2.5 mb-4 flex items-center gap-2 flex-shrink-0">
                <MessageSquareWarning className="w-4 h-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Form - flex-1 to take remaining space and center content */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-4">
              {/* Email / Merchant ID Input */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80 mb-1">
                  Partner Email / Merchant ID
                </label>
                <div className="flex items-center gap-2 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-white/50 focus-within:border-white/50 bg-white/10 backdrop-blur-sm transition-all">
                  <User className="w-4 h-4 text-white/60 shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="partner@business.com"
                    required
                    className="w-full text-sm outline-none placeholder:text-white/40 bg-transparent text-white"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
                    Password
                  </label>
                  <Link to="/forgot-password/otp?purpose=password_forgot" className="text-[11px] text-white/70 hover:text-white font-medium transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="flex items-center gap-2 border border-white/20 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-white/50 focus-within:border-white/50 bg-white/10 backdrop-blur-sm transition-all">
                  <Lock className="w-4 h-4 text-white/60 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full text-sm outline-none placeholder:text-white/40 bg-transparent text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/80 shrink-0 p-1 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-medium rounded-xl py-3 text-sm transition-all shadow-lg backdrop-blur-sm border border-white/20"
              >
                {loading ? "Authenticating..." : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Access Gateway Dashboard
                  </>
                )}
              </button>

              {/* Register Prompt */}
              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-sm text-white/70">
                  New merchant wanting to integrate?{" "}
                  <Link to="/register" className="text-white font-semibold hover:underline transition-colors">
                    Apply for Partnership
                  </Link>
                </p>
              </div>

              {/* Footer Links */}
              <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10">
                <span>API STATUS: <strong className="text-white/80">OPERATIONAL</strong></span>
                <Link to="/support" className="hover:text-white transition-colors">Developer Support</Link>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes slide-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 7s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-slide-right {
          animation: slide-right 8s linear infinite;
        }
        .animate-slide-left {
          animation: slide-left 8s linear infinite;
        }
        .animate-slide-down {
          animation: slide-down 10s linear infinite;
        }
        .animate-slide-up {
          animation: slide-up 10s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;