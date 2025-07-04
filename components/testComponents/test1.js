"use client";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Test1({
  currentTest,
  files,
  setFiles,
  handleMouthUpload,
  imageResult = null,
  handleNext = null,
}) {
  return (
    <div>
      {currentTest === 1 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-brand-800 mb-4">
            Mouth Image Test
          </h2>
          <div className="bg-light-300/20 rounded-xl p-8">
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Please upload a clear image of your mouth for initial
                assessment.
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Ensure the image shows your entire mouth clearly</li>
                <li>Make sure the image is well-lit and in focus</li>
                <li>Avoid any obstructions or shadows</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Upload Section */}
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
                Upload Mouth Image
              </Button>

              {/* File Preview */}
              {files.length > 0 && (
                <p className="text-sm text-gray-500 text-center truncate max-w-xs">
                  Selected: <span className="font-medium">{files[0].name}</span>
                </p>
              )}
            </div>

            {/* Next Button */}
            {imageResult && (
              <Button
                onClick={handleNext}
                // variant="outline"
                className="bg-brand text-white w-full sm:w-auto mt-4 sm:mt-0"
              >
                Next
              </Button>
            )}
          </div>
          {imageResult && (
            <div>
              <p>Prediction: {imageResult.prediction}</p>
              <p>Confidence: {(imageResult.confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
