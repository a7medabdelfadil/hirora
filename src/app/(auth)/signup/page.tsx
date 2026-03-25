/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "~/_components/global/Input";
import Button from "~/_components/global/Button";
import { useSignUp } from "~/APIs/hooks/useAuth";
import { toast } from "react-toastify";

type FormDataType = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type FormErrorsType = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [errors, setErrors] = useState<FormErrorsType>({});

  const { mutate, isPending } = useSignUp({
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/signin");
    },
    onError: (error: any) => {
      const backendMessage = error?.response?.data?.message;

      let message = "Signup failed";

      if (backendMessage === "User already exists") {
        message = "This email is already registered. Try signing in.";
      } else if (backendMessage) {
        message = backendMessage;
      }

      toast.error(message);
    },
  });

  const validateForm = () => {
    const newErrors: FormErrorsType = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    const passwordErrors = [];

    if (formData.password.length < 8)
      passwordErrors.push("at least 8 characters");
    if (!/[A-Z]/.test(formData.password))
      passwordErrors.push("one uppercase letter");
    if (!/[a-z]/.test(formData.password))
      passwordErrors.push("one lowercase letter");
    if (!/[0-9]/.test(formData.password))
      passwordErrors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      passwordErrors.push("one special character");

    if (passwordErrors.length > 0) {
      newErrors.password = `Password must contain ${passwordErrors.join(", ")}`;
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the form errors");
      return;
    }

    mutate({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white px-10 py-10 shadow-xl max-md:mb-10">
        <h2 className="mb-8 text-center  text-lg text-slate-800">
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
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
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
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
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
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
            <p className="text-xs text-slate-400 mt-1">
              Password must be at least 8 characters and include uppercase, lowercase,
              number, and special character
            </p>
          </div>

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
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
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

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}