import { getAllUsers } from "@/lib/actions/adminActions";
import UserPageClient from "./UserPageClient";

export default async function UserPage() {
  const users = await getAllUsers();
  return <UserPageClient users={users} />;
}
