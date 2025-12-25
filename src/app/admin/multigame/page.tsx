"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import {
    LayoutDashboard,
    PlusCircle,
    Play,
    Copy,
    CheckCircle2,
    ChevronRight,
    Trophy,
    AlertTriangle,
    X,
    LogOut
} from 'lucide-react';

// Bileşenlerini buradan import ediyoruz
import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { gameApi, TeamStatus } from '../services/api';

const TEAMS_CONFIG = [
    { name: 'Kırmızı', color: 'from-red-500 to-red-900', border: 'border-red-500/50', text: 'text-red-400', bg: 'bg-red-500/10' },
    { name: 'Mavi', color: 'from-blue-500 to-blue-900', border: 'border-blue-500/50', text: 'text-blue-400', bg: 'bg-blue-500/10' },
    { name: 'Sarı', color: 'from-amber-400 to-amber-700', border: 'border-amber-400/50', text: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Yeşil', color: 'from-emerald-500 to-emerald-800', border: 'border-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/10' }
];

const BACKEND_URL = "https://gamebackend.cansalman332.workers.dev";

// --- MODERN ONAY MODALI ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = "danger" }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-md rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(99,102,241,0.1)] text-center transform animate-in zoom-in duration-300">
                <div className={`w-20 h-20 ${type === "danger" ? "bg-red-500/10 border-red-500/20" : "bg-indigo-500/10 border-indigo-500/20"} rounded-full flex items-center justify-center mx-auto mb-6 border`}>
                    <AlertTriangle size={40} className={type === "danger" ? "text-red-500" : "text-indigo-500"} />
                </div>
                <h2 className="text-2xl font-black mb-2 text-white italic tracking-tighter uppercase">{title}</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">VAZGEÇ</button>
                    <button onClick={onConfirm} className={`flex-1 ${type === "danger" ? "bg-red-600 hover:bg-red-500 shadow-red-600/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"} py-4 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all uppercase text-xs tracking-widest`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function MultiGameAdmin() {
    const [groupCode, setGroupCode] = useState("");
    const [activeTeams, setActiveTeams] = useState<TeamStatus[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const [gameStatus, setGameStatus] = useState("active");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

    const [newQ, setNewQ] = useState({
        ders: "Ders Adı",
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
        sure: 30
    });

    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const savedCode = localStorage.getItem("admin_groupCode");
        if (savedCode) {
            setGroupCode(savedCode);
            setIsLive(true);
            startPolling(savedCode);
            loadQuestions();
        }
        return () => stopPolling();
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`);
            const data = await res.json();
            if (Array.isArray(data)) setQuestions(data);
        } catch (e) { toast.error("Sorular yüklenemedi"); }
    };

    const startPolling = (code: string) => {
        stopPolling();
        pollingRef.current = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(code);
                if (data.status === "finished") {
                    setGameStatus("finished");
                    stopPolling();
                    return;
                }
                if (data.teams) setActiveTeams([...data.teams]);
                if (data.currentQuestionIndex !== undefined) setCurrentQuestionIndex(data.currentQuestionIndex);
                setGameStatus(data.status || "active");
            } catch (e) { console.error("Polling error"); }
        }, 2000);
    };

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    const handleSetupGame = async () => {
        const t = toast.loading("Arena kuruluyor...");
        try {
            const { code } = await gameApi.generateCode();
            await gameApi.startSession(code, "multigame");
            setGroupCode(code);
            localStorage.setItem("admin_groupCode", code);
            setIsLive(true);
            setGameStatus("active");
            startPolling(code);
            loadQuestions();
            toast.success("Arena Hazır!", { id: t });
        } catch (e) { toast.error("Hata oluştu", { id: t }); }
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex >= questions.length - 1) {
            toast("Bu son soruydu! Yarışmayı bitirebilirsiniz.", { icon: '🏁' });
            return;
        }
        try {
            await gameApi.resetAnswers(groupCode);
            setActiveTeams(prev => prev.map(t => ({ ...t, selectedAnswer: null })));
            setCurrentQuestionIndex(prev => prev + 1);
            toast.success("Yeni soruya geçildi!");
        } catch (e) { toast.error("Hata!"); }
    };

    const handleFinishGame = async () => {
        setIsFinishModalOpen(false);
        const loadId = toast.loading("Sonuçlar hesaplanıyor...");
        try {
            await gameApi.finishSession(groupCode);
            stopPolling();
            setGameStatus("finished");
            toast.success("Yarışma sona erdi!", { id: loadId });
        } catch (e) { toast.error("Hata oluştu!", { id: loadId }); }
    };

    const handleSaveQuestion = async () => {
        const t = toast.loading("Soru kaydediliyor...");
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQ)
            });
            if (res.ok) {
                toast.success("Soru Eklendi", { id: t });
                setShowAddModal(false);
                loadQuestions();
            }
        } catch (e) { toast.error("Hata!", { id: t }); }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans selection:bg-indigo-500/30">
            <Toaster position="top-right" />

            {/* MERKEZİ BİLEŞENİMİZ BURADA */}
            <AdminBreadcrumb currentPage="ARENA CONTROL" />

            {/* HEADER */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 mb-8 shadow-2xl">
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400 flex items-center gap-2 justify-center md:justify-start">
                        ARENA <span className="text-indigo-500">PRO</span> ADMIN
                    </h1>
                    <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-[0.3em] mt-1">Live Control Center</p>
                </div>

                <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
                    <Link href="/admin/multigame/sorular" className="flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-3 rounded-2xl text-[10px] font-black hover:bg-indigo-500/20 transition-all uppercase">
                        <LayoutDashboard size={14} /> Sorular
                    </Link>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-3 rounded-2xl text-[10px] font-black hover:bg-slate-700 transition-all uppercase">
                        <PlusCircle size={14} /> Ekle
                    </button>

                    {!isLive ? (
                        <button onClick={handleSetupGame} className="col-span-2 md:col-span-1 bg-indigo-600 px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase">
                            <Play size={14} /> Başlat
                        </button>
                    ) : (
                        <div onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Kod kopyalandı!"); }} className="col-span-2 md:col-span-1 bg-black/40 px-6 py-2 rounded-2xl border border-indigo-500/30 text-center cursor-pointer hover:border-indigo-400 active:scale-95 transition-all group relative flex flex-col items-center justify-center">
                            <span className="text-[8px] text-slate-500 font-bold group-hover:text-indigo-400 flex items-center gap-1"><Copy size={8} /> KODU KOPYALA</span>
                            <span className="text-xl font-mono font-black text-indigo-400 tracking-widest">{groupCode}</span>
                        </div>
                    )}
                </div>
            </div>

            {gameStatus === "finished" ? (
                <div className="max-w-3xl mx-auto bg-slate-900/80 p-8 md:p-12 rounded-[3rem] border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.1)] text-center animate-in zoom-in duration-500">
                    <Trophy className="mx-auto text-indigo-500 mb-6" size={64} />
                    <h2 className="text-4xl md:text-6xl font-black mb-10 text-white italic tracking-tighter">FİNAL <span className="text-indigo-500">SKORLARI</span></h2>
                    <div className="space-y-3 mb-10 text-left">
                        {[...activeTeams].sort((a, b) => b.score - a.score).map((team, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-5 rounded-2xl border transition-all ${idx === 0 ? 'bg-indigo-500/20 border-indigo-400 scale-105 shadow-xl' : 'bg-black/40 border-white/5'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-800'}`}>{idx + 1}</span>
                                    <span className="text-lg md:text-xl font-black uppercase">{team.teamName}</span>
                                </div>
                                <span className="text-2xl font-mono font-black text-indigo-400">{team.score} <small className="text-[10px]">PTS</small></span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-slate-200 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 mx-auto">
                        <LogOut size={20} /> YENİ YARIŞMA BAŞLAT
                    </button>
                </div>
            ) : (
                <>
                    {isLive && questions[currentQuestionIndex] && (
                        <div className="max-w-4xl mx-auto bg-slate-900/40 p-6 md:p-10 rounded-[2.5rem] border border-white/5 mb-8 text-center backdrop-blur-sm relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                                <div className="bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase italic">📖 {questions[currentQuestionIndex].ders}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-black text-white/40 uppercase bg-white/5 px-4 py-2 rounded-2xl border border-white/10">SORU {currentQuestionIndex + 1} / {questions.length}</span>
                                    <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20 animate-pulse">⏱️ {questions[currentQuestionIndex].sure}S</span>
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold mb-10 leading-tight tracking-tight">{questions[currentQuestionIndex].question}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                                {Object.entries(questions[currentQuestionIndex].options || {}).map(([key, val]: any) => {
                                    const isCorrect = questions[currentQuestionIndex].correctAnswer === key;
                                    return (
                                        <div key={key} className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${isCorrect ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50' : 'border-slate-800 bg-black/20'}`}>
                                            <div className="flex justify-between items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>{key}</span>
                                                    <span className="text-sm md:text-base font-medium text-slate-200">{val}</span>
                                                </div>
                                                {isCorrect && <CheckCircle2 size={16} className="text-emerald-500" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pb-40">
                        {TEAMS_CONFIG.map(config => {
                            const teamData = activeTeams.find(t => t.teamName === config.name);
                            const hasAnswered = !!teamData?.selectedAnswer;
                            return (
                                <div key={config.name} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col items-center relative overflow-hidden ${hasAnswered ? config.border + ' bg-slate-900 shadow-[0_20px_40px_rgba(0,0,0,0.4)] scale-105 z-10' : 'border-slate-800/50 opacity-50'}`}>
                                    {hasAnswered && <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${config.color}`}></div>}
                                    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${config.text}`}>{config.name}</h3>
                                    <div className={`text-4xl md:text-6xl font-black mb-4 font-mono ${hasAnswered ? 'text-white' : 'text-slate-700'}`}>
                                        {teamData?.selectedAnswer || "—"}
                                    </div>
                                    <div className="w-full flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center">Score</span>
                                        <span className="text-xl font-black text-white">{teamData?.score || 0}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isLive && (
                        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto flex gap-3 z-40 bg-slate-900/80 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <button onClick={handleNextQuestion} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-indigo-600 px-8 py-4 rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-tighter hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20">
                                SIRADAKİ SORU <ChevronRight size={18} />
                            </button>
                            <button onClick={() => setIsFinishModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-tighter hover:bg-red-500/20 active:scale-95 transition-all">
                                BİTİR
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* MODALLAR */}
            <ConfirmModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={handleFinishGame}
                title="YARIŞMAYI BİTİR?"
                message="Tüm sonuçlar hesaplanacak ve final kürsüsü gösterilecek. Emin misiniz?"
                confirmText="EVET, BİTİR"
            />

            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-indigo-400 uppercase tracking-widest italic">Yeni Soru</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-all"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Ders Adı</label>
                                <input className="w-full bg-black/40 p-4 rounded-2xl border border-slate-800 focus:border-indigo-500 outline-none transition-all text-sm font-bold" value={newQ.ders} onChange={e => setNewQ({ ...newQ, ders: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Soru Metni</label>
                                <textarea className="w-full bg-black/40 p-4 rounded-2xl border border-slate-800 min-h-[100px] focus:border-indigo-500 outline-none transition-all text-sm" value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['A', 'B', 'C', 'D'].map(h => (
                                    <div key={h} className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 ml-2">{h} ŞIKKI</label>
                                        <input className="w-full bg-black/40 p-3 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-xs" value={(newQ.options as any)[h]} onChange={e => setNewQ({ ...newQ, options: { ...newQ.options, [h]: e.target.value } })} />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Doğru Cevap</label>
                                    <select className="w-full bg-black p-4 rounded-2xl border border-slate-800 outline-none text-white appearance-none cursor-pointer text-xs font-bold" value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })}>
                                        <option value="A">A ŞIKKI</option><option value="B">B ŞIKKI</option><option value="C">C ŞIKKI</option><option value="D">D ŞIKKI</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Süre (Saniye)</label>
                                    <input type="number" className="w-full bg-black p-4 rounded-2xl border border-slate-800 outline-none text-white text-xs font-bold" value={newQ.sure} onChange={e => setNewQ({ ...newQ, sure: Number(e.target.value) })} />
                                </div>
                            </div>
                            <button onClick={handleSaveQuestion} className="w-full bg-indigo-600 py-5 rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 active:scale-95 transition-all uppercase text-xs tracking-[0.2em] mt-4">SİSTEME KAYDET</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}