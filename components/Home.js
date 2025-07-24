"use client";
import { useState } from "react";
import Link from "next/link";
import { FaSignInAlt, FaUserPlus, FaChevronRight } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import image from "@/app/favicon.ico";

function HomeScreen(currentUser) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log("this is current user :", currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-100">
      {/* Navigation */}
      <nav className="bg-light-500 backdrop-blur-sm border-b border-secondary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="p-1.5 rounded-lg">
                  <Image
                    src={image}
                    alt="Mouth Vision Logo"
                    width={36}
                    height={36}
                    className="rounded-md"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r text-brand bg-clip-text">
                  Mouth Cancer Detection
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            {!currentUser?.currentUser?.accountId && (
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-brand-700 hover:bg-brand-50 hover:text-brand-800 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    <FaSignInAlt className="inline mr-2 -mt-0.5" />
                    Login
                  </span>
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-brand bg-gradient-to-r from-brand-500 to-accent-100 hover:from-brand-600 hover:to-accent-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    <FaUserPlus className="inline mr-2 -mt-0.5" />
                    Get Started
                  </span>
                  <FaChevronRight className="ml-1.5 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            {!currentUser?.currentUser?.accountId && (
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2.5 rounded-lg text-brand-700 hover:bg-brand-50 focus:outline-none transition-all duration-200"
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
              isMenuOpen ? "max-h-40 py-4" : "max-h-0 py-0"
            }`}
          >
            <div className="pt-4 pb-2 space-y-2">
              <Link
                href="/login"
                className="block px-4 py-3 rounded-lg text-base font-medium text-brand-700 hover:bg-brand-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt className="inline mr-2 -mt-0.5" />
                Login
              </Link>
              <Link
                href="/sign-up"
                className="block px-4 py-3 rounded-lg text-base font-medium text-brand-700 bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 shadow-md hover:shadow-lg transition-all duration-200"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-teal-500 mr-2"></span>
            AI-Powered Oral Cancer Detection
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Early Detection for</span>
            <span className="block bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Better Oral Health
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 md:text-xl">
            Empowering you with advanced AI technology for early detection of
            oral health concerns, ensuring timely intervention and better health
            outcomes.
          </p>

          {currentUser?.currentUser?.accountId ? (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Go to Dashboard
                <FaChevronRight className="ml-2 text-sm -mt-0.5" />
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                Get Started Free
                <FaChevronRight className="ml-2 text-sm -mt-0.5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl text-base font-medium text-teal-700 hover:text-teal-800 hover:bg-teal-50 transition-colors duration-200 flex items-center justify-center"
              >
                Login to Dashboard
              </Link>
            </div>
          )}

          <div className="mt-12 relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"></button>
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
