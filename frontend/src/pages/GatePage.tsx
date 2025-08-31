import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/services/api";
import { wsService } from "@/services/ws";
import type { Gate, Subscription, Ticket, Zone } from "@/types";
import TicketModal from "@/components/gates/TicketModal";
import GateHeader from "@/components/gates/GateHeader";
import GateNotFound from "@/components/gates/GateNotFound";
import toast from "react-hot-toast";
import UsersTabs from "@/components/gates/UsersTabs";
import SubscriberForm from "@/components/gates/subscriberForm";
import ZoneCard from "@/components/gates/ZoneCard";

function GatePage() {
  const { gateId = "" } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"visitor" | "subscriber">(
    "visitor"
  );
  const status = wsService.getStatus();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  const { data: gates } = useQuery({
    queryKey: ["gates"],
    queryFn: api.getGates,
  });
  const { data: zones } = useQuery({
    queryKey: ["zones"],
    queryFn: () => api.getZones(gateId),
  });

  const gate = gates?.find((g: Gate) => g.id === gateId);

  useEffect(() => {
    if (gateId) {
      wsService.subscribe(gateId);
    }

    const handleZoneUpdate = () => {
      console.log("runs");
      queryClient.invalidateQueries({
        queryKey: ["zones"],
      });
    };

    // Test connection events
    wsService.on("connection", (data: any) => {
      console.log("Connection status changed:", data);
    });

    wsService.on("zone-update", handleZoneUpdate);

    return () => {
      wsService.off("zone-update", handleZoneUpdate);
      wsService.unsubscribe(gateId);
    };
  }, [gateId]);

  const verifySubscription = async () => {
    if (!subscriptionId.trim()) return;

    setIsVerifying(true);
    try {
      const sub = await api.getSubscription(subscriptionId);
      setSubscription(sub);
    } catch (error: any) {
      toast.error(error?.message);
      setSubscription(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckin = async () => {
    if (!selectedZone) return;

    try {
      // setState((prev: any) => ({ ...prev, isLoading: true, error: null }));
      setIsLoading(true);
      const checkinData: any = {
        gateId,
        zoneId: selectedZone.id,
        type: activeTab,
      };

      if (activeTab === "subscriber") {
        checkinData.subscriptionId = subscriptionId;
      }

      const response = await api.checkin(checkinData);
      setCurrentTicket(response.ticket);
      setShowTicket(true);
      setSelectedZone(null);
      setSubscriptionId("");
      setSubscription(null);
      setIsLoading(false);
      // setState((prev: any) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const canSelectZone = (zone: Zone) => {
    if (!zone.open) return false;
    if (activeTab === "visitor") {
      return zone.availableForVisitors > 0;
    } else {
      return (
        zone.availableForSubscribers > 0 &&
        subscription &&
        subscription.active &&
        subscription.category === zone.categoryId
      );
    }
  };

  if (!gate) {
    return <GateNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GateHeader gate={gate} status={status} />

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <UsersTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === "subscriber" && (
              <SubscriberForm
                isVerifying={isVerifying}
                setSubscriptionId={setSubscriptionId}
                subscription={subscription}
                subscriptionId={subscriptionId}
                verifySubscription={verifySubscription}
              />
            )}

            {/* Zone Cards */}
            {zones && (
              <ZoneCard
                activeTab={activeTab}
                canSelectZone={canSelectZone}
                selectedZone={selectedZone}
                setSelectedZone={setSelectedZone}
                zones={zones}
              />
            )}

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCheckin}
                disabled={
                  !selectedZone ||
                  isLoading ||
                  (activeTab === "subscriber" &&
                    (!subscription || !subscription.active))
                }
                className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Check In"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicket && currentTicket && (
        <TicketModal
          ticket={currentTicket}
          gate={gate}
          zone={zones?.find((z) => z.id === currentTicket.zoneId)}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}

export default GatePage;
