import { useState } from "react";
import toast from "react-hot-toast";

function AddUser() {
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    password: "",
    role: "employee" as "employee" | "admin",
  });

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
  );
}

export default AddUser;
