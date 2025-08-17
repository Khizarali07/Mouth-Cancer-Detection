"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState } from "react";

export default function Test2({
  currentFile,
  currentTest,
  files,
  setFiles,
  handleMouthUpload,
  handleBack,
  biopsyResult,
  handleNext,
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files?.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (files?.length === 0) return;

    setIsAnalyzing(true);
    try {
      await handleMouthUpload();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPredictionColor = (prediction) => {
    if (!prediction) return "bg-gray-100";
    return prediction.toLowerCase() === "normal"
      ? "bg-green-50 text-green-700 border border-green-100"
      : "bg-amber-50 text-amber-700 border border-amber-100";
  };

  if (currentTest !== 2) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Biopsy Image Analysis
        </h1>
        <p className="text-gray-600 text-base sm:text-lg px-4">
          Upload a clear biopsy image for our AI-powered analysis
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* File Upload Section */}
              <div
                className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors cursor-pointer ${
                  files?.length > 0
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50"
                }`}
                onClick={() => document.getElementById("biopsy-upload").click()}
              >
                <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="px-2">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                      {files?.length > 0
                        ? "Image Selected"
                        : "Upload Biopsy Image"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 break-all">
                      {files?.length > 0
                        ? files[0].name
                        : "Click to browse or drag & drop your biopsy image"}
                    </p>
                  </div>
                  <input
                    id="biopsy-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant={files?.length > 0 ? "outline" : "default"}
                    className="gap-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("biopsy-upload").click();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    {files?.length > 0 ? "Change File" : "Select File"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Upload & Analyze Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleUploadAndAnalyze}
                  disabled={files?.length === 0 || isAnalyzing}
                  className={`w-full sm:flex-1 py-4 sm:py-6 text-sm sm:text-base font-medium transition-colors ${
                    files?.length === 0 || isAnalyzing
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-black"
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : (
                    "Analyze Biopsy Image"
                  )}
                </Button>
              </div>

              {/* Analysis In Progress */}
              {isAnalyzing && !biopsyResult && (
                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <div>
                      <h3 className="font-medium text-blue-800">
                        Analyzing Your Biopsy Image
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Our AI is carefully examining the biopsy sample. This
                        may take a few moments...
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {biopsyResult && (
                <div
                  className={`mt-8 p-5 rounded-lg ${getPredictionColor(
                    biopsyResult.prediction
                  )}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {biopsyResult?.prediction?.toLowerCase() === "normal" ? (
                        <svg
                          className="w-6 h-6 text-green-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-amber-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        Analysis Result:{" "}
                        <span className="capitalize">
                          {biopsyResult.prediction}
                        </span>
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div
                          className={`h-2.5 rounded-full ${
                            biopsyResult?.prediction?.toLowerCase() === "normal"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${(biopsyResult.confidence * 100).toFixed(
                              0
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm mb-4">
                        Confidence:{" "}
                        <span className="font-medium">
                          {(biopsyResult.confidence * 100).toFixed(2)}%
                        </span>
                      </p>
                      <p className="text-sm mb-4">
                        {biopsyResult?.prediction?.toLowerCase() === "normal"
                          ? "No concerning signs detected in the biopsy sample. However, regular check-ups are recommended."
                          : "Potential concerns detected in the biopsy sample. Please consult with a healthcare professional for further evaluation."}
                      </p>
                    </div>
                  </div>
                  {handleNext && (
                    <Button
                      onClick={handleNext}
                      className="mt-4 bg-brand-100 hover:bg-brand-200 text-black"
                    >
                      Continue to Next Step →
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="md:border-l md:pl-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Taking a Good Biopsy Image
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Use a microscope with proper lighting for clear images
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Ensure the biopsy sample is in focus and well-lit
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Include a scale reference if possible
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Capture multiple angles if the sample has different textures
                    or colors
                  </span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">
                  About Biopsy Analysis
                </h4>
                <p className="text-xs text-blue-700">
                  Our AI analyzes biopsy images for signs of abnormalities. This
                  tool is designed to assist healthcare professionals and is not
                  a replacement for professional medical diagnosis.
                </p>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-2">
                  Important Note
                </h4>
                <p className="text-xs text-amber-700">
                  This analysis is for informational purposes only. Always
                  consult with a qualified healthcare professional for medical
                  diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
