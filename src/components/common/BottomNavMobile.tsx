'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, TrendingUp, User } from 'lucide-react';
import { useAppStore } from '@/lib/data/store';

export const BottomNavMobile: React.FC = () => {
  const pathname = usePathname();
  const { currentUser } = useAppStore();

  const isSensei = currentUser.role === 'sensei';

  const navItems = isSensei
    ? [
        { label: 'Ringkasan', href: '/sensei', icon: Home, isActive: pathname === '/sensei' },
        { label: 'Kelola Modul', href: '/sensei/manajemen', icon: LayoutGrid, isActive: pathname.startsWith('/sensei/manajemen') },
        { label: 'Pantau Siswa', href: '/sensei#tabel-siswa', icon: TrendingUp, isActive: pathname.startsWith('/sensei/siswa') },
        { label: 'Profil Guru', href: '/sensei', icon: User, isActive: false },
      ]
    : [
        { label: 'Beranda', href: '/siswa', icon: Home, isActive: pathname === '/siswa' },
        { label: 'Ruang Lomba', href: '/siswa#katalog-lomba', icon: LayoutGrid, isActive: pathname.startsWith('/siswa/lomba') },
        { label: 'Progres', href: '/siswa/progres', icon: TrendingUp, isActive: pathname === '/siswa/progres' },
        { label: 'Profil', href: '/siswa/progres#profil', icon: User, isActive: false },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-sumi-border shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 flex items-center justify-around px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center touch-target transition-all active:scale-95"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-crimson' : 'text-[#9CA3AF]'
                  }`}
                />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-crimson" />
                )}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 transition-colors ${
                  active ? 'text-crimson font-bold' : 'text-[#9CA3AF]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
