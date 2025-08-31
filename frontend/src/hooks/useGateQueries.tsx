import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  api,
  getErrorMessage,
  getFieldErrors,
  isHttpError,
  type CheckInRequest,
  type ApiError,
} from "@/services/api";
import type { Gate, Zone, Subscription } from "@/types";
import { wsService } from "@/services/ws";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Query Keys Factory
export const queryKeys = {
  gates: ["gates"] as const,
  gate: (gateId: string) => ["gates", gateId] as const,
  zones: (gateId: string) => ["zones", gateId] as const,
  zone: (gateId: string, zoneId: string) => ["zones", gateId, zoneId] as const,
  subscription: (subscriptionId: string) =>
    ["subscription", subscriptionId] as const,
};

// Gates Hooks
export function useGates(options?: Partial<UseQueryOptions<Gate[]>>) {
  return useQuery({
    queryKey: queryKeys.gates,
    queryFn: () => api.getGates(),
    ...options,
  });
}

// Zones Hooks
export function useZones(
  gateId: string,
  options?: Partial<UseQueryOptions<Zone[]>>
) {
  return useQuery({
    queryKey: queryKeys.zones(gateId),
    queryFn: () => api.getZones(gateId),
    enabled: !!gateId,

    ...options,
  });
}

// Subscription Hooks
export function useSubscription(
  subscriptionId: string,
  options?: Partial<UseQueryOptions<Subscription>>
) {
  return useQuery({
    queryKey: queryKeys.subscription(subscriptionId),
    queryFn: () => api.getSubscription(subscriptionId),
    enabled: !!subscriptionId.trim(),
    ...options,
  });
}

export function useVerifySubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => api.getSubscription(subscriptionId),
    onSuccess: (data, subscriptionId) => {
      // Cache the subscription data
      queryClient.setQueryData(queryKeys.subscription(subscriptionId), data);
      toast.success("Subscription verified successfully");
    },
    onError: (error: ApiError, subscriptionId) => {
      const message = getErrorMessage(error);
      const fieldErrors = getFieldErrors(error);

      // Handle specific error cases
      if (isHttpError(error, 404)) {
        toast.error("Subscription not found");
      } else if (isHttpError(error, 400)) {
        toast.error("Invalid subscription ID format");
      } else {
        toast.error(message || "Failed to verify subscription");
      }

      // Show field-specific errors if any
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        messages.forEach((msg) => {
          toast.error(`${field}: ${msg}`, { duration: 4000 });
        });
      });

      // Clear any cached subscription data
      queryClient.removeQueries({
        queryKey: queryKeys.subscription(subscriptionId),
      });
    },
  });
}

// Check-in Hook
export function useCheckIn(gateId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckInRequest) => api.checkin(data),
    onSuccess: (response) => {
      toast.success("Check-in successful!");

      // Refetch zones to get the actual server state
      queryClient.invalidateQueries({
        queryKey: queryKeys.zones(gateId),
      });

      return response;
    },
    onError: (error: ApiError) => {
      const message = getErrorMessage(error);
      const fieldErrors = getFieldErrors(error);

      // Handle specific check-in errors
      if (isHttpError(error, 409)) {
        toast.error("Zone is full or no longer available");
      } else if (isHttpError(error, 400)) {
        // Show field-specific validation errors
        if (Object.keys(fieldErrors).length > 0) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            messages.forEach((msg) => {
              toast.error(`${field}: ${msg}`, { duration: 5000 });
            });
          });
        } else {
          toast.error(message || "Invalid check-in data");
        }
      } else if (isHttpError(error, 403)) {
        toast.error("You don't have permission to access this zone");
      } else {
        toast.error(message || "Check-in failed");
      }
    },
    onSettled: () => {
      // Always refetch zones after mutation settles
      queryClient.invalidateQueries({
        queryKey: queryKeys.zones(gateId),
      });
    },
  });
}

// WebSocket Integration Hook
export function useWebSocketSubscription(gateId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!gateId) return;

    const handleZoneUpdate = () => {
      // Invalidate and refetch zones
      queryClient.invalidateQueries({
        queryKey: queryKeys.zones(gateId),
      });
    };

    const handleConnectionChange = (data: { status: string }) => {
      console.log("WebSocket connection status:", data.status);

      if (data.status === "connected") {
        // Re-subscribe when connection is restored
        wsService.subscribe(gateId);

        // Refetch critical data when reconnected
        queryClient.invalidateQueries({
          queryKey: queryKeys.zones(gateId),
        });
      }
    };

    // Set up event listeners
    wsService.on("zone-update", handleZoneUpdate);
    wsService.on("connection", handleConnectionChange);

    // Subscribe to gate updates
    wsService.subscribe(gateId);

    return () => {
      wsService.off("zone-update", handleZoneUpdate);
      wsService.off("connection", handleConnectionChange);
      wsService.unsubscribe(gateId);
    };
  }, [gateId, queryClient]);
}
