import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { localStorageEnum } from "@/types/enums";
import type { UserRole } from "@/types";

export default function AdminLogin() {
  const navigate = useNavigate();
  const authed = localStorage.getItem(localStorageEnum.token);
  const role = localStorage.getItem(localStorageEnum.role) as UserRole;
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (authed) {
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/checkpoint");
      }
    }
  }, []);

  const {
    mutate: loginUser,
    isPending,
    error,
  } = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem(localStorageEnum.token, data.token);
        toast.success("Logged in successfully");
        if (data.user.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/checkpoint");
        }
      }
    },
    onError: () => {
      toast.error("Failed to Login");
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(credentials);
  };

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error.message}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
