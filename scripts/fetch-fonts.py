#!/usr/bin/env python3
"""Fetch the self-hosted web fonts into src/fonts/ and generate src/fonts.css.

三类来源，都不需要 npm：
  · 官网静态资源（SITE_FONTS）：Novecento Sans Wide UltraBold / Bender —— 明日方舟官网（ak.hypergryph.com）自托管的 woff2 原文件。
    URL 钉住当前 hash；官网重新部署后 hash 会变，
    脚本会自动从首页 CSS 里重新发现；再失败就保留已落盘的文件并告警。注意官网给的是 ASCII 子集（各 101 字形），
    非 ASCII 字符（· » — × ° 等）由 tokens.css 链里后面的自托管 OFL 字体逐字接住。
    原文件没有 gasp 表，落盘前补一张（见 with_gasp）——这一步要 fontTools：pip install fonttools brotli（--offline 不需要）。
  · 已落盘的文件（SITE_FONTS 里没有 'url' 的面）：Novecento Sans Wide Medium / DemiBold / Bold —— 完整字形（590 字形，带 lnum / case：
    大写高度的数字与标点）。没有下载地址：脚本不动这些 woff2，只把它们写进 fonts.css。
  · Fontsource npm 包（PKG_FONTS）：Noto Sans SC / Oswald / Chakra Petch / JetBrains Mono —— = Google Fonts 同一批 woff2 切片 +
    unicode-range，随包带 OFL 全文，版本钉死。

    python3 scripts/fetch-fonts.py                     # 默认走 registry.npmjs.org
    python3 scripts/fetch-fonts.py --registry https://registry.npmmirror.com   # 国内镜像
    python3 scripts/fetch-fonts.py --offline           # 不下载，只用 src/fonts/ 里已有的文件重新生成 fonts.css

生成物：
    src/fonts/<dir>/*.woff2 + LICENSE | NOTICE.md   字体文件（按族分目录）+ 授权全文 / 来源说明
    src/fonts.css                                  @font-face 声明（url 相对 src/，皮肤侧 resources/fonts → ../../src/fonts 符号链接同样成立）
"""
import argparse, gzip, io, json, pathlib, re, sys, tarfile, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / 'packages' / 'css' / 'src' / 'fonts'
CSS_OUT = ROOT / 'packages' / 'css' / 'src' / 'fonts.css'
SITE_HOME = 'https://ak.hypergryph.com/'
SITE_CDN = 'https://web.hycdn.cn/arknights/official/_next/static/media/'

# ── 官网静态资源：文件名（去 hash）→ 字重 / 字形；url 为抓取时钉住的完整地址（hash 变了会自动重新发现）
SITE_FONTS = [
    {
        'dir': 'novecento-sans-wide', 'family': 'Novecento Sans Wide',
        'role': '拉丁展示字（--ak-font-display）',
        # 500–700 是完整字形的文件（没有 'url'，用已落盘的）：带 lnum，font-variant-numeric: lining-nums 就把数字和 - ( ) : # 这些标点换成大写高度的那一套。
        # 800 只有官网的 ASCII 子集：数字只有一套 560 高的（大写 700），没有 GSUB。
        # 'caps_from'：同字重再出一条只管 CAPS_RANGE 的面，取 Bold 的完整文件——800 里这些字符由 Bold 的大写高度字形顶上（笔画细 12%）。
        'label': '500–700 完整字形 · 800 官网同源',
        'source': '来源：UltraBold 是明日方舟官网（%(home)s）自托管的 woff2 原文件（web.hycdn.cn，Next.js 静态资源）。\n'
                  '改动：UltraBold 只补了一张 gasp 表（version 1，全字号 0x000F = 含 symmetric smoothing，同 Fontsource 各族），字形 / 度量 / 其它表未动（scripts/fetch-fonts.py · with_gasp）。\n',
        'coverage': '注意：UltraBold 是官网发布的 ASCII 子集（101 字形），非 ASCII 字符由 tokens.css 字体链后段接住；Medium / DemiBold / Bold 是完整的 590 字形（带 lnum）。\n',
        'faces': [
            {'file': 'Novecentosanswide-Medium.woff2',    'weight': '500', 'style': 'normal'},
            {'file': 'Novecentosanswide-DemiBold.woff2',  'weight': '600', 'style': 'normal'},
            {'file': 'Novecentosanswide-Bold.woff2',      'weight': '700', 'style': 'normal'},
            {'file': 'Novecentosanswide-UltraBold.woff2', 'weight': '800', 'style': 'normal', 'url': SITE_CDN + 'Novecentosanswide-UltraBold.e5e00ac9.woff2',
             'caps_from': 'Novecentosanswide-Bold.woff2'},
        ],
    },
    {
        'dir': 'bender', 'family': 'Bender',
        'role': 'HUD 标签 / 数值（--ak-font-label），也是 --ak-font-display 的第二位',
        'faces': [
            {'file': 'Bender-Regular.woff2', 'weight': '400', 'style': 'normal', 'url': SITE_CDN + 'Bender-Regular.6950ba72.woff2'},
            {'file': 'Bender-Bold.woff2',    'weight': '700', 'style': 'normal', 'url': SITE_CDN + 'Bender-Bold.b4c7998a.woff2'},
        ],
    },
]

