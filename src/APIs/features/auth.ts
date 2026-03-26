import axiosInstance from "../axios";

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

export const signUp = async (
  formData: SignUpFormData,
): Promise<SignUpFormData> => {
  const response = await axiosInstance.post<SignUpFormData>(
    "/api/auth/register",
    formData,
  );

  return response.data;
};

export const login = async (
  formData: LoginFormData,
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/api/auth/login",
    formData,
  );

  return response.data;
};

export type AuthUserRole = "jobseeker" | "employer" | "admin";

export interface AuthMeJobseekerProfile {
  resume: string;
  skills: string[];
  experience: number;
  phone: string;
}

export interface AuthMeBaseUser {
  _id: string;
  name: string;
  email: string;
  role: AuthUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthMeJobseekerUser extends AuthMeBaseUser {
  role: "jobseeker";
  profile: AuthMeJobseekerProfile;
}

export interface AuthMeEmployerUser extends AuthMeBaseUser {
  role: "employer";
  company: string;
}

export interface AuthMeAdminUser extends AuthMeBaseUser {
  role: "admin";
}

export type AuthMeResponse =
  | AuthMeJobseekerUser
  | AuthMeEmployerUser
  | AuthMeAdminUser;

export const getAuthMe = async (): Promise<AuthMeResponse> => {
  const response = await axiosInstance.get<AuthMeResponse>("/api/auth/me");

  return response.data;
};