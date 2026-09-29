'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  ChevronRight, 
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/data/store';
import { QuizContainer } from '@/components/quiz/QuizContainer';
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
    duration_minutes: activeMode === 'blitz' ? 2 : currentPkg.durationMinutes,
    is_published: true,
    created_by: 'user-sensei',
    created_at: new Date().toISOString(),
  };

  const activeSet: PracticeSet = {
    ...defaultSet,
    id: currentPkg.id,
    title: currentPkg.title,
    duration_minutes: activeMode === 'blitz' ? 2 : currentPkg.durationMinutes,
  };

  const setQuestions: Question[] = (activePackageId === 'set-cc-1' || !CC_ADDITIONAL_QUESTIONS[activePackageId])
    ? questions.filter((q) => q.set_id === 'set-cc-1')
    : CC_ADDITIONAL_QUESTIONS[activePackageId];

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
          className="text-xs font-bold text-sumi-charcoal hover:text-crimson flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white"
        >
          <span>← Batalkan & Kembali ke Arena Cerdas Cermat</span>
        </button>
        <QuizContainer practiceSet={activeSet} questions={setQuestions} />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 text-sumi">
      {/* ========================================================================= */}
      {/* 1. SUB-HEADER & MODE SWITCHER (COMPACT TOP STRIP)                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-3.5">
        {/* Baris 1: Breadcrumb di Kiri & Target KKM di Kanan */}
        <div className="flex items-center justify-between gap-3 text-xs border-b border-sumi-border pb-3 flex-wrap">
          <nav className="flex items-center gap-1.5 flex-wrap">
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
            <span className="font-bold text-crimson">
              Cerdas Cermat (知識クイズ)
            </span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-subtle/40 border border-crimson/20 text-crimson text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Target KKM: ≥ 85 Pts • Akurasi Kecepatan</span>
          </div>
        </div>

        {/* Baris 2: Segmented Toolbar (Mode Toggle & Filter Kategori Materi) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Mode Switcher Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border text-xs">
            <button
              type="button"
              onClick={() => setActiveMode('berwaktu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'berwaktu'
                  ? 'bg-crimson text-white shadow-sm'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Paket Berwaktu (5 Menit)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('blitz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'blitz'
                  ? 'bg-crimson text-white shadow-sm'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Rapid Blitz (15 Detik/Soal)</span>
            </button>
          </div>

          {/* Filter Kategori Materi */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border text-xs overflow-x-auto">
            <span className="text-[11px] font-semibold text-sumi-muted px-2 flex items-center gap-1 flex-shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-crimson" />
              <span>Materi:</span>
            </span>

            {[
              { key: 'all', label: 'Semua' },
              { key: 'budaya', label: 'Budaya (Bunka)' },
              { key: 'geografi_sejarah', label: 'Geografi & Sejarah' },
              { key: 'kotowaza', label: 'Peribahasa (Kotowaza)' },
              { key: 'tata_bahasa', label: 'Tata Bahasa Cepat' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sumi text-white shadow-sm'
                      : 'text-sumi-charcoal hover:text-sumi hover:bg-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RAPID QUIZ ARENA: 2 KOLOM (GRID PAKET & PAPAN SKOR / DAILY TRIVIA)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* SISI KIRI: GRID PAKET SIMULASI CEPAT (Col 7/12)                         */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-crimson rounded-full" />
              <h2 className="text-sm font-black tracking-wide text-sumi uppercase">
                DAFTAR PAKET SIMULASI CEPAT
              </h2>
            </div>
            <span className="text-[11px] font-bold text-sumi-charcoal bg-white px-2.5 py-0.5 rounded-full border border-sumi-border shadow-xs">
              {filteredPackages.length} Paket Latihan Tersedia
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPackages.map((pkg, idx) => {
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl border border-sumi-border hover:border-crimson/40 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-crimson border border-crimson/20">
                      {pkg.difficultyLevel}
                    </span>

                    {pkg.isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-2.5 h-2.5" />
                        <span>Selesai</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-sumi leading-snug group-hover:text-crimson transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-sumi-muted font-medium">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-sumi-charcoal" />
                        <span>{activeMode === 'blitz' ? '15s / Soal' : `${pkg.durationMinutes} Menit`} Batas Waktu</span>
                      </span>
                      <span>•</span>
                      <span>{pkg.questionCount} Soal Pilihan Ganda</span>
                    </div>
                  </div>

                  {/* Target Threshold Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-sumi-border/40">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-crimson rounded-full"
                        style={{ width: `${pkg.bestScore || 100}%` }}
                      />
                    </div>
                    {pkg.bestScore !== undefined && (
                      <div className="flex items-center justify-between text-[10px] text-sumi-charcoal font-medium">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Skor Terbaik Anda: <strong className="text-sumi font-black">{pkg.bestScore} Pts</strong> [V]</span>
                        </span>
                        <span className="font-mono text-sumi-muted">{pkg.bestTimeFormatted}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-sumi-border/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartQuiz(pkg.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
                    >
                      {pkg.isCompleted ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Ulangi Ujian</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Mulai Rapid Quiz</span>
                        </>
                      )}
                    </button>

                    {pkg.isCompleted && (
                      <button
                        type="button"
                        onClick={() => setReviewPackage(pkg)}
                        className="p-2 rounded-xl border border-sumi-border hover:bg-[#FAF7F2] text-sumi-charcoal hover:text-crimson text-xs transition-colors"
                        title="Lihat Pembahasan"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SISI KANAN: PAPAN SKOR KONTINGEN & DAILY TRIVIA (Col 5/12)              */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-4">
          {/* Card 1: PAPAN SKOR KONTINGEN (LIVE) */}
          <div className="bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-sumi uppercase">
                  PAPAN SKOR KONTINGEN (LIVE)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Peringkat Kecepatan
              </span>
            </div>

            {/* List Top 3 Students */}
            <div className="space-y-2">
              {CC_LEADERBOARD.map((student) => (
                <div
                  key={student.rank}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    student.rank === 1
                      ? 'bg-amber-50/60 border-amber-200 shadow-2xs'
                      : 'bg-[#FAF7F2]/60 border-sumi-border/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg select-none" role="img" aria-label={`Peringkat ${student.rank}`}>
                      {student.badgeEmoji}
                    </span>
                    <span className={`w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center ${student.avatarBg}`}>
                      {student.avatarInitial}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-sumi block leading-tight">
                        {student.name}
                      </span>
                      <span className="text-[10px] font-mono text-sumi-muted">
                        ⏱ {student.timeFormatted}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-crimson font-mono block">
                      {student.score} Pts
                    </span>
                    <span className="text-[9px] text-sumi-muted block">
                      {student.rank === 1 ? 'Tertinggi' : 'Terverifikasi'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Keterangan Bawah */}
            <p className="text-[10px] text-sumi-muted italic pt-1 border-t border-sumi-border/60">
              *Skor sama diurutkan berdasarkan waktu pengerjaan tercepat.
            </p>
          </div>

          {/* Card 2: DAILY TRIVIA DUEL (TEBAK KILAT) */}
          <div className="bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-crimson" />
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-sumi uppercase">
                  DAILY TRIVIA DUEL
                </h3>
              </div>
              <span className="text-[10px] font-bold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
                Tebak Kilat
              </span>
            </div>

            <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-sumi-border space-y-2.5">
              <div className="text-xs text-sumi font-semibold leading-relaxed">
                <span className="text-[11px] text-sumi-muted block uppercase font-bold mb-0.5">Soal Cepat Hari Ini:</span>
                "Prefektur dengan wilayah terluas di Jepang?"
              </div>

              {/* 2 Option Pills */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTriviaOption('A');
                    setIsTriviaAnswered(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    selectedTriviaOption === 'A'
                      ? isTriviaAnswered
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : 'bg-crimson text-white border-crimson'
                      : 'bg-white border-sumi-border text-sumi-charcoal hover:border-sumi-charcoal hover:bg-white'
                  }`}
                >
                  [ A. Hokkaido ]
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTriviaOption('B');
                    setIsTriviaAnswered(false);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    selectedTriviaOption === 'B'
                      ? isTriviaAnswered
                        ? 'bg-rose-100 border-rose-400 text-rose-800'
                        : 'bg-crimson text-white border-crimson'
                      : 'bg-white border-sumi-border text-sumi-charcoal hover:border-sumi-charcoal hover:bg-white'
                  }`}
                >
                  [ B. Tokyo ]
                </button>
              </div>

              {/* Feedback text */}
              {isTriviaAnswered && triviaFeedback && (
                <div
                  className={`p-2.5 rounded-lg text-[11px] leading-relaxed border ${
                    selectedTriviaOption === 'A'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {triviaFeedback}
                </div>
              )}

              {/* Button Jawab Cepat */}
              <button
                type="button"
                onClick={handleAnswerTrivia}
                disabled={!selectedTriviaOption}
                className="w-full py-2.5 px-3 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white/20" />
                <span>Jawab Cepat →</span>
              </button>
            </div>
          </div>
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
