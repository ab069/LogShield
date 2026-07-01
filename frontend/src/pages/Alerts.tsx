import { useEffect } from "react"; import { useAuthStore } from "../store/authStore"; import { useAlertStore } from "../store/alertStore";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Alerts() {
  const token = useAuthStore((s) => s.token); const { alerts, setAlerts } = useAlertStore();
  useEffect(() => {
    if (!token) return; fetch(`${API}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => { if (Array.isArray(d)) setAlerts(d); }).catch(() => {});
  }, [token]);
  const sev = (s: string) => ({ critical: "bg-red-900/30 text-red-400 border-red-800", high: "bg-orange-900/30 text-orange-400 border-orange-800", medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800", low: "bg-green-900/30 text-green-400 border-green-800" })[s] || "bg-gray-800 text-gray-400 border-gray-700";
  return (<div className="space-y-6"><h1 className="text-2xl font-bold text-white">Security Alerts</h1>
    <div className="space-y-3">{alerts.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">No alerts generated. Ingest logs and run correlation analysis to detect threats.</div> :
      alerts.map((a, i) => (<div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-2"><div><div className="flex items-center gap-3 mb-1"><h3 className="text-white font-semibold">{a.title}</h3><span className={`text-xs px-2 py-0.5 rounded border ${sev(a.severity)}`}>{a.severity}</span></div><p className="text-xs text-gray-500">Rule: {a.rule_name} | Source: {a.source}</p></div></div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3"><p className="text-sm text-gray-300">{a.description}</p></div>
      </div>))
    }</div></div>);
}
