#!/usr/bin/env python3
"""把 prts.wiki 现网 Widget:CharinfoV2（干员页「干员信息」舞台）用到的静态文件原样抓到 preview/vendor/charinfo/，版本号钉死。

预览页 preview/operator.html 的舞台直接跑现网这套 CSS / JS（一字不改），只是资源路径指到本地快照：
  static.prts.wiki/charinfo/charinfo_<ver>.min.css      桌面样式（Widget 里 media="screen and (min-width: 600px)"）
  static.prts.wiki/charinfo/charinfom_<ver>.min.css     手机样式（max-width: 600px）——两份里 url() 引的 img/ui/*.png 改成相对路径，其余原样
  static.prts.wiki/charinfo/charinfo_<ver>.min.js       舞台脚本（jQuery；靠 RLQ.push(['jquery', fn]) 等 jQuery 就绪，预览页用一个两行的 RLQ 替身）
  static.prts.wiki/charinfo/charId<ver>.js              干员名 → char id 表（语音 / 立绘 URL 用）
  static.prts.wiki/charinfo/charVoice<ver>.js           全干员语音文本（1MB）——只留 --chars 指定的干员（默认 char_010_chen），脚本只按 charvoice_list[charId] 取
  static.prts.wiki/charinfo/Charname_min_<ver>.TTF      名字牌字体（Widget 里的 @font-face 'charname'）
  static.prts.wiki/charinfo/img/ui/*.png                HUD 白线稿图标（DOM 与 CSS 直接引用的这一批；脚本运行时按状态换的 musicOn / eyeOff / sub / elite*_blue… 也一并抓下）
  static.prts.wiki/npm/crypto-js@3.1.9/{core,md5}.min.js  立绘 / 头像 / logo 的 media.prts.wiki 路径靠文件名 md5
  code.jquery.com/jquery-3.7.1.min.js → preview/vendor/jquery/   MediaWiki 1.43 自带的 jQuery 版本；生产环境由 ResourceLoader 提供，预览页自己带

脚本**没有**抓的（运行时仍从现网拉，浏览器直接加载，不需要 CORS）：
  media.prts.wiki 的立绘 / 头像 / 势力 logo / 时装品牌图 / 场景图（URL 由 charinfo JS 用 getPath() 算出）
  static.prts.wiki/charinfo/img/{class_*,star_*,branch/*}.png 职业 / 星级 / 分支图标（JS 拼绝对 URL）
  static.prts.wiki/music/ 的 BGM、torappu.prts.wiki/assets/audio/ 的语音、spine38/ 的动态立绘
版本号变了（现网 Widget:CharinfoV2 源码里那几行 <link>/<script>）改这里的 VER 重跑即可。

用法：python3 scripts/fetch-charinfo.py [--chars char_010_chen,char_1013_chen2]
"""
import argparse, datetime, json, pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'preview' / 'vendor' / 'charinfo'
JQ_OUT = ROOT / 'preview' / 'vendor' / 'jquery'
STATIC = 'https://static.prts.wiki/'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

# 现网 Widget:CharinfoV2 源码（2026-08-29 抓取）里钉的版本
VER = {'css': '20250518', 'js': '20260322_2', 'id': '20260604', 'voice': '20260604', 'font': '20260604'}
CRYPTO = 'crypto-js@3.1.9'
JQUERY = ('https://code.jquery.com/jquery-3.7.1.min.js', 'jquery-3.7.1.min.js')
# DOM / CSS 直接引用的 + JS 按状态换的 HUD 图标
UI_ICONS = ['back', 'back_switch', 'check', 'close', 'cv', 'download', 'dynOff', 'dynOn', 'eyeOff', 'eyeOn', 'fullscreen',
            'musicOff', 'musicOn', 'painter', 'plus', 'refullscreen', 'skin', 'skinSelect', 'skin_blue', 'sub', 'switch', 'voice', 'watch', 'headmask2']

