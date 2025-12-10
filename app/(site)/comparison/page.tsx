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
}

export default function ComparisonPage() {
  const [evaluations, setEvaluations] = useState<PropertyEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("QLD");
  const [sortBy, setSortBy] = useState<"suburb" | "houseYield">("suburb");

  const states = ["NSW", "QLD", "VIC", "WA", "SA", "TAS", "ACT", "NT"];

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

  const sortedEvaluations = [...evaluations].sort((a, b) => {
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
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedState === state
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
                  There are no property evaluations for {selectedState} yet.
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
                      <th className="px-6 py-4 text-left font-bold">House Median Price</th>
                      <th className="px-6 py-4 text-left font-bold">Unit Median Price</th>
                      <th className="px-6 py-4 text-left font-bold">House Yield</th>
                      <th className="px-6 py-4 text-left font-bold">Unit Yield</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvaluations.map((evaluation, index) => (
                      <tr
                        key={evaluation.id}
                        className={`border-t border-gray-200 transition-colors ${
                          index % 2 === 0
                            ? "bg-white hover:bg-blue-50"
                            : "bg-gray-50 hover:bg-blue-100"
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {evaluation.suburb}
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
      </main>
    </>
  );
}
