export interface KikikakitoriOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface KikikakitoriQuestionItem {
  id: string;
  setId: string;
  orderIndex: number;
  questionText: string;
  options: KikikakitoriOption[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  dictationTarget: string[]; // Variations for normalized matching
  dictationHint: string;
  explanation: string;
  audioTimestamp?: string;
}

export interface KikikakitoriPackageItem {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3';
  levelLabel: string;
  description: string;
  durationFormatted: string;
  durationSeconds: number;
  audioUrl: string;
  status: 'selesai' | 'aktif' | 'draft';
  bestScore?: number;
  isPublished: boolean;
  questionCount: number;
  tips: string;
  questions: KikikakitoriQuestionItem[];
}

export const KIKIKAKITORI_PACKAGES: KikikakitoriPackageItem[] = [
  {
    id: 'set-kikikakitori-1',
    title: 'Simulasi N4: Pengumuman Stasiun & Dialog Harian',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    description: 'Simulasi menyimak pengumuman publik di stasiun dan dialog sekolah dengan aturan anti-scrubbing kompetisi.',
    durationFormatted: '01:25',
    durationSeconds: 85,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/train_station.ogg',
    status: 'aktif',
    bestScore: 85,
    isPublished: true,
    questionCount: 5,
    tips: 'Fokus pada kata tanya (kapan/siapa/di mana) pada putaran pertama, lalu pastikan detail pada putaran kedua.',
    questions: [
      {
        id: 'kk-q1',
        setId: 'set-kikikakitori-1',
        orderIndex: 1,
        questionText: 'Kereta menuju stasiun mana yang diberangkatkan dari peron nomor 3?',
        options: [
          { key: 'A', text: 'Stasiun Shin-Osaka (新大阪)' },
          { key: 'B', text: 'Stasiun Kyoto (京都)' },
          { key: 'C', text: 'Stasiun Tokyo (東京)' },
          { key: 'D', text: 'Stasiun Nagoya (名古屋)' },
        ],
        correctKey: 'A',
        dictationTarget: ['しんおおさか', '新大阪', 'shin-osaka', 'shinoosaka', 'shin osaka'],
        dictationHint: 'Ketik nama stasiun dalam hiragana/kanji/romaji...',
        explanation: 'Dalam pengumuman penyiar stasiun terdengar jelas: 「3番線に、新大阪行き ひかり号がまいります」 (Di peron 3 akan tiba kereta Hikari tujuan Shin-Osaka).',
        audioTimestamp: '00:15',
      },
      {
        id: 'kk-q2',
        setId: 'set-kikikakitori-1',
        orderIndex: 2,
        questionText: 'Benda apakah yang secara tegas diminta oleh Sensei untuk dibawa oleh seluruh siswa pada bimbingan besok pagi?',
        options: [
          { key: 'A', text: 'Kamus Elektronik / Buku (じしょ)' },
          { key: 'B', text: 'Buku Catatan Latihan (ノート)' },
          { key: 'C', text: 'Kuas Kaligrafi Shodou (ふで)' },
          { key: 'D', text: 'Pensil Ujian 2B (えんぴつ)' },
        ],
        correctKey: 'A',
        dictationTarget: ['じしょ', '辞書', 'jisho', 'kamus'],
        dictationHint: 'Ketik kata benda yang diminta Sensei...',
        explanation: 'Sensei menegaskan dalam dialog: 「明日の朝、必ず電子辞書または辞書を持ってきてください」 (Besok pagi wajib membawa kamus elektronik atau kamus).',
        audioTimestamp: '00:32',
      },
      {
        id: 'kk-q3',
        setId: 'set-kikikakitori-1',
        orderIndex: 3,
        questionText: 'Berapa menit perkiraan keterlambatan kedatangan bus antar-madrasah dikarenakan kabut tebal?',
        options: [
          { key: 'A', text: '10 Menit (じゅっぷん)' },
          { key: 'B', text: '15 Menit (じゅうごふん)' },
          { key: 'C', text: '20 Menit (にじゅっぷん)' },
          { key: 'D', text: '30 Menit (さんじゅっぷん)' },
        ],
        correctKey: 'B',
        dictationTarget: ['15分', 'じゅうごふん', '15 menit', '15', 'juugofun'],
        dictationHint: 'Ketik jumlah durasi menit keterlambatan...',
        explanation: 'Penyiar mengumumkan: 「濃霧のため、バスの到着が約15分遅れております」 (Karena kabut tebal, kedatangan bus terlambat sekitar 15 menit).',
        audioTimestamp: '00:48',
      },
      {
        id: 'kk-q4',
        setId: 'set-kikikakitori-1',
        orderIndex: 4,
        questionText: 'Di manakah lokasi pertemuan kelompok riset budaya Jepang sebelum berangkat?',
        options: [
          { key: 'A', text: 'Di depan gerbang sekolah (校門前)' },
          { key: 'B', text: 'Di perpustakaan lantai 2 (図書館)' },
          { key: 'C', text: 'Di laboratorium bahasa (語学室)' },
          { key: 'D', text: 'Di ruang kelas 12-A (教室)' },
        ],
        correctKey: 'B',
        dictationTarget: ['としょかん', '図書館', 'toshokan', 'perpustakaan'],
        dictationHint: 'Ketik nama tempat pertemuan...',
        explanation: 'Ketua kelompok berkata: 「出発の前に、2階の図書館の前に集合してください」 (Sebelum berangkat, berkumpul di depan perpustakaan lantai 2).',
        audioTimestamp: '01:05',
      },
      {
        id: 'kk-q5',
        setId: 'set-kikikakitori-1',
        orderIndex: 5,
        questionText: 'Pukul berapa kegiatan upacara penutupan pekan budaya madrasah dijadwalkan dimulai?',
        options: [
          { key: 'A', text: 'Pukul 14:00 (午後2時)' },
          { key: 'B', text: 'Pukul 14:30 (午後2時半)' },
          { key: 'C', text: 'Pukul 15:00 (午後3時)' },
          { key: 'D', text: 'Pukul 15:30 (午後3時半)' },
        ],
        correctKey: 'B',
        dictationTarget: ['2時半', 'にじはん', '14:30', 'nijihan', '2:30'],
        dictationHint: 'Ketik jam pelaksanaan acara...',
        explanation: 'MC menyampaikan: 「閉会式は予定通り、午後2時半より体育館にて行います」 (Upacara penutupan diadakan pukul 14:30 di gymnasium).',
        audioTimestamp: '01:20',
      },
    ],
  },
  {
    id: 'set-kikikakitori-2',
    title: 'Simulasi N5: Angka, Jam & Transaksi Belanja',
    level: 'N5',
    levelLabel: 'DASAR (N5)',
    description: 'Menyimak penyebutan angka jepang, jam, harga barang di konbini, dan nomor telepon darurat.',
    durationFormatted: '01:10',
    durationSeconds: 70,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/shopping_mall.ogg',
    status: 'selesai',
    bestScore: 90,
    isPublished: true,
    questionCount: 4,
    tips: 'Catat digit angka begitu mendengar kata Hyaku (ratus) atau Sen (ribu).',
    questions: [
      {
        id: 'kk2-q1',
        setId: 'set-kikikakitori-2',
        orderIndex: 1,
        questionText: 'Berapakah total harga roti isi dan susu kotak yang dibeli di minimarket?',
        options: [
          { key: 'A', text: '250 Yen (250円)' },
          { key: 'B', text: '350 Yen (350円)' },
          { key: 'C', text: '450 Yen (450円)' },
          { key: 'D', text: '550 Yen (550円)' },
        ],
        correctKey: 'B',
        dictationTarget: ['350', '350円', 'さんびゃくごじゅうえん', '350 yen'],
        dictationHint: 'Ketik total nominal harga...',
        explanation: 'Kasir mengatakan: 「パンが200円、牛乳が150円、合わせて350円になります」 (Roti 200 yen, susu 150 yen, total 350 yen).',
      },
      {
        id: 'kk2-q2',
        setId: 'set-kikikakitori-2',
        orderIndex: 2,
        questionText: 'Nomor telepon kantor darurat yang disebutkan oleh pemandu adalah...',
        options: [
          { key: 'A', text: '03-1234-5678' },
          { key: 'B', text: '03-1234-8765' },
          { key: 'C', text: '03-4321-5678' },
          { key: 'D', text: '03-9876-5432' },
        ],
        correctKey: 'A',
        dictationTarget: ['03-1234-5678', '0312345678'],
        dictationHint: 'Ketik nomor telepon...',
        explanation: 'Pemandu menyebut: 「緊急連絡先は ゼロ・サン、イチ・ニ・サン・ヨン、ゴ・ロク・ナナ・ハチ です」.',
      },
      {
        id: 'kk2-q3',
        setId: 'set-kikikakitori-2',
        orderIndex: 3,
        questionText: 'Hari apa toko buku tradisional tersebut tutup setiap minggunya?',
        options: [
          { key: 'A', text: 'Hari Senin (Getsuyoubi)' },
          { key: 'B', text: 'Hari Rabu (Suiyoubi)' },
          { key: 'C', text: 'Hari Jumat (Kinyoubi)' },
          { key: 'D', text: 'Hari Minggu (Nichiyoubi)' },
        ],
        correctKey: 'B',
        dictationTarget: ['すいようび', '水曜日', 'suiyoubi', 'rabu'],
        dictationHint: 'Ketik nama hari...',
        explanation: 'Dalam rekaman: 「毎週水曜日は定休日となっております」 (Setiap hari Rabu adalah hari libur rutin).',
      },
      {
        id: 'kk2-q4',
        setId: 'set-kikikakitori-2',
        orderIndex: 4,
        questionText: 'Pukul berapa film dokumenter sejarah Kyoto akan diputar di auditorium?',
        options: [
          { key: 'A', text: 'Pukul 10:00 Pagi' },
          { key: 'B', text: 'Pukul 11:30 Siang' },
          { key: 'C', text: 'Pukul 13:00 Siang' },
          { key: 'D', text: 'Pukul 16:00 Sore' },
        ],
        correctKey: 'C',
        dictationTarget: ['13:00', '1:00', 'いちじ', '午後1時'],
        dictationHint: 'Ketik jam penayangan...',
        explanation: 'Terdengar pengumuman: 「映画の上映は午後1時より開始いたします」 (Pemutaran film dimulai pukul 1 siang).',
      },
    ],
  },
  {
    id: 'set-kikikakitori-3',
    title: 'Simulasi N3: Siaran Berita Cuaca & Bencana',
    level: 'N3',
    levelLabel: 'MAHIR (N3)',
    description: 'Penyampaian berita radio resmi dengan istilah meteorologi, kecepatan angin, dan instruksi evakuasi.',
    durationFormatted: '02:00',
    durationSeconds: 120,
    audioUrl: 'https://actions.google.com/sounds/v1/weather/winter_wind.ogg',
    status: 'draft',
    bestScore: undefined,
    isPublished: false,
    questionCount: 4,
    tips: 'Waspadai angka arah mata angin dan tingkat curah hujan (mm/jam).',
    questions: [],
  },
  {
    id: 'set-kikikakitori-4',
    title: 'Drill Dikte Kilat: Kotoba & Kata Kerja Bentuk-Te',
    level: 'N4',
    levelLabel: 'MENENGAH (N4)',
    description: 'Latihan khusus dikte instan (Kakitori). Dengarkan pelafalan kalimat pendek dan ketik kata kunci yang tepat.',
    durationFormatted: '01:15',
    durationSeconds: 75,
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/train_station.ogg',
    status: 'aktif',
    bestScore: undefined,
    isPublished: true,
    questionCount: 3,
    tips: 'Konsentrasi pada bunyi panjang (Chouon) dan konsonan ganda (Sokuon).',
    questions: [
      {
        id: 'kk4-q1',
        setId: 'set-kikikakitori-4',
        orderIndex: 1,
        questionText: 'Dengarkan kalimat pendek berikut. Ketikkan kata kerja bentuk-te yang diucapkan penutur:',
        options: [
          { key: 'A', text: '待ってください (Matte kudasai)' },
          { key: 'B', text: '持ってください (Motte kudasai)' },
          { key: 'C', text: '来てください (Kite kudasai)' },
          { key: 'D', text: '見てください (Mite kudasai)' },
        ],
        correctKey: 'A',
        dictationTarget: ['まって', '待って', 'matte', 'まってください', 'mattekudasai'],
        dictationHint: 'Ketik kata kerja bentuk -te...',
        explanation: 'Penutur mengucapkan: 「ちょっとここで待ってください」 (Tolong tunggu sebentar di sini).',
      },
      {
        id: 'kk4-q2',
        setId: 'set-kikikakitori-4',
        orderIndex: 2,
        questionText: 'Dikte nama profesi atau peran yang disebutkan pembicara:',
        options: [
          { key: 'A', text: 'Dokter (いしゃ - Isha)' },
          { key: 'B', text: 'Guru / Sensei (せんせい - Sensei)' },
          { key: 'C', text: 'Pegawai Bank (ぎんこういん)' },
          { key: 'D', text: 'Penyanyi (かしゅ - Kashu)' },
        ],
        correctKey: 'B',
        dictationTarget: ['せんせい', '先生', 'sensei'],
        dictationHint: 'Ketik nama peran dalam kana/romaji...',
        explanation: 'Pembicara berkata: 「日本語の先生に質問をしました」 (Bertanya kepada guru bahasa Jepang).',
      },
      {
        id: 'kk4-q3',
        setId: 'set-kikikakitori-4',
        orderIndex: 3,
        questionText: 'Ketik kata sifat yang menggambarkan suasana cuaca hari ini:',
        options: [
          { key: 'A', text: 'Sangat Panas (あつい - Atsui)' },
          { key: 'B', text: 'Sangat Dingin (さむい - Samui)' },
          { key: 'C', text: 'Sejuk / Nyaman (すずしい - Suzushii)' },
          { key: 'D', text: 'Hangat (あたたかい - Atatakai)' },
        ],
        correctKey: 'C',
        dictationTarget: ['すずしい', '涼しい', 'suzushii', 'sejuk'],
        dictationHint: 'Ketik kata sifat dalam kana/romaji...',
        explanation: 'Pembicara berkata: 「今日は風があってとても涼しいですね」 (Hari ini ada angin dan sangat sejuk ya).',
      },
    ],
  },
];
