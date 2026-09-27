#!/usr/bin/env python3
"""把游戏的道具底框（稀有度圆框）从 prts.wiki 原样抓到 src/img/item/bg_1–6.png，供 .ak-item 当 background-image。

现网 {{道具图标}} 显示的是整张叠好的「道具_带框_<名>.png」（底框 + 图标合成，183×183，BotCathPalug 上传）；
底框本身也在现网：文件:道具_背景_1.png … 道具_背景_6.png（= 游戏 sprite_item_r1–r6：白 / 绿 / 蓝 / 紫 / 金 / 特殊，183×183，2019-05-21 上传，一字未改）。
.ak-item 默认就直接用那张合成图（scripts/fetch-item-framed.py 抓）；这批底框只给 .ak-item--bare——手里只有裸图标（torappu item_icon 透明 png，preview/assets/item/）时，底框走 CSS、图标压上去，换 data-rarity 就换框。

prts.wiki 主站对脚本 403，media.prts.wiki 不拦——所以这里直接钉 media 的哈希路径（同 fetch-charinfo.py 钉版本号的做法）；
文件在现网换了再改这张表重跑。另有一张不带编号的 文件:道具_背景.png（黄框，最早上传的那张），没有对应稀有度，不抓。

用法：python3 scripts/fetch-item-bg.py
"""
import pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'packages' / 'css' / 'src' / 'img' / 'item'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
MEDIA = 'https://media.prts.wiki/'
# 稀有度 → 文件:道具_背景_N.png 在 media.prts.wiki 上的路径（MediaWiki 按文件名 md5 分桶）
FILES = {
    1: 'c/c8/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_1.png',
    2: '4/48/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_2.png',
    3: '7/71/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_3.png',
    4: 'd/d2/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_4.png',
    5: 'a/a3/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_5.png',
    6: '5/53/%E9%81%93%E5%85%B7_%E8%83%8C%E6%99%AF_6.png',
}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Referer': 'https://prts.wiki/'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for n, rel in FILES.items():
        data = fetch(MEDIA + rel)
        if not data.startswith(b'\x89PNG'):
            raise SystemExit('not a png: %s' % rel)
        (OUT / ('bg_%d.png' % n)).write_bytes(data)
        print('bg_%d.png  %6d B' % (n, len(data)))
    print('-> %s' % OUT.relative_to(ROOT))


if __name__ == '__main__':
    main()
