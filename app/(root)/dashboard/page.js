import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/userActions";

import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/fileActions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// import FileUploader from "@/components/FileUploader";

const Dashboard = async () => {
  // Get current user (this is safe since layout already checks authentication)
  const CurrentUser = await getCurrentUser();
  
  // If somehow no user (shouldn't happen due to layout check), return early
  if (!CurrentUser) {
    return null; // Layout will handle redirect
  }

  // Now that we know user is authenticated, get files and total space
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
            <h2 className="text-2xl md:text-3xl font-bold text-brand-800 dark:text-white mb-4 text-center">
              Start Your Mouth Cancer Screening
            </h2>
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Follow our simple 3-step process for early detection of mouth
                cancer:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-brand-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Upload a clear image of your mouth for initial screening
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Upload a biopsy image for for detailed analysis
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-success-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    Complete a medical questionnaire to assess your risk profile
                  </span>
                </li>
              </ul>
            </div>

            {/* Centering wrapper */}
            <div className="max-w-sm w-full mt-6 flex justify-center items-center">
              <Link
                href="/dashboard/test"
                className="flex items-center gap-2 group"
              >
                <Button className="uploader-button bg-brand hover:bg-brand text-white px-6 py-3 rounded-lg font-medium text-base tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/icons/upload.svg"
                      alt="upload"
                      width={20}
                      height={20}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="font-semibold">Start Screening</span>
                  </div>
                </Button>
              </Link>
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
      <section className="dashboard-recent-files mb-4">
        <h2 className="h3 xl:h2 text-light-100">Recent Images uploaded</h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file) => (
              <Link
                href={`/dashboard/documents/${file.$id}`}
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
