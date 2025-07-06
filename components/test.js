"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { MAX_FILE_SIZE } from "@/constants";
import { getTotalSpaceUsed, uploadFile } from "@/lib/actions/fileActions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Test1 from "./testComponents/test1";

export default function TestPage({ user }) {
  const path = usePathname();
  const { toast } = useToast();
  const router = useRouter();

  const [currentTest, setCurrentTest] = useState(1);

  const [files, setFiles] = useState([]);

  const handleMouthUpload = async () => {
    if (files?.length === 0) {
      return toast({
        description: "No file selected.",
        className: "error-toast",
      });
    }

    const file = files[0]; // single file

    const totalSpace = await getTotalSpaceUsed();
    const usedSpace = (await totalSpace?.used) || 0;
    const availableSpace = (await totalSpace?.all) || 0;

    if (file.size > MAX_FILE_SIZE) {
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

    try {
      // 🔥 Predict or skip directly to upload
      const response = await fetch(
        "http://localhost:5000/predict/mouth-image",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      // Upload
      const newFile = await uploadFile({
        file,
        name: `Test #${user.files.length + 1}`,
        ownerId: user?.$id,
        accountId: user?.accountId,
        path,
        Result: JSON.stringify(data), // replace with real prediction
      });

      console.log("this is NEW file : ", newFile);

      toast({
        description: "Upload Successfully.",
        className: "success-toast",
      });
      router.push(`/dashboard/documents/${newFile.$id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        description: "Upload failed. Try again.",
        className: "error-toast",
      });
    }
  };

  const renderTestContent = () => {
    const progressWidth = `${((currentTest - 1) / 3) * 100}%`;
    const steps = [
      { number: 1, label: "Upload Image" },
      { number: 2, label: "Biopsy Analysis" },
      { number: 3, label: "Medical Analysis" },
    ];

    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Mouth Cancer Detection
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload an image of the affected area to begin your analysis
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 sm:mb-12 px-2 sm:px-4">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-in-out"
                  style={{ width: progressWidth }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between z-10 w-full">
                {steps.map((step, index) => (
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {steps[currentTest - 1]?.label || "Upload Image"}
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Step {currentTest} of {steps.length}
                </span>
              </div>

              {/* Test Content */}
              <div className="transition-opacity duration-300">
                <Test1
                  currentTest={currentTest}
                  files={files}
                  setFiles={setFiles}
                  handleMouthUpload={handleMouthUpload}
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
