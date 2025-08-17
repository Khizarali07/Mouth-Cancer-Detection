"use client";
import { useState } from "react";
import Link from "next/link";
import { FaSignInAlt, FaUserPlus, FaChevronRight } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import image from "@/app/favicon.ico";

function HomeScreen(currentUser) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200">
                  <Image
                    src={image}
                    alt="Mouth Vision Logo"
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                </div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-brand-100 to-brand-200 bg-clip-text text-transparent">
                  Mouth Cancer Detection
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            {!currentUser?.currentUser?.accountId && (
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    <FaSignInAlt className="inline mr-2 -mt-0.5" />
                    Login
                  </span>
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-brand-100 to-brand-200 hover:from-brand-200 hover:to-brand-100 shadow-md hover:shadow-lg transition-all duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    <FaUserPlus className="inline mr-2 -mt-0.5" />
                    Get Started
                  </span>
                  <FaChevronRight className="ml-1.5 text-xs opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            {!currentUser?.currentUser?.accountId && (
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">
                    {isMenuOpen ? "Close menu" : "Open menu"}
                  </span>
                  {isMenuOpen ? (
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMenu className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMenuOpen ? "max-h-48 py-4" : "max-h-0 py-0"
            }`}
          >
            <div className="pt-2 pb-2 space-y-2 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt className="inline mr-2 -mt-0.5" />
                Login
              </Link>
              <Link
                href="/sign-up"
                className="block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-brand-100 to-brand-200 hover:from-brand-200 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserPlus className="inline mr-2 -mt-0.5" />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 mb-6 border border-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
            AI-Powered Oral Cancer Detection
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            <span className="block mb-2">Early Detection for</span>
            <span className="block bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Better Oral Health
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
            Empowering you with advanced AI technology for early detection of
            oral health concerns, ensuring timely intervention and better health
            outcomes.
          </p>

          {currentUser?.currentUser?.accountId ? (
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                href="/dashboard"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 hover:from-teal-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Go to Dashboard
                <FaChevronRight className="ml-2 text-sm -mt-0.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link
                href="/sign-up"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-brand-100 via-blue-500 to-indigo-500 hover:from-teal-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Get Started Free
                <FaChevronRight className="ml-2 text-sm -mt-0.5 opacity-90" />
              </Link>
              <Link
                href="/login"
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl text-base font-medium text-gray-700 border border-gray-300 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
              >
                Login to Dashboard
              </Link>
            </div>
          )}

          <div className="mt-8 md:mt-12 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {[
              {
                title: "AI-Powered Analysis",
                description:
                  "Advanced Deep Learning algorithms for accurate oral lesion detection and classification",
                icon: "🔍",
              },
              {
                title: "Instant Results",
                description:
                  "Get preliminary screening results within seconds of image upload",
                icon: "⚡",
              },
              {
                title: "Expert Insights",
                description:
                  "Detailed reports with professional recommendations for next steps",
                icon: "📋",
              },
              {
                title: "Secure & Private",
                description:
                  "Your health data is encrypted and protected with enterprise-grade security",
                icon: "🔒",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
              >
                <div className="p-6">
                  <div className="text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 rounded-b-xl">
                  <div className="h-1 w-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
