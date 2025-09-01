import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGates,
  useZones,
  useSubscription,
  useCheckIn,
  useWebSocketSubscription,
} from "@/hooks/useGateQueries";
import { wsService } from "@/services/ws";
import { type CheckInRequest } from "@/services/api";
import type { Ticket, Zone } from "@/types";
import TicketModal from "@/components/gates/TicketModal";
import GateHeader from "@/components/gates/GateHeader";
import GateNotFound from "@/components/gates/GateNotFound";
import UsersTabs from "@/components/gates/UsersTabs";
import SubscriberForm from "@/components/gates/SubscriberForm";
import ZoneCard from "@/components/gates/ZoneCard";
import useDebounce from "@/hooks/useDebounce";

function GatePage() {
  const { gateId = "" } = useParams();
  const [activeTab, setActiveTab] = useState<"visitor" | "subscriber">(
    "visitor"
  );
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const debouncedSubscriptionId = useDebounce(subscriptionId);

  // WebSocket status and subscription
  const status = wsService.getStatus();
  useWebSocketSubscription(gateId);

  //queries
  const gatesQuery = useGates();
  const zonesQuery = useZones(gateId);
  const subscriptionQuery = useSubscription(debouncedSubscriptionId, {
    enabled: !!debouncedSubscriptionId && activeTab === "subscriber",
  });

  const checkInMutation = useCheckIn(gateId);

  //data
  const gate = gatesQuery.data?.find((g) => g.id === gateId);
  const zones = zonesQuery.data;
  const subscription = subscriptionQuery.data;

  const handleCheckIn = () => {
    if (!selectedZone) return;

    const checkInData: CheckInRequest = {
      gateId,
      zoneId: selectedZone.id,
      type: activeTab,
    };

    if (activeTab === "subscriber") {
      checkInData.subscriptionId = subscriptionId;
    }

    checkInMutation.mutate(checkInData, {
      onSuccess: (response) => {
        setCurrentTicket(response.ticket);
        setShowTicket(true);
        setSelectedZone(null);
        setSubscriptionId("");
      },
    });
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

  if (!gate && !gatesQuery.isLoading) {
    return <GateNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <GateHeader gate={gate} status={status} />

      <div className="mx-auto max-w-6xl px-0 py-8 md:px-2 lg:px-6">
        {/* Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <UsersTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-3 md:p-6">
            {activeTab === "subscriber" && (
              <div className="mb-6">
                <SubscriberForm
                  setSubscriptionId={setSubscriptionId}
                  subscription={subscription}
                  subscriptionId={subscriptionId}
                />
                {subscriptionQuery.error && (
                  <div className="text-sm text-red-600">
                    <p>{subscriptionQuery.error.message}</p>
                  </div>
                )}
              </div>
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
                onClick={handleCheckIn}
                disabled={
                  !selectedZone ||
                  checkInMutation.isPending ||
                  (activeTab === "subscriber" &&
                    (!subscription || !subscription.active))
                }
                className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkInMutation.isPending ? "Processing..." : "Check In"}
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
