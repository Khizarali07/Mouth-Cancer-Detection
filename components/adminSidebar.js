"use client";

import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    icon: "/assets/icons/dashboard.svg",
    url: "/admin",
  },
  {
    name: "Users",
    icon: "/assets/icons/user-circle.svg",
    url: "/admin/users",
  },
];

const Sidebar = ({ fullName, avatar, email }) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/Logo.png"
            alt="logo"
            width={52}
            height={52}
            className="lg:block"
          />
          <p className="h4 text-white font-extrabold">Mouth Cancer Detection</p>
          <Image
            src="/assets/icons/Logo.png"
            alt="logo"
            width={52}
            height={52}
            className="lg:hidden"
          />
        </div>
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <Link key={name} href={url} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item",
                  pathname === url && "shad-active"
                )}
              >
                <Image
                  src={icon}
                  alt={name}
                  width={24}
                  height={24}
                  className={cn(
                    "nav-icon",
                    pathname === url && "nav-icon-active"
                  )}
                />
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      <Image
        src="/assets/images/file.png"
        alt="logo"
        width={185}
        height={200}
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
