import { api, type ApiError } from "@/services/api";
import type { Employee, ParkingState } from "@/types";
import { handleAPIError } from "@/utlis/helpers";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

// Query Keys Factory
export const queryKeys = {
  reports: ["reports"] as const,
  employees: ["admin", "users"] as const,
};

// reports Hooks
export function useReports(options?: Partial<UseQueryOptions<ParkingState[]>>) {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: () => api.getParkingState(),
    ...options,
  });
}

export function useEmployees(options?: Partial<UseQueryOptions<Employee[]>>) {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: () => api.getUsers(),
    ...options,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      username: string;
      password: string;
      role: "employee" | "admin";
    }) => api.createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees });
      toast.success("user created successfully");
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "",
        deniedMessage: "Invalid user  data",
        globalErrorMessage: "Failed to create user",
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.employees,
      });
    },
  });
}
