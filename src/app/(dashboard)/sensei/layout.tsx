'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/data/store';
import { 
  GraduationCap, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  Users, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function SenseiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, switchUser, profiles } = useAppStore();

  const isSensei = currentUser.role === 'sensei';

  return (
    <div className="space-y-6">
      {/* Role Notice & Switch Banner if not logged as Sensei */}
      {!isSensei && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Mode Tinjauan Guru (Sensei RBAC):</span> Anda saat ini aktif sebagai profil siswa ({currentUser.full_name}). Untuk menguji hak akses penuh Sensei, silakan beralih akun.
            </div>
          </div>
          <button
            onClick={() => {
              const sensei = profiles.find((p) => p.role === 'sensei');
              if (sensei) switchUser(sensei.id);
            }}
            className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-xl whitespace-nowrap"
          >
            Aktifkan Peran Sensei Nurul
          </button>
        </div>
      )}

      {/* Sensei Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-sumi-border pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 rounded-2xl bg-crimson-tint text-crimson flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-sumi">
                Portal Pembina Olimpiade
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-crimson-tint text-crimson">
                MAN 1 Pasuruan
              </span>
            </div>
            <p className="text-xs text-sumi-charcoal">
              Monitoring 6 Cabang Lomba & Manajemen Bank Materi
            </p>
          </div>
        </div>

        {/* Tab Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/sensei"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              pathname === '/sensei'
                ? 'bg-crimson text-white shadow-sm'
                : 'bg-white hover:bg-sumi-light text-sumi-charcoal border border-sumi-border'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Matriks Monitoring</span>
          </Link>
          <Link
            href="/sensei/kelola-paket"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              pathname.startsWith('/sensei/manajemen') || pathname.startsWith('/sensei/kelola-paket')
                ? 'bg-crimson text-white shadow-sm'
                : 'bg-white hover:bg-sumi-light text-sumi-charcoal border border-sumi-border'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Kelola Paket & Soal</span>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
