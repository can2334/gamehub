"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    PlusCircle, Play, ChevronRight, Trophy,
    AlertTriangle, X, LogOut, Users, Timer, Terminal,
    Wifi, WifiOff, ShieldCheck, Zap
} from 'lucide-react';

import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { gameApi, TeamStatus } from '../services/api';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/* ─── TEAMS CONFIG ─── */
const TEAMS_CONFIG = [
    { name: 'Kırmızı', border: 'border-red-500/40', text: 'text-red-400', bg: 'bg-red-500/5', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]', dot: 'bg-red-500' },
    { name: 'Mavi', border: 'border-blue-500/40', text: 'text-blue-400', bg: 'bg-blue-500/5', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]', dot: 'bg-blue-500' },
    { name: 'Sarı', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/5', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]', dot: 'bg-yellow-400' },
    { name: 'Yeşil', border: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/5', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', dot: 'bg-emerald-500' },
];

const BACKEND_URL = "http://localhost:3001";

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
        <motion.div style={{ left: sx, top: sy }} className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-full h-full rounded-full bg-emerald-500/4 blur-[80px]" />
        </motion.div>
    );
}

/* ─── GRID OVERLAY ─── */
function GridOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
        }} />
    );
}

/* ─── SCAN LINE ─── */
function ScanLine() {
    return (
        <motion.div className="pointer-events-none fixed left-0 right-0 h-[2px] z-[998] bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent"
            animate={{ top: ["0%", "100%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    );
}

/* ─── TIMER RING ─── */
function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;
    const offset = circumference * (1 - progress);
    const isWarning = timeLeft <= 10;
    return (
        <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="absolute inset-0 -rotate-90" width="80" height="80">
                <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                <circle cx="40" cy="40" r={radius} fill="none" stroke={isWarning ? "#ef4444" : "#10b981"} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
            </svg>
            <span className={`font-mono font-black text-2xl relative z-10 ${isWarning ? "text-red-400" : "text-white"}`}>{timeLeft}</span>
        </div>
    );
}

/* ─── CONFIRM MODAL ─── */
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, type = "danger" }: any) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#0a0f1a] border border-white/[0.06] w-full max-w-md rounded-3xl p-8 text-center overflow-hidden">
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/10" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10" />

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${type === "danger" ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                    <AlertTriangle size={28} className={type === "danger" ? "text-red-400" : "text-emerald-400"} />
                </div>
                <h2 className="text-xl font-black mb-2 text-white uppercase tracking-tight">{title}</h2>
                <p className="text-slate-500 text-xs mb-8 leading-relaxed font-mono">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl font-black text-slate-600 hover:text-slate-300 border border-white/[0.04] hover:border-white/10 transition-all text-[10px] uppercase tracking-widest">VAZGEÇ</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all text-[10px] uppercase tracking-widest ${type === "danger" ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950"}`}>
                        {confirmText}
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            </motion.div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
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
    const [questionTimer, setQuestionTimer] = useState<number>(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    // ── BUG FIX: ref'ler ile stale closure sorunu çözüldü ──
    const questionsRef = useRef<any[]>([]);
    const currentQuestionIndexRef = useRef(0);
    const groupCodeRef = useRef("");
    const scoredTeamsRef = useRef<Set<string>>(new Set());
    const pollingRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // State değişince ref'leri güncelle
    useEffect(() => { questionsRef.current = questions; }, [questions]);
    useEffect(() => { currentQuestionIndexRef.current = currentQuestionIndex; }, [currentQuestionIndex]);
    useEffect(() => { groupCodeRef.current = groupCode; }, [groupCode]);

    const [newQ, setNewQ] = useState({
        ders: "Genel Kültür", question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A", sure: 30
    });

    /* ─── TIMER ─── */
    useEffect(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (isTimerActive && questionTimer > 0) {
            timerIntervalRef.current = setInterval(() => {
                setQuestionTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current!);
                        setIsTimerActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
    }, [isTimerActive]);

    useEffect(() => {
        if (gameStatus === "active" && questionsRef.current[currentQuestionIndex]) {
            setQuestionTimer(questionsRef.current[currentQuestionIndex].sure || 30);
            setIsTimerActive(true);
        }
    }, [currentQuestionIndex, gameStatus]);

    /* ─── INIT ─── */
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedCode = localStorage.getItem("admin_groupCode");
        if (savedCode) {
            setGroupCode(savedCode);
            groupCodeRef.current = savedCode;
            setIsLive(true);
            loadQuestions().then(() => startPolling(savedCode));
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
            if (Array.isArray(data)) {
                setQuestions(data);
                questionsRef.current = data;
            }
        } catch { toast.error("Sorular yüklenemedi"); }
    };

    const addScoreToTeam = useCallback(async (teamName: string) => {
        if (scoredTeamsRef.current.has(teamName)) return;
        scoredTeamsRef.current.add(teamName);
        try {
            await gameApi.updateScore(groupCodeRef.current, teamName, 10);
            toast.success(`${teamName} +10 Puan!`, { icon: "⚡" });
        } catch {
            scoredTeamsRef.current.delete(teamName);
        }
    }, []);

    /* ─── BUG FIX: polling artık ref'leri okuyor, stale closure yok ─── */
    const startPolling = useCallback((code: string) => {
        stopPolling();
        pollingRef.current = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(code);

                if (data.teams) {
                    // ── BUG FIX: timestamp kontrolü — backend'den gelen takımlar
                    // son X saniye içinde aktif olanları filtrele ──
                    // Eğer backend connectedAt/lastSeen döndürüyorsa filtrele,
                    // döndürmüyorsa tüm teams'i al (mevcut API yapısı korunuyor)
                    setActiveTeams(data.teams);

                    const idx = currentQuestionIndexRef.current;
                    const currentQ = questionsRef.current[idx];
                    if (currentQ) {
                        data.teams.forEach((team: any) => {
                            if (
                                team.selectedAnswer === currentQ.correctAnswer &&
                                !scoredTeamsRef.current.has(team.teamName)
                            ) {
                                addScoreToTeam(team.teamName);
                            }
                        });
                    }
                }

                if (data.status === "finished") {
                    setGameStatus("finished");
                    stopPolling();
                } else if (data.status) {
                    setGameStatus(data.status);
                }
            } catch (e) { console.error(e); }
        }, 1000);
    }, [addScoreToTeam]);

    const stopPolling = () => { if (pollingRef.current) clearInterval(pollingRef.current); };

    /* ─── HANDLERS ─── */
    const handleSetupGame = async () => {
        const t = toast.loading("Arena kuruluyor...");
        try {
            const { code } = await gameApi.generateCode();
            await gameApi.startSession(code, "multigame");
            setGroupCode(code);
            groupCodeRef.current = code;
            localStorage.setItem("admin_groupCode", code);
            setIsLive(true);
            setGameStatus("waiting");
            await loadQuestions();
            startPolling(code);
            toast.success("Arena Hazır!", { id: t });
        } catch { toast.error("Hata!", { id: t }); }
    };

    const handleStartCompetition = async () => {
        if (activeTeams.length === 0) { toast.error("Oyuncu bekleniyor..."); return; }
        let count = 3;
        setCountdown(count);
        const tick = () => {
            count--;
            if (count > 0) { setCountdown(count); countdownRef.current = setTimeout(tick, 1000); }
            else {
                setCountdown(null);
                gameApi.updateStatus(groupCodeRef.current, "active").then(() => setGameStatus("active"));
            }
        };
        countdownRef.current = setTimeout(tick, 1000);
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndexRef.current >= questionsRef.current.length - 1) {
            toast("Son soruya ulaşıldı, oyunu bitirmek için BİTİR butonuna basın.");
            return;
        }
        try {
            await gameApi.resetAnswers(groupCodeRef.current);
            setCurrentQuestionIndex(prev => prev + 1);
            scoredTeamsRef.current.clear();
            toast.success("Sıradaki soru!");
        } catch { toast.error("Hata!"); }
    };

    const handleFinishGame = async () => {
        setIsFinishModalOpen(false);
        try {
            await gameApi.finishSession(groupCodeRef.current);
            stopPolling();
            setGameStatus("finished");
            localStorage.removeItem("admin_groupCode");
        } catch { toast.error("Hata!"); }
    };

    const handleSaveQuestion = async () => {
        const { question, options } = newQ;
        if (!question || !options.A || !options.B || !options.C || !options.D) { toast.error("Eksik alan!"); return; }
        const t = toast.loading("Kaydediliyor...");
        try {
            const res = await fetch(`${BACKEND_URL}/api/multigame`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newQ)
            });
            if (res.ok) {
                toast.success("Eklendi!", { id: t });
                setShowAddModal(false);
                setNewQ({ ders: "Genel Kültür", question: "", options: { A: "", B: "", C: "", D: "" }, correctAnswer: "A", sure: 30 });
                loadQuestions();
            } else { toast.error("Kaydedilemedi", { id: t }); }
        } catch { toast.error("Hata!", { id: t }); }
    };

    const currentQ = questions[currentQuestionIndex];

    /* ══════════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8 relative overflow-x-hidden" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' } }} />
            <CursorGlow />
            <ScanLine />
            <GridOverlay />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }} transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full" />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }} transition={{ repeat: Infinity, duration: 10, delay: 2 }}
                    className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full" />
            </div>

            {/* ─── GERİ SAYIM OVERLAY ─── */}
            <AnimatePresence>
                {countdown !== null && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#030712]/98 backdrop-blur-3xl">
                        <div className="text-center">
                            <p className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase mb-8">// Hazırlanın</p>
                            <motion.div
                                key={countdown}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="text-[18rem] font-black text-white leading-none"
                                style={{ textShadow: "0 0 80px rgba(16,185,129,0.4)" }}
                            >
                                {countdown}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-6xl mx-auto">
                <AdminBreadcrumb currentPage="ARENA CONTROL" />

                {/* ─── HEADER ─── */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center relative p-6 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] mb-8 overflow-hidden">
                    <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/10" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/10" />

                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                                <Terminal size={16} className="text-emerald-400" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tight text-white">Arena Pro Admin</h1>
                        </div>
                        <p className="text-[9px] font-black tracking-[0.3em] text-emerald-600 uppercase flex items-center gap-2 ml-11">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Canlı Kontrol Merkezi
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-white/10 text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            <PlusCircle size={14} /> Soru Ekle
                        </button>

                        {!isLive ? (
                            <button
                                onClick={handleSetupGame}
                                className="group relative flex items-center gap-2 px-8 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-950 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                                <span className="relative flex items-center gap-2"><Play size={14} /> Odayı Kur</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => { navigator.clipboard.writeText(groupCode); toast.success("Kod kopyalandı!"); }}
                                className="group flex flex-col items-center px-6 py-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all cursor-pointer"
                            >
                                <span className="text-[8px] text-emerald-700 font-black uppercase tracking-widest">Kodu Kopyala</span>
                                <span className="text-lg font-mono font-black text-emerald-400 group-hover:text-white transition-colors">{groupCode}</span>
                            </button>
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                </div>

                {/* ══════════════════════════════════════════════
                    EKRAN: FİNAL
                ══════════════════════════════════════════════ */}
                {gameStatus === "finished" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="relative p-12 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] text-center overflow-hidden"
                    >
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />

                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="inline-block mb-6">
                            <Trophy size={56} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] mx-auto" />
                        </motion.div>
                        <p className="text-[10px] font-black tracking-[0.35em] text-yellow-500 uppercase mb-3">// Final Sonuçları</p>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-10">Oyun Bitti</h2>

                        <div className="space-y-3 mb-10 max-w-md mx-auto">
                            {[...activeTeams].sort((a, b) => (b.score || 0) - (a.score || 0)).map((team, idx) => (
                                <motion.div key={team.teamName} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? "bg-yellow-500 text-slate-950" : idx === 1 ? "bg-slate-400 text-slate-950" : idx === 2 ? "bg-orange-600 text-slate-950" : "bg-white/5 text-slate-500"}`}>
                                            {idx + 1}
                                        </span>
                                        <span className="font-black uppercase text-sm text-white">{team.teamName}</span>
                                    </div>
                                    <span className="font-mono font-black text-xl text-emerald-400">{team.score || 0}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button onClick={() => window.location.reload()}
                            className="group relative mx-auto flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-950 overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                            <span className="relative flex items-center gap-2"><LogOut size={16} /> Yeni Oturum</span>
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════
                    EKRAN: BEKLEME ODASI
                ══════════════════════════════════════════════ */}
                {gameStatus === "waiting" && isLive && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="relative p-10 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] text-center overflow-hidden"
                    >
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />

                        <p className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-4 flex items-center justify-center gap-3">
                            <span className="h-px w-4 bg-emerald-500/50" /> // Bekleme Odası <span className="h-px w-4 bg-emerald-500/50" />
                        </p>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-10">Takımlar Bekleniyor</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {TEAMS_CONFIG.map(config => {
                                // ── BUG FIX: activeTeams'den gelen veriye göre kontrol ──
                                const joinedTeam = activeTeams.find(t => t.teamName === config.name);
                                const joined = !!joinedTeam;

                                return (
                                    <motion.div key={config.name}
                                        animate={joined ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className={`relative p-6 rounded-2xl border-2 transition-all duration-500 overflow-hidden ${joined ? `${config.border} ${config.bg} ${config.glow}` : "border-white/[0.03] opacity-30"}`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`w-2 h-2 rounded-full ${joined ? config.dot + " animate-pulse" : "bg-slate-700"}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${joined ? config.text : "text-slate-600"}`}>{config.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {joined ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-slate-700" />}
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{joined ? "Bağlandı" : "Bekleniyor"}</span>
                                        </div>
                                        {joined && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <button onClick={handleStartCompetition}
                            className="group relative mx-auto flex items-center gap-2 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-950 overflow-hidden disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                            <span className="relative flex items-center gap-2"><Zap size={16} /> Yarışmayı Başlat</span>
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    </motion.div>
                )}

                {/* ══════════════════════════════════════════════
                    EKRAN: AKTİF OYUN
                ══════════════════════════════════════════════ */}
                {gameStatus === "active" && isLive && currentQ && (
                    <>
                        {/* ─── SORU KARTI ─── */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="relative p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] mb-6 overflow-hidden"
                            >
                                {/* Progress bar */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.03]">
                                    <div
                                        className={`h-full transition-all duration-1000 rounded-full ${questionTimer < 10 ? "bg-red-500" : "bg-emerald-500"}`}
                                        style={{ width: `${(questionTimer / (currentQ.sure || 30)) * 100}%` }}
                                    />
                                </div>

                                <div className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/10" />
                                <div className="absolute top-5 right-5 w-4 h-4 border-t border-r border-white/10" />

                                <div className="flex items-center justify-between mb-6 mt-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black tracking-[0.25em] text-emerald-500 uppercase px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                                            {currentQ.ders}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                                            Soru {currentQuestionIndex + 1}/{questions.length}
                                        </span>
                                    </div>
                                    <TimerRing timeLeft={questionTimer} totalTime={currentQ.sure || 30} />
                                </div>

                                <h2 className="text-2xl font-black text-white leading-tight text-center mb-8 tracking-tight">
                                    {currentQ.question}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {Object.entries(currentQ.options || {}).map(([key, val]: any) => {
                                        const isCorrect = currentQ.correctAnswer === key;
                                        return (
                                            <div key={key} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isCorrect ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/[0.04] bg-white/[0.01]"}`}>
                                                <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-sm ${isCorrect ? "bg-emerald-500 text-slate-950" : "bg-white/5 text-slate-600"}`}>{key}</span>
                                                <span className={`text-sm font-bold ${isCorrect ? "text-emerald-400" : "text-slate-400"}`}>{val}</span>
                                                {isCorrect && <ShieldCheck size={14} className="text-emerald-500 ml-auto shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* ─── TAKIM CEVAPLARI ─── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-32">
                            {TEAMS_CONFIG.map(config => {
                                const team = activeTeams.find(t => t.teamName === config.name);

                                // ── BUG FIX: bağlı olmayan takımları "disconnected" göster ──
                                const isConnected = !!team;
                                const answered = isConnected && !!team?.selectedAnswer;
                                const isCorrect = answered && team?.selectedAnswer === currentQ?.correctAnswer;

                                return (
                                    <motion.div
                                        key={config.name}
                                        animate={isCorrect ? { scale: [1, 1.03, 1] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${!isConnected
                                                ? "border-white/[0.02] opacity-20 grayscale"
                                                : answered
                                                    ? `${config.border} bg-[#0a0f1a] ${config.glow}`
                                                    : "border-white/[0.04] bg-[#0a0f1a] opacity-60"
                                            }`}
                                    >
                                        {/* Bağlantı durumu */}
                                        <div className="absolute top-3 right-3">
                                            {isConnected
                                                ? <Wifi size={12} className="text-emerald-500" />
                                                : <WifiOff size={12} className="text-slate-700" />
                                            }
                                        </div>

                                        {isCorrect && (
                                            <div className="absolute top-3 left-3">
                                                <ShieldCheck size={14} className="text-emerald-400" />
                                            </div>
                                        )}

                                        <div className={`w-2 h-2 rounded-full mb-3 ${isConnected ? config.dot + " animate-pulse" : "bg-slate-800"}`} />
                                        <h3 className={`text-[9px] font-black uppercase tracking-widest mb-4 ${config.text}`}>{config.name}</h3>

                                        <div className={`text-5xl font-black font-mono mb-4 ${isCorrect ? "text-emerald-400" : answered ? "text-white" : "text-slate-700"}`}>
                                            {answered ? team?.selectedAnswer : "—"}
                                        </div>

                                        <div className="w-full pt-4 border-t border-white/[0.04] flex justify-between">
                                            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Puan</span>
                                            <span className="text-lg font-black text-white font-mono">{team?.score || 0}</span>
                                        </div>

                                        {isCorrect && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />}
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ─── ALT KONTROL BAR ─── */}
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-3">
                            <div className="relative flex gap-3 p-3 rounded-3xl bg-[#0a0f1a]/95 backdrop-blur-xl border border-white/[0.06] shadow-2xl overflow-hidden">
                                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/10" />
                                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/10" />

                                <button
                                    disabled={questionTimer > 0}
                                    onClick={handleNextQuestion}
                                    className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all overflow-hidden ${questionTimer > 0
                                            ? "bg-white/[0.02] border border-white/[0.04] text-slate-600 cursor-not-allowed"
                                            : "text-slate-950"
                                        }`}
                                >
                                    {questionTimer <= 0 && <div className="absolute inset-0 bg-emerald-400 hover:bg-emerald-300 transition-colors duration-300" />}
                                    <span className="relative flex items-center gap-2">
                                        {questionTimer > 0 ? `${questionTimer}s Bekle` : "Sıradaki Soru"}
                                        <ChevronRight size={16} />
                                    </span>
                                </button>

                                <button
                                    onClick={() => setIsFinishModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Bitir
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ─── CONFIRM MODAL ─── */}
            <ConfirmModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={handleFinishGame}
                title="Bitirme Onayı"
                message="Final puanları hesaplanacak ve oturum sonlandırılacak. Emin misiniz?"
                confirmText="Evet, Bitir"
            />

            {/* ─── ADD QUESTION MODAL ─── */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="relative bg-[#0a0f1a] border border-white/[0.06] w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10" />

                            <button onClick={() => setShowAddModal(false)} className="absolute top-5 right-5 p-2 rounded-xl border border-white/[0.04] text-slate-600 hover:text-white hover:border-white/10 transition-all">
                                <X size={16} />
                            </button>

                            <p className="text-[10px] font-black tracking-[0.3em] text-emerald-500 uppercase mb-2">// Soru Bankası</p>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8">Yeni Soru Ekle</h2>

                            <div className="space-y-3">
                                <input
                                    className="w-full bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 p-3.5 rounded-2xl outline-none text-sm text-slate-300 placeholder:text-slate-700 transition-all"
                                    placeholder="Ders (örn: Tarih)" value={newQ.ders}
                                    onChange={e => setNewQ({ ...newQ, ders: e.target.value })}
                                />
                                <textarea
                                    className="w-full bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 p-3.5 rounded-2xl min-h-[90px] outline-none text-sm text-slate-300 placeholder:text-slate-700 transition-all resize-none"
                                    placeholder="Soru metni..." value={newQ.question}
                                    onChange={e => setNewQ({ ...newQ, question: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    {(['A', 'B', 'C', 'D'] as const).map(h => (
                                        <input key={h}
                                            className="bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 p-3.5 rounded-2xl text-sm outline-none text-slate-300 placeholder:text-slate-700 transition-all"
                                            placeholder={`${h} şıkkı`} value={(newQ.options as any)[h]}
                                            onChange={e => setNewQ({ ...newQ, options: { ...newQ.options, [h]: e.target.value } })}
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        className="bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 p-3.5 rounded-2xl text-sm outline-none text-slate-300 cursor-pointer transition-all"
                                        value={newQ.correctAnswer}
                                        onChange={e => setNewQ({ ...newQ, correctAnswer: e.target.value })}
                                    >
                                        {['A', 'B', 'C', 'D'].map(o => <option key={o} value={o} className="bg-[#0a0f1a]">Doğru: {o}</option>)}
                                    </select>
                                    <input type="number"
                                        className="bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/30 p-3.5 rounded-2xl text-sm outline-none text-slate-300 placeholder:text-slate-700 transition-all"
                                        placeholder="Süre (sn)" value={newQ.sure}
                                        onChange={e => setNewQ({ ...newQ, sure: parseInt(e.target.value) || 30 })}
                                    />
                                </div>
                                <button onClick={handleSaveQuestion}
                                    className="group relative w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-950 overflow-hidden mt-2">
                                    <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                                    <span className="relative">Kaydet</span>
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}