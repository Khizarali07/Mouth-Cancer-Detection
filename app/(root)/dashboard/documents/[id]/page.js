import { getFileById } from "@/lib/actions/fileActions";
import TestPage from "@/components/documentTest";
import { getCurrentUser } from "@/lib/actions/userActions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function ResultCard({ title, value, icon: Icon, variant = "default" }) {
  const variantClasses = {
    default: "bg-white",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };

  const iconColors = {
    default: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${variantClasses[variant]} shadow-sm`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className={`h-6 w-6 ${iconColors[variant]}`} />}
        <div>
          <h4 className="text-sm font-medium text-gray-500">{title}</h4>
          <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RiskFactor({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`text-sm font-medium ${
          value === "yes" || value === "high"
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {value === "yes" ? "Present" : value === "no" ? "Absent" : value}
      </span>
    </div>
  );
}

async function DocumentPage({ params }) {
  const { id } = await params;
  const fileData = await getFileById(id);
  const currentUser = await getCurrentUser();

  if (!fileData.isCompleted) {
    return (
      <div className="sm:block">
        <TestPage user={currentUser} fileData={fileData} />
      </div>
    );
  }

  const imageResult = JSON.parse(fileData.Result);
  const biopsyResult = JSON.parse(fileData.resultBiopsy);
  const medicalResult = JSON.parse(fileData.resultMedical);
  const medicalData = JSON.parse(fileData.medicalData) || {};
  const testDate = fileData.$createdAt;

  const riskFactors = [
    { label: "Tobacco Use", value: medicalData.tobaccoUse },
    { label: "Alcohol Use", value: medicalData.alcoholUse },
    { label: "HPV Infection", value: medicalData.hpvInfection },
    { label: "Betel Quid Use", value: medicalData.betelQuidUse },
    { label: "Chronic Sun Exposure", value: medicalData.chronicSunExposure },
    { label: "Poor Oral Hygiene", value: medicalData.poorOralHygiene },
    { label: "Family History", value: medicalData.familyHistory },
    {
      label: "Compromised Immune System",
      value: medicalData.compromisedImmuneSystem,
    },
  ];

  const getRiskLevel = () => {
    if (medicalResult.prediction === "High Risk") return "High";
    if (medicalResult.prediction === "Medium Risk") return "Medium";
    return "Low";
  };

  const riskLevel = getRiskLevel();
  const isHighRisk = riskLevel === "High";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Documents
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Test Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Test completed on {formatDate(testDate)}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            title="Image Analysis"
            value={imageResult?.prediction || "N/A"}
            icon={
              imageResult?.prediction === "Non Cancer"
                ? CheckCircle
                : AlertCircle
            }
            variant={
              imageResult?.prediction === "Non Cancer" ? "success" : "danger"
            }
          />
          <ResultCard
            title="Biopsy Result"
            value={biopsyResult?.prediction || "N/A"}
            icon={
              biopsyResult?.prediction === "Normal" ? CheckCircle : AlertCircle
            }
            variant={
              biopsyResult?.prediction === "Normal" ? "success" : "warning"
            }
          />
          <ResultCard
            title="Medical Risk Assessment"
            value={medicalResult?.prediction || "N/A"}
            variant={
              riskLevel === "High"
                ? "danger"
                : riskLevel === "Medium"
                ? "warning"
                : "success"
            }
          />
          <ResultCard
            title="Confidence Level"
            value={`${Math.round((imageResult?.confidence || 0) * 100)}%`}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Patient Information
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-12 w-12 rounded-full"
                      src={fileData.owner?.avatar || "/default-avatar.png"}
                      alt="Patient"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {fileData.owner?.fullName || "N/A"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {fileData.owner?.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {medicalData.age || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Gender
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">
                      {medicalData.gender || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Country
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {medicalData.country || "N/A"}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="lg:col-span-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Risk Factors
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {riskFactors.map((factor, index) => (
                    <RiskFactor
                      key={index}
                      label={factor.label}
                      value={factor.value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recommendations
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {isHighRisk ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Based on the assessment, we recommend scheduling a
                      consultation with a healthcare professional as soon as
                      possible for further evaluation and potential treatment
                      options.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Your results indicate a low risk profile. We recommend
                      maintaining good oral hygiene and scheduling regular
                      dental check-ups.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Next Steps
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {isHighRisk ? (
                  <>
                    <li>
                      Schedule an appointment with a specialist within the next
                      week
                    </li>
                    <li>Follow up with your primary care physician</li>
                    <li>Consider lifestyle changes to reduce risk factors</li>
                  </>
                ) : (
                  <>
                    <li>
                      Continue with regular dental check-ups every 6 months
                    </li>
                    <li>Maintain good oral hygiene practices</li>
                    <li>Be aware of any changes in your oral health</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button asChild>
            <Link href="/dashboard/documents">Back to Documents</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DocumentPage;
