"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
            {/* LOGO ALANI */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <Terminal className="text-slate-950 w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                    BİLİŞİM<span className="text-emerald-400">ARENA</span>
                </span>
            </Link>

            {/* MENÜ LİNKLERİ */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <Link
                    href="/games"
                    className="hover:text-white transition-colors underline-offset-4 hover:underline"
                >
                    Kütüphane
                </Link>
                <Link
                    href="/admin"
                    className="bg-white/5 hover:bg-emerald-500 hover:text-slate-950 px-6 py-2 rounded-full border border-white/10 transition-all font-bold"
                >
                    Giriş Yap
                </Link>
            </div>
        </nav>
    );
}