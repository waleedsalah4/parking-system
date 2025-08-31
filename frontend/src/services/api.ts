import type { Gate, Zone } from "@/types";
import { localStorageEnum } from "@/types/enums";

const BASE = "http://localhost:3000/api/v1";

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
