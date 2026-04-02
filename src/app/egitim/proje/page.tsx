"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2, ArrowLeft, ArrowRight, CheckCircle2,
    ChevronRight, FileCode, Palette, Zap, Globe,
} from "lucide-react";

const adimlar = [
    {
        no: 1,
        icon: FileCode,
        baslik: "Dosya Yapısını Kur",
        sure: "10 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Her web projesi 3 temel dosyadan oluşur. HTML içeriği, CSS görünümü, JavaScript davranışı kontrol eder.",
            },
            {
                tip: "adim",
                deger: "VS Code'da 'ilk-projem' klasörünü aç",
            },
            {
                tip: "adim",
                deger: "Yeni dosya oluştur: index.html",
            },
            {
                tip: "adim",
                deger: "Yeni dosya oluştur: style.css",
            },
            {
                tip: "adim",
                deger: "Yeni dosya oluştur: script.js",
            },
            {
                tip: "bilgi",
                deger: "index.html özel bir isimdir — tarayıcı bir klasörü açtığında ilk bu dosyayı arar.",
            },
        ],
    },
    {
        no: 2,
        icon: FileCode,
        baslik: "HTML'i Yaz",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "HTML, sayfanın iskeletidir. Etiketler (tags) ile içeriği tanımlarsın.",
            },
            {
                tip: "adim",
                deger: "index.html dosyasını aç, '!' yazıp Tab'a bas → VS Code otomatik şablon oluşturur",
            },
            {
                tip: "kod",
                deger: `<!DOCTYPE html>\n<html lang="tr">\n<head>\n  <meta charset="UTF-8">\n  <title>İlk Projem</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n\n  <h1>Merhaba Dünya!</h1>\n  <p>Bu benim ilk web sitem.</p>\n  <button id="buton">Tıkla!</button>\n\n  <script src="script.js"></script>\n</body>\n</html>`,
            },
            {
                tip: "bilgi",
                deger: "<link> CSS'i, <script> JS'i sayfaya bağlar. Sıraya dikkat et — script body'nin sonunda olmalı!",
            },
        ],
    },
    {
        no: 3,
        icon: Palette,
        baslik: "CSS ile Stil Ver",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "CSS, sayfanın görünümünü belirler. Renk, yazı tipi, boyut, konum — hepsi CSS ile yapılır.",
            },
            {
                tip: "kod",
                deger: `body {\n  background-color: #0f172a;\n  color: #e2e8f0;\n  font-family: Arial, sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 40px;\n}\n\nh1 {\n  font-size: 2.5rem;\n  color: #34d399;\n}\n\n#buton {\n  margin-top: 20px;\n  padding: 12px 32px;\n  background-color: #10b981;\n  color: #000;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  cursor: pointer;\n}\n\n#buton:hover {\n  background-color: #34d399;\n}`,
            },
            {
                tip: "adim",
                deger: "VS Code Extensions'tan 'Live Server' kur",
            },
            {
                tip: "adim",
                deger: "index.html'e sağ tıkla → 'Open with Live Server'",
            },
            {
                tip: "bilgi",
                deger: "Live Server, dosyayı kaydettiğinde tarayıcıyı otomatik yeniler. Çok kullanışlı!",
            },
        ],
    },
    {
        no: 4,
        icon: Zap,
        baslik: "JavaScript ile Hayat Ver",
        sure: "20 dk",
        icerik: [
            {
                tip: "metin",
                deger: "JavaScript, sayfayı interaktif yapar. Butona tıklanınca ne olsun? Bunu JS belirler.",
            },
            {
                tip: "kod",
                deger: `// Butonu bul\nconst buton = document.getElementById("buton");\n\n// Butona tıklanınca çalışacak fonksiyon\nbuton.addEventListener("click", function() {\n  alert("Merhaba! JavaScript çalışıyor 🎉");\n});`,
            },
            {
                tip: "bilgi",
                deger: "document.getElementById() — HTML'deki bir elementi id'siyle bulur.",
            },
            {
                tip: "adim",
                deger: "Biraz daha geliştirelim — sayaç yapıyoruz:",
            },
            {
                tip: "kod",
                deger: `let sayac = 0;\nconst buton = document.getElementById("buton");\nconst baslik = document.querySelector("h1");\n\nbuton.addEventListener("click", function() {\n  sayac++;\n  baslik.textContent = "Tıkladın: " + sayac + " kez!";\n});`,
            },
            {
                tip: "bilgi",
                deger: "textContent ile HTML elementinin içindeki yazıyı değiştirebilirsin. DOM Manipülasyonu budur!",
            },
        ],
    },
    {
        no: 5,
        icon: Globe,
        baslik: "Fetch API ile Veri Çek",
        sure: "15 dk",
        icerik: [
            {
                tip: "metin",
                deger: "Gerçek siteler internet üzerindeki API'lardan veri çeker. fetch() fonksiyonu bunu sağlar.",
            },
            {
                tip: "adim",
                deger: "HTML'e bir div ekle: <div id='veri'></div>",
            },
            {
                tip: "kod",
                deger: `// Ücretsiz bir test API'sı\nfetch("https://jsonplaceholder.typicode.com/posts/1")\n  .then(function(cevap) {\n    return cevap.json();\n  })\n  .then(function(veri) {\n    const div = document.getElementById("veri");\n    div.textContent = veri.title;\n  })\n  .catch(function(hata) {\n    console.log("Hata:", hata);\n  });`,
            },
            {
                tip: "bilgi",
                deger: "fetch() internetten veri çeker. .then() veriler gelince ne yapılacağını söyler. .catch() hata olursa devreye girer.",
            },
            {
                tip: "adim",
                deger: "Sayfayı aç, F12 → Console sekmesine bak — hatalar orada görünür",
            },
        ],
    },
];

