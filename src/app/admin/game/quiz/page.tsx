"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Book, Calculator, Cpu } from "lucide-react";
// Breadcrumb bileşenini import ediyoruz
import AdminBreadcrumb from "../../components/AdminBreadcrumb";

const subjects = [
    { id: "matematik", name: "Matematik", icon: <Calculator />, color: "bg-orange-500" },
    { id: "fizik", name: "Fizik", icon: <Calculator />, color: "bg-orange-500" },
    { id: "bilisim", name: "Bilişim Teknolojileri", icon: <Cpu />, color: "bg-blue-500" },
    { id: "genel-kultur", name: "Genel Kültür", icon: <Book />, color: "bg-purple-500" }
];

export default function SubjectSelection() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-white p-10">
            <div className="max-w-6xl mx-auto">

                {/* --- BREADCRUMB BURAYA EKLENDİ --- */}
                <AdminBreadcrumb currentPage="QUIZ BRANŞ SEÇİMİ" />

                <div className="mt-8 mb-12">

                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">
                        QUIZ <span className="text-emerald-500">BRANŞLARI</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjects.map((sub) => (
                        <div
                            key={sub.id}
                            onClick={() => router.push(`/admin/game/quiz/${sub.id}`)}
                            className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem] cursor-pointer hover:border-emerald-500 transition-all text-center group relative overflow-hidden"
                        >
                            {/* Hover efektli arka plan ışığı */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${sub.color}`} />

                            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${sub.color} text-slate-950 shadow-lg shadow-black/50 transition-transform group-hover:scale-110`}>
                                {sub.icon}
                            </div>
                            <h2 className="text-2xl font-black uppercase italic relative z-10">{sub.name}</h2>
                            <p className="text-slate-600 mt-2 text-[10px] font-bold uppercase tracking-widest relative z-10">Soru Bankasını Yönet</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}