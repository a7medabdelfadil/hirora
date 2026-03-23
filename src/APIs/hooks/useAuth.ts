import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { login, LoginFormData, LoginResponse, signUp, type SignUpFormData } from "../features/auth";

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