import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { wsService } from "@/services/ws";

function HomeLayout() {
  useEffect(() => {
    wsService.connect();

    return () => {
      wsService.disconnect();
    };
  }, []);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 shadow backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold">
            Parking System
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="link">
              Gates
            </Link>
            <Link to="/checkpoint" className="link">
              Checkpoint
            </Link>
            <Link to="/admin" className="link">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      {/* <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-gray-500">
        Route: {loc.pathname}
      </footer> */}
    </div>
  );
}

export default HomeLayout;
