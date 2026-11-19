'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { playVictorySound } from '@/lib/utils/duelAudio';
import { DuelMatchSummary } from './types';

interface DuelResultProps {
  summary: DuelMatchSummary;
  onRematch: () => void;
  onBackToLobby: () => void;
}

export const DuelResult: React.FC<DuelResultProps> = ({
  summary,
  onRematch,
  onBackToLobby,
}) => {
  const [showReview, setShowReview] = useState(false);
  const { player1, player2, history, config } = summary;

  const isDraw = player1.score === player2.score;
  const winner = isDraw ? null : player1.score > player2.score ? player1 : player2;
  const winnerSide = isDraw ? null : player1.score > player2.score ? 1 : 2;

  useEffect(() => {
    if (config.soundEnabled) playVictorySound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B91C1C', '#0284C7', '#10B981', '#F59E0B'],
    });
  }, [config.soundEnabled]);

  const formatAvgSeconds = (totalMs: number, count: number) => {
    if (count === 0) return '—';
    return `${(totalMs / count / 1000).toFixed(1)}s`;
  };

  const formatAccuracy = (correct: number, count: number) => {
    if (count === 0) return '0%';
    return `${Math.round((correct / count) * 100)}%`;
  };

  const statRows = [
    {
      label: 'Jawaban Benar',
      p1: `${player1.correct}`,
      p2: `${player2.correct}`,
    },
    {
      label: 'Jawaban Salah',
      p1: `${player1.wrong}`,
      p2: `${player2.wrong}`,
    },
    {
      label: 'Akurasi',
      p1: formatAccuracy(player1.correct, player1.answeredCount),
      p2: formatAccuracy(player2.correct, player2.answeredCount),
    },
    {
      label: 'Rata-rata Waktu',
      p1: formatAvgSeconds(player1.totalResponseMs, player1.answeredCount),
      p2: formatAvgSeconds(player2.totalResponseMs, player2.answeredCount),
    },
    {
      label: 'Streak Terbaik',
      p1: `${player1.maxStreak}x`,
      p2: `${player2.maxStreak}x`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* DARK SUMI WINNER STAGE */}
      <div className="bg-sumi text-white rounded-3xl p-7 sm:p-9 relative overflow-hidden shadow-xl">
        <div className="absolute right-6 -bottom-8 text-[120px] font-jp font-black text-white/[0.04] select-none pointer-events-none leading-none">
          勝利
        </div>

        <div className="text-center space-y-3 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-bold tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Hasil Akhir •{' '}
              {config.deviceMode === 'pc_buzzer' ? 'PC Buzzer' : 'HP Bergantian'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isDraw ? 'Pertandingan Seri' : `${winner?.name} Menang`}
          </h1>

          <p className="text-sm text-white/65">
            {isDraw
              ? 'Skor akhir keduanya seimbang.'
              : `Unggul ${Math.abs(player1.score - player2.score)} poin atas ${
                  winnerSide === 1 ? player2.name : player1.name
                }.`}
          </p>

          {/* Big Final Scoreline */}
          <div className="mt-5 max-w-md mx-auto grid grid-cols-11 items-center bg-white/[0.06] border border-white/10 rounded-2xl p-4">
            <div className="col-span-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-crimson-scarlet block truncate">
                {player1.name}
              </span>
              <span className="text-3xl sm:text-4xl font-black tabular-nums">
                {player1.score}
              </span>
            </div>
            <div className="col-span-1 text-center text-white/30 font-black text-lg">
              —
            </div>
            <div className="col-span-5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block truncate">
                {player2.name}
              </span>
              <span className="text-3xl sm:text-4xl font-black tabular-nums">
                {player2.score}
              </span>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onRematch}
              className="px-6 py-3 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-extrabold text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tanding Ulang</span>
            </button>

            <button
              type="button"
              onClick={onBackToLobby}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Kembali ke Lobby</span>
            </button>
          </div>
        </div>
      </div>

      {/* UNIFIED HEAD-TO-HEAD COMPARISON TABLE */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-sumi-border flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-crimson">
            {player1.name}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-sumi-muted">
            Statistik Head-to-Head
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">
            {player2.name}
          </span>
        </div>

        <div className="divide-y divide-sumi-border/60">
          {statRows.map((row) => (
            <div
              key={row.label}
              className="px-6 py-3.5 grid grid-cols-3 items-center text-sm"
            >
              <span className="font-black text-sumi tabular-nums">{row.p1}</span>
              <span className="text-center text-xs font-semibold text-sumi-muted">
                {row.label}
              </span>
              <span className="text-right font-black text-sumi tabular-nums">
                {row.p2}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EXPANDABLE QUESTION REVIEW */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowReview((v) => !v)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-washi/60 transition-colors"
        >
          <div>
            <h3 className="text-sm font-extrabold text-sumi">
              Pembahasan {history.length} Soal Duel
            </h3>
            <p className="text-xs text-sumi-muted">
              Lihat kunci jawaban dan penjelasan setiap ronde
            </p>
          </div>
          {showReview ? (
            <ChevronUp className="w-5 h-5 text-sumi-charcoal" />
          ) : (
            <ChevronDown className="w-5 h-5 text-sumi-charcoal" />
          )}
        </button>

        {showReview && (
          <div className="px-6 pb-6 space-y-3 border-t border-sumi-border pt-4">
            {history.map((item, idx) => {
              const correctOpt = item.question.options.find(
                (o) => o.key === item.question.correct_key
              );
              return (
                <div
                  key={`${item.question.id}-${idx}`}
                  className="p-4 rounded-2xl bg-washi/60 border border-sumi-border/80 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black text-sumi-muted uppercase tracking-wider">
                      Ronde {idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      {item.p1PointsDelta !== 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            item.p1PointsDelta > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {player1.name}:{' '}
                          {item.p1PointsDelta > 0
                            ? `+${item.p1PointsDelta}`
                            : item.p1PointsDelta}
                        </span>
                      )}
                      {item.p2PointsDelta !== 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-md ${
                            item.p2PointsDelta > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {player2.name}:{' '}
                          {item.p2PointsDelta > 0
                            ? `+${item.p2PointsDelta}`
                            : item.p2PointsDelta}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-bold text-sumi font-jp whitespace-pre-line">
                    {item.question.question_text}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-jp">
                      Kunci {item.question.correct_key}: {correctOpt?.text}
                    </span>
                  </div>

                  {item.question.explanation && (
                    <p className="text-xs text-sumi-charcoal leading-relaxed">
                      {item.question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
