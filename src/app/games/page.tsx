"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Search, Rocket, Star, Loader2, LayoutGrid, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Game {
    id: number;
    title: string;
    isActive: boolean;
    category: string;
    slug: string;
}

export default function GamesLibrary() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch("https://gamebackend.cansalman332.workers.dev/api/games");
                const data = await res.json();
                setGames(data.filter((g: Game) => g.isActive));
            } catch (err) {
                console.error("Oyunlar yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    // Benzersiz kategorileri çek (Filtre butonları için)
    const categories = ["Hepsi", ...Array.from(new Set(games.map(g => g.category)))];

    // Hem arama hem kategori filtresi
    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Hepsi" || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Arka Plan Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">

                {/* Üst Başlık Alanı */}
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-emerald-500 font-black text-[10px] mb-6 uppercase tracking-[0.4em]"
                    >
                        <Gamepad2 size={14} /> Mission Control
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none mb-8"
                    >
                        OYUN <span className="text-emerald-500 not-italic">KÜTÜPHANESİ</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed border-l-2 border-emerald-500/20 pl-6"
                    >
                        Ders içeriklerini eğlenceli görevlere dönüştürdük.
                        Kategorini seç ve maceraya başla.
                    </motion.p>
                </header>

                {/* Filtreleme ve Arama Barı */}
                <section className="mb-16 space-y-8">
                    {/* Arama */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Görev ara..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/40 transition-all text-sm backdrop-blur-md"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Kategori Hapları */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat
                                    ? "bg-emerald-500 border-emerald-500 text-[#020617] shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Oyun Grid */}
                <motion.main
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredGames.map((game, index) => (
                            <motion.div
                                layout
                                key={game.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/${game.slug}`}
                                    className="group block relative bg-slate-900/30 border border-slate-800/60 rounded-[2rem] overflow-hidden hover:border-emerald-500/40 transition-all duration-500"
                                >
                                    {/* Görsel Alanı */}
                                    <div className="aspect-[16/9] bg-slate-950 flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                                        <Rocket size={40} className="text-slate-800 group-hover:text-emerald-500 group-hover:scale-110 transition-all duration-700" />

                                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5 flex items-center gap-1">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-[9px] font-bold text-white">4.8</span>
                                        </div>
                                    </div>

                                    {/* İçerik Alanı */}
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-2 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded">
                                                {game.category}
                                            </span>
                                            <LayoutGrid size={14} className="text-slate-700" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                            {game.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-6 font-medium">
                                            {game.category} dünyasında seviye atlamak için bu görevi tamamla.
                                        </p>

                                        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                            Görevi Başlat <ChevronRight size={14} className="text-emerald-500" />
                                        </div>
                                    </div>

                                    {/* Kart Altı Glow Çizgisi */}
                                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500 group-hover:w-full transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.main>

                {/* Boş Durum */}
                {filteredGames.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 border-2 border-dashed border-slate-900 rounded-[3rem]"
                    >
                        <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em]">Aranan kriterde görev bulunamadı.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}