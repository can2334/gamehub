"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };
        const handleScroll = () => setScrolled(window.scrollY > 20);

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const menuItems = [
        { label: "Anasayfa", href: "/" },
        { label: "Oyunlar", href: "/games" },
        { label: "Hakkımızda", href: "/about" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full flex justify-between items-center px-8 md:px-16 py-5 sticky top-0 z-50 transition-all duration-500 ${scrolled
                    ? "bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.04]"
                    : "bg-transparent"
                    }`}
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                        <motion.div
                            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-emerald-500"
                        />
                    </div>
                    <span className="text-sm font-black tracking-[0.25em] text-white uppercase">
                        BILIŞIM<span className="text-emerald-400">_</span>ARENA
                    </span>
                </Link>

                {/* PC NAV */}
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group hover:text-emerald-400 transition-colors duration-300"
                        >
                            {item.label}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-500 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </nav>

                {/* PC CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="group relative px-6 py-2.5 rounded-xl font-black text-[11px] tracking-[0.2em] uppercase text-slate-950 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                        <span className="relative flex items-center gap-2">
                            Giriş Yap
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                    </Link>
                </div>

                {/* MOBİL BUTON */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden relative p-2.5 rounded-xl border border-white/5 bg-white/[0.03] text-emerald-400 hover:border-emerald-500/30 transition-colors duration-300"
                >
                    <Menu size={20} />
                </button>
            </motion.header>

            {/* MOBİL SIDEBAR */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-[#030712]/95 backdrop-blur-md z-[60] md:hidden"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] z-[70] md:hidden flex flex-col"
                            style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                background: "#060b13",
                                borderLeft: "1px solid rgba(255,255,255,0.04)",
                            }}
                        >
                            {/* Grid overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)`,
                                    backgroundSize: "40px 40px",
                                }}
                            />

                            <div className="relative z-10 flex flex-col h-full p-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-12">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        <span className="text-[10px] font-black tracking-[0.35em] text-slate-600 uppercase">
                                            Navigasyon
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-2 rounded-xl border border-white/5 bg-white/[0.03] text-slate-500 hover:text-white hover:border-white/10 transition-all duration-300"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Menu items */}
                                <nav className="flex flex-col gap-2 flex-1">
                                    {menuItems.map((item, i) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className="group flex items-center justify-between p-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] transition-all duration-300"
                                            >
                                                <span className="text-sm font-bold text-slate-400 group-hover:text-white tracking-[0.1em] uppercase transition-colors duration-300">
                                                    {item.label}
                                                </span>
                                                <ArrowRight size={14} className="text-slate-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Bottom CTA */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <div className="h-px bg-white/[0.04] mb-6" />
                                    <Link
                                        href="/admin"
                                        onClick={() => setSidebarOpen(false)}
                                        className="group relative flex items-center justify-center gap-3 p-4 rounded-2xl overflow-hidden font-black text-sm tracking-[0.2em] uppercase text-slate-950"
                                    >
                                        <div className="absolute inset-0 bg-emerald-400 group-hover:bg-emerald-300 transition-colors duration-300" />
                                        <span className="relative flex items-center gap-2">
                                            Giriş Yap
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                    </Link>
                                    <p className="text-center text-[9px] text-slate-700 tracking-[0.3em] uppercase mt-4">
                                        BILIŞIM_ARENA v3.0
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}