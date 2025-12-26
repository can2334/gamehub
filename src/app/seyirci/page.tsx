"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import { Eye, Trophy, Timer, LayoutDashboard, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpectatorPage() {
    const searchParams = useSearchParams();
    const [groupCode, setGroupCode] = useState(searchParams.get('code') || "");
    const [isStarted, setIsStarted] = useState(!!searchParams.get('code'));
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<string>("active");

    // Bu useEffect'i mevcut useEffect'lerinin üzerine ekleyebilirsin
    useEffect(() => {
        const codeInUrl = searchParams.get('code');
        if (!codeInUrl) return;

        const now = new Date().getTime();
        const sessionKey = `session_start_${codeInUrl}`;
        const startTime = localStorage.getItem(sessionKey);

        if (!startTime) {
            // İlk kez giriyor, zamanı başlat (Örn: 30 dakika limit)
            localStorage.setItem(sessionKey, now.toString());
        } else {
            const diffInMinutes = (now - parseInt(startTime)) / (1000 * 60);
            const limit = 30; // 30 Dakika sonra otomatik atar

            if (diffInMinutes > limit) {
                alert("Oturum süreniz doldu!");
                localStorage.removeItem(sessionKey);
                // URL'deki kodu temizleyip ana sayfaya yönlendir
                window.location.href = "/seyirci";
            }
        }
    }, [searchParams]);


    /// Canlı Veri Akışı
    useEffect(() => {
        if (!isStarted || !groupCode) return;

        let isMounted = true;
        // Node.js veya Browser ortamına göre tip tanımlama
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const fetchData = async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);

                if (isMounted && data) {
                    setTeams(data.teams || []);
                    setGameStatus(data.status || "active");

                    if (data.currentQuestion) {
                        // Tip hatasını önlemek için prevQuestion'ı mevcut state tipiyle belirtiyoruz
                        setCurrentQuestion((prevQuestion: any) => { // 'any' yerine varsa soru tipini yazabilirsin, örn: Question | null
                            // Optional chaining (?.) kullanarak null kontrolü yapıyoruz
                            if (!prevQuestion || prevQuestion.question !== data.currentQuestion?.question) {
                                setTimeLeft(data.currentQuestion?.sure || 30);
                                setShowAnswer(false);
                                return data.currentQuestion;
                            }
                            return prevQuestion;
                        });
                    }
                }
            } catch (err) {
                console.error("Senkronizasyon Hatası Detayı:", err);
            } finally {
                if (isMounted) {
                    timeoutId = setTimeout(fetchData, 1500);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isStarted, groupCode]);

    // Geri Sayım & Cevap Gösterimi
    useEffect(() => {
        // Süre yoksa veya bittiyse işlem yapma
        if (timeLeft === null || timeLeft === undefined) return;

        if (timeLeft <= 0) {
            setShowAnswer(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev !== null && prev > 0) {
                    return prev - 1;
                }
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]); // Her saniye timeLeft değiştikçe kendini güvenli bir şekilde günceller.

    if (gameStatus === "finished") {
        const sorted = [...teams].sort((a, b) => b.score - a.score);
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-white font-sans overflow-hidden">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-12">
                    <Trophy size={80} className="text-yellow-500 mx-auto mb-4 animate-bounce" />
                    <h1 className="text-7xl font-black italic text-indigo-500 drop-shadow-[0_0_30px_rgba(79,70,229,0.4)]">ARENA FİNALİ</h1>
                    <p className="text-slate-400 font-bold tracking-[0.4em] uppercase mt-2">Şampiyonlar Kürsüde</p>
                </motion.div>
                <div className="grid w-full max-w-4xl gap-4">
                    {sorted.map((team, idx) => (
                        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}
                            key={idx} className={`flex justify-between items-center p-8 rounded-[2.5rem] border-2 transition-all ${idx === 0 ? 'border-yellow-500/50 bg-yellow-500/10 scale-105 shadow-2xl' : 'border-white/5 bg-slate-900/50'}`}>
                            <div className="flex items-center gap-6">
                                <span className={`text-5xl font-black ${idx === 0 ? 'text-yellow-500' : 'opacity-20'}`}>#{idx + 1}</span>
                                <span className="text-3xl font-bold uppercase">{team.teamName}</span>
                            </div>
                            <div className="text-right"><div className="text-4xl font-mono font-black text-indigo-400">{team.score}</div><div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PUAN</div></div>
                        </motion.div>
                    ))}
                </div>
                <button onClick={() => window.location.reload()} className="mt-12 bg-white text-black px-10 py-4 rounded-full font-black text-lg hover:invert transition-all">YENİ TURNUVA</button>
            </div>
        );
    }

    if (!isStarted) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
            <div className="bg-slate-900 p-12 rounded-[3.5rem] border border-white/5 text-center space-y-8 shadow-2xl max-w-md w-full">
                <LayoutDashboard size={48} className="mx-auto text-indigo-500" />
                <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Arena Canlı Yayın</h1>
                <input type="text" placeholder="ODA KODUNU GİRİN" className="w-full p-6 bg-black border border-slate-800 rounded-[2rem] text-center text-4xl font-mono focus:border-indigo-500 outline-none transition-all uppercase"
                    value={groupCode} onChange={(e) => setGroupCode(e.target.value)} />
                <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 p-6 rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20">ARENAYI BAŞLAT</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col font-sans overflow-hidden">
            {/* Header Area */}
            <div className="flex justify-between items-center bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 mb-10 shadow-2xl">
                <div>
                    <h2 className="text-xs font-black text-indigo-500 tracking-[0.4em] uppercase mb-1">Live Spectator</h2>
                    <p className="text-3xl font-mono font-black tracking-tight text-white">ODA: <span className="text-indigo-400">{groupCode}</span></p>
                </div>
                <div className="text-center">
                    <div className={`text-7xl font-black font-mono tabular-nums leading-none ${timeLeft && timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`}>
                        {timeLeft ?? "--"}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">Kalan Saniye</p>
                </div>
                <div className="flex gap-3">
                    {teams.map((t, idx) => (
                        <div key={idx} className="bg-black/40 px-6 py-3 rounded-3xl border border-white/5 text-center min-w-[100px]">
                            <div className="text-[10px] font-black text-slate-500 uppercase">{t.teamName}</div>
                            <div className="text-2xl font-black text-indigo-400">{t.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full gap-10">
                {currentQuestion ? (
                    <AnimatePresence mode="wait">
                        <motion.div key={currentQuestion.question} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="space-y-12">
                            <div className="text-center space-y-6">
                                <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-6 py-2 rounded-full text-sm font-black uppercase tracking-[0.4em]">
                                    {currentQuestion.ders || "GENEL KÜLTÜR"}
                                </span>
                                <h1 className="text-6xl font-black leading-[1.15] tracking-tight">{currentQuestion.question}</h1>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {['A', 'B', 'C', 'D'].map((char) => {
                                    const isCorrect = currentQuestion.correctAnswer === char;
                                    const highlight = showAnswer && isCorrect;
                                    return (
                                        <div key={char} className={`p-8 rounded-[3rem] border-2 transition-all duration-700 flex items-center gap-8 ${highlight ? 'bg-emerald-500 border-emerald-400 scale-105 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-black' : 'bg-slate-900/60 border-white/5 text-slate-400'}`}>
                                            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl font-black ${highlight ? 'bg-black text-emerald-400' : 'bg-black/50 text-indigo-500'}`}>{char}</div>
                                            <div className="text-3xl font-bold tracking-tight">{currentQuestion.options?.[char]}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="text-center space-y-6 opacity-20"><Gamepad2 size={120} className="mx-auto" /><h2 className="text-4xl font-black italic tracking-tighter">ARENA HAZIRLANIYOR...</h2></div>
                )}
            </div>

            {/* Marquee Footer */}
            <div className="mt-12 overflow-hidden bg-indigo-600 py-4 rounded-full flex relative">
                <div className="whitespace-nowrap flex gap-20 items-center animate-marquee">
                    {[...teams, ...teams, ...teams].map((t, i) => (
                        <span key={i} className="text-xl font-black uppercase italic text-white flex items-center gap-4">
                            <Trophy size={20} /> {t.teamName}: {t.score} PT
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
                .animate-marquee { animation: marquee 25s linear infinite; }
            `}</style>
        </div>
    );
}