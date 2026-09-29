import { CompetitionCategory, ReadinessStatus } from '@/types';

export interface StudentHubProfile {
  id: string;
  nisn: string;
  name: string;
  avatar: string;
  focusCategory: CompetitionCategory;
  focusCategoryName: string;
  focusCategoryKanji: string;
  sessionsCompletedText: string;
  metricStatusText: string;
  isQuiz: boolean;
  numericScore: number | null;
  readiness: ReadinessStatus;
  needsAttention: boolean;
  prePostScores: { label: string; score: number }[];
  tasks: {
    id: string;
    title: string;
    scoreText: string;
    isCompleted: boolean;
    isPassed: boolean;
  }[];
  recordings: {
    id: string;
    title: string;
    category: string;
    duration: string;
    timestamp: string;
  }[];
  calligraphySheets?: {
    kanji: string;
    style: string;
    count: number;
    checklistScore: string;
    submittedAt: string;
  };
  notes: string;
}

export interface PendingReviewItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  nisn: string;
  category: CompetitionCategory;
  categoryLabel: string;
  type: 'audio' | 'photo';
  title: string;
  duration?: string;
  waveformSeed?: number[];
  checklistSummary?: string;
  sheetCount?: number;
  submittedAt: string;
  timeAgo: string;
  status: 'pending' | 'verified' | 'revision';
  feedbackNotes?: string;
}

export interface SenseiLiveFeedItem {
  id: string;
  studentName: string;
  studentAvatar: string;
  category: CompetitionCategory;
  categoryLabel: string;
  actionText: string;
  scoreText?: string;
  timeAgo: string;
  timestamp: string;
}

