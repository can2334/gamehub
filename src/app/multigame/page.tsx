"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    Trophy, Star, ArrowLeft, Eye, BookOpen,
    Zap, ShieldCheck, Loader2, Terminal, LogOut
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const ANSWERS = ['A', 'B', 'C', 'D'];

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
            className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
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
                backgroundSize: "60px 60px",
            }}
        />
    );
}

/* ─── TIMER RING ─── */
function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;
    const strokeDashoffset = circumference * (1 - progress);
    const isWarning = timeLeft <= 5;

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="96" height="96">
                {/* Track */}
                <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                {/* Progress */}
                <circle
                    cx="48" cy="48" r={radius}
                    fill="none"
                    stroke={isWarning ? "#ef4444" : "#10b981"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                />
            </svg>
            <span className={`font-mono font-black text-3xl relative z-10 ${isWarning ? "text-red-400" : "text-white"}`}>
                {timeLeft}
            </span>
        </div>
    );
}

export default function StudentGamepad() {
    const router = useRouter();
    const [groupCode, setGroupCode] = useState("");
    const [teamName, setTeamName] = useState("");
    const [joined, setJoined] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [gameStatus, setGameStatus] = useState<string>("waiting");
    const [allTeams, setAllTeams] = useState<TeamStatus[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [totalTime, setTotalTime] = useState<number>(30);
    const [myScore, setMyScore] = useState<number>(0);
    const [lessonName, setLessonName] = useState("YÜKLENİYOR...");

    // ── BUG FIX: isTimeUp ayrı state olarak takip ediliyor ──
    // timeLeft === 0 yerine bu flag kullanılıyor; yeni soru gelince false'a sıfırlanıyor
    const [isTimeUp, setIsTimeUp] = useState(false);

    const scoreSubmittedRef = useRef(false);

    // 1. Giriş Bilgilerini Yükle
    useEffect(() => {
        const savedCode = localStorage.getItem("student_groupCode");
        const savedTeam = localStorage.getItem("student_teamName");
        if (savedCode && savedTeam) {
            setGroupCode(savedCode);
            setTeamName(savedTeam);
            setJoined(true);
        }
    }, []);

    // 2. Ana API Polling
    useEffect(() => {
        if (!joined || !groupCode) return;
        const interval = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode) as any;
                if (!data) return;

                setGameStatus(data.status || "waiting");
                setLessonName(data.ders || data.lessonName || "CANLI ARENA");

                if (data.teams) {
                    setAllTeams(data.teams);
                    const me = data.teams.find((t: any) => t.teamName === teamName);
                    if (me) setMyScore(me.score || 0);
                }

                if (data.currentQuestion) {
                    // Yeni soru geldi mi kontrol et
                    if (!currentQuestion || currentQuestion.id !== data.currentQuestion.id) {
                        setCurrentQuestion(data.currentQuestion);
                        setSelected(null);
                        setIsTimeUp(false); // ── BUG FIX: yeni soruda sıfırla ──
                        scoreSubmittedRef.current = false;

                        const initialTime = data.currentQuestion.sure ?? 30;
                        setTotalTime(initialTime);

                        const savedTime = localStorage.getItem(`timeLeft_${data.currentQuestion.id}`);
                        if (savedTime !== null) {
                            const parsed = parseInt(savedTime);
                            setTimeLeft(parsed);
                            if (parsed <= 0) setIsTimeUp(true);
                        } else {
                            setTimeLeft(initialTime);
                            localStorage.setItem(`timeLeft_${data.currentQuestion.id}`, initialTime.toString());
                        }
                    }
                } else {
                    setCurrentQuestion(null);
                    setTimeLeft(null);
                    setIsTimeUp(false);
                }
            } catch (err) {
                console.error("Hata:", err);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [joined, groupCode, currentQuestion, teamName]);

    // 3. Geri Sayım
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || !currentQuestion) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (!prev || prev <= 1) {
                    clearInterval(timer);
                    localStorage.setItem(`timeLeft_${currentQuestion.id}`, "0");
                    setIsTimeUp(true); // ── BUG FIX: süre bitince flag'i set et ──
                    return 0;
                }
                const next = prev - 1;
                localStorage.setItem(`timeLeft_${currentQuestion.id}`, next.toString());
                return next;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft !== null && timeLeft > 0 ? currentQuestion?.id : null]);

    // 4. Otomatik Cevap Gönderimi
    useEffect(() => {
        if (isTimeUp && selected && !scoreSubmittedRef.current && currentQuestion) {
            scoreSubmittedRef.current = true;
            gameApi.submitFinalAnswer({
                groupCode,
                teamName,
                answer: selected,
                questionId: currentQuestion.id
            }).catch(() => {
                scoreSubmittedRef.current = false;
            });
        }
    }, [isTimeUp]);

    const handleExit = () => {
        localStorage.clear();
        setJoined(false);
        setGroupCode("");
        setTeamName("");
        window.location.href = "/multigame";
    };

    const handleJoin = async () => {
        if (!groupCode || !teamName) {
            toast.error("Lütfen kod girin ve takım seçin!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/api/session/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupCode: groupCode.toUpperCase().trim(),
                    teamName
                })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem("student_groupCode", groupCode.toUpperCase().trim());
                localStorage.setItem("student_teamName", teamName);
                setJoined(true);
                toast.success("Arenaya Girildi!");
            } else {
                toast.error(data.error || "Giriş yapılamadı");
            }
        } catch {
            toast.error("Sunucuya bağlanılamadı!");
        }
    };

    /* ══════════════════════════════════════════════
       EKRAN 1 — GİRİŞ
    ══════════════════════════════════════════════ */
    if (!joined) {
        return (
            <div
                className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-white relative overflow-hidden"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
                <Toaster position="top-center" />
                <CursorGlow />
                <ScanLine />
                <GridOverlay />

                {/* Blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.12, 0.07] }}
                        transition={{ repeat: Infinity, duration: 8 }}
                        className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
                        transition={{ repeat: Infinity, duration: 10, delay: 2 }}
                        className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-sm"
                >
                    {/* Card */}
                    <div className="relative p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.06] overflow-hidden">
                        {/* Corner deco */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-emerald-500/30" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-emerald-500/30" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-emerald-500/30" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-emerald-500/30" />

                        {/* Logo */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 mb-5">
                                <Terminal className="text-emerald-400" size={28} />
                            </div>
                            <h2 className="font-black text-white uppercase text-3xl tracking-[-0.04em]">
                                GAME<span className="text-emerald-400">_</span>HUB
                            </h2>
                            <p className="text-[9px] text-slate-600 font-black tracking-[0.35em] uppercase mt-2">
                                Arena Giriş Portalı
                            </p>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="ODA KODU"
                                className="w-full p-4 bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/40 rounded-2xl text-center font-mono text-xl outline-none uppercase transition-all duration-300 placeholder:text-slate-700"
                                onChange={(e) => setGroupCode(e.target.value)}
                                value={groupCode}
                            />
                            <select
                                className="w-full p-4 bg-[#060b13] border border-white/[0.04] focus:border-emerald-500/40 rounded-2xl font-bold outline-none text-slate-300 appearance-none cursor-pointer transition-all duration-300 text-sm tracking-wider"
                                onChange={(e) => setTeamName(e.target.value)}
                                value={teamName}
                            >
                                <option value="" className="bg-[#0a0f1a]">TAKIMINI SEÇ</option>
                                <option value="Kırmızı" className="bg-[#0a0f1a]">🔴 KIRMIZI TAKIM</option>
                                <option value="Mavi" className="bg-[#0a0f1a]">🔵 MAVİ TAKIM</option>
                                <option value="Sarı" className="bg-[#0a0f1a]">🟡 SARI TAKIM</option>
                                <option value="Yeşil" className="bg-[#0a0f1a]">🟢 YEŞİL TAKIM</option>
                            </select>

                            <button
                                onClick={handleJoin}
                                className="group relative w-full p-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase text-slate-950 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <Zap size={16} /> Arenaya Katıl
                                </span>
                            </button>

                            <div className="flex items-center gap-4 py-1">
                                <div className="h-px bg-white/[0.04] flex-grow" />
                                <span className="text-[9px] font-black text-slate-700 tracking-[0.2em]">VEYA</span>
                                <div className="h-px bg-white/[0.04] flex-grow" />
                            </div>

                            <button
                                onClick={() => router.push('/seyirci')}
                                className="w-full p-4 rounded-2xl font-bold text-sm text-slate-500 border border-white/[0.04] bg-white/[0.02] hover:border-emerald-500/20 hover:text-slate-300 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <Eye size={16} className="text-emerald-500" />
                                <span className="text-[11px] tracking-[0.2em] uppercase font-black">Seyirci Moduna Geç</span>
                            </button>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    </div>
                </motion.div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════
       EKRAN 2 — BEKLEME ODASI
    ══════════════════════════════════════════════ */
    if (gameStatus === "waiting" || !currentQuestion) {
        return (
            <div
                className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
                <CursorGlow />
                <ScanLine />
                <GridOverlay />
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
                        transition={{ repeat: Infinity, duration: 8 }}
                        className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 flex flex-col items-center max-w-sm w-full"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="mb-8 p-5 rounded-2xl bg-[#0a0f1a] border border-white/[0.04]"
                    >
                        <Loader2 size={32} className="text-emerald-400" />
                    </motion.div>

                    <p className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-4 flex items-center gap-3">
                        <span className="h-px w-4 bg-emerald-500/50" />
                        // Bekleme Odası
                        <span className="h-px w-4 bg-emerald-500/50" />
                    </p>
                    <h2 className="text-3xl font-black text-white uppercase tracking-[-0.03em] mb-3">Hazır Ol!</h2>
                    <p className="text-slate-600 text-xs leading-relaxed mb-10 max-w-[220px]">
                        Öğretmen arena savaşını başlatmak üzere. İlk soru gelene kadar bekle.
                    </p>

                    {/* Team badge */}
                    <div className="relative w-full p-6 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] overflow-hidden">
                        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-emerald-500/20" />
                        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-emerald-500/20" />
                        <span className="text-[9px] text-emerald-500 font-black block mb-2 uppercase tracking-[0.3em]">Kayıtlı Takım</span>
                        <div className="text-xl font-black text-white uppercase">{teamName}</div>
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    </div>

                    <button
                        onClick={handleExit}
                        className="mt-8 flex items-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-400 transition-colors duration-300"
                    >
                        <ArrowLeft size={12} /> Odadan Çık
                    </button>
                </motion.div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════
       EKRAN 3 — OYUN SONU
    ══════════════════════════════════════════════ */
    if (gameStatus === "finished") {
        const sortedTeams = [...allTeams].sort((a, b) => (b.score || 0) - (a.score || 0));
        const myRank = sortedTeams.findIndex(t => t.teamName === teamName) + 1;

        return (
            <div
                className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
                <CursorGlow />
                <ScanLine />
                <GridOverlay />
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.12, 0.07] }}
                        transition={{ repeat: Infinity, duration: 8 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-yellow-500 blur-[160px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 w-full max-w-md"
                >
                    <div className="mb-8">
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="inline-block"
                        >
                            <Trophy size={64} className="text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] mx-auto" />
                        </motion.div>
                        <p className="text-[10px] font-black tracking-[0.35em] text-yellow-500 uppercase mt-4 mb-2">// Final Sonuçları</p>
                        <h2 className="text-4xl font-black text-white uppercase tracking-[-0.04em]">Oyun Bitti</h2>
                    </div>

                    <div className="relative p-6 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] mb-6 overflow-hidden">
                        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10" />
                        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10" />

                        <div className="space-y-3">
                            {sortedTeams.map((team, idx) => {
                                const isMe = team.teamName === teamName;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isMe
                                                ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                                                : "border-white/[0.04] bg-white/[0.02]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${idx === 0 ? "bg-yellow-500 text-slate-950" :
                                                    idx === 1 ? "bg-slate-400 text-slate-950" :
                                                        idx === 2 ? "bg-orange-600 text-slate-950" :
                                                            "bg-white/5 text-slate-500"
                                                }`}>
                                                {idx + 1}
                                            </span>
                                            <span className={`font-black uppercase text-sm ${isMe ? "text-emerald-400" : "text-slate-400"}`}>
                                                {team.teamName}
                                                {isMe && <span className="text-[9px] ml-2 text-emerald-600">(SEN)</span>}
                                            </span>
                                        </div>
                                        <span className="font-mono font-black text-lg text-white">{team.score || 0}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                    </div>

                    <button
                        onClick={handleExit}
                        className="group relative w-full p-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase text-slate-950 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                        <span className="relative flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Ana Menü
                        </span>
                    </button>
                </motion.div>
            </div>
        );
    }

    /* ══════════════════════════════════════════════
       EKRAN 4 — AKTİF OYUN
    ══════════════════════════════════════════════ */
    return (
        <div
            className="min-h-screen bg-[#030712] p-4 text-white flex flex-col items-center relative overflow-hidden"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <Toaster position="top-center" />
            <CursorGlow />
            <ScanLine />
            <GridOverlay />

            {/* Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.08, 0.05] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
                    transition={{ repeat: Infinity, duration: 10, delay: 2 }}
                    className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full"
                />
            </div>

            {/* ─── LESSON BAR ─── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative p-3 rounded-2xl bg-[#0a0f1a] border border-white/[0.04] flex items-center justify-center gap-3 mb-4 z-10"
            >
                <BookOpen size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{lessonName}</span>
                <div className="absolute right-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">Live</span>
                </div>
            </motion.div>

            {/* ─── HUD BAR ─── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md relative p-5 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] flex items-center justify-between mb-4 z-10 overflow-hidden"
            >
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10" />

                {/* Team */}
                <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Takım</span>
                    <span className="text-white font-black uppercase text-base tracking-tight">{teamName}</span>
                </div>

                {/* Timer */}
                <TimerRing timeLeft={timeLeft ?? 0} totalTime={totalTime} />

                {/* Score */}
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-yellow-600 uppercase tracking-[0.2em] mb-1">Puan</span>
                    <div className="text-white font-black text-base flex items-center gap-1.5">
                        {myScore}
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            </motion.div>

            {/* ─── SORU KARTI ─── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion?.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md relative p-7 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] mb-4 z-10 overflow-hidden"
                >
                    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-emerald-500/20" />
                    <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-emerald-500/20" />

                    <div className="flex items-center gap-2 mb-5">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Soru Aktif</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-relaxed">
                        {currentQuestion?.question}
                    </h3>

                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* ─── CEVAP BUTONLARI ─── */}
            <div className="w-full max-w-md grid gap-3 mb-8 relative z-10">
                {ANSWERS.map((ans) => {
                    const isSelected = selected === ans;
                    const isCorrect = currentQuestion?.correctAnswer === ans;

                    // ── BUG FIX: isTimeUp state'i kullanılıyor, timeLeft === 0 değil ──
                    let style = "bg-[#0a0f1a] border-white/[0.04] text-slate-500 hover:border-white/10 hover:text-slate-300";
                    let labelStyle = "bg-white/5 text-slate-600";

                    if (!isTimeUp && isSelected) {
                        style = "bg-emerald-500/10 border-emerald-500/50 text-white scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.1)]";
                        labelStyle = "bg-emerald-500 text-slate-950";
                    }

                    if (isTimeUp) {
                        if (isCorrect) {
                            style = "bg-emerald-500/15 border-emerald-500/60 text-white scale-[1.02]";
                            labelStyle = "bg-emerald-500 text-slate-950";
                        } else if (isSelected && !isCorrect) {
                            style = "bg-red-500/10 border-red-500/40 text-red-400 opacity-80";
                            labelStyle = "bg-red-500 text-white";
                        } else {
                            style = "bg-white/[0.01] border-white/[0.02] opacity-25 grayscale";
                            labelStyle = "bg-white/5 text-slate-700";
                        }
                    }

                    return (
                        <motion.button
                            key={ans}
                            whileTap={!isTimeUp ? { scale: 0.98 } : {}}
                            onClick={() => !isTimeUp && setSelected(ans)}
                            disabled={isTimeUp}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${style}`}
                        >
                            <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 ${labelStyle}`}>
                                {ans}
                            </span>
                            <span className="font-bold text-sm text-left">{currentQuestion?.options?.[ans]}</span>

                            {/* Correct glow */}
                            {isTimeUp && isCorrect && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* ─── ÇIKIŞ ─── */}
            <button
                onClick={handleExit}
                className="relative z-10 mb-6 flex items-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-[0.25em] hover:text-red-400 transition-colors duration-300 group"
            >
                <LogOut size={12} className="group-hover:translate-x-0.5 transition-transform" />
                Oturumdan Ayrıl
            </button>
        </div>
    );
}