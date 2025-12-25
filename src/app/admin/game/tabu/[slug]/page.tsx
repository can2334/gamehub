"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Plus,
    Trash2,
    Loader2,
    Sparkles,
    AlertCircle,
    X,
    BookOpen,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Breadcrumb bileşenini import ediyoruz
import AdminBreadcrumb from "../../../components/AdminBreadcrumb";

export default function TabuEditPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();

    const [words, setWords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newWord, setNewWord] = useState({
        word: "",
        forbidden_words: ["", "", "", "", ""],
        isExtra: 0 // Başlangıçta 0 (Normal puan)
    });

    // Slug'dan ders ismini temizleyip alıyoruz (Örn: tabu_turkce -> TÜRKÇE)
    const branchName = slug ? slug.replace("tabu_", "").toUpperCase() : "GENEL";

    const parseForbidden = (data: any) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try { return JSON.parse(data); } catch { return []; }
    };

    const fetchWords = async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`https://gamebackend.cansalman332.workers.dev/api/questions?category=${slug}`);
            if (!res.ok) throw new Error("API hatası");
            const json = await res.json();
            setWords(Array.isArray(json) ? json : []);
            if (!json || json.length === 0) setError(`${branchName} için veri bulunamadı.`);
        } catch {
            setError("Sunucuya bağlanırken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWords(); }, [slug]);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu kelime silinsin mi?")) return;
        const res = await fetch(`https://gamebackend.cansalman332.workers.dev/api/questions?category=${slug}&id=${id}`, { method: "DELETE" });
        if (res.ok) setWords(prev => prev.filter(w => w.id !== id));
    };

    const handleAddWord = async () => {
        if (!newWord.word.trim()) return;
        const res = await fetch(`https://gamebackend.cansalman332.workers.dev/api/questions?category=${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                word: newWord.word,
                forbidden_words: newWord.forbidden_words.filter(Boolean),
                isExtra: newWord.isExtra // 0 veya 1 olarak gidiyor
            })
        });

        if (res.ok) {
            setShowAddModal(false);
            setNewWord({ word: "", forbidden_words: ["", "", "", "", ""], isExtra: 0 });
            fetchWords();
        }
    };

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12">
            <div className="max-w-5xl mx-auto">

                {/* --- BREADCRUMB BURAYA EKLENDİ --- */}
                <AdminBreadcrumb currentPage={`TABU / ${branchName} EDİTÖRÜ`} />

                {/* HEADER */}
                <div className="flex justify-between items-center mb-10 mt-6">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft size={18} /> <span className="text-xs font-black uppercase">Geri</span>
                    </button>
                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                            <BookOpen size={18} className="text-emerald-500" />
                            <h1 className="text-3xl font-black italic uppercase">{branchName} <span className="text-emerald-500">Editörü</span></h1>
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{slug}</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"><AlertCircle size={18} /> {error}</div>
                )}

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {words.map(item => (
                            <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`p-6 rounded-3xl border transition-all ${item.isExtra === 1 ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-slate-800 bg-slate-900/40'}`}>
                                <div className="flex justify-between mb-4">
                                    <div className="flex flex-col">
                                        <h3 className="text-xl font-black uppercase italic tracking-tight">{item.word}</h3>
                                        {item.isExtra === 1 && (
                                            <span className="text-[10px] text-amber-500 font-bold uppercase flex items-center gap-1 mt-1">
                                                <Sparkles size={10} /> Çift Puanlı Kart
                                            </span>
                                        )}
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500/50 hover:text-red-500 hover:bg-red-500/20 p-2 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {parseForbidden(item.forbidden_words).map((fw: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs uppercase text-slate-400">{fw}</span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <button onClick={() => setShowAddModal(true)} className="border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-10 text-slate-500 hover:border-emerald-500 hover:text-emerald-500 transition-all group">
                        <Plus size={32} className="group-hover:scale-110 transition-transform" />
                        <span className="mt-3 text-xs font-black uppercase">Yeni Kelime Ekle</span>
                    </button>
                </div>
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                            <div className="flex justify-between mb-8">
                                <h2 className="text-xl font-black uppercase text-emerald-500 italic">Kart Oluştur</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white"><X /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1 block">Ana Kelime</label>
                                    <input placeholder="KAVRAMI YAZ" className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 uppercase font-black focus:border-emerald-500 outline-none transition-all"
                                        onChange={e => setNewWord({ ...newWord, word: e.target.value })} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1 block">Yasaklı Kelimeler</label>
                                    {newWord.forbidden_words.map((_, i) => (
                                        <input key={i} placeholder={`Yasaklı Kelime ${i + 1}`} className="w-full mb-2 p-3 rounded-xl bg-slate-950 border border-slate-800 uppercase text-sm focus:border-slate-600 outline-none transition-all"
                                            onChange={e => {
                                                const arr = [...newWord.forbidden_words];
                                                arr[i] = e.target.value;
                                                setNewWord({ ...newWord, forbidden_words: arr });
                                            }} />
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setNewWord({ ...newWord, isExtra: newWord.isExtra === 1 ? 0 : 1 })}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${newWord.isExtra === 1 ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${newWord.isExtra === 1 ? 'bg-amber-500 border-amber-500 text-black' : 'border-slate-700'}`}>
                                                {newWord.isExtra === 1 && <Check size={14} strokeWidth={4} />}
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-tight">Bonus Kartı (2 Puan)</span>
                                        </div>
                                    </button>
                                </div>

                                <button onClick={handleAddWord} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-black py-5 rounded-2xl font-black uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]">
                                    Sisteme Kaydet
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}