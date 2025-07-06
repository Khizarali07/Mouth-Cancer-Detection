import React from "react";
import Sidebar from "@/components/sideBar";
import MobileNavigation from "@/components/mobileNavigation";
import Header from "@/components/header";
import { getCurrentUser } from "@/lib/actions/userActions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
export const dynamic = "force-dynamic";

const Layout = async ({ children }) => {
  const currentUser = await getCurrentUser();

  // Redirect to login if no user is found
  if (!currentUser) return redirect("/login");

  // Redirect to admin if user is an admin
  if (currentUser.isAdmin) return redirect("/admin");

  return (
    <main className="flex">
      <Sidebar {...currentUser} />
      <section className="flex h-full  flex-1 flex-col">
        <MobileNavigation
          fullName={currentUser.fullName}
          avatar={currentUser.avatar}
          email={currentUser.email}
        />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;
