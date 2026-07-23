import { useState } from "react";

const initialFormData = {
  amount: "",
  currency: "LKR",
  paymentMethod: "CARD",
};

const paymentMethods = [
  {
    id: "CARD",
    title: "Card",
    description: "Visa, Mastercard",
    icon: "💳",
    available: true,
  },
  {
    id: "PAYPAL",
    title: "PayPal",
    description: "Coming soon",
    icon: "P",
    available: false,
  },
  {
    id: "BANK_TRANSFER",
    title: "Bank Transfer",
    description: "Coming soon",
    icon: "🏦",
    available: false,
  },
];

function PaymentForm({
  onSubmit,
  isSubmitting = false,
  serverError = "",
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    const amount = Number(formData.amount);

    if (!formData.amount.trim()) {
      nextErrors.amount = "Amount is required.";
    } else if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Enter a valid amount greater than 0.";
    }

    return nextErrors;
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   setFormData((current) => ({
  //     ...current,
  //     [name]: value,
  //   }));

  //   if (errors[name]) {
  //     setErrors((current) => ({
  //       ...current,
  //       [name]: "",
  //     }));
  //   }
  // };

  const handleAmountChange = (event) => {
    const value = event.target.value;

    // Positive numbers with maximum 2 decimal places
    const positiveAmountPattern = /^\d*\.?\d{0,2}$/;

    if (value === "" || positiveAmountPattern.test(value)) {
      setFormData((current) => ({
        ...current,
        amount: value,
      }));

      if (errors.amount) {
        setErrors((current) => ({
          ...current,
          amount: "",
        }));
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      amount: Number(Number(formData.amount).toFixed(2)),
      currency: formData.currency,
      paymentMethod: formData.paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5 sm:space-y-6" noValidate>
      {/* Payment amount */}
      <div className="w-full">
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-semibold text-[#0A192F]"
        >
          Payment amount
        </label>

        <div
          className={`flex min-h-14 w-full min-w-0 overflow-hidden rounded-xl border bg-white transition focus-within:ring-4 ${errors.amount
              ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
              : "border-slate-200 focus-within:border-[#10B981] focus-within:ring-emerald-100"
            }`}
        >
          <div className="flex w-20 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-bold text-[#0A192F] sm:w-24 sm:px-4">
            LKR
          </div>

          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-left text-lg font-semibold text-[#0A192F] outline-none placeholder:text-slate-300 sm:px-5 sm:py-4 sm:text-xl"
          />
        </div>

        {errors.amount && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Currency */}
      {/* <div>
        <label
          htmlFor="currency"
          className="mb-2 block text-sm font-semibold text-[#0A192F]"
        >
          Currency
        </label>

        <input
          id="currency"
          name="currency"
          type="text"
          value={formData.currency}
          readOnly
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-[#64748B] outline-none"
        />

        <p className="mt-2 text-xs text-[#64748B]">
          This project currently supports LKR payments only.
        </p>
      </div> */}

      {/* Payment methods */}
      <div>
        <div className="mb-3">
          <p className="text-sm font-semibold text-[#0A192F]">
            Payment method
          </p>

          <p className="mt-1 text-xs text-[#64748B]">
            Card payment is currently available.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {paymentMethods.map((method) => {
            const isSelected =
              formData.paymentMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                disabled={!method.available}
                onClick={() => {
                  if (!method.available) return;

                  setFormData((current) => ({
                    ...current,
                    paymentMethod: method.id,
                  }));
                }}
                className={`relative min-h-[125px] w-full rounded-xl border p-3 text-left transition sm:min-h-[135px] sm:p-4 ${isSelected
                    ? "border-[#10B981] bg-emerald-50 ring-2 ring-emerald-100"
                    : method.available
                      ? "border-slate-200 bg-white hover:border-slate-300"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                  }`}
              >
                {isSelected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-xs font-bold text-white">
                    ✓
                  </span>
                )}

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${isSelected
                      ? "bg-[#0A192F] text-white"
                      : "bg-slate-200 text-[#64748B]"
                    }`}
                >
                  {method.icon}
                </div>

                <p className="mt-3 break-words text-sm font-bold text-[#0A192F]">
                  {method.title}
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-[#64748B]">
                  {method.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A192F] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#102A46] focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-4"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating payment...
          </>
        ) : (
          <>
            Continue with card
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}

export default PaymentForm;