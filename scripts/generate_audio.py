import asyncio
import os
import edge_tts

AUDIO_TASKS = [
    # --- SEIYU DIALOGUE LINES ---
    # Scene 1: Kizuna no Kanata
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "諦めるな！僕たちが毎日積み重ねてきた努力は、絶対に裏切らない！",
        "output": "public/audio/seiyu/s1_line1.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-3%",
        "pitch": "+2Hz",
        "text": "うん... 行こう、ケンジ。一緒にあの表彰台の一番上へ！",
        "output": "public/audio/seiyu/s1_line2.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-5%",
        "pitch": "-4Hz",
        "text": "前を向け、お前たち！全員の期待を背負って、全力で駆け抜けろ！",
        "output": "public/audio/seiyu/s1_line3.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "+5%",
        "pitch": "+3Hz",
        "text": "行くぞ、ゴールへ！ここが僕らの最高の瞬間だーっ！",
        "output": "public/audio/seiyu/s1_line4.mp3",
    },
    # Scene 2: Hoshi Furu Yoru no Yakusoku
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-3%",
        "pitch": "-2Hz",
        "text": "あの星が見えるか？来年も、再来年も...ずっとお前と一緒に見たいんだ。",
        "output": "public/audio/seiyu/s2_line1.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-2%",
        "pitch": "+3Hz",
        "text": "レン君...バカ。そんなこと言われたら、涙が出ちゃうじゃない。",
        "output": "public/audio/seiyu/s2_line2.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-5%",
        "pitch": "+0Hz",
        "text": "二人の影は静かに寄り添い、夜空には無数の星が優しく降り注いでいた。",
        "output": "public/audio/seiyu/s2_line3.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-2%",
        "pitch": "+0Hz",
        "text": "約束だ。どんな未来が待っていても、僕の手を離さないで。",
        "output": "public/audio/seiyu/s2_line4.mp3",
    },
    # Scene 3: Isekai no Shugosha
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "+5%",
        "pitch": "+2Hz",
        "text": "我が剣よ、光を宿せ！この世界を滅ぼそうとする闇を、今ここで断ち切る！",
        "output": "public/audio/seiyu/s3_line1.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "+0%",
        "pitch": "+4Hz",
        "text": "カイト、結界の維持は任せて！聖なる光よ、勇者の刃に力を与え給え！",
        "output": "public/audio/seiyu/s3_line2.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-8%",
        "pitch": "-8Hz",
        "text": "愚かな人間どもめ...我が真の絶望の前に、平伏すがよい！",
        "output": "public/audio/seiyu/s3_line3.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "+8%",
        "pitch": "+4Hz",
        "text": "終わりだ魔王！俺たちの信じる絆の力を...喰らえーっ！",
        "output": "public/audio/seiyu/s3_line4.mp3",
    },
    # Scene 4: Houkago Tantei Club
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-2%",
        "pitch": "-1Hz",
        "text": "犯人が残した唯一のミス...それは、密室に残されたこの濡れたハンカチだ！",
        "output": "public/audio/seiyu/s4_line1.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "+0%",
        "pitch": "+2Hz",
        "text": "まさか、あの時体育館の裏庭で見かけた人影って...！",
        "output": "public/audio/seiyu/s4_line2.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-1%",
        "pitch": "+1Hz",
        "text": "そう、トリックは全て解けた。真実はいつも、ひとつだけだ！",
        "output": "public/audio/seiyu/s4_line3.mp3",
    },
    # Scene 5: Mahou Shoujo no Kakugo
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "+0%",
        "pitch": "+2Hz",
        "text": "たとえ世界中を敵に回しても、私はあの子を助けるって決めたの！",
        "output": "public/audio/seiyu/s5_line1.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "+5%",
        "pitch": "+5Hz",
        "text": "ユキちゃん、一人で行かないで！私も一緒に戦うよ！",
        "output": "public/audio/seiyu/s5_line2.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "+0%",
        "pitch": "+3Hz",
        "text": "ありがとう、サクラ。奇跡は起こすもの...私たちの笑顔を取り戻そう！",
        "output": "public/audio/seiyu/s5_line3.mp3",
    },

    # --- KIKIKAKITORI (LISTENING PACKAGES) ---
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-2%",
        "pitch": "+0Hz",
        "text": "まもなく3番線に、10時15分発、新大阪行き ひかり501号がまいります。黄色い点字ブロックの内側までお下がりください。次に、明日の朝の集合について先生から連絡します。明日の朝、必ず電子辞書または辞書を持ってきてください。なお、濃霧のため、学校行きの連絡バスの到着が約15分遅れております。出発の前に、2階の図書館の前に集合してください。閉会式は予定通り、午後2時半より体育館にて行います。以上です。",
        "output": "public/audio/kikikakitori/set1.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-2%",
        "pitch": "+0Hz",
        "text": "いらっしゃいませ！サンドイッチが250円、牛乳が120円でございます。合計で370円になります。500円のお預かりですので、おつりは130円のお返しでございます。レシートはご利用ですか？また、温かいお茶は入口右側の棚にございます。本日はご来店いただき、誠にありがとうございます。",
        "output": "public/audio/kikikakitori/set2.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-3%",
        "pitch": "+0Hz",
        "text": "生徒の皆さんにお知らせします。今週の金曜日に開催される文化祭の準備についてです。各クラスの展示準備は、午後4時までに完了させてください。体育館での演劇部のリハーサルは午後2時から始まります。また、模擬店で火気を使用するクラスは、職員室で消火器を必ず受け取ってください。ゴミの分別は、昇降口前の回収所にて行います。",
        "output": "public/audio/kikikakitori/set3.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "+2%",
        "pitch": "+1Hz",
        "text": "もしもし、田中くん？今どこにいる？ハチ公前広場にいるんだけど、人が多くて見つからないよ。えっ、JR渋谷駅のハチ公改札口を出たところ？分かった、緑色の看板のカフェの前に立ってるね。青いリュックサックを背負ってるから目印にして。あと5分くらいで合流できそうかな？気をつけて来てね！",
        "output": "public/audio/kikikakitori/set4.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-2%",
        "pitch": "+1Hz",
        "text": "続いて、明日の全国の天気予報です。関東地方は朝から晴れて清々しい秋晴れとなるでしょう。東京の最高気温は22度、最低気温は14度の予想です。朝晩は冷え込みますので、上着を一枚ご用意してお出かけください。一方、北海道と東北地方では日本海からの低気圧の影響により、夕方以降に強い雨が降る見込みです。折りたたみ傘をお持ちください。",
        "output": "public/audio/kikikakitori/set5.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-4%",
        "pitch": "+0Hz",
        "text": "聞き書きのディクテーション練習です。よく聞いて書き取ってください。1番：図書館で日本語の辞書を借りました。2番：来週の月曜日に東京へ行きます。3番：駅前の喫茶店で美味しいコーヒーを飲みました。4番：明日の天気は晴れ時々曇りでしょう。5番：毎日休まずに漢字の練習を続けています。",
        "output": "public/audio/kikikakitori/set6.mp3",
    },

    # --- RODOKU (LITERARY MASTERPIECES) ---
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-5%",
        "pitch": "+1Hz",
        "text": "寒い冬がやってきました。夜になると、北風がピューピューと吹いて、森の木々を揺らしました。小さな子狐は、初めて見る白い雪に目を丸くして、お母さん狐に駆け寄りました。「お母さん、手が冷たいよ。ちくちく痛いよ。」お母さん狐は、愛おしそうに子狐の小さな手を包み込みました。",
        "output": "public/audio/rodoku/set1.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-6%",
        "pitch": "-2Hz",
        "text": "雨ニモマケズ、風ニモマケズ。雪ニモ夏ノ暑サニモマケヌ丈夫ナカラダヲモチ、慾ハナク、決シテ瞋ラズ、イツモシヅカニワラッテヰル。一日ニ玄米四合ト味噌ト少シノ野菜ヲタベ、アラユルコトヲ自分ヲカンジョウニ入レズニ、ヨクミキキシワカリ、ソシテワスレズ。",
        "output": "public/audio/rodoku/set2.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-4%",
        "pitch": "-1Hz",
        "text": "メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。メロスには政治がわからぬ。メロスは、村の牧人である。笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此のシラクスの市にやって来た。",
        "output": "public/audio/rodoku/set3.mp3",
    },
    {
        "voice": "ja-JP-KeitaNeural",
        "rate": "-3%",
        "pitch": "+0Hz",
        "text": "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーいと囃したからである。",
        "output": "public/audio/rodoku/set4.mp3",
    },
    {
        "voice": "ja-JP-NanamiNeural",
        "rate": "-4%",
        "pitch": "+2Hz",
        "text": "むかし、むかし、あるところに、おじいさんとおばあさんが住んでいました。おじいさんは山へ柴刈りに、おばあさんは川へ洗濯に行きました。おばあさんが川で洗濯をしていると、川上から、大きな桃がどんぶらこ、どんぶらこと流れてきました。「おや、これは大きな桃だこと。お家に持って帰って、おじいさんと食べましょう。」",
        "output": "public/audio/rodoku/set5.mp3",
    },
]

async def generate_single(task):
    os.makedirs(os.path.dirname(task["output"]), exist_ok=True)
    communicate = edge_tts.Communicate(
        text=task["text"],
        voice=task["voice"],
        rate=task["rate"],
        pitch=task["pitch"],
    )
    await communicate.save(task["output"])
    print(f"Generated: {task['output']} ({task['voice']})")

async def main():
    print(f"Generating {len(AUDIO_TASKS)} authentic Japanese voice files...")
    for task in AUDIO_TASKS:
        try:
            await generate_single(task)
        except Exception as e:
            print(f"Error on {task['output']}: {e}")
    print("All audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
