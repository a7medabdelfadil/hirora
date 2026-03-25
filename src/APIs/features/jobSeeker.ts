import axiosInstance from "../axios";

export interface JobseekerJobCompany {
  _id: string;
  name: string;
}

export interface JobseekerJobItem {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  company: JobseekerJobCompany;
  postedBy: string;
  status: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobseekerJobDetailsCompany {
  _id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
}

export interface JobseekerJobDetails {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  company: JobseekerJobDetailsCompany;
  postedBy: string;
  status: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApplyToJobPayload {
  phone: string;
  experience: number;
  coverLetter: string;
  resume: string;
}

export interface ApplyToJobResponse {
  message?: string;
}

export interface JobseekerApplicationApplicantDetails {
  name: string;
  email: string;
  phone: string;
  experience: number;
  resume: string;
  coverLetter: string;
  skills: string[];
}

export interface JobseekerApplicationJob {
  _id: string;
  title: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
}

export interface JobseekerApplicationCompany {
  _id: string;
  name: string;
}

export interface JobseekerApplicationItem {
  _id: string;
  applicantDetails: JobseekerApplicationApplicantDetails;
  job: JobseekerApplicationJob;
  applicant: string;
  company: JobseekerApplicationCompany;
  status: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface JobseekerApplicationsStats {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
}

export interface JobseekerApplicationsResponse {
  applications: JobseekerApplicationItem[];
  stats: JobseekerApplicationsStats;
}

export const getJobseekerJobs = async (): Promise<JobseekerJobItem[]> => {
  const response = await axiosInstance.get<JobseekerJobItem[]>(
    "/api/jobseeker/jobs",
  );

  return response.data;
};

export const getJobseekerJobById = async (
  jobId: string,
): Promise<JobseekerJobDetails> => {
  const response = await axiosInstance.get<JobseekerJobDetails>(
    `/api/jobseeker/jobs/${jobId}`,
  );

  return response.data;
};

export const applyToJob = async ({
  jobId,
  payload,
}: {
  jobId: string;
  payload: ApplyToJobPayload;
}): Promise<ApplyToJobResponse> => {
  const response = await axiosInstance.post<ApplyToJobResponse>(
    `/api/jobseeker/jobs/${jobId}/apply`,
    payload,
  );

  return response.data;
};

export const getJobseekerApplications =
  async (): Promise<JobseekerApplicationsResponse> => {
    const response = await axiosInstance.get<JobseekerApplicationsResponse>(
      "/api/jobseeker/applications",
    );

    return response.data;
  };
