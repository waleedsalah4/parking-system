// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { localStorageEnum } from "@/types/enums";
import type { LoginResponse, User } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  setAuth: (authData: LoginResponse) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      //   isAuthenticated: false,
      isAuthenticated: !!localStorage.getItem(localStorageEnum.token),
      user: JSON.parse(localStorage.getItem(localStorageEnum.user) as string),

      setAuth: (authData) =>
        set({
          isAuthenticated: true,
          user: authData.user,
        }),

      clearAuth: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
