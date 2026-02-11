"use client";

import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";

interface PropertyEvaluation {
  id: string;
  state: string;
  city: string;
  suburb: string;
  houseMedianPrice: string | null;
  unitMedianPrice: string | null;
  houseYield: string | null;
  unitYield: string | null;
  rentalPriceHouse: number;
  rentalPriceUnit: number;
  vacancyRate: number;
  demographicLifestyle: string | null;
  schools: string | null;
  notes: string | null;
}

interface LocationData {
  id: string;
  suburbName: string;
  state: string;
  cityDistrict: string | null;
  medianHousePrice: number;
  medianUnitPrice: number;
  rentalPriceHouse: number;
  rentalPriceUnit: number;
  vacancyRate: number;
  notes: string | null;
  isFavorite: boolean;
  demographicLifestyle: string | null;
  schools: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SelectedSuburb {
  id: string;
  name: string;
  state: string;
}

export default function ComparisonPage() {
  const [evaluations, setEvaluations] = useState<PropertyEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("QLD");
  const [sortBy, setSortBy] = useState<"suburb" | "houseYield">("suburb");
  const [selectedSuburbs, setSelectedSuburbs] = useState<SelectedSuburb[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "selected">("all");
  const [selectedSuburbDetail, setSelectedSuburbDetail] = useState<PropertyEvaluation | null>(null);

  const states = ["NSW", "QLD", "VIC", "WA", "SA", "TAS", "ACT", "NT"];

  useEffect(() => {
    // Check if there are selected suburbs in localStorage
    const storedSuburbs = localStorage.getItem('selectedSuburbs');
    console.log("Stored suburbs from localStorage:", storedSuburbs, 'eve', evaluations);
    if (storedSuburbs) {
      try {
        const suburbs = JSON.parse(storedSuburbs);
        if (suburbs.length > 0) {
          setSelectedSuburbs(suburbs);
          setFilterMode("selected");
          // Set the state to the first suburb's state if available
          setSelectedState(suburbs[0].state);
        }
      } catch (e) {
        console.error("Failed to parse selected suburbs:", e);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvaluations();
  }, [selectedState]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/evaluations?state=${selectedState}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch evaluations");
      }

      const data = await response.json();
      setEvaluations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter evaluations based on filterMode
  const filteredEvaluations = filterMode === "selected" && selectedSuburbs.length > 0
    ? evaluations.filter((evaluation) =>
      selectedSuburbs.some(
        (suburb) =>
          suburb.name.toLowerCase() === evaluation.suburb.toLowerCase() &&
          suburb.state === evaluation.state
      )
    )
    : evaluations;

  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    if (sortBy === "suburb") {
      return a.suburb.localeCompare(b.suburb);
    } else if (sortBy === "houseYield") {
      const yieldA = parseFloat(a.houseYield || "0");
      const yieldB = parseFloat(b.houseYield || "0");
      return yieldB - yieldA; // Descending
    }
    return 0;
  });

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen bg-gradient-to-b from-white via-[#f8fafb] to-white">
        {/* Header */}
        <section className="relative py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Property Comparison
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Compare property evaluations, median prices, and yields across Australian suburbs
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="relative py-8 px-4 border-b border-gray-200">
          <div className="max-w-7xl mx-auto">
            {/* Selected Suburbs Indicator */}
            {selectedSuburbs.length > 0 && (
              <div className="mb-6 p-4 bg-[#1D7874]/10 border border-[#1D7874] rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Viewing: {filterMode === "selected" ? `${selectedSuburbs.length} Selected Suburb${selectedSuburbs.length !== 1 ? 's' : ''}` : 'All Suburbs'}
                    </p>
                    {filterMode === "selected" && (
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedSuburbs.map(s => `${s.name} (${s.state})`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterMode("selected")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${filterMode === "selected"
                        ? "bg-[#1D7874] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Selected Only
                    </button>
                    <button
                      onClick={() => setFilterMode("all")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${filterMode === "all"
                        ? "bg-[#1D7874] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      View All
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSuburbs([]);
                        setFilterMode("all");
                        localStorage.removeItem('selectedSuburbs');
                      }}
                      className="px-4 py-2 rounded-lg font-semibold transition-all text-sm bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* State Filter */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select State
                </label>
                <div className="flex flex-wrap gap-2">
                  {states.map((state) => (
                    <button
                      key={state}
                      onClick={() => setSelectedState(state)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedState === state
                        ? "bg-[#1D7874] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "suburb" | "houseYield")}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D7874] focus:border-transparent"
                >
                  <option value="suburb">Suburb Name (A-Z)</option>
                  <option value="houseYield">House Yield (Highest)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="relative py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin mb-4">
                    <div className="w-12 h-12 border-4 border-[#1D7874] border-t-transparent rounded-full" />
                  </div>
                  <p className="text-gray-600 font-semibold">Loading evaluations...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-semibold">Error loading data</p>
                <p className="text-red-700 text-sm mt-2">{error}</p>
              </div>
            ) : sortedEvaluations.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800 font-semibold">No data available</p>
                <p className="text-blue-700 text-sm mt-2">
                  {filterMode === "selected"
                    ? "No property evaluations found for the selected suburbs. Try selecting a different state or viewing all suburbs."
                    : `There are no property evaluations for ${selectedState} yet.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1D7874] to-[#0f5753] text-white">
                      <th className="px-6 py-4 text-left font-bold">Suburb</th>
                      <th className="px-6 py-4 text-left font-bold">City</th>
                      <th className="px-6 py-4 text-left font-bold">State</th>
                      <th className="px-6 py-4 text-left font-bold">House Price</th>
                      <th className="px-6 py-4 text-left font-bold">Unit Price</th>
                      <th className="px-6 py-4 text-left font-bold">House Rent</th>
                      <th className="px-6 py-4 text-left font-bold">Unit Rent</th>
                      <th className="px-6 py-4 text-left font-bold">House Yield</th>
                      <th className="px-6 py-4 text-left font-bold">Unit Yield</th>
                      <th className="px-6 py-4 text-left font-bold">Vacancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvaluations.map((evaluation, index) => (
                      <tr
                        key={evaluation.id}
                        onClick={() => {
                          console.log('Selected suburb for detail view:', evaluation);
                          setSelectedSuburbDetail(evaluation)
                        }}
                        className={`border-t border-gray-200 transition-all cursor-pointer group ${index % 2 === 0
                          ? "bg-white hover:bg-blue-50"
                          : "bg-gray-50 hover:bg-blue-100"
                          }`}
                        title="Click to view detailed information"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                          {evaluation.suburb}
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1D7874] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.city}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#1D7874] text-white">
                            {evaluation.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.houseMedianPrice ? (
                            <span className="font-semibold text-[#1D7874]">
                              {evaluation.houseMedianPrice}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.unitMedianPrice ? (
                            <span className="font-semibold text-[#679289]">
                              {evaluation.unitMedianPrice}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.rentalPriceHouse > 0 ? (
                            <span className="font-semibold">
                              ${evaluation.rentalPriceHouse}/wk
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.rentalPriceUnit > 0 ? (
                            <span className="font-semibold">
                              ${evaluation.rentalPriceUnit}/wk
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {evaluation.houseYield ? (
                            <div className="inline-flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-gradient-to-r from-[#1D7874] to-[#2B9E8F] h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      (parseFloat(evaluation.houseYield) / 5) * 100,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="font-semibold text-[#1D7874] min-w-12">
                                {evaluation.houseYield}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {evaluation.unitYield ? (
                            <span className="font-semibold text-[#679289]">
                              {evaluation.unitYield}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {evaluation.vacancyRate > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {evaluation.vacancyRate}%
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${evaluation.vacancyRate < 2 ? 'bg-green-100 text-green-800' :
                                evaluation.vacancyRate < 3 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                {evaluation.vacancyRate < 2 ? 'Tight' : evaluation.vacancyRate < 3 ? 'Normal' : 'High'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {!loading && sortedEvaluations.length > 0 && (
              <div className="mt-8 grid md:grid-cols-4 gap-4">
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Total Suburbs</p>
                  <p className="text-3xl font-bold text-[#1D7874] mt-2">
                    {sortedEvaluations.length}
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Avg House Yield</p>
                  <p className="text-3xl font-bold text-[#1D7874] mt-2">
                    {(
                      sortedEvaluations
                        .filter((e) => e.houseYield)
                        .reduce((sum, e) => sum + parseFloat(e.houseYield || "0"), 0) /
                      sortedEvaluations.filter((e) => e.houseYield).length
                    ).toFixed(2)}
                    %
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">Highest Yield</p>
                  <p className="text-3xl font-bold text-[#1D7874] mt-2">
                    {sortedEvaluations
                      .filter((e) => e.houseYield)
                      .reduce((max, e) => {
                        const yield_ = parseFloat(e.houseYield || "0");
                        return yield_ > parseFloat(max.houseYield || "0") ? e : max;
                      }, sortedEvaluations[0])?.houseYield || "—"}
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                  <p className="text-gray-600 text-sm font-semibold">State</p>
                  <p className="text-3xl font-bold text-[#1D7874] mt-2">{selectedState}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Suburb Detail Modal */}
        {selectedSuburbDetail && (
          <SuburbDetailModal
            suburb={selectedSuburbDetail}
            onClose={() => setSelectedSuburbDetail(null)}
          />
        )}
      </main>
    </>
  );
}

function SuburbDetailModal({
  suburb,
  onClose,
}: {
  suburb: PropertyEvaluation;
  onClose: () => void;
}) {
  // No need to fetch data separately - it's already in the suburb prop
  console.log("Suburb data in modal:", suburb);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {suburb.suburb}, {suburb.state}
              </h2>
              <p className="text-sm text-gray-500">{suburb.city}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Property Market Data */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Property Market Data
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gradient-to-br from-[#1D7874]/10 to-[#1D7874]/5 border border-[#1D7874]/20 p-4">
                  <p className="text-sm text-gray-600 font-semibold">House Median Price</p>
                  <p className="text-2xl font-bold text-[#1D7874] mt-2">
                    {suburb.houseMedianPrice || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#679289]/10 to-[#679289]/5 border border-[#679289]/20 p-4">
                  <p className="text-sm text-gray-600 font-semibold">Unit Median Price</p>
                  <p className="text-2xl font-bold text-[#679289] mt-2">
                    {suburb.unitMedianPrice || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#1D7874]/10 to-[#1D7874]/5 border border-[#1D7874]/20 p-4">
                  <p className="text-sm text-gray-600 font-semibold">House Yield</p>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-2xl font-bold text-[#1D7874]">
                      {suburb.houseYield || "N/A"}
                    </p>
                    {suburb.houseYield && (
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#1D7874] to-[#2B9E8F] h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (parseFloat(suburb.houseYield) / 5) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-[#679289]/10 to-[#679289]/5 border border-[#679289]/20 p-4">
                  <p className="text-sm text-gray-600 font-semibold">Unit Yield</p>
                  <p className="text-2xl font-bold text-[#679289] mt-2">
                    {suburb.unitYield || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rental Market Data */}
            {(suburb.rentalPriceHouse > 0 || suburb.rentalPriceUnit > 0 || suburb.vacancyRate > 0) && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Rental Market Data
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {suburb.rentalPriceHouse > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-600 font-semibold">House Rental (weekly)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        ${suburb.rentalPriceHouse.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {suburb.rentalPriceUnit > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-600 font-semibold">Unit Rental (weekly)</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        ${suburb.rentalPriceUnit.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {suburb.vacancyRate > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-600 font-semibold">Vacancy Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {suburb.vacancyRate}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Information */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Location Information
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-semibold">Suburb</span>
                  <span className="text-sm text-gray-900 font-medium">{suburb.suburb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-semibold">City</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {suburb.city || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 font-semibold">State</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#1D7874] text-white">
                    {suburb.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Demographics & Lifestyle */}
            {suburb.demographicLifestyle && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Demographics & Lifestyle
                </h3>
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {suburb.demographicLifestyle}
                  </p>
                </div>
              </div>
            )}

            {/* Schools */}
            {suburb.schools && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Schools
                </h3>
                <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {suburb.schools}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {suburb.notes && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Additional Notes
                </h3>
                <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {suburb.notes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-[#1D7874] px-6 py-2 text-sm font-semibold text-white hover:bg-[#155f5c] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
