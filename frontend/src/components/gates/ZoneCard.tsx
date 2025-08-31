import type { UserGateTab, Zone } from "@/types";
import { Timer, XCircle } from "lucide-react";

interface Props {
  zones: Zone[];
  canSelectZone: (zone: Zone) => boolean | null;
  setSelectedZone: (zone: Zone) => void;
  selectedZone: Zone | null;
  activeTab: UserGateTab;
}

function ZoneCard({
  zones,
  canSelectZone,
  setSelectedZone,
  selectedZone,
  activeTab,
}: Props) {
  const isCurrentlySpecial = () => {
    // Simple check for demonstration - in real app this would come from server
    const now = new Date();
    const hour = now.getHours();
    return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone) => {
        const canSelect = canSelectZone(zone);
        const isSelected = selectedZone?.id === zone.id;
        const special = isCurrentlySpecial();

        return (
          <div
            key={zone.id}
            onClick={() => canSelect && setSelectedZone(zone)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              !canSelect
                ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                : isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{zone.name}</h3>
              <div className="flex items-center space-x-1">
                {!zone.open && <XCircle className="h-4 w-4 text-red-500" />}
                {special && <Timer className="h-4 w-4 text-orange-500" />}
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{zone.totalSlots}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied:</span>
                <span className="font-medium">{zone.occupied}</span>
              </div>
              <div className="flex justify-between">
                <span>Free:</span>
                <span className="font-medium text-green-600">{zone.free}</span>
              </div>
              <div className="flex justify-between">
                <span>Reserved:</span>
                <span className="font-medium text-orange-600">
                  {zone.reserved}
                </span>
              </div>

              {/* <hr className="my-2" /> */}

              {activeTab === "visitor" ? (
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span
                    className={`font-medium ${
                      zone.availableForVisitors > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {zone.availableForVisitors}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span
                    className={`font-medium ${
                      zone.availableForSubscribers > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {zone.availableForSubscribers}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rate:</span>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${
                      special ? "text-orange-600" : "text-green-600"
                    }`}
                  >
                    ${special ? zone.rateSpecial : zone.rateNormal}/hr
                  </span>
                  {special && (
                    <div className="text-xs text-orange-500">Special Rate</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ZoneCard;
