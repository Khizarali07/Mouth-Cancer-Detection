import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function Test3({
  currentTest,
  formData,
  setFormData,
  handleBack,
  handleMouthUpload,
  medicalResult,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValid, setFormValid] = useState(false);

  const countries = [
    "Italy",
    "Japan",
    "UK",
    "Sri Lanka",
    "South Africa",
    "Taiwan",
    "USA",
    "Germany",
    "France",
    "Australia",
    "Brazil",
    "Pakistan",
    "Kenya",
    "Russia",
    "Nigeria",
    "Egypt",
    "India",
  ];

  // Check if all required fields are filled
  useEffect(() => {
    const requiredFields = [
      "country",
      "gender",
      "age",
      "tobaccoUse",
      "alcoholUse",
      "hpvInfection",
      "betelQuidUse",
      "chronicSunExposure",
      "poorOralHygiene",
      "dietIntake",
      "familyHistory",
      "compromisedImmuneSystem",
      "oralLesions",
      "unexplainedBleeding",
      "difficultySwallowing",
      "whitePatches",
      "treatmentType",
      "earlyDiagnosis",
      "tumorSize",
      "survivalRate",
      "cancerStage",
      "treatmentCost",
      "economicBurden",
    ];

    const isValid = requiredFields.every((field) => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== "";
    });

    setFormValid(isValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" ||
        name === "tumorSize" ||
        name === "survivalRate" ||
        name === "cancerStage" ||
        name === "treatmentCost" ||
        name === "economicBurden"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    setIsSubmitting(true);
    try {
      await handleMouthUpload(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentTest !== 3) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Medical Information
        </h1>
        <p className="text-gray-600 text-lg">
          Please provide your medical details to help with the analysis
        </p>
      </div>

      <Card className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="text-xl font-semibold">
            Medical History
          </CardTitle>
          <CardDescription>
            Your information helps us provide better analysis and
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <h3 className="text-xl font-semibold mb-4">
                  Categorical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country
                    </Label>
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
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-gray-700"
                    >
                      Gender
                    </Label>
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
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Tobacco Use
                    </Label>
                    <RadioGroup
                      value={formData.tobaccoUse}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          tobaccoUse: value,
                        }))
                      }
                    >
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="tobacco-yes" />
                          <Label
                            htmlFor="tobacco-yes"
                            className="cursor-pointer text-sm"
                          >
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="tobacco-no" />
                          <Label
                            htmlFor="tobacco-no"
                            className="cursor-pointer text-sm"
                          >
                            No
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
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
                          <RadioGroupItem value="yes" id="alcohol-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="alcohol-no" />
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
                          <RadioGroupItem value="yes" id="betel-yes" />
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
                          <RadioGroupItem value="yes" id="hygiene-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="hygiene-no" />
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
                          <RadioGroupItem value="low" id="diet-yes" />
                          <span>Low</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="high" id="diet-no" />
                          <span>High</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="moderate" id="diet-no" />
                          <span>Moderate</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="family">Family History of Cancer</Label>
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
                          <RadioGroupItem value="yes" id="family-yes" />
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
                    <Label htmlFor="immune">Compromised Immune System</Label>
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
                          <RadioGroupItem value="yes" id="immune-yes" />
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
                          <RadioGroupItem value="yes" id="lesions-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="lesions-no" />
                          <span>No</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="bleeding">Unexplained Bleeding</Label>
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
                          <RadioGroupItem value="yes" id="bleeding-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="bleeding-no" />
                          <span>No</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="swallowing">Difficulty Swallowing</Label>
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
                          <RadioGroupItem value="yes" id="swallowing-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="swallowing-no" />
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
                          <RadioGroupItem value="yes" id="patches-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="patches-no" />
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
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="radiation">
                          Radiation Therapy
                        </SelectItem>
                        <SelectItem value="chemotherapy">
                          Chemotherapy
                        </SelectItem>
                        <SelectItem value="Targeted Therapy">
                          Targeted Therapy
                        </SelectItem>
                        <SelectItem value="No Treatment">
                          No Treatment
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
                          <RadioGroupItem value="yes" id="diagnosis-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="diagnosis-no" />
                          <span>No</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Risk Factors & Measurements
                </h3>
                <h3 className="text-xl font-semibold mb-4">
                  Numerical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tumorSize">Tumor Size (cm)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        id="tumorSize"
                        name="tumorSize"
                        value={formData.tumorSize}
                        onChange={handleInputChange}
                        placeholder="Enter tumor size"
                        min="0"
                        step="0.1"
                        required
                        className="w-full pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        cm
                      </span>
                    </div>
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

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!formValid || isSubmitting}
                className={`w-full sm:w-auto px-8 py-4 rounded-lg shadow-sm transition-all duration-200 ${
                  !formValid || isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-brand hover:bg-brand/80 text-white"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Complete Test"
                )}
              </Button>
            </div>
          </form>

          {medicalResult && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">
                    Analysis Complete
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Prediction: {medicalResult.prediction}</p>
                    {medicalResult.confidence && (
                      <p>
                        Confidence:{" "}
                        {(medicalResult.confidence * 100).toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