# lnum 会换掉的字符里落在 ASCII 的那些：# ( ) - 0–9 : ; [ ] { }（caps_from 用）
CAPS_RANGE = 'U+23, U+28-29, U+2D, U+30-3B, U+5B, U+5D, U+7B, U+7D'

# ── Fontsource：npm 包、版本、包内 css（决定 unicode-range 与文件清单）、落盘目录、对外 font-family 名（= tokens.css 链里的名字）、挑选规则
PKG_FONTS = [
    {   # 正文 —— 思源黑体的 Google 构建（Noto Sans CJK SC = Source Han Sans SC），可变字重 100–900，Google 的 101 片切分：页面只下载用到的片
        'pkg': '@fontsource-variable/noto-sans-sc', 'version': '5.3.0', 'css': ['wght.css'],
        'dir': 'noto-sans-sc', 'family': 'Noto Sans SC', 'role': '正文（--ak-font-body）',
        'keep': lambda f: True,
    },
    {   # 压缩字 —— 官网也自托管 Oswald；--ak-font-condensed 的首选、--ak-font-display 在 Novecento / Bender 之后的接字（含非 ASCII）；可变字重 200–700
        'pkg': '@fontsource-variable/oswald', 'version': '5.3.0', 'css': ['wght.css'],
        'dir': 'oswald', 'family': 'Oswald', 'role': '压缩字（--ak-font-condensed）· 展示字缺字接住',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-', f) is not None,
    },
    {   # HUD 标签 / 数值 —— 官网 Bender 只有 ASCII，· » — 等非 ASCII 由同为切角方形的 Chakra Petch 逐字接住；只要 400–700 正体
        'pkg': '@fontsource/chakra-petch', 'version': '5.3.0', 'css': ['latin.css', 'latin-ext.css'],
        'dir': 'chakra-petch', 'family': 'Chakra Petch', 'role': 'HUD 标签 / 数值缺字接住（--ak-font-label 第二位）',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-(400|500|600|700)-normal\.woff2$', f) is not None,
    },
    {   # 等宽 —— 可变字重 100–800，正体 + 斜体（语法高亮的注释用斜体）
        'pkg': '@fontsource-variable/jetbrains-mono', 'version': '5.3.0', 'css': ['wght.css', 'wght-italic.css'],
        'dir': 'jetbrains-mono', 'family': 'JetBrains Mono', 'role': '等宽（--ak-font-mono）',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-', f) is not None,
    },
]

