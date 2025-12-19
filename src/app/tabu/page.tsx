"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, SkipForward, CheckCircle2, XCircle, Loader2, BookOpen, Atom, Languages, BrainCircuit, ChevronLeft } from "lucide-react";

const SUBJECTS = [
    { id: "fizik", name: "Fizik", icon: <Atom size={24} />, color: "from-blue-500 to-cyan-600" },
    { id: "edebiyat", name: "Edebiyat", icon: <BookOpen size={24} />, color: "from-orange-500 to-red-600" },
    { id: "bilisim", name: "Bilişim", icon: <BrainCircuit size={24} />, color: "from-emerald-500 to-teal-600" },
    { id: "genel", name: "Genel Kültür", icon: <Languages size={24} />, color: "from-purple-500 to-pink-600" },
];

export default function TabuArena() {
    const [gameState, setGameState] = useState<"menu" | "loading" | "playing" | "finished" | "error">("menu");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [words, setWords] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [passCount, setPassCount] = useState(3); // PAS HAKKI STATE
    const [isProcessing, setIsProcessing] = useState(false);

    const startGame = async (subjectId: string) => {
        setSelectedSubject(subjectId);
        setGameState("loading");
        try {
            const res = await fetch(`https://gamebackend.cansalman332.workers.dev/api/questions?category=tabu_${subjectId}`);
            const data = await res.json();
            setWords(data.sort(() => Math.random() - 0.5));
            setGameState("playing");
            setTimeLeft(60);
            setScore(0);
            setPassCount(3); // Başlarken hakları sıfırla
            setCurrentIndex(0);
        } catch (err) { setGameState("error"); }
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("finished");
        }
    }, [gameState, timeLeft]);

    const handleAction = (type: "correct" | "tabu" | "pass") => {
        if (isProcessing) return;

        // Pas kontrolü
        if (type === "pass") {
            if (passCount <= 0) return;
            setPassCount(prev => prev - 1);
        }

        const currentWord = words[currentIndex];
        if (!currentWord) return;

        setIsProcessing(true);
        if (type === "correct") setScore(prev => prev + (currentWord.isExtra === 1 ? 2 : 1));
        if (type === "tabu") setScore(prev => prev - 1);

        setTimeout(() => {
            if (currentIndex < words.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsProcessing(false);
            } else {
                setGameState("finished");
                setIsProcessing(false);
            }
        }, 400);
    };

    if (gameState === "menu") return (
        <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl md:text-6xl font-black text-white italic mb-8 uppercase tracking-tighter">TABU <span className="text-emerald-500">ARENA</span></h1>
            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {SUBJECTS.map(sub => (
                    <button key={sub.id} onClick={() => startGame(sub.id)} className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-white font-black hover:border-emerald-500 transition-all uppercase text-[10px] flex flex-col items-center gap-2 tracking-widest">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${sub.color}`}>{sub.icon}</div>
                        {sub.name}
                    </button>
                ))}
            </div>
        </div>
    );

    if (gameState === "loading") return (
        <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-emerald-500 font-black uppercase text-xs">
            <Loader2 className="animate-spin" size={40} />
            Yükleniyor...
        </div>
    );

    if (gameState === "finished") return (
        <div className="h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="text-amber-500 mb-4" size={60} />
            <h1 className="text-3xl font-black text-white italic mb-2 uppercase tracking-tighter">BİTTİ!</h1>
            <div className="text-8xl font-black text-emerald-500 mb-8 italic">{score}</div>
            <div className="flex flex-col gap-3 w-full max-w-xs px-4">
                <button onClick={() => setGameState("menu")} className="py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black uppercase text-xs">ANA MENÜ</button>
                <button onClick={() => startGame(selectedSubject)} className="py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-xs italic">TEKRAR DENE</button>
            </div>
        </div>
    );

    const currentCard = words[currentIndex];
    const isExtra = currentCard?.isExtra === 1;

    return (
        <div className="h-screen w-full bg-[#020617] text-white p-4 flex flex-col items-center overflow-hidden font-sans">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center h-14 bg-slate-900/50 px-4 rounded-2xl border border-slate-800 shrink-0">
                <button onClick={() => setGameState("menu")} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500"><ChevronLeft size={20} /></button>
                <div className="flex items-center gap-2 font-black text-lg">
                    <Timer className={timeLeft < 10 ? "text-red-500" : "text-emerald-500"} size={18} />
                    <span>0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-amber-500">
                    <Trophy size={16} />
                    <span className="font-black text-lg">{score}</span>
                </div>
            </div>
            <br />
            {/* Kart Alanı */}
            <div className="flex-1 w-full max-w-sm flex items-center justify-center my-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className={`w-full max-h-full aspect-[3/4.5] rounded-[2.5rem] p-6 flex flex-col border-[4px] relative shadow-2xl ${isExtra
                            ? "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 border-white"
                            : "bg-slate-900 border-emerald-500"
                            }`}
                    >
                        <div className="text-center mb-4 shrink-0">
                            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isExtra ? "text-amber-900/80" : "text-emerald-500/80"}`}>
                                {selectedSubject} {isExtra && "• BONUS"}
                            </span>
                            <h2 className={`text-3xl md:text-4xl font-black uppercase mt-1 tracking-tighter leading-tight ${isExtra ? "text-amber-950" : "text-white"}`}>
                                {currentCard?.word}
                            </h2>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-2 overflow-hidden px-2">
                            <div className={`h-[1px] w-full opacity-20 ${isExtra ? 'bg-amber-900' : 'bg-white'}`} />
                            {(typeof currentCard?.forbidden_words === 'string' ? JSON.parse(currentCard.forbidden_words) : currentCard?.forbidden_words)?.map((fw: string, i: number) => (
                                <div key={i} className={`py-3 px-1 rounded-xl text-center font-bold uppercase text-[11px] border ${isExtra
                                    ? "bg-white/30 border-white/20 text-amber-950 shadow-sm"
                                    : "bg-slate-950/50 border-slate-800 text-slate-300 shadow-inner"
                                    }`}>
                                    {fw}
                                </div>
                            ))}
                        </div>

                        {isExtra && (
                            <div className="absolute -top-3 -right-3 bg-white text-amber-600 p-2 rounded-full shadow-lg border-2 border-amber-500 animate-bounce">
                                <Trophy size={20} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <br />
            {/* Kontrol Butonları */}
            <div className="w-full max-w-sm grid grid-cols-3 gap-3 mb-2 shrink-0">
                <button disabled={isProcessing} onClick={() => handleAction("tabu")} className="flex flex-col items-center gap-1 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 active:scale-90 transition-all">
                    <XCircle size={28} />
                    <span className="text-[9px] font-black tracking-tighter">TABU</span>
                </button>

                {/* PAS BUTONU - DİNAMİK HAK SİSTEMİ */}
                <button
                    disabled={isProcessing || passCount <= 0}
                    onClick={() => handleAction("pass")}
                    className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all active:scale-90 border ${passCount > 0
                        ? "bg-slate-900 border-slate-800 text-slate-400"
                        : "bg-slate-950 border-red-900/30 text-slate-700 cursor-not-allowed shadow-none"
                        }`}
                >
                    <SkipForward size={28} />
                    <span className="text-[8px] font-black tracking-tighter uppercase leading-tight text-center">
                        {passCount > 0 ? (
                            <>PAS <br /> ({passCount})</>
                        ) : (
                            "PAS HAKKI BİTTİ"
                        )}
                    </span>
                </button>

                <button disabled={isProcessing} onClick={() => handleAction("correct")} className="flex flex-col items-center gap-1 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 active:scale-90 transition-all">
                    <CheckCircle2 size={28} />
                    <span className="text-[9px] font-black tracking-tighter">DOĞRU</span>
                </button>
            </div>
        </div>
    );
}