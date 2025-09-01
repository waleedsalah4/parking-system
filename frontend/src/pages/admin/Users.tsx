import AddUser from "@/components/admin/users/AddUser";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import { Spinner } from "@/components/shared/Spinner";
import { useEmployees } from "@/hooks/useAdminQueries";

function Users() {
  //queries
  const employeesQuery = useEmployees();
  const employeesData = employeesQuery.data;

  return (
    <div className="space-y-6">
      <AddUser />

      {employeesQuery.isLoading && (
        <div className="flex items-center justify-center">
          <Spinner size={32} className="text-blue-600" />
        </div>
      )}
      {employeesData && employeesData.length > 0 ? (
        <AdminUsersTable employeesData={employeesData} />
      ) : (
        <div>there's no current users to view</div>
      )}
    </div>
  );
}

export default Users;
