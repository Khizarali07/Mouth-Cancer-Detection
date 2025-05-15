import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOutUser } from "@/lib/actions/userActions";

const Header = ({ userId, accountId }) => {
  return (
    <header className="header">
      <div className="header-wrapper w-full flex justify-end items-center">
        <div className="w-full flex justify-end items-center">
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
        <div className="flex-1"></div>
      </div>
    </header>
  );
};

export default Header;
