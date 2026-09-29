'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { CATEGORIES_META } from '@/lib/utils';
import { CompetitionCategory } from '@/types';

export default function LombaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentCategorySlug = segments[segments.length - 1];

  // Match slug to category
  const activeCategory = (Object.keys(CATEGORIES_META) as CompetitionCategory[]).find(
    (key) => CATEGORIES_META[key].path.includes(currentCategorySlug)
  );

  const meta = activeCategory ? CATEGORIES_META[activeCategory] : null;

  const hasCustomHeader = currentCategorySlug === 'shodou' || currentCategorySlug === 'kanji' || currentCategorySlug === 'kikikakitori' || currentCategorySlug === 'seiyu' || currentCategorySlug === 'rodoku' || currentCategorySlug === 'cerdas-cermat';

  return (
    <div className={hasCustomHeader ? "space-y-4" : "space-y-6"}>
      {/* Breadcrumb & Navigation Bar (hidden on Shodou and Kanji to use custom compact header) */}
      {!hasCustomHeader && (
        <nav className="flex items-center justify-between text-xs text-sumi-charcoal pb-2 border-b border-sumi-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/siswa"
              className="flex items-center gap-1 text-sumi-charcoal hover:text-crimson transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-sumi-muted" />
            <Link
              href="/siswa#katalog-lomba"
              className="text-sumi-charcoal hover:text-crimson transition-colors"
            >
              Ruang Lomba
            </Link>
            {meta && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-sumi-muted" />
                <span className="font-bold text-crimson">
                  {meta.name} ({meta.kanji})
                </span>
              </>
            )}
          </div>

          <Link
            href="/siswa"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sumi hover:text-crimson transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pilih Cabang Lain</span>
          </Link>
        </nav>
      )}

      {/* Main Branch Content */}
      {children}
    </div>
  );
}
