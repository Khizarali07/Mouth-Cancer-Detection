import { getFileById } from "@/lib/actions/fileActions";
import Image from "next/image";
import { Button } from "@/components/ui/button";

async function page({ params }) {
  const { id } = params; // Get the dynamic parameter (id) from the URL
  const fileData = await getFileById(id); // Fetch file data by ID

  // Handle if file data is not found
  if (fileData.error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Error</h1>
          <p className="text-lg text-gray-600">{fileData.message}</p>
        </div>
      </div>
    );
  }

  // Extract data from the file object
  const { name, url, Result, owner, size, type } = fileData;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        {/* File Information Section */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Cancer Prediction Result
          </h1>
          <p className="text-lg text-gray-600">{name}</p>
          <div className="mt-4">
            <Image
              src={url}
              alt={name}
              width={200}
              height={200}
              className="rounded-md shadow-md"
            />
          </div>
        </div>

        {/* Prediction Result Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Prediction Result
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            {" "}
            {fileData.Result.split(",")[0]}
          </p>
        </div>

        {/* Confidence Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Confidence Level
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            {fileData.Result.split(",")[1]}
          </p>
        </div>

        {/* File Details Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">File Details</h2>
          <p className="text-lg text-gray-600 mt-2">Size: {size} bytes</p>
          <p className="text-lg text-gray-600 mt-2">Type: {type}</p>
        </div>

        {/* Owner Information Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Owner Information
          </h2>
          <div className="flex items-center mt-4">
            <Image
              src={owner.avatar}
              alt={owner.fullName}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-800">
                {owner.fullName}
              </p>
              <p className="text-lg text-gray-600">{owner.email}</p>
            </div>
          </div>
        </div>

        {/* View File Button */}
        <div className="flex justify-center">
          <Button
            as="a"
            href={url}
            target="_blank"
            className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700"
          >
            View Full File
          </Button>
        </div>
      </div>
    </div>
  );
}

export default page;
