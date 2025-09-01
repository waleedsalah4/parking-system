import type { Employee } from "@/types";

function AdminUsersTable({
  employeesData,
}: {
  employeesData: Employee[] | undefined;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Employees</h3>

      {employeesData && (
        <div className="overflow-auto">
          <table className="table w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">
                  id
                </th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  username
                </th>

                <th className="px-4 py-3 text-center font-medium text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeesData?.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {employee.id}
                  </td>
                  <td className="px-4 py-3 text-center">{employee.userName}</td>
                  <td className="px-4 py-3 text-center text-red-600">
                    {employee.active ? (
                      <span className="text-sm text-green-600 hover:text-green-700">
                        active
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600 hover:text-gray-700">
                        inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsersTable;
