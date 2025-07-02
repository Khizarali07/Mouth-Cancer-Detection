import TestPage from "@/components/test";
import { getCurrentUser } from "@/lib/actions/userActions";

export default async function page() {
  const currentUser = await getCurrentUser();
  return <TestPage user={currentUser} />;
}
