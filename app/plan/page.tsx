"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const BRAND = "#EF9F27";

function formatINR(amount: number) {
  const s = String(amount);
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return "₹" + (rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3 : last3);
}

// ─── Data types ─────────────────────────────────────────────────────────────

type Option = {
  name: string;
  desc: string;
  price: number;
  verified: string;
  photo: string;
  localPrice?: string;
};

type TripTemplate = {
  transport: Option;
  stayOptions: Option[];
  experienceOptions: Option[];
  food: Option;
};

// ─── Templates ──────────────────────────────────────────────────────────────

function beachTemplate(dest: string, budget: number): TripTemplate {
  if (budget < 10000) {
    return {
      transport: { name: `Shared cab to ${dest}`, desc: "Comfortable shared cab · ~3h", price: 700, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75" },
      stayOptions: [
        { name: "Zostel Gokarna", desc: "2 nights · Dorm bunk", price: 2800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75" },
        { name: "Paradise Guesthouse", desc: "2 nights · Garden view", price: 3600, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&q=75" },
      ],
      experienceOptions: [
        { name: "Kudle Beach Walk", desc: "Sunset walk · Free entry", price: 0, verified: "May 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75" },
        { name: "Gokarna Temple Walk", desc: "Guided heritage walk · 1.5h", price: 900, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75" },
      ],
      food: { name: "Pai Restaurant", desc: "Om Beach · Great thalis", price: 600, verified: "Jun 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75" },
    };
  }
  return {
    transport: { name: `Shared cab to ${dest}`, desc: "Comfortable shared cab · ~3h", price: 700, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75" },
    stayOptions: [
      { name: "Om Beach Homestay", desc: "2 nights · Sea view", price: 4800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&q=75" },
      { name: "Paradise Guesthouse", desc: "2 nights · Garden view", price: 3600, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&q=75" },
      { name: "Zostel Gokarna", desc: "2 nights · Dorm bunk", price: 2800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75" },
      { name: "SwaSwara Resort", desc: "2 nights · Private villa", price: 9200, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&q=75" },
    ],
    experienceOptions: [
      { name: "Sunset Boat Trip", desc: "Half Moon Beach · 2h", price: 1600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=75" },
      { name: "Kayaking at Kudle", desc: "Kudle Beach · 2h", price: 1200, verified: "May 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75" },
      { name: "Gokarna Temple Walk", desc: "Guided heritage walk · 1.5h", price: 900, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75" },
    ],
    food: { name: "Namaste Beach Shack", desc: "Best seafood on Om Beach", price: 800, verified: "Jun 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75" },
  };
}

function dubaiTemplate(budget: number): TripTemplate {
  if (budget < 15000) {
    return {
      transport: { name: "Metro Day Pass", desc: "AED 29 · Unlimited rides", price: 700, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "AED 29" },
      stayOptions: [
        { name: "ibis Dubai Mall", desc: "2 nights · Budget smart", price: 7800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&q=75", localPrice: "AED 325" },
        { name: "Rove Downtown Dubai", desc: "2 nights · City view", price: 12000, verified: "May 2026", photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&q=75", localPrice: "AED 500" },
      ],
      experienceOptions: [
        { name: "Desert Sunset Walk", desc: "Al Qudra Desert · Free", price: 0, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=120&q=75" },
        { name: "Dubai Creek Dhow Cruise", desc: "2h · Dinner on water", price: 2400, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=75", localPrice: "AED 100" },
      ],
      food: { name: "Street Food Al Fahidi", desc: "Old Dubai · Local bites", price: 600, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "AED 25" },
    };
  }
  return {
    transport: { name: "Metro Day Pass", desc: "AED 29 · Unlimited rides", price: 700, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "AED 29" },
    stayOptions: [
      { name: "Rove Downtown Dubai", desc: "2 nights · City view", price: 12000, verified: "May 2026", photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=120&q=75", localPrice: "AED 500" },
      { name: "ibis Dubai Mall", desc: "2 nights · Budget smart", price: 7800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&q=75", localPrice: "AED 325" },
      { name: "Burj Al Arab", desc: "1 night · Iconic sail hotel", price: 48000, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&q=75", localPrice: "AED 2,000" },
    ],
    experienceOptions: [
      { name: "Desert Safari at Sunrise", desc: "3h · AED 200 per person", price: 4800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=120&q=75", localPrice: "AED 200" },
      { name: "Burj Khalifa At The Top", desc: "Sky high views · 124F", price: 3200, verified: "May 2026", photo: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=120&q=75", localPrice: "AED 133" },
      { name: "Dubai Creek Dhow Cruise", desc: "2h · Dinner on water", price: 2400, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=75", localPrice: "AED 100" },
    ],
    food: { name: "Al Ustad Special Kabab", desc: "Old Dubai · AED 40", price: 960, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "AED 40" },
  };
}

function baliTemplate(budget: number): TripTemplate {
  if (budget < 15000) {
    return {
      transport: { name: "Grab Driver", desc: "USD 14 · Half day hire", price: 1200, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "USD 14" },
      stayOptions: [
        { name: "Hostel Ubud", desc: "2 nights · Social dorm", price: 3600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "USD 43" },
        { name: "Messy Monkey Hostel", desc: "2 nights · Pool dorm", price: 3600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&q=75", localPrice: "USD 43" },
      ],
      experienceOptions: [
        { name: "Tegallalang Rice Terrace", desc: "Iconic terraces · 2h", price: 840, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75", localPrice: "USD 10" },
        { name: "Traditional Cooking Class", desc: "Market tour + 3h cook", price: 2400, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75", localPrice: "USD 29" },
      ],
      food: { name: "Warung Babi Guling", desc: "Ubud · Roast pork local style", price: 840, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "USD 10" },
    };
  }
  return {
    transport: { name: "Private Driver Day Hire", desc: "USD 29 · Full day", price: 2400, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "USD 29" },
    stayOptions: [
      { name: "Ubud Rice Field Villa", desc: "2 nights · Private pool", price: 8400, verified: "May 2026", photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=120&q=75", localPrice: "USD 100" },
      { name: "Messy Monkey Hostel", desc: "2 nights · Social dorm", price: 3600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "USD 43" },
      { name: "Karma Kandara", desc: "1 night · Clifftop villa", price: 18000, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&q=75", localPrice: "USD 214" },
    ],
    experienceOptions: [
      { name: "Mount Batur Sunrise Trek", desc: "5h · 1717m summit", price: 3360, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=120&q=75", localPrice: "USD 40" },
      { name: "Tegalalang Rice Walk", desc: "Iconic terraces · 2h", price: 1200, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75", localPrice: "USD 14" },
      { name: "Traditional Cooking Class", desc: "Market tour + 3h cook", price: 2400, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75", localPrice: "USD 29" },
    ],
    food: { name: "Locavore To Go", desc: "Best local · USD 20", price: 1680, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "USD 20" },
  };
}

function hillsTemplate(dest: string, budget: number): TripTemplate {
  if (budget < 10000) {
    return {
      transport: { name: `Shared cab to ${dest}`, desc: "Scenic mountain road", price: 900, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75" },
      stayOptions: [
        { name: "Budget Homestay", desc: "2 nights · Local family", price: 3200, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=75" },
        { name: "Zostel Coorg", desc: "2 nights · Bonfire dorm", price: 2400, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75" },
      ],
      experienceOptions: [
        { name: "Coffee Estate Walk", desc: "With estate owner · 2h", price: 600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75" },
        { name: "Brahmagiri Forest Trek", desc: "3h · Misty trails", price: 800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75" },
      ],
      food: { name: "Local Canteen", desc: "Authentic home cooking", price: 400, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75" },
    };
  }
  return {
    transport: { name: `Shared cab to ${dest}`, desc: "Scenic mountain road", price: 900, verified: "Mar 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75" },
    stayOptions: [
      { name: "Coffee Estate Homestay", desc: "2 nights · Valley view", price: 5600, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=75" },
      { name: `The Tamara ${dest}`, desc: "2 nights · Plantation luxury", price: 12000, verified: "May 2026", photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&q=75" },
      { name: "Zostel Coorg", desc: "2 nights · Bonfire dorm", price: 2400, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75" },
    ],
    experienceOptions: [
      { name: "Coffee Plantation Walk", desc: "With estate owner · 2h", price: 1200, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75" },
      { name: "Brahmagiri Forest Trek", desc: "3h · Misty trails", price: 800, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75" },
      { name: "Abbey Falls + Safari", desc: "Full day combo", price: 2400, verified: "May 2026", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=75" },
    ],
    food: { name: "Coorg Kitchen", desc: "Local pandi curry", price: 600, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75" },
  };
}

const SINGAPORE_TEMPLATE: TripTemplate = {
  transport: { name: "MRT Day Pass", desc: "SGD 10 · Unlimited rides", price: 630, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "SGD 10" },
  stayOptions: [
    { name: "Capsule Hotel Singapore", desc: "2 nights · Smart stay", price: 5040, verified: "May 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "SGD 80" },
    { name: "Sleepy Kiwi Hostel", desc: "2 nights · Social dorm", price: 3150, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&q=75", localPrice: "SGD 50" },
  ],
  experienceOptions: [
    { name: "Gardens by the Bay", desc: "Supertrees · SGD 28", price: 1764, verified: "May 2026", photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=75", localPrice: "SGD 28" },
    { name: "Sentosa Island Day", desc: "Beach + cable car · 1 day", price: 3150, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75", localPrice: "SGD 50" },
  ],
  food: { name: "Maxwell Hawker Centre", desc: "Chicken rice · SGD 8", price: 504, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "SGD 8" },
};

const THAILAND_TEMPLATE: TripTemplate = {
  transport: { name: "BTS Day Pass", desc: "THB 140 · Unlimited rides", price: 350, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "THB 140" },
  stayOptions: [
    { name: "Lub d Hostel Bangkok", desc: "2 nights · Social hostel", price: 3000, verified: "May 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "THB 1,200" },
    { name: "Nap Park Hostel", desc: "2 nights · Capsule beds", price: 2000, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&q=75", localPrice: "THB 800" },
  ],
  experienceOptions: [
    { name: "Wat Pho Temple", desc: "Reclining Buddha · THB 200", price: 500, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75", localPrice: "THB 200" },
    { name: "Floating Market Tour", desc: "Damnoen Saduak · 3h", price: 1750, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&q=75", localPrice: "THB 700" },
  ],
  food: { name: "Pad Thai Thip Samai", desc: "Best pad thai · THB 100", price: 250, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "THB 100" },
};

const LONDON_TEMPLATE: TripTemplate = {
  transport: { name: "Oyster Day Cap", desc: "GBP 8 · Zone 1-2 travel", price: 856, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "GBP 8" },
  stayOptions: [
    { name: "Premier Inn City", desc: "2 nights · Central location", price: 12840, verified: "May 2026", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&q=75", localPrice: "GBP 120" },
    { name: "Generator London", desc: "2 nights · Trendy hostel", price: 5350, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "GBP 50" },
  ],
  experienceOptions: [
    { name: "Borough Market Walk", desc: "Food market · Free entry", price: 0, verified: "May 2026", photo: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=120&q=75" },
    { name: "Tower of London", desc: "Crown jewels · GBP 30", price: 3210, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75", localPrice: "GBP 30" },
  ],
  food: { name: "Dishoom Covent Garden", desc: "Bombay cafe · GBP 25", price: 2675, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "GBP 25" },
};

const EUROPE_TEMPLATE: TripTemplate = {
  transport: { name: "Metro Day Pass", desc: "EUR 10 · City travel", price: 900, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=120&q=75", localPrice: "EUR 10" },
  stayOptions: [
    { name: "ibis Paris Centre", desc: "2 nights · City stay", price: 9000, verified: "May 2026", photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=120&q=75", localPrice: "EUR 100" },
    { name: "St Christopher's Inn", desc: "2 nights · Social hostel", price: 4500, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=120&q=75", localPrice: "EUR 50" },
  ],
  experienceOptions: [
    { name: "Musée d'Orsay", desc: "Impressionist art · EUR 16", price: 1440, verified: "May 2026", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=75", localPrice: "EUR 16" },
    { name: "Eiffel Tower Summit", desc: "Top floor · EUR 28", price: 2520, verified: "Apr 2026", photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=75", localPrice: "EUR 28" },
  ],
  food: { name: "Café de Flore", desc: "Saint-Germain · EUR 20", price: 1800, verified: "May 2026", photo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=75", localPrice: "EUR 20" },
};

// ─── Destination detection ───────────────────────────────────────────────────

type TemplateKey = "beach" | "dubai" | "bali" | "hills" | "singapore" | "thailand" | "london" | "europe";

function detectDestination(desc: string): { key: TemplateKey; name: string } {
  const d = desc.toLowerCase();
  if (d.includes("dubai") || d.includes("uae") || d.includes("abu dhabi"))
    return { key: "dubai", name: "Dubai" };
  if (d.includes("bali") || d.includes("ubud") || d.includes("seminyak") || d.includes("indonesia"))
    return { key: "bali", name: "Bali" };
  if (d.includes("singapore"))
    return { key: "singapore", name: "Singapore" };
  if (d.includes("phuket")) return { key: "thailand", name: "Phuket" };
  if (d.includes("chiang mai")) return { key: "thailand", name: "Chiang Mai" };
  if (d.includes("bangkok") || d.includes("thailand"))
    return { key: "thailand", name: "Bangkok" };
  if (d.includes("amsterdam")) return { key: "europe", name: "Amsterdam" };
  if (d.includes("barcelona")) return { key: "europe", name: "Barcelona" };
  if (d.includes("rome")) return { key: "europe", name: "Rome" };
  if (d.includes("paris") || d.includes("france") || d.includes("europe"))
    return { key: "europe", name: "Paris" };
  if (d.includes("london") || d.includes("england") || /\buk\b/.test(d))
    return { key: "london", name: "London" };
  if (d.includes("coorg")) return { key: "hills", name: "Coorg" };
  if (d.includes("munnar")) return { key: "hills", name: "Munnar" };
  if (d.includes("ooty")) return { key: "hills", name: "Ooty" };
  if (d.includes("kodaikanal")) return { key: "hills", name: "Kodaikanal" };
  if (d.includes("hills") || d.includes("hill station") || d.includes("hillstation"))
    return { key: "hills", name: "the Hills" };
  if (d.includes("goa")) return { key: "beach", name: "Goa" };
  if (d.includes("gokarna")) return { key: "beach", name: "Gokarna" };
  if (d.includes("pondicherry") || d.includes("puducherry"))
    return { key: "beach", name: "Pondicherry" };
  return { key: "beach", name: "Gokarna" };
}

function getTemplate(key: TemplateKey, dest: string, budget: number): TripTemplate {
  if (key === "dubai") return dubaiTemplate(budget);
  if (key === "bali") return baliTemplate(budget);
  if (key === "hills") return hillsTemplate(dest, budget);
  if (key === "singapore") return SINGAPORE_TEMPLATE;
  if (key === "thailand") return THAILAND_TEMPLATE;
  if (key === "london") return LONDON_TEMPLATE;
  if (key === "europe") return EUROPE_TEMPLATE;
  return beachTemplate(dest, budget);
}

// ─── Card component ──────────────────────────────────────────────────────────

type CardProps = {
  name: string;
  desc: string;
  price: number;
  verified: string;
  photo: string;
  localPrice?: string;
  onSwap?: () => void;
};

function ItineraryCard({ name, desc, price, verified, photo, localPrice, onSwap }: CardProps) {
  const priceLabel = price === 0 ? "Free" : formatINR(price);
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-gray-100">
      <div className="relative h-[68px] w-[68px] sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-xl">
        <Image src={photo} alt={name} fill className="object-cover" sizes="72px" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
        <span className="mt-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5">
          <span className="text-green-600 text-[10px] font-semibold">✓ Verified {verified}</span>
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="text-right">
          {localPrice ? (
            <>
              <p className="font-bold text-gray-900 text-sm tabular-nums">{localPrice}</p>
              <p className="text-[11px] text-gray-400 tabular-nums">{priceLabel}</p>
            </>
          ) : (
            <p className="font-bold text-gray-900 text-sm tabular-nums">{priceLabel}</p>
          )}
        </div>
        {onSwap && (
          <button
            onClick={onSwap}
            className="text-xs font-semibold hover:opacity-70 active:scale-95 transition-all"
            style={{ color: BRAND }}
          >
            Swap
          </button>
        )}
      </div>
    </div>
  );
}

function DayLabel({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 pl-1">
      {label}
    </p>
  );
}

// ─── Plan content (needs Suspense) ───────────────────────────────────────────

function PlanContent() {
  const searchParams = useSearchParams();
  const desc = searchParams.get("desc") ?? "";
  const rawBudget = Number(searchParams.get("budget"));
  const budget = rawBudget >= 5000 ? rawBudget : 12000;
  const people = Number(searchParams.get("people") ?? 2);

  const { key, name: destination } = detectDestination(desc);
  const template = getTemplate(key, destination, budget);

  const [stayIdx, setStayIdx] = useState(0);
  const [expIdx, setExpIdx] = useState(0);

  const stay = template.stayOptions[stayIdx];
  const experience = template.experienceOptions[expIdx];
  const total =
    template.transport.price + stay.price + experience.price + template.food.price;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
        <Link
          href="/"
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
        <div className="min-w-0">
          <h1 className="font-bold text-gray-900 leading-tight truncate">
            Your {destination} Plan
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            2 days · {people} {people === 1 ? "person" : "people"} · Budget {formatINR(budget)}
          </p>
        </div>
      </header>

      {/* Amber price banner */}
      <div className="px-4 sm:px-5 py-5" style={{ backgroundColor: BRAND }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white text-3xl font-extrabold tracking-tight tabular-nums">
              {formatINR(total)}
            </p>
            <p className="text-white/70 text-xs mt-1 leading-snug">
              No hidden charges — what you see is what you pay
            </p>
          </div>
          <div className="shrink-0 rounded-full bg-white/20 px-3 py-1.5">
            <span className="text-white text-xs font-bold whitespace-nowrap">All verified ✓</span>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <main className="flex-1 px-4 pt-6 pb-32 space-y-6">
        <section>
          <DayLabel label="Day 1 — Arrival" />
          <div className="space-y-3">
            <ItineraryCard {...template.transport} />
            <ItineraryCard
              {...stay}
              onSwap={() => setStayIdx((i) => (i + 1) % template.stayOptions.length)}
            />
          </div>
        </section>

        <section>
          <DayLabel label="Day 2 — Explore" />
          <div className="space-y-3">
            <ItineraryCard
              {...experience}
              onSwap={() => setExpIdx((i) => (i + 1) % template.experienceOptions.length)}
            />
            <ItineraryCard {...template.food} />
          </div>
        </section>
      </main>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100 bg-white px-4 py-4">
        <Link
          href={`/booking?dest=${encodeURIComponent(destination)}&total=${total}`}
          className="flex w-full items-center justify-center rounded-2xl bg-gray-900 px-4 py-4 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:opacity-80"
        >
          Book this trip {formatINR(total)} →
        </Link>
      </div>
    </div>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────

export default function PlanPage() {
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
      <PlanContent />
    </Suspense>
  );
}
