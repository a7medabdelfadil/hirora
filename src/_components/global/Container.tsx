'use client';

import type { ReactNode } from "react";
import useLanguageStore, { useBooleanValue } from "~/APIs/store";
import { cn } from "~/lib/utils";

const Container = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguageStore();
  const bool = useBooleanValue((state) => state.boolean);
  
  return (
    <div
    dir={language === "ar" ? "rtl" : "ltr"}
      className={cn(
        "mx-3 mt-5 transition-transform duration-300 ease-in",
        {
          // LTR layout
          "lg:ml-[260px] lg:mr-6": bool && language !== "ar",
          "lg:ml-[110px] lg:mr-6": !bool && language !== "ar",
          // RTL layout
          "lg:mr-[260px] lg:ml-6": bool && language === "ar",
          "lg:mr-[110px] lg:ml-6": !bool && language === "ar",
        }
      )}
    >
      {children}
    </div>
  );
};

export default Container;