'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/data/store';
import { 
  KIKIKAKITORI_PACKAGES, 
  KikikakitoriPackageItem, 
  KikikakitoriQuestionItem 
} from '@/lib/data/kikikakitoriModuleData';
import { normalizeJapaneseAnswer } from '@/lib/utils';
import { 
  Home, 
  ChevronRight, 
  ArrowLeft, 
  Headphones, 
  Lock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Award, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Clock, 
  Send, 
  Check, 
  X, 
  Edit3,
  FileText
} from 'lucide-react';

export default function KikikakitoriLombaPage() {
  const { results, currentUser, submitPracticeResult } = useAppStore();

  // Mode Switcher: 'exam' (Simulasi Ujian Audio) vs 'dictation' (Latihan Dikte Kilat)
  const [activeMode, setActiveMode] = useState<'exam' | 'dictation'>('exam');

  // Filter Level Pills: 'all' | 'N5' | 'N4' | 'N3'
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'N5' | 'N4' | 'N3'>('all');

  // Active package state
  const [selectedPackageId, setSelectedPackageId] = useState<string>('set-kikikakitori-1');

  // Filtered packages by level
  const filteredPackages = useMemo(() => {
    if (selectedLevel === 'all') return KIKIKAKITORI_PACKAGES;
    return KIKIKAKITORI_PACKAGES.filter((p) => p.level === selectedLevel);
  }, [selectedLevel]);

  // Active package
  const activePackage = useMemo(() => {
    return (
      KIKIKAKITORI_PACKAGES.find((p) => p.id === selectedPackageId) ||
      KIKIKAKITORI_PACKAGES[0]
    );
  }, [selectedPackageId]);

  // Questions for active package
  const questions: KikikakitoriQuestionItem[] = activePackage.questions;

  // Question navigation & answers
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [dictationAnswers, setDictationAnswers] = useState<Record<string, string>>({});

  // Audio Playback & Quota State
  // remainingPlays: 2 (start), 1 (played once), 0 (locked)
  const [remainingPlays, setRemainingPlays] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasPlayedThisSession, setHasPlayedThisSession] = useState<boolean>(false);

  // Audio element & ticker reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tickerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // Summary / Result Modal
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  // Reset audio & answer states when switching packages
  const handleSelectPackage = (pkg: KikikakitoriPackageItem) => {
    if (pkg.status === 'draft') return;
    setSelectedPackageId(pkg.id);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setDictationAnswers({});
    setRemainingPlays(2);
    setIsPlaying(false);
    setCurrentTime(0);
    setHasPlayedThisSession(false);
    setIsExamCompleted(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (tickerIntervalRef.current) {
      clearInterval(tickerIntervalRef.current);
    }
  };

  // Switch mode
  const handleModeChange = (mode: 'exam' | 'dictation') => {
    setActiveMode(mode);
    if (mode === 'dictation') {
      const dictSet = KIKIKAKITORI_PACKAGES.find((p) => p.id === 'set-kikikakitori-4') || KIKIKAKITORI_PACKAGES[0];
      handleSelectPackage(dictSet);
    } else {
      handleSelectPackage(KIKIKAKITORI_PACKAGES[0]);
    }
  };

  // Reset practice quota helper
  const handleResetQuota = () => {
    setRemainingPlays(2);
    setHasPlayedThisSession(false);
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (tickerIntervalRef.current) {
      clearInterval(tickerIntervalRef.current);
    }
  };

  // Speech synthesis fallback helper
  const playWithSpeechSynthesis = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activePackage.fullDialogue);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayedThisSession(false);
        setCurrentTime(0);
        if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      };

      // Simulated elapsed timer for waveform and time tracker
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      tickerIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activePackage.durationSeconds) {
            if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
            return activePackage.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);

      window.speechSynthesis.speak(utterance);
    }
  }, [activePackage.fullDialogue, activePackage.durationSeconds]);

  // Audio playback handler with robust audio & synthesis fallback
  const handleTogglePlay = () => {
    if (remainingPlays <= 0 && !isPlaying) return;

    if (isPlaying) {
      // Pause current audio / speech
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      setIsPlaying(false);
      return;
    }

    // Deduct quota if starting first play
    if (!hasPlayedThisSession) {
      setRemainingPlays((prev) => Math.max(0, prev - 1));
      setHasPlayedThisSession(true);
    }
    setIsPlaying(true);

    // Stop existing audio instances
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);

    // Play real Native Japanese voice file
    const audio = new Audio(activePackage.audioUrl);
    audioRef.current = audio;
    audio.preload = 'auto';

    audio.ontimeupdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setHasPlayedThisSession(false);
      setCurrentTime(0);
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    };

    audio.onerror = () => {
      console.warn('Audio file error, falling back to speech synthesis');
      playWithSpeechSynthesis();
    };

    audio.play().catch((err) => {
      console.warn('Audio play prevented or blocked, falling back to speech synthesis:', err);
      playWithSpeechSynthesis();
    });
  };

  // Clean up audio & speech on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (tickerIntervalRef.current) {
        clearInterval(tickerIntervalRef.current);
      }
    };
  }, []);

  // Format MM:SS helper
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ: KikikakitoriQuestionItem | undefined = questions[currentQIndex];

  // Selecting a multiple choice answer
  const handleSelectMC = (key: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: key,
    }));
  };

  // Typing in dictation input
  const handleDictationChange = (val: string) => {
    if (!currentQ) return;
    setDictationAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  // Navigating questions
  const handleNextQ = () => {
    setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const handlePrevQ = () => {
    setCurrentQIndex((prev) => Math.max(0, prev - 1));
  };

  // Final Submit
  const handleFinishExam = () => {
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const dictationRaw = dictationAnswers[q.id] || '';
      const normalizedInput = normalizeJapaneseAnswer(dictationRaw);

      let isMCCorrect = selected === q.correctKey;
      let isDictationCorrect = q.dictationTarget.some(
        (target) => normalizeJapaneseAnswer(target) === normalizedInput
      );

      // Either MC or Dictation counts as mastered/correct
      if (isMCCorrect || isDictationCorrect) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / questions.length) * 100);
    setCorrectCount(correct);
    setFinalScore(calculatedScore);
    setIsExamCompleted(true);

    // Save to store / submission API
    submitPracticeResult({
      set_id: activePackage.id,
      category: 'kikikakitori',
      score: calculatedScore,
      total_questions: questions.length,
      correct_answers: correct,
      time_spent_seconds: Math.round(currentTime) || 65,
      set_title: activePackage.title,
    });
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto">
      {/* 1. SUB-HEADER & MODE TOGGLE (COMPACT TOP BAR) */}
      {/* Baris 1: Breadcrumb navigasi di kiri & Mode Ujian Terkunci di kanan */}
      <div className="bg-white rounded-2xl border border-sumi-border px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
        {/* Sisi Kiri: Breadcrumb Navigasi */}
        <div className="flex items-center gap-1.5 text-xs text-sumi-charcoal flex-wrap">
          <Link
            href="/siswa"
            className="flex items-center gap-1 text-sumi-charcoal hover:text-crimson transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sumi-muted" />
          <Link
            href="/siswa#katalog-lomba"
            className="text-sumi-charcoal hover:text-crimson transition-colors"
          >
            Ruang Lomba
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sumi-muted" />
          <span className="font-bold text-crimson flex items-center gap-1.5">
            <span>Kikikakitori (聞き書き)</span>
            <span className="text-[10px] bg-crimson-tint text-crimson font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Exam Mode
            </span>
          </span>
        </div>

        {/* Sisi Kanan: Badge Info Mode Ujian Terkunci • Anti-Scrubbing */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>Mode Ujian Terkunci • Anti-Scrubbing</span>
          </div>

          <div className="hidden lg:inline-flex items-center text-[11px] text-sumi-muted bg-washi px-2.5 py-1 rounded-md border border-sumi-border/70 font-mono">
            Maksimal 2 kali putar
          </div>

          <Link
            href="/siswa"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sumi hover:text-crimson transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Pilih Cabang Lain</span>
          </Link>
        </div>
      </div>

      {/* Baris 2: Judul Modul, Mode Switcher & Filter Level */}
      <div className="bg-white rounded-2xl border border-sumi-border px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-2xs">
        {/* Sisi Kiri: Judul & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="hidden xl:block">
            <h1 className="text-sm font-black text-sumi">
              Kikikakitori (聞き書き) — Menyimak & Dikte
            </h1>
          </div>

          <div className="flex items-center p-0.5 bg-washi rounded-xl border border-sumi-border/60 self-start md:self-auto">
            <button
              onClick={() => handleModeChange('exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeMode === 'exam'
                  ? 'bg-crimson text-white shadow-2xs'
                  : 'text-sumi-charcoal hover:text-crimson'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Simulasi Ujian Audio</span>
            </button>
            <button
              onClick={() => handleModeChange('dictation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                activeMode === 'dictation'
                  ? 'bg-crimson text-white shadow-2xs'
                  : 'text-sumi-charcoal hover:text-crimson'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Latihan Dikte Kilat (Kakitori)</span>
            </button>
          </div>
        </div>

        {/* Sisi Kanan: Quick Level Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0 scrollbar-thin">
          <span className="text-[11px] font-bold text-sumi-muted mr-1 hidden sm:inline">
            Tingkat:
          </span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'N5', label: 'N5' },
            { id: 'N4', label: 'N4' },
            { id: 'N3', label: 'N3' },
          ].map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-sumi text-white shadow-2xs'
                    : 'bg-white border border-sumi-border text-sumi-charcoal hover:border-crimson hover:text-crimson'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 & 3. WORKBENCH 2-KOLOM (AUDIO CONSOLE & LEMBAR JAWAB CEPAT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* ============================================================== */}
        {/* SISI KIRI: AUDIO CONSOLE CARD (KONTROL MEDIA TERPROTEKSI 5-KOLOM) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-sumi-border p-5 sm:p-6 space-y-4 shadow-sm lg:sticky lg:top-4">
          {/* Header Audio Console */}
          <div className="flex items-center justify-between pb-3 border-b border-sumi-border/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-crimson rounded-full" />
              <h2 className="text-xs sm:text-[13px] font-black text-sumi uppercase tracking-wider">
                AUDIO CONSOLE & KONTROL UJIAN
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-sumi-border text-sumi-muted">
              {activePackage.levelLabel}
            </span>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-black text-crimson line-clamp-1">
              {activePackage.title}
            </p>
            <p className="text-[11px] text-sumi-charcoal leading-relaxed">
              {activePackage.description}
            </p>
          </div>

          {/* Badge Kuota Putar dengan Dot Indicator & Reset */}
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-sumi-border/70 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sumi-charcoal">
                [ {remainingPlays === 2 ? '● ●' : remainingPlays === 1 ? '● ○' : '○ ○'} ]
              </span>
              <span className="text-xs font-extrabold text-sumi">
                {remainingPlays === 2 ? (
                  <span>Sisa Kuota: 2 Kali Putar</span>
                ) : remainingPlays === 1 ? (
                  <span className="text-amber-800">1 Kali Putar Tersisa</span>
                ) : (
                  <span className="text-rose-700">Kuota Putar Habis</span>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetQuota}
              className="text-[11px] font-bold text-crimson hover:underline bg-white px-2.5 py-1 rounded-lg border border-sumi-border/70 shadow-2xs transition-all"
              title="Reset kuota pemutaran untuk latihan mandiri"
            >
              Reset Kuota (2x)
            </button>
          </div>

          {/* Tombol Play/Stop Utama (Solid Crimson #B91C1C) */}
          <div>
            <button
              onClick={handleTogglePlay}
              disabled={remainingPlays === 0 && !isPlaying}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-2xs ${
                remainingPlays === 0 && !isPlaying
                  ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                  : isPlaying
                  ? 'bg-crimson hover:bg-crimson-dark text-white ring-2 ring-crimson/30 animate-pulse'
                  : 'bg-crimson hover:bg-crimson-dark text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Jeda Audio Ujian ({formatSeconds(currentTime)} / {activePackage.durationFormatted})</span>
                </>
              ) : remainingPlays === 0 ? (
                <>
                  <Lock className="w-4 h-4 text-zinc-400" />
                  <span>Kuota Pemutaran Habis</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Putar Audio Ujian (Durasi: {activePackage.durationFormatted})</span>
                </>
              )}
            </button>
          </div>

          {/* Audio Waveform Visualizer (Animasi Dinamis Merah-Abu) */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-sumi-border/70 p-4 flex flex-col items-center justify-center relative overflow-hidden h-28 select-none">
            {/* Waveform Bars */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full h-16">
              {[
                12, 18, 28, 42, 60, 48, 30, 20, 35, 55, 75, 90, 68, 45, 30, 48, 62, 80, 50, 32, 22, 40,
                58, 70, 85, 60, 42, 28, 50, 72, 45, 25, 16, 10
              ].map((height, idx) => {
                const isEven = idx % 2 === 0;
                // If playing, apply rhythmic animation style
                const dynamicHeight = isPlaying
                  ? Math.max(15, Math.min(95, (height * (0.6 + Math.sin((currentTime * 3) + idx) * 0.4))))
                  : height * 0.4;

                return (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? isEven
                          ? 'bg-crimson'
                          : 'bg-sumi'
                        : 'bg-sumi-border'
                    }`}
                    style={{ height: `${dynamicHeight}%` }}
                  />
                );
              })}
            </div>

            {/* Playing Status Pill */}
            <div className="absolute top-2 right-2">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold ${
                isPlaying ? 'bg-crimson text-white animate-pulse' : 'bg-white/80 text-sumi-muted border border-sumi-border/50'
              }`}>
                {isPlaying ? `PLAYING • ${formatSeconds(currentTime)}` : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Sub-Badges Proteksi */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            <div className="p-2 rounded-xl bg-washi border border-sumi-border/70 flex items-center gap-1.5 text-sumi-charcoal">
              <Layers className="w-3.5 h-3.5 text-crimson flex-shrink-0" />
              <span className="truncate">Normalisasi Spasi & Huruf Aktif</span>
            </div>
            <div className="p-2 rounded-xl bg-washi border border-sumi-border/70 flex items-center gap-1.5 text-sumi-charcoal">
              <Lock className="w-3.5 h-3.5 text-sumi flex-shrink-0" />
              <span className="truncate">Timeline Terkunci</span>
            </div>
          </div>

          {/* Peringatan Proteksi Audio & Tips */}
          <div className="space-y-2 text-xs text-sumi-charcoal">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 leading-relaxed space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Tips Menyimak Sensei:</span>
              </span>
              <p>&quot;{activePackage.tips}&quot;</p>
            </div>

            {/* Collapsible Transcript Toggle for Self-Practice */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-sumi-border/70 text-xs font-bold text-sumi-charcoal hover:text-crimson transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-crimson" />
                  <span>Naskah Suara Jepang (Transkrip)</span>
                </span>
                <span className="text-[11px] text-sumi-muted font-normal">
                  {showTranscript ? 'Sembunyikan ▲' : 'Buka Transkrip ▼'}
                </span>
              </button>
              {showTranscript && (
                <div className="mt-2 p-3.5 rounded-xl bg-white border border-sumi-border/80 font-jp text-xs sm:text-[13px] leading-loose text-sumi shadow-2xs animate-in fade-in duration-150">
                  <span className="text-[10px] font-mono text-crimson font-bold block mb-1 uppercase tracking-wider">
                    Official Listening Script:
                  </span>
                  {activePackage.fullDialogue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SISI KANAN: INTERACTIVE ANSWER SHEET (LEMBAR JAWAB CEPAT 7-KOLOM) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sumi-border p-5 sm:p-6 space-y-4 shadow-sm">
          {/* Header Soal & Progress Bar */}
          <div className="space-y-2.5 pb-3 border-b border-sumi-border/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-crimson rounded-full" />
                <h2 className="text-xs sm:text-[13px] font-black text-sumi uppercase tracking-wider">
                  INTERACTIVE LEMBAR JAWAB CEPAT
                </h2>
              </div>
              <span className="text-xs font-bold text-sumi-charcoal bg-[#FAF7F2] px-3 py-1 rounded-full border border-sumi-border/70">
                Soal {questions.length > 0 ? currentQIndex + 1 : 0} dari {questions.length}
              </span>
            </div>

            {/* Thin Crimson Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-crimson transition-all duration-300"
                style={{
                  width: `${questions.length > 0 ? ((currentQIndex + 1) / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {currentQ ? (
            <div className="space-y-4">
              {/* Question Text Box with proper padding */}
              <div className="bg-[#FAF7F2]/80 p-4 sm:p-5 rounded-xl border border-sumi-border/70 space-y-1.5">
                <span className="text-[11px] font-bold text-crimson uppercase tracking-wider block">
                  Pertanyaan Nomor {currentQ.orderIndex} • Menyimak Audio:
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-sumi leading-relaxed">
                  {currentQ.questionText}
                </h3>
              </div>

              {/* Opsi Pilihan Ganda (Grid 2x2 with generous padding) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;

                  return (
                    <div
                      key={opt.key}
                      data-option-key={opt.key}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectMC(opt.key)}
                      className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                        isSelected
                          ? 'border-crimson bg-crimson-tint/40 ring-1 ring-crimson shadow-2xs font-bold text-sumi'
                          : 'border-sumi-border bg-white hover:border-crimson/50 hover:bg-[#FAF7F2] text-sumi shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-crimson text-white'
                            : 'bg-washi border border-sumi-border text-sumi'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-xs sm:text-[13px] leading-normal">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Area Dikte Kilat (Kakitori) with proper card padding */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-sumi-border/70 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-sumi flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-crimson" />
                    <span>Area Dikte Kilat (Kakitori)</span>
                  </label>
                  <span className="text-[10px] text-sumi-muted italic">
                    Opsional / Pelengkap Menyimak
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={dictationAnswers[currentQ.id] || ''}
                    onChange={(e) => handleDictationChange(e.target.value)}
                    placeholder="Ketik kanji/kana kata kunci..."
                    className="w-full bg-[#FAF7F2] border border-sumi-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-sumi font-semibold focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson transition-all placeholder:text-sumi-muted font-jp"
                  />
                  {dictationAnswers[currentQ.id] && (
                    <div className="absolute right-3.5 top-3 text-emerald-600">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-sumi-muted">
                  <span>Normalisasi Spasi & Huruf Aktif • Timeline Terkunci</span>
                  {dictationAnswers[currentQ.id] && (
                    <span className="font-mono text-sumi-charcoal text-[10px]">
                      Normal: &quot;{normalizeJapaneseAnswer(dictationAnswers[currentQ.id])}&quot;
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Controls: Lewati Soal & Simpan & Lanjut */}
              <div className="flex items-center justify-between pt-3 border-t border-sumi-border/70 gap-2">
                <button
                  onClick={handleNextQ}
                  disabled={currentQIndex >= questions.length - 1}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border border-sumi-border text-sumi-charcoal transition-all ${
                    currentQIndex >= questions.length - 1
                      ? 'opacity-40 cursor-not-allowed bg-washi'
                      : 'bg-white hover:bg-washi'
                  }`}
                >
                  Lewati Soal
                </button>

                <div className="flex items-center gap-2">
                  {currentQIndex > 0 && (
                    <button
                      onClick={handlePrevQ}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-sumi-border bg-white hover:bg-washi text-sumi-charcoal"
                    >
                      ← Sebelumnya
                    </button>
                  )}

                  {currentQIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNextQ}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-crimson hover:bg-crimson-dark text-white flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <span>Simpan & Lanjut</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishExam}
                      className="px-6 py-2 rounded-xl text-xs font-extrabold bg-crimson hover:bg-crimson-dark text-white flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kumpulkan Ujian</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-bold text-sumi">
                Tidak ada soal aktif pada paket ini.
              </p>
              <button
                onClick={() => handleSelectPackage(KIKIKAKITORI_PACKAGES[0])}
                className="text-xs text-crimson font-bold hover:underline"
              >
                Pilih Paket 01
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM STRIP: QUICK SELECTOR PAKET LAIN */}
      <div className="bg-white rounded-2xl border border-sumi-border p-3.5 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-sumi uppercase tracking-wider">
            PILIHAN PAKET MENYIMAK LAINNYA:
          </span>
          <span className="text-[11px] text-sumi-muted hidden sm:inline">
            Klik untuk berganti paket soal tanpa harus kembali ke beranda
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {filteredPackages.map((pkg, idx) => {
            const isCurrent = pkg.id === selectedPackageId;
            const isDraft = pkg.status === 'draft';

            let badgeText = 'Tersedia';
            let badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';

            if (isCurrent) {
              badgeText = 'Sedang Aktif';
              badgeStyle = 'bg-crimson text-white';
            } else if (pkg.bestScore) {
              badgeText = `Skor: ${pkg.bestScore}/100 ✓`;
              badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            } else if (isDraft) {
              badgeText = 'Terkunci (Draft Sensei)';
              badgeStyle = 'bg-zinc-100 text-zinc-500 border-zinc-200';
            }

            return (
              <button
                key={pkg.id}
                disabled={isDraft}
                onClick={() => handleSelectPackage(pkg)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                  isCurrent
                    ? 'border-crimson bg-crimson-tint/30 ring-1 ring-crimson'
                    : isDraft
                    ? 'border-sumi-border/50 bg-zinc-50/60 opacity-60 cursor-not-allowed'
                    : 'border-sumi-border bg-white hover:border-crimson/50 hover:bg-washi'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-black uppercase tracking-wider text-crimson">
                    Paket 0{idx + 1} • {pkg.level}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>
                <div className="text-xs font-bold text-sumi line-clamp-1">
                  {pkg.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. MODAL SUMMARY HASIL UJIAN KIKIKAKITORI */}
      {isExamCompleted && (
        <div className="fixed inset-0 z-50 bg-sumi/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-crimson-tint flex items-center justify-center text-crimson font-black text-sm">
                  🎧
                </span>
                <div>
                  <h3 className="text-sm font-black text-sumi">
                    Hasil Ujian Kikikakitori
                  </h3>
                  <span className="text-[10px] font-bold text-sumi-muted uppercase">
                    {activePackage.title}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsExamCompleted(false)}
                className="w-7 h-7 rounded-lg text-sumi-muted hover:text-sumi hover:bg-washi flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Ring / Badge */}
            <div className="text-center py-4 space-y-2 bg-[#FAF7F2] rounded-2xl border border-sumi-border/70">
              <span className="text-xs font-bold text-sumi-charcoal uppercase tracking-wider block">
                Skor Akhir Menyimak
              </span>
              <div className="text-4xl sm:text-5xl font-black font-mono text-crimson">
                {finalScore}
                <span className="text-lg text-sumi-muted font-sans font-bold"> / 100</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Benar: {correctCount} dari {questions.length} Soal</span>
              </div>
            </div>

            {/* Evaluation Notes */}
            <p className="text-xs text-sumi-charcoal leading-relaxed text-center">
              {finalScore >= 80 ? (
                <span className="text-emerald-700 font-bold">
                  Selamat! Kamu telah melampaui target KKM pembinaan (≥ 80 Poin). Kemampuan menyimakmu siap bersaing di tingkat kompetisi.
                </span>
              ) : (
                <span className="text-amber-800 font-medium">
                  Pertahankan latihan. Gunakan strategi mendengarkan kata tanya pada putaran pertama untuk meningkatkan akurasi.
                </span>
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-sumi-border gap-2">
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-sumi-charcoal bg-washi hover:bg-sumi-border/60 border border-sumi-border transition-all"
              >
                Lihat Pembahasan
              </button>

              <button
                onClick={() => {
                  setIsExamCompleted(false);
                  handleSelectPackage(activePackage);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-crimson hover:bg-crimson-dark text-white shadow-2xs transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Paket Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL PEMBAHASAN RESMI KIKIKAKITORI */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-sumi/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Pembahasan Resmi Audio
                </span>
                <h3 className="text-base font-extrabold text-sumi mt-0.5">
                  {activePackage.title}
                </h3>
              </div>

              <button
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-lg text-sumi-muted hover:text-sumi hover:bg-washi flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Questions & Audio Scripts */}
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-washi border border-sumi-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-crimson">
                      Soal Nomor {idx + 1}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Kunci: {q.correctKey}
                    </span>
                  </div>

                  <div className="font-bold text-sumi leading-relaxed">
                    {q.questionText}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                          opt.key === q.correctKey
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-white border-sumi-border text-sumi-charcoal'
                        }`}
                      >
                        <span className="w-4 h-4 rounded bg-white flex items-center justify-center border font-bold text-[9px]">
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-sumi-border/80 text-sumi-charcoal mt-2 space-y-1">
                    <div className="font-bold text-sumi">Penjelasan Audio:</div>
                    <p className="leading-relaxed">{q.explanation}</p>
                    <div className="text-[11px] text-sumi-muted pt-1">
                      <span className="font-semibold text-sumi-charcoal">Variasi Target Dikte:</span> {q.dictationTarget.join(' / ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-sumi-border flex items-center justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-crimson hover:bg-crimson-dark text-white transition-colors"
              >
                Tutup Pembahasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
