"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import {
    ChevronLeft,
    Trash2,
    Clock,
    BookOpen,
    Hash,
    Layers,
    Loader2,
    Database,
    Inbox,
    AlertTriangle
} from 'lucide-react';

const BACKEND_URL = "https://gamebackend.cansalman332.workers.dev";

// --- MODERN SİLME ONAY MODALI ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, questionText }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-red-500/30 w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center transform animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-white italic tracking-tighter uppercase">DİKKAT!</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    "<span className="text-slate-200 font-bold">{questionText}</span>" <br />
                    sorusunu silmek üzeresin. Bu işlem geri alınamaz!
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest"
                    >
                        İPTAL
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 py-4 rounded-2xl font-black text-white shadow-lg shadow-red-600/20 hover:bg-red-500 active:scale-95 transition-all uppercase text-xs tracking-widest"
                    >
                        EVET, SİL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function MultiGameQuestions() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal Stateleri
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setQuestions(data);
            }
        } catch (err) {
            console.error("Yükleme hatası:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Silme Butonuna Basıldığında
    const openDeleteModal = (question: any) => {
        setSelectedQuestion(question);
        setIsDeleteModalOpen(true);
    };

    // Modal Onaylandığında
    const confirmDelete = async () => {
        if (!selectedQuestion) return;

        const targetId = selectedQuestion.id;
        setIsDeleteModalOpen(false);

        const t = toast.loading("Soru siliniyor...");
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame?id=${targetId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                toast.success("Soru başarıyla imha edildi", { id: t });
                fetchQuestions();
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error("Silme işlemi başarısız!", { id: t });
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans selection:bg-indigo-500/30">
            <Toaster position="top-right" />

            {/* --- HEADER --- */}
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-800 mb-8 shadow-2xl">
                <div className="flex items-center gap-5 w-full md:w-auto">
                    <Link href="/admin/multigame" className="bg-slate-800/80 p-4 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-indigo-400 border border-slate-700 shadow-lg active:scale-95">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400 uppercase">
                            Soru <span className="text-indigo-500 text-[0.8em] tracking-normal not-italic opacity-50 font-light">Bankası</span>
                        </h1>
                        <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                            <Database size={12} /> Live Database Management
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-indigo-500/20 w-full md:w-auto justify-center">
                    <Layers size={18} className="text-indigo-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Toplam:</span>
                    <span className="text-2xl font-black text-white ml-2">{questions.length}</span>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-slate-800/50">
                        <Loader2 className="animate-spin w-12 h-12 text-indigo-500 mx-auto mb-4 opacity-80" />
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Veriler Yükleniyor...</p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-24 bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800 flex flex-col items-center">
                        <div className="bg-slate-800/50 p-6 rounded-full mb-6 text-slate-600">
                            <Inbox size={48} />
                        </div>
                        <p className="text-slate-400 font-bold text-lg">Henüz soru bulunmuyor.</p>
                        <Link href="/admin/multigame" className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                            Hemen Soru Ekle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {questions.map((q, index) => (
                            <div
                                key={q.id || index}
                                className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all group relative overflow-hidden backdrop-blur-sm"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1 w-full">
                                        {/* Question Badges */}
                                        <div className="flex flex-wrap items-center gap-3 mb-5">
                                            <div className="flex items-center gap-2 bg-indigo-600 px-4 py-1.5 rounded-xl">
                                                <BookOpen size={12} className="text-white" />
                                                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                                                    {q.ders || 'GENEL'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                                                <Hash size={12} className="text-indigo-400" />
                                                <span className="text-slate-400 text-[10px] font-black uppercase">ID: {q.id || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                                                <Clock size={12} className="text-red-400" />
                                                <span className="text-red-400 text-[10px] font-black">{q.sure || 30}s</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-8 leading-tight">
                                            {q.question}
                                        </h3>

                                        {/* Options Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(q.options || {}).map(([key, val]: any) => {
                                                const isCorrect = q.correctAnswer === key;
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${isCorrect
                                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                                                : 'bg-black/30 border-slate-800 text-slate-400'
                                                            }`}
                                                    >
                                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isCorrect
                                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
                                                                : 'bg-slate-800 text-slate-500'
                                                            }`}>
                                                            {key}
                                                        </span>
                                                        <span className="text-sm md:text-base font-medium">{val}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex md:flex-col gap-3 w-full md:w-auto justify-end md:justify-start">
                                        <button
                                            onClick={() => openDeleteModal(q)}
                                            className="w-full md:w-14 h-14 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90"
                                            title="Sil"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                questionText={selectedQuestion?.question}
            />

            <div className="text-center mt-20 pb-10">
                <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.8em]">Bilişim Arena Admin Suite</p>
            </div>
        </div>
    );
}