import { useEffect } from "react";
import { wsService } from "@/services/ws";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function HomeLayout() {
  useEffect(() => {
    wsService.connect();

    return () => {
      wsService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
