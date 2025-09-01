import type { Zone } from "@/types";

function ZoneControl({
  zonesData,
  toggleZone,
}: {
  zonesData: Zone[] | undefined;
  toggleZone: (id: string, open: boolean) => void;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Zone Controls
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {zonesData?.map((zone) => (
          <div key={zone.id} className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-900">{zone.name}</span>
                <span
                  className={`size-2 rounded-full ${zone.open ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>
              <button
                onClick={() => toggleZone(zone.id, !zone.open)}
                className={`cursor-pointer rounded px-2 py-1 text-xs ${
                  zone.open
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {zone.open ? "Close" : "Open"}
              </button>
            </div>
            <div className="text-xs text-gray-600">
              {zone.occupied}/{zone.totalSlots} occupied
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ZoneControl;
