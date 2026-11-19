'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users,
  Award,
  Clock,
  AlertTriangle,
  Search,
  ArrowUpDown,
  ChevronRight,
  CheckCircle2,
  Play,
  Pause,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Send,
  Radio,
  Filter,
} from 'lucide-react';
import { CompetitionCategory } from '@/types';
import {
  INITIAL_STUDENT_HUB_DATA,
  INITIAL_PENDING_REVIEWS,
  INITIAL_LIVE_FEED_ITEMS,
  StudentHubProfile,
  PendingReviewItem,
  SenseiLiveFeedItem,
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
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    kanji: string;
    studentName: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // 2. AUDIO PLAYBACK SIMULATION
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
          if (prev >= 89) {
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
        if (attentionFilterActive && !s.needsAttention) return false;
        if (categoryFilter !== 'all' && s.focusCategory !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return s.name.toLowerCase().includes(q) || s.nisn.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'score') {
          const scoreA = a.numericScore ?? (a.readiness === 'Siap Lomba' ? 85 : 60);
          const scoreB = b.numericScore ?? (b.readiness === 'Siap Lomba' ? 85 : 60);
          return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
        }
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
  const pendingCount = pendingReviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Alert */}
      {feedbackSentToast && (
        <div className="fixed top-4 right-4 z-50 bg-sumi text-white px-4 py-2.5 rounded-2xl shadow-xl border border-sumi-border flex items-center gap-2.5 text-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedbackSentToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN GREETING HEADER                                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-sumi tracking-tight">
            Selamat datang, Nurul Hidayati Sensei
          </h1>
          <p className="text-xs sm:text-sm text-sumi-charcoal mt-0.5">
            Pantau progres kontingen 6 cabang lomba dan verifikasi karya siswa secara terstruktur.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-white border border-sumi-border/80 text-[11px] font-semibold text-sumi-charcoal shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Supabase Realtime Aktif</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP BENTO ROW: 2x2 KPI GRID (COL 5) + SENSEI INBOX & FEED (COL 7)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SISI KIRI: 2x2 BENTO KPI CONTAINER (Col 5/12) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sumi-border/80 shadow-2xs p-4 sm:p-5 grid grid-cols-2 gap-3.5">
          {/* KPI 1 (Featured Crimson Card): Rerata Skor Tim */}
          <div className="rounded-2xl bg-crimson text-white p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">Rerata Skor Tim</span>
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {avgTeamScore} <span className="text-xs font-bold text-white/80">Pts</span>
              </div>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
                Kanji • CC • Kikikakitori
              </span>
            </div>
          </div>

          {/* KPI 2: Siswa Aktif Binaan */}
          <div className="rounded-2xl bg-[#FAF7F2] border border-sumi-border/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sumi-charcoal">Siswa Binaan</span>
              <span className="w-8 h-8 rounded-full bg-white border border-sumi-border/70 flex items-center justify-center text-sumi-charcoal">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-sumi tracking-tight">
                {totalStudents} <span className="text-xs font-bold text-sumi-charcoal">Siswa</span>
              </div>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-white border border-sumi-border/60 text-[10px] font-semibold text-sumi-charcoal">
                2 N5 • 4 N4
              </span>
            </div>
          </div>

          {/* KPI 3: Sesi Mandiri */}
          <div className="rounded-2xl bg-[#FAF7F2] border border-sumi-border/60 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sumi-charcoal">Sesi Mandiri</span>
              <span className="w-8 h-8 rounded-full bg-white border border-sumi-border/70 flex items-center justify-center text-emerald-700">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-sumi tracking-tight">
                11 <span className="text-xs font-bold text-sumi-charcoal">Sesi</span>
              </div>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                Pekan ini
              </span>
            </div>
          </div>

          {/* KPI 4 (Quick Filter): Perlu Intervensi */}
          <button
            type="button"
            onClick={() => setAttentionFilterActive(!attentionFilterActive)}
            className={`rounded-2xl p-4 flex flex-col justify-between text-left transition-all border ${
              attentionFilterActive
                ? 'bg-rose-50 border-crimson ring-2 ring-crimson/25'
                : 'bg-[#FAF7F2] border-sumi-border/60 hover:border-crimson/40'
            }`}
            title="Klik untuk menyaring siswa yang butuh intervensi khusus"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-semibold text-crimson">Perlu Intervensi</span>
              <span className="w-8 h-8 rounded-full bg-rose-100 text-crimson flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-crimson tracking-tight">
                {attentionCount} <span className="text-xs font-bold">Siswa</span>
              </div>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-rose-100/80 text-crimson text-[10px] font-semibold">
                {attentionFilterActive ? 'Filter Aktif' : 'Skor < 70 / Pending'}
              </span>
            </div>
          </button>
        </div>

        {/* SISI KANAN: SENSEI INBOX & LIVE FEED (Col 7/12) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sumi-border/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
          {/* Header with Clean Pill Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-sumi">
                Sensei Inbox & Aktivitas
              </h2>
              <p className="text-xs text-sumi-muted">
                Verifikasi rekaman dan karya siswa dalam satu tempat.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-sumi-border/70 text-xs">
              <button
                type="button"
                onClick={() => setActiveInboxTab('pending')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  activeInboxTab === 'pending'
                    ? 'bg-crimson text-white shadow-2xs'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                <span>Perlu Dinilai</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeInboxTab === 'pending'
                      ? 'bg-white text-crimson'
                      : 'bg-crimson/10 text-crimson'
                  }`}
                >
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInboxTab('feed')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  activeInboxTab === 'feed'
                    ? 'bg-crimson text-white shadow-2xs'
                    : 'text-sumi-charcoal hover:text-sumi'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>Live Feed</span>
              </button>
            </div>
          </div>

          {/* TAB 1: PERLU DINILAI */}
          {activeInboxTab === 'pending' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingReviews.map((item) => {
                const isPlaying = playingAudioId === item.id;
                const isVerified = item.status === 'verified';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      isVerified
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-[#FAF7F2]/70 border-sumi-border/70 hover:border-crimson/35'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-full bg-crimson text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {item.studentAvatar}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-sumi truncate">
                              {item.studentName}
                            </div>
                            <div className="text-[11px] text-sumi-muted truncate">
                              {item.categoryLabel} • {item.title}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-sumi-muted whitespace-nowrap">
                          {item.timeAgo}
                        </span>
                      </div>

                      {item.type === 'audio' && (
                        <div className="bg-white p-3 rounded-xl border border-sumi-border/70 space-y-2.5">
                          <div className="flex items-center justify-between gap-1 h-6 px-1">
                            {item.waveformSeed?.map((val, idx) => {
                              const activeColor = isPlaying
                                ? idx % 2 === 0
                                  ? 'bg-crimson'
                                  : 'bg-rose-400'
                                : 'bg-sumi-charcoal/25';
                              const heightPct = isPlaying
                                ? Math.min(100, Math.max(20, val + ((audioProgress * 7) % 50)))
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
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(item.id)}
                              className={`py-1.5 px-3 rounded-full font-semibold text-[11px] flex items-center gap-1.5 transition-all ${
                                isPlaying
                                  ? 'bg-sumi text-white'
                                  : 'bg-crimson hover:bg-crimson-dark text-white'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="w-3 h-3 fill-current" />
                                  <span>{formatPlaybackTime(audioProgress)} / {item.duration}</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Putar ({item.duration})</span>
                                </>
                              )}
                            </button>
                            <span className="text-[10px] text-sumi-muted">WAV 48kHz</span>
                          </div>
                        </div>
                      )}

                      {item.type === 'photo' && (
                        <div className="bg-white p-3 rounded-xl border border-sumi-border/70 flex items-center gap-3">
                          <div className="w-12 h-14 flex-shrink-0">
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
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="font-semibold text-xs text-sumi truncate">
                              Karya Hanshi Mandiri
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium truncate">
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
                              className="text-[11px] text-crimson font-semibold hover:underline"
                            >
                              Buka Lightbox →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="space-y-2">
                      {isVerified ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 pt-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Terverifikasi Sah</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleVerifySubmission(item.id)}
                            className="flex-1 py-1.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all"
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
                            className="py-1.5 px-3 rounded-full bg-white hover:bg-[#FAF7F2] text-sumi font-semibold text-[11px] flex items-center gap-1.5 border border-sumi-border transition-colors"
                          >
                            <MessageSquare className="w-3 h-3 text-crimson" />
                            <span>Catatan</span>
                          </button>
                        </div>
                      )}

                      {activeFeedbackInputId === item.id && (
                        <div className="pt-2 border-t border-sumi-border/60 space-y-2">
                          <textarea
                            rows={2}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder={`Tulis umpan balik untuk ${item.studentName}...`}
                            className="w-full p-2.5 rounded-xl border border-sumi-border text-xs focus:outline-none focus:border-crimson resize-none bg-white"
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
                              className="px-3 py-1 bg-crimson hover:bg-crimson-dark text-white font-semibold rounded-full text-xs flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: LIVE FEED */}
          {activeInboxTab === 'feed' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sumi-charcoal font-medium">
                  Aktivitas mandiri kontingen terkini
                </span>
                <button
                  type="button"
                  onClick={handleSimulateRealtimeStudentActivity}
                  className="text-[11px] font-semibold text-crimson hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>+ Simulasikan Aktivitas</span>
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {liveFeed.map((feed) => (
                  <div
                    key={feed.id}
                    className="p-3 rounded-2xl bg-[#FAF7F2]/80 border border-sumi-border/60 flex items-center gap-3 text-xs"
                  >
                    <span className="w-7 h-7 rounded-full bg-crimson text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {feed.studentAvatar}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sumi truncate">
                          {feed.studentName}{' '}
                          <span className="font-medium text-sumi-muted">({feed.categoryLabel})</span>
                        </span>
                        <span className="text-[11px] text-sumi-muted whitespace-nowrap">
                          {feed.timeAgo}
                        </span>
                      </div>
                      <p className="text-sumi-charcoal text-[11px] truncate mt-0.5">
                        {feed.actionText}{' '}
                        {feed.scoreText && (
                          <strong className="text-crimson font-bold">({feed.scoreText})</strong>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL-WIDTH CLEAN MATRIKS PROGRES SISWA (FINEXY-STYLE TABLE)            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-sumi-border/80 shadow-2xs p-5 sm:p-6 space-y-4">
        {/* Single Clean Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-sumi">
              Matriks Progres Siswa
            </h2>
            <p className="text-xs text-sumi-muted">
              Klik baris siswa untuk membuka detail grafik perkembangan personal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Pill Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-sumi-muted absolute left-3.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa atau NISN..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FAF7F2] border border-sumi-border/70 text-xs text-sumi placeholder:text-sumi-muted focus:outline-none focus:border-crimson"
              />
            </div>

            {/* Compact Branch Filter Dropdown */}
            <div className="relative inline-flex items-center">
              <Filter className="w-3.5 h-3.5 text-sumi-charcoal absolute left-3 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter cabang lomba"
                className="pl-8 pr-7 py-2 rounded-full bg-[#FAF7F2] border border-sumi-border/70 text-xs font-semibold text-sumi focus:outline-none focus:border-crimson cursor-pointer"
              >
                <option value="all">Semua Cabang</option>
                <option value="kanji">Kanji</option>
                <option value="cerdas_cermat">Cerdas Cermat</option>
                <option value="kikikakitori">Kikikakitori</option>
                <option value="rodoku">Rodoku</option>
                <option value="seiyu">Seiyu</option>
                <option value="shodou">Shodou</option>
              </select>
            </div>

            {/* Clean Sort Toggle */}
            <button
              type="button"
              onClick={() => {
                setSortField('score');
                setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
              }}
              className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-crimson-tint/50 border border-sumi-border/70 text-xs font-semibold text-sumi flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-crimson" />
              <span>Urut Skor ({sortDirection === 'desc' ? 'Tertinggi' : 'Terendah'})</span>
            </button>
          </div>
        </div>

        {/* Clean Spacious Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] text-sumi-charcoal text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 pl-4 pr-3 rounded-l-xl">Siswa</th>
                <th className="py-3 px-3">Cabang Fokus</th>
                <th className="py-3 px-3">Sesi Selesai</th>
                <th className="py-3 px-3">Rerata Skor / Karya</th>
                <th className="py-3 px-3">Kesiapan</th>
                <th className="py-3 pl-3 pr-4 text-right rounded-r-xl">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sumi-border/50 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-xs text-sumi-muted italic">
                    Tidak ada siswa yang sesuai dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const readinessDot =
                    student.readiness === 'Siap Lomba'
                      ? 'bg-emerald-500'
                      : student.readiness === 'Berkembang'
                      ? 'bg-amber-500'
                      : 'bg-crimson';

                  const readinessText =
                    student.readiness === 'Siap Lomba'
                      ? 'text-emerald-700'
                      : student.readiness === 'Berkembang'
                      ? 'text-amber-700'
                      : 'text-crimson';

                  return (
                    <tr
                      key={student.id}
                      onClick={() => handleOpenDrawer(student)}
                      className="hover:bg-[#FAF7F2]/70 transition-colors cursor-pointer group"
                    >
                      {/* Siswa */}
                      <td className="py-3.5 pl-4 pr-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-crimson text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {student.avatar}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-sumi group-hover:text-crimson transition-colors flex items-center gap-1.5">
                              <span>{student.name}</span>
                              {student.needsAttention && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-crimson flex-shrink-0"
                                  title="Butuh perhatian"
                                />
                              )}
                            </div>
                            <div className="text-[11px] text-sumi-muted font-mono">
                              NISN {student.nisn}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cabang Fokus */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-sumi">{student.focusCategoryName}</span>{' '}
                        <span className="text-[11px] text-sumi-muted font-jp">
                          ({student.focusCategoryKanji})
                        </span>
                      </td>

                      {/* Sesi Selesai */}
                      <td className="py-3.5 px-3 font-medium text-sumi-charcoal whitespace-nowrap">
                        {student.sessionsCompletedText}
                      </td>

                      {/* Rerata Skor / Karya */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {student.isQuiz && student.numericScore !== null ? (
                          <span
                            className={`font-extrabold text-sm ${
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
                          <span className="text-[11px] font-medium text-sumi-charcoal bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-sumi-border/60">
                            {student.metricStatusText}
                          </span>
                        )}
                      </td>

                      {/* Kesiapan (Clean Dot Indicator) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 font-semibold ${readinessText}`}>
                          <span className={`w-2 h-2 rounded-full ${readinessDot}`} />
                          <span>{student.readiness}</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 pl-3 pr-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(student);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAF7F2] group-hover:bg-crimson group-hover:text-white text-sumi font-semibold text-[11px] transition-all"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3.5 h-3.5" />
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

      {/* ========================================================================= */}
      {/* 4. SLIDE-OVER DRAWER & LIGHTBOX MODAL                                     */}
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