export const INITIAL_STUDENT_HUB_DATA: StudentHubProfile[] = [
  {
    id: "user-budi",
    nisn: "0078319381",
    name: "Budi Santoso",
    avatar: "B",
    focusCategory: "kanji",
    focusCategoryName: "Kanji",
    focusCategoryKanji: "漢字",
    sessionsCompletedText: "6 Sesi",
    metricStatusText: "92",
    isQuiz: true,
    numericScore: 92,
    readiness: "Siap Lomba",
    needsAttention: false,
    prePostScores: [
      { label: "Pre-Test", score: 25 },
      { label: "Sesi 1", score: 45 },
      { label: "Sesi 2", score: 70 },
      { label: "Sesi 3", score: 85 },
      { label: "Post-Test", score: 95 }
    ],
    tasks: [
      { id: "t1", title: "Kanji Kompetisi N4: Cara Baca & Makna", scoreText: "100 Pts (5/5 Soal)", isCompleted: true, isPassed: true },
      { id: "t2", title: "Simulasi Cerdas Cermat Budaya Umum", scoreText: "100 Pts (5/5 Soal)", isCompleted: true, isPassed: true },
      { id: "t3", title: "Drill Yojijukugo & Idiom Konteks N3", scoreText: "75 Pts (3/4 Soal)", isCompleted: true, isPassed: false },
      { id: "t4", title: "Latihan Kecepatan Radikal Bushu", scoreText: "92 Pts (5/5 Soal)", isCompleted: true, isPassed: true },
    ],
    recordings: [
      { id: "rec-b1", title: "Latihan Dikte Kikikakitori Paket 1", category: "Kikikakitori", duration: "01:25", timestamp: "Kemarin, 14:15" },
      { id: "rec-b2", title: "Simulasi Rodoku Paragraf 1", category: "Rodoku", duration: "01:10", timestamp: "25 Sep 2026" }
    ],
    notes: "Siswa memiliki konsistensi tinggi pada kanji dasar & idiom. Fokus penguatan berikutnya adalah hafalan Yojijukugo tingkat N3 dan manajemen waktu.",
  },
  {
    id: "user-zaki",
    nisn: "0081294821",
    name: "Ahmad Zaki",
    avatar: "A",
    focusCategory: "kanji",
    focusCategoryName: "Kanji",
    focusCategoryKanji: "漢字",
    sessionsCompletedText: "2 Sesi",
    metricStatusText: "83.3",
    isQuiz: true,
    numericScore: 83.3,
    readiness: "Siap Lomba",
    needsAttention: false,
    prePostScores: [
      { label: "Pre-Test", score: 35 },
      { label: "Sesi 1", score: 60 },
      { label: "Sesi 2", score: 75 },
      { label: "Post-Test", score: 85 }
    ],
    tasks: [
      { id: "t1", title: "Kanji Kompetisi N4: Cara Baca & Makna", scoreText: "80 Pts (4/5 Soal)", isCompleted: true, isPassed: true },
      { id: "t2", title: "Simulasi Rapid Quiz Geografi & Sejarah", scoreText: "85 Pts (4/5 Soal)", isCompleted: true, isPassed: true },
      { id: "t3", title: "Drill Kanji N5 Dasar", scoreText: "100 Pts (5/5 Soal)", isCompleted: true, isPassed: true },
    ],
    recordings: [
      { id: "rec-z1", title: "Latihan Artikulasi Rodoku", category: "Rodoku", duration: "01:18", timestamp: "2 hari lalu" }
    ],
    notes: "Akurasi kanji sangat solid di N4. Masih sering ragu pada goresan kanji homofon (kanji dengan bunyi mirip).",
  },
  {
    id: "user-dewi",
    nisn: "0083210948",
    name: "Dewi Lestari",
    avatar: "D",
    focusCategory: "shodou",
    focusCategoryName: "Shodou",
    focusCategoryKanji: "書道",
    sessionsCompletedText: "Tugas (3 Lembar)",
    metricStatusText: "3 Lembar | 5/5 Ceklist Mandiri",
    isQuiz: false,
    numericScore: null,
    readiness: "Butuh Bimbingan",
    needsAttention: true, // Needs attention because pending review of physical sheets
    prePostScores: [
      { label: "Pre-Test", score: 40 },
      { label: "Lembar 1", score: 65 },
      { label: "Lembar 2", score: 75 },
      { label: "Post-Test", score: 85 }
    ],
    tasks: [
      { id: "t1", title: "Lembar Hanshi 01: Karakter 『道』", scoreText: "5/5 Ceklist Mandiri", isCompleted: true, isPassed: true },
      { id: "t2", title: "Lembar Hanshi 02: Karakter 『夢』", scoreText: "4/5 Ceklist Mandiri", isCompleted: true, isPassed: true },
      { id: "t3", title: "Uji Keseimbangan Ruang Hanshi", scoreText: "Menunggu Verifikasi", isCompleted: false, isPassed: false },
    ],
    recordings: [],
    calligraphySheets: {
      kanji: "道",
      style: "Kaisho (楷書)",
      count: 3,
      checklistScore: "5/5 Ceklist Mandiri",
      submittedAt: "Hari ini, 09:30"
    },
    notes: "Goresan Tome dan Harai sudah kokoh. Perlu menjaga proporsi bagian Shinnyou (⻌) agar tidak terlalu melebar ke kanan bawah kertas hanshi.",
  },
  {
    id: "user-siti",
    nisn: "0079451203",
    name: "Siti Rahma",
    avatar: "S",
    focusCategory: "rodoku",
    focusCategoryName: "Rodoku",
    focusCategoryKanji: "朗読",
    sessionsCompletedText: "1 Sesi",
    metricStatusText: "Latihan Rekaman (01:10)",
    isQuiz: false,
    numericScore: null,
    readiness: "Butuh Bimbingan",
    needsAttention: true, // Needs attention because audio pending review
    prePostScores: [
      { label: "Pre-Test", score: 50 },
      { label: "Take 1", score: 65 },
      { label: "Take 2", score: 78 },
      { label: "Post-Test", score: 88 }
    ],
    tasks: [
      { id: "t1", title: "Naskah Rodoku: 『手袋を買いに』", scoreText: "Rekaman 01:10 (Take 2)", isCompleted: true, isPassed: true },
      { id: "t2", title: "Latihan Intonasi Paragraf Rubah Kecil", scoreText: "Selesai Evaluasi", isCompleted: true, isPassed: true },
      { id: "t3", title: "Simulasi Ujian Rodoku 2 Menit Penuh", scoreText: "Menunggu Verifikasi", isCompleted: false, isPassed: false },
    ],
    recordings: [
      { id: "rec-s1", title: "Naskah Rodoku 『手袋を買いに』 (Take 2)", category: "Rodoku", duration: "01:29", timestamp: "Hari ini, 10:15" },
      { id: "rec-s2", title: "Latihan Intonasi Babak 1", category: "Rodoku", duration: "01:10", timestamp: "Kemarin" }
    ],
    notes: "Penjiwaan karakter rubah kecil sangat ekspresif. Sensei perlu memastikan jeda napas pada simbol // tidak terburu-buru.",
  },
  {
    id: "user-farhan",
    nisn: "0076239102",
    name: "Farhan Ramadhan",
    avatar: "F",
    focusCategory: "cerdas_cermat",
    focusCategoryName: "Cerdas Cermat",
    focusCategoryKanji: "知識クイズ",
    sessionsCompletedText: "1 Sesi",
    metricStatusText: "40",
    isQuiz: true,
    numericScore: 40,
    readiness: "Butuh Bimbingan",
    needsAttention: true, // Average score 40 < 70, definitely needs intervention!
    prePostScores: [
      { label: "Pre-Test", score: 20 },
      { label: "Sesi 1", score: 35 },
      { label: "Sesi 2", score: 40 },
      { label: "Post-Test", score: 65 }
    ],
    tasks: [
      { id: "t1", title: "Simulasi Cerdas Cermat Budaya Umum", scoreText: "40 Pts (2/5 Soal)", isCompleted: true, isPassed: false },
      { id: "t2", title: "Simulasi Geografi & Sejarah Jepang", scoreText: "Belum Dikerjakan", isCompleted: false, isPassed: false },
      { id: "t3", title: "Rapid Blitz 15 Detik Budaya Pop", scoreText: "Belum Dikerjakan", isCompleted: false, isPassed: false },
    ],
    recordings: [],
    notes: "Perlu bimbingan khusus pada materi sejarah era Meiji hingga Showa dan geografi prefektur Jepang. Rencanakan sesi pendampingan lab tatap muka tambahan.",
  },
  {
    id: "user-rina",
    nisn: "0085491209",
    name: "Rina Fitriani",
    avatar: "R",
    focusCategory: "seiyu",
    focusCategoryName: "Seiyu",
    focusCategoryKanji: "声優",
    sessionsCompletedText: "2 Sesi",
    metricStatusText: "Latihan Rekaman (01:25)",
    isQuiz: false,
    numericScore: null,
    readiness: "Siap Lomba",
    needsAttention: false,
    prePostScores: [
      { label: "Pre-Test", score: 45 },
      { label: "Take 1", score: 70 },
      { label: "Take 2", score: 85 },
      { label: "Post-Test", score: 90 }
    ],
    tasks: [
      { id: "t1", title: "Naskah Sulih Suara Scene 03 『絆の彼方』", scoreText: "Rekaman 01:25 (Take 2)", isCompleted: true, isPassed: true },
      { id: "t2", title: "Latihan Karakter Aoi (Enerjik)", scoreText: "Terverifikasi", isCompleted: true, isPassed: true },
      { id: "t3", title: "Latihan Karakter Kenji (Beban Moral)", scoreText: "Siap Ujian", isCompleted: true, isPassed: true },
    ],
    recordings: [
      { id: "rec-r1", title: "Sulih Suara Scene 03 - Dialog Kenji & Aoi", category: "Seiyu", duration: "01:25", timestamp: "25 Sep 2026" }
    ],
    notes: "Sinkronisasi labial (lip-sync) dengan durasi naskah sangat presisi. Variasi emosi antara antusiasme dan keraguan karakter tertangkap baik.",
  },
];

