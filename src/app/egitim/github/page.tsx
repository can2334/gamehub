"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Github, ArrowLeft, ArrowRight, CheckCircle2,
    Circle, ChevronRight, Terminal, GitBranch,
    UserPlus, FolderGit2, Upload,
} from "lucide-react";

// ─── Adımlar ───────────────────────────────────────────────
const adimlar = [
    {
        no: 1,
        icon: UserPlus,
        baslik: "GitHub'a Kayıt Ol",
        sure: "5 dk",
        icerik: [
            {
                tip: "metin",
                deger: "GitHub, kodlarını internette sakladığın ve başkalarıyla paylaşabildiğin bir platform. Önce bir hesap açman gerekiyor.",
            },
            {
                tip: "adim",
                deger: "github.com adresine git",
            },
            {
                tip: "adim",
                deger: "Sağ üstteki 'Sign up' butonuna tıkla",
            },
            {
                tip: "adim",
                deger: "E-posta, şifre ve kullanıcı adı gir",
            },
            {
                tip: "adim",
                deger: "E-postanı doğrula ve giriş yap",
            },
            {
                tip: "bilgi",
                deger: "Kullanıcı adın herkese görünür olacak — profesyonel bir isim seç!",
            },
        ],
    },
    {
        no: 2,
        icon: FolderGit2,
        baslik: "İlk Repo'yu Oluştur",
        sure: "5 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Repository (repo), projenin klasörü gibidir. Kodların, dosyaların ve geçmişin burada saklanır.",
            },
            {
                tip: "adim",
                deger: "Sağ üstteki '+' ikonuna tıkla → 'New repository'",
            },
            {
                tip: "adim",
                deger: "Repository name: 'ilk-projem' yaz",
            },
            {
                tip: "adim",
                deger: "'Public' seç (herkes görebilsin)",
            },
            {
                tip: "adim",
                deger: "'Add a README file' kutusunu işaretle",
            },
            {
                tip: "adim",
                deger: "'Create repository' butonuna bas",
            },
            {
                tip: "bilgi",
                deger: "README.md projenin tanıtım sayfasıdır. Her iyi repo'da bulunur.",
            },
        ],
    },
    {
        no: 3,
        icon: Terminal,
        baslik: "Git Kur, Terminale Bağla",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Git, kodlarının geçmişini tutan bir araç. GitHub'a yüklemek için önce bilgisayarına kurman gerekiyor.",
            },
            {
                tip: "adim",
                deger: "git-scm.com adresine gir ve Git'i indir + kur",
            },
            {
                tip: "adim",
                deger: "VS Code'u aç → Terminal → New Terminal",
            },
            {
                tip: "kod",
                deger: `git config --global user.name "Adın Soyadın"\ngit config --global user.email "email@gmail.com"`,
            },
            {
                tip: "adim",
                deger: "GitHub'da repo sayfana git → yeşil 'Code' butonu → HTTPS linkini kopyala",
            },
            {
                tip: "kod",
                deger: "git clone https://github.com/kullaniciadin/ilk-projem.git",
            },
            {
                tip: "adim",
                deger: "Terminal'de 'cd ilk-projem' yaz ve klasöre gir",
            },
            {
                tip: "bilgi",
                deger: "git clone komutu repo'yu bilgisayarına indirir. Artık o klasör GitHub ile bağlantılı!",
            },
        ],
    },
    {
        no: 4,
        icon: Upload,
        baslik: "İlk Commit + Push",
        sure: "10 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Commit, yaptığın değişiklikleri kaydetmek; push ise onları GitHub'a göndermek demek.",
            },
            {
                tip: "adim",
                deger: "VS Code'da klasörü aç, README.md dosyasına bir şeyler yaz",
            },
            {
                tip: "kod",
                deger: "git add .",
            },
            {
                tip: "aciklama",
                deger: "Tüm değişen dosyaları 'sahneye al' (stage)",
            },
            {
                tip: "kod",
                deger: `git commit -m "İlk commit"`,
            },
            {
                tip: "aciklama",
                deger: "Değişiklikleri bir mesajla kaydet",
            },
            {
                tip: "kod",
                deger: "git push",
            },
            {
                tip: "aciklama",
                deger: "GitHub'a gönder",
            },
            {
                tip: "bilgi",
                deger: "GitHub sayfanı yenile — değişiklikler orada görünüyor olmalı! 🎉",
            },
        ],
    },
];

