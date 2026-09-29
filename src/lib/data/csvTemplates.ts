import { CompetitionCategory, Question, QuestionOption } from '@/types';

export interface CsvTemplateInfo {
  filename: string;
  headers: string[];
  sampleRows: string[][];
  description: string;
}

export interface ValidatedCsvRow {
  rowNumber: number;
  isValid: boolean;
  errors: string[];
  questionData?: Omit<Question, 'id'>;
  rawCells: string[];
}

export interface CsvValidationResult {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  rows: ValidatedCsvRow[];
}

/**
 * Returns dynamic CSV template details based on competition category
 */
export function getCsvTemplateForCategory(category: CompetitionCategory): CsvTemplateInfo {
  switch (category) {
    case 'kanji':
      return {
        filename: 'template_soal_kanji.csv',
        headers: ['question_text', 'opt_a', 'opt_b', 'opt_c', 'opt_d', 'correct_key', 'explanation', 'kanji_target'],
        sampleRows: [
          [
            'Pilihlah cara baca (Kunyomi/Onyomi) yang tepat untuk kata di dalam kurung: 毎朝、公園を【散歩】します。',
            'さんぽ (Sanpo)',
            'さんほ (Sanho)',
            'ざんぽ (Zanpo)',
            'しんぽ (Shinpo)',
            'A',
            'Kanji San (menyebar) dan Po (melangkah) dibaca Sanpo (jalan-jalan/jogging pagi).',
            '散歩'
          ],
          [
            'Pilihlah cara baca yang tepat untuk kata bergaris bawah: 日曜日に図書館で本を【借りました】。',
            'かしました (Kashimashita)',
            'かりました (Karimashita)',
            'とりました (Torimashita)',
            'かえしました (Kaeshimashita)',
            'B',
            'Kanji 借 berasal dari kata kerja 借りる (Kariru) yang berarti meminjam.',
            '借りました'
          ],
          [
            'Tentukan karakter Kanji yang benar untuk frasa: この部屋はとても【しず】かです。',
            '浄',
            '静',
            '清',
            '安',
            'B',
            'Kata sifat-na Shizuka ditulis dengan kanji 静 (静か).',
            '静か'
          ]
        ],
        description: 'Template soal pilihan ganda Kanji dengan opsi A-D, kunci jawaban, dan pembahasan furigana.'
      };

    case 'cerdas_cermat':
      return {
        filename: 'template_soal_cerdas_cermat.csv',
        headers: ['question_text', 'opt_a', 'opt_b', 'opt_c', 'opt_d', 'correct_key', 'explanation', 'category_theme'],
        sampleRows: [
          [
            'Festival musim panas di Jepang yang diadakan tanggal 7 Juli untuk merayakan pertemuan Orihime dan Hikoboshi adalah...',
            'Tanabata Matsuri',
            'Gion Matsuri',
            'Awa Odori',
            'Kanda Matsuri',
            'A',
            'Tanabata (七夕) dirayakan setiap 7 Juli berdasarkan legenda bintang Vega dan Altair.',
            'Budaya (Bunka)'
          ],
          [
            'Prefektur yang merupakan pulau paling utara di Jepang dan terkenal dengan salju Sapporo adalah...',
            'Honshu',
            'Kyushu',
            'Hokkaido',
            'Shikoku',
            'C',
            'Hokkaido adalah pulau utama terluas di utara Jepang beribu kota di Sapporo.',
            'Geografi & Wisata'
          ]
        ],
        description: 'Template soal trivia cerdas cermat dengan opsi A-D, batas blitz, dan klasifikasi tema.'
      };

    case 'kikikakitori':
      return {
        filename: 'template_soal_kikikakitori.csv',
        headers: ['question_text', 'type', 'opt_a', 'opt_b', 'opt_c', 'opt_d', 'correct_key', 'dictation_answer', 'explanation'],
        sampleRows: [
          [
            'Dengarkan percakapan stasiun: Jalur kereta apa yang harus dinaiki untuk menuju Asakusa?',
            'pilihan_ganda',
            'Ginza Line (Jalur 2)',
            'Yamanote Line (Jalur 1)',
            'Chuo Line (Jalur 4)',
            'Marunouchi Line (Jalur 3)',
            'A',
            '',
            'Pengumuman stasiun menyebutkan bahwa penumpang menuju Asakusa harus berganti ke Jalur Ginza.'
          ],
          [
            'Tuliskan kata benda yang disebutkan pembicara pada detik 00:12 (Alat transportasi cepat)',
            'dikte',
            '',
            '',
            '',
            '',
            '',
            'しんかんせん, 新幹線',
            'Jawaban yang tepat adalah kata Shinkansen (kereta cepat Jepang).'
          ]
        ],
        description: 'Template audio Kikikakitori mendukung format Pilihan Ganda Menyimak maupun Dikte Isian (Kakitori).'
      };

    case 'rodoku':
      return {
        filename: 'template_naskah_rodoku.csv',
        headers: ['question_text', 'pause_guide', 'pitch_accent', 'audio_url', 'explanation'],
        sampleRows: [
          [
            '「寒い冬が北から、狐の親子の棲んでいる森へもやって来ました。」',
            '「寒い冬が / 北から、// 狐の親子の / 棲んでいる森へも // やって来ました。」',
            'Fokus intonasi menurun halus pada 寒い冬, jeda napas 1 ketuk pada /, 2 ketuk pada //',
            '',
            'Karya Niimi Nankichi: Tebukuro wo Kai ni. Tekankan ketenangan suasana musim dingin.'
          ]
        ],
        description: 'Template penggalan naskah Rodoku lengkap dengan panduan jeda napas (/ dan //) serta aksen titinada.'
      };

    case 'seiyu':
      return {
        filename: 'template_dialog_seiyu.csv',
        headers: ['character_role', 'dialog_text', 'furigana_text', 'emotion_note', 'audio_url'],
        sampleRows: [
          [
            'Kenji',
            '諦めるな！僕たちの戦いは、まだ始まったばかりだ！',
            '諦[あきら]めるな！僕[ぼく]たちの戦[たたか]いは、まだ始[はじ]まったばかりだ！',
            'Nafas terengah-engah, tatapan mata berapi-api penuh tekad.',
            ''
          ],
          [
            'Aoi',
            'ケンジ君、無理しないで…まだ足の怪我が治っていないのに！',
            'ケンジ君[くん]、無理[むり]しないで…まだ足[あし]の怪我[けが]が治[なお]っていないのに！',
            'Suara bergetar cemas, nada memohon dengan intonasi melembut.',
            ''
          ]
        ],
        description: 'Template dialog sulih suara Seiyu dengan penanda peran tokoh, furigana, dan catatan emosi sutradara.'
      };

    case 'shodou':
      return {
        filename: 'template_rubrik_shodou.csv',
        headers: ['step_number', 'step_title', 'tome_rule', 'hane_rule', 'harai_rule', 'tips'],
        sampleRows: [
          [
            '1',
            'Goresan 1-3: Radikal Kubi (首) Bagian Atas',
            'Tome mantap di akhir garis horizontal kedua',
            'Hane tipis menyudut pada bagian lekukan tengah',
            'Harai seimbang tanpa menumpuk tinta',
            'Jaga kuadran tengah tetap simetris, jangan terlalu condong ke kiri.'
          ]
        ],
        description: 'Template panduan goresan Shodou dengan kriteria rubrik Tome, Hane, Harai, dan proporsi kuadran.'
      };

    default:
      return {
        filename: 'template_bank_soal.csv',
        headers: ['question_text', 'opt_a', 'opt_b', 'opt_c', 'opt_d', 'correct_key', 'explanation'],
        sampleRows: [],
        description: 'Template umum bank soal kompetisi.'
      };
  }
}

