import Settings from "@/components/Settings";
import { getCurrentUser } from "@/lib/actions/userActions";

export default async function Page() {
  const CurrentUser = await getCurrentUser();

  return <Settings currentUser={CurrentUser} />;
}
