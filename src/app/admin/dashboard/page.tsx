"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, LayoutGrid, Eye, EyeOff, Activity, Loader2, AlertTriangle, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMain() {
    const router = useRouter();
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    // 1. Veritabanındaki TÜM oyunları çek
    const fetchAllGames = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://gamebackend.cansalman332.workers.dev/api/games");
            const data = await res.json();
            setGames(data); // Bütün tabloyu state'e basıyoruz
        } catch (err) {
            console.error("Veri çekme hatası:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllGames(); }, []);

    // 2. Tıklanan spesifik oyunun durumunu güncelle
    const toggleStatus = async (game: any) => {
        const newStatus = game.isActive === 1 ? 0 : 1;
        setUpdatingId(game.id); // Sadece o kartta loading dönsün

        try {
            const res = await fetch("https://gamebackend.cansalman332.workers.dev/api/games", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: game.id,
                    isActive: newStatus,
                    title: game.title,
                    category: game.category
                }),
            });

            if (res.ok) {
                // Sadece güncellenen oyunun durumunu listede değiştir
                setGames(prev => prev.map(g => g.id === game.id ? { ...g, isActive: newStatus } : g));
            }
        } catch (err) {
            alert("SQL Güncelleme Hatası!");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 p-6 md:p-20 relative overflow-hidden font-sans">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16">
                    <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] mb-4 uppercase tracking-[0.4em]">
                        <Activity size={14} /> Admin Terminal / games control page
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase tracking-tighter">
                        SİSTEM <span className="text-emerald-500">ARENA</span>
                    </h1>
                    <p className="text-slate-500 mt-4 font-medium italic">Veritabanında kayıtlı {games.length} aktif modül bulundu.</p>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {games.map((game, index) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl transition-all ${game.isActive === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                                            <LayoutGrid size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black italic uppercase text-white leading-none">{game.title}</h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <code className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">slug: {game.slug}</code>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{game.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <button
                                            onClick={() => toggleStatus(game)}
                                            disabled={updatingId === game.id}
                                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-[10px] font-black uppercase border transition-all ${game.isActive === 1
                                                ? 'border-red-500/20 text-red-500 hover:bg-red-500/10'
                                                : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                                }`}
                                        >
                                            {updatingId === game.id ? <Loader2 className="animate-spin" size={14} /> : (
                                                game.isActive === 1 ? <><EyeOff size={16} /> Yayından Kaldır</> : <><Eye size={16} /> Yayına Al</>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => {
                                                // 1. ÖNCELİK: Eğer slug "multigame" ise direkt o sayfaya git
                                                if (game.slug === "multigame") {
                                                    router.push(`/admin/multigame`);
                                                }
                                                // 2. ÖNCELİK: Eğer slug içinde 'tabu' geçiyorsa Tabu yönetimine git
                                                else if (game.slug.includes("tabu")) {
                                                    router.push(`/admin/game/tabu?slug=${game.slug}`);
                                                }
                                                // 3. VARSAYILAN: Diğer her şey için Quiz yönetimine git
                                                else {
                                                    router.push(`/admin/game/quiz?slug=${game.slug}`);
                                                }
                                            }}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-700 transition-all"
                                        >
                                            <Settings size={16} /> Yönet
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>


                </div>
            </div>
        </div>
    );
}