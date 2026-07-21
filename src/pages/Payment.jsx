import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "../components/PaymentForm.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Payment() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [formKey, setFormKey] = useState(0);

  const handleCreatePayment = (paymentData) => {
    navigate("/card-payment", {
      state: {
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        description: "Card payment via Gamage-Pay"
      }
    });
  };

  const handleCreateAnother = () => {
    setPayment(null);
    setServerError("");
    setFormKey((current) => current + 1);
  };

  return (
    <main className="w-full bg-[#F8FAFC] px-2 py-4 text-[#0A192F]">
      <div className="w-full max-w-none">

        {/* <header className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A192F] text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M3 10h18" />
              <path d="M7 15h3" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-bold tracking-wide text-[#10B981]">
              GAMAGE PAY
            </p>

            <p className="text-sm text-[#64748B]">
              Payment Processing
            </p>
          </div>
        </header> */}

        <section className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">

          <div className="min-w-0 p-5 sm:p-8 xl:p-10">
            <div className="mb-8 max-w-xl">

              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#10B981]">
                Secure payment request
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0A192F] sm:text-4xl">
                Start a new payment
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#64748B] sm:text-base">
                Enter the payment amount and an optional description.
                A unique payment ID will be generated automatically
                by the backend.
              </p>
            </div>

            {!payment ? (
              <PaymentForm
                key={formKey}
                onSubmit={handleCreatePayment}
                isSubmitting={isSubmitting}
                serverError={serverError}
              />
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981] text-xl font-bold text-white">
                  ✓
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#0A192F]">
                  Payment created successfully
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  The payment request is now ready for the next
                  card processing and verification steps.
                </p>

                <dl className="mt-6 space-y-3 rounded-xl border border-emerald-100 bg-white p-4">

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-[#64748B]">
                      Payment ID
                    </dt>

                    <dd className="break-all text-right text-sm font-bold text-[#0A192F]">
                      {payment.paymentId}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-[#64748B]">
                      Amount
                    </dt>

                    <dd className="text-sm font-bold text-[#0A192F]">
                      {payment.currency}{" "}
                      {Number(payment.amount).toFixed(2)}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-[#64748B]">
                      Status
                    </dt>

                    <dd className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                      {payment.status}
                    </dd>
                  </div>

                </dl>

                <button
                  type="button"
                  onClick={handleCreateAnother}
                  className="mt-5 w-full rounded-xl border border-[#0A192F] px-5 py-3 text-sm font-bold text-[#0A192F] transition hover:bg-[#0A192F] hover:text-white"
                >
                  Create another payment
                </button>
              </div>
            )}
          </div>

          <aside className="relative min-w-0 w-full overflow-hidden bg-[#0A192F] p-5 text-white sm:p-8 xl:p-10">

            <div className="relative">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Payment flow
              </p>

              <h2 className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
                One clean request. Clear next steps.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                This page creates the initial payment record only.
                Card processing, OTP verification, and the final
                transaction result continue in their own modules.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-1">

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 text-xs font-bold text-emerald-300">
                    01
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Payment request
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      Create a PENDING payment record.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 text-xs font-bold text-emerald-300">
                    02
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Card processing
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      Validate card details in the next module.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 text-xs font-bold text-emerald-300">
                    03
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      OTP verification
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      Confirm the transaction securely.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10 text-xs font-bold text-emerald-300">
                    04
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Final status
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      Complete or fail the payment based on the result.
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">

                <p className="text-sm font-bold text-white">
                  Secure by design
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  The user does not manually enter the destination
                  bank account. The backend uses the predefined
                  primary account configuration.
                </p>

              </div>
            </div>
          </aside>

        </section>

      </div>
    </main>
  );
}

export default Payment;