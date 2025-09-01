import { api, type ApiError } from "@/services/api";
import { wsService } from "@/services/ws";
import { useAdminLogsStore } from "@/store/adminLogStore";
import type { Categories, Employee, ParkingState, Zone } from "@/types";
import { handleAPIError } from "@/utlis/helpers";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Query Keys Factory
export const queryKeys = {
  reports: ["reports"] as const,
  employees: ["admin", "users"] as const,
  categories: ["categories"] as const,
  zones: ["zones"] as const,
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
    queryKey: queryKeys.employees,
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

export function useAllZones(options?: Partial<UseQueryOptions<Zone[]>>) {
  return useQuery({
    queryKey: queryKeys.zones,
    queryFn: () => api.getAllZones(),
    ...options,
  });
}

export function useCategories(
  options?: Partial<UseQueryOptions<Categories[]>>
) {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api.getCategories(),
    ...options,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {
      id: string;
      rateNormal: number;
      rateSpecial: number;
    }) => api.updateCategoryRates(body.id, body.rateNormal, body.rateSpecial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      toast.success("category updated successfully");
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "Category is full or no longer available",
        deniedMessage: "Invalid category data",
        globalErrorMessage: "Failed to update category",
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.categories,
      });
    },
  });
}

export function useToggleZone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { id: string; open: boolean }) =>
      api.toggleZoneOpen(body.id, body.open),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
      toast.success("Zone changed successfully");
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "Zone is full or no longer available",
        deniedMessage: "Invalid Zone data",
        globalErrorMessage: "Failed to update Zone",
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.zones,
      });
    },
  });
}

export function useAddRushHour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { weekDay: number; from: string; to: string }) =>
      api.addRush(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
      toast.success("Rush hour added successfully");
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "",
        deniedMessage: "Invalid data",
        globalErrorMessage: "Failed to add rush hour",
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.zones,
      });
    },
  });
}
export function useAddVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { name: string; from: string; to: string }) =>
      api.addVacation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.zones });
      toast.success("Vacation Added successfully");
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "",
        deniedMessage: "Invalid Zone dat",
        globalErrorMessage: "Failed to add vacation",
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.zones,
      });
    },
  });
}

export function useWebSocketAdminUpdate() {
  const queryClient = useQueryClient();
  const { setLogs } = useAdminLogsStore();

  useEffect(() => {
    const handleAdminUpdate = (data: any) => {
      setLogs(data);
      console.log("handleAdminUpdate runs");
      // Invalidate and refetch zones
      queryClient.invalidateQueries({
        queryKey: queryKeys.zones,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reports,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
    };

    const handleConnectionChange = (data: { status: string }) => {
      if (data.status === "connected") {
        console.log("admin => WebSocket connection status:", data.status);
      }
    };

    // Set up event listeners
    wsService.on("admin-update", handleAdminUpdate);
    wsService.on("connection", handleConnectionChange);

    return () => {
      wsService.off("admin-update", handleAdminUpdate);
      wsService.off("connection", handleConnectionChange);
    };
  }, [queryClient]);
}
