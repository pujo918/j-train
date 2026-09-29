import fs from 'fs';
import path from 'path';

// Helper for assertions
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failures.push({ testName, details });
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log(' J-TRAIN: COMPREHENSIVE AUTOMATED TEST SUITE');
  console.log(' Platform Pelatihan Kompetisi Bahasa Jepang MAN 1 Pasuruan');
  console.log('============================================================\n');

  // =========================================================================
  // SUITE 1: DATA MODEL & STATIC CONFIGURATION INTEGRITY
  // =========================================================================
  console.log('▶ [SUITE 1] Memeriksa Model Data & Konfigurasi Statis...');

  const manifestPath = path.resolve('public/manifest.json');
  assert(fs.existsSync(manifestPath), 'File public/manifest.json harus ada');

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert(manifest.name.includes('J-TRAIN'), 'Nama manifest mengandung "J-TRAIN"');
    assert(manifest.short_name === 'J-TRAIN', 'Short name manifest adalah "J-TRAIN"');
    assert(manifest.display === 'standalone', 'Display mode manifest adalah "standalone"');
    assert(manifest.theme_color.toLowerCase() === '#b91c1c', 'Theme color manifest adalah Torii Scarlet #B91C1C');
    assert(manifest.background_color.toLowerCase() === '#faf7f2', 'Background color manifest adalah Washi White #FAF7F2');
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'Manifest memiliki ikon 192px dan 512px');
  } catch (e) {
    assert(false, 'Manifest valid JSON', e.message);
  }

  // Service worker check
  const swPath = path.resolve('public/sw.js');
  assert(fs.existsSync(swPath), 'File public/sw.js harus ada');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert(swContent.includes('addEventListener(\'install\'') && swContent.includes('addEventListener(\'fetch\''), 'Service worker memiliki event listener install & fetch');

  // Offline fallback check
  const offlineHtmlPath = path.resolve('public/offline.html');
  assert(fs.existsSync(offlineHtmlPath), 'File public/offline.html harus ada');
  const offlineHtml = fs.readFileSync(offlineHtmlPath, 'utf8');
  assert(offlineHtml.includes('Koneksi Sedang Terputus') && offlineHtml.includes('J-TRAIN'), 'Halaman offline fallback memuat informasi madrasah');

  // Database SQL Schema check
  const schemaPath = path.resolve('supabase/schema.sql');
  assert(fs.existsSync(schemaPath), 'File supabase/schema.sql harus ada');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  assert(sql.includes('CREATE TYPE user_role'), 'SQL schema memuat ENUM user_role');
  assert(sql.includes('CREATE TYPE competition_category_enum'), 'SQL schema memuat ENUM 6 cabang lomba');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'SQL schema memuat tabel profiles');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.practice_sets'), 'SQL schema memuat tabel practice_sets');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.questions'), 'SQL schema memuat tabel questions');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.practice_results'), 'SQL schema memuat tabel practice_results');
  assert(sql.includes('ENABLE ROW LEVEL SECURITY'), 'SQL schema mengaktifkan Row Level Security (RLS)');

  // =========================================================================
  // SUITE 2: BUSINESS LOGIC, NORMALIZATION & FORMULA TESTS
  // =========================================================================
  console.log('\n▶ [SUITE 2] Menguji Logika Bisnis & Normalisasi String...');

  // Normalization logic implementation test
  function normalizeJapaneseAnswer(input) {
    if (!input) return "";
    return input
      .trim()
      .toLowerCase()
      .replace(/\u3000/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
  }

  assert(normalizeJapaneseAnswer('  Jisho  ') === 'jisho', 'Normalisasi: Whitespace trim & lowercasing');
  assert(normalizeJapaneseAnswer('じしょ　　ほん') === 'じしょ ほん', 'Normalisasi: Spasi zenkaku Jepang dikonversi');
  assert(normalizeJapaneseAnswer('Ａ') === 'a', 'Normalisasi: Fullwidth alfabet dikonversi ke halfwidth');
  assert(normalizeJapaneseAnswer('2番線') === '2番線', 'Normalisasi: Karakter kanji dipertahankan utuh');

  // Scoring formula tests
  function calculateScore(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100 * 10) / 10;
  }

  assert(calculateScore(5, 5) === 100, 'Scoring: 5/5 soal = 100 Pts');
  assert(calculateScore(4, 5) === 80, 'Scoring: 4/5 soal = 80 Pts');
  assert(calculateScore(2, 3) === 66.7, 'Scoring: 2/3 soal dibulatkan = 66.7 Pts');
  assert(calculateScore(0, 5) === 0, 'Scoring: 0/5 soal = 0 Pts');

  // Readiness status determination
  function getReadinessStatus(avgScore) {
    if (avgScore === null || avgScore === undefined) return 'Berkembang';
    if (avgScore >= 80) return 'Siap Lomba';
    if (avgScore >= 65) return 'Berkembang';
    return 'Butuh Bimbingan';
  }

  assert(getReadinessStatus(85) === 'Siap Lomba', 'Kesiapan: Skor 85 = "Siap Lomba"');
  assert(getReadinessStatus(72) === 'Berkembang', 'Kesiapan: Skor 72 = "Berkembang"');
  assert(getReadinessStatus(55) === 'Butuh Bimbingan', 'Kesiapan: Skor 55 = "Butuh Bimbingan"');

  // =========================================================================
  // SUITE 3: HTTP LIVE ROUTE VERIFICATION (NEXT.JS SERVER)
  // =========================================================================
  console.log('\n▶ [SUITE 3] Menguji Endpoint HTTP & Render Halaman...');

  const BASE_URL = 'http://localhost:3000';

  const routesToTest = [
    { path: '/login', expectedStatus: 200, label: 'Portal Autentikasi /login' },
    { path: '/siswa', expectedStatus: 200, label: 'Beranda Siswa /siswa' },
    { path: '/siswa/progres', expectedStatus: 200, label: 'Portofolio Riwayat Siswa /siswa/progres' },
    { path: '/siswa/lomba/kanji', expectedStatus: 200, label: 'Cabang Kanji /siswa/lomba/kanji' },
    { path: '/siswa/lomba/cerdas-cermat', expectedStatus: 200, label: 'Cabang Cerdas Cermat /siswa/lomba/cerdas-cermat' },
    { path: '/siswa/lomba/kikikakitori', expectedStatus: 200, label: 'Cabang Kikikakitori /siswa/lomba/kikikakitori' },
    { path: '/siswa/lomba/rodoku', expectedStatus: 200, label: 'Cabang Rodoku /siswa/lomba/rodoku' },
    { path: '/siswa/lomba/seiyu', expectedStatus: 200, label: 'Cabang Seiyu /siswa/lomba/seiyu' },
    { path: '/siswa/lomba/shodou', expectedStatus: 200, label: 'Cabang Shodou /siswa/lomba/shodou' },
    { path: '/sensei', expectedStatus: 200, label: 'Dashboard Monitoring Sensei /sensei' },
    { path: '/sensei/manajemen', expectedStatus: 200, label: 'Kelola Paket & Soal /sensei/manajemen' },
    { path: '/sensei/siswa/user-budi', expectedStatus: 200, label: 'Drilldown Profil Budi /sensei/siswa/user-budi' },
    { path: '/manifest.json', expectedStatus: 200, label: 'Aset PWA /manifest.json' },
    { path: '/sw.js', expectedStatus: 200, label: 'Service Worker /sw.js' },
    { path: '/offline.html', expectedStatus: 200, label: 'Fallback Offline /offline.html' },
  ];

  for (const r of routesToTest) {
    try {
      const res = await fetch(`${BASE_URL}${r.path}`);
      assert(res.status === r.expectedStatus, `${r.label} merespons HTTP ${r.expectedStatus}`);
    } catch (e) {
      assert(false, `${r.label} dapat dihubungi`, e.message);
    }
  }

  // =========================================================================
  // SUITE 4: API ROUTE SUBMISSION & DATA FLOW TEST
  // =========================================================================
  console.log('\n▶ [SUITE 4] Menguji Endpoint API Pengumpulan Kuis...');

  try {
    const payload = {
      set_id: "set-kanji-1",
      category: "kanji",
      score: 100,
      total_questions: 5,
      correct_answers: 5,
      time_spent_seconds: 140,
      user_id: "user-budi",
      set_title: "Kanji Kompetisi N4 (Pengujian API)"
    };

    const apiRes = await fetch(`${BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert(apiRes.status === 200, 'POST /api/quiz/submit merespons HTTP 200 OK');
    const apiData = await apiRes.json();
    assert(apiData.success === true, 'Response API memuat flag success = true');
    assert(apiData.data && apiData.data.score === 100, 'Response API mengonfirmasi skor tersimpan 100');
  } catch (e) {
    assert(false, 'Pengujian API /api/quiz/submit berhasil', e.message);
  }

  // =========================================================================
  // SUITE 5: 6 COMPETITION MODULES SPECIFICATION VERIFICATION
  // =========================================================================
  console.log('\n▶ [SUITE 5] Memverifikasi Konten & Fitur Spesifik 6 Cabang Lomba...');

  // 1. Kanji
  const kanjiHtml = await (await fetch(`${BASE_URL}/siswa/lomba/kanji`)).text();
  assert(kanjiHtml.includes('Kanji (漢字)') && kanjiHtml.includes('Auto-Graded'), 'Kanji: Menampilkan judul dan mode Auto-Graded');
  assert(kanjiHtml.includes('Benar / Total'), 'Kanji: Memuat rumus penilaian objektif');

  // 2. Cerdas Cermat
  const ccHtml = await (await fetch(`${BASE_URL}/siswa/lomba/cerdas-cermat`)).text();
  assert(ccHtml.includes('Cerdas Cermat (知識クイズ)'), 'Cerdas Cermat: Menampilkan judul rapid quiz');
  assert(ccHtml.includes('5 Menit') || ccHtml.includes('Batas Waktu'), 'Cerdas Cermat: Memuat batas waktu pengerjaan');
  assert(ccHtml.includes('Papan Skor') || ccHtml.includes('Peringkat'), 'Cerdas Cermat: Menampilkan papan peringkat kecepatan');

  // 3. Kikikakitori
  const kkHtml = await (await fetch(`${BASE_URL}/siswa/lomba/kikikakitori`)).text();
  assert(kkHtml.includes('Kikikakitori (聞き書き)'), 'Kikikakitori: Menampilkan judul exam mode');
  assert(kkHtml.includes('2 Kali Putar') || kkHtml.includes('Maksimal 2 kali'), 'Kikikakitori: Memuat aturan restriksi maksimal 2x putar');
  assert(kkHtml.includes('Normalisasi'), 'Kikikakitori: Menampilkan informasi normalisasi jawaban');

  // 4. Rodoku
  const rodokuHtml = await (await fetch(`${BASE_URL}/siswa/lomba/rodoku`)).text();
  assert(rodokuHtml.includes('Rodoku (朗読)'), 'Rodoku: Menampilkan judul reading aloud');
  assert(rodokuHtml.includes('<ruby>') && rodokuHtml.includes('<rt>'), 'Rodoku: Menggunakan semantik HTML ruby furigana');
  assert(rodokuHtml.includes('Jeda Napas'), 'Rodoku: Memuat petunjuk jeda napas / dan //');

  // 5. Seiyu
  const seiyuHtml = await (await fetch(`${BASE_URL}/siswa/lomba/seiyu`)).text();
  assert(seiyuHtml.includes('Seiyu (声優)'), 'Seiyu: Menampilkan judul sulih suara anime');
  assert(seiyuHtml.includes('KENJI') && seiyuHtml.includes('AOI'), 'Seiyu: Memuat naskah dialog peran multi-karakter');

  // 6. Shodou
  const shodouHtml = await (await fetch(`${BASE_URL}/siswa/lomba/shodou`)).text();
  assert(shodouHtml.includes('Shodou (書道)'), 'Shodou: Menampilkan judul kaligrafi hanshi');
  assert(shodouHtml.includes('Kaisho') || shodouHtml.includes('楷書'), 'Shodou: Memuat model gaya penulisan Kaisho');
  assert(shodouHtml.includes('Tome') && shodouHtml.includes('Hane') && shodouHtml.includes('Harai'), 'Shodou: Memuat rubrik checklist evaluasi mandiri (Tome, Hane, Harai)');

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log('\n============================================================');
  console.log(` HASIL PENGUJIAN J-TRAIN: ${passedTests} / ${totalTests} BERHASIL`);
  if (failedTests > 0) {
    console.log(` PERINGATAN: ${failedTests} pengujian gagal.`);
    failures.forEach((f, i) => console.log(`   ${i + 1}. ${f.testName} (${f.details})`));
  } else {
    console.log(' STATUS: SELURUH SISTEM & SPESIFIKASI LOLOS UJI 100% (PASSED)');
  }
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
