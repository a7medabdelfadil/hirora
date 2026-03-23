import axiosInstance from "../axios";

export interface MonthlyApplicationItem {
  month?: string;
  count?: number;
}

export interface StatusBreakdownItem {
  status?: string;
  count?: number;
}

export interface JobsByCategoryItem {
  category?: string;
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

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await axiosInstance.get<AdminDashboardResponse>(
    "/api/admin/dashboard",
  );

  return response.data;
};