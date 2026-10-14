export interface RodokuTextItem {
  id: string;
  title: string;
  titleKanji: string;
  author: string;
  authorKanji: string;
  genre: string;
  tempo: string;
  audioReferenceUrl: string;
  description: string;
  fullStoryRaw: string;
  rubyHtml: string;
  directorNotes: string;
  targetDurationSeconds: number;
}

/**
 * Safely format story HTML with furigana and pause markers without corrupting HTML tags or class attributes
 */
export function formatRodokuHtml(
  html: string,
  showPauses: boolean,
  showFurigana: boolean
): string {
  let processed = html;
  if (!showFurigana) {
    processed = processed.replace(/<rt>[\s\S]*?<\/rt>/g, '');
  }

  // Split by HTML tags so we ONLY touch pure text outside tags (<[^>]+>)
  const parts = processed.split(/(<[^>]+>)/g);

  return parts
    .map((part) => {
      // If it's an HTML tag (<ruby>, <rt>, </rt>, </ruby>, <br/>, etc.), preserve completely untouched!
      if (part.startsWith('<')) {
        return part;
      }

      // Inside text nodes: single-pass matching avoids second regex matching newly inserted span attributes
      if (showPauses) {
        return part.replace(
          /(\/\/|\[\/\/\]|\[pause:long\]|\[PAUSE_LONG\])|((?<!\/)\/(?!\/)|\[\/\]|\[pause:short\]|\[PAUSE_SHORT\])/g,
          (_match, isLong) => {
            if (isLong) {
              return '<span class="text-crimson font-black mx-1.5 px-1.5 py-0.5 rounded bg-crimson-subtle border border-crimson/20 text-[0.8em] inline-block align-middle select-none tracking-normal font-sans">//</span>';
            }
            return '<span class="text-crimson font-black mx-1 px-1 py-0.2 rounded bg-crimson-subtle/60 text-[0.85em] inline-block align-middle select-none tracking-normal font-sans">/</span>';
          }
        );
      } else {
        return part.replace(
          /(\/\/|\[\/\/\]|\[pause:long\]|\[PAUSE_LONG\])|((?<!\/)\/(?!\/)|\[\/\]|\[pause:short\]|\[PAUSE_SHORT\])/g,
          (_match, isLong) => (isLong ? ' ' : '')
        );
      }
    })
    .join('');
}

