'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  UploadCloud, 
  Link as LinkIcon, 
  FileAudio, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Volume2, 
  Loader2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AudioMetadata, AudioSourceType } from '@/types';
import { validateAudioFile, formatDuration, formatBytes } from '@/lib/services/audioStorage';

interface AudioInputSwitcherProps {
  value?: AudioMetadata | null;
  onChange: (metadata: AudioMetadata | null) => void;
  defaultSource?: AudioSourceType;
  label?: string;
  helperText?: string;
  required?: boolean;
}

export function AudioInputSwitcher({
  value,
  onChange,
  defaultSource = 'recorded',
  label = 'Audio Percontohan Sensei',
  helperText,
  required = false
}: AudioInputSwitcherProps) {
  // Active tab: 'recorded' | 'uploaded' | 'external_url'
  const [activeTab, setActiveTab] = useState<AudioSourceType>(
    value?.audio_source_type || defaultSource
  );

  // Common playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(value?.audio_url || null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ==========================================
  // MODE 1: RECORDED AUDIO STATES & LOGIC
  // ==========================================
  const [recordState, setRecordState] = useState<'idle' | 'recording' | 'recorded'>(
    value?.audio_source_type === 'recorded' && value?.audio_url ? 'recorded' : 'idle'
  );
  const [recordDuration, setRecordDuration] = useState<number>(value?.duration_seconds || 0);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================
  // MODE 2: UPLOADED FILE STATES & LOGIC
  // ==========================================
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    url: string;
    duration: number;
  } | null>(
    value?.audio_source_type === 'uploaded' && value?.audio_url 
      ? { 
          name: value.file_name || 'audio-unggahan.mp3', 
          size: value.file_size || 0, 
          url: value.audio_url,
          duration: value.duration_seconds || 0
        } 
      : null
  );
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // MODE 3: EXTERNAL URL STATES & LOGIC
  // ==========================================
  const [urlInput, setUrlInput] = useState<string>(
    value?.audio_source_type === 'external_url' ? value.audio_url : ''
  );
  const [urlTesting, setUrlTesting] = useState(false);
  const [urlTestStatus, setUrlTestStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [urlErrorMsg, setUrlErrorMsg] = useState<string | null>(null);

  // Sync external value changes
  useEffect(() => {
    if (value) {
      if (value.audio_source_type !== activeTab) {
        setActiveTab(value.audio_source_type);
      }
      setAudioPlaybackUrl(value.audio_url);
      if (value.audio_source_type === 'recorded') {
        setRecordState('recorded');
        setRecordDuration(value.duration_seconds || 0);
      } else if (value.audio_source_type === 'uploaded') {
        setUploadedFile({
          name: value.file_name || 'audio-unggahan.mp3',
          size: value.file_size || 0,
          url: value.audio_url,
          duration: value.duration_seconds || 0
        });
      } else if (value.audio_source_type === 'external_url') {
        setUrlInput(value.audio_url);
        setUrlTestStatus('valid');
      }
    }
  }, [value]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Audio element event listeners
  const togglePlayAudio = (urlToPlay: string) => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src !== urlToPlay) {
        audioRef.current.src = urlToPlay;
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play failed:', err);
        setIsPlaying(false);
      });
    }
  };

  // ==========================================
  // RECORDING HANDLERS
  // ==========================================
  const startRecording = async () => {
    setMicPermissionError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser Anda tidak mendukung MediaRecorder API.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine optimal mimeType
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioPlaybackUrl(localUrl);
        setRecordState('recorded');

        const metadata: AudioMetadata = {
          audio_source_type: 'recorded',
          audio_url: localUrl,
          duration_seconds: recordDuration,
          file_name: `rekaman-sensei-${Date.now()}.webm`,
          file_size: audioBlob.size
        };
        onChange(metadata);
      };

      recorder.start(100);
      setRecordState('recording');
      setRecordDuration(0);

      // Start timer
      let elapsed = 0;
      timerIntervalRef.current = setInterval(() => {
        elapsed += 1;
        setRecordDuration(elapsed);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionError('Izin mikrofon ditolak oleh browser. Silakan aktifkan akses mikrofon pada pengaturan izin situs Anda.');
      } else {
        setMicPermissionError(`Gagal mengakses mikrofon: ${err.message || 'Perangkat tidak tersedia'}`);
      }
      setRecordState('idle');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setRecordState('idle');
    setRecordDuration(0);
    setAudioPlaybackUrl(null);
    onChange(null);
  };

  // ==========================================
  // UPLOAD FILE HANDLERS
  // ==========================================
  const handleFileSelected = (file: File) => {
    setFileError(null);
    const validation = validateAudioFile(file);
    if (!validation.isValid) {
      setFileError(validation.error || 'File tidak valid.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAudioPlaybackUrl(objectUrl);

    // Measure duration
    const tempAudio = new Audio(objectUrl);
    tempAudio.onloadedmetadata = () => {
      const dur = Math.round(tempAudio.duration) || 0;
      setUploadedFile({
        name: file.name,
        size: file.size,
        url: objectUrl,
        duration: dur
      });

      const metadata: AudioMetadata = {
        audio_source_type: 'uploaded',
        audio_url: objectUrl,
        duration_seconds: dur,
        file_name: file.name,
        file_size: file.size
      };
      onChange(metadata);
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleRemoveUploadedFile = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setUploadedFile(null);
    setAudioPlaybackUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
  };

  // ==========================================
  // EXTERNAL URL HANDLERS
  // ==========================================
  const handleTestUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlTestStatus('invalid');
      setUrlErrorMsg('Harap masukkan URL audio terlebih dahulu.');
      return;
    }

    setUrlTesting(true);
    setUrlErrorMsg(null);
    setUrlTestStatus('idle');

    const testerAudio = new Audio();
    testerAudio.src = trimmed;

    testerAudio.onloadedmetadata = () => {
      setUrlTesting(false);
      setUrlTestStatus('valid');
      setAudioPlaybackUrl(trimmed);
      const dur = Math.round(testerAudio.duration) || 0;

      const metadata: AudioMetadata = {
        audio_source_type: 'external_url',
        audio_url: trimmed,
        duration_seconds: dur,
        file_name: trimmed.split('/').pop()?.split('?')[0] || 'audio_stream'
      };
      onChange(metadata);
    };

    testerAudio.onerror = () => {
      setUrlTesting(false);
      setUrlTestStatus('invalid');
      setUrlErrorMsg('Tautan audio tidak dapat diputar. Pastikan link bersifat publik dan berformat audio (.mp3, .wav, .m4a).');
    };

    // Timeout safety
    setTimeout(() => {
      if (urlTesting) {
        setUrlTesting(false);
        setUrlTestStatus('invalid');
        setUrlErrorMsg('Waktu koneksi habis saat mencoba memutar tautan audio.');
      }
    }, 4500);
  };

  return (
    <div className="space-y-2.5">
      {/* Hidden global audio element for playback */}
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Header Label & Segmented Switcher Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-[11px] font-bold text-sumi">
            {label} {required && <span className="text-crimson">*</span>}
          </label>
          {helperText && (
            <p className="text-[10px] text-sumi-charcoal">{helperText}</p>
          )}
        </div>

        {/* 3-Pill Segmented Control Switcher */}
        <div className="inline-flex p-1 bg-warm-cream/60 border border-sumi-border rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('recorded')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'recorded'
                ? 'bg-crimson text-white shadow-2xs'
                : 'text-sumi-charcoal hover:text-sumi'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Rekam Langsung</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('uploaded')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'uploaded'
                ? 'bg-crimson text-white shadow-2xs'
                : 'text-sumi-charcoal hover:text-sumi'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('external_url')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'external_url'
                ? 'bg-crimson text-white shadow-2xs'
                : 'text-sumi-charcoal hover:text-sumi'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tautan / URL</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: REKAM SUARA LANGSUNG (IN-BROWSER MIC)
          ========================================================================= */}
      {activeTab === 'recorded' && (
        <div className="p-3.5 rounded-2xl bg-white border border-sumi-border space-y-3">
          {/* Permission Error Banner */}
          {micPermissionError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-crimson text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{micPermissionError}</span>
            </div>
          )}

          {/* Standby State */}
          {recordState === 'idle' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-warm-cream/30 border border-dashed border-sumi-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-crimson-tint text-crimson flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sumi">Siap Merekam Suara Acuan Sensei</div>
                  <div className="text-[10px] text-sumi-charcoal">
                    Format WebM/MP3 dengan kejernihan vokal artikulasi tinggi
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={startRecording}
                className="px-4 py-2 bg-crimson hover:bg-crimson-dark text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Mulai Rekam Audio Sensei</span>
              </button>
            </div>
          )}

          {/* Recording State */}
          {recordState === 'recording' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-red-50/70 border border-crimson/40 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-crimson animate-ping absolute" />
                  <span className="w-3 h-3 rounded-full bg-crimson relative" />
                </div>

                <div>
                  <div className="text-xs font-black text-crimson flex items-center gap-2 font-mono text-sm">
                    <span>Sedang Merekam:</span>
                    <span className="px-2 py-0.5 bg-crimson text-white rounded-md">
                      {formatDuration(recordDuration)}
                    </span>
                  </div>
                  {/* Simulated Equalizer Waveform Bars */}
                  <div className="flex items-center gap-1 mt-1.5 h-3">
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-3" />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-2" style={{ animationDelay: '100ms' }} />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-3.5" style={{ animationDelay: '200ms' }} />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-2" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-4" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-2.5" style={{ animationDelay: '50ms' }} />
                    <span className="w-1 bg-crimson rounded-full animate-bounce h-3" style={{ animationDelay: '250ms' }} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-2 bg-sumi hover:bg-black text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
              >
                <Square className="w-3.5 h-3.5 text-crimson fill-crimson" />
                <span>Selesai Merekam</span>
              </button>
            </div>
          )}

          {/* Recorded Preview State */}
          {recordState === 'recorded' && audioPlaybackUrl && (
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-300 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-black text-emerald-900">
                    Hasil Rekaman Siap Digunakan
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    {formatDuration(recordDuration)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="px-2.5 py-1 text-[11px] font-bold text-sumi-charcoal hover:text-sumi bg-white hover:bg-sumi-light rounded-lg border border-sumi-border transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Rekam Ulang</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="p-1 text-crimson hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Audio Playback Controls */}
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-emerald-200">
                <button
                  type="button"
                  onClick={() => togglePlayAudio(audioPlaybackUrl)}
                  className="w-8 h-8 rounded-full bg-crimson hover:bg-crimson-dark text-white flex items-center justify-center transition-all shadow-2xs flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                
                <div className="flex-1">
                  <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-emerald-500 transition-all ${isPlaying ? 'w-3/4 animate-pulse' : 'w-full'}`}
                    />
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-sumi-charcoal">
                  {isPlaying ? 'Memutar...' : `${formatDuration(recordDuration)}`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: UNGGAH FILE AUDIO (DRAG AND DROP & PICKER)
          ========================================================================= */}
      {activeTab === 'uploaded' && (
        <div className="space-y-3">
          {/* File Error Alert */}
          {fileError && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-crimson text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{fileError}</span>
            </div>
          )}

          {!uploadedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                dragActive 
                  ? 'border-crimson bg-red-50/40 scale-[1.01]' 
                  : 'border-red-200 hover:border-crimson bg-red-50/20 hover:bg-red-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.m4a,audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                }}
                className="hidden"
              />

              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-sumi-border flex items-center justify-center text-crimson mb-2">
                <UploadCloud className="w-5 h-5 animate-bounce" />
              </div>

              <div className="text-xs font-bold text-sumi mb-1">
                Tarik & lepas file audio ke sini, atau klik untuk memilih file
              </div>
              <p className="text-[10px] text-sumi-charcoal">
                Mendukung format .mp3, .wav, .m4a (Maks. 15 MB)
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-white border border-sumi-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold">
                    <FileAudio className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-sumi truncate">{uploadedFile.name}</div>
                    <div className="text-[10px] text-sumi-charcoal flex items-center gap-2">
                      <span>{formatBytes(uploadedFile.size)}</span>
                      <span>•</span>
                      <span>Durasi: {formatDuration(uploadedFile.duration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-bold text-sumi-charcoal hover:text-sumi bg-warm-cream/40 rounded-lg border border-sumi-border transition-colors"
                  >
                    Ganti File
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveUploadedFile}
                    className="p-1 text-crimson hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hidden file input for replacing */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.wav,.m4a,audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelected(file);
                }}
                className="hidden"
              />

              {/* Preview Audio Player */}
              <div className="flex items-center gap-3 p-2 bg-warm-cream/20 rounded-xl border border-sumi-border/60">
                <button
                  type="button"
                  onClick={() => togglePlayAudio(uploadedFile.url)}
                  className="w-8 h-8 rounded-full bg-crimson hover:bg-crimson-dark text-white flex items-center justify-center transition-all shadow-2xs flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 text-[11px] font-medium text-sumi-charcoal">
                  {isPlaying ? 'Memutar audio terpilih...' : 'Klik putar untuk menguji pratinjau audio'}
                </div>
                <Volume2 className="w-4 h-4 text-sumi-charcoal" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: TAUTAN EKSTERNAL (URL)
          ========================================================================= */}
      {activeTab === 'external_url' && (
        <div className="p-3.5 rounded-2xl bg-white border border-sumi-border space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="https://... (contoh: link Google Drive publik, CDN, atau cloud sekolah)"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlTestStatus('idle');
                  setUrlErrorMsg(null);
                }}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-sumi-border bg-white focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
              />
              <LinkIcon className="w-3.5 h-3.5 text-sumi-charcoal absolute left-2.5 top-3" />
            </div>

            <button
              type="button"
              onClick={handleTestUrl}
              disabled={urlTesting || !urlInput.trim()}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                urlTesting || !urlInput.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-warm-cream/80 hover:bg-warm-cream text-sumi border border-sumi-border shadow-2xs'
              }`}
            >
              {urlTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-crimson" />
                  <span>Menguji...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-crimson" />
                  <span>Tes Audio</span>
                </>
              )}
            </button>
          </div>

          {/* Validation Notice */}
          {urlTestStatus === 'valid' && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-bold">Tautan Audio Valid & Siap Diputar</span>
              </div>
              <button
                type="button"
                onClick={() => togglePlayAudio(urlInput.trim())}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isPlaying ? 'Jeda' : 'Putar Audio'}</span>
              </button>
            </div>
          )}

          {urlTestStatus === 'invalid' && urlErrorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-crimson text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{urlErrorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
