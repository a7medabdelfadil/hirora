/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "~/_components/global/Input";
import Button from "~/_components/global/Button";
import { useSignUp } from "~/APIs/hooks/useAuth";
import { toast } from "react-toastify";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const { mutate, isPending } = useSignUp({
    onSuccess: () => {
    toast.success("Account created successfully");
    router.push("/signin");
  },
  onError: (error) => {
    toast.error(error.message || "Signup failed");
  },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white px-10 py-10 shadow-xl max-md:mb-10">
        <h2 className="mb-8 text-center text-lg text-slate-800">
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white"
            theme="solid"
            border="gray"
            rounded="lg"
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-white"
            theme="solid"
            border="gray"
            rounded="lg"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-white"
            theme="solid"
            border="gray"
            rounded="lg"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="admin">admin</option>
              <option value="employer">employer</option>
              <option value="jobseeker">job seeker</option>
            </select>
          </div>

          <Button
            as="button"
            type="submit"
            className="w-full"
            color="primary"
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}