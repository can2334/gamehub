"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gameApi, TeamStatus } from '../services/api';

const TEAMS = [
    { name: 'Kırmızı', color: 'from-red-500 to-red-900', shadow: 'shadow-red-500/40', border: 'border-red-500/50', text: 'text-red-400' },
    { name: 'Mavi', color: 'from-blue-500 to-blue-900', shadow: 'shadow-blue-500/40', border: 'border-blue-500/50', text: 'text-blue-400' },
    { name: 'Sarı', color: 'from-amber-400 to-amber-700', shadow: 'shadow-amber-500/40', border: 'border-amber-400/50', text: 'text-amber-400' },
    { name: 'Yeşil', color: 'from-emerald-500 to-emerald-800', shadow: 'shadow-emerald-500/40', border: 'border-emerald-500/50', text: 'text-emerald-400' }
];

const HARFLER = ['A', 'B', 'C', 'D'];

export default function MultiGamePage() {
    const [groupCode, setGroupCode] = useState<string>("");
    const [category, setCategory] = useState<string>("bilisim");
    const [activeTeams, setActiveTeams] = useState<TeamStatus[]>([]);
    const [isLive, setIsLive] = useState<boolean>(false);
    const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
    const [gameStatus, setGameStatus] = useState<string>("active");
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const savedCode = localStorage.getItem("admin_groupCode");
        const savedCategory = localStorage.getItem("admin_category");
        const savedIndex = localStorage.getItem("admin_questionIndex");

        if (savedCode) {
            setGroupCode(savedCode);
            setCategory(savedCategory || "bilisim");
            setCurrentQuestionIndex(Number(savedIndex) || 0);
            setIsLive(true);
            startPolling(savedCode);
            loadQuestions(savedCategory || "bilisim");
        }
    }, []);

    const loadQuestions = async (cat: string) => {
        try {
            const res = await fetch(`https://gamebackend.cansalman332.workers.dev/api/questions?category=${cat}`);
            const data = await res.json();
            if (Array.isArray(data)) setQuestions(data);
        } catch (err) {
            console.error("Sorular yüklenemedi:", err);
        }
    };

    const handleSetupGame = async () => {
        setIsLoading(true);
        try {
            const { code } = await gameApi.generateCode();
            setGroupCode(code);
            await gameApi.startSession(code, category);
            localStorage.setItem("admin_groupCode", code);
            localStorage.setItem("admin_category", category);
            localStorage.setItem("admin_questionIndex", "0");
            setIsLive(true);
            setGameStatus("active");
            setCurrentQuestionIndex(0);
            await loadQuestions(category);
            startPolling(code);
        } catch (err) {
            alert("Oda oluşturulamadı!");
        } finally {
            setIsLoading(false);
        }
    };

    const startPolling = (code: string) => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(code) as any;
                if (data.teams) setActiveTeams(data.teams);
                if (data.status === "finished") setGameStatus("finished");
            } catch (err) {
                console.log("Bağlantı bekleniyor...");
            }
        }, 2000);
    };

    const handleNextQuestion = async () => {
        if (!groupCode || currentQuestionIndex >= questions.length - 1) {
            handleFinishGame();
            return;
        }

        try {
            const nextIndex = currentQuestionIndex + 1;
            // Frontend'de anlık temizlik yap ki "bekliyor" efekti görünsün
            setActiveTeams(prev => prev.map(t => ({ ...t, selectedAnswer: null })));

            await gameApi.resetAnswers(groupCode);
            setCurrentQuestionIndex(nextIndex);
            localStorage.setItem("admin_questionIndex", nextIndex.toString());
        } catch (err) {
            console.error("Sıfırlama hatası:", err);
        }
    };

    const handleFinishGame = async () => {
        if (!groupCode) return;
        if (!window.confirm("Arena kapatılsın mı? Skorlar kesinleşecek.")) return;

        try {
            await fetch(`https://gamebackend.cansalman332.workers.dev/api/session/finish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groupCode })
            });
            setGameStatus("finished");
            setShowScoreboard(true);
        } catch (err) {
            console.error("Oyun bitirilemedi:", err);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 font-sans selection:bg-indigo-500 overflow-x-hidden">

            {/* Arka Plan Süslemeleri */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- HEADER PANEL --- */}
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800 p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col gap-1 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]"></div>
                            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
                                Arena Admin Control
                            </h1>
                        </div>
                        <button
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                            className="text-[9px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                        >
                            [ Sistemi Sıfırla ]
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 relative z-10">
                        <select
                            className="bg-slate-950 border border-slate-700 text-slate-300 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isLive}
                        >
                            <option value="bilisim">💻 Bilişim Teknolojileri</option>
                            <option value="tabu_fizik">⚛️ Tabu Fizik</option>
                        </select>

                        <button
                            onClick={handleSetupGame}
                            disabled={isLoading}
                            className={`px-8 py-3 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-indigo-500/20 
                                ${isLive ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                        >
                            {isLoading ? "HAZIRLANIYOR..." : isLive ? "ARENA AKTİF" : "ARENAYI KUR"}
                        </button>
                    </div>

                    <div className="bg-slate-950 px-8 py-4 rounded-[2rem] border border-slate-800 flex flex-col items-center min-w-[160px] shadow-inner">
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-500/60 mb-1">Grup Kodu</span>
                        <div className="text-4xl font-black font-mono text-white tracking-[0.2em]">
                            {groupCode || "----"}
                        </div>
                    </div>
                </div>

                {/* --- SORU EKRANI --- */}
                {isLive && currentQuestion && gameStatus !== "finished" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-gradient-to-b from-slate-900/40 to-slate-950/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600/10 text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black border border-indigo-500/20">
                                SORU {currentQuestionIndex + 1} / {questions.length}
                            </div>

                            <h2 className="text-2xl md:text-4xl font-bold text-center leading-tight my-10 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                                {currentQuestion.question || currentQuestion.word}
                            </h2>

                            {currentQuestion.options && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                                    {Object.entries(currentQuestion.options).map(([key, val]: any, idx) => {
                                        // Eğer key sayı ise (0,1,2,3), harfe çevir
                                        const label = isNaN(Number(key)) ? key : HARFLER[idx];
                                        const isCorrect = String(currentQuestion.correctAnswer) === String(key);

                                        return (
                                            <div key={key} className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300
                                                ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-950/50 border-slate-800 text-slate-400'}`}>
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                                                    ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                                                    {label}
                                                </span>
                                                <span className="font-medium">{val}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAKIM ARENASI --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TEAMS.map((team) => {
                        const teamData = activeTeams.find(t => t.teamName === team.name);
                        const hasAnswered = !!teamData?.selectedAnswer;

                        return (
                            <div key={team.name} className="group">
                                <div className={`h-full relative rounded-[2.5rem] border-2 transition-all duration-500 p-8 flex flex-col items-center justify-center gap-4
                                    ${hasAnswered
                                        ? `bg-slate-900 ${team.border} ${team.shadow} scale-[1.02]`
                                        : 'bg-slate-900/20 border-slate-800 opacity-60'}`}>

                                    <h3 className={`text-sm font-black uppercase tracking-widest ${team.text}`}>
                                        {team.name} Takımı
                                    </h3>

                                    <div className="relative">
                                        <div className={`text-7xl font-black transition-all duration-700 ${hasAnswered ? 'scale-110 text-white' : 'text-slate-800'}`}>
                                            {hasAnswered ? teamData.selectedAnswer : "?"}
                                        </div>
                                        {hasAnswered && (
                                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                                        )}
                                    </div>

                                    <div className="bg-slate-950/80 px-4 py-1 rounded-full border border-white/5">
                                        <span className="text-indigo-400 font-black text-xs">{teamData?.score || 0} PTS</span>
                                    </div>

                                    {/* Cevap Durumu Barı */}
                                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${hasAnswered ? `w-full bg-gradient-to-r ${team.color}` : 'w-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><br /><br />
            {/* --- FLOATING ACTION BAR --- */}
            {isLive && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom duration-500">
                    {gameStatus !== "finished" ? (
                        <>
                            <div className="px-4 border-r border-slate-700 hidden md:block">
                                <div className="text-[9px] font-black text-slate-500 uppercase">Kontrol Paneli</div>
                                <div className="text-xs font-bold text-indigo-400">Canlı Oturum</div>
                            </div>
                            <button
                                onClick={handleNextQuestion}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-emerald-600/20"
                            >
                                <span className="text-lg">⏭️</span> SONRAKİ SORU
                            </button>
                            <button
                                onClick={handleFinishGame}
                                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
                            >
                                BİTİR
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowScoreboard(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/40"
                        >
                            🏆 ŞAMPİYONU İLAN ET
                        </button>
                    )}
                </div>
            )}

            {/* --- MODERN SCOREBOARD MODAL --- */}
            {showScoreboard && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-indigo-500/30 w-full max-w-2xl rounded-[3.5rem] p-12 relative shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden">

                        {/* Modal Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full"></div>

                        <button onClick={() => setShowScoreboard(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center mb-12">
                            <div className="text-6xl mb-4 animate-bounce">🏆</div>
                            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">ARENA BİTTİ</h2>
                            <p className="text-slate-500 font-bold text-sm tracking-[0.3em]">FINAL SIRALAMASI</p>
                        </div>

                        <div className="space-y-4">
                            {[...activeTeams]
                                .sort((a, b) => (b.score || 0) - (a.score || 0))
                                .map((team, idx) => (
                                    <div key={team.teamName} className={`flex justify-between items-center p-6 rounded-[2rem] border-2 transition-all duration-500
                                        ${idx === 0 ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' : 'bg-slate-800/40 border-slate-700/50'}`}>
                                        <div className="flex items-center gap-6">
                                            <span className={`text-3xl font-black ${idx === 0 ? 'text-indigo-400' : 'text-slate-600'}`}>#{idx + 1}</span>
                                            <div>
                                                <div className="text-xl font-black text-white uppercase">{team.teamName}</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Savaşçı Takımı</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-3xl font-mono text-white font-black">{team.score || 0}</span>
                                            <span className="text-[10px] font-black text-indigo-400 uppercase">PUAN</span>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <button
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                            className="w-full mt-10 py-5 bg-white text-black rounded-3xl font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                        >
                            Yeni Arena Başlat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}