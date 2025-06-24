"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TestPage() {
  const [currentTest, setCurrentTest] = useState(1);
  const [testResults, setTestResults] = useState({
    test1: null,
    test2: null,
    test3: null,
  });
  const [uploadedImages, setUploadedImages] = useState({
    test1: null,
    test2: null,
  });

  const handleBack = () => {
    if (currentTest > 1) {
      setCurrentTest(currentTest - 1);
    }
  };

  const handleImageUpload = (testNumber, file) => {
    setUploadedImages((prev) => ({
      ...prev,
      [`test${testNumber}`]: file,
    }));
  };

  const handleImageChange = (testNumber) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(testNumber, e.target.files[0]);
      }
    };
    input.click();
  };

  const handleTestComplete = async (testNumber) => {
    try {
      // Simulate test completion with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update test results
      const newResults = { ...testResults };
      newResults[`test${testNumber}`] = true;
      setTestResults(newResults);

      // Move to next test
      if (testNumber < 3) {
        setCurrentTest(testNumber + 1);
      }
    } catch (error) {
      console.error("Test failed:", error);
    }
  };

  const isComplete = Object.values(testResults).every((result) => result);

  const renderTestContent = () => {
    // Calculate progress width
    const progressWidth = `${(currentTest / 3) * 100}%`;

    return (
      <div className="space-y-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Step {currentTest} of 3
            </span>
            <div className="w-48 h-1 bg-light-300 rounded-full">
              <div
                className="h-1 bg-brand rounded-full"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>

        {/* Test Content */}
        <div className="space-y-8">
          {currentTest === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-800 mb-4">
                Test 1: Mouth Image Test
              </h2>
              <div className="p-6 bg-light-300/20 rounded-xl">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please upload a clear image of your mouth for initial
                  assessment. Ensure the image:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Shows your entire mouth clearly</li>
                  <li>Is well-lit and in focus</li>
                  <li>Has no obstructions or shadows</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={() => handleImageChange(1)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Change Image
                </Button>
                <Button
                  onClick={() => handleTestComplete(1)}
                  className="bg-brand hover:bg-brand-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Image
                    src="/assets/icons/upload.svg"
                    alt="upload"
                    width={24}
                    height={24}
                  />
                  Upload Mouth Image
                </Button>
              </div>
            </div>
          )}

          {currentTest === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-800 mb-4">
                Test 2: Biopsy Image Test
              </h2>
              <div className="p-6 bg-light-300/20 rounded-xl">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please upload a biopsy image for analysis. This image should:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Show the biopsy sample clearly</li>
                  <li>Be taken under a microscope</li>
                  <li>Include a scale reference</li>
                </ul>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Back
                </Button>
                <Button
                  onClick={() => handleImageChange(2)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Change Image
                </Button>
                <Button
                  onClick={() => handleTestComplete(2)}
                  className="bg-brand hover:bg-brand-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <Image
                    src="/assets/icons/upload.svg"
                    alt="upload"
                    width={24}
                    height={24}
                  />
                  Upload Biopsy Image
                </Button>
              </div>
            </div>
          )}

          {currentTest === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-brand-800 mb-4">
                Test 3: Medical Data Entry
              </h2>
              <div className="p-6 bg-light-300/20 rounded-xl mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Please fill out your medical information to help with the
                  analysis.
                </p>
              </div>

              {/* Categorical Data */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Categorical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="bangladesh">Bangladesh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tobacco">Tobacco Use</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="hpv">HPV Infection</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="betel">Betel Quid Use</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="sun">Chronic Sun Exposure</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="hygiene">Poor Oral Hygiene</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="diet">
                      Diet (Fruits & Vegetables Intake)
                    </Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="family">Family History of Cancer</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="immune">Compromised Immune System</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="lesions">Oral Lesions</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="bleeding">Unexplained Bleeding</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="swallowing">Difficulty Swallowing</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="patches">
                      White or Red Patches in Mouth
                    </Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="treatment">Treatment Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="radiation">
                          Radiation Therapy
                        </SelectItem>
                        <SelectItem value="chemo">Chemotherapy</SelectItem>
                        <SelectItem value="targeted">
                          Targeted Therapy
                        </SelectItem>
                        <SelectItem value="immunotherapy">
                          Immunotherapy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="diagnosis">Early Diagnosis</Label>
                    <RadioGroup>
                      <div className="flex items-center space-x-4">
                        <div>
                          <RadioGroupItem value="yes" />
                          <span className="ml-2">Yes</span>
                        </div>
                        <div>
                          <RadioGroupItem value="no" />
                          <span className="ml-2">No</span>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Numerical Data */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Numerical Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input type="number" placeholder="Enter age" />
                  </div>

                  <div>
                    <Label htmlFor="tumorSize">Tumor Size (cm)</Label>
                    <Input type="number" placeholder="Enter tumor size" />
                  </div>

                  <div>
                    <Label htmlFor="survivalRate">
                      Survival Rate (5-Year, %)
                    </Label>
                    <Input type="number" placeholder="Enter survival rate" />
                  </div>

                  <div>
                    <Label htmlFor="cancerStage">Cancer Stage</Label>
                    <Input type="number" placeholder="Enter cancer stage" />
                  </div>

                  <div>
                    <Label htmlFor="cost">Cost of Treatment (USD)</Label>
                    <Input type="number" placeholder="Enter treatment cost" />
                  </div>

                  <div>
                    <Label htmlFor="burden">
                      Economic Burden (Lost Workdays per Year)
                    </Label>
                    <Input type="number" placeholder="Enter workdays lost" />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Back
                </Button>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => handleTestComplete(3)}
                  className="bg-brand hover:bg-brand-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Medical Data
                </Button>
              </div>
            </div>
          )}

          {currentTest > 3 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-brand-800 mb-4">
                Screening Complete!
              </h2>
              <div className="p-6 bg-light-300/20 rounded-xl mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for completing the screening process. Your results
                  are being analyzed. You will receive a detailed report
                  shortly.
                </p>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/dashboard"
                  className="bg-brand text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <div className="container mx-auto py-12">{renderTestContent()}</div>;
}

const renderProgressBar = () => {
  const progress = (currentTest / 3) * 100;
  return (
    <div className="w-full bg-light-300 rounded-full h-2.5">
      <div
        className="bg-brand h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
