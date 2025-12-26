"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import { Trophy, Gamepad2, Sword, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

function SpectatorContent() {
    const searchParams = useSearchParams();
    const [inputValue, setInputValue] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [groupCode, setGroupCode] = useState("");

    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<string>("waiting");

    // Input Formatlama Fonksiyonu (XXXX-XXXX)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Sadece harf ve rakamları al, çizgileri temizle
        let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        // Maksimum 8 karakter (çizgisiz hali)
        val = val.substring(0, 8);

        // Görsel formatı oluştur: 4 karakterden sonra çizgi ekle
        let formatted = val;
        if (val.length > 4) {
            formatted = val.substring(0, 4) + '-' + val.substring(4);
        }

        setInputValue(formatted);
    };

    // 8 karakter tamamsa buton açılır
    const isValidCode = inputValue.replace('-', '').length === 8;

    const handleJoin = () => {
        if (isValidCode) {
            setGroupCode(inputValue); // XXXX-XXXX formatında saklar
            setIsStarted(true);
        }
    };

    useEffect(() => {
        if (!isStarted || !groupCode) return;

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (isMounted && data) {
                    setTeams(data.teams || []);
                    if (!data.currentQuestion) {
                        setGameStatus("waiting");
                        setCurrentQuestion(null);
                        setTimeLeft(null);
                    } else {
                        setGameStatus(data.status || "active");
                        setCurrentQuestion((prev: any) => {
                            if (!prev || prev.id !== data.currentQuestion?.id) {
                                setTimeLeft(data.currentQuestion?.sure ?? 30);
                                setShowAnswer(false);
                                return data.currentQuestion;
                            }
                            return prev;
                        });
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
    }, [isStarted, groupCode]);

    useEffect(() => {
        if (gameStatus === "waiting" || timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0) setShowAnswer(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameStatus]);

    if (!isStarted) return (
        <div className="h-[100dvh] w-screen bg-[#050816] flex items-center justify-center text-white overflow-hidden p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-center mb-2 text-indigo-500">
                    <Gamepad2 size={56} />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-black italic text-indigo-400 uppercase tracking-tighter">ARENA BROADCAST</h1>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Oda Kodunu Girin</p>
                </div>

                <div className="space-y-4 pt-4">
                    <input
                        type="text"
                        placeholder="XXXX-XXXX"
                        className={`w-full p-6 bg-black/50 border-2 rounded-[1.5rem] text-center text-3xl font-mono outline-none uppercase transition-all text-white placeholder:text-white/5 tracking-widest ${isValidCode ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'border-white/5'}`}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    />

                    <button
                        onClick={handleJoin}
                        disabled={!isValidCode}
                        className={`w-full p-6 rounded-[1.5rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${!isValidCode ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`}
                    >
                        {isValidCode ? <Unlock size={22} /> : <Lock size={22} />}
                        BAĞLAN
                    </button>
                    {!isValidCode && inputValue.length > 0 && (
                        <p className="text-indigo-500/40 text-[9px] font-bold uppercase tracking-widest animate-pulse">
                            8 Haneli Kodu Tamamlayın ({inputValue.replace('-', '').length}/8)
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="h-[100dvh] w-screen bg-[#050816] text-white flex flex-col overflow-hidden m-0 p-0 relative">
            <div className="h-[12vh] flex justify-between items-center bg-white/[0.02] backdrop-blur-3xl px-10 border-b border-white/10 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
                        <Gamepad2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-[9px] font-black text-indigo-500 tracking-[0.3em] uppercase opacity-60">SESSION</h2>
                        <p className="text-xl font-mono font-black tracking-tighter italic">#{groupCode}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`text-[7vh] font-black font-mono leading-none tracking-tighter tabular-nums ${timeLeft !== null && timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {timeLeft !== null ? timeLeft : "--"}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">KALAN SÜRE</span>
                </div>

                <div className="flex gap-3">
                    {teams.length > 0 ? teams.slice(0, 3).map((t, idx) => (
                        <div key={idx} className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center min-w-[100px]">
                            <div className="text-[9px] font-black text-slate-500 uppercase mb-1 truncate max-w-[70px]">{t.teamName}</div>
                            <div className="text-xl font-black text-indigo-400">{t.score || 0}</div>
                        </div>
                    )) : <div className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] italic">Takım Bekleniyor...</div>}
                </div>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center overflow-hidden px-8 relative">
                <AnimatePresence mode="wait">
                    {currentQuestion && gameStatus !== "waiting" ? (
                        <motion.div key={currentQuestion.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl space-y-8">
                            <div className="text-center space-y-4">
                                <span className="inline-block bg-indigo-600 px-8 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.4em] shadow-lg">
                                    {currentQuestion.ders || "ARENA"}
                                </span>
                                <h1 className="text-[4.5vh] font-black leading-snug italic uppercase tracking-tight">
                                    {currentQuestion.question}
                                </h1>
                            </div>
                            <div className="grid grid-cols-2 gap-5 w-full">
                                {['A', 'B', 'C', 'D'].map((char) => {
                                    const highlight = showAnswer && currentQuestion.correctAnswer === char;
                                    return (
                                        <div key={char} className={`p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all duration-500 ${highlight ? 'bg-emerald-500 border-emerald-400 text-[#050816] scale-[1.02]' : 'bg-white/5 border-white/5 text-slate-300'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${highlight ? 'bg-black/20 text-white' : 'bg-black/40 text-indigo-500'}`}>{char}</div>
                                            <div className="text-2xl font-black uppercase italic tracking-tight truncate">{currentQuestion.options?.[char] || '---'}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                            <Sword size={120} className="text-indigo-500 mx-auto animate-bounce opacity-80" />
                            <div className="space-y-2 text-center">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">Arena Hazırlanıyor</h2>
                                <p className="text-indigo-400 font-bold tracking-[0.5em] uppercase animate-pulse text-lg">Soru Bekleniyor</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-[8vh] min-h-[50px] bg-indigo-600 flex items-center shrink-0 overflow-hidden z-30">
                <div className="whitespace-nowrap flex gap-20 items-center animate-marquee">
                    {teams.length > 0 ? [...teams, ...teams].map((t, i) => (
                        <span key={i} className="text-xl font-black uppercase italic text-white flex items-center gap-4">
                            <Trophy size={20} className="text-yellow-400" /> {t.teamName}: <span className="text-indigo-900 bg-white/30 px-3 rounded-lg">{t.score || 0}</span>
                        </span>
                    )) : <span className="text-lg font-black uppercase italic text-white/50 w-screen text-center tracking-widest">SKORLAR YÜKLENİYOR...</span>}
                </div>
            </div>

            <style jsx>{`
                :global(html, body) { height: 100dvh !important; margin: 0; padding: 0; overflow: hidden; background: #050816; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>
        </div>
    );
}

export default function SpectatorPage() {
    return (
        <Suspense fallback={<div className="h-screen bg-[#050816]" />}>
            <SpectatorContent />
        </Suspense>
    );
}