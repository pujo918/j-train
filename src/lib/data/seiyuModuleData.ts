export interface SeiyuDialogueLine {
  id: string;
  characterKey: 'Kenji' | 'Aoi' | 'Sensei';
  characterName: string;
  characterKatakana: string;
  roleDescription: string;
  avatarInitial: string;
  avatarBg: string;
  accentBorder: string;
  accentBg: string;
  emotionBadge: string;
  badgeBg: string;
  badgeText: string;
  japaneseTextRaw: string;
  rubyHtml: string;
  directorNotes: string;
  targetDurationSeconds: number;
}

export interface SeiyuScenePackage {
  id: string;
  title: string;
  sceneCode: string;
  subtitle: string;
  tempo: string;
  audioReferenceUrl: string;
  dialogues: SeiyuDialogueLine[];
}

export const SEIYU_SCENES: SeiyuScenePackage[] = [
  {
    id: 'set-seiyu-1',
    title: 'Naskah Sulih Suara Anime 『絆の彼方』',
    sceneCode: 'Scene 03: Garis Batas Juara',
    subtitle: 'Babak Final Turnamen Antar-Sekolah • Estafet 4x100m',
    tempo: 'Andante con moto (108 BPM)',
    audioReferenceUrl: 'https://actions.google.com/sounds/v1/sports/stadium_cheer.ogg',
    dialogues: [
      {
        id: 'line-1',
        characterKey: 'Kenji',
        characterName: 'KENJI',
        characterKatakana: 'ケンジ',
        roleDescription: 'Tokoh Utama, Pelari Terakhir',
        avatarInitial: 'K',
        avatarBg: 'bg-crimson text-white',
        accentBorder: 'border-crimson',
        accentBg: 'bg-crimson-subtle/40',
        emotionBadge: 'Emosi: Nafas tersengal, tekad bulat',
        badgeBg: 'bg-crimson-tint',
        badgeText: 'text-crimson',
        japaneseTextRaw: '「諦めるな！僕たちが毎日積み重ねてきた努力は、絶対に裏切らない！」',
        rubyHtml: '「<ruby>諦<rt>あきら</rt></ruby>めるな！<ruby>僕<rt>ぼく</rt></ruby>たちが<ruby>毎日<rt>まいにち</rt></ruby><ruby>積<rt>つ</rt></ruby>み<ruby>重<rt>かさ</rt></ruby>ねてきた<ruby>努力<rt>どりょく</rt></ruby>は、<ruby>絶対<rt>ぜったい</rt></ruby>に<ruby>裏切<rt>うらぎ</rt></ruby>らない！」',
        directorNotes: 'Awali dengan desahan nafas lelah (huffing sound), lalu tingkatkan volume suara pada kata 『絶対に (zettai ni)』!',
        targetDurationSeconds: 5,
      },
      {
        id: 'line-2',
        characterKey: 'Aoi',
        characterName: 'AOI',
        characterKatakana: 'アオイ',
        roleDescription: 'Sahabat & Manajer Tim',
        avatarInitial: 'A',
        avatarBg: 'bg-amber-600 text-white',
        accentBorder: 'border-amber-400',
        accentBg: 'bg-amber-50/60',
        emotionBadge: 'Emosi: Berbisik lembut namun penuh keyakinan',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-800',
        japaneseTextRaw: '「うん... 行こう、ケンジ。一緒にあの表彰台の一番上へ！」',
        rubyHtml: '「うん... <ruby>行<rt>い</rt></ruby>こう、ケンジ。<ruby>一緒<rt>いっしょ</rt></ruby>にあの<ruby>表彰台<rt>ひょうしょうだい</rt></ruby>の<ruby>一番上<rt>いちばんうえ</rt></ruby>へ！」',
        directorNotes: 'Nada suara stabil dan hangat. Jangan terburu-buru, jeda 1 ketukan setelah kata 『行こう (ikou)』.',
        targetDurationSeconds: 4,
      },
      {
        id: 'line-3',
        characterKey: 'Sensei',
        characterName: 'SENSEI',
        characterKatakana: '先生',
        roleDescription: 'Pelatih Kepala',
        avatarInitial: 'S',
        avatarBg: 'bg-sumi text-white',
        accentBorder: 'border-sumi-charcoal',
        accentBg: 'bg-slate-50',
        emotionBadge: 'Emosi: Tegas & Berwibawa memberi aba-aba',
        badgeBg: 'bg-sumi-light',
        badgeText: 'text-sumi',
        japaneseTextRaw: '「前を向け、お前たち！全員の期待を背負って、全力で駆け抜けろ！」',
        rubyHtml: '「<ruby>前<rt>まえ</rt></ruby>を<ruby>向<rt>む</rt></ruby>け、お<ruby>前<rt>まえ</rt></ruby>たち！<ruby>全員<rt>ぜんいん</rt></ruby>の<ruby>期待<rt>きたい</rt></ruby>を<ruby>背負<rt>せお</rt></ruby>って、<ruby>全力<rt>ぜんりょく</rt></ruby>で<ruby>駆<rt>か</rt></ruby>け<ruby>抜<rt>ぬ</rt></ruby>けろ！」',
        directorNotes: 'Suara dikeluarkan dari perut (diafragma). Tekankan kata 『前を向け (mae o muke)』!',
        targetDurationSeconds: 5,
      },
      {
        id: 'line-4',
        characterKey: 'Kenji',
        characterName: 'KENJI',
        characterKatakana: 'ケンジ',
        roleDescription: 'Tokoh Utama, Pelari Terakhir',
        avatarInitial: 'K',
        avatarBg: 'bg-crimson text-white',
        accentBorder: 'border-crimson',
        accentBg: 'bg-crimson-subtle/40',
        emotionBadge: 'Emosi: Teriakan pembakar semangat penutup',
        badgeBg: 'bg-crimson-tint',
        badgeText: 'text-crimson',
        japaneseTextRaw: '「行くぞ、ゴールへ！ここが僕らの最高の瞬間だーっ！」',
        rubyHtml: '「<ruby>行<rt>い</rt></ruby>くぞ、ゴールへ！ここが<ruby>僕<rt>ぼく</rt></ruby>らの<ruby>最高<rt>さいこう</rt></ruby>の<ruby>瞬間<rt>しゅんかん</rt></ruby>だーっ！」',
        directorNotes: 'Tahan nafas panjang di akhir kalimat (sustain vocal), proyeksi suara tembus batas mikrofon!',
        targetDurationSeconds: 4,
      },
    ],
  },
];
