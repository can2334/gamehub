"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gameApi, TeamStatus } from '../admin/services/api';
import toast, { Toaster } from 'react-hot-toast';

const ANSWERS = ['A', 'B', 'C', 'D'];

export default function StudentGamepad() {
    const [groupCode, setGroupCode] = useState("");
    const [teamName, setTeamName] = useState("");
    const [joined, setJoined] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [gameStatus, setGameStatus] = useState<string>("active");
    const [allTeams, setAllTeams] = useState<TeamStatus[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const hasSubmittedFinal = useRef(false);

    useEffect(() => {
        const savedCode = localStorage.getItem("student_groupCode");
        const savedTeam = localStorage.getItem("student_teamName");
        if (savedCode && savedTeam) {
            setGroupCode(savedCode);
            setTeamName(savedTeam);
            setJoined(true);
        }
    }, []);

    // --- SÜRE VE PUANLAMA MANTIĞI ---
    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft === 0) {
            if (selected && currentQuestion && !hasSubmittedFinal.current) {
                const isCorrect = String(selected) === String(currentQuestion.correctAnswer);
                gameApi.submitFinalScore(groupCode, teamName, selected, isCorrect)
                    .then(() => {
                        hasSubmittedFinal.current = true;
                        if (isCorrect) toast.success("Doğru! Puan eklendi.");
                        else toast.error("Yanlış cevap!");
                    });
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, selected, currentQuestion, groupCode, teamName]);

    // Polling (Canlı Veri Takibi)
    useEffect(() => {
        if (!joined || !groupCode) return;

        const interval = setInterval(async () => {
            try {
                const data = await gameApi.getSessionStatus(groupCode);
                if (!data) return;

                setGameStatus(data.status || "active");
                if (data.teams) setAllTeams(data.teams);

                if (data.currentQuestion) {
                    if (!currentQuestion || currentQuestion.question !== data.currentQuestion.question) {
                        setCurrentQuestion(data.currentQuestion);
                        setSelected(null);
                        setTimeLeft(data.currentQuestion.sure || 30);
                        hasSubmittedFinal.current = false;
                    }
                }
            } catch (err) {
                console.error("Senkronizasyon hatası");
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [joined, groupCode, currentQuestion]);

    const handleSelectOption = async (answerHarf: string) => {
        if (!currentQuestion || (timeLeft !== null && timeLeft <= 0)) return;
        setSelected(answerHarf);
        try {
            await gameApi.submitAnswer(groupCode, teamName, answerHarf);
        } catch (err) {
            console.error("Seçim güncellenemedi");
        }
    };

    const handleJoin = async () => {
        if (!groupCode || !teamName) return;
        try {
            const res = await gameApi.joinSession(groupCode, teamName);
            if (res.ok) {
                localStorage.setItem("student_groupCode", groupCode);
                localStorage.setItem("student_teamName", teamName);
                setJoined(true);
            }
        } catch (err) { toast.error("Bağlantı hatası!"); }
    };

    const handleExitAndReset = () => { localStorage.clear(); window.location.reload(); };

    // --- OYUN BİTTİ EKRANI (YENİ EKLENEN KISIM) ---
    if (gameStatus === "finished") {
        const sortedTeams = [...allTeams].sort((a, b) => b.score - a.score);
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white text-center">
                <Toaster position="top-center" />
                <div className="mb-8">
                    <span className="text-6xl animate-bounce inline-block">🏆</span>
                    <h2 className="text-4xl font-black italic mt-4 text-indigo-400">ARENA TAMAMLANDI</h2>
                </div>

                <div className="w-full max-w-md space-y-3 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    {sortedTeams.length > 0 ? sortedTeams.map((team, idx) => (
                        <div
                            key={idx}
                            className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${team.teamName === teamName
                                ? 'border-indigo-500 bg-indigo-500/20 scale-105'
                                : 'border-slate-800 bg-black/20'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-black opacity-30">#{idx + 1}</span>
                                <span className="font-bold uppercase">{team.teamName}</span>
                                {team.teamName === teamName && <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded-full font-black">SİZ</span>}
                            </div>
                            <span className="font-mono font-black text-indigo-400">{team.score} PT</span>
                        </div>
                    )) : (
                        <p className="text-slate-500 italic">Skorlar yükleniyor...</p>
                    )}
                </div>

                <button
                    onClick={handleExitAndReset}
                    className="mt-8 w-full max-w-xs bg-white text-black p-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:text-white transition-all"
                >
                    YENİ TURNUVA
                </button>
            </div>
        );
    }

    // --- GİRİŞ EKRANI ---
    if (!joined) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
            <div className="bg-slate-900 p-8 rounded-3xl w-full max-w-sm space-y-4 shadow-2xl border border-white/5">
                <h2 className="text-center font-black text-indigo-500 tracking-widest italic">ARENA GAMEPAD</h2>
                <input type="text" placeholder="ODA KODU" className="w-full p-4 bg-black rounded-xl text-center font-mono text-2xl" onChange={(e) => setGroupCode(e.target.value.toUpperCase())} />
                <select className="w-full p-4 bg-black rounded-xl font-bold" onChange={(e) => setTeamName(e.target.value)}>
                    <option value="">TAKIM SEÇ</option>
                    <option value="Kırmızı">🔴 KIRMIZI</option>
                    <option value="Mavi">🔵 MAVİ</option>
                    <option value="Sarı">🟡 SARI</option>
                    <option value="Yeşil">🟢 YEŞİL</option>
                </select>
                <button onClick={handleJoin} className="w-full bg-indigo-600 p-4 rounded-xl font-black text-lg active:scale-95 transition-transform">KATIL</button>
            </div>
        </div>
    );

    // --- OYUN EKRANI ---
    return (
        <div className="min-h-screen bg-[#020617] p-4 text-white flex flex-col items-center">
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex justify-between bg-slate-900 p-4 rounded-2xl mb-4 border border-white/5 shadow-lg">
                <span className="font-bold text-indigo-400 uppercase tracking-tight">{teamName}</span>
                <span className={`font-mono font-bold text-xl ${timeLeft !== null && timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {timeLeft ?? '--'}s
                </span>
            </div>

            <div className="w-full max-w-md bg-slate-900 p-8 rounded-[2.5rem] border-2 border-indigo-500/10 text-center mb-6 shadow-2xl">
                <h3 className="text-xl font-bold leading-tight">{currentQuestion?.question || "Soru bekleniyor..."}</h3>
            </div>

            <div className="w-full max-w-md grid grid-cols-1 gap-4">
                {ANSWERS.map((ans) => {
                    const isSelected = selected === ans;
                    const isTimeUp = timeLeft === 0;
                    const isCorrect = currentQuestion?.correctAnswer === ans;

                    let bg = "bg-slate-800 border-slate-700";
                    if (!isTimeUp) {
                        if (isSelected) bg = "bg-indigo-600 scale-[1.02] border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]";
                    } else {
                        if (isCorrect) bg = "bg-emerald-600 border-emerald-400 opacity-100";
                        else if (isSelected) bg = "bg-red-600 border-red-400 opacity-100";
                        else bg = "bg-slate-900 opacity-20 border-transparent";
                    }

                    return (
                        <button
                            key={ans}
                            onClick={() => handleSelectOption(ans)}
                            disabled={isTimeUp}
                            className={`p-5 rounded-2xl border-b-4 transition-all flex items-center active:border-b-0 active:translate-y-1 ${bg}`}
                        >
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black text-xl ${isSelected ? 'bg-white text-indigo-600' : 'bg-black/20 text-indigo-400'}`}>
                                {ans}
                            </span>
                            <span className="font-bold text-lg">{currentQuestion?.options?.[ans]}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                {selected && !timeLeft && (
                    <p className="text-indigo-500 text-[10px] font-black tracking-[0.2em] animate-pulse">SÜRE BİTENE KADAR DEĞİŞTİREBİLİRSİN</p>
                )}
            </div>
        </div>
    );
}