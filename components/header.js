import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/Search";
import { signOutUser } from "@/lib/actions/userActions";
import Link from "next/link";

const Header = ({ userId, accountId }) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <Link href="/dashboard/test" className="flex items-center gap-2">
          <Button
            variant="outline"
            className="uploader-button text-light-400 hover:bg-brand-500 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={24}
              height={24}
            />
            <span className="font-semibold">Start Screening</span>
          </Button>
        </Link>
        {/* <FileUploader ownerId={userId} accountId={accountId} /> */}
        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
