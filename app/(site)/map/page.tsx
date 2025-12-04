"use client";

import { Navigation } from "@/components/Navigation";
import MapContainer from "@/components/MapContainer";
import Link from "next/link";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/useScrollAnimation";
import { useState } from "react";

interface Property {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  price?: number;
  status?: string;
}

export default function MapPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const featuresSection = useScrollAnimation({ threshold: 0.1 });
  const pricingSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFeatureRef, visibleItems: visibleFeatures } =
    useStaggeredAnimation(3);
  const { setRef: setPricingRef, visibleItems: visiblePricing } =
    useStaggeredAnimation(2);

  // Sample properties for demo - Brisbane, Australia
  const sampleProperties = [
    {
      id: "1",
      latitude: -27.4698,
      longitude: 153.0251,
      address: "123 South Bank, Brisbane, QLD",
      price: 850000,
      status: "For Sale",
    },
    {
      id: "2",
      latitude: -27.4829,
      longitude: 153.037,
      address: "456 Fortitude Valley, Brisbane, QLD",
      price: 1250000,
      status: "For Sale",
    },
    {
      id: "3",
      latitude: -27.4674,
      longitude: 153.0289,
      address: "789 City Centre, Brisbane, QLD",
      price: 1750000,
      status: "Sold",
    },
  ];

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
        {/* Layered background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#08B4D4]/10 via-transparent to-white" />
        <div className="fixed inset-0 -z-10 animated-gradient opacity-15" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/60 to-white" />

        {/* Map Display Section */}
        <section className="relative py-12 md:py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Interactive Property Map
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Explore properties on an interactive map and get detailed
              information at a glance
            </p>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <MapContainer
                properties={sampleProperties}
                initialCenter={[153.0289, -27.4698]}
                initialZoom={13}
                height="500px"
                onPropertyClick={setSelectedProperty}
              />
            </div>
            {selectedProperty && (
              <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProperty.address}
                </h3>
                <p className="text-gray-600 mb-2">
                  Price: ${selectedProperty.price?.toLocaleString()}
                </p>
                <p className="text-[#1D7874] font-semibold">
                  {selectedProperty.status}
                </p>
              </div>
            )}
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
