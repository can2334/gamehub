"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, BookOpen, Atom, Calculator, Code2, GraduationCap } from "lucide-react";

export default function MillionaireSetup() {
    // API'nin URL'de beklediği küçük harf ID'ler
    const [selectedLessonId, setSelectedLessonId] = useState("bilisim");
    const router = useRouter();

    const lessons = [
        { id: "bilisim", name: "Bilişim", icon: <Code2 size={18} />, color: "text-emerald-500" },
        { id: "fizik", name: "Fizik", icon: <Atom size={18} />, color: "text-purple-500" },
        { id: "matematik", name: "Matematik", icon: <Calculator size={18} />, color: "text-amber-500" },
        { id: "genel", name: "Genel Kültür", icon: <GraduationCap size={18} />, color: "text-blue-500" },
    ];

    const handleStart = () => {
        const lesson = lessons.find(l => l.id === selectedLessonId);

        // Takımları sildik, sadece seçilen branşı kaydediyoruz
        localStorage.clear();
        localStorage.setItem("m_lesson", lesson?.name || "");
        localStorage.setItem("m_score", "0");

        // API'nin istediği formatta yönlendirme yapıyoruz: ?category=fizik
        router.push(`/quiz/start?category=${selectedLessonId}`);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full space-y-8 bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl">

                {/* BAŞLIK */}
                <div className="text-center">
                    <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl text-blue-500 mb-6">
                        <Cpu size={40} className="animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                        KİM <span className="text-blue-500">1024 GB</span> <br /> İSTER?
                    </h1>
                </div>

                {/* BRANŞ SEÇİMİ */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
                            <BookOpen size={12} /> KATEGORİ SEÇİN
                        </label>

                        <div className="grid grid-cols-1 gap-3">
                            {lessons.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setSelectedLessonId(lesson.id)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all font-bold group ${selectedLessonId === lesson.id
                                            ? "bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                                            : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                                        }`}
                                >
                                    <span className={`p-2 rounded-lg bg-slate-900 ${lesson.color}`}>
                                        {lesson.icon}
                                    </span>
                                    <span className="text-lg">{lesson.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BAŞLAT BUTONU */}
                <button
                    onClick={handleStart}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase italic text-xl active:scale-95"
                >
                    SİSTEMİ BAŞLAT <Zap size={22} className="fill-current" />
                </button>
            </div>
        </div>
    );
}