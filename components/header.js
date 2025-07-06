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
          <Button className="uploader-button bg-brand hover:bg-brand text-white px-6 py-3 rounded-lg font-medium text-base tracking-wide transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/upload.svg"
                alt="upload"
                width={20}
                height={20}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-semibold">Start Screening</span>
            </div>
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
