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
      { d: 'M53.13,44.75c3.21-0.28,21.65-2.73,26.47-3.14c3.4-0.29,4.84,1.4,4.84,4.27c0,5.84-0.07,20.47-0.07,31.63c0,2.15-0.03,3.37-0.03,4.68', type: '㇕a' },
      { d: 'M53.31,56.12c5.94-0.62,24.44-2.12,29.93-2.31', type: '㇐a' },
      { d: 'M53.25,67.62c7.62-0.5,22.88-1.75,29.74-1.93', type: '㇐a' },
      { d: 'M53.2,79.88c7.3-0.5,23.3-1.62,29.83-1.75', type: '㇐a' },
      { d: 'M20.25,18.75c3.63,1.74,9.38,7.17,10.29,9.88', type: '㇔' },
      { d: 'M14.5,49.5c1.62,0.88,3.24,0.42,4.25-0.25c2.38-1.58,7-5.5,10.5-8.5c1.5-1.29,3.5-0.5,2.5,2.25c-5.75,15.75-5,11.25,2.75,20.5c1.23,1.47,1.5,2.75,0.25,4c-1.25,1.25-6.75,7.75-10.25,10.75', type: '㇋' },
      { d: 'M13.25,83.75c3-0.5,8.87-0.89,13.5-0.42c7.25,0.73,26.84,6.72,31.5,7.78c12.25,2.79,18,3.75,26.5,4.42', type: '㇏' }
    ],
    steps: [
      { title: 'Titik Kiri Atas 首', desc: 'Goresan miring pendek dari kiri atas ke kanan bawah (Tome tegas).' },
      { title: 'Sapuan Kanan Atas 首', desc: 'Goresan miring lembut mengalir dari kanan atas ke kiri bawah.' },
      { title: 'Garis Horizontal Atas', desc: 'Tarik mendatar sedikit menanjak ke kanan, kunci di ujung kanan.' },
      { title: 'Sapuan Kiri Dalam', desc: 'Goresan miring tipis pengisi ruang atas radikal leher.' },
      { title: 'Garis Vertikal Kiri 目', desc: 'Tarik vertikal lurus ke bawah, pertahankan ketebalan merata.' },
      { title: 'Sudut Kanan & Hane 目', desc: 'Tarik horizontal lalu tekuk 90° ke bawah dengan lentikan ujung kuas tajam.' },
      { title: 'Garis Dalam Atas 目', desc: 'Garis horizontal tipis pertama pembagi ruang dalam mata.' },
      { title: 'Garis Dalam Bawah 目', desc: 'Garis horizontal tipis kedua pembagi ruang dalam mata.' },
      { title: 'Penutup Bawah 目', desc: 'Garis horizontal pengunci bagian dasar radikal mata.' },
      { title: 'Titik Awal Shinnyou (⻌)', desc: 'Mulai radikal jalan dengan titik melengkung di sisi kiri.' },
      { title: 'Lekukan Gelombang Shinnyou', desc: 'Bentuk lekukan zigzag halus mengalir (Z-stroke) dengan kontrol tekanan.' },
      { title: 'Sapuan Bawah (Harai Besar)', desc: 'Tekan kuas di bagian bawah membungkus seluruh karakter, lalu sapukan melebar meruncing ke kanan (Hirai agung).' }
    ]
  },
  yume: {
    code: '05922',
    name: '夢',
    meaning: 'Impian / Cita-cita',
    strokes: [
      { d: 'M25.25,18.75c1.12,1.12,1.38,2.38,1.5,3.75c1.12,12.75,1.75,20.25,2.25,27.75', type: '㇑' },
      { d: 'M27.5,20.25c15.25-1.75,41-3.75,52.25-4.25c3.25-0.14,4.75,1.75,4.25,4.75c-1.25,7.75-2.5,17-3.75,25.5', type: '㇕' },
      { d: 'M44.25,9.75c1,1,1.5,2.25,1.5,3.75c0,9.75-0.25,24.25-0.25,32.75', type: '㇑' },
      { d: 'M62.5,8.25c0.88,0.88,1.25,2.12,1.25,3.5c0,8.25-0.5,23.75-0.75,32.25', type: '㇑' },
      { d: 'M29.5,33.5c14.25-1.5,41.25-3.25,52.5-3.75', type: '㇐' },
      { d: 'M30,47.25c13.75-1.25,39.5-3,50.25-3.5', type: '㇐' },
      { d: 'M40.25,51.75c0.12,0.88-0.12,1.75-0.5,2.5c-2.38,4.62-8.38,12.12-16.75,17.25', type: '㇒' },
      { d: 'M57.75,49.25c0.88,0.88,1.12,2,1.12,3.5c0,5.75-0.12,12.25-0.12,17', type: '㇑' },
      { d: 'M60,53.25c5.75-0.75,17.25-2.5,22.75-3.25c2-0.27,3.5,1,3.25,3.25c-0.75,6.75-1.75,16.25-2.75,23', type: '㇕' },
      { d: 'M40.5,67.75c8.75-0.75,32-2.75,44.75-3.25', type: '㇐' },
      { d: 'M39.75,80.5c12.25-1,33.75-2.25,46.75-2.75', type: '㇐' },
      { d: 'M21.5,89.5c2.25,0.75,5.62,0.5,7.75,0.25c16.25-1.75,41-3.5,56.75-3.75c3.25-0.05,5.25,0.25,6.75,0.5', type: '㇐' },
      { d: 'M51.5,71.25c0.88,0.88,1.25,2,1.25,3.5c0,7.75-0.12,17.5-0.12,22.75', type: '㇑' }
    ],
    steps: [
      { title: 'Garis Kiri Rumput 艹', desc: 'Tarik vertikal ke bawah dengan bobot mantap.' },
      { title: 'Sudut Kanan Rumput 艹', desc: 'Garis horizontal dan tekukan bawah radikal atas.' },
      { title: 'Vertikal Tengah Kiri', desc: 'Garis vertikal penusuk radikal rumput sebelah kiri.' },
      { title: 'Vertikal Tengah Kanan', desc: 'Garis vertikal penusuk radikal rumput sebelah kanan.' },
      { title: 'Horizontal Tengah', desc: 'Garis horizontal pembatas bagian atas.' },
      { title: 'Horizontal Penutup Bagian Atas', desc: 'Kunci bagian atas kanji sebelum memasuki radikal mata.' },
      { title: 'Sapuan Kiri Bawah', desc: 'Harai miring lembut mengarah ke kiri bawah.' },
      { title: 'Garis Vertikal Tengah Bawah', desc: 'Pondasi tegak lurus penyangga karakter.' },
      { title: 'Sudut Kanan Bawah', desc: 'Lekukan kotak kanan dengan ketebalan presisi.' },
      { title: 'Garis Tengah Kotak Bawah', desc: 'Pembagi ruang kotak bawah.' },
      { title: 'Garis Penutup Kotak Bawah', desc: 'Kunci kotak tengah sebelum goresan dasar.' },
      { title: 'Garis Dasar Bawah Terpanjang', desc: 'Tarik mendatar panjang menyeimbangkan seluruh karakter.' },
      { title: 'Tiang Tengah Penutup (Tome)', desc: 'Hentakan kuas vertikal tegak lurus mengunci pusat karakter.' }
    ]
  },
  wa: {
    code: '0548c',
    name: '和',
    meaning: 'Harmoni / Damai',
    strokes: [
      { d: 'M39.75,15.75c0.06,0.85-0.09,1.75-0.45,2.53c-2.3,5-7.8,12.72-15.55,18.47', type: '㇒' },
      { d: 'M13.75,41.25c2.25,0.62,4.68,0.48,6.96,0.22c8.17-0.92,17.54-2.47,24.92-3.32c2-0.23,3.87-0.15,5.62,0.35', type: '㇐' },
      { d: 'M33.25,28.25c0.91,0.91,1.25,2.12,1.25,3.5c0,8.25-0.25,48.25-0.25,58.75', type: '㇑' },
      { d: 'M33.5,41.25c0,1.38-0.62,2.75-1.5,3.75c-5.75,6.5-12.75,13.75-20.75,18.75', type: '㇒' },
      { d: 'M37.5,47.75c3.75,2.25,7.75,6.5,10.25,9.75', type: '㇔' },
      { d: 'M57.75,34.25c0.88,0.88,1.25,2.12,1.25,3.5c0,12.75-0.25,32.25-0.25,42.75', type: '㇑' },
      { d: 'M60,36.25c7.25-1.25,21.5-3.25,27.25-4c2.5-0.33,4.25,1.25,4,3.75c-1,10.75-2.25,27.5-3.25,39.5', type: '㇕' },
      { d: 'M60.25,78.25c6.5-0.75,18.75-1.75,27-2.25', type: '㇐' }
    ],
    steps: [
      { title: 'Sapuan Atas Nogome (禾)', desc: 'Goresan miring kiri tajam di puncak padi.' },
      { title: 'Garis Horizontal Padi', desc: 'Tarik mendatar seimbang membelah tangkai.' },
      { title: 'Tiang Vertikal Padi', desc: 'Tarik lurus ke bawah dengan ketebalan stabil.' },
      { title: 'Sapuan Kiri Bawah', desc: 'Harai lembut melengkung ke kiri bawah.' },
      { title: 'Titik Kanan (Tome)', desc: 'Hentakan titik kuas di sisi kanan batang padi.' },
      { title: 'Garis Vertikal Mulut (口)', desc: 'Pondasi kiri kotak mulut tegak lurus.' },
      { title: 'Sudut Kanan Mulut (口)', desc: 'Garis horizontal lalu tekukan ke bawah tajam.' },
      { title: 'Penutup Bawah Mulut (口)', desc: 'Kunci dasar kotak mulut dengan kedua ujung sedikit menonjol.' }
    ]
  }
};