export const RODOKU_STORIES: RodokuTextItem[] = [
  {
    id: 'set-rodoku-1',
    title: 'Membeli Sarung Tangan',
    titleKanji: '『手袋を買いに』',
    author: 'Niimi Nankichi',
    authorKanji: '新美南吉',
    genre: 'Dongeng Sastra Klasik',
    tempo: 'Andante amoroso (78 BPM)',
    audioReferenceUrl: '/audio/rodoku/set1.mp3',
    description: 'Kisah kasih sayang induk rubah yang menyelimuti tangan anak rubah di tengah dinginnya salju pertama musim dingin.',
    fullStoryRaw: '寒い冬がやってきました。夜になると、北風がピューピューと吹いて、森の木々を揺らしました。小さな子狐は、初めて見る白い雪に目を丸くして、お母さん狐に駆け寄りました。「お母さん、手が冷たいよ。ちくちく痛いよ。」お母さん狐は、愛おしそうに子狐の小さな手を包み込みました。',
    rubyHtml: '<ruby>寒<rt>さむ</rt></ruby>い<ruby>冬<rt>ふゆ</rt></ruby>がやってきました。/<br/>' +
      '<ruby>夜<rt>よる</rt></ruby>になると、// <ruby>北風<rt>きたかぜ</rt></ruby>がピューピューと<ruby>吹<rt>ふ</rt></ruby>いて、/ <ruby>森<rt>もり</rt></ruby>の<ruby>木々<rt>きぎ</rt></ruby>を<ruby>揺<rt>ゆ</rt></ruby>らしました。//<br/>' +
      '<ruby>小<rt>ちい</rt></ruby>さな<ruby>子狐<rt>こぎつね</rt></ruby>は、/ <ruby>初<rt>はじ</rt></ruby>めて<ruby>見<rt>み</rt></ruby>る<ruby>白<rt>しろ</rt></ruby>い<ruby>雪<rt>ゆき</rt></ruby>に<ruby>目<rt>め</rt></ruby>を<ruby>丸<rt>まる</rt></ruby>くして、/ お<ruby>母<rt>かあ</rt></ruby>さん<ruby>狐<rt>ぎつね</rt></ruby>に<ruby>駆<rt>か</rt></ruby>け<ruby>寄<rt>よ</rt></ruby>りました。//<br/>' +
      '「お<ruby>母<rt>かあ</rt></ruby>さん、/ <ruby>手<rt>て</rt></ruby>が<ruby>冷<rt>つめ</rt></ruby>たいよ。/ ちくちく<ruby>痛<rt>いた</rt></ruby>いよ。」/<br/>' +
      'お<ruby>母<rt>かあ</rt></ruby>さん<ruby>狐<rt>ぎつね</rt></ruby>は、/ <ruby>愛<rt>いとお</rt></ruby>しそうに<ruby>子狐<rt>こぎつね</rt></ruby>の<ruby>小<rt>ちい</rt></ruby>さな<ruby>手<rt>て</rt></ruby>を<ruby>包<rt>つつ</rt></ruby>み<ruby>込<rt>こ</rt></ruby>みました。//',
    directorNotes: 'Bawakan suara anak rubah dengan intonasi polos bernada tinggi. Saat giliran induk rubah, gunakan vokal dada yang hangat dan penuh perlindungan.',
    targetDurationSeconds: 18,
  },
  {
    id: 'set-rodoku-2',
    title: 'Tidak Kalah Oleh Hujan',
    titleKanji: '『雨ニモマケズ』',
    author: 'Miyazawa Kenji',
    authorKanji: '宮沢賢治',
    genre: 'Puisi Filosofis Klasik',
    tempo: 'Moderato maestoso (84 BPM)',
    audioReferenceUrl: '/audio/rodoku/set2.mp3',
    description: 'Mahakarya puisi terkenal tentang ketabahan jiwa, kesederhanaan hidup, dan welas asih tanpa pamrih kepada sesama.',
    fullStoryRaw: '雨ニモマケズ、風ニモマケズ。雪ニモ夏ノ暑サニモマケヌ丈夫ナカラダヲモチ、慾ハナク、決シテ瞋ラズ、イツモシヅカニワラッテヰル。一日ニ玄米四合ト味噌ト少シノ野菜ヲタベ、アラユルコトヲ自分ヲカンジョウニ入レズニ、ヨクミキキシワカリ、ソシテワスレズ。',
    rubyHtml: '<ruby>雨<rt>あめ</rt></ruby>ニモマケズ、/ <ruby>風<rt>かぜ</rt></ruby>ニモマケズ。//<br/>' +
      '<ruby>雪<rt>ゆき</rt></ruby>ニモ<ruby>夏<rt>なつ</rt></ruby>ノ<ruby>暑<rt>あつ</rt></ruby>サニモマケヌ/ <ruby>丈夫<rt>じょうぶ</rt></ruby>ナカラダヲモチ、//<br/>' +
      '<ruby>慾<rt>よく</rt></ruby>ハナク、/ <ruby>決<rt>けっ</rt></ruby>シテ<ruby>瞋<rt>いか</rt></ruby>ラズ、/ イツモシヅカニワラッテヰル。//<br/>' +
      '<ruby>一日<rt>いちにち</rt></ruby>ニ<ruby>玄米<rt>げんまい</rt></ruby><ruby>四合<rt>よんごう</rt></ruby>ト/ <ruby>味噌<rt>みそ</rt></ruby>ト<ruby>少<rt>すこ</rt></ruby>シノ<ruby>野菜<rt>やさい</rt></ruby>ヲタベ、//<br/>' +
      'アラユルコトヲ/ <ruby>自分<rt>じぶん</rt></ruby>ヲカンジョウニ<ruby>入<rt>い</rt></ruby>レズニ、/ ヨクミキキシワカリ、/ ソシテワスレズ。//',
    directorNotes: 'Gaya deklamasi mantap dan khidmat. Hindari ekspresi berlebihan; tekankan pada ketukan ritme bait yang tenang dan penuh perenungan batin.',
    targetDurationSeconds: 18,
  },
  {
    id: 'set-rodoku-3',
    title: 'Berlarilah Melos',
    titleKanji: '『走れメロス』',
    author: 'Dazai Osamu',
    authorKanji: '太宰治',
    genre: 'Prosa Naratif Kepahlawanan',
    tempo: 'Allegro risoluto (112 BPM)',
    audioReferenceUrl: '/audio/rodoku/set3.mp3',
    description: 'Kisah legendaris tentang harga sebuah janji persahabatan sejati dan perjuangan melawan kezaliman tiran Dionysius.',
    fullStoryRaw: 'メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此のシラクスの市にやって来た。',
    rubyHtml: 'メロスは<ruby>激怒<rt>げきど</rt></ruby>した。// <ruby>必<rt>かなら</rt></ruby>ず、/ かの<ruby>邪智暴虐<rt>じゃちぼうぎゃく</rt></ruby>の<ruby>王<rt>おう</rt></ruby>を<ruby>除<rt>のぞ</rt></ruby>かなければならぬと<ruby>決意<rt>けつい</rt></ruby>した。//<br/>' +
      'メロスには<ruby>政治<rt>せいじ</rt></ruby>がわからぬ。/ メロスは、<ruby>村<rt>むら</rt></ruby>の<ruby>牧人<rt>ぼくじん</rt></ruby>である。/ <ruby>笛<rt>ふえ</rt></ruby>を<ruby>吹<rt>ふ</rt></ruby>き、/ <ruby>羊<rt>ひつじ</rt></ruby>と<ruby>遊<rt>あそ</rt></ruby>んで<ruby>暮<rt>く</rt></ruby>して<ruby>来<rt>き</rt></ruby>た。//<br/>' +
      'けれども<ruby>邪悪<rt>じゃあく</rt></ruby>に<ruby>対<rt>たい</rt></ruby>しては、/ <ruby>人一倍<rt>ひといちばい</rt></ruby>に<ruby>敏感<rt>びんかん</rt></ruby>であった。//<br/>' +
      'きょう<ruby>未明<rt>みめい</rt></ruby>メロスは<ruby>村<rt>むら</rt></ruby>を<ruby>出発<rt>しゅっぱつ</rt></ruby>し、/ <ruby>野<rt>の</rt></ruby>を<ruby>越<rt>こ</rt></ruby>え<ruby>山<rt>やま</rt></ruby><ruby>越<rt>こ</rt></ruby>え、/ <ruby>十里<rt>じゅうり</rt></ruby>はなれた<ruby>此<rt>こ</rt></ruby>のシラクスの<ruby>市<rt>し</rt></ruby>にやって<ruby>来<rt>き</rt></ruby>た。//',
    directorNotes: 'Kalimat pembuka "Melos wa gekido shita" harus diucapkan dengan ledakan emosi tegas. Tempo cepat namun artikulasi kata konsonan tetap tajam.',
    targetDurationSeconds: 22,
  },
  {
    id: 'set-rodoku-4',
    title: 'Sang Pemuda Pemberang',
    titleKanji: '『坊っちゃん』',
    author: 'Natsume Soseki',
    authorKanji: '夏目漱石',
    genre: 'Roman Realis Klasik Era Meiji',
    tempo: 'Moderato vivace (100 BPM)',
    audioReferenceUrl: '/audio/rodoku/set4.mp3',
    description: 'Kisah jenaka penuh kejujuran seorang pemuda Tokyo berjiwa ceplas-ceplos yang ditugaskan mengajar di pulau Shikoku.',
    fullStoryRaw: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーいと囃したからである。',
    rubyHtml: '<ruby>親譲<rt>おやゆず</rt></ruby>りの<ruby>無鉄砲<rt>むてっぽう</rt></ruby>で/ <ruby>小供<rt>こども</rt></ruby>の<ruby>時<rt>とき</rt></ruby>から<ruby>損<rt>そん</rt></ruby>ばかりしている。//<br/>' +
      '<ruby>小学校<rt>しょうがっこう</rt></ruby>に<ruby>居<rt>い</rt></ruby>る<ruby>時分<rt>じぶん</rt></ruby>/ <ruby>学校<rt>がっこう</rt></ruby>の<ruby>二階<rt>にかい</rt></ruby>から<ruby>飛<rt>と</rt></ruby>び<ruby>降<rt>お</rt></ruby>りて/ <ruby>一週間<rt>いっしゅうかん</rt></ruby>ほど<ruby>腰<rt>こし</rt></ruby>を<ruby>抜<rt>ぬ</rt></ruby>かした<ruby>事<rt>こと</rt></ruby>がある。//<br/>' +
      'なぜそんな<ruby>無闇<rt>むやみ</rt></ruby>をしたと<ruby>聞<rt>き</rt></ruby>く<ruby>人<rt>ひと</rt></ruby>があるかも<ruby>知<rt>し</rt></ruby>れぬ。/ <ruby>別段<rt>べつだん</rt></ruby><ruby>深<rt>ふか</rt></ruby>い<ruby>理由<rt>りゆう</rt></ruby>でもない。//<br/>' +
      '<ruby>新築<rt>しんちく</rt></ruby>の<ruby>二階<rt>にかい</rt></ruby>から<ruby>首<rt>くび</rt></ruby>を<ruby>出<rt>で</rt></ruby>していたら、/ <ruby>同級生<rt>どうきゅうせい</rt></ruby>の<ruby>一人<rt>ひとり</rt></ruby>が<ruby>冗談<rt>じょうだん</rt></ruby>に、/ 「いくら<ruby>威張<rt>いば</rt></ruby>っても、/ そこから<ruby>飛<rt>と</rt></ruby>び<ruby>降<rt>お</rt></ruby>りる<ruby>事<rt>こと</rt></ruby>は<ruby>出来<rt>でき</rt></ruby>まい。/ <ruby>弱虫<rt>よわむし</rt></ruby>やーい」と<ruby>囃<rt>はや</rt></ruby>したからである。//',
    directorNotes: 'Gunakan aksen Tokyo (Edo-mae) yang lugas, percaya diri, dan agak santai khas karakter Bocchan.',
    targetDurationSeconds: 23,
  },
  {
    id: 'set-rodoku-5',
    title: 'Legenda Momotaro',
    titleKanji: '『桃太郎』',
    author: 'Nihon Mukashibanashi',
    authorKanji: '日本昔話',
    genre: 'Cerita Rakyat Tradisional Jepang',
    tempo: 'Andante con moto (86 BPM)',
    audioReferenceUrl: '/audio/rodoku/set5.mp3',
    description: 'Cerita rakyat Jepang paling terkenal tentang anak laki-laki dari buah persik raksasa yang menumpas raksasa di Onigashima.',
    fullStoryRaw: 'むかし、むかし、あるところに、おじいさんとおばあさんが住んでいました。おじいさんは山へ柴刈りに、おばあさんは川へ洗濯に行きました。おばあさんが川で洗濯をしていると、川上から、大きな桃がどんぶらこ、どんぶらこと流れてきました。「おや、これは大きな桃だこと。お家に持って帰って、おじいさんと食べましょう。」',
    rubyHtml: 'むかし、むかし、/ あるところに、/ おじいさんとおばあさんが<ruby>住<rt>す</rt></ruby>んでいました。//<br/>' +
      'おじいさんは<ruby>山<rt>やま</rt></ruby>へ<ruby>柴刈<rt>しばか</rt></ruby>りに、/ おばあさんは<ruby>川<rt>かわ</rt></ruby>へ<ruby>洗濯<rt>せんたく</rt></ruby>に<ruby>行<rt>い</rt></ruby>きました。//<br/>' +
      'おばあさんが<ruby>川<rt>かわ</rt></ruby>で<ruby>洗濯<rt>せんたく</rt></ruby>をしていると、/ <ruby>川上<rt>かわかみ</rt></ruby>から、/ <ruby>大<rt>おお</rt></ruby>きな<ruby>桃<rt>もも</rt></ruby>がどんぶらこ、/ どんぶらこと<ruby>流<rt>なが</rt></ruby>れてきました。//<br/>' +
      '「おや、/ これは<ruby>大<rt>おお</rt></ruby>きな<ruby>桃<rt>もも</rt></ruby>だこと。/ お<ruby>家<rt>うち</rt></ruby>に<ruby>持<rt>も</rt></ruby>って<ruby>帰<rt>かえ</rt></ruby>って、/ おじいさんと<ruby>食<rt>た</rt></ruby>べましょう。」//',
    directorNotes: 'Bawakan dengan gaya mendongeng tradisional yang ramah. Suarakan onomatope "donburako, donburako" secara berayun mengikuti aliran air sungai.',
    targetDurationSeconds: 22,
  },
];
