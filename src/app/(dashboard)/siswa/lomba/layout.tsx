'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/siswa"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-sumi-border text-sumi font-bold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-crimson" />
              <span>Kembali</span>
            </Link>
            {meta && (
              <span className="font-bold text-crimson bg-legible-text">
                {meta.name} ({meta.kanji})
              </span>
            )}
          </div>
        </nav>
      )}

      {/* Main Branch Content */}
      {children}
    </div>
  );
}
