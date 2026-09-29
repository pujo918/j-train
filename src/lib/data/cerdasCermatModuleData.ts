import { Question } from '@/types';

export interface CCPackage {
  id: string;
  title: string;
  topicCategory: 'budaya' | 'geografi_sejarah' | 'kotowaza' | 'tata_bahasa';
  categoryLabel: string;
  difficultyLevel: 'Pemula (N5)' | 'Menengah (N4)' | 'Mahir (N3)' | 'Umum';
  durationMinutes: number;
  questionCount: number;
  description: string;
  bestScore?: number;
  bestTimeFormatted?: string;
  isCompleted?: boolean;
}

export const CC_SIMULATION_PACKAGES: CCPackage[] = [
  {
    id: 'set-cc-1',
    title: 'Simulasi 01: Pengetahuan Budaya & Kotowaza',
    topicCategory: 'budaya',
    categoryLabel: 'Budaya (Bunka)',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Latihan tradisi tahunan (matsuri, hanami), etiket, dan peribahasa klasik Jepang.',
    bestScore: 100,
    bestTimeFormatted: '02:25',
    isCompleted: true,
  },
  {
    id: 'set-cc-2',
    title: 'Simulasi 02: Geografi & Sejarah',
    topicCategory: 'geografi_sejarah',
    categoryLabel: 'Geografi & Sejarah',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Cakupan pulau utama, prefektur, pegunungan, era restorasi Meiji, dan samurai.',
    bestScore: 100,
    bestTimeFormatted: '02:15',
    isCompleted: true,
  },
  {
    id: 'set-cc-3',
    title: 'Simulasi 03: Tata Bahasa & Idiom',
    topicCategory: 'tata_bahasa',
    categoryLabel: 'Tata Bahasa Cepat',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Partikel, pola kalimat kasual vs sopan (Keigo dasar), dan idiom yojijukugo umum.',
    bestScore: 100,
    bestTimeFormatted: '02:30',
    isCompleted: true,
  },
  {
    id: 'set-cc-4',
    title: 'Simulasi 04: Budaya Pop & Nihon Shakai',
    topicCategory: 'budaya',
    categoryLabel: 'Budaya (Bunka)',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Transportasi Shinkansen, kuliner Washoku, animasi klasik, dan fenomena sosial.',
    bestScore: 80,
    bestTimeFormatted: '03:10',
    isCompleted: true,
  },
  {
    id: 'set-cc-5',
    title: 'Simulasi 05: Peribahasa Kotowaza Kilat',
    topicCategory: 'kotowaza',
    categoryLabel: 'Peribahasa (Kotowaza)',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Tebak makna pepatah kera jatuh dari pohon, katak dalam sumur, dan batu berlumut.',
    bestScore: 100,
    bestTimeFormatted: '02:45',
    isCompleted: true,
  },
  {
    id: 'set-cc-6',
    title: 'Simulasi 06: Rapid Knowledge Blitz Final',
    topicCategory: 'tata_bahasa',
    categoryLabel: 'Tata Bahasa Cepat',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 5,
    description: 'Kuis gabungan kecepatan tinggi persiapan turnamen antarsekolah Jawa Timur.',
    bestScore: 100,
    bestTimeFormatted: '02:20',
    isCompleted: true,
  },
];

