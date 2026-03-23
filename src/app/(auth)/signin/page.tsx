"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineUser,
} from "react-icons/hi2";
import Button from "~/_components/global/Button";
import Input from "~/_components/global/Input";
import Link from "next/link";
import { useLogin } from "~/APIs/hooks/useAuth";

type Role = "admin" | "employer" | "candidate";

const roles = [
  {
    id: "admin",
    title: "System administration and analytics",
    icon: HiOutlineBuildingOffice2,
  },
  {
    id: "employer",
    title: "Post jobs and review applicants",
    icon: HiOutlineBriefcase,
  },
  {
    id: "candidate",
    title: "Search and apply for jobs",
    icon: HiOutlineUser,
  },
];

const roleFormTitleMap: Record<Role, string> = {
  admin: "Admin",
  employer: "Employer",
  candidate: "Job Seeker",
};

const roleRedirectMap: Record<Role, string> = {
  admin: "/admin",
  employer: "/employer",
  candidate: "/job-seeker",
};

export default function Page() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const { mutate, isPending } = useLogin({
    onSuccess: (data) => {
      if (data?.token) {
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      }

      if (selected) {
        router.push(roleRedirectMap[selected]);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selected) return;

    mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 pt-16">
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-blue-600 shadow-sm">
          <HiOutlineBriefcase className="h-12 w-12" />
        </div>
        <p className="text-base text-slate-700">Select your role to continue</p>
      </div>

      <div className="mb-10 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const active = selected === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelected(role.id as Role)}
              className={`flex flex-col items-center justify-center rounded-[20px] border px-7 py-6 text-center shadow-sm transition-all duration-200 ${
                active
                  ? "border-2 border-blue-500 bg-blue-50/40 md:scale-[1.07]"
                  : "scale-100 border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                  active ? "text-blue-600" : "text-slate-400"
                }`}
              >
                <Icon className="h-10 w-10" />
              </div>

              <p
                className={`text-base ${
                  active ? "text-blue-700" : "text-slate-800"
                }`}
              >
                {role.title}
              </p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white px-10 py-10 shadow-xl max-md:mb-10">
          <h2 className="mb-8 text-center text-lg text-slate-800">
            Sign in as {roleFormTitleMap[selected]}
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-white"
              theme="solid"
              border="gray"
              rounded="lg"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-white"
              theme="solid"
              border="gray"
              rounded="lg"
            />

            <Button
              as="button"
              type="submit"
              className="w-full"
              color="primary"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}