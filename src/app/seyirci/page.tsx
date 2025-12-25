"use client";

import React, { useState, useEffect } from 'react';
import { gameApi, TeamStatus } from '../admin/services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function SpectatorPage() {
    const [groupCode, setGroupCode] = useState("");
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [teams, setTeams] = useState<TeamStatus[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [gameStatus, setGameStatus] = useState<string>("active"); // Oyun durumunu takip etmek için

    // Polling - Canlı Veri Çekme
    useEffect(() => {
        if (!isStarted || !groupCode) return;

        const interval = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (!data) return;

                setTeams(data.teams || []);
                setGameStatus(data.status || "active"); // Durumu güncelle

                // Soru Değişimi Kontrolü
                if (data.currentQuestion) {
                    if (!currentQuestion || currentQuestion.question !== data.currentQuestion.question) {
                        setCurrentQuestion(data.currentQuestion);
                        setTimeLeft(data.currentQuestion.sure || 30);
                        setShowAnswer(false);
                    }
                } else {
                    setCurrentQuestion(null);
                    setShowAnswer(false);
                }
            } catch (err) {
                console.error("İzleyici senkronizasyon hatası");
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [isStarted, groupCode, currentQuestion]);

    // Geri Sayım
    useEffect(() => {
        if (timeLeft === null || timeLeft < 0) return;

        if (timeLeft === 0) {
            setShowAnswer(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleStart = () => {
        if (groupCode) setIsStarted(true);
    };

    // --- OYUN BİTTİĞİNDE GÖZÜKECEK EKRAN ---
    if (gameStatus === "finished") {
        const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-10 text-white font-sans">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-8xl font-black italic text-indigo-500 animate-pulse drop-shadow-[0_0_30px_rgba(79,70,229,0.6)]">
                        ARENA FİNALİ
                    </h1>
                    <p className="text-2xl text-slate-400 font-bold tracking-[0.5em] uppercase">Şampiyonlar Belirlendi</p>
                </div>

                <div className="grid grid-cols-1 w-full max-w-4xl gap-6">
                    {sortedTeams.map((team, idx) => (
                        <div
                            key={idx}
                            className={`flex justify-between items-center p-8 rounded-[3rem] border-4 transition-all
                            ${idx === 0
                                    ? 'border-yellow-500 bg-yellow-500/10 scale-105 shadow-[0_0_50px_rgba(234,179,8,0.2)]'
                                    : 'border-slate-800 bg-slate-900/50'}`}
                        >
                            <div className="flex items-center gap-8">
                                <span className={`text-6xl font-black ${idx === 0 ? 'text-yellow-500' : 'opacity-20'}`}>
                                    #{idx + 1}
                                </span>
                                <span className="text-4xl font-bold uppercase tracking-tight">{team.teamName}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-mono font-black text-indigo-400">{team.score}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOPLAM PUAN</div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-16 bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:scale-110 transition-all active:scale-95"
                >
                    YENİ TURNUVA
                </button>
            </div>
        );
    }

    // --- GİRİŞ EKRANI ---
    if (!isStarted) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
                <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 text-center space-y-6 shadow-2xl">
                    <h1 className="text-4xl font-black italic text-indigo-500">ARENA CANLI YAYIN</h1>
                    <input
                        type="text"
                        placeholder="ODA KODUNU GİRİN"
                        className="w-full p-5 bg-black border border-slate-800 rounded-2xl text-center text-3xl font-mono focus:border-indigo-500 outline-none"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                    />
                    <button onClick={handleStart} className="w-full bg-indigo-600 p-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all">
                        ARENAYI BAŞLAT
                    </button>
                </div>
            </div>
        );
    }

    // --- CANLI OYUN EKRANI ---
    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col overflow-hidden font-sans">
            <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 mb-8 shadow-2xl">
                <div>
                    <h2 className="text-sm font-black text-indigo-500 tracking-[0.3em] uppercase">Canlı Arena</h2>
                    <p className="text-2xl font-mono font-black">ODA: {groupCode}</p>
                </div>

                <div className="text-center">
                    <div className="text-6xl font-black font-mono tabular-nums text-indigo-400">
                        {timeLeft !== null ? timeLeft : "--"}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kalan Süre</p>
                </div>

                <div className="flex gap-4">
                    {teams.map((t, idx) => (
                        <div key={idx} className="bg-black/40 px-6 py-2 rounded-2xl border border-white/5 text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">{t.teamName}</div>
                            <div className="text-xl font-black text-indigo-300">{t.score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col justify-center gap-8">
                {currentQuestion ? (
                    <>
                        <div className="text-center space-y-4">
                            <span className="bg-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                {currentQuestion.ders}
                            </span>
                            <h1 className="text-5xl font-bold leading-tight drop-shadow-2xl">
                                {currentQuestion.question}
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {['A', 'B', 'C', 'D'].map((char) => {
                                const isCorrect = currentQuestion.correctAnswer === char;
                                const shouldHighlight = showAnswer && isCorrect;

                                return (
                                    <div
                                        key={char}
                                        className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center gap-6
                                            ${shouldHighlight
                                                ? 'bg-emerald-500 border-emerald-400 scale-105 shadow-[0_0_50px_rgba(16,185,129,0.4)] text-black'
                                                : 'bg-slate-900/80 border-slate-800 text-slate-300'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black
                                            ${shouldHighlight ? 'bg-black text-emerald-400' : 'bg-black/50 text-indigo-500'}`}>
                                            {char}
                                        </div>
                                        <div className="text-2xl font-bold">
                                            {currentQuestion.options?.[char]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-6 animate-pulse">
                        <div className="text-8xl">🎮</div>
                        <h2 className="text-4xl font-black text-slate-700 italic">ARENA HAZIRLANIYOR...</h2>
                    </div>
                )}
            </div>

            <div className="mt-8 overflow-hidden bg-indigo-600 py-3 rounded-full flex">
                <div className="whitespace-nowrap animate-marquee flex gap-20 items-center">
                    {[...teams, ...teams].map((t, i) => (
                        <span key={i} className="text-lg font-black uppercase italic">
                            {t.teamName}: {t.score} PT •
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
}