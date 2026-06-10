"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BRAND = "#EF9F27";

const VIBES = [
  { label: "Beach", emoji: "🏖️" },
  { label: "Adventure", emoji: "🧗" },
  { label: "Food", emoji: "🍜" },
  { label: "Chill", emoji: "😌" },
];

const LOADING_MESSAGES = [
  "Finding verified stays...",
  "Checking local experiences...",
  "Building your plan...",
];

function formatINR(amount: number) {
  const s = String(amount);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return "₹" + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3);
}

export default function IntakePage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(
    new Set(["Beach", "Food"])
  );
  const [budget, setBudget] = useState(12000);
  const [people, setPeople] = useState(2);
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(vibe)) next.delete(vibe);
      else next.add(vibe);
      return next;
    });
  };

  const budgetPct = ((budget - 5000) / (50000 - 5000)) * 100;

  function handlePlan() {
    const params = new URLSearchParams({
      desc: description,
      budget: String(budget),
      people: String(people),
      vibes: [...selectedVibes].join(","),
    });
    const url = `/plan?${params.toString()}`;
    setMsgIdx(0);
    setLoading(true);
    setTimeout(() => router.push(url), 2500);
  }

  useEffect(() => {
    if (!loading) return;
    const msgTimer = setInterval(
      () => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length),
      800
    );
    return () => clearInterval(msgTimer);
  }, [loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6">
        <div className="flex items-center gap-2 mb-10">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: BRAND }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Picnic AI</span>
        </div>

        <div
          className="h-12 w-12 rounded-full border-4 border-gray-100 animate-spin mb-8"
          style={{ borderTopColor: BRAND }}
        />

        <p className="text-sm font-medium text-gray-500">{LOADING_MESSAGES[msgIdx]}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=900&q=85&fit=crop"
          alt="Coastal beach"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/75" />

        <div className="absolute top-5 left-5 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full shadow-md"
            style={{ backgroundColor: BRAND }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight drop-shadow-sm">
            Picnic AI
          </span>
        </div>

        <div className="absolute bottom-7 left-5 right-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
            Where to next?
          </h1>
          <p className="text-white/75 text-sm mt-1">
            Describe your trip, we plan everything.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="-mt-4 rounded-t-3xl bg-white px-4 sm:px-5 pt-6 pb-10 space-y-6 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#EF9F27]/50 focus:border-[#EF9F27] transition-shadow"
          placeholder="Beach weekend in Gokarna under ₹12,000 for 2 — beaches, seafood, sunsets"
        />

        {/* Vibe chips */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Vibe
          </p>
          <div className="flex gap-2 flex-wrap">
            {VIBES.map(({ label, emoji }) => {
              const active = selectedVibes.has(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleVibe(label)}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${
                    active
                      ? "text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                  style={active ? { backgroundColor: BRAND } : undefined}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Budget
            </p>
            <p className="text-sm font-bold text-gray-900">{formatINR(budget)}</p>
          </div>
          <input
            type="range"
            min={5000}
            max={50000}
            step={500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${BRAND} ${budgetPct}%, #e5e7eb ${budgetPct}%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>₹5,000</span>
            <span>₹50,000</span>
          </div>
        </div>

        {/* People counter */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Travelers
            </p>
            <p className="text-sm text-gray-500 mt-0.5">How many are going?</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPeople((p) => Math.max(1, p - 1))}
              disabled={people <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 text-xl font-light text-gray-600 transition-all hover:border-gray-300 active:scale-95 disabled:opacity-30"
            >
              −
            </button>
            <span className="w-5 text-center text-xl font-bold text-gray-900">{people}</span>
            <button
              onClick={() => setPeople((p) => Math.min(12, p + 1))}
              disabled={people >= 12}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-all active:scale-95 disabled:opacity-30"
              style={{ backgroundColor: BRAND }}
            >
              +
            </button>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePlan}
          className="w-full rounded-2xl px-4 py-4 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: BRAND }}
        >
          Plan my trip →
        </button>
      </div>
    </main>
  );
}
