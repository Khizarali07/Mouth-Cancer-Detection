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
import { useState } from "react";
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

    if (success) closeAllModals();

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
      const lineSpacing = 8;
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;

      // Auto page-break-aware text function
      const addText = (label, value, indent = 0, fontSize = 12) => {
        if (value === undefined || value === null) return;
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(fontSize);
        doc.text(`${label}: ${String(value)}`, 20 + indent, y);
        y += lineSpacing;
      };

      // Title
      doc.setFontSize(18);
      doc.text("Oral Cancer Diagnostic Report", 20, y);
      y += lineSpacing * 2;

      doc.setFontSize(12);
      const intro =
        "This document provides a comprehensive analysis based on the patient's uploaded medical images and questionnaire data. The results below are generated using AI-assisted tools and are intended to support clinical decision-making.";
      const introLines = doc.splitTextToSize(intro, 170);
      introLines.forEach((line) => addText("", line));
      y += lineSpacing;

      // Section: File Information
      doc.setFontSize(14);
      doc.text("1. File Information", 20, y);
      y += lineSpacing;
      addText("Name", fileData.name);
      addText("Type", fileData.type);
      addText("Extension", fileData.extension.toUpperCase());
      addText("Size", `${fileData.size} bytes`);
      addText("Upload Completed", fileData.isCompleted ? "Yes" : "No");
      y += lineSpacing;

      // Section: Image Analysis
      doc.setFontSize(14);
      doc.text("2. Image Analysis Result", 20, y);
      y += lineSpacing;
      addText("Prediction", result.prediction);
      addText("Confidence Score", `${(result.confidence * 100).toFixed(2)}%`);
      y += lineSpacing;

      // Section: Biopsy
      doc.setFontSize(14);
      doc.text("3. Biopsy Analysis Result", 20, y);
      y += lineSpacing;
      addText("Prediction", resultBiopsy.prediction || "N/A");
      addText(
        "Confidence Score",
        resultBiopsy.confidence
          ? `${(resultBiopsy.confidence * 100).toFixed(2)}%`
          : "N/A"
      );
      y += lineSpacing;

      // Section: Risk Evaluation
      doc.setFontSize(14);
      doc.text("4. Medical Risk Evaluation", 20, y);
      y += lineSpacing;
      addText("Risk Assessment", resultMedical.prediction || "Not Available");
      y += lineSpacing;

      // Section: Medical Questionnaire
      doc.setFontSize(14);
      doc.text("5. Medical History & Questionnaire", 20, y);
      y += lineSpacing;

      for (const [key, value] of Object.entries(medical)) {
        const formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (s) => s.toUpperCase());
        addText(formattedKey, value, 5);
      }

      y += lineSpacing;

      // Section: Submitted By
      doc.setFontSize(14);
      doc.text("6. Submitted By", 20, y);
      y += lineSpacing;
      addText("Name", fileData.owner?.fullName || "N/A");
      addText("Email", fileData.owner?.email || "N/A");
      y += lineSpacing * 2;

      // Footer / Disclaimer
      doc.setFontSize(10);
      const disclaimer =
        "Disclaimer: This report is automatically generated and is intended to assist medical professionals. It should not be used as a sole basis for medical diagnosis or treatment.";
      const lines = doc.splitTextToSize(disclaimer, 170);
      lines.forEach((line) => addText("", line));
      y += lineSpacing;

      addText("Report generated on", new Date().toLocaleString());

      doc.save(`${fileData.name || "oral-cancer-report"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
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
