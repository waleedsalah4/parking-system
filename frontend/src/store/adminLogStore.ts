import { create } from "zustand";

interface AdminLogs {
  logs: any;
  setLogs: (logs: any) => void;
}

export const useAdminLogsStore = create<AdminLogs>()((set) => ({
  //   isAuthenticated: false,
  logs: [],

  setLogs: (log: any) => {
    set((state) => ({
      logs: state.logs && [...state.logs, log],
    }));
  },
}));
