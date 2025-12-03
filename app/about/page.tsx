"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";

export default function AboutPage() {
  const missionSection = useScrollAnimation({ threshold: 0.2 });
  const howitworksSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setStepRef, visibleItems: visibleSteps } = useStaggeredAnimation(4);
  const whychooseSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFeatureRef, visibleItems: visibleFeatures } = useStaggeredAnimation(5);

  const steps = [
    {
      number: 1,
      title: "Answer Questions",
      description: "Provide detailed information about a property through our guided questionnaire.",
    },
    {
      number: 2,
      title: "AI Analysis",
      description:
        "Our advanced AI models analyze the property data and market conditions to identify opportunities.",
    },
    {
      number: 3,
      title: "Generate Report",
      description: "Get a professional, formatted Google Docs report instantly with all key metrics.",
    },
    {
      number: 4,
      title: "Share & Collaborate",
      description: "Easily share reports with partners or team members using Google Docs links.",
    },
  ];

  const features = [
    { icon: "⚡", title: "Fast Analysis", description: "Get comprehensive reports in minutes, not hours." },
    {
      icon: "📄",
      title: "Professional Format",
      description: "Reports are automatically formatted in Google Docs for easy sharing.",
    },
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "Uses advanced machine learning to identify investment opportunities.",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Accounts",
      description: "Parents can manage child accounts for collaborative analysis.",
    },
    {
      icon: "💰",
      title: "Affordable",
      description: "Just $3/month after a 30-day free trial.",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden">
        {/* Layered background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#08B4D4]/10 via-transparent to-white" />
        <div className="fixed inset-0 -z-10 animated-gradient opacity-12" />
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/60 to-white" />

        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-[#1D7874] via-[#679289] to-[#1D7874] bg-clip-text text-transparent mb-6">
              About Property Investment AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Democratizing property investment analysis through AI-powered insights
            </p>
          </div>

          {/* Mission Section */}
          <section
            ref={missionSection.ref}
            className={`mb-20 transition-all duration-1000 ${
              missionSection.isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="glass-card">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We're making property investment analysis accessible to everyone. Our AI-powered platform
                helps investors make informed decisions by analyzing properties and generating comprehensive
                reports that highlight key investment metrics and insights.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're a first-time investor or a seasoned pro, our tools simplify the complex process
                of property evaluation so you can focus on what matters most: finding great investment
                opportunities.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section
            ref={howitworksSection.ref}
            className={`mb-20 transition-all duration-1000 ${
              howitworksSection.isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              How It Works
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Our streamlined process gets you from property inquiry to professional report in just 4 steps
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => setStepRef(index, el)}
                  className={`glass-card will-animate transition-all duration-700 ${
                    visibleSteps[index]
                      ? `animate-fade-in-up delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-linear-to-br from-[#1D7874] to-[#679289] text-white font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section
            ref={whychooseSection.ref}
            className={`mb-20 transition-all duration-1000 ${
              whychooseSection.isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Built by investors, for investors. Here's what sets us apart
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  ref={(el) => setFeatureRef(index, el)}
                  className={`glass-card will-animate transition-all duration-700 text-center ${
                    visibleFeatures[index]
                      ? `animate-fade-in-up delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div className="text-5xl mb-4 animate-bounce-gentle">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="glass-card text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get started risk-free with our 30-day free trial. After that, it's just $3/month for unlimited
              analysis. No credit card required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="glass-btn inline-block text-[#1D7874] hover:text-[#071E22] font-semibold py-4 px-10 text-lg will-animate"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="glass-btn inline-block text-[#1D7874] hover:text-[#071E22] font-semibold py-4 px-10 text-lg will-animate"
              >
                View Pricing
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
