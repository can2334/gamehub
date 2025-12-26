"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bug, Database, Code2, Zap, ArrowRight, ShieldCheck, Trophy as TrophyIcon, Users, Terminal } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden relative">

      {/* ARKA PLAN EFEKTİ (About sayfasındaki Ambient Light dokusu) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[20%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      {/* NAVBAR / STATUS BAR */}
      <nav className="relative z-50 flex justify-center pt-8 px-6">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-6 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]"
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-black tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-1.5 h-px bg-slate-700"></span>
            System Status: <span className="text-emerald-400">Optimal</span>
          </span>
        </motion.div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8"
        >
          <Zap size={14} className="animate-pulse" /> V3.0 ENGINE YAYINLANDI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-[900] tracking-tight text-white mb-8 leading-[0.9]"
        >
          Kodla, Çöz, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            Hükmet.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed mb-12"
        >
          Sıkıcı ders kitaplarını unut. Bilişim dünyasının kapılarını
          <span className="text-white font-medium"> gerçek zamanlı simülasyonlar </span>
          ve rekabetçi görevlerle arala.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/games"
            className="group relative px-10 py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
          >
            SİSTEME GİR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-10 py-5 rounded-2xl bg-slate-900/50 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-all backdrop-blur-md"
          >
            Nasıl Çalışır?
          </Link>
        </motion.div>
      </section>

      {/* STATS (About sayfasındaki o kurumsal ama modern hava) */}
      <section className="relative z-10 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-32 opacity-70 hover:opacity-100 transition-opacity">
          <Stat icon={<ShieldCheck className="text-emerald-500" />} count="GÜVENLİ" text="ALTYAPI" />
          <Stat icon={<Users className="text-cyan-500" />} count="500+" text="ÖĞRENCİ" />
          <Stat icon={<TrophyIcon className="text-blue-500" />} count="120" text="TURNUVA" />
        </div>
      </section>

      {/* ÖZELLİKLER (About sayfasındaki FeatureCard yapısıyla uyumlu) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Terminal className="text-emerald-400" size={28} />}
          title="Terminal Erişimi"
          desc="Tarayıcı üzerinden doğrudan Linux çekirdeği ile etkileşime geçin."
          accent="emerald"
        />
        <FeatureCard
          icon={<Database className="text-cyan-400" size={28} />}
          title="SQL Injection"
          desc="Veritabanı açıklarını bulma ve güvene alma senaryoları."
          accent="cyan"
        />
        <FeatureCard
          icon={<Bug className="text-blue-400" size={28} />}
          title="Zafiyet Analizi"
          desc="Gerçek sistemler üzerinde bug bounty pratikleri yapın."
          accent="blue"
        />
      </section>

      <footer className="relative z-10 py-12 border-t border-slate-900 text-center bg-[#020617]/80 backdrop-blur-md">
        <p className="text-slate-600 font-mono text-xs tracking-[0.4em] uppercase">
          SYSTEM_LOG: BILIŞIM ARENA // BU BIR EĞITIM DEVRIMIDIR.
        </p>
      </footer>
    </main>
  );
}

// BİLEŞENLER
function Stat({ icon, count, text }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50 transition-colors">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-white font-black text-xl tracking-tight">{count}</span>
        <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">{text}</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent }: any) {
  const accents: any = {
    emerald: "hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]",
    cyan: "hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    blue: "hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]",
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 transition-all duration-500 group ${accents[accent]}`}
    >
      <div className="mb-8 p-4 w-fit rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{desc}"</p>
      <div className="h-1 w-12 bg-slate-800 rounded-full group-hover:w-full transition-all duration-700 opacity-30" />
    </motion.div>
  );
}