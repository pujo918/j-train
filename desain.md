# SPESIFIKASI DESAIN SISTEM & UI/UX: J-TRAIN
**Platform:** J-TRAIN (Japanese Competition Training Platform)  
**Institusi Sasaran:** MAN 1 Pasuruan  
**Pendekatan Gaya:** *Japanese Contemporary Minimalist (Washi & Crimson)*  
**Target Output:** Web Responsive (Desktop 1440px / Laptop 1024px) & PWA Mobile App (Viewport 375px - 430px)

---

## 1. PALET WARNA & SISTEM TOKEN (DESIGN TOKENS)

### 1.1 Warna Utama (Brand Colors)
* **Washi White / Warm Parchment (Background Layar Utama):** `#FAF7F2`
  * Digunakan sebagai warna dasar kanvas utama aplikasi untuk menghadirkan kesan tekstur kertas tradisional Jepang.
* **Pure Paper White (Card & Surface):** `#FFFFFF`
  * Digunakan untuk kontainer kartu modul lomba, panel widget hitung mundur, kontainer metrik progres, dan modal dialog.
* **Crimson Red / Torii Scarlet (Aksen Utama & Tombol):** `#B91C1C` / `#DC2626`
  * Warna tombol aksi utama (*Call to Action*), lingkaran matahari terbit pada logo, avatar inisial profil, dan aksen aktif navigasi.
* **Dark Crimson / Pressed Seal Red (Hover & Active States):** `#991B1B`
  * Warna hover pada tombol interaktif dan garis tepi aktif.
* **Soft Crimson Tint (Progress Track / Badge Background):** `#FEE2E2`
  * Warna latar belakang track progress bar di dalam kartu.

### 1.2 Warna Tipografi & Elemen Netral
* **Sumi Ink Black (Teks Utama / Heading):** `#111827`
  * Kontras tinggi untuk judul hero, nama siswa, label modul, dan angka metrik.
* **Charcoal Grey (Sub-teks & Kanji Subtitle):** `#4B5563`
  * Digunakan untuk teks penjelas dalam kurung (tulisan Kanji/Katakana), subtitle sambutan, dan keterangan waktu.
* **Muted Grey (Border & Divider):** `#E5E7EB` / `#F3F4F6`
  * Garis batas tepi kartu, pembatas navbar, dan outline kontainer.
* **Pattern Background Watermark Tint:** `#8B1E1E` dengan opacity 0.06 – 0.08
  * Motif latar belakang berupa ikon Torii (鳥居), bunga sakura (桜), dan ornamen khas yang tersebar secara berulang.

---

## 2. ATURAN DESAIN ERGONOMIS & PRINSIP COMPACT (NEW MANDATORY RULES)

> [!IMPORTANT]
> **Aturan Wajib Kerapian & Bentuk Kontainer (Compact Design):**
> 1. **Rasio Kartu Proporsional (Anti-Stretching):** Kartu modul cabang lomba **wajib berbentuk proporsional (sedikit persegi panjang, tidak boleh terlalu melar memanjang/pipih)** di semua ukuran monitor desktop maupun laptop.
> 2. **Maksimal Lebar Kontainer (Constrained Container):** Grid kartu dibatasi dengan lebar maksimal (`max-w-5xl` / `max-w-6xl`) dengan `mx-auto` sehingga di monitor ultrawide kartu tetap padat, kokoh, dan rapi.
> 3. **Minimalisasi Teks Nir-Faedah (No Filler Clutter):** Hilangkan teks deskripsi panjang atau badge redundant yang sekadar mengisi ruang kosong. Setiap elemen visual harus memiliki kegunaan langsung bagi siswa yang sedang berlatih.
> 4. **Hirarki Tipografi Tegas:** Judul Romaji huruf kapital tebal (*Black/ExtraBold*), diikuti kanji asli dalam kurung dengan font Noto Sans JP, progress bar tipis 5px, dan tombol CTA penuh.

---

## 3. TIPOGRAFI & HIRARKI TEKS

### 3.1 Font Family
* **Teks Alfabet (Latin):** Plus Jakarta Sans / Inter, sans-serif (bersih, geometris, modern).
* **Karakter Jepang (Kanji & Kana):** Noto Sans JP / BIZ UDPGothic, sans-serif (tegas, mudah dibaca di layar digital).

