"use client";

import { useState } from "react";

type TripType = "roundtrip" | "oneway" | "multicity";

export default function FlightSearchPanel() {
  const [tripType, setTripType] = useState<TripType>("roundtrip");

  return (
    <div className="relative z-20 -mt-12 px-4 pb-10 sm:-mt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]">
          {/* Top bar — product area (Eurowings-style) */}
          <div className="flex border-b border-gray-100 bg-gray-50/80">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 border-b-2 border-ew-primary bg-white px-4 py-3 text-sm font-semibold text-ew-dark"
              aria-current="page"
            >
              <PlaneIcon className="h-5 w-5 text-ew-primary" />
              Flights
            </button>
            <div
              className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-400"
              title="Demo only"
            >
              <CarIcon className="h-5 w-5" />
              Car hire
            </div>
            <div
              className="hidden flex-1 cursor-not-allowed items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-400 sm:flex"
              title="Demo only"
            >
              <HotelIcon className="h-5 w-5" />
              Hotel
            </div>
          </div>

          {/* Trip type */}
          <div className="flex flex-wrap gap-1 border-b border-gray-100 px-4 py-3 sm:px-5">
            {(
              [
                ["roundtrip", "Round trip"],
                ["oneway", "One way"],
                ["multicity", "Multi-city"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTripType(id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tripType === id
                    ? "bg-ew-primary text-white shadow-sm"
                    : "bg-gray-100 text-ew-dark hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            {tripType === "multicity" ? (
              <p className="mb-4 rounded-lg bg-ew-light px-4 py-3 text-sm text-ew-grey">
                Multi-city booking is shown as a simplified layout in this demo — add more
                segments in the full booking flow.
              </p>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-3">
              {/* From */}
              <label className="group relative lg:col-span-3">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  From
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LocationIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    readOnly
                    defaultValue="Düsseldorf (DUS)"
                    className="w-full cursor-default rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium text-ew-dark outline-none ring-ew-primary/20 transition-shadow focus:border-ew-primary focus:ring-2"
                  />
                </div>
              </label>

              {/* Swap — mobile */}
              <div className="flex justify-center py-1 lg:hidden">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 shadow-sm"
                  title="Swap airports (demo)"
                  aria-label="Swap departure and destination"
                >
                  <SwapIcon className="h-5 w-5 rotate-90" />
                </button>
              </div>

              {/* Swap — desktop */}
              <div className="hidden h-full items-end justify-center pb-3 lg:col-span-1 lg:flex">
                <button
                  type="button"
                  className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:border-ew-primary hover:text-ew-primary"
                  title="Swap airports (demo)"
                  aria-label="Swap departure and destination"
                >
                  <SwapIcon className="h-5 w-5" />
                </button>
              </div>

              {/* To */}
              <label className="lg:col-span-3">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  To
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LocationIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    readOnly
                    defaultValue="Palma de Mallorca (PMI)"
                    className="w-full cursor-default rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium text-ew-dark outline-none ring-ew-primary/20 transition-shadow focus:border-ew-primary focus:ring-2"
                  />
                </div>
              </label>

              {/* Departure */}
              <label className="lg:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Departure
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    readOnly
                    defaultValue="Fri, 28 Mar 2026"
                    className="w-full cursor-default rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium text-ew-dark outline-none ring-ew-primary/20 transition-shadow focus:border-ew-primary focus:ring-2"
                  />
                </div>
              </label>

              {/* Return */}
              <label className={`lg:col-span-2 ${tripType === "oneway" ? "opacity-40" : ""}`}>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Return
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <CalendarIcon className="h-5 w-5" />
                  </span>
                  <input
                    key={tripType}
                    type="text"
                    readOnly
                    disabled={tripType === "oneway"}
                    defaultValue={tripType === "oneway" ? "—" : "Sun, 6 Apr 2026"}
                    className="w-full cursor-default rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-3 text-sm font-medium text-ew-dark outline-none ring-ew-primary/20 transition-shadow focus:border-ew-primary focus:ring-2 disabled:bg-gray-50"
                  />
                </div>
              </label>

              {/* Passengers + search */}
              <div className="flex flex-col gap-3 lg:col-span-12 lg:flex-row lg:items-end lg:justify-between lg:gap-4 lg:border-t lg:border-gray-100 lg:pt-4">
                <label className="lg:max-w-xs lg:flex-1">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Passengers &amp; class
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <UsersIcon className="h-5 w-5" />
                    </span>
                    <select
                      disabled
                      defaultValue="eco1"
                      className="w-full cursor-default appearance-none rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm font-medium text-ew-dark outline-none"
                    >
                      <option value="eco1">1 Adult, Economy</option>
                      <option value="eco2">2 Adults, Economy</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <ChevronIcon className="h-4 w-4" />
                    </span>
                  </div>
                </label>

                <button
                  type="button"
                  className="w-full rounded-lg bg-ew-primary px-8 py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-ew-primary-dark focus:outline-none focus:ring-2 focus:ring-ew-primary focus:ring-offset-2 lg:w-auto lg:min-w-[200px] lg:self-end"
                >
                  Search flights
                </button>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Demo only — search is not connected to a booking engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  );
}

function HotelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.434-8-11a8 8 0 1116 0c0 6.566-8 11-8 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
