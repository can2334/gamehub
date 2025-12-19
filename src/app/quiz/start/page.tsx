"use client";
import { useState, useEffect, Suspense } from "react"; // Suspense eklendi (Next.js kuralı)
import { useSearchParams } from "next/navigation"; // Kategori okumak için eklendi
import { HelpCircle, Users, BrainCircuit, Timer, Loader2, Trophy, XCircle, Home } from "lucide-react";

const API_URL = "https://gamebackend.cansalman332.workers.dev/api/questions";

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    level: number;
}

// Next.js'de useSearchParams kullanırken "Suspense" sarmalaması önerilir
export default function MillionairePlay() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={50} /></div>}>
            <MillionaireGameContent />
        </Suspense>
    );
}

function MillionaireGameContent() {
    const searchParams = useSearchParams();
    // URL'den kategoriyi alıyoruz (fizik, bilisim vb.)
    const category = searchParams.get("category") || "bilisim";

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
    const [timeLeft, setTimeLeft] = useState(30);
    const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
    const [usedJokers, setUsedJokers] = useState<string[]>([]);

    const levels = ["1 MB", "2 MB", "4 MB", "16 MB", "64 MB", "128 MB", "256 MB", "512 MB", "1024 GB"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // KRİTİK DÜZELTME: API_URL'nin sonuna seçilen kategoriyi ekliyoruz
                const res = await fetch(`${API_URL}?category=${category}`);
                const data = await res.json();
                setQuestions(data);
            } catch (err) {
                console.error("Sorular yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [category]); // Kategori değiştiğinde fetch'i tetikle

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === "playing" && timeLeft > 0 && selectedAnswer === null) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState("finished");
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState, selectedAnswer]);

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null || hiddenOptions.includes(index)) return;
        setSelectedAnswer(index);
        const correct = index === questions[currentStep].correctAnswer;
        setIsCorrect(correct);

        setTimeout(() => {
            if (correct) {
                if (currentStep < levels.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setSelectedAnswer(null);
                    setIsCorrect(null);
                    setTimeLeft(30);
                    setHiddenOptions([]);
                } else {
                    setGameState("finished");
                }
            } else {
                setGameState("finished");
            }
        }, 1500);
    };

    const useJoker = (type: "5050" | "audience" | "pass") => {
        if (usedJokers.includes(type) || gameState !== "playing") return;
        setUsedJokers([...usedJokers, type]);

        if (type === "5050") {
            const correct = questions[currentStep].correctAnswer;
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
            const toHide = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
            setHiddenOptions(toHide);
        } else if (type === "pass") {
            setCurrentStep(prev => prev + 1);
            setTimeLeft(30);
            setHiddenOptions([]);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" size={50} />
        </div>
    );

    const currentQ = questions[currentStep];

    return (
        <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-sans">

            {/* --- MODAL: BAŞLA --- */}
            {gameState === "idle" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border-2 border-blue-500 p-10 rounded-[2rem] max-w-md w-full text-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                        <Trophy className="mx-auto text-amber-500 mb-4" size={64} />
                        <h1 className="text-4xl font-black mb-4 tracking-tighter">MİLYONER</h1>
                        <p className="text-slate-400 mb-8 italic">{category.toUpperCase()} kategorisinde 1024 GB veriye ulaşmaya hazır mısın?</p>
                        <button
                            onClick={() => setGameState("playing")}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                        >
                            OYUNA BAŞLA
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL: OYUN BİTTİ --- */}
            {gameState === "finished" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-slate-900 border-2 border-emerald-500 p-10 rounded-[2rem] max-w-md w-full text-center shadow-2xl">
                        {isCorrect && currentStep === levels.length - 1 ? (
                            <Trophy className="mx-auto text-amber-500 mb-4 animate-bounce" size={80} />
                        ) : (
                            <XCircle className="mx-auto text-rose-500 mb-4" size={80} />
                        )}
                        <h2 className="text-3xl font-black mb-2 uppercase">
                            {isCorrect && currentStep === levels.length - 1 ? "BÜYÜK ÖDÜL!" : "OYUN BİTTİ"}
                        </h2>
                        <div className="bg-slate-800/50 p-6 rounded-2xl my-6">
                            <p className="text-slate-400 text-sm uppercase tracking-widest">Kazanılan Veri</p>
                            <p className="text-5xl font-black text-blue-500 mt-2">
                                {isCorrect ? levels[currentStep] : (currentStep > 0 ? levels[currentStep - 1] : "0 MB")}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                            >
                                TEKRAR DENE
                            </button>
                            <button
                                onClick={() => window.location.href = "/"}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-100 py-4 rounded-xl font-bold transition-all active:scale-95"
                            >
                                ANASAYFA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OYUN ALANI */}
            <div className="flex-1 flex flex-col p-12 relative">

                {/* SOL ÜST HIZLI ÇIKIŞ BUTONU */}
                <button
                    onClick={() => window.location.href = "/"}
                    className="absolute top-8 left-8 text-slate-500 hover:text-white transition-all flex items-center gap-2 font-bold uppercase text-xs tracking-widest"
                >
                    <Home size={18} /> Anasayfa
                </button>

                <div className="flex justify-center mb-16">
                    <div className={`flex items-center gap-3 px-8 py-3 rounded-full border-2 border-amber-500/30 bg-amber-500/10 text-amber-500 ${timeLeft < 10 ? 'animate-pulse text-rose-500 border-rose-500' : ''}`}>
                        <Timer size={32} />
                        <span className="text-3xl font-black font-mono">{timeLeft}s</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                    <div className="w-full relative group">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
                        <div className="relative bg-slate-900/80 backdrop-blur-md border-y-2 border-blue-500/50 p-10 text-center rounded-[3rem] shadow-2xl">
                            <h2 className="text-3xl font-bold leading-relaxed">
                                {currentQ?.question}
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
                        {currentQ?.options.map((item, index) => {
                            const isHidden = hiddenOptions.includes(index);
                            let btnClass = "border-slate-800 bg-slate-900/50";
                            if (selectedAnswer === index) {
                                btnClass = isCorrect ? "border-emerald-500 bg-emerald-500/20" : "border-rose-500 bg-rose-500/20";
                            }
                            if (isHidden) btnClass = "opacity-0 pointer-events-none";

                            return (
                                <button
                                    key={index}
                                    disabled={selectedAnswer !== null || isHidden}
                                    onClick={() => handleAnswer(index)}
                                    className={`p-6 rounded-2xl text-left border-2 transition-all flex items-center gap-4 group active:scale-95 ${btnClass}`}
                                >
                                    <span className="text-blue-500 font-black">0{index + 1}.</span>
                                    <span className="font-bold text-lg">{item}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* JOKERLER */}
                <div className="flex justify-center gap-6 mt-12">
                    <JokerButton icon={HelpCircle} active={!usedJokers.includes("5050")} onClick={() => useJoker("5050")} />
                    <JokerButton icon={Users} active={!usedJokers.includes("audience")} onClick={() => useJoker("audience")} />
                    <JokerButton icon={BrainCircuit} active={!usedJokers.includes("pass")} onClick={() => useJoker("pass")} />
                </div>
            </div>

            {/* SAĞ TARAF: BASAMAKLAR */}
            <div className="w-80 bg-slate-950/50 border-l border-slate-800 flex flex-col items-center py-12 px-6">
                <h3 className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mb-8">VERİ BOYUTU</h3>
                <div className="flex flex-col-reverse w-full gap-2">
                    {levels.map((level, i) => (
                        <div
                            key={i}
                            className={`w-full py-3 px-6 rounded-xl font-black text-sm flex justify-between items-center transition-all duration-500 ${i === currentStep
                                ? 'bg-blue-600 text-white scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                                : i < currentStep ? 'text-emerald-500 opacity-50' : 'text-slate-600'
                                }`}
                        >
                            <span className="font-mono text-[10px]">{i + 1}</span>
                            <span>{level}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function JokerButton({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={!active}
            className={`p-5 rounded-full border-2 transition-all shadow-xl ${active
                ? "bg-slate-900 border-slate-800 text-blue-400 hover:scale-110 hover:border-blue-500 hover:text-white"
                : "bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed opacity-40"
                }`}
        >
            <Icon size={32} />
        </button>
    );
}