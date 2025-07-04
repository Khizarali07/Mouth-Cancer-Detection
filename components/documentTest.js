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
    country: medicalData.country || "",
    gender: medicalData.gender || "",
    tobaccoUse: medicalData.tobaccoUse || "",
    alcoholUse: medicalData.alcoholUse || "",
    hpvInfection: medicalData.hpvInfection || "",
    betelQuidUse: medicalData.betelQuidUse || "",
    chronicSunExposure: medicalData.chronicSunExposure || "",
    poorOralHygiene: medicalData.poorOralHygiene || "",
    dietIntake: medicalData.dietIntake || "", // e.g., "Low", "Moderate", "High"
    familyHistory: medicalData.familyHistory || "",
    compromisedImmuneSystem: medicalData.compromisedImmuneSystem || "",
    oralLesions: medicalData.oralLesions || "",
    unexplainedBleeding: medicalData.unexplainedBleeding || "",
    difficultySwallowing: medicalData.difficultySwallowing || "",
    whitePatches: medicalData.whitePatches || "",
    treatmentType: medicalData.treatmentType || "",
    earlyDiagnosis: medicalData.earlyDiagnosis || "",
    age: medicalData.age || 0,
    tumorSize: medicalData.tumorSize || 0,
    survivalRate: medicalData.survivalRate || 0,
    cancerStage: medicalData.cancerStage || 0,
    treatmentCost: medicalData.treatmentCost || 0,
    economicBurden: medicalData.economicBurden || 0,
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

        const response = await fetch("http://localhost:5000/predict/csv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(backendData),
        });

        data = await response.json();

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

    return (
      <div className="w-full flex flex-col md:items-start md:justify-center">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              {/* Progress Bar */}

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-600">
                    Step {currentTest} of 3
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-48 h-1 bg-gray-200 rounded-full">
                      <div
                        className="h-1 bg-brand rounded-full transition-all duration-300"
                        style={{ width: progressWidth }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(((currentTest - 1) / 3) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Content */}
              <div className="space-y-8">
                <Test1
                  currentTest={currentTest}
                  files={files}
                  setFiles={setFiles}
                  handleMouthUpload={handleMouthUpload}
                  imageResult={imageResult}
                  handleNext={handleNext}
                />
                <Test2
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
              <span className="text-lg font-semibold">
                Step {currentTest} of 3
              </span>
            </div>
            <div className="w-48 h-1 bg-slate-400 rounded-full">
              <div
                className="h-1 bg-brand rounded-full"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div className="container py-12">{renderTestContent()}</div>;
}
