"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";

export default function HomePage() {
  const heroSection = useScrollAnimation({ threshold: 0.2 });
  const featuresSection = useScrollAnimation({ threshold: 0.1 });
  const pricingSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFeatureRef, visibleItems: visibleFeatures } = useStaggeredAnimation(3);
  const { setRef: setPricingRef, visibleItems: visiblePricing } = useStaggeredAnimation(2);

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
      <main className="relative min-h-screen overflow-hidden">
        {/* Layered background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#08B4D4]/10 via-transparent to-white" />
        <div className="fixed inset-0 -z-10 animated-gradient opacity-15" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/60 to-white" />

        {/* Hero Section */}
        <section
          ref={heroSection.ref}
          className={`relative py-12 md:py-32 px-4 transition-all duration-1000 ${
            heroSection.isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-[#1D7874] via-[#679289] to-[#1D7874] bg-clip-text text-transparent mb-6 leading-tight will-animate">
              AI-Powered Property Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get comprehensive investment analysis and reports in minutes. Our AI analyzes
              property data and creates professional Google Docs reports for your portfolio.
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

            {/* Floating shapes for visual interest */}
            <div className="mt-20 relative h-64 md:h-80 flex items-center justify-center">
              <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-linear-to-br from-[#1D7874]/20 to-[#679289]/20 rounded-full blur-3xl animate-float" />
              <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-linear-to-br from-[#679289]/20 to-[#1D7874]/20 rounded-full blur-3xl animate-float delay-200" />
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
                      ? `animate-fade-in-${index === 0 ? "left" : "right"} delay-${
                          index * 100
                        }`
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
                <span className="transition-transform group-hover:translate-x-1">→</span>
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
