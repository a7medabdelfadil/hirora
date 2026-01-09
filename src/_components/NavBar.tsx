/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useLanguageStore, {
  useBooleanValue,
  useUserDataStore,
} from "~/APIs/store";
import { cn } from "~/lib/utils";
import Spinner from "~/_components/global/Spinner";
import Switch from "~/_components/global/Switch";
import { useTranslation } from "~/hooks/useTranslatoins";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { HiOutlineUserGroup } from "react-icons/hi";

// ---------- ROLE HELPERS ----------

type PortalRole = "admin" | "employer" | "jobSeeker";

const getRoleFromPath = (path: string | null): PortalRole => {
  if (!path) return "admin";
  if (path.startsWith("/employer")) return "employer";
  if (path.startsWith("/job-seeker")) return "jobSeeker";
  return "admin"; // default
};

const portalTitleMap: Record<PortalRole, string> = {
  admin: "Admin Portal",
  employer: "Employer Portal",
  jobSeeker: "Job Seeker Portal",
};

const roleUserNameMap: Record<PortalRole, string> = {
  admin: "Admin User",
  employer: "Employer User",
  jobSeeker: "Job Seeker",
};

const roleColorClasses: Record<
  PortalRole,
  {
    accentBg: string; 
    accentText: string; 
    activeBg: string; 
    activeText: string; 
  }
> = {
  admin: {
    accentBg: "bg-[#145efc]",
    accentText: "text-white",
    activeBg: "bg-blue-50",
    activeText: "text-blue-600",
  },
  employer: {
    accentBg: "bg-emerald-500",
    accentText: "text-white",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-600",
  },
  jobSeeker: {
    accentBg: "bg-purple-500",
    accentText: "text-white",
    activeBg: "bg-purple-50",
    activeText: "text-purple-600",
  },
};

const buildNavLinks = (role: PortalRole, t: (key: string) => string) => {
  if (role === "admin") {
    return [
      { href: "/admin", icon: LuLayoutDashboard, label: t("dashboard") },
      {
        href: "/admin/companies",
        icon: HiOutlineBuildingOffice2,
        label: "Companies",
      },
      { href: "/admin/jobs", icon: HiOutlineBriefcase, label: "Job Posting" },
      {
        href: "/admin/applications",
        icon: HiOutlineUserGroup,
        label: "Applications",
      },
    ];
  }

  if (role === "employer") {
    return [
      { href: "/employer", icon: LuLayoutDashboard, label: t("dashboard") },
      {
        href: "/employer/jobs",
        icon: HiOutlineBriefcase,
        label: "Job Posting",
      },
      {
        href: "/employer/applications",
        icon: HiOutlineUserGroup,
        label: "Applications",
      },
    ];
  }

  // jobSeeker
  return [
    { href: "/job-seeker", icon: LuLayoutDashboard, label: t("dashboard") },
    {
      href: "/job-seeker/find-jobs",
      icon: HiOutlineBriefcase,
      label: "Find Jobs",
    },
    {
      href: "/job-seeker/applications",
      icon: HiOutlineUserGroup,
      label: "Applications",
    },
  ];
};

// ---------- NAVBAR LINK ----------

interface NavBarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  small: boolean;
  url: string;
  onClick?: () => void;
  activeBgClass: string;
  activeTextClass: string;
  currentRole: PortalRole;
}

const NavBarLink = ({
  onClick,
  href,
  icon: Icon,
  label,
  small,
  url,
  activeBgClass,
  activeTextClass,
  currentRole,
}: NavBarLinkProps) => {
  const isActive = url === href;

  const baseLinkClasses =
    "group flex items-center font-sans text-base transition-colors";
  const sizeClasses = small
    ? "mx-2 h-12 w-12 justify-center rounded-lg"
    : "mx-2 px-4 py-3 rounded-lg gap-x-3.5";

  const stateClasses = isActive
    ? `${activeBgClass} ${activeTextClass}`
    : `text-slate-500 hover:bg-slate-50 ${currentRole === "admin" ? "hover:text-blue-600" : currentRole === "employer" ? "hover:text-emerald-600" : "hover:text-purple-600"}`;

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`${baseLinkClasses} ${sizeClasses} ${stateClasses}`}
      >
        <Icon
          className={`h-6 w-6 flex-shrink-0 ${
            isActive
              ? activeTextClass
              : `text-slate-400 ${currentRole === "admin" ? "group-hover:text-blue-600" : currentRole === "employer" ? "group-hover:text-emerald-600" : "group-hover:text-purple-600"}`
          }`}
        />
        {!small && <span className="truncate">{label}</span>}
      </Link>
    </li>
  );
};

// ---------- NAVBAR MAIN COMPONENT ----------

