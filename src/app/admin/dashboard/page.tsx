"use client";
import { useRouter } from "next/navigation";
import { Play, Settings, LayoutGrid } from "lucide-react";

export default function AdminMain() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-white p-10 flex flex-col items-center">
            <h1 className="text-4xl font-black italic mb-16 uppercase tracking-tighter text-emerald-500">
                OYUN YÖNETİM SİSTEMİ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* KIM 1024 GB ISTER KARTI */}
                <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-[3rem] hover:border-emerald-500 transition-all group">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6">
                        <LayoutGrid size={32} />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase mb-2">Kim 1024 GB İster?</h2>
                    <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-widest">Soru Yarışması Paneli</p>

                    <button
                        onClick={() => router.push("/admin/game/quiz")}
                        className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 group-hover:scale-105 transition-all"
                    >
                        <Settings size={20} /> DERSLERİ DÜZENLE
                    </button>
                </div>

                {/* Gelecekte ekleyeceğin başka bir oyun için yer tutucu */}
                <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 p-8 rounded-[3rem] flex items-center justify-center">
                    <p className="text-slate-700 font-black uppercase italic text-xl">Yakında...</p>
                </div>
            </div>
        </div>
    );
}