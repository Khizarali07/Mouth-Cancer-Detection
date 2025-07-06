import TestPage from "@/components/test";
import { getCurrentUser } from "@/lib/actions/userActions";

export default async function page() {
  const currentUser = await getCurrentUser();
  return (
    <div className="sm:block">
      <TestPage user={currentUser} />
    </div>
  );
}
