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

  if (!currentUser) return redirect("/login");

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

export default Layout;
