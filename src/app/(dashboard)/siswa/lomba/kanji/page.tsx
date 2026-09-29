'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/data/store';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  KANJI_PACKAGES, 
  KANJI_FLASHCARDS, 
  QUICK_DRILL_QUESTIONS,
  KanjiPackageItem,
  KanjiFlashcardItem,
  QuickDrillQuestion 
} from '@/lib/data/kanjiModuleData';
import { PracticeSet, Question } from '@/types';
import { 
  Home, 
  ChevronRight, 
  ArrowLeft, 
  Target, 
  BookOpen, 
  Layers, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lock, 
  Clock, 
  HelpCircle, 
  Shuffle, 
  ChevronLeft, 
  ExternalLink,
  Flame,
  Award,
  X
} from 'lucide-react';
import { KanjiIcon } from '@/components/icons/CompetitionIcons';

export default function KanjiLombaPage() {
  const { practiceSets, questions, results, currentUser } = useAppStore();

  // Mode Switcher: 'exam' (Paket Kuis Ujian) or 'flashcard' (Kartu Kilas)
  const [activeMode, setActiveMode] = useState<'exam' | 'flashcard'>('exam');

  // Filter Level Pills: 'all' | 'N5' | 'N4' | 'N3' | 'Yojijukugo'
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'N5' | 'N4' | 'N3' | 'Yojijukugo'>('all');

  // Quiz state
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [activeQuizSet, setActiveQuizSet] = useState<PracticeSet | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);

  // Review Modal state for completed package
  const [reviewPackage, setReviewPackage] = useState<KanjiPackageItem | null>(null);

  // Quick Drill Modal state
  const [isQuickDrillOpen, setIsQuickDrillOpen] = useState(false);
  const [quickDrillIndex, setQuickDrillIndex] = useState(0);
  const [selectedDrillOption, setSelectedDrillOption] = useState<string | null>(null);
  const [hasEvaluatedDrill, setHasEvaluatedDrill] = useState(false);

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(['fc-1', 'fc-6']); // initial mastered

  // Student results for Kanji from store
  const userKanjiResults = useMemo(() => {
    return results.filter((r) => r.user_id === currentUser?.id && r.category === 'kanji');
  }, [results, currentUser?.id]);

  // Packages with user's best score overlayed
  const packagesWithProgress = useMemo(() => {
    return KANJI_PACKAGES.map((pkg) => {
      const pastResult = userKanjiResults.find((r) => r.set_id === pkg.id);
      const score = pastResult ? pastResult.score : pkg.bestScore;
      const isCompleted = pkg.status === 'selesai' || !!pastResult;

      return {
        ...pkg,
        bestScore: score,
        status: isCompleted ? 'selesai' : pkg.status,
      } as KanjiPackageItem;
    });
  }, [userKanjiResults]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    if (selectedLevel === 'all') return packagesWithProgress;
    return packagesWithProgress.filter((pkg) => pkg.level === selectedLevel);
  }, [packagesWithProgress, selectedLevel]);

  // Filtered flashcards
  const filteredFlashcards = useMemo(() => {
    if (selectedLevel === 'all') return KANJI_FLASHCARDS;
    return KANJI_FLASHCARDS.filter((fc) => fc.level === selectedLevel);
  }, [selectedLevel]);

  // Keep flashcard index within bounds when filter changes
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [selectedLevel]);

  const currentFlashcard: KanjiFlashcardItem | undefined = filteredFlashcards[flashcardIndex];

  // Keyboard navigation for flashcard
  useEffect(() => {
    if (activeMode !== 'flashcard' || isTakingQuiz || isQuickDrillOpen || reviewPackage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setFlashcardIndex((prev) => (prev + 1) % filteredFlashcards.length);
        setIsFlipped(false);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setFlashcardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
        setIsFlipped(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, filteredFlashcards.length, isTakingQuiz, isQuickDrillOpen, reviewPackage]);

  // Quick Drill Question
  const currentQuickQuestion: QuickDrillQuestion = QUICK_DRILL_QUESTIONS[quickDrillIndex % QUICK_DRILL_QUESTIONS.length];

  const handleStartQuickDrill = () => {
    setSelectedDrillOption(null);
    setHasEvaluatedDrill(false);
    setIsQuickDrillOpen(true);
  };

  const handleNextQuickQuestion = () => {
    setSelectedDrillOption(null);
    setHasEvaluatedDrill(false);
    setQuickDrillIndex((prev) => (prev + 1) % QUICK_DRILL_QUESTIONS.length);
  };

  const handleAnswerDrill = (key: string) => {
    if (hasEvaluatedDrill) return;
    setSelectedDrillOption(key);
    setHasEvaluatedDrill(true);
  };

  // Launching an Exam Package
  const handleLaunchPackage = (pkg: KanjiPackageItem) => {
    if (pkg.status === 'draft') return;

    // Check if package exists in store
    const storeSet = practiceSets.find((s) => s.id === pkg.id);
    let quizSet: PracticeSet;

    if (storeSet) {
      quizSet = storeSet;
    } else {
      quizSet = {
        id: pkg.id,
        category: 'kanji',
        title: pkg.title,
        description: pkg.description,
        difficulty_level: pkg.level === 'N5' ? 'Pemula (N5)' : pkg.level === 'N3' ? 'Mahir (N3)' : 'Menengah (N4)',
        duration_minutes: pkg.durationMinutes,
        is_published: true,
        created_at: new Date().toISOString(),
        questions_count: pkg.questionCount,
      };
    }

    // Get questions for this set
    let setQuestions = questions.filter((q) => q.set_id === pkg.id);
    if (setQuestions.length === 0) {
      // Fallback to base questions or clone with updated set_id
      const baseQuestions = questions.filter((q) => q.set_id === 'set-kanji-1');
      if (baseQuestions.length > 0) {
        setQuestions = baseQuestions.map((q, idx) => ({
          ...q,
          id: `gen-${pkg.id}-${idx + 1}`,
          set_id: pkg.id,
        }));
      }
    }

    setActiveQuizSet(quizSet);
    setActiveQuizQuestions(setQuestions);
    setIsTakingQuiz(true);
  };

  // Flashcard Mastery Handlers
  const toggleMastery = (cardId: string) => {
    setMasteredIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const handleNextCard = () => {
    if (filteredFlashcards.length === 0) return;
    setFlashcardIndex((prev) => (prev + 1) % filteredFlashcards.length);
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    if (filteredFlashcards.length === 0) return;
    setFlashcardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    if (filteredFlashcards.length <= 1) return;
    const randomIndex = Math.floor(Math.random() * filteredFlashcards.length);
    setFlashcardIndex(randomIndex);
    setIsFlipped(false);
  };

  // If user is currently taking the quiz
  if (isTakingQuiz && activeQuizSet) {
    if (activeQuizQuestions.length === 0) {
      return (
        <div className="space-y-4">
          <button
            onClick={() => setIsTakingQuiz(false)}
            className="text-xs font-semibold text-sumi-charcoal hover:text-crimson flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Lomba Kanji</span>
          </button>
          <EmptyState
            categoryName="Kanji"
            categoryKanji="漢字"
            customMessage={`Paket kuis (${activeQuizSet.title}) sedang dipersiapkan oleh Sensei. Nantikan paket soal interaktif segera!`}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsTakingQuiz(false)}
          className="text-xs font-semibold text-sumi-charcoal hover:text-crimson flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Lomba Kanji</span>
        </button>
        <QuizContainer practiceSet={activeQuizSet} questions={activeQuizQuestions} />
      </div>
    );
  }

  const isCurrentCardMastered = currentFlashcard ? masteredIds.includes(currentFlashcard.id) : false;
  const totalMasteredInFilter = filteredFlashcards.filter((c) => masteredIds.includes(c.id)).length;
  const masteryPercentage = filteredFlashcards.length > 0 
    ? Math.round((totalMasteredInFilter / filteredFlashcards.length) * 100) 
    : 0;

  return (
    <div className="space-y-3 max-w-7xl mx-auto">
      {/* 1. SUB-HEADER BAR: Breadcrumb Navigation & Passing Target KKM */}
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
            <span>Kanji (漢字)</span>
            <span className="text-[10px] bg-crimson-tint text-crimson font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Auto-Graded
            </span>
          </span>
        </div>

        {/* Sisi Kanan: Target KKM Pembinaan & Link Switch */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span>🎯 Target KKM Pembinaan: ≥ 80 Poin</span>
          </div>

          <div className="hidden lg:inline-flex items-center text-[11px] text-sumi-muted bg-washi px-2.5 py-1 rounded-md border border-sumi-border/70 font-mono">
            Rumus: (Benar / Total) × 100
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

      {/* 2. CONTROL STRIP: Mode Switcher (Tab) & Level Filter Pills */}
      <div className="bg-white rounded-2xl border border-sumi-border px-3.5 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-2xs">
        {/* Sisi Kiri: Mode Belajar Toggle Tab */}
        <div className="flex items-center p-0.5 bg-washi rounded-xl border border-sumi-border/60 self-start md:self-auto">
          <button
            onClick={() => setActiveMode('exam')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeMode === 'exam'
                ? 'bg-crimson text-white shadow-2xs'
                : 'text-sumi-charcoal hover:text-crimson'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Paket Kuis Ujian</span>
          </button>
          <button
            onClick={() => setActiveMode('flashcard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeMode === 'flashcard'
                ? 'bg-crimson text-white shadow-2xs'
                : 'text-sumi-charcoal hover:text-crimson'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kartu Kilas (Flashcard)</span>
          </button>
        </div>

        {/* Sisi Kanan: Quick Level Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0 scrollbar-thin">
          <span className="text-[11px] font-bold text-sumi-muted mr-1 hidden sm:inline">
            Tingkat:
          </span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'N5', label: 'N5 Dasar' },
            { id: 'N4', label: 'N4 Menengah' },
            { id: 'N3', label: 'N3 Mahir' },
            { id: 'Yojijukugo', label: 'Yojijukugo' },
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

      {/* 3. MAIN WORKBENCH CONTENT */}
      {activeMode === 'exam' ? (
        /* MODE 1: PAKET KUIS UJIAN (EXAM DRILL CARDS) */
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPackages.map((pkg) => {
              const isLocked = pkg.status === 'draft';
              const isPassed = (pkg.bestScore ?? 0) >= 80;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between space-y-3 ${
                    isLocked
                      ? 'border-sumi-border/60 bg-zinc-50/50 opacity-80'
                      : 'border-sumi-border hover:border-crimson/50 hover:shadow-card'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header: Level Badge & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-crimson-tint text-crimson">
                        {pkg.levelLabel}
                      </span>

                      {pkg.status === 'selesai' ? (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Selesai {pkg.bestScore ? `(${pkg.bestScore}/100)` : ''}</span>
                        </span>
                      ) : pkg.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci (Draft)</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-extrabold text-sumi leading-snug line-clamp-1">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-sumi-charcoal mt-0.5 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Metadata Specs */}
                    <div className="flex items-center gap-2.5 text-[11px] text-sumi-muted pt-0.5">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-sumi-charcoal" />
                        {pkg.questionCount} Soal PG
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sumi-charcoal" />
                        {pkg.durationMinutes} Menit
                      </span>
                      <span>•</span>
                      <span className="font-bold text-amber-700">KKM: 80 Poin</span>
                    </div>

                    {/* Visual Progress / Target KKM Bar */}
                    <div className="space-y-1 pt-1.5 border-t border-sumi-border/70">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-sumi-charcoal">
                          {pkg.bestScore !== undefined ? 'Skor Tertinggi:' : 'Status:'}
                        </span>
                        {pkg.bestScore !== undefined ? (
                          <span className={`font-mono font-black ${isPassed ? 'text-emerald-600' : 'text-crimson'}`}>
                            {pkg.bestScore} / 100 {isPassed ? '✓ Lulus' : ''}
                          </span>
                        ) : (
                          <span className="text-sumi-muted italic text-[10px]">Belum Ada Riwayat</span>
                        )}
                      </div>

                      {/* Progress Track */}
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isPassed ? 'bg-emerald-600' : pkg.bestScore ? 'bg-crimson' : 'bg-transparent'
                          }`}
                          style={{ width: `${pkg.bestScore ?? 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1">
                    {pkg.status === 'selesai' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleLaunchPackage(pkg)}
                          className="py-1.5 px-3 rounded-xl font-bold text-xs bg-crimson hover:bg-crimson-dark text-white flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Ulangi</span>
                        </button>
                        <button
                          onClick={() => setReviewPackage(pkg)}
                          className="py-1.5 px-3 rounded-xl font-bold text-xs bg-white hover:bg-washi text-sumi-charcoal border border-sumi-border flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Pembahasan</span>
                        </button>
                      </div>
                    ) : pkg.status === 'aktif' ? (
                      <button
                        onClick={() => handleLaunchPackage(pkg)}
                        className="w-full py-2 rounded-xl font-bold text-xs bg-crimson hover:bg-crimson-dark text-white flex items-center justify-center gap-2 shadow-2xs transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Mulai Latihan</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 rounded-xl font-bold text-xs bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Terkunci (Materi Sensei)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPackages.length === 0 && (
            <div className="bg-white rounded-2xl border border-sumi-border p-8 text-center space-y-2">
              <p className="text-sm font-bold text-sumi">Tidak ada paket kuis untuk level ini.</p>
              <button
                onClick={() => setSelectedLevel('all')}
                className="text-xs text-crimson font-bold hover:underline"
              >
                Tampilkan Semua Tingkat
              </button>
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: KARTU KILAS INTERAKTIF (3D FLASHCARD WORKBENCH) */
        <div className="bg-white rounded-2xl border border-sumi-border p-6 space-y-6 shadow-2xs">
          {/* Flashcard Header Controls & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sumi-border/70">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-sumi uppercase tracking-wider">
                Kartu {filteredFlashcards.length > 0 ? flashcardIndex + 1 : 0} dari {filteredFlashcards.length}
              </span>
              <span className="text-sumi-muted text-xs">•</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>Hafal: {totalMasteredInFilter}/{filteredFlashcards.length} ({masteryPercentage}%)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleShuffle}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-sumi-charcoal bg-washi hover:bg-sumi-border/50 border border-sumi-border transition-all"
                title="Acak urutan kartu"
              >
                <Shuffle className="w-3 h-3" />
                <span>Acak</span>
              </button>
              <span className="text-[11px] text-sumi-muted hidden sm:inline italic">
                Tip: Gunakan tombol [Spasi] untuk membalik kartu
              </span>
            </div>
          </div>

          {currentFlashcard ? (
            <div className="space-y-6">
              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative w-full max-w-xl mx-auto h-[320px] sm:h-[350px] cursor-pointer select-none [perspective:1000px]"
              >
                <div
                  className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform rounded-3xl ${
                    isFlipped ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* FRONT SIDE (KANJI GLYPH & RADICAL) */}
                  <div className="absolute inset-0 w-full h-full bg-[#FCFBF8] rounded-3xl border-2 border-sumi-border hover:border-crimson/50 shadow-card p-6 flex flex-col justify-between items-center [backface-visibility:hidden] transition-colors">
                    {/* Top front row */}
                    <div className="w-full flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-crimson-tint text-crimson">
                        {currentFlashcard.levelLabel}
                      </span>
                      <span className="text-xs font-bold text-sumi-muted font-mono">
                        Radikal: {currentFlashcard.radical} • {currentFlashcard.strokeCount} Coretan
                      </span>
                    </div>

                    {/* Kanji Giant Glyph */}
                    <div className="flex flex-col items-center justify-center my-auto">
                      <div className="text-8xl sm:text-9xl font-black font-jp text-sumi tracking-widest hover:scale-105 transition-transform drop-shadow-2xs">
                        {currentFlashcard.kanji}
                      </div>
                    </div>

                    {/* Bottom front hint */}
                    <div className="w-full flex items-center justify-center gap-1.5 text-xs text-sumi-muted bg-white/80 py-2 px-3 rounded-xl border border-sumi-border/40">
                      <RotateCcw className="w-3.5 h-3.5 text-crimson" />
                      <span>Klik kartu atau tekan [Spasi] untuk melihat arti & cara baca</span>
                    </div>
                  </div>

                  {/* BACK SIDE (ONYOMI, KUNYOMI, MEANING, EXAMPLES) */}
                  <div className="absolute inset-0 w-full h-full bg-white rounded-3xl border-2 border-crimson/40 shadow-card p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    {/* Top back row */}
                    <div className="flex items-center justify-between border-b border-sumi-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black font-jp text-crimson">
                          {currentFlashcard.kanji}
                        </span>
                        <span className="text-xs font-black text-sumi uppercase">
                          {currentFlashcard.meaning}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-crimson-tint text-crimson">
                        {currentFlashcard.level}
                      </span>
                    </div>

                    {/* Middle: Readings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                      <div className="bg-washi p-2.5 rounded-xl border border-sumi-border/60">
                        <span className="text-[10px] font-black text-crimson uppercase tracking-wider block">
                          Onyomi (音読み):
                        </span>
                        <span className="text-sm font-bold font-jp text-sumi mt-0.5 block">
                          {currentFlashcard.onyomi}
                        </span>
                      </div>

                      <div className="bg-washi p-2.5 rounded-xl border border-sumi-border/60">
                        <span className="text-[10px] font-black text-sumi-charcoal uppercase tracking-wider block">
                          Kunyomi (訓読み):
                        </span>
                        <span className="text-sm font-bold font-jp text-sumi mt-0.5 block">
                          {currentFlashcard.kunyomi}
                        </span>
                      </div>
                    </div>

                    {/* Context Word & Sentence */}
                    <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-xl border border-sumi-border/50 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-sumi-muted uppercase">Contoh Kosakata:</span>
                        <div className="text-sumi font-bold font-jp">
                          {currentFlashcard.exampleWord} ({currentFlashcard.exampleReading}) — <span className="font-normal text-sumi-charcoal">{currentFlashcard.exampleMeaning}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-sumi-muted uppercase">Kalimat Lomba:</span>
                        <div className="text-sumi font-jp font-semibold">
                          {currentFlashcard.sentence}
                        </div>
                        <div className="text-sumi-muted text-[11px] italic mt-0.5">
                          &quot;{currentFlashcard.sentenceTranslation}&quot;
                        </div>
                      </div>
                    </div>

                    {/* Bottom back hint */}
                    <div className="w-full flex items-center justify-center gap-1.5 text-[11px] text-sumi-muted pt-1">
                      <RotateCcw className="w-3 h-3 text-crimson" />
                      <span>Klik untuk kembali ke tampilan depan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons below Flashcard */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto pt-2">
                <button
                  onClick={handlePrevCard}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-sumi-charcoal bg-white hover:bg-washi border border-sumi-border flex items-center justify-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (isCurrentCardMastered) toggleMastery(currentFlashcard.id);
                      handleNextCard();
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-sumi-charcoal bg-white hover:bg-red-50 border border-sumi-border hover:border-red-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Belum Hafal</span>
                  </button>

                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-white bg-sumi hover:bg-sumi-dark flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Balik Kartu</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isCurrentCardMastered) toggleMastery(currentFlashcard.id);
                      handleNextCard();
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isCurrentCardMastered
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCardMastered ? 'Sudah Hafal ✓' : 'Tandai Hafal'}</span>
                  </button>
                </div>

                <button
                  onClick={handleNextCard}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-sumi-charcoal bg-white hover:bg-washi border border-sumi-border flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm font-bold text-sumi">Tidak ada flashcard pada filter ini.</p>
              <button
                onClick={() => setSelectedLevel('all')}
                className="text-xs text-crimson font-bold hover:underline"
              >
                Reset ke Semua Level
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. BOTTOM STRIP WIDGET: DRILL CEPAT HARI INI */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-crimson-tint/30 border border-sumi-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-crimson text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <Flame className="w-3 h-3 fill-white" />
              <span>Drill Cepat Hari Ini</span>
            </span>
            <span className="text-xs font-bold text-sumi font-jp">
              Kanji Pilihan: 『道』 (Jalan / Kaidah)
            </span>
          </div>
          <p className="text-xs text-sumi-charcoal">
            Onyomi: <span className="font-jp font-bold">ドウ, トウ</span> • Kunyomi: <span className="font-jp font-bold">みち</span> • Uji insting membaca kanjimu dalam 60 detik!
          </p>
        </div>

        <button
          onClick={handleStartQuickDrill}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-crimson hover:bg-crimson-dark text-white flex items-center gap-2 shadow-2xs transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Uji Cepat 1 Soal (Acak) ➔</span>
        </button>
      </div>

      {/* 5. MODAL DRILL CEPAT 1 SOAL */}
      {isQuickDrillOpen && currentQuickQuestion && (
        <div className="fixed inset-0 z-50 bg-sumi/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-crimson-tint flex items-center justify-center text-crimson font-black text-sm">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-black text-sumi">
                    Latihan Cepat 1 Menit • Kanji 『{currentQuickQuestion.kanji}』
                  </h3>
                  <span className="text-[10px] font-bold text-sumi-muted uppercase">
                    Level: {currentQuickQuestion.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsQuickDrillOpen(false)}
                className="w-7 h-7 rounded-lg text-sumi-muted hover:text-sumi hover:bg-washi flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-sumi-muted uppercase tracking-wider">
                Pertanyaan:
              </p>
              <div className="text-sm font-bold text-sumi leading-relaxed bg-[#FAF7F2] p-3.5 rounded-2xl border border-sumi-border/70">
                {currentQuickQuestion.questionText}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {currentQuickQuestion.options.map((opt) => {
                const isSelected = selectedDrillOption === opt.key;
                const isCorrect = opt.key === currentQuickQuestion.correctKey;

                let buttonClass = 'border-sumi-border bg-white text-sumi hover:border-crimson/50';

                if (hasEvaluatedDrill) {
                  if (isCorrect) {
                    buttonClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'border-red-500 bg-red-50 text-red-900 line-through';
                  } else {
                    buttonClass = 'border-sumi-border/50 bg-zinc-50 text-zinc-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    disabled={hasEvaluatedDrill}
                    onClick={() => handleAnswerDrill(opt.key)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${buttonClass}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-washi border border-sumi-border flex items-center justify-center font-bold text-[10px] text-sumi">
                        {opt.key}
                      </span>
                      <span className="font-medium">{opt.text}</span>
                    </div>

                    {hasEvaluatedDrill && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {hasEvaluatedDrill && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {hasEvaluatedDrill && (
              <div className="p-3.5 rounded-2xl bg-washi border border-sumi-border space-y-1.5 text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-sumi">
                  {selectedDrillOption === currentQuickQuestion.correctKey ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Tepat Sekali! Jawaban Benar.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-crimson" />
                      <span className="text-crimson">Jawaban Kurang Tepat.</span>
                    </>
                  )}
                </div>
                <p className="text-sumi-charcoal leading-relaxed">
                  <span className="font-bold">Penjelasan:</span> {currentQuickQuestion.explanation}
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-sumi-border">
              <button
                onClick={() => setIsQuickDrillOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-sumi-charcoal hover:bg-washi transition-colors"
              >
                Tutup
              </button>

              <button
                onClick={handleNextQuickQuestion}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-crimson hover:bg-crimson-dark text-white flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <span>Coba Soal Lain</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL PEMBAHASAN PAKET SELESAI */}
      {reviewPackage && (
        <div className="fixed inset-0 z-50 bg-sumi/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Pembahasan Resmi
                  </span>
                  <span className="text-[10px] font-bold text-sumi-muted font-mono">
                    KKM: 80 Poin
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-sumi mt-0.5">
                  {reviewPackage.title}
                </h3>
              </div>

              <button
                onClick={() => setReviewPackage(null)}
                className="w-7 h-7 rounded-lg text-sumi-muted hover:text-sumi hover:bg-washi flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Explanations */}
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              <p className="text-xs text-sumi-charcoal leading-relaxed">
                Pelajari kembali kaidah Onyomi, Kunyomi, dan pola kalimat dari paket soal ini untuk memperkuat akurasi kompetisimu.
              </p>

              {/* Sample review questions for this set */}
              {questions
                .filter((q) => q.set_id === reviewPackage.id || q.set_id === 'set-kanji-1')
                .map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-2xl bg-washi border border-sumi-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-crimson">
                        Soal Nomor {idx + 1}
                      </span>
                      <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Kunci: {q.correct_key}
                      </span>
                    </div>

                    <div className="font-bold text-sumi whitespace-pre-line leading-relaxed">
                      {q.question_text}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                            opt.key === q.correct_key
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

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-white border border-sumi-border/80 text-sumi-charcoal mt-2">
                        <span className="font-bold text-sumi">Penjelasan Sensei:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-sumi-border flex items-center justify-between">
              <button
                onClick={() => setReviewPackage(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-sumi-charcoal hover:bg-washi transition-colors"
              >
                Tutup Pembahasan
              </button>

              <button
                onClick={() => {
                  const pkg = reviewPackage;
                  setReviewPackage(null);
                  handleLaunchPackage(pkg);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-crimson hover:bg-crimson-dark text-white flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Paket Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
