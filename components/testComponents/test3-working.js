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
          <h2 className="text-lg font-semibold mb-4 text-center">
            Coming Soon
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}
