import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { api, type CheckInRequest, type ApiError } from "@/services/api";
import type { Gate, Zone, Subscription, Ticket } from "@/types";
import { wsService } from "@/services/ws";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { handleAPIError } from "@/utlis/helpers";

// Query Keys Factory
export const queryKeys = {
  gates: ["gates"] as const,
  gate: (gateId: string) => ["gates", gateId] as const,
  zones: (gateId: string) => ["zones", gateId] as const,
  zone: (gateId: string, zoneId: string) => ["zones", gateId, zoneId] as const,
  subscription: (subscriptionId: string) =>
    ["subscription", subscriptionId] as const,
  ticket: (ticketId: string) => ["ticket", ticketId] as const,
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
      handleAPIError(error, {
        httpsErrorMessage: "Subscription not found",
        deniedMessage: "Invalid subscription ID format",
        globalErrorMessage: "Failed to verify subscription",
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
      handleAPIError(error, {
        httpsErrorMessage: "Zone is full or no longer available",
        deniedMessage: "You don't have permission to access this zone",
        globalErrorMessage: "Check-in failed",
      });
    },
    onSettled: () => {
      // Always refetch zones after mutation settles
      queryClient.invalidateQueries({
        queryKey: queryKeys.zones(gateId),
      });
    },
  });
}

export function useCheckOut(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      forceConvertToVisitor,
    }: {
      ticketId: string;
      forceConvertToVisitor: boolean;
    }) => api.checkout({ ticketId, forceConvertToVisitor }),
    onSuccess: (response) => {
      toast.success("Check-out successful!");

      // Refetch zones to get the actual server state
      queryClient.invalidateQueries({
        queryKey: queryKeys.ticket(ticketId),
      });

      return response;
    },
    onError: (error: ApiError) => {
      handleAPIError(error, {
        httpsErrorMessage: "Ticket is full or no longer available",
        deniedMessage: "You don't have permission to access this ticket",
        globalErrorMessage: "Check-out failed",
      });
    },
    onSettled: () => {
      // Always refetch zones after mutation settles
      queryClient.invalidateQueries({
        queryKey: queryKeys.ticket(ticketId),
      });
    },
  });
}

export function useTicket(
  ticketId: string,
  options?: Partial<UseQueryOptions<Ticket>>
) {
  return useQuery({
    queryKey: queryKeys.ticket(ticketId),
    queryFn: () => api.getTicket(ticketId),
    enabled: !!ticketId,
    ...options,
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
    const handleTicketUpdate = (payload: any) => {
      if (payload.ticket) {
        // Update cached ticket data
        queryClient.setQueryData(
          queryKeys.ticket(payload.ticket.id),
          payload.ticket
        );
      }

      // Invalidate zones to reflect any changes
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
    wsService.on("ticket-update", handleTicketUpdate);
    wsService.on("connection", handleConnectionChange);

    // Subscribe to gate updates
    wsService.subscribe(gateId);

    return () => {
      wsService.off("zone-update", handleZoneUpdate);
      wsService.off("ticket-update", handleTicketUpdate);
      wsService.off("connection", handleConnectionChange);
      wsService.unsubscribe(gateId);
    };
  }, [gateId, queryClient]);
}