/**
 * Converts template rows into CSV text with proper quoting
 */
export function generateCsvTemplateString(template: CsvTemplateInfo): string {
  const escapeCell = (val: string) => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = template.headers.map(escapeCell).join(',');
  const rowLines = template.sampleRows.map(row => row.map(escapeCell).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

/**
 * Triggers a browser download of a CSV file
 */
export function triggerCsvDownload(filename: string, csvContent: string): void {
  // Prepend UTF-8 BOM so Excel and Google Sheets open Japanese characters correctly
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Robust RFC 4180 compliant CSV Parser
 */
export function parseCsvText(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r') {
        // Carriage return, check if followed by newline
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  // Last cell and row
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // Filter out any purely empty rows
  return rows.filter(row => row.some(cell => cell.length > 0));
}

/**
 * Validates parsed CSV rows against the active branch schema
 */
export function validateCsvRowsForCategory(
  category: CompetitionCategory,
  parsedRows: string[][],
  setId: string
): CsvValidationResult {
  if (parsedRows.length <= 1) {
    return {
      totalRows: 0,
      validCount: 0,
      invalidCount: 0,
      rows: []
    };
  }

  const rawHeaders = parsedRows[0].map(h => h.toLowerCase().trim());
  const dataRows = parsedRows.slice(1);
  const validatedRows: ValidatedCsvRow[] = [];

  dataRows.forEach((cells, index) => {
    const rowNumber = index + 2; // 1-indexed including header
    const errors: string[] = [];

    // Helper to get cell value by header name or index
    const getVal = (headerKey: string, fallbackIdx: number): string => {
      const idx = rawHeaders.indexOf(headerKey.toLowerCase());
      if (idx !== -1 && cells[idx] !== undefined) {
        return cells[idx].trim();
      }
      return cells[fallbackIdx] !== undefined ? cells[fallbackIdx].trim() : '';
    };

    let questionData: Omit<Question, 'id'> | undefined;

    if (category === 'kanji' || category === 'cerdas_cermat') {
      const questionText = getVal('question_text', 0);
      const optA = getVal('opt_a', 1);
      const optB = getVal('opt_b', 2);
      const optC = getVal('opt_c', 3);
      const optD = getVal('opt_d', 4);
      let correctKey = getVal('correct_key', 5).toUpperCase();
      const explanation = getVal('explanation', 6);
      const extraMeta = getVal(category === 'kanji' ? 'kanji_target' : 'category_theme', 7);

      if (!questionText) {
        errors.push('Teks pertanyaan (question_text) tidak boleh kosong');
      }
      if (!optA || !optB) {
        errors.push('Minimal Opsi A dan Opsi B wajib terisi');
      }
      if (!['A', 'B', 'C', 'D'].includes(correctKey)) {
        errors.push(`Kunci jawaban harus A, B, C, atau D (saat ini: "${correctKey || 'kosong'}")`);
      }

      if (errors.length === 0) {
        const options: QuestionOption[] = [
          { key: 'A', text: optA },
          { key: 'B', text: optB },
          { key: 'C', text: optC || '-' },
          { key: 'D', text: optD || '-' },
        ];

        questionData = {
          set_id: setId,
          question_text: questionText,
          options,
          correct_key: correctKey as 'A' | 'B' | 'C' | 'D',
          explanation: explanation || undefined,
          order_index: rowNumber - 1,
          metadata: {
            imported_via: 'csv',
            extra_theme: extraMeta || undefined
          }
        };
      }
    } else if (category === 'kikikakitori') {
      const questionText = getVal('question_text', 0);
      const type = getVal('type', 1).toLowerCase() || 'pilihan_ganda';
      const optA = getVal('opt_a', 2);
      const optB = getVal('opt_b', 3);
      const optC = getVal('opt_c', 4);
      const optD = getVal('opt_d', 5);
      const correctKey = getVal('correct_key', 6).toUpperCase();
      const dictationAnswer = getVal('dictation_answer', 7);
      const explanation = getVal('explanation', 8);

      if (!questionText) {
        errors.push('Teks instruksi soal menyimak tidak boleh kosong');
      }

      if (type === 'dikte') {
        if (!dictationAnswer) {
          errors.push('Tipe dikte memerlukan kolom dictation_answer (kata kunci benar)');
        }
        if (errors.length === 0) {
          questionData = {
            set_id: setId,
            question_text: questionText,
            options: [],
            correct_key: dictationAnswer,
            explanation: explanation || undefined,
            order_index: rowNumber - 1,
            metadata: {
              type: 'dikte',
              dictation_keywords: dictationAnswer.split(',').map(s => s.trim()),
              auto_normalize: true,
              imported_via: 'csv'
            }
          };
        }
      } else {
        if (!optA || !optB) {
          errors.push('Pilihan ganda menyimak memerlukan minimal Opsi A dan B');
        }
        if (!['A', 'B', 'C', 'D'].includes(correctKey)) {
          errors.push(`Kunci jawaban harus A, B, C, atau D (saat ini: "${correctKey || 'kosong'}")`);
        }
        if (errors.length === 0) {
          questionData = {
            set_id: setId,
            question_text: questionText,
            options: [
              { key: 'A', text: optA },
              { key: 'B', text: optB },
              { key: 'C', text: optC || '-' },
              { key: 'D', text: optD || '-' }
            ],
            correct_key: correctKey as 'A' | 'B' | 'C' | 'D',
            explanation: explanation || undefined,
            order_index: rowNumber - 1,
            metadata: {
              type: 'pilihan_ganda',
              imported_via: 'csv'
            }
          };
        }
      }
    } else if (category === 'seiyu') {
      const characterRole = getVal('character_role', 0);
      const dialogText = getVal('dialog_text', 1);
      const furiganaText = getVal('furigana_text', 2);
      const emotionNote = getVal('emotion_note', 3);
      const audioUrl = getVal('audio_url', 4);

      if (!characterRole) {
        errors.push('Kolom character_role (nama tokoh) tidak boleh kosong');
      }
      if (!dialogText) {
        errors.push('Kolom dialog_text (naskah ucapan) tidak boleh kosong');
      }

      if (errors.length === 0) {
        questionData = {
          set_id: setId,
          question_text: `[${characterRole}] ${dialogText}`,
          options: [],
          correct_key: 'A',
          explanation: emotionNote ? `Arahan sutradara: ${emotionNote}` : undefined,
          order_index: rowNumber - 1,
          metadata: {
            character_role: characterRole,
            dialog_text: dialogText,
            furigana_text: furiganaText || undefined,
            emotion_note: emotionNote || undefined,
            audio_url: audioUrl || undefined,
            imported_via: 'csv'
          }
        };
      }
    } else if (category === 'rodoku') {
      const questionText = getVal('question_text', 0);
      const pauseGuide = getVal('pause_guide', 1);
      const pitchAccent = getVal('pitch_accent', 2);
      const audioUrl = getVal('audio_url', 3);
      const explanation = getVal('explanation', 4);

      if (!questionText) {
        errors.push('Teks paragraf naskah bacaan tidak boleh kosong');
      }

      if (errors.length === 0) {
        questionData = {
          set_id: setId,
          question_text: questionText,
          options: [],
          correct_key: 'A',
          explanation: explanation || undefined,
          order_index: rowNumber - 1,
          metadata: {
            pause_guide: pauseGuide || undefined,
            pitch_accent: pitchAccent || undefined,
            audio_url: audioUrl || undefined,
            imported_via: 'csv'
          }
        };
      }
    } else if (category === 'shodou') {
      const stepNumber = getVal('step_number', 0) || String(rowNumber - 1);
      const stepTitle = getVal('step_title', 1);
      const tomeRule = getVal('tome_rule', 2);
      const haneRule = getVal('hane_rule', 3);
      const haraiRule = getVal('harai_rule', 4);
      const tips = getVal('tips', 5);

      if (!stepTitle) {
        errors.push('Judul langkah atau nama bagian karakter (step_title) wajib diisi');
      }

      if (errors.length === 0) {
        questionData = {
          set_id: setId,
          question_text: `Langkah ${stepNumber}: ${stepTitle}`,
          options: [],
          correct_key: 'A',
          explanation: tips || undefined,
          order_index: Number(stepNumber) || rowNumber - 1,
          metadata: {
            step_number: stepNumber,
            step_title: stepTitle,
            tome_rule: tomeRule || undefined,
            hane_rule: haneRule || undefined,
            harai_rule: haraiRule || undefined,
            tips: tips || undefined,
            imported_via: 'csv'
          }
        };
      }
    } else {
      // General fallback
      const questionText = getVal('question_text', 0);
      const optA = getVal('opt_a', 1);
      const optB = getVal('opt_b', 2);
      const correctKey = getVal('correct_key', 5).toUpperCase() || 'A';
      if (!questionText) errors.push('Teks soal tidak boleh kosong');
      if (errors.length === 0) {
        questionData = {
          set_id: setId,
          question_text: questionText,
          options: [
            { key: 'A', text: optA || 'Opsi A' },
            { key: 'B', text: optB || 'Opsi B' }
          ],
          correct_key: correctKey as 'A' | 'B' | 'C' | 'D',
          order_index: rowNumber - 1,
          metadata: { imported_via: 'csv' }
        };
      }
    }

    validatedRows.push({
      rowNumber,
      isValid: errors.length === 0,
      errors,
      questionData,
      rawCells: cells
    });
  });

  const validCount = validatedRows.filter(r => r.isValid).length;
  const invalidCount = validatedRows.filter(r => !r.isValid).length;

  return {
    totalRows: validatedRows.length,
    validCount,
    invalidCount,
    rows: validatedRows
  };
}
