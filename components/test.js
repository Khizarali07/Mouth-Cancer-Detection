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
        `${process.env.NEXT_PUBLIC_API_URL}/predict/mouth-image`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.error) {
        toast({
          description: data.error,
          className: "error-toast",
        });
        return;
      }

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
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full px-0 sm:px-2">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 px-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Mouth Cancer Detection
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Upload an image of the affected area to begin your analysis
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 sm:mb-10 px-1 sm:px-2">
            <div className="relative">
              {/* Steps */}
              <div className="relative flex justify-between z-10 w-full">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center flex-1 max-w-[33.333%] px-1 relative"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mb-1 sm:mb-2 transition-all duration-300 ${
                        currentTest > step.number
                          ? "bg-green-500 text-white"
                          : currentTest === step.number
                          ? "bg-gradient-to-br from-blue to-indigo-600 text-white shadow-md shadow-blue-200 transform scale-110"
                          : "bg-white text-gray-400 border-2 border-gray-200"
                      }`}
                    >
                      {currentTest > step.number ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-[10px] xs:text-xs text-center font-medium ${
                        currentTest >= step.number
                          ? "text-brand font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                    {currentTest > step.number && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-green-500 rounded-full"></div>
                    )}
                  </div>
                ))}
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500 ease-in-out"
                    style={{
                      width: `${
                        ((currentTest - 1) / (steps.length - 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl">
            <div className="sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-6 p-3 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {steps[currentTest - 1]?.label || "Upload Image"}
                </h2>
                <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
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
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0"></div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                  {Math.round(((currentTest - 1) / steps.length) * 100)}%
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Need help?{" "}
              <a
                href="#"
                className="text-brand hover:text-brand-100 font-medium transition-colors"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return renderTestContent();
}
