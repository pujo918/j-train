import json

with open('scripts/official_kanjivg.json', 'r', encoding='utf-8') as f:
    kanjivg = json.load(f)

# Define rich step metadata for Kaisho calligraphy
steps_data = {
    'michi': [
        {'title': 'Titik Kiri Atas 首', 'desc': 'Titik miring pendek ke kanan bawah dengan tome (hentakan kuas) tegas di kepala radikal 首.'},
        {'title': 'Sapuan Kanan Atas 首', 'desc': 'Sapuan kuas miring lembut mengalir dari kanan atas ke kiri bawah penyeimbang titik pertama.'},
        {'title': 'Garis Horizontal Atas', 'desc': 'Tarik mendatar sedikit menanjak ke kanan (5°), beri tekanan stabil dan kunci di ujung kanan.'},
        {'title': 'Sapuan Kiri Dalam', 'desc': 'Sapuan miring tajam pengisi rongga atas radikal leher/kepala.'},
        {'title': 'Garis Vertikal Kiri 目', 'desc': 'Tiang vertikal kiri radikal mata, tarik tegak lurus dengan ketebalan sumi merata.'},
        {'title': 'Sudut Kanan & Hane 目', 'desc': 'Tarik horizontal lalu tekuk tajam 90° ke bawah dengan lentikan ujung kuas rapi.'},
        {'title': 'Garis Dalam Atas 目', 'desc': 'Garis horizontal tipis pertama membagi ruang dalam mata secara proporsional.'},
        {'title': 'Garis Dalam Bawah 目', 'desc': 'Garis horizontal tipis kedua penyeimbang ruang dalam mata.'},
        {'title': 'Penutup Bawah 目', 'desc': 'Kunci bagian dasar mata dengan garis horizontal, ujung kanan menyentuh tiang vertikal.'},
        {'title': 'Titik Awal Shinnyou (⻌)', 'desc': 'Mulai radikal jalan dengan titik melengkung anggun di sisi kiri kanvas.'},
        {'title': 'Lekukan Gelombang Shinnyou', 'desc': 'Tarik garis zigzag mengalir dengan ritme tekanan kuas: tekan, lepas tipis, lalu tekuk ke bawah.'},
        {'title': 'Sapuan Bawah (Harai Besar)', 'desc': 'Tekan kuas di bawah membungkus seluruh karakter, lalu sapukan melebar meruncing ke kanan (Harai agung).'}
    ],
    'yume': [
        {'title': 'Garis Horizontal Rumput 艹', 'desc': 'Tarik garis mendatar tebal pembuka mahkota rumput dari kiri ke kanan.'},
        {'title': 'Vertikal Kiri Rumput 艹', 'desc': 'Tusuk vertikal sisi kiri sedikit condong ke dalam, kunci di bawah (Tome).'},
        {'title': 'Vertikal Kanan Rumput 艹', 'desc': 'Tusuk vertikal sisi kanan sedikit condong ke kiri, seimbang dengan tiang kiri.'},
        {'title': 'Tiang Kiri Kotak Mata 目', 'desc': 'Tarik vertikal tegak lurus membentuk dinding kiri kotak kisi tengah.'},
        {'title': 'Sudut Kanan Kotak Mata 目', 'desc': 'Tarik mendatar lalu belok 90° ke bawah membentuk kerangka luar kotak tengah.'},
        {'title': 'Vertikal Dalam Kiri', 'desc': 'Garis vertikal tipis pembagi rongga kiri dalam kisi mata.'},
        {'title': 'Vertikal Dalam Kanan', 'desc': 'Garis vertikal tipis pembagi rongga kanan dalam kisi mata.'},
        {'title': 'Garis Penutup Kotak Mata', 'desc': 'Kunci dasar kisi mata dengan sapuan mendatar rapi menyatukan tiang vertikal.'},
        {'title': 'Titik Kiri Atap 冖', 'desc': 'Titik miring ke bawah di sisi kiri penanda atap penutup (Wa-kanmuri).'},
        {'title': 'Sudut Melipat Kanan Atap 冖', 'desc': 'Tarik mendatar membentang lalu tekuk sedikit ke kiri bawah membentuk kanopi pelindung.'},
        {'title': 'Sapuan Miring Kiri Senja 夕', 'desc': 'Mulai di poros tengah bawah, sapukan kuas anggun melengkung tajam ke kiri bawah.'},
        {'title': 'Lekukan Kurva Senja 夕', 'desc': 'Horizontal pendek lalu melengkung lembut ke kiri bawah menyerupai sabit bulan.'},
        {'title': 'Titik Pusat Pengunci 夕', 'desc': 'Hentakan titik kuas (Tome) mantap di dalam ruang bulan sabit mengunci seluruh karakter 夢.'}
    ],
    'wa': [
        {'title': 'Sapuan Atas Nogome (禾)', 'desc': 'Goresan miring kiri tajam di puncak padi penentu poros karakter.'},
        {'title': 'Garis Horizontal Padi', 'desc': 'Tarik mendatar seimbang membelah tangkai padi dari kiri ke kanan.'},
        {'title': 'Tiang Vertikal Padi', 'desc': 'Tarik lurus ke bawah menembus garis horizontal dengan ketebalan stabil.'},
        {'title': 'Sapuan Kaki Kiri Padi', 'desc': 'Harai lembut melengkung dari persimpangan menuju kiri bawah.'},
        {'title': 'Titik Kaki Kanan (Tome)', 'desc': 'Hentakan titik kuas di sisi kanan batang padi menyeimbangkan harai kiri.'},
        {'title': 'Tiang Vertikal Kiri Mulut (口)', 'desc': 'Pondasi kiri kotak mulut sedikit condong ke kanan bawah.'},
        {'title': 'Sudut Kanan Mulut (口)', 'desc': 'Garis horizontal lalu tekukan ke bawah tajam dengan sudut 90° tegas.'},
        {'title': 'Penutup Bawah Mulut (口)', 'desc': 'Kunci dasar kotak mulut dengan garis horizontal, kedua ujung sedikit menonjol rapi.'}
    ],
    'chikara': [
        {'title': 'Sudut Lengkung & Hane (Tekuk Melenting)', 'desc': 'Tarik horizontal ke kanan, tekuk melengkung ke kiri bawah, lalu lentikkan kuas ke kiri atas dengan hentakan tajam (Yokoorikagi).'},
        {'title': 'Sapuan Harai Menembus Tengah', 'desc': 'Mulai dari puncak poros tengah, sapukan kuas ke kiri bawah membentang meruncing megah memotong goresan pertama.'}
    ],
    'kokoro': [
        {'title': 'Titik Kiri Luar (Tome Miring)', 'desc': 'Titik miring mantap di sisi kiri bawah kanvas, beri penekanan tome di ujung.'},
        {'title': 'Lengkungan Harai Melingkar (Perut Hati)', 'desc': 'Mulai tegak, sapukan melengkung ke kanan bawah seperti mangkuk dasar, lalu lentikkan ujung kuas ke atas.'},
        {'title': 'Titik Tengah Atas', 'desc': 'Titik gantung melayang di atas rongga perut hati, berada harmonis di poros tengah.'},
        {'title': 'Titik Kanan Luar', 'desc': 'Titik penyeimbang di sisi kanan atas, letaknya sedikit lebih tinggi dari titik pertama mengunci keutuhan hati.'}
    ],
    'hikari': [
        {'title': 'Tiang Tengah Puncak', 'desc': 'Goresan vertikal pendek tepat di sumbu tengah atas pembuka percikan api.'},
        {'title': 'Titik Kiri Puncak', 'desc': 'Titik miring kiri menyangga kobaran cahaya.'},
        {'title': 'Sapuan Kanan Puncak', 'desc': 'Harai miring kanan lembut penyeimbang titik kiri.'},
        {'title': 'Garis Horizon Pembagi', 'desc': 'Garis horizontal panjang membentang dari kiri ke kanan dengan kekuatan penuh.'},
        {'title': 'Kaki Kiri (Sapuan Manusia)', 'desc': 'Goresan kaki kiri meruncing anggun melengkung ke kiri bawah.'},
        {'title': 'Kaki Kanan (Lengkungan Menanjak)', 'desc': 'Tarik melengkung ke kanan bawah lalu lentikkan kuas tegak ke atas mengunci keseimbangan.'}
    ],
    'tomo': [
        {'title': 'Garis Horizontal Atas', 'desc': 'Tarik mendatar kokoh sedikit menanjak, simbol bahu persahabatan yang bersanding.'},
        {'title': 'Sapuan Miring Panjang (Harai Kiri)', 'desc': 'Sapuan kuas miring melengkung memanjang dari atas ke kiri bawah dengan ketebalan menurun teratur.'},
        {'title': 'Lekukan Tangan Kanan (㇇)', 'desc': 'Horizontal pendek lalu belok miring ke kiri bawah membungkus ruang bawah.'},
        {'title': 'Sapuan Agung Kanan Bawah (㇏)', 'desc': 'Mulai dari persimpangan, tekan kuas makin tebal lalu sapukan melebar meruncing ke kanan bawah.'}
    ]
}

