'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const onTimeoutRef = useRef(onTimeout);
  const hasTimedOutRef = useRef(false);

  // Keep latest callback without restarting the interval
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    hasTimedOutRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasTimedOutRef.current) {
            hasTimedOutRef.current = true;
            setTimeout(() => onTimeoutRef.current(), 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, initialSeconds]);

  const percentage = initialSeconds > 0 ? (secondsLeft / initialSeconds) * 100 : 0;
  const isCritical = percentage <= 20; // 20% or less

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-white/85 p-3.5 shadow-sm space-y-2">
      <div className="flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <Timer className={`w-4 h-4 ${isCritical ? 'text-crimson animate-bounce' : 'text-sumi-charcoal'}`} />
          <span className="text-sumi uppercase tracking-wider text-[11px]">Waktu Tersisa:</span>
        </div>
        <div
          className={`font-mono text-sm sm:text-base font-black px-2.5 py-0.5 rounded-lg transition-colors tabular-nums ${
            isCritical ? 'bg-crimson text-white animate-pulse' : 'bg-sumi/10 text-sumi'
          }`}
        >
          {formattedTime}
        </div>
      </div>

      {/* Progress Bar that shrinks and changes to Crimson when <= 20% */}
      <div className="h-2.5 w-full bg-sumi/10 rounded-full overflow-hidden p-0.5">
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
