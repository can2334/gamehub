"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
    ArrowLeft, Layout, Terminal, Layers, Globe,
    Target, Zap, GraduationCap, Code2, User, Sparkles
} from "lucide-react";

/* ─── CURSOR GLOW ─── */
function CursorGlow() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 80, damping: 20 });
    const sy = useSpring(y, { stiffness: 80, damping: 20 });

    useEffect(() => {
        const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    return (
        <motion.div
            style={{ left: sx, top: sy }}
            className="pointer-events-none fixed z-[999] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="w-full h-full rounded-full bg-emerald-500/5 blur-[80px]" />
        </motion.div>
    );
}

/* ─── SCAN LINE ─── */
function ScanLine() {
    return (
        <motion.div
            className="pointer-events-none fixed left-0 right-0 h-[2px] z-[998] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
    );
}

/* ─── GRID OVERLAY ─── */
function GridOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(16,185,129,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
            }}
        />
    );
}

/* ─── TECH CARD ─── */
function TechCard({ icon, label, val, delay }: { icon: React.ReactNode; label: string; val: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="group relative p-6 rounded-2xl bg-[#0a0f1a] border border-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 overflow-hidden"
        >
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />
            <div className="mb-4 p-2.5 w-fit rounded-xl bg-slate-950 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <div className="text-emerald-400">{icon}</div>
            </div>
            <div className="text-[9px] font-black text-slate-700 tracking-[0.3em] mb-1 uppercase">{label}</div>
            <div className="text-xs font-black text-white uppercase tracking-wider">{val}</div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 opacity-60" />
        </motion.div>
    );
}