meanings = {
    'michi': ('道', 'Jalan / Kehidupan'),
    'yume': ('夢', 'Impian / Cita-cita'),
    'wa': ('和', 'Harmoni / Damai'),
    'chikara': ('力', 'Kekuatan / Semangat Juang'),
    'kokoro': ('心', 'Hati / Jiwa / Niat Murni'),
    'hikari': ('光', 'Cahaya / Kemilau Prestasi'),
    'tomo': ('友', 'Sahabat / Persahabatan')
}

ts_lines = [
    'export interface KanjiStroke {',
    '  d: string;',
    '  type: string;',
    '}',
    '',
    'export interface KanjiModel {',
    '  code: string;',
    '  name: string;',
    '  meaning: string;',
    '  strokes: KanjiStroke[];',
    '  steps: {',
    '    title: string;',
    '    desc: string;',
    '  }[];',
    '}',
    '',
    'export const KANJI_MODELS: Record<string, KanjiModel> = {'
]

for key, item in kanjivg.items():
    name, meaning = meanings[key]
    code = item['code']
    strokes = item['strokes']
    steps = steps_data[key]
    
    ts_lines.append(f"  {key}: {{")
    ts_lines.append(f"    code: '{code}',")
    ts_lines.append(f"    name: '{name}',")
    ts_lines.append(f"    meaning: '{meaning}',")
    ts_lines.append("    strokes: [")
    for s in strokes:
        ts_lines.append(f"      {{ d: '{s['d']}', type: '{s['type']}' }},")
    ts_lines.append("    ],")
    ts_lines.append("    steps: [")
    for st in steps:
        title = st['title'].replace("'", "\\'")
        desc = st['desc'].replace("'", "\\'")
        ts_lines.append(f"      {{ title: '{title}', desc: '{desc}' }},")
    ts_lines.append("    ]")
    ts_lines.append("  },")

ts_lines.append("};")
ts_lines.append("")

output_code = "\n".join(ts_lines)
with open('src/lib/data/kanjiStrokesData.ts', 'w', encoding='utf-8') as f:
    f.write(output_code)

print("Generated src/lib/data/kanjiStrokesData.ts successfully!")
