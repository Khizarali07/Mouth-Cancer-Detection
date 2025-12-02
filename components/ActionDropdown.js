"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
  getFileById,
} from "@/lib/actions/fileActions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";
import { actionsDropdownItems } from "@/constants";
import jsPDF from "jspdf";
import { toast } from "sonner";

const ActionDropdown = ({ file }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);

  const path = usePathname();

  // Sync name state when file prop changes
  useEffect(() => {
    setName(file.name);
  }, [file.name]);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };

    success = await actions[action.value]();

    if (success) {
      // For rename action, don't reset the name since it should keep the new name
      if (action.value === "rename") {
        setIsModalOpen(false);
        setIsDropdownOpen(false);
        setAction(null);
        // Keep the current name state as it reflects the new name
      } else {
        closeAllModals();
      }
    }

    setIsLoading(false);
  };

  const handleRemoveUser = async (email) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const generatePDF = async () => {
    try {
      setIsLoading(true);
      const fileData = await getFileById(file.$id);

      if (fileData.error) {
        toast.error("Failed to fetch file details");
        return;
      }

      const result = JSON.parse(fileData.Result || "{}");
      const resultBiopsy = JSON.parse(fileData.resultBiopsy || "{}");
      const resultMedical = JSON.parse(fileData.resultMedical || "{}");
      const medical = JSON.parse(fileData.medicalData || "{}");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 25;

      // Colors
      const primaryColor = [41, 128, 185]; // Professional blue
      const secondaryColor = [52, 73, 94]; // Dark gray
      const accentColor = [231, 76, 60]; // Red for important info
      const lightGray = [236, 240, 241];

      // Helper functions
      const checkPageBreak = (requiredSpace = 25) => {
        if (y > pageHeight - requiredSpace) {
          doc.addPage();
          y = 25;
          return true;
        }
        return false;
      };

      const addHeader = () => {
        // Header background
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, pageWidth, 35, "F");

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ORAL CANCER DIAGNOSTIC REPORT", pageWidth / 2, 22, {
          align: "center",
        });

        // Report ID and Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Report ID: ${fileData.$id.slice(-8).toUpperCase()}`, 15, 30);
        doc.text(
          `Generated: ${new Date().toLocaleDateString()}`,
          pageWidth - 15,
          30,
          { align: "right" }
        );

        y = 50;
      };

      const addSection = (title, backgroundColor = lightGray) => {
        checkPageBreak(15);
        doc.setFillColor(...backgroundColor);
        doc.rect(15, y - 5, pageWidth - 30, 12, "F");
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title, 20, y + 2);
        y += 12;
      };

      const addField = (label, value, isImportant = false) => {
        if (value === undefined || value === null || value === "") return;
        checkPageBreak(12);

        doc.setTextColor(...secondaryColor);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);

        doc.setFont("helvetica", "normal");
        if (isImportant) {
          doc.setTextColor(...accentColor);
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(0, 0, 0);
        }

        const labelWidth = doc.getTextWidth(`${label}:`) + 3; // Reduced from 7 to 3 units
        const valueText = String(value);
        const maxWidth = pageWidth - 25 - labelWidth - 15; // Reduced margin
        const lines = doc.splitTextToSize(valueText, maxWidth);

        doc.text(lines, 25 + labelWidth, y);
        y += Math.max(lines.length * 7, 12);
      };

      const addTable = (data, title = "") => {
        if (title) {
          checkPageBreak(15);
          doc.setTextColor(...secondaryColor);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(title, 25, y);
          y += 10;
        }

        const tableData = data.filter(
          (item) =>
            item.value !== undefined && item.value !== null && item.value !== ""
        );
        if (tableData.length === 0) return;

        const startY = y;
        const rowHeight = 8;
        const col1Width = 85; // Label column width
        const col2Width = pageWidth - 55 - col1Width; // Value column width

        // Table border
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);

        tableData.forEach((item, index) => {
          checkPageBreak(rowHeight + 5);

          const currentY = y;

          // Alternating row colors
          if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(25, currentY - 2, col1Width + col2Width, rowHeight, "F");
          }

          // Cell borders
          doc.rect(25, currentY - 2, col1Width, rowHeight);
          doc.rect(25 + col1Width, currentY - 2, col2Width, rowHeight);

          // Label (left column)
          doc.setTextColor(...secondaryColor);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(item.label, 28, currentY + 3);

          // Value (right column)
          doc.setFont("helvetica", "normal");
          if (item.isImportant) {
            doc.setTextColor(...accentColor);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setTextColor(0, 0, 0);
          }

          const valueText = String(item.value);
          const maxValueWidth = col2Width - 6;
          const lines = doc.splitTextToSize(valueText, maxValueWidth);
          doc.text(lines, 28 + col1Width, currentY + 3);

          y += rowHeight;
        });

        y += 5; // Space after table
      };

      const addResultBox = (
        title,
        prediction,
        confidence,
        isPositive = false
      ) => {
        checkPageBreak(35);

        // Result box
        const boxColor = isPositive ? [231, 76, 60] : [46, 204, 113]; // Red for cancer, green for normal
        doc.setFillColor(...boxColor);
        doc.rect(25, y, pageWidth - 50, 25, "F");

        // White text for contrast
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(title, 30, y + 8);

        doc.setFontSize(16);
        doc.text(prediction || "N/A", 30, y + 18);

        if (confidence) {
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text(
            `Confidence: ${(confidence * 100).toFixed(1)}%`,
            pageWidth - 30,
            y + 18,
            { align: "right" }
          );
        }

        y += 35;
      };

      // Function to fetch precautions from chatbot API
      const addPrecautionsSection = async () => {
        try {
          // Create context message for chatbot
          const contextualMessage = `Based on the patient's oral cancer diagnostic results, provide important precautions and care instructions. 
          Patient Analysis:
          - Primary Image Analysis: ${
            result.prediction || "N/A"
          } (Confidence: ${
            result.confidence
              ? (result.confidence * 100).toFixed(1) + "%"
              : "N/A"
          })
          - Biopsy Analysis: ${resultBiopsy.prediction || "N/A"}
          - Risk Assessment: ${resultMedical.prediction || "N/A"}
          - Age: ${medical.age || "N/A"}
          - Gender: ${medical.gender || "N/A"}
          - Risk Factors: Tobacco use: ${
            medical.tobaccoUse || "N/A"
          }, Alcohol use: ${medical.alcoholUse || "N/A"}
          
          Please provide specific precautions, care instructions, and important medical advice for this patient's condition. Focus on actionable steps and important warnings.`;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/chatbot/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: contextualMessage,
              }),
            }
          );

          let precautionText = "";

          if (response.ok) {
            const data = await response.json();
            precautionText =
              data.response ||
              "Unable to fetch specific precautions at this time.";
          } else {
            // Fallback precautions if API fails
            precautionText = `Important Precautions and Care Instructions:

1. Follow-up Care: Regular medical follow-ups are essential for monitoring your condition and ensuring proper treatment.

2. Lifestyle Modifications: Avoid tobacco and excessive alcohol consumption, which are major risk factors for oral cancer.

3. Oral Hygiene: Maintain excellent oral hygiene with regular brushing, flossing, and professional dental cleanings.

4. Diet: Eat a balanced diet rich in fruits and vegetables, which may help reduce cancer risk.

5. Warning Signs: Watch for any changes in your mouth, such as persistent sores, lumps, or white/red patches.

6. Professional Consultation: Always consult with qualified healthcare providers for medical decisions and treatment planning.

7. Medication Compliance: If treatment is prescribed, follow all medication instructions carefully.

8. Support System: Consider joining support groups or counseling services if dealing with a cancer diagnosis.`;
          }

          // Add the precautions section to PDF
          addSection("IMPORTANT PRECAUTIONS & CARE INSTRUCTIONS");

          checkPageBreak(40);

          // Function to parse and render markdown-formatted text
          const renderMarkdownToPDF = (text) => {
            const maxWidth = pageWidth - 50;
            const lines = text.split("\n");

            lines.forEach((line) => {
              checkPageBreak(10);

              // Remove leading/trailing whitespace
              let trimmedLine = line.trim();

              // Skip empty lines but add spacing
              if (trimmedLine === "") {
                y += 4;
                return;
              }

              // Check for main headers (###)
              if (trimmedLine.startsWith("### ")) {
                const headerText = trimmedLine
                  .replace(/^###\s*/, "")
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(...primaryColor);
                y += 4; // Extra space before main header
                const headerLines = doc.splitTextToSize(headerText, maxWidth);
                headerLines.forEach((hLine) => {
                  checkPageBreak(10);
                  doc.text(hLine, 25, y);
                  y += 7;
                });
                y += 2;
                return;
              }

              // Check for sub-headers (####)
              if (trimmedLine.startsWith("#### ")) {
                const subHeaderText = trimmedLine
                  .replace(/^####\s*/, "")
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(...secondaryColor);
                y += 3; // Extra space before sub-header
                const subHeaderLines = doc.splitTextToSize(
                  subHeaderText,
                  maxWidth
                );
                subHeaderLines.forEach((shLine) => {
                  checkPageBreak(8);
                  doc.text(shLine, 28, y);
                  y += 6;
                });
                y += 1;
                return;
              }

              // Check for numbered list items (1., 2., etc.)
              const numberedMatch = trimmedLine.match(
                /^(\d+)\.\s*\*\*(.*?)\*\*/
              );
              if (numberedMatch) {
                const number = numberedMatch[1];
                const boldText = numberedMatch[2];
                const remainingText = trimmedLine
                  .replace(/^\d+\.\s*\*\*.*?\*\*\s*/, "")
                  .replace(/\*\*/g, "");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(...primaryColor);
                y += 2;
                doc.text(`${number}. ${boldText}`, 25, y);
                y += 6;

                if (remainingText) {
                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(10);
                  doc.setTextColor(...secondaryColor);
                  const remainingLines = doc.splitTextToSize(
                    remainingText,
                    maxWidth - 10
                  );
                  remainingLines.forEach((rLine) => {
                    checkPageBreak(7);
                    doc.text(rLine, 30, y);
                    y += 5;
                  });
                }
                return;
              }

              // Check for bullet points with bold labels (- **Label:** content)
              const bulletBoldMatch = trimmedLine.match(
                /^-\s*\*\*(.*?)\*\*:?\s*(.*)/
              );
              if (bulletBoldMatch) {
                const boldLabel = bulletBoldMatch[1];
                const content = bulletBoldMatch[2].replace(/\*\*/g, "");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(...secondaryColor);
                doc.text(`• ${boldLabel}:`, 30, y);

                if (content) {
                  const labelWidth = doc.getTextWidth(`• ${boldLabel}: `);
                  doc.setFont("helvetica", "normal");
                  doc.setTextColor(60, 60, 60);
                  const contentLines = doc.splitTextToSize(
                    content,
                    maxWidth - labelWidth - 10
                  );
                  if (contentLines.length === 1) {
                    doc.text(content, 30 + labelWidth, y);
                    y += 6;
                  } else {
                    doc.text(contentLines[0], 30 + labelWidth, y);
                    y += 6;
                    for (let i = 1; i < contentLines.length; i++) {
                      checkPageBreak(6);
                      doc.text(contentLines[i], 35, y);
                      y += 5;
                    }
                  }
                } else {
                  y += 6;
                }
                return;
              }

              // Check for simple bullet points (- text)
              if (trimmedLine.startsWith("- ")) {
                const bulletContent = trimmedLine
                  .substring(2)
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(...secondaryColor);
                const bulletLines = doc.splitTextToSize(
                  `• ${bulletContent}`,
                  maxWidth - 10
                );
                bulletLines.forEach((bLine, idx) => {
                  checkPageBreak(6);
                  doc.text(bLine, idx === 0 ? 30 : 35, y);
                  y += 5;
                });
                y += 1;
                return;
              }

              // Regular text - check for inline bold (**text**)
              let processedLine = trimmedLine;
              const boldParts = processedLine.match(/\*\*(.*?)\*\*/g);

              if (boldParts) {
                // Line contains bold text - render with mixed formatting
                let xPos = 25;
                const parts = processedLine.split(/(\*\*.*?\*\*)/);

                parts.forEach((part) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    // Bold text
                    const boldContent = part.slice(2, -2);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(10);
                    doc.setTextColor(...secondaryColor);
                    doc.text(boldContent, xPos, y);
                    xPos += doc.getTextWidth(boldContent);
                  } else if (part) {
                    // Normal text
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(60, 60, 60);
                    doc.text(part, xPos, y);
                    xPos += doc.getTextWidth(part);
                  }
                });
                y += 6;
              } else {
                // No bold formatting - render as plain text
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(...secondaryColor);
                const plainLines = doc.splitTextToSize(processedLine, maxWidth);
                plainLines.forEach((pLine) => {
                  checkPageBreak(6);
                  doc.text(pLine, 25, y);
                  y += 5;
                });
              }
            });
          };

          renderMarkdownToPDF(precautionText);

          y += 10; // Extra space after precautions section
        } catch (error) {
          console.error("Error fetching precautions:", error);

          // Add fallback precautions section
          addSection("IMPORTANT PRECAUTIONS & CARE INSTRUCTIONS");

          const fallbackText = `### General Precautions and Care Instructions

#### 1. **Regular Medical Follow-ups**
- **Frequency:** Schedule regular check-ups as recommended by your healthcare provider.
- **Purpose:** Monitor your condition and detect any changes early.

#### 2. **Lifestyle Modifications**
- **Tobacco:** Avoid all tobacco products including cigarettes, cigars, and smokeless tobacco.
- **Alcohol:** Limit or avoid alcohol consumption as it increases oral cancer risk.

#### 3. **Maintain Good Oral Hygiene**
- **Brushing:** Brush teeth at least twice daily with fluoride toothpaste.
- **Flossing:** Floss daily to remove food particles and plaque.
- **Dental Visits:** Schedule professional dental cleanings regularly.

#### 4. **Monitor for Warning Signs**
- **Self-examination:** Check your mouth regularly for any changes.
- **Watch for:** Persistent sores, lumps, white/red patches, or difficulty swallowing.
- **Action:** Seek immediate medical attention if you notice concerning symptoms.

#### 5. **Follow Treatment Plans**
- **Medications:** Take all prescribed medications as directed.
- **Appointments:** Attend all scheduled follow-up appointments.
- **Communication:** Report any side effects or concerns to your healthcare provider.

Please consult with your healthcare provider for specific guidance related to your condition.`;

          // Function to parse and render markdown-formatted text (fallback version)
          const renderFallbackMarkdown = (text) => {
            const maxWidth = pageWidth - 50;
            const lines = text.split("\n");

            lines.forEach((line) => {
              checkPageBreak(10);
              let trimmedLine = line.trim();

              if (trimmedLine === "") {
                y += 4;
                return;
              }

              // Main headers (###)
              if (trimmedLine.startsWith("### ")) {
                const headerText = trimmedLine
                  .replace(/^###\s*/, "")
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(...primaryColor);
                y += 4;
                doc.text(headerText, 25, y);
                y += 8;
                return;
              }

              // Sub-headers (####)
              if (trimmedLine.startsWith("#### ")) {
                const subHeaderText = trimmedLine
                  .replace(/^####\s*/, "")
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(...secondaryColor);
                y += 3;
                doc.text(subHeaderText, 28, y);
                y += 7;
                return;
              }

              // Bullet points with bold labels
              const bulletBoldMatch = trimmedLine.match(
                /^-\s*\*\*(.*?)\*\*:?\s*(.*)/
              );
              if (bulletBoldMatch) {
                const boldLabel = bulletBoldMatch[1];
                const content = bulletBoldMatch[2].replace(/\*\*/g, "");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(...secondaryColor);
                doc.text(`• ${boldLabel}:`, 30, y);

                if (content) {
                  const labelWidth = doc.getTextWidth(`• ${boldLabel}: `);
                  doc.setFont("helvetica", "normal");
                  doc.setTextColor(60, 60, 60);
                  const contentLines = doc.splitTextToSize(
                    content,
                    maxWidth - labelWidth - 10
                  );
                  if (contentLines.length === 1) {
                    doc.text(content, 30 + labelWidth, y);
                    y += 6;
                  } else {
                    doc.text(contentLines[0], 30 + labelWidth, y);
                    y += 6;
                    for (let i = 1; i < contentLines.length; i++) {
                      checkPageBreak(6);
                      doc.text(contentLines[i], 35, y);
                      y += 5;
                    }
                  }
                } else {
                  y += 6;
                }
                return;
              }

              // Simple bullet points
              if (trimmedLine.startsWith("- ")) {
                const bulletContent = trimmedLine
                  .substring(2)
                  .replace(/\*\*/g, "");
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(...secondaryColor);
                const bulletLines = doc.splitTextToSize(
                  `• ${bulletContent}`,
                  maxWidth - 10
                );
                bulletLines.forEach((bLine, idx) => {
                  checkPageBreak(6);
                  doc.text(bLine, idx === 0 ? 30 : 35, y);
                  y += 5;
                });
                y += 1;
                return;
              }

              // Regular text
              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.setTextColor(...secondaryColor);
              const plainLines = doc.splitTextToSize(
                trimmedLine.replace(/\*\*/g, ""),
                maxWidth
              );
              plainLines.forEach((pLine) => {
                checkPageBreak(6);
                doc.text(pLine, 25, y);
                y += 5;
              });
            });
          };

          renderFallbackMarkdown(fallbackText);

          y += 10;
        }
      };

      // Generate Report
      addHeader();

      // Patient Information Section
      addSection("PATIENT INFORMATION");
      const patientData = [
        { label: "Patient Name", value: fileData.owner?.fullName || "N/A" },
        { label: "Email", value: fileData.owner?.email || "N/A" },
        { label: "Age", value: medical.age ? `${medical.age} years` : "N/A" },
        {
          label: "Gender",
          value: medical.gender
            ? medical.gender.charAt(0).toUpperCase() + medical.gender.slice(1)
            : "N/A",
        },
        { label: "Country", value: medical.country || "N/A" },
      ];
      addTable(patientData);
      y += 0;

      // Analysis Results Section
      addSection("DIAGNOSTIC ANALYSIS RESULTS");

      // Primary Image Analysis
      const isPrimaryCancer = result.prediction
        ?.toLowerCase()
        .includes("cancer");
      addResultBox(
        "Primary Image Analysis",
        result.prediction,
        result.confidence,
        isPrimaryCancer
      );

      // Biopsy Analysis
      const isBiopsyAbnormal =
        resultBiopsy.prediction?.toLowerCase() !== "normal";
      addResultBox(
        "Biopsy Analysis",
        resultBiopsy.prediction,
        resultBiopsy.confidence,
        isBiopsyAbnormal
      );

      // Medical Risk Assessment
      checkPageBreak(25);
      doc.setFillColor(255, 243, 205); // Light yellow background
      doc.rect(25, y, pageWidth - 50, 15, "F");
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Medical Risk Assessment:", 30, y + 10);
      doc.setFont("helvetica", "normal");
      const riskColor = resultMedical.prediction?.toLowerCase().includes("high")
        ? accentColor
        : [46, 204, 113];
      doc.setTextColor(...riskColor);
      doc.text(
        resultMedical.prediction || "Not Available",
        pageWidth - 30,
        y + 10,
        { align: "right" }
      );
      y += 25;

      // Check if all required tests are completed
      const hasCompleteImageAnalysis = result.prediction && result.confidence;
      const hasCompleteBiopsy = resultBiopsy.prediction;
      const hasCompleteMedicalAssessment = resultMedical.prediction;
      const hasCompleteMedicalData =
        medical.age &&
        medical.gender &&
        (medical.tobaccoUse ||
          medical.alcoholUse ||
          medical.oralLesions ||
          medical.unexplainedBleeding ||
          medical.difficultySwallowing ||
          medical.whitePatches);

      const isReportComplete =
        hasCompleteImageAnalysis &&
        hasCompleteBiopsy &&
        hasCompleteMedicalAssessment &&
        hasCompleteMedicalData;

      if (isReportComplete) {
        // Risk Factors Section
        checkPageBreak(25);
        addSection("RISK FACTORS ASSESSMENT");
        const riskFactors = [
          { key: "tobaccoUse", label: "Tobacco Use", critical: true },
          { key: "alcoholUse", label: "Alcohol Use", critical: true },
          { key: "hpvInfection", label: "HPV Infection", critical: true },
          { key: "betelQuidUse", label: "Betel Quid Use", critical: true },
          { key: "chronicSunExposure", label: "Chronic Sun Exposure" },
          { key: "poorOralHygiene", label: "Poor Oral Hygiene" },
          {
            key: "familyHistory",
            label: "Family History of Cancer",
            critical: true,
          },
        ];

        const riskFactorData = riskFactors
          .map((factor) => {
            const value = medical[factor.key];
            if (value) {
              const isRisk = value.toLowerCase() === "yes";
              return {
                label: factor.label,
                value: value.charAt(0).toUpperCase() + value.slice(1),
                isImportant: isRisk && factor.critical,
              };
            }
            return null;
          })
          .filter(Boolean);

        addTable(riskFactorData);
        y += 0;

        // Clinical Symptoms Section
        addSection("CLINICAL SYMPTOMS");
        const symptoms = [
          { key: "oralLesions", label: "Oral Lesions" },
          { key: "unexplainedBleeding", label: "Unexplained Bleeding" },
          { key: "difficultySwallowing", label: "Difficulty Swallowing" },
          { key: "whitePatches", label: "White Patches in Mouth" },
        ];

        const symptomsData = symptoms
          .map((symptom) => {
            const value = medical[symptom.key];
            if (value) {
              const isPresent = value.toLowerCase() === "yes";
              return {
                label: symptom.label,
                value: value.charAt(0).toUpperCase() + value.slice(1),
                isImportant: isPresent,
              };
            }
            return null;
          })
          .filter(Boolean);

        addTable(symptomsData);
        y += 0;
      } else {
        // Incomplete Report Section
        checkPageBreak(50);
        addSection("REPORT STATUS", [255, 243, 205]); // Light yellow background

        // Status box
        doc.setFillColor(255, 235, 205); // Light orange background
        doc.rect(25, y, pageWidth - 50, 40, "F");
        doc.setDrawColor(255, 152, 0); // Orange border
        doc.setLineWidth(2);
        doc.rect(25, y, pageWidth - 50, 40);

        // Warning icon (using text)
        doc.setTextColor(255, 152, 0);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("⚠", 35, y + 15);

        // Status message
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("INCOMPLETE DIAGNOSTIC REPORT", 55, y + 12);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const incompleteMessage =
          "This report is incomplete as some diagnostic tests have not been completed. For a comprehensive analysis including risk factors, clinical symptoms, and personalized precautions, please complete all required tests.";
        const messageLines = doc.splitTextToSize(
          incompleteMessage,
          pageWidth - 90
        );
        doc.text(messageLines, 55, y + 22);

        y += 65;

        // Missing Tests Section
        addSection("REQUIRED TESTS STATUS");

        const testStatus = [
          {
            label: "Image Analysis",
            value: hasCompleteImageAnalysis ? "✓ Completed" : "✗ Incomplete",
            isImportant: !hasCompleteImageAnalysis,
          },
          {
            label: "Biopsy Analysis",
            value: hasCompleteBiopsy ? "✓ Completed" : "✗ Incomplete",
            isImportant: !hasCompleteBiopsy,
          },
          {
            label: "Medical Risk Assessment",
            value: hasCompleteMedicalAssessment
              ? "✓ Completed"
              : "✗ Incomplete",
            isImportant: !hasCompleteMedicalAssessment,
          },
          {
            label: "Medical History & Symptoms",
            value: hasCompleteMedicalData ? "✓ Completed" : "✗ Incomplete",
            isImportant: !hasCompleteMedicalData,
          },
        ];

        addTable(testStatus);
        y += 10;

        // Instructions
        checkPageBreak(30);
        doc.setFillColor(240, 248, 255); // Light blue background
        doc.rect(25, y, pageWidth - 50, 25, "F");

        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("NEXT STEPS", 30, y + 8);

        doc.setTextColor(...secondaryColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Please complete all required tests to generate a comprehensive diagnostic report",
          30,
          y + 18
        );

        y += 35;
      }

      // Treatment Information Section
      if (
        medical.treatmentType ||
        medical.treatmentCost ||
        medical.economicBurden
      ) {
        addSection("TREATMENT INFORMATION");

        const treatmentData = [
          { label: "Treatment Type", value: medical.treatmentType },
          {
            label: "Cancer Stage",
            value:
              medical.cancerStage && medical.cancerStage > 0
                ? `Stage ${medical.cancerStage}`
                : null,
          },
          {
            label: "Tumor Size",
            value:
              medical.tumorSize && medical.tumorSize > 0
                ? `${medical.tumorSize} cm`
                : null,
          },
          {
            label: "5-Year Survival Rate",
            value:
              medical.survivalRate && medical.survivalRate > 0
                ? `${medical.survivalRate}%`
                : null,
          },
          {
            label: "Treatment Cost",
            value:
              medical.treatmentCost && medical.treatmentCost > 0
                ? `$${medical.treatmentCost.toLocaleString()}`
                : null,
          },
          {
            label: "Economic Burden (Lost Workdays/Year)",
            value:
              medical.economicBurden && medical.economicBurden > 0
                ? medical.economicBurden
                : null,
          },
        ].filter((item) => item.value);

        addTable(treatmentData);
        y += 0;
      }

      // Precautions Section - only show for complete reports
      if (isReportComplete) {
        await addPrecautionsSection();
      }

      // Footer with disclaimer
      checkPageBreak(40);
      y += 0;
      doc.setFillColor(250, 250, 250);
      doc.rect(15, y, pageWidth - 30, 35, "F");

      doc.setTextColor(...accentColor);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("IMPORTANT DISCLAIMER", 20, y + 10);

      doc.setTextColor(...secondaryColor);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const disclaimer =
        "This report is generated using AI-assisted diagnostic tools and is intended for medical professional use only. The results should not be used as the sole basis for medical diagnosis or treatment decisions. Please consult with a qualified healthcare provider for proper medical evaluation and treatment planning. This system is designed to assist, not replace, professional medical judgment.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
      doc.text(disclaimerLines, 20, y + 18);

      // Add page numbers to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 10, {
          align: "right",
        });
        doc.text("Confidential Medical Report", 15, pageHeight - 10);
      }

      // Save the PDF
      const fileName = `${fileData.name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_Medical_Report.pdf`;
      doc.save(fileName);

      toast.success("Professional medical report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (actionItem.value === "download") {
                  generatePDF();
                } else if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={actionItem.icon}
                  alt={actionItem.label}
                  width={30}
                  height={30}
                />
                {actionItem.label}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
