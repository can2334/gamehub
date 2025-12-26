"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import { Trophy, LayoutDashboard, Gamepad2, ShieldAlert, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Build hatasını önlemek için dinamik render'ı zorunlu kılıyoruz
export const dynamic = 'force-dynamic';

function SpectatorContent() {
    const searchParams = useSearchParams();
    const [groupCode, setGroupCode] = useState(searchParams.get('code') || "");
    const [isStarted, setIsStarted] = useState(!!searchParams.get('code'));
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<string>("active");

    // 1. Oturum Zaman Aşımı Kontrolü (Client-side safe)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const codeInUrl = searchParams.get('code');
        if (!codeInUrl) return;

        const now = new Date().getTime();
        const sessionKey = `session_start_${codeInUrl}`;
        const startTime = localStorage.getItem(sessionKey);

        if (!startTime) {
            localStorage.setItem(sessionKey, now.toString());
        } else {
            const diffInMinutes = (now - parseInt(startTime)) / (1000 * 60);
            if (diffInMinutes > 60) { // 60 Dakika limit
                localStorage.removeItem(sessionKey);
                window.location.href = "/seyirci";
            }
        }
    }, [searchParams]);

    // 2. Canlı Veri Akışı
    useEffect(() => {
        if (!isStarted || !groupCode) return;

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (isMounted && data) {
                    setTeams(data.teams || []);
                    setGameStatus(data.status || "active");

                    // Burada data.currentQuestion'ın varlığını kontrol ediyoruz
                    if (data.currentQuestion) {
                        setCurrentQuestion((prev: any) => {
                            // Soru değişmiş mi kontrolü (data.currentQuestion?.id kullanarak güvenli hale getirdik)
                            if (!prev || prev.id !== data.currentQuestion?.id) {
                                setTimeLeft(data.currentQuestion?.sure ?? 30); // ?? ile fallback değeri verdik
                                setShowAnswer(false);
                                return data.currentQuestion;
                            }
                            return prev;
                        });
                    } else {
                        // Eğer soru yoksa state'i temizle
                        setCurrentQuestion(null);
                        setTimeLeft(null);
                    }
                }
            } catch (err) {
                console.error("Sync Error:", err);
            } finally {
                if (isMounted) timeoutId = setTimeout(fetchData, 1500);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [isStarted, groupCode]);

    // 3. Geri Sayım Mantığı
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0) setShowAnswer(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // --- GÖRÜNÜM: OYUN BİTTİ ---
    if (gameStatus === "finished") {
        const sorted = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
        return (
            <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <Trophy size={100} className="text-yellow-500 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
                    <h1 className="text-8xl font-black italic tracking-tighter text-center mb-12">ARENA ŞAMPİYONLARI</h1>
                </motion.div>
                <div className="w-full max-w-3xl space-y-4">
                    {sorted.map((team, idx) => (
                        <motion.div key={idx} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}
                            className={`p-8 rounded-[2.5rem] flex justify-between items-center border-2 ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500 shadow-2xl scale-105' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center gap-8">
                                <span className="text-6xl font-black opacity-20 italic">0{idx + 1}</span>
                                <span className="text-4xl font-black uppercase tracking-tighter">{team.teamName}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-mono font-black text-indigo-400">{team.score || 0}</div>
                                <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">Puan</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <button onClick={() => window.location.href = "/seyirci"} className="mt-16 bg-indigo-600 px-12 py-5 rounded-full font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl">YENİ OTURUM</button>
            </div>
        );
    }

    // --- GÖRÜNÜM: GİRİŞ EKRANI ---
    if (!isStarted) return (
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 text-white overflow-hidden relative">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/[0.03] backdrop-blur-3xl p-16 rounded-[4rem] border border-white/10 text-center space-y-8 shadow-2xl max-w-lg w-full relative z-10">
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-indigo-500/40 shadow-2xl">
                    <LayoutDashboard size={48} className="text-white" />
                </div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">ARENA BROADCAST</h1>
                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Canlı İzleyici Portalı</p>
                <input type="text" placeholder="ODA KODU" className="w-full p-8 bg-black/50 border-2 border-white/5 rounded-[2.5rem] text-center text-5xl font-mono focus:border-indigo-500 outline-none transition-all uppercase placeholder:opacity-20"
                    value={groupCode} onChange={(e) => setGroupCode(e.target.value)} />
                <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 p-8 rounded-[2.5rem] font-black text-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">ARENAYA BAĞLAN</button>
            </motion.div>
        </div>
    );

    // --- GÖRÜNÜM: ANA OYUN EKRANI ---
    return (
        <div className="min-h-screen bg-[#050816] text-white p-8 flex flex-col font-sans overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

            {/* Üst Bilgi Barı */}
            <div className="flex justify-between items-center bg-white/[0.02] backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 mb-12 relative z-10 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
                        <Gamepad2 className="text-indigo-400" size={32} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black text-indigo-500 tracking-[0.5em] uppercase mb-1">Live Arena Session</h2>
                        <p className="text-4xl font-mono font-black tracking-tighter text-white"># {groupCode}</p>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className={`text-9xl font-black font-mono tabular-nums leading-none tracking-tighter ${timeLeft && timeLeft <= 5 ? 'text-red-500 animate-pulse scale-110' : 'text-white'}`}>
                        {timeLeft ?? "--"}
                    </div>
                    <div className="flex items-center gap-2 mt-2 opacity-40">
                        <Timer size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Süre Azalıyor</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    {teams.map((t, idx) => (
                        <motion.div layout key={idx} className="bg-white/[0.03] px-8 py-4 rounded-[2rem] border border-white/10 text-center min-w-[140px] shadow-lg">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.teamName}</div>
                            <div className="text-3xl font-black text-indigo-400">{t.score || 0}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Orta Alan: Soru */}
            <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full relative z-10">
                <AnimatePresence mode="wait">
                    {currentQuestion ? (
                        <motion.div key={currentQuestion.id} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="space-y-16">
                            <div className="text-center space-y-8">
                                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-block bg-indigo-600 px-8 py-3 rounded-full text-sm font-black uppercase tracking-[0.5em] shadow-2xl shadow-indigo-600/40">
                                    {currentQuestion.ders || "ARENA SORUSU"}
                                </motion.div>
                                <h1 className="text-7xl font-black leading-[1.1] tracking-tighter max-w-5xl mx-auto italic">
                                    {currentQuestion.question}
                                </h1>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                {['A', 'B', 'C', 'D'].map((char) => {
                                    const isCorrect = currentQuestion.correctAnswer === char;
                                    const highlight = showAnswer && isCorrect;
                                    return (
                                        <motion.div key={char}
                                            animate={highlight ? { scale: 1.05 } : {}}
                                            className={`p-10 rounded-[3.5rem] border-2 flex items-center gap-10 transition-all duration-700 shadow-2xl ${highlight ? 'bg-emerald-500 border-emerald-400 text-[#050816]' : 'bg-white/5 border-white/5 text-slate-300'}`}>
                                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-inner ${highlight ? 'bg-black/20 text-white' : 'bg-black/40 text-indigo-500'}`}>
                                                {char}
                                            </div>
                                            <div className="text-4xl font-black tracking-tight uppercase italic">{currentQuestion.options?.[char] || '---'}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center opacity-10 animate-pulse">
                            <Gamepad2 size={200} className="mx-auto mb-8" />
                            <h2 className="text-6xl font-black italic tracking-tighter uppercase">Bekleniyor...</h2>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Alt Şerit Animasyonu (Marquee) */}
            <div className="mt-12 overflow-hidden bg-indigo-600 py-6 rounded-full flex relative shadow-[0_-20px_50px_rgba(79,70,229,0.2)]">
                <div className="whitespace-nowrap flex gap-24 items-center animate-marquee">
                    {[...teams, ...teams, ...teams].map((t, i) => (
                        <span key={i} className="text-2xl font-black uppercase italic text-white flex items-center gap-4">
                            <Trophy size={24} className="text-yellow-400" /> {t.teamName}: {t.score || 0} PUAN
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>
        </div>
    );
}

// 4. Ana Sayfa Bileşeni (Build Hatasını Çözen Sarıcı)
export default function SpectatorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-black italic tracking-widest uppercase opacity-50">Sistem Hazırlanıyor</p>
            </div>
        }>
            <SpectatorContent />
        </Suspense>
    );
}