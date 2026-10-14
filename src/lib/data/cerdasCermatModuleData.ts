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
    questionCount: 6,
    description: 'Latihan tradisi tahunan (matsuri, hanami), etiket teh, dan peribahasa klasik Jepang.',
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
    questionCount: 6,
    description: 'Cakupan pulau utama, prefektur, kastil bersejarah, era restorasi Meiji, dan samurai.',
    bestScore: 100,
    bestTimeFormatted: '02:15',
    isCompleted: true,
  },
  {
    id: 'set-cc-3',
    title: 'Simulasi 03: Tata Bahasa Cepat & Keigo',
    topicCategory: 'tata_bahasa',
    categoryLabel: 'Tata Bahasa Cepat',
    difficultyLevel: 'Menengah (N4)',
    durationMinutes: 5,
    questionCount: 6,
    description: 'Partikel jebakan, pola kalimat sopan Keigo (Sonkeigo & Kenjougo), dan bentuk konjugasi kerja.',
    bestScore: 90,
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
    questionCount: 6,
    description: 'Transportasi Shinkansen, kuliner Washoku, animasi Studio Ghibli, dan etiket konbini.',
    bestScore: 85,
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
    questionCount: 6,
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
    difficultyLevel: 'Mahir (N3)',
    durationMinutes: 5,
    questionCount: 6,
    description: 'Kuis gabungan kecepatan tinggi persiapan turnamen antarsekolah Jawa Timur.',
    bestScore: 95,
    bestTimeFormatted: '02:20',
    isCompleted: true,
  },
];

