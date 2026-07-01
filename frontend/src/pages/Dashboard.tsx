import { useEffect, useState } from "react";
import { Activity, ScrollText, Bell, Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore"; import { useAlertStore } from "../store/alertStore"; import { useWebSocket } from "../hooks/useWebSocket";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Dashboard() {
  const token = useAuthStore((s) => s.token); const alerts = useAlertStore((s) => s.alerts); const [logCount, setLogCount] = useState(0); const [alertCount, setAlertCount] = useState(0); useWebSocket();
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/logs/stats`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => { setLogCount(d.total || 0); }).catch(() => {});
    fetch(`${API}/api/alerts/count`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => { setAlertCount(d.count || 0); }).catch(() => {});
  }, [token]);
  const sev = (s: string) => ({ critical: "text-red-500 bg-red-900/30 border-red-800", high: "text-orange-500 bg-orange-900/30 border-orange-800", medium: "text-yellow-500 bg-yellow-900/30 border-yellow-800", low: "text-green-500 bg-green-900/30 border-green-800" })[s] || "text-gray-400 bg-gray-800 border-gray-700";
  return (<div className="space-y-8"><h1 className="text-2xl font-bold text-white">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Logs Ingested</p><p className="text-3xl font-bold text-white mt-1">{logCount}</p></div><ScrollText className="w-10 h-10 text-emerald-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Total Alerts</p><p className="text-3xl font-bold text-white mt-1">{alertCount}</p></div><Bell className="w-10 h-10 text-red-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Active High/Critical</p><p className="text-3xl font-bold text-white mt-1">{alerts.filter((a) => a.severity === "critical" || a.severity === "high").length}</p></div><Activity className="w-10 h-10 text-yellow-400/50" /></div></div>
    </div>
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Live Alert Feed</h2>
      {alerts.length === 0 ? <p className="text-gray-500 text-sm">No alerts yet. Ingest logs and run correlation analysis.</p> :
      <div className="space-y-3">{alerts.slice(0, 10).map((a, i) => (
        <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-white">{a.title}</span><span className={`text-xs px-2 py-0.5 rounded border ${sev(a.severity)}`}>{a.severity}</span></div>
          <p className="text-sm text-gray-400">{a.description}</p>
          <p className="text-xs text-gray-600 mt-1">Source: {a.source}</p>
        </div>
      ))}</div>}
    </div></div>);
}
