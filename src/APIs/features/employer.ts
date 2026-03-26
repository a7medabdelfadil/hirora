import axiosInstance from "../axios";

export interface EmployerDashboardCompany {
  _id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmployerDashboardApplicantDetails {
  name: string;
  email: string;
  phone: string;
  experience: number;
  resume: string;
  coverLetter: string;
  skills: string[];
}

export interface EmployerDashboardRecentApplicationJob {
  _id: string;
  title: string;
}

export interface EmployerDashboardRecentApplicationApplicant {
  _id: string;
  name: string;
  email: string;
}

export interface EmployerDashboardRecentApplicationItem {
  _id: string;
  applicantDetails: EmployerDashboardApplicantDetails;
  job: EmployerDashboardRecentApplicationJob;
  applicant: EmployerDashboardRecentApplicationApplicant;
  company: string;
  status: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmployerDashboardJobPerformanceItem {
  _id: string;
  title: string;
  applicantsCount: number;
}

export interface EmployerDashboardResponse {
  company: EmployerDashboardCompany;
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  recentApplications: EmployerDashboardRecentApplicationItem[];
  jobPerformance: EmployerDashboardJobPerformanceItem[];
}

export interface EmployerJobItem {
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
  company: string;
  postedBy: string;
  status: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateEmployerJobPayload {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
}

export interface UpdateEmployerJobPayload {
  jobId: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  category: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
}

export interface EmployerJobApplicationApplicantDetails {
  name: string;
  email: string;
  phone: string;
  experience: number;
  resume: string;
  coverLetter: string;
  skills: string[];
}

export interface EmployerJobApplicationApplicant {
  profile: {
    skills: string[];
  };
  _id: string;
  name: string;
  email: string;
}

export interface EmployerJobApplicationItem {
  _id: string;
  applicantDetails: EmployerJobApplicationApplicantDetails;
  job: string;
  applicant: EmployerJobApplicationApplicant;
  company: string;
  status: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type EmployerApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "accepted";

export interface UpdateEmployerApplicationStatusPayload {
  applicationId: string;
  status: EmployerApplicationStatus;
}

export interface EmployerAllApplicationsJob {
  _id: string;
  title: string;
  category: string;
  type: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  status: string;
}

export interface EmployerAllApplicationsApplicant {
  profile: {
    skills: string[];
  };
  _id: string;
  name: string;
  email: string;
}

export interface EmployerAllApplicationsApplicantDetails {
  name: string;
  email: string;
  phone: string;
  experience: number;
  resume: string;
  coverLetter: string;
  skills: string[];
}

export interface EmployerAllApplicationsItem {
  applicantDetails: EmployerAllApplicationsApplicantDetails;
  _id: string;
  job: EmployerAllApplicationsJob;
  applicant: EmployerAllApplicationsApplicant;
  company: string;
  status: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/* =========================
   EXISTING APIS
========================= */

export const getEmployerDashboard =
  async (): Promise<EmployerDashboardResponse> => {
    const response = await axiosInstance.get<EmployerDashboardResponse>(
      "/api/employer/dashboard",
    );

    return response.data;
  };

export const getEmployerJobs = async (): Promise<EmployerJobItem[]> => {
  const response =
    await axiosInstance.get<EmployerJobItem[]>("/api/employer/jobs");

  return response.data;
};

export const createEmployerJob = async (
  payload: CreateEmployerJobPayload,
): Promise<EmployerJobItem> => {
  const response = await axiosInstance.post<EmployerJobItem>(
    "/api/employer/jobs",
    payload,
  );

  return response.data;
};

export const updateEmployerJob = async ({
  jobId,
  ...payload
}: UpdateEmployerJobPayload): Promise<EmployerJobItem> => {
  const response = await axiosInstance.put<EmployerJobItem>(
    `/api/employer/jobs/${jobId}`,
    payload,
  );

  return response.data;
};

export interface DeleteEmployerJobPayload {
  jobId: string;
}

export const deleteEmployerJob = async ({
  jobId,
}: DeleteEmployerJobPayload): Promise<void> => {
  await axiosInstance.delete(`/api/employer/jobs/${jobId}`);
};

export const getEmployerJobApplications = async (
  jobId: string,
): Promise<EmployerJobApplicationItem[]> => {
  const response = await axiosInstance.get<EmployerJobApplicationItem[]>(
    `/api/employer/jobs/${jobId}/applications`,
  );

  return response.data;
};

export const getEmployerApplications =
  async (): Promise<EmployerAllApplicationsItem[]> => {
    const response = await axiosInstance.get<EmployerAllApplicationsItem[]>(
      "/api/employer/applications",
    );

    return response.data;
  };

export const updateEmployerApplicationStatus = async ({
  applicationId,
  status,
}: UpdateEmployerApplicationStatusPayload): Promise<EmployerJobApplicationItem> => {
  const response = await axiosInstance.put<EmployerJobApplicationItem>(
    `/api/employer/applications/${applicationId}/status`,
    { status },
  );

  return response.data;
};