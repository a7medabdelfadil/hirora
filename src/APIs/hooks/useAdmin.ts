import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { type AdminDashboardResponse, getAdminDashboard } from "../features/admin";

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