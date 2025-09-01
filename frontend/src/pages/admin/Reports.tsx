import { Spinner } from "@/components/shared/Spinner";
import { useReports } from "@/hooks/useAdminQueries";

export default function Reports() {
  const reportsQuery = useReports();
  const reportsData = reportsQuery.data;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Parking State Report
        </h2>
      </div>

      {reportsQuery.isLoading && (
        <div className="flex items-center justify-center">
          <Spinner size={32} className="text-blue-600" />
        </div>
      )}
      {reportsData && reportsData.length > 0 ? (
        <div className="overflow-auto">
          <table className="table w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">
                  Zone
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Total
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Occupied
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Free
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Reserved
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Available (Visitors)
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Subscribers
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportsData?.map((zone) => (
                <tr key={zone.zoneId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {zone.name}
                  </td>
                  <td className="px-4 py-3 text-center">{zone.totalSlots}</td>
                  <td className="px-4 py-3 text-center text-red-600">
                    {zone.occupied}
                  </td>
                  <td className="px-4 py-3 text-center text-green-600">
                    {zone.free}
                  </td>
                  <td className="px-4 py-3 text-center text-orange-600">
                    {zone.reserved}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {zone.availableForVisitors}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {zone.subscriberCount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        zone.open
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {zone.open ? "Open" : "Closed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>there's no current info to view</div>
      )}
    </div>
  );
}
