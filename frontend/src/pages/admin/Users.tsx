import { useEmployees } from "@/hooks/useAdminQueries";
import { useState } from "react";
import toast from "react-hot-toast";

function Users() {
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    role: "employee" as "employee" | "admin",
  });

  //queries
  const employeesQuery = useEmployees();
  const employeesData = employeesQuery.data;

  //mutations
  // const createEmployeeMutation = useCreateEmployee();

  const createEmployee = async () => {
    if (!newEmployee.username || !newEmployee.role || !newEmployee.password)
      return;
    toast.error(
      "There's no endpoint for 'creating user', kindly check your api"
    );
    // createEmployeeMutation.mutate({
    //   username: newEmployee.username,
    //   password: newEmployee.password,
    //   role: newEmployee.role,
    // });
  };

  return (
    <div className="space-y-6">
      {/* Create Employee */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Create New Employee
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={newEmployee.username}
              onChange={(e) =>
                setNewEmployee((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={newEmployee.password}
              onChange={(e) =>
                setNewEmployee((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              value={newEmployee.role}
              onChange={(e) =>
                setNewEmployee((prev) => ({
                  ...prev,
                  role: e.target.value as "employee" | "admin",
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button
          onClick={createEmployee}
          disabled={
            // createEmployeeMutation.isPending ||
            !newEmployee.username || !newEmployee.role || !newEmployee.password
          }
          className="mt-4 cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {/* {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"} */}
          Create Employee
        </button>
      </div>

      {/* Employee List */}
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
                    <td className="px-4 py-3 text-center">
                      {employee.userName}
                    </td>
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
    </div>
  );
}

export default Users;