export default function ProjePage() {
    const [aktif, setAktif] = useState(0);
    const [tamamlanan, setTamamlanan] = useState<number[]>([]);

    const mevcutAdim = adimlar[aktif];
    const Icon = mevcutAdim.icon;

    function tamamla() {
        if (!tamamlanan.includes(aktif)) {
            setTamamlanan([...tamamlanan, aktif]);
        }
        if (aktif < adimlar.length - 1) setAktif(aktif + 1);
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden">

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] right-0 w-[50%] h-[50%] bg-cyan-500/5 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 -left-[10%] w-[40%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                <div className="flex items-center justify-between mb-12">
                    <Link href="/egitim" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Eğitime Dön
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                        <Code2 size={13} />
                        BÖLÜM 02 — İLK PROJE
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-[900] text-white tracking-tight mb-3">
                        HTML · CSS · JavaScript
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Dosya yapısından fetch API'ye, gerçek bir web sayfası yap.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">

                    {/* Sol */}
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
                    ${secili ? "bg-cyan-500/10 border-cyan-500/40 text-white" : "bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"}`}
                                >
                                    <div className={`p-2 rounded-xl flex-shrink-0 ${secili ? "bg-cyan-500/20" : "bg-slate-800"}`}>
                                        {tamamlandi
                                            ? <CheckCircle2 size={18} className="text-cyan-400" />
                                            : <AdimIcon size={18} className={secili ? "text-cyan-400" : "text-slate-500"} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Adım {adim.no}</p>
                                        <p className={`text-sm font-bold ${secili ? "text-white" : ""}`}>{adim.baslik}</p>
                                    </div>
                                    {secili && <ChevronRight size={16} className="ml-auto text-cyan-400" />}
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
                                    className="h-full bg-cyan-500 rounded-full"
                                    animate={{ width: `${(tamamlanan.length / adimlar.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sağ */}
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
                                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                    <Icon size={24} className="text-cyan-400" />
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
                                    if (blok.tip === "metin") return (
                                        <p key={i} className="text-slate-400 leading-relaxed">{blok.deger}</p>
                                    );
                                    if (blok.tip === "adim") return (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40">
                                            <div className="w-5 h-5 rounded-full border border-cyan-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            </div>
                                            <span className="text-slate-300 text-sm">{blok.deger}</span>
                                        </div>
                                    );
                                    if (blok.tip === "kod") return (
                                        <div key={i} className="rounded-xl bg-[#020617] border border-slate-700/50 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/50">
                                                <div className="flex gap-1.5">
                                                    {[0, 1, 2].map(j => <div key={j} className="w-2.5 h-2.5 rounded-full bg-slate-700" />)}
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono">kod</span>
                                            </div>
                                            <pre className="px-4 py-3 text-sm text-cyan-400 font-mono overflow-x-auto whitespace-pre-wrap">{blok.deger}</pre>
                                        </div>
                                    );
                                    if (blok.tip === "bilgi") return (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                            <Zap size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-cyan-300 text-sm">{blok.deger}</p>
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
                                        href="/egitim/deploy"
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                    >
                                        Bölüm 3&apos;e Geç <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={tamamla}
                                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition-all"
                                    >
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