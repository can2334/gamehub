"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const BACKEND_URL = "https://gamebackend.cansalman332.workers.dev";

export default function MultiGameQuestions() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
            }
        } catch (e) {
            toast.error("Sorular getirilemedi!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu soruyu silmek istediğine emin misin?")) return;

        const t = toast.loading("Soru siliniyor...");
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success("Soru başarıyla silindi", { id: t });
                loadQuestions();
            } else {
                toast.error("Silme işlemi başarısız", { id: t });
            }
        } catch (e) {
            toast.error("Hata oluştu!", { id: t });
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800 mb-8 shadow-2xl">
                <div className="flex items-center gap-4">
                    <Link href="/admin/multigame" className="bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition-all text-indigo-400">
                        ←
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter">SORU BANKASI</h1>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Tüm Dersler ve Sorular</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                    <span className="text-xs font-bold text-slate-400">Toplam:</span>
                    <span className="text-xl font-black text-white">{questions.length}</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Yükleniyor...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
                        <p className="text-slate-500 font-bold">Henüz hiç soru eklenmemiş.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {questions.map((q, index) => (
                            <div key={q.id || index} className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] hover:border-indigo-500/30 transition-all group">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-indigo-600 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
                                                {q.ders || 'GENEL'}
                                            </span>
                                            <span className="text-slate-500 text-xs font-bold uppercase">Soru #{index + 1}</span>
                                            <span className="text-red-500 text-xs font-bold">⏱ {q.sure}s</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-100 mb-6 leading-snug">{q.question}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(q.options || {}).map(([key, val]: any) => (
                                                <div key={key} className={`p-3 rounded-xl border text-sm flex items-center gap-3 ${q.correctAnswer === key ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-black/30 border-slate-800 text-slate-400'}`}>
                                                    <span className={`w-6 h-6 rounded flex items-center justify-center font-black ${q.correctAnswer === key ? 'bg-emerald-500 text-white' : 'bg-slate-800'}`}>{key}</span>
                                                    <span>{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleDelete(q.id)}
                                            className="p-4 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90"
                                            title="Soruyu Sil"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}