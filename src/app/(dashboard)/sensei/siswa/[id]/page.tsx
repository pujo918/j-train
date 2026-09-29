'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/data/store';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { 
  ArrowLeft, 
  User, 
  Award, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  Save 
} from 'lucide-react';
import { formatTimeSeconds, CATEGORIES_META } from '@/lib/utils';
import Link from 'next/link';

export default function SenseiStudentDrilldownPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { getStudentById, getResultsForUser } = useAppStore();
  const student = getStudentById(userId);
  const studentResults = getResultsForUser(userId);

  const [notes, setNotes] = useState(
    'Siswa memiliki konsistensi tinggi pada Kanji, namun perlu penguatan pada listening dialog cepat Kikikakitori dan modulasi intonasi Rodoku sebelum babak penyisihan.'
  );
  const [isSavedNote, setIsSavedNote] = useState(false);

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-sumi-border text-center space-y-4">
        <p className="text-sm text-sumi-charcoal">Data siswa tidak ditemukan.</p>
        <button
          onClick={() => router.push('/sensei')}
          className="px-4 py-2 bg-crimson text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Matriks Monitoring
        </button>
      </div>
    );
  }

  const quizResults = studentResults.filter((r) => r.score !== null);
  const avgScore = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score || 0), 0) / quizResults.length * 10) / 10
    : 0;

  const totalTimeSeconds = studentResults.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0);
  const avgTimeSeconds = studentResults.length > 0 ? Math.round(totalTimeSeconds / studentResults.length) : 0;

  const trendData = quizResults.length > 0
    ? [...quizResults].reverse().map((r, idx) => ({
        label: `Sesi ${idx + 1}`,
        score: r.score || 0,
        date: r.completed_at,
      }))
    : [];

  const handleSaveNotes = () => {
    setIsSavedNote(true);
    setTimeout(() => setIsSavedNote(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/sensei"
            className="p-2.5 rounded-xl border border-sumi-border bg-white hover:bg-sumi-light text-sumi transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-crimson text-white font-black text-lg flex items-center justify-center shadow-sm">
              {student.avatar_url || student.full_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-sumi">
                  {student.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-crimson-tint text-crimson">
                  Siswa Binaan
                </span>
              </div>
              <p className="text-xs text-sumi-charcoal">
                NISN: {student.nisn} • Bergabung: {new Date(student.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
            avgScore >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            Kesiapan: {avgScore >= 80 ? 'Siap Lomba' : avgScore >= 65 ? 'Berkembang' : 'Butuh Bimbingan'}
          </span>
        </div>
      </div>

      {/* KPI Cards for Student */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <span className="text-[11px] font-bold uppercase text-sumi-charcoal">Total Sesi</span>
          <div className="text-2xl sm:text-3xl font-black text-sumi mt-1">{studentResults.length}</div>
          <span className="text-[10px] text-sumi-muted mt-1 block">Latihan tuntas</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <span className="text-[11px] font-bold uppercase text-sumi-charcoal">Rata-rata Skor</span>
          <div className="text-2xl sm:text-3xl font-black text-crimson mt-1">{avgScore || '-'}</div>
          <span className="text-[10px] text-sumi-muted mt-1 block">Target Lulus: ≥ 80.0</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <span className="text-[11px] font-bold uppercase text-sumi-charcoal">Rata-rata Waktu</span>
          <div className="text-2xl sm:text-3xl font-black text-sumi font-mono mt-1">
            {formatTimeSeconds(avgTimeSeconds)}
          </div>
          <span className="text-[10px] text-sumi-muted mt-1 block">Per paket modul</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sumi-border shadow-card">
          <span className="text-[11px] font-bold uppercase text-sumi-charcoal">Aktivitas Terakhir</span>
          <div className="text-sm sm:text-base font-bold text-sumi mt-2 truncate">
            {studentResults[0]?.completed_at
              ? new Date(studentResults[0].completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
              : 'Belum ada'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Tercatat Aktif</span>
        </div>
      </div>

      {/* Progression Chart */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-extrabold text-sumi uppercase tracking-wider">
            Kurva Tren Perkembangan Skor (Pre-Test ke Post-Test)
          </h3>
          <p className="text-xs text-sumi-charcoal mt-0.5">
            Memantau kenaikan pemahaman materi antar paket soal secara longitudinal.
          </p>
        </div>
        <div className="pt-2">
          <TrendLineChart data={trendData} height={140} />
        </div>
      </div>

      {/* Sensei Direct Feedback Note Box */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-crimson" />
            <h3 className="text-sm font-extrabold text-sumi uppercase tracking-wider">
              Catatan Evaluasi Khusus Sensei (Untuk Tatap Muka)
            </h3>
          </div>
          {isSavedNote && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan
            </span>
          )}
        </div>

        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tuliskan catatan khusus untuk siswa ini..."
          className="w-full p-3.5 rounded-xl border border-sumi-border text-xs leading-relaxed focus:outline-none focus:border-crimson"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Catatan Bimbingan</span>
          </button>
        </div>
      </div>

      {/* Chronological History Table */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-sumi uppercase tracking-wider">
          Riwayat Kronologis Latihan Siswa
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sumi-border text-sumi-charcoal font-bold uppercase">
                <th className="pb-3 px-3">Waktu Selesai</th>
                <th className="pb-3 px-3">Cabang Lomba</th>
                <th className="pb-3 px-3">Paket Materi</th>
                <th className="pb-3 px-3 text-center">Durasi</th>
                <th className="pb-3 px-3 text-right">Skor</th>
                <th className="pb-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sumi-border">
              {studentResults.map((r) => {
                const meta = CATEGORIES_META[r.category];
                return (
                  <tr key={r.id}>
                    <td className="py-3 px-3 text-sumi-charcoal whitespace-nowrap">
                      {new Date(r.completed_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 font-bold text-sumi">
                      {meta?.name || r.category}
                    </td>
                    <td className="py-3 px-3 text-sumi max-w-xs truncate">
                      {r.set_title || 'Paket Latihan'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {formatTimeSeconds(r.time_spent_seconds)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {r.score !== null ? (
                        <span className={`font-black text-sm ${r.score >= 80 ? 'text-crimson' : 'text-sumi'}`}>
                          {r.score}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Mandiri
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
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
      </div>
    </div>
  );
}