# ───────────────────────────── helpers ─────────────────────────────
def fetch(url, timeout=120):
    req = urllib.request.Request(url, headers={'User-Agent': 'prts-design fetch-fonts', 'Accept-Encoding': 'gzip, identity'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        b = r.read()
        return gzip.decompress(b) if r.headers.get('Content-Encoding') == 'gzip' else b

FACE_RE = re.compile(r'@font-face\s*\{([^}]*)\}', re.S)
def parse_faces(css):
    """Fontsource css → [{style, weight, file, range}]"""
    out = []
    for m in FACE_RE.finditer(css):
        body = m.group(1)
        d = {k.strip(): v.strip() for k, v in re.findall(r'([\w-]+)\s*:\s*([^;]+);', body)}
        f = re.search(r'url\(([^)]+?)\)', d.get('src', ''))
        if not f: continue
        out.append({
            'style': d.get('font-style', 'normal'),
            'weight': d.get('font-weight', '400'),
            'file': pathlib.PurePosixPath(f.group(1).strip('\'"')).name,
            'range': re.sub(r'\s*,\s*', ', ', d.get('unicode-range', '')).upper(),
        })
    return out

GASP_SYMMETRIC = {0xFFFF: 0x000F}   # 全字号 gridfit | dogray | symmetric gridfit | symmetric smoothing（= Fontsource 各族自带的 gasp）
def with_gasp(data, name):
    """官网同源 woff2 → 补上 version 1 的 gasp 表（已有就原样返回）。只加这一张表：字形、度量、其它表都不动。
    原文件没有 gasp；Bender-Bold 的 maxp.maxSizeOfInstructions 又残留成 1（实际没有一个字形带指令），
    Chrome（Skia 的 DirectWrite 后端）把它当成「有 hinting、没 gasp」，≤ 20px 就落到 DWRITE_RENDERING_MODE_NATURAL：
    ClearType 只做横向抗锯齿、纵向不平滑，0 3 5 9 这类曲线的顶 / 底出锯齿（Windows 低分屏最明显）。
    gasp v1 带 symmetric smoothing → Skia 走 NATURAL_SYMMETRIC，纵向也平滑；DirectWrite 自己的推荐渲染模式同样看这张表。"""
    try:
        from fontTools.ttLib import TTFont, newTable
    except ImportError:
        raise SystemExit('   ✗ 给 %s 补 gasp 表需要 fontTools：pip install fonttools brotli（只重新生成 fonts.css 用 --offline，不需要）' % name)
    font = TTFont(io.BytesIO(data), recalcBBoxes=False, recalcTimestamp=False)
    if 'gasp' in font and font['gasp'].version >= 1 and all(f & 0x0008 for f in font['gasp'].gaspRange.values()):
        return data
    gasp = newTable('gasp'); gasp.version = 1; gasp.gaspRange = dict(GASP_SYMMETRIC)
    font['gasp'] = gasp
    out = io.BytesIO(); font.flavor = 'woff2'; font.save(out)
    return out.getvalue()

_site_index = None
def site_font_urls():
    """官网首页 → 其 CSS → 所有 @font-face 里的 woff2 地址，按去 hash 的文件名索引：{'Bender-Bold.woff2': 'https://…/Bender-Bold.<hash>.woff2'}"""
    global _site_index
    if _site_index is not None: return _site_index
    _site_index = {}
    try:
        html = fetch(SITE_HOME).decode('utf-8', 'ignore')
        for css_url in re.findall(r'href="(https://web\.hycdn\.cn/[^"]+\.css)"', html):
            css = fetch(css_url).decode('utf-8', 'ignore')
            for u in re.findall(r'url\((https://[^)]+?\.woff2)\)', css):
                m = re.match(r'^(.+?)\.[0-9a-f]{8}\.woff2$', pathlib.PurePosixPath(u).name)
                if m: _site_index[m.group(1) + '.woff2'] = u
    except Exception as e:   # noqa
        print('   ! 官网字体重新发现失败：%s' % e)
    return _site_index

def tarball_url(registry, pkg, version):
    return '%s/%s/-/%s-%s.tgz' % (registry.rstrip('/'), pkg, pkg.split('/')[-1], version)

def face_css(family, face, d):
    rng = ' unicode-range: %s;' % face['range'] if face.get('range') else ''
    return ('@font-face { font-family: "%s"; font-style: %s; font-weight: %s; font-display: swap; '
            'src: url("fonts/%s/%s") format("woff2");%s }' % (family, face['style'], face['weight'], d, face['file'], rng))

# ───────────────────────────── main ─────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--registry', default='https://registry.npmjs.org')
    ap.add_argument('--offline', action='store_true', help='不下载，用 src/fonts/<dir>/_faces.json 重新生成 fonts.css')
    args = ap.parse_args()

    css = ['/*! PRTS Design — 自托管 Web 字体（scripts/fetch-fonts.py 生成，勿手改；重跑：python3 scripts/fetch-fonts.py）',
           ' *  各族链见 tokens.css「Typography」。url() 相对本文件（src/）；MW 皮肤侧 resources/fonts.css + resources/fonts/ 是指向 src/ 的符号链接，ResourceLoader 按 resources/ 重写路径。',
           ' *  · 官网同源（ak.hypergryph.com 静态资源，ASCII 子集，落盘时补了 gasp 表）；',
           ' *    Novecento 的 500–700 是完整字形的文件（590 字形，带 lnum）：']
    for s in SITE_FONTS:
        css.append(' *      %-24s → fonts/%s/  · %s' % (s['family'], s['dir'], s['role']))
    css.append(' *  · Fontsource npm 包（= Google Fonts 同批 woff2 切片 + unicode-range，OFL-1.1，版本钉死）：')
    for s in PKG_FONTS:
        css.append(' *      %-45s → fonts/%s/  · %s' % (s['pkg'] + '@' + s['version'], s['dir'], s['role']))
    css.append(' */')
    total = 0

    # 1. 官网静态资源
    for spec in SITE_FONTS:
        d = FONT_DIR / spec['dir']; d.mkdir(parents=True, exist_ok=True)
        meta_path = d / '_faces.json'
        if args.offline:
            faces = json.loads(meta_path.read_text(encoding='utf-8'))
            print('%-40s offline · %d faces' % (spec['family'], len(faces)))
        else:
            print('%-40s ← %s…' % (spec['family'], SITE_CDN)); sys.stdout.flush()
            faces = []
            for face in spec['faces']:
                face = dict(face); target = d / face['file']
                if not face.get('url'):   # 没有下载地址：用已落盘的
                    if not target.exists():
                        raise SystemExit('   ✗ %s 不在本地，也没有下载地址' % face['file'])
                    faces.append(face); continue
                try:
                    data = fetch(face['url'])
                except urllib.error.URLError as e:
                    alt = site_font_urls().get(face['file'])
                    if alt and alt != face['url']:
                        print('   ~ %s 钉住的 hash 已失效，改用官网当前 %s' % (face['file'], alt)); face['url'] = alt
                        data = fetch(alt)
                    elif target.exists():
                        print('   ! %s 下载失败（%s），保留已落盘文件' % (face['file'], e)); data = None
                    else:
                        raise SystemExit('   ✗ %s 下载失败且本地没有：%s' % (face['file'], e))
                if data is not None:
                    assert data[:4] == b'wOF2', face['file'] + ' 不是 woff2'
                    target.write_bytes(with_gasp(data, face['file']))
                faces.append(face)
            (d / 'NOTICE.md').write_text(
                '# %s\n\n%s%s\n'
                '| 文件 | 字重 | 抓取地址 |\n|---|---|---|\n%s\n'
                % (spec['family'],
                   spec.get('source', '来源：明日方舟官网（%(home)s）自托管的 woff2 原文件（web.hycdn.cn，Next.js 静态资源）。\n'
                                      '改动：只补了一张 gasp 表（version 1，全字号 0x000F = 含 symmetric smoothing，同 Fontsource 各族），字形 / 度量 / 其它表未动——原文件没有 gasp，Windows 上的 Chrome 对 ≤ 20px 的 Bender Bold 只做横向抗锯齿，曲线出锯齿（scripts/fetch-fonts.py · with_gasp）。\n') % {'home': SITE_HOME},
                   spec.get('coverage', '注意：官网发布的是 ASCII 子集（各 101 字形），非 ASCII 字符由 tokens.css 字体链后段接住。\n'),
                   '\n'.join('| %s | %s | %s |' % (f['file'], f['weight'], f.get('url') or '—') for f in faces)),
                encoding='utf-8')
            meta_path.write_text(json.dumps(faces, ensure_ascii=False, indent=0), encoding='utf-8')
        size = sum((d / f['file']).stat().st_size for f in faces); total += size
        print('   %d faces · %.0f KB · family "%s"' % (len(faces), size / 1024, spec['family']))
        css += ['', '/* ── %s · %s · %s */' % (spec['family'], spec.get('label', '官网同源'), spec['role'])]
        css += [face_css(spec['family'], f, spec['dir']) for f in faces]
        caps = [f for f in faces if f.get('caps_from')]
        if caps:
            css.append('/* 大写高度的数字 / 标点（lnum）：这个字重只有官网的 ASCII 子集、没有 lnum，这些字符取 %s 的完整文件（scripts/fetch-fonts.py · caps_from） */' % ' / '.join(sorted({f['caps_from'] for f in caps})))
            css += [face_css(spec['family'], {'file': f['caps_from'], 'weight': f['weight'], 'style': f['style'], 'range': CAPS_RANGE}, spec['dir']) for f in caps]

    # 2. Fontsource npm 包
    for spec in PKG_FONTS:
        d = FONT_DIR / spec['dir']; d.mkdir(parents=True, exist_ok=True)
        meta_path = d / '_faces.json'
        if args.offline:
            faces = json.loads(meta_path.read_text(encoding='utf-8'))
            print('%-40s offline · %d faces' % (spec['pkg'], len(faces)))
        else:
            url = tarball_url(args.registry, spec['pkg'], spec['version'])
            print('%-40s ← %s' % (spec['pkg'], url)); sys.stdout.flush()
            tgz = fetch(url)
            faces = []
            with tarfile.open(fileobj=io.BytesIO(tgz), mode='r:gz') as tf:
                members = {m.name: m for m in tf.getmembers()}
                def read(name):
                    fh = tf.extractfile(members['package/' + name])
                    assert fh is not None, name
                    return fh.read()
                (d / 'LICENSE').write_bytes(read('LICENSE'))     # 授权全文随族落盘
                # 包内 css → 面清单，按 keep 过滤；静态包（@fontsource/*）的 latin.css 等按子集拆的 css 不写 unicode-range，从包内 unicode.json 按文件名里的子集补上
                unicode_map = json.loads(read('unicode.json').decode('utf-8'))
                seen = set()
                for css_name in spec['css']:
                    for face in parse_faces(read(css_name).decode('utf-8')):
                        if not spec['keep'](face['file']) or face['file'] in seen: continue
                        if not face['range']:
                            sub = re.match(r'^%s-(.+?)-(?:\d+|wght)-(?:normal|italic)\.woff2$' % re.escape(spec['pkg'].split('/')[-1]), face['file'])
                            face['range'] = re.sub(r'\s*,\s*', ', ', unicode_map[sub.group(1)]).upper() if sub and sub.group(1) in unicode_map else ''
                            assert face['range'], 'no unicode-range for ' + face['file']
                        seen.add(face['file'])
                        (d / face['file']).write_bytes(read('files/' + face['file']))
                        faces.append(face)
                for old in d.glob('*.woff2'):     # 清掉本次没选中的旧文件（换字重 / 子集时不留垃圾）
                    if old.name not in seen: old.unlink(); print('   - removed stale', old.name)
            meta_path.write_text(json.dumps(faces, ensure_ascii=False, indent=0), encoding='utf-8')
        size = sum((d / f['file']).stat().st_size for f in faces); total += size
        print('   %d faces · %.0f KB · family "%s"' % (len(faces), size / 1024, spec['family']))
        css += ['', '/* ── %s · %s@%s · OFL · %s */' % (spec['family'], spec['pkg'], spec['version'], spec['role'])]
        css += [face_css(spec['family'], f, spec['dir']) for f in faces]

    CSS_OUT.write_text('\n'.join(css) + '\n', encoding='utf-8')
    print('→ %s (%d faces, %.2f MB of woff2)' % (CSS_OUT.relative_to(ROOT), sum(1 for l in css if l.startswith('@font-face')), total / 1e6))

if __name__ == '__main__':
    main()
