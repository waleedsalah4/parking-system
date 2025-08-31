import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Subscription } from "@/types";
import { localStorageEnum } from "@/types/enums";
import { CheckCircle } from "lucide-react";
import {
  useCheckOut,
  useSubscription,
  useTicket,
} from "@/hooks/useGateQueries";

function CheckpointPage() {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const user = JSON.parse(
    localStorage.getItem(localStorageEnum.user) as string
  );

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
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Checkout Checkpoint
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Employee: {user?.username}
              </span>
              <button
                onClick={() => navigate("/")}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Process Checkout
          </h2>

          {/* Ticket Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ticket ID (Scan QR Code)
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Paste or type ticket ID"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
              />
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

          {/* Subscription Info */}
          {subscription && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">
                Subscriber Information
              </h3>
              <p className="mb-2 text-sm text-blue-800">
                Name: {subscription.userName}
              </p>
              <div className="text-sm text-blue-800">
                <span className="font-medium">Registered Cars:</span>
                <ul className="mt-1 space-y-1">
                  {subscription.cars.map((car, idx) => (
                    <li key={idx} className="ml-4">
                      {car.plate} - {car.brand} {car.model} ({car.color})
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCheckout(true)}
                disabled={isProcessing}
                className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
              >
                Convert to Visitor (Plate Mismatch)
              </button>
            </div>
          )}

          {/* Loading State */}
          {isProcessing && !checkoutData && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            </div>
          )}

          {/* Checkout Results */}
          {checkoutData && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-green-900">
                Checkout Complete
              </h3>

              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Check-in:</span>
                  <div className="font-medium">
                    {new Date(checkoutData.checkinAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Check-out:</span>
                  <div className="font-medium">
                    {new Date(checkoutData.checkoutAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <div className="font-medium">
                    {checkoutData.durationHours} hours
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>
                  <div className="text-lg font-bold text-green-700">
                    ${checkoutData.amount}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="mt-4">
                <h4 className="mb-2 font-medium text-gray-900">
                  Rate Breakdown:
                </h4>
                <div className="space-y-2">
                  {checkoutData.breakdown.map((segment: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-white p-2 text-sm"
                    >
                      <div>
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            segment.rateMode === "special"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {segment.rateMode}
                        </span>
                        <span className="ml-2">
                          {segment.hours}h @ ${segment.rate}/hr
                        </span>
                      </div>
                      <span className="font-medium">${segment.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={resetForm}
                className="mt-4 w-full cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Process Next Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckpointPage;
