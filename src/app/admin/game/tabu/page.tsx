"use client";

import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
// Breadcrumb bileşenini import ediyoruz
import AdminBreadcrumb from "../../components/AdminBreadcrumb";

const LESSONS = [
    { slug: "tabu_turkce", title: "Türkçe" },
    { slug: "tabu_matematik", title: "Matematik" },
    { slug: "tabu_fizik", title: "Fizik" },
    { slug: "tabu_kimya", title: "Kimya" },
];

export default function TabuPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-5xl mx-auto">

                {/* --- BREADCRUMB BURAYA EKLENDİ --- */}
                <AdminBreadcrumb currentPage="TABU DERS SEÇİMİ" />

                <div className="mb-10 mt-6">
                    <h1 className="text-3xl font-black uppercase italic flex items-center gap-2">
                        <BookOpen className="text-emerald-500" />
                        Tabu Dersleri
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Düzenlemek istediğin dersi seç
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LESSONS.map(lesson => (
                        <button
                            key={lesson.slug}
                            onClick={() =>
                                router.push(`/admin/game/tabu/${lesson.slug}`)
                            }
                            className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left"
                        >
                            <h2 className="text-xl font-black uppercase italic">
                                {lesson.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {lesson.slug}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}