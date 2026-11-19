'use client';

import React from 'react';
import { Clock, Trophy } from 'lucide-react';
import { LeaderboardStudent } from '@/lib/data/cerdasCermatModuleData';

interface EditorialLeaderboardProps {
  students: LeaderboardStudent[];
}

const LaurelWreathSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 44 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left branch */}
    <path
      d="M14 31C8.5 27.5 5 21.5 5 14.5C5 10.5 6.3 7 8.5 4.2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M7 22C4.5 21 3 19 3 17C5 16.8 6.8 18 7.5 20"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.2 15.5C4 14 3 11.8 3.5 9.8C5.3 10.2 6.8 11.7 7 13.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.2 9.5C6.8 7.8 6.8 5.5 7.8 3.8C9.2 4.8 10 6.8 9.6 8.6"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right branch */}
    <path
      d="M30 31C35.5 27.5 39 21.5 39 14.5C39 10.5 37.7 7 35.5 4.2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M37 22C39.5 21 41 19 41 17C39 16.8 37.2 18 36.5 20"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M37.8 15.5C40 14 41 11.8 40.5 9.8C38.7 10.2 37.2 11.7 37 13.8"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35.8 9.5C37.2 7.8 37.2 5.5 36.2 3.8C34.8 4.8 34 6.8 34.4 8.6"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SakuraFlowerSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.5C13.3 5 13.8 7.5 12.6 9.6C14.7 8.4 17.2 8.7 19.6 10.1C17.8 12.2 15.4 13.4 13.1 12.9C14.8 14.6 15.2 17.2 14.3 19.8C12 18.7 10.4 16.8 10.2 14.4C9.1 16.5 7 18.1 4.4 18.6C4.7 16 6 13.8 8.1 12.7C5.8 12.6 3.7 11.1 2.4 8.8C4.9 7.8 7.4 8.1 9.4 9.5C8.5 7.2 9.4 4.7 12 2.5Z" />
  </svg>
);

const SeigaihaCornerSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="30" cy="60" r="24" stroke="currentColor" strokeWidth="1" />
    <circle cx="30" cy="60" r="17" stroke="currentColor" strokeWidth="1" />
    <circle cx="30" cy="60" r="10" stroke="currentColor" strokeWidth="1" />
    <circle cx="78" cy="60" r="24" stroke="currentColor" strokeWidth="1" />
    <circle cx="78" cy="60" r="17" stroke="currentColor" strokeWidth="1" />
    <circle cx="78" cy="60" r="10" stroke="currentColor" strokeWidth="1" />
    <circle cx="54" cy="36" r="24" stroke="currentColor" strokeWidth="1" />
    <circle cx="54" cy="36" r="17" stroke="currentColor" strokeWidth="1" />
    <circle cx="54" cy="36" r="10" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const EditorialLeaderboard: React.FC<EditorialLeaderboardProps> = ({
  students,
}) => {
  const getRankTheme = (rank: number) => {
    if (rank === 1) {
      return {
        rowBg: 'bg-gradient-to-r from-[#F9EED2]/85 via-[#FDF7E7]/70 to-transparent',
        accentBar: 'border-l-[3px] border-l-[#C69214]',
        rankColor: 'text-[#A16E08]',
        laurelColor: 'text-[#C69214]',
        scoreColor: 'text-[#8B151B]',
        badgeLabel: 'Peringkat Utama',
      };
    }
    if (rank === 2) {
      return {
        rowBg: 'bg-gradient-to-r from-[#EEF1F5]/75 to-transparent',
        accentBar: 'border-l-[3px] border-l-[#7D8794]',
        rankColor: 'text-[#5A6472]',
        laurelColor: 'text-[#8C96A3]',
        scoreColor: 'text-[#1F242D]',
        badgeLabel: null,
      };
    }
    return {
      rowBg: 'bg-gradient-to-r from-[#F5E9DC]/70 to-transparent',
      accentBar: 'border-l-[3px] border-l-[#9C5C31]',
      rankColor: 'text-[#844821]',
      laurelColor: 'text-[#AE6C3E]',
      scoreColor: 'text-[#1F242D]',
      badgeLabel: null,
    };
  };

  return (
    <div className="bg-[#FDF9F1] rounded-2xl border border-[#E4D9C8] shadow-[0_8px_24px_rgba(24,20,16,0.06)] relative overflow-hidden">
      {/* Limited decorative Seigaiha corner motif */}
      <SeigaihaCornerSVG className="absolute -right-2 -top-1 w-28 h-14 text-[#D5C3AA]/45 pointer-events-none select-none rotate-180" />

      {/* Editorial Header */}
      <div className="px-5 pt-5 pb-3.5 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7D6E5D]">
              <Trophy className="w-3 h-3 text-[#B91C1C]" />
              <span>Klasemen Arena</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1614] tracking-tight leading-none">
              Papan Skor
            </h3>
          </div>

          <span className="px-2 py-1 rounded-md border border-[#E0D3BF] bg-[#F7EFE1] text-[10px] font-bold uppercase tracking-wider text-[#6D5A47]">
            Top 3
          </span>
        </div>

        {/* Hairline Sakura Editorial Divider */}
        <div className="mt-3.5 flex items-center gap-2">
          <div className="h-px flex-1 bg-[#E4D9C8]" />
          <SakuraFlowerSVG className="w-3 h-3 text-[#B91C1C]/65 flex-shrink-0" />
          <div className="h-px flex-1 bg-[#E4D9C8]" />
        </div>
      </div>

      {/* Ranked Participants List with subtle dividers */}
      <div className="divide-y divide-[#EAE0D0] pb-1">
        {students.map((student) => {
          const theme = getRankTheme(student.rank);
          const rankFormatted = String(student.rank).padStart(2, '0');
          const isFirst = student.rank === 1;

          return (
            <div
              key={student.rank}
              className={`px-5 ${
                isFirst ? 'py-4' : 'py-3.5'
              } flex items-center justify-between gap-3 ${theme.rowBg} ${
                theme.accentBar
              } transition-colors`}
            >
              {/* Left: Large Numeral Rank + Thin Laurel + Serif Name + Time Metadata */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-11 h-9 flex items-center justify-center flex-shrink-0">
                  <LaurelWreathSVG
                    className={`w-11 h-9 absolute inset-0 ${theme.laurelColor} opacity-80`}
                  />
                  <span
                    className={`relative font-serif ${
                      isFirst ? 'text-[17px]' : 'text-[15px]'
                    } font-black tracking-tight tabular-nums ${theme.rankColor}`}
                  >
                    {rankFormatted}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-serif font-semibold ${
                        isFirst ? 'text-[15px]' : 'text-[14px]'
                      } text-[#1A1614] truncate`}
                    >
                      {student.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7D6E5D]">
                    <span className="inline-flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 opacity-75" />
                      {student.timeFormatted}
                    </span>
                    {theme.badgeLabel && (
                      <>
                        <span className="opacity-40">•</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A16E08]">
                          {theme.badgeLabel}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Crisp Bold Score Typography */}
              <div className="text-right flex-shrink-0">
                <span
                  className={`${
                    isFirst ? 'text-xl' : 'text-lg'
                  } font-black tabular-nums tracking-tight ${theme.scoreColor}`}
                >
                  {student.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D6E5D] ml-1">
                  Pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
