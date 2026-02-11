"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/useScrollAnimation";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { invokeBedrockAgent } from "@/lib/bedrock-api";

interface Message {
  id: string;
  content: string;
  variant: "bot" | "user";
  timestamp: Date;
  isNew?: boolean;
}

interface SelectedSuburb {
  id: string;
  name: string;
  state: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const heroSection = useScrollAnimation({ threshold: 0.2 });
  const featuresSection = useScrollAnimation({ threshold: 0.1 });
  const pricingSection = useScrollAnimation({ threshold: 0.1 });
  const { setRef: setFeatureRef, visibleItems: visibleFeatures } =
    useStaggeredAnimation(3);
  const { setRef: setPricingRef, visibleItems: visiblePricing } =
    useStaggeredAnimation(2);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your Property Investment AI Assistant. I can help you search for suburbs, analyze property data, and provide investment insights. What suburb are you interested in?",
      variant: "bot",
      timestamp: new Date(),
      isNew: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>();
  const [error, setError] = useState<string>();

  // Handle scroll effect for background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setBackgroundOffset(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      content,
      variant: "bot",
      timestamp: new Date(),
      isNew: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id ? { ...msg, isNew: false } : msg
        )
      );
    }, 100);

    return botMessage;
  };

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: message,
        variant: "user",
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);
    setError(undefined);

    try {
      // Get user context from session or use dev user that exists in database
      const userContext = session?.user
        ? {
          userId: (session.user as any).id || "dev-user-mock-id",
          email: session.user.email || "dev@example.com",
          name: session.user.name || "Development User",
        }
        : {
          userId: "dev-user-mock-id",
          email: "dev@example.com",
          name: "Development User",
        };

      const response = await invokeBedrockAgent(
        message,
        chatSessionId,
        userContext
      );

      if (response.sessionId && !chatSessionId) {
        setChatSessionId(response.sessionId);
      }

      addBotMessage(response.message);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      addBotMessage(
        `Sorry, I encountered an error: ${errorMessage}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
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
          className={`relative py-12 md:py-32 px-4 transition-all duration-1000 ${heroSection.isVisible
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

        {/* AI Chat Section */}
        <section className="relative px-4 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-6 md:p-8 rounded-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                Property AI Assistant
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Ask me anything about suburbs, property data, and investment insights
              </p>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    variant={msg.variant}
                    textContent={msg.content}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </ChatMessage>
                ))}

                {isLoading && (
                  <ChatMessage variant="bot">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-[#1D7874]"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-[#1D7874]"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-[#1D7874]"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </ChatMessage>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                    <p className="font-medium">Error: {error}</p>
                    <p className="mt-1 text-xs">
                      Make sure NEXT_PUBLIC_API_URL is configured in your .env
                      file
                    </p>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 pt-4">
                <ChatInput
                  onSend={handleSend}
                  placeholder="Ask about suburbs, property prices, rental yields..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          ref={featuresSection.ref}
          className={`relative py-12 md:py-24 px-4 transition-all duration-1000 ${featuresSection.isVisible ? "opacity-100" : "opacity-0"
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
                  className={`glass-card will-animate transition-all duration-700 ${visibleFeatures[index]
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
          className={`relative py-12 md:py-24 px-4 transition-all duration-1000 ${pricingSection.isVisible ? "opacity-100" : "opacity-0"
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
                  className={`will-animate transition-all duration-700 ${visiblePricing[index]
                    ? `animate-fade-in-${index === 0 ? "left" : "right"
                    } delay-${index * 100}`
                    : "opacity-0 translate-y-8"
                    }`}
                >
                  <div
                    className={`p-8 md:p-10 rounded-2xl transition-all duration-300 ${plan.highlighted
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
