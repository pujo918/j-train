'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Zap, 
  Trophy, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  Lock, 
  SlidersHorizontal,
  Flame,
  Check,
  X,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Swords
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/data/store';
import { QuizContainer } from '@/components/quiz/QuizContainer';
import { EditorialLeaderboard } from '@/components/cerdas-cermat/EditorialLeaderboard';
import { EditorialDailyTrivia } from '@/components/cerdas-cermat/EditorialDailyTrivia';
import { 
  CC_SIMULATION_PACKAGES, 
  CC_ADDITIONAL_QUESTIONS, 
  CC_LEADERBOARD,
  CCPackage 
} from '@/lib/data/cerdasCermatModuleData';
import { PracticeSet, Question } from '@/types';

export default function CerdasCermatLombaPage() {
  const { practiceSets, questions, results, currentUser } = useAppStore();

  // Mode and Filter states
  const [activeMode, setActiveMode] = useState<'berwaktu' | 'blitz'>('berwaktu');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'budaya' | 'geografi_sejarah' | 'kotowaza' | 'tata_bahasa'>('all');
  
  // Active Quiz State
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [activePackageId, setActivePackageId] = useState<string>('set-cc-1');

  // Daily Trivia Duel State
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<'A' | 'B' | null>(null);
  const [isTriviaAnswered, setIsTriviaAnswered] = useState(false);
  const [triviaFeedback, setTriviaFeedback] = useState<string | null>(null);

  // Review Modal State
  const [reviewPackage, setReviewPackage] = useState<CCPackage | null>(null);

  // Filter packages based on topic
  const filteredPackages = CC_SIMULATION_PACKAGES.filter((pkg) => {
    if (selectedCategory === 'all') return true;
    return pkg.topicCategory === selectedCategory;
  });

  // Build active PracticeSet and Questions for QuizContainer
  const currentPkg = CC_SIMULATION_PACKAGES.find((p) => p.id === activePackageId) || CC_SIMULATION_PACKAGES[0];
  const defaultSet: PracticeSet = practiceSets.find((s) => s.id === 'set-cc-1') || {
    id: currentPkg.id,
    category: 'cerdas_cermat',
    title: currentPkg.title,
    description: currentPkg.description,
    difficulty_level: currentPkg.difficultyLevel,
    duration_minutes: activeMode === 'blitz' ? 5 : currentPkg.durationMinutes,
    is_published: true,
    created_by: 'user-sensei',
    created_at: new Date().toISOString(),
  };

  const activeSet: PracticeSet = {
    ...defaultSet,
    id: currentPkg.id,
    title: currentPkg.title,
    duration_minutes: activeMode === 'blitz' ? 5 : currentPkg.durationMinutes,
  };

  const setQuestions: Question[] = CC_ADDITIONAL_QUESTIONS[activePackageId]
    ? CC_ADDITIONAL_QUESTIONS[activePackageId]
    : questions.filter((q) => q.set_id === activePackageId);

  // Handle Trivia submission
  const handleAnswerTrivia = () => {
    if (!selectedTriviaOption) return;
    setIsTriviaAnswered(true);
    if (selectedTriviaOption === 'A') {
      setTriviaFeedback('Tepat sekali! Hokkaido adalah prefektur dengan wilayah terluas di Jepang (83.424 km²).');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#B91C1C', '#D97706', '#10B981'],
      });
    } else {
      setTriviaFeedback('Kurang tepat. Tokyo adalah prefektur terpadat, namun prefektur terluas adalah Hokkaido.');
    }
  };

  // Start Quiz
  const handleStartQuiz = (pkgId: string) => {
    setActivePackageId(pkgId);
    setIsTakingQuiz(true);
  };

  // If taking quiz, show QuizContainer with back button
  if (isTakingQuiz) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsTakingQuiz(false)}
          className="text-xs font-extrabold text-sumi hover:text-crimson inline-flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-sm border border-white/80 shadow-2xs"
        >
          <span>← Batalkan & Kembali ke Arena Cerdas Cermat</span>
        </button>
        <QuizContainer practiceSet={activeSet} questions={setQuestions} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 text-sumi">
      {/* 1. CLEAN SINGLE-ROW HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <Link
              href="/siswa"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-sumi-border text-sumi text-xs font-bold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-crimson" />
              <span>Kembali</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-sumi tracking-tight bg-legible-text">
              Cerdas Cermat <span className="font-jp font-bold text-crimson">(知識クイズ)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-crimson-subtle/40 text-crimson text-[11px] font-semibold">
              KKM ≥ 85
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1v1 Duel Entry Button */}
          <Link
            href="/siswa/lomba/cerdas-cermat/duel"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sumi hover:bg-crimson text-white text-xs font-extrabold shadow-sm transition-colors active:scale-[0.98]"
          >
            <Swords className="w-3.5 h-3.5 text-crimson-scarlet" />
            <span>Duel 1v1</span>
          </Link>

          {/* Mode Switcher */}
          <div className="inline-flex items-center p-1 bg-white rounded-full border border-sumi-border/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveMode('berwaktu')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeMode === 'berwaktu'
                  ? 'bg-crimson text-white'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Berwaktu</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('blitz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeMode === 'blitz'
                  ? 'bg-crimson text-white'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Rapid Blitz</span>
            </button>
          </div>

          {/* Clean Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            aria-label="Filter Materi Cerdas Cermat"
            className="px-3.5 py-2 rounded-full bg-white border border-sumi-border/80 text-xs font-semibold text-sumi focus:outline-none focus:border-crimson cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Materi</option>
            <option value="budaya">Budaya (Bunka)</option>
            <option value="geografi_sejarah">Geografi & Sejarah</option>
            <option value="kotowaza">Kotowaza</option>
            <option value="tata_bahasa">Tata Bahasa</option>
          </select>
        </div>
      </div>

      {/* 2. BENTO ARENA: 8 COLS PAKET + 4 COLS PAPAN SKOR & TRIVIA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SISI KIRI: PAKET SIMULASI CEPAT (Col 8/12) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPackages.map((pkg) => {
              return (
                <div
                  key={pkg.id}
                  className="sakura-card-bg rounded-3xl border border-[#E6DCD0] hover:border-crimson/50 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF7F2] text-crimson">
                      {pkg.difficultyLevel}
                    </span>

                    {pkg.isCompleted && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Selesai</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-sumi leading-snug line-clamp-1">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-sumi-muted mt-1">
                      {pkg.questionCount} Soal • {activeMode === 'blitz' ? '15s / Soal' : `${pkg.durationMinutes} Menit`}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sumi-muted">Skor</span>
                      <span className="font-bold text-sumi">
                        {pkg.bestScore !== undefined ? `${pkg.bestScore} Pts` : '—'}
                        {pkg.bestTimeFormatted && (
                          <span className="text-sumi-muted font-normal ml-1.5">({pkg.bestTimeFormatted})</span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-crimson rounded-full"
                        style={{ width: `${pkg.bestScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStartQuiz(pkg.id)}
                      className="flex-1 py-2 px-4 rounded-full bg-crimson hover:bg-crimson-dark text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      {pkg.isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Ulangi</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Mulai</span>
                        </>
                      )}
                    </button>

                    {pkg.isCompleted && (
                      <button
                        type="button"
                        onClick={() => setReviewPackage(pkg)}
                        className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-sumi-border/70 text-sumi-charcoal hover:text-crimson flex items-center justify-center transition-colors"
                        title="Lihat Pembahasan"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SISI KANAN: PAPAN SKOR & DAILY TRIVIA (Col 4/12) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-4">
          <EditorialLeaderboard students={CC_LEADERBOARD} />

          <EditorialDailyTrivia
            selectedOption={selectedTriviaOption}
            isAnswered={isTriviaAnswered}
            feedback={triviaFeedback}
            onSelectOption={(opt) => {
              setSelectedTriviaOption(opt);
              setIsTriviaAnswered(false);
            }}
            onSubmit={handleAnswerTrivia}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL REVIEW PEMBAHASAN PAKET                                          */}
      {/* ========================================================================= */}
      {reviewPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-xl w-full p-6 space-y-5 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
              <div>
                <span className="text-[10px] font-bold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full uppercase">
                  Pembahasan Soal
                </span>
                <h3 className="text-base font-black text-sumi mt-1">
                  {reviewPackage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewPackage(null)}
                className="p-1.5 rounded-xl border border-sumi-border hover:bg-[#FAF7F2] text-sumi-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-sumi-border space-y-1">
                <span className="font-bold text-sumi block">1. Tradisi Hanami (花見)</span>
                <p className="text-sumi-charcoal">Tradisi menikmati mekarnya bunga sakura di musim semi. Jawaban: <strong>A. Hanami</strong>.</p>
                <span className="text-[10px] text-emerald-700 font-semibold block">✓ Anda menjawab benar (+20 Pts)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-sumi-border space-y-1">
                <span className="font-bold text-sumi block">2. Gunung Tertinggi: Gunung Fuji (富士山)</span>
                <p className="text-sumi-charcoal">Gunung Fuji memiliki ketinggian 3.776 mdpl. Jawaban: <strong>B. Gunung Fuji</strong>.</p>
                <span className="text-[10px] text-emerald-700 font-semibold block">✓ Anda menjawab benar (+20 Pts)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-sumi-border space-y-1">
                <span className="font-bold text-sumi block">3. Peribahasa: 『猿も木から落ちる』</span>
                <p className="text-sumi-charcoal">Padanannya adalah "Sepandai-pandai tupai melompat, sekali waktu akan jatuh juga". Jawaban: <strong>B</strong>.</p>
                <span className="text-[10px] text-emerald-700 font-semibold block">✓ Anda menjawab benar (+20 Pts)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-sumi-border flex justify-end">
              <button
                type="button"
                onClick={() => setReviewPackage(null)}
                className="py-2.5 px-4 rounded-xl bg-crimson text-white font-bold text-xs"
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
