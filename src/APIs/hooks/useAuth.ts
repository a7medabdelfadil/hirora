import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  AuthMeResponse,
  getAuthMe,
  login,
  LoginFormData,
  LoginResponse,
  signUp,
  type SignUpFormData,
} from "../features/auth";

export const useSignUp = (
  options?: UseMutationOptions<SignUpFormData, Error, SignUpFormData>,
) => {
  const queryClient = useQueryClient();

  return useMutation<SignUpFormData, Error, SignUpFormData>({
    mutationFn: signUp,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    ...options,
  });
};

export const useLogin = (
  options?: UseMutationOptions<LoginResponse, Error, LoginFormData>,
) => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: login,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    ...options,
  });
};

export const useAuthMe = (
  options?: Omit<UseQueryOptions<AuthMeResponse>, "queryKey" | "queryFn">,
) => {
  return useQuery<AuthMeResponse>({
    queryKey: ["auth-me"],
    queryFn: getAuthMe,
    ...options,
  });
};
