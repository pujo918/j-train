'use client';

import React, { useState } from 'react';
import { Mic, Square, RotateCcw, Play, Pause, Volume2, CheckCircle2, Award, Sparkles, AlertCircle } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { formatTimeSeconds } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/data/store';
import { CompetitionCategory } from '@/types';

interface BrowserVoiceRecorderProps {
  referenceAudioUrl?: string;
  referenceTitle?: string;
  category: CompetitionCategory;
  setId: string;
  setTitle: string;
  onFinishSelfPractice?: () => void;
}

export const BrowserVoiceRecorder: React.FC<BrowserVoiceRecorderProps> = ({
  referenceAudioUrl,
  referenceTitle = "Audio Acuan Sensei",
  category,
  setId,
  setTitle,
  onFinishSelfPractice,
}) => {
  const {
    isRecording,
    recordingDuration,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const submitPracticeResult = useAppStore((state) => state.submitPracticeResult);
  const [isCompleted, setIsCompleted] = useState(false);
  const [refAudioPlaying, setRefAudioPlaying] = useState(false);
  const [studentAudioPlaying, setStudentAudioPlaying] = useState(false);

  const refAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const studentAudioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleRefAudio = () => {
    if (!refAudioRef.current) return;
    if (refAudioPlaying) {
      refAudioRef.current.pause();
      setRefAudioPlaying(false);
    } else {
      // Pause student audio if playing
      if (studentAudioRef.current) {
        studentAudioRef.current.pause();
        setStudentAudioPlaying(false);
      }
      refAudioRef.current.play().then(() => setRefAudioPlaying(true)).catch(console.error);
    }
  };

  const toggleStudentAudio = () => {
    if (!studentAudioRef.current) return;
    if (studentAudioPlaying) {
      studentAudioRef.current.pause();
      setStudentAudioPlaying(false);
    } else {
      // Pause ref audio if playing
      if (refAudioRef.current) {
        refAudioRef.current.pause();
        setRefAudioPlaying(false);
      }
      studentAudioRef.current.play().then(() => setStudentAudioPlaying(true)).catch(console.error);
    }
  };

  const handleCompleteSelfPractice = () => {
    submitPracticeResult({
      set_id: setId,
      category,
      score: null, // non-quiz has null score
      total_questions: 0,
      correct_answers: 0,
      time_spent_seconds: recordingDuration > 0 ? recordingDuration : 180,
      set_title: setTitle,
      type: 'voice_practiced',
    });

    setIsCompleted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B91C1C', '#FAF7F2', '#111827', '#FEE2E2'],
    });

    if (onFinishSelfPractice) {
      onFinishSelfPractice();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-sumi-border shadow-card p-5 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sumi-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-crimson-tint text-crimson">
              <Mic className="w-4 h-4" />
            </span>
            <h4 className="text-sm font-extrabold text-sumi">
              Perekam Suara Latihan Mandiri (In-Browser Recorder)
            </h4>
          </div>
          <p className="text-xs text-sumi-charcoal mt-1">
            Rekam artikulasi pelafalan Anda, bandingkan langsung dengan model Sensei. Rekaman disimpan lokal di browser tanpa memakan kuota internet.
          </p>
        </div>

        {isCompleted && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai Latihan Mandiri
          </span>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recording Control Desk */}
      <div className="p-5 rounded-2xl bg-washi border border-sumi-border flex flex-col items-center justify-center text-center space-y-4">
        {/* Visual Pulse / Status */}
        <div className="relative">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-crimson text-white animate-pulse shadow-float scale-105'
                : audioUrl
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-white border-2 border-sumi-border text-sumi-charcoal'
            }`}
          >
            {isRecording ? (
              <Square className="w-7 h-7 fill-white cursor-pointer" onClick={stopRecording} />
            ) : (
              <Mic className="w-8 h-8 cursor-pointer" onClick={startRecording} />
            )}
          </div>
          {isRecording && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-crimson"></span>
            </span>
          )}
        </div>

        {/* Timer display */}
        <div className="space-y-1">
          <div className="text-2xl font-black font-mono text-sumi">
            {formatTimeSeconds(recordingDuration)}
          </div>
          <div className="text-xs font-medium text-sumi-charcoal">
            {isRecording
              ? 'Sedang merekam suara... Bacalah naskah dengan intonasi jelas.'
              : audioUrl
              ? 'Rekaman selesai. Dengarkan & bandingkan di bawah ini.'
              : 'Tekan tombol mikrofon untuk mulai membaca naskah.'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-5 py-2.5 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-2 touch-target"
            >
              <Mic className="w-4 h-4" />
              <span>{audioUrl ? 'Rekam Ulang (Take Baru)' : 'Mulai Merekam'}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-2.5 bg-sumi hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center gap-2 touch-target"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Selesai Membaca</span>
            </button>
          )}

          {audioUrl && !isRecording && (
            <button
              onClick={resetRecording}
              className="px-4 py-2.5 bg-white hover:bg-sumi-light text-sumi-charcoal font-semibold text-xs rounded-xl border border-sumi-border transition-colors flex items-center gap-1.5 touch-target"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hapus Hasil</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* 1. Reference Audio Sensei */}
        <div className="p-4 rounded-2xl bg-white border border-sumi-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sumi flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-crimson" />
                <span>Model Acuan Sensei</span>
              </span>
              <span className="text-[10px] font-semibold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
                Standar Lomba
              </span>
            </div>
            <p className="text-[11px] text-sumi-charcoal mb-4">
              Perhatikan aksen nada naik-turun (pitch accent) dan durasi jeda naskah.
            </p>
          </div>

          <audio
            ref={refAudioRef}
            src={referenceAudioUrl || 'https://actions.google.com/sounds/v1/weather/winter_wind.ogg'}
            onEnded={() => setRefAudioPlaying(false)}
          />

          <button
            onClick={toggleRefAudio}
            className="w-full py-2.5 bg-washi hover:bg-sumi-light text-sumi font-bold text-xs rounded-xl border border-sumi-border flex items-center justify-center gap-2 transition-colors touch-target"
          >
            {refAudioPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda Audio Sensei</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-sumi" />
                <span>Putar Audio Sensei</span>
              </>
            )}
          </button>
        </div>

        {/* 2. Student's In-Browser Recording */}
        <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
          audioUrl ? 'bg-white border-crimson/30 shadow-sm' : 'bg-sumi-light/40 border-dashed border-sumi-border opacity-70'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sumi flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-crimson" />
                <span>Rekaman Anda Sendiri</span>
              </span>
              <span className="text-[10px] font-semibold text-sumi-charcoal bg-sumi-light px-2 py-0.5 rounded-full">
                {audioUrl ? 'Tersedia di Memori' : 'Belum Ada'}
              </span>
            </div>
            <p className="text-[11px] text-sumi-charcoal mb-4">
              Dengarkan kembali suara Anda untuk merefleksikan artikulasi sebelum tatap muka.
            </p>
          </div>

          {audioUrl ? (
            <>
              <audio
                ref={studentAudioRef}
                src={audioUrl}
                onEnded={() => setStudentAudioPlaying(false)}
              />
              <button
                onClick={toggleStudentAudio}
                className="w-full py-2.5 bg-crimson hover:bg-crimson-dark text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm touch-target"
              >
                {studentAudioPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Jeda Suara Saya</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Dengarkan Rekaman Saya</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="py-2.5 text-center text-xs text-sumi-muted italic border border-dashed border-sumi-border rounded-xl">
              Silakan rekam suara Anda terlebih dahulu
            </div>
          )}
        </div>
      </div>

      {/* Completion Button */}
      <div className="pt-2 border-t border-sumi-border flex items-center justify-end">
        <button
          onClick={handleCompleteSelfPractice}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all touch-target shadow-sm ${
            isCompleted
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-crimson hover:bg-crimson-dark text-white active:scale-98'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Sesi Tercatat di Dashboard Sensei</span>
            </>
          ) : (
            <>
              <Award className="w-4 h-4" />
              <span>Tandai Selesai Latihan Mandiri</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
