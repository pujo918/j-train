'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Layers, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  BookOpen, 
  Mic2, 
  PenTool, 
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  FileAudio,
  Eye,
  Loader2
} from 'lucide-react';
import { CompetitionCategory, PracticeSet, AudioMetadata } from '@/types';
import { CATEGORIES_META } from '@/lib/utils';
import { AudioInputSwitcher } from './AudioInputSwitcher';

interface AdaptivePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (packageData: Omit<PracticeSet, 'id' | 'created_at'>) => void;
  initialData?: PracticeSet | null;
  defaultCategory?: CompetitionCategory;
}

export function AdaptivePackageModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCategory = 'kanji'
}: AdaptivePackageModalProps) {
  const [mounted, setMounted] = useState(false);

  // Universal fields
  const [category, setCategory] = useState<CompetitionCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Pemula (N5)' | 'Menengah (N4)' | 'Mahir (N3)' | 'Umum'>('Menengah (N4)');
  const [duration, setDuration] = useState<number>(10);
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // Branch-specific states
  // Kanji
  const [targetKkm, setTargetKkm] = useState<number>(80);

  // Cerdas Cermat
  const [ccTheme, setCcTheme] = useState<string>('Budaya (Bunka)');
  const [isBlitzMode, setIsBlitzMode] = useState<boolean>(false);

  // Kikikakitori
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [maxPlayCount, setMaxPlayCount] = useState<number>(2);
  const [antiScrubbing, setAntiScrubbing] = useState<boolean>(true);

  // Rodoku
  const [authorWork, setAuthorWork] = useState<string>('');
  const [rodokuScript, setRodokuScript] = useState<string>('');
  const [rodokuAudioUrl, setRodokuAudioUrl] = useState<string>('');

  // Seiyu
  const [sceneTitle, setSceneTitle] = useState<string>('');
  const [characterRoles, setCharacterRoles] = useState<string[]>(['Kenji', 'Aoi', 'Sensei']);
  const [newRoleInput, setNewRoleInput] = useState<string>('');
  const [seiyuAudioUrl, setSeiyuAudioUrl] = useState<string>('');

  // Shodou
  const [targetKanji, setTargetKanji] = useState<string>('道');
  const [philosophyMeaning, setPhilosophyMeaning] = useState<string>('Jalan / Kehidupan / Kebenaran Hakiki');
  const [calligraphyStyle, setCalligraphyStyle] = useState<'Kaisho (Baku)' | 'Gyosho (Semi-Kursif)' | 'Sosho (Kursif)'>('Kaisho (Baku)');
  const [strokeOrderUrl, setStrokeOrderUrl] = useState<string>('');

  // Audio Switcher Uniform State
  const [packageAudio, setPackageAudio] = useState<AudioMetadata | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDifficulty(initialData.difficulty_level || 'Menengah (N4)');
      setDuration(initialData.duration_minutes || 0);
      setIsPublished(initialData.is_published ?? true);

      // Metadata unpacking
      const meta = initialData.metadata || {};
      const initialAudioUrl = initialData.audio_reference_url || meta.audio_url || '';
      if (initialAudioUrl) {
        setPackageAudio({
          audio_source_type: meta.audio_source_type || 'external_url',
          audio_url: initialAudioUrl,
          duration_seconds: meta.duration_seconds || 0,
          file_name: meta.file_name || 'audio-referensi.mp3',
          file_size: meta.file_size
        });
      } else {
        setPackageAudio(null);
      }

      if (initialData.category === 'kanji') {
        setTargetKkm(meta.target_kkm || 80);
      } else if (initialData.category === 'cerdas_cermat') {
        setCcTheme(meta.category_theme || 'Budaya (Bunka)');
        setIsBlitzMode(meta.is_blitz_mode || false);
      } else if (initialData.category === 'kikikakitori') {
        setAudioUrl(initialData.audio_reference_url || meta.audio_url || '');
        setMaxPlayCount(meta.max_play_count || 2);
        setAntiScrubbing(meta.anti_scrubbing ?? true);
      } else if (initialData.category === 'rodoku') {
        setAuthorWork(meta.author_work || '');
        setRodokuScript(initialData.script_content || '');
        setRodokuAudioUrl(initialData.audio_reference_url || '');
      } else if (initialData.category === 'seiyu') {
        setSceneTitle(meta.scene_title || '');
        setCharacterRoles(meta.character_roles || ['Kenji', 'Aoi', 'Sensei']);
        setSeiyuAudioUrl(initialData.audio_reference_url || '');
      } else if (initialData.category === 'shodou') {
        setTargetKanji(meta.target_kanji || '道');
        setPhilosophyMeaning(meta.philosophy_meaning || '');
        setCalligraphyStyle(meta.calligraphy_style || 'Kaisho (Baku)');
        setStrokeOrderUrl(meta.stroke_order_url || '');
      }
    } else {
      setCategory(defaultCategory);
      setTitle('');
      setDescription('');
      setDifficulty('Menengah (N4)');
      setDuration(defaultCategory === 'kanji' ? 10 : defaultCategory === 'cerdas_cermat' ? 5 : 0);
      setIsPublished(true);
      setTargetKkm(80);
      setCcTheme('Budaya (Bunka)');
      setIsBlitzMode(false);
      setAudioUrl('');
      setMaxPlayCount(2);
      setAntiScrubbing(true);
      setAuthorWork('');
      setRodokuScript('');
      setRodokuAudioUrl('');
      setSceneTitle('');
      setCharacterRoles(['Kenji', 'Aoi', 'Sensei']);
      setSeiyuAudioUrl('');
      setTargetKanji('道');
      setPhilosophyMeaning('Jalan / Kehidupan');
      setCalligraphyStyle('Kaisho (Baku)');
      setStrokeOrderUrl('');
      setPackageAudio(null);
      setIsUploadingAudio(false);
      setUploadProgress(0);
    }
  }, [initialData, defaultCategory, isOpen]);

  if (!isOpen || !mounted) return null;

  // Add character role tag for Seiyu
  const handleAddRole = () => {
    const trimmed = newRoleInput.trim();
    if (trimmed && !characterRoles.includes(trimmed)) {
      setCharacterRoles([...characterRoles, trimmed]);
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setCharacterRoles(characterRoles.filter(r => r !== roleToRemove));
  };

  const executePackageSave = () => {
    const metadata: Record<string, any> = {};
    let finalAudioUrl = undefined;
    let finalScriptContent = undefined;

    if (category === 'kanji') {
      metadata.target_kkm = targetKkm;
    } else if (category === 'cerdas_cermat') {
      metadata.category_theme = ccTheme;
      metadata.is_blitz_mode = isBlitzMode;
    } else if (category === 'kikikakitori') {
      if (packageAudio) {
        finalAudioUrl = packageAudio.audio_url;
        metadata.audio_source_type = packageAudio.audio_source_type;
        metadata.audio_url = packageAudio.audio_url;
        metadata.duration_seconds = packageAudio.duration_seconds;
        metadata.file_name = packageAudio.file_name;
      }
      metadata.max_play_count = maxPlayCount;
      metadata.anti_scrubbing = antiScrubbing;
    } else if (category === 'rodoku') {
      metadata.author_work = authorWork;
      finalScriptContent = rodokuScript;
      if (packageAudio) {
        finalAudioUrl = packageAudio.audio_url;
        metadata.audio_source_type = packageAudio.audio_source_type;
        metadata.audio_url = packageAudio.audio_url;
        metadata.duration_seconds = packageAudio.duration_seconds;
        metadata.file_name = packageAudio.file_name;
      }
    } else if (category === 'seiyu') {
      metadata.scene_title = sceneTitle;
      metadata.character_roles = characterRoles;
      if (packageAudio) {
        finalAudioUrl = packageAudio.audio_url;
        metadata.audio_source_type = packageAudio.audio_source_type;
        metadata.audio_url = packageAudio.audio_url;
        metadata.duration_seconds = packageAudio.duration_seconds;
        metadata.file_name = packageAudio.file_name;
      }
    } else if (category === 'shodou') {
      metadata.target_kanji = targetKanji;
      metadata.philosophy_meaning = philosophyMeaning;
      metadata.calligraphy_style = calligraphyStyle;
      metadata.stroke_order_url = strokeOrderUrl || undefined;
    }

    onSave({
      category,
      title: title.trim(),
      description: description.trim(),
      difficulty_level: difficulty,
      duration_minutes: Number(duration) || 0,
      is_published: isPublished,
      audio_reference_url: finalAudioUrl,
      script_content: finalScriptContent,
      metadata
    });

    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (['kikikakitori', 'rodoku', 'seiyu'].includes(category) && packageAudio) {
      setIsUploadingAudio(true);
      setUploadProgress(25);
      setTimeout(() => {
        setUploadProgress(65);
        setTimeout(() => {
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploadingAudio(false);
            executePackageSave();
          }, 200);
        }, 250);
      }, 200);
    } else {
      executePackageSave();
    }
  };

  // Helper parser for live rodoku furigana preview
  const parseFuriganaPreview = (text: string) => {
    if (!text) return null;
    // Replace {kanji|furigana} or [kanji|furigana] with ruby
    const parts = text.split(/(\{[^}]+\}|\[[^\]]+\]|\/\/|\/|\n)/g);
    return parts.map((part, i) => {
      if (part === '\n') {
        return <br key={i} />;
      }
      if (part === '//') {
        return (
          <span key={i} className="inline-flex items-center px-1.5 py-0.5 mx-1 bg-red-100 text-red-700 text-[10px] font-mono rounded font-bold">
            // Jeda Penuh
          </span>
        );
      }
      if (part === '/') {
        return (
          <span key={i} className="inline-flex items-center px-1 py-0.5 mx-0.5 bg-amber-100 text-amber-800 text-[10px] font-mono rounded font-bold">
            / Jeda Pendek
          </span>
        );
      }
      const match = part.match(/[\{\[]([^\|]+)\|([^\]\}]+)[\}\]]/);
      if (match) {
        return (
          <ruby key={i} className="mx-0.5 font-medium">
            {match[1]}
            <rt className="text-[10px] text-crimson font-sans">{match[2]}</rt>
          </ruby>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sumi/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sumi-border overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-sumi-border bg-gradient-to-r from-warm-cream/60 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-crimson-tint text-crimson flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-sumi">
                {initialData ? 'Edit Paket Materi Pembinaan' : 'Buat Paket Materi Baru'}
              </h2>
              <p className="text-[11px] text-sumi-charcoal">
                Konfigurasi skema adaptif untuk kurikulum latihan mandiri siswa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-sumi-light text-sumi-charcoal hover:text-sumi flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Universal Section 1: Cabang Lomba & Tingkat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sumi mb-1">
                Cabang Lomba Target <span className="text-crimson">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as CompetitionCategory;
                  setCategory(cat);
                  if (cat === 'kanji') setDuration(10);
                  else if (cat === 'cerdas_cermat') setDuration(5);
                  else setDuration(0);
                }}
                disabled={!!initialData}
                className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-warm-cream/30 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson font-medium"
              >
                <option value="kanji">Kanji (漢字) - Ujian & Flashcard</option>
                <option value="cerdas_cermat">Cerdas Cermat (知識クイズ) - Rapid Arena</option>
                <option value="kikikakitori">Kikikakitori (聞き書き) - Audio Menyimak</option>
                <option value="rodoku">Rodoku (朗読) - Membaca Nyaring</option>
                <option value="seiyu">Seiyu (声優) - Sulih Suara Anime</option>
                <option value="shodou">Shodou (書道) - Kaligrafi Hanshi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sumi mb-1">
                Tingkat Kesulitan
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-warm-cream/30 focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson font-medium"
              >
                <option value="Pemula (N5)">Pemula (N5)</option>
                <option value="Menengah (N4)">Menengah (N4)</option>
                <option value="Mahir (N3)">Mahir (N3)</option>
                <option value="Umum">Umum / Terbuka</option>
              </select>
            </div>
          </div>

          {/* Universal Section 2: Judul & Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-sumi mb-1">
              Judul Paket Materi <span className="text-crimson">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Kanji Kompetisi N4 Paket 1 (Cara Baca & Makna)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-sumi-border bg-white focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-sumi mb-1">
              Deskripsi & Instruksi Pengerjaan Siswa
            </label>
            <textarea
              rows={2}
              placeholder="Berikan panduan singkat mengenai target capaian paket ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-sumi-border bg-white focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson font-medium resize-none"
            />
          </div>

          {/* Dynamic Conditional Fields based on Category */}
          <div className="p-4 rounded-2xl bg-warm-cream/40 border border-warm-cream-dark/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-sumi border-b border-sumi-border/40 pb-2">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              <span>Konfigurasi Khusus Cabang: {CATEGORIES_META[category].romaji} ({CATEGORIES_META[category].kanji})</span>
            </div>

            {/* 1. KANJI CONDITIONAL */}
            {category === 'kanji' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Batas Waktu Paket (Menit)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    />
                    <Clock className="w-3.5 h-3.5 text-sumi-charcoal absolute left-2.5 top-2.5" />
                  </div>
                  <span className="text-[10px] text-sumi-charcoal">Isi 0 jika tanpa batas waktu (santai).</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Target Ambang Kelulusan (KKM)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={targetKkm}
                      onChange={(e) => setTargetKkm(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    />
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
                  </div>
                  <span className="text-[10px] text-sumi-charcoal">Standar olimpiade minimal: 80 Pts.</span>
                </div>
              </div>
            )}

            {/* 2. CERDAS CERMAT CONDITIONAL */}
            {category === 'cerdas_cermat' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-sumi mb-1">
                      Kategori Tema Materi
                    </label>
                    <select
                      value={ccTheme}
                      onChange={(e) => setCcTheme(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    >
                      <option value="Budaya (Bunka)">Budaya Tradisional & Modern (Bunka)</option>
                      <option value="Geografi & Wisata">Geografi, Prefektur & Wisata (Chiri)</option>
                      <option value="Kotowaza & Idiom">Peribahasa & Idiom (Kotowaza)</option>
                      <option value="Tata Bahasa & Sejarah">Tata Bahasa & Sejarah (Bunpou & Rekishi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-sumi mb-1">
                      Batas Waktu Total Paket (Menit)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-sumi-border/60">
                  <div>
                    <div className="text-xs font-bold text-sumi">Mode Rapid Blitz (Timer Per Soal)</div>
                    <div className="text-[10px] text-sumi-charcoal">
                      Hitung mundur 15 detik otomatis untuk setiap butir pertanyaan trivia
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBlitzMode}
                      onChange={(e) => setIsBlitzMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-crimson"></div>
                  </label>
                </div>
              </div>
            )}

            {/* 3. KIKIKAKITORI CONDITIONAL */}
            {category === 'kikikakitori' && (
              <div className="space-y-3.5">
                <AudioInputSwitcher
                  value={packageAudio}
                  onChange={setPackageAudio}
                  defaultSource="uploaded"
                  label="Audio Utama / Naskah Ujian Menyimak"
                  helperText="Unggah rekaman audio narasi (.mp3/.wav), rekam langsung suara Sensei, atau sematkan tautan URL"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-sumi mb-1">
                      Maksimal Pemutaran Audio
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={maxPlayCount}
                      onChange={(e) => setMaxPlayCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    />
                    <span className="text-[10px] text-sumi-charcoal">Standar olimpiade ketat: 2x putar.</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-sumi-border/60">
                    <div>
                      <div className="text-xs font-bold text-sumi">Anti-Scrubbing</div>
                      <div className="text-[10px] text-sumi-charcoal">Kunci scrubber audio</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={antiScrubbing}
                        onChange={(e) => setAntiScrubbing(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-crimson"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. RODOKU CONDITIONAL */}
            {category === 'rodoku' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Pengarang / Karya Asli
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Niimi Nankichi (新美南吉)"
                    value={authorWork}
                    onChange={(e) => setAuthorWork(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                  />
                </div>

                <AudioInputSwitcher
                  value={packageAudio}
                  onChange={setPackageAudio}
                  defaultSource="recorded"
                  label="Audio Acuan Sensei (Panduan Intonasi & Jeda)"
                  helperText="Sangat disarankan merekam langsung artikulasi acuan agar siswa mendengar jeda napas yang tepat"
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-sumi">
                      Naskah Lengkap Bacaan (Format Furigana & Jeda)
                    </label>
                    <span className="text-[10px] text-crimson font-medium">
                      Gunakan {'{Kanji|furigana}'} dan / (jeda pendek) // (jeda panjang)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Contoh: 「{寒い|さむい}冬が / 北から、// {狐|きつね}の親子の棲んでいる森へもやって来ました。」"
                    value={rodokuScript}
                    onChange={(e) => setRodokuScript(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sumi-border bg-white font-mono resize-none"
                  />
                </div>

                {rodokuScript && (
                  <div className="p-3 bg-white rounded-xl border border-sumi-border text-xs leading-relaxed">
                    <div className="text-[10px] font-bold text-sumi-charcoal uppercase mb-1 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-crimson" /> Pratinjau Tampilan Siswa:
                    </div>
                    <div>{parseFuriganaPreview(rodokuScript)}</div>
                  </div>
                )}
              </div>
            )}

            {/* 5. SEIYU CONDITIONAL */}
            {category === 'seiyu' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Judul Anime & Scene Adegan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kizuna no Kanata - Scene 03: Garis Batas"
                    value={sceneTitle}
                    onChange={(e) => setSceneTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                  />
                </div>

                <AudioInputSwitcher
                  value={packageAudio}
                  onChange={setPackageAudio}
                  defaultSource="recorded"
                  label="Audio Adegan Lengkap / Contoh Sulih Suara Sensei"
                  helperText="Contoh tempo dan dinamika emosi akting suara untuk dipelajari seluruh pengisi suara"
                />

                {/* Character Tag Adder */}
                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Tokoh Karakter dalam Adegan
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {characterRoles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-sumi-border text-sumi shadow-2xs"
                      >
                        <span>{role}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(role)}
                          className="text-sumi-charcoal hover:text-crimson"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ketik nama tokoh baru (misal: Daiki, Sensei)..."
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRole();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddRole}
                      className="px-3 py-1.5 bg-sumi hover:bg-sumi-charcoal text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Tokoh
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SHODOU CONDITIONAL */}
            {category === 'shodou' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-sumi mb-1">
                      Karakter Kanji Target
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="『道』"
                      value={targetKanji}
                      onChange={(e) => setTargetKanji(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white font-serif text-center text-base font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-sumi mb-1">
                      Gaya Kaligrafi Baku
                    </label>
                    <select
                      value={calligraphyStyle}
                      onChange={(e) => setCalligraphyStyle(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                    >
                      <option value="Kaisho (Baku)">Kaisho (楷書) - Baku Tegak Proporsional</option>
                      <option value="Gyosho (Semi-Kursif)">Gyosho (行書) - Semi Kursif Mengalir</option>
                      <option value="Sosho (Kursif)">Sosho (草書) - Kursif Cepat Artistik</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    Makna Filosofi Karakter
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jalan / Kehidupan / Kebenaran Hakiki"
                    value={philosophyMeaning}
                    onChange={(e) => setPhilosophyMeaning(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sumi mb-1">
                    URL Diagram Urutan Goresan (SVG/PNG)
                  </label>
                  <input
                    type="text"
                    placeholder="https://storage.jtrain.sch.id/shodou/michi-stroke-guide.svg"
                    value={strokeOrderUrl}
                    onChange={(e) => setStrokeOrderUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-sumi-border bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Visibility Switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sumi-border">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              <div>
                <div className="text-xs font-bold text-sumi">
                  Status Publikasi: {isPublished ? 'Publik (Bisa Dikerjakan Siswa)' : 'Draft (Hanya Sensei)'}
                </div>
                <div className="text-[10px] text-sumi-charcoal">
                  Paket langsung muncul di dashboard latihan siswa saat berstatus Publik
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Progress Bar when uploading audio */}
          {isUploadingAudio && (
            <div className="space-y-1.5 p-3 rounded-2xl bg-crimson-tint/30 border border-crimson/20 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-crimson">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengunggah audio referensi... {uploadProgress}%
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-crimson/20">
                <div 
                  className="h-full bg-crimson transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-sumi-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-sumi-charcoal hover:bg-sumi-light transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black rounded-xl bg-crimson hover:bg-crimson-dark text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialData ? 'Simpan Perubahan' : 'Buat Paket Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
