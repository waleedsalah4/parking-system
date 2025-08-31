import type { Subscription } from "@/types";

function SubscriberForm({
  subscription,
  setSubscriptionId,
  subscriptionId,
  isVerifying,
  verifySubscription,
}: {
  subscription: Subscription | null;
  subscriptionId: string;
  setSubscriptionId: (id: string) => void;
  verifySubscription: () => Promise<void>;
  isVerifying: boolean;
}) {
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Subscription ID
      </label>
      <div className="flex space-x-3">
        <input
          type="text"
          value={subscriptionId}
          onChange={(e) => setSubscriptionId(e.target.value)}
          placeholder="Enter subscription ID"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={verifySubscription}
          disabled={!subscriptionId.trim() || isVerifying}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </div>

      {subscription && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-800">
            {subscription.userName}
          </p>
          <p className="text-xs text-green-600">
            Category: {subscription.category}
          </p>
          <p className="text-xs text-green-600">
            Cars: {subscription.cars.map((c) => c.plate).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default SubscriberForm;
