"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { getTotalSpaceUsed, uploadFile } from "@/lib/actions/fileActions";
import { redirect, usePathname } from "next/navigation";

const FileUploader = ({ ownerId, accountId, className }) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState([]);
  const [Result, setResult] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        // Fetch the current user's total space usage
        const totalSpace = await getTotalSpaceUsed();
        const usedSpace = (await totalSpace?.used) || 0;
        const availableSpace = (await totalSpace?.all) || 0;

        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "error-toast",
          });
        }

        // Check if there is enough available space
        if (usedSpace >= availableSpace) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );

          return toast({
            description: (
              <p className="body-2 text-white">
                Storage limit reached. Please delete some files to upload new
                ones.
              </p>
            ),
            className: "error-toast",
          });
        }

        // 🔥 Sending file to Next.js API for prediction
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/predict", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (response.ok) {
            const prediction = `Prediction: ${data.prediction}, Confidence: ${data.confidence}`;
            setResult(prediction); // Update Result with the prediction

            toast({
              description: prediction,
              className: "success-toast",
            });

            // Only upload the file if prediction is successful
            return uploadFile({
              file,
              ownerId,
              accountId,
              path,
              Result: prediction,
            }).then((uploadedFile) => {
              if (uploadedFile) {
                setFiles((prevFiles) =>
                  prevFiles.filter((f) => f.name !== file.name)
                );
                redirect(`/documents/${uploadedFile.$id}`);
              }
            });
          } else {
            alert("Prediction failed: " + data.error);
          }
        } catch (error) {
          console.error("Error in prediction:", error);
          alert("Error occurred while making prediction.");
        }
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path, toast]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (e, fileName) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input
        {...getInputProps()}
        accept=".jpg" // Restrict to .dcm files
      />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />{" "}
        <p>Upload Your MRI Scan Here</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
