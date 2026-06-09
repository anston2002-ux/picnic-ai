import Link from "next/link";

const BRAND = "#EF9F27";

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-md space-y-5">

        {/* Green checkmark */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1.5">
          <h1 className="text-3xl font-extrabold text-gray-900">You&apos;re in!</h1>
          <p className="text-sm text-gray-400">Your Gokarna trip is being arranged</p>
        </div>

        {/* Trip summary card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4 space-y-1">
          <p className="font-semibold text-gray-800 text-sm">2 days · 2 people · ₹7,900</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              />
            </svg>
            No hidden charges · everything included
          </p>
        </div>

        {/* WhatsApp card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4 flex items-start gap-4">
          {/* WhatsApp icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Confirmation coming your way</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              We&apos;ll lock in your verified bookings and message you within 2 hours
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="block w-full rounded-2xl px-4 py-4 text-center text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: BRAND }}
        >
          Plan another trip →
        </Link>

      </div>
    </main>
  );
}
