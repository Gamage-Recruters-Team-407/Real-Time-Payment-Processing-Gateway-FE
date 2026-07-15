import { useState } from "react";

const initialFormData = {
  amount: "",
  currency: "LKR",
  description: "",
};

function PaymentForm({ onSubmit, isSubmitting = false, serverError = "" }) {
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

    if (formData.description.trim().length > 255) {
      nextErrors.description = "Description cannot exceed 255 characters.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
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
      description: formData.description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-semibold text-[#0A192F]"
        >
          Payment amount
        </label>

        <div
          className={`flex overflow-hidden rounded-xl border bg-white transition focus-within:ring-4 ${
            errors.amount
              ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
              : "border-slate-200 focus-within:border-[#10B981] focus-within:ring-emerald-100"
          }`}
        >
          <div className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-[#0A192F]">
            LKR
          </div>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="min-w-0 flex-1 bg-transparent px-4 py-4 text-xl font-semibold text-[#0A192F] outline-none placeholder:text-slate-300"
          />
        </div>

        {errors.amount && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.amount}
          </p>
        )}
      </div>

      <div>
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
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-[#0A192F]"
          >
            Payment description
          </label>

          <span className="text-xs text-[#64748B]">Optional</span>
        </div>

        <textarea
          id="description"
          name="description"
          rows="4"
          maxLength="255"
          value={formData.description}
          onChange={handleChange}
          placeholder="Example: Course payment"
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-[#0A192F] outline-none transition placeholder:text-slate-300 focus:ring-4 ${
            errors.description
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-[#10B981] focus:ring-emerald-100"
          }`}
        />

        <div className="mt-2 flex items-center justify-between gap-4">
          {errors.description ? (
            <p className="text-sm font-medium text-red-600">
              {errors.description}
            </p>
          ) : (
            <span />
          )}

          <span className="text-xs text-[#64748B]">
            {formData.description.length}/255
          </span>
        </div>
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A192F] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#102A46] focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating payment...
          </>
        ) : (
          <>
            Create payment
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}

export default PaymentForm;