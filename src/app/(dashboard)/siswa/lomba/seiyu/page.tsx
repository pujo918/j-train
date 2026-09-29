'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  ChevronRight, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  SlidersHorizontal,
  Film,
  Check,
  Award,
  Radio,
  Clock,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/data/store';
import { SEIYU_SCENES, SeiyuDialogueLine } from '@/lib/data/seiyuModuleData';

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

// Generate simple fallback audio blob if media devices microphone is blocked or not available
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
    // Pleasant melodic vocal formant harmonic simulation
    const val = 0.15 * Math.sin(2 * Math.PI * 330 * t) * Math.exp(-t / (Math.max(1, durationSeconds) * 0.8));
    const s = Math.max(-1, Math.min(1, val));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

export default function SeiyuLombaPage() {
  const router = useRouter();
  const { submitPracticeResult } = useAppStore();

  const currentScene = SEIYU_SCENES[0];
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<'all' | 'Kenji' | 'Aoi' | 'Sensei'>('Kenji');
  const [activeLineId, setActiveLineId] = useState<string>(currentScene.dialogues[0].id);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [takeCount, setTakeCount] = useState(1);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isSavedTake, setIsSavedTake] = useState(false);
  const [completedLines, setCompletedLines] = useState<Record<string, boolean>>({});

  // Audio Playback states
  const [playingSenseiLineId, setPlayingSenseiLineId] = useState<string | null>(null);
  const [isPlayingSenseiModel, setIsPlayingSenseiModel] = useState(false);
  const [isPlayingStudentTake, setIsPlayingStudentTake] = useState(false);

  // Completion Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Audio refs & timers
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const studentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const senseiAudioElementRef = useRef<HTMLAudioElement | null>(null);

  const activeLine = currentScene.dialogues.find((d) => d.id === activeLineId) || currentScene.dialogues[0];

  // Clean up object URLs and timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recordedAudioUrl]);

  // Handle Sensei reference speech (Web Speech API with authentic Japanese voice)
  const handlePlaySenseiAudio = useCallback((line: SeiyuDialogueLine, isFromModelButton = false) => {
    if (typeof window === 'undefined') return;

    // Stop student audio if playing
    if (studentAudioElementRef.current) {
      studentAudioElementRef.current.pause();
      setIsPlayingStudentTake(false);
    }

    if (playingSenseiLineId === line.id || (isFromModelButton && isPlayingSenseiModel)) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingSenseiLineId(null);
      setIsPlayingSenseiModel(false);
      return;
    }

    setPlayingSenseiLineId(line.id);
    if (isFromModelButton) setIsPlayingSenseiModel(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = line.japaneseTextRaw.replace(/[「」『』]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ja-JP';
      // Pitch adjustment based on character
      if (line.characterKey === 'Kenji') utterance.pitch = 1.05;
      else if (line.characterKey === 'Aoi') utterance.pitch = 1.25;
      else utterance.pitch = 0.85;

      utterance.rate = 0.95;

      utterance.onend = () => {
        setPlayingSenseiLineId(null);
        setIsPlayingSenseiModel(false);
      };

      utterance.onerror = () => {
        setPlayingSenseiLineId(null);
        setIsPlayingSenseiModel(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer simulation
      setTimeout(() => {
        setPlayingSenseiLineId(null);
        setIsPlayingSenseiModel(false);
      }, line.targetDurationSeconds * 1000);
    }
  }, [playingSenseiLineId, isPlayingSenseiModel]);

  // Start recording
  const handleStartRecording = async () => {
    // Stop any playing audios
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingSenseiLineId(null);
    setIsPlayingSenseiModel(false);
    if (studentAudioElementRef.current) {
      studentAudioElementRef.current.pause();
      setIsPlayingStudentTake(false);
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
      const duration = Math.max(2, recordingSeconds);
      const synthBlob = createSyntheticWav(duration);
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
      const url = URL.createObjectURL(synthBlob);
      setRecordedAudioUrl(url);
    }

    // Mark current line as completed in this session
    setCompletedLines((prev) => ({
      ...prev,
      [activeLine.id]: true,
    }));
  };

  // Play student recorded audio
  const handlePlayStudentAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingStudentTake) {
      if (studentAudioElementRef.current) {
        studentAudioElementRef.current.pause();
      }
      setIsPlayingStudentTake(false);
      return;
    }

    // Stop Sensei audio if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingSenseiLineId(null);
    setIsPlayingSenseiModel(false);

    if (!studentAudioElementRef.current) {
      studentAudioElementRef.current = new Audio(recordedAudioUrl);
    } else {
      studentAudioElementRef.current.src = recordedAudioUrl;
    }

    studentAudioElementRef.current.onended = () => {
      setIsPlayingStudentTake(false);
    };

    studentAudioElementRef.current.play()
      .then(() => setIsPlayingStudentTake(true))
      .catch((e) => {
        console.warn('Playback error:', e);
        setIsPlayingStudentTake(false);
      });
  };

  // Reset take
  const handleResetTake = () => {
    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    setIsSavedTake(false);
    setIsPlayingStudentTake(false);
    setTakeCount((prev) => prev + 1);
  };

  // Save take
  const handleSaveTake = () => {
    if (!recordedAudioUrl) return;
    setIsSavedTake(true);
    setCompletedLines((prev) => ({ ...prev, [activeLine.id]: true }));
  };

  // Complete self practice session
  const handleCompleteSelfPractice = () => {
    // Record to store
    submitPracticeResult({
      set_id: currentScene.id,
      category: 'seiyu',
      score: null, // Voice practice evaluated holistically
      total_questions: currentScene.dialogues.length,
      correct_answers: Object.keys(completedLines).length || 1,
      time_spent_seconds: recordingSeconds > 0 ? recordingSeconds : 120,
      set_title: currentScene.title,
      type: 'voice_practiced',
    });

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#B91C1C', '#FAF7F2', '#111827', '#FEE2E2', '#F59E0B'],
    });

    setShowCompletionModal(true);
  };

  // Waveform bar generator
  const waveformBars = [
    12, 16, 24, 38, 48, 64, 82, 95, 88, 70, 52, 40, 60, 75, 92, 100, 85, 68, 55, 42, 60, 80, 70, 50, 35, 22, 16, 12
  ];

  return (
    <div className="space-y-4 pb-12 text-sumi">
      {/* ========================================================================= */}
      {/* 1. SUB-HEADER & FILTER PERAN RINGKAS                                      */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-3.5">
        {/* Baris 1: Breadcrumb Navigasi di Kiri & Status Mode di Kanan */}
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
              Seiyu (声優)
            </span>
          </nav>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-subtle/40 border border-crimson/20 text-crimson text-[11px] font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Mode Studio Interaktif • Take Per Adegan</span>
          </div>
        </div>

        {/* Baris 2: Judul Naskah Adegan & Pill Filter Karakter Interaktif */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-crimson" />
              <h1 className="text-base sm:text-lg font-black text-sumi">
                {currentScene.title}: <span className="text-crimson font-serif">{currentScene.sceneCode}</span>
              </h1>
            </div>
            <p className="text-xs text-sumi-charcoal">
              {currentScene.subtitle} • Tempo: <span className="font-medium text-sumi">{currentScene.tempo}</span>
            </p>
          </div>

          {/* Segmented Control Pill: Karakter Saya */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border border-sumi-border text-xs flex-wrap">
            <span className="text-[11px] font-bold text-sumi-charcoal px-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-crimson" />
              <span>Karakter Saya:</span>
            </span>

            <button
              onClick={() => setSelectedCharacterFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCharacterFilter === 'all'
                  ? 'bg-sumi text-white shadow-sm'
                  : 'text-sumi-charcoal hover:text-sumi'
              }`}
            >
              Semua
            </button>

            {(['Kenji', 'Aoi', 'Sensei'] as const).map((char) => {
              const isActive = selectedCharacterFilter === char;
              return (
                <button
                  key={char}
                  onClick={() => setSelectedCharacterFilter(char)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-crimson text-white shadow-sm'
                      : 'text-sumi-charcoal hover:text-sumi hover:bg-white/80'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-white' : 'bg-sumi-muted'
                    }`}
                  />
                  <span>{char}</span>
                  {isActive && <span className="text-[10px] opacity-90">(Aktif)</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DUBBING WORKBENCH: 2 KOLOM (SCRIPT BOX & RECORDER CONSOLE)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* SISI KIRI: KOTAK NASKAH INTERAKTIF (SCRIPT BOX) (Col 7/12)              */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-crimson rounded-full" />
              <h2 className="text-sm sm:text-base font-black tracking-wide text-sumi uppercase">
                INTERACTIVE SCRIPT BOX
              </h2>
            </div>
            <span className="text-[11px] font-bold text-sumi-charcoal bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-sumi-border">
              Naskah Furigana Aktif • {currentScene.dialogues.length} Baris Dialog
            </span>
          </div>

          {/* Dialogue Cards */}
          <div className="space-y-3.5">
            {currentScene.dialogues.map((dialogue, idx) => {
              const isMatchFilter = selectedCharacterFilter === 'all' || selectedCharacterFilter === dialogue.characterKey;
              const isCurrentActiveLine = activeLineId === dialogue.id;
              const isPlayingThisLine = playingSenseiLineId === dialogue.id;
              const isLineCompleted = !!completedLines[dialogue.id];

              return (
                <div
                  key={dialogue.id}
                  onClick={() => setActiveLineId(dialogue.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isCurrentActiveLine
                      ? `${dialogue.accentBorder} ${dialogue.accentBg} shadow-sm ring-1 ring-crimson/20`
                      : isMatchFilter
                      ? 'bg-white border-sumi-border hover:border-sumi-charcoal'
                      : 'bg-[#FAF7F2]/60 border-sumi-border/70 opacity-50 hover:opacity-85'
                  }`}
                >
                  {/* Top line of card: Avatar, Name, and Sensei Audio Button */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shadow-xs ${dialogue.avatarBg}`}>
                        {dialogue.avatarInitial}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-sumi">
                            {dialogue.characterName} ({dialogue.characterKatakana})
                          </span>
                          {isLineCompleted && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                              <Check className="w-2.5 h-2.5" />
                              <span>Take Selesai</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-sumi-muted block -mt-0.5">
                          {dialogue.roleDescription}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySenseiAudio(dialogue);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                          isPlayingThisLine
                            ? 'bg-crimson text-white border-crimson animate-pulse'
                            : 'bg-white text-crimson border-crimson/30 hover:bg-crimson-tint'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isPlayingThisLine ? 'Memutar Model...' : 'Dengarkan Contoh Sensei'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Emotion Badge */}
                  <div className="mb-2">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${dialogue.badgeBg} ${dialogue.badgeText}`}>
                      {dialogue.emotionBadge}
                    </span>
                  </div>

                  {/* Ruby Furigana Japanese Text */}
                  <div className="p-3 bg-white rounded-lg border border-sumi-border font-jp text-[17px] sm:text-[18px] font-bold text-sumi leading-loose tracking-wide">
                    <span
                      dangerouslySetInnerHTML={{ __html: dialogue.rubyHtml }}
                      className="inline-block"
                    />
                  </div>

                  {/* Director's Notes */}
                  <div className="text-[11px] text-sumi-charcoal mt-2 italic bg-[#FAF7F2]/90 p-2 rounded-lg border border-sumi-border flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-crimson flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold text-sumi not-italic">Catatan Sensei:</strong> {dialogue.directorNotes}
                    </span>
                  </div>

                  {/* Action row at bottom */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-sumi-border/50 text-[11px]">
                    <span className="text-sumi-muted">
                      Target Durasi: ~{dialogue.targetDurationSeconds} detik
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLineId(dialogue.id);
                      }}
                      className={`font-bold transition-colors inline-flex items-center gap-1 ${
                        isCurrentActiveLine
                          ? 'text-crimson'
                          : 'text-sumi-charcoal hover:text-crimson'
                      }`}
                    >
                      {isCurrentActiveLine ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-crimson" />
                          <span>Target Latihan Saat Ini</span>
                        </>
                      ) : (
                        <span>🎯 Pilih Baris Ini untuk Latihan</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wireframe Caption: Progress indicator strip */}
          <div className="pt-3 border-t border-sumi-border flex items-center justify-between text-xs text-sumi-muted">
            <span className="font-mono font-medium">
              *GoresanAktif: [=== {Object.keys(completedLines).length + 1} / {currentScene.dialogues.length} ===] (contoh furigana aktif)*
            </span>
            <span className="text-[11px]">
              Terselesaikan: {Object.keys(completedLines).length} dari {currentScene.dialogues.length} take
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SISI KANAN: STUDIO RECORDER & PLAYBACK CONSOLE (Col 5/12)                */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-sumi-border shadow-sm p-4 sm:p-5 space-y-5 lg:sticky lg:top-4">
          <div className="flex items-center justify-between pb-3 border-b border-sumi-border">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-crimson" />
              <h2 className="text-sm sm:text-base font-black tracking-wide text-sumi uppercase">
                STUDIO RECORDER & PLAYBACK CONSOLE
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-crimson bg-crimson-tint px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
              <span>Take {takeCount}</span>
            </span>
          </div>

          {/* Active Line Target Badge */}
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-sumi-border flex items-center justify-between text-xs">
            <div>
              <span className="text-sumi-muted text-[10px] block uppercase font-bold">Target Take Baris:</span>
              <span className="font-bold text-sumi">
                {activeLine.characterName} ({activeLine.characterKatakana}) — Baris #{currentScene.dialogues.findIndex((d) => d.id === activeLine.id) + 1}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sumi-muted text-[10px] block uppercase font-bold">Target Tempo:</span>
              <span className="font-mono font-bold text-crimson">~{activeLine.targetDurationSeconds}s</span>
            </div>
          </div>

          {/* Digital Timer & Waveform Display Box */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-[#E9E3D8] p-5 text-center space-y-4 shadow-inner">
            {/* Digital Timer (00:00:00) */}
            <div className="font-mono text-4xl sm:text-5xl font-black text-sumi tracking-widest select-none">
              {formatTimer(recordingSeconds)}
            </div>

            {/* Live Audio Waveform / Visualizer Animation */}
            <div className="h-14 flex items-center justify-center gap-1 px-4 overflow-hidden">
              {waveformBars.map((height, i) => {
                const isAnimated = isRecording || isPlayingStudentTake || isPlayingSenseiModel;
                const dynamicHeight = isAnimated
                  ? Math.max(15, Math.min(100, height + Math.sin((i + recordingSeconds * 5)) * 30))
                  : isRecording
                  ? 45
                  : height * 0.45;

                return (
                  <span
                    key={i}
                    style={{
                      height: `${dynamicHeight}%`,
                    }}
                    className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                      isRecording
                        ? 'bg-crimson animate-pulse'
                        : isPlayingStudentTake
                        ? 'bg-amber-600'
                        : isPlayingSenseiModel
                        ? 'bg-sumi'
                        : 'bg-sumi-muted/30'
                    }`}
                  />
                );
              })}
            </div>

            {/* Primary Action Button: MULAI REKAM / SELESAI REKAM */}
            <div className="pt-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full py-3.5 px-6 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-card hover:shadow-lg active:scale-98 transition-all"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>MULAI REKAM TAKE {takeCount}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full py-3.5 px-6 rounded-xl bg-crimson-dark text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg animate-pulse active:scale-98 transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
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
                Side-by-Side Playback
              </h3>
              <span className="text-[10px] font-bold text-sumi-charcoal bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Ulangi Playback</span>
              </span>
            </div>

            {/* Dua Tombol Audio Terpisah: Model Sensei vs Rekaman Anda */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handlePlaySenseiAudio(activeLine, true)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isPlayingSenseiModel
                    ? 'bg-sumi text-white border-sumi'
                    : 'bg-[#FAF7F2] text-sumi border-sumi-border hover:bg-white hover:border-sumi-charcoal'
                }`}
              >
                {isPlayingSenseiModel ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda Model</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Model Sensei</span>
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
                    : isPlayingStudentTake
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-[#FAF7F2] text-sumi border-sumi-border hover:bg-white hover:border-crimson'
                }`}
              >
                {isPlayingStudentTake ? (
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
          {/* Tombol Selesai Latihan: Full-width crimson completion button           */}
          {/* ===================================================================== */}
          <div className="pt-2 border-t border-sumi-border">
            <button
              type="button"
              onClick={handleCompleteSelfPractice}
              className="w-full py-3.5 px-4 rounded-xl bg-crimson hover:bg-crimson-dark text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-lg active:scale-98 transition-all"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>TANDAI SELESAI LATIHAN MANDIRI SCENE INI</span>
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
              声優
            </div>

            <div className="w-16 h-16 bg-crimson-tint rounded-2xl flex items-center justify-center mx-auto text-crimson shadow-sm">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block text-[11px] font-bold text-crimson bg-crimson-tint px-3 py-1 rounded-full uppercase tracking-wider">
                Latihan Suara Mandiri Selesai
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-sumi">
                Kerja Bagus, Seiyu Muda!
              </h3>
              <p className="text-xs sm:text-sm text-sumi-charcoal leading-relaxed">
                Anda telah menyelesaikan sesi latihan modulasi vokal dan sinkronisasi naskah adegan <strong>{currentScene.sceneCode}</strong>.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-sumi-border grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[10px] text-sumi-muted uppercase font-bold block">Total Take Dijalankan:</span>
                <span className="text-base font-black text-sumi font-mono">{takeCount} Take</span>
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
                Latih Ulang Adegan
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
