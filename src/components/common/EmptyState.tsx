'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  categoryName: string;
  categoryKanji?: string;
  customMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  categoryName,
  categoryKanji,
  customMessage,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-8 md:p-12 text-center max-w-xl mx-auto my-8 relative overflow-hidden">
      {/* Decorative Japanese Watermark pattern */}
      <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 text-7xl font-jp font-black text-crimson/5 select-none pointer-events-none">
        {categoryKanji || "準備中"}
      </div>

      {/* Torii / Illustration Badge */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-washi border border-sumi-border flex items-center justify-center text-4xl shadow-inner relative">
        <span>⛩️</span>
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-crimson-tint flex items-center justify-center text-xs">
          🌸
        </span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-tint text-crimson text-xs font-bold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>MODUL SEDANG DISIAPKAN</span>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-sumi mb-2">
        Ruang Latihan {categoryName} {categoryKanji ? `(${categoryKanji})` : ''}
      </h3>

      <p className="text-sm md:text-base text-sumi-charcoal leading-relaxed max-w-md mx-auto mb-8">
        {customMessage ||
          `Ruang latihan ${categoryName} sedang disiapkan oleh Sensei. Nantikan paket materi dan latihan interaktif segera!`}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/siswa"
          className="w-full sm:w-auto px-6 py-3 bg-crimson hover:bg-crimson-dark text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 touch-target"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/siswa/lomba/kanji"
          className="w-full sm:w-auto px-6 py-3 bg-washi hover:bg-sumi-light text-sumi-charcoal hover:text-sumi text-xs sm:text-sm font-bold rounded-xl border border-sumi-border transition-all flex items-center justify-center gap-2 touch-target"
        >
          <BookOpen className="w-4 h-4 text-crimson" />
          <span>Latihan Cabang Lain (Kanji)</span>
        </Link>
      </div>
    </div>
  );
};
