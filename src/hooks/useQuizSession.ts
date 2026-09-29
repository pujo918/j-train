'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeSet, Question, PracticeResult } from '@/types';
import { useAppStore } from '@/lib/data/store';
import { normalizeJapaneseAnswer } from '@/lib/utils';

export interface QuizSessionState {
  currentIndex: number;
  answers: Record<string, string>; // questionId -> selected key or typed text
  skipped: string[];
  isSubmitted: boolean;
  score: number | null;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  result: PracticeResult | null;
  isOnline: boolean;
  pendingSync: boolean;
}

export function useQuizSession(practiceSet: PracticeSet, initialQuestions: Question[]) {
  const storeSubmit = useAppStore((state) => state.submitPracticeResult);
  const cacheKey = `jtrain_quiz_${practiceSet.id}`;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [skipped, setSkipped] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);

  // Shuffled questions order (cached per session)
  const questions = useMemo(() => {
    // For stable rendering during a session
    return initialQuestions;
  }, [initialQuestions]);

  // Load from LocalStorage recovery state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentIndex) setCurrentIndex(parsed.currentIndex);
        if (parsed.skipped) setSkipped(parsed.skipped);
        if (parsed.timeSpentSeconds) setTimeSpentSeconds(parsed.timeSpentSeconds);
      }
    } catch (e) {
      console.warn('Failed to recover quiz state from localStorage', e);
    }
  }, [cacheKey]);

  // Network online/offline listener
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Auto-retry pending submissions if any
      const offlineQueue = localStorage.getItem('jtrain_offline_submissions');
      if (offlineQueue) {
        try {
          const items = JSON.parse(offlineQueue);
          if (Array.isArray(items) && items.length > 0) {
            items.forEach((item) => storeSubmit(item));
            localStorage.removeItem('jtrain_offline_submissions');
            setPendingSync(false);
          }
        } catch (e) {
          console.error('Error syncing offline queue:', e);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [storeSubmit]);

  // Timer tick while taking quiz
  useEffect(() => {
    if (isSubmitted || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => {
        const next = prev + 1;
        // Periodic auto-save time
        try {
          const saved = localStorage.getItem(cacheKey);
          const currentData = saved ? JSON.parse(saved) : {};
          localStorage.setItem(cacheKey, JSON.stringify({ ...currentData, timeSpentSeconds: next }));
        } catch (_) {}
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, questions.length, cacheKey]);

  // Save state to localStorage whenever answers/skipped changes
  const persistState = useCallback((newAnswers: Record<string, string>, newSkipped: string[], newIndex: number) => {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          answers: newAnswers,
          skipped: newSkipped,
          currentIndex: newIndex,
          timeSpentSeconds,
        })
      );
    } catch (_) {}
  }, [cacheKey, timeSpentSeconds]);

  const selectAnswer = useCallback((questionId: string, answerKey: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answerKey };
      // remove from skipped if answered
      const updatedSkipped = skipped.filter((id) => id !== questionId);
      setSkipped(updatedSkipped);
      persistState(updated, updatedSkipped, currentIndex);
      return updated;
    });
  }, [skipped, currentIndex, persistState]);

  const skipQuestion = useCallback((questionId: string) => {
    if (!skipped.includes(questionId)) {
      const updatedSkipped = [...skipped, questionId];
      setSkipped(updatedSkipped);
      persistState(answers, updatedSkipped, currentIndex);
    }
  }, [skipped, answers, currentIndex, persistState]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      persistState(answers, skipped, index);
    }
  }, [questions.length, answers, skipped, persistState]);

  // Calculate score and submit
  const submitQuiz = useCallback(() => {
    if (isSubmitted || questions.length === 0) return;

    let correct = 0;
    questions.forEach((q) => {
      const studentAns = answers[q.id];
      if (!studentAns) return;

      // Normalization check for both options key and short text input
      const normalizedStudent = normalizeJapaneseAnswer(studentAns);
      const normalizedCorrect = normalizeJapaneseAnswer(q.correct_key);

      if (studentAns === q.correct_key || normalizedStudent === normalizedCorrect) {
        correct += 1;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100 * 10) / 10;
    setCorrectCount(correct);
    setScore(finalScore);
    setIsSubmitted(true);

    const submissionPayload = {
      set_id: practiceSet.id,
      category: practiceSet.category,
      score: finalScore,
      total_questions: questions.length,
      correct_answers: correct,
      time_spent_seconds: timeSpentSeconds,
      set_title: practiceSet.title,
      type: 'quiz_completed' as const,
    };

    if (navigator.onLine) {
      const savedResult = storeSubmit(submissionPayload);
      setResult(savedResult);
    } else {
      // Offline queue
      try {
        const existing = JSON.parse(localStorage.getItem('jtrain_offline_submissions') || '[]');
        existing.push(submissionPayload);
        localStorage.setItem('jtrain_offline_submissions', JSON.stringify(existing));
        setPendingSync(true);
      } catch (e) {
        console.error('Failed to save to offline queue', e);
      }
      // Still log locally
      const savedResult = storeSubmit(submissionPayload);
      setResult(savedResult);
    }

    // Clean up current in-progress quiz session cache
    try {
      localStorage.removeItem(cacheKey);
    } catch (_) {}
  }, [isSubmitted, questions, answers, practiceSet, timeSpentSeconds, storeSubmit, cacheKey]);

  return {
    currentIndex,
    currentQuestion: questions[currentIndex],
    questions,
    answers,
    skipped,
    isSubmitted,
    score,
    correctCount,
    totalQuestions: questions.length,
    timeSpentSeconds,
    result,
    isOnline,
    pendingSync,
    selectAnswer,
    skipQuestion,
    goToQuestion,
    submitQuiz,
  };
}
