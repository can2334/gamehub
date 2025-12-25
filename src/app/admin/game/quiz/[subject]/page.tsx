"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Plus, ArrowLeft, Loader2, X, AlertCircle, Edit3 } from "lucide-react";

// Breadcrumb bileşenini import ediyoruz
import AdminBreadcrumb from "../../../components/AdminBreadcrumb";

const API_URL = "https://gamebackend.cansalman332.workers.dev/api";

export default function QuestionManager() {
    const params = useParams();
    const subject = params?.subject as string;
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [newQuestion, setNewQuestion] = useState({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        level: 1
    });

    const fetchQuestions = useCallback(async () => {
        if (!subject) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/questions?category=${subject}`, { cache: 'no-store' });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) setQuestions(data);
        } catch (err) {
            console.error("🔥 Hata:", err);
        } finally {
            setLoading(false);
        }
    }, [subject]);

    useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

    const openAddModal = () => {
        setEditingId(null);
        setNewQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0, level: 1 });
        setIsModalOpen(true);
    };

    const openEditModal = (q: any) => {
        setEditingId(q.id);
        setNewQuestion({
            question: q.question,
            options: [...q.options],
            correctAnswer: q.correctAnswer,
            level: q.level
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!newQuestion.question || newQuestion.options.some(opt => opt.trim() === "")) {
            return alert("Lütfen tüm alanları doldur!");
        }

        const url = editingId
            ? `${API_URL}/questions?id=${editingId}&category=${subject}`
            : `${API_URL}/questions?category=${subject}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newQuestion, category: subject, id: editingId })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchQuestions();
            } else {
                alert("İşlem başarısız!");
            }
        } catch (err) {
            alert("Bağlantı hatası!");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu soruyu silmek istediğine emin misin?")) return;
        try {
            const res = await fetch(`${API_URL}/questions?id=${id}&category=${subject}`, { method: "DELETE" });
            if (res.ok) fetchQuestions();
        } catch (err) { console.error(err); }
    };

    const stats = {
        easy: questions.filter(q => q.level === 1).length,
        medium: questions.filter(q => q.level === 2).length,
        hard: questions.filter(q => q.level === 3).length
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
            <div className="max-w-5xl mx-auto">

                {/* --- BREADCRUMB BURAYA EKLENDİ --- */}
                <AdminBreadcrumb currentPage={`${subject?.toUpperCase()} SORU YÖNETİMİ`} />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 mt-6">
                    <div>
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 mb-4 font-bold text-[10px] tracking-widest uppercase transition-all">
                            <ArrowLeft size={14} /> Geri Dön
                        </button>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                            {subject} <span className="text-emerald-500">YÖNETİM</span>
                        </h1>
                        <div className="flex gap-4 mt-4">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">KOLAY: {stats.easy}</span>
                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">ORTA: {stats.medium}</span>
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">ZOR: {stats.hard}</span>
                        </div>
                    </div>
                    <button onClick={openAddModal} className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
                        <Plus size={20} /> YENİ EKLE
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                ) : (
                    <div className="grid gap-4">
                        {questions.map((q) => (
                            <div key={q.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2.5rem] flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                                <div className="flex-1 pr-6">
                                    <span className={`text-[9px] font-black px-2 py-1 rounded border mb-2 inline-block ${q.level === 1 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : q.level === 2 ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' : 'text-rose-500 border-rose-500/20 bg-rose-500/5'}`}>
                                        LEVEL {q.level}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-200 mb-4">{q.question}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {q.options.map((opt: any, idx: number) => (
                                            <div key={idx} className={`p-2 rounded-xl border text-[10px] font-medium ${q.correctAnswer === idx ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-black/20 border-slate-800 text-slate-500'}`}>
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => openEditModal(q)} className="p-3 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"><Edit3 size={18} /></button>
                                    <button onClick={() => handleDelete(q.id)} className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {questions.length === 0 && !loading && (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[3rem]">
                                <AlertCircle className="mx-auto text-slate-600 mb-4" size={40} />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Henüz soru eklenmemiş.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL (Ekleme & Düzenleme) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto transform animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase text-emerald-500 italic">
                                {editingId ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase font-bold ml-2">Soru Metni</label>
                                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-emerald-500 transition-all" rows={3} value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} placeholder="Soruyu buraya yazın..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {newQuestion.options.map((opt, i) => (
                                    <div key={i} className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-bold ml-2">ŞIK {String.fromCharCode(65 + i)}</label>
                                        <input className={`w-full bg-slate-950 border rounded-2xl p-4 text-sm outline-none transition-all ${newQuestion.correctAnswer === i ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-800 focus:border-slate-600'}`} value={opt} onChange={(e) => {
                                            const o = [...newQuestion.options]; o[i] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: o });
                                        }} placeholder="Şık içeriği..." />
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase block text-center font-bold tracking-widest">Doğru Cevabı Seç</label>
                                    <div className="flex gap-1 bg-black/20 p-1 rounded-2xl border border-slate-800">
                                        {[0, 1, 2, 3].map(idx => (
                                            <button key={idx} onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: idx })} className={`flex-1 py-3 rounded-xl font-bold transition-all ${newQuestion.correctAnswer === idx ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:bg-slate-800'}`}>{String.fromCharCode(65 + idx)}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase block text-center font-bold tracking-widest">Zorluk Seviyesi</label>
                                    <div className="flex gap-1 bg-black/20 p-1 rounded-2xl border border-slate-800">
                                        {[1, 2, 3].map(lvl => (
                                            <button key={lvl} onClick={() => setNewQuestion({ ...newQuestion, level: lvl })} className={`flex-1 py-3 rounded-xl font-bold transition-all ${newQuestion.level === lvl ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-slate-800'}`}>{lvl}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full bg-emerald-500 text-slate-950 py-5 rounded-[2rem] font-black uppercase tracking-widest mt-4 hover:bg-emerald-400 active:scale-95 transition-all shadow-xl shadow-emerald-500/10">
                                {editingId ? 'GÜNCELLEMEYİ TAMAMLA' : 'SORUYU SİSTEME EKLE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}