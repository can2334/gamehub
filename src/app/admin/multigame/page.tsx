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
    LogOut,
    Users,
    Timer,
    Zap
} from 'lucide-react';

import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { gameApi, TeamStatus } from '../services/api';

const TEAMS_CONFIG = [
    { name: 'Kırmızı', color: 'from-red-500 to-red-900', border: 'border-red-500/50', text: 'text-red-400', bg: 'bg-red-500/10', shadow: 'shadow-red-500/20' },
    { name: 'Mavi', color: 'from-blue-500 to-blue-900', border: 'border-blue-500/50', text: 'text-blue-400', bg: 'bg-blue-500/10', shadow: 'shadow-blue-500/20' },
    { name: 'Sarı', color: 'from-amber-400 to-amber-700', border: 'border-amber-400/50', text: 'text-amber-400', bg: 'bg-amber-500/10', shadow: 'shadow-amber-500/20' },
    { name: 'Yeşil', color: 'from-emerald-500 to-emerald-800', border: 'border-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/10', shadow: 'shadow-emerald-500/20' }
];

const BACKEND_URL = "https://gamebackend.cansalman332.workers.dev";

// Onay Modalı Bileşeni
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
    const [gameStatus, setGameStatus] = useState("waiting");
    const [showAddModal, setShowAddModal] = useState(false);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    // Süre State'leri
    const [questionTimer, setQuestionTimer] = useState<number>(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const scoredTeamsRef = useRef<Set<string>>(new Set());
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [newQ, setNewQ] = useState({
        ders: "Genel Kültür",
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
        sure: 30
    });

    // Soru Süresi Sayacı
    useEffect(() => {
        if (isTimerActive && questionTimer > 0) {
            timerIntervalRef.current = setInterval(() => {
                setQuestionTimer((prev) => prev - 1);
            }, 1000);
        } else if (questionTimer === 0) {
            setIsTimerActive(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
        return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
    }, [isTimerActive, questionTimer]);

    // Yeni soruya geçince süreyi sıfırla/başlat
    useEffect(() => {
        if (gameStatus === "active" && questions[currentQuestionIndex]) {
            setQuestionTimer(questions[currentQuestionIndex].sure || 30);
            setIsTimerActive(true);
        }
    }, [currentQuestionIndex, gameStatus, questions]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedCode = localStorage.getItem("admin_groupCode");
        if (savedCode) {
            setGroupCode(savedCode);
            setIsLive(true);
            startPolling(savedCode);
            loadQuestions();
        }
        return () => {
            stopPolling();
            if (countdownRef.current) clearTimeout(countdownRef.current);
        };
    }, []);

    const loadQuestions = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`);
            const data = await res.json();
            if (Array.isArray(data)) setQuestions(data);
        } catch (e) {
            toast.error("Sorular yüklenemedi");
        }
    };

    const addScoreToTeam = async (teamName: string) => {
        if (scoredTeamsRef.current.has(teamName)) return;
        scoredTeamsRef.current.add(teamName);
        await gameApi.updateScore(groupCode, teamName, 10);
        toast.success(`${teamName} +10 Puan!`, { icon: "🔥" });
    };

    const startPolling = (code: string) => {
        stopPolling();
        pollingRef.current = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(code);
                if (data.teams) {
                    setActiveTeams(data.teams);
                    const currentQ = questions[currentQuestionIndex];
                    if (currentQ) {
                        data.teams.forEach((team: any) => {
                            if (team.selectedAnswer === currentQ.correctAnswer && !scoredTeamsRef.current.has(team.teamName)) {
                                addScoreToTeam(team.teamName);
                            }
                        });
                    }
                }
                if (data.status === "finished") {
                    setGameStatus("finished");
                    stopPolling();
                }
            } catch (e) { console.error(e); }
        }, 1000);
    };

    const stopPolling = () => { if (pollingRef.current) clearInterval(pollingRef.current); };

    const handleSetupGame = async () => {
        const t = toast.loading("Arena kuruluyor...");
        try {
            const { code } = await gameApi.generateCode();
            await gameApi.startSession(code, "multigame");
            setGroupCode(code);
            localStorage.setItem("admin_groupCode", code);
            setIsLive(true);
            setGameStatus("waiting");
            startPolling(code);
            loadQuestions();
            toast.success("Arena Hazır!", { id: t });
        } catch (e) { toast.error("Hata!", { id: t }); }
    };

    const handleStartCompetition = async () => {
        if (activeTeams.length === 0) { toast.error("Oyuncu bekleniyor..."); return; }
        let count = 3;
        setCountdown(count);
        const tick = () => {
            count--;
            if (count > 0) {
                setCountdown(count);
                countdownRef.current = setTimeout(tick, 1000);
            } else {
                setCountdown(null);
                gameApi.updateStatus(groupCode, "active").then(() => setGameStatus("active"));
            }
        };
        countdownRef.current = setTimeout(tick, 1000);
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex >= questions.length - 1) {
            toast.success("Oyun bitti!");
            return;
        }
        try {
            await gameApi.resetAnswers(groupCode);
            setCurrentQuestionIndex(prev => prev + 1);
            scoredTeamsRef.current.clear();
            toast.success("Sıradaki soruya geçildi!");
        } catch (e) { toast.error("Hata!"); }
    };

    const handleFinishGame = async () => {
        setIsFinishModalOpen(false);
        try {
            await gameApi.finishSession(groupCode);
            stopPolling();
            setGameStatus("finished");
            localStorage.removeItem("admin_groupCode");
        } catch (e) { toast.error("Hata!"); }
    };

    const handleSaveQuestion = async () => {
        const { question, options } = newQ;
        if (!question || !options.A || !options.B || !options.C || !options.D) {
            toast.error("Eksik alan!"); return;
        }
        const t = toast.loading("Kaydediliyor...");
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQ)
            });
            if (res.ok) {
                toast.success("Eklendi", { id: t });
                setShowAddModal(false);
                setNewQ({ ders: "Genel Kültür", question: "", options: { A: "", B: "", C: "", D: "" }, correctAnswer: "A", sure: 30 });
                loadQuestions();
            }
        } catch (e) { toast.error("Hata!", { id: t }); }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans">
            <Toaster position="top-right" />

            {/* GERİ SAYIM */}
            {countdown !== null && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020617]/95 backdrop-blur-3xl">
                    <div className="text-center animate-bounce">
                        <p className="text-indigo-400 font-black tracking-widest mb-4 uppercase">HAZIRLANIN</p>
                        <div className="text-[20rem] font-black text-white drop-shadow-[0_0_80px_rgba(99,102,241,0.6)]">{countdown}</div>
                    </div>
                </div>
            )}

            <AdminBreadcrumb currentPage="ARENA CONTROL" />

            {/* ÜST PANEL */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-800 mb-8 shadow-2xl">
                <div>
                    <h1 className="text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">ARENA PRO ADMIN</h1>
                    <p className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> CANLI KONTROL MERKEZİ
                    </p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-black hover:bg-slate-700 uppercase transition-all">
                        <PlusCircle size={14} /> Soru Ekle
                    </button>
                    {!isLive ? (
                        <button onClick={handleSetupGame} className="bg-indigo-600 px-8 py-3 rounded-2xl text-xs font-black hover:bg-indigo-500 uppercase transition-all shadow-lg shadow-indigo-500/20">
                            <Play size={14} className="inline mr-2" /> Odayı Kur
                        </button>
                    ) : (
                        <div onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Kopyalandı!"); }} className="bg-black/40 px-6 py-2 rounded-2xl border border-indigo-500/30 text-center cursor-pointer group hover:border-indigo-400 transition-all">
                            <span className="text-[8px] text-slate-500 block font-bold">KODU KOPYALA</span>
                            <span className="text-xl font-mono font-black text-indigo-400 group-hover:text-white">{groupCode}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* OYUN DURUMLARI */}
            {gameStatus === "finished" ? (
                <div className="max-w-3xl mx-auto bg-slate-900/80 p-12 rounded-[3rem] border border-indigo-500/30 text-center backdrop-blur-xl">
                    <Trophy className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" size={64} />
                    <h2 className="text-5xl font-black mb-10 italic">FİNAL SKORLARI</h2>
                    <div className="space-y-3 mb-10">
                        {[...activeTeams].sort((a, b) => (b.score || 0) - (a.score || 0)).map((team, idx) => (
                            <div key={team.teamName} className="flex justify-between items-center p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all">
                                <span className="text-xl font-black">{idx + 1}. {team.teamName}</span>
                                <span className="text-2xl font-mono font-black text-indigo-400">{team.score || 0} PTS</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => window.location.reload()} className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase flex items-center gap-3 mx-auto hover:bg-slate-200 transition-all shadow-xl">
                        <LogOut size={20} /> YENİ OTURUM BAŞLAT
                    </button>
                </div>
            ) : (gameStatus === "waiting") && isLive ? (
                <div className="max-w-4xl mx-auto bg-slate-900/40 p-10 rounded-[2.5rem] border border-indigo-500/20 text-center backdrop-blur-md">
                    <Users size={48} className="mx-auto text-indigo-400 mb-6" />
                    <h2 className="text-3xl font-black mb-10 uppercase italic">BEKLEME ODASI</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {TEAMS_CONFIG.map(config => {
                            const joined = activeTeams.some(t => t.teamName === config.name);
                            return (
                                <div key={config.name} className={`p-6 rounded-2xl border transition-all duration-500 ${joined ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5 opacity-30'}`}>
                                    <p className={`font-black text-sm ${joined ? 'text-emerald-400' : ''}`}>{config.name}</p>
                                    <p className="text-[10px] font-bold">{joined ? '● BAĞLANDI' : 'BEKLİYOR'}</p>
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleStartCompetition} className="bg-indigo-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                        YARIŞMAYI BAŞLAT
                    </button>
                </div>
            ) : gameStatus === "active" && isLive ? (
                <>
                    {/* SORU EKRANI */}
                    {questions[currentQuestionIndex] && (
                        <div className="max-w-4xl mx-auto bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 mb-8 text-center backdrop-blur-sm relative overflow-hidden">
                            {/* OTOMATİK SÜRE ÇUBUĞU */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                                <div
                                    className={`h-full transition-all duration-1000 ${questionTimer < 10 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`}
                                    style={{ width: `${(questionTimer / (questions[currentQuestionIndex].sure || 30)) * 100}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between mb-8 items-center">
                                <span className="bg-indigo-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-indigo-400 uppercase tracking-widest">{questions[currentQuestionIndex].ders}</span>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${questionTimer < 10 ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse' : 'border-white/10 bg-black/20 text-indigo-400'}`}>
                                        <Timer size={16} />
                                        <span className="font-mono font-black text-lg">{questionTimer}s</span>
                                    </div>
                                    <span className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase border border-white/5">SORU: {currentQuestionIndex + 1}/{questions.length}</span>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold mb-10 leading-tight italic">"{questions[currentQuestionIndex].question}"</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                {Object.entries(questions[currentQuestionIndex].options || {}).map(([key, val]: any) => (
                                    <div key={key} className={`p-5 rounded-2xl border-2 transition-all ${questions[currentQuestionIndex].correctAnswer === key ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-black/20'}`}>
                                        <span className="font-black mr-3 text-indigo-400">{key}</span> {val}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAKIM CEVAPLARI */}
                    <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 pb-40">
                        {TEAMS_CONFIG.map(config => {
                            const team = activeTeams.find(t => t.teamName === config.name);
                            const answered = !!team?.selectedAnswer;
                            const isCorrect = team?.selectedAnswer === questions[currentQuestionIndex]?.correctAnswer;
                            return (
                                <div key={config.name} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center relative ${answered ? config.border + ' bg-slate-900 shadow-xl ' + config.shadow : 'border-slate-800/50 opacity-40'}`}>
                                    {isCorrect && answered && <div className="absolute top-4 right-4 text-2xl animate-bounce">✅</div>}
                                    <h3 className={`text-[10px] font-black uppercase mb-4 ${config.text}`}>{config.name}</h3>
                                    <div className="text-6xl font-black mb-4 font-mono">{team?.selectedAnswer || "—"}</div>
                                    <div className="w-full pt-4 border-t border-white/5 flex justify-between uppercase">
                                        <span className="text-[10px] text-slate-500 font-bold">PUAN</span>
                                        <span className="text-xl font-black text-white">{team?.score || 0}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ALT KONTROL BAR */}
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40 bg-slate-900/90 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <button
                            disabled={questionTimer > 0}
                            onClick={handleNextQuestion}
                            className={`px-10 py-5 rounded-[1.8rem] font-black uppercase text-xs flex items-center gap-3 transition-all ${questionTimer > 0
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 animate-pulse'
                                }`}
                        >
                            {questionTimer > 0 ? `${questionTimer}s SONRA GEÇ` : 'SIRADAKİ SORU'} <ChevronRight size={18} />
                        </button>
                        <button onClick={() => setIsFinishModalOpen(true)} className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-5 rounded-[1.8rem] font-black uppercase text-xs hover:bg-red-500 hover:text-white transition-all">
                            BİTİR
                        </button>
                    </div>
                </>
            ) : null}

            {/* MODALLAR */}
            <ConfirmModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={handleFinishGame}
                title="BİTİRME ONAYI"
                message="Final puanları hesaplanacak ve oturum sonlandırılacak. Emin misiniz?"
                confirmText="EVET, BİTİR"
            />

            {showAddModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
                        <h2 className="text-2xl font-black text-indigo-400 uppercase italic mb-8 flex items-center gap-3">
                            <PlusCircle /> YENİ SORU EKLE
                        </h2>
                        <div className="space-y-4">
                            <input className="w-full bg-black/40 p-4 rounded-2xl border border-slate-800 outline-none focus:border-indigo-500/50 transition-all" placeholder="Ders (örn: Tarih)" value={newQ.ders} onChange={e => setNewQ({ ...newQ, ders: e.target.value })} />
                            <textarea className="w-full bg-black/40 p-4 rounded-2xl border border-slate-800 min-h-[100px] outline-none focus:border-indigo-500/50 transition-all" placeholder="Soru metni..." value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} />
                            <div className="grid grid-cols-2 gap-3">
                                {['A', 'B', 'C', 'D'].map(h => (
                                    <input key={h} className="bg-black/40 p-4 rounded-xl border border-slate-800 text-sm outline-none focus:border-indigo-500/50" placeholder={`${h} şıkkı`} value={(newQ.options as any)[h]} onChange={e => setNewQ({ ...newQ, options: { ...newQ.options, [h]: e.target.value } })} />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-black/40 p-4 rounded-2xl border border-slate-800 text-sm outline-none cursor-pointer" value={newQ.correctAnswer} onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })}>
                                    <option value="A">Doğru Cevap: A</option>
                                    <option value="B">Doğru Cevap: B</option>
                                    <option value="C">Doğru Cevap: C</option>
                                    <option value="D">Doğru Cevap: D</option>
                                </select>
                                <input type="number" className="bg-black/40 p-4 rounded-2xl border border-slate-800 text-sm outline-none" placeholder="Süre (sn)" value={newQ.sure} onChange={e => setNewQ({ ...newQ, sure: parseInt(e.target.value) })} />
                            </div>
                            <button onClick={handleSaveQuestion} className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-widest mt-4 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">KAYDET</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}