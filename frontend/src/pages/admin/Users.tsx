import AddUser from "@/components/admin/users/AddUser";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import { useEmployees } from "@/hooks/useAdminQueries";

function Users() {
  //queries
  const employeesQuery = useEmployees();
  const employeesData = employeesQuery.data;

  return (
    <div className="space-y-6">
      {/* Create Employee */}
      <AddUser />

      {/* Employee List */}
      <AdminUsersTable employeesData={employeesData} />
    </div>
  );
}

export default Users;
