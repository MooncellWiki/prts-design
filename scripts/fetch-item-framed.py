#!/usr/bin/env python3
"""把 prts.wiki 现网拼好的道具图（文件:道具_带框_<名>.png = 游戏底图 sprite_item_r* + 图标合成，183×183，{{道具图标}} 输出的就是它）
原样抓到 preview/assets/item/framed/<id>.png，供预览页的 .ak-item 直接用——与现网 / 游戏一个像素不差，皮肤不必自己叠框。

抓哪些：扫 preview/_src/pages/*.html 里引用到的 assets/item/framed/<id>.png（先在页面里写引用再跑），<id> → 道具名 查 preview/assets/item/manifest.json（torappu item_table 的 id / name / rarity）。
路径：prts.wiki 主站对脚本 403、media.prts.wiki 不拦，而 MediaWiki 的文件路径就是文件名的 md5 分桶（/{h[0]}/{h[:2]}/<文件名>），本地算出来直接拉，不用 API。
已存在的文件跳过；--force 全部重抓；--ids 4001,30012 只抓指定的。

用法：python3 scripts/fetch-item-framed.py [--force] [--ids id,id,…]
"""
import argparse, hashlib, json, pathlib, re, urllib.parse, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ROOT / 'preview' / '_src' / 'pages'
ITEM = ROOT / 'preview' / 'assets' / 'item'
OUT = ITEM / 'framed'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
MEDIA = 'https://media.prts.wiki/'
# 文件名不按「道具_带框_<名>.png」规则的：招聘合同现网是 招聘合同_<稀有度-1>.png（底图带一个空方框，干员头像另叠上去，见 .ak-item__avatar）
SPECIAL = {'7001': '招聘合同_5.png'}


def media_url(filename):
    """MediaWiki 上传目录的哈希路径：文件名（空格 → 下划线）的 md5 前两位分桶"""
    fn = filename.replace(' ', '_')
    h = hashlib.md5(fn.encode('utf-8')).hexdigest()
    return MEDIA + '%s/%s/%s' % (h[0], h[:2], urllib.parse.quote(fn))


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://prts.wiki/'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--ids', default='')
    a = ap.parse_args()
    manifest = json.loads((ITEM / 'manifest.json').read_text(encoding='utf-8'))
    if a.ids:
        ids = a.ids.split(',')
    else:
        ids = sorted({m.group(1) for p in PAGES.glob('*.html') for m in re.finditer(r'assets/item/framed/([0-9A-Za-z_]+)\.png', p.read_text(encoding='utf-8'))})
    OUT.mkdir(parents=True, exist_ok=True)
    missing = []
    for i in ids:
        name = manifest.get(i, {}).get('name')
        if not name:
            missing.append(i); continue
        dst = OUT / ('%s.png' % i)
        if dst.exists() and not a.force:
            continue
        url = media_url(SPECIAL.get(i) or '道具_带框_%s.png' % name)
        try:
            data = fetch(url)
        except Exception as e:
            print('  FAIL %s %s: %s' % (i, name, e)); missing.append(i); continue
        if not data.startswith(b'\x89PNG'):
            print('  not png: %s' % url); missing.append(i); continue
        dst.write_bytes(data)
        print('%-20s %-12s %6d B' % (i, name, len(data)))
    if missing:
        print('missing / failed:', ', '.join(missing))
    print('-> %s (%d files)' % (OUT.relative_to(ROOT), len(list(OUT.glob('*.png')))))


if __name__ == '__main__':
    main()
