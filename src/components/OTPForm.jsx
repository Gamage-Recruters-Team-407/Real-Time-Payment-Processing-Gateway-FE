import React from "react";

const OTPForm = ({ otp, setOtp, onSubmit, isLoading, onResend, timer }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    setOtp(pastedData.slice(0, 6));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter 6-Digit OTP
        </label>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder="------"
          className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-gray-100"
          disabled={isLoading}
          autoFocus
        />
        <p className="mt-2 text-xs text-gray-500 text-center">
          Enter the OTP sent to your email
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verifying...
          </span>
        ) : (
          'Verify OTP'
        )}
      </button>

      {timer > 0 && (
        <p className="text-center text-sm text-gray-600">
          Resend OTP in <span className="font-semibold text-blue-600">{timer}s</span>
        </p>
      )}

      {timer === 0 && onResend && (
        <button
          type="button"
          onClick={onResend}
          disabled={isLoading}
          className="w-full py-2 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:text-gray-400 disabled:cursor-not-allowed font-medium rounded-lg transition-colors duration-200"
        >
          Resend OTP
        </button>
      )}
    </form>
  );
};

export default OTPForm;