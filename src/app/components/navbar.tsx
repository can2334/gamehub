"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Terminal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // PC'ye geçince sidebar'ı otomatik kapatma (GÜVENLİK KİLİDİ)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems = [
        { label: "Anasayfa", href: "/" },
        { label: "Kütüphane", href: "/games" },
    ];

    return (
        <>
            <header className="w-full flex justify-between items-center px-6 py-4 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-slate-950/80">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                        <Terminal className="text-slate-950 w-6 h-6" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white uppercase">
                        BİLİŞİM<span className="text-emerald-400">ARENA</span>
                    </span>
                </Link>

                {/* --- PC MENÜ (md:flex sayesinde sadece PC'de) --- */}
                <nav className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            {item.label}
                        </Link>
                    ))}
                    <Link href="/admin" className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                        Giriş Yap
                    </Link>
                </nav>

                {/* --- MOBİL BUTON (md:hidden sayesinde PC'de görünmez) --- */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400"
                >
                    <Menu size={24} />
                </button>


            </header>

            {/* --- MOBİL SIDEBAR --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] md:hidden"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px]
                   bg-slate-950 border-l border-white/10 z-[70]
                   p-6 flex flex-col md:hidden"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-xs font-black text-slate-500 tracking-widest uppercase">
                                    MENÜ
                                </span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-3">
                                {menuItems.map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className="p-4 bg-slate-900/50 rounded-2xl text-white font-bold border border-white/5"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/admin"
                                    onClick={() => setSidebarOpen(false)}
                                    className="mt-6 p-5 bg-emerald-500 rounded-2xl text-slate-950
                       font-black text-center uppercase shadow-lg"
                                >
                                    GİRİŞ YAP
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </>
    );
}