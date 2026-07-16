import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { otpService } from "../services/otpService";
import { Shield, Mail, Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [purpose, setPurpose] = useState("password_forgot"); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlEmail = params.get('email');
    const urlUserId = params.get('userId');
    const urlPurpose = params.get('purpose');

    const finalPurpose = urlPurpose || 'password_forgot'; 
    setPurpose(finalPurpose);

    const finalUserId = urlUserId || (finalPurpose === 'payment' ? user?._id : '');
    const finalEmail = urlEmail || (finalPurpose === 'password_forgot' ? user?.email : ''); 

    if (finalUserId) setEmail(finalUserId);
    if (finalEmail) setEmail(finalEmail);

    if (finalUserId || finalEmail) {
      setIsOtpSent(true);
      handleAutoGenerateOTP(finalEmail, finalUserId, finalPurpose);
    }
  }, [location.search, user]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleAutoGenerateOTP = async (emailParam, userIdParam, purposeParam) => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const data = { purpose: purposeParam };
      if (emailParam) data.email = emailParam;
      if (userIdParam) data.userId = userIdParam;

      const result = await otpService.generateOTP(data);
      if (result.success) {
        setMessage("Verification code sent to your email");
        setTimer(60);
      }
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await otpService.generateOTP({ 
        email: email, 
        purpose: 'password_forgot' 
      });
      
      if (result.success) {
        setMessage("Verification code sent to your email");
        setIsOtpSent(true);
        setTimer(60);
      }
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const verifyData = { otp: otpString };
      if (email) verifyData.email = email;

      const result = await otpService.verifyOTP(verifyData);
      
      if (result.success) {
        setMessage("Verification successful!");
        setTimeout(() => {
          // if (purpose === 'password_forgot') { 
          //   navigate('/forgot-password', { state: { email, verified: true } });
          if (purpose === 'password_forgot') { 
          navigate(`/new-password-setup?email=${encodeURIComponent(email)}`, { state: { email, verified: true } });
          } else if (purpose === 'payment') {
            navigate('/card-payment', { state: { verified: true } });
          }
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const resendData = { purpose };
      if (email) resendData.email = email;

      const result = await otpService.resendOTP(resendData);
      if (result.success) {
        setMessage("Verification code resent successfully");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setError(err.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50 to-slate-50 items-center justify-center p-12">
        <div className="relative w-full max-w-md">
          <div className="relative mx-auto w-72 h-[600px] bg-white border-8 border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="h-full bg-white p-6 flex flex-col">
              <div className="flex items-center justify-center mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-slate-400" />
                </div>
                
                <div className="w-full space-y-3 mt-8">
                  <div className="h-12 bg-slate-50 rounded-lg flex items-center px-3">
                    <div className="h-2 w-20 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-12 bg-slate-50 rounded-lg flex items-center px-3">
                    <div className="h-2 w-16 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-12 bg-slate-50 rounded-lg flex items-center px-3">
                    <div className="h-2 w-24 bg-slate-200 rounded-full" />
                  </div>
                </div>

                <div className="mt-auto mb-8">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-8 w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>
          
          <div className="absolute bottom-32 right-8 w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Gamage Pay</h1>
            <p className="text-sm text-slate-500">
              Enterprise-grade payment orchestration for secure transactions.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-6">
              <CheckCircle className="w-4 h-4" />
              SECURE VERIFICATION
            </div>

            {message && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <p className="text-sm text-emerald-700">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email form for password forgot */}
            {!isOtpSent && purpose === 'password_forgot' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {isOtpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-3">
                    Enter Verification Code
                  </label>
                  <p className="text-xs text-slate-500 mb-4">
                    We've sent a 6-digit code to your email
                  </p>
                  
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.some(d => d === "")}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Verify & Continue
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-slate-200">
                  {timer > 0 ? (
                    <p className="text-sm text-slate-500">
                      Resend code in <span className="font-semibold text-emerald-600">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:text-slate-400"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(purpose === 'payment' ? '/card-payment' : '/login')}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to {purpose === 'payment' ? 'Payment' : 'Login'}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              END-TO-END ENCRYPTION
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              256-BIT AES
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;