export const INITIAL_PENDING_REVIEWS: PendingReviewItem[] = [
  {
    id: "rev-1",
    studentId: "user-siti",
    studentName: "Siti Rahma",
    studentAvatar: "S",
    nisn: "0079451203",
    category: "rodoku",
    categoryLabel: "RODOKU (朗読)",
    type: "audio",
    title: "Naskah: 『手袋を買いに』 (Niimi Nankichi)",
    duration: "01:29",
    waveformSeed: [30, 45, 75, 90, 60, 40, 70, 85, 95, 60, 45, 80, 50, 65, 40, 85, 95, 70, 50, 75, 60, 40, 80, 70, 55, 30],
    submittedAt: "2026-09-28T09:15:00Z",
    timeAgo: "25 mnt lalu",
    status: "pending",
  },
  {
    id: "rev-2",
    studentId: "user-dewi",
    studentName: "Dewi Lestari",
    studentAvatar: "D",
    nisn: "0083210948",
    category: "shodou",
    categoryLabel: "SHODOU (書道)",
    type: "photo",
    title: "Lembar Hanshi: Karakter 『道』 (Jalan / Kehidupan)",
    checklistSummary: "5/5 Ceklist Mandiri (Tome, Hane, Harai)",
    sheetCount: 3,
    submittedAt: "2026-09-28T08:45:00Z",
    timeAgo: "1 jam lalu",
    status: "pending",
  },
];

export const INITIAL_LIVE_FEED_ITEMS: SenseiLiveFeedItem[] = [
  {
    id: "feed-1",
    studentName: "Budi Santoso",
    studentAvatar: "B",
    category: "cerdas_cermat",
    categoryLabel: "CC",
    actionText: "Menyelesaikan Paket Pengetahuan Budaya & Kotowaza",
    scoreText: "80 Pts",
    timeAgo: "2 mnt lalu",
    timestamp: "2026-09-28T09:40:00Z",
  },
  {
    id: "feed-2",
    studentName: "Siti Rahma",
    studentAvatar: "S",
    category: "kikikakitori",
    categoryLabel: "Kikikakitori",
    actionText: "Membuka Modul Latihan Dikte N4",
    timeAgo: "15 mnt lalu",
    timestamp: "2026-09-28T09:27:00Z",
  },
  {
    id: "feed-3",
    studentName: "Ahmad Zaki",
    studentAvatar: "A",
    category: "kanji",
    categoryLabel: "Kanji",
    actionText: "Latihan Kilat Pemantapan Kanji N5",
    scoreText: "100 Pts",
    timeAgo: "30 mnt lalu",
    timestamp: "2026-09-28T09:12:00Z",
  },
  {
    id: "feed-4",
    studentName: "Dewi Lestari",
    studentAvatar: "D",
    category: "shodou",
    categoryLabel: "Shodou",
    actionText: "Menyelesaikan 3 lembar kanji 『道』 di meja mandiri",
    timeAgo: "1 jam lalu",
    timestamp: "2026-09-28T08:45:00Z",
  },
  {
    id: "feed-5",
    studentName: "Rina Fitriani",
    studentAvatar: "R",
    category: "seiyu",
    categoryLabel: "Seiyu",
    actionText: "Menyimpan rekaman Take 2 Scene 03 Garis Batas Juara (01:25)",
    timeAgo: "2 jam lalu",
    timestamp: "2026-09-28T07:45:00Z",
  },
];
