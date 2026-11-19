'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PracticeSet, Question } from '@/types';
import { useQuizSession } from '@/hooks/useQuizSession';
import { QuestionCard } from './QuestionCard';
import { QuizTimer } from './QuizTimer';
import { QuizSummaryModal } from './QuizSummaryModal';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  FastForward, 
  HelpCircle 
} from 'lucide-react';

interface QuizContainerProps {
  practiceSet: PracticeSet;
  questions: Question[];
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  practiceSet,
  questions,
}) => {
  const router = useRouter();
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const {
    currentIndex,
    currentQuestion,
    answers,
    skipped,
    isSubmitted,
    score,
    correctCount,
    totalQuestions,
    timeSpentSeconds,
    isOnline,
    pendingSync,
    selectAnswer,
    skipQuestion,
    goToQuestion,
    submitQuiz,
  } = useQuizSession(practiceSet, questions);

  const handleFinishQuiz = () => {
    submitQuiz();
    setShowSummaryModal(true);
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Offline / Sync Notification Bar */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span>Koneksi offline: Jawaban disimpan aman di browser dan akan otomatis dikirim saat online kembali.</span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Toleransi Jaringan Aktif</span>
        </div>
      )}

      {/* Header Bar — Light Frosted Glass with Crisp Sumi Typography */}
      <div className="panel-frost-glass text-sumi rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-white/80 bg-white/75 hover:bg-white text-sumi transition-colors touch-target shadow-2xs"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-crimson text-white">
                {practiceSet.category.replace('_', ' ')}
              </span>
              <span className="text-xs font-bold text-sumi-charcoal">
                {practiceSet.difficulty_level}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-sumi mt-0.5">
              {practiceSet.title}
            </h1>
          </div>
        </div>

        {/* Timer or Status */}
        {practiceSet.duration_minutes > 0 && !isSubmitted && (
          <div className="w-full md:w-60">
            <QuizTimer
              initialSeconds={practiceSet.duration_minutes * 60}
              onTimeout={handleFinishQuiz}
              isPaused={isSubmitted}
            />
          </div>
        )}

        {isSubmitted && (
          <div className="flex items-center gap-2 bg-white/75 border border-white/85 px-4 py-2 rounded-2xl shadow-2xs">
            <span className="text-xs font-bold text-sumi-charcoal">Skor Anda:</span>
            <span className="text-xl font-black text-crimson">{score}</span>
            <span className="text-xs text-sumi-muted">/ 100</span>
          </div>
        )}
      </div>

      {/* Question Number Pills Navigation */}
      <div className="panel-frost-glass rounded-2xl p-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#3D332A] mb-2.5">
          <span>Navigasi Soal:</span>
          <span>
            Terjawab: <strong className="text-crimson font-black">{answeredCount}</strong> / {totalQuestions}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = !!answers[q.id];
            const isSkipped = skipped.includes(q.id) && !isAnswered;

            let pillStyle = "bg-[#FFFDF8] text-[#4A3F35] border-[#D8CBB8] hover:border-crimson/50";
            if (isAnswered) {
              pillStyle = "bg-crimson text-white border-crimson font-bold";
            } else if (isSkipped) {
              pillStyle = "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
            }

            if (isCurrent) {
              pillStyle += " ring-2 ring-sumi ring-offset-2 ring-offset-[#F8F1E5] scale-105";
            }

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${pillStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          selectedAnswer={answers[currentQuestion.id] || ''}
          onSelectAnswer={(key) => selectAnswer(currentQuestion.id, key)}
          isReviewed={isReviewMode}
        />
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-sumi-border transition-all touch-target ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-sumi-light text-sumi-muted'
              : 'bg-white hover:bg-sumi-light text-sumi'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isSubmitted && (
            <button
              onClick={() => {
                if (currentQuestion) skipQuestion(currentQuestion.id);
                if (currentIndex < totalQuestions - 1) {
                  goToQuestion(currentIndex + 1);
                }
              }}
              className="flex-1 sm:flex-none px-4 py-3 bg-washi hover:bg-sumi-light text-sumi-charcoal font-semibold text-xs rounded-xl border border-sumi-border flex items-center justify-center gap-1.5 touch-target transition-colors"
            >
              <FastForward className="w-4 h-4" />
              <span>Lewati (Nanti)</span>
            </button>
          )}

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              className="flex-1 sm:flex-none px-6 py-3 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] touch-target"
            >
              <span>Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            !isSubmitted && (
              <button
                onClick={handleFinishQuiz}
                className="flex-1 sm:flex-none px-7 py-3 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-float transition-all hover:scale-[1.01] active:scale-[0.98] touch-target"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kumpulkan Jawaban</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Summary Modal */}
      <QuizSummaryModal
        isOpen={showSummaryModal}
        score={score || 0}
        correctAnswers={correctCount}
        totalQuestions={totalQuestions}
        timeSpentSeconds={timeSpentSeconds}
        onReview={() => {
          setShowSummaryModal(false);
          setIsReviewMode(true);
        }}
        onRetry={() => {
          setShowSummaryModal(false);
          setIsReviewMode(false);
          window.location.reload();
        }}
        onClose={() => router.push('/siswa')}
        categoryTitle={practiceSet.title}
      />
    </div>
  );
};
