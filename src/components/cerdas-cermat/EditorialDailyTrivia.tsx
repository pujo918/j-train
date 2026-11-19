'use client';

import React from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

interface EditorialDailyTriviaProps {
  selectedOption: 'A' | 'B' | null;
  isAnswered: boolean;
  feedback: string | null;
  onSelectOption: (opt: 'A' | 'B') => void;
  onSubmit: () => void;
}

const SakuraBranchCornerSVG: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    viewBox="0 0 120 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M120 12C95 16 74 26 52 44"
      stroke="#8D6E63"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M86 21C78 14 70 11 62 11"
      stroke="#8D6E63"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    {/* Soft Sakura Blossoms */}
    <circle cx="62" cy="11" r="5" fill="#F4C2C7" opacity="0.8" />
    <circle cx="62" cy="11" r="1.6" fill="#B91C1C" opacity="0.6" />
    <circle cx="96" cy="18" r="6" fill="#F4C2C7" opacity="0.85" />
    <circle cx="96" cy="18" r="1.8" fill="#B91C1C" opacity="0.6" />
    <circle cx="72" cy="31" r="4.5" fill="#FADADD" opacity="0.9" />
    <circle cx="72" cy="31" r="1.4" fill="#B91C1C" opacity="0.55" />
    <circle cx="51" cy="45" r="3.5" fill="#F4C2C7" opacity="0.7" />
  </svg>
);

export const EditorialDailyTrivia: React.FC<EditorialDailyTriviaProps> = ({
  selectedOption,
  isAnswered,
  feedback,
  onSelectOption,
  onSubmit,
}) => {
  const options: { key: 'A' | 'B'; label: string }[] = [
    { key: 'A', label: 'Hokkaido' },
    { key: 'B', label: 'Tokyo' },
  ];

  return (
    <div className="bg-[#FDF9F1] rounded-2xl border border-[#E4D9C8] shadow-[0_8px_24px_rgba(24,20,16,0.06)] p-5 relative overflow-hidden space-y-4">
      {/* Subtle Sakura Branch Accent */}
      <SakuraBranchCornerSVG className="absolute right-0 top-0 w-28 h-16 pointer-events-none select-none opacity-80" />

      {/* Editorial Header Hierarchy */}
      <div className="space-y-1.5 relative">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D6E5D]">
            DAILY TRIVIA
          </span>
          <span className="px-2 py-0.5 rounded border border-[#DEC9B8] bg-[#F7ECE3] text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8B151B]">
            KUIS HARI INI
          </span>
        </div>
        <div className="h-px w-full bg-[#E4D9C8]" />
      </div>

      {/* Main Focus: Question */}
      <p className="font-serif text-[16px] font-semibold text-[#1A1614] leading-snug relative">
        Prefektur dengan wilayah terluas di Jepang?
      </p>

      {/* Outlined Rectangular Option Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.key;
          const isCorrectChoice = isAnswered && isSelected && opt.key === 'A';
          const isWrongChoice = isAnswered && isSelected && opt.key === 'B';

          let cardClass =
            'bg-[#FFFDF9] border-[#D8CCBA] text-[#2D251E] hover:border-[#B91C1C]/60';
          if (isCorrectChoice) {
            cardClass =
              'bg-emerald-50 border-emerald-600 text-emerald-900';
          } else if (isWrongChoice) {
            cardClass =
              'bg-[#FDF2F2] border-[#B91C1C] text-[#991B1B]';
          } else if (isSelected) {
            cardClass =
              'bg-[#FDF2F2] border-[#B91C1C] text-[#8B151B] shadow-[0_1px_4px_rgba(185,28,28,0.12)]';
          }

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelectOption(opt.key)}
              className={`px-3.5 py-3 rounded-xl border-[1.5px] text-left flex items-center justify-between gap-2 transition-all ${cardClass}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`text-xs font-black tracking-wide ${
                    isSelected ? 'text-[#B91C1C]' : 'text-[#7D6E5D]'
                  }`}
                >
                  {opt.key}.
                </span>
                <span className="text-xs font-bold truncate">{opt.label}</span>
              </div>

              {isCorrectChoice && (
                <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 stroke-[3]" />
              )}
              {isWrongChoice && (
                <X className="w-3.5 h-3.5 text-[#B91C1C] flex-shrink-0 stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner (Preserved logic) */}
      {isAnswered && feedback && (
        <div
          className={`p-3 rounded-xl border text-[11px] leading-relaxed font-medium ${
            selectedOption === 'A'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-[#FDF2F2] border-[#F5C2C2] text-[#8B151B]'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Deep Crimson Rectangular Action Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!selectedOption}
        className="w-full py-2.5 px-4 rounded-xl bg-[#8B151B] hover:bg-[#701015] text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-45 disabled:cursor-not-allowed shadow-sm"
      >
        <span>Jawab Cepat</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
