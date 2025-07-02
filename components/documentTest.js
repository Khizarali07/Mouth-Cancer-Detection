"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { MAX_FILE_SIZE } from "@/constants";
import { getTotalSpaceUsed, updateData } from "@/lib/actions/fileActions";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TestPage({ user, fileData }) {
  const path = usePathname();
  const { toast } = useToast();

  console.log("this is user from document");
  console.log(user);
  console.log("this is file data from document");
  console.log(fileData);
  const [imageResult, setImageResult] = useState(
    JSON.parse(fileData?.Result) || null
  );
  const [biopsyResult, setBiopsyResult] = useState(
    JSON.parse(fileData?.resultBiopsy) || null
  );
  const [medicalResult, setMedicalResult] = useState(
    JSON.parse(fileData?.resultMedical) || null
  );

  const [currentTest, setCurrentTest] = useState(1);
  const [formData, setFormData] = useState({
    country: "",
    gender: "",
    tobaccoUse: "",
    alcoholUse: "",
    symptoms: "",
    duration: "",
  });
  const [files, setFiles] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    setCurrentTest((prev) => Math.max(1, prev - 1));
  };

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

      console.log("this is a data :", fileData.$id);

      // Update
      const res = await updateData({
        fileId: fileData.$id,
        file,
        step: currentTest,
        ownerId: user?.$id,
        accountId: user?.accountId,
        path,
        Result: JSON.stringify(data), // replace with real prediction
      });
      setImageResult(JSON.parse(res.Result));

      console.log("This is the response :", res);

      toast({
        description: "Upload Successfully.",
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
    const progressWidth = `${(currentTest / 3) * 100}%`;

    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
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
                      {Math.round((currentTest / 3) * 100)}%
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
                            Selected:{" "}
                            <span className="font-medium">{files[0].name}</span>
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
                        <p>
                          Confidence:{" "}
                          {(imageResult.confidence * 100).toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="w-full mt-auto mb-auto sm:w-auto"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="uploader-button w-full sm:w-auto"
                      >
                        <Image
                          src="/assets/icons/upload.svg"
                          alt="upload"
                          width={24}
                          height={24}
                          className="mr-2"
                        />
                        Upload Biopsy Image
                      </Button>
                      <Button
                        onClick={handleNext}
                        variant="outline"
                        className="w-full mt-auto mb-auto sm:w-auto"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {currentTest === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-brand-800 mb-4">
                      Medical Information
                    </h2>
                    <div className="bg-light-300/20 rounded-xl p-8">
                      <p className="text-lg text-gray-700 mb-4">
                        Please fill out your medical information to help with
                        the analysis.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categorical Information */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Categorical Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <Select
                                value={formData.country}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    country: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pakistan">
                                    Pakistan
                                  </SelectItem>
                                  <SelectItem value="india">India</SelectItem>
                                  <SelectItem value="bangladesh">
                                    Bangladesh
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Select
                                value={formData.gender}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    gender: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
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
                              <RadioGroup
                                value={formData.tobaccoUse}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    tobaccoUse: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="tobacco-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="tobacco-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="alcohol">
                                Alcohol Consumption
                              </Label>
                              <RadioGroup
                                value={formData.alcoholUse}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    alcoholUse: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="alcohol-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="alcohol-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="hpv">HPV Infection</Label>
                              <RadioGroup
                                value={formData.hpvInfection}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    hpvInfection: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="yes" id="hpv-yes" />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="hpv-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="betel">Betel Quid Use</Label>
                              <RadioGroup
                                value={formData.betelQuidUse}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    betelQuidUse: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="betel-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="betel-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="sun">Chronic Sun Exposure</Label>
                              <RadioGroup
                                value={formData.chronicSunExposure}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    chronicSunExposure: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="yes" id="sun-yes" />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="sun-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="hygiene">Poor Oral Hygiene</Label>
                              <RadioGroup
                                value={formData.poorOralHygiene}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    poorOralHygiene: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="hygiene-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="hygiene-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="diet">
                                Diet (Fruits & Vegetables Intake)
                              </Label>
                              <RadioGroup
                                value={formData.dietIntake}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    dietIntake: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="yes" id="diet-yes" />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="diet-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="family">
                                Family History of Cancer
                              </Label>
                              <RadioGroup
                                value={formData.familyHistory}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    familyHistory: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="family-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="family-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="immune">
                                Compromised Immune System
                              </Label>
                              <RadioGroup
                                value={formData.compromisedImmuneSystem}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    compromisedImmuneSystem: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="immune-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="immune-no" />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="lesions">Oral Lesions</Label>
                              <RadioGroup
                                value={formData.oralLesions}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    oralLesions: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="lesions-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="lesions-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="bleeding">
                                Unexplained Bleeding
                              </Label>
                              <RadioGroup
                                value={formData.unexplainedBleeding}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    unexplainedBleeding: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="bleeding-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="bleeding-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="swallowing">
                                Difficulty Swallowing
                              </Label>
                              <RadioGroup
                                value={formData.difficultySwallowing}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    difficultySwallowing: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="swallowing-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="swallowing-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="patches">
                                White or Red Patches in Mouth
                              </Label>
                              <RadioGroup
                                value={formData.whitePatches}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    whitePatches: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="patches-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="patches-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div>
                              <Label htmlFor="treatment">Treatment Type</Label>
                              <Select
                                value={formData.treatmentType}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    treatmentType: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select treatment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="surgery">
                                    Surgery
                                  </SelectItem>
                                  <SelectItem value="radiation">
                                    Radiation Therapy
                                  </SelectItem>
                                  <SelectItem value="chemo">
                                    Chemotherapy
                                  </SelectItem>
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
                              <RadioGroup
                                value={formData.earlyDiagnosis}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    earlyDiagnosis: value,
                                  }))
                                }
                              >
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="diagnosis-yes"
                                    />
                                    <span>Yes</span>
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="diagnosis-no"
                                    />
                                    <span>No</span>
                                  </label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>

                        {/* Numerical Information */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Numerical Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="age">Age</Label>
                              <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter age"
                              />
                            </div>

                            <div>
                              <Label htmlFor="tumorSize">Tumor Size (cm)</Label>
                              <input
                                type="number"
                                id="tumorSize"
                                name="tumorSize"
                                value={formData.tumorSize}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter tumor size"
                              />
                            </div>

                            <div>
                              <Label htmlFor="survivalRate">
                                Survival Rate (5-Year, %)
                              </Label>
                              <input
                                type="number"
                                id="survivalRate"
                                name="survivalRate"
                                value={formData.survivalRate}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter survival rate"
                              />
                            </div>

                            <div>
                              <Label htmlFor="cancerStage">Cancer Stage</Label>
                              <input
                                type="number"
                                id="cancerStage"
                                name="cancerStage"
                                value={formData.cancerStage}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter cancer stage"
                              />
                            </div>

                            <div>
                              <Label htmlFor="treatmentCost">
                                Cost of Treatment (USD)
                              </Label>
                              <input
                                type="number"
                                id="treatmentCost"
                                name="treatmentCost"
                                value={formData.treatmentCost}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter treatment cost"
                              />
                            </div>

                            <div>
                              <Label htmlFor="economicBurden">
                                Economic Burden (Lost Workdays per Year)
                              </Label>
                              <input
                                type="number"
                                id="economicBurden"
                                name="economicBurden"
                                value={formData.economicBurden}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                placeholder="Enter workdays lost"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                      <Button
                        onClick={handleBack}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          // Submit form data
                          console.log("Form submitted:", formData);
                        }}
                        className="bg-brand text-white hover:bg-brand-500 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Complete Test
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-lg font-semibold">
                Step {currentTest} of 3
              </span>
            </div>
            <div className="w-48 h-1 bg-light-300 rounded-full">
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

  return <div className="container mx-auto py-12">{renderTestContent()}</div>;
}
