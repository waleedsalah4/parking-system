import type { Subscription } from "@/types";

function SubscriptionInfo({
  subscription,
  handleCheckout,
  isProcessing,
}: {
  subscription: Subscription;
  handleCheckout: (forceConvertToVisitor?: boolean) => Promise<void>;
  isProcessing: boolean;
}) {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-medium text-blue-900">Subscriber Information</h3>
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
  );
}

export default SubscriptionInfo;
