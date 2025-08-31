import type { UserGateTab } from "@/types";
import { Shield, Users } from "lucide-react";

function UsersTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: UserGateTab;
  setActiveTab: (activeTab: UserGateTab) => void;
}) {
  return (
    <div className="flex">
      <button
        onClick={() => setActiveTab("visitor")}
        className={`flex-1 px-6 py-4 text-center font-medium ${
          activeTab === "visitor"
            ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Visitor</span>
        </div>
      </button>
      <button
        onClick={() => setActiveTab("subscriber")}
        className={`flex-1 px-6 py-4 text-center font-medium ${
          activeTab === "subscriber"
            ? "border-b-2 border-blue-600 bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Subscriber</span>
        </div>
      </button>
    </div>
  );
}

export default UsersTabs;
