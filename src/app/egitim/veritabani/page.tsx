"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Database, ArrowLeft, CheckCircle2,
    ChevronRight, Zap, Table2, Plug, Trophy,
} from "lucide-react";

const adimlar = [
    {
        no: 1,
        icon: Database,
        baslik: "Cloudflare D1 Oluştur",
        sure: "10 dk",
        icerik: [
            {
                tip: "metin",
                deger: "D1, Cloudflare'in SQLite tabanlı veritabanıdır. Workers ile entegre çalışır ve ücretsizdir.",
            },
            {
                tip: "adim",
                deger: "ilk-api klasöründe terminal aç",
            },
            {
                tip: "adim",
                deger: "D1 veritabanı oluştur:",
            },
            {
                tip: "kod",
                deger: "wrangler d1 create ilk-veritabanim",
            },
            {
                tip: "adim",
                deger: "Komut sana bir database_id verecek — kopyala",
            },
            {
                tip: "adim",
                deger: "wrangler.toml dosyasına ekle:",
            },
            {
                tip: "kod",
                deger: `[[d1_databases]]\nbinding = "DB"\ndatabase_name = "ilk-veritabanim"\ndatabase_id = "buraya-kopyaladigin-id"`,
            },
            {
                tip: "bilgi",
                deger: "binding = 'DB' demek, kodda env.DB yazarak bu veritabanına erişebilirsin demek.",
            },
        ],
    },
    {
        no: 2,
        icon: Table2,
        baslik: "SQL ile Tablo Yaz",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "SQL (Structured Query Language), veritabanıyla konuştuğun dildir. Tablo oluşturma, veri ekleme ve çekme için kullanırsın.",
            },
            {
                tip: "adim",
                deger: "schema.sql adında yeni dosya oluştur:",
            },
            {
                tip: "kod",
                deger: `-- Kullanıcı tablosu oluştur\nCREATE TABLE IF NOT EXISTS kullanicilar (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  ad TEXT NOT NULL,\n  skor INTEGER DEFAULT 0,\n  tarih TEXT DEFAULT (datetime('now'))\n);\n\n-- Test verisi ekle\nINSERT INTO kullanicilar (ad, skor) VALUES\n  ('Ahmet', 150),\n  ('Ayşe', 230),\n  ('Mehmet', 180);`,
            },
            {
                tip: "adim",
                deger: "Tabloyu veritabanına uygula:",
            },
            {
                tip: "kod",
                deger: "wrangler d1 execute ilk-veritabanim --file=./schema.sql",
            },
            {
                tip: "adim",
                deger: "Veriyi kontrol et:",
            },
            {
                tip: "kod",
                deger: `wrangler d1 execute ilk-veritabanim --command="SELECT * FROM kullanicilar"`,
            },
            {
                tip: "bilgi",
                deger: "-- ile başlayan satırlar yorumdur, çalıştırılmaz. Kodunu açıklamak için kullan!",
            },
        ],
    },
    {
        no: 3,
        icon: Plug,
        baslik: "Workers'tan Veri Çek / Yaz",
        sure: "20 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Artık API üzerinden veritabanını okuyup yazabiliriz.",
            },
            {
                tip: "adim",
                deger: "src/index.js dosyasını tamamen şununla değiştir:",
            },
            {
                tip: "kod",
                deger: `export default {\n  async fetch(request, env) {\n    const url = new URL(request.url);\n\n    // CORS — her yerden erişime izin ver\n    const headers = {\n      "Content-Type": "application/json",\n      "Access-Control-Allow-Origin": "*",\n    };\n\n    // GET /api/kullanicilar — hepsini listele\n    if (url.pathname === "/api/kullanicilar" && request.method === "GET") {\n      const { results } = await env.DB\n        .prepare("SELECT * FROM kullanicilar ORDER BY skor DESC")\n        .all();\n      return Response.json(results, { headers });\n    }\n\n    // POST /api/kullanicilar — yeni ekle\n    if (url.pathname === "/api/kullanicilar" && request.method === "POST") {\n      const body = await request.json();\n      await env.DB\n        .prepare("INSERT INTO kullanicilar (ad, skor) VALUES (?, ?)")\n        .bind(body.ad, body.skor)\n        .run();\n      return Response.json({ basarili: true }, { headers });\n    }\n\n    return new Response("404", { status: 404 });\n  },\n};`,
            },
            {
                tip: "adim",
                deger: "Yerelde test et: wrangler dev",
            },
            {
                tip: "bilgi",
                deger: "? işaretleri SQL injection'ı önler. Kullanıcıdan gelen veriyi asla direkt SQL'e yazma!",
            },
        ],
    },
    {
        no: 4,
        icon: Trophy,
        baslik: "Frontend'e Tam Entegrasyon",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Son adım: frontend'den API'yi çağırıp veritabanındaki veriyi gösteriyoruz.",
            },
            {
                tip: "adim",
                deger: "Önce API'yi deploy et:",
            },
            {
                tip: "kod",
                deger: "wrangler deploy",
            },
            {
                tip: "adim",
                deger: "Frontend script.js'i şununla güncelle:",
            },
            {
                tip: "kod",
                deger: `const API = "https://ilk-api.kullaniciadin.workers.dev";\n\n// Skor tablosunu çek ve göster\nasync function skorlariGoster() {\n  const cevap = await fetch(API + "/api/kullanicilar");\n  const kullanicilar = await cevap.json();\n\n  const liste = document.getElementById("liste");\n  liste.innerHTML = kullanicilar\n    .map((k, i) => \`\n      <div class="satir">\n        <span>#\${i + 1} \${k.ad}</span>\n        <span>\${k.skor} puan</span>\n      </div>\n    \`)\n    .join("");\n}\n\nskorlariGoster();`,
            },
            {
                tip: "adim",
                deger: "index.html'e <div id='liste'></div> ekle ve git push yap",
            },
            {
                tip: "bilgi",
                deger: "Tebrikler! Frontend + Cloudflare Workers API + D1 Veritabanı — tam stack bir web uygulaması yaptın! 🚀",
            },
        ],
    },
];

