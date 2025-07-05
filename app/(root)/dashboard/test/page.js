import TestPage from "@/components/test";
import { getCurrentUser } from "@/lib/actions/userActions";

export default async function page() {
  const currentUser = await getCurrentUser();
  return (
    <div className="page-container">
      <TestPage user={currentUser} />
    </div>
  );
}
