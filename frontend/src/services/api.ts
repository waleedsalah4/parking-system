import type {
  Gate,
  LoginResponse,
  ParkingState,
  Subscription,
  Ticket,
  UserGateTab,
  Zone,
} from "@/types";
import { localStorageEnum } from "@/types/enums";

export interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  isApiError: true;
}

export interface CheckInRequest {
  gateId: string;
  zoneId: string;
  type: UserGateTab;
  subscriptionId?: string;
}

export interface CheckInResponse {
  ticket: Ticket;
  message: string;
}

export interface CheckoutResponse {
  ticketId: string;
  checkinAt: string;
  checkoutAt: string;
  durationHours: number;
  breakdown: {
    from: string;
    to: string;
    hours: number;
    rateMode: string;
    rate: any;
    amount: number;
  }[];
  amount: number;
  zoneState: Zone;
}

class ApiService {
  private baseURL = "http://localhost:3000/api/v1";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem(localStorageEnum.token)
          ? {
              Authorization: `Bearer ${localStorage.getItem(
                localStorageEnum.token
              )}`,
            }
          : {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: ApiErrorResponse;

        try {
          errorData = await response.json();
        } catch {
          // If response isn't JSON, create a generic error
          errorData = {
            status: "error",
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const error = new Error(errorData.message) as ApiError;
        error.status = response.status;
        error.errors = errorData.errors;
        error.isApiError = true;

        throw error;
      }

      const data = await response.json();

      // Handle successful responses that still have error status
      if (data.status === "error") {
        const error = new Error(data.message) as ApiError;
        error.errors = data.errors;
        error.isApiError = true;
        throw error;
      }

      return data;
    } catch (error) {
      if ((error as ApiError).isApiError) {
        throw error;
      }

      // Network or other errors
      const networkError = new Error(
        error instanceof Error ? error.message : "Network error occurred"
      ) as ApiError;
      networkError.isApiError = true;

      throw networkError;
    }
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<LoginResponse> {
    console.log(credentials);
    return this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }
  // Gates
  async getGates(): Promise<Gate[]> {
    return this.request<Gate[]>("/master/gates");
  }

  // Zones
  async getZones(gateId: string): Promise<Zone[]> {
    return this.request<Zone[]>(`/master/zones?gateId/${gateId}`);
  }

  // Subscriptions
  async getSubscription(subscriptionId: string): Promise<Subscription> {
    return this.request<Subscription>(`/subscriptions/${subscriptionId}`);
  }

  // Check-in
  async checkin(data: CheckInRequest): Promise<CheckInResponse> {
    return this.request<CheckInResponse>("/tickets/checkin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Tickets
  async getTicket(ticketId: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${ticketId}`);
  }

  async checkout(body: {
    ticketId: string;
    forceConvertToVisitor?: boolean;
  }): Promise<CheckoutResponse> {
    return this.request<CheckoutResponse>(`/tickets/checkout`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  //reports
  async getParkingState(): Promise<ParkingState[]> {
    return this.request<ParkingState[]>(`/admin/reports/parking-state/`);
  }
}

export const api = new ApiService();

// Helper function to extract field errors for form validation
export function getFieldErrors(error: unknown): Record<string, string[]> {
  if (error && typeof error === "object" && "errors" in error) {
    return (error as ApiError).errors || {};
  }
  return {};
}

// Helper function to get the main error message
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return (error as ApiError).message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Helper function to check if error is a specific HTTP status
export function isHttpError(error: unknown, status: number): boolean {
  if (error) {
    return (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as ApiError).status === status
    );
  }
  return false;
}
/*
async function http(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(localStorage.getItem(localStorageEnum.token)
        ? {
            Authorization: `Bearer ${localStorage.getItem(
              localStorageEnum.token
            )}`,
          }
        : {}),
    },
    ...init,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // public
  async getGates(): Promise<Gate[]> {
    return http("/master/gates");
  },
  async getZones(gateId: string): Promise<Zone[]> {
    return http(`/master/zones?gateId=${encodeURIComponent(gateId)}`);
  },
  async getSubscription(id: string) {
    return http(`/subscriptions/${id}`);
  },
  async checkin(body: {
    gateId: string;
    zoneId: string;
    type: "visitor" | "subscriber";
    subscriptionId?: string;
  }) {
    return http("/tickets/checkin", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
*/