export const CC_ADDITIONAL_QUESTIONS: Record<string, Question[]> = {
  // Paket 2: Geografi & Sejarah
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
      explanation: 'Honshu adalah pulau terbesar di Jepang (sekitar 60% total luas wilayah) tempat Tokyo, Osaka, Kyoto, dan Nagoya berada.',
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
      explanation: 'Kastil Himeji (Himeji-jo) adalah salah satu warisan dunia UNESCO tertua di Jepang yang mempertahankan struktur kayu aslinya.',
      order_index: 2,
    },
    {
      id: 'q-cc2-3',
      set_id: 'set-cc-2',
      question_text: 'Kereta cepat Shinkansen jalur Tokaido pertama kali diresmikan menghubungkan Tokyo dan Shin-Osaka pada tahun perhelatan Olimpiade Tokyo yaitu...',
      options: [
        { key: 'A', text: '1945' },
        { key: 'B', text: '1964' },
        { key: 'C', text: '1970' },
        { key: 'D', text: '1989' },
      ],
      correct_key: 'B',
      explanation: 'Tokaido Shinkansen dibuka pada 1 Oktober 1964, menjadikannya jalur kereta berkecepatan tinggi komersial pertama di dunia.',
      order_index: 3,
    },
    {
      id: 'q-cc2-4',
      set_id: 'set-cc-2',
      question_text: 'Tokoh pemersatu Jepang yang mendirikan Keshogunan Tokugawa dan memindahkan pusat administrasi ke Edo (Tokyo) adalah...',
      options: [
        { key: 'A', text: 'Oda Nobunaga' },
        { key: 'B', text: 'Toyotomi Hideyoshi' },
        { key: 'C', text: 'Tokugawa Ieyasu' },
        { key: 'D', text: 'Minamoto no Yoritomo' },
      ],
      correct_key: 'C',
      explanation: 'Tokugawa Ieyasu memenangkan Pertempuran Sekigahara pada tahun 1600 dan mendirikan keshogunan yang memerintah selama lebih dari 250 tahun.',
      order_index: 4,
    },
    {
      id: 'q-cc2-5',
      set_id: 'set-cc-2',
      question_text: 'Berapakah jumlah total prefektur (Todofuken) di seluruh negara Jepang saat ini?',
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
    {
      id: 'q-cc2-6',
      set_id: 'set-cc-2',
      question_text: 'Danau air tawar terbesar di Jepang yang terletak di Prefektur Shiga dan menjadi sumber air penting wilayah Kansai adalah...',
      options: [
        { key: 'A', text: 'Danau Biwa (琵琶湖)' },
        { key: 'B', text: 'Danau Ashi (芦ノ湖)' },
        { key: 'C', text: 'Danau Yamanaka (山中湖)' },
        { key: 'D', text: 'Danau Towada (十和田湖)' },
      ],
      correct_key: 'A',
      explanation: 'Danau Biwa (Biwa-ko) di Prefektur Shiga adalah danau purba tertua sekaligus terbesar di Jepang dengan luas sekitar 670 km².',
      order_index: 6,
    },
  ],

  // Paket 3: Tata Bahasa Cepat & Keigo
  'set-cc-3': [
    {
      id: 'q-cc3-1',
      set_id: 'set-cc-3',
      question_text: 'Pilihlah bentuk bahasa halus penghormatan (Sonkeigo) dari kata kerja 食べる (Taberu = Makan) saat berbicara kepada tamu kehormatan:',
      options: [
        { key: 'A', text: 'いただきます (Itadakimasu)' },
        { key: 'B', text: '召し上がります (Meshiaagarimasu)' },
        { key: 'C', text: '食べられます (Taberaremasu)' },
        { key: 'D', text: 'まいります (Mairimasu)' },
      ],
      correct_key: 'B',
      explanation: 'Sonkeigo untuk 食べる dan 飲む adalah 召し上がる (Meshiagaru). Bentuk Itadaku adalah Kenjougo (merendahkan diri sendiri).',
      order_index: 1,
    },
    {
      id: 'q-cc3-2',
      set_id: 'set-cc-3',
      question_text: 'Pilihlah partikel yang tepat untuk melengkapi kalimat: 毎朝、公園【？】散歩します。',
      options: [
        { key: 'A', text: 'に (Ni)' },
        { key: 'B', text: 'を (O)' },
        { key: 'C', text: 'で (De)' },
        { key: 'D', text: 'へ (He)' },
      ],
      correct_key: 'B',
      explanation: 'Kata kerja gerakan melintasi area terbuka seperti 散歩する (jalan-jalan), 飛ぶ (terbang), 渡る (menyeberang) menggunakan partikel を (o).',
      order_index: 2,
    },
    {
      id: 'q-cc3-3',
      set_id: 'set-cc-3',
      question_text: 'Bentuk bahasa sopan merendahkan diri (Kenjougo) dari kata 行く (Iku = Pergi) atau 来る (Kuru = Datang) adalah...',
      options: [
        { key: 'A', text: 'いらっしゃいます (Irasshaimasu)' },
        { key: 'B', text: 'まいります (Mairimasu)' },
        { key: 'C', text: 'おっしゃいます (Osshaimasu)' },
        { key: 'D', text: 'ごらんになります (Goran ni narimasu)' },
      ],
      correct_key: 'B',
      explanation: '参る (Mairu) adalah bentuk Kenjougo untuk Iku dan Kuru, sedangkan いらっしゃる (Irassharu) adalah bentuk Sonkeigo (penghormatan lawan bicara).',
      order_index: 3,
    },
    {
      id: 'q-cc3-4',
      set_id: 'set-cc-3',
      question_text: 'Pilihlah bentuk sambung konjugasi yang tepat: 雨が降った【？】、試合は中止になりませんでした。',
      options: [
        { key: 'A', text: 'ので (Node)' },
        { key: 'B', text: 'のに (Noni)' },
        { key: 'C', text: 'から (Kara)' },
        { key: 'D', text: 'なら (Nara)' },
      ],
      correct_key: 'B',
      explanation: 'Pola kalimat 〜のに (Noni) digunakan untuk menyatakan kontradiksi / kejadian yang bertolak belakang dengan perkiraan ("padahal / meskipun").',
      order_index: 4,
    },
    {
      id: 'q-cc3-5',
      set_id: 'set-cc-3',
      question_text: 'Apakah padanan ungkapan yang diucapkan saat seseorang meninggalkan rumah atau kantor sementara waktu?',
      options: [
        { key: 'A', text: 'いってきます (Ittekimasu)' },
        { key: 'B', text: 'いってらっしゃい (Itterasshai)' },
        { key: 'C', text: 'ただいま (Tadaima)' },
        { key: 'D', text: 'おかえりなさい (Okaerinasai)' },
      ],
      correct_key: 'A',
      explanation: 'Orang yang pergi mengucapkan "Ittekimasu" (Saya berangkat dulu), dan orang yang di rumah menjawab "Itterasshai" (Hati-hati di jalan).',
      order_index: 5,
    },
    {
      id: 'q-cc3-6',
      set_id: 'set-cc-3',
      question_text: 'Pilihlah partikel yang tepat untuk menyatakan perbandingan: 日本語と英語と【？】が難しいですか。',
      options: [
        { key: 'A', text: 'どちら (Dochira)' },
        { key: 'B', text: 'どれ (Dore)' },
        { key: 'C', text: 'どこ (Doko)' },
        { key: 'D', text: 'だれ (Dare)' },
      ],
      correct_key: 'A',
      explanation: 'Untuk membandingkan antara DUA hal (A to B to), digunakan kata tanya どちら (Dochira). Jika tiga pilihan atau lebih, gunakan どれ (Dore).',
      order_index: 6,
    },
  ],

  // Paket 4: Budaya Pop & Nihon Shakai
  'set-cc-4': [
    {
      id: 'q-cc4-1',
      set_id: 'set-cc-4',
      question_text: 'Studio animasi legendaris Jepang yang memproduksi film pemenang Academy Award 『Spirited Away』 (千と千尋の神隠し) didirikan oleh Hayao Miyazaki adalah...',
      options: [
        { key: 'A', text: 'Toei Animation' },
        { key: 'B', text: 'Studio Ghibli (スタジオジブリ)' },
        { key: 'C', text: 'Kyoto Animation' },
        { key: 'D', text: 'MAPPA' },
      ],
      correct_key: 'B',
      explanation: 'Studio Ghibli didirikan pada tahun 1985 oleh Hayao Miyazaki dan Isao Takahata, dikenal dengan karya animasi berkualitas tinggi berkelas dunia.',
      order_index: 1,
    },
    {
      id: 'q-cc4-2',
      set_id: 'set-cc-4',
      question_text: 'Kawasan terkenal di Tokyo yang dijuluki surga budaya anime, manga, barang elektronik, dan maid cafe adalah...',
      options: [
        { key: 'A', text: 'Ginza' },
        { key: 'B', text: 'Akihabara (秋葉原)' },
        { key: 'C', text: 'Roppongi' },
        { key: 'D', text: 'Asakusa' },
      ],
      correct_key: 'B',
      explanation: 'Akihabara (dijuluki Akiba) adalah pusat subkultur otaku dan pasar elektronik terbesar di Tokyo.',
      order_index: 2,
    },
    {
      id: 'q-cc4-3',
      set_id: 'set-cc-4',
      question_text: 'Etiket apakah yang dijunjung tinggi saat menaiki kereta umum (Densha) di Jepang demi kenyamanan sesama penumpang?',
      options: [
        { key: 'A', text: 'Mengatur ponsel ke mode senyap (manner mode) dan tidak menelepon' },
        { key: 'B', text: 'Menaruh tas ransel besar di lantai lorong' },
        { key: 'C', text: 'Berbicara dengan suara lantang' },
        { key: 'D', text: 'Makan mie ramen berkuah panas' },
      ],
      correct_key: 'A',
      explanation: 'Di kereta Jepang, penumpang wajib mengaktifkan manner mode (マナーモード) dan menahan diri dari berbicara di telepon.',
      order_index: 3,
    },
    {
      id: 'q-cc4-4',
      set_id: 'set-cc-4',
      question_text: 'Kuliner tradisional Jepang (Washoku) yang terdaftar sebagai Warisan Budaya Takbenda UNESCO memiliki prinsip dasar penyajian berupa...',
      options: [
        { key: 'A', text: 'Ichiju Sansai (一汁三菜 - Satu sup dan tiga lauk pauk seimbang)' },
        { key: 'B', text: 'Penyajian gorengan berminyak tinggi' },
        { key: 'C', text: 'Makanan penutup manis sebelum hidangan utama' },
        { key: 'D', text: 'Porsi tunggal raksasa' },
      ],
      correct_key: 'A',
      explanation: 'Ichiju Sansai (1 sup miso + nasi + 3 lauk pauk bergizi seimbang) adalah fondasi nutrisi makanan rumahan Jepang.',
      order_index: 4,
    },
    {
      id: 'q-cc4-5',
      set_id: 'set-cc-4',
      question_text: 'Boneka tradisional bulat tanpa lengan dan kaki berwarna merah pembawa keberuntungan yang matanya digambar saat cita-cita tercapai adalah...',
      options: [
        { key: 'A', text: 'Kokeshi' },
        { key: 'B', text: 'Daruma (達磨)' },
        { key: 'C', text: 'Maneki Neko' },
        { key: 'D', text: 'Teru Teru Bozu' },
      ],
      correct_key: 'B',
      explanation: 'Boneka Daruma melambangkan ketekunan. Mata kiri digambar saat membuat harapan, dan mata kanan digambar ketika harapan itu terwujud.',
      order_index: 5,
    },
    {
      id: 'q-cc4-6',
      set_id: 'set-cc-4',
      question_text: 'Kotak bekal makan siang khas Jepang yang ditata cantik penuh gizi dan sering dihias karakter lucu (Kyaraben) disebut...',
      options: [
        { key: 'A', text: 'Bento (弁当)' },
        { key: 'B', text: 'Donburi (丼)' },
        { key: 'C', text: 'Nabe (鍋)' },
        { key: 'D', text: 'Oden (おでん)' },
      ],
      correct_key: 'A',
      explanation: 'Bento (Obento) adalah tradisi bekal makan siang Jepang yang mengedepankan estetika warna, keseimbangan gizi, dan kepraktisan.',
      order_index: 6,
    },
  ],

  // Paket 5: Peribahasa Kotowaza Kilat
  'set-cc-5': [
    {
      id: 'q-cc5-1',
      set_id: 'set-cc-5',
      question_text: 'Peribahasa 『井の中の蛙大海を知らず』 (I no naka no kawazu taikai o shirazu - Katak dalam sumur tak tahu lautan luas) semakna dengan peribahasa Indonesia...',
      options: [
        { key: 'A', text: 'Seperti katak dalam tempurung' },
        { key: 'B', text: 'Besar pasak daripada tiang' },
        { key: 'C', text: 'Bagai telur di ujung tanduk' },
        { key: 'D', text: 'Air susu dibalas air tuba' },
      ],
      correct_key: 'A',
      explanation: 'Pepatah ini mengibaratkan orang yang berpandangan sempit dan merasa dirinya serba tahu karena tidak pernah melihat dunia luar.',
      order_index: 1,
    },
    {
      id: 'q-cc5-2',
      set_id: 'set-cc-5',
      question_text: 'Peribahasa 『塵も積もれば山となる』 (Chiri mo tsumoreba yama to naru - Debu pun bila menumpuk akan menjadi gunung) memiliki padanan...',
      options: [
        { key: 'A', text: 'Sedikit demi sedikit, lama-lama menjadi bukit' },
        { key: 'B', text: 'Gali lubang tutup lubang' },
        { key: 'C', text: 'Nasi sudah menjadi bubur' },
        { key: 'D', text: 'Musang berbulu domba' },
      ],
      correct_key: 'A',
      explanation: 'Mengajarkan bahwa usaha kecil yang dikumpulkan secara konsisten setiap hari pada akhirnya akan menghasilkan pencapaian yang luar biasa.',
      order_index: 2,
    },
    {
      id: 'q-cc5-3',
      set_id: 'set-cc-5',
      question_text: 'Peribahasa 『猫に小判』 (Neko ni koban - Koin emas kuno untuk kucing) bermakna...',
      options: [
        { key: 'A', text: 'Memberikan benda sangat berharga kepada pihak yang tidak mengerti nilainya' },
        { key: 'B', text: 'Memelihara hewan peliharaan membawa rezeki' },
        { key: 'C', text: 'Membeli barang mahal dengan harga murah' },
        { key: 'D', text: 'Menghabiskan uang untuk pesta pora' },
      ],
      correct_key: 'A',
      explanation: 'Pepatah ini setara dengan "memberikan mutiara kepada babi", yaitu memberi sesuatu yang berharga kepada orang yang tak bisa menghargainya.',
      order_index: 3,
    },
    {
      id: 'q-cc5-4',
      set_id: 'set-cc-5',
      question_text: 'Pepatah 『石の上にも三年』 (Ishi no ue ni mo san nen - Duduk di atas batu dingin pun selama tiga tahun akan terasa hangat) mengajarkan tentang...',
      options: [
        { key: 'A', text: 'Kesabaran dan ketekunan menjalani masa-masa sulit pasti membuahkan hasil' },
        { key: 'B', text: 'Jangan mudah percaya pada orang asing' },
        { key: 'C', text: 'Musim dingin di Jepang sangat menusuk tulang' },
        { key: 'D', text: 'Membangun rumah di daerah perbukitan' },
      ],
      correct_key: 'A',
      explanation: 'Pepatah ini menyimbolkan bahwa ketabahan dan ketekunan bertahan dalam kesulitan pada akhirnya akan mendatangkan kesuksesan.',
      order_index: 4,
    },
    {
      id: 'q-cc5-5',
      set_id: 'set-cc-5',
      question_text: 'Pepatah 『能ある鷹は爪を隠す』 (Nou aru taka wa tsume o kakusu - Elang yang cakap menyembunyikan cakarnya) menggambarkan orang yang...',
      options: [
        { key: 'A', text: 'Orang yang benar-benar hebat dan cerdas tidak suka menyombongkan keahliannya' },
        { key: 'B', text: 'Orang yang penakut dan mudah lari dari pertarungan' },
        { key: 'C', text: 'Pencuri yang bersembunyi di kegelapan malam' },
        { key: 'D', text: 'Pemburu burung di hutan lebat' },
      ],
      correct_key: 'A',
      explanation: 'Semakna dengan "padi makin berisi makin merunduk", orang berilmu tinggi bersikap rendah hati dan tidak pamer kekuatan sembarangan.',
      order_index: 5,
    },
    {
      id: 'q-cc5-6',
      set_id: 'set-cc-5',
      question_text: 'Pepatah 『急がば回れ』 (Isogaba maware - Jika sedang terburu-buru, pilihlah jalan memutar yang aman) bermakna...',
      options: [
        { key: 'A', text: 'Pilihlah jalan yang aman dan pasti daripada mengambil jalan pintas berisiko' },
        { key: 'B', text: 'Berlari secepat mungkin menuju garis finish' },
        { key: 'C', text: 'Menghindari kemacetan lalu lintas tol' },
        { key: 'D', text: 'Memutar jam dinding agar tidak telat' },
      ],
      correct_key: 'A',
      explanation: 'Mengingatkan agar tidak gegabah mengambil jalan pintas berbahaya saat terdesak waktu; cara teraman adalah yang paling terpercaya.',
      order_index: 6,
    },
  ],

  // Paket 6: Rapid Knowledge Blitz Final
  'set-cc-6': [
    {
      id: 'q-cc6-1',
      set_id: 'set-cc-6',
      question_text: 'Pintu gerbang tradisional berwarna merah menyala yang menandai batas peralihan dari alam manusia menuju area suci kuil Shinto disebut...',
      options: [
        { key: 'A', text: 'Torii (鳥居)' },
        { key: 'B', text: 'Sanmon (山門)' },
        { key: 'C', text: 'Fusuma (襖)' },
        { key: 'D', text: 'Shoji (障子)' },
      ],
      correct_key: 'A',
      explanation: 'Torii adalah gerbang simbolis pemisah dunia profan dan dunia suci para Kami (dewa) di kuil Shinto.',
      order_index: 1,
    },
    {
      id: 'q-cc6-2',
      set_id: 'set-cc-6',
      question_text: 'Pemberian uang amplop hadiah tahun baru dari orang tua kepada anak-anak di Jepang dikenal dengan istilah...',
      options: [
        { key: 'A', text: 'Otoshidama (お年玉)' },
        { key: 'B', text: 'Omiyage (お土産)' },
        { key: 'C', text: 'Okaeshi (お返し)' },
        { key: 'D', text: 'Otyugen (お中元)' },
      ],
      correct_key: 'A',
      explanation: 'Otoshidama adalah amplop uang saku yang diberikan kepada anak-anak saat perayaan tahun baru (Shougatsu).',
      order_index: 2,
    },
    {
      id: 'q-cc6-3',
      set_id: 'set-cc-6',
      question_text: 'Seni melipat kertas tanpa menggunakan gunting atau lem hingga membentuk burung bangau (Orizuru) disebut...',
      options: [
        { key: 'A', text: 'Origami (折り紙)' },
        { key: 'B', text: 'Kirigami (切り紙)' },
        { key: 'C', text: 'Ikebana (生け花)' },
        { key: 'D', text: 'Ukiyo-e (浮世絵)' },
      ],
      correct_key: 'A',
      explanation: 'Origami (Ori = melipat, Kami = kertas) adalah seni tradisional melipat kertas khas Jepang.',
      order_index: 3,
    },
    {
      id: 'q-cc6-4',
      set_id: 'set-cc-6',
      question_text: 'Upacara peralihan kedewasaan bagi pemuda-pemudi Jepang yang menginjak usia 18-20 tahun dirayakan pada hari...',
      options: [
        { key: 'A', text: 'Seijin no Hi (成人の日)' },
        { key: 'B', text: 'Kodomo no Hi (こどもの日)' },
        { key: 'C', text: 'Keirou no Hi (敬老の日)' },
        { key: 'D', text: 'Bunka no Hi (文化の日)' },
      ],
      correct_key: 'A',
      explanation: 'Seijin no Hi diperingati pada Senin kedua bulan Januari untuk merayakan transisi para pemuda menjadi orang dewasa yang mandiri.',
      order_index: 4,
    },
    {
      id: 'q-cc6-5',
      set_id: 'set-cc-6',
      question_text: 'Peralatan makan sumpit Jepang diletakkan di atas sandaran keramik kecil agar tidak menyentuh meja yang disebut...',
      options: [
        { key: 'A', text: 'Hashioki (箸置き)' },
        { key: 'B', text: 'Owan (お椀)' },
        { key: 'C', text: 'Chawan (茶碗)' },
        { key: 'D', text: 'Donburi (丼)' },
      ],
      correct_key: 'A',
      explanation: 'Hashioki (penyangga sumpit) digunakan untuk menjaga kebersihan ujung sumpit agar tidak bersentuhan langsung dengan taplak meja.',
      order_index: 5,
    },
    {
      id: 'q-cc6-6',
      set_id: 'set-cc-6',
      question_text: 'Musim panas di Jepang identik dengan tradisi menyalakan kembang api spektakuler di tepi sungai yang disebut...',
      options: [
        { key: 'A', text: 'Hanabi Taikai (花火大会)' },
        { key: 'B', text: 'Hanami (花見)' },
        { key: 'C', text: 'Tsukimi (月見)' },
        { key: 'D', text: 'Yukimi (雪見)' },
      ],
      correct_key: 'A',
      explanation: 'Hanabi (bunga api) Taikai adalah festival pesta kembang api akbar musim panas di mana orang-orang mengenakan pakaian Yukata.',
      order_index: 6,
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