export default function VeritabaniPage() {
    const [aktif, setAktif] = useState(0);
    const [tamamlanan, setTamamlanan] = useState<number[]>([]);
    const bitti = tamamlanan.length === adimlar.length;

    const mevcutAdim = adimlar[aktif];
    const Icon = mevcutAdim.icon;

    function tamamla() {
        if (!tamamlanan.includes(aktif)) setTamamlanan([...tamamlanan, aktif]);
        if (aktif < adimlar.length - 1) setAktif(aktif + 1);
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] right-[10%] w-[50%] h-[50%] bg-violet-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-purple-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                <div className="flex items-center justify-between mb-12">
                    <Link href="/egitim" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Eğitime Dön
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold">
                        <Database size={13} />
                        BÖLÜM 04 — VERİTABANI
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-[900] text-white tracking-tight mb-3">
                        Cloudflare D1 · SQL
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Veritabanı kur, SQL yaz, API'ya bağla, frontend'den göster.
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
                    ${secili ? "bg-violet-500/10 border-violet-500/40 text-white" : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"}`}
                                >
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${secili ? "bg-violet-500/20" : "bg-slate-800"}`}>
                                        {tamamlandi
                                            ? <CheckCircle2 size={18} className="text-violet-400" />
                                            : <AdimIcon size={18} className={secili ? "text-violet-400" : "text-slate-500"} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Adım {adim.no}</p>
                                        <p className={`text-sm font-bold ${secili ? "text-white" : ""}`}>{adim.baslik}</p>
                                    </div>
                                    {secili && <ChevronRight size={16} className="ml-auto text-violet-400" />}
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
                                    className="h-full bg-violet-500 rounded-full"
                                    animate={{ width: `${(tamamlanan.length / adimlar.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {bitti ? (
                            <motion.div
                                key="bitti"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-[2rem] bg-slate-900/40 border border-violet-500/30 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-6"
                            >
                                <div className="p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                                    <Trophy size={40} className="text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-2">Eğitimi Tamamladın! 🎉</h2>
                                    <p className="text-slate-400">
                                        GitHub, HTML/CSS/JS, Vercel, Cloudflare Workers ve D1 veritabanını öğrendin.
                                        Artık gerçek bir web uygulaması yapabilirsin.
                                    </p>
                                </div>
                                <Link
                                    href="/egitim"
                                    className="px-8 py-4 rounded-2xl bg-violet-500 text-white font-black hover:bg-violet-400 transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                                >
                                    Eğitime Dön
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={aktif}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                                className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                        <Icon size={24} className="text-violet-400" />
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
                                                <div className="w-5 h-5 rounded-full border border-violet-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
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
                                                <pre className="px-4 py-3 text-sm text-violet-400 font-mono overflow-x-auto whitespace-pre-wrap">{blok.deger}</pre>
                                            </div>
                                        );
                                        if (blok.tip === "bilgi") return (
                                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                                                <Zap size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-violet-300 text-sm">{blok.deger}</p>
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
                                    <button
                                        onClick={tamamla}
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 text-white font-black text-sm hover:bg-violet-400 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    >
                                        {aktif === adimlar.length - 1 ? "Bitir 🎉" : "Tamamladım"}
                                        <CheckCircle2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}