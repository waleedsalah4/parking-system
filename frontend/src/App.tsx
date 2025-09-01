import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomeLayout from "@/Layout/HomeLayout";
import AdminLayout from "@/Layout/AdminLayout";
import Home from "@/pages/Home";
import GatePage from "@/pages/GatePage";
import CheckpointPage from "@/pages/CheckpointPage";
import Login from "@/pages/Login";
import Users from "@/pages/admin/Users";
import Reports from "@/pages/admin/Reports";
import Control from "@/pages/admin/Control";
import AdminView from "./components/admin/AdminView";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, //300000 ms = 5min
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gate/:gateId", element: <GatePage /> },
      { path: "/checkpoint", element: <CheckpointPage /> },
      { path: "/login", element: <Login /> },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminView /> },
          { path: "users", element: <Users /> },
          { path: "reports", element: <Reports /> },
          { path: "control", element: <Control /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App;
