import Image from "next/image";
import Link from "next/link";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/fileActions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="dashboard-container">
      <section>
        <section className="w-full mb-6">
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-6 shadow-md dark:bg-dark-600">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 text-center">
              Upload your Image
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-md">
              Choose and upload your image here. We’ll analyze and store it
              securely for cancer detection.
            </p>

            {/* Centering wrapper */}
            <div className="max-w-sm w-full flex justify-center items-center">
              <FileUploader />
            </div>
          </div>
        </section>

        <section></section>

        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className={`summary-type-size mt-5`}>
                    {/* {summary.size ? convertFileSize(summary.size) || 0 : " "} */}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent Images uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file) => (
              <Link
                href={`/documents/${file.$id}`}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
