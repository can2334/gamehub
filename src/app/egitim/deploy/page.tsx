"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe, ArrowLeft, ArrowRight, CheckCircle2,
    ChevronRight, Zap, Cloud, Link2, Code2,
} from "lucide-react";

const adimlar = [
    {
        no: 1,
        icon: Link2,
        baslik: "Vercel'e GitHub Bağla",
        sure: "10 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Vercel, projenizi internete açan bir platformdur. GitHub repo'nuzu bağlarsınız, her push'ta otomatik yayınlanır.",
            },
            {
                tip: "adim",
                deger: "vercel.com adresine git → 'Continue with GitHub' ile giriş yap",
            },
            {
                tip: "adim",
                deger: "'Add New Project' → 'Import Git Repository'",
            },
            {
                tip: "adim",
                deger: "'ilk-projem' reposunu seç → 'Deploy' butonuna bas",
            },
            {
                tip: "adim",
                deger: "~30 saniye bekle — Vercel build ediyor",
            },
            {
                tip: "adim",
                deger: "Verilen URL'ye gir — sitenin internette canlı! 🎉",
            },
            {
                tip: "bilgi",
                deger: "Bundan sonra git push yaptığında Vercel otomatik günceller. CI/CD budur!",
            },
        ],
    },
    {
        no: 2,
        icon: Cloud,
        baslik: "Cloudflare Workers Hesabı",
        sure: "10 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Cloudflare Workers, dünyanın her yerinde çalışan sunucu kodlarıdır. API'nı buraya yazacaksın.",
            },
            {
                tip: "adim",
                deger: "dash.cloudflare.com → 'Sign Up' ile hesap aç",
            },
            {
                tip: "adim",
                deger: "Sol menüden 'Workers & Pages' → 'Create Application'",
            },
            {
                tip: "adim",
                deger: "Terminal'i aç, Wrangler CLI kur:",
            },
            {
                tip: "kod",
                deger: "npm install -g wrangler",
            },
            {
                tip: "adim",
                deger: "Cloudflare hesabınla bağlan:",
            },
            {
                tip: "kod",
                deger: "wrangler login",
            },
            {
                tip: "bilgi",
                deger: "Wrangler, Cloudflare'in komut satırı aracıdır. Workers'ı yerelde test edip yayınlamana yarar.",
            },
        ],
    },
    {
        no: 3,
        icon: Code2,
        baslik: "İlk API'yi Yaz",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Yeni bir Worker projesi oluşturup basit bir API yazıyoruz.",
            },
            {
                tip: "kod",
                deger: "npm create cloudflare@latest -- ilk-api\ncd ilk-api",
            },
            {
                tip: "adim",
                deger: "src/index.js dosyasını aç ve şunu yaz:",
            },
            {
                tip: "kod",
                deger: `export default {\n  async fetch(request, env) {\n    const url = new URL(request.url);\n\n    // /api/merhaba yoluna istek gelirse\n    if (url.pathname === "/api/merhaba") {\n      return Response.json({\n        mesaj: "Merhaba Dünya!",\n        zaman: new Date().toISOString(),\n      });\n    }\n\n    return new Response("Sayfa bulunamadı", { status: 404 });\n  },\n};`,
            },
            {
                tip: "adim",
                deger: "Yerelde test et:",
            },
            {
                tip: "kod",
                deger: "wrangler dev",
            },
            {
                tip: "adim",
                deger: "Tarayıcıda aç: http://localhost:8787/api/merhaba",
            },
            {
                tip: "bilgi",
                deger: "JSON cevabını görüyorsan API çalışıyor demektir!",
            },
        ],
    },
    {
        no: 4,
        icon: Globe,
        baslik: "Yayınla ve Frontend'e Bağla",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "API'yi canlıya alıp frontend'den çağırıyoruz.",
            },
            {
                tip: "adim",
                deger: "API'yi deploy et:",
            },
            {
                tip: "kod",
                deger: "wrangler deploy",
            },
            {
                tip: "adim",
                deger: "Cloudflare sana bir URL verir — kopyala (örn: ilk-api.kullaniciadi.workers.dev)",
            },
            {
                tip: "adim",
                deger: "Frontend'de script.js'e CORS sorunu için wrangler.toml'a ekle:",
            },
            {
                tip: "kod",
                deger: `// script.js — API'dan veri çek\nconst API_URL = "https://ilk-api.kullaniciadi.workers.dev";\n\nfetch(API_URL + "/api/merhaba")\n  .then(r => r.json())\n  .then(veri => {\n    document.getElementById("veri").textContent = veri.mesaj;\n  });`,
            },
            {
                tip: "bilgi",
                deger: "Artık frontend + backend + veritabanı olmadan tam bir web uygulamasın var! Bir sonraki bölümde veritabanını ekleyeceğiz.",
            },
        ],
    },
];

