"use client";
import React from "react";
import Link from "next/link";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { usePathname } from "next/navigation";
import useLanguageStore from "~/APIs/store";
import { useTranslation } from "~/hooks/useTranslatoins";

interface BreadcrumbItem {
  labelKey: string; // e.g., "dashboard", "myCourses"
  href: string;
}

interface BreadCrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs }) => {
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isRTL = language === "ar";
  const SeparatorIcon = isRTL ? MdNavigateBefore : MdNavigateNext;

  return (
    <nav
      aria-label="breadcrumb"
      dir={isRTL ? "rtl" : "ltr"}
      className="flex items-center mb-5 flex-wrap text-base max-[550px]:text-sm gap-1"
    >
      {breadcrumbs.map((crumb, index) => {
        const isCurrent = pathname === crumb.href;
        return (
          <React.Fragment key={index}>
            <Link
              href={crumb.href}
              aria-current={isCurrent ? "page" : undefined}
              className={`transition-colors duration-300 py-1 font-medium ${
                isCurrent
                  ? "text-primary border-b-2 border-primary"
                  : "text-textSecondary hover:text-primary"
              }`}
            >
              {t(crumb.labelKey)}
            </Link>

            {index < breadcrumbs.length - 1 && (
              <SeparatorIcon
                className="text-textSecondary mx-1"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadCrumbs;
