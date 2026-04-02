"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import { Trophy, Terminal, Lock, Unlock, Wifi, Eye } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

export const dynamic = 'force-dynamic';

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
            className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
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
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
            }}
        />
    );
}

/* ─── TIMER RING (büyük — projeksiyon için) ─── */
function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
    const size = 100;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;
    const offset = circumference * (1 - progress);
    const isWarning = timeLeft <= 5;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none"
                    stroke={isWarning ? "#ef4444" : "#10b981"}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                />
            </svg>
            <span className={`font-mono font-black text-4xl relative z-10 tabular-nums ${isWarning ? "text-red-400" : "text-white"}`}>
                {timeLeft}
            </span>
        </div>
    );
}

/* ══════════════════════════════════════════════
   GİRİŞ EKRANI
══════════════════════════════════════════════ */
function JoinScreen({ onJoin }: { onJoin: (code: string) => void }) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8);
        setInputValue(val.length > 4 ? val.substring(0, 4) + '-' + val.substring(4) : val);
    };

    const isValid = inputValue.replace('-', '').length === 8;
    const charCount = inputValue.replace('-', '').length;

    return (
        <div
            className="h-[100dvh] w-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <CursorGlow />
            <ScanLine />
            <GridOverlay />

            {/* Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
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
                <div className="relative p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.06] overflow-hidden text-white">
                    {/* Corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-emerald-500/30" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-emerald-500/30" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-emerald-500/30" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-emerald-500/30" />

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 mb-5">
                            <Eye className="text-emerald-400" size={28} />
                        </div>
                        <h2 className="font-black text-white uppercase text-3xl tracking-[-0.04em]">
                            ARENA<span className="text-emerald-400">_</span>BROADCAST
                        </h2>
                        <p className="text-[9px] text-slate-600 font-black tracking-[0.35em] uppercase mt-2">
                            Seyirci Portalı
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="XXXX-XXXX"
                                className={`w-full p-4 bg-[#060b13] border rounded-2xl text-center font-mono text-2xl outline-none uppercase transition-all duration-300 placeholder:text-slate-800 tracking-[0.3em] ${isValid
                                        ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)] text-emerald-400"
                                        : "border-white/[0.04] text-white"
                                    }`}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && isValid && onJoin(inputValue)}
                            />
                            {/* Char counter */}
                            {inputValue.length > 0 && !isValid && (
                                <span className="absolute -bottom-5 left-0 right-0 text-center text-[9px] font-black text-slate-700 tracking-[0.3em]">
                                    {charCount}/8
                                </span>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => isValid && onJoin(inputValue)}
                                disabled={!isValid}
                                className={`group relative w-full p-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 ${isValid ? "text-slate-950" : "text-slate-700 cursor-not-allowed"
                                    }`}
                            >
                                <div className={`absolute inset-0 transition-colors duration-300 ${isValid ? "bg-emerald-400 group-hover:bg-emerald-300" : "bg-white/[0.03]"
                                    }`} />
                                <span className="relative flex items-center justify-center gap-2">
                                    {isValid ? <Unlock size={16} /> : <Lock size={16} />}
                                    Bağlan
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                </div>
            </motion.div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   YAYIM EKRANI
══════════════════════════════════════════════ */
function BroadcastScreen({ groupCode }: { groupCode: string }) {
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [totalTime, setTotalTime] = useState(30);
    const [gameStatus, setGameStatus] = useState("waiting");

    // ── BUG FIX: currentQuestionId ayrı ref'te tutularak polling sıfırlaması engelleniyor ──
    const currentQuestionIdRef = useRef<string | number | null | undefined>(null);

    useEffect(() => {
        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (!isMounted || !data) return;

                setTeams(data.teams || []);
                setGameStatus(data.status || "waiting");

                if (!data.currentQuestion) {
                    setCurrentQuestion(null);
                    setTimeLeft(null);
                    currentQuestionIdRef.current = null;
                    setShowAnswer(false);
                } else {
                    // ── BUG FIX: sadece yeni soru gelince timer sıfırla ──
                    if (currentQuestionIdRef.current !== data.currentQuestion.id) {
                        currentQuestionIdRef.current = data.currentQuestion.id;
                        setCurrentQuestion(data.currentQuestion);
                        setShowAnswer(false);
                        const t = data.currentQuestion.sure ?? 30;
                        setTotalTime(t);
                        setTimeLeft(t);
                    }
                }
            } catch (err) {
                console.error("Sync Error:", err);
            } finally {
                if (isMounted) timeoutId = setTimeout(fetchData, 1500);
            }
        };
        fetchData();
        return () => { isMounted = false; clearTimeout(timeoutId); };
    }, [groupCode]);

    // Geri sayım
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0) setShowAnswer(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
    const isWarning = timeLeft !== null && timeLeft <= 5;

    return (
        <div
            className="h-[100dvh] w-screen bg-[#030712] text-white flex flex-col overflow-hidden relative"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <ScanLine />
            <GridOverlay />

            {/* Ambient */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
                    transition={{ repeat: Infinity, duration: 8 }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
                    transition={{ repeat: Infinity, duration: 10, delay: 2 }}
                    className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full"
                />
            </div>

            {/* ─── HEADER HUD ─── */}
            <div className="relative z-20 shrink-0 flex items-center justify-between px-8 py-4 border-b border-white/[0.04] bg-[#030712]/80 backdrop-blur-xl">
                {/* Session info */}
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-[#0a0f1a] border border-white/[0.04]">
                        <Terminal size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-emerald-600 tracking-[0.3em] uppercase">Session</p>
                        <p className="text-base font-mono font-black tracking-widest text-white">#{groupCode}</p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full border border-white/[0.04] bg-white/[0.02]">
                        <Wifi size={10} className="text-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center">
                    {timeLeft !== null ? (
                        <TimerRing timeLeft={timeLeft} totalTime={totalTime} />
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="font-mono font-black text-4xl text-slate-700">--</span>
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em]">Kalan Süre</span>
                        </div>
                    )}
                </div>

                {/* Teams HUD */}
                <div className="flex gap-2">
                    {sortedTeams.length > 0 ? sortedTeams.slice(0, 4).map((t, idx) => (
                        <div key={idx} className="relative px-4 py-2.5 rounded-2xl bg-[#0a0f1a] border border-white/[0.04] text-center min-w-[90px]">
                            {idx === 0 && (
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]" />
                            )}
                            <div className="text-[9px] font-black text-slate-700 uppercase tracking-wider mb-1 truncate">{t.teamName}</div>
                            <div className="text-lg font-black text-emerald-400 font-mono">{t.score || 0}</div>
                        </div>
                    )) : (
                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Takım Bekleniyor...</div>
                    )}
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="relative z-10 flex-grow flex flex-col justify-center items-center px-12 overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentQuestion && gameStatus !== "waiting" ? (
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, scale: 0.97, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-5xl space-y-8"
                        >
                            {/* Question */}
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <span className="h-px w-8 bg-emerald-500/40" />
                                    <span className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase">
                                        {currentQuestion.ders || "// Arena"}
                                    </span>
                                    <span className="h-px w-8 bg-emerald-500/40" />
                                </div>
                                <h1 className="text-[4vh] font-black leading-snug uppercase tracking-tight text-white">
                                    {currentQuestion.question}
                                </h1>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-4">
                                {['A', 'B', 'C', 'D'].map((char) => {
                                    const isCorrect = showAnswer && currentQuestion.correctAnswer === char;
                                    return (
                                        <motion.div
                                            key={char}
                                            animate={isCorrect ? { scale: [1, 1.03, 1] } : {}}
                                            transition={{ duration: 0.4 }}
                                            className={`relative flex items-center gap-5 p-6 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${isCorrect
                                                    ? "border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                                                    : "border-white/[0.04] bg-[#0a0f1a]"
                                                }`}
                                        >
                                            {/* Corner deco */}
                                            <div className={`absolute top-3 left-3 w-3 h-3 border-t border-l transition-colors duration-500 ${isCorrect ? "border-emerald-500/40" : "border-white/10"}`} />

                                            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${isCorrect ? "bg-emerald-500 text-slate-950" : "bg-white/[0.04] text-slate-500"
                                                }`}>
                                                {char}
                                            </div>
                                            <div className={`text-xl font-black uppercase tracking-tight truncate transition-colors duration-500 ${isCorrect ? "text-emerald-400" : "text-slate-300"
                                                }`}>
                                                {currentQuestion.options?.[char] || '---'}
                                            </div>

                                            {isCorrect && (
                                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="inline-block p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.04]"
                            >
                                <Terminal size={56} className="text-emerald-400 mx-auto" />
                            </motion.div>
                            <div>
                                <p className="text-[10px] font-black tracking-[0.35em] text-emerald-600 uppercase mb-3">// Bekleme</p>
                                <h2 className="text-4xl font-black uppercase tracking-[-0.03em] text-white mb-2">Arena Hazırlanıyor</h2>
                                <p className="text-slate-700 text-sm font-bold uppercase tracking-[0.3em]">Soru Bekleniyor</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ─── SCROLLING TICKER ─── */}
            <div className="relative z-20 shrink-0 h-[7vh] min-h-[48px] bg-emerald-500/10 border-t border-emerald-500/20 flex items-center overflow-hidden">
                <div className="flex gap-16 items-center animate-marquee whitespace-nowrap">
                    {[...sortedTeams, ...sortedTeams].map((t, i) => (
                        <span key={i} className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-3">
                            <Trophy size={14} className="text-yellow-400 shrink-0" />
                            {t.teamName}
                            <span className="text-white font-mono">{t.score || 0}</span>
                            <span className="text-emerald-800 mx-2">·</span>
                        </span>
                    ))}
                    {teams.length === 0 && (
                        <span className="text-sm font-black uppercase tracking-widest text-slate-700">
                            SKORLAR YÜKLENİYOR...
                        </span>
                    )}
                </div>
            </div>

            <style jsx>{`
                :global(html, body) { height: 100dvh !important; margin: 0; padding: 0; overflow: hidden; background: #030712; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>
        </div>
    );
}

/* ══════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════ */
function SpectatorContent() {
    const [groupCode, setGroupCode] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    if (!isStarted) {
        return <JoinScreen onJoin={(code) => { setGroupCode(code); setIsStarted(true); }} />;
    }

    return <BroadcastScreen groupCode={groupCode} />;
}

export default function SpectatorPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#030712]" />}>
            <SpectatorContent />
        </Suspense>
    );
}