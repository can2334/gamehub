"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gameApi, TeamStatus } from '../admin/services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Gamepad, Trophy, Star, ArrowLeft, Eye, BookOpen, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ANSWERS = ['A', 'B', 'C', 'D'];

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
    const [myScore, setMyScore] = useState<number>(0);
    const [lessonName, setLessonName] = useState("YÜKLENİYOR...");
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

    // 2. Ana API Polling (Veri Çekme)
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

                // Soru kontrolü
                if (data.currentQuestion) {
                    if (!currentQuestion || currentQuestion.id !== data.currentQuestion.id) {
                        setCurrentQuestion(data.currentQuestion);
                        setSelected(null);
                        scoreSubmittedRef.current = false;

                        // --- F5 Koruması: Süre Mantığı ---
                        const savedTime = localStorage.getItem(`timeLeft_${data.currentQuestion.id}`);
                        if (savedTime !== null) {
                            setTimeLeft(parseInt(savedTime));
                        } else {
                            const initialTime = data.currentQuestion.sure ?? 30;
                            setTimeLeft(initialTime);
                            localStorage.setItem(`timeLeft_${data.currentQuestion.id}`, initialTime.toString());
                        }
                    }
                } else {
                    setCurrentQuestion(null);
                    setTimeLeft(null);
                }
            } catch (err) {
                console.error("Hata:", err);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [joined, groupCode, currentQuestion, teamName]);

    // 3. Geri Sayım ve LocalStorage Güncelleme
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || !currentQuestion) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const nextValue = prev && prev > 0 ? prev - 1 : 0;
                localStorage.setItem(`timeLeft_${currentQuestion.id}`, nextValue.toString());
                return nextValue;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, currentQuestion]);

    // 4. Otomatik Cevap Gönderimi (Süre Bittiğinde)
    useEffect(() => {
        if (timeLeft === 0 && selected && !scoreSubmittedRef.current && currentQuestion) {
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
    }, [timeLeft, selected, currentQuestion]);

    const handleExit = () => {
        // Her şeyi temizle
        localStorage.clear();
        setJoined(false);
        setGroupCode("");
        setTeamName("");
        window.location.href = "/";
    };

    const handleJoin = async () => {
        if (!groupCode || !teamName) {
            toast.error("Lütfen kod girin ve takım seçin!");
            return;
        }
        try {
            const response = await fetch("https://gamebackend.cansalman332.workers.dev/api/session/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupCode: groupCode.toUpperCase().trim(),
                    teamName: teamName
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
        } catch (error) {
            toast.error("Sunucuya bağlanılamadı!");
        }
    };

    // --- GÖRÜNÜMLER ---

    // 1. Giriş Ekranı
    if (!joined) {
        return (
            <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 text-white relative overflow-hidden font-sans">
                <Toaster position="top-center" />
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[3rem] w-full max-w-sm border border-white/10 relative z-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                            <Zap className="text-white" size={32} fill="white" />
                        </div>
                        <h2 className="text-center font-black text-white italic uppercase text-4xl tracking-tighter">GAME<span className="text-indigo-500">HUB</span></h2>
                        <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">Arena Giriş Portalı</p>
                    </div>
                    <div className="space-y-4">
                        <input type="text" placeholder="ODA KODU" className="w-full p-5 bg-white/[0.05] rounded-2xl text-center font-mono text-2xl border border-white/5 focus:border-indigo-500/50 outline-none uppercase transition-all" onChange={(e) => setGroupCode(e.target.value)} value={groupCode} />
                        <select className="w-full p-5 bg-white/[0.05] rounded-2xl font-bold border border-white/5 outline-none text-slate-300 appearance-none focus:border-indigo-500/50 transition-all cursor-pointer" onChange={(e) => setTeamName(e.target.value)} value={teamName}>
                            <option value="" className="bg-[#050816]">TAKIMINI SEÇ</option>
                            <option value="Kırmızı" className="bg-[#050816]">🔴 KIRMIZI TAKIM</option>
                            <option value="Mavi" className="bg-[#050816]">🔵 MAVI TAKIM</option>
                            <option value="Sarı" className="bg-[#050816]">🟡 SARI TAKIM</option>
                            <option value="Yeşil" className="bg-[#050816]">🟢 YEŞIL TAKIM</option>
                        </select>
                        <button onClick={handleJoin} className="w-full bg-indigo-600 hover:bg-indigo-500 p-5 rounded-2xl font-black text-lg active:scale-[0.97] transition-all shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]">ARENAYA KATIL</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // 2. Bekleme Odası (Öğretmen soru açmadıysa)
    if (gameStatus === "waiting" || !currentQuestion) {
        return (
            <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 text-white text-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <Loader2 size={64} className="text-indigo-500 animate-spin mb-6" />
                    <h2 className="text-3xl font-black mb-2 uppercase italic">HAZIR OL!</h2>
                    <p className="text-slate-400 max-w-[250px] text-sm font-medium">Öğretmen arena savaşını başlatmak üzere. İlk soru gelene kadar bekle...</p>
                    <div className="mt-10 p-6 bg-white/[0.03] border border-white/10 rounded-3xl w-full max-w-xs">
                        <span className="text-[10px] text-indigo-400 font-black block mb-2 uppercase tracking-widest">Kayıtlı Takım</span>
                        <div className="text-xl font-bold">{teamName}</div>
                    </div>
                    <button onClick={handleExit} className="mt-8 text-slate-500 text-xs font-bold hover:text-red-400 transition-all flex items-center gap-2">
                        <ArrowLeft size={14} /> ODADAN ÇIK
                    </button>
                </motion.div>
            </div>
        );
    }

    // 3. Oyun Sonu (Burası senin kodunla aynı)
    if (gameStatus === "finished") {
        const sortedTeams = [...allTeams].sort((a, b) => (b.score || 0) - (a.score || 0));
        return (
            <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center p-6 text-white text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                    <Trophy size={100} className="text-yellow-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" />
                    <h2 className="text-5xl font-black mb-10 uppercase italic">FİNAL</h2>
                    <div className="space-y-3 bg-white/[0.02] p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl">
                        {sortedTeams.map((team, idx) => (
                            <div key={idx} className={`flex justify-between items-center p-5 rounded-3xl border ${team.teamName === teamName ? 'border-indigo-500 bg-indigo-500/20' : 'border-white/5 bg-black/40'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}>{idx + 1}</span>
                                    <span className="font-black uppercase">{team.teamName}</span>
                                </div>
                                <span className="font-mono font-black text-2xl text-indigo-400">{team.score || 0}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleExit} className="mt-12 bg-white text-black px-10 py-5 rounded-3xl font-black flex items-center gap-3 mx-auto">
                        <ArrowLeft size={20} /> ANA MENÜ
                    </button>
                </motion.div>
            </div>
        );
    }

    // 4. Aktif Oyun Ekranı (Oyun Devam Ediyor)
    return (
        <div className="min-h-screen bg-[#050816] p-4 text-white flex flex-col items-center relative overflow-hidden font-sans">
            <Toaster position="top-center" />

            {/* Üst Bar */}
            <motion.div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2rem] p-4 flex items-center justify-center gap-3 mb-6 relative z-10">
                <BookOpen size={18} className="text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-200">{lessonName}</span>
            </motion.div>

            {/* Dashboard */}
            <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[3rem] mb-6 border border-white/10 shadow-2xl relative z-10">
                <div className="flex justify-between items-center relative z-20">
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest mb-1">TAKIMIN</span>
                        <span className="text-white font-black uppercase text-xl">{teamName}</span>
                    </div>

                    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-[4px] transition-all ${timeLeft && timeLeft <= 5 ? 'border-red-500 animate-pulse' : 'border-white/10'}`}>
                        <span className={`font-mono font-black text-3xl ${timeLeft && timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                            {timeLeft ?? '--'}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">PUANIN</span>
                        <div className="text-white font-black text-xl flex items-center gap-2">
                            {myScore} <Star size={18} className="text-yellow-500" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Soru Kartı */}
            <motion.div key={currentQuestion?.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-gradient-to-br from-indigo-600 to-blue-700 p-[2px] rounded-[2.5rem] mb-6 shadow-2xl z-10">
                <div className="bg-[#0b112b] p-8 rounded-[2.4rem] text-center">
                    <div className="inline-flex items-center gap-2 mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">SORU AKTİF</span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-relaxed">
                        {currentQuestion?.question}
                    </h3>
                </div>
            </motion.div>

            {/* Cevap Butonları */}
            <div className="w-full max-w-md grid gap-3 mb-10 relative z-10">
                {ANSWERS.map((ans, idx) => {
                    const isSelected = selected === ans;
                    const isTimeUp = timeLeft === 0;
                    const isCorrect = currentQuestion?.correctAnswer === ans;

                    let cardStyle = "bg-white/[0.04] border-white/5 text-slate-400";
                    if (!isTimeUp && isSelected) cardStyle = "bg-indigo-600 border-indigo-400 text-white shadow-xl scale-[1.02]";

                    if (isTimeUp) {
                        if (isCorrect) cardStyle = "bg-emerald-500 border-emerald-400 text-white scale-[1.05]";
                        else if (isSelected) cardStyle = "bg-red-500 border-red-400 text-white opacity-80";
                        else cardStyle = "bg-white/[0.02] border-transparent opacity-20 grayscale";
                    }

                    return (
                        <motion.button
                            key={ans}
                            onClick={() => !isTimeUp && setSelected(ans)}
                            disabled={isTimeUp}
                            className={`p-4 rounded-3xl border-2 transition-all duration-200 flex items-center ${cardStyle}`}
                        >
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black text-lg ${isSelected ? 'bg-white text-indigo-600' : 'bg-white/10 text-white'}`}>
                                {ans}
                            </span>
                            <span className="font-bold text-base">{currentQuestion?.options?.[ans]}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Çıkış Butonu */}
            <button onClick={handleExit} className="mb-8 flex items-center gap-3 text-slate-600 hover:text-white transition-all">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <ArrowLeft size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oturumdan Ayrıl</span>
            </button>
        </div>
    );
}