export const CC_ADDITIONAL_QUESTIONS: Record<string, Question[]> = {
  'set-cc-2': [
    {
      id: 'q-cc2-1',
      set_id: 'set-cc-2',
      question_text: 'Jepang terdiri dari 4 pulau utama. Pulau manakah yang memiliki wilayah terluas di antara keempatnya?',
      options: [
        { key: 'A', text: 'Hokkaido (北海道)' },
        { key: 'B', text: 'Honshu (本州)' },
        { key: 'C', text: 'Kyushu (九州)' },
        { key: 'D', text: 'Shikoku (四国)' },
      ],
      correct_key: 'B',
      explanation: 'Honshu adalah pulau terbesar di Jepang (sekitar 60% total luas wilayah) tempat Tokyo dan kota-kota besar berada.',
      order_index: 1,
    },
    {
      id: 'q-cc2-2',
      set_id: 'set-cc-2',
      question_text: 'Kastil bersejarah berwarna putih elegan di Prefektur Hyogo yang dijuluki Kastil Bangau Putih (Shirasagi-jo) adalah...',
      options: [
        { key: 'A', text: 'Kastil Osaka (大坂城)' },
        { key: 'B', text: 'Kastil Himeji (姫路城)' },
        { key: 'C', text: 'Kastil Nagoya (名古屋城)' },
        { key: 'D', text: 'Kastil Matsumoto (松本城)' },
      ],
      correct_key: 'B',
      explanation: 'Kastil Himeji (Himeji-jo) adalah salah satu warisan dunia UNESCO tertua di Jepang yang mempertahankan bentuk aslinya.',
      order_index: 2,
    },
    {
      id: 'q-cc2-3',
      set_id: 'set-cc-2',
      question_text: 'Toko shinkansen jalur Tokaido pertama kali diresmikan untuk menghubungkan Tokyo dan Osaka pada tahun perhelatan Olimpiade Tokyo yaitu tahun...',
      options: [
        { key: 'A', text: '1945' },
        { key: 'B', text: '1964' },
        { key: 'C', text: '1970' },
        { key: 'D', text: '1989' },
      ],
      correct_key: 'B',
      explanation: 'Tokaido Shinkansen dibuka pada 1 Oktober 1964 menjelang pembukaan Olimpiade Musim Panas Tokyo 1964.',
      order_index: 3,
    },
    {
      id: 'q-cc2-4',
      set_id: 'set-cc-2',
      question_text: 'Tokoh pemersatu Jepang yang mendirikan Keshogunan Tokugawa dan memindahkan pusat pemerintahan ke Edo (Tokyo) adalah...',
      options: [
        { key: 'A', text: 'Oda Nobunaga' },
        { key: 'B', text: 'Toyotomi Hideyoshi' },
        { key: 'C', text: 'Tokugawa Ieyasu' },
        { key: 'D', text: 'Minamoto no Yoritomo' },
      ],
      correct_key: 'C',
      explanation: 'Tokugawa Ieyasu mendirikan Keshogunan Edo setelah memenangkan Pertempuran Sekigahara pada tahun 1600.',
      order_index: 4,
    },
    {
      id: 'q-cc2-5',
      set_id: 'set-cc-2',
      question_text: 'Berapakah jumlah total prefektur (ken, to, do, fu) di seluruh negara Jepang saat ini?',
      options: [
        { key: 'A', text: '43 Prefektur' },
        { key: 'B', text: '47 Prefektur' },
        { key: 'C', text: '50 Prefektur' },
        { key: 'D', text: '52 Prefektur' },
      ],
      correct_key: 'B',
      explanation: 'Jepang terbagi menjadi 47 prefektur: 1 To (Tokyo), 1 Do (Hokkaido), 2 Fu (Osaka & Kyoto), dan 43 Ken.',
      order_index: 5,
    },
  ],
};

export interface LeaderboardStudent {
  rank: number;
  name: string;
  timeFormatted: string;
  score: number;
  avatarInitial: string;
  avatarBg: string;
  badgeEmoji: string;
}

export const CC_LEADERBOARD: LeaderboardStudent[] = [
  {
    rank: 1,
    name: 'Budi Santoso',
    timeFormatted: '02:25',
    score: 100,
    avatarInitial: 'B',
    avatarBg: 'bg-amber-500 text-white',
    badgeEmoji: '🥇',
  },
  {
    rank: 2,
    name: 'Ahmad Zaki',
    timeFormatted: '02:15',
    score: 60,
    avatarInitial: 'A',
    avatarBg: 'bg-slate-400 text-white',
    badgeEmoji: '🥈',
  },
  {
    rank: 3,
    name: 'Farhan Ramadhan',
    timeFormatted: '02:50',
    score: 40,
    avatarInitial: 'F',
    avatarBg: 'bg-amber-700 text-white',
    badgeEmoji: '🥉',
  },
];
