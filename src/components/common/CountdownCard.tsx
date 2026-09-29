'use client';

import React, { useState, useMemo } from 'react';
import { CrimsonFinishFlagIcon } from '@/components/icons/CompetitionIcons';
import { useAppStore } from '@/lib/data/store';
import { Calendar, Settings2, Check, X } from 'lucide-react';

interface CountdownCardProps {
  daysLeft?: number;
  competitionName?: string;
  competitionDate?: string;
}

export const CountdownCard: React.FC<CountdownCardProps> = () => {
  const { targetCompetitionDate, setTargetCompetitionDate } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(targetCompetitionDate || '2026-10-28');

  // Calculate real days remaining dynamically
  const { daysRemaining, formattedTargetDate } = useMemo(() => {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const targetParts = (targetCompetitionDate || '2026-10-28').split('-');
      const target = new Date(
        Number(targetParts[0]),
        Number(targetParts[1]) - 1,
        Number(targetParts[2])
      );

      const diffMs = target.getTime() - today.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const formatted = target.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return {
        daysRemaining: Math.max(0, days),
        formattedTargetDate: formatted,
      };
    } catch {
      return {
        daysRemaining: 24,
        formattedTargetDate: '28 Oktober 2026',
      };
    }
  }, [targetCompetitionDate]);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempDate) {
      setTargetCompetitionDate(tempDate);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-card px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between gap-5 transition-all hover:border-crimson-tint relative group">
        {/* Left: Text & Setting Trigger */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold tracking-[0.8px] text-[#4B5563] uppercase">
            <span>HITUNG MUNDUR KOMPETISI</span>
            <button
              onClick={() => {
                setTempDate(targetCompetitionDate || '2026-10-28');
                setIsEditing(true);
              }}
              title="Atur Tanggal Target Kompetisi"
              className="opacity-40 group-hover:opacity-100 hover:text-crimson transition-opacity p-0.5 rounded text-[10px]"
            >
              <Settings2 className="w-3.5 h-3.5 inline-block" />
            </button>
          </div>

          <div className="text-xl sm:text-[24px] font-black text-sumi leading-none tracking-tight">
            {daysRemaining} HARI LAGI!
          </div>

          <div className="flex items-center gap-1 text-[11px] text-sumi-muted pt-0.5 font-medium">
            <span>Target: {formattedTargetDate}</span>
            <button
              onClick={() => {
                setTempDate(targetCompetitionDate || '2026-10-28');
                setIsEditing(true);
              }}
              className="text-crimson hover:underline font-bold text-[10px] ml-1"
            >
              (Ubah)
            </button>
          </div>
        </div>

        {/* Right: Crimson Finish Flag on Pole as in mockup */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => setIsEditing(true)} title="Klik untuk ubah target tanggal">
          <CrimsonFinishFlagIcon size={44} className="w-10 h-10 sm:w-11 sm:h-11 transition-transform group-hover:scale-105" />
        </div>
      </div>

      {/* Interactive Modal to Configure Real Target Date */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sumi-border space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-crimson" />
                <h3 className="text-sm font-black text-sumi">Atur Tanggal Target Lomba</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-sumi-muted hover:text-sumi p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-sumi-charcoal leading-relaxed">
              Pilih tanggal pelaksanaan kompetisi target Anda. Hitungan &ldquo;X HARI LAGI!&rdquo; akan dihitung secara otomatis dan akurat.
            </p>

            <form onSubmit={handleSaveDate} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-sumi-charcoal mb-1.5">
                  Tanggal Target Kompetisi
                </label>
                <input
                  type="date"
                  required
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-sumi-border text-xs sm:text-sm font-semibold focus:outline-none focus:border-crimson"
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-washi hover:bg-sumi-light text-sumi-charcoal rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Target</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
