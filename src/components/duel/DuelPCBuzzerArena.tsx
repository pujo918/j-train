'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from '@/types';
import {
  Bell,
  Check,
  X,
  Flame,
  Clock,
  ArrowRight,
  Info,
  Trophy,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { detectBuzzerPlayer } from '@/lib/utils/keyboardSplit';
import {
  playBuzzSound,
  playCorrectSound,
  playWrongSound,
} from '@/lib/utils/duelAudio';
import {
  DuelConfig,
  DuelMatchSummary,
  DuelPlayerStats,
  DuelRoundHistoryItem,
} from './types';

interface DuelPCBuzzerArenaProps {
  config: DuelConfig;
  questions: Question[];
  onFinish: (summary: DuelMatchSummary) => void;
  onExit: () => void;
}

type RoundPhase = 'waiting_buzz' | 'answering' | 'revealed';

const BUZZ_SECONDS = 15;
const ANSWER_SECONDS = 7;
const STEAL_SECONDS = 6;

export const DuelPCBuzzerArena: React.FC<DuelPCBuzzerArenaProps> = ({
  config,
  questions,
  onFinish,
  onExit,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [phase, setPhase] = useState<RoundPhase>('waiting_buzz');
  const [activePlayer, setActivePlayer] = useState<1 | 2 | null>(null);
  const [isStealTurn, setIsStealTurn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BUZZ_SECONDS);

  const [p1Pick, setP1Pick] = useState<string | undefined>(undefined);
  const [p2Pick, setP2Pick] = useState<string | undefined>(undefined);
  const [eliminatedKeys, setEliminatedKeys] = useState<string[]>([]);
  const [roundBanner, setRoundBanner] = useState<{
    tone: 'emerald' | 'red' | 'amber' | 'neutral';
    text: string;
  } | null>(null);
  const [lastDelta, setLastDelta] = useState<{ p1?: number; p2?: number }>({});

  const [p1Stats, setP1Stats] = useState<DuelPlayerStats>({
    name: config.player1Name.trim() || 'Player 1',
    score: 0,
    correct: 0,
    wrong: 0,
    maxStreak: 0,
    totalResponseMs: 0,
    answeredCount: 0,
  });
  const [p2Stats, setP2Stats] = useState<DuelPlayerStats>({
    name: config.player2Name.trim() || 'Player 2',
    score: 0,
    correct: 0,
    wrong: 0,
    maxStreak: 0,
    totalResponseMs: 0,
    answeredCount: 0,
  });
  const [p1Streak, setP1Streak] = useState(0);
  const [p2Streak, setP2Streak] = useState(0);
  const [history, setHistory] = useState<DuelRoundHistoryItem[]>([]);

  const roundStartRef = useRef<number>(Date.now());
  const buzzLockUntilRef = useRef<number>(0);
  const currentRoundDeltaRef = useRef<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const p1PickRef = useRef<string | undefined>(undefined);
  const p2PickRef = useRef<string | undefined>(undefined);

  const currentQuestion = questions[roundIdx];
  const isLastRound = roundIdx >= questions.length - 1;
  const maxSeconds =
    phase === 'waiting_buzz'
      ? BUZZ_SECONDS
      : isStealTurn
      ? STEAL_SECONDS
      : ANSWER_SECONDS;

  const finalizeRound = useCallback(
    (
      winner: 1 | 2 | 'none',
      banner: { tone: 'emerald' | 'red' | 'amber' | 'neutral'; text: string }
    ) => {
      setPhase('revealed');
      setRoundBanner(banner);
      setHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          p1Answer: p1PickRef.current,
          p2Answer: p2PickRef.current,
          p1Correct: p1PickRef.current
            ? p1PickRef.current === currentQuestion.correct_key
            : undefined,
          p2Correct: p2PickRef.current
            ? p2PickRef.current === currentQuestion.correct_key
            : undefined,
          winner,
          p1PointsDelta: currentRoundDeltaRef.current.p1,
          p2PointsDelta: currentRoundDeltaRef.current.p2,
        },
      ]);
    },
    [currentQuestion]
  );

  const triggerBuzz = useCallback(
    (player: 1 | 2) => {
      if (phase !== 'waiting_buzz') return;
      if (config.soundEnabled) playBuzzSound(player);
      setActivePlayer(player);
      setIsStealTurn(false);
      setPhase('answering');
      setTimeLeft(ANSWER_SECONDS);
      buzzLockUntilRef.current = Date.now() + 260;
      setRoundBanner(null);
    },
    [phase, config.soundEnabled]
  );

  const handleAnswer = useCallback(
    (optionKey: string | null) => {
      if (phase !== 'answering' || !activePlayer) return;
      if (optionKey !== null && eliminatedKeys.includes(optionKey)) return;

      const elapsedMs = Date.now() - roundStartRef.current;
      const isCorrect = optionKey !== null && optionKey === currentQuestion.correct_key;
      const responderName = activePlayer === 1 ? p1Stats.name : p2Stats.name;
      const otherPlayer: 1 | 2 = activePlayer === 1 ? 2 : 1;
      const otherName = otherPlayer === 1 ? p1Stats.name : p2Stats.name;

      if (activePlayer === 1) {
        setP1Pick(optionKey ?? 'TIMEOUT');
        p1PickRef.current = optionKey ?? 'TIMEOUT';
      } else {
        setP2Pick(optionKey ?? 'TIMEOUT');
        p2PickRef.current = optionKey ?? 'TIMEOUT';
      }

      if (isCorrect) {
        if (config.soundEnabled) playCorrectSound();
        if (activePlayer === 1) {
          const nextStreak = p1Streak + 1;
          setP1Streak(nextStreak);
          setP1Stats((prev) => ({
            ...prev,
            score: prev.score + 100,
            correct: prev.correct + 1,
            maxStreak: Math.max(prev.maxStreak, nextStreak),
            totalResponseMs: prev.totalResponseMs + elapsedMs,
            answeredCount: prev.answeredCount + 1,
          }));
          currentRoundDeltaRef.current.p1 += 100;
          setLastDelta({ p1: 100 });
        } else {
          const nextStreak = p2Streak + 1;
          setP2Streak(nextStreak);
          setP2Stats((prev) => ({
            ...prev,
            score: prev.score + 100,
            correct: prev.correct + 1,
            maxStreak: Math.max(prev.maxStreak, nextStreak),
            totalResponseMs: prev.totalResponseMs + elapsedMs,
            answeredCount: prev.answeredCount + 1,
          }));
          currentRoundDeltaRef.current.p2 += 100;
          setLastDelta({ p2: 100 });
        }

        finalizeRound(activePlayer, {
          tone: 'emerald',
          text: `Benar — ${responderName} mendapatkan +100 poin`,
        });
      } else {
        if (config.soundEnabled) playWrongSound();
        if (activePlayer === 1) {
          setP1Streak(0);
          setP1Stats((prev) => ({
            ...prev,
            score: prev.score - 50,
            wrong: prev.wrong + 1,
            totalResponseMs: prev.totalResponseMs + elapsedMs,
            answeredCount: prev.answeredCount + 1,
          }));
          currentRoundDeltaRef.current.p1 -= 50;
          setLastDelta({ p1: -50 });
        } else {
          setP2Streak(0);
          setP2Stats((prev) => ({
            ...prev,
            score: prev.score - 50,
            wrong: prev.wrong + 1,
            totalResponseMs: prev.totalResponseMs + elapsedMs,
            answeredCount: prev.answeredCount + 1,
          }));
          currentRoundDeltaRef.current.p2 -= 50;
          setLastDelta({ p2: -50 });
        }

        if (optionKey) {
          setEliminatedKeys((prev) => [...prev, optionKey]);
        }

        if (config.enableSteal && !isStealTurn) {
          setActivePlayer(otherPlayer);
          setIsStealTurn(true);
          setTimeLeft(STEAL_SECONDS);
          buzzLockUntilRef.current = Date.now() + 250;
          setRoundBanner({
            tone: 'amber',
            text: `${responderName} ${optionKey ? 'salah' : 'kehabisan waktu'} (-50) — Kesempatan lempar untuk ${otherName}`,
          });
        } else {
          finalizeRound('none', {
            tone: 'red',
            text: `${responderName} ${optionKey ? 'salah menjawab' : 'kehabisan waktu'} (-50)`,
          });
        }
      }
    },
    [
      phase,
      activePlayer,
      eliminatedKeys,
      currentQuestion,
      p1Stats.name,
      p2Stats.name,
      p1Streak,
      p2Streak,
      config.soundEnabled,
      config.enableSteal,
      isStealTurn,
      finalizeRound,
    ]
  );

  const handleNextRound = useCallback(() => {
    if (isLastRound) {
      onFinish({
        config,
        player1: p1Stats,
        player2: p2Stats,
        history,
      });
      return;
    }

    setRoundIdx((prev) => prev + 1);
    setPhase('waiting_buzz');
    setActivePlayer(null);
    setIsStealTurn(false);
    setTimeLeft(BUZZ_SECONDS);
    setP1Pick(undefined);
    setP2Pick(undefined);
    p1PickRef.current = undefined;
    p2PickRef.current = undefined;
    setEliminatedKeys([]);
    setRoundBanner(null);
    setLastDelta({});
    currentRoundDeltaRef.current = { p1: 0, p2: 0 };
    roundStartRef.current = Date.now();
  }, [isLastRound, onFinish, config, p1Stats, p2Stats, history]);

  useEffect(() => {
    if (phase === 'revealed') return;
    if (timeLeft <= 0) {
      if (phase === 'waiting_buzz') {
        if (config.soundEnabled) playWrongSound();
        finalizeRound('none', {
          tone: 'neutral',
          text: 'Waktu habis — tidak ada pemain yang menekan bel',
        });
      } else if (phase === 'answering') {
        handleAnswer(null);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phase, timeLeft, config.soundEnabled, finalizeRound, handleAnswer]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (phase === 'waiting_buzz') {
        const player = detectBuzzerPlayer(e.code);
        if (player) {
          e.preventDefault();
          triggerBuzz(player);
        }
        return;
      }

      if (phase === 'answering') {
        if (Date.now() < buzzLockUntilRef.current) return;
        const idxMap: Record<string, number> = {
          Digit1: 0,
          Numpad1: 0,
          Digit2: 1,
          Numpad2: 1,
          Digit3: 2,
          Numpad3: 2,
          Digit4: 3,
          Numpad4: 3,
        };
        const idx = idxMap[e.code];
        if (idx !== undefined && currentQuestion.options[idx]) {
          e.preventDefault();
          handleAnswer(currentQuestion.options[idx].key);
        }
        return;
      }

      if (phase === 'revealed' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        handleNextRound();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, triggerBuzz, handleAnswer, handleNextRound, currentQuestion]);

  const isTimerCritical = timeLeft <= 3 && phase !== 'revealed';
  const timerPercent = phase === 'revealed' ? 0 : (timeLeft / maxSeconds) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* UNIFIED ESPORTS HUD SCOREBOARD */}
      <div className="bg-sumi text-white rounded-3xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 grid grid-cols-12 gap-3 items-center">
          {/* P1 Side */}
          <div
            className={`col-span-5 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all ${
              activePlayer === 1 && phase === 'answering'
                ? 'bg-crimson border-crimson-scarlet shadow-float'
                : 'bg-white/[0.05] border-white/10'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-white/70">
                  P1 • KIRI
                </span>
                {p1Streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-400">
                    <Flame className="w-3 h-3 fill-current" />
                    {p1Streak}x
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-extrabold truncate">
                {p1Stats.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {lastDelta.p1 !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-black tabular-nums ${
                    lastDelta.p1 > 0
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {lastDelta.p1 > 0 ? `+${lastDelta.p1}` : lastDelta.p1}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-black tabular-nums">
                {p1Stats.score}
              </span>
            </div>
          </div>

          {/* Center Round + Timer + Exit */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-white/40 hover:text-white/80 mb-1 transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Keluar</span>
            </button>
            <div className="text-[11px] font-extrabold tracking-widest uppercase text-white/60">
              {roundIdx + 1} / {questions.length}
            </div>
            <div
              className={`mt-0.5 inline-flex items-center gap-1 text-sm font-black tabular-nums ${
                isTimerCritical ? 'text-crimson-scarlet animate-pulse' : 'text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* P2 Side */}
          <div
            className={`col-span-5 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all ${
              activePlayer === 2 && phase === 'answering'
                ? 'bg-sky-600 border-sky-400 shadow-md'
                : 'bg-white/[0.05] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tabular-nums">
                {p2Stats.score}
              </span>
              {lastDelta.p2 !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-black tabular-nums ${
                    lastDelta.p2 > 0
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {lastDelta.p2 > 0 ? `+${lastDelta.p2}` : lastDelta.p2}
                </span>
              )}
            </div>

            <div className="min-w-0 text-right">
              <div className="flex items-center justify-end gap-2">
                {p2Streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-400">
                    <Flame className="w-3 h-3 fill-current" />
                    {p2Streak}x
                  </span>
                )}
                <span className="text-[10px] font-black tracking-widest uppercase text-white/70">
                  KANAN • P2
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold truncate">
                {p2Stats.name}
              </p>
            </div>
          </div>
        </div>

        {/* Sleek Timer Bar */}
        <div className="h-1.5 w-full bg-white/10">
          <div
            className={`h-full transition-all duration-700 ${
              isTimerCritical
                ? 'bg-crimson-scarlet'
                : activePlayer === 1
                ? 'bg-crimson-scarlet'
                : activePlayer === 2
                ? 'bg-sky-400'
                : 'bg-white/60'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* UNIFIED SINGLE-SCREEN QUESTION STAGE */}
      <div className="bg-white rounded-3xl border border-sumi-border shadow-card overflow-hidden">
        {/* Integrated Phase Strip */}
        <div
          className={`px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold border-b ${
            phase === 'waiting_buzz'
              ? 'bg-washi border-sumi-border text-sumi'
              : phase === 'answering'
              ? activePlayer === 1
                ? 'bg-crimson text-white border-crimson'
                : 'bg-sky-600 text-white border-sky-600'
              : roundBanner?.tone === 'emerald'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : roundBanner?.tone === 'red'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-sumi text-white border-sumi'
          }`}
        >
          {phase === 'waiting_buzz' && (
            <>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-crimson" />
                <span>SIAP REBUTAN — Tekan keyboard sisi KIRI ({p1Stats.name}) atau KANAN ({p2Stats.name})</span>
              </div>
              <span className="text-sumi-muted font-semibold">Benar +100 • Salah -50</span>
            </>
          )}

          {phase === 'answering' && activePlayer && (
            <>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {isStealTurn ? 'KESEMPATAN LEMPAR — ' : 'BEL TERKUNCI — '}
                  Giliran {activePlayer === 1 ? p1Stats.name : p2Stats.name} menjawab ({timeLeft}s)
                </span>
              </div>
              <span className="opacity-85 font-semibold">
                Klik opsi atau tekan angka 1–{currentQuestion.options.length}
              </span>
            </>
          )}

          {phase === 'revealed' && roundBanner && (
            <>
              <span>{roundBanner.text}</span>
              <span className="opacity-80 font-semibold">Tekan Spasi untuk lanjut</span>
            </>
          )}
        </div>

        {/* Question Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-lg sm:text-2xl font-bold text-sumi leading-relaxed whitespace-pre-line font-jp">
            {currentQuestion.question_text}
          </div>

          {/* 2x2 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQuestion.options.map((opt, idx) => {
              const isEliminated = eliminatedKeys.includes(opt.key);
              const isCorrect =
                phase === 'revealed' && opt.key === currentQuestion.correct_key;
              const isP1Pick = p1Pick === opt.key;
              const isP2Pick = p2Pick === opt.key;
              const isWrongRevealed =
                (phase === 'revealed' || isEliminated) &&
                (isP1Pick || isP2Pick) &&
                opt.key !== currentQuestion.correct_key;

              let cardStyle = 'bg-white border-sumi-border text-sumi';
              if (phase === 'waiting_buzz') {
                cardStyle =
                  'bg-washi/40 border-sumi-border/80 text-sumi-charcoal cursor-default';
              } else if (isCorrect) {
                cardStyle =
                  'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
              } else if (isWrongRevealed) {
                cardStyle =
                  'bg-red-50 border-red-400 text-red-900 line-through opacity-75';
              } else if (phase === 'answering') {
                cardStyle =
                  'bg-white border-sumi-border hover:border-sumi hover:bg-washi/60 text-sumi cursor-pointer active:scale-[0.99]';
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={phase !== 'answering' || isEliminated}
                  onClick={() => handleAnswer(opt.key)}
                  className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all ${cardStyle}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isWrongRevealed
                        ? 'bg-red-500 text-white'
                        : phase === 'answering'
                        ? 'bg-sumi text-white'
                        : 'bg-sumi-light text-sumi-charcoal'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isWrongRevealed ? (
                      <X className="w-4 h-4 stroke-[3]" />
                    ) : (
                      opt.key
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="text-sm sm:text-base font-jp leading-snug">
                      {opt.text}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {phase === 'answering' && !isEliminated && (
                        <span className="px-1.5 py-0.5 rounded bg-washi border border-sumi-border text-[10px] font-mono font-bold text-sumi-charcoal">
                          {idx + 1}
                        </span>
                      )}
                      {isP1Pick && (
                        <span className="px-1.5 py-0.5 rounded bg-crimson text-white text-[10px] font-bold">
                          {p1Stats.name}
                        </span>
                      )}
                      {isP2Pick && (
                        <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold">
                          {p2Stats.name}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Compact Mouse Fallback Buzzer */}
          {phase === 'waiting_buzz' && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-sumi-border/60">
              <button
                type="button"
                onClick={() => triggerBuzz(1)}
                className="py-3 px-4 rounded-xl bg-crimson/5 hover:bg-crimson hover:text-white text-crimson border border-crimson/25 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Bel {p1Stats.name} (Kiri)</span>
              </button>
              <button
                type="button"
                onClick={() => triggerBuzz(2)}
                className="py-3 px-4 rounded-xl bg-sky-500/5 hover:bg-sky-600 hover:text-white text-sky-700 border border-sky-500/25 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span>Bel {p2Stats.name} (Kanan)</span>
              </button>
            </div>
          )}

          {/* Steal Notice if active during answering */}
          {phase === 'answering' && isStealTurn && roundBanner && (
            <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
              {roundBanner.text}
            </div>
          )}

          {/* Revealed Explanation + Next CTA */}
          {phase === 'revealed' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-sumi-border">
              {currentQuestion.explanation ? (
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-sumi-charcoal leading-relaxed flex-1">
                  <Info className="w-4 h-4 text-crimson mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-sumi">Pembahasan: </span>
                    {currentQuestion.explanation}
                  </div>
                </div>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextRound}
                className="px-6 py-3 rounded-xl bg-sumi hover:bg-crimson text-white font-extrabold text-sm flex items-center justify-center gap-2 flex-shrink-0 transition-colors"
              >
                {isLastRound ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    <span>Lihat Hasil Akhir</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut (Spasi)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