/* ─── ANALYSIS CARD ─── */
function AnalysisCard({
    icon, title, text, accent, delay
}: { icon: React.ReactNode; title: string; text: string; accent: string; delay: number }) {
    const colors: Record<string, { border: string; icon: string; glow: string }> = {
        emerald: { border: "hover:border-emerald-500/30", icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.06)]" },
        cyan: { border: "hover:border-cyan-500/30", icon: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", glow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.06)]" },
    };
    const c = colors[accent];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className={`group relative p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] transition-all duration-500 overflow-hidden ${c.border} ${c.glow}`}
        >
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 group-hover:border-white/20 transition-colors duration-500" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 group-hover:border-white/20 transition-colors duration-500" />

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ${c.icon}`}>
                {icon}
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-mono">{text}</p>

            <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 opacity-60" />
        </motion.div>
    );
}

/* ─── MAIN PAGE ─── */
export default function AboutPage() {
    const router = useRouter();

    return (
        <div
            className="min-h-screen bg-[#030712] text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden relative"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
            <CursorGlow />
            <ScanLine />
            <GridOverlay />

            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute -top-[20%] -right-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[160px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[160px] rounded-full"
                />
            </div>

            <div className="max-w-5xl mx-auto px-8 md:px-16 py-16 relative z-10">

                {/* ─── NAV ─── */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-center mb-20"
                >
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-emerald-500/30 hover:text-white text-slate-500 transition-all duration-300"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300 text-emerald-500" />
                        <span className="text-[10px] font-black tracking-[0.25em] uppercase">Geri Dön</span>
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/15">
                        <Sparkles size={12} className="text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-black tracking-[0.2em] uppercase">V3.0 Core Engine</span>
                    </div>
                </motion.header>

                {/* ─── HERO ─── */}
                <section className="mb-28 relative">
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-6 flex items-center gap-3"
                    >
                        <span className="h-px w-6 bg-emerald-500/50" />
                        // Hakkımızda
                    </motion.p>

                    <div className="overflow-hidden mb-6">
                        <motion.h1
                            initial={{ y: 80 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-[-0.04em] text-white leading-[0.88] uppercase"
                        >
                            Geleceğin{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                                Eğitim Arenası
                            </span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-xl text-sm text-slate-500 leading-relaxed border-l border-emerald-500/30 pl-6"
                    >
                        Eğitimi statik bir görevden çıkarıp dinamik bir{" "}
                        <span className="text-slate-300">dijital serüvene</span> dönüştürüyoruz.
                        Modern web teknolojilerinin gücünü pedagojik oyunlaştırma ile birleştiren bir vizyon projesi.
                    </motion.p>
                </section>

                {/* ─── TECH STACK ─── */}
                <section className="mb-28">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-8 flex items-center gap-3"
                    >
                        <span className="h-px w-6 bg-emerald-500/50" />
                        // Tech Stack
                    </motion.p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TechCard icon={<Layout size={18} />} label="Mimari" val="Next.js 14" delay={0} />
                        <TechCard icon={<Terminal size={18} />} label="Dil" val="TypeScript" delay={0.08} />
                        <TechCard icon={<Layers size={18} />} label="Stil" val="Tailwind CSS" delay={0.16} />
                        <TechCard icon={<Globe size={18} />} label="Altyapı" val="Edge Workers" delay={0.24} />
                    </div>
                </section>

                {/* ─── ANALYSIS ─── */}
                <section className="mb-28">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-8 flex items-center gap-3"
                    >
                        <span className="h-px w-6 bg-emerald-500/50" />
                        // Analitik Yaklaşım
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-5">
                        <AnalysisCard
                            icon={<Target size={20} />}
                            title="Kalıcı Bilişsel Hafıza"
                            text="Bilgiyi sadece okutmak yerine deneyimletiyoruz. Anlık rekabet ve görsel uyaranlar, öğrenilenlerin uzun süreli hafızaya transferini %70 oranında hızlandırır."
                            accent="emerald"
                            delay={0}
                        />
                        <AnalysisCard
                            icon={<Zap size={20} />}
                            title="Dinamik Geri Bildirim"
                            text="Sistem, her öğrencinin performansını gerçek zamanlı analiz eder. Yanlış cevaplar 'hata' değil, anında düzeltilen 'öğrenme noktaları' olarak kurgulanmıştır."
                            accent="cyan"
                            delay={0.1}
                        />
                    </div>
                </section>

                {/* ─── DEVELOPER PROFILE ─── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-28"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-8 flex items-center gap-3"
                    >
                        <span className="h-px w-6 bg-emerald-500/50" />
                        // Geliştirici
                    </motion.p>

                    <div className="relative group p-8 md:p-12 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] hover:border-emerald-500/20 transition-all duration-500 overflow-hidden">
                        {/* Corner decorations */}
                        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />
                        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />
                        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />
                        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-white/10 group-hover:border-emerald-500/30 transition-colors duration-500" />

                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            {/* Left: Info */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-6">
                                    <User size={10} className="text-emerald-500" /> Lead Developer
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-6">
                                    Umut Can{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                        Salman
                                    </span>
                                </h2>

                                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-mono">
                                    Yazılım dünyasına tutkusu ve yaratıcı yaklaşımıyla Bilişim Arena'yı hayata geçirdi.
                                    Modern web teknolojilerini ve kullanıcı deneyimini ön planda tutarak Türkiye'deki
                                    eğitim materyallerini dünya standartlarında erişilebilir bir platforma dönüştürmeyi hedefliyor.
                                </p>

                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-950 border border-white/[0.04] group/card hover:border-emerald-500/20 transition-colors duration-300">
                                        <GraduationCap className="text-emerald-400" size={18} />
                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.15em] text-center">Serçev MTAL</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-950 border border-white/[0.04] hover:border-cyan-500/20 transition-colors duration-300">
                                        <Code2 className="text-cyan-400" size={18} />
                                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.15em] text-center">Full-Stack Dev</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Photo */}
                            <div className="hidden md:flex justify-center">
                                <div className="relative group/photo">
                                    {/* Glow */}
                                    <motion.div
                                        animate={{ opacity: [0.15, 0.25, 0.15] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="absolute inset-0 bg-emerald-500 rounded-3xl rotate-6 blur-2xl"
                                    />

                                    {/* Photo frame */}
                                    <div className="w-56 h-56 bg-[#060b13] rounded-3xl rotate-3 flex items-center justify-center relative overflow-hidden border border-white/5 group-hover/photo:rotate-0 transition-transform duration-700 shadow-2xl">
                                        <img
                                            src="/umut-can-salman.jpg"
                                            alt="Umut Can Salman"
                                            className="w-full h-full object-cover -rotate-3 scale-110 group-hover/photo:scale-100 group-hover/photo:rotate-0 transition-transform duration-700"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://ui-avatars.com/api/?name=Umut+Can+Salman&background=030712&color=10b981&size=512";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-60" />
                                        {/* Spinning border */}
                                        <div className="absolute inset-2 border border-emerald-500/10 rounded-2xl border-dashed animate-[spin_20s_linear_infinite] pointer-events-none" />
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-slate-950 text-[8px] font-black px-3 py-1.5 rounded-lg rotate-6 shadow-xl shadow-emerald-500/30">
                                        VERIFIED ✓
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 opacity-60" />
                    </div>
                </motion.section>

                {/* ─── FOOTER ─── */}
                <footer className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="text-[10px] font-black text-white tracking-[0.4em] uppercase mb-2">
                            © 2025–2026 EDU-GAMIFICATION ENGINE
                        </div>
                        <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em]">
                            Eğitim Bir Görev Değil,{" "}
                            <span className="text-emerald-500">Bir Deneyimdir.</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                                    className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                                />
                            ))}
                        </div>
                        <span className="text-[9px] text-slate-600 font-black tracking-[0.25em] uppercase">
                            System: <span className="text-emerald-500">Optimal</span>
                        </span>
                    </div>
                </footer>

            </div>
        </div>
    );
}