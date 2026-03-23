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