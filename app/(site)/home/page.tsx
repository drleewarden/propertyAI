"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/useScrollAnimation";

interface SelectedSuburb {
  id: string;
  name: string;
  state: string;
}

export default function HomePage() {
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState("QLD");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedSuburbs, setSelectedSuburbs] = useState<SelectedSuburb[]>([]);
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const heroSection = useScrollAnimation({ threshold: 0.2 });
  const featuresSection = useScrollAnimation({ threshold: 0.1 });
  const pricingSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFeatureRef, visibleItems: visibleFeatures } =
    useStaggeredAnimation(3);
  const { setRef: setPricingRef, visibleItems: visiblePricing } =
    useStaggeredAnimation(2);

  // Handle scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setBackgroundOffset(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSuburbSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suburb.trim()) {
      // Check if this suburb+state combo already exists
      const exists = selectedSuburbs.some(
        (s) =>
          s.name.toLowerCase() === suburb.toLowerCase() && s.state === state
      );

      if (!exists) {
        const newSuburb: SelectedSuburb = {
          id: `${suburb}-${state}-${Date.now()}`,
          name: suburb,
          state: state,
        };
        setSelectedSuburbs([...selectedSuburbs, newSuburb]);
        setSearchSubmitted(true);
        // Reset the form
        setSuburb("");
        setTimeout(() => setSearchSubmitted(false), 3000);
      } else {
        setSearchSubmitted(false);
      }
      console.log("Added suburb:", suburb, "in", state);
    }
  };

  const removeSuburb = (id: string) => {
    setSelectedSuburbs(selectedSuburbs.filter((s) => s.id !== id));
  };

  const clearAllSuburbs = () => {
    setSelectedSuburbs([]);
  };

  const features = [
    {
      icon: "📋",
      title: "Guided Questions",
      description:
        "Answer comprehensive questions about the property to provide all necessary data.",
    },
    {
      icon: "🤖",
      title: "AI Analysis",
      description:
        "Advanced AI analyzes your property data and generates detailed investment insights.",
    },
    {
      icon: "📄",
      title: "Google Docs Export",
      description:
        "Get professional reports automatically formatted in Google Docs for easy sharing.",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden bg-cityscape-overlay">
        {/* Layered background - Scrollable with parallax effect */}
        <div
          className="fixed inset-0 -z-10 bg-gradient-to-b from-[#08B4D4]/10 via-transparent to-white"
          style={{
            transform: `translateY(${Math.min(backgroundOffset * 0.5, 0)}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div
          className="fixed inset-0 -z-10 animated-gradient opacity-15"
          style={{
            transform: `translateY(${Math.min(backgroundOffset * 0.5, 0)}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div
          className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/60 to-white"
          style={{
            transform: `translateY(${Math.min(backgroundOffset * 0.3, 0)}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />

        {/* Hero Section */}
        <section
          ref={heroSection.ref}
          className={`relative py-12 md:py-32 px-4 transition-all duration-1000 ${
            heroSection.isVisible
              ? "animate-fade-in-up"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-[#1D7874] via-[#679289] to-[#1D7874] bg-clip-text text-transparent mb-6 leading-tight will-animate">
              AI-Powered Property Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get comprehensive investment analysis and reports in minutes. Our
              AI analyzes property data and creates professional Google Docs
              reports for your portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="glass-btn text-[#1D7874] hover:text-[#071E22] font-semibold py-4 px-8 will-animate"
              >
                Get Started Free
              </Link>
              <button className="glass-btn text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 will-animate">
                <Link href="/about">Learn More</Link>
              </button>
            </div>
          </div>
        </section>

        {/* Suburb Search Form Section */}
        <section className="relative  px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 md:p-12 rounded-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                Find Your Perfect Suburb
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Search for property data and investment insights in any suburb
              </p>

              <form onSubmit={handleSuburbSearch} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Suburb Input */}
                  <div>
                    <label
                      htmlFor="suburb"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Suburb Name
                    </label>
                    <input
                      type="text"
                      id="suburb"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      placeholder="e.g., Brisbane, South Bank"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D7874] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D7874] focus:border-transparent transition-all appearance-none cursor-pointer bg-white"
                    >
                      <option value="NSW">New South Wales (NSW)</option>
                      <option value="QLD">Queensland (QLD)</option>
                      <option value="VIC">Victoria (VIC)</option>
                      <option value="WA">Western Australia (WA)</option>
                      <option value="SA">South Australia (SA)</option>
                      <option value="TAS">Tasmania (TAS)</option>
                      <option value="ACT">
                        Australian Capital Territory (ACT)
                      </option>
                      <option value="NT">Northern Territory (NT)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#1D7874] hover:bg-[#071E22] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Search Properties
                  </button>
                </div>

                {/* Success Message */}
                {searchSubmitted && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      ✓ Suburb added to comparison list
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Add more suburbs to compare or analyze
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-sm text-center mb-4">
                  Popular suburbs:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Brisbane",
                    "South Bank",
                    "Fortitude Valley",
                    "Newstead",
                    "Paddington",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSuburb(s);
                        setSearchSubmitted(false);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#1D7874] hover:text-white text-gray-700 rounded-full text-sm font-medium transition-all duration-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Suburbs Pills */}
              {selectedSuburbs.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Selected Suburbs ({selectedSuburbs.length})
                    </h3>
                    <button
                      onClick={clearAllSuburbs}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {selectedSuburbs.map((s) => (
                      <div
                        key={s.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D7874] text-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {s.name}
                          </span>
                          <span className="text-xs opacity-90">{s.state}</span>
                        </div>
                        <button
                          onClick={() => removeSuburb(s.id)}
                          className="ml-2 text-white hover:text-red-200 font-bold text-lg leading-none transition-colors"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-[#1D7874] to-[#071E22] hover:from-[#071E22] hover:to-[#1D7874] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                      Analyze {selectedSuburbs.length} Suburb
                      {selectedSuburbs.length !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresSection.ref}
          className={`relative py-12 md:py-24 px-4 transition-all duration-1000 ${
            featuresSection.isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Powerful Features
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Everything you need to make informed property investment decisions
            </p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => setFeatureRef(index, el)}
                  className={`glass-card will-animate transition-all duration-700 ${
                    visibleFeatures[index]
                      ? `animate-fade-in-up delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="text-5xl mb-4 inline-block animate-bounce-gentle">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section
          ref={pricingSection.ref}
          className={`relative py-12 md:py-24 px-4 transition-all duration-1000 ${
            pricingSection.isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Flexible Pricing
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
              Choose the plan that works best for you
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {[
                {
                  title: "Free Trial",
                  price: "$0",
                  description: "30 days of full access to all features",
                  highlighted: false,
                },
                {
                  title: "Pro Plan",
                  price: "$3",
                  priceSubtext: "/mo",
                  description: "Unlimited reports and priority support",
                  highlighted: true,
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  ref={(el) => setPricingRef(index, el)}
                  className={`will-animate transition-all duration-700 ${
                    visiblePricing[index]
                      ? `animate-fade-in-${
                          index === 0 ? "left" : "right"
                        } delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div
                    className={`p-8 md:p-10 rounded-2xl transition-all duration-300 ${
                      plan.highlighted
                        ? "glass-card border-2 border-[#1D7874] bg-linear-to-br from-[#1D7874]/10 to-[#679289]/10"
                        : "glass-card"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {plan.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-[#1D7874]">
                        {plan.price}
                      </span>
                      {plan.priceSubtext && (
                        <span className="text-lg text-gray-600 ml-2">
                          {plan.priceSubtext}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-[#1D7874] hover:text-[#071E22] font-semibold transition-colors"
              >
                View full pricing details
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 md:py-24 px-4 border-t border-gray-200/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to transform your property investment process?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of investors using our AI-powered analysis tool
            </p>
            <Link
              href="/signup"
              className="glass-btn inline-block text-[#1D7874] hover:text-[#071E22] font-semibold py-4 px-10 text-lg will-animate"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
