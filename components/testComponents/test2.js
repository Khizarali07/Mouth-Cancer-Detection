"use client";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Test2({
  currentTest,
  files,
  setFiles,
  handleMouthUpload,
  handleBack,
  biopsyResult,
  handleNext,
}) {
  return (
    <div>
      {currentTest === 2 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-brand-800 mb-4">
            Biopsy Image Test
          </h2>
          <div className="bg-light-300/20 rounded-xl p-8">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Please upload a biopsy image for analysis.
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Ensure the biopsy sample is clearly visible</li>
                <li>Use a microscope for the image</li>
                <li>Include a scale reference</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Upload Section */}
            <Button
              onClick={handleBack}
              // variant="outline"
              className="bg-brand text-white w-full sm:w-auto mt-4 sm:mt-0"
            >
              Back
            </Button>
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 w-full sm:w-auto">
              {/* File Input */}
              <input
                id="mouth-upload"
                type="file"
                accept="image/*"
                className=""
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
              />

              {/* Upload Button */}
              <Button
                onClick={handleMouthUpload}
                className="w-full sm:w-auto gap-2 border border-blue text-blue hover:bg-blue hover:text-white transition"
              >
                <Image
                  src="/assets/icons/upload.svg"
                  alt="upload"
                  width={20}
                  height={20}
                />
                Upload Biopsy Image
              </Button>

              {/* File Preview */}
              {files.length > 0 && (
                <p className="text-sm text-gray-500 text-center truncate max-w-xs">
                  Selected: <span className="font-medium">{files[0].name}</span>
                </p>
              )}
            </div>

            {/* Next Button */}
            {biopsyResult && (
              <Button
                onClick={handleNext}
                // variant="outline"
                className="bg-brand text-white w-full sm:w-auto mt-4 sm:mt-0"
              >
                Next
              </Button>
            )}
          </div>
          {biopsyResult && (
            <div>
              <p>Prediction: {biopsyResult.prediction}</p>
              {/* <p>
                          Confidence:{" "}
                          {(biopsyResult.confidence * 100).toFixed(2)}%
                        </p> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
