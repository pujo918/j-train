'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Square, 
  Mic, 
  Sparkles, 
  Lock, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  SlidersHorizontal, 
  Award, 
  ArrowRight, 
  Clock,
  Volume2,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/data/store';
import { RODOKU_STORIES, RodokuTextItem, formatRodokuHtml } from '@/lib/data/rodokuModuleData';

function formatTimer(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [
    hrs.toString().padStart(2, '0'),
    mins.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
}

// Generate simple fallback audio blob if microphone is blocked or not available
function createSyntheticWav(durationSeconds: number): Blob {
  const sampleRate = 44100;
  const numSamples = Math.max(1, Math.round(durationSeconds * sampleRate));
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++, offset += 2) {
    const t = i / sampleRate;
    const val = 0.15 * Math.sin(2 * Math.PI * 349.23 * t) * Math.exp(-t / (Math.max(1, durationSeconds) * 0.8));
    const s = Math.max(-1, Math.min(1, val));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

export default function RodokuLombaPage() {
  const router = useRouter();
  const { practiceSets, submitPracticeResult } = useAppStore();

  const [selectedStoryId, setSelectedStoryId] = useState<string>(RODOKU_STORIES[0].id);
  const activeStory = RODOKU_STORIES.find((s) => s.id === selectedStoryId) || RODOKU_STORIES[0];

  // Text presentation controls
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('lg');
  const [showFurigana, setShowFurigana] = useState(true);
  const [showPauses, setShowPauses] = useState(true);

  // Self-check rubric checkboxes
  const [rubricChecks, setRubricChecks] = useState({
    articulation: false,
    pauses: false,
    intonation: false,
  });

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [takeCount, setTakeCount] = useState(1);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isSavedTake, setIsSavedTake] = useState(false);

  // Audio Playback states
  const [isPlayingSensei, setIsPlayingSensei] = useState(false);
  const [isPlayingStudent, setIsPlayingStudent] = useState(false);

  // Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Audio refs & timers
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const studentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const senseiAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Switch story handler
  const handleSelectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setRecordedAudioUrl(null);
    setIsSavedTake(false);
    if (senseiAudioElementRef.current) senseiAudioElementRef.current.pause();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSensei(false);
    setIsPlayingStudent(false);
  };

  // Clean up object URLs and timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (senseiAudioElementRef.current) {
        senseiAudioElementRef.current.pause();
      }
    };
  }, [recordedAudioUrl]);

  // Speech synthesis fallback helper
  const playWithSpeechSynthesis = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeStory.fullStoryRaw);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.92; // Serene, dignified reading tempo
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingSensei(false);
      utterance.onerror = () => setIsPlayingSensei(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsPlayingSensei(false);
      }, activeStory.targetDurationSeconds * 1000);
    }
  }, [activeStory.fullStoryRaw, activeStory.targetDurationSeconds]);

  // Toggle Sensei / Native Audio Reference
  const handleToggleSenseiAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Stop student audio if playing
    if (studentAudioElementRef.current) {
      studentAudioElementRef.current.pause();
      setIsPlayingStudent(false);
    }

    if (isPlayingSensei) {
      if (senseiAudioElementRef.current) senseiAudioElementRef.current.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingSensei(false);
      return;
    }

    setIsPlayingSensei(true);

    // 1. Play real Native Japanese voice file if available
    if (activeStory.audioReferenceUrl) {
      if (senseiAudioElementRef.current) senseiAudioElementRef.current.pause();
      const audio = new Audio(activeStory.audioReferenceUrl);
      senseiAudioElementRef.current = audio;

      audio.onended = () => setIsPlayingSensei(false);
      audio.onerror = () => {
        playWithSpeechSynthesis();
      };
      audio.play().catch(() => {
        playWithSpeechSynthesis();
      });
      return;
    }

    playWithSpeechSynthesis();
  }, [isPlayingSensei, activeStory.audioReferenceUrl, playWithSpeechSynthesis]);

  // Start recording
  const handleStartRecording = async () => {
    // Stop any playing audio
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSensei(false);
    if (studentAudioElementRef.current) {
      studentAudioElementRef.current.pause();
      setIsPlayingStudent(false);
    }

    setIsRecording(true);
    setRecordingSeconds(0);
    setIsSavedTake(false);
    audioChunksRef.current = [];

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Try real microphone access
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(250);
        return;
      } catch (err) {
        console.warn('Microphone access fallback to synthetic take:', err);
      }
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback synthetic take generation
      const duration = Math.max(3, recordingSeconds);
      const synthBlob = createSyntheticWav(duration);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      const url = URL.createObjectURL(synthBlob);
      setRecordedAudioUrl(url);
    }
  };

  // Play student recorded audio
  const handlePlayStudentAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingStudent) {
      if (studentAudioElementRef.current) {
        studentAudioElementRef.current.pause();
      }
      setIsPlayingStudent(false);
      return;
    }

    // Stop Sensei audio if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingSensei(false);

    if (!studentAudioElementRef.current) {
      studentAudioElementRef.current = new Audio(recordedAudioUrl);
    } else {
      studentAudioElementRef.current.src = recordedAudioUrl;
    }

    studentAudioElementRef.current.onended = () => {
      setIsPlayingStudent(false);
    };

    studentAudioElementRef.current.play()
      .then(() => setIsPlayingStudent(true))
      .catch((e) => {
        console.warn('Playback error:', e);
        setIsPlayingStudent(false);
      });
  };

  // Reset take
  const handleResetTake = () => {
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsSavedTake(false);
    setIsPlayingStudent(false);
    setTakeCount((prev) => prev + 1);
  };

  // Save take
  const handleSaveTake = () => {
    if (!recordedAudioUrl) return;
    setIsSavedTake(true);
  };

  // Complete self practice session
  const handleCompleteSelfPractice = () => {
    submitPracticeResult({
      set_id: activeStory.id,
      category: 'rodoku',
      score: null, // Reading aloud evaluated holistically
      total_questions: 1,
      correct_answers: 1,
      time_spent_seconds: recordingSeconds > 0 ? recordingSeconds : 150,
      set_title: `${activeStory.titleKanji} (${activeStory.title})`,
      type: 'voice_practiced',
    });

    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B91C1C', '#FAF7F2', '#111827', '#FEE2E2', '#D97706'],
    });

    setShowCompletionModal(true);
  };

  // Waveform bars
  const waveformBars = [
    12, 16, 24, 38, 48, 64, 82, 95, 88, 70, 52, 40, 60, 75, 92, 100, 85, 68, 55, 42, 60, 80, 70, 50, 35, 22, 16, 12
  ];

  return (
    <div className="space-y-4 pb-12 text-sumi">
      {/* Scoped CSS rule for furigana color and toggle */}
      <style dangerouslySetInnerHTML={{ __html: `
        ruby rt { color: #B91C1C; font-size: 0.58em; font-weight: 600; line-height: 1; }
        ruby { ruby-align: center; ruby-position: over; }
        ${!showFurigana ? 'ruby rt { display: none !important; }' : ''}
      ` }} />

      {/* ========================================================================= */}
      {/* 1. SUB-HEADER & TOOLBAR KONTROL TEKS (COMPACT TOP STRIP)                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-3.5">
        {/* Baris 1: Breadcrumb Navigasi di Kiri & Badge Status Mode di Kanan */}
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
              Rodoku (朗読)
            </span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-subtle/40 border border-crimson/20 text-crimson text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Mode Workbench Interaktif • Prototype Suara Nihonjin Asli</span>
          </div>
        </div>

        {/* Baris 1.5: Pilihan 5 Karya Sastra Rodoku */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <span className="text-[11px] font-bold text-sumi-charcoal shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-crimson" />
            <span>Pilih Naskah Sastra:</span>
          </span>
          {RODOKU_STORIES.map((story) => {
            const isSelected = selectedStoryId === story.id;
            return (
              <button
                key={story.id}
                onClick={() => handleSelectStory(story.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-crimson text-white border-crimson shadow-sm'
                    : 'bg-[#FAF7F2] text-sumi-charcoal border-sumi-border hover:bg-[#F5EFE6] hover:text-sumi'
                }`}
              >
                <span>{story.titleKanji}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-sumi-muted/20 text-sumi-charcoal'
                }`}>
                  {story.author}
                </span>
              </button>
            );
          })}
        </div>

        {/* Baris 2: Judul Naskah & Interactive Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-crimson" />
              <h1 className="text-base sm:text-lg font-black text-sumi">
                Teks Latihan: <span className="text-crimson font-serif">{activeStory.titleKanji}</span> ({activeStory.author})
              </h1>
            </div>
            <p className="text-xs text-sumi-charcoal">
              {activeStory.description} • Tempo: <span className="font-medium text-sumi">{activeStory.tempo}</span>
            </p>
          </div>

          {/* Interactive Controls Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
            {/* Segmented Button Ukuran Teks */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border">
              <span className="text-[11px] font-semibold text-sumi-muted px-2">Ukuran Teks:</span>
              <button
                type="button"
                onClick={() => setFontSize('md')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'md'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                Sedang
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'lg'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                Besar (Aktif)
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xl')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'xl'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                Ekstra
              </button>
            </div>

            {/* Toggle Furigana */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border">
              <span className="text-[11px] font-semibold text-sumi-muted px-2">Furigana:</span>
              <button
                type="button"
                onClick={() => setShowFurigana(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  showFurigana
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                ON (✓)
              </button>
              <button
                type="button"
                onClick={() => setShowFurigana(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !showFurigana
                    ? 'bg-sumi text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                OFF
              </button>
            </div>

            {/* Toggle Tanda Jeda */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border">
              <span className="text-[11px] font-semibold text-sumi-muted px-2">Tanda Jeda:</span>
              <button
                type="button"
                onClick={() => setShowPauses(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  showPauses
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                ON ✓
              </button>
              <button
                type="button"
                onClick={() => setShowPauses(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !showPauses
                    ? 'bg-sumi text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                OFF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUBBING / READING WORKBENCH: 2 KOLOM (LEMBAR BACAAN & AUDIO STUDIO)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* SISI KIRI: LEMBAR BACAAN INTERAKTIF (Col 7/12)                          */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-crimson rounded-full" />
              <h2 className="text-sm sm:text-base font-black tracking-wide text-sumi uppercase">
                INTERACTIVE LEMBAR BACAAN
              </h2>
            </div>
            <span className="text-[11px] font-bold text-sumi-charcoal bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-sumi-border">
              {activeStory.author} • {activeStory.genre}
            </span>
          </div>

          {/* Reading Container with Isolated Vertical Scroll (Zero Global Scroll) */}
          <div className="p-4 sm:p-6 rounded-xl bg-[#FAF7F2]/75 border border-[#EBE4D8] max-h-[520px] overflow-y-auto pr-3 space-y-5 select-text">
            {/* Romaji Title Header */}
            <div className="border-b border-[#E3DACB] pb-2 mb-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-sumi-muted uppercase block">
                  {activeStory.genre}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-wider text-sumi font-sans">
                  {activeStory.titleKanji} — {activeStory.title}
                </h3>
              </div>
              <span className="text-xs font-bold text-sumi-charcoal bg-white px-2.5 py-1 rounded-lg border border-sumi-border shadow-xs">
                Karya: {activeStory.authorKanji} ({activeStory.author})
              </span>
            </div>

            {/* Semantic Ruby Furigana Story Text */}
            <div
              className={`font-jp font-bold text-sumi leading-[2.6] sm:leading-[2.8] space-y-4 tracking-wide ${
                fontSize === 'md'
                  ? 'text-base sm:text-lg'
                  : fontSize === 'lg'
                  ? 'text-lg sm:text-[20px]'
                  : 'text-xl sm:text-[22px]'
              }`}
            >
              {activeStory.rubyHtml.split(/<br\s*\/?>/i).map((paraHtml, pIdx) => {
                const cleanHtml = formatRodokuHtml(paraHtml, showPauses, showFurigana);

                return (
                  <p
                    key={pIdx}
                    dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    className="bg-white/80 p-3.5 sm:p-4 rounded-xl border border-sumi-border/50 shadow-2xs leading-[2.8]"
                  />
                );
              })}
            </div>
          </div>

          {/* Legenda & Progress Info Bar */}
          <div className="pt-2 border-t border-sumi-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sumi-muted">
            <span className="font-mono font-medium text-sumi-charcoal">
              *GoresanAktif: [=== 4 / 12 ===] (contoh furigana aktif)*
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="font-bold text-sumi">Jeda Napas:</span>
              <span className="inline-flex items-center gap-1">
                <code className="px-1.5 py-0.5 rounded bg-crimson-tint text-crimson font-black">/</code> 1 Ketuk
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <code className="px-1.5 py-0.5 rounded bg-crimson-tint text-crimson font-black">//</code> 2 Ketuk
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SISI KANAN: AUDIO MODEL & STUDIO PEREKAM (Col 5/12)                     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-4 lg:sticky lg:top-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-crimson" />
              <h2 className="text-sm sm:text-base font-black tracking-wide text-sumi uppercase">
                AUDIO MODEL & STUDIO PEREKAM
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
              <span>Take {takeCount}</span>
            </span>
          </div>

          {/* Top Panel: Timer, Waveform & Self-Check Rubrics */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#E9E3D8] p-4 text-center space-y-3.5 shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Left / Center: Timer & Live Waveform (Col 7) */}
              <div className="sm:col-span-7 space-y-2">
                <span className="text-[10px] text-sumi-muted uppercase font-bold tracking-wider block">
                  {isRecording ? 'Merekam Suara...' : 'Durasi Rekaman:'}
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-black text-sumi tracking-widest select-none">
                  {formatTimer(recordingSeconds)}
                </div>

                {/* Animated Waveform Display */}
                <div className="h-10 flex items-center justify-center gap-0.5 sm:gap-1 px-2 overflow-hidden">
                  {waveformBars.map((height, i) => {
                    const isAnimated = isRecording || isPlayingStudent || isPlayingSensei;
                    const dynamicHeight = isAnimated
                      ? Math.max(15, Math.min(100, height + Math.sin((i + recordingSeconds * 6)) * 32))
                      : isRecording
                      ? 50
                      : height * 0.4;

                    return (
                      <span
                        key={i}
                        style={{
                          height: `${dynamicHeight}%`,
                        }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isRecording
                            ? 'bg-crimson animate-pulse'
                            : isPlayingStudent
                            ? 'bg-amber-600'
                            : isPlayingSensei
                            ? 'bg-sumi'
                            : 'bg-sumi-muted/30'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Right: Self-Check Evaluation Rubric Checkboxes (Col 5) */}
              <div className="sm:col-span-5 bg-white p-3 rounded-xl border border-sumi-border/70 text-left space-y-2">
                <span className="text-[10px] font-bold text-sumi-charcoal uppercase tracking-wider block border-b border-sumi-border/50 pb-1">
                  Rubrik Evaluasi:
                </span>
                <div className="space-y-1.5 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-sumi">
                    <input
                      type="checkbox"
                      checked={rubricChecks.articulation}
                      onChange={(e) => setRubricChecks({ ...rubricChecks, articulation: e.target.checked })}
                      className="rounded text-crimson focus:ring-crimson w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Artikulasi Jelas</span>
                    <span title="Kejelasan pengucapan konsonan dan vokal (Hatsuon)" className="text-sumi-muted cursor-help">ⓘ</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-sumi">
                    <input
                      type="checkbox"
                      checked={rubricChecks.pauses}
                      onChange={(e) => setRubricChecks({ ...rubricChecks, pauses: e.target.checked })}
                      className="rounded text-crimson focus:ring-crimson w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Ketepatan Jeda</span>
                    <span title="Ketepatan pemenggalan 1 ketuk (/) dan 2 ketuk (//)" className="text-sumi-muted cursor-help">ⓘ</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-sumi">
                    <input
                      type="checkbox"
                      checked={rubricChecks.intonation}
                      onChange={(e) => setRubricChecks({ ...rubricChecks, intonation: e.target.checked })}
                      className="rounded text-crimson focus:ring-crimson w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Intonasi Alami</span>
                    <span title="Aksen nada naik-turun khas bahasa Jepang (Akusento)" className="text-sumi-muted cursor-help">ⓘ</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Primary Action Button: MULAI REKAM / SELESAI REKAM */}
            <div className="pt-1">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full py-3 px-5 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-lg active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>MULAI REKAM BACAAN</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full py-3 px-5 rounded-xl bg-crimson-dark text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg animate-pulse active:scale-98 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>SELESAI REKAM (STOP)</span>
                </button>
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* Side-by-Side Playback Section                                         */}
          {/* ===================================================================== */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-sumi">
                Self-Check Evaluation Rubric
              </h3>
              <span className="text-[10px] font-bold text-sumi-charcoal bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Ulangi Playback</span>
              </span>
            </div>

            {/* Dua Tombol Audio Berdampingan: Model Sensei vs Rekaman Anda */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleToggleSenseiAudio}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isPlayingSensei
                    ? 'bg-sumi text-white border-sumi animate-pulse'
                    : 'bg-[#FAF7F2] text-sumi border-sumi-border hover:bg-white hover:border-sumi-charcoal'
                }`}
              >
                {isPlayingSensei ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda Model</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Suara Nihonjin Asli</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePlayStudentAudio}
                disabled={!recordedAudioUrl || isRecording}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !recordedAudioUrl
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : isPlayingStudent
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-[#FAF7F2] text-sumi border-sumi-border hover:bg-white hover:border-crimson'
                }`}
              >
                {isPlayingStudent ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda Suara</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Rekaman Anda</span>
                  </>
                )}
              </button>
            </div>

            {/* Tombol Ulangi & Simpan */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleResetTake}
                disabled={!recordedAudioUrl || isRecording}
                className="py-2 px-3 rounded-xl border border-sumi-border bg-white text-sumi-charcoal hover:text-sumi text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FAF7F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Ulangi</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTake}
                disabled={!recordedAudioUrl || isRecording || isSavedTake}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  isSavedTake
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white border border-sumi-border text-sumi-charcoal hover:text-crimson hover:bg-[#FAF7F2] disabled:opacity-50'
                }`}
              >
                {isSavedTake ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* Tombol Finalisasi Sesi: Full-width crimson completion button           */}
          {/* ===================================================================== */}
          <div className="pt-2 border-t border-sumi-border">
            <button
              type="button"
              onClick={handleCompleteSelfPractice}
              className="w-full py-3.5 px-4 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-lg active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>TANDAI SELESAI LATIHAN MANDIRI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL SELESAI LATIHAN MANDIRI                                          */}
      {/* ========================================================================= */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-sumi-border shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 text-8xl font-jp font-black text-crimson/5 select-none pointer-events-none">
              朗読
            </div>

            <div className="w-16 h-16 bg-crimson-tint rounded-2xl flex items-center justify-center mx-auto text-crimson shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold text-crimson bg-crimson-tint px-3 py-1 rounded-full uppercase tracking-wider">
                Latihan Membaca Mandiri Selesai
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-sumi">
                Pelafalan Luar Biasa!
              </h3>
              <p className="text-xs sm:text-sm text-sumi-charcoal leading-relaxed">
                Anda telah menyelesaikan latihan membaca nyaring (*reading aloud*) naskah sastra klasik <strong>{activeStory.titleKanji} ({activeStory.title})</strong>.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-sumi-border grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-sumi-muted uppercase font-bold block">Durasi Rekaman:</span>
                <span className="text-base font-black text-sumi font-mono">{formatTimer(recordingSeconds > 0 ? recordingSeconds : 150)}</span>
              </div>
              <div>
                <span className="text-[10px] text-sumi-muted uppercase font-bold block">Status Progres:</span>
                <span className="text-base font-black text-emerald-700 font-mono">Terekam di Portofolio</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCompletionModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-sumi-border bg-white text-sumi hover:bg-[#FAF7F2] text-xs font-bold transition-colors"
              >
                Latih Ulang Naskah
              </button>
              <Link
                href="/siswa/progres"
                className="flex-1 py-3 px-4 rounded-xl bg-crimson hover:bg-crimson-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Lihat Portofolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
