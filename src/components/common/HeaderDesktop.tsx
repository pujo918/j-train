'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  Sparkles, 
  Bell, 
  GraduationCap, 
  X,
  Calendar,
  Award,
  RefreshCw,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useAppStore } from '@/lib/data/store';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { QuickGuideModal } from '@/components/common/QuickGuideModal';

export const HeaderDesktop: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, profiles, switchUser, theme, toggleTheme } = useAppStore();
  const { isInstallable, installApp } = usePWAInstall();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMadingModalOpen, setIsMadingModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const isSenseiPath = pathname.startsWith('/sensei');

  return (
    <>
      <header className="yozakura-header sticky top-0 z-40 w-full bg-[#FCF9F2]/90 backdrop-blur-md border-b-2 border-[#B91C1C]/20 transition-all shadow-[0_4px_20px_rgba(17,24,39,0.06)] relative">
        {/* Clipped Decorative Washi Texture & Subtle Japanese Cloud Motif */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('/images/card-washi-pattern.jpg')] bg-cover bg-center opacity-50" />
          {/* Subtle Center Japanese Cloud (Kumo) Line Art */}
          <svg
            viewBox="0 0 220 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-14 text-[#C4A882]/45"
          >
            <path
              d="M28 24H92C98 24 102 20 102 15C102 10 98 6 92 6H64C59 6 55 10 55 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M12 36H148C155 36 160 31 160 25C160 19 155 14 148 14H122"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M52 46H188C194 46 198 42 198 37C198 32 194 28 188 28H154"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          {/* Thin Crimson Accent Top Hairline */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#B91C1C]/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Desktop Navbar (>=768px): 76px */}
          <div className="hidden md:flex h-20 items-center justify-between">
            {/* Left: Brand Wordmark & Slogan */}
            <div className="flex items-center gap-6">
              <Link href={currentUser.role === 'sensei' ? '/sensei' : '/siswa'} className="group flex items-center gap-4 focus:outline-none">
                {/* Logo Composition */}
                <div className="flex items-center">
                  <div className="text-[28px] font-black tracking-[-0.5px] text-[#B91C1C] flex items-center select-none">
                    <span>J-</span>
                    <span className="relative">
                      T
                      {/* Red rising sun circle between T and R */}
                      <span className="absolute -top-1.5 left-2.5 w-3.5 h-3.5 rounded-full bg-[#B91C1C] shadow-sm -z-0 group-hover:scale-110 transition-transform" />
                    </span>
                    <span className="relative z-10 text-[#B91C1C]">R</span>
                    <span>AI</span>
                    <span className="flex items-center gap-1.5">
                      N
                      {/* Black/Crimson Torii silhouette next to N */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline-block ml-0.5 text-sumi"
                      >
                        <path d="M2 5 C8 3 16 3 22 5 L22 7 C16 5 8 5 2 7 Z" fill="#111827" />
                        <rect x="4" y="8" width="16" height="2" fill="#111827" />
                        <rect x="6" y="10" width="2.5" height="12" fill="#111827" />
                        <rect x="15.5" y="10" width="2.5" height="12" fill="#111827" />
                        <rect x="4" y="13" width="16" height="2" fill="#111827" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Slogan 2 Baris as in mockup */}
                <div className="flex flex-col border-l border-sumi-border pl-4">
                  <span className="text-[12px] font-bold tracking-[0.5px] text-sumi uppercase leading-tight">
                    MENGGAPAI PRESTASI
                  </span>
                  <span className="text-[12px] font-bold tracking-[0.5px] text-sumi uppercase leading-tight mt-0.5">
                    BAHASA JEPANG
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: User Profile & Mading Madrasah link underneath */}
            <div className="flex items-center gap-5">
              {/* PWA Install Button if available */}
              {isInstallable && (
                <button
                  onClick={installApp}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-crimson rounded-xl hover:bg-crimson-dark transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pasang Aplikasi</span>
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full bg-[#F5EDE1]/90 dark:bg-white/10 hover:bg-crimson-tint/60 dark:hover:bg-white/20 border border-[#E2D6C5] dark:border-white/15 flex items-center justify-center text-sumi dark:text-amber-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                title={theme === 'dark' ? 'Pindah ke Mode Terang (Spring)' : 'Pindah ke Mode Gelap (Yozakura)'}
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4 text-sumi-charcoal" />
                )}
              </button>

              {/* Quick Guide Button */}
              <button
                type="button"
                onClick={() => setIsGuideModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-sumi hover:text-crimson bg-[#F5EDE1]/90 hover:bg-crimson-tint/60 border border-[#E2D6C5] rounded-full transition-all flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                title="Panduan Cepat Penggunaan J-TRAIN"
              >
                <HelpCircle className="w-3.5 h-3.5 text-crimson" />
                <span>Panduan</span>
              </button>

              {/* Fast Portal Switcher: Siswa / Sensei */}
              <div className="flex items-center bg-[#EFE6D8]/90 p-1 rounded-full border border-[#DFD3C3] text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                <button
                  onClick={() => {
                    const student = profiles.find(p => p.role === 'siswa');
                    if (student) switchUser(student.id);
                    router.push('/siswa');
                  }}
                  className={`px-3.5 py-1 rounded-full font-bold transition-all ${
                    !isSenseiPath
                      ? 'bg-white text-crimson shadow-sm'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  Siswa
                </button>
                <button
                  onClick={() => {
                    const sensei = profiles.find(p => p.role === 'sensei');
                    if (sensei) switchUser(sensei.id);
                    router.push('/sensei');
                  }}
                  className={`px-3.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                    isSenseiPath
                      ? 'bg-crimson text-white shadow-sm'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Sensei</span>
                </button>
              </div>

              {/* Profile Block with Mading Madrasah underneath (Matching Mockup exactly) */}
              <div className="flex flex-col items-end">
                {/* Top: Avatar Pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#B91C1C] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {currentUser.avatar_url || currentUser.full_name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-sumi">
                      {currentUser.full_name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-sumi-charcoal transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-sumi-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-sumi-border">
                        <p className="text-xs font-semibold text-sumi-muted">Masuk sebagai:</p>
                        <p className="text-sm font-bold text-sumi">{currentUser.full_name}</p>
                        <p className="text-xs text-sumi-charcoal">
                          {currentUser.role === 'sensei' ? `NIP: ${currentUser.nisn}` : `NISN: ${currentUser.nisn}`}
                        </p>
                      </div>

                      <div className="py-1">
                        <div className="px-4 py-1.5 text-[11px] font-bold text-sumi-muted uppercase tracking-wider">
                          Ganti Akun Demo:
                        </div>
                        {profiles.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              switchUser(p.id);
                              setIsProfileMenuOpen(false);
                              if (p.role === 'sensei') {
                                router.push('/sensei');
                              } else {
                                router.push('/siswa');
                              }
                            }}
                            className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-crimson-tint/30 transition-colors ${
                              p.id === currentUser.id ? 'font-bold text-crimson bg-crimson-subtle' : 'text-sumi'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-crimson-tint text-crimson text-[10px] font-bold flex items-center justify-center">
                                {p.avatar_url || p.full_name[0]}
                              </span>
                              <span>{p.full_name}</span>
                            </div>
                            <span className="text-[10px] text-sumi-muted capitalize">
                              {p.role}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-sumi-border pt-1">
                        <Link
                          href="/login"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-crimson hover:bg-crimson-tint/30 font-semibold"
                        >
                          Keluar / Halaman Login
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom: Subtle Link "MADING MADRASAH" */}
                <button
                  onClick={() => setIsMadingModalOpen(true)}
                  className="text-[11px] font-bold text-[#4B5563] hover:text-crimson uppercase tracking-[0.5px] mt-0.5 transition-colors"
                >
                  MADING MADRASAH
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar (<768px): 56px */}
          <div className="flex md:hidden h-14 items-center justify-between gap-2">
            <Link href={currentUser.role === 'sensei' ? '/sensei' : '/siswa'} className="flex items-center gap-1 shrink-0">
              <span className="text-lg font-black tracking-tight text-[#B91C1C] whitespace-nowrap">J-TRAIN</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block text-sumi shrink-0"
              >
                <path d="M2 5 C8 3 16 3 22 5 L22 7 C16 5 8 5 2 7 Z" fill="#111827" />
                <rect x="4" y="8" width="16" height="2" fill="#111827" />
                <rect x="6" y="10" width="2.5" height="12" fill="#111827" />
                <rect x="15.5" y="10" width="2.5" height="12" fill="#111827" />
                <rect x="4" y="13" width="16" height="2" fill="#111827" />
              </svg>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-7 h-7 rounded-full bg-[#FAF7F2] dark:bg-white/10 border border-sumi-border dark:border-white/15 flex items-center justify-center text-sumi dark:text-amber-300 shrink-0"
                aria-label="Toggle Dark Mode"
                title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsGuideModalOpen(true)}
                className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-sumi-border flex items-center justify-center text-crimson shrink-0"
                aria-label="Panduan Cepat"
                title="Panduan Cepat"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  if (currentUser.role === 'siswa') {
                    const sensei = profiles.find(p => p.role === 'sensei');
                    if (sensei) switchUser(sensei.id);
                    router.push('/sensei');
                  } else {
                    const student = profiles.find(p => p.role === 'siswa');
                    if (student) switchUser(student.id);
                    router.push('/siswa');
                  }
                }}
                className="px-2 py-1 text-[11px] font-bold rounded-lg border border-sumi-border bg-white text-sumi-charcoal flex items-center gap-1 whitespace-nowrap shrink-0"
                title="Ganti Mode Siswa / Sensei"
              >
                <RefreshCw className="w-3 h-3 text-crimson shrink-0" />
                <span>{currentUser.role === 'siswa' ? 'Sensei' : 'Siswa'}</span>
              </button>

              <button
                onClick={() => setIsMadingModalOpen(true)}
                className="w-7 h-7 rounded-full bg-crimson-tint flex items-center justify-center text-crimson shrink-0"
                aria-label="Mading Madrasah"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-7 h-7 rounded-full bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center shadow-sm shrink-0"
                  aria-label="Menu Profil"
                >
                  {currentUser.avatar_url || currentUser.full_name.charAt(0)}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-sumi-border py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-sumi-border">
                      <p className="text-xs font-bold text-sumi">{currentUser.full_name}</p>
                      <p className="text-[11px] text-sumi-muted">
                        {currentUser.role === 'sensei' ? `NIP: ${currentUser.nisn}` : `NISN: ${currentUser.nisn}`}
                      </p>
                    </div>
                    <div className="py-1">
                      <p className="px-4 py-1 text-[10px] font-bold text-sumi-muted uppercase">
                        Ganti Profil (Demo)
                      </p>
                      {profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchUser(p.id);
                            setIsProfileMenuOpen(false);
                            router.push(p.role === 'sensei' ? '/sensei' : '/siswa');
                          }}
                          className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between hover:bg-crimson-tint/30 transition-colors ${
                            p.id === currentUser.id ? 'font-bold text-crimson bg-crimson-subtle' : 'text-sumi'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-crimson-tint text-crimson text-[10px] font-bold flex items-center justify-center">
                              {p.avatar_url || p.full_name[0]}
                            </span>
                            <span>{p.full_name}</span>
                          </div>
                          <span className="text-[10px] text-sumi-muted capitalize">{p.role}</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-sumi-border pt-1">
                      <Link
                        href="/login"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-crimson hover:bg-crimson-tint/30 font-semibold"
                      >
                        Keluar / Halaman Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK GUIDE MODAL */}
      <QuickGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        defaultRole={isSenseiPath ? 'sensei' : 'siswa'}
      />

      {/* MADING MADRASAH MODAL */}
      {isMadingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sumi-border relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsMadingModalOpen(false)}
              className="absolute top-5 right-5 text-sumi-muted hover:text-sumi p-1.5 rounded-full hover:bg-sumi-light"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-lg font-black text-sumi">Mading Bahasa Jepang Madrasah</h3>
                <p className="text-xs text-sumi-charcoal">Pengumuman & Instruksi Sensei Pembina (MAN 1 Pasuruan)</p>
              </div>
            </div>

            <div className="space-y-3.5 my-4">
              <div className="p-4 rounded-2xl bg-crimson-subtle border border-crimson-tint">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-crimson flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Jadwal Tatap Muka Pekan Ini
                  </span>
                  <span className="text-[10px] font-semibold text-sumi-muted">Updated Hari Ini</span>
                </div>
                <p className="text-xs text-sumi-charcoal leading-relaxed">
                  Bimbingan tatap muka dilaksanakan <strong>Selasa, Kamis, dan Sabtu pukul 15.30 - 16.30 WIB</strong> di Lab Bahasa. Mohon siswa menuntaskan latihan mandiri Rodoku & Kanji sebelum sesi bimbingan dimulai.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-washi border border-sumi-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-sumi flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" /> Target Kompetisi 2026
                  </span>
                  <span className="text-[10px] font-semibold text-sumi-muted">Target Kontingen</span>
                </div>
                <ul className="text-xs text-sumi-charcoal space-y-1 list-disc pl-4 mt-2">
                  <li>6 Cabang Lomba: Kanji, Cerdas Cermat, Kikikakitori, Rodoku, Seiyu, Shodou.</li>
                  <li>Ambang batas skor kuis otomatis: minimal <strong>80 / 100</strong> sebelum simulasi akhir.</li>
                  <li>Rekam latihan Rodoku & Seiyu minimal 3 kali take per pekan.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-sumi-border">
                <div className="text-xs font-bold text-sumi mb-1">Tips Efisiensi Latihan dari Sensei:</div>
                <p className="text-xs text-sumi-charcoal leading-relaxed">
                  Jika sedang menunggu giliran koreksi naskah dengan Sensei di lab, gunakan waktu 10-15 menit untuk mengerjakan 1 paket Kanji atau mendengarkan audio acuan Rodoku di ponsel masing-masing.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMadingModalOpen(false)}
              className="w-full py-2.5 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl transition-colors mt-2"
            >
              Tutup Pengumuman
            </button>
          </div>
        </div>
      )}
    </>
  );
};
