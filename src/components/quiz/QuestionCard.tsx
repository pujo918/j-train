'use client';

import React from 'react';
import { Question } from '@/types';
import { Check, X, Info, Sparkles } from 'lucide-react';
import { normalizeJapaneseAnswer } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onSelectAnswer: (key: string) => void;
  isReviewed?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = '',
  onSelectAnswer,
  isReviewed = false,
}) => {
  const isMultipleChoice = question.options && question.options.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 sm:p-7 space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
        <span className="text-xs font-black tracking-wider uppercase text-crimson bg-crimson-tint px-3 py-1 rounded-full">
          Soal {currentIndex + 1} dari {totalQuestions}
        </span>
        <span className="text-xs font-semibold text-sumi-muted">
          Poin: {(100 / totalQuestions).toFixed(0)} Pts
        </span>
      </div>

      {/* Question Text */}
      <div className="space-y-3">
        <div className="text-base sm:text-lg font-bold text-sumi leading-relaxed whitespace-pre-line font-jp">
          {question.question_text}
        </div>

        {question.image_url && (
          <div className="rounded-2xl overflow-hidden border border-sumi-border max-w-md mx-auto my-2">
            <img src={question.image_url} alt="Ilustrasi Soal" className="w-full h-auto object-cover" />
          </div>
        )}
      </div>

      {/* Answer Inputs */}
      {isMultipleChoice ? (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.key;
            const isCorrect = isReviewed && option.key === question.correct_key;
            const isWrongSelected = isReviewed && isSelected && option.key !== question.correct_key;

            let buttonClass = 'bg-white border-sumi-border hover:border-crimson text-sumi';
            if (isSelected && !isReviewed) {
              buttonClass = 'bg-crimson-subtle border-crimson text-crimson font-bold shadow-sm ring-1 ring-crimson';
            } else if (isCorrect) {
              buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-500';
            } else if (isWrongSelected) {
              buttonClass = 'bg-red-50 border-red-500 text-red-800 font-bold ring-1 ring-red-500';
            }

            return (
              <button
                key={option.key}
                type="button"
                disabled={isReviewed}
                onClick={() => onSelectAnswer(option.key)}
                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all touch-target active:scale-[0.99] ${buttonClass}`}
              >
                {/* Option Key Badge */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                    isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isWrongSelected
                      ? 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-crimson text-white'
                      : 'bg-sumi-light text-sumi-charcoal'
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isWrongSelected ? (
                    <X className="w-4 h-4 stroke-[3]" />
                  ) : (
                    option.key
                  )}
                </div>

                <div className="flex-1 pt-1 text-sm sm:text-base leading-snug font-jp">
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Short Text Input Mode (Dictation Kikikakitori) */
        <div className="space-y-3">
          <label className="block text-xs font-bold text-sumi-charcoal uppercase tracking-wider">
            Tuliskan Jawaban Anda (Hiragana / Huruf Latin):
          </label>
          <input
            type="text"
            disabled={isReviewed}
            value={selectedAnswer}
            onChange={(e) => onSelectAnswer(e.target.value)}
            placeholder="Ketik jawaban Anda di sini..."
            className={`w-full p-4 rounded-2xl border text-base font-jp focus:outline-none transition-all ${
              isReviewed
                ? normalizeJapaneseAnswer(selectedAnswer) === normalizeJapaneseAnswer(question.correct_key)
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                  : 'bg-red-50 border-red-500 text-red-800'
                : 'border-sumi-border focus:border-crimson focus:ring-1 focus:ring-crimson'
            }`}
          />
        </div>
      )}

      {/* Review Explanation Box (After Submission) */}
      {isReviewed && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Kunci Jawaban & Pembahasan Sensei</span>
          </div>

          <div className="text-xs text-amber-950 leading-relaxed font-jp">
            <p className="font-bold text-sumi mb-1">
              Jawaban Benar: <span className="text-emerald-700">{question.correct_key}</span>
            </p>
            {question.explanation ? (
              <p>{question.explanation}</p>
            ) : (
              <p className="italic text-sumi-charcoal">Tidak ada penjelasan khusus untuk soal ini.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
