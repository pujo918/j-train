export interface KanjiPackageItem {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3' | 'Yojijukugo';
  levelLabel: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  status: 'selesai' | 'aktif' | 'draft';
  bestScore?: number;
  isPublished: boolean;
}

export interface KanjiFlashcardItem {
  id: string;
  kanji: string;
  level: 'N5' | 'N4' | 'N3' | 'Yojijukugo';
  levelLabel: string;
  radical: string;
  strokeCount: number;
  onyomi: string;
  kunyomi: string;
  meaning: string;
  exampleWord: string;
  exampleReading: string;
  exampleMeaning: string;
  sentence: string;
  sentenceTranslation: string;
}

export interface QuickDrillQuestion {
  id: string;
  kanji: string;
  questionText: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
  category: string;
}

export const KANJI_PACKAGES: KanjiPackageItem[] = [
  {
    id: 'set-kanji-1',
    title: 'Cara Baca & Makna Dasar Set 1',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    description: 'Latihan cara baca Onyomi/Kunyomi kata benda dan kata kerja frekuensi tinggi.',
    questionCount: 10,
    durationMinutes: 10,
    status: 'selesai',
    bestScore: 85,
    isPublished: true,
  },
  {
    id: 'set-kanji-2',
    title: 'Cara Baca & Makna Dasar Set 2',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    description: 'Pemantapan kanji majemuk (Jukugo) kontekstual dalam kalimat kompetisi.',
    questionCount: 10,
    durationMinutes: 10,
    status: 'aktif',
    bestScore: 85,
    isPublished: true,
  },
  {
    id: 'set-kanji-3',
    title: 'Cara Baca & Makna Dasar Set 3',
    level: 'N3',
    levelLabel: 'MAHIR (N3)',
    description: 'Studi kanji tingkat menengah atas dengan variasi bacaan khusus (Ateji).',
    questionCount: 10,
    durationMinutes: 10,
    status: 'draft',
    isPublished: false,
  },
  {
    id: 'set-kanji-4',
    title: 'Pengenalan Karakter Dasar Set 1',
    level: 'N5',
    levelLabel: 'DASAR (N5)',
    description: 'Karakter kanji fundamental angka, arah mata angin, hari, dan anggota keluarga.',
    questionCount: 10,
    durationMinutes: 10,
    status: 'selesai',
    bestScore: 90,
    isPublished: true,
  },
  {
    id: 'set-kanji-5',
    title: 'Konteks Kalimat & Partikel Set 2',
    level: 'N3',
    levelLabel: 'MAHIR (N3)',
    description: 'Menentukan kanji yang tepat berdasarkan konteks semantik paragraf.',
    questionCount: 10,
    durationMinutes: 10,
    status: 'aktif',
    bestScore: 85,
    isPublished: true,
  },
  {
    id: 'set-kanji-6',
    title: 'Kanji Lanjutan N3: Yojijukugo',
    level: 'Yojijukugo',
    levelLabel: 'YOJIJUKUGO (IDIOM)',
    description: 'Peribahasa empat karakter kanji Jepang standar olimpiade bahasa nasional.',
    questionCount: 10,
    durationMinutes: 10,
    status: 'draft',
    isPublished: false,
  },
];

