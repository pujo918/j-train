'use client';

import React, { useEffect } from 'react';
import { Award, Clock, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { formatTimeSeconds } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface QuizSummaryModalProps {
  isOpen: boolean;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  onReview: () => void;
  onRetry: () => void;
  onClose: () => void;
  categoryTitle: string;
}

export const QuizSummaryModal: React.FC<QuizSummaryModalProps> = ({
  isOpen,
  score,
  correctAnswers,
  totalQuestions,
  timeSpentSeconds,
  onReview,
  onRetry,
  onClose,
  categoryTitle,
}) => {
  useEffect(() => {
    if (isOpen && score >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B91C1C', '#DC2626', '#FAF7F2', '#111827'],
      });
    }
  }, [isOpen, score]);

  if (!isOpen) return null;

  const isPassed = score >= 80;
  const isModerate = score >= 65 && score < 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sumi-border text-center space-y-6 animate-in zoom-in-95 duration-150 relative">
        {/* Japanese Stamp / Award Badge */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-washi border border-sumi-border flex items-center justify-center shadow-inner">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm ${
              isPassed ? 'bg-crimson' : isModerate ? 'bg-amber-600' : 'bg-sumi-charcoal'
            }`}
          >
            {score.toFixed(0)}
          </div>
          <span className="absolute -top-2 -right-2 text-2xl">
            {isPassed ? '🏆' : isModerate ? '🎖️' : '📝'}
          </span>
        </div>

        {/* Title & Feedback */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-sumi">
            {isPassed
              ? 'Luar Biasa! Siap Bersaing!'
              : isModerate
              ? 'Hasil Cukup Bagus, Terus Tingkatkan!'
              : 'Perlu Latihan Tambahan'}
          </h3>
          <p className="text-xs sm:text-sm text-sumi-charcoal max-w-sm mx-auto">
            {isPassed
              ? `Penguasaan materi ${categoryTitle} Anda telah memenuhi ambang batas kontingen MAN 1 Pasuruan (≥80).`
              : isModerate
              ? `Skor Anda sudah berkembang. Cek pembahasan di bawah untuk memantapkan konsep yang keliru.`
              : `Sensei menyarankan Anda mempelajari kembali catatan dan glosarium sebelum mengulang latihan.`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-washi border border-sumi-border">
          <div className="text-center">
            <div className="flex items-center justify-center text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-sumi">{correctAnswers}</div>
            <div className="text-[10px] font-semibold text-sumi-muted">Benar</div>
          </div>

          <div className="text-center border-x border-sumi-border">
            <div className="flex items-center justify-center text-red-500 mb-1">
              <XCircle className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-sumi">{totalQuestions - correctAnswers}</div>
            <div className="text-[10px] font-semibold text-sumi-muted">Salah</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center text-sumi-charcoal mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-sumi font-mono">
              {formatTimeSeconds(timeSpentSeconds)}
            </div>
            <div className="text-[10px] font-semibold text-sumi-muted">Durasi</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onReview}
            className="w-full py-3.5 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 touch-target hover:scale-[1.01] active:scale-[0.98]"
          >
            <BookOpen className="w-4 h-4" />
            <span>Lihat Pembahasan Soal & Kunci Jawaban</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetry}
              className="flex-1 py-3 bg-washi hover:bg-sumi-light text-sumi font-semibold text-xs rounded-xl border border-sumi-border transition-colors flex items-center justify-center gap-1.5 touch-target"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Kuis</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white hover:bg-sumi-light text-sumi font-semibold text-xs rounded-xl border border-sumi-border transition-colors flex items-center justify-center gap-1.5 touch-target"
            >
              <span>Beranda Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
