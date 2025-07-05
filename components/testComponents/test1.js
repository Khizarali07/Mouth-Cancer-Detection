"use client";
import { Button } from "../ui/button";
import Image from "next/image";

import { useState } from "react";

export default function Test1({
  currentFile = null,
  currentTest,
  files,
  setFiles,
  handleMouthUpload,
  imageResult = null,
  handleNext = null,
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUploadAndAnalyze = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    try {
      await handleMouthUpload();
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const getPredictionColor = (prediction) => {
    if (!prediction) return "bg-gray-100";
    return prediction.toLowerCase() === "normal"
      ? "bg-green-50 text-green-700 border border-green-100"
      : "bg-amber-50 text-amber-700 border border-amber-100";
  };

  if (currentTest !== 1) return null;

  console.log("This is currentFile", currentFile);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Mouth Cancer Detection
        </h1>
        <p className="text-gray-600 text-lg">
          Upload a clear image of your mouth for our AI-powered analysis
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Image Preview Section */}
              {currentFile?.url && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900">
                      Your Mouth Image
                    </h3>
                    <p className="text-xs text-gray-500">
                      Uploaded for analysis
                    </p>
                  </div>
                  <div className="p-4 flex justify-center bg-gray-50">
                    <div className="relative w-full max-w-md h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={currentFile.url}
                        alt="Uploaded mouth image for analysis"
                        fill
                        className="object-contain bg-white"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                      {isAnalyzing
                        ? "Analyzing image..."
                        : "This image has been analyzed by our AI system"}
                    </p>
                    {isAnalyzing && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  files.length > 0
                    ? "border-green-400 bg-green-50"
                    : currentFile?.url
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50"
                }`}
                onClick={() => document.getElementById("mouth-upload").click()}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500"
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
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {currentFile?.url
                        ? "Update Mouth Image"
                        : files.length > 0
                        ? "Image Selected"
                        : "Upload Mouth Image"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {currentFile?.url
                        ? "Replace the current image with a new one"
                        : files.length > 0
                        ? files[0].name
                        : "Click to browse or drag & drop your image here"}
                    </p>
                  </div>
                  <input
                    id="mouth-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant={files.length > 0 ? "outline" : "default"}
                    className="gap-2"
                    onClick={(e) => e.stopPropagation()}
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
                    {imageResult ? "Change File" : "Select File"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Supports JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleUploadAndAnalyze}
                disabled={files.length === 0 || isAnalyzing}
                className={`w-full mt-6 py-6 text-base font-medium transition-colors ${
                  files.length === 0 || isAnalyzing
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-black"
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                ) : imageResult ? (
                  "Update & Analyze Image"
                ) : (
                  "Upload & Analyze Image"
                )}
              </Button>

              {/* Analysis In Progress */}
              {isAnalyzing && !imageResult && (
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
                        Analyzing Your Image
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Our AI is carefully examining your mouth image. This may
                        take a few moments...
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-blue-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full animate-pulse"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {imageResult && (
                <div
                  className={`mt-8 p-5 rounded-lg ${getPredictionColor(
                    imageResult.prediction
                  )}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {imageResult.prediction.toLowerCase() === "normal" ? (
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
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Analysis Result:{" "}
                        <span className="capitalize">
                          {imageResult.prediction}
                        </span>
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                        <div
                          className={`h-2.5 rounded-full ${
                            imageResult.prediction.toLowerCase() === "normal"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${(imageResult.confidence * 100).toFixed(
                              0
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm mb-4">
                        Confidence:{" "}
                        <span className="font-medium">
                          {(imageResult.confidence * 100).toFixed(2)}%
                        </span>
                      </p>
                      <p className="text-sm">
                        {imageResult.prediction.toLowerCase() === "non cancer"
                          ? "No concerning signs detected. However, regular dental check-ups are recommended."
                          : "Potential concerns detected. Please consult with a healthcare professional for further evaluation."}
                      </p>
                      {handleNext && (
                        <Button
                          onClick={handleNext}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-black"
                        >
                          Continue to Next Step →
                        </Button>
                      )}
                    </div>
                  </div>
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
                Taking a Good Photo
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Use good, even lighting (natural light is best)
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Open your mouth wide to show all areas clearly
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Keep the camera steady and ensure the image is in focus
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Avoid shadows on your face and mouth area
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2">
                    •
                  </div>
                  <span className="text-sm text-gray-700">
                    Use the back camera for higher quality photos
                  </span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">
                  About Oral Cancer
                </h4>
                <p className="text-xs text-blue-700">
                  Oral cancer can affect any part of the mouth, including the
                  lips, tongue, cheeks, and throat. Early detection is crucial
                  for successful treatment. This tool is not a substitute for
                  professional medical advice, diagnosis, or treatment.
                </p>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-2">
                  When to See a Doctor
                </h4>
                <p className="text-xs text-amber-700">
                  Consult a healthcare professional if you notice any persistent
                  mouth sores, lumps, white or red patches, or experience
                  difficulty chewing or swallowing that lasts more than two
                  weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