export const KANJI_FLASHCARDS: KanjiFlashcardItem[] = [
  {
    id: 'fc-1',
    kanji: '新',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '斤 (Kapak)',
    strokeCount: 13,
    onyomi: 'シン (Shin)',
    kunyomi: 'あたら・しい (Atarashii), あら・た (Arata)',
    meaning: 'Baru / Terkini / Pembaruan',
    exampleWord: '新学期',
    exampleReading: 'しんがっき (Shingakki)',
    exampleMeaning: 'Semester Baru',
    sentence: '新学期に向けて、新しい漢字の練習を始める。',
    sentenceTranslation: 'Menyambut semester baru, memulai latihan kanji baru.',
  },
  {
    id: 'fc-2',
    kanji: '道',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '⻌ (Shinnyou / Berjalan)',
    strokeCount: 12,
    onyomi: 'ドウ, トウ (Dou, Tou)',
    kunyomi: 'みち (Michi)',
    meaning: 'Jalan / Kaidah / Kehidupan',
    exampleWord: '書道',
    exampleReading: 'しょどう (Shodou)',
    exampleMeaning: 'Kaligrafi Jepang',
    sentence: '日本の伝統文化である書道を深く学ぶ。',
    sentenceTranslation: 'Mempelajari secara mendalam Shodou yang merupakan budaya tradisional Jepang.',
  },
  {
    id: 'fc-3',
    kanji: '夢',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '夕 (Malam / Petang)',
    strokeCount: 13,
    onyomi: 'ム (Mu)',
    kunyomi: 'ゆめ (Yume)',
    meaning: 'Impian / Cita-cita / Bunga Tidur',
    exampleWord: '夢中',
    exampleReading: 'むちゅう (Muchuu)',
    exampleMeaning: 'Tenggelam / Asyik dalam Latihan',
    sentence: '日本語のコンテスト優勝という夢に向かって努力する。',
    sentenceTranslation: 'Berusaha keras menuju cita-cita menjuarai kompetisi bahasa Jepang.',
  },
  {
    id: 'fc-4',
    kanji: '和',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '口 (Mulut) / 禾 (Padi)',
    strokeCount: 8,
    onyomi: 'ワ, オ (Wa, O)',
    kunyomi: 'やわ・らぐ (Yawaragu)',
    meaning: 'Harmoni / Damai / Khas Jepang',
    exampleWord: '和食',
    exampleReading: 'わしょく (Washoku)',
    exampleMeaning: 'Kuliner Tradisional Jepang',
    sentence: '平和な心で対話することが人間関係の基本だ。',
    sentenceTranslation: 'Berdialog dengan hati yang damai adalah dasar hubungan antarmanusia.',
  },
  {
    id: 'fc-5',
    kanji: '希',
    level: 'N3',
    levelLabel: 'MAHIR (N3)',
    radical: '巾 (Kain)',
    strokeCount: 7,
    onyomi: 'キ (Ki)',
    kunyomi: 'こいねが・う (Koinegau)',
    meaning: 'Harapan / Langka / Asa',
    exampleWord: '希望',
    exampleReading: 'きぼう (Kibou)',
    exampleMeaning: 'Harapan / Aspirasi',
    sentence: '未来に対する強い希望を持って前進しよう。',
    sentenceTranslation: 'Mari melangkah maju dengan harapan yang kuat terhadap masa depan.',
  },
  {
    id: 'fc-6',
    kanji: '語',
    level: 'N5',
    levelLabel: 'DASAR (N5)',
    radical: '言 (Ucapan / Kata)',
    strokeCount: 14,
    onyomi: 'ゴ (Go)',
    kunyomi: 'かた・る (Kataru)',
    meaning: 'Bahasa / Kata / Bercerita',
    exampleWord: '物語',
    exampleReading: 'ものがたり (Monogatari)',
    exampleMeaning: 'Kisah / Cerita',
    sentence: '毎日の練習を通じて日本語の語彙を増やす。',
    sentenceTranslation: 'Memperbanyak kosakata bahasa Jepang melalui latihan setiap hari.',
  },
  {
    id: 'fc-7',
    kanji: '練',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '糸 (Benang)',
    strokeCount: 14,
    onyomi: 'レン (Ren)',
    kunyomi: 'ね・る (Neru)',
    meaning: 'Berlatih / Mematangkan / Menempa',
    exampleWord: '練習',
    exampleReading: 'れんしゅう (Renshuu)',
    exampleMeaning: 'Latihan / Praktik',
    sentence: '基礎をしっかりと練り上げて本番に備える。',
    sentenceTranslation: 'Mematangkan dasar dengan kuat untuk mempersiapkan kompetisi sesungguhnya.',
  },
  {
    id: 'fc-8',
    kanji: '試',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '言 (Kata)',
    strokeCount: 13,
    onyomi: 'シ (Shi)',
    kunyomi: 'こころ・みる, ため・す (Kokoromiru, Tamesu)',
    meaning: 'Ujian / Mencoba / Percobaan',
    exampleWord: '試合',
    exampleReading: 'しあい (Shiai)',
    exampleMeaning: 'Pertandingan / Turnamen',
    sentence: '実力を試す絶好のチャンスがやってきた。',
    sentenceTranslation: 'Kesempatan emas untuk menguji kemampuan telah tiba.',
  },
  {
    id: 'fc-9',
    kanji: '勝',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    radical: '力 (Kekuatan)',
    strokeCount: 12,
    onyomi: 'ショウ (Shou)',
    kunyomi: 'か・つ (Katsu)',
    meaning: 'Menang / Keberhasilan / Unggul',
    exampleWord: '優勝',
    exampleReading: 'ゆうしょう (Yuushou)',
    exampleMeaning: 'Juara 1 / Kampiun',
    sentence: '最後まで諦めずに決勝戦で勝利を掴み取る。',
    sentenceTranslation: 'Meraih kemenangan di babak final tanpa menyerah hingga akhir.',
  },
  {
    id: 'fc-10',
    kanji: '一期一会',
    level: 'Yojijukugo',
    levelLabel: 'YOJIJUKUGO (IDIOM)',
    radical: 'Idiom 4 Karakter',
    strokeCount: 22,
    onyomi: 'イチ・ゴ・イチ・エ',
    kunyomi: 'Ichigo Ichie',
    meaning: 'Setiap pertemuan adalah kesempatan berharga sekali seumur hidup',
    exampleWord: '茶道哲学',
    exampleReading: 'さどうてつがく (Sadou Tetsugaku)',
    exampleMeaning: 'Filosofi Tradisi Teh',
    sentence: '今日出会った仲間との絆は一期一会のかけがえのない宝物だ。',
    sentenceTranslation: 'Ikatan dengan teman yang dijumpai hari ini adalah harta tak ternilai sekali seumur hidup.',
  },
  {
    id: 'fc-11',
    kanji: '七転八起',
    level: 'Yojijukugo',
    levelLabel: 'YOJIJUKUGO (IDIOM)',
    radical: 'Idiom 4 Karakter',
    strokeCount: 24,
    onyomi: 'シチ・テン・ハッ・キ',
    kunyomi: 'Shichiten Hakki',
    meaning: 'Jatuh tujuh kali, bangkit delapan kali (Semangat pantang menyerah)',
    exampleWord: '不屈精神',
    exampleReading: 'ふくつせいしん (Fukutsu Seishin)',
    exampleMeaning: 'Jiwa Tangguh',
    sentence: '失敗を恐れず、七転八起の気概で最後まで挑戦し続ける。',
    sentenceTranslation: 'Jangan takut gagal, teruslah berjuang dengan semangat pantang menyerah.',
  },
  {
    id: 'fc-12',
    kanji: '日進月歩',
    level: 'Yojijukugo',
    levelLabel: 'YOJIJUKUGO (IDIOM)',
    radical: 'Idiom 4 Karakter',
    strokeCount: 21,
    onyomi: 'ニッ・シン・ゲッ・ポ',
    kunyomi: 'Nisshin Geppo',
    meaning: 'Kemajuan pesat yang terus berkembang dari hari ke hari',
    exampleWord: '急速進歩',
    exampleReading: 'きゅうそくしんぽ (Kyuusoku Shinpo)',
    exampleMeaning: 'Perkembangan Cepat',
    sentence: '毎日の練習の積み重ねによって、日本語力は日進月歩で伸びる。',
    sentenceTranslation: 'Melalui ketekunan latihan setiap hari, kemampuan bahasa Jepang maju pesat tiada henti.',
  },
];

