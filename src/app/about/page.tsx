"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
    Info, Cpu, ShieldCheck, Zap, ArrowLeft, Github, Globe,
    BookOpen, GraduationCap, User, Lightbulb, Search, Target
} from "lucide-react";

export default function AboutPage() {
    const router = useRouter();

    const stats = [
        { label: "Mimari", value: "Next.js 14 (App Router)", icon: <Cpu size={14} /> },
        { label: "Dil", value: "TypeScript & Tailwind", icon: <Zap size={14} /> },
        { label: "Amacı", value: "Eğitimin Oyunlaştırılması", icon: <Lightbulb size={14} /> },
    ];

    const missionCards = [
        {
            icon: <BookOpen className="text-blue-500" />,
            title: "Öğrenme Odaklı",
            desc: "Ders ünitelerini, terimleri ve önemli kavramları klasik ezber yönteminden çıkarıp eğlenceli bir yarışma formatına dönüştürür."
        },
        {
            icon: <Target className="text-emerald-500" />,
            title: "Kalıcı Bilgi",
            desc: "Sorular ve jokerler aracılığıyla öğrencilerin konuları tekrar etmesini sağlar, görsel ve interaktif geri bildirimle akılda kalıcılığı artırır."
        },
        {
            icon: <Search className="text-amber-500" />,
            title: "Analitik Düşünme",
            desc: "Süre kısıtlaması ve stratejik joker kullanımıyla öğrencinin baskı altında doğru karar verme yeteneğini geliştirir."
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans">
            {/* Arka Plan Glow Efektleri */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
                {/* Geri Butonu */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-12 font-bold uppercase text-xs tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> Geri Dön
                </button>

                {/* ANA BAŞLIK BÖLÜMÜ */}
                <div className="space-y-8 mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        <GraduationCap size={14} /> Eğitim Teknolojileri Projesi
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight italic">
                        Bilişim <span className="text-blue-500">Arena</span> <br />
                    </h1>
                    <p className="text-slate-400 max-w-3xl text-lg md:text-xl leading-relaxed font-medium italic border-l-2 border-slate-800 pl-8">
                        "Bu platform, okul derslerindeki karmaşık üniteleri ve kelimeleri öğrencilerin zihninde
                        kalıcı hale getirmek için tasarlanmış bir **interaktif pekiştirme aracıdır**."
                    </p>
                </div>

                {/* TEKNİK ÖZET KARTLARI */}
                <div className="flex flex-wrap gap-4 mb-20">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800/50 px-6 py-4 rounded-2xl flex items-center gap-4 hover:border-blue-500/30 transition-all">
                            <div className="p-2 bg-slate-950 rounded-lg text-blue-500">{s.icon}</div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
                                <p className="text-sm font-bold text-slate-200">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* VİZYON KARTLARI */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {missionCards.map((card, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 hover:border-blue-500/40 transition-all duration-500">
                            <div className="mb-6 w-14 h-14 flex items-center justify-center bg-slate-950 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 uppercase tracking-tight italic">{card.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* OKUL & GELİŞTİRİCİ BÖLÜMÜ */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-2">
                            <User size={14} /> Geliştirici Bilgileri
                        </h4>
                        <p className="text-2xl font-black italic mb-2">Umut Can Salman</p>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bilişim Teknolojileri alanına duyduğum merakı, eğitimde inovasyon yaratma amacıyla bu projeye dönüştürdüm.
                            Frontend'den Backend mimarisine kadar tüm süreç şahsım tarafından yönetilmiştir.
                        </p>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-slate-900/40 border border-slate-800">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                            <GraduationCap size={14} /> Kurumsal Bilgi
                        </h4>
                        <p className="text-xl font-black italic mb-2">Serçev Engelsiz Mesleki Ve teknik Anadolu Lisesi</p>
                        <p className="text-slate-500 text-sm leading-relaxed italic">
                            Bu çalışma, okul müfredatına destekleyici bir dijital materyal olarak sunulmak üzere hazırlanmıştır.
                            Öğretmenlerin ve öğrencilerin kullanımına açıktır.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-900 pt-12">
                    <div className="flex gap-3">
                        {["Tailwind", "NextJS", "TypeScript", "Vercel"].map(t => (
                            <span key={t} className="text-[10px] font-bold text-slate-600 border border-slate-800/50 px-3 py-1 rounded-lg uppercase tracking-widest">{t}</span>
                        ))}
                    </div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
                        © 2024 EDU-GAMIFICATION PROJECT
                    </p>
                </div>
            </div>
        </div>
    );
}