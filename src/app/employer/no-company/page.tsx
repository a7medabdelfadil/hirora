"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function EmployerNoCompanyPage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    router.replace("/signin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <div className="rounded-2xl border border-yellow-200 bg-white p-8 shadow-lg flex flex-col items-center max-w-md">
        <div className="mb-4 flex items-center justify-center">
          <svg className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-yellow-900 mb-2 text-center">Company Assignment Required</h2>
        <p className="text-base text-yellow-700 mb-2 text-center">
          You have not been assigned to a company yet.
        </p>
        <p className="text-base text-yellow-700 mb-4 text-center">
          Please contact your administrator to add you to a company before using your dashboard.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-yellow-500"
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}