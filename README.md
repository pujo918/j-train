# J-TRAIN (Japanese Competition Training Platform) ⛩️
### *Platform Pelatihan dan Bimbingan Intensif Kompetisi Bahasa Jepang MAN 1 Pasuruan*

---

## 1. Latar Belakang & Need Analysis Solusi
Platform **J-TRAIN** dikembangkan untuk mengatasi kesenjangan struktural pembelajaran dan bimbingan lomba bahasa Jepang di MAN 1 Pasuruan:
* **Rasio Pembina & Siswa:** 1 Sensei membina belasan siswa pada **6 cabang lomba** yang memiliki karakteristik uji dan penilaian sangat berbeda (Kanji, Cerdas Cermat, Kikikakitori, Rodoku, Seiyu, dan Shodou).
* **Waktu Tatap Muka Terbatas:** Hanya ±1 jam per sesi, 3 kali seminggu di lab bahasa.
* **Masalah Antrean Bimbingan:** Ketika Sensei sedang menyimak pelafalan 1 siswa Rodoku, siswa cabang lain terdistraksi dan tidak produktif.
* **Solusi J-TRAIN:** Menyediakan **Mode Mandiri** (In-Browser Voice Recorder untuk Rodoku & Seiyu, Rubrik Kaligrafi Shodou), **Mode Kuis Otomatis** (Auto-graded Kanji & Kikikakitori Exam Mode), dan **Rapid Quiz Berwaktu** (Cerdas Cermat). Semua aktivitas terlacak langsung di **Dashboard Monitoring Sensei** secara real-time.

---

## 2. Arsitektur Teknologi & Pondasi PWA
* **Framework:** Next.js 14 (App Router) + TypeScript Strict Mode
* **Styling & Design Tokens:** Tailwind CSS bertema *Japanese Contemporary Minimalist (Washi & Crimson)* mengacu pada `Desain.MD.pdf`
  * Washi White (`#FAF7F2`)
  * Pure Paper White (`#FFFFFF`)
  * Crimson Red (`#B91C1C` / `#DC2626`)
  * Pressed Seal Red (`#991B1B`)
  * Soft Crimson Tint (`#FEE2E2`)
  * Sumi Ink Black (`#111827`)
  * Charcoal Grey (`#4B5563`)
* **PWA Infrastructure:**
  * `public/manifest.json` (`display: standalone`, `theme_color: #B91C1C`, `background_color: #FAF7F2`)
  * `public/sw.js` (Service worker caching, stale-while-revalidate, offline fallback)
  * `src/hooks/usePWAInstall.ts` (Menangkap event `beforeinstallprompt` untuk custom banner install HP)
* **Toleransi Jaringan & Offline Recovery:**
  * Jawaban tersimpan otomatis di `localStorage` per butir soal.
  * Auto-retry queue pengiriman saat koneksi kembali online (`window.addEventListener('online')`).

---

## 3. Matriks 6 Cabang Lomba

| Cabang Lomba | Karakteristik & Logika Sistem | Tipe Interaksi & Penilaian |
| :--- | :--- | :--- |
| **1. Kanji (漢字)** | Cara baca Onyomi/Kunyomi, kanji dari kalimat, pilihan ganda acak. | **Auto-Graded:** $(Jumlah Benar / Total) \times 100$. Pembahasan instan per butir. |
| **2. Cerdas Cermat (知識クイズ)** | Pengetahuan budaya, sejarah, kotowaza, geografi. Rapid Quiz. | **Berbasis Timer:** Countdown bar menyusut & berubah merah saat $\le 20\%$. Auto-submit timeout. |
| **3. Kikikakitori (聞き書き)** | Simulasi menyimak ujian resmi. Audio pengumuman stasiun/dialog. | **Exam Mode Terkunci:** Scrubbing timeline dinonaktifkan. Batas putar audio maks. 2 kali. Normalisasi string isian singkat. |
| **4. Rodoku (朗読)** | Naskah sastra Jepang *Te-bukuro o Kai ni* karya Niimi Nankichi. | **Furigana Penuh (`<ruby><rt>`):** Tanda jeda napas `/` dan `//`. MediaRecorder API lokal tanpa kuota internet untuk komparasi side-by-side audio Sensei. |
| **5. Seiyu (声優)** | Naskah dialog anime/drama berkarakter (Kenji, Aoi, Sensei). | **Modulasi Emosi & Tempo:** Panduan per adegan + perekam suara lokal browser per-take. |
| **6. Shodou (書道)** | Kaidah kaligrafi hanshi karakter 『道』 (Gaya Kaisho). | **Diagram Stroke Order 9 Langkah:** Rubrik penilaian mandiri (Tome, Hane, Harai, Keseimbangan Hanshi, Cap Rakkan). |

---

## 4. Dashboard Monitoring & Analitik Sensei
1. **Top KPI Executive Cards:**
   * Total Siswa Aktif Binaan.
   * Rata-rata Skor Keseluruhan Tim.
   * Total Jam/Sesi Mandiri Minggu Ini.
   * Siswa Perlu Perhatian (Skor $<70$).
2. **Matriks Progres Siswa & Filter Cerdas:**
   * Kolom: Nama Siswa, NISN, Cabang Fokus, Sesi Selesai, Rerata Skor, Kesiapan (Siap Lomba / Berkembang / Butuh Bimbingan).
   * Fitur Sort by Score & Sort by Activity.
3. **Drill-down Profil Siswa Individual (`/sensei/siswa/[id]`):**
   * Riwayat kronologis seluruh sesi.
   * Grafik tren perkembangan (Pre-test to Post-test line chart).
   * Kolom catatan evaluasi langsung Sensei untuk sesi tatap muka lab.
4. **Live Activity Feed:**
   * Real-time stream aktivitas mandiri siswa saat belajar di ponsel/lab.

---

## 5. Cara Menjalankan Aplikasi
1. Buka terminal di direktori proyek:
   ```bash
   cd "C:\Users\Pujo Lestariono\.gemini\antigravity\scratch\j-train"
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka browser pada [http://localhost:3000](http://localhost:3000).
4. Untuk menguji database Supabase eksternal, masukkan kredensial pada file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   Eksekusi skrip `supabase/schema.sql` pada SQL Editor Supabase Anda.
