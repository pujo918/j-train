import { PracticeSet, Question, PracticeResult, StudentAnalyticsSummary, ActivityFeedItem, Profile } from '@/types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: "user-budi",
    nisn: "0078129381",
    full_name: "Budi Santoso",
    role: "siswa",
    avatar_url: "B",
    created_at: "2026-08-01T08:00:00Z",
    updated_at: "2026-09-27T08:00:00Z",
  },
  {
    id: "user-siti",
    nisn: "0079451203",
    full_name: "Siti Rahma",
    role: "siswa",
    avatar_url: "S",
    created_at: "2026-08-01T08:00:00Z",
    updated_at: "2026-09-27T08:00:00Z",
  },
  {
    id: "user-zaki",
    nisn: "0081294821",
    full_name: "Ahmad Zaki",
    role: "siswa",
    avatar_url: "A",
    created_at: "2026-08-02T08:00:00Z",
    updated_at: "2026-09-26T08:00:00Z",
  },
  {
    id: "user-dewi",
    nisn: "0083210948",
    full_name: "Dewi Lestari",
    role: "siswa",
    avatar_url: "D",
    created_at: "2026-08-05T08:00:00Z",
    updated_at: "2026-09-25T08:00:00Z",
  },
  {
    id: "user-farhan",
    nisn: "0076239102",
    full_name: "Farhan Ramadhan",
    role: "siswa",
    avatar_url: "F",
    created_at: "2026-08-07T08:00:00Z",
    updated_at: "2026-09-22T08:00:00Z",
  },
  {
    id: "user-rina",
    nisn: "0085491209",
    full_name: "Rina Fitriani",
    role: "siswa",
    avatar_url: "R",
    created_at: "2026-08-10T08:00:00Z",
    updated_at: "2026-09-20T08:00:00Z",
  },
  {
    id: "user-sensei",
    nisn: "198504122010012015",
    full_name: "Nurul Hidayati Sensei",
    role: "sensei",
    avatar_url: "N",
    created_at: "2026-07-01T08:00:00Z",
    updated_at: "2026-09-27T08:00:00Z",
  },
];

