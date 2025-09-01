import { queryKeys, useReports } from "@/hooks/useAdminQueries";
import { wsService } from "@/services/ws";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function AdminView() {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const parkingQuery = useReports();
  const parkingData = parkingQuery.data;

  useEffect(() => {
    const handleAdminUpdate = (data: any) => {
      setAuditLog((prev) => [data, ...prev.slice(0, 9)]); // Keep last 10 entries
      // Refresh parking state on relevant updates
      if (
        ["zone-opened", "zone-closed", "category-rates-changed"].includes(
          data.action
        )
      ) {
        queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      }
    };

    wsService.on("admin-update", handleAdminUpdate);

    return () => {
      wsService.off("admin-update", handleAdminUpdate);
    };
  }, []);
  const totalSlots = parkingData?.reduce(
    (sum: number, zone: any) => sum + zone.totalSlots,
    0
  );
  const totalOccupied = parkingData?.reduce(
    (sum: number, zone: any) => sum + zone.occupied,
    0
  );
  const totalFree = parkingData?.reduce(
    (sum: number, zone: any) => sum + zone.free,
    0
  );
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          System Overview
        </h2>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">{totalSlots}</div>
            <div className="text-sm text-blue-600">Total Slots</div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <div className="text-2xl font-bold text-red-600">
              {totalOccupied}
            </div>
            <div className="text-sm text-red-600">Occupied</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">{totalFree}</div>
            <div className="text-sm text-green-600">Available</div>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {auditLog.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            auditLog.map((entry: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {entry.action}
                  </span>
                  <span className="ml-2 text-gray-600">
                    on {entry.targetType} {entry.targetId}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminView;
