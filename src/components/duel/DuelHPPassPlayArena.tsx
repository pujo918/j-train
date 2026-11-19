'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '@/types';
import {
  Smartphone,
  Clock,
  Flame,
  Check,
  X,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { playCorrectSound, playWrongSound } from '@/lib/utils/duelAudio';
import {
  DuelConfig,
  DuelMatchSummary,
  DuelPlayerStats,
  DuelRoundHistoryItem,
} from './types';

interface DuelHPPassPlayArenaProps {
  config: DuelConfig;
  questions: Question[];
  onFinish: (summary: DuelMatchSummary) => void;
  onExit: () => void;
}

type PassPlayPhase = 'p1_turn' | 'handoff' | 'p2_turn';

interface PlayerAnswerRecord {
  key: string;
  correct: boolean;
  delta: number;
  responseMs: number;
}

const QUESTION_SECONDS = 15;

export const DuelHPPassPlayArena: React.FC<DuelHPPassPlayArenaProps> = ({
  config,
  questions,
  onFinish,
  onExit,
}) => {
  const [phase, setPhase] = useState<PassPlayPhase>('p1_turn');
  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    delta: number;
  } | null>(null);

  const [p1Records, setP1Records] = useState<PlayerAnswerRecord[]>([]);
  const [p2Records, setP2Records] = useState<PlayerAnswerRecord[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  const questionStartRef = useRef<number>(Date.now());
  const isTransitioningRef = useRef<boolean>(false);

  const p1Name = config.player1Name.trim() || 'Player 1';
  const p2Name = config.player2Name.trim() || 'Player 2';
  const activeName = phase === 'p1_turn' ? p1Name : p2Name;
  const currentQuestion = questions[roundIdx];

  const computeStats = (
    name: string,
    records: PlayerAnswerRecord[]
  ): DuelPlayerStats => {
    let score = 0;
    let correct = 0;
    let wrong = 0;
    let streak = 0;
    let maxStreak = 0;
    let totalResponseMs = 0;

    for (const r of records) {
      score += r.delta;
      totalResponseMs += r.responseMs;
      if (r.correct) {
        correct += 1;
        streak += 1;
        if (streak > maxStreak) maxStreak = streak;
      } else {
        wrong += 1;
        streak = 0;
      }
    }

    return {
      name,
      score,
      correct,
      wrong,
      maxStreak,
      totalResponseMs,
      answeredCount: records.length,
    };
  };

  const handleSelect = useCallback(
    (optionKey: string | null) => {
      if (isTransitioningRef.current || phase === 'handoff') return;
      isTransitioningRef.current = true;

      const elapsedMs = Date.now() - questionStartRef.current;
      const isCorrect =
        optionKey !== null && optionKey === currentQuestion.correct_key;
      const speedBonus = isCorrect ? timeLeft * 2 : 0;
      const delta = isCorrect ? 100 + speedBonus : -50;

      setSelectedKey(optionKey ?? 'TIMEOUT');
      setLastFeedback({ correct: isCorrect, delta });
      setCurrentScore((prev) => prev + delta);
      setCurrentStreak((prev) => (isCorrect ? prev + 1 : 0));

      if (config.soundEnabled) {
        if (isCorrect) playCorrectSound();
        else playWrongSound();
      }

      const record: PlayerAnswerRecord = {
        key: optionKey ?? 'TIMEOUT',
        correct: isCorrect,
        delta,
        responseMs: elapsedMs,
      };

      const isLast = roundIdx >= questions.length - 1;

      setTimeout(() => {
        if (phase === 'p1_turn') {
          const nextP1 = [...p1Records, record];
          setP1Records(nextP1);

          if (isLast) {
            setPhase('handoff');
            setSelectedKey(null);
            setLastFeedback(null);
            isTransitioningRef.current = false;
          } else {
            setRoundIdx((prev) => prev + 1);
            setTimeLeft(QUESTION_SECONDS);
            setSelectedKey(null);
            setLastFeedback(null);
            questionStartRef.current = Date.now();
            isTransitioningRef.current = false;
          }
        } else if (phase === 'p2_turn') {
          const nextP2 = [...p2Records, record];
          setP2Records(nextP2);

          if (isLast) {
            const p1Stats = computeStats(p1Name, p1Records);
            const p2Stats = computeStats(p2Name, nextP2);
            const history: DuelRoundHistoryItem[] = questions.map((q, idx) => {
              const r1 = p1Records[idx];
              const r2 = nextP2[idx];
              let winner: 1 | 2 | 'both' | 'none' = 'none';
              if (r1?.correct && r2?.correct) winner = 'both';
              else if (r1?.correct) winner = 1;
              else if (r2?.correct) winner = 2;

              return {
                question: q,
                p1Answer: r1?.key,
                p2Answer: r2?.key,
                p1Correct: r1?.correct,
                p2Correct: r2?.correct,
                winner,
                p1PointsDelta: r1?.delta ?? 0,
                p2PointsDelta: r2?.delta ?? 0,
              };
            });

            onFinish({
              config,
              player1: p1Stats,
              player2: p2Stats,
              history,
            });
          } else {
            setRoundIdx((prev) => prev + 1);
            setTimeLeft(QUESTION_SECONDS);
            setSelectedKey(null);
            setLastFeedback(null);
            questionStartRef.current = Date.now();
            isTransitioningRef.current = false;
          }
        }
      }, 850);
    },
    [
      phase,
      currentQuestion,
      timeLeft,
      config,
      roundIdx,
      questions,
      p1Records,
      p2Records,
      p1Name,
      p2Name,
      onFinish,
    ]
  );

  useEffect(() => {
    if (phase === 'handoff' || selectedKey !== null) return;
    if (timeLeft <= 0) {
      handleSelect(null);
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [phase, timeLeft, selectedKey, handleSelect]);

  const startPlayer2Turn = () => {
    setPhase('p2_turn');
    setRoundIdx(0);
    setTimeLeft(QUESTION_SECONDS);
    setSelectedKey(null);
    setLastFeedback(null);
    setCurrentScore(0);
    setCurrentStreak(0);
    questionStartRef.current = Date.now();
    isTransitioningRef.current = false;
  };

  if (phase === 'handoff') {
    return (
      <div className="max-w-lg mx-auto py-8">
        <div className="bg-sumi text-white rounded-3xl p-7 sm:p-9 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-9xl font-jp font-black text-white/[0.04] select-none pointer-events-none">
            交代
          </div>

          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-7 h-7" />
          </div>

          <div className="space-y-2 relative">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-bold tracking-wider uppercase">
              Giliran {p1Name} Selesai
            </span>
            <h2 className="text-2xl font-black">
              Serahkan HP ke {p2Name}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Skor {p1Name} dikunci dan dirahasiakan sementara. Sekarang giliran{' '}
              <span className="text-white font-bold">{p2Name}</span> mengerjakan {questions.length} soal yang sama.
            </p>
          </div>

          <button
            type="button"
            onClick={startPlayer2Turn}
            className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors relative"
          >
            <span>Mulai Giliran {p2Name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isP1 = phase === 'p1_turn';
  const isCritical = timeLeft <= 4 && selectedKey === null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Compact Dark HUD */}
      <div className="bg-sumi text-white rounded-3xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExit}
              aria-label="Keluar dari Duel"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black tracking-widest uppercase ${
                    isP1 ? 'text-crimson-scarlet' : 'text-sky-400'
                  }`}
                >
                  {isP1 ? 'Player 1' : 'Player 2'} • {roundIdx + 1}/{questions.length}
                </span>
                {currentStreak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-400">
                    <Flame className="w-3 h-3 fill-current" />
                    {currentStreak}x
                  </span>
                )}
              </div>
              <p className="text-base font-extrabold truncate">{activeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-black tabular-nums">{currentScore}</span>
            <div
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1 font-black text-xs tabular-nums ${
                isCritical
                  ? 'bg-crimson text-white animate-pulse'
                  : 'bg-white/10 text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/10">
          <div
            className={`h-full transition-all duration-300 ${
              isP1 ? 'bg-crimson-scarlet' : 'bg-sky-400'
            }`}
            style={{ width: `${((roundIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-7 space-y-5">
        <div className="text-base sm:text-xl font-bold text-sumi leading-relaxed whitespace-pre-line font-jp">
          {currentQuestion.question_text}
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isPicked = selectedKey === opt.key;
            const isRevealed = selectedKey !== null;
            const isCorrectOpt = isRevealed && opt.key === currentQuestion.correct_key;
            const isWrongPick = isRevealed && isPicked && !isCorrectOpt;

            let btnStyle =
              'bg-white border-sumi-border hover:border-sumi text-sumi active:scale-[0.99]';
            if (isCorrectOpt) {
              btnStyle =
                'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
            } else if (isWrongPick) {
              btnStyle =
                'bg-red-50 border-red-500 text-red-900 font-bold';
            }

            return (
              <button
                key={opt.key}
                type="button"
                disabled={isRevealed}
                onClick={() => handleSelect(opt.key)}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all touch-target ${btnStyle}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isCorrectOpt
                      ? 'bg-emerald-500 text-white'
                      : isWrongPick
                      ? 'bg-red-500 text-white'
                      : 'bg-sumi text-white'
                  }`}
                >
                  {isCorrectOpt ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isWrongPick ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    opt.key
                  )}
                </div>
                <div className="flex-1 pt-0.5 text-sm sm:text-base font-jp leading-snug">
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {lastFeedback && (
          <div
            className={`py-2.5 px-4 rounded-xl text-center text-xs font-extrabold ${
              lastFeedback.correct
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {lastFeedback.correct
              ? `Benar • +${lastFeedback.delta} Poin`
              : `Salah • ${lastFeedback.delta} Poin`}
          </div>
        )}
      </div>
    </div>
  );
};
