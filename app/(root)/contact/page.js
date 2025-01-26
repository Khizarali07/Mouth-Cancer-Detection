import Contact from "@/components/ContactUs";
import { getCurrentUser } from "@/lib/actions/userActions";

async function page() {
  const currentUser = await getCurrentUser();
  return (
    <>
      <Contact currentUser={currentUser} />
    </>
  );
}

export default page;
