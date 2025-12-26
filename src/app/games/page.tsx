"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Search, Rocket, Star, Loader2, LayoutGrid, ChevronRight, ArrowLeft, Terminal } from "lucide-react";
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

    const categories = ["Hepsi", ...Array.from(new Set(games.map(g => g.category)))];

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Hepsi" || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="text-emerald-500" size={40} />
                </motion.div>
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">Veriler Çekiliyor...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden relative">

            {/* Dinamik Arka Plan Glow - Daha canlı hale getirildi */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* GERİ DÖN BUTONU */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Ana Sayfa</span>
                    </Link>
                </motion.div>

                {/* ÜST BAŞLIK ALANI */}
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-emerald-500 font-black text-[10px] mb-6 uppercase tracking-[0.5em]"
                    >
                        <div className="h-[1px] w-8 bg-emerald-500/50"></div>
                        <span className="flex items-center gap-2"><Terminal size={12} /> Mission Control</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-[900] tracking-tighter text-white uppercase leading-none mb-8"
                    >
                        OPERASYON <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">MERKEZİ</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-slate-400 leading-relaxed font-medium"
                    >
                        Sistemdeki aktif görevleri analiz et ve yeteneklerine uygun olan simülasyonu başlat.
                        Her görev yeni bir <span className="text-emerald-400">tecrübe puanı</span> demektir.
                    </motion.p>
                </header>

                {/* Filtreleme ve Arama Barı */}
                <section className="mb-16 space-y-8 bg-slate-900/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Arama */}
                        <div className="relative w-full md:max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Görevi tanımla veya ara..."
                                className="w-full bg-[#030712] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500/40 transition-all text-sm font-medium"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Kategori Filtresi Bilgisi */}
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <LayoutGrid size={14} /> Filtreleme Modu
                        </div>
                    </div>

                    {/* Kategori Hapları */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat
                                    ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105"
                                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/${game.slug}`}
                                    className="group block relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.05)]"
                                >
                                    {/* Kart Üst (Görsel ve İkon) */}
                                    <div className="aspect-[16/10] bg-[#020617] flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80 z-10" />

                                        {/* Arka plan deseni */}
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            className="relative z-20"
                                        >
                                            <Rocket size={48} className="text-slate-700 group-hover:text-emerald-500 transition-colors duration-500" />
                                        </motion.div>

                                        <div className="absolute top-5 right-5 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                                            <Star size={12} className="text-emerald-500 fill-emerald-500" />
                                            <span className="text-[10px] font-black text-white">5</span>
                                        </div>
                                    </div>

                                    {/* İçerik Alanı */}
                                    <div className="p-8 relative z-20">
                                        <div className="mb-4">
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                {game.category}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight uppercase">
                                            {game.title}
                                        </h3>

                                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-8 font-medium italic">
                                            Bu terminal üzerinde "{game.category.toLowerCase()}" protokollerini test et ve sistemi hackle.
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] font-black text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500">
                                                Görevi Başlat <ChevronRight size={16} className="text-emerald-500" />
                                            </div>
                                            <div className="h-8 w-8 rounded-full border border-slate-800 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                                                <Gamepad2 size={14} className="text-slate-600 group-hover:text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Efekt Çizgisi */}
                                    <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-emerald-600 to-cyan-500 group-hover:w-full transition-all duration-700 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
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
                        className="text-center py-32 border border-dashed border-slate-800 rounded-[3rem] bg-slate-900/10"
                    >
                        <div className="bg-slate-900/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800">
                            <Search className="text-slate-600" size={32} />
                        </div>
                        <h3 className="text-white font-bold text-xl mb-2">Görev Bulunamadı</h3>
                        <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.3em]">Aranan kriterlerde veri kaydı eşleşmiyor.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}