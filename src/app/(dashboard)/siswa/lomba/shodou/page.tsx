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
  ArrowLeft, 
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

  // 1. Metadata Selectors State (83 Kanji ordered #1..#83)
  const kanjiEntries = Object.entries(KANJI_MODELS);
  const [selectedModelKey, setSelectedModelKey] = useState<string>('michi');
  const currentKanjiIndex = Math.max(
    0,
    kanjiEntries.findIndex(([key]) => key === selectedModelKey)
  );
  const currentKanjiNumber = currentKanjiIndex + 1;
  const [numberInput, setNumberInput] = useState<string>('1');

  // Sync number input whenever model changes from dropdown
  useEffect(() => {
    setNumberInput(String(currentKanjiNumber));
  }, [currentKanjiNumber]);

  const handleJumpToNumber = (rawValue: string) => {
    setNumberInput(rawValue);
    const parsed = parseInt(rawValue, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= kanjiEntries.length) {
      setSelectedModelKey(kanjiEntries[parsed - 1][0]);
    }
  };

  // Current Kanji Model Data
  const currentModel: KanjiModel = KANJI_MODELS[selectedModelKey] || KANJI_MODELS.michi;
  const totalStrokes = currentModel.strokes.length;

  // 2. Interactive Canvas State
  const [gridType, setGridType] = useState<'polos' | 'grid-4' | 'grid-9'>('grid-4');
  const [activeStroke, setActiveStroke] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x
  const [strokeProgress, setStrokeProgress] = useState<number>(1);
  const [brushTipPos, setBrushTipPos] = useState<{ x: number; y: number } | null>(null);
  const activePathRef = useRef<SVGPathElement | null>(null);
  const animTriggerRef = useRef<number>(0);

  // 3. Action Panel State
  const [activeTab, setActiveTab] = useState<'rubrik' | 'unggah'>('rubrik');
  const [statusSession, setStatusSession] = useState<string>('Akan Selesai [✓]');
  const [checklist, setChecklist] = useState({
    tome: true,
    hane: true,
    harai: false,
    balance: false,
    rakkan: false,
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Unggah Karya State
  const [sheetCount, setSheetCount] = useState<number>(2);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Session Completion State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Reset active stroke to 1 when model changes
  useEffect(() => {
    setActiveStroke(1);
    setIsPlaying(false);
    setStrokeProgress(1);
    setBrushTipPos(null);
  }, [selectedModelKey]);

  // Update gliding brush-tip coordinate along active SVG path
  useEffect(() => {
    const pathEl = activePathRef.current;
    if (!pathEl) {
      setBrushTipPos(null);
      return;
    }
    try {
      const totalLen = pathEl.getTotalLength();
      if (totalLen > 0) {
        const pt = pathEl.getPointAtLength(Math.min(1, Math.max(0, strokeProgress)) * totalLen);
        setBrushTipPos({ x: pt.x, y: pt.y });
      }
    } catch {
      setBrushTipPos(null);
    }
  }, [strokeProgress, activeStroke, selectedModelKey]);

  // Smooth requestAnimationFrame Stroke Drawing Loop
  useEffect(() => {
    let rafId: number;
    let pauseTimeout: NodeJS.Timeout;

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    if (isPlaying) {
      const durationMs = Math.round(900 / speed);
      const startTime = performance.now();
      setStrokeProgress(0);

      const tick = (now: number) => {
        const rawT = Math.min(1, (now - startTime) / durationMs);
        setStrokeProgress(easeInOut(rawT));

        if (rawT < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          pauseTimeout = setTimeout(() => {
            setActiveStroke((prev) => {
              if (prev >= totalStrokes) {
                setIsPlaying(false);
                return totalStrokes;
              }
              return prev + 1;
            });
          }, Math.round(160 / speed));
        }
      };

      rafId = requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, [isPlaying, activeStroke, speed, totalStrokes]);

  // Smooth single-stroke preview when stepping manually
  const triggerSingleStrokeDraw = () => {
    animTriggerRef.current += 1;
    const myRun = animTriggerRef.current;
    const durationMs = 420;
    const startTime = performance.now();
    setStrokeProgress(0);

    const stepTick = (now: number) => {
      if (animTriggerRef.current !== myRun) return;
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setStrokeProgress(eased);
      if (t < 1) requestAnimationFrame(stepTick);
    };
    requestAnimationFrame(stepTick);
  };

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
      set_title: `Shodou 『${currentModel.name}』 (#${currentKanjiNumber})`,
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
      {/* 1. SUB-HEADER & SELECTOR METADATA BAR (LIGHT FROSTED GLASS) */}
      <section className="panel-frost-glass text-sumi rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sisi Kiri: Tombol Kembali & Nama Cabang */}
        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-semibold">
          <Link
            href="/siswa"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/75 hover:bg-white border border-sumi-border text-sumi font-bold transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-crimson" />
            <span>Kembali</span>
          </Link>
          <span className="font-extrabold text-crimson font-jp">
            Shodou (書道)
          </span>
        </div>

        {/* Sisi Kanan: Dropdown Selector Karakter & Input Nomor Urut */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Selector Karakter */}
          <div className="relative inline-flex items-center">
            <label htmlFor="select-kanji-model" className="sr-only">
              Pilih Model Karakter
            </label>
            <span className="text-xs font-bold text-sumi-charcoal mr-1.5 hidden sm:inline">
              Model Karakter:
            </span>
            <div className="relative">
              <select
                id="select-kanji-model"
                value={selectedModelKey}
                onChange={(e) => setSelectedModelKey(e.target.value)}
                className="appearance-none bg-white/75 hover:bg-white/95 border border-white/80 text-sumi text-xs sm:text-[13px] font-bold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-crimson/40 transition-all cursor-pointer shadow-xs font-jp"
              >
                {kanjiEntries.map(([key, model], idx) => (
                  <option key={key} value={key}>
                    #{idx + 1} 『{model.name}』 ({model.meaning})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-sumi-charcoal absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Input Nomor Urut Kanji (No: 1 - 83) */}
          <div className="inline-flex items-center gap-1.5">
            <label htmlFor="input-kanji-number" className="text-xs font-bold text-sumi-charcoal">
              No:
            </label>
            <div className="inline-flex items-center bg-white/75 border border-white/80 rounded-xl p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  const prev = currentKanjiNumber > 1 ? currentKanjiNumber - 1 : kanjiEntries.length;
                  handleJumpToNumber(String(prev));
                }}
                className="w-6 h-6 rounded-lg hover:bg-white text-sumi font-bold text-xs flex items-center justify-center transition-colors"
                title="Kanji Sebelumnya"
              >
                -
              </button>
              <input
                id="input-kanji-number"
                type="number"
                min={1}
                max={kanjiEntries.length}
                value={numberInput}
                onChange={(e) => handleJumpToNumber(e.target.value)}
                onBlur={() => setNumberInput(String(currentKanjiNumber))}
                className="w-11 bg-transparent text-center text-xs sm:text-[13px] font-black text-crimson focus:outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                title={`Masukkan nomor kanji 1 sampai ${kanjiEntries.length}`}
              />
              <span className="text-[11px] font-semibold text-sumi-muted pr-1">
                /{kanjiEntries.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = currentKanjiNumber < kanjiEntries.length ? currentKanjiNumber + 1 : 1;
                  handleJumpToNumber(String(next));
                }}
                className="w-6 h-6 rounded-lg hover:bg-white text-sumi font-bold text-xs flex items-center justify-center transition-colors"
                title="Kanji Berikutnya"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUA KOLOM: WORKBENCH INTERAKTIF SATU LAYAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ======================================================== */}
        {/* SISI KIRI: CANVAS MODEL & ANIMASI GORESAN (7 KOLOM)      */}
        {/* ======================================================== */}
        <section className="lg:col-span-7 panel-washi-pagoda rounded-3xl border border-[#DFCBB8] p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
          {/* Clean Editorial Header (No dark strip) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#D8C1AE]/70 gap-2">
            <h2 className="font-extrabold uppercase text-xs sm:text-[13px] tracking-[0.12em] text-[#6B2D26] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B91C1C]" />
              <span>CANVAS MODEL &amp; ANIMASI GORESAN</span>
            </h2>

            {/* Toggle Grid Pill Buttons */}
            <div className="flex items-center bg-white/75 backdrop-blur-xs p-1 rounded-xl border border-[#DEC9B6] text-[11px] sm:text-xs font-bold gap-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setGridType('polos')}
                className={`px-2.5 py-0.5 rounded-lg transition-all ${
                  gridType === 'polos'
                    ? 'bg-[#B91C1C] text-white shadow-sm'
                    : 'text-[#4A3B32] hover:text-[#1A1412] hover:bg-white/80'
                }`}
              >
                Polos
              </button>
              <button
                type="button"
                onClick={() => setGridType('grid-4')}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-jp ${
                  gridType === 'grid-4'
                    ? 'bg-[#B91C1C] text-white shadow-sm'
                    : 'text-[#4A3B32] hover:text-[#1A1412] hover:bg-white/80'
                }`}
              >
                Grid 4 Kotak (十字)
              </button>
              <button
                type="button"
                onClick={() => setGridType('grid-9')}
                className={`px-2.5 py-0.5 rounded-lg transition-all font-jp ${
                  gridType === 'grid-9'
                    ? 'bg-[#B91C1C] text-white shadow-sm'
                    : 'text-[#4A3B32] hover:text-[#1A1412] hover:bg-white/80'
                }`}
              >
                Grid 9 Kotak (九宮格)
              </button>
            </div>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
          {/* Clean Translucent Stage for Hanshi Paper */}
          <div className="w-full rounded-2xl p-2 sm:p-3 flex items-center justify-center relative overflow-hidden">
            {/* Hanshi Paper Frame Box */}
            <div className="relative w-full max-w-[300px] sm:max-w-[330px] aspect-[1/1] bg-[#FFFDF8] border-2 border-[#8B2332]/85 rounded-2xl shadow-[0_8px_24px_rgba(70,35,25,0.14)] flex items-center justify-center p-2.5 select-none">
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

                {/* 2. Future Guideline Strokes (Clear tehon brush guide for upcoming strokes) */}
                {currentModel.strokes.map((s, idx) => {
                  const strokeNum = idx + 1;
                  if (strokeNum > activeStroke) {
                    return (
                      <path
                        key={`future-${idx}`}
                        d={s.d}
                        stroke="#64748B"
                        strokeWidth="6.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.55"
                      />
                    );
                  }
                  return null;
                })}

                {/* 3. Completed Strokes (Deep Authentic Sumi Calligraphy Ink) */}
                {currentModel.strokes.map((s, idx) => {
                  const strokeNum = idx + 1;
                  if (strokeNum < activeStroke) {
                    return (
                      <path
                        key={`completed-${idx}`}
                        d={s.d}
                        stroke="#111827"
                        strokeWidth="6.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  }
                  return null;
                })}

                {/* 4. Active Stroke Highlight (Vivid Crimson Sweep, Aura, and Tome Indicator) */}
                {currentModel.strokes.map((s, idx) => {
                  const strokeNum = idx + 1;
                  if (strokeNum === activeStroke) {
                    const start = getStartPoint(s.d);
                    const isRightEdge = start.x > 82;
                    const isBottomEdge = start.y > 82;
                    const dashOffset = 1 - strokeProgress;

                    return (
                      <g key={`active-${idx}`}>
                        {/* Wide Crimson Aura / Glow */}
                        <path
                          d={s.d}
                          pathLength={1}
                          strokeDasharray={1}
                          strokeDashoffset={dashOffset}
                          stroke="rgba(185, 28, 28, 0.25)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Core Active Crimson Stroke Line (Smoothly Animated) */}
                        <path
                          ref={activePathRef}
                          d={s.d}
                          pathLength={1}
                          strokeDasharray={1}
                          strokeDashoffset={dashOffset}
                          stroke="#B91C1C"
                          strokeWidth="6.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Gliding Brush Tip Indicator while drawing */}
                        {brushTipPos && strokeProgress > 0 && strokeProgress < 1 && (
                          <circle
                            cx={brushTipPos.x}
                            cy={brushTipPos.y}
                            r="4.2"
                            fill="#991B1B"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                          />
                        )}
                        {/* Start point marker (Tome origin indicator) */}
                        <circle
                          cx={start.x}
                          cy={start.y}
                          r="3.2"
                          fill="#B91C1C"
                          stroke="#FFFFFF"
                          strokeWidth="1.1"
                        />
                        {/* Stroke number badge at stroke start */}
                        <g transform={`translate(${isRightEdge ? start.x - 14 : start.x + 3}, ${isBottomEdge ? start.y - 12 : start.y - 4})`}>
                          <rect
                            x="0"
                            y="0"
                            width="11"
                            height="11"
                            rx="3"
                            fill="#B91C1C"
                            stroke="#FFFFFF"
                            strokeWidth="0.8"
                          />
                          <text
                            x="5.5"
                            y="8"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="7.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {strokeNum}
                          </text>
                        </g>
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

          {/* Tutorial Step Guide: ultra-compact 1-line on mobile, full card on desktop */}
          {currentModel.steps[activeStroke - 1] && (
            <>
              <div className="flex sm:hidden items-center justify-center gap-2 text-xs text-sumi px-2">
                <span className="px-2 py-0.5 rounded-md bg-crimson text-white text-[10px] font-extrabold whitespace-nowrap">
                  {activeStroke}/{totalStrokes}
                </span>
                <span className="font-bold truncate">
                  {currentModel.steps[activeStroke - 1].title}
                </span>
              </div>

              <div className="hidden sm:flex rounded-2xl bg-[#FAF7F2]/90 border border-[#EDE8E1] px-4 py-2.5 items-start gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-crimson text-white text-[11px] font-bold whitespace-nowrap mt-0.5">
                  Goresan {activeStroke}/{totalStrokes}
                </span>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-sumi">
                    {currentModel.steps[activeStroke - 1].title}
                  </div>
                  <p className="text-[11px] text-sumi-charcoal leading-relaxed mt-0.5">
                    {currentModel.steps[activeStroke - 1].desc}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Player & Speed Controller */}
          <div className="space-y-2.5 pt-1 text-center">
            {/* Row 1: Player Buttons & Step Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                  } else {
                    if (activeStroke >= totalStrokes) {
                      setActiveStroke(1);
                    }
                    setIsPlaying(true);
                  }
                }}
                className={`h-8 px-4 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
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
                  triggerSingleStrokeDraw();
                }}
                disabled={activeStroke <= 1}
                className="h-8 px-3 rounded-full border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#374151] font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                  triggerSingleStrokeDraw();
                }}
                disabled={activeStroke >= totalStrokes}
                className="h-8 px-3 rounded-full border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#374151] font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                  triggerSingleStrokeDraw();
                }}
                className="h-8 w-8 rounded-full border border-[#EDE8E1] bg-[#FAF5EE] hover:bg-[#F0EBE1] text-[#6B7280] hover:text-sumi flex items-center justify-center transition-all"
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
          </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SISI KANAN: ACTION PANEL (LIGHT FROSTED GLASS) (5 KOLOM) */}
        {/* ======================================================== */}
        <section className="lg:col-span-5 panel-frost-glass text-sumi rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          {/* Header & Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-sumi/10">
              <h2 className="font-extrabold uppercase text-xs sm:text-[13px] tracking-[0.14em] text-sumi flex items-center gap-2">
                <Award className="w-4 h-4 text-crimson" />
                <span>ACTION PANEL</span>
              </h2>

              {/* Status Dropdown */}
              <div className="relative">
                <select
                  value={statusSession}
                  onChange={(e) => setStatusSession(e.target.value)}
                  className="appearance-none bg-white/75 hover:bg-white/95 border border-white/80 text-sumi text-[11px] font-bold py-1 pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-crimson cursor-pointer shadow-2xs"
                >
                  <option value="Sedang Berlatih">Sedang Berlatih</option>
                  <option value="Akan Selesai">Akan Selesai</option>
                  <option value="Siap Review Sensei">Siap Review Sensei</option>
                </select>
                <ChevronDown className="w-3 h-3 text-sumi-charcoal absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/50 rounded-xl border border-white/70">
              <button
                type="button"
                onClick={() => setActiveTab('rubrik')}
                className={`py-1.5 text-xs font-extrabold tracking-wide rounded-lg transition-all ${
                  activeTab === 'rubrik'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                RUBRIK EVALUASI MANDIRI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('unggah')}
                className={`py-1.5 text-xs font-extrabold tracking-wide rounded-lg transition-all ${
                  activeTab === 'unggah'
                    ? 'bg-crimson text-white shadow-sm'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                UNGGAH KARYA
              </button>
            </div>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
          {/* TAB 1: RUBRIK EVALUASI MANDIRI */}
          {activeTab === 'rubrik' && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold text-sumi-charcoal uppercase tracking-wider">
                Checklist Standar Penilaian Sensei:
              </div>

              {/* 5 Checklist Items */}
              <div className="space-y-2">
                {/* 1. Tome */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.tome
                      ? 'bg-[#FEF2F2]/85 border-crimson/50'
                      : 'bg-white/60 border-white/80 hover:border-crimson/35'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      1. Kerapian Tome (止)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'tome' ? null : 'tome')}
                      className="w-5 h-5 rounded-md bg-crimson/15 hover:bg-crimson text-crimson hover:text-white text-[11px] font-bold flex items-center justify-center transition-colors"
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
                        : 'border-2 border-sumi/25 bg-white/80 hover:border-crimson'
                    }`}
                  >
                    {checklist.tome && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Tome */}
                {activeTooltip === 'tome' && (
                  <div className="p-2.5 bg-white/85 rounded-xl border border-crimson/35 text-xs space-y-1 shadow-sm">
                    <div className="font-bold text-crimson">{criteriaData.tome.title}</div>
                    <p className="text-sumi-charcoal leading-relaxed text-[11px]">{criteriaData.tome.desc}</p>
                    <div className="text-[10px] text-sumi-muted italic">{criteriaData.tome.senseiTip}</div>
                  </div>
                )}

                {/* 2. Hane */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.hane
                      ? 'bg-[#FEF2F2]/85 border-crimson/50'
                      : 'bg-white/60 border-white/80 hover:border-crimson/35'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      2. Lentikan Hane (跳)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'hane' ? null : 'hane')}
                      className="w-5 h-5 rounded-md bg-crimson/15 hover:bg-crimson text-crimson hover:text-white text-[11px] font-bold flex items-center justify-center transition-colors"
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
                        : 'border-2 border-sumi/25 bg-white/80 hover:border-crimson'
                    }`}
                  >
                    {checklist.hane && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Hane */}
                {activeTooltip === 'hane' && (
                  <div className="p-2.5 bg-white/85 rounded-xl border border-crimson/35 text-xs space-y-1 shadow-sm">
                    <div className="font-bold text-crimson">{criteriaData.hane.title}</div>
                    <p className="text-sumi-charcoal leading-relaxed text-[11px]">{criteriaData.hane.desc}</p>
                    <div className="text-[10px] text-sumi-muted italic">{criteriaData.hane.senseiTip}</div>
                  </div>
                )}

                {/* 3. Harai */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.harai
                      ? 'bg-[#FEF2F2]/85 border-crimson/50'
                      : 'bg-white/60 border-white/80 hover:border-crimson/35'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      3. Sapuan Harai (払)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'harai' ? null : 'harai')}
                      className="w-5 h-5 rounded-md bg-crimson/15 hover:bg-crimson text-crimson hover:text-white text-[11px] font-bold flex items-center justify-center transition-colors"
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
                        : 'border-2 border-sumi/25 bg-white/80 hover:border-crimson'
                    }`}
                  >
                    {checklist.harai && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* Popover Tooltip Harai */}
                {activeTooltip === 'harai' && (
                  <div className="p-2.5 bg-white/85 rounded-xl border border-crimson/35 text-xs space-y-1 shadow-sm">
                    <div className="font-bold text-crimson">{criteriaData.harai.title}</div>
                    <p className="text-sumi-charcoal leading-relaxed text-[11px]">{criteriaData.harai.desc}</p>
                    <div className="text-[10px] text-sumi-muted italic">{criteriaData.harai.senseiTip}</div>
                  </div>
                )}

                {/* 4. Balance */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.balance
                      ? 'bg-[#FEF2F2]/85 border-crimson/50'
                      : 'bg-white/60 border-white/80 hover:border-crimson/35'
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
                        : 'border-2 border-sumi/25 bg-white/80 hover:border-crimson'
                    }`}
                  >
                    {checklist.balance && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                </div>

                {/* 5. Rakkan */}
                <div
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    checklist.rakkan
                      ? 'bg-[#FEF2F2]/85 border-crimson/50'
                      : 'bg-white/60 border-white/80 hover:border-crimson/35'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sumi font-jp">
                      5. Rakkan &amp; Cap (落款)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCheck('rakkan')}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      checklist.rakkan
                        ? 'bg-crimson text-white shadow-sm'
                        : 'border-2 border-sumi/25 bg-white/80 hover:border-crimson'
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
            <div className="space-y-3 bg-white/60 p-3.5 rounded-xl border border-white/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sumi">Foto Fisik Hasil Kuas Hanshi</span>
                {uploadedPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPhoto(null);
                      setPhotoFileName('');
                    }}
                    className="text-xs text-crimson hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>

              {uploadedPhoto ? (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/80 bg-white/80 shadow-sm">
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
                <div className="p-4 border-2 border-dashed border-sumi/20 rounded-xl text-center space-y-1 bg-white/40">
                  <Camera className="w-6 h-6 text-sumi-muted mx-auto" />
                  <p className="text-[11px] text-sumi-charcoal">
                    Belum ada foto yang diambil. Gunakan tombol kamera di bawah untuk merekam karya hari ini.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SECTION UNGGAH KARYA & LEMBAR COUNTER (TERINTEGRASI DI BAWAH) */}
          <div className="space-y-2.5 pt-2.5 border-t border-sumi/10">
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
            <div className="bg-white/60 rounded-xl p-2.5 border border-white/80 flex items-center justify-between text-xs font-bold">
              <span className="text-sumi-charcoal">Jumlah Lembar Selesai Hari Ini:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSheetCount((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded-lg bg-white/85 border border-sumi/15 hover:bg-white text-sumi flex items-center justify-center font-black transition-colors"
                  title="Kurangi Lembar"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 py-0.5 bg-white/85 border border-sumi/15 rounded-lg text-crimson font-black text-xs min-w-[65px] text-center">
                  [ {sheetCount} Lembar ]
                </span>
                <button
                  type="button"
                  onClick={() => setSheetCount((prev) => prev + 1)}
                  className="w-6 h-6 rounded-lg bg-white/85 border border-sumi/15 hover:bg-white text-sumi flex items-center justify-center font-black transition-colors"
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
                  : 'bg-[#991B1B] hover:bg-[#7F1D1D] text-white active:scale-[0.98]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isCompleted
                  ? 'SESI SHODOU BERHASIL TERSIMPAN'
                  : 'SELESAIKAN SESI LATIHAN MANDIRI'}
              </span>
            </button>
          </div>
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