FILES = [   # (远端相对 STATIC 的路径, 本地相对 OUT 的路径)
    ('charinfo/charinfo_%s.min.css' % VER['css'], 'charinfo_%s.min.css' % VER['css']),
    ('charinfo/charinfom_%s.min.css' % VER['css'], 'charinfom_%s.min.css' % VER['css']),
    ('charinfo/charinfo_%s.min.js' % VER['js'], 'charinfo_%s.min.js' % VER['js']),
    ('charinfo/charId%s.js' % VER['id'], 'charId%s.js' % VER['id']),
    ('charinfo/charVoice%s.js' % VER['voice'], 'charVoice%s.js' % VER['voice']),
    ('charinfo/Charname_min_%s.TTF' % VER['font'], 'Charname_min_%s.TTF' % VER['font']),
    ('npm/%s/core.min.js' % CRYPTO, 'crypto-js/core.min.js'),
    ('npm/%s/md5.min.js' % CRYPTO, 'crypto-js/md5.min.js'),
] + [('charinfo/img/ui/%s.png' % n, 'img/ui/%s.png' % n) for n in UI_ICONS]


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def trim_voice(js, chars):
    """charVoice*.js = `var charvoice_list ={…全干员…}`；只留 chars 里的干员（含 _cn_TOPOLECT 之类的后缀键）"""
    m = re.match(r'\s*var\s+charvoice_list\s*=\s*', js)
    if not m: print('  charVoice: 开头不是 var charvoice_list =，原样保留'); return js, None
    body = js[m.end():].strip().rstrip(';')
    try: data = json.loads(body)
    except ValueError as e: print('  charVoice: 不是合法 JSON（%s），原样保留' % e); return js, None
    keep = {k: v for k, v in data.items() if any(k == c or k.startswith(c + '_') for c in chars)}
    out = 'var charvoice_list = ' + json.dumps(keep, ensure_ascii=False, separators=(',', ':')) + ';\n'
    return out, (len(data), len(keep))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--chars', default='char_010_chen', help='charVoice 里保留的干员 id，逗号分隔')
    a = ap.parse_args()
    chars = [c for c in a.chars.split(',') if c]
    OUT.mkdir(parents=True, exist_ok=True); JQ_OUT.mkdir(parents=True, exist_ok=True)
    notes = []
    for remote, local in FILES:
        url = STATIC + remote; dst = OUT / local; dst.parent.mkdir(parents=True, exist_ok=True)
        data = fetch(url); note = ''
        if local.endswith('.css'):
            text = data.decode('utf-8')
            text, n = re.subn(r'url\((?:https?:)?//static\.prts\.wiki/charinfo/img/ui/', 'url(img/ui/', text)
            note = 'url() 里 %d 处 static.prts.wiki/charinfo/img/ui/ → img/ui/' % n
            data = text.encode('utf-8')
        elif local.startswith('charVoice'):
            text, stat = trim_voice(data.decode('utf-8'), chars)
            if stat: note = '只留 %s（%d 个干员 → %d 个键）' % ('、'.join(chars), *stat)
            data = text.encode('utf-8')
        dst.write_bytes(data)
        print('%-44s %8d  %s' % (local, len(data), note)); notes.append((remote, local, len(data), note))
    jq = fetch(JQUERY[0]); (JQ_OUT / JQUERY[1]).write_bytes(jq); print('%-44s %8d' % ('../jquery/' + JQUERY[1], len(jq)))

    today = datetime.date.today().isoformat()
    (OUT / 'NOTICE.md').write_text(
        '# vendor/charinfo — prts.wiki 现网 Widget:CharinfoV2 的静态文件快照\n\n'
        '由 `scripts/fetch-charinfo.py` 于 %s 抓取（版本：CSS %s · JS %s · charId %s · charVoice %s · 字体 %s · %s）。\n'
        '预览页 `preview/operator.html` 的「干员信息」舞台直接跑这套现网 CSS / JS，DOM 与模板参数取自现网「陈」页面的渲染结果，脚本一字不改。\n\n'
        '| 远端 | 本地 | 改动 |\n|---|---|---|\n' % (today, VER['css'], VER['js'], VER['id'], VER['voice'], VER['font'], CRYPTO)
        + ''.join('| static.prts.wiki/%s | %s | %s |\n' % (r, l, n or '原样') for r, l, _, n in notes)
        + '| %s | ../jquery/%s | 原样（MIT；MediaWiki 1.43 自带同版本，生产环境由 ResourceLoader 提供） |\n' % JQUERY
        + '\n运行时仍从现网加载的：media.prts.wiki 的立绘 / 头像 / logo / 场景图（URL 由 JS 用文件名 md5 算出），static.prts.wiki/charinfo/img/ 的职业 / 星级 / 分支图标，'
        'static.prts.wiki/music/ 的 BGM，torappu.prts.wiki/assets/audio/ 的语音。\n\n'
        'charinfo 的 CSS / JS / 字体 / 图标是 PRTS（Mooncell）站点自有资源，仅供本设计稿预览对照；crypto-js MIT；jQuery MIT。\n', encoding='utf-8')
    print('NOTICE.md 已写；共', sum(n for _, _, n, _ in notes) + len(jq), 'bytes')


if __name__ == '__main__':
    main()
