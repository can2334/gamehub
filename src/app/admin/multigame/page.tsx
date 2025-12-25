"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gameApi, TeamStatus } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link'; // Yönlendirme için eklendi

const TEAMS_CONFIG = [
    { name: 'Kırmızı', color: 'from-red-500 to-red-900', border: 'border-red-500/50', text: 'text-red-400' },
    { name: 'Mavi', color: 'from-blue-500 to-blue-900', border: 'border-blue-500/50', text: 'text-blue-400' },
    { name: 'Sarı', color: 'from-amber-400 to-amber-700', border: 'border-amber-400/50', text: 'text-amber-400' },
    { name: 'Yeşil', color: 'from-emerald-500 to-emerald-800', border: 'border-emerald-500/50', text: 'text-emerald-400' }
];

const BACKEND_URL = "https://gamebackend.cansalman332.workers.dev";

export default function MultiGameAdmin() {
    const [groupCode, setGroupCode] = useState("");
    const [activeTeams, setActiveTeams] = useState<TeamStatus[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLive, setIsLive] = useState(false);
    const [gameStatus, setGameStatus] = useState("active");
    const [showAddModal, setShowAddModal] = useState(false);

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

    const copyToClipboard = () => {
        if (groupCode) {
            navigator.clipboard.writeText(groupCode);
            toast.success("Oda kodu kopyalandı!", {
                icon: '📋',
                style: { borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid #6366f1' }
            });
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

    const confirmFinish = () => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-bold text-sm text-center text-white italic">Yarışmayı bitirmek ve sonuçları göstermek istiyor musunuz?</span>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadId = toast.loading("Sonuçlar hesaplanıyor...");
                            await gameApi.finishSession(groupCode);
                            stopPolling();
                            setGameStatus("finished");
                            toast.success("Yarışma sona erdi!", { id: loadId });
                        }}
                        className="bg-indigo-600 px-3 py-1 rounded text-white text-xs font-black"
                    >
                        Evet, Bitir
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-700 px-3 py-1 rounded text-white text-xs"
                    >
                        Vazgeç
                    </button>
                </div>
            </div>
        ), { duration: 6000, style: { background: '#0f172a', border: '1px solid #6366f1' } });
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
        <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
            <Toaster position="top-right" reverseOrder={false} />

            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800 mb-8 shadow-2xl">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ARENA PRO ADMIN</h1>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Live Multi-Game Control Center</p>
                </div>
                <div className="flex gap-4 items-center">
                    {/* SORU EKLE YERİNE DERSLER BUTONU VE YÖNLENDİRME */}
                    <Link href="/admin/multigame/sorular" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-all">
                        📚 DERSLER VE SORULAR
                    </Link>
                    <button onClick={() => setShowAddModal(true)} className="bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">➕ SORU EKLE</button>

                    {!isLive ? (
                        <button onClick={handleSetupGame} className="bg-indigo-600 px-8 py-2 rounded-xl text-xs font-black shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">BAŞLAT</button>
                    ) : (
                        <div
                            onClick={copyToClipboard}
                            className="bg-slate-950 px-6 py-2 rounded-xl border border-indigo-500/30 text-center cursor-pointer hover:border-indigo-400 active:scale-95 transition-all group relative"
                        >
                            <span className="block text-[8px] text-slate-500 font-bold group-hover:text-indigo-400">KOPYALA</span>
                            <span className="text-xl font-mono font-black text-indigo-400">{groupCode}</span>
                        </div>
                    )}
                </div>
            </div>

            {gameStatus === "finished" ? (
                <div className="max-w-4xl mx-auto bg-slate-900 p-10 rounded-[3rem] border-2 border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.2)] text-center animate-in zoom-in duration-500">
                    <h2 className="text-5xl font-black mb-10 text-indigo-400 italic tracking-tighter">🏁 FİNAL SKORLARI</h2>
                    <div className="space-y-4 mb-10">
                        {[...activeTeams].sort((a, b) => b.score - a.score).map((team, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-6 rounded-2xl border ${idx === 0 ? 'bg-indigo-500/20 border-indigo-400' : 'bg-black/40 border-white/5'}`}>
                                <span className="text-2xl font-black">#{idx + 1} {team.teamName}</span>
                                <span className="text-3xl font-mono font-black text-indigo-400">{team.score} PUAN</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="bg-white text-black px-12 py-4 rounded-2xl font-black">YENİ YARIŞMA BAŞLAT</button>
                </div>
            ) : (
                <>
                    {/* Soru Ekranı - Ders Adı, Soru ve Tüm Detaylar Eklendi */}
                    {isLive && questions[currentQuestionIndex] && (
                        <div className="max-w-4xl mx-auto bg-slate-900/50 p-10 rounded-[3rem] border border-white/5 mb-10 text-center backdrop-blur-sm">
                            <div className="flex justify-between mb-6">
                                {/* DERS ADI BURADA */}
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-black text-slate-500 uppercase italic">AKTİF DERS</span>
                                    <span className="text-sm font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                                        📖 {questions[currentQuestionIndex].ders}
                                    </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs font-black text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                                        SORU {currentQuestionIndex + 1} / {questions.length}
                                    </span>
                                    <span className="text-xs font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">
                                        ⏱️ {questions[currentQuestionIndex].sure}s
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-8">{questions[currentQuestionIndex].question}</h2>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                {Object.entries(questions[currentQuestionIndex].options || {}).map(([key, val]: any) => {
                                    const isCorrect = questions[currentQuestionIndex].correctAnswer === key;
                                    return (
                                        <div key={key} className={`p-4 rounded-2xl border transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-800 bg-black/20'}`}>
                                            <div className="flex justify-between items-center">
                                                <span><span className={`font-black mr-2 ${isCorrect ? 'text-emerald-400' : 'text-indigo-500'}`}>{key}:</span> {val}</span>
                                                {isCorrect && <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">DOĞRU CEVAP</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Takımlar */}
                    <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 pb-32">
                        {TEAMS_CONFIG.map(config => {
                            const teamData = activeTeams.find(t => t.teamName === config.name);
                            return (
                                <div key={config.name} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${teamData?.selectedAnswer ? config.border + ' bg-slate-900 shadow-xl scale-105' : 'border-slate-800 opacity-40'}`}>
                                    <h3 className={`text-xs font-black uppercase mb-4 ${config.text}`}>{config.name}</h3>
                                    <div className="text-5xl font-black mb-6 font-mono text-center">
                                        {teamData?.selectedAnswer || "—"}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <span className="text-[10px] font-bold text-slate-500">SCORE</span>
                                        <span className="text-xl font-black text-indigo-400">{teamData?.score || 0}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Alt Kontrol Barı */}
                    {isLive && (
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40 bg-black/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <button onClick={handleNextQuestion} className="bg-indigo-600 px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-500 active:scale-95 transition-all">SONRAKİ SORU</button>
                            <button onClick={confirmFinish} className="bg-red-600 px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-red-500 active:scale-95 transition-all">YARIŞMAYI BİTİR</button>
                        </div>
                    )}
                </>
            )}

            {/* Soru Ekleme Modalı (HİÇBİR ŞEY SİLİNMEDİ) */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <h2 className="text-xl font-black mb-6 text-indigo-400 uppercase tracking-widest text-center">YENİ SORU EKLE</h2>
                        <div className="space-y-4">
                            <input className="w-full bg-black p-4 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none transition-all" placeholder="Ders Adı" value={newQ.ders} onChange={e => setNewQ({ ...newQ, ders: e.target.value })} />
                            <textarea className="w-full bg-black p-4 rounded-xl border border-slate-800 min-h-[100px] focus:border-indigo-500 outline-none transition-all" placeholder="Soru Metni" value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                {['A', 'B', 'C', 'D'].map(h => (
                                    <input key={h} className="bg-black p-3 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none" placeholder={`${h} Şıkkı`} value={(newQ.options as any)[h]} onChange={e => setNewQ({ ...newQ, options: { ...newQ.options, [h]: e.target.value } })} />
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <select className="flex-1 bg-black p-4 rounded-xl border border-slate-800 outline-none text-white" value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })}>
                                    <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                                </select>
                                <input type="number" className="flex-1 bg-black p-4 rounded-xl border border-slate-800 outline-none text-white" placeholder="Süre (sn)" value={newQ.sure} onChange={e => setNewQ({ ...newQ, sure: Number(e.target.value) })} />
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-white transition-all">İPTAL</button>
                                <button onClick={handleSaveQuestion} className="flex-1 bg-indigo-600 py-4 rounded-2xl font-black shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all">KAYDET</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}