import { api } from "@/services/api";
import type { ParkingState } from "@/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// Query Keys Factory
export const queryKeys = {
  reports: ["reports"] as const,
};

// reports Hooks
export function useReports(options?: Partial<UseQueryOptions<ParkingState[]>>) {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: () => api.getParkingState(),
    ...options,
  });
}
