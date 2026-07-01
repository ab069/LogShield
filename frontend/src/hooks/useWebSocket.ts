import { useEffect, useRef } from "react"; import { useAuthStore } from "../store/authStore"; import { useAlertStore } from "../store/alertStore";
const BASE = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`;
export function useWebSocket() {
  const ref = useRef<WebSocket | null>(null); const { user } = useAuthStore(); const addAlert = useAlertStore((s) => s.addAlert);
  useEffect(() => {
    if (!user) return; const ws = new WebSocket(`${BASE}/ws/${user.id}`); ref.current = ws;
    ws.onmessage = (e) => { try { const d = JSON.parse(e.data); if (d.type === "alert") addAlert(d.alert); } catch {} };
    return () => ws.close();
  }, [user]);
  const send = (data: object) => { if (ref.current?.readyState === WebSocket.OPEN) ref.current.send(JSON.stringify(data)); };
  return { send };
}
