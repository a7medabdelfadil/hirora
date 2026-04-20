/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { toast } from "react-toastify";

type Role = "admin" | "employer" | "jobseeker";

type FormErrorsType = {
  email?: string;
  password?: string;
  role?: string;
};

const roles = [
  {
    id: "admin",
    role: "Admin",
    title: "System administration and analytics",
    icon: HiOutlineBuildingOffice2,
  },
  {
    id: "employer",
    role: "Employer",
    title: "Post jobs and review applicants",
    icon: HiOutlineBriefcase,
  },
  {
    id: "jobseeker",
    role: "Job Seeker",
    title: "Search and apply for jobs",
    icon: HiOutlineUser,
  },
];

const roleFormTitleMap: Record<Role, string> = {
  admin: "Admin",
  employer: "Employer",
  jobseeker: "Job Seeker",
};

const roleRedirectMap: Record<Role, string> = {
  admin: "/admin",
  employer: "/employer",
  jobseeker: "/job-seeker",
};

export default function Page() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrorsType>({});

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
    onError: (error: any) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message || "";

  let message = "Login failed. Please try again.";

  if (
    backendMessage === "Invalid credentials" ||
    backendMessage === "Unauthorized" ||
    backendMessage === "Invalid email or password"
  ) {
    message = "Incorrect email or password.";
    setErrors((prev) => ({
      ...prev,
      email: " ",
      password: "Incorrect email or password",
    }));
  } else if (
    backendMessage === "Invalid role" ||
    backendMessage.includes("not a") ||
    backendMessage.toLowerCase().includes("role")
  ) {
    message = "Please choose the correct account type.";
    setErrors((prev) => ({
      ...prev,
      role: "Please choose the correct account type.",
    }));
  } else if (backendMessage === "User not found") {
    message = "No account was found with this email.";
    setErrors((prev) => ({
      ...prev,
      email: "No account was found with this email",
    }));
  } else if (backendMessage === "Too many requests" || status === 429) {
    message = "Too many attempts. Please try again later.";
  }

  toast.error(message);
},
  });

  const validateForm = () => {
    const newErrors: FormErrorsType = {};

    if (!selected) {
      newErrors.role = "Please select your role";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSelectRole = (role: Role) => {
    setSelected(role);
    setErrors((prev) => ({
      ...prev,
      role: "",
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the form errors");
      return;
    }

    mutate({
      email: formData.email.trim(),
      password: formData.password,
      role: selected!,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 pt-16">
      <div className="mb-10 flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-blue-600 shadow-sm">
          <HiOutlineBriefcase className="h-12 w-12" />
        </div>
        <p className="text-base text-slate-700">Select your role to continue</p>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role}</p>
        )}
      </div>

      <div className="mb-10 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const active = selected === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => handleSelectRole(role.id as Role)}
              className={`flex flex-col items-center justify-center rounded-[20px] border px-7 py-6 text-center shadow-sm transition-all duration-200 ${active
                  ? "border-2 border-blue-500 bg-blue-50/40 md:scale-[1.07]"
                  : "scale-100 border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${active ? "text-blue-600" : "text-slate-400"
                  }`}
              >
                <Icon className="h-10 w-10" />
              </div>

              <p
                className={`text-lg font-semibold ${active ? "text-blue-700" : "text-slate-800"
                  }`}
              >
                {role.role}
              </p>
              <p
                className={`text-base ${active ? "text-blue-700" : "text-slate-800"
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
            <div>
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
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

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