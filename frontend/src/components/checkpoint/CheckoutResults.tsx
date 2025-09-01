import type { CheckoutResponse } from "@/services/api";
function CheckoutResults({
  checkoutData,
  resetForm,
}: {
  checkoutData: CheckoutResponse;
  resetForm: () => void;
}) {
  return (
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
          <div className="font-medium">{checkoutData.durationHours} hours</div>
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
        <h4 className="mb-2 font-medium text-gray-900">Rate Breakdown:</h4>
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
  );
}

export default CheckoutResults;
