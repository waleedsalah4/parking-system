import { useEffect, useState } from "react";
import type { Gate } from "@/types";
import type { Status } from "@/types";
import { Building, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GateHeader({
  gate,
  status,
}: {
  gate: Gate | undefined;
  status: Status;
}) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {gate?.name}
                </h1>
                <p className="text-sm text-gray-600">{gate?.location}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  status === "connected"
                    ? "bg-green-500"
                    : status === "disconnected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              />
              <span className="text-sm text-gray-600 capitalize">{status}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-mono text-sm text-gray-700">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
