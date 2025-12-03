"use client";

import { Navigation } from "@/components/Navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const pricingSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setPricingCardRef, visibleItems: visibleCards } = useStaggeredAnimation(3);
  const faqSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFaqRef, visibleItems: visibleFaqs } = useStaggeredAnimation(4);

  const handleUpgrade = async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes! There are no long-term contracts. You can cancel your Pro subscription at any time from your account settings.",
    },
    {
      question: "What happens when my free trial ends?",
      answer:
        "You'll have a 7-day reminder before your trial expires. You can upgrade to Pro to continue using the service, or your account will be downgraded to a limited version.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 7-day money-back guarantee on the Pro plan. Contact our support team if you're not satisfied.",
    },
    {
      question: "Can multiple people use one account?",
      answer:
        "Yes! You can create child accounts linked to your parent account, allowing family members to collaborate on property analysis.",
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

        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <section className="text-center mb-16 animate-fade-in-down">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-[#1D7874] via-[#679289] to-[#1D7874] bg-clip-text text-transparent mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works for you. Cancel anytime, no hidden fees.
            </p>
          </section>

          {/* Pricing Cards */}
          <section ref={pricingSection.ref} className="mb-20">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Free Trial",
                  subtitle: "Perfect to get started",
                  price: "$0",
                  period: "30 days",
                  features: [
                    "Unlimited property analysis",
                    "AI-powered reports",
                    "Google Docs export",
                    "Family account management",
                  ],
                  button: {
                    text: session ? "Your Current Plan" : "Get Started",
                    href: session ? "#" : "/signup",
                    disabled: !!session,
                  },
                  highlighted: false,
                },
                {
                  title: "Pro",
                  subtitle: "For serious investors",
                  price: "$3",
                  period: "/month",
                  features: [
                    "Everything in Free Trial",
                    "Unlimited reports after trial",
                    "Priority support",
                    "Advanced analytics",
                    "Cancel anytime",
                  ],
                  button: {
                    text: loading ? "Loading..." : session ? "Upgrade to Pro" : "Sign in to Upgrade",
                    action: handleUpgrade,
                    disabled: loading || !session,
                  },
                  highlighted: true,
                },
                {
                  title: "Enterprise",
                  subtitle: "For teams and organizations",
                  price: "Custom",
                  period: "Contact us",
                  features: [
                    "Everything in Pro",
                    "Custom integrations",
                    "Dedicated support",
                    "API access",
                  ],
                  button: {
                    text: "Contact Sales",
                    href: "mailto:contact@propertyai.com",
                  },
                  highlighted: false,
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  ref={(el) => setPricingCardRef(index, el)}
                  className={`will-animate transition-all duration-700 ${
                    visibleCards[index]
                      ? `animate-fade-in-up delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  } ${plan.highlighted ? "md:scale-105 md:relative md:z-10" : ""}`}
                >
                  <div
                    className={`h-full relative ${
                      plan.highlighted ? "glass-card border-2 border-[#1D7874]" : "glass-card"
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-linear-to-r from-[#1D7874] to-[#679289] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                      <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                    </div>

                    <div className="mb-8">
                      <span className="text-5xl font-bold bg-linear-to-r from-[#1D7874] via-[#679289] to-[#1D7874] bg-clip-text text-transparent">{plan.price}</span>
                      <p className="text-gray-600 text-sm mt-2">{plan.period}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="text-[#1D7874] mr-3 text-lg">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.button.action ? (
                      <button
                        onClick={plan.button.action}
                        disabled={plan.button.disabled}
                        className="w-full glass-btn text-[#1D7874] hover:text-[#071E22] font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {plan.button.text}
                      </button>
                    ) : (
                      <Link
                        href={plan.button.href!}
                        className={`block w-full glass-btn text-center text-[#1D7874] hover:text-[#071E22] font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
                          plan.button.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
                        }`}
                      >
                        {plan.button.text}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section ref={faqSection.ref} className="max-w-3xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-down">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  ref={(el) => setFaqRef(index, el)}
                  className={`glass-card will-animate transition-all duration-700 ${
                    visibleFaqs[index]
                      ? `animate-fade-in-up delay-${index * 100}`
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
