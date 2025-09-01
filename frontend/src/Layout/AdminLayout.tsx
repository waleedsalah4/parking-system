import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Car, Settings, Users } from "lucide-react";

function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated && user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-2 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-x-3">
              <Settings className="size-4 text-purple-600 md:size-6" />
              <h1 className="text-base font-bold text-gray-900 md:text-xl">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {user?.username}
              </span>
              <button
                onClick={() => window.history.back()}
                className="hidden rounded-lg bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300 md:flex"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto h-full max-w-7xl px-2 py-8 md:px-6">
        <div className="flex flex-col gap-x-2 md:flex-row md:gap-x-6">
          {/* Sidebar */}
          <div className="h-full w-full rounded-lg bg-white px-0 shadow-sm md:w-64 md:p-4">
            <nav className="invisible-scrollbar flex flex-row gap-2 overflow-x-scroll md:flex-col">
              {[
                {
                  id: "parking-state",
                  link: "/admin/reports",
                  name: "Parking State",
                  icon: Car,
                },
                {
                  id: "control-panel",
                  link: "/admin/control",
                  name: "Control Panel",
                  icon: Settings,
                },
                {
                  id: "employees",
                  link: "/admin/users",
                  name: "Employees",
                  icon: Users,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.link}
                    className={({ isActive }) =>
                      isActive
                        ? "flex w-full items-center space-x-3 rounded-lg bg-purple-100 px-3 py-2 text-purple-700"
                        : "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-nowrap">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
