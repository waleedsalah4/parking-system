import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ParkingCircle } from "lucide-react";
function Navbar() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };
  const getClassName = (isActive: boolean) => {
    return isActive
      ? "flex w-full items-center rounded-lg bg-blue-100 px-1 md:px-3 py-1 md:py-2 text-blue-700"
      : "flex w-full items-center rounded-lg px-1 md:px-3 py-1 md:py-2 text-gray-600 hover:bg-gray-100";
  };
  return (
    <header className="sticky top-0 z-10 bg-white/80 shadow backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-1 px-1 py-3 md:flex-row md:gap-4 md:px-4">
        <NavLink end to="/" className="flex items-center gap-x-1 font-semibold">
          <ParkingCircle className="h-6 w-6 text-blue-600" />
          <h1>Parking System</h1>
        </NavLink>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            end
            to="/"
            className={({ isActive }) => getClassName(isActive)}
          >
            Gates
          </NavLink>
          <NavLink
            end
            to="/checkpoint"
            className={({ isActive }) => getClassName(isActive)}
          >
            Checkpoint
          </NavLink>
          <NavLink
            end
            to="/admin"
            className={({ isActive }) => getClassName(isActive)}
          >
            Admin
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              className="cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink
              end
              to="/login"
              className={({ isActive }) => getClassName(isActive)}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
