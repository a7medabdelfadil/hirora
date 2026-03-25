import axiosInstance from "../axios";

export interface MonthlyApplicationItem {
  _id?: number;
  count?: number;
}

export interface StatusBreakdownItem {
  _id?: string;
  count?: number;
}

export interface JobsByCategoryItem {
  _id?: string;
  count?: number;
}

export interface AdminDashboardResponse {
  companiesCount: number;
  activeJobsCount: number;
  jobseekersCount: number;
  applicationsCount: number;
  monthlyApplications: MonthlyApplicationItem[];
  statusBreakdown: StatusBreakdownItem[];
  jobsByCategory: JobsByCategoryItem[];
}

export interface CompanyOwner {
  _id: string;
  name: string;
  email: string;
}

export interface AdminCompanyItem {
  _id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  status: string;
  owner: CompanyOwner;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCompanyPayload {
  name: string;
  industry: string;
  location: string;
  size: string;
  owner: string;
}

export interface AdminEmployerItem {
  _id: string;
  name: string;
  email: string;
}

export interface UpdateCompanyStatusPayload {
  companyId: string;
  status: "active" | "inactive";
}

export interface AdminJobCompany {
  _id: string;
  name: string;
}

export interface AdminJobPostedBy {
  _id: string;
  name: string;
}

export interface AdminJobItem {
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
  company: AdminJobCompany;
  postedBy: AdminJobPostedBy;
  status: string;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AdminApplicationApplicantDetails {
  name: string;
  email: string;
  phone: string;
  experience: number;
  resume: string;
  coverLetter: string;
  skills: string[];
}

export interface AdminApplicationJob {
  _id: string;
  title: string;
}

export interface AdminApplicationApplicant {
  _id: string;
  name: string;
  email: string;
}

export interface AdminApplicationCompany {
  _id: string;
  name: string;
}

export interface AdminApplicationItem {
  _id: string;
  applicantDetails: AdminApplicationApplicantDetails;
  job: AdminApplicationJob;
  applicant: AdminApplicationApplicant;
  company: AdminApplicationCompany;
  status: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await axiosInstance.get<AdminDashboardResponse>(
    "/api/admin/dashboard",
  );

  return response.data;
};

export const getAdminCompanies = async (): Promise<AdminCompanyItem[]> => {
  const response = await axiosInstance.get<AdminCompanyItem[]>(
    "/api/admin/companies",
  );

  return response.data;
};

export const createCompany = async (
  payload: CreateCompanyPayload,
): Promise<AdminCompanyItem> => {
  const response = await axiosInstance.post<AdminCompanyItem>(
    "/api/admin/companies",
    payload,
  );

  return response.data;
};

export const getAdminEmployers = async (): Promise<AdminEmployerItem[]> => {
  const response = await axiosInstance.get<AdminEmployerItem[]>(
    "/api/admin/employers",
  );

  return response.data;
};

export const updateCompanyStatus = async ({
  companyId,
  status,
}: UpdateCompanyStatusPayload): Promise<AdminCompanyItem> => {
  const response = await axiosInstance.put<AdminCompanyItem>(
    `/api/admin/companies/${companyId}/status`,
    { status },
  );

  return response.data;
};

export const getAdminJobs = async (): Promise<AdminJobItem[]> => {
  const response = await axiosInstance.get<AdminJobItem[]>("/api/admin/jobs");

  return response.data;
};

export const getAdminApplications = async (): Promise<
  AdminApplicationItem[]
> => {
  const response = await axiosInstance.get<AdminApplicationItem[]>(
    "/api/admin/applications",
  );

  return response.data;
};