export const INITIAL_PRACTICE_SETS: PracticeSet[] = [
  // 1. KANJI
  {
    id: "set-kanji-1",
    category: "kanji",
    title: "Kanji Kompetisi N4: Cara Baca & Makna (Paket 1)",
    description: "Latihan pemantapan cara baca Onyomi/Kunyomi dan penentuan karakter kanji yang tepat sesuai konteks kalimat olimpiade.",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 10,
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-10T08:00:00Z",
    questions_count: 5,
  },
  {
    id: "set-kanji-2",
    category: "kanji",
    title: "Kanji Lanjutan N3: Yojijukugo & Idiom Konteks",
    description: "Modul kanji tingkat mahir untuk persiapan babak final.",
    difficulty_level: "Mahir (N3)",
    duration_minutes: 15,
    is_published: false, // Testing empty state when unpublished!
    created_by: "user-sensei",
    created_at: "2026-09-18T08:00:00Z",
    questions_count: 0,
  },

  // 2. CERDAS CERMAT
  {
    id: "set-cc-1",
    category: "cerdas_cermat",
    title: "Simulasi Cerdas Cermat Budaya & Pengetahuan Umum Jepang",
    description: "Latihan kecepatan menjawab (rapid quiz) seputar geografi, sejarah, budaya tradisional, kotowaza, dan peribahasa Jepang.",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 5, // 5 menit untuk 5 soal berwaktu
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-12T08:00:00Z",
    questions_count: 5,
  },

  // 3. KIKIKAKITORI
  {
    id: "set-kikikakitori-1",
    category: "kikikakitori",
    title: "Simulasi Kikikakitori Ujian N4: Pengumuman & Dialog",
    description: "Simulasi menyimak terkunci (Exam Mode: tanpa scrubbing bebas, audio dibatasi 2x putar). Menuntut ketelitian mendengar instruksi.",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 8,
    audio_reference_url: "https://actions.google.com/sounds/v1/ambiences/train_station.ogg",
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-14T08:00:00Z",
    questions_count: 3,
  },

  // 4. RODOKU
  {
    id: "set-rodoku-1",
    category: "rodoku",
    title: "Naskah Rodoku Lomba: 『手袋を買いに』 (Membeli Sarung Tangan)",
    description: "Pelafalan teks sastra Jepang dengan kejelasan artikulasi, jeda napas (/), intonasi tepat, dan perbandingan audio rekaman Sensei.",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 0,
    audio_reference_url: "https://actions.google.com/sounds/v1/weather/winter_wind.ogg",
    script_content: `寒い冬がやってきました。/
夜になると、// 北風がピューピューと吹いて、/ 森の木々を揺らしました。//
小さな子狐は、/ 初めて見る白い雪に目を丸くして、/ お母さん狐に駆け寄りました。//
「お母さん、/ 手が冷たいよ。/ ちくちく痛いよ。」/
お母さん狐は、/ 愛おしそうに子狐の小さな手を包み込みました。//`,
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-15T08:00:00Z",
  },

  // 5. SEIYU
  {
    id: "set-seiyu-1",
    category: "seiyu",
    title: "Naskah Sulih Suara Anime 『絆の彼方』 (Scene 03: Garis Batas Juara)",
    description: "Latihan karakterisasi suara, modulasi emosi (marah/berbisik/lantang), dan sinkronisasi tempo bicara (lip-sync tempo).",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 0,
    audio_reference_url: "https://actions.google.com/sounds/v1/sports/stadium_cheer.ogg",
    script_content: `[Kenji - Nafas tersengal, tekad bulat]:
「諦めるな！僕たちが毎日積み重ねてきた努力は、絶対に裏切らない！」/

[Aoi - Berbisik lembut namun penuh keyakinan]:
「うん... 行こう、ケンジ。一緒にあの表彰台の一番上へ！」//

[Sensei - Tegas & Berwibawa memberi aba-aba]:
「前を向け、お前たち！全員の期待を背負って、全力で駆け抜けろ！」`,
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-16T08:00:00Z",
  },

  // 6. SHODOU
  {
    id: "set-shodou-1",
    category: "shodou",
    title: "Panduan Kaligrafi Hanshi: Karakter 『道』 (Jalan / Michi - Kaisho Style)",
    description: "Visualisasi goresan 12 langkah, kaidah Tome, Hane, Harai, dan checklist mandiri keseimbangan huruf serta posisi cap Rakkan.",
    difficulty_level: "Menengah (N4)",
    duration_minutes: 0,
    script_content: `Kaidah Penulisan Kanji 『道』 (12 Goresan - Gaya Kaisho):
1. Mulai dari radikal leher 首 (Kubi) di bagian atas dan tengah.
2. Jaga keseimbangan garis horizontal tengah agar tetap simetris.
3. Tarik goresan radikal Shinnyou (⻌) mengalir membungkus bagian bawah.
4. Perhatikan Hane (lentikan kuas) pada goresan sudut dan Harai (sapuan melebar tipis) pada goresan penutup bawah.
5. Bubuhkan cap Rakkan tepat dua jari di sisi kiri bawah kertas hanshi.`,
    is_published: true,
    created_by: "user-sensei",
    created_at: "2026-09-17T08:00:00Z",
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  // Kanji Questions
  {
    id: "q-kj-1",
    set_id: "set-kanji-1",
    question_text: "Pilihlah cara baca (Kunyomi/Onyomi) yang tepat untuk kata di dalam kurung:\n毎朝、公園を【散歩】します。",
    options: [
      { key: "A", text: "さんぽ (Sanpo)" },
      { key: "B", text: "さんほ (Sanho)" },
      { key: "C", text: "ざんぽ (Zanpo)" },
      { key: "D", text: "しんぽ (Shinpo)" }
    ],
    correct_key: "A",
    explanation: "Kanji 散 (San = menyebar) dan 歩 (Po/Aruku = melangkah) jika digabung dibaca 'Sanpo' (jalan-jalan/jogging pagi).",
    order_index: 1,
  },
  {
    id: "q-kj-2",
    set_id: "set-kanji-1",
    question_text: "Pilihlah cara baca yang tepat untuk kata bergaris bawah berikut:\n日曜日に図書館で本を【借りました】。",
    options: [
      { key: "A", text: "かしました (Kashimashita)" },
      { key: "B", text: "かりました (Karimashita)" },
      { key: "C", text: "とりました (Torimashita)" },
      { key: "D", text: "かえしました (Kaeshimashita)" }
    ],
    correct_key: "B",
    explanation: "Kanji 借 berasal dari kata kerja 借りる (Kariru) yang berarti meminjam. Bentuk lampaunya adalah かりました (Karimashita). Jangan tertukar dengan 貸す (Kasu = meminjamkan).",
    order_index: 2,
  },
  {
    id: "q-kj-3",
    set_id: "set-kanji-1",
    question_text: "Tentukan karakter Kanji yang benar untuk melengkapi kalimat berikut:\nこの部屋はとても【しず】かです。",
    options: [
      { key: "A", text: "浄" },
      { key: "B", text: "静" },
      { key: "C", text: "清" },
      { key: "D", text: "安" }
    ],
    correct_key: "B",
    explanation: "Kata sifat-na 'Shizuka' (tenang/sunyi) ditulis dengan kanji 静 (静か). Kanji 浄 berarti bersih/murni, sedangkan 安 berarti murah/aman.",
    order_index: 3,
  },
  {
    id: "q-kj-4",
    set_id: "set-kanji-1",
    question_text: "Manakah cara baca yang benar untuk frasa berikut:\n新しい【計画】を立てる。",
    options: [
      { key: "A", text: "けいかく (Keikaku)" },
      { key: "B", text: "けいが (Keiga)" },
      { key: "C", text: "はかる (Hakaru)" },
      { key: "D", text: "けいさん (Keisan)" }
    ],
    correct_key: "A",
    explanation: "Kanji 計 (Kei = mengukur/rencana) dan 画 (Kaku = gambar/garis rencana) dibaca けいかく (Keikaku = rencana/program).",
    order_index: 4,
  },
  {
    id: "q-kj-5",
    set_id: "set-kanji-1",
    question_text: "Apa padanan makna yang paling tepat dari kata bergaris bawah berikut:\n空が青くて【気持ち】がいい。",
    options: [
      { key: "A", text: "Pikiran sedang suntuk" },
      { key: "B", text: "Perasaan / suasana hati terasa nyaman dan segar" },
      { key: "C", text: "Nafsu makan bertambah" },
      { key: "D", text: "Suhu udara sangat dingin" }
    ],
    correct_key: "B",
    explanation: "Kata 気持ち (Kimochi) mengacu pada perasaan, sensasi fisik, atau mood. 'Kimochi ga ii' artinya terasa sangat menyenangkan/segar.",
    order_index: 5,
  },

  // Cerdas Cermat Questions
  {
    id: "q-cc-1",
    set_id: "set-cc-1",
    question_text: "Tradisi berkumpul bersama keluarga atau rekan kerja untuk menikmati keindahan bunga sakura yang sedang mekar penuh di musim semi disebut...",
    options: [
      { key: "A", text: "Hanami (花見)" },
      { key: "B", text: "Momijigari (紅葉狩り)" },
      { key: "C", text: "Tsukimi (月見)" },
      { key: "D", text: "Matsuri (祭り)" }
    ],
    correct_key: "A",
    explanation: "Hana = bunga, Mi = melihat. Tradisi melihat bunga sakura mekar disebut Hanami. Momijigari adalah melihat daun musim gugur, dan Tsukimi adalah melihat bulan purnama.",
    order_index: 1,
  },
  {
    id: "q-cc-2",
    set_id: "set-cc-1",
    question_text: "Gunung tertinggi di Jepang dengan ketinggian mencapai 3.776 meter di atas permukaan laut dan terdaftar sebagai Warisan Dunia UNESCO adalah...",
    options: [
      { key: "A", text: "Gunung Aso (阿蘇山)" },
      { key: "B", text: "Gunung Fuji (富士山)" },
      { key: "C", text: "Gunung Kita (北岳)" },
      { key: "D", text: "Gunung Hiei (比叡山)" }
    ],
    correct_key: "B",
    explanation: "Gunung Fuji (Fujisan) adalah gunung berapi aktif tertinggi di Jepang dengan ketinggian 3.776 mdpl, terletak di perbatasan Prefektur Shizuoka dan Yamanashi.",
    order_index: 2,
  },
  {
    id: "q-cc-3",
    set_id: "set-cc-1",
    question_text: "Peribahasa Jepang (Kotowaza) 『猿も木から落ちる』 (Saru mo ki kara ochiru - Kera pun bisa jatuh dari pohon) memiliki padanan makna bahasa Indonesia...",
    options: [
      { key: "A", text: "Ada udang di balik batu" },
      { key: "B", text: "Sepandai-pandai tupai melompat, sekali waktu akan jatuh juga" },
      { key: "C", text: "Tong kosong nyaring bunyinya" },
      { key: "D", text: "Air tenang menghanyutkan" }
    ],
    correct_key: "B",
    explanation: "Peribahasa ini bermakna bahkan seorang ahli atau orang yang sangat mahir di bidangnya pun bisa membuat kekeliruan yang tidak disengaja.",
    order_index: 3,
  },
  {
    id: "q-cc-4",
    set_id: "set-cc-1",
    question_text: "Sebelum dipindahkan ke Tokyo (dulu bernama Edo) pada masa Restorasi Meiji tahun 1868, kota manakah yang menjadi ibu kota kekaisaran Jepang selama lebih dari seribu tahun?",
    options: [
      { key: "A", text: "Osaka (大阪)" },
      { key: "B", text: "Kyoto (京都)" },
      { key: "C", text: "Nara (奈良)" },
      { key: "D", text: "Yokohama (横浜)" }
    ],
    correct_key: "B",
    explanation: "Kyoto (Heian-kyo) adalah ibu kota kekaisaran Jepang sejak tahun 794 hingga 1868 ketika Kaisar Meiji memindahkan kediaman ke Edo yang diganti nama menjadi Tokyo (Ibu Kota Timur).",
    order_index: 4,
  },
  {
    id: "q-cc-5",
    set_id: "set-cc-1",
    question_text: "Mata uang resmi Jepang yang dilambangkan dengan tanda ¥ dan ditulis dengan kanji 円 dibaca sebagai...",
    options: [
      { key: "A", text: "Yuan" },
      { key: "B", text: "Won" },
      { key: "C", text: "Yen (En)" },
      { key: "D", text: "Ringgit" }
    ],
    correct_key: "C",
    explanation: "Mata uang Jepang adalah Yen (diucapkan 'En' dalam bahasa Jepang), dengan kode internasional JPY.",
    order_index: 5,
  },

  // Kikikakitori Questions
  {
    id: "q-kk-1",
    set_id: "set-kikikakitori-1",
    question_text: "Dengarkan audio pengumuman stasiun dengan saksama.\nDi peron nomor berapakah kereta Shinkansen Hikari tujuan Shin-Osaka akan diberangkatkan?",
    options: [
      { key: "A", text: "Peron Nomor 2 (2番線)" },
      { key: "B", text: "Peron Nomor 3 (3番線)" },
      { key: "C", text: "Peron Nomor 4 (4番線)" },
      { key: "D", text: "Peron Nomor 5 (5番線)" }
    ],
    correct_key: "B",
    explanation: "Dalam audio pengumuman disebutkan jelas: 「3番線に、新大阪行き ひかり号がまいります」 (Kereta Hikari tujuan Shin-Osaka tiba di peron 3).",
    order_index: 1,
  },
  {
    id: "q-kk-2",
    set_id: "set-kikikakitori-1",
    question_text: "Benda apakah yang secara tegas diminta oleh Sensei untuk dibawa oleh seluruh siswa pada sesi bimbingan besok pagi? (Tuliskan dalam hiragana atau alfabet romaji)",
    options: [
      { key: "A", text: "じしょ (Jisho / Kamus)" },
      { key: "B", text: "ノート (No-to / Buku Catatan)" },
      { key: "C", text: "ふで (Fude / Kuas)" },
      { key: "D", text: "えんぴつ (Enpitsu / Pensil)" }
    ],
    correct_key: "A",
    explanation: "Sensei menegaskan: 「明日の朝、必ず電子辞書または辞書を持ってきてください」 (Besok pagi wajib membawa kamus).",
    order_index: 2,
  },
  {
    id: "q-kk-3",
    set_id: "set-kikikakitori-1",
    question_text: "Berapa menit perkiraan keterlambatan kedatangan bus antar-madrasah dikarenakan hujan deras dan kabut tebal?",
    options: [
      { key: "A", text: "10 menit (じゅっぷん)" },
      { key: "B", text: "15 menit (じゅうごふん)" },
      { key: "C", text: "20 menit (にじゅっぷん)" },
      { key: "D", text: "30 menit (さんじゅっぷん)" }
    ],
    correct_key: "B",
    explanation: "Penyiar menyampaikan pengumuman: 「大雨のため、バスの到着が約15分遅れております」 (Karena hujan lebat, kedatangan bus terlambat sekitar 15 menit).",
    order_index: 3,
  },
];

export const INITIAL_PRACTICE_RESULTS: PracticeResult[] = [
  {
    id: "res-1",
    user_id: "user-budi",
    set_id: "set-kanji-1",
    category: "kanji",
    score: 80,
    total_questions: 5,
    correct_answers: 4,
    time_spent_seconds: 210,
    is_completed: true,
    completed_at: "2026-09-24T09:30:00Z",
    set_title: "Kanji Kompetisi N4: Cara Baca & Makna (Paket 1)",
  },
  {
    id: "res-2",
    user_id: "user-budi",
    set_id: "set-cc-1",
    category: "cerdas_cermat",
    score: 100,
    total_questions: 5,
    correct_answers: 5,
    time_spent_seconds: 145,
    is_completed: true,
    completed_at: "2026-09-26T14:15:00Z",
    set_title: "Simulasi Cerdas Cermat Budaya & Pengetahuan Umum Jepang",
  },
  {
    id: "res-3",
    user_id: "user-budi",
    set_id: "set-rodoku-1",
    category: "rodoku",
    score: null,
    total_questions: 0,
    correct_answers: 0,
    time_spent_seconds: 380,
    is_completed: true,
    completed_at: "2026-09-27T10:00:00Z",
    set_title: "Naskah Rodoku Lomba: 『手袋を買いに』",
  },
  {
    id: "res-4",
    user_id: "user-siti",
    set_id: "set-kanji-1",
    category: "kanji",
    score: 100,
    total_questions: 5,
    correct_answers: 5,
    time_spent_seconds: 180,
    is_completed: true,
    completed_at: "2026-09-27T08:20:00Z",
    set_title: "Kanji Kompetisi N4: Cara Baca & Makna (Paket 1)",
  },
  {
    id: "res-5",
    user_id: "user-siti",
    set_id: "set-kikikakitori-1",
    category: "kikikakitori",
    score: 66.67,
    total_questions: 3,
    correct_answers: 2,
    time_spent_seconds: 260,
    is_completed: true,
    completed_at: "2026-09-26T16:00:00Z",
    set_title: "Simulasi Kikikakitori Ujian N4: Pengumuman & Dialog",
  },
  {
    id: "res-6",
    user_id: "user-zaki",
    set_id: "set-cc-1",
    category: "cerdas_cermat",
    score: 60,
    total_questions: 5,
    correct_answers: 3,
    time_spent_seconds: 195,
    is_completed: true,
    completed_at: "2026-09-25T11:40:00Z",
    set_title: "Simulasi Cerdas Cermat Budaya & Pengetahuan Umum Jepang",
  },
  {
    id: "res-7",
    user_id: "user-dewi",
    set_id: "set-kanji-1",
    category: "kanji",
    score: 60,
    total_questions: 5,
    correct_answers: 3,
    time_spent_seconds: 290,
    is_completed: true,
    completed_at: "2026-09-23T13:10:00Z",
    set_title: "Kanji Kompetisi N4: Cara Baca & Makna (Paket 1)",
  },
  {
    id: "res-8",
    user_id: "user-farhan",
    set_id: "set-cc-1",
    category: "cerdas_cermat",
    score: 40,
    total_questions: 5,
    correct_answers: 2,
    time_spent_seconds: 170,
    is_completed: true,
    completed_at: "2026-09-20T15:00:00Z",
    set_title: "Simulasi Cerdas Cermat Budaya & Pengetahuan Umum Jepang",
  },
];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-1",
    user_id: "user-siti",
    user_name: "Siti Rahma",
    user_avatar: "S",
    category: "kanji",
    title: "Kanji Kompetisi N4: Cara Baca & Makna (Paket 1)",
    score: 100,
    timestamp: "2026-09-27T08:20:00Z",
    time_ago: "12 menit yang lalu",
    type: "quiz_completed",
  },
  {
    id: "act-2",
    user_id: "user-budi",
    user_name: "Budi Santoso",
    user_avatar: "B",
    category: "rodoku",
    title: "Naskah Rodoku Lomba: 『手袋を買いに』",
    score: null,
    timestamp: "2026-09-27T10:00:00Z",
    time_ago: "35 menit yang lalu",
    type: "voice_practiced",
  },
  {
    id: "act-3",
    user_id: "user-siti",
    user_name: "Siti Rahma",
    user_avatar: "S",
    category: "kikikakitori",
    title: "Simulasi Kikikakitori Ujian N4: Pengumuman & Dialog",
    score: 66.7,
    timestamp: "2026-09-26T16:00:00Z",
    time_ago: "1 jam yang lalu",
    type: "quiz_completed",
  },
  {
    id: "act-4",
    user_id: "user-budi",
    user_name: "Budi Santoso",
    user_avatar: "B",
    category: "cerdas_cermat",
    title: "Simulasi Cerdas Cermat Budaya & Pengetahuan Umum Jepang",
    score: 100,
    timestamp: "2026-09-26T14:15:00Z",
    time_ago: "3 jam yang lalu",
    type: "quiz_completed",
  },
  {
    id: "act-5",
    user_id: "user-zaki",
    user_name: "Ahmad Zaki",
    user_avatar: "A",
    category: "shodou",
    title: "Panduan Kaligrafi Hanshi: Karakter 『道』",
    score: null,
    timestamp: "2026-09-25T11:40:00Z",
    time_ago: "Kemarin",
    type: "practice_opened",
  },
];
