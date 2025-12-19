"use client";

import Link from "next/link";
import { Bug, Database, Code2, Zap, ArrowRight, ShieldCheck, TrophyIcon, Users } from "lucide-react";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">

      {/* ARKA PLAN EFEKTİ (Ambient Light) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8 animate-fade-in">
          <Zap size={14} /> V3.0 ENGINE YAYINLANDI
        </div>

        <h1 className="text-6xl md:text-8xl font-[900] tracking-tight text-white mb-8">
          Kodla, Çöz, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            Hükmet.
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed mb-12">
          Sıkıcı ders kitaplarını unut. Bilişim dünyasının kapılarını
          <span className="text-white font-medium"> gerçek zamanlı simülasyonlar </span>
          ve rekabetçi görevlerle arala.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/games"
            className="group px-10 py-5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg hover:bg-emerald-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-2"
          >
            SİSTEME GİR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="px-10 py-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-all shadow-xl"
          >
            Nasıl Çalışır?
          </Link>
        </div>
      </section>

      {/* OKUL İSTATİSTİĞİ / TRUST BAR */}
      <section className="border-t border-slate-900 bg-slate-950/50 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-32 opacity-50 grayscale hover:grayscale-0 transition-all">
          <Stat icon={<ShieldCheck />} text="Güvenli Altyapı" />
          <Stat icon={<Users className="w-5 h-5" />} text="500+ Öğrenci" />
          <Stat icon={<Trophy className="w-5 h-5" />} text="120 Turnuva" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 font-mono text-sm tracking-widest">
          SYSTEM_LOG: BILIŞIM ARENA // BU BIR EĞITIM DEVRIMIDIR.
        </p>
      </footer>
    </main>
  );
}

// BİLEŞENLER
function FeatureCard({ icon, title, desc, status, accent, disabled }: any) {
  const themes: any = {
    emerald: "group-hover:border-emerald-500/50 group-hover:bg-emerald-500/[0.02]",
    cyan: "group-hover:border-cyan-500/50 group-hover:bg-cyan-500/[0.02]",
    blue: "group-hover:border-blue-500/50 group-hover:bg-blue-500/[0.02]",
  };

  return (
    <div className={`group relative p-8 rounded-[2rem] border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 ${disabled ? "opacity-50 cursor-not-allowed" : themes[accent]}`}>
      <div className="mb-6 p-4 w-fit rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8">{desc}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border ${disabled ? "border-slate-700 text-slate-600" : "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function Stat({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3 font-bold text-slate-400">
      {icon} <span>{text}</span>
    </div>
  );
}

function Trophy(props: any) {
  return <TrophyIcon {...props} />
}