export default function DeployPage() {
    const [aktif, setAktif] = useState(0);
    const [tamamlanan, setTamamlanan] = useState<number[]>([]);

    const mevcutAdim = adimlar[aktif];
    const Icon = mevcutAdim.icon;

    function tamamla() {
        if (!tamamlanan.includes(aktif)) setTamamlanan([...tamamlanan, aktif]);
        if (aktif < adimlar.length - 1) setAktif(aktif + 1);
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] left-[20%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-indigo-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                <div className="flex items-center justify-between mb-12">
                    <Link href="/egitim" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Eğitime Dön
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                        <Globe size={13} />
                        BÖLÜM 03 — DEPLOY
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-[900] text-white tracking-tight mb-3">
                        Vercel · Cloudflare Workers
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Projeyi internete çıkar, kendi API'nı yaz ve yayınla.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">

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
                    ${secili ? "bg-blue-500/10 border-blue-500/40 text-white" : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"}`}
                                >
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${secili ? "bg-blue-500/20" : "bg-slate-800"}`}>
                                        {tamamlandi
                                            ? <CheckCircle2 size={18} className="text-blue-400" />
                                            : <AdimIcon size={18} className={secili ? "text-blue-400" : "text-slate-500"} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Adım {adim.no}</p>
                                        <p className={`text-sm font-bold ${secili ? "text-white" : ""}`}>{adim.baslik}</p>
                                    </div>
                                    {secili && <ChevronRight size={16} className="ml-auto text-blue-400" />}
                                </button>
                            );
                        })}

                        <div className="mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                <span>İlerleme</span>
                                <span>{tamamlanan.length}/{adimlar.length}</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500 rounded-full"
                                    animate={{ width: `${(tamamlanan.length / adimlar.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={aktif}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <Icon size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                                        Adım {mevcutAdim.no} · {mevcutAdim.sure}
                                    </p>
                                    <h2 className="text-xl font-black text-white">{mevcutAdim.baslik}</h2>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {mevcutAdim.icerik.map((blok, i) => {
                                    if (blok.tip === "metin") return <p key={i} className="text-slate-400 leading-relaxed">{blok.deger}</p>;
                                    if (blok.tip === "adim") return (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40">
                                            <div className="w-5 h-5 rounded-full border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            </div>
                                            <span className="text-slate-300 text-sm">{blok.deger}</span>
                                        </div>
                                    );
                                    if (blok.tip === "kod") return (
                                        <div key={i} className="rounded-xl bg-[#020617] border border-slate-700/50 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50">
                                                <div className="flex gap-1.5">{[0, 1, 2].map(j => <div key={j} className="w-2.5 h-2.5 rounded-full bg-slate-700" />)}</div>
                                                <span className="text-[10px] text-slate-500 font-mono">terminal / kod</span>
                                            </div>
                                            <pre className="px-4 py-3 text-sm text-blue-400 font-mono overflow-x-auto whitespace-pre-wrap">{blok.deger}</pre>
                                        </div>
                                    );
                                    if (blok.tip === "bilgi") return (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                                            <Zap size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-blue-300 text-sm">{blok.deger}</p>
                                        </div>
                                    );
                                    return null;
                                })}
                            </div>

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
                                        href="/egitim/veritabani"
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-black text-sm hover:bg-blue-400 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                    >
                                        Bölüm 4&apos;e Geç <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <button onClick={tamamla} className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-black text-sm hover:bg-blue-400 transition-all">
                                        Tamamladım <CheckCircle2 size={16} />
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