const NavBar = () => {
  const router = useRouter();
  const toggleNav = useBooleanValue((state: any) => state.toggle);
  const [profile, setProfile] = useState(false);
  const toggleProfile = () => setProfile((p) => !p);

  const [isClient, setIsClient] = useState(false);
  const userData = useUserDataStore.getState().userData;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { theme, setTheme } = useTheme();
  const url = usePathname();
  const { t } = useTranslation();

  const role = getRoleFromPath(url);
  const roleColors = roleColorClasses[role];
  const portalTitle = portalTitleMap[role];
  const roleUserName = roleUserNameMap[role];

  const navLinks = buildNavLinks(role, t);

  const [small, setSmall] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbarSmall = () => {
    setSmall((s) => !s);
    toggleNav();
  };

  const navbarRef = useRef<HTMLDivElement>(null);
  const toggleNavbar = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const OpenSideBar = () => setIsOpen((prev) => !prev);

  const { language, setLanguage } = useLanguageStore() as {
    language: string;
    setLanguage: (lang: string) => void;
  };

  const [isOpenL, setIsOpenL] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenL(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isClient)
    return (
      <div className="absolute left-0 top-0 z-[9999] flex h-screen w-full items-center justify-center bg-bgPrimary">
        <Spinner />
      </div>
    );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={toggleNavbar}
        ></div>
      )}
      <header dir={language === "ar" ? "rtl" : "ltr"} ref={navbarRef}>
        <div>
          {/* mobile top bar */}
          <div className="border-borderPrimary sticky inset-x-0 top-0 z-20 border-y bg-bgPrimary px-4 sm:px-6 md:px-8 lg:hidden">
            <div className="flex items-center justify-between py-2">
              <ol className="ms-3 flex items-center whitespace-nowrap">
                <li className="flex items-center text-sm text-textPrimary">
                  {/* Breadcrumb or other content */}
                </li>
              </ol>

              <button
                onClick={OpenSideBar}
                type="button"
                className="border-borderPrimary flex items-center justify-center gap-x-1.5 rounded-lg border px-3 py-2 text-xs text-gray-500 hover:text-gray-600"
                aria-label="Sidebar"
              >
                <svg
                  className="size-4 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
                </svg>
                <span className="sr-only">Sidebar</span>
              </button>
            </div>
          </div>

          {/* sidebar */}
          <div
            id="application-sidebar"
            className={cn(
              "fixed inset-y-0 z-[60] transform bg-bgPrimary transition-all duration-300 ease-in lg:bottom-0 lg:end-auto lg:block",
              small ? "w-[90px]" : "w-[240px]",
              language === "ar" ? "right-0" : "left-0",
              small ? "" : "overflow-y-auto",
              "drop-shadow-2xl lg:drop-shadow-none",
              language === "ar"
                ? isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:translate-x-full"
                : isOpen
                  ? "max-lg:translate-x-0"
                  : "max-lg:-translate-x-full",
            )}
          >
            {/* Portal header card */}
            <Link
              href={
                role === "admin"
                  ? "/admin"
                  : role === "employer"
                    ? "/employer"
                    : "/job-seeker"
              }
              className="flex items-center gap-3 border-b bg-white px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  roleColors.accentBg,
                  roleColors.accentText,
                )}
              >
                <LuLayoutDashboard className="h-6 w-6" />
              </div>

              <span className="text-sm font-medium text-slate-700">
                {portalTitle}
              </span>
            </Link>

            <nav
              className={cn(
                "hs-accordion-group flex w-full flex-col flex-wrap",
                small ? "p-6" : "",
              )}
              data-hs-accordion-always-open
            >
              <ul className="space-y-4 px-2">
                <div
                  className={cn(
                    "flex justify-center",
                    small ? "w-[40px]" : "",
                  )}
                >
                  {small && (
                    <button onClick={toggleNavbarSmall}>
                      <svg
                        className="h-6 w-6 text-textPrimary"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </button>
                  )}
                </div>

                {navLinks.map((link) => (
                  <NavBarLink
                    onClick={() => setIsOpen(false)}
                    key={link.href}
                    href={link.href}
                    icon={link.icon}
                    label={link.label}
                    small={small}
                    url={url}
                    activeBgClass={roleColors.activeBg}
                    activeTextClass={roleColors.activeText}
                    currentRole={role}
                  />
                ))}
              </ul>
            </nav>

            {/* bottom user section */}
            <div className="fixed bottom-0 w-full">
              <div className="w-full border-t bg-white px-4 py-4">
                {/* User info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    A
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      {roleUserName}
                    </span>
                    <span className="text-xs text-slate-500">
                      useradmin@gmail.com
                    </span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/role-selection");
                  }}
                  className="mt-4 inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-500"
                >
                  <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
