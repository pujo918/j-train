'use client';

import React, { useEffect, useState } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface QuizTimerProps {
  initialSeconds: number; // total duration in seconds
  onTimeout: () => void;
  isPaused?: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  initialSeconds,
  onTimeout,
  isPaused = false,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, onTimeout]);

  const percentage = (secondsLeft / initialSeconds) * 100;
  const isCritical = percentage <= 20; // 20% or less

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full bg-white rounded-2xl border border-sumi-border p-3.5 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <Timer className={`w-4 h-4 ${isCritical ? 'text-crimson animate-bounce' : 'text-sumi-charcoal'}`} />
          <span className="text-sumi uppercase tracking-wider text-[11px]">Waktu Tersisa:</span>
        </div>
        <div
          className={`font-mono text-sm sm:text-base font-black px-2.5 py-0.5 rounded-lg transition-colors ${
            isCritical ? 'bg-crimson text-white animate-pulse' : 'bg-sumi-light text-sumi'
          }`}
        >
          {formattedTime}
        </div>
      </div>

      {/* Progress Bar that shrinks and changes to Crimson when <= 20% */}
      <div className="h-2.5 w-full bg-sumi-light rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isCritical ? 'bg-crimson animate-pulse' : 'bg-emerald-600'
          }`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>

      {isCritical && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-crimson animate-pulse">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span>Waktu tersisa kurang dari 20%! Jawaban akan otomatis terkirim jika waktu habis.</span>
        </div>
      )}
    </div>
  );
};
