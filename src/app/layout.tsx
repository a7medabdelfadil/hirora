"use client";
import "~/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GeistSans } from "geist/font/sans";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "~/trpc/react";
import { usePathname } from "next/navigation";
import ThemeProvider from "./providers/themeProvider";
import { useState } from "react";
import NavBar from "~/_components/NavBar";
import useLanguageStore from "~/APIs/store";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());
  const isLoginPage = pathname === "/signin" || pathname === "/signup";
  const { language } = useLanguageStore() as {
    language: string;
  };

  return (
    <html
      lang="en"
      className={GeistSans.variable}
      suppressHydrationWarning
    >
      <head>
        <title>Hire Hub</title>
        <meta
          name="description"
          content="We are innovix team and this is Hire Hub platform."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href="/images/innovix-white-top.png"
        />
      </head>
      <body className="bg-bgSecondary">
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {!isLoginPage && <NavBar />}
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <ToastContainer />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
