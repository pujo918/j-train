'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  HelpCircle,
  LogIn,
  LayoutGrid,
  Mic,
  TrendingUp,
  Users,
  CheckCircle2,
  FolderKanban,
  Info,
} from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'siswa' | 'sensei';
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'siswa',
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'sensei'>(defaultRole);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole);
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const siswaSteps = [
    {
      num: '1',
      icon: LogIn,
      title: 'Masuk & Pasang App',
      desc: 'Login akun siswa. Klik "Pasang Aplikasi" bila ingin akses cepat dari layar HP.',
    },
    {
      num: '2',
      icon: LayoutGrid,
      title: 'Pilih Cabang Lomba',
      desc: 'Buka salah satu dari 6 ruang lomba di Beranda sesuai fokus binaanmu.',
    },
    {
      num: '3',
      icon: Mic,
      title: 'Latihan / Rekam Karya',
      desc: 'Kerjakan kuis, rekam suara langsung (Rodoku/Seiyu), atau unggah foto (Shodou).',
    },
    {
      num: '4',
      icon: TrendingUp,
      title: 'Cek Skor & Catatan',
      desc: 'Pantau nilai dan baca catatan pembinaan dari Sensei di menu Progres.',
    },
  ];

  const senseiSteps = [
    {
      num: '1',
      icon: Users,
      title: 'Pantau Matriks Siswa',
      desc: 'Lihat skor tim & filter siswa; klik baris siswa untuk grafik perkembangan detail.',
    },
    {
      num: '2',
      icon: CheckCircle2,
      title: 'Verifikasi di Inbox',
      desc: 'Putar rekaman atau buka foto Shodou di Sensei Inbox, lalu klik Bagus atau beri Catatan.',
    },
    {
      num: '3',
      icon: FolderKanban,
      title: 'Kelola Paket & Soal',
      desc: 'Buka tab Kelola Paket & Soal untuk tambah materi baru atau impor bank soal CSV.',
    },
  ];

  const steps = activeTab === 'siswa' ? siswaSteps : senseiSteps;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-sumi-border/80 shadow-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-sumi-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-crimson-tint text-crimson flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-sumi leading-tight">
                Panduan Cepat J-TRAIN
              </h2>
              <p className="text-[11px] text-sumi-muted">
                Ringkas dalam {steps.length} langkah
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-crimson-tint text-sumi-charcoal hover:text-crimson flex items-center justify-center transition-colors"
            aria-label="Tutup Panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Role Switcher */}
          <div className="inline-flex items-center p-1 bg-[#FAF7F2] rounded-full border border-sumi-border/70 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('siswa')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'siswa'
                  ? 'bg-crimson text-white shadow-2xs'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              Mode Siswa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sensei')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === 'sensei'
                  ? 'bg-crimson text-white shadow-2xs'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              Mode Guru / Sensei
            </button>
          </div>

          {/* Visual Step Cards */}
          <div className="space-y-2.5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2]/80 border border-sumi-border/60 flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-crimson text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sumi">
                      <Icon className="w-3.5 h-3.5 text-crimson flex-shrink-0" />
                      <span>{step.title}</span>
                    </div>
                    <p className="text-[11px] text-sumi-charcoal mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Tip */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2 text-[11px] text-amber-900">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Tips:</strong> Jika mikrofon/audio tidak muncul, izinkan akses mikrofon di browser. Jawaban tetap aman tersimpan otomatis bila koneksi terputus.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-crimson hover:bg-crimson-dark text-white text-xs font-bold transition-all"
          >
            Siap Mulai!
          </button>
        </div>
      </div>
    </div>
  );
};
