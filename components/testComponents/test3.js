import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Test3({
  currentTest,
  formData,
  setFormData,
  handleBack,
  handleMouthUpload,
  medicalResult,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      {currentTest === 3 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-brand-800 mb-4">
            Medical Information
          </h2>
          <div className="bg-light-300/20 rounded-xl p-8">
            <p className="text-lg text-gray-700 mb-4">
              Please fill out your medical information to help with the
              analysis.
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
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="bangladesh">Bangladesh</SelectItem>
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
                          <RadioGroupItem value="yes" id="tobacco-yes" />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <RadioGroupItem value="no" id="tobacco-no" />
                          <span>No</span>
                        </label>
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
                handleMouthUpload(formData);
              }}
              className="bg-brand text-white hover:bg-brand-500 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Complete Test
            </Button>
          </div>
          {medicalResult && (
            <div>
              <p>Prediction: {medicalResult.prediction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
