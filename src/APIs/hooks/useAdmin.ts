import { useMutation, UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { AdminApplicationItem, type AdminCompanyItem, type AdminDashboardResponse, AdminEmployerItem, AdminJobItem, createCompany, CreateCompanyPayload, getAdminApplications, getAdminCompanies, getAdminDashboard, getAdminEmployers, getAdminJobs, updateCompanyStatus, UpdateCompanyStatusPayload } from "../features/admin";

export const useAdminDashboard = (
  options?: Omit<
    UseQueryOptions<AdminDashboardResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AdminDashboardResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    ...options,
  });
};

export const useAdminCompanies = (
  options?: Omit<
    UseQueryOptions<AdminCompanyItem[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AdminCompanyItem[]>({
    queryKey: ["admin-companies"],
    queryFn: getAdminCompanies,
    ...options,
  });
};

export const useCreateCompany = (
  options?: UseMutationOptions<AdminCompanyItem, Error, CreateCompanyPayload>,
) => {
  return useMutation<AdminCompanyItem, Error, CreateCompanyPayload>({
    mutationFn: createCompany,
    ...options,
  });
};

export const useAdminEmployers = (
  options?: Omit<
    UseQueryOptions<AdminEmployerItem[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AdminEmployerItem[]>({
    queryKey: ["admin-employers"],
    queryFn: getAdminEmployers,
    ...options,
  });
};

export const useUpdateCompanyStatus = (
  options?: UseMutationOptions<
    AdminCompanyItem,
    Error,
    UpdateCompanyStatusPayload
  >,
) => {
  return useMutation<
    AdminCompanyItem,
    Error,
    UpdateCompanyStatusPayload
  >({
    mutationFn: updateCompanyStatus,
    ...options,
  });
};

export const useAdminJobs = (
  options?: Omit<
    UseQueryOptions<AdminJobItem[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AdminJobItem[]>({
    queryKey: ["admin-jobs"],
    queryFn: getAdminJobs,
    ...options,
  });
};

export const useAdminApplications = (
  options?: Omit<
    UseQueryOptions<AdminApplicationItem[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<AdminApplicationItem[]>({
    queryKey: ["admin-applications"],
    queryFn: getAdminApplications,
    ...options,
  });
};