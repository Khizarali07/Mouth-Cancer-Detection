"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useRouter } from "next/navigation";

import { MAX_FILE_SIZE } from "@/constants";
import { getTotalSpaceUsed, uploadFile } from "@/lib/actions/fileActions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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

      console.log("this is a data :", data);

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

    return (
      <div className="w-full flex flex-col md:items-start md:justify-center">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="-space-y-6">
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
                          <li>
                            Ensure the image shows your entire mouth clearly
                          </li>
                          <li>Make sure the image is well-lit and in focus</li>
                          <li>Avoid any obstructions or shadows</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                      {/* Upload Section */}
                      <div className="flex flex-col md:flex-row justify-center items-start gap-3 w-full sm:w-auto">
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
                          className="w-auto  flex items-center justify-center gap-2 border border-blue text-blue hover:bg-blue hover:text-white transition"
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
                            Selected:{" "}
                            <span className="font-medium">{files[0].name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
