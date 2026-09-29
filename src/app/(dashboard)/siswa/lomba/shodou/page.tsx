'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/data/store';
import { EmptyState } from '@/components/common/EmptyState';
import { KANJI_MODELS, KanjiModel } from '@/lib/data/kanjiStrokesData';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Camera, 
  Check, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Trash2,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShodouLombaPage() {
  const { practiceSets, submitPracticeResult, currentUser } = useAppStore();

  const shodouSets = practiceSets.filter((s) => s.category === 'shodou');
  const activeSet = shodouSets[0];

  // 1. Metadata Selectors State
  const [selectedModelKey, setSelectedModelKey] = useState<string>('michi');
  const [selectedStyle, setSelectedStyle] = useState<string>('Kaisho (楷書) - Baku');

  // Current Kanji Model Data
  const currentModel: KanjiModel = KANJI_MODELS[selectedModelKey] || KANJI_MODELS.michi;
  const totalStrokes = currentModel.strokes.length;

  // 2. Interactive Canvas State
  const [gridType, setGridType] = useState<'polos' | 'grid-4' | 'grid-9'>('grid-4');
  const [activeStroke, setActiveStroke] = useState<number>(4); // Default 4 to match mockup
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x

  // 3. Action Panel State
  const [activeTab, setActiveTab] = useState<'rubrik' | 'unggah'>('rubrik');
  const [statusSession, setStatusSession] = useState<string>('Akan Selesai [✓]');
  const [checklist, setChecklist] = useState({
    tome: true,   // Default checked as in mockup
    hane: true,   // Default checked as in mockup
    harai: false,
    balance: false,
    rakkan: false,
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Unggah Karya State
  const [sheetCount, setSheetCount] = useState<number>(2); // Default 2 as in mockup
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Session Completion State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Reset active stroke when model changes
  useEffect(() => {
    setActiveStroke(Math.min(4, currentModel.strokes.length));
    setIsPlaying(false);
  }, [selectedModelKey, currentModel.strokes.length]);

  // Animation Interval Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = Math.round(850 / speed);
      timer = setInterval(() => {
        setActiveStroke((prev) => {
          if (prev >= totalStrokes) {
            setIsPlaying(false);
            return totalStrokes;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, totalStrokes]);

  if (!activeSet || !activeSet.is_published) {
    return (
      <EmptyState
        categoryName="Shodou"
        categoryKanji="書道"
        customMessage="Ruang latihan Shodou sedang disiapkan oleh Sensei. Nantikan model huruf hanshi dan diagram kaidah goresan segera!"
      />
    );
  }

  // Toggle checklist item
  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Extract starting coordinate from SVG path string (e.g. "M49.38,14.88c...")
  const getStartPoint = (d: string) => {
    const match = d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/i);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
    return { x: 54.5, y: 54.5 };
  };

  // Tooltip descriptions
  const criteriaData = {
    tome: {
      title: 'Kerapian Tome (止)',
      desc: 'Pemberhentian ujung kuas tegas pada titik henti goresan. Tahan tekanan sesaat lalu angkat kuas tegak lurus tanpa bulu meleber.',
      senseiTip: 'Sensei Tip: Jangan buru-buru menyapu kuas ke samping saat ingin berhenti.',
    },
    hane: {
      title: 'Lentikan Hane (跳)',
      desc: 'Lentingan kuas tajam pada sudut 45° dengan mengangkat tumit kuas perlahan sambil melentingkan ujung rambut kuas.',
      senseiTip: 'Sensei Tip: Jaga poros pergelangan tangan tetap stabil, lentikkan dari jari.',
    },
    harai: {
      title: 'Sapuan Harai (払)',
      desc: 'Sapuan kuas mengalir meruncing dari tebal ke tipis secara harmonis. Tekan pada pangkal lalu sapukan melebar.',
      senseiTip: 'Sensei Tip: Hasilkan ujung goresan segitiga lancip seperti daun bambu.',
    },
    balance: {
      title: 'Keseimbangan (バランス)',
      desc: 'Pusat gravitasi karakter berada tepat di poros tengah lipatan kertas Hanshi dengan margin atas-bawah simetris.',
      senseiTip: 'Sensei Tip: Gunakan garis grid bantu untuk menakar proporsi radikal kiri dan kanan.',
    },
    rakkan: {
      title: 'Rakkan & Cap (落款)',
      desc: 'Posisi penulisan nama kanji dan stempel cap merah berjarak dua jari dari tepi kiri bawah kertas hanshi.',
      senseiTip: 'Sensei Tip: Bubuhkan cap dengan tekanan merata agar tepi segel terlihat tajam.',
    },
  };

  // Handle Photo File Pick
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhoto(event.target?.result as string);
        setActiveTab('unggah');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Session Completion
  const handleCompleteSession = () => {
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    submitPracticeResult({
      set_id: activeSet.id,
      category: 'shodou',
      score: Math.round((checkedCount / 5) * 100),
      total_questions: 5,
      correct_answers: checkedCount,
      time_spent_seconds: 480,
      set_title: `Shodou 『${currentModel.name}』 (${selectedStyle})`,
      type: 'practice_opened',
    });

    setIsCompleted(true);
    setShowToast(true);

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#111827', '#B91C1C', '#D26771', '#FAF7F2'],
    });

    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  return (
    <div className="space-y-3 pb-4 max-w-[1400px] mx-auto">
      {/* 1. SUB-HEADER & SELECTOR METADATA BAR (PERSIS MOCKUP) */}
      <section className="bg-white rounded-2xl border border-[#EDE8E1] px-4 py-2.5 sm:px-5 sm:py-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sisi Kiri: Breadcrumb Navigasi */}
        <div className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#4B5563]">
          <Link
            href="/siswa"
            className="flex items-center gap-1.5 hover:text-crimson transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Beranda</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <Link
            href="/siswa#katalog-lomba"
            className="hover:text-crimson transition-colors"
          >
            Ruang Lomba
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="font-bold text-crimson font-jp">
            Shodou (書道)
          </span>
        </div>

        {/* Sisi Kanan: Dropdown Selector Karakter & Gaya Tulisan */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Selector Karakter */}
          <div className="relative inline-flex items-center">
            <label htmlFor="select-kanji-model" className="sr-only">
              Pilih Model Karakter
            </label>
            <span className="text-xs font-semibold text-[#4B5563] mr-1.5 hidden sm:inline">
              Model Karakter:
            </span>
            <div className="relative">
              <select
                id="select-kanji-model"
                value={selectedModelKey}
                onChange={(e) => setSelectedModelKey(e.target.value)}
                className="appearance-none bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E5DEC9] text-[#111827] text-xs sm:text-[13px] font-bold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-all cursor-pointer shadow-sm font-jp"
              >
                <option value="michi">『道』 (Jalan / Kehidupan)</option>
                <option value="yume">『夢』 (Impian / Cita-cita)</option>
                <option value="wa">『和』 (Harmoni / Damai)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Selector Gaya Tulisan */}
          <div className="relative inline-flex items-center">
            <label htmlFor="select-kanji-style" className="sr-only">
              Pilih Gaya Kaligrafi
            </label>
            <span className="text-xs font-semibold text-[#4B5563] mr-1.5 hidden sm:inline">
              Gaya:
            </span>
            <div className="relative">
              <select
                id="select-kanji-style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="appearance-none bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E5DEC9] text-[#111827] text-xs sm:text-[13px] font-bold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-crimson/30 transition-all cursor-pointer shadow-sm font-jp"
              >
                <option value="Kaisho (楷書) - Baku">[ Kaisho ] Baku</option>
                <option value="Gyousho (行書) - Semi-kursif">[ Gyousho ] Semi-kursif</option>
                <option value="Sousho (草書) - Kursif">[ Sousho ] Kursif</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUA KOLOM: WORKBENCH INTERAKTIF SATU LAYAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ======================================================== */}
        {/* SISI KIRI: CANVAS MODEL & ANIMASI GORESAN (7 KOLOM)      */}
        {/* ======================================================== */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE8E1] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between space-y-3">
          {/* Card Header: Judul & Segmented Pill Toggle Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#F0EBE1] gap-2">
            <h2 className="font-extrabold uppercase text-xs sm:text-[13px] tracking-wider text-sumi flex items-center gap-2">
              <Layers className="w-4 h-4 text-crimson" />
              <span>CANVAS MODEL & ANIMASI GORESAN</span>
            </h2>

            {/* Toggle Grid Pill Buttons */}
            <div className="flex items-center bg-[#FAF5EE] p-1 rounded-xl border border-[#EDE8E1] text-[11px] sm:text-xs font-bold gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGridType('polos')}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  gridType === 'polos'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-sumi hover:bg-[#F0EBE1]'
                }`}
              >
                Polos
              </button>
              <button
                type="button"
                onClick={() => setGridType('grid-4')}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-jp ${
                  gridType === 'grid-4'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-sumi hover:bg-[#F0EBE1]'
                }`}
              >
                Grid 4 Kotak (十字)
              </button>
              <button
                type="button"
                onClick={() => setGridType('grid-9')}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-jp ${
                  gridType === 'grid-9'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-[#4B5563] hover:text-sumi hover:bg-[#F0EBE1]'
                }`}
              >
                Grid 9 Kotak (九宮格)
              </button>
            </div>
          </div>

          {/* Kertas Hanshi Digital Utama */}
          <div className="w-full bg-[#FAF7F2] rounded-2xl border border-[#E8DFC9] p-2 sm:p-3 flex items-center justify-center relative shadow-inner overflow-hidden">
            {/* Hanshi Paper Frame Box */}
            <div className="relative w-full max-w-[300px] sm:max-w-[330px] aspect-[1/1] bg-[#FAF7F2] border-2 border-[#8B2332]/70 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center p-2.5 select-none">
              {/* Rich Authentic Kaisho Calligraphy Font (Main Base Character) */}
              <div className="absolute inset-0 flex items-center justify-center text-[160px] sm:text-[185px] font-black text-[#111827] select-none pointer-events-none font-jp leading-none tracking-tighter drop-shadow-sm">
                {currentModel.name}
              </div>

              {/* Dynamic SVG Kanji Strokes & Grid Overlay */}
              <svg
                viewBox="0 0 109 109"
                className="w-full h-full relative z-10 pointer-events-none"
                fill="none"
              >
                {/* 1. Grid Lines (Red Dotted Lines) */}
                {gridType === 'grid-4' && (
                  <g>
                    {/* Vertical Center */}
                    <line
                      x1="54.5"
                      y1="0"
                      x2="54.5"
                      y2="109"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    {/* Horizontal Center */}
                    <line
                      x1="0"
                      y1="54.5"
                      x2="109"
                      y2="54.5"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                  </g>
                )}

                {gridType === 'grid-9' && (
                  <g>
                    {/* 2 Vertical Lines */}
                    <line
                      x1="36.33"
                      y1="0"
                      x2="36.33"
                      y2="109"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <line
                      x1="72.66"
                      y1="0"
                      x2="72.66"
                      y2="109"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    {/* 2 Horizontal Lines */}
                    <line
                      x1="0"
                      y1="36.33"
                      x2="109"
                      y2="36.33"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                    <line
                      x1="0"
                      y1="72.66"
                      x2="109"
                      y2="72.66"
                      stroke="#B91C1C"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                  </g>
                )}

                {/* 2. Active Stroke Highlight (Semi-transparent Crimson Sweep & Glow) */}
                {currentModel.strokes.map((s, idx) => {
                  if (idx + 1 === activeStroke) {
                    const start = getStartPoint(s.d);
                    return (
                      <g key={`active-${idx}`}>
                        {/* Wide Crimson Aura / Glow */}
                        <path
                          d={s.d}
                          stroke="rgba(185, 28, 28, 0.45)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Core Crimson Stroke Line */}
                        <path
                          d={s.d}
                          stroke="#B91C1C"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Start point marker (Tome origin indicator) */}
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r="3"
                          fill="#B91C1C"
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                        />
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r="6"
                          fill="none"
                          stroke="#B91C1C"
                          strokeWidth="1"
                          opacity="0.7"
                          className="animate-ping"
                        />
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Rakkan Seal Stamp (Bottom-Left Standard) */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-7 h-10 border-2 border-crimson/80 rounded-sm flex flex-col items-center justify-center p-0.5 bg-[#FAF7F2]/90 shadow-sm pointer-events-none select-none">
                <span className="text-[9px] font-black text-crimson leading-none font-jp">
                  南高
                </span>
                <span className="text-[8px] font-black text-crimson leading-none font-jp mt-0.5">
                  印
                </span>
              </div>
            </div>
          </div>

          {/* Player & Speed Controller (Bawah Kertas - Centered as in Mockup) */}
          <div className="space-y-2.5 pt-1 text-center">
            {/* Row 1: Player Buttons & Step Controls */}
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`h-8 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                  isPlaying
                    ? 'bg-[#111827] text-white hover:bg-black'
                    : 'bg-crimson hover:bg-[#991B1B] text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Animasi</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStroke((prev) => Math.max(1, prev - 1));
                }}
                disabled={activeStroke <= 1}
                className="h-8 px-2.5 rounded-xl border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#374151] font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Goresan Sebelumnya"
              >
                <SkipBack className="w-3 h-3" />
                <span>Mundur</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStroke((prev) => Math.min(totalStrokes, prev + 1));
                }}
                disabled={activeStroke >= totalStrokes}
                className="h-8 px-2.5 rounded-xl border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#374151] font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Goresan Selanjutnya"
              >
                <span>Maju</span>
                <SkipForward className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStroke(1);
                }}
                className="h-8 w-8 rounded-xl border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#6B7280] hover:text-sumi flex items-center justify-center transition-all"
                title="Reset ke Goresan 1"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Row 2: Speed Selector [ 0.5x | 1x | 1.5x ] */}
            <div className="flex items-center justify-center gap-1">
              <div className="inline-flex items-center bg-[#FAF5EE] p-1 rounded-xl border border-[#EDE8E1] text-[11px] font-bold gap-1">
                {[0.5, 1, 1.5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSpeed(spd)}
                    className={`px-2.5 py-0.5 rounded-lg transition-all ${
                      speed === spd
                        ? 'bg-crimson text-white shadow-sm'
                        : 'text-[#4B5563] hover:text-sumi'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Status Tracker GoresanAktif: [== 4 / 12 ==] */}
            <div className="max-w-sm mx-auto bg-[#FAF5EE] rounded-xl p-2.5 border border-[#EDE8E1] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-sumi">
                <span className="font-mono text-crimson">
                  Goresan Aktif: [ {activeStroke} / {totalStrokes} ]
                </span>
                <span className="text-[#4B5563] font-medium text-[11px] truncate max-w-[200px]">
                  {currentModel.steps[activeStroke - 1]?.title || 'Goresan Selesai'}
                </span>
              </div>

              {/* Mini Crimson Progress Bar */}
              <div className="h-1.5 w-full bg-[#F5E6E6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-crimson rounded-full transition-all duration-300"
                  style={{ width: `${(activeStroke / totalStrokes) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-[#4B5563] italic leading-tight">
                💡 {currentModel.steps[activeStroke - 1]?.desc}
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SISI KANAN: ACTION PANEL (EVALUASI & DOKUMENTASI) (5 KOLOM) */}
        {/* ======================================================== */}
        <section className="lg:col-span-5 bg-white rounded-2xl border border-[#EDE8E1] p-3.5 sm:p-4 shadow-sm flex flex-col justify-between space-y-3.5">
          {/* Action Panel Header & Segmented Tabs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <h2 className="font-extrabold uppercase text-xs sm:text-[13px] tracking-wider text-sumi flex items-center gap-2">
                <Award className="w-4 h-4 text-crimson" />
                <span>ACTION PANEL</span>
              </h2>

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  value={statusSession}
                  onChange={(e) => setStatusSession(e.target.value)}
                  className="appearance-none bg-[#FAF5EE] border border-[#E5DEC9] text-[#111827] text-[11px] font-bold py-1 pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-crimson cursor-pointer"
                >
                  <option value="Sedang Berlatih [⏳]">Sedang Berlatih [⏳]</option>
                  <option value="Akan Selesai [✓]">Akan Selesai [✓]</option>
                  <option value="Siap Review Sensei [⭐]">Siap Review Sensei [⭐]</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#6B7280] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF5EE] rounded-xl border border-[#EDE8E1]">
              <button
                type="button"
                onClick={() => setActiveTab('rubrik')}
                className={`py-1.5 text-xs font-extrabold tracking-wide rounded-lg transition-all ${
                  activeTab === 'rubrik'
                    ? 'bg-white text-crimson shadow-sm border border-[#E5DEC9]'
                    : 'text-[#6B7280] hover:text-sumi'
                }`}
              >
                RUBRIK EVALUASI MANDIRI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unggah')}
                className={`py-1.5 text-xs font-extrabold tracking-wide rounded-lg transition-all ${
                  activeTab === 'unggah'
                    ? 'bg-white text-crimson shadow-sm border border-[#E5DEC9]'
                    : 'text-[#6B7280] hover:text-sumi'
                }`}
              >
                UNGGAH KARYA
              </button>
            </div>
          </div>

          {/* TAB 1: RUBRIK EVALUASI MANDIRI */}
          {activeTab === 'rubrik' && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Checklist Standar Penilaian Sensei:
              </div>

              {/* 5 Checklist Items */}
              <div className="space-y-2">
                {/* 1. Tome */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.tome
                      ? 'bg-[#FEF2F2] border-crimson/50'
                      : 'bg-[#FAF5EE] border-[#EDE8E1] hover:border-crimson/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      1. Kerapian Tome (止)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'tome' ? null : 'tome')}
                      className="w-5 h-5 rounded-md bg-crimson text-white text-[11px] font-bold flex items-center justify-center hover:bg-[#991B1B] transition-colors"
                      title="Lihat kriteria teknik Tome"
                    >
                      ?
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('tome')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.tome
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-[#D1D5DB] bg-white hover:border-crimson'
                    }`}
                  >
                    {checklist.tome && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Tome */}
                {activeTooltip === 'tome' && (
                  <div className="p-2.5 bg-white rounded-xl border border-crimson/40 shadow-md text-xs space-y-1">
                    <div className="font-bold text-crimson">{criteriaData.tome.title}</div>
                    <p className="text-[#374151] leading-relaxed text-[11px]">{criteriaData.tome.desc}</p>
                    <div className="text-[10px] text-[#6B7280] italic">{criteriaData.tome.senseiTip}</div>
                  </div>
                )}

                {/* 2. Hane */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.hane
                      ? 'bg-[#FEF2F2] border-crimson/50'
                      : 'bg-[#FAF5EE] border-[#EDE8E1] hover:border-crimson/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      2. Lentikan Hane (跳)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'hane' ? null : 'hane')}
                      className="w-5 h-5 rounded-md bg-crimson text-white text-[11px] font-bold flex items-center justify-center hover:bg-[#991B1B] transition-colors"
                      title="Lihat kriteria teknik Hane"
                    >
                      ?
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('hane')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.hane
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-[#D1D5DB] bg-white hover:border-crimson'
                    }`}
                  >
                    {checklist.hane && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Hane */}
                {activeTooltip === 'hane' && (
                  <div className="p-2.5 bg-white rounded-xl border border-crimson/40 shadow-md text-xs space-y-1">
                    <div className="font-bold text-crimson">{criteriaData.hane.title}</div>
                    <p className="text-[#374151] leading-relaxed text-[11px]">{criteriaData.hane.desc}</p>
                    <div className="text-[10px] text-[#6B7280] italic">{criteriaData.hane.senseiTip}</div>
                  </div>
                )}

                {/* 3. Harai */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.harai
                      ? 'bg-[#FEF2F2] border-crimson/50'
                      : 'bg-[#FAF5EE] border-[#EDE8E1] hover:border-crimson/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      3. Sapuan Harai (払)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'harai' ? null : 'harai')}
                      className="w-5 h-5 rounded-md bg-[#6B7280] hover:bg-crimson text-white text-[11px] font-bold flex items-center justify-center transition-colors"
                      title="Lihat kriteria teknik Harai"
                    >
                      ?
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('harai')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.harai
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-[#D1D5DB] bg-white hover:border-crimson'
                    }`}
                  >
                    {checklist.harai && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Harai */}
                {activeTooltip === 'harai' && (
                  <div className="p-2.5 bg-white rounded-xl border border-crimson/40 shadow-md text-xs space-y-1">
                    <div className="font-bold text-crimson">{criteriaData.harai.title}</div>
                    <p className="text-[#374151] leading-relaxed text-[11px]">{criteriaData.harai.desc}</p>
                    <div className="text-[10px] text-[#6B7280] italic">{criteriaData.harai.senseiTip}</div>
                  </div>
                )}

                {/* 4. Balance */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.balance
                      ? 'bg-[#FEF2F2] border-crimson/50'
                      : 'bg-[#FAF5EE] border-[#EDE8E1] hover:border-crimson/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      4. Keseimbangan (バランス)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('balance')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.balance
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-[#D1D5DB] bg-white hover:border-crimson'
                    }`}
                  >
                    {checklist.balance && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* 5. Rakkan */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.rakkan
                      ? 'bg-[#FEF2F2] border-crimson/50'
                      : 'bg-[#FAF5EE] border-[#EDE8E1] hover:border-crimson/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      5. Rakkan & Cap (落款)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('rakkan')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.rakkan
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-[#D1D5DB] bg-white hover:border-crimson'
                    }`}
                  >
                    {checklist.rakkan && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNGGAH KARYA DETAIL */}
          {activeTab === 'unggah' && (
            <div className="space-y-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE8E1]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sumi">Foto Fisik Hasil Kuas Hanshi</span>
                {uploadedPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPhoto(null);
                      setPhotoFileName('');
                    }}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {uploadedPhoto ? (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DEC9] bg-white shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedPhoto}
                    alt="Pratinjau Karya Hanshi"
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2.5 py-1 rounded-md">
                    {photoFileName || 'Foto Lembar Karya'}
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed border-[#D1D5DB] rounded-xl text-center space-y-1 bg-white/60">
                  <Camera className="w-6 h-6 text-[#9CA3AF] mx-auto" />
                  <p className="text-[11px] text-[#4B5563]">
                    Belum ada foto yang diambil. Gunakan tombol kamera di bawah untuk merekam karya hari ini.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION UNGGAH KARYA & LEMBAR COUNTER (TERINTEGRASI DI BAWAH) */}
          <div className="space-y-2.5 pt-2 border-t border-[#F0EBE1]">
            <div className="text-xs font-bold text-sumi uppercase tracking-wider">
              Unggah Karya
            </div>

            {/* Hidden Input for Native Camera / File Picker */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {/* Tombol Aksi Utama Kamera (Crimson) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 bg-crimson hover:bg-[#991B1B] text-white font-bold text-xs sm:text-[13px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] touch-target"
            >
              <Camera className="w-4 h-4" />
              <span>KAMERA / AMBIL FOTO KARYA</span>
            </button>

            {/* Kotak Penghitung Lembar Selesai Hari Ini */}
            <div className="bg-[#FAF5EE] rounded-xl p-2 border border-[#EDE8E1] flex items-center justify-between text-xs font-bold">
              <span className="text-[#374151]">Jumlah Lembar Selesai Hari Ini:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSheetCount((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-lg bg-white border border-[#D1D5DB] hover:bg-[#F3ECE2] text-sumi flex items-center justify-center font-black transition-colors"
                  title="Kurangi Lembar"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 py-0.5 bg-white border border-[#E5DEC9] rounded-lg text-crimson font-black text-xs min-w-[65px] text-center">
                  [ {sheetCount} Lembar ]
                </span>
                <button
                  type="button"
                  onClick={() => setSheetCount((prev) => prev + 1)}
                  className="w-6 h-6 rounded-lg bg-white border border-[#D1D5DB] hover:bg-[#F3ECE2] text-sumi flex items-center justify-center font-black transition-colors"
                  title="Tambah Lembar"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* TOMBOL SUBMIT SESI (STICKY BOTTOM ACTION) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleCompleteSession}
              disabled={isCompleted}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-md touch-target ${
                isCompleted
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-crimson hover:bg-[#991B1B] text-white active:scale-[0.98]'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SESI SHODOU BERHASIL TERSIMPAN</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>SELESAIKAN SESI LATIHAN MANDIRI</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* TOAST / NOTIFIKASI SUKSES */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white p-4 rounded-2xl shadow-2xl border border-gray-700 flex items-start gap-3 max-w-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-xs sm:text-sm text-emerald-300">
              Sesi Latihan Shodou Berhasil Disimpan!
            </div>
            <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
              Karakter 『{currentModel.name}』, {sheetCount} lembar karya fisik, dan evaluasi 5 kriteria mandiri telah dicatat ke portofolio siswa &amp; monitoring Sensei.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
