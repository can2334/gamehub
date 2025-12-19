"use client";
import { useEffect, useState } from "react";
import { Gamepad2, Search, Filter, Rocket, Star, Loader2 } from "lucide-react";
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

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch("https://gamebackend.cansalman332.workers.dev/api/games");
                const data = await res.json();
                // Sadece aktif olanları listele
                setGames(data.filter((g: Game) => g.isActive));
            } catch (err) {
                console.error("Oyunlar yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    // Arama filtresi
    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
            {/* HERO / HEADER */}
            <div className="relative border-b border-slate-800 bg-slate-900/20 px-8 py-16">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-3 text-emerald-500 font-mono text-sm mb-4 uppercase tracking-[0.3em]">
                        <Gamepad2 size={20} /> Görev Merkezi
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
                        TÜM <span className="text-emerald-500 text-shadow-glow">OYUNLAR</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl text-lg leading-relaxed">
                        Bilişim yeteneklerini geliştirmek için tasarlanmış interaktif senaryoları keşfet.
                    </p>
                </div>
                {/* Arka plan süsü */}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* FİLTRE VE ARAMA BARO */}
            <div className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Oyun ara..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500/50 transition-all text-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all">
                            <Filter size={16} /> Kategoriler
                        </button>
                    </div>
                </div>
            </div>

            {/* OYUN KARTLARI GRİDİ */}
            <main className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game) => (
                        <Link
                            key={game.id}
                            href={`/${game.slug}`}
                            className="group relative bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all hover:-translate-y-2 shadow-xl"
                        >
                            <div className="aspect-[16/10] bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                {/* Oyun İkonu/Görseli Alanı */}
                                <Rocket size={48} className="text-slate-700 group-hover:text-emerald-500 group-hover:scale-125 transition-all duration-500" />
                                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 flex items-center gap-1">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-[10px] font-bold">4.8</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">
                                        {game.category}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black mb-2 group-hover:text-emerald-400 transition-colors uppercase italic italic">
                                    {game.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                                    Bu görevde {game.category.toLowerCase()} yeteneklerini test edeceksin. Başlamak için tıkla!
                                </p>
                            </div>

                            {/* Hover Alt Çizgisi */}
                            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500" />
                        </Link>
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="text-center py-40">
                        <p className="text-slate-500 font-mono uppercase tracking-widest">Aranan kriterde oyun bulunamadı.</p>
                    </div>
                )}
            </main>
        </div>
    );
}