### 3.2 Hirarki Tipografi
* **Logo Wordmark ("J-TRAIN"):** Font-weight 900 (Black), ukuran 26px – 28px, tracking -0.5px. Aksen lingkaran merah matahari terbit di tengah huruf "T" dan "R", serta siluet Torii hitam di samping huruf "N".
* **Logo Sub-heading ("MENGGAPAI PRESTASI BAHASA JEPANG"):** Font-weight 700 (Bold), ukuran 11px – 12px, letter-spacing 0.5px (Uppercase).
* **Hero Greeting ("Halo, Budi Santoso!"):** Font-weight 800 (ExtraBold), ukuran 28px (Desktop) / 20px (Mobile).
* **Hero Subtitle ("Siap latihan hari ini?"):** Font-weight 500 (Medium), ukuran 20px (Desktop) / 16px (Mobile), warna `#374151`.
* **Countdown Header ("HITUNG MUNDUR KOMPETISI"):** Font-weight 700 (Bold), ukuran 10px – 11px, letter-spacing 0.8px, warna `#4B5563`.
* **Countdown Number ("X HARI LAGI!"):** Font-weight 900 (Black), ukuran 22px – 24px, warna `#111827`. Dihitung dinamis dari tanggal target yang dapat diubah oleh user.
* **Nama Cabang Lomba (Romaji):** Font-weight 800 (ExtraBold), ukuran 15px – 16px, letter-spacing 0.5px (Uppercase).
* **Subtitle Cabang Lomba (Kanji/Kana):** Font-weight 600 (SemiBold), ukuran 13px, warna `#4B5563`.
* **Teks Tombol Card ("Buka Ruang Latihan"):** Font-weight 700 (Bold), ukuran 13px – 14px, warna `#FFFFFF`.
* **Heading Section ("PERKEMBANGAN SAYA"):** Font-weight 800 (ExtraBold), ukuran 14px – 15px, letter-spacing 1px (Uppercase).

---

## 4. ANATOMI KARTU RUANG LOMBA (6 CABANG)

### 4.1 Grid Layout
* **Desktop (1024px+):** CSS Grid 3 Kolom × 2 Baris (`grid-cols-3 gap-5 max-w-5xl mx-auto`).
* **Mobile (<768px):** CSS Grid 2 Kolom × 3 Baris (`grid-cols-2 gap-3.5`).
* **Tablet (768px - 1023px):** CSS Grid 3 Kolom atau 2 Kolom rapat (`grid-cols-2 md:grid-cols-3 gap-4`).

### 4.2 Struktur Dalam Setiap Kartu
1. **Container:**
   * Background: `#FFFFFF`
   * Border Radius: 16px – 20px (`rounded-2xl`)
   * Border: 1px solid `#EDE8E1`
   * Box Shadow: `0 2px 10px rgba(0, 0, 0, 0.04)`
   * Padding Desktop: 16px – 20px
   * Padding Mobile: 14px
2. **Bagian Atas (Header Kartu):**
   * **Squircle Icon Container:** Kotak sudut membulat (`rounded-xl` / 12px), background hangat `#FAF5EE` (Ivory cream) dengan border halus `#F3ECE2`. Berukuran 52px × 52px (Desktop) dan 48px × 48px (Mobile).
   * **Ikon Ilustratif Kustom Jepang:**
     * **Shodou (書道):** Kuas kaligrafi fude miring 45°, gagang merah marun (`#9E2A36`), gelang kerah ferrule putih, bulu kuas meruncing crimson dengan ujung tinta hitam sumi.
     * **Kanji (漢字):** Buku jilid Jepang tertutup tegak dengan punggung buku marun gelap (`#7C282F`), sampul depan coral-crimson (`#D26771`) memuat 4 karakter Kanji tebal (`文 葉` / `文 字`), dan blok kertas putih di bagian bawah dengan garis alur lembaran halaman.
     * **Kikikakitori (聞き書き):** Headphone studio over-ear dengan bantalan atas crimson dan cup telinga berbayang bevel merah muda.
     * **Seiyu (声優):** Mikrofon kapsul retro di atas dudukan meja besi dengan garis kisi horizontal dan balon dialog suara (`...`).
     * **Rodoku (朗読):** Buku terbuka dengan baris teks rapi di kedua halaman dan ikon corong suara menyiarkan gelombang suara di atasnya.
     * **Cerdas Cermat (知識クイズ):** Siluet siswa mengangkat tangan siap memencet bel dengan balon dialog berisi tanda tanya (`?`) merah marun.
   * **Teks Judul:** Huruf kapital tebal (*Black/ExtraBold* 15px, `#1F1A1C`), diikuti tulisan kanji aslinya di baris bawah dalam kurung (`#4B5563`, 12px font Noto Sans JP).
3. **Bagian Tengah (Progress Track):**
   * Batang progress tipis (tinggi 5px – 6px, `rounded-full`).
   * Latar Track: `#F5E6E6` / `#FEE2E2`.
   * Isi Progress: `#A61B29` / `#B91C1C`.
4. **Bagian Bawah (Tombol Aksi Utama):**
   * Label: `"Buka Ruang Latihan"`.
   * Background: Solid Crimson Red (`#A61B29` / `#B91C1C`).
   * Border Radius: 12px (`rounded-xl`).
   * Tinggi Tombol: 38px – 40px (Desktop) / 36px (Mobile).
   * Hover: `#8F1622` / `#991B1B`.

---

## 5. FITUR HITUNG MUNDUR REAL-TIME (DYNAMIC TARGET DATE)

Widget Hitung Mundur terhubung dengan sistem penanggalan dinamis:
* User dapat memilih tanggal target lomba sesungguhnya (contoh: 28 Oktober 2026 atau tanggal yang disesuaikan jadwal madrasah).
* Sistem menghitung sisa hari secara otomatis: $\Delta Days = \lceil (TargetDate - CurrentDate) / (1000 \times 60 \times 60 \times 24) \rceil$.
* Nilai tanggal target tersimpan di *persistent state* (LocalStorage/Zustand) sehingga tidak hilang saat direfresh.
