import { getFileById } from "@/lib/actions/fileActions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TestPage from "@/components/documentTest";
import { getCurrentUser } from "@/lib/actions/userActions";

async function DocumentPage({ params }) {
  const { id } = params; // Get the dynamic parameter (id) from the URL
  const fileData = await getFileById(id); // Fetch file data by ID
  const currentUser = await getCurrentUser();

  return <TestPage user={currentUser} fileData={fileData} />;
}

export default DocumentPage;
