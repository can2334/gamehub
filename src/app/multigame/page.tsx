"use client";

import React, { useState, useEffect } from 'react';
import { gameApi } from '../admin/services/api';

const ANSWERS = ['A', 'B', 'C', 'D'];

export default function StudentGamepad() {
    const [groupCode, setGroupCode] = useState("");
    const [teamName, setTeamName] = useState("");
    const [joined, setJoined] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [gameStatus, setGameStatus] = useState<string>("active");
    const [allTeams, setAllTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCode = localStorage.getItem("student_groupCode");
        const savedTeam = localStorage.getItem("student_teamName");
        if (savedCode && savedTeam) {
            setGroupCode(savedCode);
            setTeamName(savedTeam);
            setJoined(true);
        }
    }, []);

    useEffect(() => {
        if (!joined || !groupCode) return;

        const interval = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (!data) return;

                if (data.status === "finished") {
                    setGameStatus("finished");
                    setAllTeams(data.teams || []);
                } else {
                    setGameStatus("active");
                }

                const myTeam = data.teams?.find((t: any) => t.teamName === teamName);
                if (data.currentQuestion) {
                    setCurrentQuestion(data.currentQuestion);
                } else {
                    setCurrentQuestion(null);
                }

                if (!myTeam || myTeam.selectedAnswer === null) {
                    setSelected(null);
                } else {
                    setSelected(myTeam.selectedAnswer);
                }
            } catch (err) {
                console.error("Senkronizasyon hatası:", err);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [joined, groupCode, teamName]);

    const handleJoin = async () => {
        if (!groupCode || !teamName) return;
        setLoading(true);
        try {
            const res = await gameApi.joinSession(groupCode, teamName);
            if (res.ok) {
                localStorage.setItem("student_groupCode", groupCode);
                localStorage.setItem("student_teamName", teamName);
                setJoined(true);
            } else {
                alert("Odaya bağlanılamadı. Kod hatalı olabilir.");
            }
        } catch (err) {
            alert("Bağlantı kesildi.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendAnswer = async (answerHarf: string) => {
        if (selected || !currentQuestion) return;

        const selectedIndex = ANSWERS.indexOf(answerHarf);
        const dbCorrectIndex = Number(currentQuestion.correctAnswer);
        const isCorrect = selectedIndex === dbCorrectIndex;

        setSelected(answerHarf);
        try {
            await gameApi.submitAnswer(groupCode, teamName, answerHarf, isCorrect);
        } catch (err) {
            setSelected(null);
            alert("Cevap gönderilemedi!");
        }
    };

    const handleExitAndReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    // --- RENDER: OYUN BİTTİ (SCOREBOARD) ---
    if (gameStatus === "finished") {
        const sortedTeams = [...allTeams].sort((a, b) => (b.score || 0) - (a.score || 0));
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
                <div className="absolute top-[-20%] w-full h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

                <div className="w-full max-w-md z-10 space-y-8 animate-in zoom-in duration-500">
                    <div className="text-center">
                        <div className="text-8xl mb-4 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">🏆</div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">ARENA SONU</h2>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 space-y-3 shadow-2xl">
                        {sortedTeams.map((team, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${idx === 0 ? 'bg-indigo-600/20 border-indigo-500 scale-105' : 'bg-slate-950/50 border-slate-800'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`text-xl font-black ${idx === 0 ? 'text-indigo-400' : 'text-slate-600'}`}>#{idx + 1}</span>
                                    <span className="font-bold">{team.teamName}</span>
                                </div>
                                <span className="font-mono font-black text-xl text-indigo-400">{team.score || 0}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleExitAndReset} className="w-full bg-white text-black p-6 rounded-[2rem] font-black text-lg hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl">
                        YENİ MACERA
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: GİRİŞ EKRANI ---
    if (!joined) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
                <div className="w-full max-w-sm space-y-8 bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-indigo-600/50">
                        <span className="text-4xl -rotate-12">🎮</span>
                    </div>

                    <div className="text-center pt-8">
                        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-indigo-400">Giriş Yap</h2>
                        <p className="text-slate-500 text-xs mt-1 font-bold">Takımını seç ve arenaya katıl!</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="ODA KODU"
                            value={groupCode}
                            className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl outline-none text-center text-2xl font-mono focus:border-indigo-500 transition-all uppercase tracking-widest placeholder:opacity-20"
                            onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                        />
                        <select
                            className="w-full p-5 bg-slate-950 border border-slate-800 rounded-2xl outline-none text-white font-bold appearance-none text-center"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        >
                            <option value="">TAKIM SEÇİN</option>
                            <option value="Kırmızı">🔴 KIRMIZI TAKIM</option>
                            <option value="Mavi">🔵 MAVİ TAKIM</option>
                            <option value="Sarı">🟡 SARI TAKIM</option>
                            <option value="Yeşil">🟢 YEŞİL TAKIM</option>
                        </select>
                    </div>

                    <button
                        onClick={handleJoin}
                        disabled={loading || !groupCode || !teamName}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/30 disabled:opacity-50"
                    >
                        {loading ? "BAĞLANILIYOR..." : "ARENAYA GİR"}
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER: ANA GAMEPAD ---
    return (
        <div className="min-h-screen bg-[#020617] p-4 flex flex-col font-sans text-white select-none">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-6 bg-slate-900/50 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                <button onClick={handleExitAndReset} className="w-10 h-10 flex items-center justify-center bg-slate-950 rounded-xl text-slate-500 hover:text-red-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="text-center">
                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">AKTİF OTURUM</div>
                    <div className="text-sm font-bold opacity-80">{teamName} TAKIMI</div>
                </div>
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                </div>
            </div>

            {/* Soru Gösterge Alanı */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full gap-6">
                <div className={`w-full p-8 rounded-[3rem] border-2 transition-all duration-500 text-center relative overflow-hidden
                    ${currentQuestion ? 'bg-slate-900 border-indigo-500/50 shadow-2xl' : 'bg-slate-950 border-slate-800 opacity-50'}`}>

                    {currentQuestion ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <span className="text-[10px] font-black bg-indigo-600 px-3 py-1 rounded-full mb-4 inline-block">SORU CANLI</span>
                            <h3 className="text-xl md:text-2xl font-bold leading-tight">
                                {currentQuestion.question || currentQuestion.word}
                            </h3>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            </div>
                            <p className="text-slate-500 font-bold italic">Sıradaki soru hazırlanıyor...</p>
                        </div>
                    )}
                </div>

                {/* Butonlar Gridi */}
                <div className="grid grid-cols-2 gap-4 w-full h-[320px]">
                    {ANSWERS.map((ans, index) => {
                        const opt = currentQuestion?.options;
                        let optionText = "...";

                        if (opt) {
                            if (Array.isArray(opt)) optionText = opt[index];
                            else if (typeof opt === 'object') optionText = opt[ans] || opt[ans.toLowerCase()];
                        }

                        const isSelected = selected === ans;
                        const isSomethingSelected = selected !== null;

                        return (
                            <button
                                key={ans}
                                onClick={() => handleSendAnswer(ans)}
                                disabled={isSomethingSelected || !currentQuestion}
                                className={`relative group rounded-[2.5rem] border-b-8 transition-all active:border-b-0 active:translate-y-1 overflow-hidden
                                    ${isSelected ? 'bg-indigo-600 border-indigo-800 scale-95 shadow-inner' :
                                        !isSomethingSelected && currentQuestion ? 'bg-slate-800 border-slate-950 hover:bg-slate-700' :
                                            'bg-slate-900 border-slate-950 opacity-40'}`}
                            >
                                <div className="p-4 flex flex-col items-center justify-center gap-2 h-full">
                                    <span className={`text-4xl font-black ${isSelected ? 'text-white' : 'text-indigo-500'}`}>
                                        {ans}
                                    </span>
                                    {currentQuestion && (
                                        <span className={`text-[10px] font-bold uppercase truncate w-full px-2 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {optionText}
                                        </span>
                                    )}
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-4">
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Durum Alt Barı */}
            <div className="mt-6 pb-4">
                <div className="max-w-xs mx-auto text-center">
                    {selected ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-3xl animate-in slide-in-from-bottom">
                            <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">✅ CEVAP GÖNDERİLDİ</p>
                            <p className="text-slate-500 text-[10px] mt-1 font-bold italic">Öğretmenin yeni soruya geçmesini bekleyin.</p>
                        </div>
                    ) : currentQuestion ? (
                        <div className="text-indigo-400/40 font-black text-[10px] uppercase tracking-widest animate-pulse">
                            HIZLI CEVAPLA, LİDERLİĞİ AL!
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}