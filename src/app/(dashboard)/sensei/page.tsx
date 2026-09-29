'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Award, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  ChevronRight, 
  Activity, 
  Filter,
  CheckCircle2,
  BookOpen,
  Mic,
  PenTool,
  Play,
  Pause,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Check,
  Send,
  Radio,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { CompetitionCategory, ReadinessStatus } from '@/types';
import { 
  INITIAL_STUDENT_HUB_DATA, 
  INITIAL_PENDING_REVIEWS, 
  INITIAL_LIVE_FEED_ITEMS,
  StudentHubProfile,
  PendingReviewItem,
  SenseiLiveFeedItem
} from '@/lib/data/senseiHubData';
import { StudentDrilldownDrawer } from '@/components/sensei/StudentDrilldownDrawer';
import { CalligraphyLightboxModal } from '@/components/sensei/CalligraphyLightboxModal';
import { HanshiPreview } from '@/components/sensei/HanshiPreview';

export default function SenseiMissionControlPage() {
  // ---------------------------------------------------------------------------
  // 1. DATA STATE & REAL-TIME EMULATION
  // ---------------------------------------------------------------------------
  const [studentsData, setStudentsData] = useState<StudentHubProfile[]>(INITIAL_STUDENT_HUB_DATA);
  const [pendingReviews, setPendingReviews] = useState<PendingReviewItem[]>(INITIAL_PENDING_REVIEWS);
  const [liveFeed, setLiveFeed] = useState<SenseiLiveFeedItem[]>(INITIAL_LIVE_FEED_ITEMS);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'score' | 'activity'>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [attentionFilterActive, setAttentionFilterActive] = useState<boolean>(false);

  // Sensei Inbox Tabs & Audio Playback State
  const [activeInboxTab, setActiveInboxTab] = useState<'pending' | 'feed'>('pending');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inline Feedback Comment Expansion
  const [activeFeedbackInputId, setActiveFeedbackInputId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSentToast, setFeedbackSentToast] = useState<string | null>(null);

  // Drawer & Lightbox State
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<StudentHubProfile | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; kanji: string; studentName: string } | null>(null);

  // ---------------------------------------------------------------------------
  // 2. AUDIO PLAYBACK SIMULATION (ANTI-CRASH & REALISTIC TIMER)
  // ---------------------------------------------------------------------------
  const togglePlayAudio = (itemId: string) => {
    if (playingAudioId === itemId) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(null);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setPlayingAudioId(itemId);
      setAudioProgress(0);

      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 89) { // 89 seconds = 01:29
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            setPlayingAudioId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  const formatPlaybackTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ---------------------------------------------------------------------------
  // 3. ACTIONS: 1-CLICK VERIFICATION & SENSEI FEEDBACK
  // ---------------------------------------------------------------------------
  const handleVerifySubmission = (id: string, customMessage?: string) => {
    setPendingReviews((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'verified', isVerified: true } : item
      )
    );

    const verifiedItem = pendingReviews.find((i) => i.id === id);
    const msg = customMessage || `Verifikasi sah dicatat untuk ${verifiedItem?.studentName || 'siswa'}.`;
    setFeedbackSentToast(msg);
    setTimeout(() => setFeedbackSentToast(null), 3000);

    // Add event to live feed optimistically
    if (verifiedItem) {
      const newFeed: SenseiLiveFeedItem = {
        id: `feed-auto-${Date.now()}`,
        studentName: verifiedItem.studentName,
        studentAvatar: verifiedItem.studentAvatar,
        category: verifiedItem.category,
        categoryLabel: verifiedItem.categoryLabel,
        actionText: `Karya disetujui Sensei Nurul: ${verifiedItem.title}`,
        timeAgo: 'Baru saja',
        timestamp: new Date().toISOString(),
      };
      setLiveFeed((prev) => [newFeed, ...prev]);
    }
  };

  const handleSendFeedbackNote = (id: string) => {
    if (!feedbackText.trim()) return;

    setPendingReviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, feedbackNotes: feedbackText, status: 'verified' }
          : item
      )
    );

    setActiveFeedbackInputId(null);
    setFeedbackText('');
    setFeedbackSentToast('Catatan pembinaan berhasil dikirim ke dashboard siswa.');
    setTimeout(() => setFeedbackSentToast(null), 3000);
  };

  const handleSimulateRealtimeStudentActivity = () => {
    const randomStudents = [
      { name: 'Budi Santoso', avatar: 'B', cat: 'kanji' as CompetitionCategory, label: 'Kanji', act: 'Menyelesaikan Simulasi Radikal Bushu', score: '95 Pts' },
      { name: 'Siti Rahma', avatar: 'S', cat: 'rodoku' as CompetitionCategory, label: 'Rodoku', act: 'Mengunggah rekaman Take 3 (01:28)', score: undefined },
      { name: 'Ahmad Zaki', avatar: 'A', cat: 'cerdas_cermat' as CompetitionCategory, label: 'CC', act: 'Mengerjakan Rapid Blitz 15 Detik', score: '90 Pts' },
      { name: 'Dewi Lestari', avatar: 'D', cat: 'shodou' as CompetitionCategory, label: 'Shodou', act: 'Mengirimkan foto lembar kanji 『夢』', score: undefined },
    ];
    const picked = randomStudents[Math.floor(Math.random() * randomStudents.length)];

    const newItem: SenseiLiveFeedItem = {
      id: `sim-${Date.now()}`,
      studentName: picked.name,
      studentAvatar: picked.avatar,
      category: picked.cat,
      categoryLabel: picked.label,
      actionText: picked.act,
      scoreText: picked.score,
      timeAgo: 'Baru saja',
      timestamp: new Date().toISOString(),
    };

    setLiveFeed((prev) => [newItem, ...prev.slice(0, 8)]);
    setFeedbackSentToast(`Sinyal Supabase Realtime diterima: ${picked.name} baru saja aktif.`);
    setTimeout(() => setFeedbackSentToast(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // 4. FILTERING & SORTING LOGIC
  // ---------------------------------------------------------------------------
  const filteredStudents = useMemo(() => {
    return studentsData
      .filter((s) => {
        // Quick Attention Filter
        if (attentionFilterActive && !s.needsAttention) {
          return false;
        }

        // Category Filter
        if (categoryFilter !== 'all' && s.focusCategory !== categoryFilter) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = s.name.toLowerCase().includes(q);
          const matchNisn = s.nisn.includes(q);
          return matchName || matchNisn;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'score') {
          const scoreA = a.numericScore ?? (a.readiness === 'Siap Lomba' ? 85 : 60);
          const scoreB = b.numericScore ?? (b.readiness === 'Siap Lomba' ? 85 : 60);
          return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        }
        // Activity default order
        return 0;
      });
  }, [studentsData, attentionFilterActive, categoryFilter, searchQuery, sortField, sortDirection]);

  const handleOpenDrawer = (student: StudentHubProfile) => {
    setSelectedStudentForDrawer(student);
    setIsDrawerOpen(true);
  };

  const handleSaveNotesFromDrawer = (studentId: string, notes: string) => {
    setStudentsData((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, notes } : s))
    );
  };

  // KPI Calculations
  const totalStudents = studentsData.length;
  const avgTeamScore = 78.7;
  const attentionCount = studentsData.filter((s) => s.needsAttention).length;

  return (
    <div className="space-y-5 pb-12">
      {/* Toast Notification Alert */}
      {feedbackSentToast && (
        <div className="fixed top-4 right-4 z-50 bg-sumi text-white px-4 py-2.5 rounded-2xl shadow-xl border border-sumi-border flex items-center gap-2.5 text-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedbackSentToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP KPI CARDS (COMPACT METRICS BAR - 4 HORIZONTAL CARDS)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Siswa Aktif Binaan */}
        <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs flex items-center justify-between hover:border-sumi-charcoal/30 transition-all">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal block mb-0.5">
              Siswa Aktif Binaan
            </span>
            <div className="text-2xl font-black text-sumi">
              {totalStudents} <span className="text-xs font-bold text-sumi-charcoal">Siswa</span>
            </div>
            <span className="text-[10px] text-sumi-muted font-medium mt-0.5 block">
              (MAN 1 Pasuruan) | 2 Siswa (N5) | 4 Siswa (N4)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Rerata Skor Tim */}
        <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs flex items-center justify-between hover:border-amber-400/40 transition-all">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal block mb-0.5">
              Rerata Skor Tim
            </span>
            <div className="text-2xl font-black text-crimson flex items-baseline gap-1">
              <span>{avgTeamScore}</span>
              <span className="text-xs font-bold text-sumi-charcoal">Pts</span>
            </div>
            <span className="text-[10px] text-sumi-muted font-medium mt-0.5 block">
              (Agregasi Kanji, CC, Kikikakitori)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Sesi Mandiri Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-sumi-border shadow-xs flex items-center justify-between hover:border-emerald-400/40 transition-all">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-sumi-charcoal block mb-0.5">
              Sesi Mandiri Selesai
            </span>
            <div className="text-2xl font-black text-sumi">
              11 <span className="text-xs font-bold text-emerald-700">Sesi (Pekan Ini)</span>
            </div>
            <span className="text-[10px] text-sumi-muted font-medium mt-0.5 block">
              12x Latihan Rekaman & Lembar Kaligrafi
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Perlu Perhatian / Intervensi Khusus (Quick Filter Trigger) */}
        <button
          type="button"
          onClick={() => setAttentionFilterActive(!attentionFilterActive)}
          className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between text-left transition-all ${
            attentionFilterActive
              ? 'bg-rose-50/70 border-crimson ring-2 ring-crimson/30 shadow-md'
              : 'bg-white border-sumi-border hover:border-crimson/50'
          }`}
          title="Klik untuk menyaring siswa yang butuh intervensi khusus"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-crimson block">
                Perlu Perhatian / Intervensi
              </span>
              {attentionFilterActive && (
                <span className="text-[9px] font-black bg-crimson text-white px-1.5 rounded uppercase">
                  Aktif
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-crimson">
              {attentionCount} <span className="text-xs font-bold text-crimson">Siswa</span>
            </div>
            <span className="text-[10px] text-crimson/80 font-medium mt-0.5 block">
              Skor &lt; 70 atau Menunggu Verifikasi
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-crimson flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN WORKBENCH: MATRIKS SISWA (COL 7) : SENSEI INBOX (COL 5)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* SISI KIRI: MATRIKS PERKEMBANGAN SISWA ADAPTIF (Col 7/12)                */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-sumi-border shadow-xs p-4 sm:p-5 space-y-3.5">
          {/* Header & Subtitle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-sumi-border/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-crimson rounded-full" />
                <h3 className="text-xs sm:text-sm font-black text-sumi uppercase tracking-wider">
                  MATRIKS PEMANTAUAN PROGRES SISWA
                </h3>
              </div>
              <p className="text-[11px] text-sumi-charcoal mt-0.5">
                Klik nama siswa untuk melihat drill-down grafik perkembangan personal.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-sumi-muted absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa / NISN..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-sumi-border text-xs focus:outline-none focus:border-crimson bg-[#FAF7F2]/40"
              />
            </div>
          </div>

          {/* Toolbar: Segmented Category Buttons + Sorting Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
              <span className="text-[11px] font-bold text-sumi-muted uppercase mr-1 flex items-center gap-1 flex-shrink-0">
                <SlidersHorizontal className="w-3 h-3 text-crimson" />
                <span>Fokus:</span>
              </span>

              {[
                { key: 'all', label: 'Semua' },
                { key: 'kanji', label: 'Kanji' },
                { key: 'cerdas_cermat', label: 'Cerdas Cermat' },
                { key: 'kikikakitori', label: 'Kikikakitori' },
                { key: 'rodoku', label: 'Rodoku' },
                { key: 'seiyu', label: 'Seiyu' },
                { key: 'shodou', label: 'Shodou' },
              ].map((cat) => {
                const isActive = categoryFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-crimson text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-sumi-charcoal hover:bg-white hover:text-sumi border border-sumi-border/70'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Toggles */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSortField('score');
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                  sortField === 'score'
                    ? 'bg-crimson-tint border-crimson text-crimson'
                    : 'border-sumi-border bg-white text-sumi-charcoal hover:bg-[#FAF7F2]'
                }`}
              >
                <span>Skor</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSortField('activity');
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                  sortField === 'activity'
                    ? 'bg-crimson-tint border-crimson text-crimson'
                    : 'border-sumi-border bg-white text-sumi-charcoal hover:bg-[#FAF7F2]'
                }`}
              >
                <span>Keaktifan</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Adaptive Multi-Branch Table */}
          <div className="overflow-x-auto rounded-xl border border-sumi-border/80">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-sumi-border text-sumi-charcoal font-black uppercase text-[9px] sm:text-[10px] tracking-wider whitespace-nowrap">
                  <th className="py-2.5 pl-3 pr-1.5">NAMA SISWA & NISN</th>
                  <th className="py-2.5 px-1.5">CABANG FOKUS</th>
                  <th className="py-2.5 px-1.5 text-center">SESI SELESAI</th>
                  <th className="py-2.5 px-1.5 text-right">RERATA SKOR / KARYA</th>
                  <th className="py-2.5 px-1.5 text-center">KESIAPAN</th>
                  <th className="py-2.5 pl-1.5 pr-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sumi-border/70">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-sumi-muted italic bg-white">
                      Tidak ada siswa yang sesuai dengan kriteria filter saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    return (
                      <tr
                        key={student.id}
                        onClick={() => handleOpenDrawer(student)}
                        className="hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer group"
                      >
                        {/* Nama & NISN */}
                        <td className="py-2 pl-3 pr-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-[11px] shadow-xs flex-shrink-0">
                              {student.avatar}
                            </span>
                            <div className="min-w-0">
                              <div className="font-bold text-sumi group-hover:text-crimson transition-colors flex items-center gap-1">
                                <span className="truncate">{student.name}</span>
                                {student.needsAttention && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0" title="Butuh perhatian" />
                                )}
                              </div>
                              <div className="text-[9px] text-sumi-muted font-mono truncate">
                                NISN: {student.nisn}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cabang Fokus */}
                        <td className="py-2 px-1.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-sumi">
                            <span>{student.focusCategoryName}</span>
                            <span className="text-[9px] text-sumi-muted font-jp">
                              ({student.focusCategoryKanji})
                            </span>
                          </span>
                        </td>

                        {/* Sesi / Tugas Selesai */}
                        <td className="py-2 px-1.5 text-center font-bold text-sumi whitespace-nowrap">
                          {student.sessionsCompletedText}
                        </td>

                        {/* Rerata Skor / Status Karya (Adaptif) */}
                        <td className="py-2 px-1.5 text-right whitespace-nowrap">
                          {student.isQuiz && student.numericScore !== null ? (
                            <span
                              className={`font-black text-xs ${
                                student.numericScore >= 80
                                  ? 'text-crimson'
                                  : student.numericScore >= 70
                                  ? 'text-sumi'
                                  : 'text-amber-600'
                              }`}
                            >
                              {student.metricStatusText}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-sumi-charcoal bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-sumi-border/60 inline-block">
                              {student.metricStatusText}
                            </span>
                          )}
                        </td>

                        {/* Status Kesiapan */}
                        <td className="py-2 px-1.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap ${
                              student.readiness === 'Siap Lomba'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : student.readiness === 'Berkembang'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {student.readiness}
                          </span>
                        </td>

                        {/* Aksi Cepat Drill-Down */}
                        <td className="py-2 pl-1.5 pr-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(student);
                            }}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white hover:bg-crimson hover:text-white text-sumi-charcoal font-bold text-[10px] border border-sumi-border transition-all shadow-xs whitespace-nowrap"
                          >
                            <span>Drill-Down</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SISI KANAN: SENSEI INBOX & LIVE FEED (Col 5/12)                         */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: SENSEI INBOX & FEED */}
          <div className="bg-white rounded-2xl border border-sumi-border shadow-xs p-4 sm:p-5 space-y-3.5">
            {/* Header with Switcher Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-sumi-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" />
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-sumi uppercase">
                  SENSEI INBOX & FEED
                </h3>
              </div>

              {/* Segmented Tab Controls */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-sumi-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveInboxTab('pending')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeInboxTab === 'pending'
                      ? 'bg-crimson text-white shadow-xs'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  <span>🔔 Perlu Dinilai</span>
                  <span className="text-[10px] bg-white text-crimson px-1.5 py-0.2 rounded-full font-black">
                    {pendingReviews.filter((r) => r.status === 'pending').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInboxTab('feed')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    activeInboxTab === 'feed'
                      ? 'bg-crimson text-white shadow-xs'
                      : 'text-sumi-charcoal hover:text-sumi'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>Live Feed</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PERLU DINILAI / PENDING REVIEW */}
            {activeInboxTab === 'pending' && (
              <div className="space-y-3">
                {pendingReviews.map((item) => {
                  const isPlaying = playingAudioId === item.id;
                  const isVerified = item.status === 'verified';

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                        isVerified
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-[#FAF7F2] border-sumi-border hover:border-crimson/40'
                      }`}
                    >
                      {/* Top item info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-crimson text-white font-black text-xs flex items-center justify-center">
                            {item.studentAvatar}
                          </span>
                          <div>
                            <span className="font-bold text-xs text-sumi block leading-tight">
                              {item.categoryLabel} — {item.studentName}
                            </span>
                            <span className="text-[10px] text-sumi-muted">
                              {item.title}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-sumi-muted bg-white px-2 py-0.5 rounded border border-sumi-border/60">
                          {item.timeAgo}
                        </span>
                      </div>

                      {/* AUDIO ITEM (RODOKU / SEIYU) */}
                      {item.type === 'audio' && (
                        <div className="bg-white p-3 rounded-xl border border-sumi-border space-y-2">
                          {/* Mini Audio Waveform Simulation */}
                          <div className="flex items-center justify-between gap-1 h-7 px-1">
                            {item.waveformSeed?.map((val, idx) => {
                              const activeColor = isPlaying
                                ? (idx % 2 === 0 ? 'bg-crimson' : 'bg-rose-400')
                                : 'bg-sumi-charcoal/30';
                              const heightPct = isPlaying
                                ? Math.min(100, Math.max(20, (val + (audioProgress * 7) % 50)))
                                : val;

                              return (
                                <span
                                  key={idx}
                                  className={`w-1 rounded-full transition-all duration-200 ${activeColor}`}
                                  style={{ height: `${heightPct}%` }}
                                />
                              );
                            })}
                          </div>

                          {/* Interactive Play Button */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(item.id)}
                              className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                                isPlaying
                                  ? 'bg-sumi text-white hover:bg-black'
                                  : 'bg-crimson hover:bg-crimson-dark text-white'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span>Jeda Suara ({formatPlaybackTime(audioProgress)} / {item.duration})</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Putar Suara Ujian ({item.duration})</span>
                                </>
                              )}
                            </button>

                            <span className="text-[10px] font-mono text-sumi-muted">
                              Audio WAV 48kHz
                            </span>
                          </div>
                        </div>
                      )}

                      {/* PHOTO ITEM (SHODOU) */}
                      {item.type === 'photo' && (
                        <div className="bg-white p-3 rounded-xl border border-sumi-border flex items-center gap-3">
                          {/* Calligraphy Thumbnail Preview */}
                          <div className="w-14 h-16 flex-shrink-0">
                            <HanshiPreview
                              kanji="道"
                              className="w-full h-full"
                              onClick={() =>
                                setLightboxData({
                                  isOpen: true,
                                  kanji: '道',
                                  studentName: item.studentName,
                                })
                              }
                            />
                          </div>

                          <div className="flex-1 text-xs space-y-1">
                            <div className="font-bold text-sumi">
                              Foto Karya Hanshi Mandiri
                            </div>
                            <div className="text-[11px] text-emerald-700 font-semibold">
                              {item.checklistSummary}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setLightboxData({
                                  isOpen: true,
                                  kanji: '道',
                                  studentName: item.studentName,
                                })
                              }
                              className="text-[10px] text-crimson font-bold hover:underline flex items-center gap-1"
                            >
                              <span>🔍 Buka Lightbox Pemeriksaan</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons: 1-Click Verification & Notes */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        {isVerified ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Sudah Terverifikasi Sah</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleVerifySubmission(item.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all active:scale-98"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Bagus / Lanjut</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setActiveFeedbackInputId(
                                  activeFeedbackInputId === item.id ? null : item.id
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-sumi font-bold text-[11px] flex items-center gap-1 border border-sumi-border transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 text-crimson" />
                              <span>Beri Catatan</span>
                            </button>
                          </div>
                        )}

                        <span className="text-[10px] text-sumi-muted italic">
                          {isVerified ? 'Tersimpan ke Riwayat' : 'Verifikasi 1-Klik'}
                        </span>
                      </div>

                      {/* Expanded Feedback Input */}
                      {activeFeedbackInputId === item.id && (
                        <div className="pt-2 border-t border-sumi-border/60 space-y-2 animate-fade-in">
                          <textarea
                            rows={2}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={`Tulis umpan balik langsung untuk ${item.studentName}...`}
                            className="w-full p-2.5 rounded-xl border border-sumi-border text-xs focus:outline-none focus:border-crimson resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveFeedbackInputId(null)}
                              className="px-2.5 py-1 text-xs text-sumi-muted hover:text-sumi"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendFeedbackNote(item.id)}
                              className="px-3 py-1 bg-crimson hover:bg-crimson-dark text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim Catatan</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: LIVE FEED BELAJAR MANDIRI */}
            {activeInboxTab === 'feed' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] text-sumi-charcoal font-semibold">
                    Aktivitas Mandiri Kontingen Terkini:
                  </span>
                  <button
                    type="button"
                    onClick={handleSimulateRealtimeStudentActivity}
                    className="text-[10px] font-bold text-crimson hover:underline flex items-center gap-1"
                    title="Uji coba sinyal reaktif tanpa reload"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>+ Simulasikan Aktivitas Baru</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {liveFeed.map((feed) => (
                    <div
                      key={feed.id}
                      className="p-2.5 rounded-xl bg-[#FAF7F2] border border-sumi-border/70 flex items-start gap-2.5 text-xs transition-colors hover:bg-white"
                    >
                      <span className="w-6 h-6 rounded-full bg-crimson text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {feed.studentAvatar}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-sumi truncate">
                            {feed.studentName} ({feed.categoryLabel})
                          </span>
                          <span className="text-[10px] text-sumi-muted whitespace-nowrap">
                            {feed.timeAgo}
                          </span>
                        </div>
                        <p className="text-sumi-charcoal text-[11px] leading-snug mt-0.5">
                          {feed.actionText}{' '}
                          {feed.scoreText && (
                            <strong className="text-crimson font-black">
                              ({feed.scoreText})
                            </strong>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Persistent Live Stream Widget (As visible on wireframe bottom-right) */}
          <div className="bg-white rounded-2xl border border-sumi-border shadow-xs p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-sumi-border">
              <h4 className="text-xs font-black tracking-wide text-sumi uppercase">
                LIVE FEED BELAJAR MANDIRI
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>Supabase Live</span>
              </span>
            </div>

            <ul className="space-y-2 text-xs text-sumi-charcoal">
              <li className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span>
                  <strong className="text-sumi">Budi Santoso (CC):</strong> Menyelesaikan Paket Pengetahuan Budaya (80 Pts) - <span className="text-sumi-muted">2 mnt lalu</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span>
                  <strong className="text-sumi">Siti Rahma (Kikikakitori):</strong> Membuka Modul Latihan N4 - <span className="text-sumi-muted">15 mnt lalu</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span>
                  <strong className="text-sumi">Ahmad Zaki (Kanji):</strong> Latihan Kilat N5 (Skor: 100 Pts) - <span className="text-sumi-muted">30 mnt lalu</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-crimson font-bold">•</span>
                <span>
                  <strong className="text-sumi">Dewi Lestari (Shodou):</strong> Menyelesaikan 3 lembar kanji 『道』 - <span className="text-sumi-muted">1 jam lalu</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SLIDE-OVER DRAWER & LIGHTBOX MODAL                                     */}
      {/* ========================================================================= */}
      <StudentDrilldownDrawer
        student={selectedStudentForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaveNotes={handleSaveNotesFromDrawer}
        onOpenLightbox={(data) =>
          setLightboxData({
            isOpen: true,
            kanji: data.kanji,
            studentName: data.studentName,
          })
        }
      />

      <CalligraphyLightboxModal
        isOpen={lightboxData?.isOpen || false}
        onClose={() => setLightboxData(null)}
        kanji={lightboxData?.kanji || '道'}
        studentName={lightboxData?.studentName || 'Dewi Lestari'}
        onVerify={() => {
          handleVerifySubmission('rev-2', 'Lembar kaligrafi hanshi disetujui');
        }}
        isVerified={pendingReviews.find((r) => r.id === 'rev-2')?.status === 'verified'}
      />
    </div>
  );
}
