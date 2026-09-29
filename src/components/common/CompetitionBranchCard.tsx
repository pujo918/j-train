'use client';

import React from 'react';
import Link from 'next/link';
import { CompetitionCategory } from '@/types';
import { CATEGORIES_META } from '@/lib/utils';
import {
  ShodouIcon,
  KanjiIcon,
  KikikakitoriIcon,
  SeiyuIcon,
  RodokuIcon,
  CerdasCermatIcon,
} from '@/components/icons/CompetitionIcons';

interface CompetitionBranchCardProps {
  category: CompetitionCategory;
  progressPercent?: number; // 0 to 100
  totalSets?: number;
  completedSets?: number;
}

export const CompetitionBranchCard: React.FC<CompetitionBranchCardProps> = ({
  category,
  progressPercent = 0,
}) => {
  const meta = CATEGORIES_META[category];

  // Specific custom illustrated Japanese icon matching the mockup
  const renderIllustratedIcon = () => {
    switch (category) {
      case 'shodou':
        return <ShodouIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      case 'kanji':
        return <KanjiIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      case 'kikikakitori':
        return <KikikakitoriIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      case 'seiyu':
        return <SeiyuIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      case 'rodoku':
        return <RodokuIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      case 'cerdas_cermat':
        return <CerdasCermatIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
      default:
        return <KanjiIcon size={38} className="w-8 h-8 sm:w-9 sm:h-9" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E1] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#E2D9CC] group hover:-translate-y-0.5 min-h-[160px] sm:min-h-[175px]">
      {/* 1. Header: Squircle Icon Badge + Title Romaji + Subtitle Kanji */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5">
        {/* Soft cream squircle background container matching mockup */}
        <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] bg-[#FAF5EE] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#F3ECE2] shadow-[0_1px_3px_rgba(0,0,0,0.03)] group-hover:scale-105 transition-transform duration-200">
          {renderIllustratedIcon()}
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="font-extrabold text-[13px] sm:text-[15px] tracking-[0.5px] uppercase text-[#1F1A1C] group-hover:text-crimson transition-colors leading-tight">
            {meta.romaji}
          </h3>
          <span className="font-semibold text-[11px] sm:text-xs text-[#4B5563] font-jp mt-0.5">
            ({meta.kanji})
          </span>
        </div>
      </div>

      {/* 2. Middle: Thin Crimson Progress Bar */}
      <div className="my-2.5 sm:my-3">
        <div className="h-[5px] sm:h-[6px] w-full bg-[#F5E6E6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#A61B29] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(16, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* 3. Bottom: Main Action Button (Compact, full width, crimson) */}
      <Link
        href={meta.path}
        className="w-full h-[36px] sm:h-[38px] bg-[#A61B29] hover:bg-[#8F1622] text-white font-bold text-xs sm:text-[13px] rounded-xl flex items-center justify-center transition-all duration-150 active:scale-[0.98] shadow-sm touch-target"
      >
        <span>Buka Ruang Latihan</span>
      </Link>
    </div>
  );
};
