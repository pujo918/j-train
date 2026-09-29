'use client';

import React from 'react';
import { useAppStore } from '@/lib/data/store';
import { CountdownCard } from '@/components/common/CountdownCard';
import { CompetitionBranchCard } from '@/components/common/CompetitionBranchCard';
import { PerformanceAreaChart } from '@/components/charts/PerformanceAreaChart';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { CompetitionCategory } from '@/types';

export default function SiswaDashboardPage() {
  const { currentUser, results, practiceSets } = useAppStore();

  // Get user specific results
  const userResults = results.filter((r) => r.user_id === currentUser.id);
  const quizResults = userResults.filter((r) => r.score !== null);

  // Calculate average score
  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((acc, r) => acc + (r.score || 0), 0) / quizResults.length * 10) / 10
    : 82;

  // Last finished session
  const lastResult = userResults.length > 0 ? userResults[0] : null;

  // Trend data for chart
  const trendData = quizResults.length > 0
    ? [...quizResults].reverse().map((r, i) => ({
        label: `Set ${i + 1}`,
        score: r.score || 0,
        date: r.completed_at,
      }))
    : [
        { label: 'Set 1', score: 75 },
        { label: 'Set 2', score: 85 },
        { label: 'Set 3', score: 90 },
      ];

  // Calculate progress percent per category
  const getCategoryProgress = (category: CompetitionCategory) => {
    const totalSets = practiceSets.filter((s) => s.category === category && s.is_published).length || 1;
    const completed = userResults.filter((r) => r.category === category && r.is_completed).length;
    return {
      total: totalSets,
      completed,
      percent: Math.min(100, Math.round((completed / totalSets) * 100)),
    };
  };

  const categories: CompetitionCategory[] = [
    'shodou',
    'kanji',
    'kikikakitori',
    'seiyu',
    'rodoku',
    'cerdas_cermat',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-7">
      {/* 1. HERO SECTION & COUNTDOWN CARD (Clean & Compact as in mockup) */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Sisi Kiri: Sapaan Personal */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-black text-sumi tracking-tight leading-tight">
            Halo, {currentUser.full_name}!
          </h1>
          <p className="text-base sm:text-lg font-medium text-[#374151] mt-0.5">
            Siap latihan hari ini?
          </p>
        </div>

        {/* Sisi Kanan: Kartu Hitung Mundur (Real dynamic target date) */}
        <div className="w-full sm:w-auto sm:min-w-[340px]">
          <CountdownCard />
        </div>
      </section>

      {/* 2. KATALOG 6 RUANG CABANG LOMBA (Compact grid without filler text) */}
      <section id="katalog-lomba">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          {categories.map((cat) => {
            const prog = getCategoryProgress(cat);
            return (
              <CompetitionBranchCard
                key={cat}
                category={cat}
                progressPercent={prog.percent}
                totalSets={prog.total}
                completedSets={prog.completed}
              />
            );
          })}
        </div>
      </section>

      {/* 3. SECTION MONITORING: "PERKEMBANGAN SAYA" */}
      <section className="space-y-3 pt-1">
        <h2 className="text-[13px] sm:text-[14px] font-extrabold tracking-[1px] text-sumi uppercase">
          PERKEMBANGAN SAYA
        </h2>

        {/* 2 Kolom seimbang di desktop, 1 kolom di mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Card Metrik 1 - RATA-RATA SKOR KUIS: [Nilai] */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
            <div className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.5px] text-sumi uppercase">
              RATA-RATA SKOR KUIS: {avgScore}
            </div>

            {/* Smooth Wave Chart (Crimson to transparent gradient) */}
            <div className="pt-1">
              <PerformanceAreaChart
                dataPoints={[65, 72, 78, 85, 82, avgScore]}
                height={85}
              />
            </div>
          </div>

          {/* Card Metrik 2 - LATIHAN TERAKHIR: [Nama Paket] (Skor: [Nilai]) */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-card p-4 sm:p-5 flex flex-col justify-between space-y-3">
            <div className="text-[12px] sm:text-[13px] font-extrabold tracking-[0.5px] text-sumi uppercase truncate">
              LATIHAN TERAKHIR: {lastResult?.set_title || 'Kanji Paket 1'} (Skor: {lastResult?.score ?? 90})
            </div>

            {/* Trend Line Chart */}
            <div className="pt-1">
              <TrendLineChart data={trendData} height={95} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
