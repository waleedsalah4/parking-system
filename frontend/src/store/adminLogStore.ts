import { create } from "zustand";
import type { Log } from "@/types";

interface AdminLogs {
  logs: Log[];
  setLogs: (logs: Log) => void;
}

export const useAdminLogsStore = create<AdminLogs>()((set) => ({
  logs: [],

  setLogs: (log: Log) => {
    set((state) => ({
      logs: [...state.logs, log],
    }));
  },
}));
