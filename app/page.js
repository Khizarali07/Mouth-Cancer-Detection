import { getCurrentUser } from "@/lib/actions/userActions";
import HomeScreen from "@/components/Home";

async function Home() {
  const currentUser = await getCurrentUser();

  return <HomeScreen currentUser={currentUser} />;
}

export default Home;