// ─── Sayfa ───────────────────────────────────────────────────
export default function GithubPage() {
    const [aktif, setAktif] = useState(0);
    const [tamamlanan, setTamamlanan] = useState<number[]>([]);

    const mevcutAdim = adimlar[aktif];
    const Icon = mevcutAdim.icon;

    function tamamla() {
        if (!tamamlanan.includes(aktif)) {
            setTamamlanan([...tamamlanan, aktif]);
        }
        if (aktif < adimlar.length - 1) {
            setAktif(aktif + 1);
        }
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">

            {/* Arka plan */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-cyan-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* Üst nav */}
                <div className="flex items-center justify-between mb-12">
                    <Link
                        href="/egitim"
                        className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Eğitime Dön
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                        <Github size={13} />
                        BÖLÜM 01 — GİTHUB
                    </div>
                </div>

                {/* Başlık */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-[900] text-white tracking-tight mb-3">
                        GitHub'a Başlarken
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Hesap açmaktan ilk push'a kadar her şey burada.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">

                    {/* Sol — Adım listesi */}
                    <div className="space-y-3">
                        {adimlar.map((adim, i) => {
                            const AdimIcon = adim.icon;
                            const tamamlandi = tamamlanan.includes(i);
                            const secili = aktif === i;

                            return (
                                <button
                                    key={adim.no}
                                    onClick={() => setAktif(i)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-300
                    ${secili
                                            ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                                            : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${secili ? "bg-emerald-500/20" : "bg-slate-800"}`}>
                                        {tamamlandi
                                            ? <CheckCircle2 size={18} className="text-emerald-400" />
                                            : <AdimIcon size={18} className={secili ? "text-emerald-400" : "text-slate-500"} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Adım {adim.no}</p>
                                        <p className={`text-sm font-bold ${secili ? "text-white" : ""}`}>{adim.baslik}</p>
                                    </div>
                                    {secili && <ChevronRight size={16} className="ml-auto text-emerald-400" />}
                                </button>
                            );
                        })}

                        {/* İlerleme */}
                        <div className="mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                <span>İlerleme</span>
                                <span>{tamamlanan.length}/{adimlar.length}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500 rounded-full"
                                    animate={{ width: `${(tamamlanan.length / adimlar.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sağ — İçerik */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={aktif}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
                        >
                            {/* Kart başlığı */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Icon size={24} className="text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                                        Adım {mevcutAdim.no} · {mevcutAdim.sure}
                                    </p>
                                    <h2 className="text-xl font-black text-white">{mevcutAdim.baslik}</h2>
                                </div>
                            </div>

                            {/* İçerik blokları */}
                            <div className="space-y-3 mb-8">
                                {mevcutAdim.icerik.map((blok, i) => {
                                    if (blok.tip === "metin") {
                                        return (
                                            <p key={i} className="text-slate-400 leading-relaxed">
                                                {blok.deger}
                                            </p>
                                        );
                                    }
                                    if (blok.tip === "adim") {
                                        return (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40">
                                                <div className="w-5 h-5 rounded-full border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                </div>
                                                <span className="text-slate-300 text-sm">{blok.deger}</span>
                                            </div>
                                        );
                                    }
                                    if (blok.tip === "kod") {
                                        return (
                                            <div key={i} className="rounded-xl bg-[#020617] border border-slate-700/50 overflow-hidden">
                                                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50">
                                                    <div className="flex gap-1.5">
                                                        {[0, 1, 2].map(j => <div key={j} className="w-2.5 h-2.5 rounded-full bg-slate-700" />)}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-mono">terminal</span>
                                                </div>
                                                <pre className="px-4 py-3 text-sm text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                                    {blok.deger}
                                                </pre>
                                            </div>
                                        );
                                    }
                                    if (blok.tip === "aciklama") {
                                        return (
                                            <p key={i} className="text-xs text-slate-500 pl-4 -mt-1 font-mono">
                                                ↑ {blok.deger}
                                            </p>
                                        );
                                    }
                                    if (blok.tip === "bilgi") {
                                        return (
                                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                                <GitBranch size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-cyan-300 text-sm">{blok.deger}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Alt butonlar */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <button
                                    onClick={() => setAktif(Math.max(0, aktif - 1))}
                                    disabled={aktif === 0}
                                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeft size={16} /> Önceki
                                </button>

                                {aktif === adimlar.length - 1 ? (
                                    <Link
                                        href="/egitim/proje"
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    >
                                        Bölüm 2&apos;ye Geç
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={tamamla}
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    >
                                        Tamamladım
                                        <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}