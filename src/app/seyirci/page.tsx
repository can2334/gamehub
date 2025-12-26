"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import { Trophy, Gamepad2, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const dynamic = 'force-dynamic';

function SpectatorContent() {
    const searchParams = useSearchParams();
    const [groupCode, setGroupCode] = useState(searchParams.get('code') || "");
    const [isStarted, setIsStarted] = useState(!!searchParams.get('code'));
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<string>("waiting");

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
        <div className="h-[100dvh] w-screen bg-[#050816] flex items-center justify-center text-white overflow-hidden">
            <div className="bg-white/[0.03] p-10 rounded-[3rem] border border-white/10 text-center space-y-6 max-w-md w-full shadow-2xl">
                <h1 className="text-2xl font-black italic text-indigo-400 uppercase tracking-tighter">ARENA BROADCAST</h1>
                <input type="text" placeholder="ODA KODU" className="w-full p-6 bg-black/50 border-2 border-white/5 rounded-[1.5rem] text-center text-4xl font-mono outline-none uppercase focus:border-indigo-500 transition-all"
                    value={groupCode} onChange={(e) => setGroupCode(e.target.value)} />
                <button onClick={() => setIsStarted(true)} className="w-full bg-indigo-600 p-6 rounded-[1.5rem] font-black text-xl hover:bg-indigo-500 shadow-xl transition-all">BAĞLAN</button>
            </div>
        </div>
    );

    return (
        <div className="h-[100dvh] w-screen bg-[#050816] text-white flex flex-col overflow-hidden m-0 p-0 relative">

            {/* ÜST BAR */}
            <div className="h-[12vh] flex justify-between items-center bg-white/[0.02] backdrop-blur-3xl px-10 border-b border-white/10 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                        <Gamepad2 className="text-indigo-400" size={24} />
                    </div>
                    <div>
                        <h2 className="text-[9px] font-black text-indigo-500 tracking-[0.3em] uppercase opacity-60">SESSION</h2>
                        {/* Boş görünmesin diye kontrol ekledik */}
                        <p className="text-xl font-mono font-black tracking-tighter italic">
                            {groupCode ? `#${groupCode}` : "BEKLEMEDE"}
                        </p>
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
                    )) : (
                        <div className="text-[10px] font-bold opacity-20 uppercase tracking-widest">Takım Bekleniyor...</div>
                    )}
                </div>
            </div>

            {/* ORTA ALAN */}
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
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${highlight ? 'bg-black/20 text-white' : 'bg-black/40 text-indigo-500'}`}>
                                                {char}
                                            </div>
                                            <div className="text-2xl font-black uppercase italic tracking-tight truncate">
                                                {currentQuestion.options?.[char] || '---'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8">
                            <Sword size={120} className="text-indigo-500 mx-auto animate-bounce opacity-80" />
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
                                    Arena savaşı başlamak üzere...
                                </h2>
                                <p className="text-indigo-400 font-bold tracking-[0.5em] uppercase animate-pulse text-lg">
                                    Soru bekleniyor
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ALT SKOR BANDI (Marquee) - Görünür kılındı */}
            <div className="h-[8vh] min-h-[50px] bg-indigo-600 flex items-center shrink-0 overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30">
                <div className="whitespace-nowrap flex gap-20 items-center animate-marquee">
                    {teams.length > 0 ? [...teams, ...teams, ...teams, ...teams].map((t, i) => (
                        <span key={i} className="text-xl font-black uppercase italic text-white flex items-center gap-4">
                            <Trophy size={20} className="text-yellow-400" /> {t.teamName}: <span className="text-indigo-900 bg-white/30 px-3 rounded-lg">{t.score || 0}</span>
                        </span>
                    )) : (
                        <span className="text-xl font-black uppercase italic text-white/50 w-full text-center">SKOR TABLOSU HAZIRLANIYOR...</span>
                    )}
                </div>
            </div>

            <style jsx>{`
                :global(html, body) { 
                    height: 100dvh !important; 
                    margin: 0 !important; 
                    padding: 0 !important; 
                    overflow: hidden !important; 
                    background: #050816;
                }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-25%); } }
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