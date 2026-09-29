'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SafeAudioPlayerProps {
  src: string;
  title?: string;
  maxPlays?: number; // e.g. 2 for Exam Mode
  isExamMode?: boolean; // if true, timeline scrubbing is completely disabled
  onPlayLimitReached?: () => void;
  className?: string;
}

export const SafeAudioPlayer: React.FC<SafeAudioPlayerProps> = ({
  src,
  title = "Audio Referensi Menyimak",
  maxPlays = 2,
  isExamMode = true,
  onPlayLimitReached,
  className = "",
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStartedCurrentPlay, setHasStartedCurrentPlay] = useState(false);

  const remainingPlays = Math.max(0, maxPlays - playCount);
  const isPlayLocked = isExamMode && remainingPlays <= 0 && !isPlaying;

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isPlayLocked) return;

      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (!hasStartedCurrentPlay) {
          setHasStartedCurrentPlay(true);
          const nextCount = playCount + 1;
          setPlayCount(nextCount);
          if (nextCount >= maxPlays && onPlayLimitReached) {
            onPlayLimitReached();
          }
        }
      }).catch((e) => console.error("Audio playback error:", e));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasStartedCurrentPlay(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`p-4 rounded-2xl bg-white border border-sumi-border shadow-card ${className}`}>
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            isPlaying ? 'bg-crimson text-white animate-pulse' : 'bg-crimson-tint text-crimson'
          }`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-sumi leading-none">{title}</div>
            <div className="text-[10px] text-sumi-muted mt-1 flex items-center gap-1.5">
              {isExamMode ? (
                <span className="inline-flex items-center gap-1 text-crimson font-bold">
                  <ShieldAlert className="w-3 h-3" />
                  Mode Ujian Terkunci (Anti-Scrubbing)
                </span>
              ) : (
                <span>Mode Pemutaran Fleksibel</span>
              )}
            </div>
          </div>
        </div>

        {/* Play Count Badge */}
        {isExamMode && (
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            remainingPlays > 0
              ? 'bg-crimson-subtle border-crimson-tint text-crimson'
              : 'bg-sumi-light border-sumi-border text-sumi-muted'
          }`}>
            Sisa Putar: <strong className="font-black">{remainingPlays}</strong> / {maxPlays}
          </div>
        )}
      </div>

      {/* Progress Track: In Exam Mode, pointer events are DISABLED so scrubbing cannot happen */}
      <div className="relative mb-3">
        <div className="h-2 w-full bg-crimson-tint rounded-full overflow-hidden">
          <div
            className="h-full bg-crimson transition-all duration-150 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls & Time display */}
      <div className="flex items-center justify-between text-xs text-sumi-charcoal">
        <div className="font-mono text-[11px] font-semibold">
          {formatSeconds(currentTime)} / {formatSeconds(duration || 0)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={isPlayLocked}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all touch-target shadow-sm active:scale-95 ${
              isPlayLocked
                ? 'bg-sumi-light text-sumi-muted cursor-not-allowed border border-sumi-border'
                : 'bg-crimson hover:bg-crimson-dark text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Jeda Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isPlayLocked ? 'Batas Putar Habis' : 'Putar Audio'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isPlayLocked && (
        <p className="mt-2.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-xl text-center font-medium">
          ⚠️ Anda telah mencapai batas maksimal pemutaran ({maxPlays}x). Silakan jawab soal berdasarkan ingatan pendengaran Anda.
        </p>
      )}
    </div>
  );
};
