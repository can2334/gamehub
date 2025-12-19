"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Cpu, Zap, ArrowLeft, BookOpen,
    GraduationCap, User, Lightbulb, Search, Target,
    Code2, Rocket, Layout, Sparkles
} from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" }
    })
};
import { Variants } from "framer-motion";
const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut", // Buradaki string hatasını "easeOut" gibi sabit bir değer yaparak çözeriz
        },
    }),
};
export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-blue-500/30 overflow-x-hidden">
            {/* Arka Plan Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-center mb-20"
                >
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-all text-xs font-bold tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Geri Dön
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-bold tracking-tighter uppercase">
                        <Sparkles size={12} className="text-blue-500 animate-pulse" />
                        v2.0 Platform
                    </div>
                </motion.header>

                {/* Hero */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mb-24 space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic leading-none">
                        Bilişim <span className="text-blue-500 not-italic">Arena</span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl font-medium">
                        Eğitimi bir görevden çok, bir{" "}
                        <span className="text-white underline underline-offset-4 decoration-blue-500/50">
                            deneyime
                        </span>{" "}
                        dönüştürüyoruz. Karmaşık müfredat ünitelerini interaktif oyun
                        mekanikleriyle yeniden kurguladık.
                    </p>
                </motion.section>

                {/* Özellikler */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {[
                        { icon: <Layout size={20} />, label: "MİMARİ", val: "Next.js 14" },
                        { icon: <Code2 size={20} />, label: "TEKNOLOJİ", val: "TypeScript" },
                        { icon: <Rocket size={20} />, label: "ODAK", val: "Eğitim" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            whileHover={{ y: -4 }}
                            className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl shadow-sm transition-transform"
                        >
                            <div className="text-blue-500 mb-4">{item.icon}</div>
                            <div className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-1">
                                {item.label}
                            </div>
                            <div className="text-sm font-bold text-white tracking-wide uppercase">
                                {item.val}
                            </div>
                        </motion.div>
                    ))}
                </section>
                <br />
                {/* Neden */}
                <div className="space-y-6 mb-24 text-sm">
                    <h2 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/30" /> Neden Bilişim Arena?
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: <Target size={20} />,
                                title: "Kalıcı Öğrenme",
                                color: "text-blue-500 bg-blue-500/10",
                                text:
                                    "Klasik ezber yöntemleri yerine, soru-cevap ve anlık geri bildirimle bilginin görsel hafızada yer edinmesini sağlıyoruz."
                            },
                            {
                                icon: <Search size={20} />,
                                title: "Anlık Geri Bildirim",
                                color: "text-emerald-500 bg-emerald-500/10",
                                text:
                                    "Yanlış cevaplar birer engel değil, öğrenme fırsatıdır. Sistem hatayı anında analiz eder ve doğru bilgiyi sunar."
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={containerVariants}
                                className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800/50 space-y-4 hover:bg-slate-900/40 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-white font-bold uppercase tracking-tight">
                                    {card.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed">
                                    {card.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <br />
                {/* Geliştirici */}
                <section className="flex flex-col gap-6 mb-24">
                    <div className="grid md:grid-cols-5 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="md:col-span-2 p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 flex flex-col justify-center"
                        >

                            {/* User Logosu - Pozisyon ve Boyut Ayarı Yapıldı */}
                            <User
                                className="text-slate-600 mb-6" size={24}
                            />

                            {/* İçerik - z-10 ile logonun üstüne çıkarıldı */}
                            <div className="relative z-10">

                                <div className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                                    Umut Can Salman
                                </div>
                                <p className="text-slate-400 leading-relaxed max-w-[280px] text-sm font-medium">
                                    Bilişim Teknolojileri merakını modern yazılım standartlarıyla
                                    birleştirerek bu platformu inşa etti.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="md:col-span-2 p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 flex flex-col justify-center"
                        >
                            <GraduationCap className="text-slate-600 mb-6" size={24} />
                            <div className="text-sm font-bold text-slate-200 uppercase leading-snug mb-2">
                                Serçev Engelsiz Mesleki ve Teknik Anadolu Lisesi
                            </div>
                            <p className="text-xs text-slate-500 italic">
                                Resmi eğitim materyali projesi.
                            </p>
                        </motion.div>
                    </div>
                </section>
                <br />
                {/* Footer */}
                <footer className="pt-12 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-600 tracking-[0.4em] uppercase">
                            © 2025 - 2026 EDU-GAMIFICATION
                        </p>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            Eğitim, ezber değil. Deneyimdir.
                            Bu platform <span className="text-slate-300 font-semibold">Umut Can Salman</span> tarafından
                            oyunlaştırılmış öğrenme vizyonuyla geliştirildi.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">
                            Built with focus
                        </span>
                    </div>
                </footer>


            </div>
        </div>
    );
}
