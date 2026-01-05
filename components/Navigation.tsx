"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav
      id="nav"
      className="glass fixed top-0 left-0 right-0 z-50 border-b border-gray-200/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold text-[#1D7874] transition-transform duration-300 group-hover:scale-105">
              PropertyAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
            >
              About
            </Link>
            <Link
              href="/map"
              className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
            >
              Map
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/comparison"
              className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
            >
              Suburb comparison
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/questions"
                  className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
                >
                  Analyze
                </Link>
                <Link
                  href="/chat"
                  className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
                >
                  AI Chat
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center space-x-4 border-l border-gray-200/50 pl-8">
                  <span className="text-sm text-gray-600">
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="glass-btn text-[#1D7874] hover:text-[#071E22] px-4 py-2 text-sm font-semibold transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-[#1D7874] transition-colors duration-300 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="glass-btn text-[#1D7874] hover:text-[#071E22] px-4 py-2 font-semibold transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#3980f6] rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in-down">
            <Link
              href="/about"
              className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              Pricing
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  href="/questions"
                  className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  Analyze
                </Link>
                <Link
                  href="/chat"
                  className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  AI Chat
                </Link>
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full glass-btn text-[#1D7874] hover:text-[#071E22] px-4 py-2 rounded-lg font-semibold transition-all duration-300 mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-[#1D7874] py-2 px-2 rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="glass-btn block text-[#1D7874] hover:text-[#071E22] px-4 py-2 rounded-lg text-center font-semibold transition-all duration-300 mt-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
