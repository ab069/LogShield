import { useState } from "react"; import { useNavigate } from "react-router-dom"; import { Shield } from "lucide-react"; import { useAuthStore } from "../store/authStore";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Login() {
  const [reg, setReg] = useState(false); const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [name, setName] = useState(""); const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth); const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setLoad(true);
    try {
      const res = await fetch(`${API}/api/auth/${reg ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reg ? { email, password: pw, name } : { email, password: pw }) });
      const d = await res.json(); if (!res.ok) { setErr(d.detail || "Error"); return; } setAuth(d.access_token, d.user); nav("/");
    } catch { setErr("Connection error"); } finally { setLoad(false); }
  };
  return (<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4"><div className="w-full max-w-md"><div className="flex items-center justify-center gap-3 mb-8"><Shield className="w-10 h-10 text-emerald-400" /><span className="text-2xl font-bold text-white">LogShield</span></div>
    <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
      <h2 className="text-xl font-semibold text-white">{reg ? "Create Account" : "Sign In"}</h2>
      {err && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">{err}</div>}
      {reg && <div><label className="block text-sm text-gray-400 mb-1">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" required /></div>}
      <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" required /></div>
      <div><label className="block text-sm text-gray-400 mb-1">Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" required /></div>
      <button type="submit" disabled={load} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">{load ? "Loading..." : reg ? "Register" : "Sign In"}</button>
      <p className="text-center text-sm text-gray-500">{reg ? "Already have an account?" : "Don't have an account?"} <button type="button" onClick={() => setReg(!reg)} className="text-emerald-400 hover:underline">{reg ? "Sign In" : "Register"}</button></p>
    </form></div></div>);
}
