"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Search, Loader2, LayoutGrid, ChevronRight, Terminal, ArrowRight, Bug, Database, Shield, Cpu, Lock, Wifi } from "lucide-react";
import Link from "next/link";

interface Game {
    id: number;
    title: string;
    isActive: boolean;
    category: string;
    slug: string;
}

/* ─── CURSOR GLOW ─── */
function CursorGlow() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 80, damping: 20 });
    const sy = useSpring(y, { stiffness: 80, damping: 20 });

    useEffect(() => {
        const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <motion.div
            style={{ left: sx, top: sy }}
            className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="w-full h-full rounded-full bg-emerald-500/5 blur-[80px]" />
        </motion.div>
    );
}

/* ─── SCAN LINE ─── */
function ScanLine() {
    return (
        <motion.div
            className="pointer-events-none fixed left-0 right-0 h-[2px] z-[998] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
    );
}

/* ─── GRID OVERLAY ─── */
function GridOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
            }}
        />
    );
}

/* ─── CATEGORY ICON MAP ─── */
const categoryIcons: Record<string, React.ReactNode> = {
    "SQL": <Database size={28} className="text-cyan-400" />,
    "Terminal": <Terminal size={28} className="text-emerald-400" />,
    "Zafiyet": <Bug size={28} className="text-blue-400" />,
    "Ağ": <Wifi size={28} className="text-purple-400" />,
    "Şifreleme": <Lock size={28} className="text-yellow-400" />,
    "Sistem": <Cpu size={28} className="text-red-400" />,
    "default": <Shield size={28} className="text-slate-400" />,
};