export const QUICK_DRILL_QUESTIONS: QuickDrillQuestion[] = [
  {
    id: 'qd-1',
    kanji: '道',
    questionText: 'Pilihlah cara baca (Kunyomi) yang tepat dari kanji 『道』:',
    options: [
      { key: 'A', text: 'みち (Michi)' },
      { key: 'B', text: 'まち (Machi)' },
      { key: 'C', text: 'ゆき (Yuki)' },
      { key: 'D', text: 'はし (Hashi)' },
    ],
    correctKey: 'A',
    explanation: 'Kanji 道 (Jalan) memiliki Kunyomi みち (Michi) dan Onyomi ドウ/トウ (Dou/Tou seperti pada 書道 - Shodou).',
    category: 'N4 Menengah',
  },
  {
    id: 'qd-2',
    kanji: '新',
    questionText: 'Manakah gabungan kata yang memiliki arti "Koran" dalam bahasa Jepang?',
    options: [
      { key: 'A', text: '新書 (Shinsho)' },
      { key: 'B', text: '新聞 (Shinbun)' },
      { key: 'C', text: '新米 (Shinmai)' },
      { key: 'D', text: '新道 (Shindou)' },
    ],
    correctKey: 'B',
    explanation: '新聞 (Shinbun) adalah kata gabungan dari 新 (Baru) dan 聞 (Mendengar/Kabar), berarti surat kabar / koran.',
    category: 'N5 Dasar',
  },
  {
    id: 'qd-3',
    kanji: '一期一会',
    questionText: 'Apa makna filosofis dari Yojijukugo 『一期一会 (Ichigo Ichie)』?',
    options: [
      { key: 'A', text: 'Bekerja keras siang dan malam tanpa henti' },
      { key: 'B', text: 'Pertemuan yang hanya terjadi sekali seumur hidup dan patut dihargai' },
      { key: 'C', text: 'Keberuntungan yang datang berkali-kali' },
      { key: 'D', text: 'Menghindari risiko dalam setiap perlombaan' },
    ],
    correctKey: 'B',
    explanation: '一期一会 (Ichigo Ichie) berasal dari tradisi upacara minum teh (Chado), mengingatkan bahwa setiap momen pertemuan adalah unik dan berharga.',
    category: 'Yojijukugo',
  },
  {
    id: 'qd-4',
    kanji: '和',
    questionText: 'Pilihlah cara baca kanji bergaris bawah berikut: 日本の【和服】はとても美しい。',
    options: [
      { key: 'A', text: 'わふく (Wafuku)' },
      { key: 'B', text: 'にふく (Nifuku)' },
      { key: 'C', text: 'かふく (Kafuku)' },
      { key: 'D', text: 'おふく (Ofuku)' },
    ],
    correctKey: 'A',
    explanation: '和 (Wa) + 服 (Fuku = Pakaian) dibaca わふく (Wafuku), yaitu pakaian tradisional khas Jepang.',
    category: 'N4 Menengah',
  },
];
