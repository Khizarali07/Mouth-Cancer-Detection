import React from "react";
import { getCurrentUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/adminSidebar";
import MobileNavigation from "@/components/adminMobileNav";
import Header from "@/components/adminHeader";
export const dynamic = "force-dynamic";

const AdminLayout = async ({ children }) => {
  const currentUser = await getCurrentUser();

  // Redirect to login if no user is found
  if (!currentUser) return redirect("/login");

  // Redirect to root if user is not an admin
  if (!currentUser.isAdmin) return redirect("/");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default AdminLayout;
