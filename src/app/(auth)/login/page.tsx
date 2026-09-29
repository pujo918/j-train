'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/data/store';
import { UserRole } from '@/types';
import { Lock, Mail, User, GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { profiles, switchUser } = useAppStore();
  
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState('0078129381');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (selectedRole === 'sensei') {
        const sensei = profiles.find((p) => p.role === 'sensei');
        if (sensei) switchUser(sensei.id);
        router.push('/sensei');
      } else {
        const student = profiles.find((p) => p.role === 'siswa' && p.nisn === identifier) || profiles[0];
        if (student) switchUser(student.id);
        router.push('/siswa');
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (userId: string, targetPath: string) => {
    switchUser(userId);
    router.push(targetPath);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-sumi-border shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Top Brand Decorative Watermark */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 text-8xl font-jp font-black text-crimson/5 select-none pointer-events-none">
        勝
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-tint text-crimson text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PORTAL KOMPETISI BAHASA JEPANG</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-black tracking-tight text-sumi">J-TRAIN</span>
          <span className="text-2xl">⛩️</span>
        </div>

        <p className="text-xs font-semibold text-sumi-charcoal uppercase tracking-wider">
          MAN 1 PASURUAN • JAWA TIMUR
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-washi rounded-2xl border border-sumi-border">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('siswa');
            setIdentifier('0078129381');
          }}
          className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'siswa'
              ? 'bg-crimson text-white shadow-sm'
              : 'text-sumi-charcoal hover:text-sumi'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Siswa Binaan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('sensei');
            setIdentifier('sensei@man1pasuruan.sch.id');
          }}
          className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'sensei'
              ? 'bg-crimson text-white shadow-sm'
              : 'text-sumi-charcoal hover:text-sumi'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Sensei Pembina</span>
        </button>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-sumi-charcoal uppercase tracking-wider mb-1.5">
            {selectedRole === 'siswa' ? 'NISN / Alamat Email Siswa' : 'NIP / Email Sensei'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sumi-muted">
              {selectedRole === 'siswa' ? <User className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedRole === 'siswa' ? 'Contoh: 0078129381' : 'sensei@man1pasuruan.sch.id'}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-sumi-border text-xs sm:text-sm font-medium focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-sumi-charcoal uppercase tracking-wider mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sumi-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-sumi-border text-xs sm:text-sm font-medium focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 touch-target"
        >
          <span>{loading ? 'Memverifikasi...' : 'Masuk ke Ruang Latihan'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Access (1-Click Switchers) */}
      <div className="pt-4 border-t border-sumi-border space-y-2.5">
        <p className="text-[11px] font-bold text-sumi-muted uppercase tracking-wider text-center">
          Akses Cepat Pengujian Role (Demo 1-Klik)
        </p>

        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('user-budi', '/siswa')}
            className="p-2.5 rounded-xl border border-sumi-border hover:border-crimson bg-washi hover:bg-crimson-tint/30 text-left flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-[10px]">
                B
              </span>
              <div>
                <span className="font-bold text-sumi">Budi Santoso</span>
                <span className="text-[10px] text-sumi-muted block">Siswa Binaan (Fokus: Kanji & Cerdas Cermat)</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-sumi-muted" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('user-siti', '/siswa')}
            className="p-2.5 rounded-xl border border-sumi-border hover:border-crimson bg-washi hover:bg-crimson-tint/30 text-left flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-[10px]">
                S
              </span>
              <div>
                <span className="font-bold text-sumi">Siti Rahma</span>
                <span className="text-[10px] text-sumi-muted block">Siswa Binaan (Fokus: Kikikakitori & Rodoku)</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-sumi-muted" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('user-sensei', '/sensei')}
            className="p-2.5 rounded-xl border border-crimson-tint bg-crimson-subtle text-left flex items-center justify-between text-xs transition-colors font-bold text-crimson"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-[10px]">
                N
              </span>
              <div>
                <span className="font-black text-sumi">Nurul Hidayati, S.Pd.</span>
                <span className="text-[10px] text-crimson block font-semibold">Sensei Pembina Olimpiade (Full Dashboard)</span>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-crimson" />
          </button>
        </div>
      </div>
    </div>
  );
}
