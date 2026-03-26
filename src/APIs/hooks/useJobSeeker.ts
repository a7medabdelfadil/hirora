import { useMutation, UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
    applyToJob,
    ApplyToJobPayload,
    ApplyToJobResponse,
  getJobseekerApplications,
  getJobseekerApplicationsStats,
  getJobseekerJobById,
  getJobseekerJobs,
  JobseekerApplicationsResponse,
  JobseekerApplicationsStats,
  JobseekerJobDetails,
  JobseekerJobItem,
} from "../features/jobSeeker";

export const useJobseekerJobs = (
  options?: Omit<UseQueryOptions<JobseekerJobItem[]>, "queryKey" | "queryFn">,
) => {
  return useQuery<JobseekerJobItem[]>({
    queryKey: ["jobseeker-jobs"],
    queryFn: getJobseekerJobs,
    ...options,
  });
};

export const useJobseekerJobDetails = (
  jobId: string,
  options?: Omit<UseQueryOptions<JobseekerJobDetails>, "queryKey" | "queryFn">,
) => {
  return useQuery<JobseekerJobDetails>({
    queryKey: ["jobseeker-job", jobId],
    queryFn: () => getJobseekerJobById(jobId),
    enabled: !!jobId,
    ...options,
  });
};

export const useApplyToJob = (
  options?: UseMutationOptions<
    ApplyToJobResponse,
    Error,
    { jobId: string; payload: ApplyToJobPayload }
  >,
) => {
  return useMutation<
    ApplyToJobResponse,
    Error,
    { jobId: string; payload: ApplyToJobPayload }
  >({
    mutationFn: applyToJob,
    ...options,
  });
};

export const useJobseekerApplications = (
  options?: Omit<
    UseQueryOptions<JobseekerApplicationsResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<JobseekerApplicationsResponse>({
    queryKey: ["jobseeker-applications"],
    queryFn: getJobseekerApplications,
    ...options,
  });
};

export const useJobseekerApplicationsStats = (
  options?: Omit<
    UseQueryOptions<JobseekerApplicationsStats>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<JobseekerApplicationsStats>({
    queryKey: ["jobseeker-applications-stats"],
    queryFn: getJobseekerApplicationsStats,
    ...options,
  });
};