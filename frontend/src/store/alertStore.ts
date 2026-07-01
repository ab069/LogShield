import { create } from "zustand";
interface Alert { id?: string; rule_name: string; severity: string; title: string; description: string; source: string; correlation_data?: any }
interface AlertState { alerts: Alert[]; addAlert: (a: Alert) => void; setAlerts: (a: Alert[]) => void }
export const useAlertStore = create<AlertState>((set) => ({
  alerts: [], addAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts] })), setAlerts: (alerts) => set({ alerts })
}));
