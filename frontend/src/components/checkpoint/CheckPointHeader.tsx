import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CheckPointHeader({ username }: { username?: string }) {
  const navigate = useNavigate();
  return (
    <div className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-4xl px-2 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <CheckCircle className="size-3 text-green-600 md:size-6" />
            <h1 className="text-base font-bold text-gray-900 md:text-xl">
              Checkout Checkpoint
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-sm text-gray-600">Employee: {username}</span>
            <button
              onClick={() => navigate("/")}
              className="hidden rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 md:flex"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckPointHeader;
