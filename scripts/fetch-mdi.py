#!/usr/bin/env python3
"""Fetch Material Design Icons (the same @mdi/font version prts.wiki loads) into preview/vendor/mdi/, subset to the icons the preview pages use.

现网所有页面都加载 static.prts.wiki/mdi/7.4.47 的 materialdesignicons.min.css，{{mdi}} / {{Popup}} 输出 <span class="mdi mdi-…">。
样例页要和现网一样「走 mdi」（敌人页「技能与天赋」后的问号就是 {{Popup}} 的 mdi help-circle-outline），但整套字体 400 KB、CSS 340 KB，
样例页只用到几个：这里从 npm 取同一版本的 @mdi/font，扫 preview/_src/pages/*.html 里出现的 mdi-<名字>，用 fontTools 只留这几个字形。
不直接引 static.prts.wiki：那边只给 prts.wiki 来源回 CORS 头，别的站点（文档站、本地 file://）加载字体会被拦。

    python3 scripts/fetch-mdi.py                     # 默认走 registry.npmjs.org
    python3 scripts/fetch-mdi.py --registry https://registry.npmmirror.com

要 fontTools：pip install fonttools brotli（或 uv run --with fonttools --with brotli python scripts/fetch-mdi.py）。

生成物：
    preview/vendor/mdi/materialdesignicons-subset.woff2   子集字体
    preview/vendor/mdi/mdi.css                           @font-face + 现网同款 .mdi:before 基础规则 + 用到的图标
    preview/vendor/mdi/LICENSE · NOTICE.md               包里的 Pictogrammers Free License · 来源说明
样例页用了新的 mdi 图标就重跑。
"""
import argparse, io, pathlib, re, sys, tarfile, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'preview' / 'vendor' / 'mdi'
PAGES = ROOT / 'preview' / '_src' / 'pages'
VERSION = '7.4.47'   # 同现网 static.prts.wiki/mdi/7.4.47
# 修饰类，不是图标
MODIFIERS = re.compile(r'^(spin|rotate-\d+|flip-[hv]|\d+px|light|dark|inactive)$')


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--registry', default='https://registry.npmjs.org')
    ns = ap.parse_args()
    try:
        from fontTools import subset
    except ImportError:
        raise SystemExit('需要 fontTools：pip install fonttools brotli')

    used = set()
    for page in sorted(PAGES.glob('*.html')):
        for m in re.finditer(r'\bmdi-([a-z0-9-]+)', page.read_text(encoding='utf-8')):
            if not MODIFIERS.match(m.group(1)):
                used.add(m.group(1))
    if not used:
        raise SystemExit('preview/_src/pages 里没有用到 mdi 图标')

    url = f'{ns.registry.rstrip("/")}/@mdi/font/-/font-{VERSION}.tgz'
    with urllib.request.urlopen(url) as res:
        tgz = tarfile.open(fileobj=io.BytesIO(res.read()), mode='r:gz')
    read = lambda name: tgz.extractfile(f'package/{name}').read()
    css = read('css/materialdesignicons.min.css').decode('utf-8')
    woff2 = read('fonts/materialdesignicons-webfont.woff2')
    license_text = read('LICENSE').decode('utf-8')

    base = re.search(r'\.mdi:before,\.mdi-set\{[^}]*\}', css)
    if not base:
        raise SystemExit('@mdi/font 的 CSS 里找不到 .mdi:before 基础规则，版本变了要看一下')
    rules, codepoints = [], []
    for name in sorted(used):
        m = re.search(r'\.mdi-' + re.escape(name) + r'::before\{content:"\\([0-9A-F]+)"\}', css)
        if not m:
            raise SystemExit(f'@mdi/font {VERSION} 里没有 mdi-{name}')
        rules.append(m.group(0))
        codepoints.append(int(m.group(1), 16))

    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = []
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    font = subset.load_font(io.BytesIO(woff2), opts)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=codepoints)
    sub.subset(font)
    buf = io.BytesIO()
    subset.save_font(font, buf, opts)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'materialdesignicons-subset.woff2').write_bytes(buf.getvalue())
    (OUT / 'mdi.css').write_text(
        f'/* Material Design Icons {VERSION}（@mdi/font；Pictogrammers Free License：字体与图标按 Apache-2.0，见同目录 LICENSE）的子集：只含样例页用到的 {len(used)} 个图标，'
        f'由 scripts/fetch-mdi.py 生成。基础规则与现网 static.prts.wiki/mdi/{VERSION} 那份相同 */\n'
        '@font-face{font-family:"Material Design Icons";src:url("materialdesignicons-subset.woff2") format("woff2");font-weight:normal;font-style:normal}\n'
        + base.group(0) + '\n' + '\n'.join(rules) + '\n',
        encoding='utf-8')
    (OUT / 'LICENSE').write_text(license_text, encoding='utf-8')
    (OUT / 'NOTICE.md').write_text(
        f'# Material Design Icons（子集）\n\n'
        f'`materialdesignicons-subset.woff2` / `mdi.css` 取自 npm 包 [@mdi/font@{VERSION}](https://www.npmjs.com/package/@mdi/font/v/{VERSION})'
        f'（即现网 prts.wiki 从 `static.prts.wiki/mdi/{VERSION}` 加载的那一版），由 `scripts/fetch-mdi.py` 生成：'
        f'字体用 fontTools 只留样例页用到的图标（{", ".join("mdi-" + n for n in sorted(used))}），CSS 只留 `@font-face`、`.mdi:before` 基础规则和这几个图标。\n\n'
        f'- 按包里的 Pictogrammers Free License 授权（见同目录 `LICENSE`）：字体与图标按 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)，版权归 Pictogrammers 及各图标作者，不在本仓库 MIT 许可范围内。\n'
        f'- 给预览站的样例页用（现网 `{{{{mdi}}}}` / `{{{{Popup}}}}` 输出的 `<span class="mdi mdi-…">`）。\n'
        f'- 重抓：`python3 scripts/fetch-mdi.py`（样例页用了新图标就重跑）。\n',
        encoding='utf-8')
    print(f'preview/vendor/mdi/ ← @mdi/font@{VERSION}：{len(used)} 个图标（{", ".join(sorted(used))}），'
          f'子集 {len(buf.getvalue()) / 1024:.1f} KB')


if __name__ == '__main__':
    main()
