import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Subscription } from "@/types";
import {
  useCheckOut,
  useSubscription,
  useTicket,
} from "@/hooks/useGateQueries";
import { useAuthStore } from "@/store/authStore";
import CheckPointHeader from "@/components/checkpoint/CheckPointHeader";
import SubscriptionInfo from "@/components/checkpoint/SubscriptionInfo";
import LoadingState from "@/components/checkpoint/LoadingState";
import CheckoutResults from "@/components/checkpoint/CheckoutResults";

function CheckpointPage() {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect if not employee/admin
    if (!user || !["employee", "admin"].includes(user.role)) {
      navigate("/login");
    }
  }, []);

  // Update subscription state when subscriptionData changes

  const {
    data: ticketData,
    isLoading: isTicketLoading,
    refetch: refetchTicket,
  } = useTicket(ticketId, {
    enabled: false, // We'll trigger this manually
  });

  const checkOutMutation = useCheckOut(ticketId);

  // Try to get subscription info for plate verification
  // Note: in real implementation, ticket should include subscriptionId
  // For now, we'll search through subscriptions
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    useSubscription(ticketData?.type === "subscriber" ? "sub_001" : "", {
      enabled: ticketData?.type === "subscriber",
    });

  useEffect(() => {
    if (subscriptionData) {
      setSubscription(subscriptionData);
    }
  }, [subscriptionData]);

  const handleLookup = async () => {
    if (!ticketId.trim()) return;

    try {
      await refetchTicket();
    } catch (error) {
      console.log("Lookup error:", error);
    }
  };

  const handleCheckout = async (forceConvertToVisitor = false) => {
    if (!ticketId.trim()) return;

    try {
      await checkOutMutation.mutateAsync({
        ticketId,
        forceConvertToVisitor,
      });
    } catch (error) {
      console.log("Checkout error:", error);
    }
  };

  const resetForm = () => {
    setTicketId("");
    setSubscription(null);
    checkOutMutation.reset();
  };

  const isProcessing =
    isTicketLoading || isSubscriptionLoading || checkOutMutation.isPending;

  const checkoutData = checkOutMutation.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckPointHeader username={user?.username} />

      <div className="mx-auto max-w-4xl px-2 py-8 md:px-6">
        <div className="rounded-lg bg-white p-3 shadow-lg md:p-6">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Process Checkout
          </h2>

          {/* Ticket Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ticket ID (Scan QR Code)
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Paste or type ticket ID"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLookup}
                  disabled={!ticketId.trim() || isProcessing}
                  className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isTicketLoading ? "Looking up..." : "Lookup"}
                </button>
                <button
                  onClick={() => handleCheckout(false)}
                  disabled={!ticketId.trim() || isProcessing}
                  className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {checkOutMutation.isPending ? "Processing..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          {subscription && (
            <SubscriptionInfo
              subscription={subscription}
              handleCheckout={handleCheckout}
              isProcessing={isProcessing}
            />
          )}

          {/* Loading State */}
          {isProcessing && !checkoutData && <LoadingState />}

          {/* Checkout Results */}
          {checkoutData && (
            <CheckoutResults
              checkoutData={checkoutData}
              resetForm={resetForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckpointPage;
