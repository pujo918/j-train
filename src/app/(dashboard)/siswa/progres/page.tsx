'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/data/store';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { PerformanceAreaChart } from '@/components/charts/PerformanceAreaChart';
import { 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Filter, 
  User, 
  ArrowLeft 
} from 'lucide-react';
import { CompetitionCategory } from '@/types';
import { formatTimeSeconds, CATEGORIES_META } from '@/lib/utils';
import Link from 'next/link';

export default function SiswaProgresPage() {
  const { currentUser, results } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const userResults = results.filter((r) => r.user_id === currentUser.id);
  const quizResults = userResults.filter((r) => r.score !== null);

  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score || 0), 0) / quizResults.length * 10) / 10
    : 0;

  const totalTimeSeconds = userResults.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0);

  const filteredResults = selectedFilter === 'all'
    ? userResults
    : userResults.filter((r) => r.category === selectedFilter);

  const trendData = quizResults.length > 0
    ? [...quizResults].reverse().map((r, i) => ({
        label: `Tes ${i + 1}`,
        score: r.score || 0,
        date: r.completed_at,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/siswa"
            className="p-2.5 rounded-xl border border-sumi-border bg-white hover:bg-sumi-light text-sumi transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-sumi">
              Histori & Portofolio Progres
            </h1>
            <p className="text-xs text-sumi-charcoal mt-0.5">
              Rekapitulasi capaian latihan mandiri dan skor kuis kompetisi {currentUser.full_name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-sumi-border shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-sumi">Status: Terdaftar Kontingen MAN 1</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-sumi-charcoal mb-2">
            <span>Total Latihan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sumi">
            {userResults.length}
          </div>
          <span className="text-[11px] text-sumi-muted mt-1 block">Modul diselesaikan</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-sumi-charcoal mb-2">
            <span>Rerata Skor Kuis</span>
            <Award className="w-4 h-4 text-crimson" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-crimson">
            {avgScore || '-'}
          </div>
          <span className="text-[11px] text-sumi-muted mt-1 block">Dari cabang otomatis</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-sumi-charcoal mb-2">
            <span>Total Jam Mandiri</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sumi font-mono">
            {Math.floor(totalTimeSeconds / 60)} m {totalTimeSeconds % 60} s
          </div>
          <span className="text-[11px] text-sumi-muted mt-1 block">Waktu aktif belajar</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <div className="flex items-center justify-between text-xs font-bold text-sumi-charcoal mb-2">
            <span>Kesiapan Siswa</span>
            <TrendingUp className="w-4 h-4 text-crimson" />
          </div>
          <div className="text-lg sm:text-xl font-black text-sumi mt-1">
            {avgScore >= 80 ? 'Siap Lomba' : avgScore >= 65 ? 'Berkembang' : 'Butuh Bimbingan'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Target Nilai: ≥ 80.0
          </span>
        </div>
      </div>

      {/* Progression Charts Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-sumi-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-sumi uppercase tracking-wider">
              Grafik Tren Perkembangan Nilai
            </h3>
            <p className="text-xs text-sumi-charcoal mt-0.5">
              Pelacakan kurva kenaikan skor latihan dari sesi pertama hingga terkini.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <TrendLineChart data={trendData} height={140} />
        </div>
      </div>

      {/* Detailed Chronological History Table */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-sumi uppercase tracking-wider">
              Riwayat Pengerjaan & Sesi Mandiri
            </h3>
            <p className="text-xs text-sumi-charcoal mt-0.5">
              Seluruh rekaman log pengerjaan yang tercatat di database sistem.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedFilter === 'all'
                  ? 'bg-crimson text-white'
                  : 'bg-washi text-sumi-charcoal hover:bg-sumi-light'
              }`}
            >
              Semua Cabang
            </button>
            {(Object.keys(CATEGORIES_META) as CompetitionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedFilter === cat
                    ? 'bg-crimson text-white'
                    : 'bg-washi text-sumi-charcoal hover:bg-sumi-light'
                }`}
              >
                {CATEGORIES_META[cat].name}
              </button>
            ))}
          </div>
        </div>

        {filteredResults.length === 0 ? (
          <div className="p-8 text-center text-xs text-sumi-muted italic bg-washi rounded-2xl border border-sumi-border">
            Belum ada data rekaman pada kategori ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sumi-border text-sumi-charcoal font-bold uppercase tracking-wider">
                  <th className="pb-3 px-3">Tanggal & Waktu</th>
                  <th className="pb-3 px-3">Cabang Lomba</th>
                  <th className="pb-3 px-3">Judul Modul</th>
                  <th className="pb-3 px-3 text-center">Durasi</th>
                  <th className="pb-3 px-3 text-right">Skor Capaian</th>
                  <th className="pb-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sumi-border">
                {filteredResults.map((r) => {
                  const meta = CATEGORIES_META[r.category];
                  return (
                    <tr key={r.id} className="hover:bg-washi/60 transition-colors">
                      <td className="py-3.5 px-3 text-sumi-charcoal whitespace-nowrap">
                        {new Date(r.completed_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-sumi">
                          {meta?.name || r.category}
                        </span>
                        <span className="text-[10px] text-sumi-muted block font-jp">
                          {meta?.kanji}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-sumi max-w-xs truncate">
                        {r.set_title || 'Paket Latihan Terpilih'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-sumi-charcoal whitespace-nowrap">
                        {formatTimeSeconds(r.time_spent_seconds)}
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {r.score !== null ? (
                          <span className={`font-black text-sm ${r.score >= 80 ? 'text-crimson' : r.score >= 65 ? 'text-amber-600' : 'text-sumi-charcoal'}`}>
                            {r.score}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Latihan Mandiri
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tuntas
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