const categoryColors: Record<string, { border: string; glow: string; tag: string; bar: string }> = {
    "SQL": { border: "hover:border-cyan-500/40", glow: "hover:shadow-[0_0_60px_rgba(6,182,212,0.08)]", tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", bar: "from-cyan-500 to-blue-500" },
    "Terminal": { border: "hover:border-emerald-500/40", glow: "hover:shadow-[0_0_60px_rgba(16,185,129,0.08)]", tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "from-emerald-500 to-cyan-500" },
    "Zafiyet": { border: "hover:border-blue-500/40", glow: "hover:shadow-[0_0_60px_rgba(59,130,246,0.08)]", tag: "bg-blue-500/10 text-blue-400 border-blue-500/20", bar: "from-blue-500 to-purple-500" },
    "Ağ": { border: "hover:border-purple-500/40", glow: "hover:shadow-[0_0_60px_rgba(168,85,247,0.08)]", tag: "bg-purple-500/10 text-purple-400 border-purple-500/20", bar: "from-purple-500 to-pink-500" },
    "Şifreleme": { border: "hover:border-yellow-500/40", glow: "hover:shadow-[0_0_60px_rgba(234,179,8,0.08)]", tag: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", bar: "from-yellow-500 to-orange-500" },
    "default": { border: "hover:border-slate-500/40", glow: "hover:shadow-[0_0_60px_rgba(100,116,139,0.08)]", tag: "bg-slate-500/10 text-slate-400 border-slate-500/20", bar: "from-slate-500 to-slate-400" },
};

function getColor(category: string) {
    return categoryColors[category] || categoryColors["default"];
}

function getIcon(category: string) {
    return categoryIcons[category] || categoryIcons["default"];
}

/* ─── GAME CARD ─── */
function GameCard({ game, index }: { game: Game; index: number }) {
    const c = getColor(game.category);
    const icon = getIcon(game.category);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
        >
            <Link
                href={`/${game.slug}`}
                className={`group relative flex flex-col bg-[#0a0f1a] border border-white/[0.04] rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${c.border} ${c.glow}`}
            >
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 group-hover:border-white/30 transition-colors duration-500 z-10" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 group-hover:border-white/30 transition-colors duration-500 z-10" />

                {/* Card thumbnail area */}
                <div className="aspect-[16/9] relative overflow-hidden bg-[#060b13] flex items-center justify-center">
                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(16,185,129,0.8)_1px,transparent_1px)] [background-size:20px_20px]" />
                    {/* Radial glow center */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)]" />
                    {/* Bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />

                    <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative z-10 p-5 rounded-2xl bg-slate-950/60 border border-white/5 group-hover:border-white/10 transition-colors duration-500 backdrop-blur-sm"
                    >
                        {icon}
                    </motion.div>

                    {/* Status badge */}
                    <div className="absolute top-4 right-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/5 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                        <span className="text-[9px] font-black text-emerald-400 tracking-[0.2em] uppercase">Aktif</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                    <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border ${c.tag}`}>
                            {game.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-700 tracking-[0.2em] font-mono">#{String(game.id).padStart(3, "0")}</span>
                    </div>

                    <h3 className="text-lg font-black text-white tracking-tight leading-tight group-hover:text-emerald-400 transition-colors duration-300 uppercase">
                        {game.title}
                    </h3>
                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-300">
                            Görevi Başlat
                            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform duration-300 text-emerald-500" />
                        </div>
                        {/* Progress bar */}
                        <div className={`h-[2px] w-0 group-hover:w-16 bg-gradient-to-r ${c.bar} transition-all duration-700 rounded-full`} />
                    </div>
                </div>

                {/* Bottom glow line */}
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${c.bar} group-hover:w-full transition-all duration-700 opacity-70`} />
            </Link>
        </motion.div>
    );
}

/* ─── MAIN PAGE ─── */
export default function GamesLibrary() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/games");
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
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center gap-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                <GridOverlay />
                <ScanLine />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 className="text-emerald-500" size={32} />
                </motion.div>
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">Sistem Taranıyor...</span>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-[#030712] text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden relative"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <CursorGlow />
            <ScanLine />
            <GridOverlay />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full"
                />
            </div>

            <div className="max-w-6xl mx-auto px-8 md:px-16 py-16 relative z-10">

                {/* HEADER */}
                <header className="mb-20">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-6 flex items-center gap-3"
                    >
                        <span className="h-px w-6 bg-emerald-500/50" />
                        // Mission Control
                    </motion.p>

                    <div className="overflow-hidden mb-6">
                        <motion.h1
                            initial={{ y: 80 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
                        >
                            Operasyon{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                                Merkezi
                            </span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-xl text-sm text-slate-500 leading-relaxed"
                    >
                        Aktif görevleri analiz et, yeteneklerine uygun simülasyonu başlat.
                        Her görev yeni bir{" "}
                        <span className="text-slate-300">tecrübe puanı</span> demektir.
                    </motion.p>
                </header>

                {/* FILTER BAR */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 relative"
                >
                    <div className="relative p-6 rounded-3xl bg-[#0a0f1a] border border-white/[0.04]">
                        {/* Corner decorations */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />

                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                            {/* Search */}
                            <div className="relative w-full md:max-w-sm group">
                                <Search
                                    size={15}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-500 transition-colors duration-300"
                                />
                                <input
                                    type="text"
                                    placeholder="Görev ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 rounded-2xl py-3 pl-11 pr-4 outline-none text-xs text-slate-300 placeholder:text-slate-700 transition-all duration-300 font-mono"
                                />
                            </div>

                            {/* Count */}
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                                <LayoutGrid size={12} />
                                <span className="text-emerald-500">{filteredGames.length}</span>
                                &nbsp;/ {games.length} Görev
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${selectedCategory === cat
                                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                        : "bg-white/[0.02] border-white/[0.04] text-slate-600 hover:border-white/10 hover:text-slate-400"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* GAME GRID */}
                <motion.main
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredGames.map((game, index) => (
                            <GameCard key={game.id} game={game} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.main>

                {/* EMPTY STATE */}
                <AnimatePresence>
                    {filteredGames.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="relative text-center py-32 rounded-3xl border border-white/[0.04] bg-[#0a0f1a] overflow-hidden"
                        >
                            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 mb-6">
                                    <Search size={24} className="text-slate-700" />
                                </div>
                                <h3 className="text-white font-black text-lg tracking-tight mb-2 uppercase">Görev Bulunamadı</h3>
                                <p className="text-[10px] text-slate-700 tracking-[0.3em] uppercase font-bold">Eşleşen kayıt yok — Filtreyi sıfırla</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setSelectedCategory("Hepsi"); }}
                                    className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 hover:text-emerald-400 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                                >
                                    Filtreyi Temizle <ArrowRight size={12} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FOOTER LINE */}
                <div className="mt-20 pt-8 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[9px] text-slate-800 font-mono tracking-[0.4em] uppercase">
                        SYSTEM_LOG :: {games.length} GÖREV YÜKLENDİ
                    </span>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-800 uppercase tracking-[0.2em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        All systems operational
                    </div>
                </div>

            </div>
        </div>
    );
}