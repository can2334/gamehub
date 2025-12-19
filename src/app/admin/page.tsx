"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ShieldAlert, Loader2 } from "lucide-react";

// Cloudflare Worker URL'in
const API_URL = "https://gamebackend.cansalman332.workers.dev/api/auth";

export default function AdminLogin() {
    const [auth, setAuth] = useState({ user: "", pass: "" });
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsPending(true);

        try {
            // Worker'a POST isteği atıyoruz
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: auth.user,
                    pass: auth.pass
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Giriş başarılıysa bilgiyi sakla ve yönlendir
                localStorage.setItem("isTeacher", "true");
                localStorage.setItem("userRole", data.role);
                router.push("/admin/dashboard");
            } else {
                setError(data.message || "Giriş yetkiniz bulunmuyor.");
            }
        } catch (err) {
            setError("Sunucuya bağlanılamadı. Worker çalışıyor mu?");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 selection:bg-emerald-500/30">
            {/* Arka plan ışığı */}
            <div className="absolute w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-4 text-emerald-400 border border-emerald-500/20">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">GİRİŞ <span className="text-emerald-500">YAP</span></h1>
                    <p className="text-slate-500 text-sm mt-2">Bilişim Arena Yönetim Merkezi</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="Öğretmen Kullanıcı Adı"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition text-white placeholder:text-slate-700"
                            onChange={(e) => setAuth({ ...auth, user: e.target.value })}
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                            type="password"
                            required
                            placeholder="Güvenlik Şifresi"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition text-white placeholder:text-slate-700"
                            onChange={(e) => setAuth({ ...auth, pass: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold p-3 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={20} /> : "SİSTEME BAĞLAN"}
                    </button>
                </form>

                <footer className="mt-8 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest">Authorized Access Only</p>
                </footer>
            </div>
        </div>
    );
}