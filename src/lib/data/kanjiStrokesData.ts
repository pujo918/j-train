export interface KanjiStroke {
  d: string;
  type: string;
}

export interface KanjiModel {
  code: string;
  name: string;
  meaning: string;
  strokes: KanjiStroke[];
  steps: {
    title: string;
    desc: string;
  }[];
}

export const KANJI_MODELS: Record<string, KanjiModel> = {
  michi: {
    code: '09053',
    name: '道',
    meaning: 'Jalan / Kehidupan',
    strokes: [
      { d: 'M49.38,14.88c2.61,1.78,6.73,7.3,7.38,10.06', type: '㇔' },
      { d: 'M77.25,12.5c0.06,0.84-0.03,1.66-0.37,2.42c-1.38,3.08-3.38,6.7-6.63,10.2', type: '㇒' },
      { d: 'M42.06,32.6c1.75,0.45,4.97,0.38,6.7,0.2c9.99-1.05,25.86-2.93,36.82-3.2c2.91-0.07,4.8,0.15,6.12,0.44', type: '㇐' },
      { d: 'M64.26,33.62c0.25,0.1-0.23,1.75-0.39,2.04c-1.03,1.93-2.08,4.55-4.5,7.09', type: '㇒' },
      { d: 'M51.06,43.52c0.77,0.77,1.13,1.71,1.13,2.82c0,0.9-0.1,22.98-0.06,31.9c0.01,2.08,0.03,3.45,0.06,3.66', type: '㇑' },
      { d: 'M53.01,45.09c6.24-0.71,22.66-2.75,24.6-2.88c1.96-0.14,3.35,0.55,3.35,2.81c0,1.08-0.57,23.4-0.8,32.24c-0.05,2-0.09,3.28-0.12,3.43', type: '㇕a' },
      { d: 'M52.9,55.9c6.1-0.4,20.85-2.15,26.64-2.34', type: '㇐a' },
      { d: 'M53.11,67.65c6.85-0.47,19.47-1.75,26.13-1.75', type: '㇐a' },
      { d: 'M53.36,79.25c5.14,0,18.66-1.07,25.31-1.07', type: '㇐a' },
      { d: 'M19.75,20c3.38,1.75,8,6.12,9.5,8.75', type: '㇔' },
      { d: 'M13,51.53c2.25,0.86,3.75,0.43,4.75,0.22s9-3.47,10.5-3.9c2.96-0.85,4.22,0.21,2.44,3.03c-6.56,10.38-6.81,8.5-0.11,14.4c2.39,2.1,2.15,3.52-0.57,5.48C25.5,74,21.75,76.25,17.5,79.04', type: '㇋' },
      { d: 'M12.5,81.71c3.11-0.47,9.22-0.87,13.97-0.71c7.15,0.25,31.13,8.25,35.71,9.46C74.61,93.76,81.62,95.5,91,96.05', type: '㇏a' },
    ],
    steps: [
      { title: 'Titik Kiri Atas 首', desc: 'Titik miring pendek ke kanan bawah dengan tome (hentakan kuas) tegas di kepala radikal 首.' },
      { title: 'Sapuan Kanan Atas 首', desc: 'Sapuan kuas miring lembut mengalir dari kanan atas ke kiri bawah penyeimbang titik pertama.' },
      { title: 'Garis Horizontal Atas', desc: 'Tarik mendatar sedikit menanjak ke kanan (5°), beri tekanan stabil dan kunci di ujung kanan.' },
      { title: 'Sapuan Kiri Dalam', desc: 'Sapuan miring tajam pengisi rongga atas radikal leher/kepala.' },
      { title: 'Garis Vertikal Kiri 目', desc: 'Tiang vertikal kiri radikal mata, tarik tegak lurus dengan ketebalan sumi merata.' },
      { title: 'Sudut Kanan & Hane 目', desc: 'Tarik horizontal lalu tekuk tajam 90° ke bawah dengan lentikan ujung kuas rapi.' },
      { title: 'Garis Dalam Atas 目', desc: 'Garis horizontal tipis pertama membagi ruang dalam mata secara proporsional.' },
      { title: 'Garis Dalam Bawah 目', desc: 'Garis horizontal tipis kedua penyeimbang ruang dalam mata.' },
      { title: 'Penutup Bawah 目', desc: 'Kunci bagian dasar mata dengan garis horizontal, ujung kanan menyentuh tiang vertikal.' },
      { title: 'Titik Awal Shinnyou (⻌)', desc: 'Mulai radikal jalan dengan titik melengkung anggun di sisi kiri kanvas.' },
      { title: 'Lekukan Gelombang Shinnyou', desc: 'Tarik garis zigzag mengalir dengan ritme tekanan kuas: tekan, lepas tipis, lalu tekuk ke bawah.' },
      { title: 'Sapuan Bawah (Harai Besar)', desc: 'Tekan kuas di bawah membungkus seluruh karakter, lalu sapukan melebar meruncing ke kanan (Harai agung).' },
    ]
  },
  yume: {
    code: '05922',
    name: '夢',
    meaning: 'Impian / Cita-cita',
    strokes: [
      { d: 'M24.28,21.48c1.77,0.72,4.35,0.71,6.23,0.51c12.23-1.36,34.88-3.62,47.86-4.25c2.7-0.13,5.44-0.32,8.09,0.33', type: '㇐' },
      { d: 'M39.8,11.62c0.79,0.79,1.45,1.78,1.61,2.38c1.48,5.64,2.74,11.45,3.16,13.5', type: '㇑a' },
      { d: 'M69.48,10c0.52,0.75,0.62,1.89,0.32,2.87c-1.76,5.76-2.31,7.39-4.23,12.8', type: '㇑a' },
      { d: 'M29,32.96c1,0.67,1.12,1.81,1.31,2.52c0.81,3.02,1.47,5.3,2.08,8.24c0.28,1.33,0.52,2.62,0.69,3.75', type: '㇑' },
      { d: 'M31.04,34.63c13.83-1.51,38.46-3.88,49.82-4.64c2.1-0.14,4.14,1.01,3.32,3.87c-0.53,1.86-1.02,3.79-1.97,6.46c-0.57,1.62-0.95,2.49-1.59,3.94', type: '㇕a' },
      { d: 'M47.31,33.75c0.66,0.66,1.19,1.35,1.41,2.75c0.48,3.05,0.95,5.72,1.08,7.03', type: '㇑a' },
      { d: 'M64.75,33.47c0.37,0.65,0.44,1.55,0.24,2.54c-0.75,3.86-1,5.28-1.29,6.53', type: '㇑a' },
      { d: 'M34.24,46.12c9.38-0.99,36.38-2.99,45.84-3.21', type: '㇐a' },
      { d: 'M24.25,53.5c-1.5,7.25-4.25,12.62-6.75,15.75', type: '㇔' },
      { d: 'M24.72,56c3.53,0,40.15-4,62.97-4.75c12.05-0.4,4.06,6-0.44,9.75', type: '㇖b' },
      { d: 'M52.27,56.64c0.23,1.36-0.36,2.73-0.95,3.49C47.5,65,39.27,72.91,28.66,77.98', type: '㇒' },
      { d: 'M50.49,65.82c1.01,0.18,2.25,0.21,2.99,0.11C56.93,65.5,62,65,67.93,64.52c3.5-0.29,4.17,1.76,2.48,3.83C60.5,80.5,47,92,24.25,100.25', type: '㇇' },
      { d: 'M44.5,74.38c3.1,1.06,8.01,4.35,8.78,5.99', type: '㇔' },
    ],
    steps: [
      { title: 'Garis Horizontal Rumput 艹', desc: 'Tarik garis mendatar tebal pembuka mahkota rumput dari kiri ke kanan.' },
      { title: 'Vertikal Kiri Rumput 艹', desc: 'Tusuk vertikal sisi kiri sedikit condong ke dalam, kunci di bawah (Tome).' },
      { title: 'Vertikal Kanan Rumput 艹', desc: 'Tusuk vertikal sisi kanan sedikit condong ke kiri, seimbang dengan tiang kiri.' },
      { title: 'Tiang Kiri Kotak Mata 目', desc: 'Tarik vertikal tegak lurus membentuk dinding kiri kotak kisi tengah.' },
      { title: 'Sudut Kanan Kotak Mata 目', desc: 'Tarik mendatar lalu belok 90° ke bawah membentuk kerangka luar kotak tengah.' },
      { title: 'Vertikal Dalam Kiri', desc: 'Garis vertikal tipis pembagi rongga kiri dalam kisi mata.' },
      { title: 'Vertikal Dalam Kanan', desc: 'Garis vertikal tipis pembagi rongga kanan dalam kisi mata.' },
      { title: 'Garis Penutup Kotak Mata', desc: 'Kunci dasar kisi mata dengan sapuan mendatar rapi menyatukan tiang vertikal.' },
      { title: 'Titik Kiri Atap 冖', desc: 'Titik miring ke bawah di sisi kiri penanda atap penutup (Wa-kanmuri).' },
      { title: 'Sudut Melipat Kanan Atap 冖', desc: 'Tarik mendatar membentang lalu tekuk sedikit ke kiri bawah membentuk kanopi pelindung.' },
      { title: 'Sapuan Miring Kiri Senja 夕', desc: 'Mulai di poros tengah bawah, sapukan kuas anggun melengkung tajam ke kiri bawah.' },
      { title: 'Lekukan Kurva Senja 夕', desc: 'Horizontal pendek lalu melengkung lembut ke kiri bawah menyerupai sabit bulan.' },
      { title: 'Titik Pusat Pengunci 夕', desc: 'Hentakan titik kuas (Tome) mantap di dalam ruang bulan sabit mengunci seluruh karakter 夢.' },
    ]
  },
  wa: {
    code: '0548c',
    name: '和',
    meaning: 'Harmoni / Damai',
    strokes: [
      { d: 'M48.62,15.5c0.03,0.72-0.29,1.64-1.04,2.34c-3.33,3.12-13.46,7.99-26.82,11.41', type: '㇒' },
      { d: 'M12.94,45.38c2.31,0.62,5.12,0.6,7.56,0.27c8.62-1.15,19.25-3.15,28.62-4.27c1.65-0.2,4.24-0.12,5.88,0.33', type: '㇐' },
      { d: 'M37.39,27.2c0.96,0.96,1.51,1.93,1.51,2.8c0,2.94,0,43.09-0.07,58.99C38.81,92,38.8,94.14,38.78,95', type: '㇑' },
      { d: 'M38.03,44.02c0,1.23-0.26,2.66-0.54,3.39c-4.68,11.92-14.53,26.71-23.49,32.9', type: '㇒' },
      { d: 'M41.14,53.81c4.38,1.75,9.87,7.12,11.8,10.63', type: '㇔/㇏' },
      { d: 'M60,47.19c0.97,0.97,1.52,2.14,1.76,3.43c1.26,6.69,2.17,15.52,3.12,23.48c0.17,1.41,0.33,2.8,0.49,4.14', type: '㇑' },
      { d: 'M62.44,48.81c11.87-1.69,21.33-2.94,27.06-3.67c2.81-0.36,4.46,0.83,3.89,3.77c-1.2,6.23-3.01,15.28-4.71,23.5', type: '㇕b' },
      { d: 'M65.6,75.56c9.62-1.12,16.1-1.83,22.04-2.37c1.03-0.09,2.04-0.18,3.07-0.26', type: '㇐b' },
    ],
    steps: [
      { title: 'Sapuan Atas Nogome (禾)', desc: 'Goresan miring kiri tajam di puncak padi penentu poros karakter.' },
      { title: 'Garis Horizontal Padi', desc: 'Tarik mendatar seimbang membelah tangkai padi dari kiri ke kanan.' },
      { title: 'Tiang Vertikal Padi', desc: 'Tarik lurus ke bawah menembus garis horizontal dengan ketebalan stabil.' },
      { title: 'Sapuan Kaki Kiri Padi', desc: 'Harai lembut melengkung dari persimpangan menuju kiri bawah.' },
      { title: 'Titik Kaki Kanan (Tome)', desc: 'Hentakan titik kuas di sisi kanan batang padi menyeimbangkan harai kiri.' },
      { title: 'Tiang Vertikal Kiri Mulut (口)', desc: 'Pondasi kiri kotak mulut sedikit condong ke kanan bawah.' },
      { title: 'Sudut Kanan Mulut (口)', desc: 'Garis horizontal lalu tekukan ke bawah tajam dengan sudut 90° tegas.' },
      { title: 'Penutup Bawah Mulut (口)', desc: 'Kunci dasar kotak mulut dengan garis horizontal, kedua ujung sedikit menonjol rapi.' },
    ]
  },
  chikara: {
    code: '0529b',
    name: '力',
    meaning: 'Kekuatan / Semangat Juang',
    strokes: [
      { d: 'M21.5,38.25c2.71,1.16,5.48,1.13,8.27,0.71c14.44-2.14,39.36-6.21,53.23-8.21c4.48-0.65,6.25,1.38,5.5,5.75c-2.81,16.37-9,38.75-20,53.25c-6.14,8.09-9.5,3-12.5-0.75', type: '㇆' },
      { d: 'M56.88,13.68c0.62,2.57,0.56,4.63,0,7.19c-4.11,18.97-16.53,49.27-43.49,68.79', type: '㇒' },
    ],
    steps: [
      { title: 'Sudut Lengkung & Hane (Tekuk Melenting)', desc: 'Tarik horizontal ke kanan, tekuk melengkung ke kiri bawah, lalu lentikkan kuas ke kiri atas dengan hentakan tajam (Yokoorikagi).' },
      { title: 'Sapuan Harai Menembus Tengah', desc: 'Mulai dari puncak poros tengah, sapukan kuas ke kiri bawah membentang meruncing megah memotong goresan pertama.' },
    ]
  },
  kokoro: {
    code: '05fc3',
    name: '心',
    meaning: 'Hati / Jiwa / Niat Murni',
    strokes: [
      { d: 'M16.88,52.75c0,6.32-1.46,17.69-3.75,23', type: '㇔' },
      { d: 'M31.25,49.25c9,22.75,27,35.5,53.25,32.25c7.75-0.96,7.25-4.75,3-9.5', type: '㇃' },
      { d: 'M50.25,26c2,5.12,7.5,13.75,8.75,7.75', type: '㇔a' },
      { d: 'M85.5,30c4,2.75,7.62,7,10.5,14', type: '㇔' },
    ],
    steps: [
      { title: 'Titik Kiri Luar (Tome Miring)', desc: 'Titik miring mantap di sisi kiri bawah kanvas, beri penekanan tome di ujung.' },
      { title: 'Lengkungan Harai Melingkar (Perut Hati)', desc: 'Mulai tegak, sapukan melengkung ke kanan bawah seperti mangkuk dasar, lalu lentikkan ujung kuas ke atas.' },
      { title: 'Titik Tengah Atas', desc: 'Titik gantung melayang di atas rongga perut hati, berada harmonis di poros tengah.' },
      { title: 'Titik Kanan Luar', desc: 'Titik penyeimbang di sisi kanan atas, letaknya sedikit lebih tinggi dari titik pertama mengunci keutuhan hati.' },
    ]
  },
  hikari: {
    code: '05149',
    name: '光',
    meaning: 'Cahaya / Kemilau Prestasi',
    strokes: [
      { d: 'M51.72,15.37c1.14,1.14,1.93,3.06,1.93,5.27c0,6.12,0.05,20.6-0.03,26.62', type: '㇑a' },
      { d: 'M26.5,26.25c4.01,2.63,10.36,10.84,11.37,14.94', type: '㇔' },
      { d: 'M77.5,20.5c0.06,0.86,0.01,1.7-0.21,2.54c-1.08,4.25-5.38,12.46-11.17,17.59', type: '㇒' },
      { d: 'M16.13,51.48c2.19,0.54,5,0.65,8.38,0.29c15.8-1.67,41.61-4.89,58.84-5.73c3.64-0.18,5.83,0.26,7.65,0.53', type: '㇐' },
      { d: 'M45.5,53.5c0.25,1.25,0.23,2.35-0.13,3.62C42.38,67.62,37.75,81.25,22,91.75', type: '㇒' },
      { d: 'M58.74,51.37c0.68,1.19,1.21,2.59,1.25,4.43c0.11,4.82-0.02,13.81-0.02,21.2c0,13,1.28,14.53,17.78,14.53c14.5,0,15.89-2.03,15.89-8.62', type: '㇟' },
    ],
    steps: [
      { title: 'Tiang Tengah Puncak', desc: 'Goresan vertikal pendek tepat di sumbu tengah atas pembuka percikan api.' },
      { title: 'Titik Kiri Puncak', desc: 'Titik miring kiri menyangga kobaran cahaya.' },
      { title: 'Sapuan Kanan Puncak', desc: 'Harai miring kanan lembut penyeimbang titik kiri.' },
      { title: 'Garis Horizon Pembagi', desc: 'Garis horizontal panjang membentang dari kiri ke kanan dengan kekuatan penuh.' },
      { title: 'Kaki Kiri (Sapuan Manusia)', desc: 'Goresan kaki kiri meruncing anggun melengkung ke kiri bawah.' },
      { title: 'Kaki Kanan (Lengkungan Menanjak)', desc: 'Tarik melengkung ke kanan bawah lalu lentikkan kuas tegak ke atas mengunci keseimbangan.' },
    ]
  },
  tomo: {
    code: '053cb',
    name: '友',
    meaning: 'Sahabat / Persahabatan',
    strokes: [
      { d: 'M17.88,37.23c2.13,0.54,5.78,0.58,7.89,0.29c17.48-2.39,35.98-4.39,54.65-5.48c3.54-0.21,5.68,0.01,7.46,0.28', type: '㇐' },
      { d: 'M48.22,14.14c0.53,2.11,0.53,4.3,0.31,6.73C47,38,33,72.5,15.5,85.25', type: '㇒' },
      { d: 'M42.66,54.86c1.09,0.27,2.51,0.28,3.59,0.14c6.88-0.88,16.62-3.25,22.43-4.88c3.45-0.97,4.6,1.45,3.11,4.55C66.5,65.62,48.12,87.75,24,96.5', type: '㇇' },
      { d: 'M41.25,63.5c5.15,0.45,27.5,18.62,40.93,26.36c3.2,1.84,6.65,3.76,10.32,4.39', type: '㇏' },
    ],
    steps: [
      { title: 'Garis Horizontal Atas', desc: 'Tarik mendatar kokoh sedikit menanjak, simbol bahu persahabatan yang bersanding.' },
      { title: 'Sapuan Miring Panjang (Harai Kiri)', desc: 'Sapuan kuas miring melengkung memanjang dari atas ke kiri bawah dengan ketebalan menurun teratur.' },
      { title: 'Lekukan Tangan Kanan (㇇)', desc: 'Horizontal pendek lalu belok miring ke kiri bawah membungkus ruang bawah.' },
      { title: 'Sapuan Agung Kanan Bawah (㇏)', desc: 'Mulai dari persimpangan, tekan kuas makin tebal lalu sapukan melebar meruncing ke kanan bawah.' },
    ]
  },
};
