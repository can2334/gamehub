"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Bug, Database, Terminal, Zap, ArrowRight, ShieldCheck, Trophy as TrophyIcon, Users, Code2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── MOUSE GLOW CURSOR ─── */
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
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
    >
      <div className="w-full h-full rounded-full bg-emerald-500/5 blur-[80px]" />
    </motion.div>
  );
}

/* ─── GLITCHING TEXT ─── */
function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      {glitch && (
        <>
          <span className="absolute inset-0 text-red-400/70 translate-x-[2px] -translate-y-[1px] select-none">{text}</span>
          <span className="absolute inset-0 text-cyan-400/70 -translate-x-[2px] translate-y-[1px] select-none">{text}</span>
        </>
      )}
      <span className="relative">{text}</span>
    </span>
  );
}

/* ─── SCANNING LINE ─── */
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

/* ─── CORNER DECORATION ─── */
function Corner({ pos }: { pos: string }) {
  return (
    <div className={`absolute ${pos} w-6 h-6`}>
      <div className="w-full h-[1px] bg-emerald-500/60" />
      <div className="w-[1px] h-full bg-emerald-500/60" />
    </div>
  );
}

/* ─── STAT CARD ─── */
function Stat({ icon, count, text }: { icon: React.ReactNode; count: string; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative flex flex-col items-start gap-2 px-8 py-6 group"
    >
      <div className="absolute inset-0 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:border-emerald-500/30 transition-colors duration-500" />
      <div className="relative z-10 p-2.5 rounded-xl bg-slate-950/80 border border-white/5 mb-2">{icon}</div>
      <span className="relative z-10 font-black text-3xl text-white tracking-tight font-mono">{count}</span>
      <span className="relative z-10 text-[10px] text-slate-500 font-bold tracking-[0.25em] uppercase">{text}</span>
    </motion.div>
  );
}

