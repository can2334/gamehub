"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
    Cpu, Zap, ArrowLeft, BookOpen,
    GraduationCap, User, Lightbulb, Search, Target,
    Code2, Rocket, Layout, Sparkles, Terminal, Globe, Layers
} from "lucide-react";

// Animasyon varyantlarını daha akıcı hale getirdik
const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.7,
            ease: [0.215, 0.61, 0.355, 1], // Custom cubic-bezier for smooth feel
        },
    }),
};

const iconHover = {
    scale: 1.2,
    rotate: 5,
    transition: { type: "spring", stiffness: 400, damping: 10 }
};

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-blue-500/30 overflow-x-hidden font-sans">
            {/* Dinamik Arka Plan Glow - Daha canlı hale getirildi */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">

                {/* --- NAVIGATION --- */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-16 md:mb-24"
                >
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 text-slate-500 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-blue-500/30 shadow-xl"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-blue-500" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Geri Dön</span>
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-sm animate-pulse opacity-50 rounded-full" />
                            <Sparkles size={14} className="text-blue-400 relative z-10" />
                        </div>
                        <span className="text-[10px] text-blue-400 font-black tracking-widest uppercase">V2.0 Core Engine</span>
                    </div>
                </motion.header>

                {/* --- HERO SECTION --- */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mb-32 relative"
                >
                    <div className="absolute -left-10 top-0 w-1 h-24 bg-gradient-to-b from-blue-500 to-transparent hidden md:block" />
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-tight mb-8">
                        Geleceğin <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400 not-italic">
                            Eğitim Arenası
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-3xl font-medium border-l-2 border-slate-800 pl-8">
                        Eğitimi statik bir görevden çıkarıp dinamik bir <span className="text-white font-bold underline underline-offset-8 decoration-blue-500/40">dijital serüvene</span> dönüştürüyoruz.
                        Bilişim Arena, modern web teknolojilerinin gücünü pedagojik oyunlaştırma ile birleştiren bir vizyon projesidir.
                    </p>
                </motion.section>

                {/* --- TECH STACK (Yenilenen Bölüm) --- */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
                    {[
                        { icon: <Layout />, label: "MİMARİ", val: "Next.js 14", color: "blue" },
                        { icon: <Terminal />, label: "DİL", val: "TypeScript", color: "indigo" },
                        { icon: <Layers />, label: "STİL", val: "Tailwind CSS", color: "cyan" },
                        { icon: <Globe />, label: "ALTYAPI", val: "Edge Workers", color: "emerald" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="group bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.05] transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-150 transition-transform duration-500">
                                {item.icon}
                            </div>
                            <div className="text-blue-500 mb-4 group-hover:animate-bounce">{item.icon}</div>
                            <div className="text-[9px] font-black text-slate-500 tracking-[0.3em] mb-1">{item.label}</div>
                            <div className="text-xs font-black text-white uppercase tracking-wider">{item.val}</div>
                        </motion.div>
                    ))}
                </section>

                {/* --- MİSYON VE ANALİZ --- */}
                <div className="mb-32">
                    <h2 className="text-xs font-black text-blue-500 tracking-[0.4em] uppercase mb-12 flex items-center gap-4">
                        <div className="h-px w-12 bg-blue-500" /> Analitik Yaklaşım
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Target />,
                                title: "Kalıcı Bilişsel Hafıza",
                                color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                                text: "Bilgiyi sadece okutmak yerine deneyimletiyoruz. Anlık rekabet ve görsel uyaranlar, öğrenilenlerin uzun süreli hafızaya transferini %70 oranında hızlandırır."
                            },
                            {
                                icon: <Zap />,
                                title: "Dinamik Geri Bildirim",
                                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                                text: "Sistem, her öğrencinin performansını gerçek zamanlı analiz eder. Yanlış cevaplar 'hata' değil, anında düzeltilen 'öğrenme noktaları' olarak kurgulanmıştır."
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="p-8 rounded-[2.5rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 space-y-5 group hover:border-blue-500/30 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                    {card.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                                    {card.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- GELİŞTİRİCİ PROFİL (Premium Kart) --- */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group mb-32"
                >
                    {/* Arka plan glow efekti */}
                    <div className="absolute inset-0 bg-blue-600/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative bg-slate-900/40 border border-white/10 p-6 md:p-12 rounded-[3rem] overflow-hidden backdrop-blur-sm">
                        <div className="grid md:grid-cols-2 gap-12 items-center">

                            {/* Sol taraf: Metin ve roller */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
                                    <User size={12} className="text-blue-500" /> Lead Developer
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                                    Umut Can <span className="text-blue-500">Salman</span>
                                </h2>

                                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                                    Yazılım dünyasına tutkusu ve yaratıcı yaklaşımıyla Bilişim Arena'yı hayata geçirdi. Modern web teknolojilerini ve kullanıcı deneyimini ön planda tutarak, Türkiye’deki eğitim materyallerini dünya standartlarında erişilebilir ve etkili bir platform haline getirmeyi hedefliyor. Bilişim Arena, Umut’un yazılım bilgisi ve vizyonunu eğitimle buluşturan bir projedir.
                                </p>

                                <div className="flex gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                                        <GraduationCap className="text-blue-500 mb-2" size={20} />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Serçev MTAL</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center">
                                        <Code2 className="text-indigo-500 mb-2" size={20} />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">Full-Stack Dev</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sağ taraf: Fotoğraf ve efektler */}
                            <div className="hidden md:flex justify-center">
                                <div className="relative group/photo">

                                    {/* Arka glow */}
                                    <div className="absolute inset-0 bg-blue-600 rounded-[3rem] rotate-6 blur-2xl opacity-20 group-hover/photo:opacity-40 transition-opacity duration-500" />

                                    {/* Fotoğraf çerçevesi */}
                                    <div className="w-64 h-64 bg-slate-800 rounded-[3rem] rotate-6 flex items-center justify-center relative overflow-hidden border-4 border-white/10 group-hover/photo:rotate-3 transition-transform duration-500 shadow-2xl">
                                        <img
                                            src="/umut-can-salman.jpg"
                                            alt="Umut Can Salman"
                                            className="w-full h-full object-cover -rotate-6 scale-110 group-hover/photo:scale-100 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://ui-avatars.com/api/?name=Umut+Can+Salman&background=020617&color=3b82f6&size=512";
                                            }}
                                        />

                                        {/* Overlay gradyan */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-60" />

                                        {/* Dönen kesikli çerçeve */}
                                        <div className="absolute inset-2 border border-white/20 rounded-[2.5rem] border-dashed animate-[spin_15s_linear_infinite] pointer-events-none" />
                                    </div>

                                    {/* Admin etiketi */}
                                    <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg rotate-12 shadow-xl border border-blue-400 animate-bounce">
                                        ADMIN VERIFIED
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.section>


                {/* --- FOOTER --- */}
                <footer className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="text-[11px] font-black text-white tracking-[0.5em] uppercase mb-3">
                            © 2025 - 2026 EDU-GAMIFICATION ENGINE
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                            Eğitim Bir Görev Değil, <span className="text-blue-500">Bir Deneyimdir.</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                        {/* Noktalar Grubu */}
                        <motion.div
                            className="flex gap-2"
                            variants={{
                                animate: {
                                    transition: {
                                        staggerChildren: 0.2 // Noktalar arası 0.2sn gecikme
                                    }
                                }
                            }}
                            initial="initial"
                            animate="animate"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    variants={{
                                        initial: { opacity: 0.3, scale: 0.8 },
                                        animate: {
                                            opacity: [0.3, 1, 0.3],
                                            scale: [0.8, 1.1, 0.8],
                                        }
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                />
                            ))}
                        </motion.div>

                        {/* Metin Alanı */}
                        <span className="text-[9px] text-slate-400 font-black tracking-[0.3em] uppercase">
                            System Status: <span className="text-blue-400 animate-pulse">Processing</span>
                        </span>
                    </div>
                </footer>
            </div>
        </div>
    );
}