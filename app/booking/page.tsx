"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const BRAND = "#EF9F27";
const TOTAL = 7900;

function formatINR(amount: number) {
  const s = String(amount);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return "₹" + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3);
}

type Field = "name" | "whatsapp" | "date";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dest = searchParams.get("dest") ?? "";

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (!name.trim()) next.name = "Please enter your full name.";
    if (!whatsapp.trim()) next.whatsapp = "Please enter your WhatsApp number.";
    if (!date) next.date = "Please pick a travel date.";
    return next;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    localStorage.setItem(
      "picnic_booking",
      JSON.stringify({ name: name.trim(), whatsapp: whatsapp.trim(), date, total: TOTAL, dest })
    );
    const confirmUrl = dest
      ? `/confirmation?dest=${encodeURIComponent(dest)}`
      : "/confirmation";
    router.push(confirmUrl);
  }

  function clearError(field: Field) {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  const planLabel = dest ? `Your ${dest} Plan · 2 days` : "Your Plan · 2 days";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
        <Link
          href="/plan"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          aria-label="Back"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            />
          </svg>
        </Link>
        <h1 className="font-bold text-gray-900">Confirm your booking</h1>
      </header>

      <main className="flex-1 px-4 sm:px-5 pt-6 pb-36 space-y-6">
        {/* Trip summary card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-5">
          <p className="text-sm font-semibold text-gray-700">{planLabel}</p>
          <p
            className="text-3xl font-extrabold tracking-tight tabular-nums mt-1"
            style={{ color: BRAND }}
          >
            {formatINR(TOTAL)}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-green-600">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              />
            </svg>
            No hidden charges
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError("name"); }}
              placeholder="Riya Sharma"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27] transition-shadow ${
                errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              WhatsApp number
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => { setWhatsapp(e.target.value); clearError("whatsapp"); }}
              placeholder="+91 98765 43210"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27] transition-shadow ${
                errors.whatsapp ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              When are you going?
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); clearError("date"); }}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27] transition-shadow ${
                errors.date ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
              }`}
            />
            {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed text-center px-2">
          We&apos;ll confirm your verified bookings on WhatsApp within 2 hours.{" "}
          Nothing is charged until we confirm.
        </p>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100 bg-white px-4 py-4">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-2xl px-4 py-4 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60"
          style={{ backgroundColor: BRAND }}
        >
          {submitting ? "Confirming…" : `Confirm & pay ${formatINR(TOTAL)} →`}
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div
            className="h-10 w-10 rounded-full border-4 border-gray-100 animate-spin"
            style={{ borderTopColor: BRAND }}
          />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