/* ─── FEATURE CARD ─── */
function FeatureCard({
  icon, title, desc, tag, accent, delay
}: { icon: React.ReactNode; title: string; desc: string; tag: string; accent: string; delay: number }) {
  const colors: Record<string, { border: string; glow: string; tag: string; bar: string }> = {
    emerald: {
      border: "group-hover:border-emerald-500/40",
      glow: "group-hover:shadow-[0_0_60px_rgba(16,185,129,0.08)]",
      tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bar: "bg-emerald-500",
    },
    cyan: {
      border: "group-hover:border-cyan-500/40",
      glow: "group-hover:shadow-[0_0_60px_rgba(6,182,212,0.08)]",
      tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      bar: "bg-cyan-500",
    },
    blue: {
      border: "group-hover:border-blue-500/40",
      glow: "group-hover:shadow-[0_0_60px_rgba(59,130,246,0.08)]",
      tag: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      bar: "bg-blue-500",
    },
  };
  const c = colors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className={`group relative p-8 rounded-3xl bg-[#0a0f1a] border border-white/[0.04] transition-all duration-500 cursor-default overflow-hidden ${c.border} ${c.glow}`}
    >
      {/* Top left corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10 group-hover:border-white/30 transition-colors duration-500" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/10 group-hover:border-white/30 transition-colors duration-500" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
            {icon}
          </div>
          <span className={`text-[9px] font-black tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border ${c.tag}`}>
            {tag}
          </span>
        </div>

        <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed flex-1">{desc}</p>

        <div className="mt-8 flex items-center gap-3">
          <div className={`h-[2px] w-0 group-hover:w-full ${c.bar} transition-all duration-700 rounded-full opacity-60`} />
          <ArrowRight size={14} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── TERMINAL WINDOW ─── */
function TerminalWidget() {
  const lines = [
    { delay: 0, text: "$ nmap -sV 192.168.1.0/24", type: "cmd" },
    { delay: 0.8, text: "Scanning 256 hosts...", type: "info" },
    { delay: 1.6, text: "PORT     STATE  SERVICE", type: "header" },
    { delay: 2.2, text: "22/tcp   open   ssh", type: "success" },
    { delay: 2.6, text: "80/tcp   open   http", type: "success" },
    { delay: 3.0, text: "3306/tcp open   mysql  ← VULNERABLE", type: "danger" },
    { delay: 3.6, text: "$ exploit --target 3306 --payload shell", type: "cmd" },
    { delay: 4.4, text: "Shell established. Access granted.", type: "success" },
  ];

  const typeColors: Record<string, string> = {
    cmd: "text-emerald-400",
    info: "text-slate-500",
    header: "text-slate-400 font-bold",
    success: "text-cyan-400",
    danger: "text-red-400 font-bold",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#060b13] shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-xs text-slate-600 font-mono">bilisim-arena ~ bash</span>
      </div>

      <div className="p-6 font-mono text-sm space-y-1.5 min-h-[200px]">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay, duration: 0.3 }}
            className={typeColors[line.type]}
          >
            {line.text}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-emerald-400 ml-0.5 align-middle"
        />
      </div>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─── */
export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden relative" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>

      <CursorGlow />
      <ScanLine />
      <GridOverlay />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.07, 0.12, 0.07] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] bg-emerald-500 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.09, 0.05] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] bg-cyan-500 blur-[150px] rounded-full"
        />
      </div>
      {/* ─── HERO ─── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 pt-24 pb-40 px-8 md:px-16 flex flex-col items-center text-center max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-emerald-400 text-[10px] font-black mb-12 tracking-[0.25em] uppercase"
        >
          <Zap size={12} className="animate-pulse" />
          V3.0 Engine — Yeni Nesil Eğitim Motoru
          <span className="absolute -inset-px rounded-full border border-emerald-500/20" />
        </motion.div>

        {/* Heading */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,10vw,8rem)] font-black tracking-[-0.04em] text-white leading-[0.88]"
          >
            Kodla, Çöz,
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 3, delay: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.5rem,10vw,8rem)] font-black tracking-[-0.04em] leading-[0.88]"
          >
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                <GlitchText text="Hükmet." />
              </span>
              {/* Underline flare */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-3 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 origin-left rounded-full blur-[1px]"
              />
            </span>
          </motion.h1>
        </div>


        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/games"
            className="group relative px-10 py-4 rounded-xl overflow-hidden font-black text-sm tracking-[0.15em] uppercase text-slate-950 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-300 to-cyan-300" />
            <span className="relative flex items-center gap-3">
              Sisteme Gir
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
          </Link>

          <Link
            href="/about"
            className="group relative px-10 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase text-slate-400 hover:text-white transition-colors duration-300 border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm"
          >
            Nasıl Çalışır?
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] text-slate-700 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-slate-700 to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* ─── TERMINAL SECTION ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-4">// Live Environment</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-6">
              Gerçek terminal,<br />gerçek saldırılar.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Sanal makineler değil — tarayıcı üzerinde çalışan izole Linux ortamları.
              Gerçek araçlar, gerçek senaryolar, gerçek deneyim.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sessions
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Isolated Env
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Auto-Reset
              </div>
            </div>
          </motion.div>
          <TerminalWidget />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative z-10 border-y border-white/[0.04] bg-white/[0.01] py-16 px-8 md:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat icon={<ShieldCheck size={20} className="text-emerald-400" />} count="99.9%" text="Uptime Garantisi" />
          <Stat icon={<Users size={20} className="text-cyan-400" />} count="500+" text="Aktif Öğrenci" />
          <Stat icon={<TrophyIcon size={20} className="text-blue-400" />} count="120" text="Tamamlanan Turnuva" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-[10px] font-black tracking-[0.35em] text-emerald-500 uppercase mb-4">// Modüller</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Üç alan, sonsuz derinlik.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Terminal className="text-emerald-400" size={24} />}
            title="Terminal Erişimi"
            desc="Tarayıcı üzerinden doğrudan Linux çekirdeği ile etkileşime geçin. Gerçek bash, gerçek komutlar."
            tag="Temel"
            accent="emerald"
            delay={0}
          />
          <FeatureCard
            icon={<Database className="text-cyan-400" size={24} />}
            title="SQL Injection"
            desc="Veritabanı açıklarını bulma ve güvene alma senaryoları. Gerçek dünya saldırı vektörleri."
            tag="Orta"
            accent="cyan"
            delay={0.1}
          />
          <FeatureCard
            icon={<Bug className="text-blue-400" size={24} />}
            title="Zafiyet Analizi"
            desc="Gerçek sistemler üzerinde bug bounty pratikleri yapın. CVE tabanlı senaryolar."
            tag="İleri"
            accent="blue"
            delay={0.2}
          />
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="relative z-10 mx-8 md:mx-16 mb-32 rounded-3xl overflow-hidden border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }} />
        {/* Corner decorations */}
        <Corner pos="top-4 left-4" />
        <Corner pos="top-4 right-4 rotate-90" />
        <Corner pos="bottom-4 left-4 -rotate-90" />
        <Corner pos="bottom-4 right-4 rotate-180" />

        <div className="relative z-10 py-20 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Hazır mısın?</h2>
            <p className="text-slate-500 text-sm font-mono">Ücretsiz başla. Kredi kartı gerekmez.</p>
          </div>
          <Link
            href="/games"
            className="group relative shrink-0 px-10 py-4 rounded-xl font-black text-sm tracking-[0.15em] uppercase text-slate-950 overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
            <span className="relative flex items-center gap-3">
              Hemen Başla <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 py-10 border-t border-white/[0.04] px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-slate-700 font-mono tracking-[0.35em] uppercase">
          SYSTEM_LOG :: BILIŞIM_ARENA v3.0 // BUILD 2025
        </span>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-700 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          All systems operational
        </div>
      </footer>

    </main>
  );
}