"use client";

import { useState } from "react";

import { MAX_FILE_SIZE } from "@/constants";
import { getTotalSpaceUsed, updateData } from "@/lib/actions/fileActions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import Test1 from "./testComponents/test1.js";
import Test2 from "./testComponents/test2.js";
import Test3 from "./testComponents/test3.js";
import { formatDataForBackend } from "@/lib/utils.js";

export default function TestPage({ user, fileData }) {
  const path = usePathname();
  const { toast } = useToast();

  const [imageResult, setImageResult] = useState(
    JSON.parse(fileData?.Result) || null
  );
  const [biopsyResult, setBiopsyResult] = useState(
    JSON.parse(fileData?.resultBiopsy) || null
  );
  const [medicalResult, setMedicalResult] = useState(
    JSON.parse(fileData?.resultMedical) || null
  );

  const medicalData = JSON.parse(fileData?.medicalData);

  const [currentTest, setCurrentTest] = useState(1);
  const [formData, setFormData] = useState({
    country: medicalData?.country || "",
    gender: medicalData?.gender || "",
    tobaccoUse: medicalData?.tobaccoUse || "",
    alcoholUse: medicalData?.alcoholUse || "",
    hpvInfection: medicalData?.hpvInfection || "",
    betelQuidUse: medicalData?.betelQuidUse || "",
    chronicSunExposure: medicalData?.chronicSunExposure || "",
    poorOralHygiene: medicalData?.poorOralHygiene || "",
    dietIntake: medicalData?.dietIntake || "", // e.g., "Low", "Moderate", "High"
    familyHistory: medicalData?.familyHistory || "",
    compromisedImmuneSystem: medicalData?.compromisedImmuneSystem || "",
    oralLesions: medicalData?.oralLesions || "",
    unexplainedBleeding: medicalData?.unexplainedBleeding || "",
    difficultySwallowing: medicalData?.difficultySwallowing || "",
    whitePatches: medicalData?.whitePatches || "",
    treatmentType: medicalData?.treatmentType || "",
    earlyDiagnosis: medicalData?.earlyDiagnosis || "",
    age: medicalData?.age || 0,
    tumorSize: medicalData?.tumorSize || 0,
    survivalRate: medicalData?.survivalRate || 0,
    cancerStage: medicalData?.cancerStage || 0,
    treatmentCost: medicalData?.treatmentCost || 0,
    economicBurden: medicalData?.economicBurden || 0,
  });

  const [files, setFiles] = useState([]);

  const handleBack = () => {
    setCurrentTest((prev) => Math.max(1, prev - 1));
  };

  const handleMouthUpload = async (medicalData = null) => {
    console.log("This medical Data", medicalData);
    if (!medicalData && files?.length === 0) {
      return toast({
        description: "No file selected.",
        className: "error-toast",
      });
    }

    const file = files[0]; // single file

    const totalSpace = await getTotalSpaceUsed();
    const usedSpace = (await totalSpace?.used) || 0;
    const availableSpace = (await totalSpace?.all) || 0;

    if (!medicalData && file.size > MAX_FILE_SIZE) {
      return toast({
        description: (
          <p className="body-2 text-white">
            <span className="font-semibold">{file.name}</span> is too large. Max
            file size is 50MB.
          </p>
        ),
        className: "error-toast",
      });
    }

    if (usedSpace >= availableSpace) {
      return toast({
        description: (
          <p className="body-2 text-white">
            Storage limit reached. Please delete some files to upload new ones.
          </p>
        ),
        className: "error-toast",
      });
    }

    const formData = new FormData();
    formData.append("file", file);
    let response;
    let data;

    try {
      // 🔥 Predict or skip directly to upload
      if (currentTest === 1) {
        response = await fetch("http://localhost:5000/predict/mouth-image", {
          method: "POST",
          body: formData,
        });
        data = await response.json();
        // Update
        const res = await updateData({
          fileId: fileData.$id,
          file,
          step: currentTest,
          path,
          Result: JSON.stringify(data), // replace with real prediction
        });
        setImageResult(data);
      } else if (currentTest === 2) {
        response = await fetch("http://localhost:5000/predict/biopsy-image", {
          method: "POST",
          body: formData,
        });
        data = await response.json();
        // Update
        const res = await updateData({
          fileId: fileData.$id,
          file,
          step: currentTest,
          path,
          Result: JSON.stringify(data), // replace with real prediction
        });
        setBiopsyResult(data);
      } else if (currentTest === 3) {
        const backendData = formatDataForBackend(medicalData);

        console.log("This is backend data", backendData);

        const response = await fetch("http://localhost:5000/predict/csv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(backendData),
        });

        data = await response.json();

        console.log("This is data", data);

        // Update
        const res = await updateData({
          fileId: fileData.$id,
          file,
          step: currentTest,
          path,
          Result: JSON.stringify(data), // replace with real prediction
          medicalData: JSON.stringify(medicalData),
        });

        setMedicalResult(data);
      }

      toast({
        description: "Test Completed Successfully.",
        className: "success-toast",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        description: "Upload failed. Try again.",
        className: "error-toast",
      });
    }
  };

  const handleNext = () => {
    setCurrentTest((prev) => Math.min(3, prev + 1));
  };

  const renderTestContent = () => {
    const progressWidth = `${((currentTest - 1) / 3) * 100}%`;
    const steps = [
      { number: 1, label: "Mouth Image" },
      { number: 2, label: "Biopsy Analysis" },
      { number: 3, label: "Medical Info" },
    ];

    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Mouth Cancer Detection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete the following steps for your analysis
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12 px-4 sm:px-0">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out"
                  style={{ width: progressWidth }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between z-10">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all duration-300 ${
                        currentTest >= step.number
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-black shadow-lg shadow-blue-200 transform scale-110"
                          : "bg-white text-gray-400 border-2 border-gray-300"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        currentTest === step.number
                          ? "text-blue-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {steps[currentTest - 1]?.label || "Mouth Image"}
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Step {currentTest} of {steps.length}
                </span>
              </div>

              {/* Test Content */}
              <div className="transition-opacity duration-300">
                <Test1
                  currentFile={fileData}
                  currentTest={currentTest}
                  files={files}
                  setFiles={setFiles}
                  handleMouthUpload={handleMouthUpload}
                  imageResult={imageResult}
                  handleNext={handleNext}
                />
                <Test2
                  currentFile={fileData}
                  currentTest={currentTest}
                  files={files}
                  setFiles={setFiles}
                  handleMouthUpload={handleMouthUpload}
                  handleBack={handleBack}
                  biopsyResult={biopsyResult}
                  handleNext={handleNext}
                />
                <Test3
                  currentTest={currentTest}
                  formData={formData}
                  setFormData={setFormData}
                  handleBack={handleBack}
                  handleMouthUpload={handleMouthUpload}
                  medicalResult={medicalResult}
                />
              </div>
            </div>

            {/* Progress Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: progressWidth }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm font-medium text-gray-600">
                  {Math.round(((currentTest - 1) / steps.length) * 100)}%
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return renderTestContent();
}
