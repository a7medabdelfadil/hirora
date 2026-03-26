import {
  useMutation,
  UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createEmployerJob,
  CreateEmployerJobPayload,
  deleteEmployerJob,
  DeleteEmployerJobPayload,
  EmployerAllApplicationsItem,
  type EmployerDashboardResponse,
  type EmployerJobApplicationItem,
  type EmployerJobItem,
  getEmployerApplications,
  getEmployerDashboard,
  getEmployerJobApplications,
  getEmployerJobs,
  updateEmployerApplicationStatus,
  UpdateEmployerApplicationStatusPayload,
  updateEmployerJob,
  UpdateEmployerJobPayload,
} from "../features/employer";

export const useEmployerDashboard = (
  options?: Omit<
    UseQueryOptions<EmployerDashboardResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<EmployerDashboardResponse>({
    queryKey: ["employer-dashboard"],
    queryFn: getEmployerDashboard,
    ...options,
  });
};

export const useEmployerJobs = (
  options?: Omit<UseQueryOptions<EmployerJobItem[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<EmployerJobItem[]>({
    queryKey: ["employer-jobs"],
    queryFn: getEmployerJobs,
    ...options,
  });
};

export const useCreateEmployerJob = (
  options?: UseMutationOptions<
    EmployerJobItem,
    Error,
    CreateEmployerJobPayload
  >,
) => {
  return useMutation<EmployerJobItem, Error, CreateEmployerJobPayload>({
    mutationFn: createEmployerJob,
    ...options,
  });
};

export const useUpdateEmployerJob = (
  options?: UseMutationOptions<
    EmployerJobItem,
    Error,
    UpdateEmployerJobPayload
  >,
) => {
  return useMutation<EmployerJobItem, Error, UpdateEmployerJobPayload>({
    mutationFn: updateEmployerJob,
    ...options,
  });
};

export const useDeleteEmployerJob = (
  options?: UseMutationOptions<void, Error, DeleteEmployerJobPayload>,
) => {
  return useMutation<void, Error, DeleteEmployerJobPayload>({
    mutationFn: deleteEmployerJob,
    ...options,
  });
};

export const useEmployerJobApplications = (
  jobId?: string,
  options?: Omit<
    UseQueryOptions<EmployerJobApplicationItem[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const normalizedJobId = typeof jobId === "string" ? jobId.trim() : "";

  return useQuery<EmployerJobApplicationItem[], Error>({
    queryKey: ["employer-job-applications", normalizedJobId],
    queryFn: () => getEmployerJobApplications(normalizedJobId),
    enabled: normalizedJobId.length > 0,
    ...options,
  });
};

export const useUpdateEmployerApplicationStatus = (
  options?: UseMutationOptions<
    EmployerJobApplicationItem,
    Error,
    UpdateEmployerApplicationStatusPayload
  >,
) => {
  return useMutation<
    EmployerJobApplicationItem,
    Error,
    UpdateEmployerApplicationStatusPayload
  >({
    mutationFn: updateEmployerApplicationStatus,
    ...options,
  });
};

export const useEmployerApplications = (
  options?: Omit<
    UseQueryOptions<EmployerAllApplicationsItem[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<EmployerAllApplicationsItem[], Error>({
    queryKey: ["employer-applications"],
    queryFn: getEmployerApplications,
    ...options,
  });
};
