import { useEffect, useState } from "react"; import { Send, Search } from "lucide-react"; import { useAuthStore } from "../store/authStore"; import { useWebSocket } from "../hooks/useWebSocket";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Logs() {
  const token = useAuthStore((s) => s.token)!; const [logs, setLogs] = useState<any[]>([]); const [query, setQuery] = useState(""); const [source, setSource] = useState(""); const [severity, setSeverity] = useState("");
  const [src, setSrc] = useState(""); const [evType, setEvType] = useState(""); const [msg, setMsg] = useState(""); const [raw, setRaw] = useState("");
  const { send } = useWebSocket();

  const search = async () => {
    const params = new URLSearchParams(); if (query) params.set("query", query); if (source) params.set("source", source); if (severity) params.set("severity", severity); params.set("limit", "100");
    const res = await fetch(`${API}/api/logs?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const d = await res.json(); setLogs(Array.isArray(d) ? d : []);
  };
  useEffect(() => { search(); }, [token]);

  const ingest = async (e: React.FormEvent) => {
    e.preventDefault();
    let rawData = null; try { if (raw) rawData = JSON.parse(raw); } catch {}
    await fetch(`${API}/api/logs/ingest`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ source: src, event_type: evType, severity: "info", message: msg, raw_data: rawData }) });
    setMsg(""); setRaw(""); search(); send({ action: "analyze" });
  };

  const sevBadge = (s: string) => {
    const m: Record<string, string> = { error: "bg-red-900/30 text-red-400 border-red-800", warn: "bg-yellow-900/30 text-yellow-400 border-yellow-800", info: "bg-blue-900/30 text-blue-400 border-blue-800", debug: "bg-gray-800 text-gray-400 border-gray-700" };
    return m[s] || "bg-gray-800 text-gray-400 border-gray-700";
  };

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">Log Explorer</h1></div>
    <form onSubmit={ingest} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Ingest Log</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" placeholder="Source (e.g. nginx, auth, db)" value={src} onChange={(e) => setSrc(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm" required />
        <input type="text" placeholder="Event type (e.g. login, request, error)" value={evType} onChange={(e) => setEvType(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm" required />
        <input type="text" placeholder="Message" value={msg} onChange={(e) => setMsg(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm md:col-span-2" required />
        <input type="text" placeholder='Raw data (JSON, optional)' value={raw} onChange={(e) => setRaw(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono" />
      </div>
      <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"><Send className="w-4 h-4" /> Ingest & Analyze</button>
    </form>
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" /><input type="text" placeholder="Search logs..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm" /></div>
        <input type="text" placeholder="Source filter" value={source} onChange={(e) => setSource(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm w-32" />
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 text-sm w-28">
          <option value="">All</option>
          <option value="error">Error</option><option value="warn">Warn</option><option value="info">Info</option><option value="debug">Debug</option>
        </select>
        <button onClick={search} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">Search</button>
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {logs.map((l) => (
          <div key={l.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start gap-3">
            <span className={`text-xs px-1.5 py-0.5 rounded border ${sevBadge(l.severity)} whitespace-nowrap mt-0.5`}>{l.severity}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5"><span>{l.source}</span><span>{l.event_type}</span><span className="text-gray-700">{new Date(l.timestamp).toLocaleString()}</span></div>
              <p className="text-sm text-gray-300 break-words">{l.message}</p>
            </div>
          </div>
        ))}
        {logs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No logs ingested yet.</p>}
      </div>
    </div></div>);
}
