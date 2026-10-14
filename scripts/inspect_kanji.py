import urllib.request
import re
import json

codes = {
    'michi': ('09053', '道'),
    'yume': ('05922', '夢'),
    'wa': ('0548c', '和'),
    'chikara': ('0529b', '力'),
    'kokoro': ('05fc3', '心'),
    'hikari': ('05149', '光'),
    'tomo': ('053cb', '友')
}

result = {}
for key, (code, kanji) in codes.items():
    url = f"https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/{code}.svg"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        xml_text = resp.read().decode('utf-8')
    # find path tags with kvg:type and d
    matches = re.findall(r'<path[^>]+kvg:type="([^"]+)"[^>]+d="([^"]+)"', xml_text)
    if not matches:
        matches = re.findall(r'<path[^>]+d="([^"]+)"[^>]+kvg:type="([^"]+)"', xml_text)
        matches = [(t, d) for d, t in matches]
    result[key] = {
        'code': code,
        'kanji': kanji,
        'stroke_count': len(matches),
        'strokes': [{'type': m[0], 'd': m[1]} for m in matches]
    }
    print(f"{key}: {len(matches)} strokes")

with open('scripts/official_kanjivg.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print("Saved to scripts/official_kanjivg.json")
