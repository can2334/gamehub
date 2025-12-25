import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
    currentPage: string; // Sayfa adını dışarıdan alacağız
}

const AdminBreadcrumb = ({ currentPage }: BreadcrumbProps) => {
    return (
        <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3 px-2">
            <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-all group bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-indigo-500/30"
            >
                <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                DASHBOARD
            </Link>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 italic bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">
                {currentPage}
            </span>
        </div>
    );
};

export default AdminBreadcrumb;